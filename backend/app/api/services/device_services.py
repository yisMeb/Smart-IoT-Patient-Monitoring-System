import asyncpg
from fastapi import HTTPException
from pydantic import ValidationError
from app.api.models.device_models import AddDevice, UpdateDevice

async def add_devices(data: AddDevice , db: asyncpg.Connection):
    try:
        query ='''
            INSERT INTO public."device"(device_name, is_assigned, assigned_to)
            VALUES($1, $2, $3)
            RETURNING data_id, assigned_to
        '''
        device_data = await db.fetchrow(
            query,
            data.device_name,
            data.is_assigned,
            data.assigned_to
        )

        if not device_data:
            raise HTTPException(status_code=500, detail="Failed to insert device data")

        return device_data
    
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {e}")
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    
async def update_device(device_id: int, device_data: UpdateDevice, db: asyncpg.Connection):
    query = """
    UPDATE public."device"
    SET device_name = $1, is_assigned = $2, assigned_to = $3
    WHERE device_id = $4
    RETURNING device_id
    """
    values = (device_data.device_name, device_data.is_assigned, device_data.assigned_to, device_id)
    record = await db.fetchrow(query, *values)
    return record

async def read_all(db: asyncpg.Connection):
    query = """
    SELECT *
    FROM public."device"
    """
    patients = await db.fetch(query)
    return patients