
# Stage 1: Build React
FROM node:20.12.2-alpine3.19 as builder

# Set the working directory in the container
WORKDIR /code

COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install --fetch-timeout=300000

# Copy the current directory contents into the container at /app
COPY . .

RUN npm run build

# Stage 2: Serve the Build React
FROM alpine:latest
WORKDIR /srv
COPY --from=builder /code/build .
