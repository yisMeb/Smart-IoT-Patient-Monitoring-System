import asyncpg
from datetime import datetime

from app.api.models.inst_models import InstitutionCreate, InstitutionUpdate

async def create_institution_service(institution: InstitutionCreate, db: asyncpg.Connection):
    query = """
    INSERT INTO institutions (name, address, contact_number, created_at)
    VALUES ($1, $2, $3, $4)
    RETURNING institution_id, name, address, contact_number, created_at
    """
    values = (institution.name, institution.address, institution.contact_number, datetime.utcnow())
    institution_record = await db.fetchrow(query, *values)
    return institution_record

async def read_institution_service(institution_id: int, db: asyncpg.Connection):
    query = """
    SELECT institution_id, name, address, contact_number, created_at
    FROM institutions
    WHERE institution_id = $1
    """
    institution = await db.fetchrow(query, institution_id)
    return institution

async def update_institution_service(institution_id: int, institution: InstitutionUpdate, db: asyncpg.Connection):
    query = """
    UPDATE institutions
    SET name = $1, address = $2, contact_number = $3
    WHERE institution_id = $4
    RETURNING institution_id, name, address, contact_number, created_at
    """
    values = (institution.name, institution.address, institution.contact_number, institution_id)
    institution_record = await db.fetchrow(query, *values)
    return institution_record

async def delete_institution_service(institution_id: int, db: asyncpg.Connection):
    query = """
    DELETE FROM institutions
    WHERE institution_id = $1
    RETURNING institution_id
    """
    result = await db.fetchrow(query, institution_id)
    return result