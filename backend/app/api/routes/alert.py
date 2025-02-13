from fastapi import APIRouter, Depends, HTTPException
from app.api.dependacies import get_current_user
from app.api.services.alert_services import All_resolved_alerts, All_unresolved_alerts, all_proff_alert, fetch_notifications_by_id, fetch_notifications_by_proffesional, fetch_resolved_alerts, fetch_unresolved_alerts
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
        raise HTTPException(status_code=401, detail="Only professionals users can access this feature.")

@router.get("/resolved/professional/{id}")
async def resolved_alerts(id: str, db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "professional":
        return await fetch_resolved_alerts(id, db)
    else:
        raise HTTPException(status_code=401, detail="Only professionals users can access this feature.")

@router.get("/resolved/all")
async def resolved_alerts(db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "institution":
        return await All_resolved_alerts(db)
    else:
        raise HTTPException(status_code=401, detail="Only institutions can access this feature.")

@router.get("/unresolved/professional/{id}")
async def unresolved_alerts(id: str, db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "professional":
        return await fetch_unresolved_alerts(id, db, resolved=False)
    else:
        raise HTTPException(status_code=401, detail="Only professionals users can access this feature.")

@router.get("/unresolved/all")
async def unresolved_alerts(db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "institution":
        return await All_unresolved_alerts(db)
    else:
        raise HTTPException(status_code=401, detail="Only institution can access this feature.")
        
@router.get("/all/professional/{id}")
async def all_proff_alerts(id: str, db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "professional":
        return await all_proff_alert(id, db)
    else:
        raise HTTPException(status_code=401, detail="Only professionals users can access this feature.")