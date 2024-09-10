# Dockerfile for deploying Node.js backend to Render

# Use an official Node runtime as a parent image
FROM node:18-bullseye-slim

# Install latest npm
RUN npm i npm@latest -g

# Update apt-get and install netcat (for any health checks)
RUN apt-get update && apt-get install -y netcat

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy the remaining source code to the container
COPY . .

# Set environment variable for the port
ENV PORT 3000

# Expose the port
EXPOSE $PORT

# Run the application
CMD [ "node", "app.js" ]
