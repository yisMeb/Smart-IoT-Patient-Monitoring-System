import asyncpg
from fastapi import HTTPException
from app.api.models.auth_models import InstituteUpdate
from app.api.services.auth_services import fetch_Institution_by_id
from firebase_admin import auth

async def delete_institution_service(institution_id: str, db: asyncpg.Connection):
    query = """
    DELETE FROM institutions
    WHERE institution_id = $1
    """
    try:
        result = await db.fetchrow(query, institution_id)
        return result
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Error deleting institution: {e}")

async def fetch_institution_service(institution_id: str, db: asyncpg.Connection):
    query = """
    SELECT * FROM institutions
    WHERE institution_id = $1
    """
    try:
        result = await db.fetchrow(query, institution_id)
        return result
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Error fetching institution: {e}")

async def update_institutes(db: asyncpg.Connection, id: str, updates: InstituteUpdate):
    institution = await fetch_Institution_by_id(id, db)
    if not institution:
        raise HTTPException(status_code=404, detail="Institution not found.")

    current_email = institution['email']

    try:
        if updates.email and updates.email != current_email:
            try:
                firebase_user = auth.get_user_by_email(current_email)
                auth.update_user(
                    firebase_user.uid,
                    email=updates.email,
                    display_name=updates.name
                )
            except auth.UserNotFoundError:
                raise HTTPException(status_code=404, detail="User not found in Firebase Auth.")
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to update email in Firebase Auth: {str(e)}")

        await db.execute('''
            UPDATE public."institutions"
            SET name = $1, address = $2, email = $3
            WHERE institution_id = $4
        ''', updates.name, updates.address, updates.email, id)

        return {"message": "Institution updated successfully."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")