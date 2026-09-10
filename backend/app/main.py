from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import logger
from app.core.exceptions import APIException, api_exception_handler, generic_exception_handler
from app.api.router import api_router
from app.ml.model import get_or_create_model

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware
cors_origins = [str(origin) for origin in settings.CORS_ORIGINS] if settings.CORS_ORIGINS else ["*"]
if "*" in cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Register Exception Handlers
app.add_exception_handler(APIException, api_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Include Main API Router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", summary="Root Health & Discovery")
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "api_v1": settings.API_V1_STR,
        "docs": "/docs"
    }


@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting up {settings.PROJECT_NAME} (v{settings.VERSION})...")
    # Pre-warm ML Random Forest model
    get_or_create_model()
    logger.info("Machine Learning Random Forest model pre-warmed successfully.")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info(f"Shutting down {settings.PROJECT_NAME}...")
