import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChronosHub() {
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState('hos'); 

  // --- HOS LOGS STATE ---
  const [shiftSeconds, setShiftSeconds] = useState(14 * 3600);
  const [driveSeconds, setDriveSeconds] = useState(11 * 3600);
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [isDriving, setIsDriving] = useState(false);
  const [hosLogs, setHosLogs] = useState([]);
  const [logLocation, setLogLocation] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [showHosModal, setShowHosModal] = useState(false);

  // --- CONTRACTOR STATE ---
  const [fixedFee, setFixedFee] = useState(800);
  const [discount, setDiscount] = useState(0); 
  const [jobNotes, setJobNotes] = useState(''); 
  const [materials, setMaterials] = useState([]);
  const [matName, setMatName] = useState('');
  const [matCost, setMatCost] = useState('');
  const [matQty, setMatQty] = useState('');
  const [matSn, setMatSn] = useState('');
  const [crew, setCrew] = useState([]);
  const [crewName, setCrewName] = useState('');
  const [crewRate, setCrewRate] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptTab, setReceiptTab] = useState('customer');

  // --- ARCHIVE STATE ---
  const [dotArchives, setDotArchives] = useState([]);
  const [invoiceArchives, setInvoiceArchives] = useState([]);

  // --- MASTER TIMER LOGIC ---
  useEffect(() => {
    let interval;
    if (isShiftActive) {
      interval = setInterval(() => {
        setShiftSeconds(prevShift => {
          const nextShift = prevShift - 1;
          setDriveSeconds(prevDrive => {
            let nextDrive = isDriving ? prevDrive - 1 : prevDrive;
            if (nextShift < nextDrive) nextDrive = nextShift; // Drive cannot exceed Shift
            return Math.max(0, nextDrive);
          });
          return Math.max(0, nextShift);
        });

        setCrew(prevCrew => prevCrew.map(c => 
          c.isActive ? { ...c, elapsed: c.elapsed + 1 } : c
        ));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isShiftActive, isDriving]);

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
    if (!isShiftActive) {
      setIsShiftActive(true);
      addHosLog('Shift Started', 'ON DUTY');
    } else {
      setIsShiftActive(false); setIsDriving(false);
      addHosLog('Shift Ended', 'OFF DUTY');
    }
  };

  const toggleDrive = () => {
    if (!isShiftActive) return alert("Start shift first.");
    if (!isDriving) {
      setIsDriving(true);
      addHosLog('Started Driving', 'DRIVING');
    } else {
      setIsDriving(false);
      addHosLog('Stopped Driving', 'ON DUTY (Not Driving)');
    }
  };

  const takeBreak = (mins) => {
    if (!isShiftActive) return alert("Start shift first.");
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
    setCrew([...crew, { id: Date.now(), name: crewName, rate: parseFloat(crewRate), elapsed: 0, isActive: false }]);
    setCrewName(''); setCrewRate('');
  };

  const toggleCrew = (id) => setCrew(crew.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  const toggleAllCrew = () => {
    const anyActive = crew.some(c => c.isActive);
    setCrew(crew.map(c => ({ ...c, isActive: !anyActive })));
  };

  // --- CALCULATIONS (FIXED) ---
  const totalMaterials = materials.reduce((acc, m) => acc + (m.cost * m.qty), 0);
  const totalCrewPayout = crew.reduce((acc, c) => acc + ((c.elapsed / 3600) * c.rate), 0);
  const grossBillable = (parseFloat(fixedFee) || 0) + totalMaterials + totalCrewPayout - (parseFloat(discount) || 0);

  // --- ARCHIVING & EXPORTING ---
  const archiveDOT = () => {
    if (hosLogs.length === 0) return alert("No logs to save.");
    setDotArchives([{ date: new Date().toLocaleDateString(), logs: hosLogs }, ...dotArchives]);
    setHosLogs([]); setShowHosModal(false); alert("DOT Log Archived to History.");
  };

  const archiveInvoice = () => {
    if (grossBillable === 0) return alert("No financials to save.");
    setInvoiceArchives([{ date: new Date().toLocaleDateString(), total: grossBillable.toFixed(2), fee: fixedFee, materials, crew }, ...invoiceArchives]);
    setMaterials([]); setCrew([]); setJobNotes(''); setShowReceiptModal(false); alert("Invoice Archived to History.");
  };

  const exportCSV = (type) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (type === 'dot') {
      csvContent += "Date,Time,Event,Status,Location\n";
      dotArchives.forEach(arc => {
        arc.logs.forEach(l => csvContent += `"${arc.date}","${l.time}","${l.event}","${l.status}","${l.location}"\n`);
      });
    } else {
      csvContent += "Date,Total Billed,Fixed Fee,Materials Count,Crew Count\n";
      invoiceArchives.forEach(arc => {
        csvContent += `"${arc.date}","$${arc.total}","$${arc.fee}","${arc.materials.length}","${arc.crew.length}"\n`;
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${type}_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- STYLES ---
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
        
        {/* --- HOS LOGS VIEW --- */}
        {activeMainTab === 'hos' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: 1, background: '#0a0a0a', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid #222' }}>
                  <div style={{ color: '#888', fontWeight: 'bold', marginBottom: '10px' }}>DRIVE (11 HR)</div>
                  <div style={{ color: '#10b981', fontSize: '1.5em', fontWeight: 'bold', fontFamily: 'monospace' }}>{formatTime(driveSeconds)}</div>
                </div>
                <div style={{ flex: 1, background: '#0a0a0a', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid #222' }}>
                  <div style={{ color: '#888', fontWeight: 'bold', marginBottom: '10px' }}>SHIFT (14 HR)</div>
                  <div style={{ color: '#10b981', fontSize: '1.5em', fontWeight: 'bold', fontFamily: 'monospace' }}>{formatTime(shiftSeconds)}</div>
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

        {/* --- CONTRACTOR VIEW --- */}
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
                <input type="text" placeholder="Name" value={crewName} onChange={(e) => setCrewName(e.target.value)} style={{ ...inputStyle, flex: 2 }} />
                <input type="number" placeholder="Rate" value={crewRate} onChange={(e) => setCrewRate(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                <button onClick={addCrew} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>+ Add</button>
              </div>
              {crew.map(c => (
                <div key={c.id} style={{ background: '#0a0a0a', padding: '15px', borderRadius: '8px', borderLeft: `2px solid ${c.isActive ? '#10b981' : '#444'}`, marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong style={{ color: '#fff' }}>{c.name}</strong><span style={{ color: '#888' }}>${c.rate}/hr</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'monospace', fontSize: '1.2em' }}>{formatTime(c.elapsed)}</div>
                      <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9em' }}>Earned: ${((c.elapsed / 3600) * c.rate).toFixed(2)}</div>
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

        {/* --- HISTORY VIEW --- */}
        {activeMainTab === 'history' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
              <h3 style={{ color: '#a855f7', textAlign: 'center', marginBottom: '15px', textTransform: 'uppercase' }}>DOT Log Archives</h3>
              {dotArchives.length === 0 ? <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No DOT logs saved.</p> : (
                <>
                  {dotArchives.map((arc, idx) => (
                    <div key={idx} style={{ background: '#0a0a0a', padding: '15px', borderRadius: '8px', borderLeft: '2px solid #a855f7', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ color: '#fff' }}>Shift: {arc.date}</strong><span style={{ color: '#a855f7', fontWeight: 'bold' }}>{arc.logs.length} Entries</span>
                    </div>
                  ))}
                  <button onClick={() => exportCSV('dot')} style={{ width: '100%', background: '#a855f7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>📤 Export Logs (CSV)</button>
                </>
              )}
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #10b981' }}>
              <h3 style={{ color: '#10b981', textAlign: 'center', marginBottom: '15px', textTransform: 'uppercase' }}>Invoice Archives</h3>
              {invoiceArchives.length === 0 ? <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No Invoices saved.</p> : (
                <>
                  {invoiceArchives.map((arc, idx) => (
                    <div key={idx} style={{ background: '#0a0a0a', padding: '15px', borderRadius: '8px', borderLeft: '2px solid #10b981', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ color: '#fff' }}>Job: {arc.date}</strong><span style={{ color: '#10b981', fontWeight: 'bold' }}>${arc.total}</span>
                    </div>
                  ))}
                  <button onClick={() => exportCSV('invoice')} style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>📤 Export Invoices (CSV)</button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* --- HOS DAILY LOG MODAL --- */}
      {showHosModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#fff', color: '#000', zIndex: 100, padding: '15px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>
            <h2 style={{ color: '#10b981', margin: 0, textTransform: 'uppercase' }}>Driver's Daily Log</h2>
            <button onClick={() => setShowHosModal(false)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={archiveDOT} style={{ flex: 1, background: '#a855f7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>💾 Archive Shift</button>
          </div>

          <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
            <h3 style={{ textAlign: 'center', margin: '0 0 15px 0' }}>Date: {new Date().toLocaleDateString()}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead><tr style={{ borderBottom: '2px solid #000' }}><th style={{ padding: '8px' }}>TIME</th><th style={{ padding: '8px' }}>STATUS / EVENT</th><th style={{ padding: '8px' }}>LOCATION / REMARKS</th></tr></thead>
              <tbody>
                {hosLogs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px dashed #ccc' }}>
                    <td style={{ padding: '10px 5px', fontWeight: 'bold' }}>{log.time}</td>
                    <td style={{ padding: '10px 5px', color: log.status === 'DRIVING' ? '#3b82f6' : '#000', fontWeight: 'bold' }}>{log.event}<br/><span style={{ fontSize: '0.8em', fontWeight: 'normal', color: '#666' }}>({log.status})</span></td>
                    <td style={{ padding: '10px 5px' }}>{log.location}<br/><span style={{ fontSize: '0.85em', color: '#666' }}>{log.notes}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- RECEIPT ENGINE MODAL --- */}
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
              
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1em', color: '#ef4444', marginBottom: '15px' }}><span>Discount Applied</span><span>-${parseFloat(discount).toFixed(2)}</span></div>
              )}

              <h4 style={{ textAlign: 'center', textTransform: 'uppercase', color: '#666', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Materials & Hardware</h4>
              {materials.map(m => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 'bold' }}><span>{m.name} (x{m.qty})</span><span>${(m.cost * m.qty).toFixed(2)}</span></div>
              ))}

              <h4 style={{ textAlign: 'center', textTransform: 'uppercase', color: '#666', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '20px' }}>Labor</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '20px' }}><span>Site Labor (Total)</span><span>${totalCrewPayout.toFixed(2)}</span></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #000', paddingTop: '15px', fontWeight: 'bold', fontSize: '1.3em' }}>
                <span>TOTAL DUE</span><span>${grossBillable.toFixed(2)}</span>
              </div>

              {jobNotes && (
                <div style={{ marginTop: '30px', padding: '15px', background: '#f9f9f9', borderLeft: '3px solid #10b981', fontSize: '0.9em', color: '#444', fontStyle: 'italic' }}>
                  <strong>Notes: </strong>{jobNotes}
                </div>
              )}
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
              {crew.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', marginBottom: '10px', fontSize: '1.1em' }}>
                  <span>{c.name || 'Unnamed'} (${c.rate}/hr)</span><span style={{ color: '#10b981' }}>${((c.elapsed / 3600) * c.rate).toFixed(2)}</span>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px dashed #444', paddingTop: '15px', marginTop: '20px', fontWeight: 'bold', fontSize: '1.2em' }}>
                <span style={{ color: '#888' }}>GROSS BILLABLE:</span><span style={{ color: '#10b981' }}>${grossBillable.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
