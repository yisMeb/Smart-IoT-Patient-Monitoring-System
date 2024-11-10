import os
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from firebase_admin import auth, initialize_app, credentials, get_app
import firebase_admin
from app.config.database import get_db_conn
from dotenv import load_dotenv
import asyncpg 
import logging

load_dotenv()
logger = logging.getLogger(__name__)

firebase_key_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY_PATH")

if not firebase_key_path:
    raise ValueError("Environment variable FIREBASE_SERVICE_ACCOUNT_KEY_PATH is not set or is empty.")
# Initialize Firebase app if not already initialized
try:
    try:
        app = get_app()
    except ValueError:
        firebase_cred = credentials.Certificate(firebase_key_path)
        app = initialize_app(firebase_cred)
        logger.info("Firebase app initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Firebase Admin SDK: {e}")
    raise ValueError(f"Failed to initialize Firebase Admin SDK: {e}")


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def get_current_user(token: str = Depends(oauth2_scheme), db:  asyncpg.Connection = Depends(get_db_conn)):
    """Extract and verify current user from Firebase JWT token."""
    try:
        # Verify token with Firebase Admin SDK
        decoded_token = auth.verify_id_token(token)
        email = decoded_token.get("email")
        
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token: email claim missing.")
        
        user = await db.fetchrow('SELECT * FROM public."users" WHERE email = $1', email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        
        return user
    
    except auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token has expired.")
    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid token.")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Could not validate credentials: {str(e)}")
