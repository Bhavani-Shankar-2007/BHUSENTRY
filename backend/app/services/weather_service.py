from typing import Dict, Any, List
from datetime import datetime, timezone, timedelta
from app.integrations.open_meteo import open_meteo_client
from app.integrations.gemini import gemini_client
from app.services.location_service import location_service
from app.core.logging import logger


class WeatherService:

    async def get_weather(self, location_id: str) -> Dict[str, Any]:
        loc = await location_service.get_location_by_id(location_id)
        lat = loc["latitude"] if loc else 11.6854
        lon = loc["longitude"] if loc else 76.1320
        location_name = loc["name"] if loc else "NER Monitoring Station"

        weather_data = await open_meteo_client.get_current_and_forecast(lat, lon)

        # Generate sample 24-hour forecast steps
        now = datetime.now(timezone.utc)
        forecast_items = []
        for i in range(1, 8):
            f_time = now + timedelta(hours=i * 3)
            forecast_items.append({
                "time": f_time,
                "temperature_c": round(weather_data["temperature_c"] + (i % 3) * 0.5 - 1.0, 1),
                "rainfall_mm": round(max(0.0, weather_data["rainfall_24h_mm"] / 8 + (i % 4) * 3.2), 1),
                "probability_of_precipitation": round(min(1.0, 0.70 + (i % 3) * 0.1), 2)
            })

        # AI meteorological intelligence
        grok_analysis = None
        try:
            grok_analysis = await gemini_client.get_weather_insights(
                location_name=location_name,
                lat=lat,
                lon=lon,
                weather_telemetry=weather_data
            )
        except Exception as e:
            logger.warning(f"AI weather insights failed for {location_id}: {e}")

        return {
            "location_id": location_id,
            "latitude": lat,
            "longitude": lon,
            "current": weather_data,
            "forecast": forecast_items,
            "grok_analysis": grok_analysis
        }


weather_service = WeatherService()

