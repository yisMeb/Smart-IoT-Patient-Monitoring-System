from dotenv import load_dotenv
from .api.api import api_router 
from fastapi.middleware.cors import CORSMiddleware
from app.config.database import database
from contextlib import asynccontextmanager
from fastapi.responses import RedirectResponse
from firebase_admin import credentials, initialize_app, get_app
from app.api.models.inst_models import InstitutionCreate , InstitutionUpdate
from datetime import date , datetime
from fastapi import FastAPI,Depends,HTTPException
import asyncpg 
import os
load_dotenv()

db_pool = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    
    firebase_key_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY_PATH")
    if not firebase_key_path:
        raise ValueError("Environment variable FIREBASE_SERVICE_ACCOUNT_KEY_PATH is not set or is empty.")
    try:
        try:
            get_app()  
        except ValueError:
            firebase_cred = credentials.Certificate(firebase_key_path)
            initialize_app(firebase_cred)
            print("Firebase app initialized successfully")
    except Exception as e:
        print(f"Failed to initialize Firebase Admin SDK: {e}")
        raise ValueError(f"Failed to initialize Firebase Admin SDK: {e}")

    await database.init_pool()  
    yield
    await database.close_pool()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", include_in_schema=False)
def read_root():
    return RedirectResponse(url="/docs", status_code=307)

app.include_router(api_router)




async def get_db():
    conn = await asyncpg.connect(database)
    try:
        yield conn
    finally:
        await conn.close()

@app.post("/institutions/", response_model=InstitutionCreate)
async def create_institution(institution: InstitutionCreate, db: asyncpg.Connection = Depends(get_db)):
    query = """
    INSERT INTO institutions (name, address, contact_number, created_at)
    VALUES ($1, $2, $3, $4)
    RETURNING institution_id, name, address, contact_number, created_at
    """
    values = (institution.name, institution.address, institution.contact_number, datetime.utcnow())
    institution_record = await db.fetchrow(query, *values)
    return institution_record

@app.get("/institutions/{institution_id}", response_model=InstitutionCreate)
async def read_institution(institution_id: int, db: asyncpg.Connection = Depends(get_db)):
    query = """
    SELECT institution_id, name, address, contact_number, created_at
    FROM institutions
    WHERE institution_id = $1
    """
    institution = await db.fetchrow(query, institution_id)
    if institution is None:
        raise HTTPException(status_code=404, detail="Institution not found")
    return institution

@app.put("/institutions/{institution_id}", response_model=InstitutionUpdate)
async def update_institution(institution_id: int, institution: InstitutionUpdate, db: asyncpg.Connection = Depends(get_db)):
    query = """
    UPDATE institutions
    SET name = $1, address = $2, contact_number = $3
    WHERE institution_id = $4
    RETURNING institution_id, name, address, contact_number, created_at
    """
    values = (institution.name, institution.address, institution.contact_number, institution_id)
    institution_record = await db.fetchrow(query, *values)
    if institution_record is None:
        raise HTTPException(status_code=404, detail="Institution not found")
    return institution_record

@app.delete("/institutions/{institution_id}")
async def delete_institution(institution_id: int, db: asyncpg.Connection = Depends(get_db)):
    query = """
    DELETE FROM institutions
    WHERE institution_id = $1
    RETURNING institution_id
    """
    institution = await db.fetchrow(query, institution_id)
    if institution is None:
        raise HTTPException(status_code=404, detail="Institution not found")
    return {"detail": "Institution deleted"}



#-- this is for windows machine with vscode editor - run those commands in the terminal
#python -m venv venv
#venv\Scripts\activate
#pip install -r requirements.txt
#uvicorn app.main:app --reload
