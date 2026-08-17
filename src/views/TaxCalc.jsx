import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TaxCalc() {
  const navigate = useNavigate();
  
  // Sales Tax State
  const [salesAmount, setSalesAmount] = useState('');
  const [salesRate, setSalesRate] = useState('5.6'); 

  // Income Tax State
  const [incomeGross, setIncomeGross] = useState('');
  const [fedRate, setFedRate] = useState('12'); 
  const [stateRate, setStateRate] = useState('2.5'); 

  // --- Sales Tax Math ---
  const numSalesAmt = parseFloat(salesAmount) || 0;
  const numSalesRate = parseFloat(salesRate) || 0;
  const salesTaxAdded = numSalesAmt * (numSalesRate / 100);
  const salesTotal = numSalesAmt + salesTaxAdded;

  // --- Income Tax Math ---
  const numIncome = parseFloat(incomeGross) || 0;
  const numFed = parseFloat(fedRate) || 0;
  const numState = parseFloat(stateRate) || 0;
  
  const fedDeduction = numIncome * (numFed / 100);
  const stateDeduction = numIncome * (numState / 100);
  const totalTaxDed = fedDeduction + stateDeduction;
  const netIncome = numIncome - totalTaxDed;

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Tax Calculator</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* --- SALES TAX SECTION --- */}
        <div className="input-card" style={{ borderTop: '4px solid #00ffff' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>🛒 Sales Tax</h3>
          
          <label>Price / Amount ($)</label>
          <input type="number" placeholder="0.00" value={salesAmount} onChange={(e) => setSalesAmount(e.target.value)} style={{ marginBottom: '15px' }} />
          
          <label>Sales Tax Rate (%)</label>
          <input type="number" value={salesRate} onChange={(e) => setSalesRate(e.target.value)} />

          <div className="result-card" style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', border: 'none', boxShadow: 'none' }}>
            <div className="result-row">
              <span>Tax Added:</span>
              <span style={{ color: '#ff4444' }}>+${salesTaxAdded.toFixed(2)}</span>
            </div>
            <div className="result-row net-pay" style={{ margin: '5px 0 0 0', fontSize: '1.2em' }}>
              <span>Total Cost:</span>
              <span style={{ color: '#00cc66' }}>${salesTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* --- INCOME TAX SECTION --- */}
        <div className="input-card" style={{ borderTop: '4px solid #ffaa00' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>💼 Annual Income Tax</h3>
          
          <label>Gross Annual Income ($)</label>
          <input type="number" placeholder="0.00" value={incomeGross} onChange={(e) => setIncomeGross(e.target.value)} style={{ marginBottom: '15px' }} />

          <label>Federal Tax Bracket (%)</label>
          <input type="number" value={fedRate} onChange={(e) => setFedRate(e.target.value)} style={{ marginBottom: '15px' }} />
          
          <label>State Tax Rate (%)</label>
          <input type="number" value={stateRate} onChange={(e) => setStateRate(e.target.value)} />

          <div className="result-card" style={{ marginTop: '20px', padding: '15px' }}>
             <div className="result-row">
              <span>Federal Tax:</span>
              <span>-${fedDeduction.toFixed(2)}</span>
            </div>
            <div className="result-row">
              <span>State Tax:</span>
              <span>-${stateDeduction.toFixed(2)}</span>
            </div>
            <div className="result-row" style={{ color: '#ff4444', borderTop: '1px solid #444', paddingTop: '10px', marginTop: '10px' }}>
              <span>Total Taxes Paid:</span>
              <span>-${totalTaxDed.toFixed(2)}</span>
            </div>
            <div className="result-row net-pay">
              <span>Net Annual Income:</span>
              <span style={{ color: '#00cc66' }}>${netIncome.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TaxCalc;
