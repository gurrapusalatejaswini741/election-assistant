// backend/eligibility.js — POST /api/eligibility
const express = require('express');
const router  = express.Router();

router.post('/', (req, res) => {
  const { age, isCitizen } = req.body;

  if (age === undefined || isCitizen === undefined) {
    return res.status(400).json({ error: 'age and isCitizen are required' });
  }

  const ageNum = parseInt(age, 10);
  if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
    return res.status(400).json({ error: 'Invalid age value' });
  }

  if (!isCitizen) {
    return res.json({
      eligible: false,
      reason: 'Only Indian citizens are eligible to vote in Indian elections.',
      reasonTa: 'இந்திய குடிமக்கள் மட்டுமே இந்திய தேர்தல்களில் வாக்களிக்க முடியும்.',
    });
  }

  if (ageNum < 18) {
    return res.json({
      eligible: false,
      reason: 'You must be at least 18 years old on the qualifying date (January 1st of the revision year).',
      reasonTa: 'தகுதி நாளில் (திருத்த ஆண்டின் ஜனவரி 1) குறைந்தது 18 வயதாவது இருக்க வேண்டும்.',
    });
  }

  return res.json({
    eligible: true,
    reason: 'You are eligible to vote! Register at voters.eci.gov.in',
    reasonTa: 'நீங்கள் வாக்களிக்க தகுதியானவர்! voters.eci.gov.in இல் பதிவு செய்யுங்கள்.',
    registrationUrl: 'https://voters.eci.gov.in',
  });
});

module.exports = router;
