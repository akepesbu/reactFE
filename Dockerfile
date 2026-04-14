# STAGE 0 - Build frontend Assets

FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# STAGE 1 - SERVE FRONTEND ASSETS
FROM fholzer/nginx-brotli:latest
WORKDIR /etc/nginx
ADD nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["-g", "daemon off;"]

