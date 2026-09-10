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
    Default fallback values represent regional averages.
    """
    rf_24h = inputs.get("rainfall_24h_mm")
    if rf_24h is None:
        rf_24h = inputs.get("rainfall", 100.0)

    slope = inputs.get("slope_deg")
    if slope is None:
        slope = inputs.get("slope", 30.0)

    elevation = inputs.get("elevation_m")
    if elevation is None:
        elevation = inputs.get("elevation", 750.0)

    vec = [
        float(rf_24h or 100.0),
        float(inputs.get("rainfall_72h_mm") or 220.0),
        float(slope or 30.0),
        float(elevation or 750.0),
        float(inputs.get("soil_moisture") or 0.45),
        float(inputs.get("ndvi") or 0.50),
        float(inputs.get("pore_water_pressure_kpa") or 15.0),
    ]
    return np.array([vec])
