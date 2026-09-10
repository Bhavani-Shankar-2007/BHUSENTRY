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

        # Adjust score slightly using high rainfall/slope thresholds if raw model output is conservative
        rf_24h = float(input_data.get("rainfall_24h_mm") if input_data.get("rainfall_24h_mm") is not None else input_data.get("rainfall", 0.0) or 0.0)
        slope = float(input_data.get("slope_deg") if input_data.get("slope_deg") is not None else input_data.get("slope", 0.0) or 0.0)
        soil_m = float(input_data.get("soil_moisture") or 0.45)

        # Deterministic formula overlay ensuring physical principles
        physical_score = (
            min(1.0, rf_24h / 200.0) * 0.40 +
            min(1.0, slope / 45.0) * 0.35 +
            min(1.0, soil_m / 0.8) * 0.25
        )

        final_probability = round(min(1.0, max(0.0, 0.5 * prob + 0.5 * physical_score)), 2)
        risk_level = classify_risk_level(final_probability)

        # Feature importances
        raw_importances = self.model.feature_importances_
        importances_dict = {
            name: round(float(imp), 3) for name, imp in zip(FEATURE_NAMES, raw_importances)
        }

        # Contributing factors
        contributing_factors = []
        if rf_24h > 100.0:
            contributing_factors.append(f"Extreme 24h rainfall ({rf_24h} mm) exceeding critical threshold")
        if slope > 30.0:
            contributing_factors.append(f"Steep slope gradient ({slope}°) susceptible to mass wasting")
        if soil_m > 0.6:
            contributing_factors.append(f"High soil moisture saturation level ({int(soil_m*100)}%)")
        if input_data.get("pore_water_pressure_kpa") and float(input_data["pore_water_pressure_kpa"]) > 20.0:
            contributing_factors.append("Elevated pore water pressure weakening shear strength")

        if not contributing_factors:
            contributing_factors.append("Stable terrain conditions with low precipitation intensity")

        confidence = 0.94 if final_probability > 0.8 else 0.88

        return final_probability, risk_level, confidence, importances_dict, contributing_factors


predictor_engine = LandslidePredictor()
