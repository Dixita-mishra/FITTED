from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class UserProfile(BaseModel):
    id: str = "usr_01"
    name: str = "Dixita Mishra"
    email: str = "dixita.mishra@fitted.ai"
    avatar: str = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    styleScore: int = 88
    bodyType: str = "Athletic Trapezoid"
    undertone: str = "Warm Golden"

@router.post("/login")
async def login(req: LoginRequest):
    return {
        "success": True,
        "token": "fitted_jwt_token_fastapi_2026",
        "user": UserProfile(email=req.email).dict()
    }

@router.post("/register")
async def register(req: RegisterRequest):
    return {
        "success": True,
        "token": "fitted_jwt_token_fastapi_2026",
        "user": UserProfile(name=req.name, email=req.email).dict()
    }

@router.get("/me")
async def get_me():
    return UserProfile().dict()
