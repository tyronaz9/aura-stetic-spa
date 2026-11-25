FROM node:24-alpine
WORKDIR /app

# Instalar herramientas de compilación temporales para better-sqlite3
RUN apk add --no-cache --virtual .build-deps python3 make g++

COPY package*.json ./
RUN npm install --omit=dev

# Eliminar herramientas de compilación para mantener la imagen liviana
RUN apk del .build-deps

COPY src ./src

RUN mkdir -p /app/datos && chown node:node /app/datos
ENV NODE_ENV=production DB_ARCHIVO=/app/datos/spa.db

EXPOSE 3000
USER node
CMD ["node", "src/server.js"]