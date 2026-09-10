from fastapi import APIRouter
from app.schemas.ai import AIChatRequest, AIChatResponse, AIExplainResponse
from app.services.ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["AI Copilot & Explanation Engine"])


@router.post("/chat", response_model=AIChatResponse, summary="Chat with BHUSENTRY AI Copilot")
async def ai_chat(payload: AIChatRequest):
    """
    Conversational AI assistant powered by Google Gemini for disaster response officers.
    (Note: Official risk scores are ALWAYS computed by the ML Random Forest model, not LLMs).
    """
    res = await ai_service.chat(payload.prompt, payload.conversation_id)
    return AIChatResponse(**res)


@router.post("/explain/{prediction_id}", response_model=AIExplainResponse, summary="Explain Risk Prediction")
async def explain_prediction(prediction_id: str):
    """
    Generates natural language explanation and key factor breakdown for a given prediction score.
    """
    res = await ai_service.explain_prediction(prediction_id)
    return AIExplainResponse(**res)
