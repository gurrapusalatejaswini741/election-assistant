// backend/chat.js — POST /api/chat  (OpenAI GPT powered election assistant)
const express = require('express');
const OpenAI  = require('openai');
const router  = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_EN = `You are VoteReady India, a friendly and expert AI assistant that helps Indian citizens understand the Indian election process.

Your knowledge covers:
- Voter registration (Form 6, EPIC/Voter ID, NVSP, voters.eci.gov.in)
- Election stages (announcement, nomination, campaigning, polling, counting, results)
- Electronic Voting Machines (EVM) and VVPAT
- Model Code of Conduct (MCC)
- Lok Sabha, Rajya Sabha, Vidhan Sabha elections
- First Past The Post (FPTP) electoral system
- Election Commission of India (ECI) role and functions
- Eligibility criteria for voters (18+, Indian citizen, ordinary resident)
- How votes are counted and results declared

Rules:
1. Keep answers clear, simple, and jargon-free
2. Use bullet points or numbered steps for processes
3. Be accurate — cite ECI guidelines where relevant
4. Respond in Tamil if the user writes in Tamil
5. Never discuss political parties, candidates, or give political opinions
6. Format responses in Markdown (bold key terms, use numbered lists for steps)
7. Keep responses concise — 3-6 sentences for facts, steps for processes`;

const SYSTEM_TA = `நீங்கள் VoteReady India, இந்திய குடிமக்கள் தேர்தல் செயல்முறையை புரிந்துகொள்ள உதவும் AI உதவியாளர்.

விதிகள்:
1. தெளிவான, எளிய பதில்களை தமிழில் வழங்கவும்
2. EVM, பதிவு போன்ற தொழில்நுட்ப விஷயங்களை படிப்படியாக விளக்கவும்
3. அரசியல் கட்சிகள் பற்றி பேசாதீர்கள்
4. Markdown வடிவமைப்பு பயன்படுத்தவும்`;

router.post('/', async (req, res) => {
  const { message, language = 'en', history = [] } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }
  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message too long (max 1000 characters)' });
  }

  const recentHistory = history.slice(-10).map(m => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: String(m.content),
  }));

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 600,
      temperature: 0.5,
      messages: [
        { role: 'system', content: language === 'ta' ? SYSTEM_TA : SYSTEM_EN },
        ...recentHistory,
        { role: 'user', content: message.trim() },
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim() || 'I could not generate a response.';
    res.json({ reply, tokens: completion.usage?.total_tokens || 0 });

  } catch (err) {
    console.error('OpenAI error:', err.message);
    if (err.status === 429) return res.status(429).json({ error: 'Rate limit reached. Please wait a moment.' });
    if (err.status === 401) return res.status(500).json({ error: 'AI service not configured. Please check OPENAI_API_KEY.' });
    res.status(500).json({ error: 'Failed to get AI response. Please try again.' });
  }
});

module.exports = router;
