import asyncpg
from fastapi import APIRouter, Depends
from app.api.models.health_data_model import AddHealthData
from app.api.services.health_data_services import add_health_data
from app.config.database import get_db_conn

router = APIRouter()

@router.post("/add")
async def add_HData(data: AddHealthData, db: asyncpg.Connection = Depends(get_db_conn)):
    return await add_health_data(data, db)
    