import asyncpg
from datetime import datetime, timezone
from fastapi import HTTPException
from pydantic import ValidationError
from app.api.models.patient_models import PatientCreate, PatientUpdate
from app.api.models.other_models import validate_input, validate_phone_number
from app.api.dependacies import create_firebase_user, generate_password_reset_email
from firebase_admin import auth
from app.api.services.auth_services import add_users, asign_role

async def create_patient_service(patient: PatientCreate, db: asyncpg.Connection):
    Urole = "Patient"
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
                INSERT INTO public.patients (
                    institution_id, 
                    name, 
                    dob, 
                    contact_number, 
                    email, 
                    address, 
                    created_at,
                    device_id, 
                    status, 
                    oxygen_threshold, 
                    heartrate_threshold, 
                    temperature_threshold, 
                    oxygen_threshold_lower, 
                    heartrate_threshold_lower, 
                    temperature_threshold_lower, 
                    professional_id
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
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
            current_date,
            patient.device_id, 
            patient.status, 
            patient.oxygen_threshold, 
            patient.heartrate_threshold,  
            patient.temperature_threshold,
            patient.oxygen_threshold_lower, 
            patient.heartrate_threshold_lower, 
            patient.temperature_threshold_lower,  
            patient.professional_id
            )
        if not record:
            raise HTTPException(status_code=500, detail="Failed to insert patient data")
        check_device = """
            SELECT is_assigned, assigned_to
            FROM public.device
            WHERE deviceid = $1
        """
        device_status = await db.fetchrow(check_device, patient.device_id)

        if device_status["is_assigned"]:
            raise HTTPException(
                status_code=400,
                detail=f"Device {patient.device_id} is already assigned to patient {device_status['assigned_to']}"
            )
            
        #assign device to the patient
        update_query = """
            UPDATE public.device
            SET is_assigned = TRUE, assigned_to = $1
            WHERE deviceid = $2
        """
        await db.execute(update_query, record["patient_id"], patient.device_id)
       
       #send email to patient
        firebase_user = await create_firebase_user(patient.email)
        auth.set_custom_user_claims(firebase_user.uid, {"isTemporaryPassword": True}) #this will be set to false when user resets password
        reset_pass = await generate_password_reset_email(patient.email)
        assignment_id, role_id = await asign_role(db, patient.institution_id, Urole)
        
        if assignment_id is None or role_id is None:
            raise HTTPException(status_code=500, detail={"message": "Role creation failed."})

        await add_users(db, email=patient.email, role_id=role_id, patient_id=record["patient_id"])
        
        return {
           "patient_id": record["patient_id"],
           "institution_id": record["institution_id"],
           "reset_pass_link": reset_pass,
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
    try:
        validate_input({
            "name": patient.name,
            "email": patient.email,
            "address": patient.address
        })
        formatted_phone_number = validate_phone_number(patient.contact_number)
        
        query = """
        UPDATE public.patients
        SET 
            name = $1, 
            dob = $2, 
            contact_number = $3, 
            email = $4, 
            address = $5, 
            status = $6,
            oxygen_threshold = $7,
            heartrate_threshold = $8,
            temperature_threshold = $9,
            oxygen_threshold_lower = $10,
            heartrate_threshold_lower = $11,
            temperature_threshold_lower = $12,
            professional_id = $13
        WHERE patient_id = $14
        RETURNING 
            patient_id, 
            institution_id, 
            name, 
            dob, 
            contact_number, 
            email, 
            address, 
            created_at, 
            status,
            oxygen_threshold,
            heartrate_threshold,
            temperature_threshold,
            oxygen_threshold_lower,
            heartrate_threshold_lower,
            temperature_threshold_lower,
            professional_id
        """
        
        values = (
            patient.name, 
            patient.dob, 
            formatted_phone_number, 
            patient.email, 
            patient.address, 
            patient.status,
            patient.oxygen_threshold,
            patient.heartrate_threshold,
            patient.temperature_threshold,
            patient.oxygen_threshold_lower,
            patient.heartrate_threshold_lower,
            patient.temperature_threshold_lower,
            patient.professional_id,
            patient_id
        )
        
        patient_record = await db.fetchrow(query, *values)
        
        if not patient_record:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        return patient_record
    
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {e}")
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

async def delete_patient_service(patient_id: int, db: asyncpg.Connection):
    query = """
    DELETE FROM patients
    WHERE patient_id = $1
    RETURNING patient_id
    """
    result = await db.fetchrow(query, patient_id)
    return result