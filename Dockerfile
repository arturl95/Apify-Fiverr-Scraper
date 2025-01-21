FROM apify/actor-node-puppeteer-chrome:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files first
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev --omit=optional

# Copy the rest of the application files
COPY . .

# Expose necessary ports (if any)
# EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
