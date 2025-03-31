FROM node:22-alpine AS builder


# Set ENV to ensure runtime access
WORKDIR /app

# Copy package.json and lock file first to leverage Docker caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --force  --only=dev
RUN npm install --force --ignore-scripts --include=dev

# Generate a unique auth token during the build and set it as an environment variable
# Copy the rest of the application
COPY . .

# Set environment variable to production
ENV NODE_ENV=production

RUN chmod +x ./entrypoint.sh
# Expose Next.js default port
EXPOSE 3001
# Start Next.js app
CMD ["sh", "./entrypoint.sh"]
