import asyncpg

async def delete_institution_service(institution_id: int, db: asyncpg.Connection):
    query = """
    DELETE FROM institutions
    WHERE institution_id = $1
    RETURNING institution_id
    """
    result = await db.fetchrow(query, institution_id)
    return result
