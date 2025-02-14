import asyncpg
from fastapi import HTTPException
from pydantic import ValidationError 

async def fetch_notifications_by_id(id: str , db: asyncpg.Connection):
    try:
        query ='''
            SELECT *
            FROM public.alert
            WHERE patient_id = $1
            ORDER BY "timestamp" DESC;
        '''
        alert_data = await db.fetch(query, id)
        if not alert_data:
           return []
        return alert_data
    
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {e}")
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
   
async def fetch_notifications_by_proffesional(id: str, db: asyncpg.Connection):
    try:
        alerts_query = '''
            SELECT *
            FROM public.alert
            WHERE p_id = $1
            ORDER BY "timestamp" DESC;
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
               return []
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

async def fetch_resolved_alerts(id: str, db: asyncpg.Connection):
    try:
        alerts_query = '''
            SELECT *
            FROM public.alert
            WHERE p_id = $1 AND is_resolved = True
            ORDER BY "timestamp" DESC;
        '''
        alerts_data = await db.fetch(alerts_query, id)
        
        if not alerts_data:
            return []
        
        return alerts_data

    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {e}")
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

async def All_resolved_alerts(db: asyncpg.Connection):
    try:
        alerts_query = '''
            SELECT *
            FROM public.alert
            WHERE is_resolved = True
            ORDER BY "timestamp" DESC;
        '''
        alerts_data = await db.fetch(alerts_query)
        
        if not alerts_data:
            return []
        
        return alerts_data

    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {e}")
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

async def fetch_unresolved_alerts(id: str, db: asyncpg.Connection):
    try:
        alerts_query = '''
            SELECT *
            FROM public.alert
            WHERE p_id = $1 AND is_resolved = False
            ORDER BY "timestamp" DESC;
        '''
        alerts_data = await db.fetch(alerts_query, id)
        
        if not alerts_data:
            return []
        
        return alerts_data

    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {e}")
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

async def All_unresolved_alerts( db: asyncpg.Connection):
    try:
        alerts_query = '''
            SELECT *
            FROM public.alert
            WHERE is_resolved = False;
        '''
        alerts_data = await db.fetch(alerts_query)
        
        if not alerts_data:
            return []
        
        return alerts_data

    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {e}")
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")



async def all_proff_alert(id: str, db: asyncpg.Connection):
    try:
        query = '''
            SELECT *
            FROM public.alert
            WHERE p_id = $1;
        '''
        data = await db.fetch(query, id)
        
        if not data:
            return {"data": [], "count": 0}
        
        return  {"data": data, "count": len(data)}

    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {e}")
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")