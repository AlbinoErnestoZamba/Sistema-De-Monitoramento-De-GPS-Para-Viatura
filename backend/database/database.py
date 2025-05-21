# backend/database/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

DB_USER = os.environ.get("POSTGRES_USER", "azamba")
DB_PASSWORD = os.environ.get("POSTGRES_PASSWORD", "1234")
DB_HOST = "localhost"
DB_PORT = "5434"
DB_NAME = os.environ.get("POSTGRES_DB", "gps_tracker")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()