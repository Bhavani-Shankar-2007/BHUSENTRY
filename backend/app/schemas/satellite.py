from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class SatelliteObservationResponse(BaseModel):
    location_id: str
    latitude: float
    longitude: float
    satellite_source: str = Field("NASA GIBS (EOSDIS) / ESRI World Imagery", example="NASA GIBS VIIRS TrueColor")
    ndvi: float = Field(..., description="Normalized Difference Vegetation Index", example=0.52)
    ndwi: float = Field(..., description="Normalized Difference Water Index", example=0.31)
    soil_moisture_index: float = Field(..., example=0.68)
    surface_displacement_mm: float = Field(..., example=12.4)
    image_url: Optional[str] = Field(None, example="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export")
    nasa_gibs_url: Optional[str] = Field(None, example="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg")
    nasa_precipitation_url: Optional[str] = Field(None, example="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/IMERG_Precipitation_Rate/default/default/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png")
    captured_at: datetime

