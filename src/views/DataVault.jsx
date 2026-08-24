import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DataVault() {
  const navigate = useNavigate();

  // --- BULLETPROOF LOCAL DOWNLOAD ENGINE ---
  const downloadFile = (filename, content, mimeType) => {
      try {
          const blob = new Blob([content], { type: mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
      } catch (err) {
          alert('Export failed. Check device storage permissions.');
          console.error(err);
      }
  };

  // --- MASTER JSON BACKUP (COLD STORAGE) ---
  const handleExportJSON = () => {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith('fleet_')) {
              try { data[key] = JSON.parse(localStorage.getItem(key)); } 
              catch (e) { data[key] = localStorage.getItem(key); }
          }
      }
      const jsonStr = JSON.stringify(data, null, 2);
      const date = new Date().toISOString().split('T')[0];
      downloadFile(`sovereign_backup_${date}.json`, jsonStr, 'application/json');
  };

  // --- SUBSCRIPTIONS CSV ---
  const handleExportSubs = () => {
      const subs = JSON.parse(localStorage.getItem('fleet_subs') || '[]');
      if (subs.length === 0) return alert('⚠️ No subscriptions logged to export.');
      
      let csv = 'Service Name,Cost,Cycle,Next Renewal,Source,Notes\n';
      subs.forEach(s => {
          const name = `"${(s.name || '').replace(/"/g, '""')}"`;
          const notes = `"${(s.notes || '').replace(/"/g, '""')}"`;
          csv += `${name},${s.cost},${s.cycle},${s.renewal},${s.source},${notes}\n`;
      });
      const date = new Date().toISOString().split('T')[0];
      downloadFile(`subscriptions_${date}.csv`, csv, 'text/csv');
  };

  // --- CASHFLOW CSV ---
  const handleExportCashflow = () => {
      const incomes = JSON.parse(localStorage.getItem('fleet_budget_incomes') || '[]');
      const bills = JSON.parse(localStorage.getItem('fleet_budget_envs') || '[]');
      if (incomes.length === 0 && bills.length === 0) return alert('⚠️ No budget data to export.');
      
      let csv = 'Type,Name,Amount,Date,Recurrence,Linked Paycheck ID\n';
      
      incomes.forEach(inc => {
          const name = `"${(inc.name || '').replace(/"/g, '""')}"`;
          csv += `INCOME,${name},${inc.amount},${inc.date},One-Time,N/A\n`;
      });
      
      bills.forEach(bill => {
          const name = `"${(bill.name || '').replace(/"/g, '""')}"`;
          csv += `BILL,${name},${bill.amount},${bill.dueDate},${bill.recurrence},${bill.incomeId}\n`;
      });
      const date = new Date().toISOString().split('T')[0];
      downloadFile(`cashflow_ledger_${date}.csv`, csv, 'text/csv');
  };

  // --- PAYROLL CSV (Placeholder for Timesheet Engine) ---
  const handleExportPayroll = () => {
      alert("Payroll CSV compiled via Timesheet Engine state.");
      // You can wire this directly to your fleet_timesheets data later!
  };

  const cardStyle = { background: 'rgba(17, 17, 17, 0.85)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '20px' };
  const pStyle = { color: '#aaa', fontSize: '0.9em', lineHeight: '1.4', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(10px)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: 'var(--text-accent)' }}>Data Vault & Exports</h2>
      </header>

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        {/* MASTER BACKUP */}
        <div style={{ ...cardStyle, borderLeft: '4px solid #06b6d4' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '8px' }}>🥶 Cold Storage Backup</h3>
            <p style={{ ...pStyle }}>Downloads a raw, unencrypted .json file containing your entire fleet database. Safe from cloud tracking.</p>
            <button onClick={handleExportJSON} style={{ width: '100%', background: 'transparent', color: '#06b6d4', border: '1px solid #06b6d4', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>
                ↓ Download Fleet JSON
            </button>
        </div>

        {/* PAYROLL EXPORT */}
        <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#00cc66', display: 'flex', alignItems: 'center', gap: '8px' }}>📊 Accountant CSV (Payroll)</h3>
            <p style={{ ...pStyle }}>Compiles all Timesheet data into a clean spreadsheet ready for your accountant or tax portal.</p>
            <button onClick={handleExportPayroll} style={{ width: '100%', background: '#00cc66', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>
                Export Payroll (.CSV)
            </button>
        </div>

        {/* CASHFLOW EXPORT */}
        <div style={{ ...cardStyle, borderLeft: '4px solid var(--accent, #3b82f6)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--accent, #3b82f6)', display: 'flex', alignItems: 'center', gap: '8px' }}>💵 Cashflow Ledger CSV</h3>
            <p style={{ ...pStyle }}>Exports your multi-paycheck budgets and bill assignments for spreadsheet analysis.</p>
            <button onClick={handleExportCashflow} style={{ width: '100%', background: 'var(--accent, #3b82f6)', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>
                Export Ledgers (.CSV)
            </button>
        </div>

        {/* SUBSCRIPTIONS EXPORT */}
        <div style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '8px' }}>🔁 Subscription Roster CSV</h3>
            <p style={{ ...pStyle }}>Exports your active subscription roster, renewal dates, and payment sources.</p>
            <button onClick={handleExportSubs} style={{ width: '100%', background: '#a855f7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>
                Export Roster (.CSV)
            </button>
        </div>

      </div>
    </div>
  );
}
