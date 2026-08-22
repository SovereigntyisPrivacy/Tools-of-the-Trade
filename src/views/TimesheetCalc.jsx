import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TimesheetCalc() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Roster'); 

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // --- STATE: MULTI-EMPLOYEE ROSTER ---
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'Employee 1',
      rate: '25.00',
      taxPct: '15',
      shifts: { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] }
    }
  ]);
  const [activeId, setActiveId] = useState(1);
  const [copied, setCopied] = useState(false);

  const activeEmp = employees.find(e => e.id === activeId) || employees[0];

  const parse = (val) => parseFloat(val) || 0;

  // --- MATHEMATICAL CORE ---
  const calcShiftHours = (start, end) => {
    if (!start || !end) return 0;
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    let sTime = sH + sM / 60;
    let eTime = eH + eM / 60;
    
    // Automatically handle overnight shift crossovers 
    if (eTime < sTime) eTime += 24; 
    return eTime - sTime;
  };

  const getEmpPayroll = (emp) => {
    let totalHours = 0;
    daysOfWeek.forEach(d => {
      emp.shifts[d].forEach(s => {
        totalHours += calcShiftHours(s.start, s.end);
      });
    });

    const regHours = Math.min(40, totalHours);
    const otHours = Math.max(0, totalHours - 40);
    const rate = parse(emp.rate);
    
    // Time-and-a-half for OT
    const gross = (regHours * rate) + (otHours * (rate * 1.5));
    const tax = gross * (parse(emp.taxPct) / 100);
    const net = gross - tax;

    return { totalHours, regHours, otHours, gross, tax, net };
  };

  // --- ROSTER ACTIONS ---
  const addEmployee = () => {
    const newId = Date.now();
    setEmployees([...employees, {
      id: newId,
      name: `Employee ${employees.length + 1}`,
      rate: '20.00',
      taxPct: '15',
      shifts: { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] }
    }]);
    setActiveId(newId);
  };

  const updateEmp = (id, field, val) => {
    setEmployees(employees.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  const deleteEmp = (id) => {
    if (employees.length === 1) return; // Prevent deleting last employee
    const filtered = employees.filter(e => e.id !== id);
    setEmployees(filtered);
    if (activeId === id) setActiveId(filtered[0].id);
  };

  // --- TIMECARD ACTIONS ---
  const addShift = (day) => {
    setEmployees(employees.map(e => {
      if (e.id === activeId) {
        return { ...e, shifts: { ...e.shifts, [day]: [...e.shifts[day], { start: '', end: '' }] } };
      }
      return e;
    }));
  };

  const updateShift = (day, idx, field, val) => {
    setEmployees(employees.map(e => {
      if (e.id === activeId) {
        const newDayShifts = [...e.shifts[day]];
        newDayShifts[idx][field] = val;
        return { ...e, shifts: { ...e.shifts, [day]: newDayShifts } };
      }
      return e;
    }));
  };

  const deleteShift = (day, idx) => {
    setEmployees(employees.map(e => {
      if (e.id === activeId) {
        const newDayShifts = e.shifts[day].filter((_, i) => i !== idx);
        return { ...e, shifts: { ...e.shifts, [day]: newDayShifts } };
      }
      return e;
    }));
  };

  // --- DOSSIER EXPORT ---
  const generateReport = () => {
    let report = `SOVEREIGN TOOLS: MULTI-SHIFT PAYROLL DOSSIER\n`;
    report += `=========================================\n`;
    
    let teamGross = 0, teamTax = 0, teamNet = 0, teamHours = 0;

    employees.forEach(emp => {
      const pay = getEmpPayroll(emp);
      teamGross += pay.gross;
      teamTax += pay.tax;
      teamNet += pay.net;
      teamHours += pay.totalHours;

      report += `\n[ ${emp.name.toUpperCase()} ]\n`;
      report += `Rate: $${emp.rate}/hr | Tax: ${emp.taxPct}%\n`;
      report += `Total Hours: ${pay.totalHours.toFixed(2)} (Reg: ${pay.regHours.toFixed(2)} | OT: ${pay.otHours.toFixed(2)})\n`;
      report += `Gross: $${pay.gross.toFixed(2)} | Tax: -$${pay.tax.toFixed(2)} | NET: $${pay.net.toFixed(2)}\n`;
      
      const hasShifts = daysOfWeek.some(d => emp.shifts[d].length > 0);
      if (hasShifts) {
        report += `Logged Shifts:\n`;
        daysOfWeek.forEach(d => {
          if (emp.shifts[d].length > 0) {
            report += `  - ${d}: `;
            const shiftStrs = emp.shifts[d].map(s => `${s.start || '??:??'} to ${s.end || '??:??'}`);
            report += shiftStrs.join('  |  ') + `\n`;
          }
        });
      }
    });

    report += `\n=========================================\n`;
    report += `[ TEAM PAYROLL SUMMARY ]\n`;
    report += `Active Roster: ${employees.length} Workers\n`;
    report += `Total Man-Hours: ${teamHours.toFixed(2)} hrs\n`;
    report += `Total Gross Liability: $${teamGross.toFixed(2)}\n`;
    report += `Total Withheld Taxes: -$${teamTax.toFixed(2)}\n`;
    report += `Total Net Disbursed: $${teamNet.toFixed(2)}\n`;
    report += `=========================================\n`;
    return report;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // --- STYLES ---
  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.05em', marginTop: '4px' };
  const labelStyle = { color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate('/calculator')}>Hub</button>
        <h2>Timesheet & Payroll</h2>
      </header>

      {/* TOP TABS */}
      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Roster', 'Timecard', 'Report'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: activeTab === tab ? '#00cc66' : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>
            {tab}
          </button>
        ))}
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', paddingBottom: '120px' }}>
        
        {/* ========================================== */}
        {/* TAB 1: FLEET ROSTER                        */}
        {/* ========================================== */}
        {activeTab === 'Roster' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#fff', margin: 0 }}>Team Roster</h3>
              <button onClick={addEmployee} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>+ Add Worker</button>
            </div>
            
            {employees.map(emp => (
              <div key={emp.id} style={{ ...cardStyle, borderLeft: activeId === emp.id ? '4px solid #00cc66' : '4px solid #444', cursor: 'pointer' }} onClick={() => setActiveId(emp.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <input 
                    type="text" value={emp.name} onChange={e => updateEmp(emp.id, 'name', e.target.value)} 
                    style={{ ...inputStyle, width: '60%', margin: 0, border: 'none', borderBottom: '1px solid #333', background: 'transparent', fontSize: '1.2em', fontWeight: 'bold', padding: '5px' }} 
                  />
                  {employees.length > 1 && (
                    <button onClick={(e) => { e.stopPropagation(); deleteEmp(emp.id); }} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', padding: '6px 12px', fontWeight: 'bold' }}>Remove</button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1 }}><label style={labelStyle}>Hourly Rate ($)<input type="number" value={emp.rate} onChange={e => updateEmp(emp.id, 'rate', e.target.value)} style={inputStyle} /></label></div>
                  <div style={{ flex: 1 }}><label style={labelStyle}>Tax Withholding (%)<input type="number" value={emp.taxPct} onChange={e => updateEmp(emp.id, 'taxPct', e.target.value)} style={inputStyle} /></label></div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ========================================== */}
        {/* TAB 2: ISOLATED TIMECARD                   */}
        {/* ========================================== */}
        {activeTab === 'Timecard' && (
          <>
            <div style={{ marginBottom: '20px', background: '#111', padding: '15px', borderRadius: '12px', border: '1px solid #333' }}>
              <label style={{ color: '#aaa', fontSize: '0.85em', fontWeight: 'bold', textTransform: 'uppercase' }}>Currently Editing Timecard For:
                <select value={activeId} onChange={e => setActiveId(Number(e.target.value))} style={{ ...inputStyle, borderColor: '#00cc66', color: '#00cc66', fontWeight: 'bold', fontSize: '1.2em', marginTop: '10px' }}>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </label>
            </div>

            {daysOfWeek.map(day => {
              let dayHrs = 0;
              activeEmp.shifts[day].forEach(s => { dayHrs += calcShiftHours(s.start, s.end); });
              return (
                <div key={day} style={{ ...cardStyle, padding: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{day} <span style={{ color: '#888', fontWeight: 'normal', fontSize: '0.9em', marginLeft: '5px' }}>({dayHrs.toFixed(2)} hrs)</span></h4>
                    <button onClick={() => addShift(day)} style={{ background: 'rgba(0,204,102,0.1)', color: '#00cc66', border: '1px solid #00cc66', borderRadius: '6px', padding: '6px 12px', fontWeight: 'bold', fontSize: '0.85em' }}>+ Add Shift</button>
                  </div>
                  {activeEmp.shifts[day].map((shift, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '15px', background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #222' }}>
                      <input type="time" value={shift.start} onChange={e => updateShift(day, idx, 'start', e.target.value)} style={{ flex: 1, padding: '10px', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '6px' }} />
                      <span style={{ color: '#666', fontWeight: 'bold' }}>to</span>
                      <input type="time" value={shift.end} onChange={e => updateShift(day, idx, 'end', e.target.value)} style={{ flex: 1, padding: '10px', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '6px' }} />
                      <button onClick={() => deleteShift(day, idx)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.5em', padding: '0 5px' }}>×</button>
                    </div>
                  ))}
                </div>
              );
            })}
          </>
        )}

        {/* ========================================== */}
        {/* TAB 3: PAYROLL DOSSIER                     */}
        {/* ========================================== */}
        {activeTab === 'Report' && (
          <>
            <button 
              onClick={handleCopyReport}
              style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #3b82f6', background: copied ? '#00cc66' : 'rgba(59, 130, 246, 0.1)', color: copied ? '#000' : '#3b82f6', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '20px', transition: 'all 0.2s' }}>
              {copied ? '✅ Dossier Copied to Clipboard!' : '📋 Export Master Payroll'}
            </button>

            <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '20px', fontFamily: 'monospace', fontSize: '1.1em', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#00ffff', textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>Total Fleet Liability</h3>
              
              {(() => {
                let tGross = 0, tTax = 0, tNet = 0, tHrs = 0;
                employees.forEach(e => {
                  const p = getEmpPayroll(e);
                  tGross += p.gross; tTax += p.tax; tNet += p.net; tHrs += p.totalHours;
                });
                return (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Active Roster:</span> <span style={{color:'#fff'}}>{employees.length} Workers</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px' }}><span>Total Man-Hours:</span> <span style={{color:'#fff'}}>{tHrs.toFixed(2)} hrs</span></div>
                    
                    <div style={{ borderBottom: '1px dashed #444', margin: '10px 0' }}></div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffaa00', marginBottom: '8px' }}><span>Gross Payroll:</span> <span>${tGross.toFixed(2)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', marginBottom: '15px' }}><span>Withheld Taxes:</span> <span>-${tTax.toFixed(2)}</span></div>
                    
                    <div style={{ borderBottom: '1px solid #444', margin: '10px 0' }}></div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00cc66', fontWeight: 'bold', fontSize: '1.3em' }}><span>Net Disbursed:</span> <span>${tNet.toFixed(2)}</span></div>
                  </>
                )
              })()}
            </div>

            <h4 style={{ color: '#fff', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Individual Breakdowns</h4>
            
            {employees.map(emp => {
              const p = getEmpPayroll(emp);
              return (
                <div key={emp.id} style={{ ...cardStyle, borderLeft: '4px solid #3b82f6', marginBottom: '15px', padding: '15px' }}>
                  <h4 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '1.1em' }}>{emp.name}</h4>
                  <div style={{ color: '#888', fontSize: '0.85em', display: 'flex', gap: '15px', marginBottom: '12px' }}>
                    <span>Rate: <strong style={{color:'#aaa'}}>${emp.rate}/hr</strong></span>
                    <span>Tax: <strong style={{color:'#aaa'}}>{emp.taxPct}%</strong></span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95em', color: '#aaa', borderTop: '1px solid #222', paddingTop: '10px' }}>
                    <span>Reg: {p.regHours.toFixed(2)}</span>
                    <span>OT: {p.otHours.toFixed(2)}</span>
                    <span style={{ color: '#00cc66', fontWeight: 'bold' }}>Net: ${p.net.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </>
        )}

      </div>
    </div>
  );
}
