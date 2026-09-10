from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True
    )

    # General Application Settings
    PROJECT_NAME: str = "BHUSENTRY Landslide Early Warning System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # CORS Origins
    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Supabase Configuration
    SUPABASE_URL: str = Field(default="", description="Supabase project URL")
    SUPABASE_ANON_KEY: str = Field(default="", description="Supabase anonymous API key")
    SUPABASE_SERVICE_ROLE_KEY: str = Field(default="", description="Supabase service role key")
    SUPABASE_JWT_SECRET: str = Field(default="", description="Supabase JWT secret key for signature verification")

    # External Integration API Keys
    OPEN_METEO_API_KEY: str = Field(default="", description="Open-Meteo Weather API Key")
    OPEN_TOPOGRAPHY_API_KEY: str = Field(default="", description="OpenTopography DEM API Key")
    
    # AI Assistance Keys (xAI Grok & Google Gemini)
    GROK_API_KEY: str = Field(default="", description="xAI Grok API Key")
    XAI_API_KEY: str = Field(default="", description="xAI API Key")
    GEMINI_API_KEY: str = Field(default="", description="Google Gemini API Key")

    # Indian Emergency Notification Keys (Fast2SMS + Telegram Bot)
    FAST2SMS_API_KEY: str = Field(default="", description="Fast2SMS API Key for Indian +91 mobile alerts")
    TELEGRAM_BOT_TOKEN: str = Field(default="", description="Telegram Bot Token for free emergency alerts")
    TELEGRAM_CHAT_ID: str = Field(default="", description="Telegram Chat ID or Channel ID for alerts")

    # Landslide Risk Threshold Boundaries
    RISK_THRESHOLD_LOW: float = 0.29
    RISK_THRESHOLD_MODERATE: float = 0.59
    RISK_THRESHOLD_HIGH: float = 0.79
    # Anything >= 0.80 is VERY HIGH


settings = Settings()
