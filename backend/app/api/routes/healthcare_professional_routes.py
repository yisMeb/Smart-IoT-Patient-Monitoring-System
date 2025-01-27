from fastapi import APIRouter, Depends, HTTPException
from app.api.services.healthcare_professional_services import (
    add_healthcare_professional,
    assigned_patients,
    delete_healthcare_professionals,
    get_healthcare_professionals,
    update_healthcare_professional,
)
from app.api.models.healthcare_professional_models import CreateHealthcareProfessional, UpdateHealthcareProfessional
from app.api.dependacies import  get_current_user
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
    if current_user["user_role"] == "institution":
        return await add_healthcare_professional(professional, db)
    else :
        raise HTTPException(status_code=401, detail="Only admin can access this feature")


# GET route to fetch all healthcare professionals
@router.get("/fetch")
async def fetch_professionals(
    current_user: dict = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db_conn),
):
    if current_user["user_role"] == "institution":
        return await get_healthcare_professionals(db)
    else :
        raise HTTPException(status_code=401, detail="Only admin can access this feature")

    
@router.delete("/delete")
async def delete_professionals(
    professional_id : str,
    institution_id : str,
    current_user: dict = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db_conn),    
):
    # Ensure the current user has the "institution" role
    if current_user["user_role"] == "institution":
        if not institution_id:
            raise HTTPException(status_code=400, detail="Institution id is required.")
        
       # Fetch professionals belonging to the current institution
        return await delete_healthcare_professionals(db , institution_id, professional_id  )
    else:
        raise HTTPException(status_code=401, detail="Only institution users can delete")



@router.put("/update/{professional_id}")
async def update_professional(professional_id: str, updates: UpdateHealthcareProfessional,db: asyncpg.Connection = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "institution":
        return await update_healthcare_professional(db, professional_id, updates)
    else:
        raise HTTPException(status_code=401, detail="Only institution users can edit.")

@router.get("/patients/{professional_id}")
async def get_professional_patients(professional_id: str, db: asyncpg.Connection = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "professional":
        return await assigned_patients(db, professional_id)
    else:
        raise HTTPException(status_code=401, detail="Only professionals can perform this task!")
