# FinEdu

## Render Backend Deployment

This repository keeps backend code inside the backend folder.

- Service type: Web Service
- Root Directory: backend
- Build Command: npm install
- Start Command: npm start
- Health Check Path: /api/health

You can also deploy using the repository blueprint file at render.yaml.

### Redeploy Checklist

1. Push the latest commit to your GitHub repository.
2. In Render, use Manual Deploy and choose Clear build cache & deploy.
3. Confirm environment variables are set: MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN, GEMINI_API_KEY.
4. Verify health endpoint after deploy: /api/health.
