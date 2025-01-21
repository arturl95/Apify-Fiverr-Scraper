# Use a lightweight Node.js base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files first
COPY package*.json ./

# Install only production dependencies (no need for dev or optional dependencies)
RUN npm install --omit=dev --omit=optional \
    && echo "Installed NPM packages:" \
    && (npm list --omit=dev --all || true) \
    && echo "Node.js version:" \
    && node --version \
    && echo "NPM version:" \
    && npm --version

# Copy the rest of the application files
COPY . .

# Expose any necessary ports (optional)
# EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
