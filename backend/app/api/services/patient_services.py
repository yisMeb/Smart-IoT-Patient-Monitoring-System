import asyncpg
from datetime import datetime, timezone

from fastapi import HTTPException
from pydantic import ValidationError
from app.api.models.patient_models import PatientCreate, PatientUpdate
from app.api.models.other_models import validate_input, validate_phone_number

async def create_patient_service(patient: PatientCreate, db: asyncpg.Connection):
    try:
        current_date = datetime.now(timezone.utc).replace(tzinfo=None)

        # Validate individual fields
        validate_input({
            "name": patient.name,
            "email": patient.email,
            "address": patient.address
        })
        
        # Validate and format the phone number
        formatted_phone_number = validate_phone_number(patient.contact_number)
       
        query = """
        INSERT INTO public.patients (institution_id, name, dob, contact_number, email, address, device_id, created_at, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING patient_id, institution_id
        """
        record = await db.fetchrow(
            query,
            patient.institution_id,
            patient.name,
            patient.dob,
            formatted_phone_number,
            patient.email,
            patient.address,
            patient.device_id,
            current_date,
            patient.status
        )

        if not record:
            raise HTTPException(status_code=500, detail="Failed to insert patient data")

        #Update the device table
        update_query = """
        UPDATE public.device
        SET is_assigned = TRUE, assigned_to = $1
        WHERE deviceid = $2
        """
        await db.execute(update_query, record["patient_id"], patient.device_id)
        
        return {
            "patient_id": record["patient_id"],
            "institution_id": record["institution_id"],
        }
    
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {e}")
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    
async def read_patient_service(patient_id: int, db: asyncpg.Connection):
    query = """
    SELECT patient_id, institution_id, name, dob, contact_number, email, address, created_at
    FROM patients
    WHERE patient_id = $1
    """
    patient = await db.fetchrow(query, patient_id)
    return patient

async def read_all_patients_service(db: asyncpg.Connection):
    query = """
    SELECT *
    FROM patients
    """
    patients = await db.fetch(query)
    return patients

async def update_patient_service(patient_id: int, patient: PatientUpdate, db: asyncpg.Connection):
    query = """
    UPDATE patients
    SET name = $1, dob = $2, contact_number = $3, email = $4, address = $5, status = $7
    WHERE patient_id = $6
    RETURNING patient_id, institution_id, name, dob, contact_number, email, address, created_at, status
    """
    values = (patient.name, patient.dob, patient.contact_number, patient.address, patient.status, patient_id)
    patient_record = await db.fetchrow(query, *values)
    return patient_record

async def delete_patient_service(patient_id: int, db: asyncpg.Connection):
    query = """
    DELETE FROM patients
    WHERE patient_id = $1
    RETURNING patient_id
    """
    result = await db.fetchrow(query, patient_id)
    return result