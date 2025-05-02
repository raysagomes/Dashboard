
# Escolhe imagem base oficial do Node
FROM node:20

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências primeiro (boa prática para cache)
COPY frontend/package*.json ./frontend/

# Instala as dependências
RUN npm install --prefix frontend

# Copia o resto dos arquivos do frontend para dentro do container
COPY frontend /app/frontend

# Expondo a porta (ajuste conforme necessário)
EXPOSE 5173

# Comando para iniciar o servidor do frontend
CMD ["npm", "run", "dev", "--prefix", "frontend"]
 
