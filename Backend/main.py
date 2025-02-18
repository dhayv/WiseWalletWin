import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from data_base.database import init_db
from data_base.db_utils import check_connection
from models import Category, Expense, Income, Users
from router import expenses_endpoint as expense_router
from router import income_endpoint as income_router
from router import user_endpoint as user_router

load_dotenv

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


# Startup event before server starts
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db(models=[Users, Expense, Income, Category])
    await prepopulate_categories()

    logging.info("Database Created")

    await check_connection()

    yield


async def prepopulate_categories():
    default_categories = [
        # Expense categories (if you decide to include these)
        {"name": "Food", "description": "Money spent on groceries, dining out, etc."},
        {"name": "Rent", "description": "Monthly rent or mortgage payments."},
        {"name": "Utilities", "description": "Bills for electricity, water, gas, etc."},
        {"name": "Phone Bill", "description": "Mobile phone service charges."},
        {"name": "Online Services", "description": "Subscriptions to online platforms."},
        {"name": "Groceries", "description": "Regular grocery shopping expenses."},
        {"name": "Debt Repayment", "description": "Payments toward loans or credit card debt."},
        {"name": "Insurance", "description": "Insurance premiums for health, car, etc."},
        {"name": "Investments & Savings", "description": "Money allocated for investments or savings."},
        {"name": "Business Expense", "description": "Costs related to running a business."},
    ]

    for cat in default_categories:
        existing = await Category.find_one(Category.name == cat["name"])
        if not existing:
            new_cat = Category(**cat)
            await new_cat.insert()
            print(f"Inserted category: {new_cat.name}")
        else:
            print(f"Category {cat['name']} already exists.")


app = FastAPI(lifespan=lifespan, debug=True)

origins = os.getenv("ORIGIN_URL")


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/main")
def hello():
    return {"message": "Hello, World"}


app.include_router(expense_router.router, prefix="/api")
app.include_router(income_router.router, prefix="/api")
app.include_router(user_router.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
