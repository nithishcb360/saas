from fastapi import APIRouter
from app.api.endpoints import auth, users, organizations, billing, analytics

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
api_router.include_router(billing.router, prefix="/billing", tags=["billing"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
