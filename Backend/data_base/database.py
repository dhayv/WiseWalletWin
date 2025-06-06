import logging

from beanie import init_beanie

from data_base.db_utils import get_database
from data_base.seeder import prepopulate_categories
from models import Category, Expense, Income, Users

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


# Create database and tables
async def init_db():
    try:
        await init_beanie(
            database=get_database, document_models=[Users, Expense, Income, Category]
        )
        await prepopulate_categories()

    except Exception as e:
        logging.error(f"An error occurred while initializing beanie: {e}")
