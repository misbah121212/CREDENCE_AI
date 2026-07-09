from fastapi import APIRouter

from app.api.v1.endpoints import auth, customers, loans, ai

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(customers.router, prefix="/customers", tags=["customers"])
api_router.include_router(loans.router, prefix="/loans", tags=["loans"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai_prediction"])
