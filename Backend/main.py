import logging
import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from data_base.database import init_db
from data_base.db_utils import check_connection
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Expense, Income, Users
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
    await init_db(models=[Users, Expense, Income])
    logging.info("Database Created")

    await check_connection()

    yield


app = FastAPI(lifespan=lifespan, debug=True)

origins = os.getenv('ORIGIN_URL')


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
