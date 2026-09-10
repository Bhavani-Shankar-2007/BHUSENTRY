from typing import Dict, List, Any
from pydantic import BaseModel


class AnalyticsSummaryResponse(BaseModel):
    total_monitored_zones: int
    active_alerts_count: int
    critical_zones_count: int
    moderate_zones_count: int
    predictions_24h_count: int
    overall_system_status: str


class RiskDistributionResponse(BaseModel):
    LOW: int
    MODERATE: int
    HIGH: int
    VERY_HIGH: int


class StateRiskItem(BaseModel):
    state: str
    total_locations: int
    high_risk_count: int
    avg_risk_score: float
    low: int = 0
    moderate: int = 0
    high: int = 0
    veryHigh: int = 0


class StateRiskResponse(BaseModel):
    states: List[StateRiskItem]


class TopRiskLocationItem(BaseModel):
    id: str
    name: str
    state: str
    district: str
    risk_score: float
    risk_level: str
    latitude: float
    longitude: float


class HistoricalLandslideItem(BaseModel):
    id: str
    location_name: str
    state: str
    event_date: str
    fatalities: int
    damage_severity: str
    latitude: float
    longitude: float
