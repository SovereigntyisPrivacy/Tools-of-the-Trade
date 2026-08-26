import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DataVault() {
  const navigate = useNavigate();

  // --- UNIVERSAL FILE GENERATOR ---
  const downloadFile = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- COLD STORAGE (JSON) ---
  const exportColdStorage = () => {
    const backup = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // Grab all our custom data keys
      if (key.startsWith('chronos_') || key.startsWith('fleet_') || key.startsWith('global_')) {
        try {
          backup[key] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          backup[key] = localStorage.getItem(key); // Fallback for raw strings
        }
      }
    }
    const jsonStr = JSON.stringify(backup, null, 2);
    downloadFile(jsonStr, `Tools_Of_The_Trade_Backup_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  const cardStyle = { background: '#111', borderRadius: '12px', padding: '20px', marginBottom: '20px' };
  const btnStyle = (color) => ({ width: '100%', background: 'transparent', color: color, border: `2px solid ${color}`, padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginTop: '15px', cursor: 'pointer' });

  // --- EXPORT COMPILERS (CSV) ---
  
  const exportDOTLogs = () => {
    const history = JSON.parse(localStorage.getItem('chronos_shift_hist')) || [];
    const activeLogs = JSON.parse(localStorage.getItem('chronos_logs')) || [];
    
    let csv = 'Date,Time,Event,Location,Notes\n';
    
    // Add active un-archived logs first
    activeLogs.forEach(l => { csv += `"${new Date().toLocaleDateString()}","${l.time}","${l.event}","${l.loc}","${l.note}"\n`; });
    
    // Add historical logs
    history.forEach(shift => {
      shift.logs.forEach(l => { csv += `"${shift.date}","${l.time}","${l.event}","${l.loc}","${l.note}"\n`; });
    });
    
    downloadFile(csv, `DOT_Compliance_Logs_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
  };

  const exportContractorJobs = () => {
    const jobs = JSON.parse(localStorage.getItem('chronos_job_hist')) || [];
    let csv = 'Date,Flat Fee,Material Cost,Labor Cost,Total Billable\n';
    jobs.forEach(job => { csv += `"${job.date}","${job.flat}","${job.mat}","${job.labor}","${job.total}"\n`; });
    downloadFile(csv, `Contractor_Receipts_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
  };

  const exportBudgetLedger = () => {
    const incomes = JSON.parse(localStorage.getItem('fleet_incomes')) || [];
    const bills = JSON.parse(localStorage.getItem('fleet_bills')) || [];
    
    let csv = 'Type,Name,Amount,Frequency,Date,Linked_Income_ID\n';
    incomes.forEach(i => { csv += `"INCOME","${i.name}","${i.amount}","Single","${i.date}","N/A"\n`; });
    bills.forEach(b => { csv += `"BILL","${b.name}","${b.amount}","${b.frequency}","${b.date}","${b.linkedIncome}"\n`; });
    
    downloadFile(csv, `Budget_Ledger_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
  };

  const exportSubscriptions = () => {
    const subs = JSON.parse(localStorage.getItem('fleet_subscriptions')) || [];
    let csv = 'Service,Cost,Frequency,Next_Billing,Status\n';
    subs.forEach(s => { csv += `"${s.name}","${s.cost}","${s.freq}","${s.date}","${s.active ? 'Active' : 'Paused'}"\n`; });
    downloadFile(csv, `Subscription_Roster_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
  };
  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#10b981', fontSize: '1.2em' }}>Data Vault & Exports</h2>
      </header>

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        {/* COLD STORAGE */}
        <div style={{ ...cardStyle, borderLeft: '6px solid #00ffff', background: 'linear-gradient(145deg, #111, #1a1a1a)' }}>
          <h3 style={{ color: '#00ffff', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🥶</span> Cold Storage Backup
          </h3>
          <p style={{ color: '#aaa', margin: '0 0 15px 0', lineHeight: '1.5', fontSize: '0.95em' }}>
            Downloads a raw, unencrypted .json file containing your entire fleet database. Safe from cloud tracking. Includes all settings, logs, and ledgers.
          </p>
          <button onClick={exportColdStorage} style={btnStyle('#00ffff')}>↓ Download Fleet JSON</button>
        </div>

        {/* CHRONOS - DOT LOGS */}
        <div style={{ ...cardStyle, borderLeft: '6px solid #a855f7' }}>
          <h3 style={{ color: '#a855f7', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🚛</span> DOT Compliance Logs
          </h3>
          <p style={{ color: '#aaa', margin: '0 0 15px 0', lineHeight: '1.5', fontSize: '0.95em' }}>
            Compiles your active and historical Hours of Service (HOS) shift logs into a clean spreadsheet ready for audit or records.
          </p>
          <button onClick={exportDOTLogs} style={btnStyle('#a855f7')}>Export to Excel (.CSV)</button>
        </div>
        {/* CHRONOS - CONTRACTOR */}
        <div style={{ ...cardStyle, borderLeft: '6px solid #3b82f6' }}>
          <h3 style={{ color: '#3b82f6', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🛠️</span> Contractor Receipts
          </h3>
          <p style={{ color: '#aaa', margin: '0 0 15px 0', lineHeight: '1.5', fontSize: '0.95em' }}>
            Exports your archived job itemizations, including flat fees, total material costs, and gross labor payouts for accounting.
          </p>
          <button onClick={exportContractorJobs} style={btnStyle('#3b82f6')}>Export to Excel (.CSV)</button>
        </div>

        {/* BUDGET LEDGER */}
        <div style={{ ...cardStyle, borderLeft: '6px solid #10b981' }}>
          <h3 style={{ color: '#10b981', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>💵</span> Budget Ledger Export
          </h3>
          <p style={{ color: '#aaa', margin: '0 0 15px 0', lineHeight: '1.5', fontSize: '0.95em' }}>
            Exports your multi-paycheck budgets, income sources, and bill assignments for spreadsheet analysis and yearly forecasting.
          </p>
          <button onClick={exportBudgetLedger} style={btnStyle('#10b981')}>Export to Excel (.CSV)</button>
        </div>

        {/* SUBSCRIPTION ROSTER */}
        <div style={{ ...cardStyle, borderLeft: '6px solid #f59e0b' }}>
          <h3 style={{ color: '#f59e0b', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🔁</span> Subscription Roster
          </h3>
          <p style={{ color: '#aaa', margin: '0 0 15px 0', lineHeight: '1.5', fontSize: '0.95em' }}>
            Exports your active subscription roster, renewal dates, and statuses. Perfect for identifying financial leaks.
          </p>
          <button onClick={exportSubscriptions} style={btnStyle('#f59e0b')}>Export to Excel (.CSV)</button>
        </div>

      </div>
    </div>
  );
}
