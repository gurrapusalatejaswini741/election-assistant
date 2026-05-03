// backend/firebase-admin.js — Firebase Admin SDK initialisation
const admin = require('firebase-admin');

let db = null;

function initFirebase() {
  if (admin.apps.length > 0) return;

  try {
    const jsonStr = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (jsonStr && jsonStr !== 'undefined') {
      const serviceAccount = JSON.parse(jsonStr);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    } else {
      // On GCP Cloud Run, Application Default Credentials are used automatically
      admin.initializeApp({ credential: admin.credential.applicationDefault() });
    }
    db = admin.firestore();
    console.log('✅ Firebase Admin initialised');
  } catch (err) {
    console.warn('⚠️  Firebase Admin init failed (using fallback FAQs):', err.message);
  }
}

initFirebase();

module.exports = { admin, db: () => db };
