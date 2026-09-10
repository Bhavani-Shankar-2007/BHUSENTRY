from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    location_id: Optional[str] = Field(None, example="loc-wayanad-01")
    location: Optional[str] = Field(None, example="Meppadi Hill Slope Zone")
    latitude: Optional[float] = Field(11.6854, ge=-90.0, le=90.0, example=11.6854)
    longitude: Optional[float] = Field(76.1320, ge=-180.0, le=180.0, example=76.1320)
    rainfall_24h_mm: Optional[float] = Field(None, example=150.0)
    rainfall: Optional[float] = Field(None, description="Frontend alias for rainfall_24h_mm")
    rainfall_72h_mm: Optional[float] = Field(280.0, example=320.0)
    slope_deg: Optional[float] = Field(None, example=38.5)
    slope: Optional[float] = Field(None, description="Frontend alias for slope_deg")
    elevation_m: Optional[float] = Field(None, example=920.0)
    elevation: Optional[float] = Field(None, description="Frontend alias for elevation_m")
    soil_type: Optional[str] = Field(None, example="Loamy Skeletal with Phyllite")
    land_cover: Optional[str] = Field(None, example="Sparse Forest / Urban Slope")
    soil_moisture: Optional[float] = Field(0.45, example=0.62)
    ndvi: Optional[float] = Field(0.55, example=0.48)
    pore_water_pressure_kpa: Optional[float] = Field(15.2, example=22.8)


class PredictionResponse(BaseModel):
    id: str
    location_id: Optional[str] = None
    latitude: float
    longitude: float
    probability: float = Field(..., ge=0.0, le=1.0, description="Risk probability score (0.00 to 1.00)")
    risk_level: str = Field(..., description="LOW, MODERATE, HIGH, VERY HIGH")
    confidence: float = Field(0.92, description="Model confidence score")
    feature_importances: Dict[str, float] = Field(default_factory=dict)
    contributing_factors: List[str] = Field(default_factory=list)
    alert_triggered: bool = False
    alert_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
