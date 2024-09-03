# Use the official Node.js 18-alpine image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Disable ESLint during the build process
ENV NEXT_DISABLE_ESLINT=true

# Build the Next.js application for production
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the Next.js application in production mode
CMD ["npm", "run", "start"]