import logging
import os

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings

load_dotenv()


class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL"),
    server_timeout: str = os.getenv("MONGO_TIMEOUT_MS", "1000")
    database_name: str = "Wallet_Database"


settings = Settings()

client = AsyncIOMotorClient(settings.database_url, serverSelectionTimeoutMS=settings.server_timeout)

get_database = client[settings.database_name]


# Function to check the connection to MongoDB
async def check_connection():
    try:
        await client.admin.command("ping")
        logging.info("Connected to MongoDB!")
    except Exception as e:
        logging.error(f"An error occurred while connecting to MongoDB: {e}")
