import os

SECRET_KEY = os.environ.get("SECRET_KEY", "sua_chave_secreta")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30