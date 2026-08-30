import React, { useState, useEffect, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../core/CalendarContext';

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return (<div style={{ padding: '20px', color: '#ff4444' }}><h2>⚠️ Crash</h2><button onClick={() => { localStorage.removeItem('fleet_schedules'); window.location.reload(); }}>Hard Reset</button></div>);
    return this.props.children;
  }
}

function TimesheetUI() {
  const navigate = useNavigate();
  const { globalDate, addReminder } = useCalendar();
  const [mainTab, setMainTab] = useState('Manager');
  const [mgrTab, setMgrTab] = useState('Schedule');
  const [expanded, setExpanded] = useState({});

  const calcShiftHrs = (inTime, outTime) => {
    if (!inTime || !outTime) return 0;
    const [h1, m1] = inTime.split(':').map(Number);
    const [h2, m2] = outTime.split(':').map(Number);
    let mins1 = h1 * 60 + m1; let mins2 = h2 * 60 + m2;
    if (mins2 < mins1) mins2 += 24 * 60;
    return (mins2 - mins1) / 60;
  };

  const getEmptyShifts = () => ({ Mon: {in:'', out:''}, Tue: {in:'', out:''}, Wed: {in:'', out:''}, Thu: {in:'', out:''}, Fri: {in:'', out:''}, Sat: {in:'', out:''}, Sun: {in:'', out:''} });

  const [myRate, setMyRate] = useState(() => localStorage.getItem('my_hourly_rate') || '15.00');
  const [myShifts, setMyShifts] = useState(() => {
    const saved = localStorage.getItem('my_personal_shifts');
    return saved ? JSON.parse(saved) : getEmptyShifts();
  });
  
  useEffect(() => { localStorage.setItem('my_hourly_rate', myRate); }, [myRate]);
  useEffect(() => { localStorage.setItem('my_personal_shifts', JSON.stringify(myShifts)); }, [myShifts]);

  const [weeks, setWeeks] = useState(() => {
    const saved = localStorage.getItem('fleet_schedules');
    if (saved) return JSON.parse(saved);
    return [{ id: `week_${Date.now()}`, weekDate: new Date().toISOString().split('T')[0], budgetHrs: '160', roster: [{ id: 'emp_1', empNum: '1001', name: 'Employee 1', type: 'W2', rate: '16.50' }], shifts: { 'emp_1': getEmptyShifts() } }];
  });

  const [activeWeekId, setActiveWeekId] = useState(weeks[0].id);
  const activeWeek = weeks.find(w => w.id === activeWeekId) || weeks[0];

  useEffect(() => { localStorage.setItem('fleet_schedules', JSON.stringify(weeks)); }, [weeks]);

  const updateActiveWeek = (updates) => setWeeks(weeks.map(w => w.id === activeWeekId ? { ...w, ...updates } : w));

  const createNewWeek = () => {
    const newId = `week_${Date.now()}`;
    const newShifts = {};
    activeWeek.roster.forEach(emp => { newShifts[emp.id] = getEmptyShifts(); });
    let nextDate = new Date();
    if (activeWeek.weekDate) {
      const [y, m, d] = activeWeek.weekDate.split('-');
      nextDate = new Date(y, m - 1, d);
      nextDate.setDate(nextDate.getDate() + 7);
    }
    const nextDateStr = nextDate.toISOString().split('T')[0];
    setWeeks([...weeks, { id: newId, weekDate: nextDateStr, budgetHrs: activeWeek.budgetHrs, roster: [...activeWeek.roster], shifts: newShifts }]);
    setActiveWeekId(newId);
    addReminder(nextDateStr, 'Timesheet: Generated New Schedule', 'Timesheet', 'Normal');
  };

  const deleteActiveWeek = () => {
    if (weeks.length === 1) return alert("Cannot delete the only week.");
    const filtered = weeks.filter(w => w.id !== activeWeekId);
    setWeeks(filtered); setActiveWeekId(filtered[0].id);
  };

  const getAttendance = (empId) => {
    let lates = 0, absences = 0;
    weeks.forEach(w => { Object.values(w.shifts[empId] || {}).forEach(s => { if (s.flag === 'late') lates++; if (s.flag === 'absent') absences++; }); });
    return { lates, absences };
  };

  // --- NATIVE OS SHARE ENGINE ---
  const dispatchSchedule = async (emp, shifts, weekDate) => {
    let text = `📅 SCHEDULE: ${emp.name}\nWeek of: ${weekDate}\n\n`;
    let total = 0;
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(day => {
      const s = shifts[day];
      if (s && s.in && s.out) {
        text += `${day}: ${s.in} to ${s.out}\n`;
        total += calcShiftHrs(s.in, s.out);
      } else {
        text += `${day}: OFF\n`;
      }
    });
    text += `\nTotal Hours: ${total.toFixed(1)} hrs`;
    text += `\n\nStay safe.`;

    try {
      if (navigator.share) {
        await navigator.share({ title: `Schedule - ${emp.name}`, text });
      } else {
        alert("Sharing not supported on this device.");
      }
    } catch (e) {
      // User cancelled share sheet
    }
  };

  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff' };
  const labelStyle = { color: '#a855f7', fontSize: '0.75em', fontWeight: 'bold', textTransform: 'uppercase' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Timesheet Engine</h2>
      </header>

      <div style={{ display: 'flex', background: '#111', padding: '10px', gap: '6px' }}>
        {['Employee', 'Manager', 'Self-Employed'].map(tab => (
          <button key={tab} onClick={() => setMainTab(tab)} style={{ flex: 1, padding: '8px 5px', borderRadius: '8px', fontWeight: 'bold', border: 'none', fontSize: '0.85em', background: mainTab === tab ? '#a855f7' : '#222', color: mainTab === tab ? '#fff' : '#aaa' }}>{tab}</button>
        ))}
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '95px' }}>
        
        {mainTab === 'Employee' && (
          <div style={cardStyle}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 5px 0', color: '#00ffff', textTransform: 'uppercase' }}>Crew Board</h3>
              <span style={{ color: '#888', fontSize: '0.85em' }}>Week of {activeWeek.weekDate} - Read-Only</span>
            </div>
            {activeWeek.roster.filter(emp => {
              const shifts = activeWeek.shifts[emp.id] || getEmptyShifts();
              return Object.values(shifts).some(s => s && s.in && s.out);
            }).length === 0 ? (
              <div style={{ textAlign: 'center', color: '#555', padding: '20px' }}>No shifts scheduled for this week.</div>
            ) : (
              activeWeek.roster.map(emp => {
                const shifts = activeWeek.shifts[emp.id] || getEmptyShifts();
                let totalHrs = 0;
                Object.values(shifts).forEach(s => totalHrs += calcShiftHrs(s?.in, s?.out));
                if (totalHrs === 0) return null;
                return (
                  <div key={emp.id} style={{ background: '#000', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #00ffff', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #222' }}>
                      <h4 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>{emp.name} <span style={{ color: '#555', fontSize: '0.7em' }}>{emp.empNum}</span></h4>
                      <strong style={{ color: '#00ffff', fontSize: '1.2em' }}>{totalHrs.toFixed(1)} hrs</strong>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                        const s = shifts[day];
                        const isWorking = s && s.in && s.out;
                        return (
                          <div key={day} style={{ background: isWorking ? '#111' : 'transparent', padding: '8px 2px', borderRadius: '6px', border: isWorking ? '1px solid #333' : 'none' }}>
                            <div style={{ fontSize: '0.65em', color: '#888', textTransform: 'uppercase', marginBottom: '4px' }}>{day}</div>
                            {isWorking ? (
                              <div style={{ fontSize: '0.75em', color: '#00cc66', fontWeight: 'bold', lineHeight: '1.4' }}>{s.in}<br/><span style={{ color: '#555' }}>to</span><br/>{s.out}</div>
                            ) : (
                              <div style={{ fontSize: '0.8em', color: '#333' }}>-</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {mainTab === 'Manager' && (
          <>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center', background: '#111', padding: '10px', borderRadius: '8px', border: '1px solid #a855f7' }}>
              <div style={{ flex: 1 }}>
                <label style={{ ...labelStyle, color: '#aaa', display: 'block', marginBottom: '4px' }}>Week Of:</label>
                <input type="date" value={activeWeek.weekDate} onChange={e => updateActiveWeek({ weekDate: e.target.value })} style={{ width: '100%', padding: '8px', background: '#000', color: '#00ffff', border: '1px solid #333', borderRadius: '6px', fontWeight: 'bold' }} />
              </div>
              <select value={activeWeekId} onChange={e => setActiveWeekId(e.target.value)} style={{ padding: '8px', background: '#222', color: '#fff', border: '1px solid #333', borderRadius: '6px', maxWidth: '100px', alignSelf: 'flex-end', height: '40px' }}>
                {weeks.map((w, i) => <option key={w.id} value={w.id}>Wk {i+1}</option>)}
              </select>
              <button onClick={createNewWeek} style={{ background: '#00cc66', color: '#000', border: 'none', padding: '0 12px', borderRadius: '6px', fontWeight: 'bold', alignSelf: 'flex-end', height: '40px' }}>+ Wk</button>
            </div>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '15px' }}>
              {['Roster', 'Schedule', 'Report'].map(sub => (
                <button key={sub} onClick={() => setMgrTab(sub)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #333', fontWeight: 'bold', background: mgrTab === sub ? 'rgba(168, 85, 247, 0.2)' : '#111', color: mgrTab === sub ? '#a855f7' : '#888' }}>{sub}</button>
              ))}
            </div>

            {mgrTab === 'Roster' && (
              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: '#fff' }}>Crew Roster</h3>
                  <button onClick={() => {
                    const newEmp = { id: `emp_${Date.now()}`, empNum: '', name: '', type: 'W2', rate: '15.00' };
                    updateActiveWeek({ roster: [...activeWeek.roster, newEmp], shifts: { ...activeWeek.shifts, [newEmp.id]: getEmptyShifts() } });
                  }} style={{ background: '#a855f7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.8em' }}>+ Add Worker</button>
                </div>
                {activeWeek.roster.map(emp => (
                  <div key={emp.id} style={{ background: '#000', padding: '15px', borderRadius: '8px', borderLeft: emp.type === '1099' ? '4px solid #f59e0b' : '4px solid #a855f7', marginBottom: '15px', position: 'relative' }}>
                    <button onClick={() => updateActiveWeek({ roster: activeWeek.roster.filter(r => r.id !== emp.id) })} style={{ position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', width: '28px', height: '28px', fontWeight: 'bold' }}>X</button>
                    
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', paddingRight: '35px' }}>
                      <div style={{ flex: 1 }}><label style={{ color: '#aaa', fontSize: '0.7em' }}>Emp #</label><input type="text" value={emp.empNum} onChange={e => updateActiveWeek({ roster: activeWeek.roster.map(r => r.id === emp.id ? { ...r, empNum: e.target.value } : r) })} style={{ ...inputStyle, padding: '8px' }} placeholder="ID" /></div>
                      <div style={{ flex: 2 }}><label style={{ color: '#aaa', fontSize: '0.7em' }}>Name</label><input type="text" value={emp.name} onChange={e => updateActiveWeek({ roster: activeWeek.roster.map(r => r.id === emp.id ? { ...r, name: e.target.value } : r) })} style={{ ...inputStyle, padding: '8px' }} placeholder="Full Name" /></div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: 2 }}>
                        <label style={{ color: '#aaa', fontSize: '0.7em' }}>Classification</label>
                        <select value={emp.type || 'W2'} onChange={e => updateActiveWeek({ roster: activeWeek.roster.map(r => r.id === emp.id ? { ...r, type: e.target.value } : r) })} style={{ ...inputStyle, padding: '8px' }}>
                          <option value="W2">W2 Employee (Overtime)</option>
                          <option value="1099">1099 Contractor (Flat Rate)</option>
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ color: '#00cc66', fontSize: '0.7em', fontWeight: 'bold' }}>Rate ($)</label>
                        <input type="number" value={emp.rate} onChange={e => updateActiveWeek({ roster: activeWeek.roster.map(r => r.id === emp.id ? { ...r, rate: e.target.value } : r) })} style={{ ...inputStyle, padding: '8px', color: '#00cc66', borderColor: '#00cc66' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px', fontSize: '0.85em', background: '#111', padding: '10px', borderRadius: '6px', borderTop: '1px dashed #333' }}>
                      <div style={{ color: '#f59e0b' }}>⏰ Lifetime Lates: <strong style={{ fontSize: '1.2em' }}>{getAttendance(emp.id).lates}</strong></div>
                      <div style={{ color: '#ef4444' }}>❌ Absences: <strong style={{ fontSize: '1.2em' }}>{getAttendance(emp.id).absences}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {mgrTab === 'Schedule' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {activeWeek.roster.map(emp => {
                  const shifts = activeWeek.shifts[emp.id] || getEmptyShifts();
                  let totalHrs = 0; Object.values(shifts).forEach(s => totalHrs += calcShiftHrs(s?.in, s?.out));
                  let hrsColor = '#00cc66'; if (totalHrs >= 38) hrsColor = '#f59e0b'; if (totalHrs >= 40.1) hrsColor = '#ef4444';
                  
                  return (
                    <div key={emp.id} style={{ ...cardStyle, padding: '15px', borderLeft: emp.type === '1099' ? '4px solid #f59e0b' : '4px solid #a855f7' }}>
                      <div onClick={() => setExpanded({...expanded, [emp.id]: !expanded[emp.id]})} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                        <div>
                          <h4 style={{ margin: '0 0 2px 0', color: emp.type === '1099' ? '#f59e0b' : '#a855f7', fontSize: '1.1em' }}>{emp.name || 'Unnamed'}</h4>
                          <span style={{ color: '#888', fontSize: '0.75em' }}>{emp.type || 'W2'} | ID: {emp.empNum}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <strong style={{ color: hrsColor, fontSize: '1.2em' }}>{totalHrs.toFixed(1)} hrs</strong>
                          <button onClick={(e) => { e.stopPropagation(); dispatchSchedule(emp, shifts, activeWeek.weekDate); }} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85em' }}>📤 Share</button>
                          <span style={{ color: '#555', fontSize: '1.2em' }}>{expanded[emp.id] ? '▲' : '▼'}</span>
                        </div>
                      </div>
                      
                      {expanded[emp.id] && (
                        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #333' }}>
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                            const s = shifts[day] || { in: '', out: '', flag: '' };
                            const hrs = calcShiftHrs(s.in, s.out);
                            return (
                              <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                <div style={{ width: '35px', color: '#aaa', fontWeight: 'bold', fontSize: '0.85em', textTransform: 'uppercase' }}>{day}</div>
                                <input type="time" value={s.in} onChange={e => updateActiveWeek({ shifts: { ...activeWeek.shifts, [emp.id]: { ...shifts, [day]: { ...s, in: e.target.value } } } })} style={{ flex: 1, padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '6px', color: '#00ffff', textAlign: 'center' }} />
                                <span style={{ color: '#555' }}>to</span>
                                <input type="time" value={s.out} onChange={e => updateActiveWeek({ shifts: { ...activeWeek.shifts, [emp.id]: { ...shifts, [day]: { ...s, out: e.target.value } } } })} style={{ flex: 1, padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '6px', color: '#f59e0b', textAlign: 'center' }} />
                                <button onClick={() => {
                                  const nextFlag = s.flag === '' ? 'late' : s.flag === 'late' ? 'absent' : '';
                                  updateActiveWeek({ shifts: { ...activeWeek.shifts, [emp.id]: { ...shifts, [day]: { ...s, flag: nextFlag } } } });
                                }} style={{ background: s.flag === 'late' ? 'rgba(245,158,11,0.2)' : s.flag === 'absent' ? 'rgba(239,68,68,0.2)' : '#000', border: '1px solid #333', borderRadius: '6px', padding: '8px 10px', fontSize: '1.1em' }}>
                                  {s.flag === 'late' ? '⏰' : s.flag === 'absent' ? '❌' : '✔️'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {mgrTab === 'Report' && (
              <div style={cardStyle}>
                <h3 style={{ margin: '0 0 15px 0', color: '#fff', textAlign: 'center', textTransform: 'uppercase' }}>W2 Payroll Liability</h3>
                {(() => {
                  let fleetHrs = 0; let fleetPay = 0;
                  const w2Roster = activeWeek.roster.filter(emp => emp.type !== '1099');
                  if (w2Roster.length === 0) return <div style={{ textAlign: 'center', color: '#555', padding: '20px' }}>No W2 Employees on roster.</div>;
                  return (
                    <>
                      {w2Roster.map(emp => {
                        const shifts = activeWeek.shifts[emp.id] || getEmptyShifts();
                        let hrs = 0; Object.values(shifts).forEach(s => hrs += calcShiftHrs(s?.in, s?.out));
                        const rate = parseFloat(emp.rate) || 0;
                        const regHrs = Math.min(hrs, 40); const otHrs = Math.max(0, hrs - 40);
                        const pay = (regHrs * rate) + (otHrs * (rate * 1.5));
                        fleetHrs += hrs; fleetPay += pay;
                        return (
                          <div key={emp.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #222' }}>
                            <div><strong style={{ color: '#a855f7', fontWeight: 'bold' }}>{emp.name || `Worker (${emp.empNum})`}</strong><br/>
                            {otHrs > 0 ? <span style={{ color: '#f59e0b' }}>OT Triggered ({otHrs.toFixed(1)}h)</span> : <span style={{ color: '#888', fontSize: '0.8em' }}>Regular Time</span>}</div>
                            <div style={{ textAlign: 'right' }}><strong style={{ color: '#fff', fontWeight: 'bold' }}>${pay.toFixed(2)}</strong><br/><span style={{ color: '#555', fontSize: '0.8em' }}>{hrs.toFixed(1)} hrs @ ${rate}/hr</span></div>
                          </div>
                        );
                      })}
                      <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Total W2 Hours:</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{fleetHrs.toFixed(1)}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px dashed #333' }}><strong style={{ color: '#fff' }}>Est. Payroll Liability</strong><strong style={{ color: '#a855f7', fontSize: '1.5em' }}>${fleetPay.toFixed(2)}</strong></div>
                      </div>
                    </>
                  );
                })()}
                <button onClick={deleteActiveWeek} style={{ width: '100%', padding: '12px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', marginTop: '20px', fontWeight: 'bold' }}>Delete This Week</button>
              </div>
            )}
            
            {mgrTab === 'Report' && (
              <div style={cardStyle}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}><h3 style={{ margin: '0 0 5px 0', color: '#f59e0b', textTransform: 'uppercase' }}>1099 Contractor Payouts</h3><span style={{ color: '#888', fontSize: '0.85em' }}>Owner-Operators & Day Labor (Straight Pay / No OT)</span></div>
                {(() => {
                  let total1099 = 0;
                  const cRoster = activeWeek.roster.filter(emp => emp.type === '1099');
                  if (cRoster.length === 0) return <div style={{ textAlign: 'center', color: '#555', padding: '20px' }}>No 1099 Contractors on roster. Change classification in Roster tab.</div>;
                  return (
                    <>
                      {cRoster.map(emp => {
                        const shifts = activeWeek.shifts[emp.id] || getEmptyShifts();
                        let hrs = 0; Object.values(shifts).forEach(s => hrs += calcShiftHrs(s?.in, s?.out));
                        const rate = parseFloat(emp.rate) || 0;
                        const straightPay = hrs * rate; total1099 += straightPay;
                        return (
                          <div key={emp.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #222' }}>
                            <div><strong style={{ color: '#f59e0b', fontWeight: 'bold' }}>{emp.name || `Worker (${emp.empNum})`}</strong><br/><div style={{ color: '#888', fontSize: '0.8em' }}>Straight Pay (No OT)</div></div>
                            <div style={{ textAlign: 'right' }}><strong style={{ color: '#fff', fontWeight: 'bold' }}>${straightPay.toFixed(2)}</strong><br/><span style={{ color: '#555', fontSize: '0.8em' }}>{hrs.toFixed(1)} hrs @ ${rate}/hr</span></div>
                          </div>
                        );
                      })}
                      <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: '#fff' }}>Total 1099 Payouts:</strong><strong style={{ color: '#f59e0b', fontSize: '1.5em' }}>${total1099.toFixed(2)}</strong>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function TimesheetCalc() {
  return <ErrorBoundary><TimesheetUI /></ErrorBoundary>;
}
