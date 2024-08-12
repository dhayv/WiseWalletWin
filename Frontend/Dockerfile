FROM node:20-slim

WORKDIR /frontend

COPY package.json /frontend/package.json

COPY package-lock.json /frontend/package-lock.json

ENTRYPOINT ["nginx", "-g", "daemon off;"]