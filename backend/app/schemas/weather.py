from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class WeatherCurrent(BaseModel):
    temperature_c: float = Field(..., example=24.5)
    humidity_percent: float = Field(..., example=88.0)
    rainfall_24h_mm: float = Field(..., example=120.4)
    rainfall_72h_mm: float = Field(..., example=275.1)
    wind_speed_kmh: float = Field(..., example=18.5)
    weather_condition: str = Field("Heavy Rain", example="Torrential Downpour")
    timestamp: datetime


class WeatherForecastItem(BaseModel):
    time: datetime
    temperature_c: float
    rainfall_mm: float
    probability_of_precipitation: float


class GrokWeatherAnalysis(BaseModel):
    """xAI Grok meteorological and slope hazard analysis for a monitoring station."""
    summary: str = Field("", description="Overall weather assessment")
    precipitation_severity: str = Field("Moderate Rain", description="Categorical severity of current precipitation")
    slope_impact: str = Field("", description="Effect of rainfall on pore pressure and shear strength")
    weather_advisory: str = Field("", description="Actionable directive for disaster management teams")
    source: str = Field("xAI Grok Live Intelligence", description="AI provider source")


class WeatherResponse(BaseModel):
    location_id: str
    latitude: float
    longitude: float
    current: WeatherCurrent
    forecast: List[WeatherForecastItem] = Field(default_factory=list)
    grok_analysis: Optional[GrokWeatherAnalysis] = None
