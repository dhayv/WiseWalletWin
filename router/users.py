from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, select
from models import Users
from database import get_db, engine
from datetime import  datetime


router = APIRouter()


@router.post("/user")
def add_user(user: Users, db: Session = Depends(get_db)):
    db.add(Users)
    db.commit()
    return {"message": "New user"}



