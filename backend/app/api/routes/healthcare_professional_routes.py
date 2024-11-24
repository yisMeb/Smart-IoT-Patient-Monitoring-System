from fastapi import APIRouter, Depends, HTTPException
from app.api.services.healthcare_professional_services import (
    add_healthcare_professional,
    get_healthcare_professionals,
)
from app.api.models.healthcare_professional_models import CreateHealthcareProfessional
from app.api.dependacies import admin_required, get_current_user
from app.config.database import get_db_conn
import asyncpg

router = APIRouter()

# POST route to add a healthcare professional (Admin only)
@router.post("/add")
async def add_professional(
    professional: CreateHealthcareProfessional,
    current_user: dict = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db_conn),
):
    if current_user["user_role"] == "admin":
        return await add_healthcare_professional(professional, db)
    else :
        raise HTTPException(status_code=401, detail="Only admin can access this feature")


# GET route to fetch all healthcare professionals
@router.get("/")
async def fetch_professionals(
    current_user: dict = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db_conn),
):
    if current_user["user_role"] == "admin":
        return await get_healthcare_professionals(db)
    else :
        raise HTTPException(status_code=401, detail="Only admin can access this feature")
