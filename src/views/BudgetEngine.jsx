import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BudgetEngine() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Bulletproof Persistence & Migration
  const [incomes, setIncomes] = useState(() => {
    const newInc = JSON.parse(localStorage.getItem('tot_incomes'));
    if (newInc && newInc.length > 0) return newInc;
    return JSON.parse(localStorage.getItem('fleet_incomes')) || [];
  });
  
  const [bills, setBills] = useState(() => {
    const newBills = JSON.parse(localStorage.getItem('tot_bills'));
    if (newBills && newBills.length > 0) return newBills;
    return JSON.parse(localStorage.getItem('fleet_bills')) || [];
  });

  const [financialTotals, setFinancialTotals] = useState({ available: 0, committed: 0, pendingLiability: 0 });

  // Form States
  const [incomeName, setIncomeName] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDate, setIncomeDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [incomeFrequency, setIncomeFrequency] = useState('Monthly');

  const [billName, setBillName] = useState('');
  const [billCost, setBillCost] = useState('');
  const [billDue, setBillDue] = useState(() => new Date().toISOString().substring(0, 10));
  const [billFrequency, setBillFrequency] = useState('Monthly');
  const [selectedCheckId, setSelectedCheckId] = useState('');

  // Lock Data to Device Storage
  useEffect(() => { localStorage.setItem('tot_incomes', JSON.stringify(incomes)); }, [incomes]);
  useEffect(() => { localStorage.setItem('tot_bills', JSON.stringify(bills)); }, [bills]);
  useEffect(() => { calculateTotals(); }, [incomes, bills]);

  // --- OMNISCIENT CASH-FLOW ENGINE ---
  const calculateTotals = () => {
    const syncedIncomeTotal = incomes.reduce((sum, inc) => (inc.status === 'Synced' ? sum + inc.amount : sum), 0);
    const committedPaidTotal = bills.reduce((sum, bill) => (bill.sourceCheckId ? sum + bill.cost : sum), 0);
    const available = syncedIncomeTotal - committedPaidTotal;
    const pendingLiability = bills.reduce((sum, bill) => (bill.status !== 'Paid' && !bill.sourceCheckId ? sum + bill.cost : sum), 0);
    const committed = bills.reduce((sum, bill) => (bill.status === 'Paid' ? sum + bill.cost : sum), 0);
    setFinancialTotals({ available, committed, pendingLiability });
  };

  // --- ACTIONS ---
  const handleAddIncome = () => {
    if(!incomeName || !incomeAmount) return;
    setIncomes([{ id: Date.now(), name: incomeName, amount: parseFloat(incomeAmount), date: incomeDate, frequency: incomeFrequency, status: 'Synced' }, ...incomes]);
    setIncomeName(''); setIncomeAmount(''); setIncomeFrequency('Monthly'); setActiveTab('ledger');
  };

  const handleAddBill = () => {
    if(!billName || !billCost) return;
    setBills([{ id: Date.now(), name: billName, cost: parseFloat(billCost), due: billDue, frequency: billFrequency, sourceCheckId: selectedCheckId || null, status: 'Unpaid' }, ...bills]);
    setBillName(''); setBillCost(''); setBillFrequency('Monthly'); setSelectedCheckId(''); setActiveTab('ledger');
  };

  const markBillPaid = (id) => { if(window.confirm("Mark this bill PAID?")) setBills(bills.map(b => b.id === id ? {...b, status: 'Paid'} : b)); };
  const markBillUnpaid = (id) => { if(window.confirm("Move back to UNPAID liability?")) setBills(bills.map(b => b.id === id ? {...b, status: 'Unpaid'} : b)); };
  
  const deleteIncome = (id) => { 
     if(bills.some(b => b.sourceCheckId === id)) return alert("Error: Income is linked to active bills. Unlink them first.");
     if(window.confirm("Delete this income?")) setIncomes(incomes.filter(inc => inc.id !== id));
  };
  const deleteBill = (id) => { if(window.confirm("Delete this bill?")) setBills(bills.filter(b => b.id !== id)); };

  // --- ITEMIZED EXPORT & NATIVE SHARE ---
  const generateReport = () => {
    let report = `=== SOVEREIGN BUDGET REPORT ===\nDate: ${new Date().toLocaleDateString()}\n\n`;
    report += `AVAILABLE POOL: $${financialTotals.available.toFixed(2)}\n`;
    report += `PENDING LIABILITY: $${financialTotals.pendingLiability.toFixed(2)}\n`;
    report += `USED CASH: $${financialTotals.committed.toFixed(2)}\n\n`;
    report += `--- INCOMES ---\n`;
    if(incomes.length === 0) report += `No incomes logged.\n`;
    incomes.forEach(i => report += `+ $${i.amount.toFixed(2)} | ${i.name} (${i.frequency})\n`);
    report += `\n--- BILLS & LIABILITIES ---\n`;
    if(bills.length === 0) report += `No bills logged.\n`;
    bills.forEach(b => report += `- $${b.cost.toFixed(2)} | ${b.name} [${b.status.toUpperCase()}]\n`);
    return report;
  };

  const handleShareExport = async () => {
    const text = generateReport();
    if (navigator.share) {
      try { await navigator.share({ title: 'Sovereign Budget Report', text }); return; } catch (e) { /* user cancelled */ }
    }
    // Fallback if native share fails
    window.location.href = `mailto:?subject=Budget Report&body=${encodeURIComponent(text)}`;
  };

  // --- VIEWS ---
  const DashboardView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
      <div style={{ background: 'linear-gradient(145deg, #111, #1a1a1a)', border: '1px solid #333', borderRadius: '16px', padding: '30px', textAlign: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.5)' }}>
         <p style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 10px 0' }}>Available Cash</p>
         <h1 style={{ color: '#fff', fontSize: '3.5rem', margin: 0, fontWeight: '800' }}>${financialTotals.available.toFixed(2)}</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
         <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 'bold', margin: '0 0 5px 0' }}>PENDING LIABILITY</p>
            <h2 style={{ color: '#ef4444', margin: 0 }}>${financialTotals.pendingLiability.toFixed(2)}</h2>
         </div>
         <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <p style={{ color: '#555', fontSize: '0.75rem', fontWeight: 'bold', margin: '0 0 5px 0' }}>USED CASH</p>
            <h2 style={{ color: '#fff', margin: 0 }}>${financialTotals.committed.toFixed(2)}</h2>
         </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
        <button onClick={() => setActiveTab('add-income')} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid #10b981', padding: '15px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem' }}>+ Income</button>
        <button onClick={() => setActiveTab('add-bill')} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '15px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem' }}>+ Bill</button>
      </div>
    </div>
  );

  const LedgerView = () => (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ color: '#10b981', textTransform: 'uppercase', marginBottom: '15px' }}>Income Sources</h3>
      {incomes.length === 0 && <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>No income sources logged.</p>}
      {incomes.map(inc => (
        <div key={inc.id} style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '20px', marginBottom: '15px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#fff', margin: 0 }}>{inc.name} <span style={{fontSize: '0.7rem', color: '#888'}}>🔁 {inc.frequency}</span></h3>
            <div style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 'bold' }}>+${inc.amount.toFixed(2)}</div>
          </div>
          <button onClick={() => deleteIncome(inc.id)} style={{background: 'transparent', color: '#ef4444', border: 'none', padding: 0, fontSize: '0.9rem', marginTop: '15px', fontWeight: 'bold'}}>🗑️ Delete</button>
        </div>
      ))}

      <h3 style={{ color: '#ef4444', textTransform: 'uppercase', marginTop: '30px', marginBottom: '15px' }}>Bill Ledger (The Float)</h3>
      {bills.length === 0 && <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>No pending liabilities logged.</p>}
      {bills.map(bill => {
        const isPaid = bill.status === 'Paid';
        return (
          <div key={bill.id} style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '20px', marginBottom: '15px', borderLeft: `4px solid ${isPaid ? '#555' : '#ef4444'}`, opacity: isPaid ? 0.6 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#fff', margin: 0, textDecoration: isPaid ? 'line-through' : 'none' }}>{bill.name}</h3>
              <div style={{ color: isPaid ? '#555' : '#ef4444', fontSize: '1.2rem', fontWeight: 'bold', textDecoration: isPaid ? 'line-through' : 'none' }}>-${bill.cost.toFixed(2)}</div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0 20px 0'}}>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>Due: {bill.due}</span>
              <span style={{background: isPaid ? '#555' : 'rgba(239, 68, 68, 0.2)', color: isPaid ? '#888' : '#ef4444', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold'}}>{isPaid ? 'PAID ✅' : 'UNPAID'}</span>
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              {isPaid ? <button onClick={() => markBillUnpaid(bill.id)} style={{background: '#333', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px', flex: 1, fontWeight: 'bold'}}>Mark Unpaid</button>
                      : <button onClick={() => markBillPaid(bill.id)} style={{background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px', flex: 1, fontWeight: 'bold'}}>MARK PAID ✅</button>}
              <button onClick={() => deleteBill(bill.id)} style={{background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', padding: '10px', fontWeight: 'bold'}}>Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const ExportView = () => (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <h3 style={{ color: '#a855f7', textTransform: 'uppercase', marginBottom: '15px' }}>Itemized Budget Sheet</h3>
      <textarea readOnly value={generateReport()} style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333', padding: '15px', borderRadius: '12px', width: '100%', height: '400px', fontSize: '0.9rem', fontFamily: 'monospace', resize: 'none', marginBottom: '20px' }} />
      <button onClick={handleShareExport} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', width: '100%' }}>📤 Email / Share Report</button>
    </div>
  );

  const inputStyle = { background: '#0a0a0a', color: '#fff', border: '1px solid #333', padding: '15px', borderRadius: '8px', width: '100%', fontSize: '1rem', marginBottom: '15px' };
  const labelStyle = { color: '#888', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '8px' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.8)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#ef4444', fontSize: '1.2rem' }}>Omniscient Budget</h2>
      </header>

      <div style={{ display: 'flex', padding: '15px', gap: '8px', background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid #222', overflowX: 'auto' }}>
        {['Dashboard', 'Ledger', 'Export'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} style={{ background: activeTab === tab.toLowerCase() ? '#a855f7' : '#222', color: activeTab === tab.toLowerCase() ? '#fff' : '#888', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', flex: '0 0 auto' }}>{tab}</button>
        ))}
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'ledger' && <LedgerView />}
        {activeTab === 'export' && <ExportView />}

        {activeTab === 'add-income' && (
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '25px', borderTop: '4px solid #10b981', marginTop: '20px' }}>
            <h2 style={{color: '#10b981', marginTop: 0, marginBottom: '20px'}}>Log Income</h2>
            <label style={labelStyle}>Source Name</label>
            <input type="text" placeholder="e.g., Work, K..." value={incomeName} onChange={e => setIncomeName(e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Amount ($)</label>
            <input type="number" placeholder="0.00" value={incomeAmount} onChange={e => setIncomeAmount(e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Start Date</label>
            <input type="date" value={incomeDate} onChange={e => setIncomeDate(e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Recurrence</label>
            <select value={incomeFrequency} onChange={e => setIncomeFrequency(e.target.value)} style={inputStyle}>
              {['None', 'Weekly', 'Bi-Weekly', 'Monthly'].map(f => <option key={f}>{f}</option>)}
            </select>
            <button onClick={handleAddIncome} style={{ background: '#10b981', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', width: '100%', fontSize: '1.1rem', marginTop: '10px' }}>Save Income Source</button>
          </div>
        )}

        {activeTab === 'add-bill' && (
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '25px', borderTop: '4px solid #ef4444', marginTop: '20px' }}>
            <h2 style={{color: '#ef4444', marginTop: 0, marginBottom: '20px'}}>Log Liability</h2>
            <label style={labelStyle}>Bill Name</label>
            <input type="text" placeholder="e.g., Rent, Insurance..." value={billName} onChange={e => setBillName(e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Cost ($)</label>
            <input type="number" placeholder="0.00" value={billCost} onChange={e => setBillCost(e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Due Date</label>
            <input type="date" value={billDue} onChange={e => setBillDue(e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Recurrence</label>
            <select value={billFrequency} onChange={e => setBillFrequency(e.target.value)} style={inputStyle}>
              {['None', 'Weekly', 'Bi-Weekly', 'Monthly'].map(f => <option key={f}>{f}</option>)}
            </select>
            <div style={{border: '1px solid #333', background: '#0a0a0a', padding: '15px', borderRadius: '8px', margin: '20px 0'}}>
              <label style={labelStyle}>Link Funds Source</label>
              <select value={selectedCheckId} onChange={e => setSelectedCheckId(e.target.value)} style={{...inputStyle, margin: 0, border: 'none'}}>
                <option value="">-- UNASSIGNED (Float Liability) --</option>
                {incomes.map(inc => <option key={inc.id} value={inc.id}>{inc.name} (+${inc.amount.toFixed(2)})</option>)}
              </select>
            </div>
            <button onClick={handleAddBill} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', width: '100%', fontSize: '1.1rem' }}>Save to Pending Liability</button>
          </div>
        )}
      </div>
    </div>
  );
}
