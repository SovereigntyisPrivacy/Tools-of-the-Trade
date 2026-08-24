import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DataVault() {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);
  
  const savedPin = localStorage.getItem('admin_pin') || '0000';

  const handleUnlock = () => {
    if (pin === savedPin) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPin('');
    }
  };

  const handleSetNewPin = () => {
    const newPin = prompt("Enter a new 4-digit PIN:");
    if (newPin && newPin.length >= 4) {
      localStorage.setItem('admin_pin', newPin);
      alert("Admin PIN updated successfully!");
    } else {
      alert("PIN must be at least 4 characters.");
    }
  };

  const exportColdStorage = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      fleet_schedules: JSON.parse(localStorage.getItem('fleet_schedules') || '[]'),
      ledger: JSON.parse(localStorage.getItem('asset_ledger') || '[]'),
      reminders: JSON.parse(localStorage.getItem('global_reminders') || '[]'),
      subscriptions: JSON.parse(localStorage.getItem('fleet_subscriptions') || '[]')
    };
    const content = JSON.stringify(backup, null, 2);
    const fileName = `SovereignFleet_ColdStorage_${new Date().toISOString().split('T')[0]}.json`;
    const file = new File([content], fileName, { type: 'application/json' });
    
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: fileName }).catch(e=>console.log(e));
    } else {
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = fileName; a.click(); URL.revokeObjectURL(url);
    }
  };

  const exportPayrollCSV = () => {
    const schedules = JSON.parse(localStorage.getItem('fleet_schedules') || '[]');
    if (schedules.length === 0) return alert("No timesheets found to export.");
    let csv = "Week Date,Employee ID,Name,Reg Hours,OT Hours,Rate,Total Pay\n";
    schedules.forEach(week => {
      week.roster.forEach(emp => {
        let hrs = 0;
        const shifts = week.shifts[emp.id] || {};
        Object.values(shifts).forEach(s => {
          if (s && s.in && s.out) {
            const [h1, m1] = s.in.split(':').map(Number);
            const [h2, m2] = s.out.split(':').map(Number);
            let m1Total = h1 * 60 + m1; let m2Total = h2 * 60 + m2;
            if (m2Total < m1Total) m2Total += 24 * 60;
            hrs += (m2Total - m1Total) / 60;
          }
        });
        const rate = parseFloat(emp.rate) || 0;
        const regHrs = Math.min(hrs, 40);
        const otHrs = Math.max(0, hrs - 40);
        const pay = (regHrs * rate) + (otHrs * (rate * 1.5));
        if (hrs > 0) csv += `${week.weekDate},${emp.empNum || 'N/A'},${emp.name || 'Unnamed'},${regHrs.toFixed(2)},${otHrs.toFixed(2)},${rate.toFixed(2)},${pay.toFixed(2)}\n`;
      });
    });
    
    const fileName = `Payroll_Export_${new Date().toISOString().split('T')[0]}.csv`;
    const file = new File([csv], fileName, { type: 'text/csv' });
    
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: fileName }).catch(e=>console.log(e));
    } else {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = fileName; a.click(); URL.revokeObjectURL(url);
    }
  };

  const inputStyle = { width: '100%', padding: '12px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', marginBottom: '10px' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  if (!isUnlocked) {
    return (
      <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ fontSize: '3em', marginBottom: '10px' }}>🔒</div>
          <h2 style={{ color: '#fff', margin: '0 0 20px 0' }}>Admin Gateway</h2>
          <p style={{ color: '#888', fontSize: '0.9em', marginBottom: '20px' }}>Please enter the Admin PIN to access raw fleet data and payroll records. (Default: 0000)</p>
          <input type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder="Enter PIN" style={{ ...inputStyle, textAlign: 'center', fontSize: '1.5em', letterSpacing: '5px' }} />
          {error && <div style={{ color: '#ef4444', marginBottom: '15px', fontWeight: 'bold' }}>Incorrect PIN. Access Denied.</div>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate(-1)} style={{ flex: 1, padding: '12px', background: '#222', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Cancel</button>
            <button onClick={handleUnlock} style={{ flex: 1, padding: '12px', background: '#00ffff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Unlock</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Data Vault & Exports</h2>
        <button onClick={handleSetNewPin} style={{ background: 'transparent', color: '#888', border: '1px solid #333', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8em', marginLeft: 'auto' }}>Change PIN</button>
      </header>
      
      <div style={{ padding: '20px', flex: 1 }}>
        <div style={{ ...cardStyle, borderLeft: '4px solid #00ffff' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#00ffff' }}>🥶 Cold Storage Backup</h3>
          <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}>Downloads a raw, unencrypted .json file containing your entire fleet database. Safe from cloud tracking.</p>
          <button onClick={exportColdStorage} style={{ width: '100%', padding: '12px', background: '#000', color: '#00ffff', border: '1px solid #00ffff', borderRadius: '8px', fontWeight: 'bold' }}>↓ Download Fleet JSON</button>
        </div>

        <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#00cc66' }}>📊 Accountant CSV Export</h3>
          <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}>Compiles all Timesheet data into a clean spreadsheet ready for your accountant or tax portal.</p>
          <button onClick={exportPayrollCSV} style={{ width: '100%', padding: '12px', background: '#00cc66', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Export Payroll (.CSV)</button>
        </div>
      </div>
    </div>
  );
}
