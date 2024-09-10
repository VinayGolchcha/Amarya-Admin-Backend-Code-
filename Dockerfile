# Use an official Node runtime as a parent image
FROM node:18-bullseye-slim

# Install latest npm
RUN npm i npm@latest -g

# Update apt-get and install necessary packages
RUN apt-get update && \
    apt-get install -y \
    curl \
    netcat \
    bash

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package.json .
COPY package-lock.json .

# Install Node.js dependencies
RUN npm install

# Copy the remaining source code to the container
COPY . .

# Install Miniconda
RUN curl -o /tmp/Miniconda3-latest-Linux-x86_64.sh https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh && \
    bash /tmp/Miniconda3-latest-Linux-x86_64.sh -b -p /opt/conda && \
    rm /tmp/Miniconda3-latest-Linux-x86_64.sh && \
    /opt/conda/bin/conda init bash

# Set environment variables for Conda
ENV PATH /opt/conda/bin:$PATH

# Create and activate the Conda environment
COPY environment.yml .
RUN conda env create -f environment.yml && \
    echo "source activate conda_env" > ~/.bashrc

# Set the environment variable for the port
ENV PORT 3000

# Expose the port
EXPOSE $PORT

# Run the application
CMD [ "node", "app.js" ]
