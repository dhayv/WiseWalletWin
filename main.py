from fastapi import FastAPI
from contextlib import asynccontextmanager
from router.expenses import router as expense_router, create_expenses
from router.income import router as income_router, create_income
import database
import logging


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


# Startup event before server starts
@asynccontextmanager
async def lifespan(app:FastAPI):
    database.create_db_and_tables()
    logging.info("Database Created")
    
    create_expenses()
    create_income()

    yield


app = FastAPI(lifespan=lifespan)

@app.get("/")
def hello():
    return {"message": "Hello, World"}


app.include_router(expense_router)
app.include_router(income_router)

if __name__ == "__main__":
    database.create_db_and_tables()
    #import uvicorn
    #uvicorn.run(app, host="0.0.0.0", port=8000)