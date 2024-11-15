from fastapi import APIRouter, Depends, HTTPException
import asyncpg
from datetime import datetime

from backend.app.api.models.inst_models import InstitutionCreate, InstitutionUpdate
from backend.app.api.services.institute_services import create_institution_service, delete_institution_service, read_institution_service, update_institution_service
from backend.app.config.database import get_db_conn


router = APIRouter()

@router.post("/institutions/", response_model=InstitutionCreate)
async def create_institution(institution: InstitutionCreate, db: asyncpg.Connection = Depends(get_db_conn)):
    return await create_institution_service(institution, db)

@router.get("/institutions/{institution_id}", response_model=InstitutionCreate)
async def read_institution(institution_id: int, db: asyncpg.Connection = Depends(get_db_conn)):
    institution = await read_institution_service(institution_id, db)
    if institution is None:
        raise HTTPException(status_code=404, detail="Institution not found")
    return institution

@router.put("/institutions/{institution_id}", response_model=InstitutionUpdate)
async def update_institution(institution_id: int, institution: InstitutionUpdate, db: asyncpg.Connection = Depends(get_db_conn)):
    institution_record = await update_institution_service(institution_id, institution, db)
    if institution_record is None:
        raise HTTPException(status_code=404, detail="Institution not found")
    return institution_record

@router.delete("/institutions/{institution_id}")
async def delete_institution(institution_id: int, db: asyncpg.Connection = Depends(get_db_conn)):
    result = await delete_institution_service(institution_id, db)
    if result is None:
        raise HTTPException(status_code=404, detail="Institution not found")
    return {"detail": "Institution deleted"}