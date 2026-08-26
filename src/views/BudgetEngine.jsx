import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BudgetEngine() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('calc'); // calc, history, info
  const [showPreview, setShowPreview] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null); // For viewing past budgets

  // --- STATE ---
  const [incomes, setIncomes] = useState(() => JSON.parse(localStorage.getItem('fleet_incomes')) || [{ id: 1, name: 'Primary Paycheck', amount: '2500', date: '2026-08-01' }]);
  const [bills, setBills] = useState(() => JSON.parse(localStorage.getItem('fleet_bills')) || [{ id: 1, name: 'New Bill', amount: '600', linkedIncome: '1', frequency: 'Monthly', date: '2026-08-06' }]);
  const [budgetHistory, setBudgetHistory] = useState(() => JSON.parse(localStorage.getItem('fleet_budget_hist')) || []);

  useEffect(() => {
    localStorage.setItem('fleet_incomes', JSON.stringify(incomes));
    localStorage.setItem('fleet_bills', JSON.stringify(bills));
    localStorage.setItem('fleet_budget_hist', JSON.stringify(budgetHistory));
  }, [incomes, bills, budgetHistory]);

  // --- MATH ENGINE ---
  const globalCash = incomes.reduce((sum, inc) => sum + (parseFloat(inc.amount) || 0), 0);
  const totalBills = bills.reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0);
  const unassignedCash = globalCash - totalBills;

  // --- OFFLINE CSV EXPORTER ---
  const downloadCSV = (content, fileName) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSingleBudget = (budget) => {
    let csv = 'Type,Name,Amount,Frequency,Date,Linked_Income\n';
    budget.incomes.forEach(i => { csv += `"INCOME","${i.name || 'Unnamed'}","${i.amount}","Single","${i.date}","N/A"\n`; });
    budget.bills.forEach(b => {
      const linked = budget.incomes.find(inc => inc.id.toString() === b.linkedIncome);
      csv += `"BILL","${b.name || 'Unnamed'}","${b.amount}","${b.frequency}","${b.date}","${linked ? linked.name : 'Unlinked'}"\n`;
    });
    downloadCSV(csv, `Budget_Archive_${budget.date.replace(/\//g, '-')}.csv`);
  };

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #222', padding: '15px', marginBottom: '15px' };
  const inputStyle = { background: '#111', border: 'none', borderBottom: '1px solid #333', color: '#fff', padding: '8px', outline: 'none', width: '100%' };

  // --- HANDLERS ---
  const addIncome = () => setIncomes([...incomes, { id: Date.now(), name: '', amount: '', date: '' }]);
  const removeIncome = (id) => setIncomes(incomes.filter(i => i.id !== id));
  const updateIncome = (id, field, value) => setIncomes(incomes.map(i => i.id === id ? { ...i, [field]: value } : i));

  const addBill = () => setBills([...bills, { id: Date.now(), name: '', amount: '', linkedIncome: '', frequency: 'Monthly', date: '' }]);
  const removeBill = (id) => setBills(bills.filter(b => b.id !== id));
  const updateBill = (id, field, value) => setBills(bills.map(b => b.id === id ? { ...b, [field]: value } : b));

  const saveAndArchiveBudget = () => {
    const newArchive = { id: Date.now(), date: new Date().toLocaleDateString(), incomes, bills, globalCash, unassignedCash };
    setBudgetHistory([newArchive, ...budgetHistory]);
    setIncomes([]); setBills([]); setShowPreview(false); setActiveTab('history');
  };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#10b981', fontSize: '1.2em' }}>Budget Engine</h2>
      </header>

      <div style={{ display: 'flex', gap: '8px', padding: '15px 15px 0 15px', overflowX: 'auto' }}>
        <button onClick={() => setActiveTab('calc')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'calc' ? '#3b82f6' : '#222', color: activeTab === 'calc' ? '#fff' : '#888' }}>Ledger</button>
        <button onClick={() => setActiveTab('history')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'history' ? '#f59e0b' : '#222', color: activeTab === 'history' ? '#000' : '#888' }}>History</button>
        <button onClick={() => setActiveTab('info')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'info' ? '#10b981' : '#222', color: activeTab === 'info' ? '#fff' : '#888' }}>Guides</button>
      </div>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        {activeTab === 'calc' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #10b981', textAlign: 'center' }}>
                <h3 style={{ color: '#10b981', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '1em' }}>Global Cash Pool</h3>
                <div style={{ color: '#10b981', fontSize: '2.2em', fontWeight: 'bold', marginBottom: '20px' }}>
                    <span style={{ fontSize: '0.8em' }}>$</span> {globalCash.toFixed(2)}
                </div>
                <div style={{ border: '1px solid #00ffff', borderRadius: '8px', padding: '15px' }}>
                    <div style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.85em', fontWeight: 'bold', marginBottom: '5px' }}>Total Unassigned Cash</div>
                    <div style={{ color: '#00ffff', fontSize: '1.5em', fontWeight: 'bold' }}>${unassignedCash.toFixed(2)}</div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button onClick={() => setShowPreview(true)} style={{ flex: 2, padding: '12px', background: '#0a0a0a', border: '1px solid #3b82f6', color: '#3b82f6', borderRadius: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                    <span>🧾</span> Preview Ledgers
                </button>
                <button onClick={addIncome} style={{ flex: 1, background: '#10b981', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>+ Income</button>
                <button onClick={addBill} style={{ flex: 1, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>+ Bill</button>
            </div>
            <h3 style={{ color: '#10b981', margin: '0 0 15px 0', textTransform: 'uppercase', fontSize: '1em', textAlign: 'center' }}>Income Sources</h3>
            {incomes.map(inc => (
                <div key={inc.id} style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                        <input type="text" value={inc.name} onChange={e => updateIncome(inc.id, 'name', e.target.value)} placeholder="Income Name" style={{ ...inputStyle, flex: 2, fontWeight: 'bold' }} />
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>$</span>
                        <input type="number" value={inc.amount} onChange={e => updateIncome(inc.id, 'amount', e.target.value)} placeholder="0.00" style={{ ...inputStyle, flex: 1 }} />
                        <button onClick={() => removeIncome(inc.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.2em' }}>×</button>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="date" value={inc.date} onChange={e => updateIncome(inc.id, 'date', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                        <button style={{ background: '#10b981', color: '#000', border: 'none', borderRadius: '6px', padding: '0 15px', fontWeight: 'bold' }}>Sync</button>
                    </div>
                </div>
            ))}

            <h3 style={{ color: '#10b981', margin: '25px 0 15px 0', textTransform: 'uppercase', fontSize: '1em', textAlign: 'center' }}>Bill Ledger</h3>
            {bills.map(bill => (
                <div key={bill.id} style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                        <input type="text" value={bill.name} onChange={e => updateBill(bill.id, 'name', e.target.value)} placeholder="Bill Name" style={{ ...inputStyle, flex: 2, fontWeight: 'bold' }} />
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>$</span>
                        <input type="number" value={bill.amount} onChange={e => updateBill(bill.id, 'amount', e.target.value)} placeholder="0.00" style={{ ...inputStyle, flex: 1 }} />
                        <button onClick={() => removeBill(bill.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.2em' }}>×</button>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <select value={bill.linkedIncome} onChange={e => updateBill(bill.id, 'linkedIncome', e.target.value)} style={{ ...inputStyle, flex: 1, color: '#3b82f6' }}>
                            <option value="">Select Income...</option>
                            {incomes.map(i => <option key={i.id} value={i.id}>{i.name || 'Unnamed'}</option>)}
                        </select>
                        <select value={bill.frequency} onChange={e => updateBill(bill.id, 'frequency', e.target.value)} style={{ ...inputStyle, flex: 1 }}>
                            <option value="Weekly">Weekly</option>
                            <option value="Bi-Weekly">Bi-Weekly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Yearly">Yearly</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="date" value={bill.date} onChange={e => updateBill(bill.id, 'date', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                        <button style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '0 15px', fontWeight: 'bold' }}>Sync</button>
                    </div>
                </div>
            ))}
          </>
        )}

        {activeTab === 'history' && (
          <div style={{ borderTop: '4px solid #f59e0b', paddingTop: '10px' }}>
            <h3 style={{ color: '#f59e0b', margin: '0 0 15px 0', textAlign: 'center', textTransform: 'uppercase' }}>Archived Budgets</h3>
            {budgetHistory.length === 0 ? (
              <div style={{ color: '#666', textAlign: 'center', fontStyle: 'italic', marginTop: '20px' }}>No archived budgets found.</div>
            ) : (
              budgetHistory.map(hist => (
                <div key={hist.id} onClick={() => setSelectedHistory(hist)} style={{ ...cardStyle, borderLeft: '4px solid #f59e0b', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong style={{ color: '#fff', fontSize: '1.1em' }}>Saved: {hist.date}</strong>
                    <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold' }}>View</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.9em' }}>
                    <span>Pool: <span style={{ color: '#10b981' }}>${hist.globalCash.toFixed(2)}</span></span>
                    <span>Unassigned: <span style={{ color: '#00ffff' }}>${hist.unassignedCash.toFixed(2)}</span></span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'info' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #10b981' }}>
            <h3 style={{ color: '#10b981', margin: '0 0 15px 0', textAlign: 'center' }}>📖 Budgeting Field Guide</h3>
            <div style={{ color: '#ccc', lineHeight: '1.6', fontSize: '0.95em' }}>
              <h4 style={{ color: '#00ffff', margin: '0 0 5px 0', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Zero-Based Budgeting</h4>
              <p style={{ margin: '0 0 15px 0' }}>Your <strong>Total Unassigned Cash</strong> should always be exactly $0.00. Every single dollar you earn needs a job before the month begins. If you have $200 left over, create a "Savings" bill to zero it out.</p>
              <h4 style={{ color: '#00ffff', margin: '0 0 5px 0', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Paycheck Routing</h4>
              <p style={{ margin: '0 0 15px 0' }}>If all bills are due on the 1st, but you get paid on the 15th and 30th, you will overdraft. Use the dropdown in the Ledger to link specific bills to specific paychecks so you always know which check covers which liability.</p>
            </div>
          </div>
        )}
      </div>

      {/* ACTIVE BUDGET ROUTING PREVIEW MODAL */}
      {showPreview && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2 style={{ color: '#10b981', margin: 0 }}>Routing Preview</h2>
            <button onClick={() => setShowPreview(false)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
          </div>
          
          <button onClick={saveAndArchiveBudget} style={{ background: '#a855f7', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
            💾 Save & Archive Budget
          </button>

          {incomes.map(inc => {
            const linkedBills = bills.filter(b => b.linkedIncome === inc.id.toString());
            const totalLinked = linkedBills.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
            const incAmt = parseFloat(inc.amount) || 0;
            const remaining = incAmt - totalLinked;

            return (
              <div key={inc.id} style={{ background: '#111', borderRadius: '8px', borderLeft: '4px solid #10b981', padding: '15px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '10px' }}>
                  <strong style={{ color: '#fff', fontSize: '1.1em' }}>{inc.name || 'Unnamed Check'}</strong>
                  <strong style={{ color: '#10b981', fontSize: '1.1em' }}>${incAmt.toFixed(2)}</strong>
                </div>
                {linkedBills.map(b => (
                  <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', marginBottom: '6px', fontSize: '0.95em' }}>
                    <span>{b.name || 'Unnamed Bill'}</span><span style={{ color: '#ef4444' }}>-${(parseFloat(b.amount) || 0).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0a0a', padding: '10px', borderRadius: '6px', marginTop: '10px' }}>
                  <span style={{ color: '#aaa', textTransform: 'uppercase', fontSize: '0.85em', fontWeight: 'bold' }}>Remaining Balance</span>
                  <strong style={{ color: remaining >= 0 ? '#00ffff' : '#ef4444', fontSize: '1.2em' }}>${remaining.toFixed(2)}</strong>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* HISTORICAL BUDGET PREVIEW MODAL */}
      {selectedHistory && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2 style={{ color: '#f59e0b', margin: 0 }}>Archived: {selectedHistory.date}</h2>
            <button onClick={() => setSelectedHistory(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
          </div>

          <button onClick={() => exportSingleBudget(selectedHistory)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
            📥 Export to Excel (.CSV)
          </button>

          {selectedHistory.incomes.map(inc => {
            const linkedBills = selectedHistory.bills.filter(b => b.linkedIncome === inc.id.toString());
            const totalLinked = linkedBills.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
            const incAmt = parseFloat(inc.amount) || 0;
            const remaining = incAmt - totalLinked;

            return (
              <div key={inc.id} style={{ background: '#111', borderRadius: '8px', borderLeft: '4px solid #10b981', padding: '15px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '10px' }}>
                  <strong style={{ color: '#fff', fontSize: '1.1em' }}>{inc.name || 'Unnamed Check'}</strong>
                  <strong style={{ color: '#10b981', fontSize: '1.1em' }}>${incAmt.toFixed(2)}</strong>
                </div>
                {linkedBills.map(b => (
                  <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', marginBottom: '6px', fontSize: '0.95em' }}>
                    <span>{b.name || 'Unnamed Bill'}</span><span style={{ color: '#ef4444' }}>-${(parseFloat(b.amount) || 0).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0a0a', padding: '10px', borderRadius: '6px', marginTop: '10px' }}>
                  <span style={{ color: '#aaa', textTransform: 'uppercase', fontSize: '0.85em', fontWeight: 'bold' }}>Remaining Balance</span>
                  <strong style={{ color: remaining >= 0 ? '#00ffff' : '#ef4444', fontSize: '1.2em' }}>${remaining.toFixed(2)}</strong>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
