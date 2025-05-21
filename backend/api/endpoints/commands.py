# backend/api/endpoints/commands.py
from fastapi import APIRouter, HTTPException, status
from services.serial_service import ser

router = APIRouter()

@router.post("/comando/desligar_carro")
async def desligar_carro():
    if ser and ser.is_open:
        ser.write(b"DESLIGAR_CARRO\n")
        return {"message": "Comando de desligar carro enviado"}
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Arduino não conectado")

@router.post("/comando/ligar_carro")
async def ligar_carro():
    if ser and ser.is_open:
        ser.write(b"LIGAR_CARRO\n")
        return {"message": "Comando de ligar carro enviado"}
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Arduino não conectado")