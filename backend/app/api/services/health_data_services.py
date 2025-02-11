import asyncpg
from fastapi import HTTPException
from app.api.models.health_data_model import AddHealthData

async def add_health_data(user_data: AddHealthData, db: asyncpg.Connection):
    try:
        heartrate = user_data.heartrate if user_data.heartrate not in (None, 0) else None
        oxygen = user_data.oxygen if user_data.oxygen not in (None, 0) else None
        temperature = user_data.temprature if user_data.temprature not in (None, 0) else None
        device_id = user_data.device_id if user_data.device_id is not None else None

        health_data = await db.fetchval('''
            INSERT INTO public."health_data"(heartrate, oxygen, temperature, device_id)
            VALUES($1, $2, $3, $4)
            RETURNING data_id
        ''', heartrate, oxygen, temperature, device_id)

        return health_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding health data: {str(e)}")

async def get_health_data(device_id: str, patient_id:str, db: asyncpg.Connection):
    try:
        query = await db.fetch('''
            SELECT h.* 
            FROM public.health_data AS h
            INNER JOIN public.patients AS p
            ON h.device_id = p.device_id
            WHERE h.device_id = $1 AND p.patient_id = $2
            ORDER BY h.timestamp DESC
            LIMIT 1
        ''', device_id, patient_id)
       
        if query:
            return query[0]
        else:
            return None

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting health data: {str(e)}")