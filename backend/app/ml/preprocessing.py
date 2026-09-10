from typing import Dict, Any, List
import numpy as np


FEATURE_NAMES = [
    "rainfall_24h_mm",
    "rainfall_72h_mm",
    "slope_deg",
    "elevation_m",
    "soil_moisture",
    "ndvi",
    "pore_water_pressure_kpa"
]


def extract_feature_vector(inputs: Dict[str, Any]) -> np.ndarray:
    """
    Extracts ordered numerical feature vector for the Machine Learning model.
    Fallback defaults represent a calm / data-absent scenario so the model does NOT
    artificially elevate risk when parameters are missing.  Live data from Open-Meteo
    is expected to populate rainfall fields before this function is called.
    """
    rf_24h = inputs.get("rainfall_24h_mm")
    if rf_24h is None:
        # Use explicit rainfall alias if provided; otherwise assume a calm dry day
        rf_24h = inputs.get("rainfall", 10.0)

    slope = inputs.get("slope_deg")
    if slope is None:
        # Use explicit slope alias if provided; default to gentle incline
        slope = inputs.get("slope", 15.0)

    elevation = inputs.get("elevation_m")
    if elevation is None:
        elevation = inputs.get("elevation", 500.0)

    soil_m = float(inputs.get("soil_moisture") if inputs.get("soil_moisture") is not None else 0.40)
    if soil_m > 1.0:
        soil_m = min(soil_m / 100.0, 1.0)

    vec = [
        float(rf_24h or 0.0),          # 0mm if truly unknown — do not assume rain
        float(inputs.get("rainfall_72h_mm") or (float(rf_24h or 0.0) * 2.0)),  # estimate from 24h if missing
        float(slope or 15.0),           # gentle slope default
        float(elevation or 500.0),
        soil_m,                        # normalized 0.0 - 1.0
        float(inputs.get("ndvi") or 0.55),               # moderate vegetation cover
        float(inputs.get("pore_water_pressure_kpa") or 8.0),  # low baseline pressure
    ]
    return np.array([vec])
