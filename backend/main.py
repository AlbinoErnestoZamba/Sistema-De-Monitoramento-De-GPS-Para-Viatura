import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import serial
import random
from datetime import datetime, timedelta
from pydantic import BaseModel
import httpx
from urllib.parse import quote_plus # Para URL-encode a mensagem

# Carregar variáveis de ambiente do .env
load_dotenv()

app = FastAPI()

# --- Configuração CORS ---
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- FIM DA CONFIGURAÇÃO CORS ---

# --- Configuração da Porta Serial do Arduino ---
ARDUINO_SERIAL_PORT = os.getenv("ARDUINO_SERIAL_PORT", "/dev/ttyACM0")
ARDUINO_BAUD_RATE = 9600

# Variáveis globais para controle de tempo e localização fixa
start_time = datetime.now()
FIXED_LATITUDE = -8.8385396
FIXED_LONGITUDE = 13.2207316

# Variável global para a porta serial (evita abrir/fechar repetidamente)
arduino_serial = None

# --- Configuração da API do SMS Hub Angola ---
SMS_HUB_BASE_SEND_SMS_URL = os.getenv("SMS_HUB_BASE_SEND_SMS_URL", "https://app.smshubangola.com/api/sendsms")
SMS_HUB_AUTH_ID = os.getenv("SMS_HUB_AUTH_ID") # Seu auth_id (18 caracteres numéricos)
SMS_HUB_SECRET_KEY = os.getenv("SMS_HUB_SECRET_KEY") # Sua secret_key (100 caracteres alfanuméricos)
SMS_HUB_FROM = os.getenv("SMS_HUB_FROM", "SMSHUB") # Seu Sender ID

@app.on_event("startup")
async def startup_event():
    """Abre a porta serial na inicialização da aplicação FastAPI."""
    global arduino_serial, start_time
    start_time = datetime.now()
    try:
        arduino_serial = serial.Serial(ARDUINO_SERIAL_PORT, ARDUINO_BAUD_RATE, timeout=1)
        print(f"Porta serial {ARDUINO_SERIAL_PORT} aberta com sucesso.")
    except serial.SerialException as e:
        print(f"Erro ao abrir a porta serial {ARDUINO_SERIAL_PORT}: {e}")
        arduino_serial = None

@app.on_event("shutdown")
async def shutdown_event():
    """Fecha a porta serial no desligamento da aplicação FastAPI."""
    global arduino_serial
    if arduino_serial and arduino_serial.is_open:
        arduino_serial.close()
        print(f"Porta serial {ARDUINO_SERIAL_PORT} fechada.")

# --- Rota de teste simples ---
@app.get("/")
async def root():
    return {"message": "Bem-vindo ao Sistema de Monitoramento de GPS para Viatura (Backend - Com Arduino Serial)"}

# --- ENDPOINT: Localização mais recente do veículo ---
@app.get("/api/veiculo_localizacao_mais_recente")
async def get_latest_vehicle_location():
    global start_time

    current_time = datetime.now()
    time_elapsed = current_time - start_time
    
    latitude = 0.0
    longitude = 0.0
    status = "conectado"
    
    if time_elapsed.total_seconds() < 120:
        base_lat = -8.8385396
        base_lon = 13.2207316
        latitude = base_lat + (random.random() - 0.5) * 0.05
        longitude = base_lon + (random.random() - 0.5) * 0.05
        status = "em_movimento"
    else:
        latitude = FIXED_LATITUDE
        longitude = FIXED_LONGITUDE
        status = "parado"
    
    current_hour = datetime.now().strftime('%H:%M:%S')

    return {
        "device_id": "VEICULO-SIMIONE-MUCUNE",
        "latitude": latitude,
        "longitude": longitude,
        "status": status,
        "hora": current_hour
    }

# --- Endpoints de Comando (INTERAGEM COM O ARDUINO) ---
async def send_command_to_arduino(command: str):
    """Envia um comando para o Arduino via porta serial."""
    global arduino_serial
    if arduino_serial and arduino_serial.is_open:
        try:
            arduino_serial.write(f"{command}\n".encode('utf-8'))
            print(f"Comando '{command}' enviado para o Arduino.")
            return True
        except serial.SerialException as e:
            raise HTTPException(status_code=500, detail=f"Erro de comunicação serial: {e}. Verifique a conexão com o Arduino.")
    else:
        raise HTTPException(status_code=503, detail="Porta serial do Arduino não está aberta ou conectada.")

@app.post("/api/comando/desligar_carro")
async def desligar_carro_real():
    """Envia o comando 'DESLIGAR' para o Arduino."""
    await send_command_to_arduino("DESLIGAR")
    return {"message": "Comando para DESLIGAR o carro enviado ao Arduino."}

@app.post("/api/comando/ligar_carro")
async def ligar_carro_real():
    """Envia o comando 'LIGAR' para o Arduino."""
    await send_command_to_arduino("LIGAR")
    return {"message": "Comando para LIGAR o carro enviado ao Arduino."}

class MessagePayload(BaseModel):
    mensagem: str
    numeroTelefone: str

@app.post("/api/comando/enviar_mensagem")
async def enviar_mensagem_sms_hub(payload: MessagePayload):
    """Envia a mensagem via SMS Hub Angola API usando solicitação GET."""
    if not SMS_HUB_AUTH_ID or not SMS_HUB_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Credenciais SMS Hub (auth_id ou secret_key) não configuradas nas variáveis de ambiente.")
    if not SMS_HUB_BASE_SEND_SMS_URL:
        raise HTTPException(status_code=500, detail="SMS_HUB_BASE_SEND_SMS_URL não configurada nas variáveis de ambiente.")

    # A documentação mostra 'to=7878878XX,7878874XX' -> sugere números sem o prefixo +244.
    # Se o frontend enviar '+244923456789', remova o '+244'.
    # Se o frontend já enviar '923456789', use-o diretamente.
    numero_para_api = payload.numeroTelefone.replace("+244", "")
    
    # URL-encode a mensagem para garantir que caracteres especiais ou espaços funcionem
    encoded_message = quote_plus(payload.mensagem)

    # Constrói o URL completo com os parâmetros para a requisição GET
    request_url = (
        f"{SMS_HUB_BASE_SEND_SMS_URL}"
        f"?to={numero_para_api}"
        f"&message={encoded_message}"
        f"&auth_id={SMS_HUB_AUTH_ID}"
        f"&secret_key={SMS_HUB_SECRET_KEY}"
        f"&from={SMS_HUB_FROM}"
    )

    print(f"Tentando enviar SMS para: {request_url}") # Útil para depuração

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(request_url)
            response.raise_for_status() # Lança exceção para erros HTTP (4xx ou 5xx)

            # A resposta da API é JSON, baseando-me nos exemplos de status 200 - ok
            response_json = response.json()
            print(f"Resposta SMS Hub Angola: {response_json}")

            # Verifica o status dentro da resposta JSON
            if response_json.get("status") == 200: # O status é numérico 200
                 return {"message": f"Mensagem enviada com sucesso via SMS Hub Angola para {payload.numeroTelefone}."}
            else:
                # Se a API retornar um status diferente de 200 com mensagem de erro
                error_message = response_json.get("message", "Erro desconhecido da API SMS Hub Angola.")
                raise HTTPException(
                    status_code=500, # Ou o status_code retornado pela API, se for apropriado
                    detail=f"Falha ao enviar SMS (API retornou status {response_json.get('status')}): {error_message}"
                )

        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Erro de rede ao comunicar com SMS Hub Angola: {e}")
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Erro da API SMS Hub Angola: {e.response.text}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro inesperado ao enviar SMS: {e}")