import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TimesheetCalc() {
  const navigate = useNavigate();
  
  const [wage, setWage] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [days, setDays] = useState({
    Mon: '', Tue: '', Wed: '', Thu: '', Fri: '', Sat: '', Sun: ''
  });

  const handleDay = (day, val) => setDays(p => ({...p, [day]: val}));

  // Safe numerical parsing
  const numWage = parseFloat(wage) || 0;
  const numTax = parseFloat(taxRate) || 0;

  // Sum all days for total weekly hours
  const totalHours = Object.values(days).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
  
  // Auto-calculate Overtime (Standard >40 hrs)
  const regHours = totalHours > 40 ? 40 : totalHours;
  const otHours = totalHours > 40 ? totalHours - 40 : 0;

  // Pay Math
  const regPay = numWage * regHours;
  const otPay = (numWage * 1.5) * otHours;
  const grossPay = regPay + otPay;
  const taxAmount = grossPay * (numTax / 100);
  const netPay = grossPay - taxAmount;

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Timesheet & Wage</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '100px' }}>
        
        {/* Pay Rates Configuration */}
        <div className="input-card">
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>Pay Configuration</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label>Hourly Wage ($)</label>
              <input type="number" placeholder="0.00" value={wage} onChange={(e) => setWage(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Est. Tax (%)</label>
              <input type="number" placeholder="15" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
            </div>
          </div>
        </div>

        {/* 7-Day Weekly Grid */}
        <div className="input-card">
          <h3 style={{ margin: '0 0 5px 0', color: '#fff' }}>Weekly Log</h3>
          <p style={{ fontSize: '0.85em', color: '#aaa', margin: '0 0 15px 0' }}>Auto-calculates OT (1.5x) for hours over 40.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {Object.keys(days).map(day => (
              <div key={day} style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: '8px', border: '1px solid #333' }}>
                <span style={{ width: '40px', fontWeight: 'bold', color: 'var(--tot-text-color)' }}>{day}</span>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={days[day]} 
                  onChange={(e) => handleDay(day, e.target.value)} 
                  style={{ background: 'transparent', border: 'none', color: '#fff', textAlign: 'right', width: '100%', fontSize: '1.2em', padding: 0 }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="result-card" style={{ marginBottom: '40px' }}>
          <h3>Pay Summary</h3>
          <div className="result-row">
            <span>Regular Hours:</span>
            <span>{regHours.toFixed(1)}</span>
          </div>
          <div className="result-row">
            <span>Overtime Hours:</span>
            <span>{otHours.toFixed(1)}</span>
          </div>
          
          <div style={{ height: '1px', background: '#444', margin: '15px 0' }}></div>
          
          <div className="result-row">
            <span>Gross Pay:</span>
            <span>${grossPay.toFixed(2)}</span>
          </div>
          <div className="result-row" style={{ color: '#ff4444' }}>
            <span>Estimated Tax:</span>
            <span>-${taxAmount.toFixed(2)}</span>
          </div>
          
          <div style={{ height: '1px', background: '#444', margin: '15px 0' }}></div>
          
          <div className="result-row net-pay">
            <span>Net Take-Home:</span>
            <span style={{ color: '#00cc66' }}>${netPay.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TimesheetCalc;
