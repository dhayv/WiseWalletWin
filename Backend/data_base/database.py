import logging

from beanie import init_beanie

from data_base.db_utils import get_database
from models import Expense, Income, Users

models = [Users, Expense, Income]

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


# Create database and tables
async def init_db():
    try:
        await init_beanie(database=get_database, document_models=[Users, Expense, Income])

    except Exception as e:
        logging.error(f"An error occurred while initializing beanie: {e}")
