import logging

from beanie import Document, init_beanie
from data_base.db_utils import get_database
from models import Expense, Income, Users

models = [Users, Expense, Income]

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


async def intialize_counters():
    try:
        counters = ["user_id", "income_id", "expense_id"]
        for counter in counters:
            if get_database.counters.find_one({"_id": counter}) is None:
                await get_database.counters.insert_one({"_id": counter, "seq": 0})
        logging.info("Successfully initialized counters in Mongo")
    except Exception as e:
        logging.error(f"An error occurred while initializing counters: {e}")


# Create database and tables
async def init_db(models: list[Document]):
    try:
        await init_beanie(database=get_database, document_models=models)
        logging.info("Successfully initialized beanie with MongoDB!")

        await intialize_counters()

    except Exception as e:
        logging.error(f"An error occurred while initializing beanie: {e}")
