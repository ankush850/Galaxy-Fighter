FROM node:20-alpine

WORKDIR /app

# Copy project files
COPY . .

# Expose standard production port
EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
