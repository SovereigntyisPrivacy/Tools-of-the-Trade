import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../core/CalendarContext';

export default function BudgetEngine() {
  const navigate = useNavigate();
  const { addReminder } = useCalendar();

  const [netIncome, setNetIncome] = useState(() => parseFloat(localStorage.getItem('fleet_budget_net')) || 0);
  const [envelopes, setEnvelopes] = useState(() => {
    const saved = localStorage.getItem('fleet_budget_envs');
    const parsed = saved ? JSON.parse(saved) : [
        { id: '1', name: 'Housing / Rent', amount: 0, dueDate: '' },
        { id: '2', name: 'Gas & Transit', amount: 0, dueDate: '' },
        { id: '3', name: 'Groceries', amount: 0, dueDate: '' }
    ];
    // Migration safety check to ensure old entries don't crash the date field
    return parsed.map(e => ({ ...e, dueDate: e.dueDate || '' }));
  });

  useEffect(() => { localStorage.setItem('fleet_budget_net', netIncome.toString()); }, [netIncome]);
  useEffect(() => { localStorage.setItem('fleet_budget_envs', JSON.stringify(envelopes)); }, [envelopes]);

  const addEnvelope = () => {
      const name = prompt("Enter category name (e.g., Subscriptions, Phone Bill):");
      if (name) {
          setEnvelopes([...envelopes, { id: `env_${Date.now()}`, name, amount: 0, dueDate: '' }]);
      }
  };

  const updateEnvelope = (id, field, value) => {
      setEnvelopes(envelopes.map(e => e.id === id ? { ...e, [field]: field === 'amount' ? (parseFloat(value) || 0) : value } : e));
  };

  const removeEnvelope = (id) => {
      setEnvelopes(envelopes.filter(e => e.id !== id));
  };

  const syncToCalendar = (env) => {
      if (!env.dueDate) return alert("Please set a due date for this item first!");
      addReminder(env.dueDate, `[BILL DUE] ${env.name} ($${env.amount})`, 'Cashflow Engine', 'High');
      alert(`${env.name} synced to Master Calendar!`);
  };

  const totalAllocated = envelopes.reduce((sum, env) => sum + env.amount, 0);
  const unassigned = netIncome - totalAllocated;

  const cardStyle = { background: 'rgba(17, 17, 17, 0.85)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(10px)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Cashflow Engine</h2>
      </header>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        {/* --- MASTER INCOME & UNASSIGNED --- */}
        <div style={{ ...cardStyle, borderTop: '4px solid #00cc66', textAlign: 'center' }}>
            <div style={{ color: '#aaa', textTransform: 'uppercase', fontSize: '0.85em', fontWeight: 'bold', marginBottom: '10px' }}>Total Available Funds</div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ color: '#00cc66', fontSize: '1.5em', fontWeight: 'bold', marginRight: '5px' }}>$</span>
                <input 
                    type="number" 
                    value={netIncome || ''} 
                    onChange={e => setNetIncome(parseFloat(e.target.value) || 0)} 
                    placeholder="0.00"
                    style={{ background: 'transparent', border: 'none', borderBottom: '2px dashed #555', color: '#fff', fontSize: '2.5em', fontWeight: 'bold', width: '150px', textAlign: 'center', outline: 'none' }} 
                />
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: '8px', border: `1px solid ${unassigned < 0 ? '#ef4444' : unassigned === 0 ? '#333' : '#00ffff'}` }}>
                <div style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.8em', marginBottom: '5px' }}>Unassigned Cash</div>
                <div style={{ fontSize: '2em', fontWeight: 'bold', fontFamily: 'monospace', color: unassigned < 0 ? '#ef4444' : unassigned === 0 ? '#aaa' : '#00ffff' }}>
                    ${unassigned.toFixed(2)}
                </div>
                {unassigned < 0 && <div style={{ color: '#ef4444', fontSize: '0.8em', marginTop: '5px', fontWeight: 'bold' }}>⚠️ Over Budget</div>}
                {unassigned === 0 && <div style={{ color: '#00cc66', fontSize: '0.8em', marginTop: '5px', fontWeight: 'bold' }}>✓ Zero-Based Target Met</div>}
            </div>
        </div>

        {/* --- ENVELOPES --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ margin: 0, color: '#fff', textTransform: 'uppercase', fontSize: '0.9em', letterSpacing: '1px' }}>Cash Envelopes</h3>
            <button onClick={addEnvelope} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85em' }}>+ Add Category</button>
        </div>

        {envelopes.map(env => (
            <div key={env.id} style={{ background: 'rgba(17, 17, 17, 0.85)', backdropFilter: 'blur(10px)', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #3b82f6', marginBottom: '15px', borderTop: '1px solid #333', borderRight: '1px solid #333', borderBottom: '1px solid #333' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <button onClick={() => removeEnvelope(env.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.2em', padding: '0 5px' }}>×</button>
                    <div style={{ flex: 1, color: '#fff', fontWeight: 'bold', fontSize: '1.1em' }}>{env.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.6)', padding: '5px 10px', borderRadius: '6px', border: '1px solid #444' }}>
                        <span style={{ color: '#00cc66', fontWeight: 'bold', marginRight: '5px' }}>$</span>
                        <input 
                            type="number" 
                            value={env.amount || ''} 
                            onChange={e => updateEnvelope(env.id, 'amount', e.target.value)} 
                            placeholder="0"
                            style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2em', fontWeight: 'bold', width: '70px', textAlign: 'right', outline: 'none' }} 
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingLeft: '32px' }}>
                    <input 
                        type="date" 
                        value={env.dueDate} 
                        onChange={e => updateEnvelope(env.id, 'dueDate', e.target.value)} 
                        style={{ flex: 1, background: 'rgba(0,0,0,0.6)', border: '1px solid #444', color: '#aaa', padding: '8px', borderRadius: '6px', fontSize: '0.85em' }}
                    />
                    <button onClick={() => syncToCalendar(env)} style={{ background: 'transparent', border: '1px dashed #a855f7', color: '#a855f7', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85em', fontWeight: 'bold' }}>
                        📅 Sync
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
