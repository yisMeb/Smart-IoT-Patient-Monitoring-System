
from .routes.auth import router as auth_router
from fastapi import APIRouter
from .routes.institute import router as institution_router 



api_router = APIRouter()

# Include authentication routes
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])

# Include institution routes
api_router.include_router(institution_router, prefix="/institutions",tags=["institutions"])