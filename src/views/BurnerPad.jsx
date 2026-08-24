import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BurnerPad() {
  const navigate = useNavigate();
  
  const [text, setText] = useState(() => {
    const saved = localStorage.getItem('fleet_burner_text') || '';
    const lastSaved = parseInt(localStorage.getItem('fleet_burner_time') || '0', 10);
    // 24 Hour Expiration (86,400,000 ms)
    if (Date.now() - lastSaved > 86400000) return '';
    return saved;
  });

  useEffect(() => {
    localStorage.setItem('fleet_burner_text', text);
    localStorage.setItem('fleet_burner_time', Date.now().toString());
  }, [text]);

  const nukePad = () => {
    setText('');
    localStorage.removeItem('fleet_burner_text');
  };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Burner Pad</h2>
        <button onClick={nukePad} style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85em' }}>Nuke Now</button>
      </header>
      
      <div style={{ flex: 1, padding: '15px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ color: '#888', fontSize: '0.8em', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>⚠️ Pad auto-wipes after 24 hours of inactivity</div>
        <textarea 
          value={text} 
          onChange={e => setText(e.target.value)} 
          placeholder="Dump ephemeral notes, numbers, or scratchpad data here..."
          style={{ flex: 1, width: '100%', background: '#111', border: '1px dashed #ef4444', borderRadius: '12px', color: '#fff', padding: '15px', fontSize: '1.2em', resize: 'none', outline: 'none' }}
        />
      </div>
    </div>
  );
}
