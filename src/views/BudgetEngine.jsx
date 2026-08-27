import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BudgetEngine() {
  const navigate = useNavigate();
  // Tabs: 'dashboard' (Mom's View), 'manage' (Edit/Add/Sync), 'export'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [incomes, setIncomes] = useState(() => JSON.parse(localStorage.getItem('tot_incomes')) || []);
  const [bills, setBills] = useState(() => JSON.parse(localStorage.getItem('tot_bills')) || []);

  const [incomeName, setIncomeName] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDate, setIncomeDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [incomeFrequency, setIncomeFrequency] = useState('Bi-Weekly');
  const [incomeNote, setIncomeNote] = useState('');

  const [billName, setBillName] = useState('');
  const [billCost, setBillCost] = useState('');
  const [billDue, setBillDue] = useState(() => new Date().toISOString().substring(0, 10));
  const [billFrequency, setBillFrequency] = useState('Monthly');
  const [billNote, setBillNote] = useState('');

  useEffect(() => { localStorage.setItem('tot_incomes', JSON.stringify(incomes)); }, [incomes]);
  useEffect(() => { localStorage.setItem('tot_bills', JSON.stringify(bills)); }, [bills]);

  const sortedIncomes = [...incomes].sort((a, b) => new Date(a.date) - new Date(b.date));
  const sortedBills = [...bills].sort((a, b) => new Date(a.due) - new Date(b.due));

  // --- THE PERFECTED OMNISCIENT MATH ---
  const totalCashPool = incomes.reduce((acc, inc) => acc + inc.amount, 0);
  const totalLiability = bills.filter(b => !b.routeTo && !b.isPaid).reduce((acc, b) => acc + b.cost, 0);
  const usedCash = bills.filter(b => b.routeTo || b.isPaid).reduce((acc, b) => acc + b.cost, 0);
  const availableCash = totalCashPool - usedCash - totalLiability;

  // --- ACTIONS ---
  const handleAddIncome = () => {
    if (!incomeName || !incomeAmount) return;
    setIncomes([...incomes, { id: `inc_${Date.now()}`, name: incomeName, amount: parseFloat(incomeAmount), date: incomeDate, frequency: incomeFrequency, note: incomeNote }]);
    setIncomeName(''); setIncomeAmount(''); setIncomeNote('');
  };

  const handleAddBill = () => {
    if (!billName || !billCost) return;
    setBills([...bills, { id: `bill_${Date.now()}`, name: billName, cost: parseFloat(billCost), due: billDue, frequency: billFrequency, routeTo: '', note: billNote, isPaid: false }]);
    setBillName(''); setBillCost(''); setBillNote('');
  };

  const deleteIncome = (id) => {
    if (bills.some(b => b.routeTo === id)) return alert("Cannot delete an income that has bills routed to it. Unassign them first.");
    setIncomes(incomes.filter(i => i.id !== id));
  };
  const deleteBill = (id) => setBills(bills.filter(b => b.id !== id));

  const updateBillRoute = (billId, incomeId) => setBills(bills.map(b => b.id === billId ? { ...b, routeTo: incomeId } : b));
  const togglePaidStatus = (billId) => setBills(bills.map(b => b.id === billId ? { ...b, isPaid: !b.isPaid } : b));

  const manualSyncToCalendar = (item, type) => {
    const existing = JSON.parse(localStorage.getItem('tot_calendar_events')) || [];
    const newEvent = { id: `sync_${Date.now()}`, date: item.date || item.due, title: `${type}: ${item.name}`, amount: item.amount || item.cost, color: type === 'Income' ? '#10b981' : '#ef4444' };
    localStorage.setItem('tot_calendar_events', JSON.stringify([...existing, newEvent]));
    alert(`${item.name} synced to Master Calendar!`);
  };

  const generateReport = () => {
    let text = `=== DETAILED BUDGET LEDGER ===\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
    text += `GLOBAL CASH POOL: $${totalCashPool.toFixed(2)}\n`;
    text += `TOTAL LIABILITY:  $${totalLiability.toFixed(2)}\n`;
    text += `USED CASH:        $${usedCash.toFixed(2)}\n`;
    text += `UNASSIGNED CASH:  $${availableCash.toFixed(2)}\n\n`;
    text += `-- ENVELOPE LEDGER --\n`;
    sortedIncomes.forEach(i => {
      text += `\n[ ${i.name} (${i.date}) | +$${i.amount.toFixed(2)} ]\n`;
      const routed = sortedBills.filter(b => b.routeTo === i.id);
      let rem = i.amount;
      if (routed.length === 0) text += `  No bills assigned.\n`;
      routed.forEach(b => { text += `  - ${b.name} (${b.due}): -$${b.cost.toFixed(2)} ${b.isPaid ? '(PAID)' : ''}\n`; rem -= b.cost; });
      text += `  Remaining Cash: $${rem.toFixed(2)}\n`;
    });
    const unassigned = sortedBills.filter(b => !b.routeTo);
    if (unassigned.length > 0) {
      text += `\n-- UNASSIGNED LIABILITIES --\n`;
      unassigned.forEach(b => text += `  - ${b.name} (${b.due}): -$${b.cost.toFixed(2)} ${b.isPaid ? '(PAID)' : ''}\n`);
    }
    return text;
  };

  const handleShareExport = async () => {
    const text = generateReport();
    if (navigator.share) { try { await navigator.share({ title: 'Sovereign Budget', text }); return; } catch(e){} }
    window.location.href = `mailto:?subject=Detailed Budget Ledger&body=${encodeURIComponent(text)}`;
  };

  // --- STYLES ---
  const glassCard = { background: 'rgba(17, 17, 17, 0.6)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '20px', marginBottom: '15px' };
  const inputStyle = { background: 'transparent', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '6px', width: '100%', marginBottom: '15px' };
  
  // --- VIEWS ---
  const DashboardView = () => {
    const unassignedBills = sortedBills.filter(b => !b.routeTo);
    return (
      <div style={{ marginTop: '20px' }}>
        {/* Top Metric Cards */}
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '15px', textAlign: 'center', marginBottom: '10px' }}>
          <h4 style={{ color: '#888', margin: '0 0 5px 0', textTransform: 'uppercase', fontSize: '0.8rem' }}>Global Cash Pool</h4>
          <h2 style={{ color: '#10b981', margin: 0 }}>${totalCashPool.toFixed(2)}</h2>
        </div>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '15px', textAlign: 'center', marginBottom: '15px' }}>
          <h4 style={{ color: '#888', margin: '0 0 5px 0', textTransform: 'uppercase', fontSize: '0.8rem' }}>Total Unassigned Cash</h4>
          <h2 style={{ color: '#06b6d4', margin: 0 }}>${availableCash.toFixed(2)}</h2>
        </div>
        
        <button onClick={() => setActiveTab('manage')} style={{ background: '#06b6d4', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '20px' }}>✏️ Edit Ledgers</button>

        {/* The Classic Envelope Ledger */}
        <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '15px', border: '1px solid #222' }}>
          {sortedIncomes.length === 0 && <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No ledgers established.</p>}
          
          {sortedIncomes.map(inc => {
            const routedBills = sortedBills.filter(b => b.routeTo === inc.id);
            const remaining = inc.amount - routedBills.reduce((sum, b) => sum + b.cost, 0);
            
            return (
              <div key={inc.id} style={{ marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #10b981', paddingBottom: '5px', marginBottom: '8px' }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.1rem' }}>{inc.name} ({inc.date})</span>
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>${inc.amount.toFixed(2)}</span>
                </div>
                
                {routedBills.length === 0 ? (
                  <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', fontSize: '0.9rem', margin: '10px 0' }}>No bills assigned to this check.</p>
                ) : (
                  routedBills.map(b => (
                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', opacity: b.isPaid ? 0.5 : 1 }}>
                      <span style={{ color: '#fff', fontSize: '1rem' }}>- {b.name} ({b.due}) {b.isPaid && '✅'}</span>
                      <span style={{ color: '#ef4444', fontWeight: 'bold' }}>${b.cost.toFixed(2)}</span>
                    </div>
                  ))
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ color: '#ccc', fontSize: '1rem' }}>Remaining Cash:</span>
                  <span style={{ color: '#06b6d4', fontWeight: 'bold', fontSize: '1.1rem' }}>${remaining.toFixed(2)}</span>
                </div>
              </div>
            );
          })}

          {/* Unassigned Liabilities Block */}
          {unassignedBills.length > 0 && (
            <div style={{ marginTop: '30px', borderTop: '2px dashed #ef4444', paddingTop: '15px' }}>
              <h4 style={{ color: '#ef4444', textAlign: 'center', textTransform: 'uppercase', margin: '0 0 15px 0' }}>Unassigned Liabilities</h4>
              {unassignedBills.map(b => (
                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', opacity: b.isPaid ? 0.5 : 1 }}>
                  <span style={{ color: '#fff', fontSize: '1rem' }}>- {b.name} ({b.due}) {b.isPaid && '✅'}</span>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>${b.cost.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const ManageView = () => (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <div style={{ ...glassCard, borderTop: '4px solid #10b981', margin: 0, padding: '15px' }}>
          <h4 style={{ color: '#10b981', marginTop: 0, textTransform: 'uppercase' }}>Log Income</h4>
          <input type="text" placeholder="Name" value={incomeName} onChange={e=>setIncomeName(e.target.value)} style={{...inputStyle, marginBottom:'8px'}} />
          <input type="number" placeholder="Amount ($)" value={incomeAmount} onChange={e=>setIncomeAmount(e.target.value)} style={{...inputStyle, marginBottom:'8px'}} />
          <input type="date" value={incomeDate} onChange={e=>setIncomeDate(e.target.value)} style={{...inputStyle, marginBottom:'8px'}} />
          <button onClick={handleAddIncome} style={{ width: '100%', background: '#10b981', color: '#000', padding: '10px', borderRadius: '8px', fontWeight: 'bold', border: 'none' }}>Save</button>
        </div>
        <div style={{ ...glassCard, borderTop: '4px solid #ef4444', margin: 0, padding: '15px' }}>
          <h4 style={{ color: '#ef4444', marginTop: 0, textTransform: 'uppercase' }}>Log Liability</h4>
          <input type="text" placeholder="Name" value={billName} onChange={e=>setBillName(e.target.value)} style={{...inputStyle, marginBottom:'8px'}} />
          <input type="number" placeholder="Cost ($)" value={billCost} onChange={e=>setBillCost(e.target.value)} style={{...inputStyle, marginBottom:'8px'}} />
          <input type="date" value={billDue} onChange={e=>setBillDue(e.target.value)} style={{...inputStyle, marginBottom:'8px'}} />
          <button onClick={handleAddBill} style={{ width: '100%', background: '#ef4444', color: '#fff', padding: '10px', borderRadius: '8px', fontWeight: 'bold', border: 'none' }}>Save</button>
        </div>
      </div>

      <h3 style={{ color: '#a855f7', textTransform: 'uppercase', textAlign: 'center', marginBottom: '15px' }}>Manage Income Ledgers</h3>
      {sortedIncomes.map(inc => (
        <div key={inc.id} style={{ ...glassCard, borderLeft: '4px solid #10b981', padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ color: '#a855f7', margin: 0 }}>{inc.name} ({inc.date})</h3>
            <div style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 'bold' }}>${inc.amount.toFixed(2)}</div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={() => manualSyncToCalendar(inc, 'Income')} style={{ background: '#a855f7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold' }}>Sync 📅</button>
            <button onClick={() => deleteIncome(inc.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>×</button>
          </div>
        </div>
      ))}

      <h3 style={{ color: '#a855f7', textTransform: 'uppercase', textAlign: 'center', marginTop: '20px', marginBottom: '15px' }}>Manage Bills</h3>
      {sortedBills.map(bill => (
        <div key={bill.id} style={{ ...glassCard, borderLeft: '4px solid #ef4444', padding: '15px', opacity: bill.isPaid ? 0.6 : 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ color: '#a855f7', margin: 0, textDecoration: bill.isPaid ? 'line-through' : 'none' }}>{bill.name} ({bill.due})</h3>
            <div style={{ color: '#ef4444', fontSize: '1.2rem', fontWeight: 'bold', textDecoration: bill.isPaid ? 'line-through' : 'none' }}>${bill.cost.toFixed(2)}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <span style={{ color: '#888', fontSize: '0.9rem' }}>Route To:</span>
            <select value={bill.routeTo} onChange={(e) => updateBillRoute(bill.id, e.target.value)} style={{ background: '#000', color: '#3b82f6', border: '1px solid #333', padding: '8px', borderRadius: '6px', flex: 1 }}>
              <option value="">Unassigned</option>
              {sortedIncomes.map(inc => <option key={inc.id} value={inc.id}>{inc.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={() => togglePaidStatus(bill.id)} style={{ background: bill.isPaid ? '#333' : '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold' }}>{bill.isPaid ? 'Mark Unpaid' : 'Mark Paid ✅'}</button>
            <button onClick={() => manualSyncToCalendar(bill, 'Bill')} style={{ background: '#a855f7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold' }}>Sync 📅</button>
            <button onClick={() => deleteBill(bill.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>×</button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.8)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#06b6d4', fontSize: '1.2rem' }}>Cashflow Engine</h2>
      </header>

      <div style={{ display: 'flex', padding: '15px', gap: '8px', background: 'rgba(0,0,0,0.5)', overflowX: 'auto' }}>
        <button onClick={() => setActiveTab('dashboard')} style={{ background: activeTab === 'dashboard' ? '#06b6d4' : '#222', color: activeTab === 'dashboard' ? '#000' : '#888', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', flex: 1 }}>Dashboard</button>
        <button onClick={() => setActiveTab('manage')} style={{ background: activeTab === 'manage' ? '#a855f7' : '#222', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', flex: 1 }}>Manage</button>
        <button onClick={() => setActiveTab('export')} style={{ background: activeTab === 'export' ? '#3b82f6' : '#222', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', flex: 1 }}>Export</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'manage' && <ManageView />}
        {activeTab === 'export' && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <h3 style={{ color: '#3b82f6', textTransform: 'uppercase', marginBottom: '15px' }}>Detailed Export Preview</h3>
            <div style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid #333', padding: '15px', borderRadius: '12px', width: '100%', fontSize: '0.85rem', fontFamily: 'monospace', textAlign: 'left', whiteSpace: 'pre-wrap', marginBottom: '20px', lineHeight: '1.5' }}>{generateReport()}</div>
            <button onClick={handleShareExport} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', width: '100%' }}>📤 Email / Export Report</button>
          </div>
        )}
      </div>
    </div>
  );
}
