from typing import Dict, Any, List
import uuid
from app.integrations.grok import grok_client
from app.integrations.gemini import gemini_client
from app.core.config import settings


class AIService:

    async def chat(self, prompt: str, conversation_id: str = None) -> Dict[str, Any]:
        conv_id = conversation_id or f"conv-{uuid.uuid4().hex[:8]}"
        response_text = await grok_client.chat(prompt)
        provider = "xAI Grok" if (settings.GROK_API_KEY or settings.XAI_API_KEY) else "Google Gemini"

        return {
            "conversation_id": conv_id,
            "message": response_text,
            "provider": provider,
            "suggested_actions": [
                "Deploy local NDRF/SDRF rapid alert teams",
                "Issue public SMS warning broadcast to at-risk panchayats",
                "Monitor live pore water pressure sensors continuously"
            ]
        }

    async def explain_prediction(self, prediction_id: str) -> Dict[str, Any]:
        explanation_prompt = (
            f"Provide an expert geotechnical breakdown for prediction ID '{prediction_id}'. "
            "Explain how precipitation, slope steepness, and soil saturation drive this risk score."
        )
        explanation_text = await grok_client.chat(explanation_prompt)

        return {
            "prediction_id": prediction_id,
            "explanation": explanation_text,
            "key_drivers": [
                "Continuous 24h rainfall > 120 mm",
                "Steep slope angle (> 34°)",
                "Elevated pore water pressure weakening shear strength"
            ],
            "mitigation_recommendations": [
                "Clear slope drainage channels immediately",
                "Restrict heavy vehicular movement along hill road sector B",
                "Initiate pre-emptive evacuation for vulnerable households"
            ]
        }


ai_service = AIService()
