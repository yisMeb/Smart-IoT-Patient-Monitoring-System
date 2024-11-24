
from .routes.auth import router as auth_router
from fastapi import APIRouter
from .routes.healthcare_professional_routes import router as healthcare_professional_router



api_router = APIRouter()

# Include authentication routes
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(healthcare_professional_router, prefix="/healthcare-professional", tags=["healthcare-professional"])
