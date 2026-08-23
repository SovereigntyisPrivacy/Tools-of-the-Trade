import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WorldClock() {
  const navigate = useNavigate();
  
  // Get local default timezone
  const defaultTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Load preferences from local storage or set defaults
  const [tz, setTz] = useState(localStorage.getItem('clock_tz') || defaultTz);
  const [color, setColor] = useState(localStorage.getItem('clock_color') || '#00ffff');
  const [opacity, setOpacity] = useState(localStorage.getItem('clock_opacity') || '1.0');
  
  const [search, setSearch] = useState('');
  const [time, setTime] = useState(new Date());

  // Get all valid world timezones natively supported by the device
  const allTz = Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : [defaultTz, 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'];

  // Keep time ticking
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save settings when changed
  useEffect(() => {
    localStorage.setItem('clock_tz', tz);
    localStorage.setItem('clock_color', color);
    localStorage.setItem('clock_opacity', opacity);
  }, [tz, color, opacity]);

  const filteredTz = allTz.filter(t => t.toLowerCase().includes(search.toLowerCase())).slice(0, 50);

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const labelStyle = { color: '#888', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px', display: 'block' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>World Clock</h2>
      </header>

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        {/* Live Preview */}
        <div style={{ textAlign: 'center', marginBottom: '25px', padding: '20px', background: '#000', borderRadius: '12px', border: `1px solid ${color}` }}>
          <div style={{ color: '#aaa', fontSize: '0.9em', marginBottom: '10px' }}>DASHBOARD PREVIEW</div>
          <div style={{ 
            color: color, 
            opacity: parseFloat(opacity), 
            fontSize: '2.5em', 
            fontWeight: 'bold', 
            letterSpacing: '2px',
            textShadow: `0 0 15px ${color}`
          }}>
            {time.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div style={{ color: '#fff', marginTop: '10px', fontSize: '0.9em' }}>{tz.replace(/_/g, ' ')}</div>
        </div>

        {/* Display Settings */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>Display Settings</h3>
          
          <label style={labelStyle}>HUD Color</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {['#00ffff', '#00cc66', '#f59e0b', '#ef4444', '#a855f7', '#ffffff'].map(c => (
              <button 
                key={c} 
                onClick={() => setColor(c)} 
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: c, border: color === c ? '3px solid #fff' : 'none', cursor: 'pointer' }}
              />
            ))}
          </div>

          <label style={labelStyle}>HUD Opacity ({Math.round(parseFloat(opacity) * 100)}%)</label>
          <input 
            type="range" min="0.2" max="1.0" step="0.1" 
            value={opacity} 
            onChange={(e) => setOpacity(e.target.value)} 
            style={{ width: '100%', accentColor: color }} 
          />
        </div>

        {/* Timezone Selector */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>Set Dashboard Timezone</h3>
          <input 
            type="text" 
            placeholder="Search countries, states, cities..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', marginBottom: '15px' }} 
          />
          
          <div style={{ maxHeight: '300px', overflowY: 'auto', background: '#000', borderRadius: '8px', border: '1px solid #222' }}>
            {filteredTz.map(t => (
              <div 
                key={t} 
                onClick={() => setTz(t)}
                style={{ padding: '15px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: tz === t ? 'rgba(255,255,255,0.1)' : 'transparent', cursor: 'pointer' }}
              >
                <span style={{ color: tz === t ? color : '#ccc', fontWeight: tz === t ? 'bold' : 'normal' }}>{t.replace(/_/g, ' ')}</span>
                <span style={{ color: '#888', fontSize: '0.85em' }}>
                  {time.toLocaleTimeString('en-US', { timeZone: t, hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
