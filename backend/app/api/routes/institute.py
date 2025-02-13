from fastapi import APIRouter, Depends, HTTPException
import asyncpg
from app.api.services.institute_services import delete_institution_service, fetch_institution_service, update_institutes
from app.config.database import get_db_conn
from app.api.dependacies import get_current_user
from app.api.models.auth_models import InstituteUpdate

router = APIRouter()

@router.delete("/delete/{institution_id}")
async def delete_institution(institution_id: str, db: asyncpg.Connection = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] != "institution":
        raise HTTPException(status_code=401, detail="Only institution can access this feature")
    result = await delete_institution_service(institution_id, db)
    if result is None:
        raise HTTPException(status_code=404, detail="Institution not found")
    return {"detail": "Institution deleted"}

@router.get("/fetch/{institution_id}")
async def fetch_institution(institution_id: str, db: asyncpg.Connection = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] != "institution":
        raise HTTPException(status_code=401, detail="Only institution can access this feature")
    result = await fetch_institution_service(institution_id, db)
    if result is None:
        raise HTTPException(status_code=404, detail="Institution not found")
    return result

@router.put("/update/{id}")
async def update_institutions(id: str, updates: InstituteUpdate, db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] != "institution":
        raise HTTPException(status_code=401, detail="Only institution users can access this feature.")
    return await update_institutes(db, id, updates)