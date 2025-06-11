# backend/test_db.py
import sys
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Ajuste o sys.path para carregar .env
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, os.pardir))
sys.path.insert(0, project_root)

dotenv_path = os.path.join(project_root, '.env')
load_dotenv(dotenv_path=dotenv_path)

# --- ALTERAÇÃO TEMPORÁRIA AQUI ---
# Comente ou remova a linha abaixo e use uma string fixa para DATABASE_URL
# DATABASE_URL = os.getenv("DATABASE_URL")
DATABASE_URL = "postgresql://gps_user:your_password@localhost:5434/gps_tracker"
# Substitua 'gps_user' e 'your_password' pelos seus valores reais
# --- FIM DA ALTERAÇÃO TEMPORÁRIA ---


if not DATABASE_URL:
    print("Erro: DATABASE_URL não encontrado no .env. Verifique seu arquivo .env.")
    sys.exit(1)

print(f"Tentando conectar ao banco de dados com DATABASE_URL: {DATABASE_URL.split('@')[1]}")

# Importe os modelos aqui
from backend.database.models import Base, User, VehicleLastLocationDB

try:
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    print("Tabelas criadas com sucesso (ou já existiam).")

    # Teste uma inserção simples na tabela VehicleLastLocationDB
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    try:
        from datetime import datetime, timezone
        new_location = VehicleLastLocationDB(latitude=12.345, longitude=67.890, updated_at=datetime.now(timezone.utc))
        db.add(new_location)
        db.commit()
        print("Inserção de teste em 'vehicle_last_location' bem-sucedida!")
    except Exception as e:
        db.rollback()
        print(f"Erro ao inserir dados de teste: {e}")
    finally:
        db.close()

except Exception as e:
    print(f"Erro ao conectar ou criar tabelas: {e}")