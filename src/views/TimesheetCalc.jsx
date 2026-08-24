import React, { useState, useEffect, Component } from 'react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#ff4444', background: '#0a0a0a', minHeight: '100vh' }}>
          <h2>⚠️ Timesheet Module Crashed</h2>
          <p style={{ fontFamily: 'monospace', background: '#111', padding: '10px' }}>{this.state.error?.toString()}</p>
          <button onClick={() => window.history.back()} style={{ padding: '10px', background: '#333', color: '#fff', border: 'none', borderRadius: '8px' }}>Go Back</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function TimesheetUI() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState('Manager');
  const [mgrTab, setMgrTab] = useState('Schedule');

  // --- MULTI-WEEK PERSISTENCE ENGINE ---
  const [weeks, setWeeks] = useState(() => {
    const saved = localStorage.getItem('fleet_schedules');
    if (saved) return JSON.parse(saved);
    return [{
      id: `week_${Date.now()}`,
      label: `Week of ${new Date().toLocaleDateString()}`,
      budgetHrs: '160',
      roster: [{ id: 'emp_1', name: 'Employee 1', rate: '16.50' }],
      shifts: { 'emp_1': { Mon: '', Tue: '', Wed: '', Thu: '', Fri: '', Sat: '', Sun: '' } }
    }];
  });

  const [activeWeekId, setActiveWeekId] = useState(weeks[0].id);
  const activeWeek = weeks.find(w => w.id === activeWeekId) || weeks[0];

  // Save to disk whenever weeks state changes
  useEffect(() => {
    localStorage.setItem('fleet_schedules', JSON.stringify(weeks));
  }, [weeks]);

  const updateActiveWeek = (updates) => {
    setWeeks(weeks.map(w => w.id === activeWeekId ? { ...w, ...updates } : w));
  };

  const createNewWeek = () => {
    const newId = `week_${Date.now()}`;
    const newShifts = {};
    activeWeek.roster.forEach(emp => { newShifts[emp.id] = { Mon: '', Tue: '', Wed: '', Thu: '', Fri: '', Sat: '', Sun: '' }; });
    
    const newWeek = {
      id: newId,
      label: `New Week (${new Date().toLocaleDateString()})`,
      budgetHrs: activeWeek.budgetHrs,
      roster: [...activeWeek.roster],
      shifts: newShifts
    };
    setWeeks([...weeks, newWeek]);
    setActiveWeekId(newId);
  };

  const deleteActiveWeek = () => {
    if (weeks.length === 1) return alert("Cannot delete the only week.");
    const filtered = weeks.filter(w => w.id !== activeWeekId);
    setWeeks(filtered);
    setActiveWeekId(filtered[0].id);
  };

  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', marginTop: '4px' };
  const labelStyle = { color: '#a855f7', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Timesheet Engine</h2>
      </header>

      <div style={{ display: 'flex', background: '#111', padding: '10px', gap: '6px' }}>
        {['Employee', 'Manager', 'Self-Employed'].map(tab => (
          <button key={tab} onClick={() => setMainTab(tab)} style={{ flex: 1, padding: '8px 5px', borderRadius: '8px', fontWeight: 'bold', border: 'none', fontSize: '0.9em', background: mainTab === tab ? '#a855f7' : '#222', color: mainTab === tab ? '#fff' : '#aaa' }}>{tab}</button>
        ))}
      </div>
      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '95px' }}>
        {mainTab === 'Manager' && (
          <>
            {/* Week Controller */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center', background: '#111', padding: '10px', borderRadius: '8px', border: '1px solid #a855f7' }}>
              <input 
                type="text" 
                value={activeWeek.label} 
                onChange={e => updateActiveWeek({ label: e.target.value })} 
                style={{ flex: 1, padding: '8px', background: '#000', color: '#00ffff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }} 
              />
              <select value={activeWeekId} onChange={e => setActiveWeekId(e.target.value)} style={{ padding: '8px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', maxWidth: '100px' }}>
                {weeks.map(w => <option key={w.id} value={w.id}>{w.label}</option>)}
              </select>
              <button onClick={createNewWeek} style={{ background: '#00cc66', color: '#000', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>+ Wk</button>
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
                  <button 
                    onClick={() => {
                      const newEmp = { id: `emp_${Date.now()}`, name: `Worker ${activeWeek.roster.length + 1}`, rate: '15.00' };
                      updateActiveWeek({ 
                        roster: [...activeWeek.roster, newEmp],
                        shifts: { ...activeWeek.shifts, [newEmp.id]: { Mon: '', Tue: '', Wed: '', Thu: '', Fri: '', Sat: '', Sun: '' } }
                      });
                    }} 
                    style={{ background: '#a855f7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.8em' }}
                  >+ Add Worker</button>
                </div>
                
                <label style={labelStyle}>Target Fleet Budget (Hrs)<input type="number" value={activeWeek.budgetHrs} onChange={e=>updateActiveWeek({budgetHrs: e.target.value})} style={{...inputStyle, marginBottom: '20px'}} /></label>

                {activeWeek.roster.map(emp => (
                  <div key={emp.id} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center', background: '#000', padding: '10px', borderRadius: '8px', borderLeft: '4px solid #a855f7' }}>
                    <div style={{ flex: 2 }}><label style={{color:'#aaa', fontSize:'0.7em'}}>Name</label><input type="text" value={emp.name} onChange={e => {
                      const newRoster = activeWeek.roster.map(r => r.id === emp.id ? { ...r, name: e.target.value } : r);
                      updateActiveWeek({ roster: newRoster });
                    }} style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontWeight: 'bold' }} /></div>
                    
                    <div style={{ flex: 1 }}><label style={{color:'#aaa', fontSize:'0.7em'}}>Rate ($)</label><input type="number" value={emp.rate} onChange={e => {
                      const newRoster = activeWeek.roster.map(r => r.id === emp.id ? { ...r, rate: e.target.value } : r);
                      updateActiveWeek({ roster: newRoster });
                    }} style={{ width: '100%', background: 'transparent', border: 'none', color: '#00cc66' }} /></div>
                    
                    <button onClick={() => {
                      updateActiveWeek({ roster: activeWeek.roster.filter(r => r.id !== emp.id) });
                    }} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px', fontWeight: 'bold' }}>X</button>
                  </div>
                ))}
              </div>
            )}

            {mgrTab === 'Schedule' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {activeWeek.roster.map(emp => {
                  const shifts = activeWeek.shifts[emp.id] || { Mon: '', Tue: '', Wed: '', Thu: '', Fri: '', Sat: '', Sun: '' };
                  const totalHrs = Object.values(shifts).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
                  
                  return (
                    <div key={emp.id} style={{ ...cardStyle, padding: '15px 10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #333' }}>
                        <h4 style={{ margin: 0, color: '#a855f7' }}>{emp.name}</h4>
                        <strong style={{ color: totalHrs > 40 ? '#f59e0b' : '#00cc66' }}>{totalHrs.toFixed(1)} hrs</strong>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                          <div key={day} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.65em', color: '#888', marginBottom: '4px', textTransform: 'uppercase' }}>{day}</div>
                            <input 
                              type="number" 
                              value={shifts[day]} 
                              placeholder="-"
                              onChange={e => {
                                const newShifts = { ...activeWeek.shifts, [emp.id]: { ...shifts, [day]: e.target.value } };
                                updateActiveWeek({ shifts: newShifts });
                              }}
                              style={{ width: '100%', padding: '8px 0', textAlign: 'center', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '6px', fontSize: '1em' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {mgrTab === 'Report' && (
              <div style={cardStyle}>
                <h3 style={{ margin: '0 0 15px 0', color: '#fff', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>Fleet Liability</h3>
                
                {(() => {
                  let fleetHrs = 0;
                  let fleetPay = 0;
                  const budget = parseFloat(activeWeek.budgetHrs) || 160;

                  const breakdowns = activeWeek.roster.map(emp => {
                    const shifts = activeWeek.shifts[emp.id] || {};
                    const hrs = Object.values(shifts).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
                    const rate = parseFloat(emp.rate) || 0;
                    
                    const regHrs = Math.min(hrs, 40);
                    const otHrs = Math.max(0, hrs - 40);
                    const pay = (regHrs * rate) + (otHrs * (rate * 1.5));
                    
                    fleetHrs += hrs;
                    fleetPay += pay;
                    
                    return (
                      <div key={emp.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #222' }}>
                        <div>
                          <div style={{ color: '#a855f7', fontWeight: 'bold' }}>{emp.name}</div>
                          <div style={{ color: '#888', fontSize: '0.8em' }}>{otHrs > 0 ? <span style={{color: '#f59e0b'}}>OT Triggered ({otHrs}h)</span> : 'Regular Time'}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#fff', fontWeight: 'bold' }}>${pay.toFixed(2)}</div>
                          <div style={{ color: '#555', fontSize: '0.8em' }}>{hrs} hrs @ ${rate}/hr</div>
                        </div>
                      </div>
                    );
                  });

                  return (
                    <>
                      <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}>
                          <span>Total Fleet Hours:</span>
                          <span style={{ color: fleetHrs > budget ? '#ef4444' : '#00cc66', fontWeight: 'bold' }}>{fleetHrs.toFixed(1)} / {budget}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px dashed #333' }}>
                          <strong style={{ color: '#fff' }}>Est. Payroll Liability:</strong>
                          <strong style={{ color: '#a855f7', fontSize: '1.5em' }}>${fleetPay.toFixed(2)}</strong>
                        </div>
                      </div>
                      
                      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '10px' }}>
                        {breakdowns}
                      </div>

                      <button onClick={deleteActiveWeek} style={{ width: '100%', padding: '12px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', marginTop: '20px', fontWeight: 'bold' }}>Delete This Week</button>
                    </>
                  );
                })()}
              </div>
            )}
          </>
        )}

        {/* Placeholder Shells to prevent blank screens on other tabs */}
        {mainTab === 'Employee' && (
          <div style={{ ...cardStyle, textAlign: 'center', color: '#aaa', padding: '40px 20px' }}>
            <h3>🛠️ Employee View</h3>
            <p>Select the Manager tab above to build and track fleet schedules.</p>
          </div>
        )}
        
        {mainTab === 'Self-Employed' && (
          <div style={{ ...cardStyle, textAlign: 'center', color: '#aaa', padding: '40px 20px' }}>
            <h3>💼 Contractor View</h3>
            <p>Select the Manager tab above to build and track fleet schedules.</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default function TimesheetCalc() {
  return <ErrorBoundary><TimesheetUI /></ErrorBoundary>;
}
