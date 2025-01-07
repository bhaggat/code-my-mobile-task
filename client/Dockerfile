# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire client project
COPY . .

# Expose port 5173 for Vite development server
EXPOSE 5173

# Run the development server
CMD ["npm", "run", "dev"]
