from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, select
from models import Users
from database import get_db, engine
from datetime import  datetime


router = APIRouter()


@router.post("/user", response_model=Users)
def add_user(user: Users, db: Session = Depends(get_db)):
    db.add(Users)
    db.commit()
    return {"message": "New user"}


@router.get("/user/{user_id}", response_model=Users)


@router.put("/user/{user_id}", response_model=Users)


@router.delete("/user/{user_id}", response_model=Users)
