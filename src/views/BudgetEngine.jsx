import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BudgetEngine() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [incomes, setIncomes] = useState(() => JSON.parse(localStorage.getItem('tot_incomes')) || []);
  const [bills, setBills] = useState(() => JSON.parse(localStorage.getItem('tot_bills')) || []);
  const [financialTotals, setFinancialTotals] = useState({ available: 0, committed: 0, pendingLiability: 0 });

  // Add Income Form State
  const [incomeName, setIncomeName] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDate, setIncomeDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [incomeFrequency, setIncomeFrequency] = useState('Monthly');

  // Add Bill Form State
  const [billName, setBillName] = useState('');
  const [billCost, setBillCost] = useState('');
  const [billDue, setBillDue] = useState(() => new Date().toISOString().substring(0, 10));
  const [billFrequency, setBillFrequency] = useState('Monthly');
  const [selectedCheckId, setSelectedCheckId] = useState('');

  // Persist State
  useEffect(() => { localStorage.setItem('tot_incomes', JSON.stringify(incomes)); }, [incomes]);
  useEffect(() => { localStorage.setItem('tot_bills', JSON.stringify(bills)); }, [bills]);
  useEffect(() => { calculateTotals(); }, [incomes, bills]);

  // General Tool
  const getSafe = (key) => {
    try { const data = JSON.parse(localStorage.getItem(key)); return Array.isArray(data) ? data : []; } 
    catch (e) { return []; }
  };

  // --- OMNISCIENT CASH-FLOW ENGINE ---
  const calculateTotals = () => {
    // Legacy support check
    const legacyBills = getSafe('fleet_bills');
    const allBills = [...bills, ...legacyBills];
    const legacyIncomes = getSafe('fleet_incomes');
    const allIncomes = [...incomes, ...legacyIncomes];

    // 1. Available Pool (Cash not spent): Total Synced Income minus ALL Linked/Paid Bills.
    const syncedIncomeTotal = allIncomes.reduce((sum, inc) => (inc.status === 'Synced' ? sum + inc.amount : sum), 0);
    const committedPaidTotal = allBills.reduce((sum, bill) => (bill.sourceCheckId ? sum + bill.cost : sum), 0);
    const available = syncedIncomeTotal - committedPaidTotal;
    
    // 2. Pending Liability Pool (The Float): All UNPAID bills that are not linked to a payment check.
    const pendingLiability = allBills.reduce((sum, bill) => (bill.status !== 'Paid' && !bill.sourceCheckId ? sum + bill.cost : sum), 0);

    // 3. Committed Cash Pool (Used Cash): What's actually *paid*.
    const committed = allBills.reduce((sum, bill) => (bill.status === 'Paid' ? sum + bill.cost : sum), 0);
    
    setFinancialTotals({ available, committed, pendingLiability });
  };

  // --- ACTION HANDLERS ---
  const handleAddIncome = () => {
    if(!incomeName || !incomeAmount) return;
    const newInc = { id: Date.now(), name: incomeName, amount: parseFloat(incomeAmount), date: incomeDate, frequency: incomeFrequency, status: 'Synced' };
    setIncomes([newInc, ...incomes]);
    setIncomeName(''); setIncomeAmount(''); setIncomeFrequency('Monthly');
    setActiveTab('ledger');
  };

  const handleAddBill = () => {
    if(!billName || !billCost) return;
    // New bill includes sourceCheckId (optional) and status (Unpaid)
    const newBill = { 
      id: Date.now(), 
      name: billName, 
      cost: parseFloat(billCost), 
      due: billDue, 
      frequency: billFrequency, 
      sourceCheckId: selectedCheckId || null, // null = Unassigned Liability
      status: 'Unpaid' // The user wants a way to mark paid
    };
    setBills([newBill, ...bills]);
    setBillName(''); setBillCost(''); setBillFrequency('Monthly'); setSelectedCheckId('');
    setActiveTab('ledger');
  };

  const markBillPaid = (id) => {
     if(window.confirm("Mark this bill physically PAID? Funds will be removed from your committed pool.")) {
       setBills(bills.map(b => b.id === id ? {...b, status: 'Paid'} : b));
     }
  };
  const markBillUnpaid = (id) => {
     if(window.confirm("Move this back to UNPAID?")) {
       setBills(bills.map(b => b.id === id ? {...b, status: 'Unpaid'} : b));
     }
  };

  const deleteIncome = (id) => { 
     const isLinked = bills.some(b => b.sourceCheckId === id);
     if(isLinked) return alert("Error: This income is linked to active bills. Unlink them first.");
     if(window.confirm("Delete this income permanently?")) setIncomes(incomes.filter(inc => inc.id !== id));
  };
  const deleteBill = (id) => { if(window.confirm("Delete this bill?")) setBills(bills.filter(b => b.id !== id)); };

  const getSourceCheck = (id) => incomes.find(inc => inc.id === id);

  const cardStyle = { background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '20px', marginBottom: '15px' };
  const inputStyle = { background: '#0a0a0a', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '6px', width: '100%', fontSize: '1rem', marginBottom: '10px' };
  const btnStyle = (bg, color) => ({ background: bg, color, border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold' });

  // --- THE NEW THREE-POOL LIABILITY DASHBOARD ---
  const DashboardView = () => (
    <div style={{ marginTop: '20px' }}>
      
      {/* 1. AVAILABLE POOL: Primary flow metric */}
      <div style={{ ...cardStyle, textAlign: 'center', borderTop: '4px solid #a855f7', background: 'rgba(168, 85, 247, 0.05)' }}>
        <div style={{ color: '#ef4444', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '1px', marginBottom: '5px' }}>Omniscient Cash Flow Engine</div>
        <h3 style={{ color: '#a855f7', textTransform: 'uppercase', marginTop: 0, marginBottom: '5px' }}>AVAILABLE CASH POOL</h3>
        <p style={{ color: '#fff', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>${financialTotals.available.toFixed(2)}</p>
        <p style={{ color: '#888', fontSize: '0.8rem', margin: '5px 0 0 0' }}>Synced Incomes minus Linked Bills.</p>
      </div>

      {/* 2. THE LIABILITY GRIDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '15px' }}>
        
        {/* USED CASH: What's actually paid */}
        <div style={{ ...cardStyle, textAlign: 'center', margin: 0 }}>
          <h4 style={{ color: '#ef4444', textTransform: 'uppercase', marginTop: 0, marginBottom: '5px', fontSize: '0.75rem' }}>USED CASH</h4>
          <p style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>${financialTotals.committed.toFixed(2)}</p>
          <p style={{ color: '#888', fontSize: '0.65rem', margin: '3px 0 0 0' }}>Funds physically PAID.</p>
        </div>

        {/* PENDING LIABILITY (The user's key focus) */}
        <div style={{ ...cardStyle, textAlign: 'center', margin: 0, borderTop: '2px solid #ef4444' }}>
          <h4 style={{ color: '#ef4444', textTransform: 'uppercase', marginTop: 0, marginBottom: '5px', fontSize: '0.75rem' }}>PENDING LIABILITY</h4>
          <p style={{ color: '#ef4444', fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>${financialTotals.pendingLiability.toFixed(2)}</p>
          <p style={{ color: '#888', fontSize: '0.65rem', margin: '3px 0 0 0' }}>Unpaid bills without a sync check.</p>
        </div>

        {/* UNASSIGNED CASH (Income flow) */}
        <div style={{ ...cardStyle, textAlign: 'center', margin: 0, borderTop: '2px solid #10b981' }}>
          <h4 style={{ color: '#10b981', textTransform: 'uppercase', marginTop: 0, marginBottom: '5px', fontSize: '0.75rem' }}>AVAILABLE CASH</h4>
          <p style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>${financialTotals.available.toFixed(2)}</p>
          <p style={{ color: '#888', fontSize: '0.65rem', margin: '3px 0 0 0' }}>Cash not yet spent on bills.</p>
        </div>
      </div>

      {/* BUTTONS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button onClick={() => setActiveTab('addIncome')} style={{ ...btnStyle('#10b981', '#000'), fontSize: '1.1rem' }}>+ Synced Income</button>
        <button onClick={() => setActiveTab('addBill')} style={{ ...btnStyle('#ef4444', '#fff'), fontSize: '1.1rem' }}>+ Liability Bill</button>
      </div>
    </div>
  );

  // --- LEDGER VIEW with paid/unpaid Status and Linking ---
  const LedgerView = () => (
    <div style={{ marginTop: '20px' }}>
      
      <h3 style={{ color: '#ef4444', textTransform: 'uppercase' }}>INCOME SOURCES</h3>
      {incomes.map(inc => (
        <div key={inc.id} style={{ ...cardStyle, borderLeft: '4px solid #10b981', opacity: inc.status === 'Synced' ? 1 : 0.6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#fff', margin: 0 }}>{inc.name} <span style={{fontSize: '0.6rem', color: '#888'}}>🔁 {inc.frequency}</span></h3>
            <div style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 'bold' }}>+${inc.amount.toFixed(2)}</div>
          </div>
          <p style={{color: '#888', fontSize: '0.8rem', margin: '5px 0 10px 0'}}>Synced: {inc.date}</p>
          <button onClick={() => deleteIncome(inc.id)} style={{background: 'transparent', color: '#ef4444', border: 'none', padding: 0, fontSize: '0.8rem'}}>Delete</button>
        </div>
      ))}

      <h3 style={{ color: '#ef4444', textTransform: 'uppercase', marginTop: '30px' }}>BILL LEDGER (The Float)</h3>
      {[...bills, ...getSafe('fleet_bills')].map(bill => {
        const sourceCheck = getSourceCheck(bill.sourceCheckId);
        const isPaid = bill.status === 'Paid';
        return (
          <div key={bill.id} style={{ ...cardStyle, borderLeft: `4px solid ${isPaid ? '#555' : '#ef4444'}`, opacity: isPaid ? 0.6 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#fff', margin: 0, textDecoration: isPaid ? 'line-through' : 'none' }}>{bill.name} <span style={{fontSize: '0.6rem', color: '#888'}}>🔁 {bill.frequency}</span></h3>
              <div style={{ color: isPaid ? '#555' : '#ef4444', fontSize: '1.2rem', fontWeight: 'bold', textDecoration: isPaid ? 'line-through' : 'none' }}>-${bill.cost.toFixed(2)}</div>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '5px 0 15px 0'}}>
              <span style={{ color: '#888', fontSize: '0.8rem' }}>Due: {bill.due}</span>
              <span style={{background: isPaid ? '#555' : '#ef4444', color: isPaid ? '#888' : '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase'}}>{isPaid ? 'PAID ✅' : 'UNPAID 🔴'}</span>
            </div>

            <div style={{border: '1px solid #222', background: '#0a0a0a', padding: '10px', borderRadius: '6px', marginBottom: '15px'}}>
              <div style={{color: '#888', fontSize: '0.7rem', textTransform: 'uppercase'}}>Payment Source (SOURCE CHECK)</div>
              {sourceCheck ? (
                <div style={{color: '#06b6d4', fontWeight: 'bold'}}>{sourceCheck.name} (+${sourceCheck.amount.toFixed(2)})</div>
              ) : (
                <div style={{color: '#ef4444', fontWeight: 'bold', textTransform: 'uppercase'}}>Liability (Unassigned Float)</div>
              )}
            </div>

            <div style={{display: 'flex', gap: '10px'}}>
              {isPaid ? (
                <button onClick={() => markBillUnpaid(bill.id)} style={{...btnStyle('#333', '#888'), flex: 1, padding: '8px'}}>Mark Unpaid</button>
              ) : (
                <button onClick={() => markBillPaid(bill.id)} style={{...btnStyle('#ef4444', '#fff'), flex: 1, padding: '8px'}}>MARK PAID PAID ✅</button>
              )}
              <button onClick={() => deleteBill(bill.id)} style={{background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', padding: '8px'}}>Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const inputStyleLabel = { color: '#a855f7', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.8)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#ef4444', fontSize: '1.2rem' }}>Omniscient Budget Engine</h2>
      </header>

      <div style={{ display: 'flex', padding: '15px', gap: '8px', background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid #222' }}>
        {['Dashboard', 'Ledger', 'History'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} style={{ background: activeTab === tab.toLowerCase() ? '#a855f7' : '#222', color: activeTab === tab.toLowerCase() ? '#000' : '#888', border: 'none', padding: '10px 15px', borderRadius: '6px', fontWeight: 'bold', flex: 1 }}>{tab}</button>
        ))}
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'ledger' && <LedgerView />}

        {activeTab === 'addincome' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #10b981', marginTop: '20px' }}>
            <label style={inputStyleLabel}>Income Source Name</label>
            <input type="text" placeholder="e.g., Work, K..." value={incomeName} onChange={e => setIncomeName(e.target.value)} style={inputStyle} />
            <label style={inputStyleLabel}>Amount ($)</label>
            <input type="number" placeholder="e.g., 500" value={incomeAmount} onChange={e => setIncomeAmount(e.target.value)} style={inputStyle} />
            <label style={inputStyleLabel}>First Recurrence Date</label>
            <input type="date" value={incomeDate} onChange={e => setIncomeDate(e.target.value)} style={inputStyle} />
            <label style={inputStyleLabel}>Recurring Frequency</label>
            <select value={incomeFrequency} onChange={e => setIncomeFrequency(e.target.value)} style={inputStyle}>
              {['None', 'Weekly', 'Bi-Weekly', 'Monthly'].map(f => <option key={f}>{f}</option>)}
            </select>
            <button onClick={handleAddIncome} style={{ ...btnStyle('#10b981', '#000'), width: '100%', marginTop: '10px' }}>Save Synced Income Source</button>
          </div>
        )}

        {activeTab === 'addbill' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #ef4444', marginTop: '20px' }}>
            <label style={inputStyleLabel}>Bill Liability Name</label>
            <input type="text" placeholder="e.g., Rent, Insurance..." value={billName} onChange={e => setBillName(e.target.value)} style={inputStyle} />
            <label style={inputStyleLabel}>Cost ($)</label>
            <input type="number" placeholder="e.g., 800" value={billCost} onChange={e => setBillCost(e.target.value)} style={inputStyle} />
            <label style={inputStyleLabel}>First Recurrence Due Date</label>
            <input type="date" value={billDue} onChange={e => setBillDue(e.target.value)} style={inputStyle} />
            <label style={inputStyleLabel}>Recurring Frequency</label>
            <select value={billFrequency} onChange={e => setBillFrequency(e.target.value)} style={inputStyle}>
              {['None', 'Weekly', 'Bi-Weekly', 'Monthly'].map(f => <option key={f}>{f}</option>)}
            </select>
            
            {/* THE UPGRADED SOURCE CHECK DROPDOWN */}
            <div style={{border: '1px solid #333', background: '#0a0a0a', padding: '12px', borderRadius: '6px', margin: '15px 0'}}>
              <label style={inputStyleLabel}>Link Source Check (Source of Funds)</label>
              <select value={selectedCheckId} onChange={e => setSelectedCheckId(e.target.value)} style={{...inputStyle, margin: 0}}>
                <option value="">-- LIABILITY (Unassigned Float) --</option>
                {incomes.map(inc => (
                  <option key={inc.id} value={inc.id}>{inc.name} (+$ {inc.amount.toFixed(2)}) [{inc.frequency}]</option>
                ))}
              </select>
              <p style={{color: '#888', fontSize: '0.7rem', margin: '5px 0 0 0'}}>Link this bill to a Synced Income source to move it out of the float liability.</p>
            </div>

            <button onClick={handleAddBill} style={{ ...btnStyle('#ef4444', '#fff'), width: '100%', marginTop: '10px' }}>Save as Pending Liability</button>
          </div>
        )}

      </div>
    </div>
  );
}
