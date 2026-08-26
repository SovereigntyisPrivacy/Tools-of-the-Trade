import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../core/CalendarContext';

export default function MySchedule() {
  const navigate = useNavigate();
  const { addReminder } = useCalendar();
  const [activeTab, setActiveTab] = useState('tracker');

  // Default 4:00 PM to 10:00 PM second shift template
  const defaultWeek = [
    { id: 'MON', sIn: '', sOut: '', aIn: '', aOut: '', noShow: false },
    { id: 'TUE', sIn: '', sOut: '', aIn: '', aOut: '', noShow: false },
    { id: 'WED', sIn: '16:00', sOut: '22:00', aIn: '', aOut: '', noShow: false },
    { id: 'THU', sIn: '16:00', sOut: '22:00', aIn: '', aOut: '', noShow: false },
    { id: 'FRI', sIn: '', sOut: '', aIn: '', aOut: '', noShow: false },
    { id: 'SAT', sIn: '16:00', sOut: '22:00', aIn: '', aOut: '', noShow: false },
    { id: 'SUN', sIn: '16:00', sOut: '22:00', aIn: '', aOut: '', noShow: false }
  ];

  // --- STATE ---
  const [shifts, setShifts] = useState(() => JSON.parse(localStorage.getItem('fleet_shifts')) || defaultWeek);
  const [rate, setRate] = useState(() => localStorage.getItem('fleet_rate') || '16');
  const [taxProfile, setTaxProfile] = useState(() => localStorage.getItem('fleet_tax_prof') || 'W2');
  const [stateTax, setStateTax] = useState(() => localStorage.getItem('fleet_state_tax') || '2.5');
  const [fedTax, setFedTax] = useState(() => localStorage.getItem('fleet_fed_tax') || '0');
  
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('fleet_shift_hist')) || []);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedHist, setSelectedHist] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);

  useEffect(() => {
    localStorage.setItem('fleet_shifts', JSON.stringify(shifts));
    localStorage.setItem('fleet_rate', rate);
    localStorage.setItem('fleet_tax_prof', taxProfile);
    localStorage.setItem('fleet_state_tax', stateTax);
    localStorage.setItem('fleet_fed_tax', fedTax);
    localStorage.setItem('fleet_shift_hist', JSON.stringify(history));
  }, [shifts, rate, taxProfile, stateTax, fedTax, history]);

  // --- MATH ENGINE ---
  const calcHrs = (tIn, tOut) => {
    if (!tIn || !tOut) return 0;
    const [h1, m1] = tIn.split(':').map(Number);
    const [h2, m2] = tOut.split(':').map(Number);
    let mins = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (mins < 0) mins += 24 * 60; // Handle night shifts over midnight
    return mins / 60;
  };

  const getVariance = (sIn, aIn) => {
    if (!sIn || !aIn) return null;
    const [sh, sm] = sIn.split(':').map(Number);
    const [ah, am] = aIn.split(':').map(Number);
    let sMins = sh * 60 + sm;
    let aMins = ah * 60 + am;
    
    // Handle overnight edge cases for punches (e.g. scheduled 23:00, punched 00:15)
    if (aMins < 12 * 60 && sMins >= 12 * 60) aMins += 24 * 60;
    if (sMins < 12 * 60 && aMins >= 12 * 60) sMins += 24 * 60;
    
    const diff = aMins - sMins;
    if (diff > 0) return { type: 'Late', mins: diff, color: '#ef4444' };
    if (diff < 0) return { type: 'Early', mins: Math.abs(diff), color: '#3b82f6' };
    return { type: 'On Time', mins: 0, color: '#10b981' };
  };

  const shiftData = shifts.map(s => {
    const sHrs = calcHrs(s.sIn, s.sOut);
    let aHrs = 0;
    let varData = null;
    let status = 'Pending';
    
    if (s.noShow) {
      status = 'No Show';
    } else if (s.aIn && s.aOut) {
      aHrs = calcHrs(s.aIn, s.aOut);
      varData = getVariance(s.sIn, s.aIn);
      status = 'Completed';
    }
    
    const billable = status === 'Completed' ? aHrs : (status === 'No Show' ? 0 : sHrs);
    return { ...s, sHrs, aHrs, varData, status, billable };
  });

  const totalHrs = shiftData.reduce((acc, s) => acc + s.billable, 0);
  const regHrs = Math.min(totalHrs, 40);
  const otHrs = Math.max(totalHrs - 40, 0);
  
  const hourly = parseFloat(rate) || 0;
  const regPay = regHrs * hourly;
  const otPay = otHrs * (hourly * 1.5);
  const gross = regPay + otPay;

  const isW2 = taxProfile === 'W2';
  const fica = isW2 ? gross * 0.062 : 0;
  const medicare = isW2 ? gross * 0.0145 : 0;
  const sTax = gross * ((parseFloat(stateTax) || 0) / 100);
  const fTax = gross * ((parseFloat(fedTax) || 0) / 100);
  const totalDeduct = fica + medicare + sTax + fTax;
  const netPay = gross - totalDeduct;

  // --- HANDLERS & EXPORTERS ---
  const updateShift = (id, field, val) => setShifts(shifts.map(s => s.id === id ? { ...s, [field]: val } : s));
  const clearWeek = () => setShifts(defaultWeek);

  const downloadCSV = (content, fileName) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.setAttribute('download', fileName);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const exportTimesheet = (data) => {
    let csv = `Date Range,Gross Pay,Net Pay,Total Hours,Reg Pay,OT Pay\n`;
    csv += `"${data.date}","$${data.gross.toFixed(2)}","$${data.netPay.toFixed(2)}","${data.totalHrs.toFixed(1)}","$${data.regPay.toFixed(2)}","$${data.otPay.toFixed(2)}"\n\n`;
    csv += `Day,Sched In,Sched Out,Actual In,Actual Out,Status,Variance\n`;
    data.shiftData.forEach(s => {
      const vStr = s.varData ? `${s.varData.type} by ${s.varData.mins}m` : 'N/A';
      csv += `"${s.id}","${s.sIn}","${s.sOut}","${s.aIn}","${s.aOut}","${s.status}","${vStr}"\n`;
    });
    downloadCSV(csv, `Timesheet_${data.date.replace(/\//g, '-')}.csv`);
  };

  const saveAndArchive = () => {
    const archive = { id: Date.now(), date: new Date().toLocaleDateString(), shiftData, totalHrs, regPay, otPay, gross, fica, medicare, sTax, fTax, netPay };
    setHistory([archive, ...history]);
    clearWeek();
    setShowPreview(false);
    setActiveTab('history');
  };

  const syncToCalendar = () => {
    addReminder(new Date().toISOString().split('T')[0], `Timesheet Logged: ${totalHrs.toFixed(1)}h | Net: $${netPay.toFixed(2)}`, 'My Schedule', 'High');
    setShowPreview(false);
  };

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #222', padding: '15px', marginBottom: '15px' };
  const inputStyle = { background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '8px', borderRadius: '6px', outline: 'none', width: '100%', colorScheme: 'dark' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#10b981', fontSize: '1.2em' }}>My Schedule</h2>
      </header>

      <div style={{ display: 'flex', gap: '8px', padding: '15px 15px 0 15px' }}>
        <button onClick={() => setActiveTab('tracker')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'tracker' ? '#10b981' : '#222', color: activeTab === 'tracker' ? '#000' : '#888' }}>Tracker</button>
        <button onClick={() => setActiveTab('history')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'history' ? '#f59e0b' : '#222', color: activeTab === 'history' ? '#000' : '#888' }}>History</button>
      </div>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        {activeTab === 'tracker' && (
          <>
            <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '4px solid #10b981' }}>
              <div><div style={{ color: '#888', fontSize: '0.85em', fontWeight: 'bold', marginBottom: '5px' }}>HOURLY RATE</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>$</span><input type="number" value={rate} onChange={e => setRate(e.target.value)} style={{ ...inputStyle, width: '80px', fontSize: '1.1em' }} /></div>
              </div>
              <div style={{ textAlign: 'right' }}><div style={{ color: '#888', fontSize: '0.85em', fontWeight: 'bold', marginBottom: '5px' }}>TOTAL HOURS</div><div style={{ color: '#10b981', fontSize: '1.5em', fontWeight: 'bold' }}>{totalHrs.toFixed(1)}h</div></div>
            </div>

            <div style={{ ...cardStyle }}>
              <h3 style={{ color: '#10b981', margin: '0 0 15px 0', textAlign: 'center', textTransform: 'uppercase', fontSize: '0.9em' }}>This Week's Shifts</h3>
              {shiftData.map(s => (
                <div key={s.id} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #222' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong style={{ fontSize: '1.1em' }}>{s.id}</strong>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ color: '#aaa', fontSize: '0.9em' }}>{s.sHrs > 0 ? `${s.sHrs.toFixed(1)}h` : '-'}</span>
                      <button onClick={() => setExpandedDay(expandedDay === s.id ? null : s.id)} style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid #10b981', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8em' }}>
                        {s.aIn || s.noShow ? 'Edit Actuals' : '+ Actuals'}
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="time" value={s.sIn} onChange={e => updateShift(s.id, 'sIn', e.target.value)} style={inputStyle} />
                    <span style={{ color: '#666' }}>to</span>
                    <input type="time" value={s.sOut} onChange={e => updateShift(s.id, 'sOut', e.target.value)} style={inputStyle} />
                  </div>

                  {expandedDay === s.id && (
                    <div style={{ marginTop: '10px', padding: '10px', background: '#0a0a0a', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '0.85em' }}>PUNCH RECORD</span>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85em', color: s.noShow ? '#ef4444' : '#888' }}>
                          <input type="checkbox" checked={s.noShow} onChange={e => updateShift(s.id, 'noShow', e.target.checked)} /> No Show
                        </label>
                      </div>
                      {!s.noShow && (
                        <>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                            <input type="time" value={s.aIn} onChange={e => updateShift(s.id, 'aIn', e.target.value)} style={{ ...inputStyle, borderColor: '#f59e0b' }} />
                            <span style={{ color: '#666' }}>to</span>
                            <input type="time" value={s.aOut} onChange={e => updateShift(s.id, 'aOut', e.target.value)} style={{ ...inputStyle, borderColor: '#f59e0b' }} />
                          </div>
                          {s.varData && (
                            <div style={{ color: s.varData.color, fontSize: '0.85em', fontWeight: 'bold', fontStyle: 'italic' }}>
                              Arrival: {s.varData.type} by {s.varData.mins} mins
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <button onClick={clearWeek} style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>CLEAR WEEK</button>
            </div>
            <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
              <h3 style={{ color: '#10b981', margin: '0 0 15px 0', textTransform: 'uppercase', fontSize: '0.9em', textAlign: 'center' }}>Paycheck Estimator</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', marginBottom: '8px' }}><span>Regular Pay ({regHrs.toFixed(1)}h)</span><span>${regPay.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', marginBottom: '20px' }}><span>Overtime Pay ({otHrs.toFixed(1)}h)</span><span>${otPay.toFixed(2)}</span></div>
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={{ color: '#888', fontSize: '0.8em', fontWeight: 'bold' }}>Tax Profile</label><select value={taxProfile} onChange={e => setTaxProfile(e.target.value)} style={inputStyle}><option value="W2">W2 Employee</option><option value="1099">1099 Contract</option></select></div>
                <div style={{ flex: 1 }}><label style={{ color: '#888', fontSize: '0.8em', fontWeight: 'bold' }}>State Tax (%)</label><input type="number" value={stateTax} onChange={e => setStateTax(e.target.value)} style={inputStyle} /></div>
                <div style={{ flex: 1 }}><label style={{ color: '#888', fontSize: '0.8em', fontWeight: 'bold' }}>Fed Tax (%)</label><input type="number" value={fedTax} onChange={e => setFedTax(e.target.value)} style={inputStyle} /></div>
              </div>

              <div style={{ borderTop: '1px dashed #333', paddingTop: '15px', marginBottom: '15px' }}>
                <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center', fontSize: '0.9em' }}>ESTIMATED DEDUCTIONS</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.9em', marginBottom: '6px' }}><span>FICA (6.2%)</span><span>-${fica.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.9em', marginBottom: '6px' }}><span>Medicare (1.45%)</span><span>-${medicare.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.9em', marginBottom: '6px' }}><span>State Tax</span><span>-${sTax.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.9em', marginBottom: '6px' }}><span>Federal Tax</span><span>-${fTax.toFixed(2)}</span></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #333', paddingTop: '15px', fontSize: '1.2em', fontWeight: 'bold' }}><span>Est. Net Pay</span><span style={{ color: '#10b981' }}>${netPay.toFixed(2)}</span></div>
              <button onClick={() => setShowPreview(true)} style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginTop: '20px' }}>Preview & Archive Sheet</button>
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div style={{ borderTop: '4px solid #f59e0b', paddingTop: '10px' }}>
            <h3 style={{ color: '#f59e0b', margin: '0 0 15px 0', textAlign: 'center', textTransform: 'uppercase', fontSize: '0.9em' }}>Timesheet Archives</h3>
            {history.length === 0 ? <div style={{ color: '#666', textAlign: 'center', fontStyle: 'italic' }}>No archived timesheets.</div> : history.map(hist => (
              <div key={hist.id} onClick={() => setSelectedHist(hist)} style={{ ...cardStyle, borderLeft: '4px solid #f59e0b', cursor: 'pointer', padding: '10px 15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}><strong style={{ color: '#fff' }}>Week of {hist.date}</strong><span style={{ color: '#10b981', fontWeight: 'bold' }}>${hist.netPay.toFixed(2)}</span></div>
                <div style={{ color: '#888', fontSize: '0.85em' }}>Logged: {hist.totalHrs.toFixed(1)}h</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* UNIFIED TIMESHEET PREVIEW & EXPORT MODAL */}
      {(showPreview || selectedHist) && (() => {
        const isHist = !!selectedHist;
        const data = isHist ? selectedHist : { date: new Date().toLocaleDateString(), shiftData, totalHrs, regPay, otPay, gross, fica, medicare, sTax, fTax, netPay };

        return (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#f4f4f0', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #111', paddingBottom: '15px', marginBottom: '20px' }}>
              <h2 style={{ color: '#111', margin: 0, fontFamily: 'serif', textTransform: 'uppercase' }}>Weekly Timesheet</h2>
              <button onClick={() => { setShowPreview(false); setSelectedHist(null); }} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {isHist ? (
                <button onClick={() => exportTimesheet(data)} style={{ flex: 1, background: '#10b981', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold' }}>📥 Export CSV (Excel)</button>
              ) : (
                <>
                  <button onClick={syncToCalendar} style={{ flex: 1, background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold' }}>📅 Sync to Calendar</button>
                  <button onClick={saveAndArchive} style={{ flex: 1, background: '#a855f7', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold' }}>💾 Archive Sheet</button>
                </>
              )}
            </div>

            <div style={{ border: '1px solid #111', background: '#fff', padding: '15px', marginBottom: '20px', color: '#111' }}>
               <div style={{ fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Date: {data.date}</div>
               
               <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #111', paddingBottom: '5px', marginBottom: '10px', fontFamily: 'monospace', fontSize: '0.85em', fontWeight: 'bold' }}>
                  <span style={{flex: 1}}>DAY</span><span style={{flex: 1}}>SCHED</span><span style={{flex: 1}}>ACTUAL</span><span style={{flex: 1, textAlign: 'right'}}>HRS</span>
               </div>
               
               {data.shiftData.map(s => (
                 <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', padding: '8px 0', fontFamily: 'monospace', fontSize: '0.85em' }}>
                   <span style={{flex: 1, fontWeight: 'bold'}}>{s.id}</span>
                   <span style={{flex: 1}}>{s.sIn ? `${s.sIn}-${s.sOut}` : 'OFF'}</span>
                   <span style={{flex: 1, color: s.noShow ? '#ef4444' : '#111'}}>{s.noShow ? 'NO SHOW' : (s.aIn ? `${s.aIn}-${s.aOut}` : '--')}</span>
                   <span style={{flex: 1, textAlign: 'right', fontWeight: 'bold', color: s.varData?.type === 'Late' ? '#ef4444' : '#111'}}>{s.billable.toFixed(1)}</span>
                 </div>
               ))}
               
               <div style={{ marginTop: '20px', background: '#f8f9fa', padding: '15px', borderRadius: '6px', border: '1px solid #ddd' }}>
                 <h4 style={{ margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '0.9em', color: '#555' }}>Payroll Summary</h4>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}><span>Gross Pay:</span><strong>${data.gross.toFixed(2)}</strong></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', color: '#ef4444', fontSize: '0.9em' }}><span>Taxes (Est):</span><span>-${(data.fica + data.medicare + data.sTax + data.fTax).toFixed(2)}</span></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '2px solid #111', fontSize: '1.2em' }}>
                   <strong>NET PAY:</strong><strong style={{ color: '#10b981' }}>${data.netPay.toFixed(2)}</strong>
                 </div>
               </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
