# backend/services/serial_service.py
import serial
import os
import time
import asyncio
from datetime import datetime

SERIAL_PORT = os.environ.get("SERIAL_PORT", '/dev/ttyUSB0')
SERIAL_BAUD = int(os.environ.get("SERIAL_BAUD", 9600))

# Variável para armazenar a instância da porta serial
_serial_connection = None
# Dicionário local para dados da serial (armazenará a última leitura válida)
_vehicle_locations_serial = {}

# Localização padrão para fallback
# Exemplo: Luanda, Angola. Ajuste conforme a área de operação.
_default_location = {
    "latitude": -8.838333,
    "longitude": 13.234444,
    "timestamp": datetime.now().timestamp(),
    "status": "offline" # Indicar que é uma localização padrão/offline
}

# Variável para indicar se a porta serial foi aberta com sucesso
_serial_is_connected = False

def initialize_serial():
    global _serial_connection, _serial_is_connected
    if _serial_connection and _serial_connection.is_open:
        return True # Já conectado

    try:
        _serial_connection = serial.Serial(SERIAL_PORT, SERIAL_BAUD, timeout=1)
        _serial_is_connected = True
        print(f"Conectado à porta serial: {SERIAL_PORT} na velocidade {SERIAL_BAUD}")
        return True
    except serial.SerialException as e:
        _serial_is_connected = False
        _serial_connection = None # Garante que a conexão inválida seja fechada
        print(f"Erro ao conectar à porta serial {SERIAL_PORT}: {e}")
        return False
    except Exception as e:
        _serial_is_connected = False
        _serial_connection = None
        print(f"Erro inesperado ao inicializar a porta serial: {e}")
        return False

def read_serial_data():
    global _vehicle_locations_serial, _serial_connection

    if not _serial_is_connected:
        print("Porta serial não conectada para leitura.")
        return # Não tenta ler se não estiver conectada

    if _serial_connection and _serial_connection.is_open:
        try:
            line = _serial_connection.readline().decode('utf-8').strip()
            if line:
                print(f"Dados recebidos da serial: {line}")
                # Exemplo: "Latitude: -8.8383 Longitude: 13.2344"
                if "Latitude:" in line and "Longitude:" in line:
                    try:
                        parts = line.split()
                        latitude_str = None
                        longitude_str = None
                        for part in parts:
                            if part.startswith("Latitude:"):
                                latitude_str = part.split(":")[1]
                            elif part.startswith("Longitude:"):
                                longitude_str = part.split(":")[1]

                        if latitude_str and longitude_str:
                            latitude = float(latitude_str)
                            longitude = float(longitude_str)
                            device_id = "ARDUINO_SERIAL" # Ou um ID real do dispositivo
                            timestamp = time.time()
                            _vehicle_locations_serial[device_id] = {"latitude": latitude, "longitude": longitude, "timestamp": timestamp, "status": "online"}
                            print(f"Localização serial extraída: Lat={latitude}, Lng={longitude}")
                        else:
                            print(f"Formato de linha GPS inválido: {line}")
                    except ValueError:
                        print(f"Erro ao converter latitude ou longitude '{latitude_str}', '{longitude_str}' para float")
                else:
                    print(f"Linha da serial não reconhecida como dados de GPS: {line}")
        except serial.SerialException as e:
            print(f"Erro ao ler da porta serial: {e}. Tentando reconectar...")
            _serial_connection.close() # Tenta fechar a conexão problemática
            initialize_serial() # Tenta reabrir
        except UnicodeDecodeError:
            print(f"Erro de decodificação de caractere da porta serial: {line[:50]}...")
        except Exception as e:
            print(f"Erro inesperado durante a leitura serial: {e}")
    else:
        print("Porta serial não está aberta ou não está conectada. Tentando reconectar...")
        initialize_serial() # Tenta reabrir se não estiver aberta

async def serial_reader_task():
    # Garante que a serial seja inicializada antes de começar a tarefa
    await asyncio.to_thread(initialize_serial) # Executa initialize_serial em um thread separado

    while True:
        await asyncio.to_thread(read_serial_data) # Executa read_serial_data em um thread separado
        await asyncio.sleep(1) # Intervalo de 1 segundo entre leituras

def get_serial_locations():
    """
    Retorna a última localização lida da serial.
    Se a porta serial não estiver conectada ou não houver dados,
    retorna a última localização conhecida ou uma localização padrão.
    """
    # Retorna o dicionário _vehicle_locations_serial se tiver dados válidos
    if _vehicle_locations_serial:
        return _vehicle_locations_serial
    # Se não houver dados da serial, retorna a localização padrão para 'ARDUINO_SERIAL'
    # Esta é a localização fallback quando a serial está indisponível ou não leu nada ainda
    return {"ARDUINO_SERIAL": _default_location}

# Função para fechar a porta serial (chamada no lifespan)
def close_serial():
    global _serial_connection
    if _serial_connection and _serial_connection.is_open:
        print("Fechando porta serial...")
        _serial_connection.close()
        _serial_connection = None
        print("Porta serial fechada.")