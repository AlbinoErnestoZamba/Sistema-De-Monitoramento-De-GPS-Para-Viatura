# backend/api/endpoints/vehicles.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .dependencies import get_db
from database.schemas import LocationData, VehicleLocationResponse
from database.models import VehicleLastLocationDB
from datetime import datetime, timezone
from services.serial_service import get_serial_locations

router = APIRouter()

@router.post("/location")
async def receive_location_data(location: LocationData, db: Session = Depends(get_db)):
    # Salvar a última localização recebida no banco de dados
    db_location = db.query(VehicleLastLocationDB).first()
    if db_location:
        db_location.latitude = location.latitude
        db_location.longitude = location.longitude
        db_location.updated_at = datetime.now(timezone.utc)
    else:
        db_location = VehicleLastLocationDB(
            latitude=location.latitude,
            longitude=location.longitude,
            updated_at=datetime.now(timezone.utc)
        )
        db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return {"message": "Localização recebida com sucesso", "device_id": location.device_id}

@router.get("/vehicles/locations", response_model=list[VehicleLocationResponse])
async def get_vehicle_locations(db: Session = Depends(get_db)):
    locations = []
    # Adicionar a última localização do banco de dados (se existir)
    last_location_db = db.query(VehicleLastLocationDB).first()
    if last_location_db:
        locations.append(
            VehicleLocationResponse(
                device_id="LAST_VEHICLE",
                latitude=float(last_location_db.latitude),
                longitude=float(last_location_db.longitude),
                timestamp=last_location_db.updated_at.timestamp(),
                status=None,  # Status não está na tabela vehicle_last_location
            )
        )
    # Adicionar localizações recebidas via serial (memória)
    serial_locations = get_serial_locations()
    for device_id, data in serial_locations.items():
        locations.append(
            VehicleLocationResponse(
                device_id=device_id,
                latitude=data["latitude"],
                longitude=data["longitude"],
                timestamp=data.get("timestamp"),
                status=data.get("status"),
            )
        )
    return locations

@router.get("/vehicles/{device_id}/location", response_model=VehicleLocationResponse)
async def get_vehicle_location(device_id: str, db: Session = Depends(get_db)):
    serial_locations = get_serial_locations()
    if device_id in serial_locations:
        data = serial_locations[device_id]
        return VehicleLocationResponse(
            device_id=device_id,
            latitude=data["latitude"],
            longitude=data["longitude"],
            timestamp=data.get("timestamp"),
            status=data.get("status"),
        )
    elif device_id == "LAST_VEHICLE":
        last_location_db = db.query(VehicleLastLocationDB).first()
        if last_location_db:
            return VehicleLocationResponse(
                device_id="LAST_VEHICLE",
                latitude=float(last_location_db.latitude),
                longitude=float(last_location_db.longitude),
                timestamp=last_location_db.updated_at.timestamp(),
                status=None,
            )
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Localização do dispositivo não encontrada")