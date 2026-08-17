import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TimesheetCalc() {
  const navigate = useNavigate();
  
  const [wage, setWage] = useState('');
  const [hours, setHours] = useState('');
  const [otHours, setOtHours] = useState('');
  const [taxRate, setTaxRate] = useState('');

  // Calculations
  const numWage = parseFloat(wage) || 0;
  const numHours = parseFloat(hours) || 0;
  const numOt = parseFloat(otHours) || 0;
  const numTax = parseFloat(taxRate) || 0;

  const regPay = numWage * numHours;
  const otPay = (numWage * 1.5) * numOt;
  const grossPay = regPay + otPay;
  const taxDeduction = grossPay * (numTax / 100);
  const netPay = grossPay - taxDeduction;

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Timesheet & Wage</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
        
        <div className="input-card">
          <label>Hourly Wage ($)</label>
          <input type="number" placeholder="0.00" value={wage} onChange={(e) => setWage(e.target.value)} />

          <label>Regular Hours Worked</label>
          <input type="number" placeholder="0" value={hours} onChange={(e) => setHours(e.target.value)} />

          <label>Overtime Hours (1.5x)</label>
          <input type="number" placeholder="0" value={otHours} onChange={(e) => setOtHours(e.target.value)} />

          <label>Est. Income Tax Deduction (%)</label>
          <input type="number" placeholder="e.g. 15" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
        </div>

        <div className="result-card">
          <h3>Pay Summary</h3>
          <div className="result-row">
            <span>Regular Pay:</span>
            <span>${regPay.toFixed(2)}</span>
          </div>
          <div className="result-row">
            <span>Overtime Pay:</span>
            <span>${otPay.toFixed(2)}</span>
          </div>
          <div className="result-row" style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '10px' }}>
            <span>Gross Pay:</span>
            <span style={{ fontWeight: 'bold' }}>${grossPay.toFixed(2)}</span>
          </div>
          <div className="result-row" style={{ color: '#ff4444' }}>
            <span>Est. Taxes:</span>
            <span>-${taxDeduction.toFixed(2)}</span>
          </div>
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
