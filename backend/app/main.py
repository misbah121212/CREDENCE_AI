from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.api import api_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    openapi_url=f"/api/v1/openapi.json"
)

# Set CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include v1 Router
app.include_router(api_router, prefix="/api/v1")

@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok", "app": settings.APP_NAME, "version": settings.APP_VERSION}
