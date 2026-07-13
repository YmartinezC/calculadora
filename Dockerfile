# ETAPA 1: Entorno de Validación Funcional (tester)
FROM node:24-alpine AS tester
WORKDIR /app
# Copiar manifiestos de dependencias de Node.js
COPY package*.json ./
# Instalar las dependencias de desarrollo (Jest)
RUN npm install
# Copiar todo el código fuente al contenedor para las pruebas
COPY . .
# Ejecutar de forma obligatoria la suite de 18 pruebas unitarias
RUN npm test
# ETAPA 2: Entorno de Despliegue en Producción (Nginx)
FROM nginx:alpine
# Copiar los componentes estáticos al directorio de Nginx
COPY index.html /usr/share/nginx/html/index.html
COPY calculadora-conversor.html /usr/share/nginx/html/calculadora-conversor.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY script.js /usr/share/nginx/html/script.js
COPY calculadora-logic.js /usr/share/nginx/html/calculadora-logic.js
# Exponer el puerto estándar HTTP del contenedor
EXPOSE 80
# Inicializar el servidor web Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]