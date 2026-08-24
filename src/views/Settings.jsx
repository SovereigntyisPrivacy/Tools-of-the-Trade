import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrivacyScreen } from '@capacitor-community/privacy-screen';

export default function Settings() {
  const navigate = useNavigate();

  // --- STATES ---
  const [shield, setShield] = useState(() => localStorage.getItem('fleet_shield') !== 'false');
  const [textScale, setTextScale] = useState(() => localStorage.getItem('fleet_textScale') || 'Normal');
  const [accent, setAccent] = useState(() => localStorage.getItem('fleet_accent') || '#3b82f6');
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('fleet_wallpaper') || 'Solid Black');

  // --- EFFECTS ---
  useEffect(() => { localStorage.setItem('fleet_textScale', textScale); }, [textScale]);
  useEffect(() => { localStorage.setItem('fleet_accent', accent); }, [accent]);
  useEffect(() => { localStorage.setItem('fleet_wallpaper', wallpaper); }, [wallpaper]);

  // --- HANDLERS ---
  const toggleShield = async () => {
    const newState = !shield;
    setShield(newState);
    localStorage.setItem('fleet_shield', newState.toString());
    try {
      if (newState) await PrivacyScreen.enable();
      else await PrivacyScreen.disable();
    } catch (e) { console.log('Native bridge offline'); }
  };

  const clearData = () => {
      if (window.confirm("WARNING: This will wipe all local schedules, budgets, and settings. Proceed?")) {
          localStorage.clear();
          window.location.reload();
      }
  };

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const labelStyle = { color: '#888', fontSize: '0.8em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '10px', display: 'block' };

  return (
    <div className="view-wrapper" style={{ background: wallpaper === 'Solid Black' ? '#000' : '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>System Settings</h2>
      </header>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>

        {/* --- SOVEREIGN TOOLS AD --- */}
        <div style={{ background: 'linear-gradient(45deg, #111, #1a0033)', border: '1px solid #a855f7', borderRadius: '12px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '2px' }}>Sovereign Tools</h3>
          <p style={{ color: '#aaa', fontSize: '0.85em', margin: '0 0 15px 0', lineHeight: '1.4' }}>
            Need military-grade AES-256 encryption, Shizuku telemetry eradication, and an offline mesh network? Get the ultimate privacy suite.
          </p>
          <a href="https://github.com/xNoOnex/SovereignTools1" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#a855f7', color: '#fff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
            Upgrade Security
          </a>
        </div>

        {/* --- UI CUSTOMIZATION --- */}
        <div style={cardStyle}>
            <label style={labelStyle}>Global Text Scale</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {['Small', 'Normal', 'Large'].map(size => (
                    <button key={size} onClick={() => setTextScale(size)} style={{ flex: 1, padding: '10px', background: textScale === size ? accent : '#222', color: textScale === size ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>{size}</button>
                ))}
            </div>

            <label style={labelStyle}>Accent Color</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {['#3b82f6', '#00cc66', '#f59e0b', '#ef4444', '#a855f7'].map(color => (
                    <button key={color} onClick={() => setAccent(color)} style={{ width: '40px', height: '40px', borderRadius: '20px', background: color, border: accent === color ? '3px solid #fff' : 'none' }} />
                ))}
            </div>

            <label style={labelStyle}>Background Environment</label>
            <div style={{ display: 'flex', gap: '10px' }}>
                {['Solid Black', 'Dark Gray'].map(bg => (
                    <button key={bg} onClick={() => setWallpaper(bg)} style={{ flex: 1, padding: '10px', background: wallpaper === bg ? accent : '#222', color: wallpaper === bg ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>{bg}</button>
                ))}
            </div>
        </div>

        {/* --- SECURITY --- */}
        <div style={{ ...cardStyle, borderLeft: shield ? '4px solid #00cc66' : '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, color: shield ? '#00cc66' : '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {shield ? '🔒' : '🔓'} Screenshot Shield
            </h3>
            <button onClick={toggleShield} style={{ background: shield ? '#00cc66' : '#ef4444', color: '#000', border: 'none', padding: '6px 15px', borderRadius: '6px', fontWeight: 'bold' }}>
              {shield ? 'ACTIVE' : 'DISABLED'}
            </button>
          </div>
          <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>
            Blocks OS screen capture and recording. The app will appear as a black screen in the Android recents menu.
          </p>
        </div>

        {/* --- DANGER ZONE & SUPPORT --- */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={clearData} style={{ flex: 1, padding: '15px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', fontWeight: 'bold' }}>
                Wipe Local Data
            </button>
            <a href="https://github.com/xNoOnex" target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'block', padding: '15px', background: '#222', color: '#fff', border: '1px solid #333', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' }}>
                ☕ Support Creator
            </a>
        </div>

      </div>
    </div>
  );
}
