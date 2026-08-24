import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../core/CalendarContext';

export default function SubscriptionTracker() {
  const navigate = useNavigate();
  const { addReminder, removeReminder } = useCalendar();

  const [subs, setSubs] = useState(() => {
    const saved = localStorage.getItem('fleet_subscriptions');
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [cycle, setCycle] = useState('Monthly');
  const [renewal, setRenewal] = useState('');
  const [source, setSource] = useState('Corporate Card');
  const [lastFour, setLastFour] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    localStorage.setItem('fleet_subscriptions', JSON.stringify(subs));
  }, [subs]);

  const handleAddSub = () => {
    if (!name || !cost || !renewal) return alert("Name, Cost, and Renewal Date are required.");
    
    const newSub = {
      id: `sub_${Date.now()}`,
      name, cost: parseFloat(cost), cycle, renewal, source, lastFour, notes
    };

    setSubs([...subs, newSub]);
    
    // Automatically blast a warning to the Master Calendar
    addReminder(renewal, `[SUB RENEWAL] ${name} - $${parseFloat(cost).toFixed(2)}`, 'Subscriptions', 'High');

    setName(''); setCost(''); setRenewal(''); setLastFour(''); setNotes('');
  };

  const removeSub = (id) => {
    setSubs(subs.filter(s => s.id !== id));
    // Note: We don't auto-delete the calendar reminder here in case they still want the historic log, 
    // but they can clear it manually from the Calendar Hub.
  };

  // Calculate overall burn rate
  const monthlyBurn = subs.reduce((acc, sub) => acc + (sub.cycle === 'Monthly' ? sub.cost : sub.cost / 12), 0);
  const yearlyBurn = subs.reduce((acc, sub) => acc + (sub.cycle === 'Yearly' ? sub.cost : sub.cost * 12), 0);

  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', marginBottom: '10px' };
  const labelStyle = { color: '#a855f7', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', display: 'block' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Subscription Tracker</h2>
      </header>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        {/* Burn Rate Dashboard */}
        <div style={{ ...cardStyle, borderTop: '4px solid #ef4444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#aaa', fontSize: '0.8em', textTransform: 'uppercase' }}>Monthly Burn</div>
            <strong style={{ color: '#ef4444', fontSize: '1.5em' }}>${monthlyBurn.toFixed(2)}</strong>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#aaa', fontSize: '0.8em', textTransform: 'uppercase' }}>True Yearly Cost</div>
            <strong style={{ color: '#f59e0b', fontSize: '1.5em' }}>${yearlyBurn.toFixed(2)}</strong>
          </div>
        </div>

        {/* Add New Subscription */}
        <div style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>+ Log New Subscription</h3>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 2 }}><label style={labelStyle}>Service Name</label><input type="text" placeholder="E.g. Adobe CC" value={name} onChange={e=>setName(e.target.value)} style={inputStyle} /></div>
            <div style={{ flex: 1 }}><label style={labelStyle}>Cost ($)</label><input type="number" placeholder="0.00" value={cost} onChange={e=>setCost(e.target.value)} style={{...inputStyle, color: '#00cc66'}} /></div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Billing Cycle</label>
              <select value={cycle} onChange={e=>setCycle(e.target.value)} style={inputStyle}>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div style={{ flex: 1 }}><label style={labelStyle}>Next Renewal</label><input type="date" value={renewal} onChange={e=>setRenewal(e.target.value)} style={inputStyle} /></div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 2 }}>
              <label style={labelStyle}>Payment Source</label>
              <select value={source} onChange={e=>setSource(e.target.value)} style={inputStyle}>
                <option value="Corporate Card">Corporate Card</option>
                <option value="Personal Visa/MC">Personal Visa/MC</option>
                <option value="Crypto Wallet">Crypto Wallet</option>
                <option value="Bank ACH">Bank ACH</option>
              </select>
            </div>
            <div style={{ flex: 1 }}><label style={labelStyle}>Card Last 4</label><input type="number" placeholder="1234" maxLength="4" value={lastFour} onChange={e=>setLastFour(e.target.value)} style={inputStyle} /></div>
          </div>

          <label style={labelStyle}>Notes / Who Pays</label>
          <input type="text" placeholder="E.g. Paid by Will, reimbursing next week" value={notes} onChange={e=>setNotes(e.target.value)} style={inputStyle} />

          <button onClick={handleAddSub} style={{ width: '100%', padding: '12px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '5px' }}>Sync to Calendar & Save</button>
        </div>

        {/* Active Subscriptions List */}
        <h3 style={{ margin: '25px 0 15px 0', color: '#fff', textTransform: 'uppercase', fontSize: '0.9em', letterSpacing: '1px' }}>Active Roster</h3>
        
        {subs.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#555', padding: '20px' }}>No subscriptions logged.</div>
        ) : (
          subs.sort((a, b) => new Date(a.renewal) - new Date(b.renewal)).map(sub => (
            <div key={sub.id} style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222', borderLeft: '4px solid #3b82f6', marginBottom: '10px', position: 'relative' }}>
              <button onClick={() => removeSub(sub.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.2em' }}>×</button>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', paddingRight: '20px' }}>
                <strong style={{ color: '#fff', fontSize: '1.1em' }}>{sub.name}</strong>
                <strong style={{ color: '#00cc66' }}>${sub.cost.toFixed(2)} <span style={{fontSize: '0.7em', color: '#888'}}>{sub.cycle}</span></strong>
              </div>
              
              <div style={{ display: 'flex', gap: '15px', color: '#aaa', fontSize: '0.85em', marginBottom: '8px' }}>
                <div><span style={{color:'#555'}}>Renews:</span> <span style={{color: '#00ffff'}}>{new Date(sub.renewal + 'T00:00:00').toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span></div>
                <div><span style={{color:'#555'}}>Via:</span> {sub.source} {sub.lastFour && `(*${sub.lastFour})`}</div>
              </div>

              {sub.notes && <div style={{ color: '#888', fontSize: '0.8em', fontStyle: 'italic', background: '#111', padding: '8px', borderRadius: '6px' }}>{sub.notes}</div>}
            </div>
          ))
        )}

      </div>
    </div>
  );
}
