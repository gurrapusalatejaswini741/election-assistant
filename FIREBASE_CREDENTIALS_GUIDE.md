# HOW TO GET FIREBASE CREDENTIALS - COMPLETE VISUAL GUIDE

## Step 1: Go to Firebase Console
1. Open your browser and go to: https://console.firebase.google.com
2. Log in with your Google account

---

## Step 2: Select or Create a Firebase Project

### If you already have a Firebase project:
- Click on your project name from the list
- Skip to **Step 3**

### If you DON'T have a Firebase project, create one:
1. Click **"Add project"** button
2. Enter project name: `election-assistant`
3. Click **"Continue"**
4. Choose your preferences (analytics optional)
5. Click **"Create project"**
6. Wait 1-2 minutes for project creation
7. Click **"Continue"** when ready

---

## Step 3: Open Project Settings
1. In Firebase console, look for the **⚙️ gear icon** at the top left
2. Click it and select **"Project settings"**
3. You'll see a page with tabs at the top

---

## Step 4: Go to Service Accounts Tab
1. Look for the **"Service accounts"** tab (next to General)
2. Click on it
3. You'll see a section that says "Firebase Admin SDK"

---

## Step 5: Generate Private Key
1. In the Firebase Admin SDK section, click the blue button that says:
   **"Generate new private key"**
   
2. A dialog box will appear asking to confirm
3. Click **"Generate key"**

4. **A JSON file will automatically download!**
   - File name looks like: `election-assistant-xxxxx-firebase-adminsdk-xxxxx.json`
   - **Save this file in a safe location on your computer**

---

## Step 6: Open the Downloaded JSON File
1. Find the JSON file you just downloaded
2. Right-click on it and select **"Open with Notepad"** (or any text editor)
3. You'll see something like this:

```json
{
  "type": "service_account",
  "project_id": "election-assistant-abc123",
  "private_key_id": "abc123def456...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xyz123@election-assistant-abc123.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xyz123%40election-assistant-abc123.iam.gserviceaccount.com"
}
```

---

## Step 7: Extract the 3 Required Values

From the JSON file, copy these **exact 3 values**:

### Value 1: `project_id`
Look for the line:
```
"project_id": "election-assistant-abc123"
```
Copy: `election-assistant-abc123`

### Value 2: `private_key`
Look for the line starting with:
```
"private_key": "-----BEGIN PRIVATE KEY-----\n...-----END PRIVATE KEY-----\n"
```
Copy the **entire value** including the quotes and `\n` characters.

Example:
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKj
...many more lines...
-----END PRIVATE KEY-----
```

### Value 3: `client_email`
Look for:
```
"client_email": "firebase-adminsdk-xyz123@election-assistant-abc123.iam.gserviceaccount.com"
```
Copy: `firebase-adminsdk-xyz123@election-assistant-abc123.iam.gserviceaccount.com`

---

## Step 8: Add to Your .env File

Now go to your backend folder and edit the `.env` file:

```
NODE_ENV=production
OPENAI_API_KEY=sk-proj-YOUR_NEW_KEY_HERE
FIREBASE_PROJECT_ID=election-assistant-abc123
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKj...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xyz123@election-assistant-abc123.iam.gserviceaccount.com
FRONTEND_URL=https://election-assistant-prod.uc.r.appspot.com
PORT=8080
```

---

## ✅ CHECKLIST

- [ ] Went to https://console.firebase.google.com
- [ ] Created or selected Firebase project
- [ ] Clicked Project Settings (⚙️ icon)
- [ ] Clicked "Service accounts" tab
- [ ] Clicked "Generate new private key"
- [ ] Downloaded JSON file
- [ ] Opened JSON file in Notepad
- [ ] Copied `project_id`
- [ ] Copied `private_key` (entire value with \n)
- [ ] Copied `client_email`
- [ ] Added all 3 values to backend/.env file
- [ ] Saved the .env file

---

## 🆘 TROUBLESHOOTING

### Can't find Project Settings?
- Make sure you're in the correct Firebase project (check project name at top)
- Look for the ⚙️ gear icon in the left sidebar

### Can't find Service Accounts tab?
- Click on "Project settings"
- Look for tabs at the top of the page
- Click the tab that says "Service Accounts"

### The JSON file didn't download?
- Check your Downloads folder
- Try again: click "Generate new private key" button again
- Allow popup downloads in your browser

### Need a visual walkthrough?
Video tutorial: https://www.youtube.com/watch?v=S-k4RV7y4Fk

---

**Once you have all 3 values in your .env file, you're ready to deploy!** 🚀
