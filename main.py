from fastapi import FastAPI
from starlette.events import LifespanStartupComplete
from starlette.middleware.base import BaseHTTPMiddleware
from router.expenses import router as expense_router
from router.income import router as income_router
import database

class StartupEventMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if isinstance(request, LifespanStartupComplete):
            # Your startup code here
            await database.create_db_and_tables()
            print("Database Created")
        response = await call_next(request)
        return response

app = FastAPI()
app.add_middleware(StartupEventMiddleware)
app.include_router(income_router)
app.include_router(expense_router)