import logging
import os

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings

load_dotenv()


class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL")


settings = Settings()

client = AsyncIOMotorClient(settings.database_url)

database_name = "Wallet_Database"

get_database = client.get_database(database_name)


# Function to check the connection to MongoDB
async def check_connection():
    try:
        await client.admin.command("ping")
        logging.info("Pinged your deployment. Successfully connected to MongoDB!")
    except Exception as e:
        logging.error(f"An error occurred while connecting to MongoDB: {e}")
