# Use official Node.js runtime as a base image
FROM node:18-alpine

# Create app directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies (production only)
RUN npm install --production

# Copy rest of your app source code
COPY . .

# Expose the port your backend listens on (e.g., 3000)
EXPOSE 5002

# Command to start your backend app
CMD ["node", "index.js"]
