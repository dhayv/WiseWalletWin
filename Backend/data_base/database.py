import logging
import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import Document, init_beanie
from pydantic import BaseSettings


logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL")


client = AsyncIOMotorClient(Settings.database_url)

# Creates database engine
database = client.get_database


# Function to check the connection to MongoDB
async def check_connection():
    try:
        await client.admin.command('ping')
        logging.info("Pinged your deployment. Successfully connected to MongoDB!")
    except Exception as e:
        logging.error(f"An error occurred while connecting to MongoDB: {e}")


# Create database and tables
async def init_db(models: list[Document]):
    try:
        await init_beanie(database=database, document_models=models)
        logging.info("Successfully initialized beanie with MongoDB!")
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        logging.error(f"An error occurred while initializing beanie: {e}")
