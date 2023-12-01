# Étape 1: Construire l'application
FROM node:14 AS build
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

# Étape 2: Serveur de production
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# Remove the default NGINX configuration (if any) and copy custom NGINX config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
