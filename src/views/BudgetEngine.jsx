import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../core/CalendarContext';

export default function BudgetEngine() {
  const navigate = useNavigate();
  const { addReminder } = useCalendar();
  const [showPreview, setShowPreview] = useState(false);

  // --- MULTI-PAYCHECK STATE ---
  const [incomes, setIncomes] = useState(() => {
    const saved = localStorage.getItem('fleet_budget_incomes');
    if (saved) return JSON.parse(saved);
    
    // Auto-migrate old single netIncome into the new array format
    const oldNet = parseFloat(localStorage.getItem('fleet_budget_net')) || 2500;
    return [{ id: 'inc_default', name: 'Primary Paycheck', amount: oldNet, date: '' }];
  });

  const [envelopes, setEnvelopes] = useState(() => {
    const saved = localStorage.getItem('fleet_budget_envs');
    const parsed = saved ? JSON.parse(saved) : [];
    // Auto-migrate old bills to link to the default paycheck
    return parsed.map(e => ({ ...e, dueDate: e.dueDate || '', recurrence: e.recurrence || 'Monthly', incomeId: e.incomeId || 'inc_default' }));
  });

  useEffect(() => { localStorage.setItem('fleet_budget_incomes', JSON.stringify(incomes)); }, [incomes]);
  useEffect(() => { localStorage.setItem('fleet_budget_envs', JSON.stringify(envelopes)); }, [envelopes]);

  // --- INCOME HANDLERS ---
  const addIncome = () => {
      setIncomes([...incomes, { id: `inc_${Date.now()}`, name: 'New Paycheck', amount: 0, date: '' }]);
      setShowPreview(false);
  };
  const updateIncome = (id, field, value) => setIncomes(incomes.map(i => i.id === id ? { ...i, [field]: field === 'amount' ? (parseFloat(value) || 0) : value } : i));
  const removeIncome = (id) => setIncomes(incomes.filter(i => i.id !== id));
  
  const syncIncomeToCalendar = (inc) => {
      if (!inc.date) return alert("⚠️ Please set a date for this paycheck first!");
      addReminder(inc.date, `[PAYDAY] ${inc.name} (+$${inc.amount})`, 'Cashflow Engine', 'Medium');
      alert(`✅ Payday synced to Master Calendar!`);
  };

  // --- BILL HANDLERS ---
  const addEnvelope = () => {
      setEnvelopes([...envelopes, { id: `env_${Date.now()}`, name: 'New Bill', amount: 0, dueDate: '', recurrence: 'Monthly', incomeId: incomes[0]?.id || '' }]);
      setShowPreview(false);
  };
  const updateEnvelope = (id, field, value) => setEnvelopes(envelopes.map(e => e.id === id ? { ...e, [field]: field === 'amount' ? (parseFloat(value) || 0) : value } : e));
  const removeEnvelope = (id) => setEnvelopes(envelopes.filter(e => e.id !== id));
  
  const syncToCalendar = (env) => {
      if (!env.dueDate) return alert("⚠️ Please set a due date for this bill first!");
      addReminder(env.dueDate, `[BILL: ${env.recurrence}] ${env.name} ($${env.amount})`, 'Cashflow Engine', 'High');
      alert(`✅ ${env.name} synced to Master Calendar!`);
  };

  // --- GLOBAL MATH ---
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalAllocated = envelopes.reduce((sum, env) => sum + env.amount, 0);
  const globalUnassigned = totalIncome - totalAllocated;

  const cardStyle = { background: 'rgba(17, 17, 17, 0.85)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(10px)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: 'var(--text-accent, #3b82f6)', fontSize: '1.2em', textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>Cashflow Engine</h2>
      </header>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        {/* --- GLOBAL OVERVIEW --- */}
        <div style={{ ...cardStyle, borderTop: '4px solid #00cc66', textAlign: 'center' }}>
            <div style={{ color: '#aaa', textTransform: 'uppercase', fontSize: '0.85em', fontWeight: 'bold', marginBottom: '10px' }}>Global Cash Pool</div>
            <div style={{ color: '#fff', fontSize: '2.5em', fontWeight: 'bold', marginBottom: '15px' }}>
                <span style={{ color: '#00cc66', marginRight: '5px' }}>$</span>{totalIncome.toFixed(2)}
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: '8px', border: `1px solid ${globalUnassigned < 0 ? '#ef4444' : globalUnassigned === 0 ? '#333' : '#00ffff'}` }}>
                <div style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.8em', marginBottom: '5px' }}>Total Unassigned Cash</div>
                <div style={{ fontSize: '2em', fontWeight: 'bold', fontFamily: 'monospace', color: globalUnassigned < 0 ? '#ef4444' : globalUnassigned === 0 ? '#aaa' : '#00ffff' }}>
                    ${globalUnassigned.toFixed(2)}
                </div>
            </div>
        </div>

        {/* --- DYNAMIC HEADER --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <button onClick={() => setShowPreview(!showPreview)} style={{ background: showPreview ? 'var(--accent, #3b82f6)' : 'transparent', color: showPreview ? '#000' : 'var(--text-accent, #3b82f6)', border: '1px solid var(--accent, #3b82f6)', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85em' }}>
                🧾 {showPreview ? 'Edit Ledgers' : 'Preview Ledgers'}
            </button>
            {!showPreview && (
                <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={addIncome} style={{ background: '#00cc66', color: '#000', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85em' }}>+ Income</button>
                    <button onClick={addEnvelope} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85em' }}>+ Bill</button>
                </div>
            )}
        </div>

        {/* --- ITEMIZED RECEIPT PREVIEW --- */}
        {showPreview ? (
            <div style={{ ...cardStyle, background: 'rgba(0, 0, 0, 0.85)', padding: '20px' }}>
                {incomes.map(inc => {
                    const linkedBills = envelopes.filter(e => e.incomeId === inc.id);
                    const checkTotal = linkedBills.reduce((sum, b) => sum + b.amount, 0);
                    const checkRemainder = inc.amount - checkTotal;
                    
                    return (
                        <div key={`prev_${inc.id}`} style={{ marginBottom: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #00cc66', paddingBottom: '5px', marginBottom: '10px' }}>
                                <strong style={{ color: '#00cc66', textTransform: 'uppercase' }}>{inc.name} {inc.date && `(${inc.date})`}</strong>
                                <strong style={{ color: '#fff' }}>${inc.amount.toFixed(2)}</strong>
                            </div>
                            {linkedBills.length === 0 ? (
                                <div style={{ color: '#555', fontSize: '0.85em', fontStyle: 'italic', paddingLeft: '10px' }}>No bills assigned to this check.</div>
                            ) : (
                                linkedBills.map(bill => (
                                    <div key={`pbill_${bill.id}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9em', marginBottom: '8px', paddingLeft: '10px' }}>
                                        <span style={{ color: '#aaa' }}>- {bill.name} {bill.dueDate && `(${bill.dueDate})`}</span>
                                        <span style={{ color: '#ef4444', fontFamily: 'monospace' }}>${bill.amount.toFixed(2)}</span>
                                    </div>
                                ))
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '5px', borderTop: '1px dashed #444', fontSize: '0.9em' }}>
                                <span style={{ color: '#888' }}>Remaining Cash:</span>
                                <strong style={{ color: checkRemainder < 0 ? '#ef4444' : '#00ffff', fontFamily: 'monospace' }}>${checkRemainder.toFixed(2)}</strong>
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            /* --- EDITABLE LEDGERS --- */
            <div>
                {/* INCOME SECTION */}
                <h3 style={{ color: '#00cc66', fontSize: '0.85em', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Income Sources</h3>
                {incomes.map(inc => (
                    <div key={inc.id} style={{ background: 'rgba(17, 17, 17, 0.85)', backdropFilter: 'blur(10px)', padding: '12px', borderRadius: '12px', borderLeft: '4px solid #00cc66', marginBottom: '15px', borderTop: '1px solid #333', borderRight: '1px solid #333', borderBottom: '1px solid #333' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <input type="text" value={inc.name} onChange={e => updateIncome(inc.id, 'name', e.target.value)} style={{ flex: 1, minWidth: '0', background: 'transparent', border: 'none', borderBottom: '1px solid #444', color: '#fff', fontSize: '1.1em', fontWeight: 'bold', outline: 'none', paddingBottom: '4px' }} />
                            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '6px', border: '1px solid #444', flexShrink: 0 }}>
                                <span style={{ color: '#00cc66', fontWeight: 'bold', marginRight: '4px' }}>$</span>
                                <input type="number" value={inc.amount || ''} onChange={e => updateIncome(inc.id, 'amount', e.target.value)} placeholder="0" style={{ width: '70px', background: 'transparent', border: 'none', color: '#fff', fontSize: '1em', fontWeight: 'bold', textAlign: 'right', outline: 'none' }} />
                            </div>
                            <button onClick={() => removeIncome(inc.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.4em', padding: '0 5px', flexShrink: 0 }}>×</button>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
                            <input type="date" value={inc.date} onChange={e => updateIncome(inc.id, 'date', e.target.value)} style={{ flex: 1, minWidth: '0', background: 'rgba(0,0,0,0.6)', border: '1px solid #444', color: '#aaa', padding: '8px', borderRadius: '6px', fontSize: '0.85em', outline: 'none' }} />
                            <button onClick={() => syncIncomeToCalendar(inc)} style={{ background: '#00cc66', color: '#000', border: 'none', padding: '0 12px', borderRadius: '6px', fontSize: '0.85em', fontWeight: 'bold', flexShrink: 0 }}>Sync</button>
                        </div>
                    </div>
                ))}

                {/* BILLS SECTION */}
                <h3 style={{ color: 'var(--text-accent, #3b82f6)', fontSize: '0.85em', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', marginTop: '20px' }}>Bill Ledger</h3>
                {envelopes.map(env => (
                    <div key={env.id} style={{ background: 'rgba(17, 17, 17, 0.85)', backdropFilter: 'blur(10px)', padding: '12px', borderRadius: '12px', borderLeft: '4px solid var(--accent, #3b82f6)', marginBottom: '12px', borderTop: '1px solid #333', borderRight: '1px solid #333', borderBottom: '1px solid #333' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <input type="text" value={env.name} onChange={e => updateEnvelope(env.id, 'name', e.target.value)} style={{ flex: 1, minWidth: '0', background: 'transparent', border: 'none', borderBottom: '1px solid #444', color: '#fff', fontSize: '1.1em', fontWeight: 'bold', outline: 'none', paddingBottom: '4px' }} />
                            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '6px', border: '1px solid #444', flexShrink: 0 }}>
                                <span style={{ color: '#00cc66', fontWeight: 'bold', marginRight: '4px' }}>$</span>
                                <input type="number" value={env.amount || ''} onChange={e => updateEnvelope(env.id, 'amount', e.target.value)} placeholder="0" style={{ width: '65px', background: 'transparent', border: 'none', color: '#fff', fontSize: '1em', fontWeight: 'bold', textAlign: 'right', outline: 'none' }} />
                            </div>
                            <button onClick={() => removeEnvelope(env.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.4em', padding: '0 5px', flexShrink: 0 }}>×</button>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch', marginBottom: '8px' }}>
                            <select value={env.incomeId || ''} onChange={e => updateEnvelope(env.id, 'incomeId', e.target.value)} style={{ flex: 1, minWidth: '0', background: 'rgba(0,0,0,0.6)', border: '1px solid #444', color: '#00cc66', padding: '8px', borderRadius: '6px', fontSize: '0.85em', outline: 'none' }}>
                                <option value="">Select Paycheck...</option>
                                {incomes.map(inc => (
                                    <option key={`opt_${inc.id}`} value={inc.id}>{inc.name}</option>
                                ))}
                            </select>
                            <select value={env.recurrence || 'Monthly'} onChange={e => updateEnvelope(env.id, 'recurrence', e.target.value)} style={{ flex: 1, minWidth: '0', background: 'rgba(0,0,0,0.6)', border: '1px solid #444', color: '#aaa', padding: '8px', borderRadius: '6px', fontSize: '0.85em', outline: 'none' }}>
                                <option value="One-Time">One-Time</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Bi-Weekly">Bi-Weekly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
                            <input type="date" value={env.dueDate} onChange={e => updateEnvelope(env.id, 'dueDate', e.target.value)} style={{ flex: 1, minWidth: '0', background: 'rgba(0,0,0,0.6)', border: '1px solid #444', color: '#aaa', padding: '8px', borderRadius: '6px', fontSize: '0.85em', outline: 'none' }} />
                            <button onClick={() => syncToCalendar(env)} style={{ background: 'var(--accent, #3b82f6)', color: '#fff', border: 'none', padding: '0 12px', borderRadius: '6px', fontSize: '0.85em', fontWeight: 'bold', flexShrink: 0 }}>Sync</button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
