import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../core/CalendarContext';

export default function ChronosHub() {
  const navigate = useNavigate();
  const { addReminder } = useCalendar();
  const [activeTab, setActiveTab] = useState('hos');

  // --- TIMESTAMP HOS STATE ---
  const [shiftStart, setShiftStart] = useState(() => parseInt(localStorage.getItem('chronos_shift_start')) || null);
  const [driveStart, setDriveStart] = useState(() => parseInt(localStorage.getItem('chronos_drive_start')) || null);
  const [driveAccum, setDriveAccum] = useState(() => parseInt(localStorage.getItem('chronos_drive_accum')) || 0);
  const [breakEnd, setBreakEnd] = useState(() => parseInt(localStorage.getItem('chronos_break_end')) || null);
  const [now, setNow] = useState(Date.now());

  // --- LOG STATE ---
  const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem('chronos_logs')) || []);
  const [logLoc, setLogLoc] = useState('');
  const [logNote, setLogNote] = useState('');
  const [showLogPreview, setShowLogPreview] = useState(false);
  const [shiftHistory, setShiftHistory] = useState(() => JSON.parse(localStorage.getItem('chronos_shift_hist')) || []);

  // --- CONTRACTOR STATE ---
  const [flatFee, setFlatFee] = useState(() => localStorage.getItem('chronos_flat') || '');
  const [materials, setMaterials] = useState(() => JSON.parse(localStorage.getItem('chronos_mats')) || []);
  const [newMatName, setNewMatName] = useState('');
  const [newMatCost, setNewMatCost] = useState('');
  const [newMatQty, setNewMatQty] = useState('');
  const [newMatSerial, setNewMatSerial] = useState('');

  const [workers, setWorkers] = useState(() => JSON.parse(localStorage.getItem('chronos_workers')) || []);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptView, setReceiptView] = useState('customer');
  const [jobHistory, setJobHistory] = useState(() => JSON.parse(localStorage.getItem('chronos_job_hist')) || []);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('chronos_shift_start', shiftStart || '');
    localStorage.setItem('chronos_drive_start', driveStart || '');
    localStorage.setItem('chronos_drive_accum', driveAccum.toString());
    localStorage.setItem('chronos_break_end', breakEnd || '');
    localStorage.setItem('chronos_logs', JSON.stringify(logs));
    localStorage.setItem('chronos_flat', flatFee);
    localStorage.setItem('chronos_mats', JSON.stringify(materials));
    localStorage.setItem('chronos_workers', JSON.stringify(workers));
    localStorage.setItem('chronos_shift_hist', JSON.stringify(shiftHistory));
    localStorage.setItem('chronos_job_hist', JSON.stringify(jobHistory));
  }, [shiftStart, driveStart, driveAccum, breakEnd, logs, flatFee, materials, workers, shiftHistory, jobHistory]);

  const shiftElapsed = shiftStart ? Math.floor((now - shiftStart) / 1000) : 0;
  const shiftSecs = Math.max((14 * 3600) - shiftElapsed, 0);
  const currentDriveActive = driveStart ? Math.floor((now - driveStart) / 1000) : 0;
  const totalDriveSecs = driveAccum + currentDriveActive;
  const driveSecs = Math.max((11 * 3600) - totalDriveSecs, 0);
  const breakSecs = breakEnd ? Math.max(Math.floor((breakEnd - now) / 1000), 0) : 0;
  const isOnBreak = breakSecs > 0;

  const fmt = (totalSecs) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  // --- OFFLINE CSV EXPORTER ---
  const downloadCSV = (csvContent, fileName) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportShiftHistory = () => {
    let csv = 'Date,Time,Event,Location,Notes\n';
    shiftHistory.forEach(shift => {
      shift.logs.forEach(l => { csv += `"${shift.date}","${l.time}","${l.event}","${l.loc}","${l.note}"\n`; });
    });
    downloadCSV(csv, `DOT_Logs_Archive_${new Date().getTime()}.csv`);
  };

  const exportJobHistory = () => {
    let csv = 'Date,Flat Fee,Material Cost,Labor Cost,Total Billable\n';
    jobHistory.forEach(job => { csv += `"${job.date}","${job.flat}","${job.mat}","${job.labor}","${job.total}"\n`; });
    downloadCSV(csv, `Job_Invoices_Archive_${new Date().getTime()}.csv`);
  };

  // --- ACTIONS ---
  const addLogEntry = (eventStr) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLogs([{ id: Date.now(), time: timeStr, loc: logLoc || 'Location Not Set', event: eventStr, note: logNote }, ...logs]);
    setLogNote('');
  };

  const closeAndSaveShift = () => {
    if (logs.length > 0) setShiftHistory([{ id: Date.now(), date: new Date().toLocaleDateString(), logs }, ...shiftHistory]);
    setShiftStart(null); setDriveStart(null); setDriveAccum(0); setBreakEnd(null); setLogs([]);
    setShowLogPreview(false);
  };

  const closeAndSaveJob = () => {
    setJobHistory([{ id: Date.now(), date: new Date().toLocaleDateString(), flat: flat, mat: matTotal, labor: laborTotal, total: totalBill }, ...jobHistory]);
    setFlatFee(''); setMaterials([]); setWorkers([]); setShowReceipt(false);
  };

  const toggleShift = () => {
    if (!shiftStart) { setShiftStart(Date.now()); addLogEntry('ON DUTY (Shift Started)'); } 
    else {
      if (driveStart) setDriveAccum(driveAccum + Math.floor((Date.now() - driveStart) / 1000));
      setShiftStart(null); setDriveStart(null); setDriveAccum(0); setBreakEnd(null); addLogEntry('OFF DUTY (Shift Ended)');
    }
  };

  const toggleDrive = () => {
    if (!driveStart) {
      if (!shiftStart) setShiftStart(Date.now()); 
      setDriveStart(Date.now()); setBreakEnd(null); addLogEntry('DRIVING');
    } else {
      setDriveAccum(driveAccum + Math.floor((Date.now() - driveStart) / 1000)); setDriveStart(null); addLogEntry('ON DUTY (Not Driving)');
    }
  };

  const startBreak = (mins) => {
    if (driveStart) { setDriveAccum(driveAccum + Math.floor((Date.now() - driveStart) / 1000)); setDriveStart(null); }
    setBreakEnd(Date.now() + (mins * 60 * 1000)); addLogEntry(`STARTED ${mins}-MIN BREAK (Off Duty)`);
  };

  const addWorker = () => setWorkers([...workers, { id: Date.now(), name: '', rate: 25, start: null, accumSecs: 0, active: false }]);
  const updateWorker = (id, field, val) => setWorkers(workers.map(w => w.id === id ? { ...w, [field]: val } : w));
  
  const toggleWorker = (id) => {
    setWorkers(workers.map(w => {
      if (w.id !== id) return w;
      if (!w.active) return { ...w, active: true, start: Date.now() };
      const added = w.start ? Math.floor((Date.now() - w.start) / 1000) : 0;
      return { ...w, active: false, start: null, accumSecs: w.accumSecs + added };
    }));
  };

  const masterToggleWorkers = () => {
    const anyActive = workers.some(w => w.active);
    setWorkers(workers.map(w => {
      if (!anyActive) return { ...w, active: true, start: Date.now() };
      const added = w.start ? Math.floor((Date.now() - w.start) / 1000) : 0;
      return { ...w, active: false, start: null, accumSecs: w.accumSecs + added };
    }));
  };

  const removeWorker = (id) => setWorkers(workers.filter(w => w.id !== id));
  const addMaterial = () => {
    if (!newMatName || !newMatCost) return;
    setMaterials([...materials, { id: Date.now(), name: newMatName, cost: parseFloat(newMatCost) || 0, qty: parseInt(newMatQty) || 1, serial: newMatSerial || 'N/A' }]);
    setNewMatName(''); setNewMatCost(''); setNewMatQty(''); setNewMatSerial('');
  };
  const removeMaterial = (id) => setMaterials(materials.filter(m => m.id !== id));

  const flat = parseFloat(flatFee) || 0;
  const matTotal = materials.reduce((sum, m) => sum + (m.cost * m.qty), 0);
  const workerData = workers.map(w => {
    const liveSecs = w.active && w.start ? Math.floor((Date.now() - w.start) / 1000) : 0;
    const pay = ((w.accumSecs + liveSecs) / 3600) * (parseFloat(w.rate) || 0);
    return { ...w, totalSecs: w.accumSecs + liveSecs, pay };
  });

  const laborTotal = workerData.reduce((sum, w) => sum + w.pay, 0);
  const totalBill = flat + matTotal + laborTotal;

  const inputStyle = { background: '#111', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '6px', outline: 'none', width: '100%' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #222', padding: '15px', marginBottom: '15px' };
  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#10b981', fontSize: '1.2em' }}>Chronos Engine</h2>
      </header>

      <div style={{ display: 'flex', gap: '10px', padding: '15px' }}>
        <button onClick={() => setActiveTab('hos')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'hos' ? '#a855f7' : '#222', color: activeTab === 'hos' ? '#fff' : '#888' }}>HOS Logs</button>
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
              <button onClick={toggleShift} style={{ width: '100%', background: shiftStart ? '#222' : '#a855f7', color: '#fff', border: shiftStart ? '1px solid #555' : 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '10px' }}>{shiftStart ? 'END 14-HOUR SHIFT' : 'START 14-HOUR SHIFT'}</button>
              <button onClick={toggleDrive} style={{ width: '100%', background: driveStart ? '#ef4444' : '#10b981', color: driveStart ? '#fff' : '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '15px' }}>{driveStart ? 'STOP DRIVING' : 'START DRIVING'}</button>
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
                <button onClick={() => setShowLogPreview(true)} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85em' }}>View Graph / Export</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                <input type="text" placeholder="Location / Address" value={logLoc} onChange={e => setLogLoc(e.target.value)} style={inputStyle} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="Notes (e.g. Fuel)" value={logNote} onChange={e => setLogNote(e.target.value)} style={{ ...inputStyle, flex: 2 }} />
                  <button onClick={() => {if(logLoc || logNote) addLogEntry('MANUAL ENTRY')}} style={{ flex: 1, background: '#222', color: '#fff', border: '1px dashed #555', borderRadius: '6px', fontWeight: 'bold' }}>+ Log</button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'contract' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6', textAlign: 'center' }}>
              <h3 style={{ color: '#10b981', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '0.9em' }}>Total Billable Amount</h3>
              <div style={{ color: '#10b981', fontSize: '2.5em', fontWeight: 'bold', marginBottom: '10px' }}>${totalBill.toFixed(2)}</div>
              <button onClick={() => setShowReceipt(true)} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', width: '100%' }}>View Receipt / Export</button>
            </div>
            
            <div style={{ ...cardStyle }}>
              <h3 style={{ color: '#10b981', margin: '0 0 15px 0', textTransform: 'uppercase', fontSize: '0.9em' }}>Fixed Costs</h3>
              <div style={{ display: 'flex', gap: '10px' }}><div style={{ flex: 1 }}><input type="number" value={flatFee} onChange={e => setFlatFee(e.target.value)} placeholder="Flat Fee ($)" style={inputStyle} /></div></div>
            </div>

            <div style={{ ...cardStyle }}>
              <h3 style={{ color: '#10b981', margin: '0 0 15px 0', textTransform: 'uppercase', fontSize: '0.9em' }}>Materials & S/N</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                <input type="text" placeholder="Material Name" value={newMatName} onChange={e => setNewMatName(e.target.value)} style={inputStyle} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="number" placeholder="Cost ($)" value={newMatCost} onChange={e => setNewMatCost(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                  <input type="number" placeholder="Qty" value={newMatQty} onChange={e => setNewMatQty(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                </div>
                <input type="text" placeholder="S/N (Optional)" value={newMatSerial} onChange={e => setNewMatSerial(e.target.value)} style={inputStyle} />
                <button onClick={addMaterial} style={{ background: '#f59e0b', color: '#000', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>+ Add Material</button>
              </div>
              {materials.map(m => (
                <div key={m.id} style={{ background: '#0a0a0a', padding: '10px', borderRadius: '6px', marginBottom: '8px', borderLeft: '3px solid #f59e0b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><strong style={{ color: '#fff' }}>{m.name}</strong> (x{m.qty}) - <span style={{ color: '#10b981' }}>${(m.cost * m.qty).toFixed(2)}</span></div>
                  <button onClick={() => removeMaterial(m.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.2em' }}>×</button>
                </div>
              ))}
            </div>

            <div style={{ ...cardStyle }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ color: '#10b981', margin: 0, textTransform: 'uppercase', fontSize: '0.9em' }}>Crew</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={masterToggleWorkers} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.75em' }}>Start/Stop All</button>
                  <button onClick={addWorker} style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: '1px solid #3b82f6', padding: '6px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.75em' }}>+ Add</button>
                </div>
              </div>
              {workerData.map((w, idx) => (
                <div key={w.id} style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '8px', padding: '15px', marginBottom: '10px', borderLeft: w.active ? '4px solid #10b981' : '4px solid #444' }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input type="text" placeholder={`Worker ${idx + 1} Name`} value={w.name} onChange={e => updateWorker(w.id, 'name', e.target.value)} style={{ ...inputStyle, flex: 2 }} />
                    <input type="number" placeholder="Rate/hr" value={w.rate} onChange={e => updateWorker(w.id, 'rate', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div><div style={{ color: '#fff', fontFamily: 'monospace', fontSize: '1.1em' }}>{fmt(w.totalSecs)}</div></div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => toggleWorker(w.id)} style={{ background: w.active ? '#ef4444' : '#10b981', color: w.active ? '#fff' : '#000', border: 'none', padding: '6px 15px', borderRadius: '4px', fontWeight: 'bold' }}>{w.active ? 'Stop' : 'Start'}</button>
                      <button onClick={() => removeWorker(w.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.2em', padding: '0 8px' }}>×</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* PAPER DOT LOG & EXPORT OVERLAY */}
      {showLogPreview && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#f4f4f0', zIndex: 100, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #111', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2 style={{ color: '#111', margin: 0, fontFamily: 'serif', textTransform: 'uppercase' }}>Driver's Daily Log</h2>
            <button onClick={() => setShowLogPreview(false)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={exportShiftHistory} style={{ flex: 1, background: '#10b981', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>📥 Export CSV (Excel)</button>
            <button onClick={closeAndSaveShift} style={{ flex: 1, background: '#a855f7', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>💾 Save & Archive Log</button>
          </div>

          <div style={{ border: '1px solid #111', background: '#fff', padding: '10px', marginBottom: '20px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #111', paddingBottom: '5px', marginBottom: '10px', fontFamily: 'monospace', fontSize: '0.85em', color: '#333' }}>
                <span style={{flex: 1}}>TIME</span><span style={{flex: 2}}>STATUS / EVENT</span><span style={{flex: 2}}>LOCATION / REMARKS</span>
             </div>
             {logs.length === 0 ? <div style={{color: '#666', textAlign: 'center', padding: '20px', fontStyle: 'italic'}}>No entries for current shift.</div> : 
             logs.map(log => (
               <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', padding: '8px 0', fontFamily: 'monospace', fontSize: '0.9em', color: '#111' }}>
                 <span style={{flex: 1, fontWeight: 'bold'}}>{log.time}</span>
                 <span style={{flex: 2, color: log.event.includes('DRIVING') ? '#2563eb' : '#111'}}>{log.event}</span>
                 <span style={{flex: 2}}>{log.loc} {log.note ? `(${log.note})` : ''}</span>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* RECEIPT & EXPORT OVERLAY */}
      {showReceipt && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#000', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ color: '#fff', margin: 0 }}>Receipt Engine</h2>
            <button onClick={() => setShowReceipt(false)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={exportJobHistory} style={{ flex: 1, background: '#10b981', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold' }}>📥 Export History (CSV)</button>
            <button onClick={closeAndSaveJob} style={{ flex: 1, background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold' }}>💾 Save & Clear Job</button>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={() => setReceiptView('customer')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: receiptView === 'customer' ? '#f8f9fa' : '#222', color: receiptView === 'customer' ? '#000' : '#888' }}>Customer View</button>
            <button onClick={() => setReceiptView('operator')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: receiptView === 'operator' ? '#3b82f6' : '#222', color: receiptView === 'operator' ? '#fff' : '#888' }}>Operator View</button>
          </div>

          {receiptView === 'customer' ? (
            <div style={{ background: '#f8f9fa', color: '#000', padding: '25px', borderRadius: '8px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '15px' }}>
                <h2 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>Invoice</h2>
                <div style={{ color: '#555', fontSize: '0.85em', marginTop: '5px' }}>{new Date().toLocaleDateString()}</div>
              </div>
              {flat > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '1.1em' }}><strong>Service Fee</strong><span>${flat.toFixed(2)}</span></div>}
              {materials.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '8px', fontWeight: 'bold', color: '#444', textTransform: 'uppercase', fontSize: '0.85em' }}>Materials & Hardware</div>
                  {materials.map(m => <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>{m.name} (x{m.qty})</span><span>${(m.cost * m.qty).toFixed(2)}</span></div>)}
                </div>
              )}
              {laborTotal > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '8px', fontWeight: 'bold', color: '#444', textTransform: 'uppercase', fontSize: '0.85em' }}>Labor</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Site Labor (Total)</span><span>${laborTotal.toFixed(2)}</span></div>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #000', marginTop: '20px', paddingTop: '15px', fontSize: '1.3em', fontWeight: '900' }}><span>TOTAL DUE</span><span>${totalBill.toFixed(2)}</span></div>
            </div>
          ) : (
            <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
              <h3 style={{ color: '#3b82f6', borderBottom: '1px solid #333', paddingBottom: '8px', margin: '0 0 15px 0' }}>Internal Cost Breakdown</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#ccc' }}><span>Flat Fee:</span><span style={{ color: '#fff' }}>${flat.toFixed(2)}</span></div>
              <h4 style={{ color: '#f59e0b', margin: '20px 0 10px 0' }}>Materials & S/N</h4>
              {materials.map(m => (
                <div key={m.id} style={{ marginBottom: '10px', borderBottom: '1px dashed #222', paddingBottom: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc' }}><span>{m.name} (x{m.qty})</span><span style={{ color: '#fff' }}>${(m.cost * m.qty).toFixed(2)}</span></div>
                  <div style={{ color: '#666', fontSize: '0.85em', fontFamily: 'monospace', marginTop: '4px' }}>S/N: {m.serial}</div>
                </div>
              ))}
              <h4 style={{ color: '#10b981', margin: '20px 0 10px 0' }}>Crew Payouts</h4>
              {workerData.map(w => (
                <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#ccc' }}><span>{w.name || 'Unnamed'} ({fmt(w.totalSecs)} @ ${w.rate}/hr)</span><span style={{ color: '#10b981' }}>${w.pay.toFixed(2)}</span></div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #333', marginTop: '20px', paddingTop: '15px', fontSize: '1.2em', fontWeight: 'bold' }}><span style={{ color: '#888' }}>GROSS BILLABLE:</span><span style={{ color: '#10b981' }}>${totalBill.toFixed(2)}</span></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
