FROM node:18-bullseye-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app to the container
COPY . .

# Set environment variables
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
