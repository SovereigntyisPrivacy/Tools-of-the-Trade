import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GRIT_QUOTES = [
  "The brick walls are there for a reason. They give us a chance to show how badly we want something. - Randy Pausch",
  "It never gets easier, you just get better.",
  "Pain is inevitable. Suffering is optional. - Haruki Murakami",
  "Fall seven times, stand up eight. - Japanese Proverb",
  "Discipline equals freedom. - Jocko Willink",
  "You don't drown by falling in a river. You drown by staying submerged in it.",
  "Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying, 'I will try again tomorrow.'",
  "No man has the right to be an amateur in the matter of physical training. - Socrates",
  "Embrace the suck.",
  "Endurance is not just the ability to bear a hard thing, but to turn it into glory. - William Barclay"
];

export default function MindsetTracker() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Mindset');
  const [quote] = useState(() => GRIT_QUOTES[Math.floor(Math.random() * GRIT_QUOTES.length)]);
  
  // --- PERSISTENT STORAGE (MAPPED EXACTLY TO OLD FILES) ---
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('tot_mindset_logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [ptLogs, setPtLogs] = useState(() => {
    const saved = localStorage.getItem('tot_pt_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tot_mindset_logs', JSON.stringify(logs));
    localStorage.setItem('tot_pt_logs', JSON.stringify(ptLogs));
  }, [logs, ptLogs]);

  // Mindset Form State
  const [selectedEmoji, setSelectedEmoji] = useState('😐');
  const [energy, setEnergy] = useState(3);
  const [stress, setStress] = useState(3);
  const [focus, setFocus] = useState(3);
  const [notes, setNotes] = useState('');
  
  // PT / Pain Form State
  const [bodyArea, setBodyArea] = useState('Lower Back / Spine');
  const [painLevel, setPainLevel] = useState(2);
  const [stiffness, setStiffness] = useState(2);
  const [ptCompleted, setPtCompleted] = useState(false);
  const [ptNotes, setPtNotes] = useState('');

  const targetAreas = [
    'Lower Back / Spine',
    'Hips / Pelvis',
    'Feet / Plantar Fascia',
    'Neck & Shoulders',
    'Knees / Legs',
    'Wrists / Hands',
    'Full Body Fatigue'
  ];

  const emojis = ['😫', '🙁', '😐', '🙂', '🤩', '🚀'];

  const handleSaveMindset = () => {
    const newLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      emoji: selectedEmoji,
      energy,
      stress,
      focus,
      notes,
      exported: false
    };
    setLogs([newLog, ...logs]);
    setNotes('');
    alert('Mindset Log Saved.');
  };

  const handleSavePhysical = () => {
    const newLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      area: bodyArea,
      pain: painLevel,
      stiffness,
      didPT: ptCompleted,
      notes: ptNotes,
      exported: false
    };
    setPtLogs([newLog, ...ptLogs]);
    setPtNotes('');
    setPtCompleted(false);
    alert('Physical Recovery Log Saved.');
  };

  const deleteMindset = (id) => setLogs(logs.filter(l => l.id !== id));
  const deletePhysical = (id) => setPtLogs(ptLogs.filter(l => l.id !== id));

  const exportLogs = async () => {
    // 1. Grab all unsent logs and tag them with their type
    const unsentMind = logs.filter(l => !l.exported).map(l => ({ ...l, logType: 'MINDSET' }));
    const unsentPhys = ptLogs.filter(l => !l.exported).map(l => ({ ...l, logType: 'PHYSICAL' }));

    if (unsentMind.length === 0 && unsentPhys.length === 0) {
      alert("No new logs to export. All previous logs have been sent.");
      return;
    }

    // 2. Combine them and sort chronologically (oldest to newest for reading flow)
    const combinedLogs = [...unsentMind, ...unsentPhys].sort((a, b) => new Date(a.date) - new Date(b.date));

    // 3. Group by Day
    const groupedLogs = {};
    combinedLogs.forEach(log => {
      const d = new Date(log.date);
      const dateStr = d.toLocaleDateString();
      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (!groupedLogs[dateStr]) groupedLogs[dateStr] = [];
      groupedLogs[dateStr].push({ ...log, timeStr });
    });

    // 4. Build the text output
    let textData = "=== SOVEREIGN HEALTH & RECOVERY EXPORT ===\n";
    textData += `Generated: ${new Date().toLocaleString()}\n\n`;

    for (const [date, dayLogs] of Object.entries(groupedLogs)) {
      textData += `========== ${date} ==========\n\n`;
      
      dayLogs.forEach(l => {
        textData += `[${l.timeStr}] - ${l.logType} LOG\n`;
        
        if (l.logType === 'MINDSET') {
          const e = l.emoji || l.selectedEmoji || '😐';
          const en = l.energy || 3;
          const st = l.stress || 3;
          const fo = l.focus || 3;
          textData += `State: ${e} | Energy: ${en}/5 | Stress: ${st}/5 | Focus: ${fo}/5\nNotes: ${l.notes || 'None'}\n\n`;
        } else {
          const a = l.area || l.bodyArea || 'Unknown';
          const p = l.pain || l.painLevel || 0;
          const s = l.stiffness || 0;
          const pt = l.didPT || l.ptCompleted ? 'Yes' : 'No';
          textData += `Target: ${a} | Pain: ${p}/10 | Stiffness: ${s}/10 | PT Completed: ${pt}\nNotes: ${l.notes || l.ptNotes || 'None'}\n\n`;
        }
      });
    }

    // 5. Trigger Native Android Share Menu
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Health Export ${new Date().toLocaleDateString()}`,
          text: textData
        });
      } else {
        // Fallback if share API is somehow blocked
        await navigator.clipboard.writeText(textData);
        alert("Logs copied to clipboard!");
      }
      
      // 6. Mark them all as exported only AFTER share is triggered
      setLogs(logs.map(l => ({ ...l, exported: true })));
      setPtLogs(ptLogs.map(l => ({ ...l, exported: true })));
      
    } catch (error) {
      console.log("Share canceled or failed", error);
    }
  };

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER */}
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#10b981', fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '1px' }}>Mind & Body Tracker</h2>
      </header>

      {/* QUOTE BLOCK */}
      <div style={{ padding: '15px' }}>
        <div style={{ background: '#111', borderRadius: '12px', borderLeft: '4px solid #a855f7', padding: '15px', fontStyle: 'italic', color: '#ccc', textAlign: 'center', fontSize: '0.95em' }}>
          "{quote}"
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '10px', padding: '0 15px 15px 15px', borderBottom: '1px solid #222' }}>
        <button onClick={() => setActiveTab('Mindset')} style={{ flex: 1, padding: '10px', background: activeTab === 'Mindset' ? '#a855f7' : '#222', color: activeTab === 'Mindset' ? '#fff' : '#888', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Mindset</button>
        <button onClick={() => setActiveTab('Pain')} style={{ flex: 1, padding: '10px', background: activeTab === 'Pain' ? '#06b6d4' : '#222', color: activeTab === 'Pain' ? '#fff' : '#888', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Pain & PT</button>
        <button onClick={() => setActiveTab('History')} style={{ flex: 1, padding: '10px', background: activeTab === 'History' ? '#10b981' : '#222', color: activeTab === 'History' ? '#fff' : '#888', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>History</button>
      </div>

      <div style={{ padding: '15px', overflowY: 'auto' }}>
        
        {/* MINDSET TAB */}
        {activeTab === 'Mindset' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ background: '#111', borderRadius: '12px', padding: '20px' }}>
              <h4 style={{ color: '#a855f7', marginTop: 0, textAlign: 'center', textTransform: 'uppercase' }}>Overall State of Mind</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                {emojis.map(e => (
                  <button key={e} onClick={() => setSelectedEmoji(e)} style={{ fontSize: '1.8em', background: selectedEmoji === e ? 'rgba(168, 85, 247, 0.2)' : 'transparent', border: selectedEmoji === e ? '1px solid #a855f7' : 'none', borderRadius: '8px', padding: '5px', cursor: 'pointer' }}>{e}</button>
                ))}
              </div>
            </div>

            <div style={{ background: '#111', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h4 style={{ color: '#a855f7', margin: 0, textAlign: 'center', textTransform: 'uppercase' }}>Diagnostic Metrics</h4>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', marginBottom: '10px' }}><span>Physical Energy</span> <span style={{ color: '#06b6d4' }}>{energy}/5</span></div>
                <input type="range" min="1" max="5" value={energy} onChange={e => setEnergy(Number(e.target.value))} style={{ width: '100%', accentColor: '#06b6d4' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: '0.8em', marginTop: '5px' }}><span>Exhausted</span><span>Peak</span></div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', marginBottom: '10px' }}><span>Stress / Anxiety</span> <span style={{ color: '#ef4444' }}>{stress}/5</span></div>
                <input type="range" min="1" max="5" value={stress} onChange={e => setStress(Number(e.target.value))} style={{ width: '100%', accentColor: '#ef4444' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: '0.8em', marginTop: '5px' }}><span>Calm</span><span>Overwhelmed</span></div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', marginBottom: '10px' }}><span>Mental Focus</span> <span style={{ color: '#10b981' }}>{focus}/5</span></div>
                <input type="range" min="1" max="5" value={focus} onChange={e => setFocus(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: '0.8em', marginTop: '5px' }}><span>Scattered</span><span>Locked In</span></div>
              </div>
            </div>

            <div style={{ background: '#111', borderRadius: '12px', padding: '20px' }}>
              <h4 style={{ color: '#a855f7', marginTop: 0, textTransform: 'uppercase' }}>Journal / Notes</h4>
              <textarea placeholder="How are you feeling today?" value={notes} onChange={e => setNotes(e.target.value)} rows="4" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#000', color: '#fff', boxSizing: 'border-box' }} />
            </div>

            <button onClick={handleSaveMindset} style={{ background: '#a855f7', color: '#fff', padding: '15px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>Save Mindset Log</button>
          </div>
        )}

        {/* PAIN & PT TAB */}
        {activeTab === 'Pain' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ background: '#111', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ color: '#06b6d4', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Physical Therapy & Pain Log</h4>
                <p style={{ color: '#888', margin: 0, fontSize: '0.9em' }}>Track daily fatigue, heavy lifting strain, and mobility recovery.</p>
              </div>

              <div>
                <label style={{ color: '#ccc', display: 'block', textAlign: 'center', marginBottom: '10px' }}>Target Area / Joint</label>
                <select value={bodyArea} onChange={e => setBodyArea(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#000', color: '#fff', appearance: 'none', textAlign: 'center' }}>
                  {targetAreas.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', marginBottom: '10px' }}><span>Pain Level (1-10)</span> <span style={{ color: '#ef4444' }}>{painLevel}/10</span></div>
                <input type="range" min="1" max="10" value={painLevel} onChange={e => setPainLevel(Number(e.target.value))} style={{ width: '100%', accentColor: '#ef4444' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', marginBottom: '10px' }}><span>Stiffness / Tension (1-10)</span> <span style={{ color: '#f59e0b' }}>{stiffness}/10</span></div>
                <input type="range" min="1" max="10" value={stiffness} onChange={e => setStiffness(Number(e.target.value))} style={{ width: '100%', accentColor: '#f59e0b' }} />
              </div>

              <div onClick={() => setPtCompleted(!ptCompleted)} style={{ background: '#000', padding: '15px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #333', cursor: 'pointer' }}>
                <div style={{ width: '24px', height: '24px', border: ptCompleted ? 'none' : '2px solid #555', background: ptCompleted ? '#10b981' : 'transparent', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {ptCompleted && <span style={{ color: '#fff', fontWeight: 'bold' }}>✓</span>}
                </div>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>Completed Daily Stretch / PT Today</span>
              </div>

              <div>
                <label style={{ color: '#ccc', display: 'block', textAlign: 'center', marginBottom: '10px' }}>Rehab & Physical Notes</label>
                <textarea placeholder="Ice, heat, stretching routines, sleep quality..." value={ptNotes} onChange={e => setPtNotes(e.target.value)} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#000', color: '#fff', boxSizing: 'border-box' }} />
              </div>
            </div>

            <button onClick={handleSavePhysical} style={{ background: '#06b6d4', color: '#000', padding: '15px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>Save Physical Log</button>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'History' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <button onClick={exportLogs} style={{ background: '#111', color: '#10b981', border: '1px solid #10b981', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', width: '100%' }}>
              EXPORT UNSENT LOGS
            </button>

            <h4 style={{ color: '#10b981', textAlign: 'center', textTransform: 'uppercase', margin: '10px 0 0 0' }}>Mindset Logs</h4>
            {logs.length === 0 ? <p style={{ textAlign: 'center', color: '#555' }}>No mindset records found.</p> : (
              logs.map(log => {
                const e = log.emoji || log.selectedEmoji || '😐';
                const en = log.energy || 3;
                const st = log.stress || 3;
                const fo = log.focus || 3;
                return (
                  <div key={log.id} style={{ background: '#111', padding: '15px', borderRadius: '12px', borderLeft: log.exported ? '4px solid #444' : '4px solid #a855f7', position: 'relative' }}>
                    <button onClick={() => deleteMindset(log.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 'bold' }}>X</button>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <span style={{ fontSize: '2em' }}>{e}</span>
                      <div>
                        <h5 style={{ margin: '0 0 5px 0', color: '#fff' }}>{log.date}</h5>
                        <div style={{ display: 'flex', gap: '10px', fontSize: '0.85em', color: '#ccc' }}>
                          <span>⚡ {en}/5</span> | <span style={{ color: '#ef4444' }}>🔥 {st}/5</span> | <span style={{ color: '#10b981' }}>🎯 {fo}/5</span>
                        </div>
                      </div>
                    </div>
                    {log.notes && <p style={{ color: '#888', margin: '10px 0 0 0', fontSize: '0.9em', fontStyle: 'italic' }}>"{log.notes}"</p>}
                    
                    {/* EXPLICIT STATUS BADGES */}
                    {log.exported ? (
                      <span style={{ position: 'absolute', bottom: '10px', right: '10px', color: '#666', fontSize: '0.7em', fontWeight: 'bold', textTransform: 'uppercase' }}>✓ Sent</span>
                    ) : (
                      <span style={{ position: 'absolute', bottom: '10px', right: '10px', color: '#a855f7', fontSize: '0.7em', fontWeight: 'bold', textTransform: 'uppercase' }}>New</span>
                    )}
                  </div>
                )
              })
            )}

            <h4 style={{ color: '#10b981', textAlign: 'center', textTransform: 'uppercase', margin: '20px 0 0 0' }}>Physical Recovery Logs</h4>
            {ptLogs.length === 0 ? <p style={{ textAlign: 'center', color: '#555' }}>No physical therapy records found.</p> : (
              ptLogs.map(log => {
                const a = log.area || log.bodyArea || 'Unknown';
                const p = log.pain || log.painLevel || 0;
                const s = log.stiffness || 0;
                const pt = log.didPT || log.ptCompleted;
                const n = log.notes || log.ptNotes || '';
                return (
                  <div key={log.id} style={{ background: '#111', padding: '15px', borderRadius: '12px', borderLeft: log.exported ? '4px solid #444' : '4px solid #06b6d4', position: 'relative' }}>
                    <button onClick={() => deletePhysical(log.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 'bold' }}>X</button>
                    <h5 style={{ margin: '0 0 5px 0', color: '#fff' }}>{a}</h5>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.85em', color: '#888' }}>{log.date}</p>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.85em', color: '#ccc' }}>
                      <span>Pain: {p}/10</span> | <span>Stiff: {s}/10</span>
                    </div>
                    <div style={{ marginTop: '10px', color: pt ? '#10b981' : '#ef4444', fontSize: '0.85em', fontWeight: 'bold' }}>
                      {pt ? '✓ PT Completed' : '✗ Skipped PT'}
                    </div>
                    {n && <p style={{ color: '#888', margin: '10px 0 0 0', fontSize: '0.9em', fontStyle: 'italic' }}>"{n}"</p>}
                    
                    {/* EXPLICIT STATUS BADGES */}
                    {log.exported ? (
                      <span style={{ position: 'absolute', bottom: '10px', right: '10px', color: '#666', fontSize: '0.7em', fontWeight: 'bold', textTransform: 'uppercase' }}>✓ Sent</span>
                    ) : (
                      <span style={{ position: 'absolute', bottom: '10px', right: '10px', color: '#06b6d4', fontSize: '0.7em', fontWeight: 'bold', textTransform: 'uppercase' }}>New</span>
                    )}
                  </div>
                )
              })
            )}

          </div>
        )}

      </div>
    </div>
  );
}
