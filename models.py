from sqlmodel import SQLModel, Field
from typing import Optional
from pydantic import validator, BaseModel, EmailStr
from datetime import date, datetime
import re


phone_number_regex = r"^(?:\(\d{3}\)|\d{3}-?)\d{3}-?\d{4}$"
# model to be shared across user classes excluding password
class BaseUser(SQLModel):
    username: str
    email: str
    first_name: Optional[str] = None
    phone_number: Optional[str] = Field(default=None, regex=phone_number_regex)




password_regex = "((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})"

# UserIn for input data
class UserIn(BaseUser):
    password: str  = Field(...,regex=password_regex)

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


class Income(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    amount: float = Field(index=True)
    recent_pay: date = Field(index=True) # Ensuring this is a date object
    last_pay: Optional[date] = None  # This can be None or a date object

    user_id: Optional[int] = Field(default=None, foreign_key="users.id", unique=True, index=True)

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
    name: str = Field(index=True)
    amount: float = Field(index=True)
    due_date: Optional[int] = Field( default= None, index=True) # Due date of the expense (days of the month(1-30 or 31))

    users_id: Optional[int] = Field(default=None, foreign_key="users.id", index=True)
    income_id: Optional[int] = Field(default=None, foreign_key="income.id", index=True)
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

