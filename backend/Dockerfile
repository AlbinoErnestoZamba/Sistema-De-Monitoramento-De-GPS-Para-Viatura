# Use a imagem oficial do Node.js como base
FROM node:18

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos de dependências e instalar pacotes
COPY package*.json ./
RUN npm install

# Copiar o restante do código do projeto para dentro do container
COPY . .

# Expor a porta da API
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["npm", "start"]