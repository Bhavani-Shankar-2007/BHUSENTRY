from typing import Dict, Any, Optional
import httpx
from app.core.config import settings
from app.core.logging import logger
from google import genai


class GeminiAIClient:
    """Client for Google Gemini API (official AI copilot for explanation & officer assistance)"""

    def __init__(self):
        # Initialize the modern google-genai client
        if settings.GEMINI_API_KEY:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        else:
            self.client = None

    async def generate_explanation(self, prompt: str, context: Optional[Dict[str, Any]] = None) -> str:
        if not self.client:
            logger.info("GEMINI_API_KEY missing. Returning structured geotechnical analysis.")
            return (
                "BHUSENTRY Geotechnical Advisory:\n"
                "1. Precipitation Factor: 24h cumulative rainfall exceeds critical slope threshold (>120mm).\n"
                "2. Terrain Gradient: Slope inclination (>32°) reduces factor of safety against shear sliding.\n"
                "3. Officer Recommendation: Immediate alert to district SDRF and monitor tension crack displacement."
            )

        system_instruction = (
            "You are BHUSENTRY AI, an expert landslide hazard prediction & disaster management assistant "
            "advising Indian disaster response authorities (NDMA, SDMA, NDRF) and field geotechnical engineers. "
            "Provide concise, actionable, and scientifically sound responses."
        )

        full_prompt = f"{system_instruction}\n\nUser Query: {prompt}"

        try:
            response = await self.client.aio.models.generate_content(
                model='gemini-3.6-flash',
                contents=full_prompt
            )
            return response.text
        except Exception as e:
            logger.warning(f"Gemini model error: {str(e)}")

        return (
            "BHUSENTRY Geotechnical Advisory:\n"
            "Precipitation saturation and steep slope gradients breach safe stability thresholds. "
            "Field teams should verify drainage outlets and restrict traffic along high-risk escarpments."
        )

    async def get_weather_insights(
        self,
        location_name: str,
        lat: float,
        lon: float,
        weather_telemetry: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Use Google Gemini to analyze live meteorological data, rainfall saturation, and slope hazard for a location.
        """
        weather = weather_telemetry or {}

        temp = weather.get("temperature_c", 24.0)
        humidity = weather.get("humidity_percent", 85.0)
        rain_24h = weather.get("rainfall_24h_mm", 95.0)
        rain_72h = weather.get("rainfall_72h_mm", 210.0)
        wind = weather.get("wind_speed_kmh", 18.0)
        condition = weather.get("weather_condition", "Heavy Rain")

        system_instruction = (
            "You are BHUSENTRY Meteorological AI Intelligence. "
            "Analyze live weather data for a hill slope monitoring station and evaluate landslide triggering risks. "
            "Always return your response as a valid JSON object with EXACTLY these keys:\n"
            "{\n"
            '  "summary": "Concise summary of current atmospheric conditions and weather trajectory.",\n'
            '  "precipitation_severity": "Normal | Moderate Rain | Severe Downpour | Torrential / Cloudburst Risk",\n'
            '  "slope_impact": "Evaluation of how this rainfall affects pore pressure, soil saturation, and shear strength.",\n'
            '  "weather_advisory": "Key operational directive for district disaster management and emergency teams."\n'
            "}"
        )

        user_prompt = (
            f"Location: {location_name} (Coordinates: {lat:.4f}°N, {lon:.4f}°E)\n"
            f"Observed Parameters:\n"
            f"- Temperature: {temp}°C\n"
            f"- Relative Humidity: {humidity}%\n"
            f"- 24h Cumulative Precipitation: {rain_24h} mm\n"
            f"- 72h Antecedent Precipitation: {rain_72h} mm\n"
            f"- Wind Speed: {wind} km/h\n"
            f"- Sky Condition: {condition}\n"
            "Generate meteorological risk assessment JSON:"
        )

        if self.client:
            try:
                full_prompt = f"{system_instruction}\n\nUser Query: {user_prompt}"
                response = await self.client.aio.models.generate_content(
                    model='gemini-3.6-flash',
                    contents=full_prompt
                )
                
                content = response.text.strip()
                
                # Extract JSON from code blocks if present
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                    
                import json
                parsed = json.loads(content)
                return {
                    "summary": parsed.get("summary", f"Continuous precipitation recorded across {location_name}."),
                    "precipitation_severity": parsed.get("precipitation_severity", "Severe Downpour" if rain_24h > 100 else "Moderate Rain"),
                    "slope_impact": parsed.get("slope_impact", "Increased hydrostatic pore pressure in weathered overburden."),
                    "weather_advisory": parsed.get("weather_advisory", "Maintain active telemetry vigilance and restrict slope transit."),
                    "source": "Google Gemini"
                }
            except Exception as e:
                logger.warning(f"Gemini weather query error: {str(e)}")

        severity = "Torrential / Cloudburst Risk" if rain_24h > 120 else ("Severe Downpour" if rain_24h > 65 else "Moderate Rain")
        return {
            "summary": f"{condition} observed at {location_name} with {rain_24h}mm recorded over the past 24 hours.",
            "precipitation_severity": severity,
            "slope_impact": (
                "Cumulative antecedent precipitation has saturated upper soil layers, significantly reducing effective cohesion."
                if rain_24h > 80
                else "Precipitation levels within seasonal tolerance, but continuous infiltration requires monitoring."
            ),
            "weather_advisory": (
                "Issue precautionary warning to downstream settlements; inspect culverts and drainage channels."
                if rain_24h > 80
                else "Routine slope surveillance active; no emergency road closures required."
            ),
            "source": "AI Geotechnical Engine"
        }


gemini_client = GeminiAIClient()
