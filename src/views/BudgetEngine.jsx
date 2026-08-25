import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BudgetEngine() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('calc');

  // Load saved data or set defaults matching your screenshot
  const [incomes, setIncomes] = useState(() => {
    const saved = localStorage.getItem('fleet_incomes');
    if (saved) return JSON.parse(saved);
    return [{ id: 1, name: 'Primary Paycheck', amount: '2500', date: '2026-08-01' }];
  });

  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem('fleet_bills');
    if (saved) return JSON.parse(saved);
    return [{ id: 1, name: 'New Bill', amount: '600', linkedIncome: '1', frequency: 'Monthly', date: '2026-08-06' }];
  });

  // Save changes automatically
  useEffect(() => { localStorage.setItem('fleet_incomes', JSON.stringify(incomes)); }, [incomes]);
  useEffect(() => { localStorage.setItem('fleet_bills', JSON.stringify(bills)); }, [bills]);

  // Math Engine
  const globalCash = incomes.reduce((sum, inc) => sum + (parseFloat(inc.amount) || 0), 0);
  const totalBills = bills.reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0);
  const unassignedCash = globalCash - totalBills;

  // Handlers
  const addIncome = () => setIncomes([...incomes, { id: Date.now(), name: '', amount: '', date: '' }]);
  const removeIncome = (id) => setIncomes(incomes.filter(i => i.id !== id));
  const updateIncome = (id, field, value) => setIncomes(incomes.map(i => i.id === id ? { ...i, [field]: value } : i));

  const addBill = () => setBills([...bills, { id: Date.now(), name: '', amount: '', linkedIncome: '', frequency: 'Monthly', date: '' }]);
  const removeBill = (id) => setBills(bills.filter(b => b.id !== id));
  const updateBill = (id, field, value) => setBills(bills.map(b => b.id === id ? { ...b, [field]: value } : b));

  // Styles
  const inputStyle = { background: '#111', border: 'none', borderBottom: '1px solid #333', color: '#fff', padding: '8px', outline: 'none', width: '100%' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #222', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#3b82f6', fontSize: '1.2em' }}>Budget Engine</h2>
      </header>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '10px', padding: '15px 15px 0 15px' }}>
        <button onClick={() => setActiveTab('calc')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'calc' ? '#3b82f6' : '#222', color: activeTab === 'calc' ? '#fff' : '#888' }}>Ledger</button>
        <button onClick={() => setActiveTab('info')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'info' ? '#10b981' : '#222', color: activeTab === 'info' ? '#fff' : '#888' }}>Guides & Tips</button>
      </div>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        {activeTab === 'calc' ? (
          <>
            {/* GLOBAL POOL */}
            <div style={{ ...cardStyle, borderTop: '4px solid #10b981', textAlign: 'center' }}>
                <h3 style={{ color: '#aaa', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '1em' }}>Global Cash Pool</h3>
                <div style={{ color: '#10b981', fontSize: '2em', fontWeight: 'bold', marginBottom: '20px' }}>
                    <span style={{ fontSize: '0.8em' }}>$</span> {globalCash.toFixed(2)}
                </div>
                
                <div style={{ border: '1px solid #00ffff', borderRadius: '8px', padding: '15px' }}>
                    <div style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.85em', fontWeight: 'bold', marginBottom: '5px' }}>Total Unassigned Cash</div>
                    <div style={{ color: '#00ffff', fontSize: '1.5em', fontWeight: 'bold' }}>${unassignedCash.toFixed(2)}</div>
                </div>
            </div>

            {/* CONTROLS */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button style={{ flex: 2, padding: '12px', background: '#0a0a0a', border: '1px solid #3b82f6', color: '#3b82f6', borderRadius: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                    <span>🧾</span> Preview Ledgers
                </button>
                <button onClick={addIncome} style={{ flex: 1, background: '#10b981', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>+ Income</button>
                <button onClick={addBill} style={{ flex: 1, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>+ Bill</button>
            </div>

            {/* INCOME SOURCES */}
            <h3 style={{ color: '#3b82f6', margin: '0 0 15px 0', textTransform: 'uppercase', fontSize: '1em', textAlign: 'center' }}>Income Sources</h3>
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

            {/* BILL LEDGER */}
            <h3 style={{ color: '#3b82f6', margin: '25px 0 15px 0', textTransform: 'uppercase', fontSize: '1em', textAlign: 'center' }}>Bill Ledger</h3>
            {bills.map(bill => (
                <div key={bill.id} style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                        <input type="text" value={bill.name} onChange={e => updateBill(bill.id, 'name', e.target.value)} placeholder="Bill Name" style={{ ...inputStyle, flex: 2, fontWeight: 'bold' }} />
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>$</span>
                        <input type="number" value={bill.amount} onChange={e => updateBill(bill.id, 'amount', e.target.value)} placeholder="0.00" style={{ ...inputStyle, flex: 1 }} />
                        <button onClick={() => removeBill(bill.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.2em' }}>×</button>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <select value={bill.linkedIncome} onChange={e => updateBill(bill.id, 'linkedIncome', e.target.value)} style={{ ...inputStyle, flex: 1, color: '#10b981' }}>
                            <option value="">Select Income...</option>
                            {incomes.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
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
        ) : (
          <div style={{ ...cardStyle, borderTop: '4px solid #10b981' }}>
            <h3 style={{ color: '#10b981', margin: '0 0 15px 0', textAlign: 'center' }}>📖 Budgeting Field Guide</h3>
            
            <div style={{ color: '#ccc', lineHeight: '1.6', fontSize: '0.95em' }}>
              
              <h4 style={{ color: '#00ffff', margin: '0 0 5px 0', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Zero-Based Budgeting</h4>
              <p style={{ margin: '0 0 15px 0' }}>The golden rule of this engine: Your <strong>Total Unassigned Cash</strong> should always be exactly $0.00. Every single dollar you earn needs a job before the month begins. If you have $200 left over after bills, it shouldn't sit in "Unassigned"—give it a job by creating a "Savings" or "Emergency Fund" bill to zero it out.</p>

              <h4 style={{ color: '#00ffff', margin: '0 0 5px 0', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Paycheck Routing (The Sync Feature)</h4>
              <p style={{ margin: '0 0 15px 0' }}>Most budgets fail because they only look at monthly totals, ignoring cash flow. If all your bills are due on the 1st, but you get paid on the 15th and 30th, you will overdraft. Use the dropdown in the Bill Ledger to link specific bills to specific paychecks so you always know which check covers which liability.</p>

              <h4 style={{ color: '#00ffff', margin: '0 0 5px 0', borderBottom: '1px solid #333', paddingBottom: '5px' }}>The 50/30/20 Baseline</h4>
              <ul style={{ paddingLeft: '20px', margin: '0 0 15px 0' }}>
                  <li style={{ marginBottom: '5px' }}><strong>50% Needs:</strong> Rent, utilities, groceries, gas, insurance.</li>
                  <li style={{ marginBottom: '5px' }}><strong>30% Wants:</strong> Dining out, entertainment, hobbies.</li>
                  <li><strong>20% Deployment:</strong> Debt payoff, savings, or investing.</li>
              </ul>

              <h4 style={{ color: '#00ffff', margin: '0 0 5px 0', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Sinking Funds</h4>
              <p style={{ margin: '0 0 20px 0' }}>Don't let annual bills (like car registration or Prime subscriptions) blindside you. If a bill is $120 a year, create a monthly bill in this ledger for $10 and stash that cash aside. When the annual bill hits, the money is already waiting.</p>

              <div style={{ border: '1px solid #3b82f6', background: 'rgba(59, 130, 246, 0.1)', padding: '15px', borderRadius: '8px', textAlign: 'justify' }}>
                <h4 style={{ color: '#3b82f6', margin: '0 0 10px 0', textAlign: 'center', textTransform: 'uppercase' }}>🔒 Local First Privacy</h4>
                This tool is completely isolated. Since this application processes local state variables on your device, absolutely none of your income sources, bill ledgers, or financial mapping data are transmitted to the cloud or aggregated by external servers. Treat this device as your private financial ledger.
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
