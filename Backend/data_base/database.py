import logging
import os

from beanie import Document, init_beanie
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings

from models import Expense, Income, Users

models = [Users, Expense, Income]

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
load_dotenv()


class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL")


settings = Settings()


client = AsyncIOMotorClient(settings.database_url)

# Creates database engine
database = client.get_database


async def intialize_counters():
    try:
        counters = ["user_id", "income_id", "expense_id"]
        for counter in counters:
            if database.counters.find_one({"_id": counter}) is None:
                await database.counters.insert_one({"_id": counter, "seq": 0})
        logging.info("Successfully initialized counters in Mongo")
    except Exception as e:
        logging.error(f"An error occurred while initializing counters: {e}")


# Function to check the connection to MongoDB
async def check_connection():
    try:
        await client.admin.command("ping")
        logging.info("Pinged your deployment. Successfully connected to MongoDB!")
    except Exception as e:
        logging.error(f"An error occurred while connecting to MongoDB: {e}")


# Create database and tables
async def init_db(models: list[Document]):
    try:
        await init_beanie(database=database, document_models=models)
        logging.info("Successfully initialized beanie with MongoDB!")

        await intialize_counters()

    except Exception as e:
        logging.error(f"An error occurred while initializing beanie: {e}")
