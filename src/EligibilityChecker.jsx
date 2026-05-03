import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './EligibilityChecker.css';

export default function EligibilityChecker() {
  const { t } = useTranslation();
  const [age, setAge] = useState('');
  const [citizen, setCitizen] = useState(null);
  const [result, setResult] = useState(null);
  const [checked, setChecked] = useState(false);

  const handleCheck = (e) => {
    e.preventDefault();
    setChecked(true);
    const ageNum = parseInt(age, 10);
    if (citizen === false) setResult('citizen');
    else if (!ageNum || ageNum < 18) setResult('age');
    else setResult('eligible');
  };

  const handleReset = () => { setAge(''); setCitizen(null); setResult(null); setChecked(false); };

  return (
    <div className="eligibility">
      <div className="section-header">
        <h2 className="section-title">{t('eligibilityTitle')}</h2>
        <p className="section-sub">{t('eligibilitySubtitle')}</p>
      </div>
      <div className="elig-card">
        {!checked ? (
          <form className="elig-form" onSubmit={handleCheck}>
            <div className="form-group">
              <label className="form-label" htmlFor="ageInput">{t('ageLabel')}</label>
              <input id="ageInput" type="number" min="1" max="120" className="form-input"
                value={age} onChange={e => setAge(e.target.value)} placeholder={t('agePlaceholder')} required />
            </div>
            <div className="form-group">
              <label className="form-label">{t('citizenLabel')}</label>
              <div className="radio-group">
                {[{val:true,label:t('yes')},{val:false,label:t('no')}].map(({val,label}) => (
                  <label key={String(val)} className={`radio-option ${citizen===val ? 'radio-option--selected':''}`}>
                    <input type="radio" name="citizen" checked={citizen===val} onChange={()=>setCitizen(val)} className="sr-only"/>
                    <span className="radio-dot"/>{label}
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="check-btn" disabled={!age || citizen===null}>{t('checkBtn')}</button>
          </form>
        ) : (
          <div className={`result-box result-box--${result}`}>
            <div className="result-icon">{result==='eligible' ? '✅' : '❌'}</div>
            <h3 className="result-title">{result==='eligible' ? t('eligible') : t('notEligible')}</h3>
            <p className="result-msg">{result==='eligible' ? t('eligibleMsg') : result==='age' ? t('notEligibleAge') : t('notEligibleCitizen')}</p>
            {result==='eligible' && (
              <a href="https://voters.eci.gov.in" target="_blank" rel="noreferrer" className="register-link">
                Register at voters.eci.gov.in →
              </a>
            )}
            <button className="reset-btn" onClick={handleReset}>← Check Again</button>
          </div>
        )}
      </div>
      <div className="criteria-grid">
        {[
          {icon:'🎂',title:'Age Requirement',desc:'You must be at least 18 years old on the qualifying date.'},
          {icon:'🇮🇳',title:'Citizenship',desc:'Only Indian citizens are eligible to vote in Indian elections.'},
          {icon:'📍',title:'Ordinary Residence',desc:'You must be ordinarily resident in the constituency where you want to register.'},
          {icon:'🧠',title:'Sound Mind',desc:'Voters must not be disqualified under any law relating to elections.'},
        ].map((c,i) => (
          <div key={i} className="criteria-card" style={{animationDelay:`${i*.1}s`}}>
            <span className="criteria-icon">{c.icon}</span>
            <div><strong>{c.title}</strong><p>{c.desc}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
