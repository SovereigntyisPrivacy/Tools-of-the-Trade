import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChronosHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Trucker');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const ticker = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(ticker);
  }, []);

  // --- TRUCKER HOS STATE ---
  const [trucker, setTrucker] = useState(() => JSON.parse(localStorage.getItem('chronos_trucker')) || { 
      driveStart: null, driveAccum: 0, driveRunning: false, 
      shiftStart: null, shiftAccum: 0, shiftRunning: false 
  });
  useEffect(() => { localStorage.setItem('chronos_trucker', JSON.stringify(trucker)); }, [trucker]);

  // --- DOT BREAK STATE ---
  const [breakEnd, setBreakEnd] = useState(() => parseInt(localStorage.getItem('chronos_break') || '0', 10));
  useEffect(() => { localStorage.setItem('chronos_break', breakEnd.toString()); }, [breakEnd]);

  // --- CONTRACTOR STATE ---
  const [contractor, setContractor] = useState(() => JSON.parse(localStorage.getItem('chronos_contractor')) || { 
      start: null, accum: 0, running: false, rate: 25 
  });
  useEffect(() => { localStorage.setItem('chronos_contractor', JSON.stringify(contractor)); }, [contractor]);

  const formatTime = (ms) => {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const driveTime = trucker.driveRunning ? trucker.driveAccum + (now - trucker.driveStart) : trucker.driveAccum;
  const shiftTime = trucker.shiftRunning ? trucker.shiftAccum + (now - trucker.shiftStart) : trucker.shiftAccum;
  const driveRem = Math.max(0, 39600000 - driveTime); 
  const shiftRem = Math.max(0, 50400000 - shiftTime); 

  const conTime = contractor.running ? contractor.accum + (now - contractor.start) : contractor.accum;
  const conEarned = (conTime / 3600000) * contractor.rate;
  const breakRem = Math.max(0, breakEnd - now);

  // Dynamic Color Warnings
  const getAlertColor = (ms) => {
      if (ms <= 0) return '#ef4444'; 
      if (ms < 3600000) return '#ef4444'; // Red (< 1 hr)
      if (ms < 7200000) return '#f59e0b'; // Yellow (< 2 hrs)
      return '#00cc66'; // Green
  };

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const btnStyle = { flex: 1, padding: '15px', fontSize: '1.2em', fontWeight: 'bold', borderRadius: '8px', border: 'none' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Chronos Hub</h2>
      </header>

      <div style={{ display: 'flex', background: '#111', padding: '10px', gap: '6px' }}>
        <button onClick={() => setActiveTab('Trucker')} style={{ flex: 1, padding: '8px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === 'Trucker' ? '#a855f7' : '#222', color: activeTab === 'Trucker' ? '#fff' : '#aaa' }}>HOS & Breaks</button>
        <button onClick={() => setActiveTab('Contractor')} style={{ flex: 1, padding: '8px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === 'Contractor' ? '#3b82f6' : '#222', color: activeTab === 'Contractor' ? '#fff' : '#aaa' }}>Contractor</button>
      </div>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        {activeTab === 'Trucker' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
             {/* HOS Monitors */}
             <div style={{...cardStyle, borderTop: '4px solid #a855f7', marginBottom: 0}}>
                <h3 style={{ margin: '0 0 15px 0', color: '#fff', textAlign: 'center', textTransform: 'uppercase' }}>Hours of Service</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1, background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222', textAlign: 'center' }}>
                        <div style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.7em', marginBottom: '5px' }}>Drive (11 Hr)</div>
                        <div style={{ fontSize: '2em', color: getAlertColor(driveRem), fontWeight: 'bold', fontFamily: 'monospace' }}>{formatTime(driveRem)}</div>
                    </div>
                    <div style={{ flex: 1, background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222', textAlign: 'center' }}>
                        <div style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.7em', marginBottom: '5px' }}>Shift (14 Hr)</div>
                        <div style={{ fontSize: '2em', color: getAlertColor(shiftRem), fontWeight: 'bold', fontFamily: 'monospace' }}>{formatTime(shiftRem)}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                   <button onClick={() => setTrucker(prev => prev.driveRunning ? {...prev, driveRunning: false, driveAccum: prev.driveAccum + (now - prev.driveStart), driveStart: null} : {...prev, driveRunning: true, driveStart: now})} style={{ ...btnStyle, background: trucker.driveRunning ? '#ef4444' : '#00cc66', color: '#000', fontSize: '1em' }}>
                      {trucker.driveRunning ? 'STOP DRIVING' : 'START DRIVING'}
                   </button>
                   <button onClick={() => setTrucker(prev => prev.shiftRunning ? {...prev, shiftRunning: false, shiftAccum: prev.shiftAccum + (now - prev.shiftStart), shiftStart: null} : {...prev, shiftRunning: true, shiftStart: now})} style={{ ...btnStyle, background: trucker.shiftRunning ? '#222' : '#333', color: '#fff', fontSize: '1em' }}>
                      {trucker.shiftRunning ? 'END SHIFT' : 'START SHIFT'}
                   </button>
                </div>
                <button onClick={() => setTrucker({driveStart: null, driveAccum: 0, driveRunning: false, shiftStart: null, shiftAccum: 0, shiftRunning: false})} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', marginTop: '10px' }}>Reset All HOS</button>
             </div>

             {/* Integrated Break Timer */}
             <div style={{...cardStyle, borderTop: '4px solid #f59e0b'}}>
                <h3 style={{ margin: '0 0 15px 0', color: '#fff', textAlign: 'center', textTransform: 'uppercase' }}>Compliance Rest</h3>
                {breakRem > 0 ? (
                    <div style={{ textAlign: 'center' }}>
                       <div style={{ fontSize: '3.5em', color: '#f59e0b', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: '15px' }}>{formatTime(breakRem)}</div>
                       <button onClick={() => setBreakEnd(0)} style={{ width: '100%', padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Cancel Break</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setBreakEnd(now + (15 * 60000))} style={{ flex: 1, padding: '12px', background: '#222', color: '#fff', border: '1px solid #333', borderRadius: '8px', fontWeight: 'bold' }}>15 Min Rest</button>
                        <button onClick={() => setBreakEnd(now + (30 * 60000))} style={{ flex: 1, padding: '12px', background: '#222', color: '#f59e0b', border: '1px solid #f59e0b', borderRadius: '8px', fontWeight: 'bold' }}>30 Min DOT</button>
                    </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'Contractor' && (
          <div style={{...cardStyle, borderTop: '4px solid #3b82f6', textAlign: 'center'}}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ color: '#aaa', textTransform: 'uppercase', fontWeight: 'bold' }}>Hourly Rate</span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                   <span style={{ color: '#00cc66', fontSize: '1.2em' }}>$</span>
                   <input type="number" value={contractor.rate} onChange={e => setContractor({...contractor, rate: e.target.value})} style={{ background: 'transparent', border: 'none', color: '#00cc66', fontSize: '1.5em', fontWeight: 'bold', width: '80px', textAlign: 'right' }} />
                </div>
             </div>
             
             <div style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.8em' }}>Billable Time</div>
             <div style={{ fontSize: '4em', color: contractor.running ? '#00ffff' : '#fff', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: '10px' }}>
                {formatTime(conTime)}
             </div>
             
             <div style={{ color: '#00cc66', fontSize: '2em', fontWeight: 'bold', marginBottom: '25px' }}>
                + ${conEarned.toFixed(2)}
             </div>

             <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setContractor(prev => prev.running ? {...prev, running: false, accum: prev.accum + (now - prev.start), start: null} : {...prev, running: true, start: now})} style={{ ...btnStyle, background: contractor.running ? '#ef4444' : '#00cc66', color: '#000' }}>
                   {contractor.running ? 'PAUSE' : 'START'}
                </button>
                <button onClick={() => setContractor({...contractor, start: null, accum: 0, running: false})} style={{ flex: 1, padding: '15px', background: '#222', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Reset</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
