# backend/api/endpoints/commands.py
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from services.sms_service import send_sms
# Importar funções de serviço serial
from services.serial_service import initialize_serial, _serial_is_connected, _serial_connection # Importe a conexão serial

router = APIRouter()

# ====================================================================
# Seus endpoints existentes para controle do carro via serial (Arduino)
# ====================================================================
@router.post("/comando/desligar_carro")
async def desligar_carro():
    # Tenta inicializar/conectar a serial se não estiver já conectada
    if not _serial_is_connected:
        if not initialize_serial(): # Tenta conectar e verifica o resultado
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Não foi possível conectar ao Arduino. Porta serial não aberta.")
    
    # Agora que sabemos que a porta está conectada (ou tentou ser conectada)
    if _serial_connection and _serial_connection.is_open:
        try:
            _serial_connection.write(b"DESLIGAR\n") # Use _serial_connection
            print("Backend: Enviando comando DESLIGAR para a serial.")
            return {"message": "Comando para desligar o carro enviado!"}
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao enviar comando para o Arduino: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Arduino não conectado ou porta serial não aberta após tentativa.")

@router.post("/comando/ligar_carro")
async def ligar_carro():
    # Tenta inicializar/conectar a serial se não estiver já conectada
    if not _serial_is_connected:
        if not initialize_serial(): # Tenta conectar e verifica o resultado
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Não foi possível conectar ao Arduino. Porta serial não aberta.")

    # Agora que sabemos que a porta está conectada (ou tentou ser conectada)
    if _serial_connection and _serial_connection.is_open:
        try:
            _serial_connection.write(b"LIGAR\n") # Use _serial_connection
            print("Backend: Enviando comando LIGAR para a serial.")
            return {"message": "Comando para ligar o carro enviado!"}
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao enviar comando para o Arduino: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Arduino não conectado ou porta serial não aberta após tentativa.")

# ====================================================================
# NOVO/ATUALIZADO: Endpoint para ENVIAR MENSAGEM (USANDO TERMII API)
# ====================================================================

class EnviarMensagemPayload(BaseModel):
    mensagem: str
    numeroTelefone: str

@router.post("/comando/enviar_mensagem", status_code=status.HTTP_200_OK)
async def enviar_mensagem(sms_data: EnviarMensagemPayload):
    print(f"Backend: Recebida solicitação para enviar SMS para {sms_data.numeroTelefone} com conteúdo: '{sms_data.mensagem}'")

    result = send_sms(to_number=sms_data.numeroTelefone, message_text=sms_data.mensagem)

    if result.get("status") == "success":
        return {"message": "SMS enviado com sucesso!", "data": result["data"]}
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result.get("message", "Erro desconhecido ao enviar SMS."), # Mensagem corrigida
        )