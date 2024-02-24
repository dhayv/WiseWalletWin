from fastapi import FastAPI
from fastapi.events import Lifespan
from router.expenses import router as expense_router
from router.income import router as income_router
import database

app = FastAPI()

@app.lifespan.on_startup
async def startup():
    await database.create_db_and_tables()
    print("Database Created")

app.include_router(income_router)
app.include_router(expense_router)
