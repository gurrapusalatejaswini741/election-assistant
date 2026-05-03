// src/components/Chatbot.jsx — AI-powered chatbot interface
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import VideoPlayer from './videoplayer';
import { findRelevantVideo } from './videodata';
import './chatbot.css';

// Quick-action prompts that appear as chip buttons
const QUICK_ACTIONS_EN = [
  { label: '📋 How to Register', prompt: 'How do I register as a voter in India?' },
  { label: '🗳️ How to Vote',     prompt: 'How do I vote using EVM at the polling booth?' },
  { label: '✅ Am I Eligible?',  prompt: 'What are the eligibility criteria to vote in India?' },
  { label: '🖥️ What is EVM?',   prompt: 'What is an Electronic Voting Machine (EVM)?' },
  { label: '📊 How Results Work',prompt: 'How are election results counted and declared in India?' },
  { label: '🗓️ Election Stages', prompt: 'What are the stages of the Indian election process?' },
];

const QUICK_ACTIONS_TA = [
  { label: '📋 பதிவு செய்வது எப்படி', prompt: 'இந்தியாவில் வாக்காளராக பதிவு செய்வது எப்படி?' },
  { label: '🗳️ வாக்களிப்பது எப்படி',  prompt: 'வாக்குச் சாவடியில் EVM மூலம் வாக்களிப்பது எப்படி?' },
  { label: '✅ நான் தகுதியானவனா?',    prompt: 'இந்தியாவில் வாக்களிக்க என்ன தகுதிகள் தேவை?' },
  { label: '🖥️ EVM என்றால் என்ன?',    prompt: 'மின்னணு வாக்குப் பதிவு இயந்திரம் (EVM) என்றால் என்ன?' },
  { label: '📊 முடிவுகள் எப்படி வரும்', prompt: 'இந்தியாவில் தேர்தல் முடிவுகள் எவ்வாறு கணக்கிடப்படுகின்றன?' },
  { label: '🗓️ தேர்தல் நிலைகள்',      prompt: 'இந்திய தேர்தல் செயல்முறையின் நிலைகள் என்ன?' },
];

export default function Chatbot() {
  const { t, i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';

  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [videoMap, setVideoMap]   = useState({}); // msgIndex → video
  const [showVideo, setShowVideo] = useState({}); // msgIndex → bool

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  // Add welcome message on first render
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: t('welcomeMessage'),
      timestamp: new Date(),
    }]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update welcome message on language change
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[0] = { ...updated[0], content: t('welcomeMessage') };
      return updated;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || loading) return;

    setInput('');
    const userMsg = { role: 'user', content: userMessage, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await axios.post('/api/chat', {
        message: userMessage,
        language: i18n.language,
        history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
      });

      const assistantMsg = {
        role: 'assistant',
        content: res.data.reply,
        timestamp: new Date(),
      };

      setMessages(prev => {
        const newMsgs = [...prev, assistantMsg];
        const idx = newMsgs.length - 1;
        // Find relevant video for the user's question
        const vid = findRelevantVideo(userMessage);
        if (vid) setVideoMap(vm => ({ ...vm, [idx]: vid }));
        return newMsgs;
      });
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: t('errorMessage'), timestamp: new Date(), isError: true }
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, i18n.language, messages, t]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = isTamil ? QUICK_ACTIONS_TA : QUICK_ACTIONS_EN;

  return (
    <div className="chatbot">
      {/* ---- Quick actions ---- */}
      <div className="quick-actions">
        <p className="qa-label">{t('quickActions')}</p>
        <div className="qa-chips">
          {quickActions.map((qa, i) => (
            <button
              key={i}
              className="qa-chip"
              onClick={() => sendMessage(qa.prompt)}
              disabled={loading}
            >
              {qa.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Message list ---- */}
      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message-row message-row--${msg.role} ${msg.isError ? 'message-row--error' : ''}`}
            style={{ animationDelay: `${idx * 0.03}s` }}
          >
            {msg.role === 'assistant' && (
              <div className="avatar" aria-hidden="true">🇮🇳</div>
            )}

            <div className="bubble-wrap">
              <div className={`bubble bubble--${msg.role}`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>

              {/* Video suggestion for assistant messages */}
              {msg.role === 'assistant' && videoMap[idx] && (
                <div className="video-suggestion">
                  {showVideo[idx] ? (
                    <VideoPlayer video={videoMap[idx]} />
                  ) : (
                    <button
                      className="watch-video-btn"
                      onClick={() => setShowVideo(sv => ({ ...sv, [idx]: true }))}
                    >
                      <span className="wv-icon">▶</span>
                      {t('watchVideo')}: <strong>{videoMap[idx].title}</strong>
                    </button>
                  )}
                </div>
              )}

              <span className="timestamp">
                {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {msg.role === 'user' && (
              <div className="avatar avatar--user" aria-hidden="true">👤</div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="message-row message-row--assistant">
            <div className="avatar">🇮🇳</div>
            <div className="bubble bubble--assistant bubble--typing">
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ---- Input bar ---- */}
      <div className="input-bar">
        <textarea
          ref={inputRef}
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('chatPlaceholder')}
          rows={1}
          disabled={loading}
          aria-label="Chat input"
        />
        <button
          className="send-btn"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          {loading
            ? <span className="spinner" aria-hidden="true" />
            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
          }
        </button>
      </div>
    </div>
  );
}