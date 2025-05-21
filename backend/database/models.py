# backend/database/models.py
from sqlalchemy import Column, Integer, String, DateTime, Float, Numeric
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime(timezone=True), default=func.now())

class VehicleLastLocationDB(Base):
    __tablename__ = "vehicle_last_location"
    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Numeric(9, 6))
    longitude = Column(Numeric(9, 6))
    updated_at = Column(DateTime(timezone=True), default=func.now())