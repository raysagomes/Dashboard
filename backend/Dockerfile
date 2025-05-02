
# Escolhe imagem base oficial do Node
FROM node:20

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependências primeiro (boa prática para cache)
COPY backend/package*.json ./backend/

# Instala as dependências
RUN npm install --prefix backend

# Copia o resto dos arquivos para dentrao do container
COPY backend /app/backend

# Expõe a porta (ajuste se seu backend usar outra)
EXPOSE 5000

# Comando para iniciar o servidor
CMD ["node", "backend/server.js"]

