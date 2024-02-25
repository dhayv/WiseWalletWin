from fastapi import FastAPI
from contextlib import asynccontextmanager
from router.expenses import router as expense_router
from router.income import router as income_router
import database 
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

logging.info("line before api")

logging.info("line after api")
@asynccontextmanager
async def lifespan(app:FastAPI):
    database.create_db_and_tables()
    logging.info("Database Created")
    #try:
    yield
    #finally:
        # Cleanup code here, if necessary
        #print("Application shutdown")

app = FastAPI(lifespan=lifespan)

@app.get("/")
def hello():
    return {"message": "Hello, World"}


app.include_router(expense_router, prefix="/expenses")
app.include_router(income_router, prefix="/income")

if __name__ == "__main__":
    database.create_db_and_tables()
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)