# COMPLETE STEP-BY-STEP DEPLOYMENT GUIDE
# Election Assistant → Google Cloud App Engine

---

## 📌 PHASE 1: REVOKE EXPOSED API KEY & GET NEW ONE (5 minutes)

### Step 1: Delete Compromised OpenAI Key
1. Go to: https://platform.openai.com/account/api-keys
2. Log in with your OpenAI account
3. Find the key starting with `sk-proj-7Ix8VF5G2stD4GB79l5ZXmYs...`
4. Click the **trash/delete icon** next to it
5. Confirm deletion

### Step 2: Generate New OpenAI API Key
1. Still on the API keys page
2. Click **"Create new secret key"** button
3. Copy the new key (it looks like: `sk-proj-xxxxxxxxxxxxxxxxxxxx`)
4. **SAVE IT SOMEWHERE SAFE** (you'll need it soon)
5. ⚠️ DO NOT share this key publicly again!

### Step 3: Verify New Key Works (Optional)
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_NEW_KEY"
```

---

## 📌 PHASE 2: PREPARE FIREBASE CREDENTIALS (10 minutes)

### Step 4: Get Firebase Service Account
1. Go to: https://console.firebase.google.com
2. Click on your Firebase project (or create one)
3. Click **Settings ⚙️** → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **"Generate New Private Key"**
6. A JSON file will download - SAVE IT SECURELY
7. Open the JSON file and note these values:
   - `project_id`
   - `private_key` (copy the entire value including `-----BEGIN PRIVATE KEY-----`)
   - `client_email`

---

## 📌 PHASE 3: SET UP GOOGLE CLOUD PROJECT (10 minutes)

### Step 5: Install Google Cloud SDK
If not already installed:
```bash
# Windows: Download from
https://cloud.google.com/sdk/docs/install

# Or use Windows Package Manager
winget install Google.CloudSDK
```

### Step 6: Initialize Google Cloud
```bash
gcloud init
```
- Select "YES" to create a new configuration
- Login when prompted
- Choose an existing project or create new

### Step 7: Create New GCP Project
```bash
# Create project
gcloud projects create election-assistant-prod --name="Election Assistant"

# Set it as active
gcloud config set project election-assistant-prod
```

### Step 8: Enable Required APIs
```bash
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
```

### Step 9: Create App Engine Application
```bash
gcloud app create --region=us-central1
```
Choose your region when prompted:
- `us-central1` = USA (low latency for US users)
- `europe-west1` = Europe
- `asia-south1` = India

---

## 📌 PHASE 4: PREPARE YOUR CODE (10 minutes)

### Step 10: Navigate to Project Directory
```bash
# Use the exact path from your README
cd "c:\Users\Tejaswini\OneDrive\Apps\election assistant"

# Verify you're in the right place
dir
# You should see: src/, backend/, package.json, README.md, etc.
```

### Step 11: Create Backend .env File
```bash
cd backend
copy .env.example .env
```

### Step 12: Edit .env File with Your Credentials
Open `backend/.env` in a text editor and replace with YOUR values:

```
NODE_ENV=production
OPENAI_API_KEY=sk-proj-YOUR_NEW_KEY_HERE
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FRONTEND_URL=https://election-assistant-prod.uc.r.appspot.com
PORT=8080
```

⚠️ **IMPORTANT:**
- Replace `sk-proj-YOUR_NEW_KEY_HERE` with your actual new OpenAI key
- Get these values from Firebase service account JSON
- NEVER commit this .env file to GitHub

---

## 📌 PHASE 5: BUILD FRONTEND (5 minutes)

### Step 13: Go to Project Root
```bash
# From backend directory, go up one level
cd ..

# Verify structure
dir
# Should show: src/, backend/, public/, package.json
```

### Step 14: Install Frontend Dependencies
```bash
npm install
```

### Step 15: Build React Application
```bash
npm run build
```

After this completes, you should see a new `build/` folder created.

Verify:
```bash
dir build
# You should see: index.html, static/, favicon.ico, etc.
```

---

## 📌 PHASE 6: DEPLOY TO GOOGLE CLOUD (10-15 minutes)

### Step 16: Go to Backend Directory
```bash
cd backend
```

### Step 17: Deploy to App Engine
```bash
gcloud app deploy
```

**What happens:**
- Google Cloud uploads your code
- Installs Node dependencies
- Builds the application
- Deploys it
- Shows you the URL when done

**This takes 5-10 minutes. Watch for:**
```
Deploying...
...
Version "20260503-061215" created.
Deployed service [default] to https://election-assistant-prod.uc.r.appspot.com
```

---

## 📌 PHASE 7: VERIFY DEPLOYMENT (5 minutes)

### Step 18: Get Your App URL
```bash
gcloud app browse
```

This opens your application in a browser!

### Step 19: Test Health Endpoint
Visit this URL in your browser:
```
https://election-assistant-prod.uc.r.appspot.com/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2026-05-03T06:15:00Z",
  "env": "production"
}
```

### Step 20: Test Frontend
Visit the main URL:
```
https://election-assistant-prod.uc.r.appspot.com
```

You should see your Election Assistant app!

---

## 📌 PHASE 8: SET ENVIRONMENT VARIABLES IN GCP (5 minutes)

### Step 21: Update Frontend URL in Google Cloud Console
Now that you have your App Engine URL, update FRONTEND_URL:

**Option A: Via Command Line**
```bash
gcloud app update --update-env-variables=FRONTEND_URL=https://election-assistant-prod.uc.r.appspot.com

# Then redeploy
gcloud app deploy
```

**Option B: Via Web Console**
1. Go to: https://console.cloud.google.com
2. Select your project: `election-assistant-prod`
3. Go to: **App Engine** → **Settings**
4. Find **Environment variables**
5. Add/Update `FRONTEND_URL`
6. Click **Save**
7. Go back and click **Deploy** or use command line

---

## 📌 PHASE 9: MONITOR & TROUBLESHOOT (Ongoing)

### Step 22: View Application Logs
```bash
# Last 50 log lines
gcloud app logs read --limit=50

# Real-time log streaming
gcloud app logs read --limit=50 --follow

# View specific error
gcloud app logs read "ERROR" --limit=20
```

### Step 23: Common Issues & Fixes

**Issue: 502 Bad Gateway**
- Check logs: `gcloud app logs read`
- Verify `.env` variables are correct
- Redeploy: `gcloud app deploy`

**Issue: "Cannot find build folder"**
- Go to project root
- Run `npm run build` again
- Redeploy

**Issue: CORS errors in browser**
- Update `FRONTEND_URL` in Google Cloud Console
- Redeploy

**Issue: API calls returning 403**
- Check OpenAI API key is correct
- Verify Firebase credentials in `.env`
- Check API quotas in Google Cloud Console

---

## 📋 QUICK REFERENCE COMMANDS

```bash
# Change project
gcloud config set project election-assistant-prod

# View current project
gcloud config list

# View logs
gcloud app logs read --limit=50

# Redeploy
cd backend && gcloud app deploy

# Delete application (WARNING: deletes everything)
gcloud app versions delete --service=default

# Describe current deployment
gcloud app describe
```

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Revoked old OpenAI key
- [ ] Created new OpenAI key
- [ ] Got Firebase service account credentials
- [ ] Created GCP project
- [ ] Enabled APIs
- [ ] Created App Engine
- [ ] Created `.env` file with all credentials
- [ ] Ran `npm install`
- [ ] Ran `npm run build`
- [ ] Ran `gcloud app deploy`
- [ ] Verified health endpoint works
- [ ] Tested frontend loads
- [ ] Updated `FRONTEND_URL` in GCP
- [ ] Checked logs for errors
- [ ] App is live! 🎉

---

## 🆘 NEED HELP?

### View Real-time Logs
```bash
gcloud app logs read --limit=50 --follow
```

### Check Deployment History
```bash
gcloud app versions list
```

### SSH into App Engine (for advanced debugging)
```bash
gcloud app instances list
gcloud app instances describe INSTANCE_ID
```

---

**Your app will be live at:**
```
https://election-assistant-prod.uc.r.appspot.com
```

🎉 **Congratulations on deploying to Google Cloud!** 🎉
