# 🚀 Galaxy Fighter - Production Deployment Guide

## 1. Local Run
```bash
# Start standard node production server
npm start

# Or directly with node
node server.js
```
The server will automatically bind to port `3000` (or the next available port if `3000` is busy).

## 2. Docker Deployment
A production-ready multi-platform `Dockerfile` is included in the project root.

```bash
# Build the Docker image
docker build -t galaxy-fighter:latest .

# Run container on port 3000
docker run -d -p 3000:3000 --name galaxy-fighter galaxy-fighter:latest
```

## 3. Static Hosting (Vercel / Netlify / GitHub Pages)
Since the web engine uses pure client-side Canvas 2D and Web Audio, the directory can be hosted directly on static providers:
- **Vercel**: Import repository -> Framework: *Other* -> Deploy.
- **GitHub Pages**: Settings -> Pages -> Source: `main` branch -> Save.
