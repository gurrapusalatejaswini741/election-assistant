# Google Cloud Deployment Guide

## Prerequisites

1. **Google Cloud Account** - Create one at [console.cloud.google.com](https://console.cloud.google.com)
2. **Google Cloud SDK** - Install from https://cloud.google.com/sdk/docs/install
3. **Node.js 18+** - Already configured in `backend/package.json`

## Step-by-Step Deployment

### 1. Authenticate with Google Cloud
```bash
gcloud auth login
```

### 2. Create a Google Cloud Project
```bash
gcloud projects create election-assistant-prod
gcloud config set project election-assistant-prod
```

### 3. Enable Required APIs
```bash
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 4. Create App Engine Application (one-time only)
```bash
gcloud app create --region=us-central1
```
Choose your preferred region (e.g., `us-central1`, `europe-west1`, `asia-south1`).

### 5. Set Up Environment Variables

Create a `.env` file in the `backend/` directory using `.env.example` as a template:

```bash
cd backend
cp .env.example .env
```

Then edit `.env` with your actual values:
- `OPENAI_API_KEY` - Get from [OpenAI API Dashboard](https://platform.openai.com/api-keys)
- `FIREBASE_*` - Get from your Firebase project settings
- `FRONTEND_URL` - Your App Engine URL (update after first deployment)

### 6. Build the Frontend
From the project root directory:
```bash
npm install
npm run build
```

This creates a `build/` folder with the React app.

### 7. Deploy to App Engine
```bash
cd backend
gcloud app deploy
```

The deployment will:
- Upload your code
- Install Node dependencies
- Serve the React build from Express
- Deploy on App Engine

### 8. Get Your Application URL
```bash
gcloud app browse
```

Or find it in the [Cloud Console](https://console.cloud.google.com/appengine).

### 9. Update Environment Variable with Frontend URL
Once you have your app URL (e.g., `https://election-assistant-prod.uc.r.appspot.com`):

1. Go to [Cloud Console](https://console.cloud.google.com) → App Engine → Settings
2. Add/Update environment variable: `FRONTEND_URL=https://your-app-url.uc.r.appspot.com`
3. Redeploy: `gcloud app deploy`

## Monitoring & Debugging

### View Logs
```bash
gcloud app logs read --limit=50
```

### Real-time Logs
```bash
gcloud app logs read --limit=50 --follow
```

### Check Application Status
```bash
# Test the health endpoint
curl https://your-app-url.uc.r.appspot.com/api/health
```

## Updating Your Application

### After making code changes:
```bash
# From project root
npm run build

# From backend directory
cd backend
gcloud app deploy
```

## Troubleshooting

### Port Issues
- App Engine assigns the PORT automatically (usually 8080)
- The `app.yaml` file already configures this

### Build Path Errors
- Ensure `npm run build` is run before deployment
- The build folder should exist at the project root level

### CORS Errors
- Update `FRONTEND_URL` in Cloud Console if your domain changes
- App Engine URL format: `https://project-id.uc.r.appspot.com`

### Firebase/OpenAI Not Working
- Verify credentials in Cloud Console environment variables
- Check that API keys are valid and not expired

## Production Checklist

- [ ] `.env` file configured with all required variables
- [ ] Frontend built (`build/` folder exists)
- [ ] `FRONTEND_URL` environment variable set correctly
- [ ] Verified health endpoint: `/api/health`
- [ ] Test chatbot, FAQ, and eligibility checker endpoints
- [ ] Set up monitoring alerts in Cloud Console
- [ ] Enable automatic scaling (already in `app.yaml`)

## Continuous Deployment (Optional)

To automatically deploy on every push to `main` branch, set up GitHub Actions or Cloud Build triggers in the Cloud Console.
