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

  // --- PAYROLL EXCEL EXPORT (Smart Parser) ---
  const handleExportPayroll = () => {
      // Intelligently hunts for however your Timesheet state is saved
      const roster = JSON.parse(localStorage.getItem('fleet_timesheet_roster') || localStorage.getItem('fleet_roster') || '[]');
      const weekOf = localStorage.getItem('fleet_timesheet_week') || new Date().toISOString().split('T')[0];
      
      if (roster.length === 0) return alert('⚠️ No payroll data found. Go to the Timesheet Engine and log some hours first.');

      // Format specifically for Excel
      let csv = `PAYROLL REPORT - WEEK OF ${weekOf}\n\n`;
      csv += 'Employee Name,Tax Type,Employee ID,Total Hours,Hourly Rate ($),Total Payout ($)\n';
      
      let totalW2 = 0; let total1099 = 0; let totalPayout = 0;

      roster.forEach(emp => {
          const name = `"${(emp.name || 'Unnamed').replace(/"/g, '""')}"`;
          const type = emp.type || 'W2';
          const id = emp.id || 'N/A';
          const hrs = parseFloat(emp.hours || emp.totalHours || 0);
          const rate = parseFloat(emp.rate || 0);
          const payout = hrs * rate;
          
          if (type.includes('W2')) totalW2 += payout;
          else total1099 += payout;
          totalPayout += payout;

          csv += `${name},${type},${id},${hrs.toFixed(2)},${rate.toFixed(2)},${payout.toFixed(2)}\n`;
      });

      // Add Accountant Summary at the bottom
      csv += `\n,,,,, \n`;
      csv += `SUMMARY,W2 Liability:,$${totalW2.toFixed(2)},,,\n`;
      csv += `SUMMARY,1099 Liability:,$${total1099.toFixed(2)},,,\n`;
      csv += `SUMMARY,TOTAL PAYROLL:,$${totalPayout.toFixed(2)},,,\n`;

      downloadFile(`Payroll_Export_${weekOf}.csv`, csv, 'text/csv');
  };

  // --- BUDGET EXCEL EXPORT ---
  const handleExportBudget = () => {
      const incomes = JSON.parse(localStorage.getItem('fleet_budget_incomes') || '[]');
      const bills = JSON.parse(localStorage.getItem('fleet_budget_envs') || '[]');
      if (incomes.length === 0 && bills.length === 0) return alert('⚠️ No budget data to export.');
      
      const date = new Date().toISOString().split('T')[0];
      let csv = `BUDGET LEDGER EXPORT - ${date}\n\n`;
      
      // INCOME SECTION
      csv += '--- INCOME SOURCES ---\n';
      csv += 'Paycheck Name,Date,Amount ($)\n';
      let totalInc = 0;
      incomes.forEach(inc => {
          totalInc += parseFloat(inc.amount || 0);
          csv += `"${(inc.name || '').replace(/"/g, '""')}",${inc.date},${parseFloat(inc.amount || 0).toFixed(2)}\n`;
      });
      csv += `,, \nTOTAL INCOME:,,$${totalInc.toFixed(2)}\n\n`;

      // BILLS SECTION
      csv += '--- BILLS & EXPENSES ---\n';
      csv += 'Bill Name,Due Date,Recurrence,Linked Paycheck,Amount ($)\n';
      let totalBills = 0;
      bills.forEach(bill => {
          totalBills += parseFloat(bill.amount || 0);
          const linkedInc = incomes.find(i => i.id === bill.incomeId)?.name || 'Unassigned';
          csv += `"${(bill.name || '').replace(/"/g, '""')}",${bill.dueDate},${bill.recurrence},"${linkedInc}",${parseFloat(bill.amount || 0).toFixed(2)}\n`;
      });
      
      // EXCEL SUMMARY
      csv += `,, \nTOTAL ALLOCATED:,,,,$${totalBills.toFixed(2)}\n`;
      csv += `UNASSIGNED CASH:,,,,$${(totalInc - totalBills).toFixed(2)}\n`;

      downloadFile(`Budget_Ledger_${date}.csv`, csv, 'text/csv');
  };

  // --- SUBSCRIPTIONS CSV ---
  const handleExportSubs = () => {
      const subs = JSON.parse(localStorage.getItem('fleet_subs') || '[]');
      if (subs.length === 0) return alert('⚠️ No subscriptions logged to export.');
      
      let csv = 'Service Name,Cost ($),Cycle,Next Renewal,Source,Notes\n';
      let monthlyTotal = 0;
      
      subs.forEach(s => {
          monthlyTotal += (s.cycle === 'Yearly' ? parseFloat(s.cost)/12 : parseFloat(s.cost));
          const name = `"${(s.name || '').replace(/"/g, '""')}"`;
          const notes = `"${(s.notes || '').replace(/"/g, '""')}"`;
          csv += `${name},${parseFloat(s.cost).toFixed(2)},${s.cycle},${s.renewal},${s.source},${notes}\n`;
      });
      
      csv += `\nTrue Monthly Burn Rate:,$${monthlyTotal.toFixed(2)},,,,\n`;
      csv += `True Yearly Cost:,$${(monthlyTotal * 12).toFixed(2)},,,,\n`;

      const date = new Date().toISOString().split('T')[0];
      downloadFile(`Subscriptions_${date}.csv`, csv, 'text/csv');
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
        
        <div style={{ ...cardStyle, borderLeft: '4px solid #06b6d4' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '8px' }}>🥶 Cold Storage Backup</h3>
            <p style={{ ...pStyle }}>Downloads a raw, unencrypted .json file containing your entire fleet database. Safe from cloud tracking.</p>
            <button onClick={handleExportJSON} style={{ width: '100%', background: 'transparent', color: '#06b6d4', border: '1px solid #06b6d4', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>
                ↓ Download Fleet JSON
            </button>
        </div>

        <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#00cc66', display: 'flex', alignItems: 'center', gap: '8px' }}>📊 Accountant Export (Payroll)</h3>
            <p style={{ ...pStyle }}>Compiles all Timesheet data into a clean spreadsheet ready for your accountant.</p>
            <button onClick={handleExportPayroll} style={{ width: '100%', background: '#00cc66', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>
                Export to Excel (.CSV)
            </button>
        </div>

        <div style={{ ...cardStyle, borderLeft: '4px solid var(--accent, #3b82f6)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--accent, #3b82f6)', display: 'flex', alignItems: 'center', gap: '8px' }}>💵 Budget Ledger Export</h3>
            <p style={{ ...pStyle }}>Exports your multi-paycheck budgets and bill assignments for spreadsheet analysis.</p>
            <button onClick={handleExportBudget} style={{ width: '100%', background: 'var(--accent, #3b82f6)', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>
                Export to Excel (.CSV)
            </button>
        </div>

        <div style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '8px' }}>🔁 Subscription Roster</h3>
            <p style={{ ...pStyle }}>Exports your active subscription roster, renewal dates, and payment sources.</p>
            <button onClick={handleExportSubs} style={{ width: '100%', background: '#a855f7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>
                Export to Excel (.CSV)
            </button>
        </div>

      </div>
    </div>
  );
}
