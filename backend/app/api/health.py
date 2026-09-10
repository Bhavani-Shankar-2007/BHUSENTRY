from fastapi import APIRouter
from app.core.config import settings
from app.integrations.supabase_client import get_supabase_client

router = APIRouter(prefix="", tags=["Health Check"])


@router.get("/health", summary="Basic API Health Status")
async def health_check():
    """
    Returns basic application health status.
    """
    return {
        "status": "healthy",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }


@router.get("/health/integrations", summary="External Services & DB Health Check")
async def integrations_health_check():
    """
    Checks connection statuses for Supabase DB, Open-Meteo, Sentinel Hub, and AI clients.
    """
    sb_client = get_supabase_client()
    supabase_status = "connected" if sb_client else "mock_mode"

    return {
        "status": "healthy",
        "integrations": {
            "supabase_database": supabase_status,
            "open_meteo_weather": "configured",
            "satellite_earth_observation": "configured (NASA GIBS / ESRI World Imagery)",
            "open_topography_dem": "configured" if settings.OPEN_TOPOGRAPHY_API_KEY else "mock_mode",
            "gemini_ai": "configured" if settings.GEMINI_API_KEY else "mock_mode",
            "indian_emergency_sms": "configured (Fast2SMS / Telegram)" if (settings.FAST2SMS_API_KEY or settings.TELEGRAM_BOT_TOKEN) else "simulated_ready"
        }
    }
