from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class LocationBase(BaseModel):
    name: str = Field(..., example="Wayanad High Risk Zone A")
    state: str = Field(..., example="Kerala")
    district: str = Field(..., example="Wayanad")
    latitude: float = Field(..., ge=-90.0, le=90.0, example=11.6854)
    longitude: float = Field(..., ge=-180.0, le=180.0, example=76.1320)
    elevation: Optional[float] = Field(None, example=780.5)
    slope: Optional[float] = Field(None, example=34.2)
    soil_type: Optional[str] = Field(None, example="Laterite Soil")
    vegetation_cover: Optional[float] = Field(None, example=0.65)
    risk_level: Optional[str] = Field("LOW", example="HIGH")
    current_risk_score: Optional[float] = Field(0.0, example=0.74)
    region: Optional[str] = Field("NER", example="NER")


class LocationCreate(LocationBase):
    pass


class LocationUpdate(BaseModel):
    name: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    elevation: Optional[float] = None
    slope: Optional[float] = None
    soil_type: Optional[str] = None
    vegetation_cover: Optional[float] = None
    risk_level: Optional[str] = None
    current_risk_score: Optional[float] = None


class LocationResponse(LocationBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
