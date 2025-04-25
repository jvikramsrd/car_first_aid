FROM node:18-alpine as build

WORKDIR /app

# Install necessary build tools and set npm config
RUN apk add --no-cache python3 make g++ \
    && npm config set registry https://registry.npmjs.org/ \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000

# Copy package files
COPY package*.json ./

# Install specific versions of Vite and esbuild
RUN npm install vite@4.5.2 \
    && npm install esbuild@0.19.2 \
    && npm install @vitejs/plugin-react@4.2.1

# Install other dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application for production
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 