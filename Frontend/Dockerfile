FROM node:20-slim

WORKDIR /frontend

COPY package.json /frontend/package.json

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port Vite uses
EXPOSE 5173

# Command to run the Vite development server
CMD ["npm", "run", "dev", "--host "]