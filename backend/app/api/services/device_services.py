import asyncpg
from fastapi import HTTPException
from pydantic import ValidationError
from app.api.models.device_models import AddDevice, UpdateDevice

async def add_devices(data: AddDevice , db: asyncpg.Connection):
    try:
        query ='''
            INSERT INTO public."device"(device_name, is_assigned)
            VALUES($1, $2)
            RETURNING deviceid
        '''
        device_data = await db.fetchrow(
            query,
            data.device_name,
            data.is_assigned
        )

        if not device_data:
            raise HTTPException(status_code=500, detail="Failed to insert device data")

        return dict(device_data)
    
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {e}")
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    
async def update_device(device_id: str, device_data: UpdateDevice, db: asyncpg.Connection):
    query = """
    UPDATE public."device"
    SET device_name = $1, is_assigned = $2
    WHERE deviceid = $3
    RETURNING deviceid
    """
    values = (device_data.device_name, device_data.is_assigned, device_id)
    record = await db.fetchrow(query, *values)
    return dict(record)

async def read_all(db: asyncpg.Connection):
    query = """
    SELECT *
    FROM public."device"
    """
    patients = await db.fetch(query)
    return patients