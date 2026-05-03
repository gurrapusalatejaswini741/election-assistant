// src/App.jsx — Root component: tab routing and layout shell
import React, { useState } from 'react';
import './i18n';                         // initialise i18next
import Header          from './header';
import Chatbot         from './chatbot';
import HowToVote       from './HowToVote';
import EligibilityChecker from './EligibilityChecker';
import FAQ             from './FAQ';
import VideosGallery   from './Videosgallery';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');

  const renderTab = () => {
    switch (activeTab) {
      case 'chat':        return <Chatbot />;
      case 'howToVote':   return <HowToVote />;
      case 'eligibility': return <EligibilityChecker />;
      case 'faqs':        return <FAQ />;
      case 'videos':      return <VideosGallery />;
      default:            return <Chatbot />;
    }
  };

  return (
    <div className="app-shell">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="app-main" role="main">
        {renderTab()}
      </main>

      <footer className="app-footer">
        <div className="footer-strip">
          <span className="tc-s" /><span className="tc-w" /><span className="tc-g" />
        </div>
        <p className="footer-text">
          🇮🇳 VoteReady India · Powered by AI · Information sourced from{' '}
          <a href="https://eci.gov.in" target="_blank" rel="noreferrer">
            Election Commission of India
          </a>
        </p>
      </footer>
    </div>
  );
}