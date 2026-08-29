import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrivacyScreen } from '@capacitor-community/privacy-screen';

export default function Settings() {
  const [hiddenModules, setHiddenModules] = useState(() => JSON.parse(localStorage.getItem('tot_hidden_modules')) || []);
  const toggleModule = (id) => {
    const newHidden = hiddenModules.includes(id) ? hiddenModules.filter(n => n !== id) : [...hiddenModules, id];
    setHiddenModules(newHidden);
    localStorage.setItem('tot_hidden_modules', JSON.stringify(newHidden));
  };

  const ALL_TOOLS = [
    { id: 'chronos', name: 'Chronos Hub' }, { id: 'burner', name: 'Burner Pad' },
    { id: 'sop', name: 'SOP Engine' }, { id: 'subscriptions', name: 'Sub Tracker' },
    { id: 'vault', name: 'Data Vault' }, { id: 'calendar', name: 'Master Calendar' },
    { id: 'quick', name: 'Quick Tip & Tax' }, { id: 'budget', name: 'Budget Engine' },
    { id: 'learning', name: 'Learning Center' }, { id: 'calculator', name: 'Omni-Calculator' },
    { id: 'ledger', name: 'Asset Ledger' }, { id: 'civics', name: 'Civics & Rights' },
    { id: 'qrscanner', name: 'Universal Lens' }, { id: 'morse', name: 'Optical Comm Link' },
    { id: 'cipher', name: 'Cipher & Keygen' }, { id: 'firstaid', name: 'Trauma & CPR' }
  ];

  const navigate = useNavigate();
  const devMode = localStorage.getItem('fleet_dev_mode') === 'true';

  const [shield, setShield] = useState(() => localStorage.getItem('fleet_shield') !== 'false');
  const [textScale, setTextScale] = useState(() => { const s = localStorage.getItem('fleet_textScale'); return s ? parseInt(s) : 16; });
  const [accent, setAccent] = useState(() => localStorage.getItem('fleet_accent') || '#3b82f6');

  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('fleet_wallpaper') || 'Deep Obsidian');
  const [bgBlur, setBgBlur] = useState(() => localStorage.getItem('fleet_bg_blur') || '0');
  const [bgBright, setBgBright] = useState(() => localStorage.getItem('fleet_bg_bright') || '1');

  // Custom Drag/Zoom State
  const [isEditing, setIsEditing] = useState(false);
  const [bgZoom, setBgZoom] = useState(() => localStorage.getItem('fleet_bg_zoom') || '1');
  const [bgX, setBgX] = useState(() => localStorage.getItem('fleet_bg_x') || '50');
  const [bgY, setBgY] = useState(() => localStorage.getItem('fleet_bg_y') || '50');

  const touchState = useRef({ dist: 0, zoom: 1, x: 0, y: 0, bgX: 50, bgY: 50 });

  const saveState = (key, val) => localStorage.setItem(key, val);

  const handleScaleChange = (val) => { setTextScale(val); document.documentElement.style.setProperty('--global-font-scale', `${val}px`); };
  const handleAccentChange = (color) => {
    setAccent(color); saveState('fleet_accent', color);
    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--text-accent', color);
    if (wallpaper !== 'Default Dark' && wallpaper !== 'Midnight Blue' && wallpaper !== 'Custom') window.location.reload();
  };

  const handleWallpaperChange = (bg) => {
    setWallpaper(bg); saveState('fleet_wallpaper', bg); window.location.reload();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Canvas Compressor (Drops size under 1MB to bypass browser crash)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX = 1920; let w = img.width; let h = img.height;
        if (w > h && w > MAX) { h *= MAX / w; w = MAX; } else if (h > MAX) { w *= MAX / h; h = MAX; }
        canvas.width = w; canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.7);

        saveState('fleet_wallpaper_custom', compressed);
        saveState('fleet_bg_zoom', '1'); saveState('fleet_bg_x', '50'); saveState('fleet_bg_y', '50');
        handleWallpaperChange('Custom');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const updateGalleryFX = (key, val, cssVar) => {
    if (key === 'fleet_bg_blur') setBgBlur(val);
    if (key === 'fleet_bg_bright') setBgBright(val);
    saveState(key, val);
    document.documentElement.style.setProperty(cssVar, key === 'fleet_bg_blur' ? `${val}px` : val);
  };

  const toggleShield = async () => {
    const newState = !shield; setShield(newState); saveState('fleet_shield', newState.toString());
    try { if (newState) await PrivacyScreen.enable(); else await PrivacyScreen.disable(); } catch (e) {}
  };

  // --- TOUCH HANDLERS FOR PINCH/PAN ---
  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      touchState.current.dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      touchState.current.zoom = parseFloat(bgZoom);
    } else if (e.touches.length === 1) {
      touchState.current.x = e.touches[0].clientX; touchState.current.y = e.touches[0].clientY;
      touchState.current.bgX = parseFloat(bgX); touchState.current.bgY = parseFloat(bgY);
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const newZoom = Math.min(Math.max(1, touchState.current.zoom * (dist / touchState.current.dist)), 5);
      setBgZoom(newZoom); document.documentElement.style.setProperty('--bg-zoom', newZoom);
    } else if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - touchState.current.x; const dy = e.touches[0].clientY - touchState.current.y;
      const newX = Math.min(Math.max(0, touchState.current.bgX - (dx * 0.2)), 100);
      const newY = Math.min(Math.max(0, touchState.current.bgY - (dy * 0.2)), 100);
      setBgX(newX); setBgY(newY);
      document.documentElement.style.setProperty('--bg-pos-x', `${newX}%`);
      document.documentElement.style.setProperty('--bg-pos-y', `${newY}%`);
    }
  };

  const saveEdit = () => {
    saveState('fleet_bg_zoom', bgZoom); saveState('fleet_bg_x', bgX); saveState('fleet_bg_y', bgY);
    setIsEditing(false);
  };

  // If in Edit Mode, hide the UI and render the invisible touch pad
  if (isEditing) {
    return (
      <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', color: '#fff', padding: '15px', borderRadius: '12px', textAlign: 'center', marginBottom: '15px', border: '1px solid var(--accent)' }}>
          <h3 style={{ margin: '0 0 5px 0' }}>Adjust Wallpaper</h3>
          <p style={{ fontSize: '0.85em', color: '#aaa', margin: 0 }}>Drag to move. Pinch to zoom.</p>
        </div>
        <button onClick={saveEdit} style={{ background: 'var(--accent)', color: '#fff', padding: '20px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1.2em', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }}>Save Position</button>
      </div>
    );
  }

  const cardStyle = { background: 'rgba(17, 17, 17, 0.85)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const labelStyle = { color: '#aaa', fontSize: '0.8em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '10px', display: 'block' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(10px)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: 'var(--text-accent)' }}>System Settings</h2>
      </header>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        {/* DASHBOARD MANAGER */}
        <details style={{ background: 'rgba(17, 17, 17, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #333', borderLeft: '4px solid #a855f7', padding: '15px', marginBottom: '25px' }}>
          <summary style={{ color: '#a855f7', fontWeight: 'bold', textTransform: 'uppercase', outline: 'none', userSelect: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            ⚙️ Manage Dashboard Modules
          </summary>
          <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '15px', marginBottom: '15px' }}>Tap a pill to hide or reveal modules on your main Hub.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {ALL_TOOLS.map(tool => {
              const isHidden = hiddenModules.includes(tool.id);
              return (
                <label key={tool.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: isHidden ? '#222' : '#a855f7', color: isHidden ? '#666' : '#fff', padding: '8px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', border: isHidden ? '1px solid #333' : '1px solid #a855f7' }}>
                  <input type="checkbox" checked={!isHidden} onChange={() => toggleModule(tool.id)} style={{ display: 'none' }} />
                  {isHidden ? 'X' : '✓'} {tool.name}
                </label>
              );
            })}
          </div>
        </details>

        <div style={cardStyle}>
          <label style={labelStyle}>Global Text Scale</label>
          <input type="range" min="12" max="22" value={textScale} onChange={e => handleScaleChange(e.target.value)} onMouseUp={e => saveState('fleet_textScale', e.target.value)} onTouchEnd={e => saveState('fleet_textScale', e.target.value)} style={{ width: '100%', marginBottom: '20px', accentColor: accent }} />

          <label style={labelStyle}>Accent Color</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {['#3b82f6', '#00cc66', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#06b6d4', '#eab308'].map(color => (
              <button key={color} onClick={() => handleAccentChange(color)} style={{ width: '40px', height: '40px', borderRadius: '20px', background: color, border: accent === color ? '3px solid #fff' : 'none' }} />
            ))}
          </div>

          <label style={labelStyle}>Wallpaper Environment</label>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {['Default Dark', 'Cyber Grid', 'Tactical Flare', 'Matrix Rain', 'Crimson Hex'].map(bg => (
              <button key={bg} onClick={() => handleWallpaperChange(bg)} style={{ flex: 1, minWidth: '80px', padding: '10px 5px', background: wallpaper === bg ? accent : 'rgba(34,34,34,0.8)', color: wallpaper === bg ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.75em' }}>{bg}</button>
            ))}
            <label style={{ flex: 1, minWidth: '80px', padding: '10px 5px', background: wallpaper === 'Custom' ? accent : 'rgba(34,34,34,0.8)', color: wallpaper === 'Custom' ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.75em', textAlign: 'center', cursor: 'pointer' }}>
              Gallery +
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {wallpaper === 'Custom' && (
            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: '8px', border: '1px dashed #444', marginTop: '10px' }}>
              <button onClick={() => setIsEditing(true)} style={{ width: '100%', padding: '12px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginBottom: '15px' }}>
                👆 Edit Placement (Zoom/Pan)
              </button>
              <label style={labelStyle}>Image Blur Overlay</label>
              <input type="range" min="0" max="20" value={bgBlur} onChange={e => updateGalleryFX('fleet_bg_blur', e.target.value, '--bg-blur')} style={{ width: '100%', marginBottom: '15px', accentColor: accent }} />
              <label style={labelStyle}>Brightness (Dim Background)</label>
              <input type="range" min="0.1" max="1" step="0.1" value={bgBright} onChange={e => updateGalleryFX('fleet_bg_bright', e.target.value, '--bg-brightness')} style={{ width: '100%', accentColor: accent }} />
            </div>
          )}
        </div>

        <button onClick={() => navigate('/support')} style={{ width: '100%', padding: '15px', background: 'rgba(34, 34, 34, 0.85)', backdropFilter: 'blur(10px)', color: '#fff', border: '1px solid var(--accent)', borderRadius: '8px', fontWeight: 'bold', marginBottom: '20px' }}>☕ Support Creator</button>

        {/* --- SOVEREIGN TOOLS PROMO ADDED HERE --- */}
        <button onClick={() => window.open('https://github.com/xNoOnex/SovereignTools1/releases', '_blank', 'noopener,noreferrer')} style={{ width: '100%', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', background: 'rgba(34, 34, 34, 0.85)', backdropFilter: 'blur(10px)', color: '#fff', border: '1px solid #00ff00', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer' }}>
          <span style={{ fontSize: '24px' }}>🛡️</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Get SovereignTools</span>
            <span style={{ fontSize: '12px', color: '#00ff00' }}>AES-256-GCM Encrypted Suite</span>
          </div>
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
