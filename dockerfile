FROM node:20-alpine

# Install Directus CLI globally.  Using the CLI inside a container allows us to run
# the web service as well as the worker with the same image.
RUN npm install -g @directus/cli@latest
WORKDIR /app

# Copy worker script and any extensions (none yet) into the image.

# Expose the default Directus port
EXPOSE 8055

# By default start the Directus server.  The worker service will override the
# command in render.yaml to run `node worker.js` instead.
CMD ["directus", "start"]
