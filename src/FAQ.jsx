import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import './FAQ.css';

const FALLBACK_FAQS = [
  { id:'1', order:1, questionEn:'What is the minimum age to vote in India?', questionTa:'இந்தியாவில் வாக்களிக்க குறைந்தபட்ச வயது என்ன?',
    answerEn:'You must be at least 18 years old on 1st January of the year the electoral roll is revised.',
    answerTa:'வாக்காளர் பட்டியல் திருத்தப்படும் ஆண்டின் ஜனவரி 1 அன்று குறைந்தது 18 வயதாக இருக்க வேண்டும்.' },
  { id:'2', order:2, questionEn:'How do I get a Voter ID card?', questionTa:'வாக்காளர் அட்டை எப்படி பெறுவது?',
    answerEn:'Apply online at voters.eci.gov.in using Form 6, or visit your nearest Electoral Registration Office.',
    answerTa:'voters.eci.gov.in இல் Form 6 நிரப்பி ஆன்லைனில் விண்ணப்பிக்கவும்.' },
  { id:'3', order:3, questionEn:'What is an EVM and how does it work?', questionTa:'EVM என்றால் என்ன, அது எவ்வாறு செயல்படுகிறது?',
    answerEn:'An Electronic Voting Machine (EVM) records votes electronically. It has a Control Unit with the officer and a Balloting Unit for the voter. Press the blue button next to your candidate.',
    answerTa:'மின்னணு வாக்குப் பதிவு இயந்திரம் (EVM) வாக்குகளை மின்னணு முறையில் பதிவு செய்கிறது.' },
  { id:'4', order:4, questionEn:'Can I vote without a Voter ID card?', questionTa:'வாக்காளர் அட்டை இல்லாமல் வாக்களிக்க முடியுமா?',
    answerEn:'Yes! If your name is on the electoral roll, you can vote using 12 alternate documents including Aadhaar, Passport, Driving Licence, or PAN Card.',
    answerTa:'ஆம்! உங்கள் பெயர் வாக்காளர் பட்டியலில் இருந்தால், ஆதார், கடவுச்சீட்டு, ஓட்டுநர் உரிமம் உட்பட 12 மாற்று ஆவணங்களைப் பயன்படுத்தலாம்.' },
  { id:'5', order:5, questionEn:'How many phases are in a General Election?', questionTa:'பொதுத் தேர்தலில் எத்தனை கட்டங்கள் உள்ளன?',
    answerEn:"India's General Elections are conducted in multiple phases (typically 4–7) spread over several weeks, allowing security forces to be deployed across the country.",
    answerTa:'இந்தியாவின் பொதுத் தேர்தல்கள் பல வாரங்களில் பல கட்டங்களாக நடத்தப்படுகின்றன.' },
  { id:'6', order:6, questionEn:'What is the Model Code of Conduct?', questionTa:'நடத்தை விதிமுறை என்றால் என்ன?',
    answerEn:'The Model Code of Conduct (MCC) is a set of guidelines issued by the ECI to regulate political parties and candidates during elections. It applies from announcement to result declaration.',
    answerTa:'நடத்தை விதிமுறை (MCC) தேர்தல்களின் போது அரசியல் கட்சிகளை கட்டுப்படுத்த ECI வெளியிட்ட வழிகாட்டுதல்கள்.' },
];

export default function FAQ() {
  const { t, i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIdx, setOpenIdx] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const q = query(collection(db, 'faqs'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setFaqs(data.length > 0 ? data : FALLBACK_FAQS);
      } catch (err) {
        setFaqs(FALLBACK_FAQS);
      } finally {
        setLoading(false);
      }
    }
    fetchFAQs();
  }, []);

  const filtered = faqs.filter(faq => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (faq.questionEn||'').toLowerCase().includes(q)||(faq.answerEn||'').toLowerCase().includes(q);
  });

  return (
    <div className="faq-section">
      <div className="section-header">
        <h2 className="section-title">{t('faqTitle')}</h2>
        <p className="section-sub">{t('faqSubtitle')}</p>
      </div>
      <div className="faq-search-wrap">
        <span className="search-icon">🔍</span>
        <input type="text" className="faq-search"
          placeholder={isTamil ? 'தேடுங்கள்…' : 'Search FAQs…'}
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {loading ? (
        <div className="faq-loading">{[1,2,3].map(i => <div key={i} className="faq-skeleton"/>)}</div>
      ) : (
        <div className="faq-list">
          {filtered.length === 0 ? <p className="no-results">No matching FAQs found.</p> :
            filtered.map((faq, idx) => {
              const question = isTamil ? faq.questionTa : faq.questionEn;
              const answer = isTamil ? faq.answerTa : faq.answerEn;
              const isOpen = openIdx === idx;
              return (
                <div key={faq.id} className={`faq-item ${isOpen ? 'faq-item--open':''}`} style={{animationDelay:`${idx*.05}s`}}>
                  <button className="faq-question" onClick={() => setOpenIdx(isOpen ? null : idx)} aria-expanded={isOpen}>
                    <span className="faq-q-text">{question}</span>
                    <span className="faq-chevron">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && <div className="faq-answer"><p>{answer}</p></div>}
                </div>
              );
            })
          }
        </div>
      )}
    </div>
  );
}
