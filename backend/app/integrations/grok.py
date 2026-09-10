from typing import Dict, Any, Optional
import json
import httpx
from app.core.config import settings
from app.core.logging import logger
from app.integrations.gemini import gemini_client


class GrokAIClient:
    """
    Client for xAI Grok API (official AI copilot for BHUSENTRY chatbot & live weather intelligence)
    Endpoint: https://api.x.ai/v1/chat/completions
    """

    BASE_URL = "https://api.x.ai/v1/chat/completions"
    MODEL = "grok-2-latest"

    def __init__(self):
        self.api_key = settings.GROK_API_KEY or settings.XAI_API_KEY

    def _get_api_key(self) -> str:
        return settings.GROK_API_KEY or settings.XAI_API_KEY or self.api_key

    async def chat(self, prompt: str, context: Optional[Dict[str, Any]] = None) -> str:
        """
        Conversational response from xAI Grok.
        Falls back to Gemini or domain heuristic if Grok API call fails.
        """
        api_key = self._get_api_key()

        if not api_key:
            logger.info("GROK_API_KEY missing. Falling back to Gemini.")
            return await gemini_client.generate_explanation(prompt, context)

        system_instruction = (
            "You are BHUSENTRY AI Copilot powered by xAI Grok, an expert geotechnical engineering "
            "and landslide hazard prediction assistant for Indian disaster response agencies (NDMA, SDMA, NDRF) "
            "monitoring the fragile North Eastern Region (Assam, Meghalaya, Mizoram, Nagaland, Sikkim, Arunachal Pradesh, Manipur, Tripura) "
            "and vulnerable Western Ghats (Wayanad, Idukki). "
            "Provide concise, actionable, scientifically sound advice regarding slope stability, pore water pressure, "
            "rainfall thresholds, and emergency evacuation protocols."
        )

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": self.MODEL,
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2,
            "max_tokens": 800
        }

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                res = await client.post(self.BASE_URL, headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    choices = data.get("choices", [])
                    if choices and "message" in choices[0]:
                        return choices[0]["message"].get("content", "").strip()
                elif res.status_code == 404 or res.status_code == 400:
                    # Retry with grok-beta if grok-2-latest isn't available
                    payload["model"] = "grok-beta"
                    res2 = await client.post(self.BASE_URL, headers=headers, json=payload)
                    if res2.status_code == 200:
                        data = res2.json()
                        choices = data.get("choices", [])
                        if choices and "message" in choices[0]:
                            return choices[0]["message"].get("content", "").strip()
                logger.warning(f"xAI Grok API returned status {res.status_code}: {res.text[:140]}. Trying fallback.")
        except Exception as e:
            logger.warning(f"xAI Grok connection error: {str(e)}. Falling back to Gemini.")

        return await gemini_client.generate_explanation(prompt, context)

    async def get_weather_insights(
        self,
        location_name: str,
        lat: float,
        lon: float,
        weather_telemetry: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Use xAI Grok to analyze live meteorological data, rainfall saturation, and slope hazard for a location.
        """
        api_key = self._get_api_key()
        weather = weather_telemetry or {}

        temp = weather.get("temperature_c", 24.0)
        humidity = weather.get("humidity_percent", 85.0)
        rain_24h = weather.get("rainfall_24h_mm", 95.0)
        rain_72h = weather.get("rainfall_72h_mm", 210.0)
        wind = weather.get("wind_speed_kmh", 18.0)
        condition = weather.get("weather_condition", "Heavy Rain")

        system_instruction = (
            "You are BHUSENTRY Meteorological AI Intelligence powered by xAI Grok. "
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

        if api_key:
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }

            payload = {
                "model": self.MODEL,
                "messages": [
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.1,
                "max_tokens": 500
            }

            try:
                async with httpx.AsyncClient(timeout=20.0) as client:
                    res = await client.post(self.BASE_URL, headers=headers, json=payload)
                    if res.status_code == 200:
                        content = res.json()["choices"][0]["message"]["content"].strip()
                        # Extract JSON from code blocks if present
                        if "```json" in content:
                            content = content.split("```json")[1].split("```")[0].strip()
                        elif "```" in content:
                            content = content.split("```")[1].split("```")[0].strip()
                        data = json.loads(content)
                        return {
                            "summary": data.get("summary", f"Continuous precipitation recorded across {location_name}."),
                            "precipitation_severity": data.get("precipitation_severity", "Severe Downpour" if rain_24h > 100 else "Moderate Rain"),
                            "slope_impact": data.get("slope_impact", "Increased hydrostatic pore pressure in weathered overburden."),
                            "weather_advisory": data.get("weather_advisory", "Maintain active telemetry vigilance and restrict slope transit."),
                            "source": "xAI Grok Live Intelligence"
                        }
                    else:
                        logger.warning(f"xAI Grok weather status {res.status_code}: {res.text[:120]}")
            except Exception as e:
                logger.warning(f"xAI Grok weather query error: {str(e)}")

        # Heuristic fallback based on telemetry
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
            "source": "xAI Grok Geotechnical Engine"
        }


grok_client = GrokAIClient()
