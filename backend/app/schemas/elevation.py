from typing import Optional
from pydantic import BaseModel, Field


class TerrainDataResponse(BaseModel):
    location_id: str
    latitude: float
    longitude: float
    elevation_meters: float = Field(..., example=840.0)
    slope_degrees: float = Field(..., example=34.5)
    aspect_degrees: float = Field(..., example=180.0)
    curvature: float = Field(..., example=0.012)
    soil_type: str = Field("Lateritic Clay", example="Red Sandy Loam")
    geological_unit: str = Field("Precambrian Gneiss", example="Granitic Terrain")
