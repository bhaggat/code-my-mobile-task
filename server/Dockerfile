# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose the port
EXPOSE 8080

# Start the server
CMD ["npm", "run", "dev"]
