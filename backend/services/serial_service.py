import serial
import os
import time
import asyncio

SERIAL_PORT = os.environ.get("SERIAL_PORT", '/dev/ttyUSB0')
SERIAL_BAUD = int(os.environ.get("SERIAL_BAUD", 9600))

ser = None
vehicle_locations_serial = {} # Dicionário local para dados da serial

try:
    ser = serial.Serial(SERIAL_PORT, SERIAL_BAUD, timeout=1)
    print(f"Conectado à porta serial: {SERIAL_PORT} na velocidade {SERIAL_BAUD}")
except serial.SerialException as e:
    print(f"Erro ao conectar à porta serial {SERIAL_PORT}: {e}")

def read_serial_data():
    global vehicle_locations_serial
    if ser and ser.is_open:
        try:
            line = ser.readline().decode('utf-8').strip()
            if line:
                print(f"Dados recebidos da serial: {line}")
                if line.startswith("Latitude:") and "Longitude:" in line:
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
                            device_id = "ARDUINO_SERIAL"
                            timestamp = time.time()
                            vehicle_locations_serial[device_id] = {"latitude": latitude, "longitude": longitude, "timestamp": timestamp, "status": "em_movimento"}
                            print(f"Localização serial extraída: Lat={latitude}, Lng={longitude}")
                    except ValueError:
                        print("Erro ao converter latitude ou longitude da serial para float")
        except serial.SerialException as e:
            print(f"Erro ao ler da porta serial: {e}")
        except UnicodeDecodeError:
            print("Erro de decodificação da porta serial")

async def serial_reader_task():
    while True:
        read_serial_data()
        await asyncio.sleep(1)

def get_serial_locations():
    return vehicle_locations_serial