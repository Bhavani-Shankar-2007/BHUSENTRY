from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class AlertBase(BaseModel):
    location_id: str
    location_name: str
    risk_level: str = Field(..., example="VERY HIGH")
    risk_score: float = Field(..., ge=0.0, le=1.0, example=0.88)
    message: str = Field(..., example="CRITICAL: Severe landslide threat detected due to continuous torrential rain.")
    status: str = Field("ACTIVE", example="ACTIVE")  # ACTIVE, ACKNOWLEDGED, RESOLVED


class AlertAcknowledgeRequest(BaseModel):
    note: Optional[str] = Field(None, example="Field team deployed for evacuation")


class AlertResolveRequest(BaseModel):
    resolution_notes: Optional[str] = Field(None, example="Slope stabilized; warning downgraded.")


class AlertResponse(AlertBase):
    id: str
    prediction_id: Optional[str] = None
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[datetime] = None
    resolved_by: Optional[str] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
