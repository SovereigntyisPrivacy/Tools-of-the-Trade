import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChronosHub() {
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState('hos'); 

  // --- HOS STATE ---
  const [shiftStart, setShiftStart] = useState(() => parseInt(localStorage.getItem('hos_shiftStart')) || null);
  const [accumulatedDriveSecs, setAccumulatedDriveSecs] = useState(() => parseInt(localStorage.getItem('hos_driveSecs')) || 0);
  const [driveStart, setDriveStart] = useState(() => parseInt(localStorage.getItem('hos_driveStart')) || null);
  const [isShiftActive, setIsShiftActive] = useState(() => localStorage.getItem('hos_isShiftActive') === 'true');
  const [isDriving, setIsDriving] = useState(() => localStorage.getItem('hos_isDriving') === 'true');
  const [hosLogs, setHosLogs] = useState(() => JSON.parse(localStorage.getItem('hos_logs')) || []);
  
  const [logLocation, setLogLocation] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [showHosModal, setShowHosModal] = useState(false);

  // --- CONTRACTOR STATE ---
  const [fixedFee, setFixedFee] = useState(() => parseFloat(localStorage.getItem('con_fixedFee')) || 800);
  const [discount, setDiscount] = useState(() => parseFloat(localStorage.getItem('con_discount')) || 0); 
  const [jobNotes, setJobNotes] = useState(() => localStorage.getItem('con_jobNotes') || ''); 
  const [materials, setMaterials] = useState(() => JSON.parse(localStorage.getItem('con_materials')) || []);
  const [crew, setCrew] = useState(() => JSON.parse(localStorage.getItem('con_crew')) || []);
  
  const [matName, setMatName] = useState('');
  const [matCost, setMatCost] = useState('');
  const [matQty, setMatQty] = useState('');
  const [matSn, setMatSn] = useState('');
  const [crewName, setCrewName] = useState('');
  const [crewRate, setCrewRate] = useState('');
  
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptTab, setReceiptTab] = useState('customer'); // Active Receipt Toggle

  // --- ARCHIVE & VIEWING STATE ---
  const [dotArchives, setDotArchives] = useState(() => JSON.parse(localStorage.getItem('hos_dotArchives')) || []);
  const [invoiceArchives, setInvoiceArchives] = useState(() => JSON.parse(localStorage.getItem('hos_invoiceArchives')) || []);
  const [viewingDot, setViewingDot] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [archiveReceiptTab, setArchiveReceiptTab] = useState('customer'); // Archived Receipt Toggle

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('hos_shiftStart', shiftStart || '');
    localStorage.setItem('hos_driveSecs', accumulatedDriveSecs);
    localStorage.setItem('hos_driveStart', driveStart || '');
    localStorage.setItem('hos_isShiftActive', isShiftActive);
    localStorage.setItem('hos_isDriving', isDriving);
    localStorage.setItem('hos_logs', JSON.stringify(hosLogs));
    
    localStorage.setItem('con_fixedFee', fixedFee);
    localStorage.setItem('con_discount', discount);
    localStorage.setItem('con_jobNotes', jobNotes);
    localStorage.setItem('con_materials', JSON.stringify(materials));
    localStorage.setItem('con_crew', JSON.stringify(crew));

    localStorage.setItem('hos_dotArchives', JSON.stringify(dotArchives));
    localStorage.setItem('hos_invoiceArchives', JSON.stringify(invoiceArchives));
  }, [shiftStart, accumulatedDriveSecs, driveStart, isShiftActive, isDriving, hosLogs, fixedFee, discount, jobNotes, materials, crew, dotArchives, invoiceArchives]);

  // --- GLOBAL TICKER ---
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // --- INDEPENDENT MATH DERIVATIONS ---
  const elapsedShift = isShiftActive && shiftStart ? Math.floor((now - shiftStart) / 1000) : 0;
  const remainingShift = isShiftActive ? Math.max(0, (14 * 3600) - elapsedShift) : (14 * 3600);

  let currentDriveTotal = accumulatedDriveSecs;
  if (isDriving && driveStart) currentDriveTotal += Math.floor((now - driveStart) / 1000);
  const remainingDriveRaw = isShiftActive ? Math.max(0, (11 * 3600) - currentDriveTotal) : (11 * 3600);
  const displayDrive = Math.min(remainingDriveRaw, remainingShift);

  const displayCrew = crew.map(c => {
    let activeElapsed = c.accumulatedSecs || 0;
    if (c.isActive && c.currentStartTimestamp) {
       activeElapsed += Math.floor((now - c.currentStartTimestamp) / 1000);
    }
    return { ...c, liveElapsed: activeElapsed };
  });

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  // --- HOS ACTIONS ---
  const addHosLog = (event, status, loc = logLocation, note = logNotes) => {
    const newLog = { id: Date.now(), time: formatAMPM(new Date()), event, status, location: loc || 'Location Not Set', notes: note };
    setHosLogs([newLog, ...hosLogs]);
    setLogLocation(''); setLogNotes('');
  };

  const toggleShift = () => {
    const timestamp = Date.now();
    if (!isShiftActive) {
      setShiftStart(timestamp); setAccumulatedDriveSecs(0); setDriveStart(null);
      setIsShiftActive(true); addHosLog('Shift Started', 'ON DUTY');
    } else {
      if (isDriving && driveStart) setAccumulatedDriveSecs(prev => prev + Math.floor((timestamp - driveStart) / 1000));
      setIsShiftActive(false); setIsDriving(false); setShiftStart(null); setDriveStart(null);
      addHosLog('Shift Ended', 'OFF DUTY');
    }
  };

  const toggleDrive = () => {
    if (!isShiftActive) return alert("Start shift first.");
    const timestamp = Date.now();
    if (!isDriving) {
      setDriveStart(timestamp); setIsDriving(true);
      addHosLog('Started Driving', 'DRIVING');
    } else {
      if (driveStart) setAccumulatedDriveSecs(prev => prev + Math.floor((timestamp - driveStart) / 1000));
      setDriveStart(null); setIsDriving(false);
      addHosLog('Stopped Driving', 'ON DUTY (Not Driving)');
    }
  };

  const takeBreak = (mins) => {
    if (!isShiftActive) return alert("Start shift first.");
    if (isDriving && driveStart) {
      setAccumulatedDriveSecs(prev => prev + Math.floor((Date.now() - driveStart) / 1000));
      setDriveStart(null);
    }
    setIsDriving(false);
    addHosLog(`Started ${mins} Min Break`, 'OFF DUTY');
  };

  // --- CONTRACTOR ACTIONS ---
  const addMaterial = () => {
    if (!matName || !matCost || !matQty) return;
    setMaterials([...materials, { id: Date.now(), name: matName, cost: parseFloat(matCost), qty: parseInt(matQty), sn: matSn }]);
    setMatName(''); setMatCost(''); setMatQty(''); setMatSn('');
  };

  const addCrew = () => {
    if (!crewName || !crewRate) return;
    setCrew([...crew, { id: Date.now(), name: crewName, rate: parseFloat(crewRate), accumulatedSecs: 0, currentStartTimestamp: null, isActive: false }]);
    setCrewName(''); setCrewRate('');
  };

  const toggleCrew = (id) => {
    const timestamp = Date.now();
    setCrew(crew.map(c => {
      if (c.id === id) {
        if (c.isActive) return { ...c, isActive: false, accumulatedSecs: c.accumulatedSecs + Math.floor((timestamp - c.currentStartTimestamp)/1000), currentStartTimestamp: null };
        return { ...c, isActive: true, currentStartTimestamp: timestamp };
      }
      return c;
    }));
  };

  const toggleAllCrew = () => {
    const timestamp = Date.now();
    const anyActive = crew.some(c => c.isActive);
    if (anyActive) setCrew(crew.map(c => c.isActive ? { ...c, isActive: false, accumulatedSecs: c.accumulatedSecs + Math.floor((timestamp - c.currentStartTimestamp)/1000), currentStartTimestamp: null } : c));
    else setCrew(crew.map(c => !c.isActive ? { ...c, isActive: true, currentStartTimestamp: timestamp } : c));
  };

  const totalMaterials = materials.reduce((acc, m) => acc + (m.cost * m.qty), 0);
  const totalCrewPayout = displayCrew.reduce((acc, c) => acc + ((c.liveElapsed / 3600) * c.rate), 0);
  const grossBillable = (parseFloat(fixedFee) || 0) + totalMaterials + totalCrewPayout - (parseFloat(discount) || 0);

  // --- ARCHIVING & NATIVE SHARE/EMAIL ---
  const archiveDOT = () => {
    if (hosLogs.length === 0) return alert("No logs to save.");
    setDotArchives([{ id: Date.now(), date: new Date().toLocaleDateString(), logs: hosLogs }, ...dotArchives]);
    setHosLogs([]); setShowHosModal(false); alert("DOT Log Archived to History.");
  };

  const archiveInvoice = () => {
    if (grossBillable === 0) return alert("No financials to save.");
    setInvoiceArchives([{ id: Date.now(), date: new Date().toLocaleDateString(), total: grossBillable.toFixed(2), fee: fixedFee, discount: discount, notes: jobNotes, materials, crew: displayCrew }, ...invoiceArchives]);
    setMaterials([]); setCrew([]); setJobNotes(''); setShowReceiptModal(false); alert("Invoice Archived to History.");
  };

  const emailDotArchive = (arc) => {
    let body = `DOT Logs for Shift: ${arc.date}\n\n`;
    arc.logs.forEach(l => body += `[${l.time}] ${l.event} (${l.status}) @ ${l.location}\nNotes: ${l.notes || 'None'}\n\n`);
    window.open(`mailto:?subject=DOT Log Record - ${arc.date}&body=${encodeURIComponent(body)}`);
  };

  const emailInvoiceArchive = (arc) => {
    let body = `Invoice Summary - Job: ${arc.date}\n\nFlat Fee: $${arc.fee}\nTotal Materials: ${arc.materials.length}\nTotal Crew: ${arc.crew.length}\n\nTOTAL BILLABLE: $${arc.total}\n`;
    window.open(`mailto:?subject=Invoice Record - ${arc.date}&body=${encodeURIComponent(body)}`);
  };

  const exportCSV = async (type) => {
    let csvContent = type === 'dot' ? "Date,Time,Event,Status,Location\n" : "Date,Total Billed,Fixed Fee,Materials Count,Crew Count\n";
    if (type === 'dot') dotArchives.forEach(arc => arc.logs.forEach(l => csvContent += `"${arc.date}","${l.time}","${l.event}","${l.status}","${l.location}"\n`));
    else invoiceArchives.forEach(arc => csvContent += `"${arc.date}","$${arc.total}","$${arc.fee}","${arc.materials.length}","${arc.crew.length}"\n`);
    
    try {
      const file = new File([csvContent], `${type}_export_${Date.now()}.csv`, { type: 'text/csv' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Export', text: `Attached is your ${type.toUpperCase()} CSV Export` });
      } else {
        const emailBody = encodeURIComponent("Attached is the requested CSV data:\n\n" + csvContent);
        window.open(`mailto:?subject=${type.toUpperCase()} CSV Export&body=${emailBody}`);
      }
    } catch (err) { console.error("Share failed", err); }
  };

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #222', padding: '15px', marginBottom: '15px' };
  const inputStyle = { background: '#000', color: '#fff', border: '1px solid #333', padding: '10px', borderRadius: '6px', width: '100%' };
  const btnStyle = (bg, color) => ({ background: bg, color: color, border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', width: '100%', fontSize: '1em' });


  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
          <h2 style={{ margin: 0, color: '#10b981', fontSize: '1.2em' }}>Chronos Engine</h2>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '10px', padding: '15px', overflowX: 'auto' }}>
        <button onClick={() => setActiveMainTab('hos')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeMainTab === 'hos' ? '#a855f7' : '#222', color: activeMainTab === 'hos' ? '#fff' : '#888' }}>HOS Logs</button>
        <button onClick={() => setActiveMainTab('contractor')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeMainTab === 'contractor' ? '#3b82f6' : '#222', color: activeMainTab === 'contractor' ? '#fff' : '#888' }}>Contractor</button>
        <button onClick={() => setActiveMainTab('history')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeMainTab === 'history' ? '#f59e0b' : '#222', color: activeMainTab === 'history' ? '#000' : '#888' }}>History</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        
        {activeMainTab === 'hos' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: 1, background: '#0a0a0a', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid #222' }}>
                  <div style={{ color: '#888', fontWeight: 'bold', marginBottom: '10px' }}>DRIVE (11 HR)</div>
                  <div style={{ color: '#10b981', fontSize: '1.5em', fontWeight: 'bold', fontFamily: 'monospace' }}>{formatTime(displayDrive)}</div>
                </div>
                <div style={{ flex: 1, background: '#0a0a0a', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid #222' }}>
                  <div style={{ color: '#888', fontWeight: 'bold', marginBottom: '10px' }}>SHIFT (14 HR)</div>
                  <div style={{ color: '#10b981', fontSize: '1.5em', fontWeight: 'bold', fontFamily: 'monospace' }}>{formatTime(remainingShift)}</div>
                </div>
              </div>
              <button onClick={toggleShift} style={{ ...btnStyle('#222', '#fff'), marginBottom: '10px' }}>{isShiftActive ? 'END 14-HOUR SHIFT' : 'START 14-HOUR SHIFT'}</button>
              <button onClick={toggleDrive} style={btnStyle(isDriving ? '#ef4444' : '#10b981', '#fff')}>{isDriving ? 'STOP DRIVING' : 'START DRIVING'}</button>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b', textAlign: 'center' }}>
              <div style={{ color: '#f59e0b', fontSize: '1.2em', fontWeight: 'bold', marginBottom: '15px', fontFamily: 'monospace' }}>00:00:00</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => takeBreak(10)} style={{ flex: 1, background: 'transparent', border: '1px solid #f59e0b', color: '#f59e0b', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>10 Min</button>
                <button onClick={() => takeBreak(15)} style={{ flex: 1, background: 'transparent', border: '1px solid #f59e0b', color: '#f59e0b', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>15 Min</button>
                <button onClick={() => takeBreak(30)} style={{ flex: 1, background: '#f59e0b', border: 'none', color: '#000', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>30 Min</button>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ color: '#10b981', margin: 0 }}>DUTY LOG</h3>
                <button onClick={() => setShowHosModal(true)} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>View Daily Log</button>
              </div>
              <input type="text" placeholder="Location" value={logLocation} onChange={(e) => setLogLocation(e.target.value)} style={{ ...inputStyle, marginBottom: '10px' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Notes" value={logNotes} onChange={(e) => setLogNotes(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                <button onClick={() => addHosLog('Manual Entry', 'MANUAL')} style={{ background: '#222', color: '#fff', border: '1px dashed #555', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold' }}>+ Log</button>
              </div>
            </div>
          </>
        )}

        {activeMainTab === 'contractor' && (
          <>
            <div style={{ ...cardStyle, textAlign: 'center', borderTop: '4px solid #3b82f6' }}>
              <div style={{ color: '#10b981', fontSize: '2em', fontWeight: 'bold', marginBottom: '10px' }}>${grossBillable.toFixed(2)}</div>
              <button onClick={() => setShowReceiptModal(true)} style={btnStyle('#3b82f6', '#fff')}>View Receipt</button>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #10b981' }}>
              <h3 style={{ color: '#10b981', margin: '0 0 15px 0', textTransform: 'uppercase', textAlign: 'center' }}>Job Financials</h3>
              <label style={{ color: '#888', fontSize: '0.85em', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Fixed Service Fee ($)</label>
              <input type="number" value={fixedFee} onChange={(e) => setFixedFee(e.target.value)} style={{ ...inputStyle, marginBottom: '15px' }} />
              <label style={{ color: '#888', fontSize: '0.85em', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Apply Discount (-$)</label>
              <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0.00" style={{ ...inputStyle, marginBottom: '15px', borderColor: '#ef4444' }} />
              <label style={{ color: '#888', fontSize: '0.85em', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Invoice Notes / Terms</label>
              <textarea value={jobNotes} onChange={(e) => setJobNotes(e.target.value)} placeholder="e.g. Discount applied for delayed start..." style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #10b981' }}>
              <h3 style={{ color: '#10b981', margin: '0 0 15px 0', textTransform: 'uppercase', textAlign: 'center' }}>Materials</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                <input type="text" placeholder="Material Name" value={matName} onChange={(e) => setMatName(e.target.value)} style={inputStyle} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="number" placeholder="Cost ($)" value={matCost} onChange={(e) => setMatCost(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                  <input type="number" placeholder="Qty" value={matQty} onChange={(e) => setMatQty(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                </div>
                <input type="text" placeholder="S/N (Optional)" value={matSn} onChange={(e) => setMatSn(e.target.value)} style={inputStyle} />
                <button onClick={addMaterial} style={{ background: '#f59e0b', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>+ Add Material</button>
              </div>
              {materials.map(m => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', background: '#0a0a0a', padding: '10px', borderRadius: '6px', borderLeft: '2px solid #f59e0b', marginBottom: '8px' }}>
                  <span>{m.name} (x{m.qty}) - <span style={{ color: '#10b981' }}>${(m.cost * m.qty).toFixed(2)}</span></span>
                  <button onClick={() => setMaterials(materials.filter(x => x.id !== m.id))} style={{ background: 'none', border: 'none', color: '#ef4444' }}>×</button>
                </div>
              ))}
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ color: '#10b981', margin: 0, textTransform: 'uppercase' }}>Crew</h3>
                <button onClick={toggleAllCrew} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold' }}>Start/Stop All</button>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input type="text" placeholder="Worker Name" value={crewName} onChange={(e) => setCrewName(e.target.value)} style={{ ...inputStyle, flex: 2 }} />
                <input type="number" placeholder="Rate/h" value={crewRate} onChange={(e) => setCrewRate(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                <button onClick={addCrew} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>+ Add</button>
              </div>
              {displayCrew.map(c => (
                <div key={c.id} style={{ background: '#0a0a0a', padding: '15px', borderRadius: '8px', borderLeft: `2px solid ${c.isActive ? '#10b981' : '#444'}`, marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong style={{ color: '#fff' }}>{c.name}</strong><span style={{ color: '#888' }}>${c.rate}/hr</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'monospace', fontSize: '1.2em' }}>{formatTime(c.liveElapsed)}</div>
                      <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9em' }}>Earned: ${((c.liveElapsed / 3600) * c.rate).toFixed(2)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => toggleCrew(c.id)} style={{ background: c.isActive ? '#ef4444' : '#10b981', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>{c.isActive ? 'Stop' : 'Start'}</button>
                      <button onClick={() => setCrew(crew.filter(x => x.id !== c.id))} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '8px 12px', borderRadius: '6px' }}>×</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeMainTab === 'history' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
              <h3 style={{ color: '#a855f7', textAlign: 'center', marginBottom: '15px', textTransform: 'uppercase' }}>DOT Log Archives</h3>
              {dotArchives.length === 0 ? <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No DOT logs saved.</p> : (
                <>
                  {dotArchives.map((arc) => (
                    <div key={arc.id} style={{ background: '#0a0a0a', padding: '15px', borderRadius: '8px', borderLeft: '2px solid #a855f7', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div><strong style={{ color: '#fff', display: 'block' }}>Shift: {arc.date}</strong><span style={{ color: '#a855f7', fontSize: '0.9em' }}>{arc.logs.length} Entries</span></div>
                      <button onClick={() => setViewingDot(arc)} style={{ background: '#222', border: '1px solid #a855f7', color: '#a855f7', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>View</button>
                    </div>
                  ))}
                  <button onClick={() => exportCSV('dot')} style={{ width: '100%', background: '#a855f7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>📤 Native Share Logs (CSV)</button>
                </>
              )}
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #10b981' }}>
              <h3 style={{ color: '#10b981', textAlign: 'center', marginBottom: '15px', textTransform: 'uppercase' }}>Invoice Archives</h3>
              {invoiceArchives.length === 0 ? <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No Invoices saved.</p> : (
                <>
                  {invoiceArchives.map((arc) => (
                    <div key={arc.id} style={{ background: '#0a0a0a', padding: '15px', borderRadius: '8px', borderLeft: '2px solid #10b981', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div><strong style={{ color: '#fff', display: 'block' }}>Job: {arc.date}</strong><span style={{ color: '#10b981', fontSize: '0.9em' }}>${arc.total}</span></div>
                      <button onClick={() => { setViewingInvoice(arc); setArchiveReceiptTab('customer'); }} style={{ background: '#222', border: '1px solid #10b981', color: '#10b981', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>View</button>
                    </div>
                  ))}
                  <button onClick={() => exportCSV('invoice')} style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>📤 Native Share Invoices (CSV)</button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* --- ACTIVE HOS MODAL --- */}
      {showHosModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#fff', color: '#000', zIndex: 100, padding: '15px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>
            <h2 style={{ color: '#10b981', margin: 0, textTransform: 'uppercase' }}>Driver's Daily Log</h2>
            <button onClick={() => setShowHosModal(false)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
          </div>
          <button onClick={archiveDOT} style={{ width: '100%', background: '#a855f7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '20px' }}>💾 Archive Shift</button>
          <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
            <h3 style={{ textAlign: 'center', margin: '0 0 15px 0' }}>Date: {new Date().toLocaleDateString()}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead><tr style={{ borderBottom: '2px solid #000' }}><th style={{ padding: '8px' }}>TIME</th><th style={{ padding: '8px' }}>EVENT</th><th style={{ padding: '8px' }}>LOCATION</th></tr></thead>
              <tbody>
                {hosLogs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px dashed #ccc' }}>
                    <td style={{ padding: '10px 5px', fontWeight: 'bold' }}>{log.time}</td>
                    <td style={{ padding: '10px 5px', color: log.status === 'DRIVING' ? '#3b82f6' : '#000', fontWeight: 'bold' }}>{log.event}</td>
                    <td style={{ padding: '10px 5px' }}>{log.location}<br/><span style={{ fontSize: '0.85em', color: '#666' }}>{log.notes}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- ARCHIVED HOS VIEWER MODAL --- */}
      {viewingDot && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#fff', color: '#000', zIndex: 100, padding: '15px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>
            <h2 style={{ color: '#a855f7', margin: 0, textTransform: 'uppercase' }}>Archived DOT Log</h2>
            <button onClick={() => setViewingDot(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
          </div>
          <button onClick={() => emailDotArchive(viewingDot)} style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '20px' }}>📧 Email This Log</button>
          <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
            <h3 style={{ textAlign: 'center', margin: '0 0 15px 0' }}>Date: {viewingDot.date}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead><tr style={{ borderBottom: '2px solid #000' }}><th style={{ padding: '8px' }}>TIME</th><th style={{ padding: '8px' }}>EVENT</th><th style={{ padding: '8px' }}>LOCATION</th></tr></thead>
              <tbody>
                {viewingDot.logs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px dashed #ccc' }}>
                    <td style={{ padding: '10px 5px', fontWeight: 'bold' }}>{log.time}</td>
                    <td style={{ padding: '10px 5px', color: log.status === 'DRIVING' ? '#3b82f6' : '#000', fontWeight: 'bold' }}>{log.event}</td>
                    <td style={{ padding: '10px 5px' }}>{log.location}<br/><span style={{ fontSize: '0.85em', color: '#666' }}>{log.notes}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- RESTORED ACTIVE RECEIPT MODAL --- */}
      {showReceiptModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#000', zIndex: 100, padding: '15px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>
            <h2 style={{ color: '#10b981', margin: 0, textTransform: 'uppercase' }}>Receipt Engine</h2>
            <button onClick={() => setShowReceiptModal(false)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button onClick={() => setReceiptTab('customer')} style={{ flex: 1, background: receiptTab === 'customer' ? '#fff' : '#222', color: receiptTab === 'customer' ? '#000' : '#888', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>Customer View</button>
            <button onClick={() => setReceiptTab('operator')} style={{ flex: 1, background: receiptTab === 'operator' ? '#3b82f6' : '#222', color: receiptTab === 'operator' ? '#fff' : '#888', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>Operator View</button>
          </div>
          <button onClick={archiveInvoice} style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '20px' }}>💾 Archive Job</button>

          {receiptTab === 'customer' ? (
            <div style={{ background: '#fff', color: '#000', padding: '20px', borderRadius: '8px' }}>
              <h2 style={{ color: '#10b981', textAlign: 'center', margin: '0 0 5px 0', textTransform: 'uppercase' }}>INVOICE</h2>
              <h4 style={{ textAlign: 'center', margin: '0 0 20px 0', color: '#666' }}>{new Date().toLocaleDateString()}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '15px' }}><span>Service Fee</span><span>${parseFloat(fixedFee).toFixed(2)}</span></div>
              {discount > 0 && (<div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1em', color: '#ef4444', marginBottom: '15px' }}><span>Discount Applied</span><span>-${parseFloat(discount).toFixed(2)}</span></div>)}
              <h4 style={{ textAlign: 'center', textTransform: 'uppercase', color: '#666', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Materials & Hardware</h4>
              {materials.map(m => (<div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 'bold' }}><span>{m.name} (x{m.qty})</span><span>${(m.cost * m.qty).toFixed(2)}</span></div>))}
              <h4 style={{ textAlign: 'center', textTransform: 'uppercase', color: '#666', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '20px' }}>Labor</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '20px' }}><span>Site Labor (Total)</span><span>${totalCrewPayout.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #000', paddingTop: '15px', fontWeight: 'bold', fontSize: '1.3em' }}><span>TOTAL DUE</span><span>${grossBillable.toFixed(2)}</span></div>
              {jobNotes && (<div style={{ marginTop: '30px', padding: '15px', background: '#f9f9f9', borderLeft: '3px solid #10b981', fontSize: '0.9em', color: '#444', fontStyle: 'italic' }}><strong>Notes: </strong>{jobNotes}</div>)}
            </div>
          ) : (
            <div style={{ background: '#111', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
              <h3 style={{ color: '#10b981', textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Internal Cost Breakdown</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', marginBottom: '20px', fontSize: '1.1em' }}><span>Flat Fee:</span><span>${parseFloat(fixedFee).toFixed(2)}</span></div>
              <h4 style={{ color: '#f59e0b', textAlign: 'center', textTransform: 'uppercase' }}>Materials & S/N</h4>
              {materials.map(m => (
                <div key={m.id} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '1.1em' }}><span>{m.name} (x{m.qty})</span><span>${(m.cost * m.qty).toFixed(2)}</span></div>
                  <div style={{ textAlign: 'center', color: '#666', fontSize: '0.9em' }}>S/N: {m.sn || 'N/A'}</div>
                </div>
              ))}
              <h4 style={{ color: '#10b981', textAlign: 'center', textTransform: 'uppercase', marginTop: '20px' }}>Crew Payouts</h4>
              {displayCrew.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', marginBottom: '10px', fontSize: '1.1em' }}><span>{c.name || 'Unnamed'} (${c.rate}/hr)</span><span style={{ color: '#10b981' }}>${((c.liveElapsed / 3600) * c.rate).toFixed(2)}</span></div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px dashed #444', paddingTop: '15px', marginTop: '20px', fontWeight: 'bold', fontSize: '1.2em' }}><span style={{ color: '#888' }}>GROSS BILLABLE:</span><span style={{ color: '#10b981' }}>${grossBillable.toFixed(2)}</span></div>
            </div>
          )}
        </div>
      )}

      {/* --- RESTORED ARCHIVED INVOICE VIEWER MODAL --- */}
      {viewingInvoice && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#000', zIndex: 100, padding: '15px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>
            <h2 style={{ color: '#10b981', margin: 0, textTransform: 'uppercase' }}>Archived Invoice</h2>
            <button onClick={() => setViewingInvoice(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button onClick={() => setArchiveReceiptTab('customer')} style={{ flex: 1, background: archiveReceiptTab === 'customer' ? '#fff' : '#222', color: archiveReceiptTab === 'customer' ? '#000' : '#888', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>Customer View</button>
            <button onClick={() => setArchiveReceiptTab('operator')} style={{ flex: 1, background: archiveReceiptTab === 'operator' ? '#3b82f6' : '#222', color: archiveReceiptTab === 'operator' ? '#fff' : '#888', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>Operator View</button>
          </div>
          <button onClick={() => emailInvoiceArchive(viewingInvoice)} style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '20px' }}>📧 Email This Invoice</button>

          {archiveReceiptTab === 'customer' ? (
            <div style={{ background: '#fff', color: '#000', padding: '20px', borderRadius: '8px' }}>
              <h2 style={{ color: '#10b981', textAlign: 'center', margin: '0 0 5px 0', textTransform: 'uppercase' }}>INVOICE RECORD</h2>
              <h4 style={{ textAlign: 'center', margin: '0 0 20px 0', color: '#666' }}>{viewingInvoice.date}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '15px' }}><span>Service Fee</span><span>${parseFloat(viewingInvoice.fee).toFixed(2)}</span></div>
              {viewingInvoice.discount > 0 && (<div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1em', color: '#ef4444', marginBottom: '15px' }}><span>Discount Applied</span><span>-${parseFloat(viewingInvoice.discount).toFixed(2)}</span></div>)}
              <h4 style={{ textAlign: 'center', textTransform: 'uppercase', color: '#666', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Materials & Hardware</h4>
              {viewingInvoice.materials.map(m => (<div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 'bold' }}><span>{m.name} (x{m.qty})</span><span>${(m.cost * m.qty).toFixed(2)}</span></div>))}
              <h4 style={{ textAlign: 'center', textTransform: 'uppercase', color: '#666', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '20px' }}>Labor</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '20px' }}><span>Site Labor (Total)</span><span>${viewingInvoice.crew.reduce((acc, c) => acc + ((c.liveElapsed / 3600) * c.rate), 0).toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #000', paddingTop: '15px', fontWeight: 'bold', fontSize: '1.3em' }}><span>TOTAL BILLED</span><span>${viewingInvoice.total}</span></div>
              {viewingInvoice.notes && (<div style={{ marginTop: '30px', padding: '15px', background: '#f9f9f9', borderLeft: '3px solid #10b981', fontSize: '0.9em', color: '#444', fontStyle: 'italic' }}><strong>Notes: </strong>{viewingInvoice.notes}</div>)}
            </div>
          ) : (
            <div style={{ background: '#111', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
              <h3 style={{ color: '#10b981', textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Internal Cost Breakdown</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', marginBottom: '20px', fontSize: '1.1em' }}><span>Flat Fee:</span><span>${parseFloat(viewingInvoice.fee).toFixed(2)}</span></div>
              <h4 style={{ color: '#f59e0b', textAlign: 'center', textTransform: 'uppercase' }}>Materials & S/N</h4>
              {viewingInvoice.materials.map(m => (
                <div key={m.id} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '1.1em' }}><span>{m.name} (x{m.qty})</span><span>${(m.cost * m.qty).toFixed(2)}</span></div>
                  <div style={{ textAlign: 'center', color: '#666', fontSize: '0.9em' }}>S/N: {m.sn || 'N/A'}</div>
                </div>
              ))}
              <h4 style={{ color: '#10b981', textAlign: 'center', textTransform: 'uppercase', marginTop: '20px' }}>Crew Payouts</h4>
              {viewingInvoice.crew.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', marginBottom: '10px', fontSize: '1.1em' }}><span>{c.name || 'Unnamed'} (${c.rate}/hr)</span><span style={{ color: '#10b981' }}>${((c.liveElapsed / 3600) * c.rate).toFixed(2)}</span></div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px dashed #444', paddingTop: '15px', marginTop: '20px', fontWeight: 'bold', fontSize: '1.2em' }}><span style={{ color: '#888' }}>GROSS BILLABLE:</span><span style={{ color: '#10b981' }}>${viewingInvoice.total}</span></div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
