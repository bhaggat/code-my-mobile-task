# Stage 1: Build React App (Client)
FROM node:20 AS client-build

# Set working directory
WORKDIR /client

# Copy client dependencies
COPY client/package.json client/package-lock.json ./

# Install client dependencies
RUN npm install

# Copy client source code
COPY client/ ./

# Build React app for production
RUN npm run build


# Stage 2: Set up Node.js Server
FROM node:20

# Set working directory for the server
WORKDIR /server

# Copy server dependencies
COPY server/package.json server/package-lock.json ./

# Install server dependencies
RUN npm install

# Copy server source code
COPY server/ ./

# Copy the built React app from Stage 1
COPY --from=client-build /client/dist ./client-dist

# Expose port for the server
EXPOSE 5000

# Start the Node.js server
CMD ["npm", "run", "dev"]
