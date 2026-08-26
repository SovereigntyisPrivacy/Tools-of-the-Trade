import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BudgetEngine() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard'); 

  // --- STATE ---
  const [incomes, setIncomes] = useState(() => JSON.parse(localStorage.getItem('tot_incomes')) || []);
  const [bills, setBills] = useState(() => JSON.parse(localStorage.getItem('tot_bills')) || []);
  const [archives, setArchives] = useState(() => JSON.parse(localStorage.getItem('tot_budgetArchives')) || []);

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [viewingArchive, setViewingArchive] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);

  // Income Form
  const [incName, setIncName] = useState('');
  const [incAmount, setIncAmount] = useState('');
  const [incDate, setIncDate] = useState('');
  const [incFreq, setIncFreq] = useState('None');

  // Bill Form
  const [billName, setBillName] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDate, setBillDate] = useState('');
  const [billFreq, setBillFreq] = useState('None');
  const [billLinkedInc, setBillLinkedInc] = useState('None');
  const [billPhoto, setBillPhoto] = useState(null);

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('tot_incomes', JSON.stringify(incomes));
    localStorage.setItem('tot_bills', JSON.stringify(bills));
    localStorage.setItem('tot_budgetArchives', JSON.stringify(archives));
  }, [incomes, bills, archives]);

  // --- DASHBOARD CALCULATIONS ---
  const totalPool = incomes.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const usedCash = bills.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const unassignedCash = totalPool - usedCash;

  const guideData = [
    { title: "Zero-Based Budgeting", content: "Your Total Unassigned Cash should always be exactly $0.00. Every single dollar you earn needs a job before the month begins. If you have $200 left over, create a 'Savings' bill to zero it out." },
    { title: "Paycheck Routing", content: "If all bills are due on the 1st, but you get paid on the 15th and 30th, you will overdraft. Use the dropdown in the Ledger to link specific bills to specific paychecks." },
    { title: "Calendar Syncing", content: "Set a frequency (Weekly, Bi-Weekly, Monthly) when adding an income or bill, then tap 'Sync'. This writes the event directly to the Master Calendar." }
  ];

  const toggleAccordion = (index) => setOpenAccordion(openAccordion === index ? null : index);

  // --- ACTIONS & IMAGE COMPRESSOR ---
  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500; 
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setBillPhoto(canvas.toDataURL('image/jpeg', 0.5));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const addIncome = () => {
    if (!incName || !incAmount) return alert("Name and Amount are required.");
    setIncomes([...incomes, { id: Date.now(), name: incName, amount: parseFloat(incAmount), date: incDate, frequency: incFreq, isSynced: false }]);
    setIncName(''); setIncAmount(''); setIncDate(''); setIncFreq('None'); setShowIncomeModal(false);
  };

  const addBill = () => {
    if (!billName || !billAmount) return alert("Name and Amount are required.");
    setBills([...bills, { id: Date.now(), name: billName, amount: parseFloat(billAmount), dueDate: billDate, frequency: billFreq, linkedIncomeId: billLinkedInc, isPaid: false, datePaid: null, photo: billPhoto, isSynced: false }]);
    setBillName(''); setBillAmount(''); setBillDate(''); setBillFreq('None'); setBillLinkedInc('None'); setBillPhoto(null); setShowBillModal(false);
  };

  const deleteItem = (id, type) => {
    if (type === 'income') {
      setIncomes(incomes.filter(i => i.id !== id));
      setBills(bills.map(b => b.linkedIncomeId == id ? { ...b, linkedIncomeId: 'None' } : b));
    } else setBills(bills.filter(b => b.id !== id));
  };

  const togglePaidStatus = (id) => {
    setBills(bills.map(b => b.id === id ? { ...b, isPaid: !b.isPaid, datePaid: !b.isPaid ? new Date().toLocaleDateString() : null } : b));
  };

  // --- IN-APP CALENDAR WRAPPER SYNC ---
  const syncToCalendar = (item, type) => {
    const targetDate = item.date || item.dueDate;
    if (!targetDate) return alert("Please set a date before syncing.");
    
    if (type === 'income') setIncomes(incomes.map(i => i.id === item.id ? { ...i, isSynced: true } : i));
    else setBills(bills.map(b => b.id === item.id ? { ...b, isSynced: true } : b));

    const existingEvents = JSON.parse(localStorage.getItem('tot_calendar_events')) || [];
    const newEvent = { id: `${type}_${item.id}`, title: type === 'income' ? `Payday: ${item.name}` : `Bill Due: ${item.name}`, date: targetDate, frequency: item.frequency, amount: item.amount, type: type, source: 'BudgetEngine' };
    localStorage.setItem('tot_calendar_events', JSON.stringify([...existingEvents.filter(e => e.id !== newEvent.id), newEvent]));
    alert(`${item.name} pushed to Master Calendar successfully!`);
  };

  // --- ARCHIVING & BULLETPROOF EXPORTS ---
  const archiveBudget = () => {
    if (totalPool === 0 && usedCash === 0) return alert("Nothing to archive.");
    if (window.confirm("Archive this budget and wipe the current ledger clean for the next cycle?")) {
      setArchives([{ id: Date.now(), date: new Date().toLocaleDateString(), totalPool, usedCash, unassignedCash, incomes, bills }, ...archives]);
      setIncomes([]); setBills([]);
    }
  };

  const getCSVString = () => {
    let csv = "Type,Name,Amount,Date/Due,Frequency,Routed Paycheck,Status,Date Paid\n";
    let totalIn = 0; let totalOut = 0;
    
    incomes.forEach(i => { csv += `"Income","${i.name}","$${i.amount}","${i.date}","${i.frequency}","N/A","N/A","N/A"\n`; totalIn += i.amount; });
    bills.forEach(b => {
      const linkedName = incomes.find(inc => inc.id == b.linkedIncomeId)?.name || 'None';
      csv += `"Bill","${b.name}","$${b.amount}","${b.dueDate}","${b.frequency}","${linkedName}","${b.isPaid ? 'PAID' : 'UNPAID'}","${b.datePaid || 'N/A'}"\n`;
      totalOut += b.amount;
    });
    
    csv += `\n"TOTALS","Pool:","$${totalIn.toFixed(2)}","Used:","$${totalOut.toFixed(2)}","Unassigned:","$${(totalIn - totalOut).toFixed(2)}",""\n`;
    return csv;
  };

  const downloadCSVFile = () => {
    const blob = new Blob([getCSVString()], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `budget_export_${Date.now()}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const shareCSV = async () => {
    try {
      const file = new File([getCSVString()], `budget_export_${Date.now()}.csv`, { type: 'text/csv' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Budget Ledger', text: 'Attached is your Budget CSV Export' });
      } else {
        window.open(`mailto:?subject=Budget Export&body=${encodeURIComponent("Attached is the requested data:\n\n" + getCSVString())}`);
      }
    } catch (err) { console.error("Share failed", err); }
  };

  const copyCSVToClipboard = () => {
    navigator.clipboard.writeText(getCSVString());
    alert("CSV Data securely copied to your clipboard!");
  };

  const cardStyle = { background: 'rgba(17, 17, 17, 0.95)', borderRadius: '12px', border: '1px solid #222', padding: '15px', marginBottom: '15px' };
  const inputStyle = { background: '#000', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '6px', width: '100%', marginBottom: '15px', fontSize: '1em' };
  const btnStyle = (bg, color) => ({ background: bg, color: color, border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', width: '100%', fontSize: '1em' });

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
          <h2 style={{ margin: 0, color: '#10b981', fontSize: '1.2em' }}>Budget Engine</h2>
        </div>
      </header>

      <div style={{ display: 'flex', padding: '15px', gap: '8px', background: 'rgba(0,0,0,0.6)', overflowX: 'auto' }}>
        <button onClick={() => setActiveTab('dashboard')} style={{ flex: '0 0 auto', padding: '12px 18px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'dashboard' ? '#3b82f6' : '#222', color: activeTab === 'dashboard' ? '#fff' : '#888' }}>Dashboard</button>
        <button onClick={() => setActiveTab('ledger')} style={{ flex: '0 0 auto', padding: '12px 18px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'ledger' ? '#a855f7' : '#222', color: activeTab === 'ledger' ? '#fff' : '#888' }}>Ledger</button>
        <button onClick={() => setActiveTab('history')} style={{ flex: '0 0 auto', padding: '12px 18px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'history' ? '#f59e0b' : '#222', color: activeTab === 'history' ? '#fff' : '#888' }}>History</button>
        <button onClick={() => setActiveTab('guides')} style={{ flex: '0 0 auto', padding: '12px 18px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'guides' ? '#10b981' : '#222', color: activeTab === 'guides' ? '#000' : '#888' }}>Guides</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        
        {activeTab === 'dashboard' && (
          <>
            <div style={{ ...cardStyle, textAlign: 'center', border: '1px solid #a855f7', marginTop: '10px' }}>
              <div style={{ color: '#a855f7', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Total Cash Pool</div>
              <div style={{ color: '#fff', fontSize: '2.5em', fontWeight: 'bold' }}>${totalPool.toFixed(2)}</div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <div style={{ flex: 1, ...cardStyle, textAlign: 'center', border: '1px solid #ef4444', margin: 0 }}>
                <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.85em', textTransform: 'uppercase', marginBottom: '5px' }}>Used Cash</div>
                <div style={{ color: '#fff', fontSize: '1.6em', fontWeight: 'bold' }}>${usedCash.toFixed(2)}</div>
              </div>
              <div style={{ flex: 1, ...cardStyle, textAlign: 'center', border: `1px solid ${unassignedCash < 0 ? '#ef4444' : '#10b981'}`, margin: 0 }}>
                <div style={{ color: unassignedCash < 0 ? '#ef4444' : '#10b981', fontWeight: 'bold', fontSize: '0.85em', textTransform: 'uppercase', marginBottom: '5px' }}>Unassigned</div>
                <div style={{ color: '#fff', fontSize: '1.6em', fontWeight: 'bold' }}>${unassignedCash.toFixed(2)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowIncomeModal(true)} style={{ flex: 1, background: '#10b981', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>+ Income</button>
              <button onClick={() => setShowBillModal(true)} style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>+ Bill</button>
            </div>
          </>
        )}

        {activeTab === 'ledger' && (
          <>
            <h3 style={{ color: '#a855f7', textAlign: 'center', textTransform: 'uppercase', margin: '20px 0 15px 0' }}>Income Sources</h3>
            {incomes.length === 0 ? <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No income sources added.</p> : incomes.map(inc => (
              <div key={inc.id} style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '1.2em' }}>{inc.name}</h3>
                    <span style={{ background: '#222', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', color: '#10b981' }}>{inc.frequency}</span>
                  </div>
                  <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2em' }}>${inc.amount.toFixed(2)}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ccc', fontSize: '0.9em', borderTop: '1px dashed #333', paddingTop: '10px' }}>
                  <span>{inc.date || 'No Date'}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => syncToCalendar(inc, 'income')} style={{ background: inc.isSynced ? '#222' : '#a855f7', color: inc.isSynced ? '#a855f7' : '#fff', border: inc.isSynced ? '1px solid #a855f7' : 'none', padding: '6px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9em' }}>{inc.isSynced ? 'Synced ✓' : 'Sync 📅'}</button>
                    <button onClick={() => deleteItem(inc.id, 'income')} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontWeight: 'bold', fontSize: '1.2em' }}>×</button>
                  </div>
                </div>
              </div>
            ))}

            <h3 style={{ color: '#a855f7', textAlign: 'center', textTransform: 'uppercase', margin: '30px 0 15px 0' }}>Bill Ledger</h3>
            {bills.length === 0 ? <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No bills added.</p> : bills.map(bill => {
              const linkedInc = incomes.find(i => i.id == bill.linkedIncomeId);
              return (
                <div key={bill.id} style={{ ...cardStyle, borderLeft: `4px solid ${bill.isPaid ? '#10b981' : '#ef4444'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '1.2em', textDecoration: bill.isPaid ? 'line-through' : 'none' }}>{bill.name}</h3>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <span style={{ background: '#222', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', color: '#ef4444' }}>{bill.frequency}</span>
                        {linkedInc && <span style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', color: '#3b82f6' }}>Routed: {linkedInc.name}</span>}
                      </div>
                    </div>
                    <div style={{ color: bill.isPaid ? '#10b981' : '#ef4444', fontWeight: 'bold', fontSize: '1.2em' }}>${bill.amount.toFixed(2)}</div>
                  </div>
                  
                  {bill.photo && (
                    <div style={{ marginBottom: '10px', border: '1px solid #333', padding: '5px', borderRadius: '6px', display: 'inline-block' }}>
                      <img src={bill.photo} alt="Receipt" style={{ height: '80px', borderRadius: '4px' }} />
                    </div>
                  )}

                  <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#888', fontSize: '0.85em' }}>Route To:</span>
                    <select value={bill.linkedIncomeId} onChange={(e) => setBills(bills.map(b => b.id === bill.id ? { ...b, linkedIncomeId: e.target.value } : b))} style={{ background: '#000', color: '#3b82f6', border: '1px solid #333', padding: '6px', borderRadius: '4px', flex: 1, fontSize: '0.9em' }}>
                      <option value="None">None (Unassigned)</option>
                      {incomes.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                    </select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ccc', fontSize: '0.9em', borderTop: '1px dashed #333', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span>Due: {bill.dueDate || 'No Date'}</span>
                      {bill.isPaid && <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ Paid on {bill.datePaid}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => togglePaidStatus(bill.id)} style={{ background: bill.isPaid ? '#222' : '#10b981', color: bill.isPaid ? '#888' : '#000', border: '1px solid #10b981', padding: '6px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9em' }}>{bill.isPaid ? 'Unmark' : 'Mark Paid'}</button>
                      <button onClick={() => syncToCalendar(bill, 'bill')} style={{ background: bill.isSynced ? '#222' : '#a855f7', color: bill.isSynced ? '#a855f7' : '#fff', border: bill.isSynced ? '1px solid #a855f7' : 'none', padding: '6px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9em' }}>{bill.isSynced ? 'Synced ✓' : 'Sync 📅'}</button>
                      <button onClick={() => deleteItem(bill.id, 'bill')} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontWeight: 'bold', fontSize: '1.2em' }}>×</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* --- HISTORY TAB --- */}
        {activeTab === 'history' && (
          <>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', marginTop: '10px' }}>
              <button onClick={archiveBudget} style={{ flex: 1, background: '#10b981', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>💾 Archive Month</button>
              <button onClick={() => setShowExportModal(true)} style={{ flex: 1, background: '#222', color: '#fff', border: '1px solid #3b82f6', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>📤 Export Logs</button>
            </div>

            <h3 style={{ color: '#f59e0b', textAlign: 'center', textTransform: 'uppercase', marginBottom: '15px' }}>Archived Budgets</h3>
            {archives.length === 0 ? <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No archives saved.</p> : archives.map((arc) => (
              <div key={arc.id} style={{ ...cardStyle, borderLeft: '4px solid #f59e0b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#fff', display: 'block', marginBottom: '5px' }}>Saved: {arc.date}</strong>
                  <span style={{ color: '#10b981', marginRight: '10px', fontSize: '0.9em' }}>Pool: ${arc.totalPool.toFixed(2)}</span>
                  <span style={{ color: '#ef4444', fontSize: '0.9em' }}>Used: ${arc.usedCash.toFixed(2)}</span>
                </div>
                <button onClick={() => setViewingArchive(arc)} style={{ background: '#222', border: '1px solid #f59e0b', color: '#f59e0b', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>View Details</button>
              </div>
            ))}
          </>
        )}

        {/* --- GUIDES TAB --- */}
        {activeTab === 'guides' && (
          <div style={{ paddingTop: '10px' }}>
            <h3 style={{ color: '#10b981', textAlign: 'center', marginBottom: '20px', textTransform: 'uppercase', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '8px' }}>Budgeting Field Guide</h3>
            {guideData.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(17, 17, 17, 0.95)', borderRadius: '8px', border: '1px solid #222', marginBottom: '10px', overflow: 'hidden' }}>
                <button onClick={() => toggleAccordion(idx)} style={{ width: '100%', background: 'transparent', color: openAccordion === idx ? '#10b981' : '#fff', border: 'none', padding: '15px', textAlign: 'left', fontWeight: 'bold', fontSize: '1.05em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {item.title} <span style={{ color: '#888' }}>{openAccordion === idx ? '▼' : '▶'}</span>
                </button>
                {openAccordion === idx && (<div style={{ padding: '0 15px 15px 15px', color: '#ccc', lineHeight: '1.6', fontSize: '0.95em' }}>{item.content}</div>)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- ADD INCOME MODAL --- */}
      {showIncomeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #10b981', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2 style={{ color: '#10b981', margin: 0, textTransform: 'uppercase' }}>Log Income</h2>
            <button onClick={() => setShowIncomeModal(false)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
          </div>
          <input type="text" placeholder="Source Name (e.g. Circle K)" value={incName} onChange={(e) => setIncName(e.target.value)} style={inputStyle} />
          <input type="number" placeholder="Amount ($)" value={incAmount} onChange={(e) => setIncAmount(e.target.value)} style={inputStyle} />
          <input type="date" value={incDate} onChange={(e) => setIncDate(e.target.value)} style={inputStyle} />
          <label style={{ color: '#a855f7', fontSize: '0.85em', fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Recurring Frequency</label>
          <select value={incFreq} onChange={(e) => setIncFreq(e.target.value)} style={inputStyle}><option>None</option><option>Weekly</option><option>Bi-Weekly</option><option>Monthly</option></select>
          <button onClick={addIncome} style={{ ...btnStyle('#10b981', '#000'), marginTop: '10px' }}>Save Income</button>
        </div>
      )}

      {/* --- ADD BILL MODAL (NOW WITH PHOTO SUPPORT) --- */}
      {showBillModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ef4444', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2 style={{ color: '#ef4444', margin: 0, textTransform: 'uppercase' }}>Log Bill</h2>
            <button onClick={() => setShowBillModal(false)} style={{ background: '#222', color: '#fff', border: '1px solid #555', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
          </div>
          <input type="text" placeholder="Bill Name (e.g. Rent)" value={billName} onChange={(e) => setBillName(e.target.value)} style={inputStyle} />
          <input type="number" placeholder="Amount ($)" value={billAmount} onChange={(e) => setBillAmount(e.target.value)} style={inputStyle} />
          <input type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} style={inputStyle} />
          <label style={{ color: '#a855f7', fontSize: '0.85em', fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Recurring Frequency</label>
          <select value={billFreq} onChange={(e) => setBillFreq(e.target.value)} style={inputStyle}><option>None</option><option>Weekly</option><option>Bi-Weekly</option><option>Monthly</option></select>
          <label style={{ color: '#3b82f6', fontSize: '0.85em', fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Route to Paycheck</label>
          <select value={billLinkedInc} onChange={(e) => setBillLinkedInc(e.target.value)} style={inputStyle}>
            <option value="None">None (Unassigned)</option>
            {incomes.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>

          <label style={{ color: '#10b981', fontSize: '0.85em', fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Attach Receipt / Proof (Optional)</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <label style={{ ...btnStyle('transparent', '#10b981'), border: '1px dashed #10b981', flex: 1, textAlign: 'center' }}>📸 Camera<input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handlePhotoCapture} /></label>
            <label style={{ ...btnStyle('transparent', '#3b82f6'), border: '1px dashed #3b82f6', flex: 1, textAlign: 'center' }}>🖼️ Upload<input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoCapture} /></label>
          </div>
          {billPhoto && (<div style={{ textAlign: 'center', marginBottom: '15px' }}><img src={billPhoto} alt="Receipt Preview" style={{ height: '80px', borderRadius: '6px', border: '1px solid #10b981' }}/></div>)}

          <button onClick={addBill} style={{ ...btnStyle('#ef4444', '#fff'), marginTop: '10px' }}>Save Bill</button>
        </div>
      )}

      {/* --- EXPORT MODAL (TRIPLE FALLBACK) --- */}
      {showExportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #3b82f6', width: '100%' }}>
            <h2 style={{ color: '#3b82f6', marginTop: 0, textAlign: 'center', textTransform: 'uppercase' }}>Export Controls</h2>
            <p style={{ color: '#ccc', textAlign: 'center', marginBottom: '25px', fontSize: '0.9em' }}>Select how you want to export your encrypted budget data.</p>
            
            <button onClick={downloadCSVFile} style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '10px' }}>📥 Download Excel (.CSV)</button>
            <button onClick={shareCSV} style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '10px' }}>📧 Email / Share (.CSV)</button>
            <button onClick={copyCSVToClipboard} style={{ width: '100%', background: '#a855f7', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '25px' }}>📋 Copy Raw Data</button>
            
            <button onClick={() => setShowExportModal(false)} style={{ width: '100%', background: 'transparent', color: '#ef4444', border: '1px dashed #ef4444', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* --- COLLAPSIBLE HISTORY VIEWER MODAL --- */}
      {viewingArchive && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#000', zIndex: 100, padding: '15px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f59e0b', paddingBottom: '10px', marginBottom: '15px' }}>
            <h2 style={{ color: '#f59e0b', margin: 0, textTransform: 'uppercase' }}>Archived Ledger</h2>
            <button onClick={() => setViewingArchive(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
          </div>
          
          <div style={{ background: '#fff', color: '#000', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ color: '#f59e0b', textAlign: 'center', margin: '0 0 5px 0', textTransform: 'uppercase' }}>MONTHLY SNAPSHOT</h2>
            <h4 style={{ textAlign: 'center', margin: '0 0 20px 0', color: '#666' }}>Archived: {viewingArchive.date}</h4>
            
            <h4 style={{ color: '#666', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Incomes</h4>
            {viewingArchive.incomes.length === 0 ? <p style={{ fontStyle: 'italic', fontSize: '0.9em' }}>None</p> : viewingArchive.incomes.map(i => (
              <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '5px' }}><span>{i.name}</span><span style={{ color: '#10b981' }}>${i.amount.toFixed(2)}</span></div>
            ))}

            <h4 style={{ color: '#666', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '20px' }}>Bills & Liabilities</h4>
            {viewingArchive.bills.length === 0 ? <p style={{ fontStyle: 'italic', fontSize: '0.9em' }}>None</p> : viewingArchive.bills.map(b => (
              <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '5px' }}>
                <span>{b.name} {b.isPaid ? ' (PAID)' : ' (UNPAID)'}</span><span style={{ color: '#ef4444' }}>${b.amount.toFixed(2)}</span>
              </div>
            ))}

            <div style={{ borderTop: '2px solid #000', marginTop: '20px', paddingTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '5px' }}><span>TOTAL POOL:</span><span>${viewingArchive.totalPool.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '5px' }}><span>TOTAL USED:</span><span style={{ color: '#ef4444' }}>${viewingArchive.usedCash.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1em' }}><span>UNASSIGNED:</span><span style={{ color: viewingArchive.unassignedCash < 0 ? '#ef4444' : '#10b981' }}>${viewingArchive.unassignedCash.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
