import os
from typing import Tuple, Dict, Any, List
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from app.ml.preprocessing import FEATURE_NAMES, extract_feature_vector
from app.core.logging import logger

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.joblib")


def get_or_create_model():
    """
    Loads trained RandomForest model from joblib file.
    If file doesn't exist, trains a baseline RandomForestClassifier on synthetic geotechnical data
    and persists model.joblib.
    """
    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            return model
        except Exception as e:
            logger.error(f"Failed to load model.joblib: {str(e)}. Re-training synthetic model.")

    logger.info("Generating and training synthetic baseline Random Forest Landslide Risk Model...")
    np.random.seed(42)
    n_samples = 1000

    # Synthetic features: [rainfall_24h, rainfall_72h, slope, elevation, soil_moisture, ndvi, pore_pressure]
    rf_24h = np.random.uniform(0, 300, n_samples)
    rf_72h = rf_24h * np.random.uniform(1.5, 3.0, n_samples)
    slope = np.random.uniform(5, 60, n_samples)
    elevation = np.random.uniform(100, 2000, n_samples)
    soil_m = np.random.uniform(0.1, 0.9, n_samples)
    ndvi = np.random.uniform(0.1, 0.9, n_samples)
    pore_press = np.random.uniform(0, 50, n_samples)

    X = np.column_stack([rf_24h, rf_72h, slope, elevation, soil_m, ndvi, pore_press])

    # True risk logic formula to label synthetic ground truth:
    risk_score = (
        (rf_24h / 250.0) * 0.35 +
        (slope / 50.0) * 0.25 +
        (soil_m / 0.8) * 0.20 +
        (pore_press / 40.0) * 0.20 -
        (ndvi * 0.10)
    )
    y = (risk_score > 0.65).astype(int)

    rf_clf = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=8)
    rf_clf.fit(X, y)

    try:
        joblib.dump(rf_clf, MODEL_PATH)
        logger.info(f"Model saved successfully to {MODEL_PATH}")
    except Exception as e:
        logger.error(f"Could not persist model.joblib: {str(e)}")

    return rf_clf
