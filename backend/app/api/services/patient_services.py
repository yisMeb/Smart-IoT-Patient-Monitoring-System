import asyncpg
from datetime import datetime, timezone
from fastapi import HTTPException
from pydantic import ValidationError
from app.api.models.patient_models import PatientCreate, PatientUpdate, PatientUpdateThreshold
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
            patient.status.lower(), 
            patient.oxygen_threshold, 
            patient.heartrate_threshold,  
            patient.temperature_threshold,
            patient.oxygen_threshold_lower, 
            patient.heartrate_threshold_lower, 
            patient.temperature_threshold_lower,
            patient.professional_id
            )
        if not record:
            raise HTTPException(status_code=404, detail="Failed to insert patient data")
        
        query = """
            UPDATE public."device"
            SET is_assigned = true
            WHERE deviceid = $1
            RETURNING deviceid
        """
        record = await db.fetchrow(query, patient.device_id)
        
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
    
async def read_patient_service(patient_id: str, db: asyncpg.Connection):
    query = """
    SELECT *
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

async def read_all_patients_Alerts(professional_id: str, db: asyncpg.Connection):
    try:
        query = """
        SELECT 
            name,
            contact_number,
            oxygen_threshold_lower || ' - ' || oxygen_threshold AS oxygen_thresholds,
            heartrate_threshold_lower || ' - ' || heartrate_threshold AS heartrate_thresholds,
            temperature_threshold_lower || ' - ' || temperature_threshold AS temperature_thresholds,
            CASE 
                WHEN device_id IS NOT NULL THEN 'assigned'
                ELSE 'not assigned'
            END AS device_status,
            status
        FROM 
            public.patients
        WHERE 
            professional_id = $1;
        """
        
        patients = await db.fetch(query, professional_id)
        
        if not patients:
            return {"message": "No patients found for the given institution ID."}
        
        return patients

    except asyncpg.PostgresError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )
    

async def update_patient_service(patient_id: str, patient: PatientUpdate, db: asyncpg.Connection):
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
            professional_id = $7
        WHERE patient_id = $8
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
            professional_id
        """
        
        values = (
            patient.name, 
            patient.dob, 
            formatted_phone_number, 
            patient.email, 
            patient.address, 
            patient.status,
            patient.professional_id,
            patient_id
        )
        
        patient_record = await db.fetchrow(query, *values)
        
        if not patient_record:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        return dict(patient_record)
    
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {e}")
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

async def delete_patient_service(patient_id: str, db: asyncpg.Connection):
    query = """
    DELETE FROM patients
    WHERE patient_id = $1
    RETURNING patient_id
    """
    result = await db.fetchrow(query, patient_id)
   
    return result

async def patients_for_professional(professional_id: str, db: asyncpg.Connection):
    query = """
    SELECT *
    FROM patients
    WHERE professional_id = $1
    ORDER BY created_at
    """
    patients = await db.fetch(query, professional_id)
    if not patients:
        return []

    patient_data = []
    for patient in patients:
        patient_dict = dict(patient)
        created_at = patient_dict['created_at']
        formatted_created_at = created_at.strftime("%Y-%m-%d %H:%M:%S")
        patient_dict['created_at'] = formatted_created_at
        patient_data.append(patient_dict)
    
    return patient_data

async def get_patient_Threshold(id: str, db: asyncpg.Connection):
    query = """
        SELECT 
            heartrate_threshold_lower,
            heartrate_threshold,
            oxygen_threshold_lower,
            oxygen_threshold,
            temperature_threshold_lower,
            temperature_threshold
        FROM public.patients
        WHERE patient_id = $1
    """

    result = await db.fetchrow(query, id)

    if result is None:
        raise ValueError(f"Patient with ID {id} not found")

    # Extract threshold values
    heartrate_lower, heartrate_upper = result['heartrate_threshold_lower'], result['heartrate_threshold']
    oxygen_lower, oxygen_upper = result['oxygen_threshold_lower'], result['oxygen_threshold']
    temperature_lower, temperature_upper = result['temperature_threshold_lower'], result['temperature_threshold']

    # Format thresholds
    thresholds = {
        "Hearthrate": f"{heartrate_lower}-{heartrate_upper}",
        "Oxygene": f"{oxygen_lower}-{oxygen_upper}",
        "Temperature": f"{temperature_lower}-{temperature_upper}"
    }

    return thresholds


async def update_patient_threshold(id: str, update_data: PatientUpdateThreshold, db: asyncpg.Connection):
    print("Updating thresholds for patient:", id)

    # Fetch existing values
    query_get = """
        SELECT heartrate_threshold_lower, heartrate_threshold, oxygen_threshold_lower, 
               oxygen_threshold, temperature_threshold_lower, temperature_threshold
        FROM public.patients WHERE patient_id = $1
    """
    existing = await db.fetchrow(query_get, id)
    if not existing:
        raise ValueError(f"Patient with ID {id} not found")

    # Keep previous values if fields are not sent
    update_values = {
        "heartrate_threshold_lower": update_data.heartrate_threshold_lower or existing["heartrate_threshold_lower"],
        "heartrate_threshold": update_data.heartrate_threshold or existing["heartrate_threshold"],
        "oxygen_threshold_lower": update_data.oxygen_threshold_lower or existing["oxygen_threshold_lower"],
        "oxygen_threshold": update_data.oxygen_threshold or existing["oxygen_threshold"],
        "temperature_threshold_lower": update_data.temperature_threshold_lower or existing["temperature_threshold_lower"],
        "temperature_threshold": update_data.temperature_threshold or existing["temperature_threshold"],
    }

    query_update = """
        UPDATE public.patients
        SET 
            heartrate_threshold_lower = $1,
            heartrate_threshold = $2,
            oxygen_threshold_lower = $3,
            oxygen_threshold = $4,
            temperature_threshold_lower = $5,
            temperature_threshold = $6
        WHERE patient_id = $7
    """
    await db.execute(query_update, *update_values.values(), id)
