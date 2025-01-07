# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire server project
COPY . .

# Expose port 5000 (adjust if your server runs on a different port)
EXPOSE 5000

# Run the server in development mode
CMD ["npm", "run", "dev"]
