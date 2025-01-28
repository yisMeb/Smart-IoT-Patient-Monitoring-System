

from fastapi import APIRouter, Depends, HTTPException

from app.api.dependacies import get_current_user
from app.api.services.alert_services import fetch_notifications_by_id, fetch_notifications_by_proffesional
from app.config.database import get_db_conn


router = APIRouter()

@router.get("/notifications/patient/{id}")
async def notifications(id: str, db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "patient":
        return await fetch_notifications_by_id(id, db)
    else:
        raise HTTPException(status_code=401, detail="Only patient can access this feature.")


@router.get("/notifications/doctor/{id}")
async def doctors_notifications(id: str, db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "professional":
        return await fetch_notifications_by_proffesional(id, db)
    else:
        raise HTTPException(status_code=401, detail="Only institution users can access this feature.")
