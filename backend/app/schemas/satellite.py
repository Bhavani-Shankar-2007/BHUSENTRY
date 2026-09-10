from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class SatelliteObservationResponse(BaseModel):
    location_id: str
    latitude: float
    longitude: float
    satellite_source: str = Field("Sentinel-2 / Sentinel-1 SAR", example="Sentinel-2 L2A")
    ndvi: float = Field(..., description="Normalized Difference Vegetation Index", example=0.52)
    ndwi: float = Field(..., description="Normalized Difference Water Index", example=0.31)
    soil_moisture_index: float = Field(..., example=0.68)
    surface_displacement_mm: float = Field(..., example=12.4)
    image_url: Optional[str] = Field(None, example="https://sentinel-hub.com/sample.png")
    captured_at: datetime
