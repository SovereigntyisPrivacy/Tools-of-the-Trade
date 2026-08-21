import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function FinanceCalc() {
  const navigate = useNavigate();

  // --- Amortization State ---
  const [principal, setPrincipal] = useState('250000');
  const [rate, setRate] = useState('6.5');
  const [years, setYears] = useState('30');
  const [extraPayment, setExtraPayment] = useState('0');

  // --- DTI State ---
  const [monthlyIncome, setMonthlyIncome] = useState('6000');
  const [monthlyDebts, setMonthlyDebts] = useState('900');

  // --- Cap Rate / ROI State ---
  const [propPrice, setPropPrice] = useState('300000');
  const [annualRent, setAnnualRent] = useState('30000');
  const [annualExpenses, setAnnualExpenses] = useState('8000');

  // --- Output State ---
  const [solution, setSolution] = useState({
    monthlyPayment: 0,
    totalInterest: 0,
    totalCost: 0,
    newInterest: 0,
    interestSaved: 0,
    monthsSaved: 0,
    newTotalTime: '',
    timeSavedStr: '',
    dtiPct: 0,
    dtiStatus: '',
    dtiColor: '',
    noi: 0,
    capRate: 0
  });

  // --- Formatting Helper ---
  const formatCur = (val) => '$' + Math.round(val).toLocaleString('en-US');

  // --- MASTER ENGINE ---
  useEffect(() => {
    // 1. Amortization Math
    const p = parseFloat(principal) || 0;
    const rAnnual = parseFloat(rate) || 0;
    const y = parseFloat(years) || 0;
    const extra = parseFloat(extraPayment) || 0;

    let m = 0;
    let totalInt = 0;
    let tCost = 0;
    let totalIntExtra = 0;
    let monthsExtra = 0;
    let intSaved = 0;
    let mSaved = 0;

    if (p > 0 && y > 0) {
      const rMonthly = rAnnual / 100 / 12;
      const n = y * 12;

      if (rMonthly > 0) {
        m = p * (rMonthly * Math.pow(1 + rMonthly, n)) / (Math.pow(1 + rMonthly, n) - 1);
        tCost = m * n;
        totalInt = tCost - p;
      } else {
        m = p / n;
        tCost = p;
        totalInt = 0;
      }

      let bal = p;
      const actualPayment = m + extra;

      if (rMonthly > 0 && actualPayment > (bal * rMonthly)) {
        while (bal > 0 && monthsExtra < 1200) {
          let intMonth = bal * rMonthly;
          totalIntExtra += intMonth;
          let pmtAppliedToPrincipal = actualPayment - intMonth;
          if (pmtAppliedToPrincipal > bal) pmtAppliedToPrincipal = bal;
          bal -= pmtAppliedToPrincipal;
          monthsExtra++;
        }
      } else if (rMonthly === 0) {
        monthsExtra = Math.ceil(p / actualPayment);
      }

      intSaved = Math.max(0, totalInt - totalIntExtra);
      mSaved = Math.max(0, n - monthsExtra);
    }

    const formatTime = (totalMonths) => {
      const yrs = Math.floor(totalMonths / 12);
      const mos = totalMonths % 12;
      return `${yrs > 0 ? yrs + 'y ' : ''}${mos}m`;
    };

    // 2. DTI Math
    const mInc = parseFloat(monthlyIncome) || 0;
    const mDebt = parseFloat(monthlyDebts) || 0;
    let dti = 0;
    let dStat = 'N/A';
    let dColor = '#aaa';

    if (mInc > 0) {
      dti = (mDebt / mInc) * 100;
      if (dti <= 36) { dStat = 'Safe (Prime Approval)'; dColor = '#00cc66'; }
      else if (dti <= 43) { dStat = 'Risky (Max Allowed)'; dColor = '#ffb703'; }
      else { dStat = 'Danger (Likely Denied)'; dColor = '#d00000'; }
    }

    // 3. Cap Rate Math
    const pPrice = parseFloat(propPrice) || 0;
    const aRent = parseFloat(annualRent) || 0;
    const aExp = parseFloat(annualExpenses) || 0;
    
    const netOpInc = aRent - aExp;
    const cRate = pPrice > 0 ? (netOpInc / pPrice) * 100 : 0;

    setSolution({
      monthlyPayment: m,
      totalInterest: totalInt,
      totalCost: tCost,
      newInterest: totalIntExtra,
      interestSaved: intSaved,
      monthsSaved: mSaved,
      newTotalTime: formatTime(monthsExtra),
      timeSavedStr: formatTime(mSaved),
      dtiPct: dti,
      dtiStatus: dStat,
      dtiColor: dColor,
      noi: netOpInc,
      capRate: cRate
    });

  }, [principal, rate, years, extraPayment, monthlyIncome, monthlyDebts, propPrice, annualRent, annualExpenses]);

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Finance & Real Estate</h2>
      </header>

      <div className="calc-content" style={{ padding: '16px', overflowY: 'auto', height: '100%', paddingBottom: '20px' }}>

        {/* --- Card 1: Loan Engine --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem', textAlign: 'center' }}>💰 Amortization Engine</h3>
          
          <div style={{ marginBottom: '14px' }}>
            <label style={{ color: '#00cc66', fontSize: '0.8rem', fontWeight: 'bold' }}>Loan Principal ($)</label>
            <input type="number" placeholder="e.g. 250000" value={principal} onChange={(e) => setPrincipal(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
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
            <input type="number" placeholder="Optional (e.g. 100)" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #ffb70355', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
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

        {/* --- Card 3: DTI (Debt-to-Income) --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #a600ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem', textAlign: 'center' }}>🏦 DTI & Affordability</h3>
          <p style={{ color: '#888', fontSize: '0.75rem', margin: '0 0 14px 0', textAlign: 'center' }}>The exact formula banks use to approve or deny loans.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: 'bold' }}>Gross Monthly Income</label>
              <input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
            </div>
            <div>
              <label style={{ color: '#ff4444', fontSize: '0.8rem', fontWeight: 'bold' }}>Total Monthly Debts</label>
              <input type="number" value={monthlyDebts} onChange={(e) => setMonthlyDebts(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
            </div>
          </div>
          
          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
            <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '4px' }}>Your DTI Ratio:</div>
            <div style={{ color: solution.dtiColor, fontWeight: '900', fontSize: '1.8rem', marginBottom: '4px' }}>{solution.dtiPct.toFixed(1)}%</div>
            <div style={{ color: solution.dtiColor, fontSize: '0.9rem', fontWeight: 'bold' }}>{solution.dtiStatus}</div>
          </div>
        </div>

        {/* --- Card 4: Real Estate Investor (Cap Rate) --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #00e5ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem', textAlign: 'center' }}>🏢 Real Estate Investor (Cap Rate)</h3>
          <p style={{ color: '#888', fontSize: '0.75rem', margin: '0 0 14px 0', textAlign: 'center' }}>Calculate the baseline ROI of a rental property.</p>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: 'bold' }}>Property Purchase Price ($)</label>
            <input type="number" value={propPrice} onChange={(e) => setPropPrice(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#00cc66', fontSize: '0.8rem' }}>Annual Rent ($)</label>
              <input type="number" value={annualRent} onChange={(e) => setAnnualRent(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
            </div>
            <div>
              <label style={{ color: '#ffb703', fontSize: '0.8rem' }}>Annual Expenses ($)</label>
              <input type="number" value={annualExpenses} onChange={(e) => setAnnualExpenses(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
            </div>
          </div>
          
          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#aaa' }}>Net Operating Inc (NOI):</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{formatCur(solution.noi)} / yr</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '10px', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Cap Rate:</span>
              <span style={{ color: '#00e5ff', fontWeight: 'bold', fontSize: '1.2rem' }}>{solution.capRate.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* --- Card 5: Layman's Educational Guide --- */}
        <div style={{ background: '#181818', borderLeft: '4px solid #a600ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '1.1rem' }}>📖 Layman's Finance Guide</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>The Front-Loaded Trap</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>Banks take their profit first. On a standard 30-year mortgage, nearly 70% of your monthly payment goes straight to the bank's interest for the first 5 years. <em>Every single dollar you pay extra goes 100% toward the principal</em>, mathematically destroying the bank's future interest.</p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>PMI (Private Mortgage Insurance)</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>If you buy a house with less than a 20% down payment, the bank sees you as a risk. They will force you to pay a monthly "PMI" fee (often $100-$300/mo) that protects <em>them</em> if you default. You can request to drop PMI once you pay off enough of the loan to reach 20% equity.</p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>Closing Costs (The Hidden Fee)</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>Buying a house requires more cash than just the down payment. "Closing costs" are fees for appraisals, lawyers, titles, and taxes. Expect to pay an extra <strong>2% to 5%</strong> of the home's total purchase price in cash on the day you sign the papers.</p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>The 28/36 Rule of Affordability</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>A golden rule of real estate: Your mortgage payment (including taxes and insurance) should not exceed <strong>28%</strong> of your gross monthly income. Furthermore, your total debt (mortgage + cars + student loans) should not exceed <strong>36%</strong> of your income (your DTI).</p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>Cap Rate (Capitalization Rate)</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>This is how investors grade a property. It assumes you bought the building in straight cash. If a $100k property generates $8k in profit (NOI) a year, it has an 8% Cap Rate. A higher Cap Rate means higher returns, but usually indicates a riskier neighborhood or property.</p>
          </div>

          <div>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>Snowball vs. Avalanche</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>Got multiple debts? The <strong>Avalanche</strong> method says put all extra money toward the debt with the highest interest rate (mathematically the cheapest). The <strong>Snowball</strong> method says pay off the smallest balance first to get a quick psychological win and free up cash flow.</p>
          </div>
        </div>

        {/* --- Card 6: Safety Disclaimer --- */}
        <div style={{ background: '#220000', border: '1px solid #d00000', borderRadius: '8px', padding: '16px' }}>
          <div style={{ color: '#ff4444', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '6px', textAlign: 'center' }}>⚠️ CRITICAL DISCLAIMER</div>
          <p style={{ color: '#ffaaaa', fontSize: '0.75rem', margin: '0', lineHeight: '1.5', textAlign: 'justify' }}>
            This engine calculates standard compound amortization. For mortgages, this number represents ONLY the Principal and Interest (P&I). It <strong>DOES NOT</strong> include Property Taxes, Homeowners Insurance, HOA fees, or PMI, which are typically bundled into an Escrow account and will make your actual monthly payment significantly higher. Real estate investments carry risk and Cap Rates do not account for financing costs or vacancies.
          </p>
        </div>

      </div>
    </div>
  );
}

export default FinanceCalc;
