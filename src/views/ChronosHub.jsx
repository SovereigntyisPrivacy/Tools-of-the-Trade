import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChronosHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hos');

  // --- HOS STATE ---
  const [driveSecs, setDriveSecs] = useState(11 * 3600);
  const [shiftSecs, setShiftSecs] = useState(14 * 3600);
  const [breakSecs, setBreakSecs] = useState(0);

  const [isDriving, setIsDriving] = useState(false);
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);

  // --- LOG STATE ---
  const [logs, setLogs] = useState([]);
  const [logLoc, setLogLoc] = useState('');
  const [logNote, setLogNote] = useState('');
  const [showLogPreview, setShowLogPreview] = useState(false);

  // --- CONTRACTOR STATE ---
  const [flatFee, setFlatFee] = useState('');
  const [materials, setMaterials] = useState('');
  const [workers, setWorkers] = useState([]);

  // --- REFS FOR STABLE INTERVAL ---
  const drivingRef = useRef(isDriving);
  const shiftRef = useRef(isShiftActive);
  const breakRef = useRef(isOnBreak);

  drivingRef.current = isDriving;
  shiftRef.current = isShiftActive;
  breakRef.current = isOnBreak;

  // Background Tick Engine
  useEffect(() => {
    const timer = setInterval(() => {
      if (drivingRef.current) setDriveSecs(d => Math.max(d - 1, 0));
      if (shiftRef.current) setShiftSecs(s => Math.max(s - 1, 0));
      if (breakRef.current) setBreakSecs(b => Math.max(b - 1, 0));
      
      setWorkers(prev => prev.map(w => w.active ? { ...w, secs: w.secs + 1 } : w));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fmt = (totalSecs) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- AUTOMATED LOGGING ---
  const addLogEntry = (eventStr) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog = { id: Date.now(), time: timeStr, loc: logLoc || 'Location Not Set', event: eventStr, note: logNote };
    setLogs([newLog, ...logs]);
    setLogNote(''); 
  };

  // --- HOS HANDLERS ---
  const toggleShift = () => {
    if (!isShiftActive) {
      setIsShiftActive(true);
      addLogEntry('ON DUTY (Shift Started)');
    } else {
      setIsShiftActive(false);
      setIsDriving(false);
      setIsOnBreak(false);
      addLogEntry('OFF DUTY (Shift Ended)');
    }
  };

  const toggleDrive = () => {
    if (!isDriving) {
      setIsShiftActive(true); // Ensure shift runs if driving starts
      setIsOnBreak(false);
      addLogEntry('DRIVING');
    } else {
      addLogEntry('STOPPED DRIVING (On Duty)');
    }
    setIsDriving(!isDriving);
  };

  const startBreak = (mins) => {
    setIsDriving(false);
    setIsOnBreak(true);
    setBreakSecs(mins * 60);
    addLogEntry(`STARTED ${mins}-MIN BREAK`);
  };

  const cancelBreak = () => {
    setIsOnBreak(false);
    addLogEntry('ENDED BREAK');
  };

  const resetHOS = () => {
    setIsDriving(false);
    setIsShiftActive(false);
    setIsOnBreak(false);
    setDriveSecs(11 * 3600);
    setShiftSecs(14 * 3600);
    setBreakSecs(0);
    setLogs([]);
  };

  const manualLog = () => {
    if (!logLoc && !logNote) return;
    addLogEntry('MANUAL ENTRY');
  };

  // --- CONTRACTOR HANDLERS ---
  const addWorker = () => setWorkers([...workers, { id: Date.now(), name: '', rate: 25, secs: 0, active: false }]);
  const updateWorker = (id, field, val) => setWorkers(workers.map(w => w.id === id ? { ...w, [field]: val } : w));
  const toggleWorker = (id) => setWorkers(workers.map(w => w.id === id ? { ...w, active: !w.active } : w));
  const removeWorker = (id) => setWorkers(workers.filter(w => w.id !== id));

  const flat = parseFloat(flatFee) || 0;
  const mats = parseFloat(materials) || 0;
  const workerTotal = workers.reduce((acc, w) => acc + ((w.secs / 3600) * (parseFloat(w.rate) || 0)), 0);
  const totalBill = flat + mats + workerTotal;

  const inputStyle = { background: '#111', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '6px', outline: 'none', width: '100%' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #222', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#10b981', fontSize: '1.2em' }}>Chronos Hub</h2>
      </header>

      <div style={{ display: 'flex', gap: '10px', padding: '15px' }}>
        <button onClick={() => setActiveTab('hos')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'hos' ? '#a855f7' : '#222', color: activeTab === 'hos' ? '#fff' : '#888' }}>HOS & Breaks</button>
        <button onClick={() => setActiveTab('contract')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'contract' ? '#3b82f6' : '#222', color: activeTab === 'contract' ? '#fff' : '#888' }}>Contractor</button>
      </div>

      <div style={{ padding: '0 15px 95px 15px', flex: 1, overflowY: 'auto' }}>
        
        {activeTab === 'hos' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
              <h3 style={{ color: '#10b981', margin: '0 0 15px 0', textAlign: 'center', textTransform: 'uppercase' }}>Hours of Service</h3>
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1, background: '#0a0a0a', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid #222' }}>
                  <div style={{ color: '#888', fontSize: '0.85em', fontWeight: 'bold', marginBottom: '10px' }}>DRIVE (11 HR)</div>
                  <div style={{ color: driveSecs < 3600 ? '#ef4444' : '#10b981', fontSize: '1.5em', fontWeight: 'bold' }}>{fmt(driveSecs)}</div>
                </div>
                <div style={{ flex: 1, background: '#0a0a0a', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid #222' }}>
                  <div style={{ color: '#888', fontSize: '0.85em', fontWeight: 'bold', marginBottom: '10px' }}>SHIFT (14 HR)</div>
                  <div style={{ color: shiftSecs < 3600 ? '#ef4444' : '#10b981', fontSize: '1.5em', fontWeight: 'bold' }}>{fmt(shiftSecs)}</div>
                </div>
              </div>

              <button onClick={toggleShift} style={{ width: '100%', background: isShiftActive ? '#222' : '#a855f7', color: '#fff', border: isShiftActive ? '1px solid #555' : 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '10px' }}>
                {isShiftActive ? 'END 14-HOUR SHIFT' : 'START 14-HOUR SHIFT'}
              </button>

              <button onClick={toggleDrive} style={{ width: '100%', background: isDriving ? '#ef4444' : '#10b981', color: isDriving ? '#fff' : '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '15px' }}>
                {isDriving ? 'STOP DRIVING' : 'START DRIVING'}
              </button>
              
              <button onClick={resetHOS} style={{ width: '100%', background: 'transparent', color: '#ef4444', border: '1px dashed #ef4444', padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>Reset All HOS</button>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
              <h3 style={{ color: '#10b981', margin: '0 0 15px 0', textAlign: 'center', textTransform: 'uppercase' }}>Compliance Rest</h3>
              <div style={{ color: '#f59e0b', fontSize: '2em', fontWeight: 'bold', textAlign: 'center', marginBottom: '15px' }}>{fmt(breakSecs)}</div>
              
              {!isOnBreak ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => startBreak(10)} style={{ flex: 1, background: '#222', color: '#f59e0b', border: '1px solid #f59e0b', padding: '12px 0', borderRadius: '8px', fontWeight: 'bold' }}>10 Min</button>
                  <button onClick={() => startBreak(15)} style={{ flex: 1, background: '#222', color: '#f59e0b', border: '1px solid #f59e0b', padding: '12px 0', borderRadius: '8px', fontWeight: 'bold' }}>15 Min</button>
                  <button onClick={() => startBreak(30)} style={{ flex: 1, background: '#f59e0b', color: '#000', border: 'none', padding: '12px 0', borderRadius: '8px', fontWeight: 'bold' }}>30 Min</button>
                </div>
              ) : (
                <button onClick={cancelBreak} style={{ width: '100%', background: '#ef4444', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>End Break Early</button>
              )}
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ color: '#3b82f6', margin: 0, textTransform: 'uppercase' }}>Duty Log</h3>
                <button onClick={() => setShowLogPreview(true)} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85em' }}>Preview Sheet</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                <input type="text" placeholder="Location / Address" value={logLoc} onChange={e => setLogLoc(e.target.value)} style={inputStyle} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="Notes (e.g. Fuel, Lunch)" value={logNote} onChange={e => setLogNote(e.target.value)} style={{ ...inputStyle, flex: 2 }} />
                  <button onClick={manualLog} style={{ flex: 1, background: '#222', color: '#fff', border: '1px dashed #555', borderRadius: '6px', fontWeight: 'bold' }}>+ Log</button>
                </div>
              </div>

              {logs.slice(0, 3).map(log => (
                <div key={log.id} style={{ background: '#0a0a0a', padding: '10px', borderRadius: '6px', marginBottom: '8px', borderLeft: '3px solid #3b82f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.8em', marginBottom: '5px' }}>
                    <strong style={{ color: '#3b82f6' }}>{log.event}</strong>
                    <span>{log.time}</span>
                  </div>
                  <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9em' }}>{log.loc}</div>
                  {log.note && <div style={{ color: '#aaa', fontSize: '0.85em', marginTop: '4px', fontStyle: 'italic' }}>{log.note}</div>}
                </div>
              ))}
              {logs.length > 3 && <div style={{ textAlign: 'center', color: '#666', fontSize: '0.8em', marginTop: '10px' }}>Tap 'Preview Sheet' to view older logs.</div>}
            </div>
          </>
        )}
        {activeTab === 'contract' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6', textAlign: 'center' }}>
              <h3 style={{ color: '#888', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '0.9em' }}>Total Billable Amount</h3>
              <div style={{ color: '#10b981', fontSize: '2.5em', fontWeight: 'bold', marginBottom: '5px' }}>${totalBill.toFixed(2)}</div>
            </div>

            <div style={{ ...cardStyle }}>
              <h3 style={{ color: '#3b82f6', margin: '0 0 15px 0', textTransform: 'uppercase', fontSize: '0.9em' }}>Fixed Costs</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#888', fontSize: '0.8em', fontWeight: 'bold' }}>Flat Fee ($)</label>
                  <input type="number" value={flatFee} onChange={e => setFlatFee(e.target.value)} placeholder="0.00" style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#888', fontSize: '0.8em', fontWeight: 'bold' }}>Materials ($)</label>
                  <input type="number" value={materials} onChange={e => setMaterials(e.target.value)} placeholder="0.00" style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={{ ...cardStyle }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ color: '#3b82f6', margin: 0, textTransform: 'uppercase', fontSize: '0.9em' }}>Active Workers</h3>
                <button onClick={addWorker} style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: '1px solid #3b82f6', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8em' }}>+ Add</button>
              </div>

              {workers.map((w, idx) => (
                <div key={w.id} style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '8px', padding: '15px', marginBottom: '10px', borderLeft: w.active ? '4px solid #10b981' : '4px solid #444' }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input type="text" placeholder={`Worker ${idx + 1} Name`} value={w.name} onChange={e => updateWorker(w.id, 'name', e.target.value)} style={{ ...inputStyle, flex: 2 }} />
                    <input type="number" placeholder="Rate/hr" value={w.rate} onChange={e => updateWorker(w.id, 'rate', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#fff', fontFamily: 'monospace', fontSize: '1.2em' }}>{fmt(w.secs)}</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => toggleWorker(w.id)} style={{ background: w.active ? '#ef4444' : '#10b981', color: w.active ? '#fff' : '#000', border: 'none', padding: '6px 15px', borderRadius: '4px', fontWeight: 'bold' }}>
                        {w.active ? 'Stop' : 'Start'}
                      </button>
                      <button onClick={() => removeWorker(w.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.2em', padding: '0 8px' }}>×</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* FULL SCREEN LOG PREVIEW OVERLAY */}
      {showLogPreview && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#000', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #3b82f6', paddingBottom: '15px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Daily Duty Sheet</h2>
              <div style={{ color: '#888', fontSize: '0.85em', marginTop: '4px' }}>DOT Compliance Record</div>
            </div>
            <button onClick={() => setShowLogPreview(false)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
          </div>

          {logs.length === 0 ? (
            <div style={{ color: '#666', textAlign: 'center', marginTop: '50px', fontStyle: 'italic' }}>No logs recorded for this shift yet.</div>
          ) : (
            logs.map(log => (
              <div key={log.id} style={{ background: '#111', borderRadius: '8px', borderLeft: '4px solid #3b82f6', padding: '15px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '10px' }}>
                  <strong style={{ color: '#3b82f6', fontSize: '1.1em' }}>{log.event}</strong>
                  <strong style={{ color: '#aaa', fontSize: '1.1em' }}>{log.time}</strong>
                </div>
                <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}>{log.loc}</div>
                {log.note && <div style={{ color: '#888', fontStyle: 'italic', fontSize: '0.9em' }}>"{log.note}"</div>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
