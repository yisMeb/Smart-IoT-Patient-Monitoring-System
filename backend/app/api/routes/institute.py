from fastapi import APIRouter, Depends, HTTPException
import asyncpg
from app.api.services.institute_services import delete_institution_service
from app.config.database import get_db_conn

router = APIRouter()

@router.delete("/delete/{institution_id}")
async def delete_institution(institution_id: int, db: asyncpg.Connection = Depends(get_db_conn)):
    result = await delete_institution_service(institution_id, db)
    if result is None:
        raise HTTPException(status_code=404, detail="Institution not found")
    return {"detail": "Institution deleted"}
