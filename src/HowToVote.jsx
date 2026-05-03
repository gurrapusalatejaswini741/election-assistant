// src/components/HowToVote.jsx — Step-by-step election process guide
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ELECTION_STEPS } from './stepsdata';
import { VIDEOS } from './videodata';
import VideoPlayer from './videoplayer';
import './HowToVote.css';

export default function HowToVote() {
  const { t, i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';
  const [expandedStep, setExpandedStep] = useState(null);
  const [showVideo, setShowVideo] = useState({});

  const toggleStep = (idx) => {
    setExpandedStep(prev => prev === idx ? null : idx);
  };

  const getVideo = (videoId) => {
    return videoId ? VIDEOS.find(v => v.id === videoId) : null;
  };

  return (
    <div className="how-to-vote">
      <div className="section-header">
        <h2 className="section-title">{t('stepsTitle')}</h2>
        <p className="section-sub">{t('stepsSubtitle')}</p>
      </div>

      {/* Timeline */}
      <div className="steps-timeline">
        {ELECTION_STEPS.map((step, idx) => {
          const isOpen  = expandedStep === idx;
          const video   = getVideo(step.videoId);
          const title   = isTamil ? step.titleTa : step.titleEn;
          const desc    = isTamil ? step.descTa  : step.descEn;

          return (
            <div
              key={step.step}
              className={`step-card ${isOpen ? 'step-card--open' : ''}`}
              style={{ '--step-color': step.color }}
            >
              {/* Step connector line */}
              {idx < ELECTION_STEPS.length - 1 && (
                <div className="step-line" style={{ background: step.color }} />
              )}

              <div className="step-header" onClick={() => toggleStep(idx)}>
                <div className="step-badge" style={{ background: step.color }}>
                  <span className="step-icon">{step.icon}</span>
                  <span className="step-num">{step.step}</span>
                </div>

                <div className="step-info">
                  <h3 className="step-title">{title}</h3>
                  {!isOpen && (
                    <p className="step-preview">
                      {desc.substring(0, 80)}…
                    </p>
                  )}
                </div>

                <button className="step-toggle" aria-label={isOpen ? 'Collapse' : 'Expand'}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="18"
                    height="18"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>

              {isOpen && (
                <div className="step-body">
                  <p className="step-desc">{desc}</p>

                  {video && (
                    <div className="step-video">
                      {showVideo[idx] ? (
                        <VideoPlayer video={video} />
                      ) : (
                        <button
                          className="watch-step-btn"
                          onClick={() => setShowVideo(sv => ({ ...sv, [idx]: true }))}
                        >
                          <span className="wv-play">▶</span>
                          {t('watchVideo')}: <em>{isTamil ? video.titleTa : video.title}</em>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}