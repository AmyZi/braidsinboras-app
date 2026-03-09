#Use the official Node.js image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your code
COPY . .

# Build the Next.js app (optional for dev, but good for testing)
# RUN npm run build

# Start the app
CMD ["npm", "run", "dev"]
