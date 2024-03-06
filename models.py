from sqlmodel import SQLModel, Field
from typing import Optional
from pydantic import validator, BaseModel, EmailStr
from datetime import date, datetime


class Income(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    amount: float
    recent_pay: date  # Ensuring this is a date object
    last_pay: Optional[date] = None  # This can be None or a date object

    # Validator for recent_pay
    @validator('recent_pay', pre=True)
    def parse_recent_pay(cls, value):
        if isinstance(value, str):
            return datetime.strptime(value, "%m-%d-%Y").date()
        return value

    # Validator for last_pay
    @validator('last_pay', pre=True)
    def parse_last_pay(cls, value):
        if value is not None and isinstance(value, str):
            return datetime.strptime(value, "%m-%d-%Y").date()
        return value
        
class IncomeUpdate(BaseModel):
    amount: Optional[float] = None
    recent_pay: Optional[date] = None
    last_pay: Optional[date] = None  # Last pay date two weeks prior to recent_pay MM-DD-YYYY


class Expense(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    amount: float
    due_date: Optional[int] = None # Due date of the expense (days of the month(1-30 or 31))
    @validator('due_date')
    def check_due_date(cls, v):
        if v is None:
            return v
        if v < 1 or v >= 31:
            raise ValueError("Due date must be between 1 and 31")
        return v

# Pydantic Models for Request Validation and Serialization
class ExpenseUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = None
    due_date: Optional[int] = None    

# model to be shared across user classes excluding password
class BaseUser(SQLModel):
    username: str
    email: EmailStr
    first_name: Optional[str] = None

# UserIn for input data, using EmailStr for validation
class UserIn(BaseUser):
    password: str  


# in output model
class UserOut(BaseUser):
    id: int  


class Users(BaseUser, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    password: Optional[str] = None