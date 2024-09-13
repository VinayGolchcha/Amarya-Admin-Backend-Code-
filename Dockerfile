# Use a base image with Conda
FROM continuumio/miniconda3:latest

# Set the working directory in the container
WORKDIR /app

# Install Node.js
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs

# Copy the package.json and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy the entire app directory (including the Node.js server and Python scripts)
COPY . .

# Set up the Conda environment using environment.yml
COPY environment.yml .
RUN conda env create -f environment.yml

# Explicitly activate the Conda environment using conda init
RUN conda init bash

# Ensure the Conda environment is activated
SHELL ["conda", "run", "-n", "conda_env", "/bin/bash", "-c"]

# Expose port 3000 for Node.js server
EXPOSE 3000

# Start the Node.js server in Conda environment
CMD ["bash", "-c", "source activate conda_env && npm start"]
