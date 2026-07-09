import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""
    
    # ── App ──
    APP_NAME: str = "Credence AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # ── Database ──
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./credence_ai.db"  # SQLite fallback for dev; use PostgreSQL in production
    )
    
    # ── JWT Authentication ──
    SECRET_KEY: str = os.getenv("SECRET_KEY", "credence-ai-super-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # ── CORS ──
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "https://misbah121212.github.io"]

    class Config:
        env_file = ".env"

settings = Settings()
