from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import Optional

from app.db.session import get_db
from app.models.models import User, Setting
from app.schemas.db_schemas import UserCreate, UserResponse, Token, UserLogin
from app.core.security import get_password_hash, verify_password, create_access_token
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    hashed_pwd = get_password_hash(user_in.password)
    user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=hashed_pwd,
        role="USER" # first user could be admin or we can check organizational flags later
    )
    db.add(user)
    db.flush() # get user.id

    # Create default settings record as per Section 51
    settings = Setting(
        user_id=user.id,
        protection_enabled=True,
        detection_mode="standard",
        processing_mode="realtime",
        notification_enabled=True
    )
    db.add(settings)
    db.commit()
    db.refresh(user)

    # Issue access token
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

async def get_form_data(request: Request):
    try:
        content_type = request.headers.get("content-type", "")
        if "application/x-www-form-urlencoded" in content_type or "multipart/form-data" in content_type:
            form = await request.form()
            username = form.get("username")
            password = form.get("password")
            if username and password:
                class MockForm:
                    def __init__(self, u, p):
                        self.username = u
                        self.password = p
                return MockForm(username, password)
    except Exception:
        pass
    return None

# Standard OAuth2 route supporting standard form login and JSON payloads
@router.post("/login", response_model=Token)
def login(
    form_data = Depends(get_form_data),
    json_data: Optional[UserLogin] = None,
    db: Session = Depends(get_db)
):
    email = None
    password = None

    if form_data:
        email = form_data.username
        password = form_data.password
    elif json_data:
        email = json_data.email
        password = json_data.password
    
    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username/email and password required"
        )

    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # Update last login timestamp
    user.last_login = datetime.now(timezone.utc)
    db.commit()

    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
def logout():
    return {"message": "Successfully logged out"}
