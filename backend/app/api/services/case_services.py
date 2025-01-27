

import asyncpg
from fastapi import HTTPException
from pydantic import ValidationError

from app.api.models.case_model import CaseData 

async def add_case_history(data: CaseData , db: asyncpg.Connection):
    try:
        query ='''
           INSERT INTO public."case"(
	       patient_id, professional_id, remark)
	        VALUES ($1, $2, $3)
            RETURNING *;
        '''
        device_data = await db.fetchrow(
            query,
            data.patient_id,
            data.professional_id,
            data.remark
        )
        if not device_data:
           raise HTTPException(status_code=500, detail="Failed to create case data")
        return device_data
    
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {e}")
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
   
async def get_case_history(id: str , db: asyncpg.Connection):
    try:
        query ='''
            SELECT *
            FROM public."case"
            WHERE patient_id = $1;
        '''
        device_data = await db.fetch(
            query,
            id
        )
        if not device_data:
            raise HTTPException(status_code=500, detail="Failed to get case data")
        return device_data
    
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {e}")
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
   