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
  const [bgBlur, setBgBlur] = useState(() => localStorage.getItem('fleet_bg_blur') || '0');
  const [bgBright, setBgBright] = useState(() => localStorage.getItem('fleet_bg_bright') || '1');
  const [bgSize, setBgSize] = useState(() => localStorage.getItem('fleet_bg_size') || 'cover');

  // NATIVE UI UPDATES (No refreshing needed!)
  const handleScaleChange = (val) => {
      setTextScale(val);
      document.documentElement.style.setProperty('--global-font-scale', `${val}px`);
  };
  const saveState = (key, val) => localStorage.setItem(key, val);

  const handleAccentChange = (color) => {
      setAccent(color);
      saveState('fleet_accent', color);
      document.documentElement.style.setProperty('--accent', color);
      document.documentElement.style.setProperty('--text-accent', color);
      // Force wallpaper reload if they are using dynamic themes
      if (wallpaper === 'Cyber Grid' || wallpaper === 'Tactical Flare') window.location.reload();
  };

  const handleWallpaperChange = (bg) => {
      setWallpaper(bg);
      saveState('fleet_wallpaper', bg);
      window.location.reload(); // Quick refresh to apply complex CSS engine changes
  };

  const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              saveState('fleet_wallpaper_custom', reader.result);
              handleWallpaperChange('Custom');
          };
          reader.readAsDataURL(file);
      }
  };

  const updateGalleryFX = (key, val, cssVar) => {
      if (key === 'fleet_bg_blur') setBgBlur(val);
      if (key === 'fleet_bg_bright') setBgBright(val);
      if (key === 'fleet_bg_size') setBgSize(val);
      saveState(key, val);
      document.documentElement.style.setProperty(cssVar, key === 'fleet_bg_blur' ? `${val}px` : val);
  };

  const toggleShield = async () => {
    const newState = !shield;
    setShield(newState);
    saveState('fleet_shield', newState.toString());
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
        
        <div style={cardStyle}>
            <label style={labelStyle}>Global Text Scale ({textScale}px)</label>
            <input 
                type="range" min="12" max="22" value={textScale} 
                onChange={e => handleScaleChange(e.target.value)} 
                onMouseUp={e => saveState('fleet_textScale', e.target.value)} 
                onTouchEnd={e => saveState('fleet_textScale', e.target.value)} 
                style={{ width: '100%', marginBottom: '20px', accentColor: accent }} 
            />

            <label style={labelStyle}>Accent Color</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {['#3b82f6', '#00cc66', '#f59e0b', '#ef4444', '#a855f7'].map(color => (
                    <button key={color} onClick={() => handleAccentChange(color)} style={{ width: '40px', height: '40px', borderRadius: '20px', background: color, border: accent === color ? '3px solid #fff' : 'none' }} />
                ))}
            </div>

            <label style={labelStyle}>Wallpaper Environment</label>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {['Default Dark', 'Midnight Blue', 'Cyber Grid', 'Tactical Flare'].map(bg => (
                    <button key={bg} onClick={() => handleWallpaperChange(bg)} style={{ flex: 1, minWidth: '80px', padding: '10px 5px', background: wallpaper === bg ? accent : 'rgba(34,34,34,0.8)', color: wallpaper === bg ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.75em' }}>{bg}</button>
                ))}
                <label style={{ flex: 1, minWidth: '80px', padding: '10px 5px', background: wallpaper === 'Custom' ? accent : 'rgba(34,34,34,0.8)', color: wallpaper === 'Custom' ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.75em', textAlign: 'center', cursor: 'pointer' }}>
                    Gallery +
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
            </div>

            {/* --- CUSTOM GALLERY EDITORS --- */}
            {wallpaper === 'Custom' && (
                <div style={{ background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: '8px', border: '1px dashed #444', marginTop: '10px' }}>
                    <label style={labelStyle}>Image Blur Overlay</label>
                    <input type="range" min="0" max="20" value={bgBlur} onChange={e => updateGalleryFX('fleet_bg_blur', e.target.value, '--bg-blur')} style={{ width: '100%', marginBottom: '15px', accentColor: accent }} />
                    
                    <label style={labelStyle}>Brightness (Dim Background)</label>
                    <input type="range" min="0.1" max="1" step="0.1" value={bgBright} onChange={e => updateGalleryFX('fleet_bg_bright', e.target.value, '--bg-brightness')} style={{ width: '100%', marginBottom: '15px', accentColor: accent }} />
                    
                    <label style={labelStyle}>Image Fit</label>
                    <select value={bgSize} onChange={e => updateGalleryFX('fleet_bg_size', e.target.value, '--bg-size')} style={{ width: '100%', background: '#222', color: '#fff', border: '1px solid #444', padding: '8px', borderRadius: '6px', outline: 'none' }}>
                        <option value="cover">Cover (Fill Screen)</option>
                        <option value="contain">Contain (Fit to Screen)</option>
                        <option value="auto">Original Size</option>
                    </select>
                </div>
            )}
        </div>

        <button onClick={() => navigate('/support')} style={{ width: '100%', padding: '15px', background: 'rgba(34, 34, 34, 0.85)', backdropFilter: 'blur(10px)', color: '#fff', border: '1px solid var(--accent)', borderRadius: '8px', fontWeight: 'bold', marginBottom: '20px' }}>
            ☕ Support Creator
        </button>

        {devMode && (
            <div style={{ ...cardStyle, borderLeft: shield ? '4px solid #00cc66' : '4px solid #ef4444' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: shield ? '#00cc66' : '#ef4444' }}>{shield ? '🔒' : '🔓'} Screen Shield</h3>
                  <button onClick={toggleShield} style={{ background: shield ? '#00cc66' : '#ef4444', color: '#000', border: 'none', padding: '6px 15px', borderRadius: '6px', fontWeight: 'bold' }}>{shield ? 'ACTIVE' : 'DISABLED'}</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
