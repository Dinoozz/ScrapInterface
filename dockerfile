# Étape 1: Construire l'application
FROM node:14 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 80
CMD ["npm", "run", "start"]


