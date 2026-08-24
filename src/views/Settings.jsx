import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrivacyScreen } from '@capacitor-community/privacy-screen';

export default function Settings() {
  const navigate = useNavigate();
  const devMode = localStorage.getItem('fleet_dev_mode') === 'true';

  const [shield, setShield] = useState(() => localStorage.getItem('fleet_shield') !== 'false');
  const [textScale, setTextScale] = useState(() => { const s = localStorage.getItem('fleet_textScale'); return s ? parseInt(s) : 16; });
  const [accent, setAccent] = useState(() => localStorage.getItem('fleet_accent') || '#3b82f6');
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('fleet_wallpaper') || 'Deep Obsidian');

  // NATIVE 60FPS UI UPDATES (No reloading)
  const handleScaleChange = (val) => {
      setTextScale(val);
      document.documentElement.style.fontSize = `${val}px`;
  };
  
  const handleScaleSave = (val) => {
      localStorage.setItem('fleet_textScale', val);
  };

  const handleAccentChange = (color) => {
      setAccent(color);
      localStorage.setItem('fleet_accent', color);
      document.documentElement.style.setProperty('--accent', color);
      document.documentElement.style.setProperty('--text-accent', color);
  };

  const handleWallpaperChange = (bg, customData = null) => {
      setWallpaper(bg);
      localStorage.setItem('fleet_wallpaper', bg);
      
      if (bg === 'Custom' && customData) {
          document.body.style.backgroundImage = `url(${customData})`;
          document.body.style.backgroundSize = 'cover';
          document.body.style.backgroundPosition = 'center';
          document.body.style.backgroundAttachment = 'fixed';
      } else {
          document.body.style.backgroundImage = 'none';
          document.body.style.backgroundColor = bg === 'Midnight Blue' ? '#000511' : (bg === 'Deep Obsidian' ? '#0a0a0a' : '#000');
      }
  };

  const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              localStorage.setItem('fleet_wallpaper_custom', reader.result);
              handleWallpaperChange('Custom', reader.result);
          };
          reader.readAsDataURL(file);
      }
  };

  const toggleShield = async () => {
    const newState = !shield;
    setShield(newState);
    localStorage.setItem('fleet_shield', newState.toString());
    try { if (newState) await PrivacyScreen.enable(); else await PrivacyScreen.disable(); } catch (e) {}
  };

  const cardStyle = { background: 'rgba(17, 17, 17, 0.85)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const labelStyle = { color: '#aaa', fontSize: '0.8em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '10px', display: 'block' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(10px)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: 'var(--text-accent)', fontSize: '1.2em' }}>System Settings</h2>
      </header>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        <div style={{ background: 'linear-gradient(45deg, rgba(17,17,17,0.9), rgba(26,0,51,0.9))', backdropFilter: 'blur(10px)', border: '1px solid var(--accent)', borderRadius: '12px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 5px 0', color: 'var(--text-accent)', textTransform: 'uppercase', letterSpacing: '2px' }}>Sovereign Tools</h3>
          <p style={{ color: '#ccc', fontSize: '0.85em', margin: '0 0 15px 0', lineHeight: '1.4' }}>Get military-grade AES-256 encryption, Shizuku telemetry eradication, and offline mesh networking.</p>
          <a href="https://github.com/xNoOnex/SovereignTools1" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'var(--accent)', color: '#fff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>Upgrade Security</a>
        </div>

        <div style={cardStyle}>
            <label style={labelStyle}>Global Text Scale ({textScale}px)</label>
            <input 
                type="range" min="12" max="22" value={textScale} 
                onChange={e => handleScaleChange(e.target.value)} 
                onMouseUp={e => handleScaleSave(e.target.value)} 
                onTouchEnd={e => handleScaleSave(e.target.value)} 
                style={{ width: '100%', marginBottom: '20px', accentColor: accent }} 
            />

            <label style={labelStyle}>Accent Color</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {['#3b82f6', '#00cc66', '#f59e0b', '#ef4444', '#a855f7'].map(color => (
                    <button key={color} onClick={() => handleAccentChange(color)} style={{ width: '40px', height: '40px', borderRadius: '20px', background: color, border: accent === color ? '3px solid #fff' : 'none' }} />
                ))}
            </div>

            <label style={labelStyle}>Wallpaper Environment</label>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {['Default Dark', 'Midnight Blue', 'Deep Obsidian'].map(bg => (
                    <button key={bg} onClick={() => handleWallpaperChange(bg)} style={{ flex: 1, padding: '10px 5px', background: wallpaper === bg ? accent : 'rgba(34,34,34,0.8)', color: wallpaper === bg ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.75em' }}>{bg}</button>
                ))}
                <label style={{ flex: 1, padding: '10px 5px', background: wallpaper === 'Custom' ? accent : 'rgba(34,34,34,0.8)', color: wallpaper === 'Custom' ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.75em', textAlign: 'center', cursor: 'pointer' }}>
                    Gallery
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
            </div>
        </div>

        <button onClick={() => navigate('/support')} style={{ width: '100%', padding: '15px', background: 'rgba(34, 34, 34, 0.85)', backdropFilter: 'blur(10px)', color: '#fff', border: '1px solid var(--accent)', borderRadius: '8px', fontWeight: 'bold', marginBottom: '20px' }}>
            ☕ Support Creator
        </button>

        {devMode && (
            <>
              <div style={{ ...cardStyle, borderLeft: shield ? '4px solid #00cc66' : '4px solid #ef4444' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, color: shield ? '#00cc66' : '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>{shield ? '🔒' : '🔓'} Screenshot Shield</h3>
                  <button onClick={toggleShield} style={{ background: shield ? '#00cc66' : '#ef4444', color: '#000', border: 'none', padding: '6px 15px', borderRadius: '6px', fontWeight: 'bold' }}>{shield ? 'ACTIVE' : 'DISABLED'}</button>
                </div>
                <p style={{ color: '#ccc', fontSize: '0.85em', margin: 0 }}>Blocks OS screen capture and recording.</p>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={() => { if (window.confirm('Wipe data?')) { localStorage.clear(); window.location.reload(); } }} style={{ flex: 1, padding: '15px', background: 'rgba(255, 0, 0, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', fontWeight: 'bold' }}>Wipe Data</button>
              </div>
            </>
        )}
      </div>
    </div>
  );
}
