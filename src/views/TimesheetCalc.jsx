import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TimesheetCalc() {
  const navigate = useNavigate();
  
  // --- MASTER MODE TOGGLE ---
  const [appMode, setAppMode] = useState('Solo'); // 'Solo' or 'Manager'

  // --- SOLO STATE ---
  const [soloTab, setSoloTab] = useState('Timecard');
  const [soloRate, setSoloRate] = useState('20.00');
  const [soloTax, setSoloTax] = useState('15');
  const [soloBonus, setSoloBonus] = useState(''); // Tips / Per Diem
  const [soloShifts, setSoloShifts] = useState({ Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] });

  // --- MANAGER STATE ---
  const [mgrTab, setMgrTab] = useState('Roster');
  const [mgrBudget, setMgrBudget] = useState('160'); // Target labor hours
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Employee 1', shifts: { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] } }
  ]);
  const [activeEmpId, setActiveEmpId] = useState(1);
  const [copied, setCopied] = useState(false);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const parse = (val) => parseFloat(val) || 0;

  // --- ENGINE LOGIC ---
  const calcShiftHours = (start, end, breakMins = 0) => {
    if (!start || !end) return 0;
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    let sTime = sH + sM / 60;
    let eTime = eH + eM / 60;
    
    // Automatically handles overnight crossovers
    if (eTime < sTime) eTime += 24; 
    
    // Deduct unpaid break time
    const totalWithBreak = (eTime - sTime) - (parse(breakMins) / 60);
    return Math.max(0, totalWithBreak); 
  };

  // --- SOLO FUNCTIONS ---
  const addSoloShift = (day) => {
    setSoloShifts({ ...soloShifts, [day]: [...soloShifts[day], { start: '', end: '', break: '' }] });
  };
  const updateSoloShift = (day, idx, field, val) => {
    const newShifts = [...soloShifts[day]];
    newShifts[idx][field] = val;
    setSoloShifts({ ...soloShifts, [day]: newShifts });
  };
  const deleteSoloShift = (day, idx) => {
    const newShifts = soloShifts[day].filter((_, i) => i !== idx);
    setSoloShifts({ ...soloShifts, [day]: newShifts });
  };

  const getSoloPayroll = () => {
    let tHrs = 0;
    daysOfWeek.forEach(d => soloShifts[d].forEach(s => tHrs += calcShiftHours(s.start, s.end, s.break)));
    const reg = Math.min(40, tHrs);
    const ot = Math.max(0, tHrs - 40);
    const rate = parse(soloRate);
    const bonus = parse(soloBonus);
    
    const gross = (reg * rate) + (ot * rate * 1.5) + bonus;
    const tax = gross * (parse(soloTax) / 100);
    return { tHrs, reg, ot, bonus, gross, tax, net: gross - tax };
  };

  // --- MANAGER FUNCTIONS ---
  const activeEmp = employees.find(e => e.id === activeEmpId) || employees[0];

  const addEmployee = () => {
    const newId = Date.now();
    setEmployees([...employees, { id: newId, name: `Worker ${employees.length + 1}`, shifts: { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] } }]);
    setActiveEmpId(newId);
  };
  const updateEmpName = (id, val) => {
    setEmployees(employees.map(e => e.id === id ? { ...e, name: val } : e));
  };
  const deleteEmp = (id) => {
    if (employees.length === 1) return;
    const filtered = employees.filter(e => e.id !== id);
    setEmployees(filtered);
    if (activeEmpId === id) setActiveEmpId(filtered[0].id);
  };

  const addMgrShift = (day) => {
    setEmployees(employees.map(e => e.id === activeEmpId ? { ...e, shifts: { ...e.shifts, [day]: [...e.shifts[day], { start: '', end: '', break: '' }] } } : e));
  };
  const updateMgrShift = (day, idx, field, val) => {
    setEmployees(employees.map(e => {
      if (e.id === activeEmpId) {
        const dShifts = [...e.shifts[day]];
        dShifts[idx][field] = val;
        return { ...e, shifts: { ...e.shifts, [day]: dShifts } };
      }
      return e;
    }));
  };
  const deleteMgrShift = (day, idx) => {
    setEmployees(employees.map(e => {
      if (e.id === activeEmpId) {
        const dShifts = e.shifts[day].filter((_, i) => i !== idx);
        return { ...e, shifts: { ...e.shifts, [day]: dShifts } };
      }
      return e;
    }));
  };

  const getEmpTotalHours = (emp) => {
    let tHrs = 0;
    daysOfWeek.forEach(d => emp.shifts[d].forEach(s => tHrs += calcShiftHours(s.start, s.end, s.break)));
    return tHrs;
  };

  const generateMgrReport = () => {
    let report = `WEEKLY MASTER SCHEDULE\n=======================\n\n`;
    let fleetHours = 0;
    employees.forEach(e => {
      const hrs = getEmpTotalHours(e);
      fleetHours += hrs;
      report += `[ ${e.name.toUpperCase()} ] - Total: ${hrs.toFixed(2)} hrs\n`;
      daysOfWeek.forEach(d => {
        if (e.shifts[d].length > 0) {
          const shiftStrs = e.shifts[d].map(s => {
            const brk = s.break ? ` (-${s.break}m brk)` : '';
            return `${s.start || '??:??'} to ${s.end || '??:??'}${brk}`;
          });
          report += `  ${d}: ${shiftStrs.join(' | ')}\n`;
        }
      });
      report += `\n`;
    });
    const bgt = parse(mgrBudget);
    report += `=======================\nTOTAL FLEET HOURS: ${fleetHours.toFixed(2)} hrs\n`;
    report += `LABOR BUDGET TARGET: ${bgt.toFixed(2)} hrs\n`;
    report += `VARIANCE: ${(bgt - fleetHours).toFixed(2)} hrs ${bgt >= fleetHours ? '(Under Budget)' : '(OVER BUDGET)'}\n`;
    return report;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateMgrReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // --- UI COMPONENTS ---
  const HumanityCheck = () => (
    <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0, 255, 255, 0.05)', border: '1px dashed #00ffff', borderRadius: '12px', textAlign: 'center' }}>
      <span style={{ fontSize: '1.5em', display: 'block', marginBottom: '8px' }}>💧 🧘‍♂️</span>
      <strong style={{ color: '#00ffff', display: 'block', marginBottom: '4px' }}>Humanity Check</strong>
      <span style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.4', display: 'block' }}>
        Drink a glass of water, fix your posture, and take a deep breath. No shift is worth burning yourself out.
      </span>
    </div>
  );

  const GuideTab = () => (
    <div style={{ padding: '5px' }}>
      <div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>⚠️ Official Disclaimer</h3>
        <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5', margin: 0 }}>
          This module is an educational estimation and scheduling tool. It does not replace certified HR payroll software, official time-clocks, or a licensed CPA. Always verify local state laws regarding lunch breaks and overtime limits.
        </p>
      </div>
      <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>Federal Overtime (FLSA)</h3>
        <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5', margin: 0 }}>
          Under the Fair Labor Standards Act, covered non-exempt employees must receive overtime pay for hours worked over 40 per workweek at a rate not less than time and one-half (1.5x) their regular rate of pay.
        </p>
      </div>
      <div style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#a855f7' }}>Unpaid Meal Breaks</h3>
        <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5', margin: 0 }}>
          Federal law does not require lunch or coffee breaks. Genuine "meal periods" (usually 30 minutes or more) are not considered work time and are unpaid, provided the employee is completely relieved of all duties.
        </p>
      </div>
      <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#00cc66' }}>W-2 vs 1099 Workers</h3>
        <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5', margin: 0 }}>
          <strong>W-2:</strong> The employer dictates your schedule and withholds taxes. Minimum wage and overtime laws apply.<br/><br/>
          <strong>1099:</strong> You dictate how/when work gets done. You are responsible for your own Self-Employment taxes, and FLSA overtime laws generally do not apply.
        </p>
      </div>
    </div>
  );

  // --- STYLES ---
  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.05em', marginTop: '4px' };
  const labelStyle = { color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  // --- MANAGER BUDGET CALC ---
  const totalFleetHours = employees.reduce((acc, emp) => acc + getEmpTotalHours(emp), 0);
  const budgetNum = parse(mgrBudget);
  const budgetPct = budgetNum > 0 ? Math.min(100, (totalFleetHours / budgetNum) * 100) : 0;
  const isOverBudget = totalFleetHours > budgetNum;

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate('/calculator')}>Hub</button>
        <h2>Timesheet Engine</h2>
      </header>

      {/* GLOBAL MODE TOGGLE */}
      <div style={{ display: 'flex', background: '#151515', padding: '10px', borderBottom: '1px solid #333', gap: '10px' }}>
        <button 
          onClick={() => setAppMode('Solo')}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: appMode === 'Solo' ? '#3b82f6' : '#222', color: appMode === 'Solo' ? '#fff' : '#888' }}>
          👤 Solo Pay
        </button>
        <button 
          onClick={() => setAppMode('Manager')}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: appMode === 'Manager' ? '#a855f7' : '#222', color: appMode === 'Manager' ? '#fff' : '#888' }}>
          📋 Crew Manager
        </button>
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1 }}>
        
        {/* ========================================== */}
        {/* SOLO MODE                                  */}
        {/* ========================================== */}
        {appMode === 'Solo' && (
          <>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {['Timecard', 'Pay Stub', 'Guide'].map(tab => (
                <button key={tab} onClick={() => setSoloTab(tab)} style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: soloTab === tab ? '#00ffff' : '#222', color: soloTab === tab ? '#000' : '#888' }}>{tab}</button>
              ))}
            </div>

            {soloTab === 'Timecard' && (
              <>
                <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>Wage Profile</h4>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 90px' }}><label style={labelStyle}>Rate ($)<input type="number" value={soloRate} onChange={e=>setSoloRate(e.target.value)} style={inputStyle} /></label></div>
                    <div style={{ flex: '1 1 90px' }}><label style={labelStyle}>Tax (%)<input type="number" value={soloTax} onChange={e=>setSoloTax(e.target.value)} style={inputStyle} /></label></div>
                    <div style={{ flex: '1 1 120px' }}><label style={labelStyle}>Tips/Bonus ($)<input type="number" value={soloBonus} onChange={e=>setSoloBonus(e.target.value)} placeholder="0.00" style={{...inputStyle, border: '1px solid #00ffff'}} /></label></div>
                  </div>
                </div>

                {daysOfWeek.map(day => {
                  let dHrs = 0;
                  soloShifts[day].forEach(s => dHrs += calcShiftHours(s.start, s.end, s.break));
                  return (
                    <div key={day} style={{ ...cardStyle, padding: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, color: '#fff' }}>{day} <span style={{ color: '#888', fontWeight: 'normal' }}>({dHrs.toFixed(2)} hrs)</span></h4>
                        <button onClick={() => addSoloShift(day)} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '6px', padding: '6px 12px', fontWeight: 'bold' }}>+ Shift</button>
                      </div>
                      {soloShifts[day].map((shift, idx) => (
                        <div key={idx} style={{ marginTop: '10px', background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #222' }}>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                            <input type="time" value={shift.start} onChange={e => updateSoloShift(day, idx, 'start', e.target.value)} style={{ flex: 1, padding: '8px', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '6px' }} />
                            <span style={{ color: '#666' }}>to</span>
                            <input type="time" value={shift.end} onChange={e => updateSoloShift(day, idx, 'end', e.target.value)} style={{ flex: 1, padding: '8px', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '6px' }} />
                            <button onClick={() => deleteSoloShift(day, idx)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.5em', padding: '0 5px' }}>×</button>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: '#888', fontSize: '0.85em', textTransform: 'uppercase' }}>Unpaid Break:</span>
                            <input type="number" placeholder="0" value={shift.break} onChange={e => updateSoloShift(day, idx, 'break', e.target.value)} style={{ width: '80px', padding: '6px', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '6px', textAlign: 'center' }} />
                            <span style={{ color: '#888', fontSize: '0.85em' }}>mins</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
                <HumanityCheck />
              </>
            )}

            {soloTab === 'Pay Stub' && (() => {
              const p = getSoloPayroll();
              return (
                <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '20px', fontFamily: 'monospace', fontSize: '1.1em' }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#00ffff', textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>WEEKLY PAY STUB</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Regular Hours:</span> <span style={{color:'#fff'}}>{p.regHours.toFixed(2)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Overtime (1.5x):</span> <span style={{color:'#ffaa00'}}>{p.otHours.toFixed(2)}</span></div>
                  {p.bonus > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Tips / Bonus:</span> <span style={{color:'#00ffff'}}>+${p.bonus.toFixed(2)}</span></div>}
                  <div style={{ borderBottom: '1px dashed #444', margin: '10px 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Gross Pay:</span> <span>${p.gross.toFixed(2)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', marginBottom: '15px' }}><span>Est Taxes:</span> <span>-${p.tax.toFixed(2)}</span></div>
                  <div style={{ borderBottom: '1px solid #444', margin: '10px 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00cc66', fontWeight: 'bold', fontSize: '1.3em' }}><span>NET PAY:</span> <span>${p.net.toFixed(2)}</span></div>
                </div>
              );
            })()}

            {soloTab === 'Guide' && <GuideTab />}
          </>
        )}

        {/* ========================================== */}
        {/* MANAGER MODE                               */}
        {/* ========================================== */}
        {appMode === 'Manager' && (
          <>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {['Roster', 'Schedule', 'Report', 'Guide'].map(tab => (
                <button key={tab} onClick={() => setMgrTab(tab)} style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: mgrTab === tab ? '#a855f7' : '#222', color: mgrTab === tab ? '#fff' : '#888' }}>{tab}</button>
              ))}
            </div>

            {mgrTab === 'Roster' && (
              <>
                <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#a855f7' }}>Labor Control</h4>
                  <label style={labelStyle}>Weekly Target Budget (Hours)<input type="number" value={mgrBudget} onChange={e=>setMgrBudget(e.target.value)} style={{...inputStyle, border: '1px solid #a855f7'}} /></label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '20px' }}>
                  <h3 style={{ color: '#fff', margin: 0 }}>Crew Members</h3>
                  <button onClick={addEmployee} style={{ padding: '8px 16px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>+ Add Worker</button>
                </div>
                {employees.map(emp => (
                  <div key={emp.id} style={{ ...cardStyle, borderLeft: '4px solid #a855f7', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                      type="text" value={emp.name} onChange={e => updateEmpName(emp.id, e.target.value)} 
                      style={{ ...inputStyle, flex: 1, margin: 0, border: '1px solid #333', fontSize: '1.1em', fontWeight: 'bold' }} 
                    />
                    {employees.length > 1 && (
                      <button onClick={() => deleteEmp(emp.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', padding: '10px 15px', fontWeight: 'bold' }}>X</button>
                    )}
                  </div>
                ))}
              </>
            )}

            {mgrTab === 'Schedule' && (
              <>
                <div style={{ marginBottom: '20px', background: '#111', padding: '15px', borderRadius: '12px', border: '1px solid #333' }}>
                  <label style={{ color: '#aaa', fontSize: '0.85em', fontWeight: 'bold', textTransform: 'uppercase' }}>Select Crew Member:
                    <select value={activeEmpId} onChange={e => setActiveEmpId(Number(e.target.value))} style={{ ...inputStyle, borderColor: '#a855f7', color: '#a855f7', fontWeight: 'bold', fontSize: '1.2em', marginTop: '10px' }}>
                      {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                  </label>
                </div>

                {daysOfWeek.map(day => {
                  let dHrs = 0;
                  activeEmp.shifts[day].forEach(s => dHrs += calcShiftHours(s.start, s.end, s.break));
                  return (
                    <div key={day} style={{ ...cardStyle, padding: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, color: '#fff' }}>{day} <span style={{ color: '#888', fontWeight: 'normal' }}>({dHrs.toFixed(2)} hrs)</span></h4>
                        <button onClick={() => addMgrShift(day)} style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', border: '1px solid #a855f7', borderRadius: '6px', padding: '6px 12px', fontWeight: 'bold' }}>+ Add Shift</button>
                      </div>
                      {activeEmp.shifts[day].map((shift, idx) => (
                        <div key={idx} style={{ marginTop: '10px', background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #222' }}>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                            <input type="time" value={shift.start} onChange={e => updateMgrShift(day, idx, 'start', e.target.value)} style={{ flex: 1, padding: '8px', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '6px' }} />
                            <span style={{ color: '#666' }}>to</span>
                            <input type="time" value={shift.end} onChange={e => updateMgrShift(day, idx, 'end', e.target.value)} style={{ flex: 1, padding: '8px', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '6px' }} />
                            <button onClick={() => deleteMgrShift(day, idx)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.5em', padding: '0 5px' }}>×</button>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: '#888', fontSize: '0.85em', textTransform: 'uppercase' }}>Unpaid Break:</span>
                            <input type="number" placeholder="0" value={shift.break} onChange={e => updateMgrShift(day, idx, 'break', e.target.value)} style={{ width: '80px', padding: '6px', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '6px', textAlign: 'center' }} />
                            <span style={{ color: '#888', fontSize: '0.85em' }}>mins</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
                <HumanityCheck />
              </>
            )}

            {mgrTab === 'Report' && (
              <>
                {/* BUDGET TRACKER */}
                <div style={{ ...cardStyle, borderTop: isOverBudget ? '4px solid #ef4444' : '4px solid #00cc66' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, color: '#fff' }}>Labor Budget Tracking</h4>
                    <span style={{ color: isOverBudget ? '#ef4444' : '#00cc66', fontWeight: 'bold' }}>
                      {totalFleetHours.toFixed(1)} / {budgetNum.toFixed(1)} hrs
                    </span>
                  </div>
                  <div style={{ height: '12px', background: '#222', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${budgetPct}%`, background: isOverBudget ? '#ef4444' : '#00cc66', transition: 'width 0.3s' }}></div>
                  </div>
                  <div style={{ textAlign: 'right', marginTop: '8px', fontSize: '0.85em', color: isOverBudget ? '#ef4444' : '#aaa' }}>
                    {isOverBudget ? `Over Budget by ${(totalFleetHours - budgetNum).toFixed(1)} hrs` : `${(budgetNum - totalFleetHours).toFixed(1)} hrs remaining`}
                  </div>
                </div>

                <button 
                  onClick={handleCopyReport}
                  style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #a855f7', background: copied ? '#00cc66' : 'rgba(168, 85, 247, 0.1)', color: copied ? '#000' : '#a855f7', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '20px', transition: 'all 0.2s' }}>
                  {copied ? '✅ Schedule Copied!' : '📋 Export Master Schedule'}
                </button>

                <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '20px', fontFamily: 'monospace', fontSize: '1.05em' }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#00ffff', textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>MASTER SCHEDULE</h3>
                  {employees.map(e => {
                    const hrs = getEmpTotalHours(e);
                    return (
                      <div key={e.id} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed #222' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>
                          <span style={{ color: '#a855f7' }}>{e.name}</span>
                          <span>{hrs.toFixed(2)} hrs</span>
                        </div>
                        {daysOfWeek.map(d => {
                          if (e.shifts[d].length > 0) {
                            return (
                              <div key={d} style={{ display: 'flex', color: '#aaa', fontSize: '0.9em', marginLeft: '10px' }}>
                                <span style={{ width: '40px', color: '#666' }}>{d}:</span>
                                <span>{e.shifts[d].map(s => {
                                  const brk = s.break ? ` (-${s.break}m brk)` : '';
                                  return `${s.start || '??:??'} - ${s.end || '??:??'}${brk}`;
                                }).join(', ')}</span>
                              </div>
                            )
                          }
                          return null;
                        })}
                      </div>
                    )
                  })}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: isOverBudget ? '#ef4444' : '#00cc66', fontWeight: 'bold', fontSize: '1.2em', marginTop: '10px' }}>
                    <span>Total Fleet Hours:</span>
                    <span>{totalFleetHours.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}

            {mgrTab === 'Guide' && <GuideTab />}
          </>
        )}

      </div>
    </div>
  );
}
