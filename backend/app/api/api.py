
from .routes.auth import router as auth_router
from fastapi import APIRouter
from .routes.healthcare_professional_routes import router as healthcare_professional_router
from .routes.patient import router as patient_router
from .routes.health_data import router as add_HData
from .routes.device import router as Devices
from .routes.alert import router as Alerts
from .routes.case import router as Case
from .routes.institute import router as institution
from .routes.mfa import router as mfa



api_router = APIRouter()

# Include authentication routes
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(healthcare_professional_router, prefix="/healthcare-professional", tags=["healthcare-professional"])
api_router.include_router(institution, prefix="/institution", tags=["institution"])
api_router.include_router(patient_router, prefix="/patient", tags=["patients"])
api_router.include_router(add_HData, prefix="/health_data", tags=["health_data"])
api_router.include_router(Devices, prefix="/Device", tags=["Device"])
api_router.include_router(Alerts, prefix="/Alerts", tags=["Alerts"])
api_router.include_router(Case, prefix="/Case", tags=["Case"])
api_router.include_router(mfa, prefix="/mfa", tags=["mfa"])

