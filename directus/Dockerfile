FROM node:20-alpine

# Install the Directus package (includes the CLI and server)
RUN npm install -g directus

WORKDIR /app

# (Optional) copy your Directus config files here
# COPY directus.config.js ./directus.config.js
# COPY extensions ./extensions

EXPOSE 8055

# Start Directus via the CLI
# Run bootstrap (creates tables and first admin) then start the server
CMD ["sh", "-c", "directus bootstrap && directus start"]
