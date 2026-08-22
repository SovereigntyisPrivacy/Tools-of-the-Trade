import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TimesheetCalc() {
  const navigate = useNavigate();
  
  // --- TOP-LEVEL NAVIGATION ---
  const [activeTab, setActiveTab] = useState('Manager'); 

  // --- SUB-NAVIGATION ---
  const [empTab, setEmpTab] = useState('Timecard');
  const [mgrTab, setMgrTab] = useState('Report');
  const [seTab, setSeTab] = useState('Jobs');

  // --- EMPLOYEE STATE ---
  const [soloRate, setSoloRate] = useState('20.00');
  const [soloTax, setSoloTax] = useState('15');
  const [soloBonus, setSoloBonus] = useState(''); 
  const [soloShifts, setSoloShifts] = useState({ Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] });

  // --- MANAGER STATE ---
  const [mgrBudget, setMgrBudget] = useState('160'); 
  const [mgrAvgRate, setMgrAvgRate] = useState('16.50'); 
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Employee 1', shifts: { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] } }
  ]);
  const [activeEmpId, setActiveEmpId] = useState(1);

  // --- SELF-EMPLOYED STATE ---
  const [gigs, setGigs] = useState([
    { id: 1, name: 'Project Alpha', payout: '500', expenses: '50', hours: '12', taxPct: '15' }
  ]);

  const [copied, setCopied] = useState(false);
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const parse = (val) => parseFloat(val) || 0;

  // --- CORE TIME LOGIC ---
  const calcShiftHours = (start, end, breakMins = 0) => {
    if (!start || !end) return 0;
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    let sTime = sH + sM / 60;
    let eTime = eH + eM / 60;
    if (eTime < sTime) eTime += 24; 
    const totalWithBreak = (eTime - sTime) - (parse(breakMins) / 60);
    return Math.max(0, totalWithBreak); 
  };

  // --- EMPLOYEE FUNCTIONS ---
  const addSoloShift = (day) => setSoloShifts({ ...soloShifts, [day]: [...soloShifts[day], { start: '', end: '', break: '' }] });
  const updateSoloShift = (day, idx, field, val) => {
    const newShifts = [...soloShifts[day]];
    newShifts[idx][field] = val;
    setSoloShifts({ ...soloShifts, [day]: newShifts });
  };
  const deleteSoloShift = (day, idx) => setSoloShifts({ ...soloShifts, [day]: soloShifts[day].filter((_, i) => i !== idx) });

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
  const updateEmpName = (id, val) => setEmployees(employees.map(e => e.id === id ? { ...e, name: val } : e));
  const deleteEmp = (id) => {
    if (employees.length === 1) return;
    const filtered = employees.filter(e => e.id !== id);
    setEmployees(filtered);
    if (activeEmpId === id) setActiveEmpId(filtered[0].id);
  };
  const addMgrShift = (day) => setEmployees(employees.map(e => e.id === activeEmpId ? { ...e, shifts: { ...e.shifts, [day]: [...e.shifts[day], { start: '', end: '', break: '' }] } } : e));
  const updateMgrShift = (day, idx, field, val) => setEmployees(employees.map(e => e.id === activeEmpId ? { ...e, shifts: { ...e.shifts, [day]: e.shifts[day].map((s, i) => i === idx ? { ...s, [field]: val } : s) } } : e));
  const deleteMgrShift = (day, idx) => setEmployees(employees.map(e => e.id === activeEmpId ? { ...e, shifts: { ...e.shifts, [day]: e.shifts[day].filter((_, i) => i !== idx) } } : e));
  
  const getEmpStats = (emp) => {
    let tHrs = 0;
    let missingBreaks = 0;
    daysOfWeek.forEach(d => {
      emp.shifts[d].forEach(s => {
        const hrs = calcShiftHours(s.start, s.end, s.break);
        tHrs += hrs;
        // Flag shifts over 6 hours with less than 30 min break
        if (hrs > 6 && parse(s.break) < 30) missingBreaks++;
      });
    });
    const reg = Math.min(40, tHrs);
    const ot = Math.max(0, tHrs - 40);
    const rate = parse(mgrAvgRate);
    const regCost = reg * rate;
    const otCost = ot * rate * 1.5;
    const totalCost = regCost + otCost;
    return { tHrs, reg, ot, regCost, otCost, totalCost, missingBreaks };
  };

  // --- SELF-EMPLOYED FUNCTIONS ---
  const addGig = () => setGigs([...gigs, { id: Date.now(), name: `New Gig`, payout: '0', expenses: '0', hours: '0', taxPct: '15' }]);
  const updateGig = (id, field, val) => setGigs(gigs.map(g => g.id === id ? { ...g, [field]: val } : g));
  const deleteGig = (id) => { if (gigs.length > 1) setGigs(gigs.filter(g => g.id !== id)); };

  const getGigStats = (gig) => {
    const gross = parse(gig.payout);
    const exp = parse(gig.expenses);
    const hrs = Math.max(0.1, parse(gig.hours)); 
    const profit = gross - exp;
    const tax = profit * (parse(gig.taxPct) / 100);
    const net = profit - tax;
    const trueHourly = profit / hrs;
    return { gross, exp, profit, tax, net, trueHourly };
  };

  // --- EXPORTERS ---
  const generateMgrReport = () => {
    let report = `WEEKLY MASTER SCHEDULE\n=======================\n\n`;
    let fleetHours = 0;
    let fleetGross = 0;

    employees.forEach(e => {
      const stats = getEmpStats(e);
      fleetHours += stats.tHrs;
      fleetGross += stats.totalCost;

      report += `[ ${e.name.toUpperCase()} ]\n`;
      report += `Total Hours: ${stats.tHrs.toFixed(2)} (Reg: ${stats.reg.toFixed(2)} | OT: ${stats.ot.toFixed(2)})\n`;
      report += `Est. Cost: $${stats.totalCost.toFixed(2)}\n`;
      if (stats.missingBreaks > 0) report += `⚠️ WARNING: ${stats.missingBreaks} shift(s) missing mandatory 30m break.\n`;
      
      daysOfWeek.forEach(d => {
        if (e.shifts[d].length > 0) {
          report += `  ${d}: ${e.shifts[d].map(s => `${s.start || '??:??'} to ${s.end || '??:??'}${s.break ? ` (-${s.break}m)` : ''}`).join(' | ')}\n`;
        }
      });
      report += `\n`;
    });
    report += `=======================\nTOTAL FLEET HOURS: ${fleetHours.toFixed(2)} hrs\n`;
    report += `EST SCHEDULED PAYROLL: $${fleetGross.toFixed(2)}\n`;
    return report;
  };

  const generateGigReport = () => {
    let report = `FREELANCE & GIG INVOICE SUMMARY\n=======================\n\n`;
    let tGross = 0, tExp = 0, tNet = 0, tHrs = 0;
    gigs.forEach(g => {
      const stats = getGigStats(g);
      tGross += stats.gross; tExp += stats.exp; tNet += stats.net; tHrs += parse(g.hours);
      report += `[ ${g.name.toUpperCase()} ]\n`;
      report += `Gross Payout: $${stats.gross.toFixed(2)} | Expenses: -$${stats.exp.toFixed(2)}\n`;
      report += `Labor: ${parse(g.hours).toFixed(1)} hrs | True Hourly ROI: $${stats.trueHourly.toFixed(2)}/hr\n`;
      report += `Est. Net Take-Home: $${stats.net.toFixed(2)}\n\n`;
    });
    report += `=======================\n`;
    report += `TOTAL GROSS: $${tGross.toFixed(2)}\n`;
    report += `TOTAL EXPENSES: -$${tExp.toFixed(2)}\n`;
    report += `TOTAL LABOR: ${tHrs.toFixed(1)} hrs\n`;
    report += `TOTAL NET DISBURSED: $${tNet.toFixed(2)}\n`;
    return report;
  };

  const handleCopyReport = (type) => {
    navigator.clipboard.writeText(type === 'mgr' ? generateMgrReport() : generateGigReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // --- UI COMPONENTS ---
  const EmployeeHumanityCheck = () => (
    <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(59, 130, 246, 0.05)', border: '1px dashed #3b82f6', borderRadius: '12px', textAlign: 'center' }}>
      <span style={{ fontSize: '1.5em', display: 'block', marginBottom: '8px' }}>💧 🧘‍♂️</span>
      <strong style={{ color: '#3b82f6', display: 'block', marginBottom: '4px' }}>Humanity Check</strong>
      <span style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.4', display: 'block' }}>
        Drink a glass of water, fix your posture, and take a deep breath. No shift or gig is worth burning yourself out.
      </span>
    </div>
  );

  const ManagerHumanityCheck = () => (
    <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(168, 85, 247, 0.05)', border: '1px dashed #a855f7', borderRadius: '12px', textAlign: 'center' }}>
      <span style={{ fontSize: '1.5em', display: 'block', marginBottom: '8px' }}>👑 📋</span>
      <strong style={{ color: '#a855f7', display: 'block', marginBottom: '4px' }}>Leadership Check</strong>
      <span style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.4', display: 'block' }}>
        Your crew feeds off your energy. If you are stressed and burnt out, they will be too. Step off the floor for 5 minutes, hydrate, and breathe. You manage the schedule, but you lead the people.
      </span>
    </div>
  );

  // --- STYLES ---
  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.05em', marginTop: '4px' };
  const labelStyle = { color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate('/calculator')}>Hub</button>
        <h2>Timesheet Engine</h2>
      </header>

      {/* TOP-LEVEL TABS */}
      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Employee', 'Manager', 'Self-Employed', 'HR'].map(tab => {
          let color = '#fff';
          if (tab === 'Employee') color = '#3b82f6';
          if (tab === 'Manager') color = '#a855f7';
          if (tab === 'Self-Employed') color = '#f59e0b';
          if (tab === 'HR') color = '#00cc66';

          return (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ padding: '8px 14px', borderRadius: '8px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: activeTab === tab ? color : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>
              {tab}
            </button>
          )
        })}
      </div>

      {/* Removed massive paddingBottom to allow ad overlay */}
      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1 }}>
        
        {/* ========================================== */}
        {/* TAB 1: EMPLOYEE (SOLO PAY)                 */}
        {/* ========================================== */}
        {activeTab === 'Employee' && (
          <>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {['Timecard', 'Pay Stub'].map(tab => (
                <button key={tab} onClick={() => setEmpTab(tab)} style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: empTab === tab ? 'rgba(59, 130, 246, 0.2)' : '#111', color: empTab === tab ? '#3b82f6' : '#888', border: empTab === tab ? '1px solid #3b82f6' : '1px solid #333' }}>{tab}</button>
              ))}
            </div>

            {empTab === 'Timecard' && (
              <>
                <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>Wage Profile</h4>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 90px' }}><label style={{...labelStyle, color: '#3b82f6'}}>Rate ($)<input type="number" value={soloRate} onChange={e=>setSoloRate(e.target.value)} style={inputStyle} /></label></div>
                    <div style={{ flex: '1 1 90px' }}><label style={{...labelStyle, color: '#3b82f6'}}>Tax (%)<input type="number" value={soloTax} onChange={e=>setSoloTax(e.target.value)} style={inputStyle} /></label></div>
                    <div style={{ flex: '1 1 120px' }}><label style={{...labelStyle, color: '#3b82f6'}}>Tips/Bonus ($)<input type="number" value={soloBonus} onChange={e=>setSoloBonus(e.target.value)} placeholder="0.00" style={inputStyle} /></label></div>
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
                <EmployeeHumanityCheck />
              </>
            )}

            {empTab === 'Pay Stub' && (() => {
              const p = getSoloPayroll();
              return (
                <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '20px', fontFamily: 'monospace', fontSize: '1.1em' }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#3b82f6', textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>WEEKLY PAY STUB</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Regular Hours:</span> <span style={{color:'#fff'}}>{p.regHours.toFixed(2)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Overtime (1.5x):</span> <span style={{color:'#ffaa00'}}>{p.otHours.toFixed(2)}</span></div>
                  {p.bonus > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Tips / Bonus:</span> <span style={{color:'#3b82f6'}}>+${p.bonus.toFixed(2)}</span></div>}
                  <div style={{ borderBottom: '1px dashed #444', margin: '10px 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Gross Pay:</span> <span>${p.gross.toFixed(2)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', marginBottom: '15px' }}><span>Est Taxes:</span> <span>-${p.tax.toFixed(2)}</span></div>
                  <div style={{ borderBottom: '1px solid #444', margin: '10px 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00cc66', fontWeight: 'bold', fontSize: '1.3em' }}><span>NET PAY:</span> <span>${p.net.toFixed(2)}</span></div>
                </div>
              );
            })()}
          </>
        )}

        {/* ========================================== */}
        {/* TAB 2: MANAGER (CREW SCHEDULING)           */}
        {/* ========================================== */}
        {activeTab === 'Manager' && (
          <>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {['Roster', 'Schedule', 'Report'].map(tab => (
                <button key={tab} onClick={() => setMgrTab(tab)} style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: mgrTab === tab ? 'rgba(168, 85, 247, 0.2)' : '#111', color: mgrTab === tab ? '#a855f7' : '#888', border: mgrTab === tab ? '1px solid #a855f7' : '1px solid #333' }}>{tab}</button>
              ))}
            </div>

            {mgrTab === 'Roster' && (
              <>
                <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#a855f7' }}>Labor Control</h4>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#a855f7'}}>Target Budget (Hrs)<input type="number" value={mgrBudget} onChange={e=>setMgrBudget(e.target.value)} style={inputStyle} /></label></div>
                    <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#a855f7'}}>Fleet Avg Rate ($/hr)<input type="number" step="0.5" value={mgrAvgRate} onChange={e=>setMgrAvgRate(e.target.value)} style={inputStyle} /></label></div>
                  </div>
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
                    {employees.length > 1 && <button onClick={() => deleteEmp(emp.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', padding: '10px 15px', fontWeight: 'bold' }}>X</button>}
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
                  <div style={{ marginTop: '15px', borderTop: '1px dashed #333', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
                    <span>Current Scheduled Hours:</span>
                    <strong style={{ color: getEmpStats(activeEmp).tHrs > 40 ? '#ef4444' : '#00cc66' }}>{getEmpStats(activeEmp).tHrs.toFixed(2)} hrs</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.9em', marginTop: '5px' }}>
                    <span>Est. Schedule Cost:</span>
                    <span>${getEmpStats(activeEmp).totalCost.toFixed(2)}</span>
                  </div>
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
                <ManagerHumanityCheck />
              </>
            )}

            {mgrTab === 'Report' && (() => {
              let totalFleetHours = 0;
              let fleetGross = 0;
              let fleetOTCost = 0;

              const mappedEmps = employees.map(e => {
                const stats = getEmpStats(e);
                totalFleetHours += stats.tHrs;
                fleetGross += stats.totalCost;
                fleetOTCost += (stats.otCost - (stats.ot * parse(mgrAvgRate))); // Just the premium portion
                return { ...e, ...stats };
              });

              const bgt = parse(mgrBudget);
              const isOverBudget = totalFleetHours > bgt;

              return (
                <>
                  <div style={{ ...cardStyle, borderTop: isOverBudget ? '4px solid #ef4444' : '4px solid #00cc66' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <h4 style={{ margin: 0, color: '#fff' }}>Labor Budget Tracking</h4>
                      <span style={{ color: isOverBudget ? '#ef4444' : '#00cc66', fontWeight: 'bold' }}>
                        {totalFleetHours.toFixed(1)} / {bgt.toFixed(1)} hrs
                      </span>
                    </div>
                    <div style={{ height: '12px', background: '#222', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${bgt > 0 ? Math.min(100, (totalFleetHours / bgt) * 100) : 0}%`, background: isOverBudget ? '#ef4444' : '#00cc66', transition: 'width 0.3s' }}></div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleCopyReport('mgr')}
                    style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #a855f7', background: copied ? '#00cc66' : 'rgba(168, 85, 247, 0.1)', color: copied ? '#000' : '#a855f7', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '20px' }}>
                    {copied ? '✅ Schedule Copied!' : '📋 Export Master Schedule'}
                  </button>

                  <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '20px', fontFamily: 'monospace', fontSize: '1.05em' }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#a855f7', textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>ANALYTICS & SCHEDULE</h3>
                    
                    {mappedEmps.map(e => (
                      <div key={e.id} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px dashed #222' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}>
                          <span style={{ color: '#a855f7' }}>{e.name}</span>
                          <span style={{ color: e.ot > 0 ? '#ef4444' : '#fff' }}>{e.tHrs.toFixed(2)} hrs</span>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.85em', marginBottom: '4px' }}>
                          <span>Cost: ${e.totalCost.toFixed(2)}</span>
                          <span>Reg: {e.reg.toFixed(2)} | OT: {e.ot.toFixed(2)}</span>
                        </div>

                        {e.missingBreaks > 0 && (
                          <div style={{ color: '#ef4444', fontSize: '0.85em', fontWeight: 'bold', marginTop: '4px', padding: '4px', background: 'rgba(239,68,68,0.1)', borderRadius: '4px' }}>
                            ⚠️ {e.missingBreaks} shift(s) missing mandatory 30m break.
                          </div>
                        )}

                        <div style={{ marginTop: '8px' }}>
                          {daysOfWeek.map(d => {
                            if (e.shifts[d].length > 0) {
                              return (
                                <div key={d} style={{ display: 'flex', color: '#aaa', fontSize: '0.9em', marginLeft: '10px' }}>
                                  <span style={{ width: '40px', color: '#666' }}>{d}:</span>
                                  <span>{e.shifts[d].map(s => `${s.start || '??:??'} - ${s.end || '??:??'}`).join(', ')}</span>
                                </div>
                              )
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    ))}
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: isOverBudget ? '#ef4444' : '#00cc66', fontWeight: 'bold', fontSize: '1.2em', marginTop: '15px' }}>
                      <span>Total Fleet Hours:</span>
                      <span>{totalFleetHours.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '1.1em', marginTop: '8px' }}>
                      <span>Est. Base Payroll:</span>
                      <span>${(fleetGross - fleetOTCost).toFixed(2)}</span>
                    </div>
                    {fleetOTCost > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', fontSize: '1.0em', marginTop: '4px' }}>
                        <span>Est. OT Premium Cost:</span>
                        <span>+${fleetOTCost.toFixed(2)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b', fontSize: '1.2em', fontWeight: 'bold', marginTop: '8px', borderTop: '1px solid #333', paddingTop: '8px' }}>
                      <span>Total Est. Liability:</span>
                      <span>${fleetGross.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </>
        )}

        {/* ========================================== */}
        {/* TAB 3: SELF-EMPLOYED (GIG INVOICE)         */}
        {/* ========================================== */}
        {activeTab === 'Self-Employed' && (
          <>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {['Jobs', 'Invoice'].map(tab => (
                <button key={tab} onClick={() => setSeTab(tab)} style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: seTab === tab ? 'rgba(245, 158, 11, 0.2)' : '#111', color: seTab === tab ? '#f59e0b' : '#888', border: seTab === tab ? '1px solid #f59e0b' : '1px solid #333' }}>{tab}</button>
              ))}
            </div>

            {seTab === 'Jobs' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: '#fff', margin: 0 }}>Active Projects</h3>
                  <button onClick={addGig} style={{ padding: '8px 16px', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>+ Add Job</button>
                </div>

                {gigs.map((g) => (
                  <div key={g.id} style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <input 
                        type="text" value={g.name} onChange={e => updateGig(g.id, 'name', e.target.value)} 
                        style={{ ...inputStyle, width: '60%', margin: 0, border: 'none', borderBottom: '1px solid #333', background: 'transparent', fontSize: '1.2em', fontWeight: 'bold', padding: '5px' }} 
                      />
                      {gigs.length > 1 && <button onClick={() => deleteGig(g.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', padding: '6px 12px', fontWeight: 'bold' }}>X</button>}
                    </div>

                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      <div style={{ flex: '1 1 120px' }}><label style={{...labelStyle, color: '#f59e0b'}}>Flat Payout ($)<input type="number" value={g.payout} onChange={e => updateGig(g.id, 'payout', e.target.value)} style={inputStyle} /></label></div>
                      <div style={{ flex: '1 1 120px' }}><label style={{...labelStyle, color: '#f59e0b'}}>Expenses ($)<input type="number" value={g.expenses} onChange={e => updateGig(g.id, 'expenses', e.target.value)} style={inputStyle} /></label></div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1 1 120px' }}><label style={{...labelStyle, color: '#f59e0b'}}>Est. Labor (hrs)<input type="number" value={g.hours} onChange={e => updateGig(g.id, 'hours', e.target.value)} style={inputStyle} /></label></div>
                      <div style={{ flex: '1 1 120px' }}><label style={{...labelStyle, color: '#f59e0b'}}>Tax Est (%)<input type="number" value={g.taxPct} onChange={e => updateGig(g.id, 'taxPct', e.target.value)} style={inputStyle} /></label></div>
                    </div>

                    <div style={{ marginTop: '15px', background: '#000', padding: '12px', borderRadius: '8px', border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#aaa', fontSize: '0.9em', textTransform: 'uppercase', fontWeight: 'bold' }}>True Hourly ROI:</span>
                      <strong style={{ color: getGigStats(g).trueHourly < 15 ? '#ef4444' : '#00cc66', fontSize: '1.3em' }}>
                        ${getGigStats(g).trueHourly.toFixed(2)}/hr
                      </strong>
                    </div>
                  </div>
                ))}
                <EmployeeHumanityCheck />
              </>
            )}

            {seTab === 'Invoice' && (
              <>
                <button 
                  onClick={() => handleCopyReport('gig')}
                  style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #f59e0b', background: copied ? '#00cc66' : 'rgba(245, 158, 11, 0.1)', color: copied ? '#000' : '#f59e0b', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '20px', transition: 'all 0.2s' }}>
                  {copied ? '✅ Invoice Copied!' : '📋 Export Gig Summary'}
                </button>

                <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '20px', fontFamily: 'monospace', fontSize: '1.1em' }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#f59e0b', textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>INVOICE LEDGER</h3>
                  {(() => {
                    let tGross = 0, tExp = 0, tNet = 0, tHrs = 0;
                    gigs.forEach(g => {
                      const st = getGigStats(g);
                      tGross += st.gross; tExp += st.exp; tNet += st.net; tHrs += parse(g.hours);
                    });
                    return (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Total Gross Payout:</span> <span style={{color:'#fff'}}>${tGross.toFixed(2)}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', marginBottom: '15px' }}><span>Material / Gas Expenses:</span> <span>-${tExp.toFixed(2)}</span></div>
                        <div style={{ borderBottom: '1px dashed #444', margin: '10px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Estimated Tax Liability:</span> <span style={{color:'#ffaa00'}}>-${(tGross - tExp - tNet).toFixed(2)}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px' }}><span>Total Time Billed:</span> <span style={{color:'#00ffff'}}>{tHrs.toFixed(1)} hrs</span></div>
                        <div style={{ borderBottom: '1px solid #444', margin: '10px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00cc66', fontWeight: 'bold', fontSize: '1.3em', marginBottom: '8px' }}><span>NET DISBURSED:</span> <span>${tNet.toFixed(2)}</span></div>
                        <div style={{ textAlign: 'center', marginTop: '15px', color: '#888' }}>Average True ROI: <strong style={{ color: '#fff' }}>${tHrs > 0 ? (tNet / tHrs).toFixed(2) : '0.00'}/hr</strong></div>
                      </>
                    )
                  })()}
                </div>
              </>
            )}
          </>
        )}

        {/* ========================================== */}
        {/* TAB 4: HR & LEGAL COMPLIANCE               */}
        {/* ========================================== */}
        {activeTab === 'HR' && (
          <div style={{ padding: '5px' }}>
            <h3 style={{ color: '#00cc66', marginBottom: '20px', textAlign: 'center' }}>Labor Law & Compliance</h3>
            
            <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>⚠️ Official Disclaimer</h3>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5', margin: 0 }}>
                This module is an educational estimation tool. It does not replace certified HR payroll software or a licensed CPA. Always verify local state labor laws with your legal counsel.
              </p>
            </div>

            <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>Federal Overtime & The "Daily" Trap</h3>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5', margin: 0 }}>
                Federal FLSA law requires 1.5x overtime pay for anything over 40 hours in a week. However, states like California, Nevada, and Colorado enforce <strong>Daily Overtime</strong>. In these states, working more than 8 or 12 hours in a single day automatically triggers 1.5x or 2.0x overtime pay, regardless of weekly hours.
              </p>
            </div>

            <div style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#a855f7' }}>Unpaid Meal Breaks</h3>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5', margin: 0 }}>
                Federal law considers short breaks (5-20 mins) as paid work time. Genuine "meal periods" (30+ mins) are strictly unpaid, but <strong>only</strong> if the employee is completely relieved of all duties. If an employee must watch a register or stay at a desk while eating, they must be paid for that time.
              </p>
            </div>

            <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>W-2 vs 1099 Workers</h3>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5', margin: 0 }}>
                <strong>W-2 (Employees):</strong> The employer dictates schedules, provides tools, and withholds taxes. Minimum wage and FLSA overtime laws apply.<br/><br/>
                <strong>1099 (Contractors):</strong> Contractors dictate how and when work gets done. They pay their own Self-Employment taxes, and FLSA overtime laws generally do not apply. Misclassifying an employee as a contractor is a severe IRS audit flag.
              </p>
            </div>

            <div style={{ ...cardStyle, borderLeft: '4px solid #00ffff' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#00ffff' }}>HR Document Retention Rules</h3>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5', margin: 0 }}>
                <strong>Payroll Records:</strong> The FLSA requires keeping payroll records (hours, wages, deductions) for at least 3 years. The IRS requires 4 years for employment tax records.<br/><br/>
                <strong>Form I-9:</strong> Must be retained for 3 years after the date of hire, or 1 year after termination, whichever is later.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
