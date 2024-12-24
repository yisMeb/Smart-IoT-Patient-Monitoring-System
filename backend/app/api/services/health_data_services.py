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
