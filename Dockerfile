# Use a Node.js base image with Puppeteer and Chromium pre-installed
FROM apify/actor-node-puppeteer-chrome:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Fix permissions for npm install
USER root
RUN mkdir -p /usr/src/app/node_modules && \
    chown -R apify:apify /usr/src/app

# Install dependencies as the correct user
USER apify
RUN npm install --omit=dev --omit=optional

# Copy the rest of the application files
COPY . .

# Set permissions for the app directory
USER root
RUN chown -R apify:apify /usr/src/app

# Switch back to the non-root user
USER apify

# Start the application
CMD ["node", "app.js"]
