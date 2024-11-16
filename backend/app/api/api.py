
from .routes.auth import router as auth_router
from fastapi import APIRouter


api_router = APIRouter()

# Include authentication routes
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
