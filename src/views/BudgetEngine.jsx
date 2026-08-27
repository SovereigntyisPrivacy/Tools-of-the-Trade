import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BudgetEngine() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Persistence
  const [incomes, setIncomes] = useState(() => JSON.parse(localStorage.getItem('tot_incomes')) || []);
  const [bills, setBills] = useState(() => JSON.parse(localStorage.getItem('tot_bills')) || []);

  // Form State
  const [incomeName, setIncomeName] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDate, setIncomeDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [incomeFrequency, setIncomeFrequency] = useState('Bi-Weekly');

  const [billName, setBillName] = useState('');
  const [billCost, setBillCost] = useState('');
  const [billDue, setBillDue] = useState(() => new Date().toISOString().substring(0, 10));
  const [billFrequency, setBillFrequency] = useState('Monthly');

  // Auto-save to LocalStorage
  useEffect(() => { localStorage.setItem('tot_incomes', JSON.stringify(incomes)); }, [incomes]);
  useEffect(() => { localStorage.setItem('tot_bills', JSON.stringify(bills)); }, [bills]);

  // Auto-Sort by Date
  const sortedIncomes = [...incomes].sort((a, b) => new Date(a.date) - new Date(b.date));
  const sortedBills = [...bills].sort((a, b) => new Date(a.due) - new Date(b.due));

  // The 4 Core Metrics
  const totalCashPool = incomes.reduce((acc, inc) => acc + inc.amount, 0);
  const totalLiability = bills.reduce((acc, b) => acc + b.cost, 0);
  const usedCash = bills.filter(b => b.routeTo).reduce((acc, b) => acc + b.cost, 0);
  const availableCash = totalCashPool - usedCash;

  // --- ACTIONS ---
  const handleAddIncome = () => {
    if (!incomeName || !incomeAmount) return;
    setIncomes([...incomes, { id: `inc_${Date.now()}`, name: incomeName, amount: parseFloat(incomeAmount), date: incomeDate, frequency: incomeFrequency }]);
    setIncomeName(''); setIncomeAmount(''); setActiveTab('ledger');
  };

  const handleAddBill = () => {
    if (!billName || !billCost) return;
    setBills([...bills, { id: `bill_${Date.now()}`, name: billName, cost: parseFloat(billCost), due: billDue, frequency: billFrequency, routeTo: '' }]);
    setBillName(''); setBillCost(''); setActiveTab('ledger');
  };

  const deleteIncome = (id) => {
    if (bills.some(b => b.routeTo === id)) return alert("Cannot delete an income that has bills routed to it. Unassign them first.");
    setIncomes(incomes.filter(i => i.id !== id));
  };
  
  const deleteBill = (id) => setBills(bills.filter(b => b.id !== id));

  const updateBillRoute = (billId, incomeId) => {
    setBills(bills.map(b => b.id === billId ? { ...b, routeTo: incomeId } : b));
  };

  const manualSyncToCalendar = (item, type) => {
    const existing = JSON.parse(localStorage.getItem('tot_calendar_events')) || [];
    const newEvent = {
       id: `sync_${Date.now()}`,
       date: item.date || item.due,
       title: `${type}: ${item.name}`,
       amount: item.amount || item.cost,
       color: type === 'Income' ? '#10b981' : '#ef4444'
    };
    localStorage.setItem('tot_calendar_events', JSON.stringify([...existing, newEvent]));
    alert(`${item.name} synced to Master Calendar!`);
  };

  // --- NATIVE SHARE / EXPORT ---
  const exportDetailedLedger = async () => {
    let text = `=== DETAILED BUDGET LEDGER ===\nTotal Cash Pool: $${totalCashPool.toFixed(2)}\nTotal Liability: $${totalLiability.toFixed(2)}\nUsed Cash: $${usedCash.toFixed(2)}\nAvailable Cash: $${availableCash.toFixed(2)}\n\n-- INCOMES --\n`;
    sortedIncomes.forEach(i => text += `+ $${i.amount.toFixed(2)} | ${i.name} (${i.date})\n`);
    text += `\n-- BILLS --\n`;
    sortedBills.forEach(b => {
      const routeName = b.routeTo ? incomes.find(i => i.id === b.routeTo)?.name || 'Unknown' : 'UNASSIGNED';
      text += `- $${b.cost.toFixed(2)} | ${b.name} (${b.due}) [Route: ${routeName}]\n`;
    });
    
    if (navigator.share) {
      try { await navigator.share({ title: 'Sovereign Budget', text }); return; } catch(e){}
    }
    window.location.href = `mailto:?subject=Detailed Budget Ledger&body=${encodeURIComponent(text)}`;
  };

  // --- STYLES ---
  const glassCard = { background: 'rgba(17, 17, 17, 0.6)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '20px', marginBottom: '15px' };
  const inputStyle = { background: 'transparent', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '6px', width: '100%', marginBottom: '15px' };
  
  // --- VIEWS ---
  const DashboardView = () => (
    <div style={{ marginTop: '20px' }}>
      <div style={{ ...glassCard, border: '1px solid #a855f7', textAlign: 'center' }}>
        <h4 style={{ color: '#a855f7', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Total Cash Pool</h4>
        <h1 style={{ color: '#fff', margin: 0, fontSize: '2.5rem' }}>${totalCashPool.toFixed(2)}</h1>
      </div>
      
      <div style={{ ...glassCard, border: '1px solid #ef4444', textAlign: 'center', padding: '15px' }}>
        <h4 style={{ color: '#ef4444', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Total Liability</h4>
        <h2 style={{ color: '#ef4444', margin: 0 }}>${totalLiability.toFixed(2)}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
        <div style={{ ...glassCard, border: '1px solid #ef4444', textAlign: 'center', margin: 0 }}>
          <h4 style={{ color: '#ef4444', margin: '0 0 5px 0', fontSize: '0.85rem' }}>USED CASH</h4>
          <h2 style={{ color: '#fff', margin: 0 }}>${usedCash.toFixed(2)}</h2>
        </div>
        <div style={{ ...glassCard, border: '1px solid #10b981', textAlign: 'center', margin: 0 }}>
          <h4 style={{ color: '#10b981', margin: '0 0 5px 0', fontSize: '0.85rem' }}>AVAILABLE CASH</h4>
          <h2 style={{ color: '#fff', margin: 0 }}>${availableCash.toFixed(2)}</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
        <button onClick={() => setActiveTab('add-inc')} style={{ background: '#10b981', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}>+ Income</button>
        <button onClick={() => setActiveTab('add-bill')} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}>+ Bill</button>
      </div>
      <button onClick={() => setActiveTab('history')} style={{ width: '100%', background: 'transparent', color: '#3b82f6', border: '1px solid #3b82f6', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}>View Detailed Ledger</button>
    </div>
  );

  const HistoryView = () => (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <h3 style={{ color: '#a855f7', textTransform: 'uppercase' }}>Detailed Export</h3>
      <p style={{ color: '#888', marginBottom: '20px' }}>Export a fully itemized breakdown of your cash pool, routed bills, and unassigned liabilities.</p>
      <button onClick={exportDetailedLedger} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', width: '100%' }}>📤 Email / Export Report</button>
    </div>
  );

  const LedgerView = () => (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ color: '#a855f7', textTransform: 'uppercase', textAlign: 'center', marginBottom: '15px' }}>INCOME SOURCES</h3>
      {sortedIncomes.map(inc => (
        <div key={inc.id} style={{ ...glassCard, borderLeft: '4px solid #10b981', padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
            <div>
              <h3 style={{ color: '#a855f7', margin: '0 0 5px 0' }}>{inc.name}</h3>
              <span style={{ background: '#111', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{inc.frequency}</span>
            </div>
            <div style={{ color: '#10b981', fontSize: '1.3rem', fontWeight: 'bold' }}>${inc.amount.toFixed(2)}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#ccc', fontSize: '1.1rem' }}>{inc.date}</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => manualSyncToCalendar(inc, 'Income')} style={{ background: '#a855f7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold' }}>Sync 📅</button>
              <button onClick={() => deleteIncome(inc.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>×</button>
            </div>
          </div>
        </div>
      ))}

      <h3 style={{ color: '#a855f7', textTransform: 'uppercase', textAlign: 'center', marginTop: '30px', marginBottom: '15px' }}>BILL LEDGER</h3>
      {sortedBills.map(bill => (
        <div key={bill.id} style={{ ...glassCard, borderLeft: '4px solid #ef4444', padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
            <div>
              <h3 style={{ color: '#a855f7', margin: '0 0 5px 0' }}>{bill.name}</h3>
              <span style={{ background: '#111', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{bill.frequency}</span>
            </div>
            <div style={{ color: '#ef4444', fontSize: '1.3rem', fontWeight: 'bold' }}>${bill.cost.toFixed(2)}</div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <span style={{ color: '#888' }}>Route To:</span>
            <select value={bill.routeTo} onChange={(e) => updateBillRoute(bill.id, e.target.value)} style={{ background: '#000', color: '#3b82f6', border: '1px solid #333', padding: '8px', borderRadius: '6px', flex: 1 }}>
              <option value="">Unassigned</option>
              {sortedIncomes.map(inc => <option key={inc.id} value={inc.id}>{inc.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#ccc', fontSize: '1.1rem' }}>Due: {bill.due}</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => manualSyncToCalendar(bill, 'Bill')} style={{ background: '#a855f7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold' }}>Sync 📅</button>
              <button onClick={() => deleteBill(bill.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>×</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.8)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#a855f7', fontSize: '1.2rem' }}>Budget Engine</h2>
      </header>

      <div style={{ display: 'flex', padding: '15px', gap: '8px', background: 'rgba(0,0,0,0.5)', overflowX: 'auto' }}>
        <button onClick={() => setActiveTab('dashboard')} style={{ background: activeTab === 'dashboard' ? '#3b82f6' : '#222', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', flex: 1 }}>Dashboard</button>
        <button onClick={() => setActiveTab('ledger')} style={{ background: activeTab === 'ledger' ? '#a855f7' : '#222', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', flex: 1 }}>Ledger</button>
        <button onClick={() => setActiveTab('history')} style={{ background: activeTab === 'history' ? '#333' : '#222', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', flex: 1 }}>History</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'ledger' && <LedgerView />}
        {activeTab === 'history' && <HistoryView />}
        
        {activeTab === 'add-inc' && (
          <div style={{ ...glassCard, borderTop: '4px solid #10b981', marginTop: '20px' }}>
            <h3 style={{ color: '#10b981', marginTop: 0 }}>LOG INCOME</h3>
            <input type="text" placeholder="Name (e.g. Work 1)" value={incomeName} onChange={e=>setIncomeName(e.target.value)} style={inputStyle} />
            <input type="number" placeholder="Amount ($)" value={incomeAmount} onChange={e=>setIncomeAmount(e.target.value)} style={inputStyle} />
            <input type="date" value={incomeDate} onChange={e=>setIncomeDate(e.target.value)} style={inputStyle} />
            <select value={incomeFrequency} onChange={e=>setIncomeFrequency(e.target.value)} style={inputStyle}>
              {['None', 'Weekly', 'Bi-Weekly', 'Monthly'].map(f => <option key={f}>{f}</option>)}
            </select>
            <button onClick={handleAddIncome} style={{ width: '100%', background: '#10b981', color: '#000', padding: '15px', borderRadius: '8px', fontWeight: 'bold', border: 'none' }}>Save Income</button>
          </div>
        )}

        {activeTab === 'add-bill' && (
          <div style={{ ...glassCard, borderTop: '4px solid #ef4444', marginTop: '20px' }}>
            <h3 style={{ color: '#ef4444', marginTop: 0 }}>LOG BILL</h3>
            <input type="text" placeholder="Name (e.g. Amazon)" value={billName} onChange={e=>setBillName(e.target.value)} style={inputStyle} />
            <input type="number" placeholder="Cost ($)" value={billCost} onChange={e=>setBillCost(e.target.value)} style={inputStyle} />
            <input type="date" value={billDue} onChange={e=>setBillDue(e.target.value)} style={inputStyle} />
            <select value={billFrequency} onChange={e=>setBillFrequency(e.target.value)} style={inputStyle}>
              {['None', 'Weekly', 'Bi-Weekly', 'Monthly'].map(f => <option key={f}>{f}</option>)}
            </select>
            <button onClick={handleAddBill} style={{ width: '100%', background: '#ef4444', color: '#fff', padding: '15px', borderRadius: '8px', fontWeight: 'bold', border: 'none' }}>Save Bill</button>
          </div>
        )}
      </div>
    </div>
  );
}
