import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const glassCard = { background: 'rgba(17, 17, 17, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '20px', marginBottom: '15px', border: '1px solid #333' };
const inputStyle = { background: '#000', color: '#fff', border: '1px solid #444', padding: '12px', borderRadius: '8px', width: '100%', marginBottom: '15px', fontSize: '1rem' };
const freqOptions = ["Weekly", "Bi-Weekly", "Monthly", "Bi-Monthly", "Quarterly", "Bi-Yearly", "Yearly"];

export default function BudgetEngine() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [showLedger, setShowLedger] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showBillForm, setShowBillForm] = useState(false);

  // --- DATABASES ---
  const [incomes, setIncomes] = useState(() => JSON.parse(localStorage.getItem('tot_incomes')) || []);
  const [bills, setBills] = useState(() => JSON.parse(localStorage.getItem('tot_bills')) || []);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('tot_budget_history')) || []);
  const [expandedHistory, setExpandedHistory] = useState(null);

  // --- FORM STATES ---
  const [incomeName, setIncomeName] = useState(''); const [incomeAmount, setIncomeAmount] = useState(''); const [incomeDate, setIncomeDate] = useState(() => new Date().toISOString().substring(0, 10)); const [incomeFrequency, setIncomeFrequency] = useState('Bi-Weekly'); const [incomeNote, setIncomeNote] = useState('');
  const [billName, setBillName] = useState(''); const [billCost, setBillCost] = useState(''); const [billDue, setBillDue] = useState(() => new Date().toISOString().substring(0, 10)); const [billFrequency, setBillFrequency] = useState('Monthly'); const [billNote, setBillNote] = useState('');

  useEffect(() => { localStorage.setItem('tot_incomes', JSON.stringify(incomes)); }, [incomes]);
  useEffect(() => { localStorage.setItem('tot_bills', JSON.stringify(bills)); }, [bills]);
  useEffect(() => { localStorage.setItem('tot_budget_history', JSON.stringify(history)); }, [history]);

  const sortedIncomes = [...incomes].sort((a, b) => new Date(a.date) - new Date(b.date));
  const sortedBills = [...bills].sort((a, b) => new Date(a.due) - new Date(b.due));

  // --- PERFECTED MATH ---
  const totalCashPool = incomes.reduce((acc, inc) => acc + inc.amount, 0);
  const totalLiability = bills.filter(b => !b.routeTo && !b.isPaid).reduce((acc, b) => acc + b.cost, 0);
  const usedCash = bills.filter(b => b.routeTo || b.isPaid).reduce((acc, b) => acc + b.cost, 0);
  const availableCash = totalCashPool - usedCash - totalLiability;

  // --- ACTIONS ---
  const handleAddIncome = () => {
    if (!incomeName || !incomeAmount) return;
    setIncomes([...incomes, { id: `inc_${Date.now()}`, name: incomeName, amount: parseFloat(incomeAmount), date: incomeDate, frequency: incomeFrequency, note: incomeNote }]);
    setIncomeName(''); setIncomeAmount(''); setIncomeNote(''); setShowIncomeForm(false);
  };

  const handleAddBill = () => {
    if (!billName || !billCost) return;
    setBills([...bills, { id: `bill_${Date.now()}`, name: billName, cost: parseFloat(billCost), due: billDue, frequency: billFrequency, routeTo: '', note: billNote }]);
    setBillName(''); setBillCost(''); setBillNote(''); setShowBillForm(false);
  };

  const deleteIncome = (id) => {
    if (bills.some(b => b.routeTo === id)) return alert("Cannot delete an income that has bills routed to it. Unassign them first.");
    setIncomes(incomes.filter(i => i.id !== id));
  };
  const deleteBill = (id) => setBills(bills.filter(b => b.id !== id));
  const updateBillRoute = (billId, incomeId) => setBills(bills.map(b => b.id === billId ? { ...b, routeTo: incomeId } : b));

  const advanceCycle = (currentDate, freq) => {
    const d = new Date(currentDate + 'T12:00:00Z');
    if (freq === 'Weekly') d.setUTCDate(d.getUTCDate() + 7);
    else if (freq === 'Bi-Weekly') d.setUTCDate(d.getUTCDate() + 14);
    else if (freq === 'Monthly') d.setUTCMonth(d.getUTCMonth() + 1);
    else if (freq === 'Bi-Monthly') d.setUTCMonth(d.getUTCMonth() + 2);
    else if (freq === 'Quarterly') d.setUTCMonth(d.getUTCMonth() + 3);
    else if (freq === 'Bi-Yearly') d.setUTCMonth(d.getUTCMonth() + 6);
    else if (freq === 'Yearly') d.setUTCFullYear(d.getUTCFullYear() + 1);
    return d.toISOString().substring(0, 10);
  };

  const handleAdvanceIncome = (id) => {
    if(window.confirm("Advance this deposit to the next pay cycle?")) setIncomes(incomes.map(i => i.id === id ? { ...i, date: advanceCycle(i.date, i.frequency) } : i));
  };
  const togglePaidStatus = (id) => setBills(bills.map(b => b.id === id ? { ...b, isPaid: !b.isPaid } : b));
  const handleAdvanceBill = (id) => {
    if(window.confirm("Pay bill and advance to next billing cycle?")) setBills(bills.map(b => b.id === id ? { ...b, due: advanceCycle(b.due, b.frequency), isPaid: false } : b));
  };

  const generateReport = () => {
    let text = `=== DETAILED BUDGET LEDGER ===\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
    text += `GLOBAL CASH POOL: $${totalCashPool.toFixed(2)}\nTOTAL LIABILITY:  $${totalLiability.toFixed(2)}\nUSED CASH:        $${usedCash.toFixed(2)}\nAVAILABLE CASH:   $${availableCash.toFixed(2)}\n\n`;
    text += `--- ENVELOPE LEDGER ---\n`;
    sortedIncomes.forEach(i => {
      text += `\n[${i.name}] (${i.date}) | +$${i.amount.toFixed(2)} | ${i.frequency}\n`;
      if (i.note) text += `   Note: ${i.note}\n`;
      const routed = sortedBills.filter(b => b.routeTo === i.id);
      let rem = i.amount;
      if (routed.length === 0) text += `   No bills assigned.\n`;
      routed.forEach(b => { text += `   - ${b.name} (${b.due}): -$${b.cost.toFixed(2)}\n`; if(b.note) text += `      Note: ${b.note}\n`; rem -= b.cost; });
      text += `   Remaining Cash: $${rem.toFixed(2)}\n`;
    });
    const unassigned = sortedBills.filter(b => !b.routeTo);
    if (unassigned.length > 0) {
      text += `\n--- UNASSIGNED LIABILITIES ---\n`;
      unassigned.forEach(b => { text += ` - ${b.name} (${b.due}) [$${b.cost.toFixed(2)} | ${b.frequency}]\n`; if(b.note) text += `    Note: ${b.note}\n`; });
    }
    return text;
  };

  const handleShareExport = async () => {
    const text = generateReport();
    if (navigator.share) { try { await navigator.share({ title: 'Sovereign Budget', text }); return; } catch(e){} }
    window.location.href = `mailto:?subject=Detailed Budget Ledger&body=${encodeURIComponent(text)}`;
  };

  const saveSnapshot = () => {
    const now = new Date();
    const snap = {
      id: `hist_${Date.now()}`,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pool: totalCashPool,
      liability: totalLiability,
      available: availableCash,
      report: generateReport()
    };
    setHistory([snap, ...history]);
    alert("Budget Snapshot Archived Successfully!");
    setActiveTab('archive');
  };

  // --- RENDERERS ---
  const renderDashboard = () => {
    const unassignedBills = sortedBills.filter(b => !b.routeTo);
    return (
      <div style={{ marginTop: '20px' }}>
        <div style={{ ...glassCard, borderTop: '4px solid #a855f7', textAlign: 'center' }}>
          <h4 style={{ color: '#a855f7', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Cash Pool</h4>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '2.5rem' }}>${totalCashPool.toFixed(2)}</h2>
        </div>
        <div style={{ ...glassCard, borderTop: '4px solid #ef4444', textAlign: 'center', padding: '15px' }}>
          <h4 style={{ color: '#ef4444', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Liability</h4>
          <h2 style={{ color: '#ef4444', margin: 0, fontSize: '1.8rem' }}>${totalLiability.toFixed(2)}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <div style={{ ...glassCard, borderTop: '4px solid #f59e0b', textAlign: 'center', margin: 0, padding: '15px' }}>
            <h4 style={{ color: '#f59e0b', margin: '0 0 5px 0', fontSize: '0.85rem' }}>USED CASH</h4>
            <h2 style={{ color: '#fff', margin: 0 }}>${usedCash.toFixed(2)}</h2>
          </div>
          <div style={{ ...glassCard, borderTop: '4px solid #10b981', textAlign: 'center', margin: 0, padding: '15px' }}>
            <h4 style={{ color: '#10b981', margin: '0 0 5px 0', fontSize: '0.85rem' }}>AVAILABLE</h4>
            <h2 style={{ color: '#10b981', margin: 0 }}>${availableCash.toFixed(2)}</h2>
          </div>
        </div>
        
        <button onClick={() => setShowLedger(!showLedger)} style={{ width: '100%', background: showLedger ? '#222' : '#3b82f6', color: '#fff', border: showLedger ? '1px solid #444' : 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '20px', transition: '0.2s' }}>
          {showLedger ? 'Hide Envelope Ledger' : 'Preview Envelope Ledger'}
        </button>
        
        {showLedger && (
          <div style={{ background: 'rgba(0,0,0,0.6)', borderRadius: '12px', padding: '15px', border: '1px solid #333', marginBottom: '20px' }}>
            {sortedIncomes.length === 0 && <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic', margin: '10px 0' }}>No ledgers established.</p>}
            {sortedIncomes.map(inc => {
              const routedBills = sortedBills.filter(b => b.routeTo === inc.id);
              const remaining = inc.amount - routedBills.reduce((sum, b) => sum + b.cost, 0);
              return (
                <div key={inc.id} style={{ marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #10b981', paddingBottom: '8px', marginBottom: '12px' }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.1rem' }}>{inc.name} <span style={{fontSize:'0.8rem', color:'#888'}}>({inc.date})</span></span>
                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>${inc.amount.toFixed(2)}</span>
                  </div>
                  {routedBills.length === 0 ? <p style={{ color: '#666', fontStyle: 'italic', fontSize: '0.9rem', margin: '5px 0' }}>No bills assigned to this check.</p> : (
                    routedBills.map(b => (
                      <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingLeft: '10px', borderLeft: '2px solid #ef4444' }}>
                        <span style={{ color: '#ccc', fontSize: '0.95rem' }}>{b.name}</span>
                        <span style={{ color: '#ef4444', fontWeight: 'bold' }}>-${b.cost.toFixed(2)}</span>
                      </div>
                    ))
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', background: '#111', padding: '8px', borderRadius: '6px' }}>
                    <span style={{ color: '#888', fontSize: '0.95rem' }}>Remaining:</span>
                    <span style={{ color: remaining < 0 ? '#ef4444' : '#06b6d4', fontWeight: 'bold' }}>${remaining.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
            {unassignedBills.length > 0 && (
              <div style={{ marginTop: '20px', borderTop: '2px dashed #ef4444', paddingTop: '15px' }}>
                <h4 style={{ color: '#ef4444', textTransform: 'uppercase', margin: '0 0 15px 0' }}>⚠️ Unassigned Liabilities</h4>
                {unassignedBills.map(b => (
                  <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingLeft: '10px' }}>
                    <span style={{ color: '#aaa', fontSize: '0.95rem' }}>{b.name}</span>
                    <span style={{ color: '#ef4444', fontWeight: 'bold' }}>${b.cost.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderManage = () => (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ color: '#10b981', textTransform: 'uppercase', textAlign: 'center', marginBottom: '15px', letterSpacing: '1px' }}>Manage Income</h3>
      {sortedIncomes.length === 0 && <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No incomes logged.</p>}
      {sortedIncomes.map(inc => (
        <div key={inc.id} style={{ ...glassCard, borderLeft: '4px solid #10b981', padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ color: '#10b981', margin: 0, fontSize: '1.1rem' }}>{inc.name} <span style={{fontSize:'0.8rem', color:'#888'}}>({inc.date})</span></h3>
            <h3 style={{ margin: 0, color: '#fff' }}>${inc.amount.toFixed(2)}</h3>
          </div>
          <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '0 0 5px 0' }}>Cycle: {inc.frequency}</p>
          {inc.note && <p style={{ color: '#888', fontSize: '0.85rem', margin: '0 0 10px 0', fontStyle: 'italic' }}>"{inc.note}"</p>}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button onClick={() => handleAdvanceIncome(inc.id)} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Advance 📅</button>
            <button onClick={() => deleteIncome(inc.id)} style={{ background: '#222', color: '#ef4444', border: '1px solid #333', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold' }}>🗑️</button>
          </div>
        </div>
      ))}

      <h3 style={{ color: '#ef4444', textTransform: 'uppercase', textAlign: 'center', marginTop: '35px', marginBottom: '15px', letterSpacing: '1px' }}>Manage Bills</h3>
      {sortedBills.length === 0 && <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No liabilities logged.</p>}
      {sortedBills.map(bill => (
        <div key={bill.id} style={{ ...glassCard, borderLeft: '4px solid #ef4444', padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ color: '#ef4444', margin: 0, fontSize: '1.1rem', textDecoration: bill.isPaid ? 'line-through' : 'none' }}>{bill.name} <span style={{fontSize:'0.8rem', color:'#888'}}>({bill.due})</span></h3>
            <h3 style={{ margin: 0, color: '#fff', textDecoration: bill.isPaid ? 'line-through' : 'none' }}>${bill.cost.toFixed(2)}</h3>
          </div>
          <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '0 0 5px 0' }}>Cycle: {bill.frequency}</p>
          {bill.note && <p style={{ color: '#888', fontSize: '0.85rem', margin: '0 0 10px 0', fontStyle: 'italic' }}>"{bill.note}"</p>}
          
          <div style={{ background: '#000', padding: '10px', borderRadius: '8px', marginTop: '10px', border: '1px solid #333' }}>
            <span style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Route To Ledger:</span>
            <select value={bill.routeTo} onChange={(e) => updateBillRoute(bill.id, e.target.value)} style={{ background: '#111', color: '#10b981', border: '1px solid #444', padding: '10px', borderRadius: '6px', width: '100%', fontSize: '0.9rem' }}>
              <option value="">⚠️ Unassigned</option>
              {sortedIncomes.map(inc => <option key={inc.id} value={inc.id}>{inc.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px' }}>
            <button onClick={() => togglePaidStatus(bill.id)} style={{ background: bill.isPaid ? '#222' : '#3b82f6', color: '#fff', border: '1px solid #444', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>{bill.isPaid ? 'Unmark' : 'Mark Paid ✅'}</button>
            <button onClick={() => handleAdvanceBill(bill.id)} style={{ background: '#10b981', color: '#000', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Pay & Advance 📅</button>
            <button onClick={() => deleteBill(bill.id)} style={{ background: '#222', color: '#ef4444', border: '1px solid #333', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold' }}>🗑️</button>
          </div>
        </div>
      ))}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '25px 0' }}>
        <button onClick={() => { setShowIncomeForm(!showIncomeForm); setShowBillForm(false); }} style={{ background: showIncomeForm ? '#222' : '#10b981', color: showIncomeForm ? '#fff' : '#000', border: showIncomeForm ? '1px solid #444' : 'none', padding: '15px', borderRadius: '10px', fontWeight: 'bold' }}>{showIncomeForm ? 'Cancel' : '+ Add Income'}</button>
        <button onClick={() => { setShowBillForm(!showBillForm); setShowIncomeForm(false); }} style={{ background: showBillForm ? '#222' : '#ef4444', color: '#fff', border: showBillForm ? '1px solid #444' : 'none', padding: '15px', borderRadius: '10px', fontWeight: 'bold' }}>{showBillForm ? 'Cancel' : '+ Add Bill'}</button>
      </div>

      {showIncomeForm && (
        <div style={{ ...glassCard, borderTop: '4px solid #10b981' }}>
          <h3 style={{ color: '#10b981', marginTop: 0, textTransform: 'uppercase' }}>Log Income</h3>
          <input type="text" placeholder="Name (e.g. Day Job)" value={incomeName} onChange={e=>setIncomeName(e.target.value)} style={inputStyle} />
          <input type="number" placeholder="Amount ($)" value={incomeAmount} onChange={e=>setIncomeAmount(e.target.value)} style={inputStyle} />
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input type="date" value={incomeDate} onChange={e=>setIncomeDate(e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
            <select value={incomeFrequency} onChange={e=>setIncomeFrequency(e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }}>
              {freqOptions.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <input type="text" placeholder="Notes..." value={incomeNote} onChange={e=>setIncomeNote(e.target.value)} style={inputStyle} />
          <button onClick={handleAddIncome} style={{ width: '100%', background: '#10b981', color: '#000', padding: '15px', borderRadius: '8px', fontWeight: 'bold', border: 'none', fontSize: '1.1rem' }}>Save Income</button>
        </div>
      )}

      {showBillForm && (
        <div style={{ ...glassCard, borderTop: '4px solid #ef4444' }}>
          <h3 style={{ color: '#ef4444', marginTop: 0, textTransform: 'uppercase' }}>Log Liability</h3>
          <input type="text" placeholder="Name (e.g. Rent)" value={billName} onChange={e=>setBillName(e.target.value)} style={inputStyle} />
          <input type="number" placeholder="Cost ($)" value={billCost} onChange={e=>setBillCost(e.target.value)} style={inputStyle} />
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input type="date" value={billDue} onChange={e=>setBillDue(e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
            <select value={billFrequency} onChange={e=>setBillFrequency(e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }}>
              {freqOptions.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <input type="text" placeholder="Notes..." value={billNote} onChange={e=>setBillNote(e.target.value)} style={inputStyle} />
          <button onClick={handleAddBill} style={{ width: '100%', background: '#ef4444', color: '#fff', padding: '15px', borderRadius: '8px', fontWeight: 'bold', border: 'none', fontSize: '1.1rem' }}>Save Liability</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#06b6d4', fontSize: '1.2rem' }}>Cashflow Engine</h2>
      </header>

      <div style={{ display: 'flex', padding: '15px', gap: '8px', background: 'rgba(0,0,0,0.6)', overflowX: 'auto' }}>
        <button onClick={() => setActiveTab('dashboard')} style={{ background: activeTab === 'dashboard' ? '#06b6d4' : '#222', color: activeTab === 'dashboard' ? '#000' : '#888', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', flex: '0 0 auto' }}>Dashboard</button>
        <button onClick={() => setActiveTab('manage')} style={{ background: activeTab === 'manage' ? '#a855f7' : '#222', color: activeTab === 'manage' ? '#fff' : '#888', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', flex: '0 0 auto' }}>Manage</button>
        <button onClick={() => setActiveTab('archive')} style={{ background: activeTab === 'archive' ? '#f59e0b' : '#222', color: activeTab === 'archive' ? '#000' : '#888', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', flex: '0 0 auto' }}>Archive</button>
        <button onClick={() => setActiveTab('export')} style={{ background: activeTab === 'export' ? '#3b82f6' : '#222', color: activeTab === 'export' ? '#fff' : '#888', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', flex: '0 0 auto' }}>Export</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'manage' && renderManage()}
        
        {activeTab === 'archive' && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#f59e0b', textTransform: 'uppercase', textAlign: 'center', marginBottom: '15px', letterSpacing: '1px' }}>Historical Snapshots</h3>
            {history.length === 0 ? <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No past budgets archived.</p> : (
              history.map(snap => (
                <div key={snap.id} style={{ ...glassCard, borderLeft: '4px solid #f59e0b', padding: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, color: '#f59e0b', fontSize: '1.1rem' }}>{snap.date} <span style={{fontSize:'0.8rem', color:'#888'}}>({snap.time})</span></h3>
                    <button onClick={() => setHistory(history.filter(h => h.id !== snap.id))} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>×</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #333', marginBottom: '10px' }}>
                    <div><span style={{ color: '#888', fontSize: '0.75rem', display: 'block' }}>POOL</span><span style={{ color: '#fff', fontWeight: 'bold' }}>${snap.pool.toFixed(2)}</span></div>
                    <div><span style={{ color: '#888', fontSize: '0.75rem', display: 'block' }}>AVAILABLE</span><span style={{ color: '#10b981', fontWeight: 'bold' }}>${snap.available.toFixed(2)}</span></div>
                  </div>
                  <button onClick={() => setExpandedHistory(expandedHistory === snap.id ? null : snap.id)} style={{ width: '100%', background: '#222', color: '#f59e0b', border: '1px dashed #f59e0b', padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>
                    {expandedHistory === snap.id ? 'Hide Full Ledger' : 'View Full Ledger'}
                  </button>
                  {expandedHistory === snap.id && (
                    <div style={{ background: '#0a0a0a', color: '#ccc', padding: '15px', borderRadius: '8px', marginTop: '10px', fontSize: '0.85rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', border: '1px solid #333' }}>
                      {snap.report}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'export' && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <h3 style={{ color: '#3b82f6', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '1px' }}>Export / Archive</h3>
            
            <button onClick={saveSnapshot} style={{ background: '#f59e0b', color: '#000', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', width: '100%', marginBottom: '20px' }}>
              💾 Save Budget Snapshot
            </button>
            
            <div style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid #333', padding: '15px', borderRadius: '12px', fontSize: '0.85rem', fontFamily: 'monospace', textAlign: 'left', whiteSpace: 'pre-wrap', marginBottom: '20px', lineHeight: '1.5' }}>{generateReport()}</div>
            
            <button onClick={handleShareExport} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', width: '100%' }}>
              📤 Email / Export Text
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
