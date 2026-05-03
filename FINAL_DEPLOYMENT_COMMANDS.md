# FINAL DEPLOYMENT CHECKLIST & COMMANDS

## ✅ PRE-DEPLOYMENT VERIFICATION

Make sure you have:
- ✅ New OpenAI API key in `.env`
- ✅ Firebase credentials in `.env`
- ✅ Google Cloud SDK installed
- ✅ GitHub repository updated with all config files

---

## 🚀 DEPLOYMENT COMMANDS (Copy & Paste in Order)

### Command 1: Navigate to Project Directory
```bash
cd "c:\Users\Tejaswini\OneDrive\Apps\election assistant"
```

### Command 2: Verify Project Structure
```bash
dir
```
You should see: `src/`, `backend/`, `public/`, `package.json`, `README.md`

### Command 3: Install Frontend Dependencies
```bash
npm install
```

### Command 4: Build React Application
```bash
npm run build
```

You should see a message: "compiled successfully"
New folder `build/` will be created

### Command 5: Verify Build Folder
```bash
dir build
```
You should see: `index.html`, `static/`, `favicon.ico`

### Command 6: Navigate to Backend
```bash
cd backend
```

### Command 7: Deploy to App Engine
```bash
gcloud app deploy
```

**This will:**
- Upload your code to Google Cloud
- Install dependencies
- Build the application
- Deploy it
- Takes 5-10 minutes

**Watch for this message:**
```
Deployed service [default] to https://election-assistant-prod.uc.r.appspot.com
```

### Command 8: Wait for Deployment to Complete
The console will show deployment progress. **Wait until it says "Deployed"**

### Command 9: Get Your App URL
```bash
gcloud app browse
```

This opens your app automatically in browser!

### Command 10: Verify Health Endpoint
```bash
curl https://election-assistant-prod.uc.r.appspot.com/api/health
```

You should see:
```json
{"status":"ok","timestamp":"2026-05-03T06:30:00Z","env":"production"}
```

### Command 11: View Deployment Logs
```bash
gcloud app logs read --limit=50 --follow
```

---

## 📊 DEPLOYMENT TIMELINE

| Step | Command | Time |
|------|---------|------|
| 1-2 | Navigate & verify | 30 sec |
| 3 | npm install | 2-3 min |
| 4 | npm run build | 2-3 min |
| 5 | Verify build | 30 sec |
| 6 | cd backend | 10 sec |
| 7-8 | gcloud app deploy | 5-10 min |
| **TOTAL** | | **~10-17 minutes** |

---

## ✅ SUCCESS INDICATORS

After deployment, you'll see:

✅ Health endpoint returns `{"status":"ok",...}`
✅ Frontend loads at `https://election-assistant-prod.uc.r.appspot.com`
✅ No 502 Bad Gateway errors
✅ Chatbot interface appears
✅ API endpoints respond

---

## 🔍 TROUBLESHOOTING

### If deployment fails:

**Check logs:**
```bash
gcloud app logs read --limit=50
```

**Common issues:**
- Missing .env file → Create `backend/.env` again
- Build folder missing → Run `npm run build` from project root
- Port error → Already set to 8080 in index.js
- CORS error → Will fix after verifying app works

### If you see "Cannot find build folder":
```bash
# From project root
npm run build

# Then deploy again
cd backend
gcloud app deploy
```

### If OpenAI/Firebase not working:
- Verify keys in `.env` are correct
- Check Google Cloud Console for environment variables
- Redeploy: `gcloud app deploy`

---

## 📌 YOUR APP URL

Once deployed, access it at:
```
https://election-assistant-prod.uc.r.appspot.com
```

---

## 📱 TEST YOUR APP

After deployment, test these:

1. **Visit homepage:** https://election-assistant-prod.uc.r.appspot.com
2. **Health check:** https://election-assistant-prod.uc.r.appspot.com/api/health
3. **Try chatbot** - Ask a question about elections
4. **Check FAQ** - See if FAQ section loads
5. **Test eligibility checker** - Try the eligibility checker

---

## 📚 AFTER DEPLOYMENT

1. **Monitor logs:** `gcloud app logs read --limit=50 --follow`
2. **Update FRONTEND_URL** in Google Cloud Console if needed
3. **Share your app URL** with users
4. **Monitor performance** in Cloud Console

---

## 🎉 CONGRATULATIONS!

Your Election Assistant is now LIVE on Google Cloud! 🚀

**App URL:** https://election-assistant-prod.uc.r.appspot.com

