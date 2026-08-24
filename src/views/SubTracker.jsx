import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../core/CalendarContext';

export default function SubTracker() {
  const navigate = useNavigate();
  const { addReminder } = useCalendar();

  // --- STATE ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [subs, setSubs] = useState(() => {
    const saved = localStorage.getItem('fleet_subs');
    return saved ? JSON.parse(saved) : [];
  });

  // Form State
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [cycle, setCycle] = useState('Monthly');
  const [renewal, setRenewal] = useState('');
  const [source, setSource] = useState('Debit Card');
  const [notes, setNotes] = useState('');

  useEffect(() => { localStorage.setItem('fleet_subs', JSON.stringify(subs)); }, [subs]);

  // --- MATH & DATES ---
  const monthlyBurn = subs.reduce((sum, sub) => sum + (sub.cycle === 'Yearly' ? sub.cost / 12 : sub.cost), 0);
  const yearlyBurn = subs.reduce((sum, sub) => sum + (sub.cycle === 'Monthly' ? sub.cost * 12 : sub.cost), 0);

  const getNextCycleDate = (dateString, billingCycle) => {
      if (!dateString) return '';
      const d = new Date(dateString);
      // Account for timezone offset to prevent date slipping
      d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
      
      if (billingCycle === 'Monthly') d.setMonth(d.getMonth() + 1);
      else if (billingCycle === 'Yearly') d.setFullYear(d.getFullYear() + 1);
      else if (billingCycle === 'Weekly') d.setDate(d.getDate() + 7);
      
      return d.toISOString().split('T')[0];
  };

  // --- ACTIONS ---
  const handleSave = () => {
      if (!name || !cost || !renewal) return alert("⚠️ Name, Cost, and Renewal Date are required.");
      
      const newSub = { id: `sub_${Date.now()}`, name, cost: parseFloat(cost), cycle, renewal, source, notes };
      setSubs([...subs, newSub]);
      
      // Sync initial due date
      addReminder(renewal, `[RENEWAL] ${name} ($${cost})`, 'Sub Tracker', 'High');
      
      // Reset and close form
      setName(''); setCost(''); setRenewal(''); setNotes('');
      setIsFormOpen(false);
  };

  const handleMarkPaid = (sub) => {
      const today = new Date().toISOString().split('T')[0];
      const nextDate = getNextCycleDate(sub.renewal, sub.cycle);
      
      // 1. Log the payment for today
      addReminder(today, `[PAID] ${sub.name} ($${sub.cost.toFixed(2)})`, 'Sub Tracker', 'Low');
      
      // 2. Log the upcoming next renewal
      addReminder(nextDate, `[RENEWAL] ${sub.name} ($${sub.cost.toFixed(2)})`, 'Sub Tracker', 'High');
      
      // 3. Update the roster
      setSubs(subs.map(s => s.id === sub.id ? { ...s, renewal: nextDate } : s));
      alert(`✅ Payment logged! Next renewal pushed to ${nextDate}`);
  };

  const removeSub = (id) => setSubs(subs.filter(s => s.id !== id));

  // --- STYLES ---
  const cardStyle = { background: 'rgba(17, 17, 17, 0.85)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const inputStyle = { width: '100%', background: 'rgba(0,0,0,0.6)', border: '1px solid #444', color: '#fff', padding: '10px', borderRadius: '6px', outline: 'none', marginBottom: '10px' };
  const labelStyle = { color: 'var(--text-accent, #a855f7)', fontSize: '0.75em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px', display: 'block' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(10px)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: 'var(--text-accent, #a855f7)' }}>Subscription Tracker</h2>
      </header>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        {/* BURN RATE DASHBOARD */}
        <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', borderTop: '4px solid #ef4444' }}>
            <div style={{ textAlign: 'center', flex: 1, borderRight: '1px solid #333' }}>
                <div style={{ color: '#aaa', fontSize: '0.8em', textTransform: 'uppercase' }}>Monthly Burn</div>
                <div style={{ color: '#ef4444', fontSize: '1.8em', fontWeight: 'bold' }}>${monthlyBurn.toFixed(2)}</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ color: '#aaa', fontSize: '0.8em', textTransform: 'uppercase' }}>True Yearly Cost</div>
                <div style={{ color: '#f59e0b', fontSize: '1.8em', fontWeight: 'bold' }}>${yearlyBurn.toFixed(2)}</div>
            </div>
        </div>

        {/* COLLAPSIBLE LOGGING FORM */}
        <div style={{ ...cardStyle, borderLeft: '4px solid var(--accent, #a855f7)', padding: '0', overflow: 'hidden' }}>
            <button 
                onClick={() => setIsFormOpen(!isFormOpen)} 
                style={{ width: '100%', background: 'transparent', color: 'var(--text-accent, #00cc66)', border: 'none', padding: '15px', fontWeight: 'bold', fontSize: '1.1em', textAlign: 'center' }}
            >
                {isFormOpen ? '− Close Form' : '+ Log New Subscription'}
            </button>
            
            {isFormOpen && (
                <div style={{ padding: '0 15px 15px 15px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 2 }}>
                            <label style={labelStyle}>Service Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="E.g. ProtonMail" style={inputStyle} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Cost ($)</label>
                            <input type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="0.00" style={inputStyle} />
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Billing Cycle</label>
                            <select value={cycle} onChange={e => setCycle(e.target.value)} style={inputStyle}>
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                                <option value="Weekly">Weekly</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Next Renewal</label>
                            <input type="date" value={renewal} onChange={e => setRenewal(e.target.value)} style={inputStyle} />
                        </div>
                    </div>
                    
                    <label style={labelStyle}>Payment Source</label>
                    <input type="text" value={source} onChange={e => setSource(e.target.value)} placeholder="E.g. Privacy.com Virtual Card" style={inputStyle} />
                    
                    <label style={labelStyle}>Notes / Who Pays</label>
                    <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="E.g. Split with Will, I owe him half" style={inputStyle} />
                    
                    <button onClick={handleSave} style={{ width: '100%', padding: '12px', background: 'var(--accent, #a855f7)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginTop: '5px' }}>
                        Save & Sync to Calendar
                    </button>
                </div>
            )}
        </div>

        {/* ACTIVE ROSTER */}
        <h3 style={{ textAlign: 'center', color: 'var(--text-accent, #00cc66)', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '25px', marginBottom: '15px' }}>Active Roster</h3>
        
        {subs.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#555', fontStyle: 'italic' }}>No subscriptions logged.</div>
        ) : (
            subs.map(sub => (
                <div key={sub.id} style={{ ...cardStyle, borderLeft: '4px solid #333' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                            <div style={{ color: '#fff', fontSize: '1.2em', fontWeight: 'bold' }}>{sub.name}</div>
                            <div style={{ color: '#aaa', fontSize: '0.85em', textTransform: 'uppercase' }}>{sub.cycle} • {sub.source}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#ef4444', fontSize: '1.2em', fontWeight: 'bold', fontFamily: 'monospace' }}>${sub.cost.toFixed(2)}</div>
                            <button onClick={() => removeSub(sub.id)} style={{ background: 'transparent', color: '#555', border: 'none', fontSize: '0.85em', textDecoration: 'underline' }}>Remove</button>
                        </div>
                    </div>
                    
                    {sub.notes && <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px', borderRadius: '6px', color: '#888', fontSize: '0.85em', marginBottom: '12px', fontStyle: 'italic' }}>{sub.notes}</div>}
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #444', paddingTop: '12px' }}>
                        <div style={{ color: '#f59e0b', fontSize: '0.9em' }}>
                            <strong>Next:</strong> {sub.renewal}
                        </div>
                        <button onClick={() => handleMarkPaid(sub)} style={{ background: 'rgba(0, 204, 102, 0.1)', color: '#00cc66', border: '1px solid #00cc66', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85em' }}>
                            💰 Mark Paid
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}
