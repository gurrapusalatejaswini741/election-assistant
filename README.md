# Election Assistant

Election Assistant is a bilingual voter education app built with React for the frontend and Express for the backend. It provides election guidance, FAQs, eligibility checking, vote information, and video resources.

## Project Structure

- `src/` — React application source files
- `public/` — React public assets
- `backend/` — Node.js/Express API and deployment config
- `backend/app.yaml` — App Engine configuration for Google Cloud deployment

## Features

- Chatbot interface for election-related questions
- Voter eligibility checker
- How-to-vote guidance
- FAQ and election process content
- YouTube video gallery
- Proxy setup to route frontend API calls to backend

## Prerequisites

- Node.js 18+ installed
- npm available
- Google Cloud SDK installed for App Engine deployment (optional)

## Local Setup

### 1. Install frontend dependencies

```bash
cd "c:\Users\Tejaswini\OneDrive\Apps\election assistant"
npm install
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Run the backend server

```bash
cd backend
npm start
```

### 4. Run the frontend app

```bash
cd "c:\Users\Tejaswini\OneDrive\Apps\election assistant"
npm start
```

The frontend should start on `http://localhost:3000` and proxy API requests to `http://localhost:5000`.

## Build for Production

```bash
cd "c:\Users\Tejaswini\OneDrive\Apps\election assistant"
npm run build
```

Then build the backend and serve the React app using the Express server in `backend/index.js` when `NODE_ENV=production`.

## Google Cloud Deployment

1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
2. Authenticate:
   ```bash
gcloud auth login
```
3. Set your project:
   ```bash
gcloud config set project YOUR_PROJECT_ID
```
4. Create App Engine app:
   ```bash
gcloud app create --region=YOUR_REGION
```
5. Deploy from the backend folder:
   ```bash
cd backend
gcloud app deploy
```

## Repository

- GitHub: https://github.com/gurrapusalatejaswini741/election-assistant

## Notes

- The frontend uses `react-scripts` from Create React App.
- The backend uses Express, Helmet, CORS, rate limiting, and Firebase Admin.
- Make sure `backend/.env` is configured with any required secrets before production deployment.
