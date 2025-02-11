from fastapi import APIRouter, Depends, HTTPException
from app.api.models.patient_models import PatientCreate, PatientUpdate
from app.api.services.patient_services import create_patient_service, delete_patient_service, get_patient_Threshold, patients_for_professional, read_all_patients_Alerts, read_all_patients_service, read_patient_service, update_patient_service
from app.config.database import get_db_conn
from app.api.dependacies import get_current_user


router = APIRouter()

@router.post("/add", response_model=dict)
async def create_patient(patient: PatientCreate, db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "institution":
        return await create_patient_service(patient,db)
    else:
        raise HTTPException(status_code=401, detail="Only admin can access this feature")

@router.put("/edit/{patient_id}", response_model=dict)
async def patient_update(patient_id: str, patient: PatientUpdate, db = Depends(get_db_conn)):
    patient_record = await update_patient_service(patient_id, patient, db)
    if patient_record is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient_record


@router.get("/get/{patient_id}")
async def get_patient(patient_id: str, db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "professional" or current_user["user_role"] == "institution" or current_user["user_role"] == "patient":
        patient = await read_patient_service(patient_id, db)
        if patient is None:
            raise HTTPException(status_code=404, detail="Patient not found")
        return patient
    else:
        raise HTTPException(status_code=401, detail="Only loged in users can access this feature")

@router.delete("/delete/{patient_id}")
async def delete_patient(patient_id: str, db = Depends(get_db_conn)):
    result = await delete_patient_service(patient_id, db)
    if result is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"detail": "Patient deleted"}

@router.get("/getAll")
async def get_all_patients(db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "institution":
        patients = await read_all_patients_service(db)
        return patients
    else:
        raise HTTPException(status_code=401, detail="Only admin can access this feature")
    
@router.get("/PatientAlert/{professional_id}")
async def get_patient_alerts(professional_id: str, db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "professional":
        patients = await read_all_patients_Alerts(professional_id, db)
        return patients
    else:
        raise HTTPException(status_code=401, detail="Only admin can access this feature")
    
@router.get("/assignment/history/{professional_id}")
async def get_patients_professional(professional_id: str, db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "professional":
        patients = await patients_for_professional(professional_id, db)
        return patients
    else:
        raise HTTPException(status_code=401, detail="Only professionals can access this feature")
    
@router.get("/tresholds/{patient_id}")
async def get_threshold(patient_id: str, db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "professional" or current_user["user_role"] == "institution" or current_user["user_role"] == "patient":
        patient = await get_patient_Threshold(patient_id, db)
        if patient is None:
            raise HTTPException(status_code=404, detail="Patient not found")
        return patient
    else:
        raise HTTPException(status_code=401, detail="Only loged in users can access this feature")