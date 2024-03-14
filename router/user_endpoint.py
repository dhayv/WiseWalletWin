from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, select
from models import Users, UserIn, UserOut, UserUpdate
from database import get_db
from datetime import  timedelta
from auth import (get_password_hash, Token, ACCESS_TOKEN_EXPIRES_MINUTES, 
                  create_access_token, authenticate_user, get_current_active_user)
from fastapi.security import OAuth2PasswordRequestForm
from calculations import sum_of_all_expenses, income_minus_expenses



router = APIRouter()

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/user", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def add_user(user: UserIn, db: Session = Depends(get_db)):
    hashed_password = get_password_hash(user.password)  
    db_user = Users(
        username=user.username, 
        email=user.email, 
        hashed_password=hashed_password, 
        first_name=user.first_name,
        phone_number=user.phone_number
        )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user



@router.get("/user/me", response_model=UserOut)
async def read_user_me(current_user: Users = Depends(get_current_active_user)):
    return current_user

@router.get("/user/{user_id}", response_model=UserOut)
async def read_user(user_id: int, db: Session = Depends(get_db)):
    statement = select(Users).where(Users.id == user_id)
    result = db.exec(statement).first()
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return result 


@router.get("user/me/total_expenses")
def read_total_expenses(current_user: Users = Depends(get_current_active_user), db: Session = Depends(get_db)):
    user_id = current_user.id
    return sum_of_all_expenses(user_id, db)


@router.get("user/me/income_minus_expenses")
def read_total_income_minus_expenses(current_user: Users = Depends(get_current_active_user), db: Session = Depends(get_db)):
    user_id = current_user.id
    return income_minus_expenses(user_id, db)


@router.put("/user/{user_id}", response_model=UserOut)
async def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    statement = select(Users).where(Users.id == user_id)
    result = db.exec(statement).first()
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_update.model_dump(exclude_unset=True)

    if "password" in update_data:
        hashed_password = get_password_hash(update_data["password"])
        update_data["password"] = hashed_password
        del update_data["password"]

    for key, value in update_data.items():
        setattr(result, key if key != "hashed_password" else "hashed_password", value)

    db.add(result) 
    db.commit()
    db.refresh(result)
    return result

@router.delete("/user/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    statement = select(Users).where(Users.id == user_id)
    result = db.exec(statement).first()
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(result)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)