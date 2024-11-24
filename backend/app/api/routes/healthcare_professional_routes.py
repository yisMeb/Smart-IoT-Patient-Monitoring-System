from fastapi import APIRouter, Depends
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
    db: asyncpg.Connection = Depends(get_db_conn),
):
    print("API ADD")
    return await add_healthcare_professional(professional, db)


# GET route to fetch all healthcare professionals
@router.get("/")
async def fetch_professionals(
    current_user: dict = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db_conn),
):
    # Allow all authenticated users to view healthcare professionals
    return await get_healthcare_professionals(db)
