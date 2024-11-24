from fastapi import APIRouter, Depends, HTTPException
import asyncpg
from app.api.models.patient_models import PatientCreate, PatientUpdate
from app.api.services.patient_services import create_patient_service, delete_patient_service, read_patient_service, update_patient_service
from app.config.database import get_db_conn
from app.api.dependacies import get_current_user


router = APIRouter()

@router.post("patients", response_model=dict)
async def create_patient(patient: PatientCreate, db = Depends(get_db_conn)):
    #created_patient = await create_patient_service(patient,db)
   

    return {
        "patient: ": patient.name,
        "email": patient.email,
    }

@router.put("/patients/{patient_id}", response_model=dict)
async def patient_update(patient_id: int, patient: PatientUpdate, db = Depends(get_db_conn)):
    patient_record = await update_patient_service(patient_id, patient, db)
    if patient_record is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient_record

@router.delete("/patients/{patient_id}")
async def delete_patient(patient_id: int, db = Depends(get_db_conn)):
    result = await delete_patient_service(patient_id, db)
    if result is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"detail": "Patient deleted"}