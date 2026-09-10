def classify_risk_level(score: float) -> str:
    """
    Classifies risk score (0.00 - 1.00) into standardized risk levels:
    0.00 – 0.29 → LOW
    0.30 – 0.59 → MODERATE
    0.60 – 0.79 → HIGH
    0.80 – 1.00 → VERY HIGH
    """
    if score is None:
        return "LOW"
    score = float(score)
    if score >= 0.80:
        return "VERY HIGH"
    elif score >= 0.60:
        return "HIGH"
    elif score >= 0.30:
        return "MODERATE"
    else:
        return "LOW"


def is_critical_alert(risk_level: str) -> bool:
    """Returns True if the risk level qualifies for automatic alert generation (VERY HIGH)"""
    return risk_level.upper() in ["VERY HIGH", "CRITICAL"]
