# backend/api/endpoints/vehicles.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from api.endpoints.dependencies import get_db # Certifique-se que o caminho está correto
from database.schemas import LocationData, VehicleLocationResponse
from database.models import VehicleLastLocationDB # Certifique-se que o caminho está correto
from datetime import datetime, timezone
from services.serial_service import get_serial_locations, _serial_is_connected, _default_location # Importar o _serial_is_connected e _default_location

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
    locations_to_return = [] # Usar um nome diferente para evitar conflito

    # 1. Obter a última localização do banco de dados (se existir)
    last_location_db = db.query(VehicleLastLocationDB).first()
    if last_location_db:
        locations_to_return.append(
            VehicleLocationResponse(
                device_id="LAST_VEHICLE_DB", # ID mais descritivo
                latitude=float(last_location_db.latitude),
                longitude=float(last_location_db.longitude),
                timestamp=last_location_db.updated_at.timestamp(),
                status="from_database", # Status para indicar a fonte
            )
        )

    # 2. Obter localizações da serial (que já inclui a lógica de fallback/padrão)
    serial_locations = get_serial_locations() # Isso agora retorna a localização padrão se a serial falhar
    
    # Se a porta serial estiver conectada e houver dados recentes, priorize-os
    # ou adicione-os como um veículo separado.
    # O `get_serial_locations` já retorna um dicionário com `ARDUINO_SERIAL`.
    for device_id, data in serial_locations.items():
        locations_to_return.append(
            VehicleLocationResponse(
                device_id=device_id,
                latitude=data["latitude"],
                longitude=data["longitude"],
                timestamp=data.get("timestamp", datetime.now().timestamp()), # Garante um timestamp
                status=data.get("status", "unknown"), # Garante um status
            )
        )
    
    # Se não houver NENHUMA localização (nem DB, nem serial), adicione a localização padrão global
    # Isso pode acontecer se o DB estiver vazio e a serial nunca conseguir ler nada.
    if not locations_to_return:
         locations_to_return.append(
            VehicleLocationResponse(
                device_id="DEFAULT_LOCATION",
                latitude=_default_location["latitude"],
                longitude=_default_location["longitude"],
                timestamp=_default_location["timestamp"],
                status=_default_location["status"],
            )
        )

    return locations_to_return

@router.get("/vehicles/{device_id}/location", response_model=VehicleLocationResponse)
async def get_vehicle_location(device_id: str, db: Session = Depends(get_db)):
    # Tenta pegar da serial primeiro (já com fallback interno)
    serial_locations = get_serial_locations()
    if device_id in serial_locations:
        data = serial_locations[device_id]
        return VehicleLocationResponse(
            device_id=device_id,
            latitude=data["latitude"],
            longitude=data["longitude"],
            timestamp=data.get("timestamp", datetime.now().timestamp()),
            status=data.get("status", "unknown"),
        )
    # Se o ID não for da serial, verifica o DB para a última localização geral
    elif device_id == "LAST_VEHICLE_DB": # Usar o ID consistente do get_vehicle_locations
        last_location_db = db.query(VehicleLastLocationDB).first()
        if last_location_db:
            return VehicleLocationResponse(
                device_id="LAST_VEHICLE_DB",
                latitude=float(last_location_db.latitude),
                longitude=float(last_location_db.longitude),
                timestamp=last_location_db.updated_at.timestamp(),
                status="from_database",
            )
    
    # Se nada foi encontrado, retorna a localização padrão global como último recurso
    # ou um 404 para IDs específicos não encontrados.
    # Optando por 404 para um ID específico, mas você pode mudar isso.
    if device_id == "DEFAULT_LOCATION":
         return VehicleLocationResponse(
            device_id="DEFAULT_LOCATION",
            latitude=_default_location["latitude"],
            longitude=_default_location["longitude"],
            timestamp=_default_location["timestamp"],
            status=_default_location["status"],
        )

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Localização para o dispositivo '{device_id}' não encontrada")