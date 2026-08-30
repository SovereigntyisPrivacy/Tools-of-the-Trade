import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GRIT_QUOTES = [
  "“The brick walls are there for a reason. They give us a chance to show how badly we want something.” — Randy Pausch",
  "“It never gets easier, you just get better.”",
  "“Pain is inevitable. Suffering is optional.” — Haruki Murakami",
  "“Fall seven times, stand up eight.” — Japanese Proverb",
  "“Discipline equals freedom.” — Jocko Willink",
  "“You don't drown by falling in a river. You drown by staying submerged in it.”",
  "“Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying, 'I will try again tomorrow.'”",
  "“No man has the right to be an amateur in the matter of physical training.” — Socrates",
  "“Embrace the suck.”",
  "“Endurance is not just the ability to bear a hard thing, but to turn it into glory.” — William Barclay"
];

export default function MindsetTracker() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Log');
  const [quote] = useState(() => GRIT_QUOTES[Math.floor(Math.random() * GRIT_QUOTES.length)]);

  // --- PERSISTENT STORAGE ---
  const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem('tot_mindset_logs')) || []);
  const [ptLogs, setPtLogs] = useState(() => JSON.parse(localStorage.getItem('tot_pt_logs')) || []);

  // Mindset Form State
  const [selectedEmoji, setSelectedEmoji] = useState('😐');
  const [energy, setEnergy] = useState(3);
  const [stress, setStress] = useState(3);
  const [focus, setFocus] = useState(3);
  const [notes, setNotes] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');

  // PT / Pain Form State
  const [bodyArea, setBodyArea] = useState('Lower Back / Spine');
  const [painLevel, setPainLevel] = useState(2);
  const [stiffness, setStiffness] = useState(2);
  const [ptCompleted, setPtCompleted] = useState(false);
  const [ptNotes, setPtNotes] = useState('');

  useEffect(() => {
    localStorage.setItem('tot_mindset_logs', JSON.stringify(logs));
    localStorage.setItem('tot_pt_logs', JSON.stringify(ptLogs));
  }, [logs, ptLogs]);

  const emojis = ['😫', '😕', '😐', '🙂', '😁', '🚀'];
  const colors = ['#ffffff', '#00ffff', '#00cc66', '#f59e0b', '#ef4444', '#a855f7', '#3b82f6'];

  const handleSaveMindset = () => {
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
    setNotes('');
    setActiveTab('History');
  };

  const handleSavePT = () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const newPtLog = {
      id: Date.now(),
      date: dateStr,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      bodyArea,
      painLevel,
      stiffness,
      ptCompleted,
      ptNotes
    };

    setPtLogs([newPtLog, ...ptLogs]);
    setPtNotes('');
    setPtCompleted(false);
    setActiveTab('History');
  };

  const deleteLog = (id, type) => {
    if (window.confirm("Permanently delete this entry?")) {
      if (type === 'mindset') setLogs(logs.filter(l => l.id !== id));
      else setPtLogs(ptLogs.filter(l => l.id !== id));
    }
  };

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '15px' };
  const labelStyle = { color: '#a855f7', fontSize: '0.85em', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '10px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#a855f7', fontSize: '1.2em' }}>Mind & Body Tracker</h2>
      </header>

      {/* MOTIVATIONAL BANNER */}
      <div style={{ margin: '15px', padding: '15px', background: 'rgba(168, 85, 247, 0.08)', borderRadius: '10px', borderLeft: '4px solid #a855f7' }}>
        <p style={{ margin: 0, color: '#f3e8ff', fontSize: '0.85rem', fontStyle: 'italic', lineHeight: '1.4' }}>{quote}</p>
      </div>

      <div style={{ display: 'flex', padding: '0 15px 15px 15px', gap: '8px' }}>
        <button onClick={() => setActiveTab('Log')} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === 'Log' ? '#a855f7' : '#222', color: activeTab === 'Log' ? '#fff' : '#888' }}>Mindset</button>
        <button onClick={() => setActiveTab('PT')} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === 'PT' ? '#00ffff' : '#222', color: activeTab === 'PT' ? '#000' : '#888' }}>Pain & PT</button>
        <button onClick={() => setActiveTab('History')} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === 'History' ? '#00cc66' : '#222', color: activeTab === 'History' ? '#000' : '#888' }}>History</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto', flex: 1 }}>
        
        {activeTab === 'Log' && (
          <>
            <div style={cardStyle}>
              <label style={labelStyle}>Overall State of Mind</label>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #222' }}>
                {emojis.map(e => (
                  <button key={e} onClick={() => setSelectedEmoji(e)} style={{ background: selectedEmoji === e ? '#333' : 'transparent', border: selectedEmoji === e ? '1px solid #a855f7' : 'none', fontSize: '1.8em', padding: '5px', borderRadius: '8px', cursor: 'pointer' }}>
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
                    <div key={c} onClick={() => setTextColor(c)} style={{ width: '18px', height: '18px', borderRadius: '50%', background: c, border: textColor === c ? '2px solid #fff' : '1px solid #333', cursor: 'pointer' }} />
                  ))}
                </div>
              </div>
              <textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                placeholder="How are you feeling today?"
                style={{ width: '100%', height: '100px', background: '#000', color: textColor, border: '1px solid #333', borderRadius: '8px', padding: '12px', fontSize: '0.95em', fontFamily: 'monospace', resize: 'none' }}
              />
            </div>

            <button onClick={handleSaveMindset} style={{ width: '100%', padding: '15px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>
              Save Mindset Log
            </button>
          </>
        )}

        {activeTab === 'PT' && (
          <>
            <div style={cardStyle}>
              <label style={{ ...labelStyle, color: '#00ffff' }}>Physical Therapy & Pain Log</label>
              <p style={{ color: '#888', fontSize: '0.8em', marginBottom: '15px' }}>Track daily fatigue, heavy lifting strain, and mobility recovery.</p>

              <div style={{ marginBottom: '15px' }}>
                <span style={{ color: '#ccc', fontSize: '0.8em', display: 'block', marginBottom: '5px' }}>Target Area / Joint</span>
                <select value={bodyArea} onChange={(e) => setBodyArea(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', color: '#fff', border: '1px solid #333', borderRadius: '6px' }}>
                  <option value="Lower Back / Spine">Lower Back / Spine</option>
                  <option value="Feet / Plantar">Feet / Plantar Fascia</option>
                  <option value="Neck & Shoulders">Neck & Shoulders</option>
                  <option value="Knees / Legs">Knees / Legs</option>
                  <option value="Wrists / Hands">Wrists / Hands</option>
                  <option value="Full Body Fatigue">Full Body Fatigue</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', fontSize: '0.85em', marginBottom: '5px' }}><span>Pain Level (1-10)</span><span style={{ color: '#ef4444', fontWeight: 'bold' }}>{painLevel}/10</span></div>
                <input type="range" min="1" max="10" value={painLevel} onChange={(e) => setPainLevel(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#ef4444' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', fontSize: '0.85em', marginBottom: '5px' }}><span>Stiffness / Tension (1-10)</span><span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{stiffness}/10</span></div>
                <input type="range" min="1" max="10" value={stiffness} onChange={(e) => setStiffness(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#f59e0b' }} />
              </div>

              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', background: '#000', padding: '12px', borderRadius: '8px', border: '1px solid #333' }}>
                <input type="checkbox" checked={ptCompleted} onChange={(e) => setPtCompleted(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: '#00cc66' }} />
                <span style={{ color: '#fff', fontSize: '0.9em', fontWeight: 'bold' }}>Completed Daily Stretch / PT Today</span>
              </div>

              <div>
                <span style={{ color: '#ccc', fontSize: '0.8em', display: 'block', marginBottom: '5px' }}>Rehab & Physical Notes</span>
                <textarea 
                  value={ptNotes} 
                  onChange={(e) => setPtNotes(e.target.value)} 
                  placeholder="Ice, heat, stretching routines, sleep quality..."
                  style={{ width: '100%', height: '80px', background: '#000', color: '#fff', border: '1px solid #333', borderRadius: '8px', padding: '10px', fontSize: '0.9em', resize: 'none' }}
                />
              </div>
            </div>

            <button onClick={handleSavePT} style={{ width: '100%', padding: '15px', background: '#00ffff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>
              Save Physical Log
            </button>
          </>
        )}

        {activeTab === 'History' && (
          <div>
            <h3 style={{ color: '#a855f7', fontSize: '1em', textTransform: 'uppercase', marginBottom: '10px' }}>Mindset Logs</h3>
            {logs.length === 0 ? (
              <p style={{ color: '#555', fontStyle: 'italic', marginBottom: '20px' }}>No mindset records found.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} style={{ ...cardStyle, position: 'relative' }}>
                  <button onClick={() => deleteLog(log.id, 'mindset')} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 'bold', fontSize: '1.2em' }}>x</button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '2em' }}>{log.emoji}</div>
                    <div>
                      <strong style={{ color: '#fff' }}>{log.date}</strong><br/>
                      <span style={{ color: '#888', fontSize: '0.75em' }}>{log.time}</span>
                    </div>
                  </div>
                  {log.notes && (
                    <div style={{ background: '#000', padding: '10px', borderRadius: '6px', borderLeft: `4px solid ${log.color}` }}>
                      <p style={{ margin: 0, color: log.color, fontSize: '0.9em', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{log.notes}</p>
                    </div>
                  )}
                </div>
              ))
            )}

            <h3 style={{ color: '#00ffff', fontSize: '1em', textTransform: 'uppercase', marginBottom: '10px', marginTop: '30px' }}>Physical Recovery Logs</h3>
            {ptLogs.length === 0 ? (
              <p style={{ color: '#555', fontStyle: 'italic' }}>No physical therapy records found.</p>
            ) : (
              ptLogs.map((pt) => (
                <div key={pt.id} style={{ ...cardStyle, position: 'relative', borderLeft: '4px solid #00ffff' }}>
                  <button onClick={() => deleteLog(pt.id, 'pt')} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 'bold', fontSize: '1.2em' }}>x</button>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{ color: '#00ffff' }}>{pt.bodyArea}</strong>
                    <span style={{ color: '#888', fontSize: '0.8em' }}>{pt.date}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '0.85em', marginBottom: '8px', color: '#ccc' }}>
                    <span>Pain: <strong style={{ color: '#ef4444' }}>{pt.painLevel}/10</strong></span>
                    <span>Stiff: <strong style={{ color: '#f59e0b' }}>{pt.stiffness}/10</strong></span>
                    <span>PT: <strong style={{ color: '#00cc66' }}>{pt.ptCompleted ? 'Done ✓' : 'Missed'}</strong></span>
                  </div>
                  {pt.ptNotes && <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, background: '#000', padding: '8px', borderRadius: '4px' }}>{pt.ptNotes}</p>}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
