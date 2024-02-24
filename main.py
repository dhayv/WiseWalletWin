from fastapi import FastAPI
from contextlib import asynccontextmanager
from router.expenses import router as expense_router
from router.income import router as income_router
import database

print("line before api")
app = FastAPI()

print("line after api")
@asynccontextmanager
async def lifespan(app:FastAPI):
    await database.create_db_and_tables()
    print("Database Created")
    #try:
        #yield
    #finally:
        # Cleanup code here, if necessary
        #print("Application shutdown")

@app.router.lifespan_context
async def lifespan(app):
    async with lifespan():
        yield




app.include_router(expense_router, prefix="/expenses")
app.include_router(income_router, prefix="/income")

