from fastapi import APIRouter
from app.api import (
    health,
    profile,
    locations,
    prediction,
    alerts,
    analytics,
    weather,
    satellite,
    elevation,
    ai,
    notifications,
    admin
)

api_router = APIRouter()

# Include all sub-routers
api_router.include_router(health.router)
api_router.include_router(profile.router)
api_router.include_router(locations.router)
api_router.include_router(prediction.router)
api_router.include_router(alerts.router)
api_router.include_router(analytics.router)
api_router.include_router(weather.router)
api_router.include_router(satellite.router)
api_router.include_router(elevation.router)
api_router.include_router(ai.router)
api_router.include_router(notifications.router)
api_router.include_router(admin.router)
