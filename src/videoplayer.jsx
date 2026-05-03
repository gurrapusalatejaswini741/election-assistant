import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function VideoPlayer({ video, compact = false }) {
  const [playing, setPlaying] = useState(false);
  const { i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';
  if (!video) return null;
  const title = isTamil ? video.titleTa : video.title;
  const description = isTamil ? video.descriptionTa : video.description;
  const thumbUrl = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;

  return (
    <div style={{background:'var(--navy-card)',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',overflow:'hidden',animation:'fadeUp .3s ease both'}}>
      {!compact && (
        <div style={{padding:'14px 16px 10px'}}>
          <span style={{display:'inline-block',fontSize:'.7rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--saffron)',background:'var(--saffron-glow)',padding:'2px 8px',borderRadius:'99px',marginBottom:'6px'}}>▶ Video</span>
          <h4 style={{fontFamily:'var(--font-display)',fontSize:'.95rem',fontWeight:600,color:'var(--text-primary)',marginBottom:4,lineHeight:1.3}}>{title}</h4>
          {description && <p style={{fontSize:'.8rem',color:'var(--text-muted)',lineHeight:1.5}}>{description}</p>}
        </div>
      )}
      <div style={{position:'relative',width:'100%',paddingBottom:'56.25%',height:0,overflow:'hidden'}}>
        {playing ? (
          <iframe style={{position:'absolute',inset:0,width:'100%',height:'100%',border:'none'}}
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen loading="lazy" />
        ) : (
          <div style={{position:'absolute',inset:0,cursor:'pointer',background:'#000',display:'flex',alignItems:'center',justifyContent:'center'}}
            onClick={() => setPlaying(true)} role="button" tabIndex={0}
            onKeyDown={e => e.key==='Enter' && setPlaying(true)}>
            <img src={thumbUrl} alt={title} loading="lazy"
              style={{width:'100%',height:'100%',objectFit:'cover',opacity:.85}} />
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{width:56,height:56,background:'var(--saffron)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'white',boxShadow:'0 4px 20px rgba(255,107,26,0.5)'}}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M8 5v14l11-7z"/></svg>
              </div>
              {video.duration && <span style={{position:'absolute',bottom:8,right:8,fontSize:'.75rem',fontWeight:600,background:'rgba(0,0,0,0.75)',color:'#fff',padding:'2px 6px',borderRadius:4}}>{video.duration}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
