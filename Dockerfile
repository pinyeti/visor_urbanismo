# Usa una imagen base de Node.js
FROM node:14.16.1-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/visor_urbanismo

# Copia el archivo package.json y package-lock.json para instalar las dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD [ "node", "./bin/www" ]
