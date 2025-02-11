import asyncpg
from fastapi import APIRouter, Depends
from app.api.models.health_data_model import AddHealthData
from app.api.services.health_data_services import add_health_data, get_health_data
from app.config.database import get_db_conn
from app.api.dependacies import get_current_user

router = APIRouter()

@router.post("/add")
async def add_HData(data: AddHealthData, db: asyncpg.Connection = Depends(get_db_conn)):
    return await add_health_data(data, db)

@router.get("/get/{device_id}/{patient_id}")
async def get_HData(device_id: str, patient_id: str, db: asyncpg.Connection = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "professional" or current_user["user_role"] == "institution" or current_user["user_role"] == "patient":
        val = await get_health_data(device_id, patient_id, db)
        return val
    else:
        return {"detail": "You are not authorized to access this feature"}