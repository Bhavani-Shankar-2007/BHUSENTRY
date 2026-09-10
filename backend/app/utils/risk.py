def classify_risk_level(score: float) -> str:
    """
    Classifies risk score (0.00 - 1.00) into standardized NDMA risk levels.
    Thresholds aligned with GSI Landslide Hazard Evaluation Factor (LHEF) scoring
    and IMD rainfall classification for landslide triggering:

    0.00 – 0.24 → LOW       (rainfall < 64.5mm/day, stable slope)
    0.25 – 0.54 → MODERATE  (rainfall 64.5–115.5mm, moderate slope)
    0.55 – 0.79 → HIGH      (rainfall 115.5–204.5mm OR steep slope + wet soil)
    0.80 – 1.00 → VERY HIGH (rainfall > 204.5mm AND steep slope; IMD Extremely Heavy)
    """
    if score is None:
        return "LOW"
    score = float(score)
    if score >= 0.80:
        return "VERY HIGH"
    elif score >= 0.55:
        return "HIGH"
    elif score >= 0.25:
        return "MODERATE"
    else:
        return "LOW"


def is_critical_alert(risk_level: str) -> bool:
    """Returns True if the risk level qualifies for automatic alert generation (VERY HIGH)"""
    return risk_level.upper() in ["VERY HIGH", "CRITICAL"]
