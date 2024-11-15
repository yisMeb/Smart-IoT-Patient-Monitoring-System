import asyncio
import logging
from typing import AsyncGenerator
import asyncpg 
import asyncssh
import os
from fastapi import HTTPException

class Database:
    def __init__(self):
        self._pool = None
        self._tunnel = None
        self._forward = None

    async def init_pool(self):
        try:
            # SSH tunnel configuration
            ssh_host = os.getenv("SSH_HOST")
            ssh_port = int(os.getenv("SSH_PORT", 22))
            ssh_user = os.getenv("SSH_USER")
            ssh_key_path = os.getenv("SSH_KEY_PATH")
            
            # Set up the SSH tunnel to the jump server (EC2 instance)
            self._tunnel = await asyncssh.connect(
                ssh_host,
                port=ssh_port,
                username=ssh_user,
                client_keys=[ssh_key_path],
                known_hosts=None
            )
            
            # Local port for the forwarded connection
            local_forward_port = 5433

            # Start port forwarding: forwarding local port to RDS host through SSH tunnel
            self._forward = await self._tunnel.forward_local_port(
                "127.0.0.1", local_forward_port, os.getenv("DB_HOST"), int(os.getenv("DB_PORT"))
            )

            # Database pool configuration
            self._pool = await asyncpg.create_pool(
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASSWORD"),
                database=os.getenv("DB_NAME"),
                host="127.0.0.1",  # Localhost after forwarding
                port=local_forward_port,  # Forwarded port
                min_size=5,
                max_size=20
            )
        except asyncssh.Error as e:
            raise Exception(f"SSH connection failed: {str(e)}")
        except asyncpg.exceptions.PostgresConnectionError as e:
            raise Exception(f"Database connection failed: {str(e)}")
        except Exception as e:
            raise Exception(f"Unexpected error: {str(e)}")

    async def close_pool(self):
        if self._pool:
            try:
                await self._pool.close()
            except asyncio.TimeoutError:
                raise Exception("Closing the pool took too long!")
            except Exception as e:
                raise Exception(f"Error while closing pool: {str(e)}")
        # Close SSH tunnel and forwarding
        if self._forward:
            self._forward.close()
        if self._tunnel:
            self._tunnel.close()

    async def get_connection(self) -> asyncpg.Connection:
        try:
            return await self._pool.acquire()
        except Exception as e:
            logger.error(f"Failed to acquire connection, pool Connection Expired!")
            logger.error(f"Trying to create new one...")
            await self.init_pool()  
            return await self._pool.acquire()

database = Database()

logger = logging.getLogger(__name__)

async def get_db_conn() -> AsyncGenerator[asyncpg.Connection, None]:
    db_conn = None
    try:
        db_conn = await database.get_connection()
        yield db_conn
    except Exception as e:
        logger.error(f"Error in get_db_conn: {e}")
        raise HTTPException(status_code=500, detail=f"{e}")
    finally:
        if db_conn:
            await database._pool.release(db_conn)
            