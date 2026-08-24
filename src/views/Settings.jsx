import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrivacyScreen } from '@capacitor-community/privacy-screen';

export default function Settings() {
  const navigate = useNavigate();
  // Shield defaults to TRUE (Locked) if no setting is found
  const [shield, setShield] = useState(() => localStorage.getItem('fleet_shield') !== 'false');

  const toggleShield = async () => {
    const newState = !shield;
    setShield(newState);
    localStorage.setItem('fleet_shield', newState.toString());
    
    try {
      if (newState) {
        await PrivacyScreen.enable();
      } else {
        await PrivacyScreen.disable();
      }
    } catch (e) {
      console.log('Native privacy screen bridge not available in browser mode.');
    }
  };

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>System Settings</h2>
      </header>

      <div style={{ padding: '20px', flex: 1 }}>
        <div style={{ ...cardStyle, borderLeft: shield ? '4px solid #00cc66' : '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, color: shield ? '#00cc66' : '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {shield ? '🔒' : '🔓'} Screenshot Shield
            </h3>
            <button 
              onClick={toggleShield} 
              style={{ background: shield ? '#00cc66' : '#ef4444', color: '#000', border: 'none', padding: '6px 15px', borderRadius: '6px', fontWeight: 'bold' }}
            >
              {shield ? 'ACTIVE' : 'DISABLED'}
            </button>
          </div>
          <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>
            Blocks OS screen capture and recording. When enabled, the app will appear as a black screen in the Android recents menu.
          </p>
        </div>
      </div>
    </div>
  );
}
