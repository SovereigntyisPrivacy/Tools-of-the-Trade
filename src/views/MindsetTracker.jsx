import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MindsetTracker() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Log');

  // --- STATE ---
  const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem('tot_mindset_logs')) || []);
  
  // Current Entry State
  const [selectedEmoji, setSelectedEmoji] = useState('😐');
  const [energy, setEnergy] = useState(3);
  const [stress, setStress] = useState(3);
  const [focus, setFocus] = useState(3);
  const [notes, setNotes] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');

  useEffect(() => {
    localStorage.setItem('tot_mindset_logs', JSON.stringify(logs));
  }, [logs]);

  const emojis = ['😫', '😕', '😐', '🙂', '😁', '🚀'];
  const colors = ['#ffffff', '#00ffff', '#00cc66', '#f59e0b', '#ef4444', '#a855f7', '#3b82f6'];

  const handleSaveLog = () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const newLog = {
      id: Date.now(),
      date: dateStr,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emoji: selectedEmoji,
      metrics: { energy, stress, focus },
      notes,
      color: textColor
    };

    setLogs([newLog, ...logs]);
    
    // Reset form
    setNotes('');
    setEnergy(3);
    setStress(3);
    setFocus(3);
    setSelectedEmoji('😐');
    setActiveTab('History');
  };

  const deleteLog = (id) => {
    if (window.confirm("Delete this log permanently?")) {
      setLogs(logs.filter(l => l.id !== id));
    }
  };

  // --- STYLES ---
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '15px' };
  const labelStyle = { color: '#a855f7', fontSize: '0.85em', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '10px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#a855f7', fontSize: '1.2em' }}>Mindset Tracker</h2>
      </header>

      <div style={{ display: 'flex', padding: '15px', gap: '10px' }}>
        <button onClick={() => setActiveTab('Log')} style={{ flex: 1, padding: '12px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === 'Log' ? '#a855f7' : '#222', color: activeTab === 'Log' ? '#fff' : '#888' }}>Log Today</button>
        <button onClick={() => setActiveTab('History')} style={{ flex: 1, padding: '12px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === 'History' ? '#00ffff' : '#222', color: activeTab === 'History' ? '#000' : '#888' }}>History & Notes</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        
        {activeTab === 'Log' && (
          <>
            <div style={cardStyle}>
              <label style={labelStyle}>Overall State of Mind</label>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #222' }}>
                {emojis.map(e => (
                  <button key={e} onClick={() => setSelectedEmoji(e)} style={{ background: selectedEmoji === e ? '#333' : 'transparent', border: selectedEmoji === e ? '1px solid #a855f7' : 'none', fontSize: '1.8em', padding: '5px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <label style={labelStyle}>Diagnostic Metrics</label>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', fontSize: '0.85em', marginBottom: '5px' }}><span>Physical Energy</span><span style={{ color: '#00ffff' }}>{energy}/5</span></div>
                <input type="range" min="1" max="5" value={energy} onChange={(e) => setEnergy(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#00ffff' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: '0.7em', marginTop: '5px' }}><span>Exhausted</span><span>Peak</span></div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', fontSize: '0.85em', marginBottom: '5px' }}><span>Stress / Anxiety</span><span style={{ color: '#ef4444' }}>{stress}/5</span></div>
                <input type="range" min="1" max="5" value={stress} onChange={(e) => setStress(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#ef4444' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: '0.7em', marginTop: '5px' }}><span>Calm</span><span>Overwhelmed</span></div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', fontSize: '0.85em', marginBottom: '5px' }}><span>Mental Focus</span><span style={{ color: '#00cc66' }}>{focus}/5</span></div>
                <input type="range" min="1" max="5" value={focus} onChange={(e) => setFocus(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#00cc66' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: '0.7em', marginTop: '5px' }}><span>Scattered</span><span>Locked In</span></div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Journal / Notes</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {colors.map(c => (
                    <div key={c} onClick={() => setTextColor(c)} style={{ width: '20px', height: '20px', borderRadius: '50%', background: c, border: textColor === c ? '2px solid #fff' : '1px solid #333', cursor: 'pointer' }} />
                  ))}
                </div>
              </div>
              <textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                placeholder="How are you feeling today? (Select a color above)"
                style={{ width: '100%', height: '120px', background: '#000', color: textColor, border: '1px solid #333', borderRadius: '8px', padding: '12px', fontSize: '1em', fontFamily: 'monospace', resize: 'none' }}
              />
            </div>

            <button onClick={handleSaveLog} style={{ width: '100%', padding: '15px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', boxShadow: '0 4px 10px rgba(168, 85, 247, 0.3)' }}>
              Save to Local Log
            </button>
          </>
        )}

        {activeTab === 'History' && (
          <div>
            {logs.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#555', fontStyle: 'italic', marginTop: '40px' }}>No mindset logs saved yet.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} style={{ ...cardStyle, position: 'relative' }}>
                  <button onClick={() => deleteLog(log.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 'bold', fontSize: '1.2em' }}>x</button>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                    <div style={{ fontSize: '2.5em' }}>{log.emoji}</div>
                    <div>
                      <strong style={{ color: '#fff', fontSize: '1.1em', display: 'block' }}>{log.date}</strong>
                      <span style={{ color: '#888', fontSize: '0.8em' }}>{log.time}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #222' }}>
                    <div style={{ textAlign: 'center' }}><div style={{ color: '#00ffff', fontWeight: 'bold' }}>{log.metrics.energy}</div><div style={{ color: '#555', fontSize: '0.65em', textTransform: 'uppercase' }}>Energy</div></div>
                    <div style={{ textAlign: 'center' }}><div style={{ color: '#ef4444', fontWeight: 'bold' }}>{log.metrics.stress}</div><div style={{ color: '#555', fontSize: '0.65em', textTransform: 'uppercase' }}>Stress</div></div>
                    <div style={{ textAlign: 'center' }}><div style={{ color: '#00cc66', fontWeight: 'bold' }}>{log.metrics.focus}</div><div style={{ color: '#555', fontSize: '0.65em', textTransform: 'uppercase' }}>Focus</div></div>
                  </div>

                  {log.notes && (
                    <div style={{ background: '#000', padding: '15px', borderRadius: '8px', borderLeft: `4px solid ${log.color}` }}>
                      <p style={{ margin: 0, color: log.color, fontSize: '0.95em', lineHeight: '1.5', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        {log.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
