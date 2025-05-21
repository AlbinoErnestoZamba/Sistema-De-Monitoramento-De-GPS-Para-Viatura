# backend/database/schemas.py
from pydantic import BaseModel
from datetime import datetime

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Estas classes foram movidas para fora de UserResponse ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class LocationData(BaseModel):
    device_id: str
    latitude: float
    longitude: float
    timestamp: float = None
    status: str = None

class VehicleLocationResponse(BaseModel):
    device_id: str
    latitude: float
    longitude: float
    timestamp: float | None
    status: str | None

    class Config:
        from_attributes = True