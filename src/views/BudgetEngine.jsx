import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BudgetEngine() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- STATE & LEGACY ARCHIVE RECOVERY ---
  const [incomes, setIncomes] = useState(() => JSON.parse(localStorage.getItem('tot_incomes')) || []);
  const [bills, setBills] = useState(() => JSON.parse(localStorage.getItem('tot_bills')) || []);
  const [quickSpends, setQuickSpends] = useState(() => JSON.parse(localStorage.getItem('tot_quickSpends')) || []);
  const [archives, setArchives] = useState(() => {
    const primary = JSON.parse(localStorage.getItem('tot_budgetArchives')) || [];
    const alt1 = JSON.parse(localStorage.getItem('tot_archives')) || [];
    const alt2 = JSON.parse(localStorage.getItem('tot_history')) || [];
    const merged = [...primary, ...alt1, ...alt2];
    const seen = new Set();
    return merged.filter(item => {
      if (!item || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  });

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [viewingArchive, setViewingArchive] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);

  const [showEnvelopeLedger, setShowEnvelopeLedger] = useState(false);
  const [showQuickSpendAccordion, setShowQuickSpendAccordion] = useState(false);

  const [incName, setIncName] = useState('');
  const [incAmount, setIncAmount] = useState('');
  const [incDate, setIncDate] = useState('');
  const [incFreq, setIncFreq] = useState('None');

  const [billName, setBillName] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDate, setBillDate] = useState('');
  const [billFreq, setBillFreq] = useState('None');
  const [billLinkedInc, setBillLinkedInc] = useState('None');
  const [billPhoto, setBillPhoto] = useState(null);

  const [quickDesc, setQuickDesc] = useState('');
  const [quickAmount, setQuickAmount] = useState('');
  const [quickLinkedInc, setQuickLinkedInc] = useState('None');

  useEffect(() => {
    localStorage.setItem('tot_incomes', JSON.stringify(incomes));
    localStorage.setItem('tot_bills', JSON.stringify(bills));
    localStorage.setItem('tot_quickSpends', JSON.stringify(quickSpends));
    localStorage.setItem('tot_budgetArchives', JSON.stringify(archives));
  }, [incomes, bills, quickSpends, archives]);

  // --- DASHBOARD CALCULATIONS ---
  const totalPool = incomes.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalBills = bills.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalLiability = bills.filter(b => !b.isPaid).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const usedPocketCash = quickSpends.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  // Used Cash is all of it combined (all bills + used pocket cash)
  const usedCash = totalBills + usedPocketCash;
  // Available deducts all bills (liability/paid) and pocket spends from the pool
  const availableCash = totalPool - usedCash;

  // Unbound items (not routed to any active income envelope)
  const unboundBills = bills.filter(b => !incomes.some(inc => String(inc.id) === String(b.linkedIncomeId)));
  const unboundSpends = quickSpends.filter(s => !incomes.some(inc => String(inc.id) === String(s.linkedIncomeId)));
  const totalUnbound = unboundBills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0) +
                       unboundSpends.reduce((acc, s) => acc + (Number(s.amount) || 0), 0);

  const guideData = [
    { title: "Zero-Based Budgeting", content: "Every dollar in your Total Cash Pool should be assigned to an envelope or savings target." },
    { title: "Paycheck Routing & Unbound Items", content: "Route bills to specific paychecks in Manage. Any bill left on 'None' is tracked under Unbound Liabilities on your master ledger." },
    { title: "Cycle Advancement", content: "Use 'Advance' on incomes and 'Pay & Advance' on bills to automatically roll dates forward by their Weekly, Bi-Weekly, or Monthly cycle." }
  ];

  const toggleAccordion = (index) => setOpenAccordion(openAccordion === index ? null : index);

  const advanceDateString = (dateStr, freq) => {
    const base = dateStr ? new Date(dateStr + 'T00:00:00') : new Date();
    if (isNaN(base.getTime())) return new Date().toISOString().split('T')[0];
    if (freq === 'Weekly') base.setDate(base.getDate() + 7);
    else if (freq === 'Bi-Weekly') base.setDate(base.getDate() + 14);
    else if (freq === 'Monthly') base.setMonth(base.getMonth() + 1);
    else base.setDate(base.getDate() + 30);
    return base.toISOString().split('T')[0];
  };

  const advanceIncome = (inc) => {
    const nextDate = advanceDateString(inc.date, inc.frequency);
    setIncomes(incomes.map(i => i.id === inc.id ? { ...i, date: nextDate } : i));
  };

  const payAndAdvanceBill = (bill) => {
    const nextDate = advanceDateString(bill.dueDate, bill.frequency);
    setBills(bills.map(b => b.id === bill.id ? {
      ...b,
      dueDate: nextDate,
      isPaid: true,
      datePaid: new Date().toLocaleDateString()
    } : b));
  };
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
    const amt = parseFloat(incAmount);
    if (!incName || isNaN(amt)) return alert("Name and valid Amount are required.");
    setIncomes([...incomes, { id: Date.now(), name: incName, amount: amt, date: incDate, frequency: incFreq, isSynced: false }]);
    setIncName(''); setIncAmount(''); setIncDate(''); setIncFreq('None'); setShowIncomeModal(false);
  };

  const addBill = () => {
    const amt = parseFloat(billAmount);
    if (!billName || isNaN(amt)) return alert("Name and valid Amount are required.");
    setBills([...bills, { id: Date.now(), name: billName, amount: amt, dueDate: billDate, frequency: billFreq, linkedIncomeId: billLinkedInc, isPaid: false, datePaid: null, photo: billPhoto, isSynced: false }]);
    setBillName(''); setBillAmount(''); setBillDate(''); setBillFreq('None'); setBillLinkedInc('None'); setBillPhoto(null); setShowBillModal(false);
  };

  const addQuickSpend = (presetAmt = null, presetDesc = null) => {
    const amt = presetAmt !== null ? parseFloat(presetAmt) : parseFloat(quickAmount);
    const desc = presetDesc !== null ? presetDesc : quickDesc.trim();
    if (!amt || isNaN(amt) || amt <= 0) return alert("Enter a valid amount.");
    if (!desc) return alert("Enter an item note (e.g., Gas, Drink).");
    setQuickSpends([{
      id: Date.now(),
      name: desc,
      amount: amt,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      linkedIncomeId: quickLinkedInc
    }, ...quickSpends]);
    setQuickDesc('');
    setQuickAmount('');
  };

  const deleteItem = (id, type) => {
    if (type === 'income') {
      setIncomes(incomes.filter(i => i.id !== id));
      setBills(bills.map(b => String(b.linkedIncomeId) === String(id) ? { ...b, linkedIncomeId: 'None' } : b));
      setQuickSpends(quickSpends.map(s => String(s.linkedIncomeId) === String(id) ? { ...s, linkedIncomeId: 'None' } : s));
    } else {
      setBills(bills.filter(b => b.id !== id));
    }
  };

  const deleteQuickSpend = (id) => setQuickSpends(quickSpends.filter(item => item.id !== id));
  const deleteArchive = (id) => setArchives(archives.filter(a => a.id !== id));

  const togglePaidStatus = (id) => {
    setBills(bills.map(b => b.id === id ? { ...b, isPaid: !b.isPaid, datePaid: !b.isPaid ? new Date().toLocaleDateString() : null } : b));
  };

  const archiveBudget = () => {
    if (totalPool === 0 && usedCash === 0) return alert("Nothing to archive.");
    if (window.confirm("Create a historical snapshot of this ledger?")) {
      const now = new Date();
      const stamp = `${now.toLocaleDateString()} (${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
      const snapshot = {
        id: Date.now(),
        date: stamp,
        totalPool,
        totalLiability,
        totalBills,
        usedPocketCash,
        usedCash,
        availableCash,
        unassignedCash: availableCash,
        incomes: [...incomes],
        bills: [...bills],
        quickSpends: [...quickSpends]
      };
      setArchives([snapshot, ...archives]);
      if (window.confirm("Snapshot saved to Archive. Clear current Quick Pocket Cash for the new cycle? (Incomes and Bills will remain unless you delete them)")) {
        setQuickSpends([]);
      }
    }
  };

  const getCSVString = () => {
    let csv = "Category,Item Name,Amount,Date/Due,Cycle,Routed Envelope,Status,Date Paid\n";
    incomes.forEach(i => {
      csv += `"INCOME","${i.name}","$${(Number(i.amount) || 0).toFixed(2)}","${i.date || 'N/A'}","${i.frequency}","Self","CREDIT","N/A"\n`;
    });
    bills.forEach(b => {
      const linkedName = incomes.find(inc => String(inc.id) === String(b.linkedIncomeId))?.name || 'Unbound (General Pool)';
      csv += `"BILL","${b.name}","-$${(Number(b.amount) || 0).toFixed(2)}","${b.dueDate || 'N/A'}","${b.frequency}","${linkedName}","${b.isPaid ? 'PAID' : 'LIABILITY'}","${b.datePaid || 'N/A'}"\n`;
    });
    quickSpends.forEach(s => {
      const linkedName = incomes.find(inc => String(inc.id) === String(s.linkedIncomeId))?.name || 'Unbound (General Pool)';
      csv += `"POCKET CASH","${s.name}","-$${(Number(s.amount) || 0).toFixed(2)}","${s.date} ${s.time}","One-Time","${linkedName}","SPENT","${s.date}"\n`;
    });
    csv += `\n"SUMMARY","Total Cash Pool","$${totalPool.toFixed(2)}","Total Liability","$${totalLiability.toFixed(2)}","Used Pocket Cash","$${usedPocketCash.toFixed(2)}",""\n`;
    csv += `"SUMMARY","Total Used Cash (Combined)","$${usedCash.toFixed(2)}","Net Available","$${availableCash.toFixed(2)}","","",""\n`;
    return csv;
  };

  const downloadCSVFile = () => {
    const blob = new Blob([getCSVString()], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `cashflow_ledger_${Date.now()}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const shareCSV = async () => {
    try {
      const file = new File([getCSVString()], `cashflow_ledger_${Date.now()}.csv`, { type: 'text/csv' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Cashflow Ledger', text: 'Attached is your Cashflow CSV Ledger' });
      } else {
        window.open(`mailto:?subject=Cashflow Ledger&body=${encodeURIComponent(getCSVString())}`);
      }
    } catch (err) { console.error("Share failed", err); }
  };

  const copyCSVToClipboard = () => {
    navigator.clipboard.writeText(getCSVString());
    alert("Ledger CSV copied to clipboard.");
  };

  const cardStyle = { background: 'rgba(17, 17, 17, 0.95)', borderRadius: '12px', border: '1px solid #222', padding: '15px', marginBottom: '15px' };
  const inputStyle = { background: '#000', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '6px', width: '100%', marginBottom: '15px', fontSize: '1em' };
  const btnStyle = (bg, color) => ({ background: bg, color: color, border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', width: '100%', fontSize: '1em' });
  const renderProfessionalLedger = (incList, billList, spendList, titleLabel, subtitleDate) => {
    const grossPool = incList.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
    const allBillTotal = billList.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
    const unpaidLiab = billList.filter(b => !b.isPaid).reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
    const pocketTotal = spendList.reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
    const combinedUsed = allBillTotal + pocketTotal;
    const netAvail = grossPool - combinedUsed;

    const unroutedBills = billList.filter(b => !incList.some(inc => String(inc.id) === String(b.linkedIncomeId)));
    const unroutedSpends = spendList.filter(s => !incList.some(inc => String(inc.id) === String(s.linkedIncomeId)));
    const unroutedSum = unroutedBills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0) +
                        unroutedSpends.reduce((acc, s) => acc + (Number(s.amount) || 0), 0);

    return (
      <div style={{ background: '#09090b', border: '1px solid #333', borderRadius: '12px', padding: '16px', marginBottom: '20px', fontFamily: 'monospace' }}>
        <div style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '1.05em', letterSpacing: '1px', textTransform: 'uppercase' }}>{titleLabel}</div>
            <div style={{ color: '#888', fontSize: '0.8em' }}>Statement Date: {subtitleDate}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#888', fontSize: '0.75em', textTransform: 'uppercase' }}>Net Available</div>
            <div style={{ color: netAvail < 0 ? '#ef4444' : '#10b981', fontWeight: 'bold', fontSize: '1.15em' }}>${netAvail.toFixed(2)}</div>
          </div>
        </div>

        {/* ENVELOPE SECTIONS */}
        <div style={{ color: '#a855f7', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>I. Income Envelopes & Routed Debits</div>
        {incList.length === 0 ? (
          <div style={{ color: '#666', fontStyle: 'italic', padding: '10px', background: '#111', borderRadius: '6px', marginBottom: '15px' }}>No income envelopes recorded.</div>
        ) : (
          incList.map(inc => {
            const envBills = billList.filter(b => String(b.linkedIncomeId) === String(inc.id));
            const envSpends = spendList.filter(s => String(s.linkedIncomeId) === String(inc.id));
            const envUsed = envBills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0) +
                            envSpends.reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
            const envRem = (Number(inc.amount) || 0) - envUsed;

            return (
              <div key={inc.id} style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #27272a', paddingBottom: '6px', marginBottom: '8px' }}>
                  <div>
                    <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1em' }}>{inc.name}</span>
                    <span style={{ color: '#888', fontSize: '0.8em', marginLeft: '6px' }}>({inc.date || 'No Date'})</span>
                  </div>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>+${(Number(inc.amount) || 0).toFixed(2)}</span>
                </div>

                {envBills.length === 0 && envSpends.length === 0 ? (
                  <div style={{ color: '#555', fontSize: '0.8em', padding: '4px 0' }}>No bills or pocket spends routed to this envelope.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
                    {envBills.map(b => (
                      <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em', borderLeft: `3px solid ${b.isPaid ? '#10b981' : '#ef4444'}`, paddingLeft: '8px', color: '#d4d4d8' }}>
                        <span>[BILL] {b.name} <span style={{ color: b.isPaid ? '#10b981' : '#f59e0b', fontSize: '0.85em' }}>({b.isPaid ? 'PAID' : 'UNPAID'})</span></span>
                        <span style={{ color: '#ef4444', fontWeight: 'bold' }}>-${(Number(b.amount) || 0).toFixed(2)}</span>
                      </div>
                    ))}
                    {envSpends.map(s => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em', borderLeft: '3px solid #f59e0b', paddingLeft: '8px', color: '#d4d4d8' }}>
                        <span>[POCKET] {s.name} <span style={{ color: '#71717a', fontSize: '0.85em' }}>({s.time || s.date})</span></span>
                        <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>-${(Number(s.amount) || 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #333', paddingTop: '6px', fontSize: '0.85em', fontWeight: 'bold' }}>
                  <span style={{ color: '#a1a1aa' }}>Envelope Remaining:</span>
                  <span style={{ color: envRem < 0 ? '#ef4444' : '#38bdf8' }}>${envRem.toFixed(2)}</span>
                </div>
              </div>
            );
          })
        )}

        {/* UNBOUND BILLS & POCKET SPENDS SECTION */}
        <div style={{ color: '#ef4444', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '16px', marginBottom: '8px' }}>II. Unbound Bills & General Pool Debits</div>
        <div style={{ background: '#121215', border: '1px solid #3f1d1d', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
          {unroutedBills.length === 0 && unroutedSpends.length === 0 ? (
            <div style={{ color: '#666', fontSize: '0.85em', fontStyle: 'italic' }}>No unbound bills or general pool pocket spends.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {unroutedBills.map(b => (
                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em', borderLeft: '3px solid #ef4444', paddingLeft: '8px', color: '#e4e4e7' }}>
                  <span>[UNBOUND BILL] {b.name} <span style={{ color: b.isPaid ? '#10b981' : '#ef4444', fontSize: '0.85em' }}>({b.isPaid ? 'PAID' : 'LIABILITY'})</span></span>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>-${(Number(b.amount) || 0).toFixed(2)}</span>
                </div>
              ))}
              {unroutedSpends.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em', borderLeft: '3px solid #f59e0b', paddingLeft: '8px', color: '#e4e4e7' }}>
                  <span>[UNBOUND POCKET] {s.name} <span style={{ color: '#71717a', fontSize: '0.85em' }}>({s.time || s.date})</span></span>
                  <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>-${(Number(s.amount) || 0).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #3f1d1d', paddingTop: '6px', marginTop: '4px', fontSize: '0.85em', fontWeight: 'bold' }}>
                <span style={{ color: '#fca5a5' }}>Total Unbound Debits:</span>
                <span style={{ color: '#ef4444' }}>-${unroutedSum.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* MASTER RECONCILIATION TABLE */}
        <div style={{ color: '#10b981', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>III. Master Ledger Reconciliation</div>
        <div style={{ background: '#141418', border: '1px solid #2e2e36', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9em' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#a1a1aa' }}>Gross Cash Pool:</span>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>+${grossPool.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#a1a1aa' }}>Unpaid Bill Liability:</span>
            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>-${unpaidLiab.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#a1a1aa' }}>Total Bills (Paid & Unpaid):</span>
            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>-${allBillTotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#a1a1aa' }}>Used Pocket Cash:</span>
            <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>-${pocketTotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #2e2e36', paddingTop: '6px' }}>
            <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>Total Used Cash (All Combined):</span>
            <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>-${combinedUsed.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #3b82f6', paddingTop: '8px', marginTop: '2px', fontSize: '1.05em' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>NET AVAILABLE CASH:</span>
            <span style={{ color: netAvail < 0 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>${netAvail.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.85)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
          <h2 style={{ margin: 0, color: '#10b981', fontSize: '1.2em' }}>Cashflow Engine</h2>
        </div>
      </header>

      <div style={{ display: 'flex', padding: '12px 15px', gap: '8px', background: 'rgba(0,0,0,0.6)', overflowX: 'auto' }}>
        <button onClick={() => setActiveTab('dashboard')} style={{ flex: '0 0 auto', padding: '10px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'dashboard' ? '#22d3ee' : '#222', color: activeTab === 'dashboard' ? '#000' : '#888' }}>Dashboard</button>
        <button onClick={() => setActiveTab('Ledger')} style={{ flex: '0 0 auto', padding: '10px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'Ledger' ? '#a855f7' : '#222', color: activeTab === 'Ledger' ? '#fff' : '#888' }}>Manage</button>
        <button onClick={() => setActiveTab('history')} style={{ flex: '0 0 auto', padding: '10px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'history' ? '#f59e0b' : '#222', color: activeTab === 'history' ? '#000' : '#888' }}>Archive</button>
        <button onClick={() => setShowExportModal(true)} style={{ flex: '0 0 auto', padding: '10px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: '#222', color: '#888' }}>Export</button>
        <button onClick={() => setActiveTab('guides')} style={{ flex: '0 0 auto', padding: '10px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'guides' ? '#10b981' : '#222', color: activeTab === 'guides' ? '#000' : '#888' }}>Guides</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        {activeTab === 'dashboard' && (
          <>
            <div style={{ ...cardStyle, textAlign: 'center', borderTop: '4px solid #a855f7', marginTop: '10px' }}>
              <div style={{ color: '#a855f7', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Total Cash Pool</div>
              <div style={{ color: '#10b981', fontSize: '1.8em', fontWeight: 'bold' }}>${totalPool.toFixed(2)}</div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
              <div style={{ flex: 1, ...cardStyle, textAlign: 'center', borderTop: '4px solid #ef4444', margin: 0 }}>
                <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.8em', textTransform: 'uppercase', marginBottom: '6px' }}>Total Liability</div>
                <div style={{ color: '#10b981', fontSize: '1.35em', fontWeight: 'bold' }}>${totalLiability.toFixed(2)}</div>
              </div>
              <div style={{ flex: 1, ...cardStyle, textAlign: 'center', borderTop: '4px solid #ec4899', margin: 0 }}>
                <div style={{ color: '#ec4899', fontWeight: 'bold', fontSize: '0.8em', textTransform: 'uppercase', marginBottom: '6px' }}>Used Pocket Cash</div>
                <div style={{ color: '#10b981', fontSize: '1.35em', fontWeight: 'bold' }}>${usedPocketCash.toFixed(2)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <div style={{ flex: 1, ...cardStyle, textAlign: 'center', borderTop: '4px solid #f59e0b', margin: 0 }}>
                <div style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '0.8em', textTransform: 'uppercase', marginBottom: '6px' }}>Used Cash (All)</div>
                <div style={{ color: '#10b981', fontSize: '1.35em', fontWeight: 'bold' }}>${usedCash.toFixed(2)}</div>
              </div>
              <div style={{ flex: 1, ...cardStyle, textAlign: 'center', borderTop: '4px solid #10b981', margin: 0 }}>
                <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.8em', textTransform: 'uppercase', marginBottom: '6px' }}>Available</div>
                <div style={{ color: availableCash < 0 ? '#ef4444' : '#10b981', fontSize: '1.35em', fontWeight: 'bold' }}>${availableCash.toFixed(2)}</div>
              </div>
            </div>

            <button onClick={() => setShowEnvelopeLedger(!showEnvelopeLedger)} style={{ ...btnStyle(showEnvelopeLedger ? '#27272a' : '#3b82f6', '#fff'), marginBottom: '12px', border: showEnvelopeLedger ? '1px solid #444' : 'none' }}>
              {showEnvelopeLedger ? 'Hide Envelope Ledger' : 'Preview Envelope Ledger'}
            </button>

            {showEnvelopeLedger && renderProfessionalLedger(incomes, bills, quickSpends, 'Master Cashflow Ledger', new Date().toLocaleDateString())}

            <button onClick={() => setShowQuickSpendAccordion(!showQuickSpendAccordion)} style={{ ...btnStyle('rgba(17,17,17,0.9)', '#f59e0b'), border: '1px dashed #f59e0b', marginBottom: '15px' }}>
              ⚡ {showQuickSpendAccordion ? 'Hide Pocket Cash Log' : `Quick Pocket Cash ($${usedPocketCash.toFixed(2)})`}
            </button>

            {showQuickSpendAccordion && (
              <div style={{ ...cardStyle, border: '1px solid #f59e0b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '0.9em', textTransform: 'uppercase' }}>Log Pocket Cash Spend</span>
                  <span style={{ color: '#ec4899', fontWeight: 'bold', fontSize: '0.95em' }}>Pocket Total: -${usedPocketCash.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input type="text" placeholder="Item (Energy Drink, Gas)" value={quickDesc} onChange={(e) => setQuickDesc(e.target.value)} style={{ ...inputStyle, flex: 2, marginBottom: 0, padding: '10px', fontSize: '0.9em' }} />
                  <input type="number" placeholder="$" value={quickAmount} onChange={(e) => setQuickAmount(e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 0, padding: '10px', fontSize: '0.9em' }} />
                  <button onClick={() => addQuickSpend()} style={{ ...btnStyle('#f59e0b', '#000'), width: 'auto', padding: '10px 16px', fontSize: '0.9em', flexShrink: 0 }}>Add</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ color: '#888', fontSize: '0.75em' }}>Deduct From:</span>
                  <select value={quickLinkedInc} onChange={(e) => setQuickLinkedInc(e.target.value)} style={{ background: '#000', color: '#10b981', border: '1px solid #333', borderRadius: '4px', padding: '6px 8px', fontSize: '0.85em', flex: 1 }}>
                    <option value="None">Unbound (General Cash Pool)</option>
                    {incomes.map(inc => <option key={inc.id} value={inc.id}>{inc.name} (${(Number(inc.amount) || 0).toFixed(2)})</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                  <button onClick={() => addQuickSpend(5, 'Energy Drink')} style={{ flex: 1, background: '#222', border: '1px solid #444', color: '#ccc', borderRadius: '4px', padding: '6px', fontSize: '0.75em', fontWeight: 'bold' }}>+$5 Drink</button>
                  <button onClick={() => addQuickSpend(10, 'Food / Snack')} style={{ flex: 1, background: '#222', border: '1px solid #444', color: '#ccc', borderRadius: '4px', padding: '6px', fontSize: '0.75em', fontWeight: 'bold' }}>+$10 Food</button>
                  <button onClick={() => addQuickSpend(25, 'Gas')} style={{ flex: 1, background: '#222', border: '1px solid #444', color: '#ccc', borderRadius: '4px', padding: '6px', fontSize: '0.75em', fontWeight: 'bold' }}>+$25 Gas</button>
                </div>
                {quickSpends.length > 0 && (
                  <div style={{ maxHeight: '160px', overflowY: 'auto', borderTop: '1px dashed #333', paddingTop: '8px' }}>
                    {quickSpends.map(spend => (
                      <div key={spend.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #1a1a1a', fontSize: '0.85em' }}>
                        <div>
                          <span style={{ color: '#fff', fontWeight: 'bold' }}>{spend.name}</span>
                          <span style={{ color: '#666', fontSize: '0.8em', marginLeft: '6px' }}>({spend.time})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>-${(Number(spend.amount) || 0).toFixed(2)}</span>
                          <button onClick={() => deleteQuickSpend(spend.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.1em', fontWeight: 'bold', padding: '0 4px' }}>×</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
        {activeTab === 'Ledger' && (
          <>
            <h3 style={{ color: '#10b981', textAlign: 'center', textTransform: 'uppercase', margin: '20px 0 15px 0' }}>Manage Income</h3>
            {incomes.length === 0 ? <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No income sources added.</p> : incomes.map(inc => (
              <div key={inc.id} style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.15em' }}>{inc.name}</span>
                    <span style={{ color: '#888', marginLeft: '6px' }}>({inc.date || 'No Date'})</span>
                  </div>
                  <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.15em' }}>${(Number(inc.amount) || 0).toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'center', color: '#aaa', fontSize: '0.9em', marginBottom: '12px' }}>Cycle: {inc.frequency}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button onClick={() => advanceIncome(inc)} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold' }}>Advance 📅</button>
                  <button onClick={() => deleteItem(inc.id, 'income')} style={{ background: '#222', color: '#fff', border: '1px solid #333', padding: '8px 12px', borderRadius: '8px' }}>🗑️</button>
                </div>
              </div>
            ))}

            <h3 style={{ color: '#10b981', textAlign: 'center', textTransform: 'uppercase', margin: '30px 0 15px 0' }}>Manage Bills</h3>
            {bills.length === 0 ? <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No bills added.</p> : bills.map(bill => (
              <div key={bill.id} style={{ ...cardStyle, borderLeft: `4px solid ${bill.isPaid ? '#10b981' : '#ef4444'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.15em', textDecoration: bill.isPaid ? 'line-through' : 'none' }}>{bill.name}</span>
                    <span style={{ color: '#888', marginLeft: '6px' }}>({bill.dueDate || 'No Date'})</span>
                  </div>
                  <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.15em' }}>${(Number(bill.amount) || 0).toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'center', color: '#aaa', fontSize: '0.9em', marginBottom: '12px' }}>
                  Cycle: {bill.frequency} {bill.isPaid && <span style={{ color: '#10b981', marginLeft: '6px' }}>• PAID ({bill.datePaid})</span>}
                </div>
                {bill.photo && (
                  <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                    <img src={bill.photo} alt="Receipt" style={{ height: '80px', borderRadius: '6px', border: '1px solid #333' }} />
                  </div>
                )}
                <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '8px', padding: '10px', marginBottom: '12px' }}>
                  <div style={{ color: '#888', fontSize: '0.8em', textAlign: 'center', textTransform: 'uppercase', marginBottom: '6px' }}>Route To Ledger:</div>
                  <select value={bill.linkedIncomeId} onChange={(e) => setBills(bills.map(b => b.id === bill.id ? { ...b, linkedIncomeId: e.target.value } : b))} style={{ background: '#111', color: '#10b981', border: '1px solid #333', padding: '10px', borderRadius: '6px', width: '100%', fontSize: '0.95em' }}>
                    <option value="None">None (Unbound General Pool)</option>
                    {incomes.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => togglePaidStatus(bill.id)} style={{ flex: 1, background: '#3b82f6', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>{bill.isPaid ? 'Unmark Paid' : 'Mark Paid ✅'}</button>
                  <button onClick={() => payAndAdvanceBill(bill)} style={{ flex: 1, background: '#10b981', color: '#000', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>Pay & Advance 📅</button>
                  <button onClick={() => deleteItem(bill.id, 'bill')} style={{ background: '#222', color: '#fff', border: '1px solid #333', padding: '10px 14px', borderRadius: '8px' }}>🗑️</button>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowIncomeModal(true)} style={{ flex: 1, background: '#10b981', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.05em' }}>+ Add Income</button>
              <button onClick={() => setShowBillModal(true)} style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.05em' }}>+ Add Bill</button>
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', marginTop: '10px' }}>
              <button onClick={archiveBudget} style={{ flex: 1, background: '#10b981', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>💾 Save Snapshot</button>
              <button onClick={() => setShowExportModal(true)} style={{ flex: 1, background: '#222', color: '#fff', border: '1px solid #3b82f6', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>📤 Export Logs</button>
            </div>
            <h3 style={{ color: '#10b981', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Historical Snapshots</h3>
            {archives.length === 0 ? <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No archives saved.</p> : archives.map((arc) => {
              const arcPool = Number(arc.totalPool ?? arc.pool ?? 0);
              const arcUsed = Number(arc.usedCash ?? arc.used ?? 0);
              const arcAvail = Number(arc.availableCash ?? arc.unassignedCash ?? arc.available ?? (arcPool - arcUsed));
              return (
                <div key={arc.id} style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>{arc.date}</span>
                    <button onClick={() => deleteArchive(arc.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.2em', fontWeight: 'bold' }}>×</button>
                  </div>
                  <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-around', textAlign: 'center', marginBottom: '12px' }}>
                    <div>
                      <div style={{ color: '#888', fontSize: '0.75em', textTransform: 'uppercase', marginBottom: '4px' }}>Pool</div>
                      <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1em' }}>${arcPool.toFixed(2)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#888', fontSize: '0.75em', textTransform: 'uppercase', marginBottom: '4px' }}>Used (All)</div>
                      <div style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '1.1em' }}>${arcUsed.toFixed(2)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#888', fontSize: '0.75em', textTransform: 'uppercase', marginBottom: '4px' }}>Available</div>
                      <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.1em' }}>${arcAvail.toFixed(2)}</div>
                    </div>
                  </div>
                  <button onClick={() => setViewingArchive(arc)} style={{ ...btnStyle('#1a1a1a', '#f59e0b'), border: '1px dashed #f59e0b' }}>View Full Ledger</button>
                </div>
              );
            })}
          </>
        )}

        {activeTab === 'guides' && (
          <div style={{ paddingTop: '10px' }}>
            <h3 style={{ color: '#10b981', textAlign: 'center', margin: '0 0 20px 0', textTransform: 'uppercase' }}>Budgeting Field Guide</h3>
            {guideData.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(17, 17, 17, 0.95)', borderRadius: '8px', border: '1px solid #222', marginBottom: '10px' }}>
                <button onClick={() => toggleAccordion(idx)} style={{ width: '100%', background: 'transparent', color: openAccordion === idx ? '#10b981' : '#fff', border: 'none', padding: '15px', textAlign: 'left', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                  {item.title} <span>{openAccordion === idx ? '▼' : '▶'}</span>
                </button>
                {openAccordion === idx && <div style={{ padding: '0 15px 15px 15px', color: '#ccc', lineHeight: '1.5' }}>{item.content}</div>}
              </div>
            ))}
          </div>
        )}

        {showIncomeModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #10b981', paddingBottom: '15px', marginBottom: '20px' }}>
              <h2 style={{ color: '#10b981', margin: 0 }}>LOG INCOME</h2>
              <button onClick={() => setShowIncomeModal(false)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
            </div>
            <input type="text" placeholder="Source Name" value={incName} onChange={(e) => setIncName(e.target.value)} style={inputStyle} />
            <input type="number" placeholder="Amount ($)" value={incAmount} onChange={(e) => setIncAmount(e.target.value)} style={inputStyle} />
            <input type="date" value={incDate} onChange={(e) => setIncDate(e.target.value)} style={inputStyle} />
            <select value={incFreq} onChange={(e) => setIncFreq(e.target.value)} style={inputStyle}><option>None</option><option>Weekly</option><option>Bi-Weekly</option><option>Monthly</option></select>
            <button onClick={addIncome} style={btnStyle('#10b981', '#000')}>Save Income</button>
          </div>
        )}

        {showBillModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ef4444', paddingBottom: '15px', marginBottom: '20px' }}>
              <h2 style={{ color: '#ef4444', margin: 0 }}>LOG BILL</h2>
              <button onClick={() => setShowBillModal(false)} style={{ background: '#222', color: '#fff', border: '1px solid #555', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
            </div>
            <input type="text" placeholder="Bill Name" value={billName} onChange={(e) => setBillName(e.target.value)} style={inputStyle} />
            <input type="number" placeholder="Amount ($)" value={billAmount} onChange={(e) => setBillAmount(e.target.value)} style={inputStyle} />
            <input type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} style={inputStyle} />
            <select value={billFreq} onChange={(e) => setBillFreq(e.target.value)} style={inputStyle}><option>None</option><option>Weekly</option><option>Bi-Weekly</option><option>Monthly</option></select>
            <select value={billLinkedInc} onChange={(e) => setBillLinkedInc(e.target.value)} style={inputStyle}>
              <option value="None">None (Unbound General Pool)</option>
              {incomes.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <label style={{ ...btnStyle('transparent', '#10b981'), border: '1px dashed #10b981', flex: 1, textAlign: 'center' }}>📸 Camera<input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handlePhotoCapture} /></label>
              <label style={{ ...btnStyle('transparent', '#3b82f6'), border: '1px dashed #3b82f6', flex: 1, textAlign: 'center' }}>🖼️ Upload<input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoCapture} /></label>
            </div>
            {billPhoto && <div style={{ textAlign: 'center', marginBottom: '15px' }}><img src={billPhoto} alt="Receipt" style={{ height: '80px', borderRadius: '6px' }} /></div>}
            <button onClick={addBill} style={btnStyle('#ef4444', '#fff')}>Save Bill</button>
          </div>
        )}

        {showExportModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #3b82f6', width: '100%' }}>
              <h2 style={{ color: '#3b82f6', margin: '0 0 15px 0', textAlign: 'center' }}>EXPORT LEDGER</h2>
              <button onClick={downloadCSVFile} style={{ ...btnStyle('#10b981', '#000'), marginBottom: '10px' }}>📥 Download CSV</button>
              <button onClick={shareCSV} style={{ ...btnStyle('#3b82f6', '#fff'), marginBottom: '10px' }}>📧 Share CSV</button>
              <button onClick={copyCSVToClipboard} style={{ ...btnStyle('#a855f7', '#fff'), marginBottom: '20px' }}>📋 Copy CSV Text</button>
              <button onClick={() => setShowExportModal(false)} style={{ ...btnStyle('transparent', '#ef4444'), border: '1px dashed #ef4444' }}>Cancel</button>
            </div>
          </div>
        )}

        {viewingArchive && (
          <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, padding: '15px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f59e0b', paddingBottom: '10px', marginBottom: '15px' }}>
              <h2 style={{ color: '#f59e0b', margin: 0, fontSize: '1.1em' }}>ARCHIVED STATEMENT</h2>
              <button onClick={() => setViewingArchive(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
            </div>
            {renderProfessionalLedger(
              viewingArchive.incomes || [],
              viewingArchive.bills || [],
              viewingArchive.quickSpends || [],
              'Archived Master Ledger',
              viewingArchive.date
            )}
          </div>
        )}
      </div>
    </div>
  );
}
