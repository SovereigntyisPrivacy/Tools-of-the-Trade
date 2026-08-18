import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FinanceCalc() {
  const navigate = useNavigate();

  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');

  const p = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 100 / 12; // Monthly rate
  const n = (parseFloat(years) || 0) * 12; // Total months

  const monthlyPayment = r > 0 ? p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : (n > 0 ? p / n : 0);
  const totalPaid = monthlyPayment * n;
  const totalInterest = totalPaid - p;

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Finance & Loans</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        <div className="input-card" style={{ borderTop: '4px solid #00cc66' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>💰 Amortization (Mortgage/Auto)</h3>
          
          <label>Loan Principal ($)</label>
          <input type="number" placeholder="e.g. 25000" value={principal} onChange={(e) => setPrincipal(e.target.value)} style={{ marginBottom: '15px' }} />
          
          <label>Interest Rate (%)</label>
          <input type="number" placeholder="e.g. 5.5" value={rate} onChange={(e) => setRate(e.target.value)} style={{ marginBottom: '15px' }} />
          
          <label>Loan Term (Years)</label>
          <input type="number" placeholder="e.g. 5" value={years} onChange={(e) => setYears(e.target.value)} />
        </div>

        <div className="result-card" style={{ marginTop: '20px', padding: '15px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px', textAlign: 'center', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Loan Breakdown</h3>
          
          <div className="result-row">
            <span>Total Interest:</span>
            <span style={{ color: '#ff4444' }}>${totalInterest > 0 ? totalInterest.toFixed(2) : '0.00'}</span>
          </div>
          <div className="result-row">
            <span>Total Cost:</span>
            <span>${totalPaid > 0 ? totalPaid.toFixed(2) : '0.00'}</span>
          </div>
          
          <div style={{ height: '1px', background: '#444', margin: '15px 0' }}></div>

          <div className="result-row net-pay" style={{ margin: 0, fontSize: '1.2em' }}>
            <span>Monthly Payment:</span>
            <span style={{ color: '#00cc66' }}>${monthlyPayment > 0 ? monthlyPayment.toFixed(2) : '0.00'}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FinanceCalc;
