import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PersonalTracker() {
  const navigate = useNavigate();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('tracker');
  const [hourlyRate, setHourlyRate] = useState(16.00);
  
  // Tax & Deductions State
  const [taxProfile, setTaxProfile] = useState('W2 Employee');
  const [stateTax, setStateTax] = useState(2.5);
  const [fedTax, setFedTax] = useState(10.0);
  const [showReport, setShowReport] = useState(false);

  // Shift State (Pre-filled Monday for demonstration)
  const [shifts, setShifts] = useState({
    MON: { start: '16:00', end: '22:00', active: true },
    TUE: { start: '', end: '', active: false },
    WED: { start: '', end: '', active: false },
    THU: { start: '', end: '', active: false },
    FRI: { start: '', end: '', active: false },
    SAT: { start: '', end: '', active: false },
    SUN: { start: '', end: '', active: false }
  });

  const stateTaxOptions = [
    { label: 'Arizona (2.5%)', value: 2.5 },
    { label: 'California (9.3%)', value: 9.3 },
    { label: 'Texas (0%)', value: 0.0 },
    { label: 'Nevada (0%)', value: 0.0 },
    { label: 'Custom Flat (5.0%)', value: 5.0 }
  ];

  // --- ACTIONS ---
  const handleShiftChange = (day, field, value) => {
    setShifts(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value, active: true }
    }));
  };

  const clearWeek = () => {
    setShifts({
      MON: { start: '', end: '', active: false },
      TUE: { start: '', end: '', active: false },
      WED: { start: '', end: '', active: false },
      THU: { start: '', end: '', active: false },
      FRI: { start: '', end: '', active: false },
      SAT: { start: '', end: '', active: false },
      SUN: { start: '', end: '', active: false }
    });
  };

  // --- CALCULATIONS ---
  let totalHours = 0;
  let dailyBreakdown = [];

  Object.entries(shifts).forEach(([day, times]) => {
    if (times.active && times.start && times.end) {
      let startD = new Date(`1970-01-01T${times.start}`);
      let endD = new Date(`1970-01-01T${times.end}`);
      
      // Handle overnight shifts seamlessly
      if (endD < startD) {
        endD.setDate(endD.getDate() + 1); 
      }
      
      let diff = (endD - startD) / 3600000; // Convert ms to hours
      totalHours += diff;
      dailyBreakdown.push({ day, hours: diff.toFixed(2), start: times.start, end: times.end });
    }
  });

  const regHours = Math.min(totalHours, 40);
  const otHours = Math.max(0, totalHours - 40);
  const regPay = regHours * hourlyRate;
  const otPay = otHours * (hourlyRate * 1.5);
  const grossPay = regPay + otPay;

  // FICA Taxes (1099 independent contractors pay double FICA self-employment tax)
  const isW2 = taxProfile === 'W2 Employee';
  const ssTax = isW2 ? grossPay * 0.062 : grossPay * 0.124; 
  const medTax = isW2 ? grossPay * 0.0145 : grossPay * 0.029;
  
  const calculatedStateTax = grossPay * (stateTax / 100);
  const calculatedFedTax = grossPay * (fedTax / 100);

  const totalDeductions = ssTax + medTax + calculatedStateTax + calculatedFedTax;
  const netPay = grossPay - totalDeductions;

  // --- STYLES ---
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #222', padding: '20px', marginBottom: '20px' };
  const inputStyle = { background: '#000', color: '#fff', border: '1px solid #333', padding: '10px', borderRadius: '6px', width: '100%', fontSize: '1em' };
  const labelStyle = { color: '#888', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px', display: 'block' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      
      {/* HEADER */}
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
          <h2 style={{ margin: 0, color: '#10b981', fontSize: '1.2em' }}>My Schedule</h2>
        </div>
        <button style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', padding: '8px', borderRadius: '6px' }}>🏠</button>
      </header>

      {/* TOP TABS */}
      <div style={{ display: 'flex', padding: '15px', gap: '10px' }}>
        <button onClick={() => setActiveTab('tracker')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'tracker' ? '#10b981' : '#222', color: activeTab === 'tracker' ? '#000' : '#888' }}>
          Tracker
        </button>
        <button onClick={() => setActiveTab('guides')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'guides' ? '#10b981' : '#222', color: activeTab === 'guides' ? '#000' : '#888' }}>
          Guides & Info
        </button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        
        {/* RATE & HOURS CARD */}
        <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '4px solid #10b981' }}>
          <div style={{ width: '45%' }}>
            <label style={labelStyle}>My Hourly Rate</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2em' }}>$</span>
              <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)} style={inputStyle} />
            </div>
          </div>
          <div style={{ width: '45%', textAlign: 'right' }}>
            <label style={labelStyle}>Total Hours</label>
            <div style={{ color: '#10b981', fontSize: '2em', fontWeight: 'bold' }}>{totalHours.toFixed(1)}</div>
          </div>
        </div>

        {/* SHIFTS CARD */}
        <div style={cardStyle}>
          <h3 style={{ color: '#10b981', margin: '0 0 20px 0', textAlign: 'center' }}>This Week's Shifts</h3>
          
          {Object.keys(shifts).map((day) => (
            <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px dashed #222', paddingBottom: '15px' }}>
              <strong style={{ width: '40px', fontSize: '0.9em' }}>{day}</strong>
              <input type="time" value={shifts[day].start} onChange={(e) => handleShiftChange(day, 'start', e.target.value)} style={{ ...inputStyle, flex: 1, padding: '8px' }} />
              <span style={{ color: '#666' }}>to</span>
              <input type="time" value={shifts[day].end} onChange={(e) => handleShiftChange(day, 'end', e.target.value)} style={{ ...inputStyle, flex: 1, padding: '8px' }} />
            </div>
          ))}

          <button onClick={clearWeek} style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '15px', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>
            CLEAR WEEK
          </button>
        </div>

        {/* PAYCHECK ESTIMATOR CARD */}
        <div style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
          <h3 style={{ color: '#10b981', margin: '0 0 20px 0', textTransform: 'uppercase', textAlign: 'center' }}>Paycheck Estimator</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '1.05em' }}>
            <span style={{ color: '#ccc' }}>Regular Pay ({regHours.toFixed(1)}h)</span>
            <span style={{ fontWeight: 'bold' }}>${regPay.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.05em', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
            <span style={{ color: '#ccc' }}>Overtime Pay ({otHours.toFixed(1)}h)</span>
            <span style={{ fontWeight: 'bold' }}>${otPay.toFixed(2)}</span>
          </div>

          {/* DYNAMIC TAX INPUTS */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
            <label style={{ ...labelStyle, margin: 0, width: '40%' }}>Tax Profile</label>
            <select value={taxProfile} onChange={(e) => setTaxProfile(e.target.value)} style={{ ...inputStyle, width: '55%', color: '#3b82f6', fontWeight: 'bold' }}>
              <option value="W2 Employee">W2 Employee</option>
              <option value="1099 Contractor">1099 Contractor</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
            <label style={{ ...labelStyle, margin: 0, width: '40%' }}>State Tax</label>
            <select value={stateTax} onChange={(e) => setStateTax(parseFloat(e.target.value))} style={{ ...inputStyle, width: '55%' }}>
              {stateTaxOptions.map(opt => <option key={opt.label} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px', borderBottom: '1px dashed #333', paddingBottom: '20px' }}>
            <label style={{ ...labelStyle, margin: 0, width: '40%' }}>Fed Tax (%)</label>
            <div style={{ width: '55%', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="number" value={fedTax} onChange={(e) => setFedTax(parseFloat(e.target.value) || 0)} style={inputStyle} />
              <span style={{ color: '#666', fontWeight: 'bold' }}>%</span>
            </div>
          </div>

          {/* DEDUCTIONS OUTPUT */}
          <h4 style={{ color: '#fff', textTransform: 'uppercase', fontSize: '0.9em', textAlign: 'center', marginBottom: '15px' }}>Estimated Deductions</h4>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#888', fontSize: '0.95em' }}>
            <span>Social Security (FICA)</span>
            <span>-${ssTax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#888', fontSize: '0.95em' }}>
            <span>Medicare (FICA)</span>
            <span>-${medTax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#888', fontSize: '0.95em' }}>
            <span>Federal Tax ({fedTax}%)</span>
            <span>-${calculatedFedTax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#888', fontSize: '0.95em', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
            <span>State Tax ({stateTax}%)</span>
            <span>-${calculatedStateTax.toFixed(2)}</span>
          </div>

          {/* FINAL NET PAY */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2em' }}>
            <strong style={{ color: '#fff' }}>Est. Net Pay</strong>
            <strong style={{ color: '#10b981', fontSize: '1.4em' }}>${netPay.toFixed(2)}</strong>
          </div>
          
          {/* TRIGGER FULL REPORT MODAL */}
          <button onClick={() => setShowReport(true)} style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', marginTop: '25px', fontSize: '1.05em' }}>
            📄 VIEW FULL REPORT
          </button>
        </div>

      </div>

      {/* FULL REPORT MODAL */}
      {showReport && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#000', zIndex: 100, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #10b981', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2 style={{ color: '#10b981', margin: 0, textTransform: 'uppercase' }}>Timesheet Report</h2>
            <button onClick={() => setShowReport(false)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
          </div>

          <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #333', marginBottom: '20px' }}>
            <h3 style={{ color: '#fff', borderBottom: '1px dashed #444', paddingBottom: '10px', marginBottom: '15px' }}>Daily Breakdown</h3>
            {dailyBreakdown.length === 0 ? (
              <p style={{ color: '#888', fontStyle: 'italic' }}>No shifts logged this week.</p>
            ) : (
              dailyBreakdown.map((log) => (
                <div key={log.day} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#ccc' }}>
                  <span style={{ fontWeight: 'bold', color: '#10b981' }}>{log.day}</span>
                  <span>{log.start} to {log.end}</span>
                  <span style={{ fontWeight: 'bold', color: '#fff' }}>{log.hours}h</span>
                </div>
              ))
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #333', fontSize: '1.1em', fontWeight: 'bold' }}>
              <span>Total Logged:</span>
              <span style={{ color: '#10b981' }}>{totalHours.toFixed(2)} Hours</span>
            </div>
          </div>

          <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#fff', borderBottom: '1px dashed #444', paddingBottom: '10px', marginBottom: '15px' }}>Financial Breakdown</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', marginBottom: '8px' }}><span>Gross Pay:</span> <span>${grossPay.toFixed(2)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', marginBottom: '8px' }}><span>Total Taxes/Deductions:</span> <span>-${totalDeductions.toFixed(2)}</span></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '2px solid #333', fontSize: '1.3em', fontWeight: 'bold' }}>
              <span>Take Home:</span>
              <span style={{ color: '#10b981' }}>${netPay.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
