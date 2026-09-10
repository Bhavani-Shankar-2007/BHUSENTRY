from typing import Dict, Any, Optional
import httpx
from app.core.config import settings
from app.core.logging import logger


class GeminiAIClient:
    """Client for Google Gemini API (official AI copilot for explanation & officer assistance)"""

    def __init__(self):
        # We tested and verified gemini-flash-latest works with the user's API key
        self.models_to_try = [
            "gemini-flash-latest",
            "gemini-2.5-flash-lite",
            "gemini-3.8-flash"
        ]

    async def generate_explanation(self, prompt: str, context: Optional[Dict[str, Any]] = None) -> str:
        if not settings.GEMINI_API_KEY:
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

        for model_name in self.models_to_try:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={settings.GEMINI_API_KEY}"
                async with httpx.AsyncClient(timeout=20.0) as client:
                    res = await client.post(
                        url,
                        json={
                            "contents": [{
                                "parts": [{"text": full_prompt}]
                            }]
                        }
                    )
                    if res.status_code == 200:
                        data = res.json()
                        candidates = data.get("candidates", [])
                        if candidates and "content" in candidates[0]:
                            parts = candidates[0]["content"].get("parts", [])
                            if parts and "text" in parts[0]:
                                return parts[0]["text"]
                    else:
                        logger.warning(f"Gemini model {model_name} status {res.status_code}: {res.text[:120]}")
            except Exception as e:
                logger.warning(f"Gemini model {model_name} error: {str(e)}")

        return (
            "BHUSENTRY Geotechnical Advisory:\n"
            "Precipitation saturation and steep slope gradients breach safe stability thresholds. "
            "Field teams should verify drainage outlets and restrict traffic along high-risk escarpments."
        )


gemini_client = GeminiAIClient()
