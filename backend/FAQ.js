// backend/FAQ.js — GET /api/faqs
const express = require('express');
const { db }  = require('./firebase-admin');
const router  = express.Router();

const FALLBACK_FAQS = [
  { id:'1', order:1,
    questionEn:'What is the minimum age to vote in India?',
    questionTa:'இந்தியாவில் வாக்களிக்க குறைந்தபட்ச வயது என்ன?',
    answerEn:'You must be at least 18 years old on 1st January of the year the electoral roll is revised.',
    answerTa:'வாக்காளர் பட்டியல் திருத்தப்படும் ஆண்டின் ஜனவரி 1 அன்று குறைந்தது 18 வயதாக இருக்க வேண்டும்.' },
  { id:'2', order:2,
    questionEn:'How do I apply for a Voter ID?',
    questionTa:'வாக்காளர் அட்டை எப்படி பெறுவது?',
    answerEn:'Apply online at voters.eci.gov.in using Form 6, or visit your nearest Electoral Registration Office (ERO).',
    answerTa:'voters.eci.gov.in இல் Form 6 நிரப்பி ஆன்லைனில் விண்ணப்பிக்கவும் அல்லது ERO அலுவலகம் செல்லவும்.' },
  { id:'3', order:3,
    questionEn:'What is an EVM and how does it work?',
    questionTa:'EVM என்றால் என்ன, அது எவ்வாறு செயல்படுகிறது?',
    answerEn:'An Electronic Voting Machine (EVM) records votes electronically. Press the blue button next to your candidate on the Balloting Unit. A VVPAT slip prints to confirm your vote.',
    answerTa:'EVM மின்னணு முறையில் வாக்குகளை பதிவு செய்கிறது. உங்கள் வேட்பாளருக்கு அருகில் உள்ள நீல பொத்தானை அழுத்தவும்.' },
  { id:'4', order:4,
    questionEn:'Can I vote without a Voter ID card?',
    questionTa:'வாக்காளர் அட்டை இல்லாமல் வாக்களிக்க முடியுமா?',
    answerEn:'Yes! If your name is on the electoral roll, you can use 12 alternate documents including Aadhaar, Passport, Driving Licence, or PAN Card.',
    answerTa:'ஆம்! பட்டியலில் பெயர் இருந்தால் ஆதார், கடவுச்சீட்டு, ஓட்டுநர் உரிமம் உட்பட 12 மாற்று ஆவணங்கள் ஏற்கப்படும்.' },
  { id:'5', order:5,
    questionEn:'How many phases are in an Indian General Election?',
    questionTa:'பொதுத் தேர்தலில் எத்தனை கட்டங்கள் உள்ளன?',
    answerEn:"India's General Elections are conducted in 4–7 phases spread over several weeks, allowing security forces to be deployed across the country.",
    answerTa:'இந்திய பொதுத் தேர்தல் பல வாரங்களில் 4-7 கட்டங்களாக நடத்தப்படுகிறது.' },
  { id:'6', order:6,
    questionEn:'What is the Model Code of Conduct?',
    questionTa:'நடத்தை விதிமுறை என்றால் என்ன?',
    answerEn:'The Model Code of Conduct (MCC) is a set of ECI guidelines that regulate political parties and candidates from the announcement of elections until results are declared.',
    answerTa:'நடத்தை விதிமுறை (MCC) தேர்தல் அறிவிப்பு முதல் முடிவு வரை கட்சிகளை கட்டுப்படுத்தும் ECI வழிகாட்டுதல்கள்.' },
];

// GET /api/faqs
router.get('/', async (req, res) => {
  const firestore = db();
  if (!firestore) {
    return res.json({ faqs: FALLBACK_FAQS, source: 'fallback' });
  }
  try {
    const snapshot = await firestore.collection('faqs').orderBy('order', 'asc').get();
    const faqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ faqs: faqs.length > 0 ? faqs : FALLBACK_FAQS, source: faqs.length > 0 ? 'firestore' : 'fallback' });
  } catch (err) {
    console.error('Firestore error:', err.message);
    res.json({ faqs: FALLBACK_FAQS, source: 'fallback' });
  }
});

// POST /api/faqs/seed — seed Firestore with default FAQs (admin only)
router.post('/seed', async (req, res) => {
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const firestore = db();
  if (!firestore) return res.status(503).json({ error: 'Firestore not available' });
  try {
    const batch = firestore.batch();
    FALLBACK_FAQS.forEach(faq => {
      const ref = firestore.collection('faqs').doc(faq.id);
      batch.set(ref, faq);
    });
    await batch.commit();
    res.json({ message: `Seeded ${FALLBACK_FAQS.length} FAQs successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
