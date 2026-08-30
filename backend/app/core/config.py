from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # JWT Config
    JWT_SECRET: str = "super-secure-default-change-me-in-production-123456"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Database URLs
    DATABASE_URL: str = "sqlite:///./memshield.db"
    MONGODB_URI: Optional[str] = None

    # CORS & Production
    FRONTEND_URL: Optional[str] = None
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]

    # AI Gateway
    AI_PROVIDER: str = "openai"
    AI_API_KEY: Optional[str] = None
    AI_MODEL: str = "gpt-4o-mini"
    AI_ENDPOINT: str = "https://api.openai.com/v1"

    # Speech Provider
    SPEECH_PROVIDER: str = "mock"
    WHISPER_MODEL_PATH: str = "base"

    model_config = {
        "env_file": ".env",
        "case_sensitive": True
    }

settings = Settings()
