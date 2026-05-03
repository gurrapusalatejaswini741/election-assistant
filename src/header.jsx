import React from 'react';
import { useTranslation } from 'react-i18next';
import './header.css';

const TABS = [
  { key:'chat',        icon:'💬', labelKey:'chatbot' },
  { key:'howToVote',   icon:'🗳️', labelKey:'howToVote' },
  { key:'eligibility', icon:'✅', labelKey:'eligibility' },
  { key:'faqs',        icon:'❓', labelKey:'faqs' },
  { key:'videos',      icon:'▶️', labelKey:'videos' },
];

export default function Header({ activeTab, onTabChange }) {
  const { t, i18n } = useTranslation();
  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'ta' : 'en');

  return (
    <header className="site-header">
      <div className="brand-bar">
        <div className="brand-left">
          <div className="tricolour">
            <span className="tc-saffron" /><span className="tc-white" /><span className="tc-green" />
          </div>
          <div className="brand-text">
            <h1 className="brand-name">{t('appName')}</h1>
            <p className="brand-tagline">{t('tagline')}</p>
          </div>
        </div>
        <button className="lang-btn" onClick={toggleLang}>🌐 {t('changeLanguage')}</button>
      </div>
      <nav className="tab-nav" role="tablist">
        {TABS.map(({ key, icon, labelKey }) => (
          <button key={key} role="tab" aria-selected={activeTab === key}
            className={`tab-btn ${activeTab === key ? 'active' : ''}`}
            onClick={() => onTabChange(key)}>
            <span className="tab-icon">{icon}</span>
            <span className="tab-label">{t(labelKey)}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}
