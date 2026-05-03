// src/components/VideosGallery.jsx — Full video library tab
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VIDEOS } from './videodata';
import VideoPlayer from './videoplayer';
import './Videosgalery.css';

const CATEGORIES = ['all', 'registration', 'voting', 'process', 'results', 'rules'];

export default function VideosGallery() {
  const { t, i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';

  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? VIDEOS
    : VIDEOS.filter(v => v.category === activeCategory);

  const categoryLabel = (cat) => {
    const labels = {
      all:          isTamil ? 'அனைத்தும்'     : 'All',
      registration: isTamil ? 'பதிவு'         : 'Registration',
      voting:       isTamil ? 'வாக்களிப்பு'   : 'Voting',
      process:      isTamil ? 'செயல்முறை'     : 'Process',
      results:      isTamil ? 'முடிவுகள்'     : 'Results',
      rules:        isTamil ? 'விதிகள்'       : 'Rules',
    };
    return labels[cat] || cat;
  };

  return (
    <div className="videos-gallery">
      <div className="section-header">
        <h2 className="section-title">{t('videosTitle')}</h2>
        <p className="section-sub">{t('videosSubtitle')}</p>
      </div>

      {/* Category filters */}
      <div className="cat-filters">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`cat-btn ${activeCategory === cat ? 'cat-btn--active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {categoryLabel(cat)}
            {cat !== 'all' && (
              <span className="cat-count">
                {VIDEOS.filter(v => v.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Video grid */}
      <div className="video-grid">
        {filtered.map((video, idx) => (
          <div
            key={video.id}
            className="video-grid-item"
            style={{ animationDelay: `${idx * 0.07}s` }}
          >
            <VideoPlayer video={video} />
          </div>
        ))}
      </div>
    </div>
  );
}