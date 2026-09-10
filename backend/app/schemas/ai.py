from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class AIChatRequest(BaseModel):
    prompt: str = Field(..., example="Explain the current high risk warning in Wayanad and recommended officer action.")
    conversation_id: Optional[str] = None
    location_id: Optional[str] = None
    prediction_id: Optional[str] = None


class AIChatResponse(BaseModel):
    conversation_id: str
    message: str
    provider: str = Field("Google Gemini", example="Gemini Flash")
    suggested_actions: List[str] = Field(default_factory=list)


class AIExplainRequest(BaseModel):
    prediction_id: str = Field(..., example="pred-9921")


class AIExplainResponse(BaseModel):
    prediction_id: str
    explanation: str
    key_drivers: List[str]
    mitigation_recommendations: List[str]
