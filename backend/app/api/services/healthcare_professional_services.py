from datetime import datetime, timezone
import asyncpg
from fastapi import HTTPException
from app.api.models.healthcare_professional_models import CreateHealthcareProfessional, UpdateHealthcareProfessional
from datetime import datetime, timezone
from app.api.dependacies import create_firebase_user, generate_password_reset_email
from app.api.services.auth_services import add_users, asign_role
from firebase_admin import auth

async def add_healthcare_professional(professional: CreateHealthcareProfessional, db: asyncpg.Connection):
    Urole = "HProfessional"
    try:
        institution_exists = await db.fetchval(
    '''
    SELECT 1 FROM public."institutions" WHERE institution_id = $1
    ''',
    professional.institution_id
)

        if not institution_exists:
            raise HTTPException(
                status_code=400, 
                detail=f"Institution with ID {professional.institution_id} does not exist."
            )

        # Insert professional into the healthcare_professionals table

        professional_id = await db.fetchval(
    '''
    INSERT INTO public."healthcare_professionals"(
        institution_id, name, specialization, contact_number, email, created_at
    ) VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING professional_id
    ''',
    professional.institution_id,
    professional.name,
    professional.specialization,
    professional.contact_number,
    professional.email 
)

        if not professional_id:
            raise HTTPException(
                status_code=500, 
                detail="Failed to add healthcare professional to the database."
            )
        firebase_user = await create_firebase_user(professional.email)
        auth.set_custom_user_claims(firebase_user.uid, {"isTemporaryPassword": True}) #this will be set to false when user resets password
        reset_pass = await generate_password_reset_email(professional.email)
        assignment_id, role_id = await asign_role(db, professional.institution_id, Urole)
        if assignment_id is None or role_id is None:
            raise HTTPException(status_code=500, detail={"message": "Role creation failed."})

        await add_users(db, email=professional.email, role_id=role_id, professional_id=professional_id)
        return {
            "professional_id": professional_id,
            "institution_id": professional.institution_id,
            "name": professional.name,
            "specialization": professional.specialization,
            "contact_number": professional.contact_number,
            "email": professional.email,
            "reset_pass_link": reset_pass,
            "created_at": datetime.now(timezone.utc),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

async def get_healthcare_professionals(db: asyncpg.Connection):
    try:
        # Fetch all professionals from the healthcare_professionals table
        rows = await db.fetch('SELECT * FROM public."healthcare_professionals"')
        return [dict(row) for row in rows]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


async def delete_healthcare_professionals(db: asyncpg.Connection, institution_id :str, professional_id:str  ):
    query = """
    DELETE FROM public.healthcare_professionals
	WHERE institution_id = $1 AND professional_id = $2
    """
    professionals = await db.fetch(query ,institution_id ,professional_id )
    return professionals 



async def update_healthcare_professional(
    db: asyncpg.Connection, professional_id: str, updates: UpdateHealthcareProfessional
):
    fields = []
    values = []

    if updates.name:
        fields.append(f"name = ${len(values) + 1}")
        values.append(updates.name)
    if updates.specialization:
        fields.append(f"specialization = ${len(values) + 1}")
        values.append(updates.specialization)
    if updates.contact_number:
        fields.append(f"contact_number = ${len(values) + 1}")
        values.append(updates.contact_number)
    if updates.email:
        fields.append(f"email = ${len(values) + 1}")
        values.append(updates.email)

    values.append(professional_id)

    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update provided.")

    query = f"""
    UPDATE healthcare_professionals
    SET {', '.join(fields)}
    WHERE professional_id = ${len(values)}
    RETURNING *
    """

    # Execute the query
    updated_professional = await db.fetchrow(query, *values)

    if not updated_professional:
        raise HTTPException(status_code=404, detail="Healthcare professional not found.")

    return dict(updated_professional)
