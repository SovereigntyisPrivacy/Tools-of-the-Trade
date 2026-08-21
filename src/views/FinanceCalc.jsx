import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function FinanceCalc() {
  const navigate = useNavigate();

  // --- Input State ---
  const [principal, setPrincipal] = useState('25000');
  const [rate, setRate] = useState('5.5');
  const [years, setYears] = useState('5');
  const [extraPayment, setExtraPayment] = useState('0');

  // --- Output State ---
  const [solution, setSolution] = useState({
    monthlyPayment: 0,
    totalInterest: 0,
    totalCost: 0,
    newInterest: 0,
    interestSaved: 0,
    monthsSaved: 0,
    newTotalTime: '',
    timeSavedStr: ''
  });

  // --- Formatting Helper ---
  const formatCur = (val) => '$' + Math.round(val).toLocaleString('en-US');

  // --- Amortization Engine ---
  useEffect(() => {
    const p = parseFloat(principal) || 0;
    const rAnnual = parseFloat(rate) || 0;
    const y = parseFloat(years) || 0;
    const extra = parseFloat(extraPayment) || 0;

    if (p <= 0 || y <= 0) return;

    const rMonthly = rAnnual / 100 / 12;
    const n = y * 12; // Total months

    let m = 0; // Standard monthly payment
    let totalInt = 0;
    let tCost = 0;

    // Standard Math
    if (rMonthly > 0) {
      m = p * (rMonthly * Math.pow(1 + rMonthly, n)) / (Math.pow(1 + rMonthly, n) - 1);
      tCost = m * n;
      totalInt = tCost - p;
    } else {
      m = p / n; // 0% interest fallback
      tCost = p;
      totalInt = 0;
    }

    // Extra Payment Iteration Loop
    let bal = p;
    let totalIntExtra = 0;
    let monthsExtra = 0;
    const actualPayment = m + extra;

    // Safety check: Make sure payment covers at least the monthly interest to prevent infinite loop
    if (rMonthly > 0 && actualPayment > (bal * rMonthly)) {
      while (bal > 0 && monthsExtra < 1200) { // 100 year max loop safety
        let intMonth = bal * rMonthly;
        totalIntExtra += intMonth;
        let pmtAppliedToPrincipal = actualPayment - intMonth;
        
        if (pmtAppliedToPrincipal > bal) {
          pmtAppliedToPrincipal = bal; // Final payment cleanup
        }
        
        bal -= pmtAppliedToPrincipal;
        monthsExtra++;
      }
    } else if (rMonthly === 0) {
      monthsExtra = Math.ceil(p / actualPayment);
    }

    // Savings Math
    const intSaved = Math.max(0, totalInt - totalIntExtra);
    const mSaved = Math.max(0, n - monthsExtra);

    // Format Strings
    const formatTime = (totalMonths) => {
      const yrs = Math.floor(totalMonths / 12);
      const mos = totalMonths % 12;
      return `${yrs > 0 ? yrs + 'y ' : ''}${mos}m`;
    };

    setSolution({
      monthlyPayment: m,
      totalInterest: totalInt,
      totalCost: tCost,
      newInterest: totalIntExtra,
      interestSaved: intSaved,
      monthsSaved: mSaved,
      newTotalTime: formatTime(monthsExtra),
      timeSavedStr: formatTime(mSaved)
    });

  }, [principal, rate, years, extraPayment]);

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Finance & Loans</h2>
      </header>

      <div className="calc-content" style={{ padding: '16px', overflowY: 'auto', height: '100%', paddingBottom: '20px' }}>

        {/* --- Card 1: Loan Engine --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem', textAlign: 'center' }}>💰 Amortization Engine</h3>
          
          <div style={{ marginBottom: '14px' }}>
            <label style={{ color: '#00cc66', fontSize: '0.8rem', fontWeight: 'bold' }}>Loan Principal ($)</label>
            <input type="number" placeholder="e.g. 25000" value={principal} onChange={(e) => setPrincipal(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#00e5ff', fontSize: '0.8rem' }}>Interest Rate (%)</label>
              <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
            </div>
            <div>
              <label style={{ color: '#00e5ff', fontSize: '0.8rem' }}>Loan Term (Years)</label>
              <input type="number" value={years} onChange={(e) => setYears(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
            </div>
          </div>
          
          <div style={{ marginBottom: '14px' }}>
            <label style={{ color: '#ffb703', fontSize: '0.8rem', fontWeight: 'bold' }}>Extra Monthly Payment ($)</label>
            <input type="number" placeholder="Optional" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #ffb70355', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
          </div>

          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px', fontFamily: 'monospace' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#aaa' }}>Base Interest:</span><span style={{ color: '#d00000' }}>{formatCur(solution.totalInterest)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}><span style={{ color: '#aaa' }}>Total Base Cost:</span><span style={{ color: '#fff' }}>{formatCur(solution.totalCost)}</span></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '12px', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Base Monthly:</span>
              <span style={{ color: '#00cc66', fontWeight: 'bold', fontSize: '1.2rem' }}>{formatCur(solution.monthlyPayment)}</span>
            </div>
          </div>
        </div>

        {/* --- Card 2: The Extra Payment Hack --- */}
        {parseFloat(extraPayment) > 0 && solution.monthsSaved > 0 && (
          <div style={{ background: '#181818', borderTop: '4px solid #ffb703', borderRadius: '12px', padding: '16px', marginBottom: '20px', boxShadow: '0 0 15px rgba(255,183,3,0.1)' }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem', textAlign: 'center' }}>🚀 The Extra Payment Hack</h3>
            <p style={{ color: '#888', fontSize: '0.75rem', margin: '0 0 14px 0', textAlign: 'center' }}>By paying exactly <strong>{formatCur(solution.monthlyPayment + parseFloat(extraPayment))}</strong> a month, here is what happens:</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', fontSize: '0.9rem', background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#aaa' }}>New Total Interest:</span>
                <span style={{ color: '#ffb703', fontWeight: 'bold' }}>{formatCur(solution.newInterest)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #333', paddingTop: '8px', marginTop: '4px' }}>
                <span style={{ color: '#aaa' }}>Money Saved:</span>
                <span style={{ color: '#00cc66', fontWeight: 'bold', fontSize: '1.1rem' }}>{formatCur(solution.interestSaved)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#aaa' }}>Time Saved:</span>
                <span style={{ color: '#00e5ff', fontWeight: 'bold', fontSize: '1.1rem' }}>{solution.timeSavedStr}</span>
              </div>
              <div style={{ textAlign: 'center', marginTop: '8px', color: '#666', fontSize: '0.75rem' }}>
                You will be debt-free in just <strong>{solution.newTotalTime}</strong>.
              </div>
            </div>
          </div>
        )}

        {/* --- Card 3: Layman's Educational Guide --- */}
        <div style={{ background: '#181818', borderLeft: '4px solid #a600ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>📖 Layman's Finance Guide</h3>
          
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>The Front-Loaded Trap</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>Banks take their profit first. On a 30-year mortgage, nearly 70% of your monthly payment goes straight to interest for the first 5 years. This is why it feels like your loan balance never drops early on. <em>Every single dollar you pay extra goes 100% toward the principal</em>, destroying the bank's future interest mathematically.</p>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>Snowball vs. Avalanche</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>Got multiple debts? The <strong>Avalanche</strong> method says put all extra money toward the debt with the highest interest rate (mathematically the cheapest). The <strong>Snowball</strong> method says pay off the smallest balance first to get a quick psychological win and free up cash flow.</p>
          </div>

          <div>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>Good Debt vs. Bad Debt</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}><strong>Bad debt</strong> is high-interest (like a 25% credit card) used to buy things that lose value (like TVs). <strong>Good debt</strong> is low-interest (like a 4% mortgage) used to buy assets that go up in value. If your loan interest is lower than inflation, the debt is technically getting cheaper to hold every year.</p>
          </div>
        </div>

        {/* --- Card 4: Safety Disclaimer --- */}
        <div style={{ background: '#220000', border: '1px solid #d00000', borderRadius: '8px', padding: '16px' }}>
          <div style={{ color: '#ff4444', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '6px', textAlign: 'center' }}>⚠️ CRITICAL DISCLAIMER</div>
          <p style={{ color: '#ffaaaa', fontSize: '0.75rem', margin: '0', lineHeight: '1.5', textAlign: 'justify' }}>
            This engine calculates standard compound amortization. For mortgages, this number represents ONLY the Principal and Interest (P&I). It <strong>DOES NOT</strong> include Property Taxes, Homeowners Insurance, HOA fees, or Private Mortgage Insurance (PMI), which are typically bundled into an Escrow account and will make your actual monthly payment significantly higher.
          </p>
        </div>

      </div>
    </div>
  );
}

export default FinanceCalc;
