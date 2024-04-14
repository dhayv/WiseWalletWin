# Use an official Node runtime as a parent image
FROM node:20.12.2-alpine3.19

# Set the working directory in the container
WORKDIR /code

COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the current directory contents into the container at /app
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable
ENV NODE_ENV production

# Run npm start when the container launches
CMD ["npm", "start"]
