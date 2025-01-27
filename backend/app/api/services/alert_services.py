

import asyncpg
from fastapi import HTTPException
from pydantic import ValidationError 

async def fetch_notifications_by_id(id: str , db: asyncpg.Connection):
    try:
        query ='''
            SELECT *
            FROM public.alert
            WHERE patient_id = $1;
        '''
        device_data = await db.fetch(
            query,
            id
        )
        if not device_data:
            raise HTTPException(status_code=500, detail="Failed to get device data")
        return device_data
    
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {e}")
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
   
async def fetch_notifications_by_proffesional(id: str , db: asyncpg.Connection):
    try:
        query ='''
            SELECT *
            FROM public.alert
            WHERE p_id = $1;
        '''
        device_data = await db.fetch(
            query,
            id
        )
        if not device_data:
            raise HTTPException(status_code=500, detail="Failed to get device data")
        return device_data
    
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {e}")
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
   