from xml.dom import ValidationErr
import asyncpg
from datetime import datetime, timezone
import logging
import uuid
from fastapi import HTTPException
from app.api.models.patient_models import PatientCreate, PatientUpdate
from app.api.models.other_models import validate_input
from firebase_admin import auth




async def create_patient_service(patient: PatientCreate, db: asyncpg.Connection):
    current_date = datetime.now(timezone.utc).replace(tzinfo=None)
    query = """
    INSERT INTO patients (institution_id, name, dob, contact_number, email, address, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING patient_id, institution_id
    """
    patient_data = {
        "institution_id": patient.institution_id,
        "name": patient.name,
        "dob": patient.dob,
        "contact_number": patient.contact_number,
        "email": patient.email,
        "address": patient.address,
    }
    validate_input(patient_data)

async def read_patient_service(patient_id: int, db: asyncpg.Connection):
    query = """
    SELECT patient_id, institution_id, name, dob, contact_number, email, address, created_at
    FROM patients
    WHERE patient_id = $1
    """
    patient = await db.fetchrow(query, patient_id)
    return patient


async def update_patient_service(patient_id: int, patient: PatientUpdate, db: asyncpg.Connection):
    query = """
    UPDATE patients
    SET name = $1, dob = $2, contact_number = $3, email = $4, address = $5, 
    WHERE patient_id = $6
    RETURNING patient_id, institution_id, name, dob, contact_number, email, address, created_at
    """
    values = (patient.name, patient.dob, patient.contact_number, patient.address, patient_id)
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