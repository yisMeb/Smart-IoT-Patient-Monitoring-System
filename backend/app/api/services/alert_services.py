

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
   
async def fetch_notifications_by_proffesional(id: str, db: asyncpg.Connection):
    try:
        alerts_query = '''
            SELECT *
            FROM public.alert
            WHERE p_id = $1;
        '''
        alerts_data = await db.fetch(alerts_query, id)
        
        if not alerts_data:
            return []
        
        final_data = []
        for alert in alerts_data:
            patient_query = '''
                SELECT name, contact_number
                FROM public.patients
                WHERE patient_id = $1;
            '''
            patient_data = await db.fetchrow(patient_query, alert['patient_id'])
            
            if not patient_data:
                raise HTTPException(status_code=404, detail=f"Patient details not found for patient_id: {alert['patient_id']}")

            final_alert_data = {
                "id": alert['id'],
                "message": alert['message'],
                "name": patient_data['name'],
                "contact_number": patient_data['contact_number'],
                "timestamp": alert['timestamp']
            }
            final_data.append(final_alert_data)

        return final_data

    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {e}")
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    