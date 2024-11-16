import os
from fastapi import FastAPI
from dotenv import load_dotenv
from .api.api import api_router 
from fastapi.middleware.cors import CORSMiddleware
from app.config.database import database
from contextlib import asynccontextmanager
from fastapi.responses import RedirectResponse
from firebase_admin import credentials, initialize_app, get_app

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
    allow_origins=[
        "http://localhost:5173/",
        "https://main.d1bsmqmctjmx5w.amplifyapp.com/",
        "https://d2vn8y5ygxxkd2.cloudfront.net/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", include_in_schema=False)
def read_root():
    return RedirectResponse(url="/docs", status_code=307)

app.include_router(api_router)


#-- this is for windows machine with vscode editor - run those commands in the terminal
#python -m venv venv
#venv\Scripts\activate
#pip install -r requirements.txt
#uvicorn app.main:app --reload
