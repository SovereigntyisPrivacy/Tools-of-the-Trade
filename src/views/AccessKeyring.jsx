import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AccessKeyring() {
  const navigate = useNavigate();
  const [keys, setKeys] = useState(() => {
    const saved = localStorage.getItem('fleet_keyring');
    return saved ? JSON.parse(saved) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [secret, setSecret] = useState('');
  const [notes, setNotes] = useState('');
  const [revealed, setRevealed] = useState({}); // Tracks which secrets are currently visible

  useEffect(() => { localStorage.setItem('fleet_keyring', JSON.stringify(keys)); }, [keys]);

  const handleSave = () => {
    if (!title || !secret) return alert('Title and Password/Code are required.');
    const newKey = { id: `key_${Date.now()}`, title, username, secret, notes };
    setKeys([...keys, newKey]);
    setShowModal(false); setTitle(''); setUsername(''); setSecret(''); setNotes('');
  };

  const toggleReveal = (id) => {
    setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteKey = (id) => {
    setKeys(keys.filter(k => k.id !== id));
  };

  const inputStyle = { width: '100%', padding: '12px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', marginBottom: '10px' };
  const labelStyle = { color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', display: 'block' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Access Keyring</h2>
      </header>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        {/* --- SOVEREIGN TOOLS WARNING BANNER --- */}
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', padding: '15px', marginBottom: '20px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#ef4444', textTransform: 'uppercase', fontSize: '1em' }}>⚠️ Zero Encryption Warning</h3>
          <p style={{ color: '#aaa', fontSize: '0.85em', margin: '0 0 10px 0', lineHeight: '1.4' }}>
            Data saved here is stored locally in <strong>PLAIN TEXT</strong> to comply with export regulations. It is safe from cloud tracking, but vulnerable to physical device breaches.
          </p>
          <a href="https://github.com/xNoOnex/SovereignTools1" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#ef4444', color: '#fff', padding: '8px 15px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85em' }}>
            Get Sovereign Tools for True Encryption →
          </a>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#fff', textTransform: 'uppercase', fontSize: '0.9em', letterSpacing: '1px' }}>Local Vault</h3>
            <button onClick={() => setShowModal(true)} style={{ background: '#00ffff', color: '#000', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>+ Add Key</button>
        </div>

        {keys.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#555', padding: '20px' }}>Vault is empty.</div>
        ) : (
          keys.map(k => (
            <div key={k.id} style={{ background: '#000', border: '1px solid #222', borderLeft: '4px solid #00ffff', borderRadius: '8px', padding: '15px', marginBottom: '10px', position: 'relative' }}>
              <button onClick={() => deleteKey(k.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.2em' }}>×</button>
              
              <h4 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1.1em', paddingRight: '20px' }}>{k.title}</h4>
              
              {k.username && (
                  <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: '#555', fontSize: '0.75em', textTransform: 'uppercase', display: 'block' }}>User / ID</span>
                      <span style={{ color: '#aaa' }}>{k.username}</span>
                  </div>
              )}
              
              <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#555', fontSize: '0.75em', textTransform: 'uppercase', display: 'block' }}>Password / PIN</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#00ffff', fontFamily: 'monospace', fontSize: '1.2em', letterSpacing: '2px' }}>
                          {revealed[k.id] ? k.secret : '••••••••'}
                      </span>
                      <button onClick={() => toggleReveal(k.id)} style={{ background: '#222', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75em' }}>
                          {revealed[k.id] ? 'Hide' : 'Reveal'}
                      </button>
                  </div>
              </div>

              {k.notes && (
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #333' }}>
                      <span style={{ color: '#555', fontSize: '0.75em', textTransform: 'uppercase', display: 'block' }}>Notes</span>
                      <span style={{ color: '#888', fontSize: '0.85em', fontStyle: 'italic' }}>{k.notes}</span>
                  </div>
              )}
            </div>
          ))
        )}

      </div>

      {/* --- ADD NEW CREDENTIAL MODAL --- */}
      {showModal && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', padding: '20px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#fff', margin: 0 }}>Log New Credential</h2>
            <button onClick={() => setShowModal(false)} style={{ background: 'transparent', color: '#fff', border: 'none', fontSize: '1.5em' }}>×</button>
          </div>

          <label style={labelStyle}>Platform / Service Name</label>
          <input type="text" placeholder="E.g. Gate Code, Work Email" value={title} onChange={e=>setTitle(e.target.value)} style={inputStyle} />
          
          <label style={labelStyle}>Username or ID (Optional)</label>
          <input type="text" value={username} onChange={e=>setUsername(e.target.value)} style={inputStyle} />

          <label style={{...labelStyle, color: '#ef4444'}}>Password / PIN / Code</label>
          <input type="text" value={secret} onChange={e=>setSecret(e.target.value)} style={{...inputStyle, border: '1px solid #ef4444'}} />

          <label style={labelStyle}>Notes (Optional)</label>
          <input type="text" value={notes} onChange={e=>setNotes(e.target.value)} style={inputStyle} />

          <button onClick={handleSave} style={{ width: '100%', padding: '15px', background: '#00ffff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginTop: 'auto' }}>
            Save Plaintext Credential
          </button>
        </div>
      )}
    </div>
  );
}
