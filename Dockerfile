# imagen base
FROM node:20-alpine

# directorio de trabajo dentro del contenedor
WORKDIR /app

# copiamos el package.json primero para aprovechar el cache de Docker
COPY package*.json ./

# instalamos las dependencias
RUN npm install --production

# copiamos el resto del código
COPY . .

# exponemos el puerto
EXPOSE 3000

# comando para arrancar la app
CMD ["node", "src/server.js"]