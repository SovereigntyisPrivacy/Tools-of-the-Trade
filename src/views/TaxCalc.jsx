import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TaxCalc() {
  const navigate = useNavigate();

  // 1. Sales Tax
  const [price, setPrice] = useState('');
  const [salesTaxRate, setSalesTaxRate] = useState('8.7');

  // 2. Marginal Income Tax Engine
  const [grossIncome, setGrossIncome] = useState('');
  const [stateTaxRate, setStateTaxRate] = useState('2.5'); // Default flat 2.5%
  const [workerType, setWorkerType] = useState('W2'); // W2 vs 1099
  const [filingStatus, setFilingStatus] = useState('Single');

  // 3. Capital Gains / Crypto
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [holdingPeriod, setHoldingPeriod] = useState('Short'); // Short vs Long

  // 4. Compound Interest
  const [principal, setPrincipal] = useState('1000');
  const [monthlyContribution, setMonthlyContribution] = useState('100');
  const [years, setYears] = useState('10');
  const [apy, setApy] = useState('7.0');

  // --- Calculations ---

  // 1. Sales Tax
  let taxAdded = 0, totalCost = 0;
  if (price && salesTaxRate) {
    const p = parseFloat(price);
    taxAdded = p * (parseFloat(salesTaxRate) / 100);
    totalCost = p + taxAdded;
  }

  // 2. Marginal Income Tax (Approximate 2024 Brackets)
  let federalTax = 0, stateTax = 0, ficaTax = 0, netIncome = 0, effectiveRate = 0, taxableIncome = 0;
  if (grossIncome) {
    const gross = parseFloat(grossIncome);
    const stdDeduction = filingStatus === 'Single' ? 14600 : 29200;
    taxableIncome = Math.max(0, gross - stdDeduction);

    // FICA: 7.65% for W2, 15.3% for 1099 Self-Employed
    ficaTax = workerType === 'W2' ? gross * 0.0765 : gross * 0.153;

    // State Tax (Simplified flat on taxable income)
    stateTax = taxableIncome * (parseFloat(stateTaxRate) / 100);

    // Simplified Federal Progressive Brackets (Single)
    let remaining = taxableIncome;
    if (remaining > 0) {
      const b1 = Math.min(remaining, 11600);
      federalTax += b1 * 0.10;
      remaining -= b1;
    }
    if (remaining > 0) {
      const b2 = Math.min(remaining, 47150 - 11600);
      federalTax += b2 * 0.12;
      remaining -= b2;
    }
    if (remaining > 0) {
      const b3 = Math.min(remaining, 100525 - 47150);
      federalTax += b3 * 0.22;
      remaining -= b3;
    }
    if (remaining > 0) {
      const b4 = Math.min(remaining, 191950 - 100525);
      federalTax += b4 * 0.24;
      remaining -= b4;
    }
    if (remaining > 0) {
      federalTax += remaining * 0.32; // Catch-all for higher for MVP
    }

    if (filingStatus === 'Joint') federalTax = federalTax * 0.85; // Rough joint reduction estimation for MVP

    const totalTaxes = federalTax + stateTax + ficaTax;
    netIncome = gross - totalTaxes;
    effectiveRate = (totalTaxes / gross) * 100;
  }

  // 3. Capital Gains
  let grossProfit = 0, capGainsTax = 0, netProfit = 0;
  if (buyPrice && sellPrice) {
    grossProfit = parseFloat(sellPrice) - parseFloat(buyPrice);
    if (grossProfit > 0) {
      // Short term = Ordinary Income (approx 22% avg). Long term = Favorable 15% avg.
      const rate = holdingPeriod === 'Short' ? 0.22 : 0.15;
      capGainsTax = grossProfit * rate;
      netProfit = grossProfit - capGainsTax;
    } else {
      netProfit = grossProfit; // Capital Loss
    }
  }

  // 4. Compound Interest: A = P(1+r/n)^(nt) + PMT * [ (1+r/n)^(nt) - 1 ] / (r/n)
  let futureValue = 0, totalInvested = 0, totalInterest = 0;
  if (principal && years && apy) {
    const P = parseFloat(principal);
    const PMT = parseFloat(monthlyContribution) || 0;
    const t = parseFloat(years);
    const r = parseFloat(apy) / 100;
    const n = 12; // Monthly compounding

    const compoundPrincipal = P * Math.pow(1 + (r / n), n * t);
    const compoundContributions = PMT * ((Math.pow(1 + (r / n), n * t) - 1) / (r / n));
    
    futureValue = compoundPrincipal + compoundContributions;
    totalInvested = P + (PMT * 12 * t);
    totalInterest = futureValue - totalInvested;
  }

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Finance & Wealth</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* 1. Marginal Income Tax Engine */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>💼 True Income Tax Engine</h3>
          <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}>Calculates effective take-home pay using progressive marginal federal brackets, standard deductions, and FICA.</p>
          
          <label style={{ display: 'block', color: '#00cc66', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '4px' }}>Gross Annual Income ($)</label>
          <input type="number" placeholder="e.g. 65000" value={grossIncome} onChange={e => setGrossIncome(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px', fontSize: '1.1em' }} />

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>State Tax (%)</label>
              <input type="number" value={stateTaxRate} onChange={e => setStateTaxRate(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Filing Status</label>
              <select value={filingStatus} onChange={e => setFilingStatus(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}>
                <option value="Single">Single</option>
                <option value="Joint">Married / Joint</option>
              </select>
            </div>
          </div>

          <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Employment Type (FICA)</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button onClick={() => setWorkerType('W2')} style={{ flex: 1, padding: '10px', background: workerType === 'W2' ? '#00cc66' : '#222', color: workerType === 'W2' ? '#000' : '#aaa', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>W-2 Employee</button>
            <button onClick={() => setWorkerType('1099')} style={{ flex: 1, padding: '10px', background: workerType === '1099' ? '#ffaa00' : '#222', color: workerType === '1099' ? '#000' : '#aaa', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>1099 Freelance</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1em' }}><span style={{ color: '#aaa' }}>Taxable (Post-Deduction):</span><span style={{ color: '#fff' }}>${taxableIncome.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1em' }}><span style={{ color: '#aaa' }}>Federal Tax:</span><span style={{ color: '#ff4444' }}>-${federalTax.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1em' }}><span style={{ color: '#aaa' }}>State Tax:</span><span style={{ color: '#ff4444' }}>-${stateTax.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1em' }}><span style={{ color: '#aaa' }}>FICA / SE Tax:</span><span style={{ color: '#ff4444' }}>-${ficaTax.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', paddingTop: '10px', marginTop: '5px', borderTop: '1px solid #333' }}>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>Net Take-Home:</span>
              <span style={{ color: '#00cc66', fontWeight: 'bold' }}>${netIncome > 0 ? netIncome.toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}</span>
            </div>
            <div style={{ color: '#888', fontSize: '0.8em', textAlign: 'center', marginTop: '5px' }}>True Effective Tax Rate: {effectiveRate.toFixed(1)}%</div>
          </div>
        </div>

        {/* 2. Capital Gains / Crypto */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #a55eea', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>📈 Capital Gains & Crypto</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Total Cost Basis ($)</label>
              <input type="number" placeholder="Buy Price" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Total Sold For ($)</label>
              <input type="number" placeholder="Sell Price" value={sellPrice} onChange={e => setSellPrice(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Asset Holding Period</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button onClick={() => setHoldingPeriod('Short')} style={{ flex: 1, padding: '10px', background: holdingPeriod === 'Short' ? '#ff4444' : '#222', color: holdingPeriod === 'Short' ? '#fff' : '#aaa', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>&lt; 1 Year (Short)</button>
            <button onClick={() => setHoldingPeriod('Long')} style={{ flex: 1, padding: '10px', background: holdingPeriod === 'Long' ? '#a55eea' : '#222', color: holdingPeriod === 'Long' ? '#fff' : '#aaa', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>&gt; 1 Year (Long)</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Gross Profit:</span><span style={{ color: grossProfit >= 0 ? '#00cc66' : '#ff4444', fontWeight: 'bold' }}>${grossProfit.toLocaleString(undefined, {maximumFractionDigits: 2})}</span></div>
            {grossProfit > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Est. Cap Gains Tax:</span><span style={{ color: '#ff4444', fontWeight: 'bold' }}>-${capGainsTax.toLocaleString(undefined, {maximumFractionDigits: 2})}</span></div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', paddingTop: '8px', borderTop: '1px dashed #333' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Net Cleared:</span><span style={{ color: netProfit >= 0 ? '#00cc66' : '#ff4444', fontWeight: 'bold' }}>${netProfit.toLocaleString(undefined, {maximumFractionDigits: 2})}</span></div>
          </div>
        </div>

        {/* 3. Compound Interest */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ffaa00', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>📈 Compound Interest (Wealth)</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#ffaa00', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Initial Principal ($)</label>
              <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Monthly Add ($)</label>
              <input type="number" value={monthlyContribution} onChange={e => setMonthlyContribution(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Years to Grow</label>
              <input type="number" value={years} onChange={e => setYears(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Est. APY (%)</label>
              <input type="number" value={apy} onChange={e => setApy(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Total Invested:</span><span style={{ color: '#fff', fontWeight: 'bold' }}>${totalInvested.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Interest Earned:</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>+${totalInterest > 0 ? totalInterest.toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3em', paddingTop: '10px', borderTop: '1px solid #333' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Future Value:</span><span style={{ color: '#ffaa00', fontWeight: 'bold' }}>${futureValue > 0 ? futureValue.toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}</span></div>
          </div>
        </div>

        {/* 4. Basic Sales Tax */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00ffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🛒 Sales Tax</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 2 }}><label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px' }}>Price ($)</label><input type="number" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Rate (%)</label><input type="number" value={salesTaxRate} onChange={e => setSalesTaxRate(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Total Cost:</span><span style={{ color: '#00ffff', fontWeight: 'bold' }}>${totalCost.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TaxCalc;
