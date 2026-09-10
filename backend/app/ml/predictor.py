from typing import Dict, Any, Tuple, List
import numpy as np
from app.ml.model import get_or_create_model
from app.ml.preprocessing import extract_feature_vector, FEATURE_NAMES
from app.utils.risk import classify_risk_level


class LandslidePredictor:
    """Predictor engine executing ML inference & risk level classification"""

    def __init__(self):
        self.model = get_or_create_model()

    def predict(self, input_data: Dict[str, Any]) -> Tuple[float, str, float, Dict[str, float], List[str]]:
        """
        Executes prediction on input features.
        Returns:
            - probability (float 0.00 - 1.00)
            - risk_level (str: LOW, MODERATE, HIGH, VERY HIGH)
            - confidence (float)
            - feature_importances (dict)
            - contributing_factors (list of string descriptions)
        """
        X = extract_feature_vector(input_data)
        
        # Get probability of landslide class (1)
        probabilities = self.model.predict_proba(X)[0]
        # Class 1 probability
        prob = float(probabilities[1]) if len(probabilities) > 1 else float(probabilities[0])

        # Real confidence: measure inter-tree agreement (std dev of individual tree votes)
        # Low std dev = trees strongly agree = high confidence
        tree_probs = np.array([
            tree.predict_proba(X)[0][1] if len(tree.predict_proba(X)[0]) > 1 else tree.predict_proba(X)[0][0]
            for tree in self.model.estimators_
        ])
        tree_std = float(np.std(tree_probs))
        # Convert: std=0 → confidence=1.0, std=0.5 → confidence=0.0 (clamp to [0.60, 0.99])
        real_confidence = round(float(np.clip(1.0 - (tree_std * 2.0), 0.60, 0.99)), 2)

        rf_24h = float(input_data.get("rainfall_24h_mm") if input_data.get("rainfall_24h_mm") is not None else input_data.get("rainfall", 0.0) or 0.0)
        slope = float(input_data.get("slope_deg") if input_data.get("slope_deg") is not None else input_data.get("slope", 0.0) or 0.0)
        soil_m = float(input_data.get("soil_moisture") if input_data.get("soil_moisture") is not None else 0.45)
        if soil_m > 1.0:
            soil_m = min(soil_m / 100.0, 1.0)
        rf_72h = float(input_data.get("rainfall_72h_mm") or (rf_24h * 2.5))
        pore_kpa = float(input_data.get("pore_water_pressure_kpa") or 15.0)
        ndvi_val = float(input_data.get("ndvi") or 0.50)

        # Physics-based formula using IMD rainfall classification thresholds:
        # IMD: >115.5mm/day = Very Heavy; >204.5mm/day = Extremely Heavy
        # Slope: critical mass-wasting angle in Indian Himalayas/Western Ghats ≈ 25-45°
        physical_score = (
            min(1.0, rf_24h / 204.5) * 0.30 +          # IMD "extremely heavy" threshold as normaliser
            min(1.0, rf_72h / 450.0) * 0.15 +           # 72h antecedent accumulation
            min(1.0, slope / 55.0) * 0.25 +             # 55° is near-vertical for Indian geology
            min(1.0, soil_m / 0.85) * 0.15 +            # non-linear near saturation
            min(1.0, pore_kpa / 40.0) * 0.20 -          # Mohr-Coulomb shear strength reduction
            (ndvi_val * 0.15)                            # root cohesion stabiliser
        )
        physical_score = max(0.0, physical_score)  # NDVI dampening can't push below 0

        # Adaptive blend: ML weight increases with ML confidence.
        # When ML returns near-zero (uncertain / conservative), physics carries more weight
        # to ensure geotechnically dangerous terrain still registers a meaningful score.
        if prob >= 0.50:
            ml_weight, phys_weight = 0.65, 0.35  # ML confident: trust it more
        elif prob >= 0.20:
            ml_weight, phys_weight = 0.55, 0.45  # balanced
        else:
            ml_weight, phys_weight = 0.40, 0.60  # ML near-zero: physics leads

        final_probability = round(min(1.0, max(0.0, ml_weight * prob + phys_weight * physical_score)), 2)
        risk_level = classify_risk_level(final_probability)

        # Feature importances
        raw_importances = self.model.feature_importances_
        importances_dict = {
            name: round(float(imp), 3) for name, imp in zip(FEATURE_NAMES, raw_importances)
        }

        # Contributing factors — use IMD-standard thresholds with contextual descriptions
        contributing_factors = []
        if rf_24h >= 204.5:
            contributing_factors.append(f"Extremely heavy 24h rainfall ({rf_24h:.1f} mm) — IMD Extremely Heavy classification; primary landslide trigger")
        elif rf_24h >= 115.5:
            contributing_factors.append(f"Very heavy 24h rainfall ({rf_24h:.1f} mm) — IMD Very Heavy classification; critical saturation threshold exceeded")
        elif rf_24h >= 64.5:
            contributing_factors.append(f"Heavy 24h rainfall ({rf_24h:.1f} mm) — combined with steep terrain, significant risk contribution")
        if rf_72h >= 300.0:
            contributing_factors.append(f"High 72h antecedent rainfall ({rf_72h:.1f} mm) — soil pre-saturated, reducing infiltration capacity")
        if slope >= 35.0:
            contributing_factors.append(f"Steep slope gradient ({slope:.1f}°) — exceeds critical mass-wasting angle for this soil type")
        elif slope >= 25.0:
            contributing_factors.append(f"Moderate-steep slope ({slope:.1f}°) — susceptible when combined with saturation")
        if soil_m >= 0.75:
            contributing_factors.append(f"Near-saturated soil ({int(soil_m * 100)}% moisture) — minimal remaining pore space; runoff conversion rapid")
        elif soil_m >= 0.60:
            contributing_factors.append(f"High soil moisture ({int(soil_m * 100)}%) — significantly reduced shear strength")
        if pore_kpa >= 25.0:
            contributing_factors.append(f"Critical pore water pressure ({pore_kpa:.1f} kPa) — effective normal stress reduced; slope failure imminent")
        elif pore_kpa >= 15.0:
            contributing_factors.append(f"Elevated pore water pressure ({pore_kpa:.1f} kPa) — weakening slope shear resistance")
        if ndvi_val < 0.30:
            contributing_factors.append(f"Sparse vegetation cover (NDVI {ndvi_val:.2f}) — low root cohesion, minimal slope stabilisation")

        if not contributing_factors:
            contributing_factors.append("Stable terrain conditions — all parameters within safe thresholds")

        confidence = real_confidence

        return final_probability, risk_level, confidence, importances_dict, contributing_factors


predictor_engine = LandslidePredictor()
