import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TaxCalc() {
  const navigate = useNavigate();

  // --- IRS Tax Engine State ---
  const [gross, setGross] = useState('');
  const [statePct, setStatePct] = useState('2.5');
  const [status, setStatus] = useState('Single');
  const [empType, setEmpType] = useState('W-2');

  // --- Crypto & Cap Gains State ---
  const [coinsMined, setCoinsMined] = useState('');
  const [fmv, setFmv] = useState('');
  const [costBasis, setCostBasis] = useState('');
  const [soldFor, setSoldFor] = useState('');
  const [capTerm, setCapTerm] = useState('Short');

  // --- Compound Wealth State ---
  const [principal, setPrincipal] = useState('1000');
  const [monthly, setMonthly] = useState('100');
  const [years, setYears] = useState('10');
  const [apy, setApy] = useState('7.0');

  // --- Output State ---
  const [solution, setSolution] = useState({
    taxableBase: 0,
    federalTax: 0,
    stateTax: 0,
    ficaTax: 0,
    netTakeHome: 0,
    effectiveRate: '0.0',
    capGainsTax: 0,
    grossProfit: 0,
    netCleared: 0,
    totalInvested: 0,
    interestEarned: 0,
    futureValue: 0
  });

  // --- Formatting Helper ---
  const formatCur = (val) => '$' + Math.round(val).toLocaleString('en-US');

  // --- MASTER CALCULATION ENGINE ---
  useEffect(() => {
    const gIncome = parseFloat(gross) || 0;
    const sPct = parseFloat(statePct) || 0;
    const cMined = parseFloat(coinsMined) || 0;
    const cFmv = parseFloat(fmv) || 0;
    const cBasis = parseFloat(costBasis) || 0;
    const cSold = parseFloat(soldFor) || 0;
    const p = parseFloat(principal) || 0;
    const m = parseFloat(monthly) || 0;
    const y = parseFloat(years) || 0;
    const a = parseFloat(apy) || 0;

    // 1. Ordinary Income Calculation
    const miningIncome = cMined * cFmv;
    const totalOrdinaryGross = gIncome + miningIncome;

    // 2. FICA / Self-Employment Tax (2025/2026 SS Wage Base: ~$176,100)
    const SS_WAGE_BASE = 176100;
    let ficaTax = 0;
    let halfSeDeduction = 0;

    if (empType === 'W-2') {
      const ssTax = Math.min(totalOrdinaryGross, SS_WAGE_BASE) * 0.062;
      const medTax = totalOrdinaryGross * 0.0145;
      ficaTax = ssTax + medTax;
    } else {
      const seIncome = totalOrdinaryGross * 0.9235;
      const ssTax = Math.min(seIncome, SS_WAGE_BASE) * 0.124;
      const medTax = seIncome * 0.029;
      ficaTax = ssTax + medTax;
      halfSeDeduction = ficaTax / 2; // Above-the-line deduction
    }

    // 3. Federal Income Tax (2026 Brackets)
    let stdDeduction = 16100; // Single
    if (status === 'MFJ') stdDeduction = 32200;
    if (status === 'HOH') stdDeduction = 24150;

    const taxableOrdinary = Math.max(0, totalOrdinaryGross - stdDeduction - halfSeDeduction);

    const brackets = {
      Single: [
        { limit: 12400, rate: 0.10 }, { limit: 50400, rate: 0.12 }, { limit: 105700, rate: 0.22 },
        { limit: 201775, rate: 0.24 }, { limit: 256225, rate: 0.32 }, { limit: 640600, rate: 0.35 }, { limit: Infinity, rate: 0.37 }
      ],
      MFJ: [
        { limit: 24800, rate: 0.10 }, { limit: 100800, rate: 0.12 }, { limit: 211400, rate: 0.22 },
        { limit: 403550, rate: 0.24 }, { limit: 512450, rate: 0.32 }, { limit: 768700, rate: 0.35 }, { limit: Infinity, rate: 0.37 }
      ],
      HOH: [
        { limit: 17700, rate: 0.10 }, { limit: 67450, rate: 0.12 }, { limit: 105700, rate: 0.22 },
        { limit: 201750, rate: 0.24 }, { limit: 256200, rate: 0.32 }, { limit: 640600, rate: 0.35 }, { limit: Infinity, rate: 0.37 }
      ]
    };

    let fedTaxOrdinary = 0;
    let remainingIncome = taxableOrdinary;
    let prevLimit = 0;

    for (const b of brackets[status]) {
      const chunk = Math.min(Math.max(0, remainingIncome), b.limit - prevLimit);
      fedTaxOrdinary += chunk * b.rate;
      remainingIncome -= chunk;
      prevLimit = b.limit;
      if (remainingIncome <= 0) break;
    }

    // 4. Capital Gains Tax
    const grossProfit = Math.max(0, cSold - cBasis);
    let capGainsTax = 0;

    if (grossProfit > 0) {
      if (capTerm === 'Short') {
        let shortTermRemaining = grossProfit;
        let currentTaxable = taxableOrdinary;
        let stPrevLimit = 0;
        
        for (const b of brackets[status]) {
          if (currentTaxable > b.limit) {
            stPrevLimit = b.limit;
            continue;
          }
          const availableInBracket = b.limit - currentTaxable;
          const chunk = Math.min(shortTermRemaining, availableInBracket);
          capGainsTax += chunk * b.rate;
          shortTermRemaining -= chunk;
          currentTaxable += chunk;
          if (shortTermRemaining <= 0) break;
        }
      } else {
        // Long Term (0%, 15%, 20%) Stacking logic
        const ltcgLimits = {
          Single: [ { limit: 49450, rate: 0 }, { limit: 545500, rate: 0.15 }, { limit: Infinity, rate: 0.20 } ],
          MFJ: [ { limit: 98900, rate: 0 }, { limit: 613700, rate: 0.15 }, { limit: Infinity, rate: 0.20 } ],
          HOH: [ { limit: 66200, rate: 0 }, { limit: 579600, rate: 0.15 }, { limit: Infinity, rate: 0.20 } ]
        };

        let ltRemaining = grossProfit;
        let currentOrdinary = taxableOrdinary;

        for (const b of ltcgLimits[status]) {
          if (currentOrdinary >= b.limit) continue;
          const availableInBracket = b.limit - currentOrdinary;
          const chunk = Math.min(ltRemaining, availableInBracket);
          capGainsTax += chunk * b.rate;
          ltRemaining -= chunk;
          currentOrdinary += chunk;
          if (ltRemaining <= 0) break;
        }
      }
    }

    // 5. State Tax
    const stateTax = totalOrdinaryGross * (sPct / 100);

    // 6. Net Cleared & Take Home
    const netCleared = grossProfit - capGainsTax;
    const netTakeHome = totalOrdinaryGross - fedTaxOrdinary - stateTax - ficaTax + netCleared;

    // 7. Effective Rate
    const totalTaxPaid = fedTaxOrdinary + stateTax + ficaTax + capGainsTax;
    const totalGrossAll = totalOrdinaryGross + grossProfit;
    const effectiveRate = totalGrossAll > 0 ? ((totalTaxPaid / totalGrossAll) * 100).toFixed(1) : '0.0';

    // 8. Compound Wealth
    const rate = a / 100 / 12;
    const periods = y * 12;
    let fv = p;
    if (rate > 0) {
      fv = p * Math.pow(1 + rate, periods) + m * ((Math.pow(1 + rate, periods) - 1) / rate);
    } else {
      fv = p + (m * periods);
    }
    const totalInvested = p + (m * periods);
    const interestEarned = Math.max(0, fv - totalInvested);

    setSolution({
      taxableBase: taxableOrdinary,
      federalTax: fedTaxOrdinary,
      stateTax: stateTax,
      ficaTax: ficaTax,
      netTakeHome: netTakeHome,
      effectiveRate: effectiveRate,
      capGainsTax: capGainsTax,
      grossProfit: grossProfit,
      netCleared: netCleared,
      totalInvested: totalInvested,
      interestEarned: interestEarned,
      futureValue: fv
    });

  }, [gross, statePct, status, empType, coinsMined, fmv, costBasis, soldFor, capTerm, principal, monthly, years, apy]);

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Certified IRS Tax Engine</h2>
      </header>

      <div className="calc-content" style={{ padding: '16px', overflowY: 'auto', height: '100%', paddingBottom: '20px' }}>

        {/* --- Card 1: Main Tax Engine --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem', textAlign: 'center' }}>💼 Certified IRS Tax Engine</h3>
          
          <div style={{ marginBottom: '14px' }}>
            <label style={{ color: '#00cc66', fontSize: '0.8rem', fontWeight: 'bold' }}>Gross Annual Income ($)</label>
            <input type="number" placeholder="e.g. 65000" value={gross} onChange={(e) => setGross(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.8rem' }}>State Tax (%)</label>
              <input type="number" step="0.1" value={statePct} onChange={(e) => setStatePct(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Filing Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }}>
                <option value="Single">Single</option>
                <option value="MFJ">Married Jointly</option>
                <option value="HOH">Head of Household</option>
              </select>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '6px', color: '#aaa', fontSize: '0.8rem' }}>Employment Type (FICA Matrix)</div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button onClick={() => setEmpType('W-2')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: empType === 'W-2' ? '#00cc66' : '#222', color: empType === 'W-2' ? '#000' : '#888', fontWeight: 'bold' }}>W-2 Employee</button>
            <button onClick={() => setEmpType('1099')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: empType === '1099' ? '#ffb703' : '#222', color: empType === '1099' ? '#000' : '#888', fontWeight: 'bold' }}>1099 Contractor</button>
          </div>

          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px', fontFamily: 'monospace' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#aaa' }}>Taxable Base (AGI):</span><span style={{ color: '#fff' }}>{formatCur(solution.taxableBase)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#aaa' }}>Federal Tax:</span><span style={{ color: '#d00000' }}>-{formatCur(solution.federalTax)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#aaa' }}>State Tax:</span><span style={{ color: '#d00000' }}>-{formatCur(solution.stateTax)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}><span style={{ color: '#aaa' }}>FICA / SE Tax:</span><span style={{ color: '#d00000' }}>-{formatCur(solution.ficaTax)}</span></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '12px', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Net Take-Home:</span>
              <span style={{ color: '#00cc66', fontWeight: 'bold', fontSize: '1.2rem' }}>{formatCur(solution.netTakeHome)}</span>
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px', color: '#666', fontSize: '0.75rem' }}>True Effective Tax Rate: {solution.effectiveRate}%</div>
          </div>
        </div>

        {/* --- Card 2: Crypto & Capital Gains --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #a600ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem', textAlign: 'center' }}>📈 Crypto Hash & Cap Gains</h3>
          
          <div style={{ border: '1px dashed #a600ff55', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
            <div style={{ color: '#a600ff', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px' }}>Mined / Staked Coins (Ordinary Income)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input type="number" placeholder="Coins Mined" value={coinsMined} onChange={(e) => setCoinsMined(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
              <input type="number" placeholder="FMV at receipt ($)" value={fmv} onChange={(e) => setFmv(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
            <div style={{ textAlign: 'center', marginTop: '8px', color: '#888', fontSize: '0.7rem' }}>*Mining value automatically added to Gross Taxable Income above.</div>
          </div>

          <div style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '8px', textAlign: 'center' }}>Asset Sale (Capital Gains)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <input type="number" placeholder="Cost Basis ($)" value={costBasis} onChange={(e) => setCostBasis(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            <input type="number" placeholder="Sold For ($)" value={soldFor} onChange={(e) => setSoldFor(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button onClick={() => setCapTerm('Short')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: capTerm === 'Short' ? '#ff4444' : '#222', color: capTerm === 'Short' ? '#fff' : '#888', fontWeight: 'bold' }}>&lt; 1 Yr (Short)</button>
            <button onClick={() => setCapTerm('Long')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: capTerm === 'Long' ? '#444' : '#222', color: capTerm === 'Long' ? '#fff' : '#888', fontWeight: 'bold' }}>&gt; 1 Yr (Long)</button>
          </div>

          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px', fontFamily: 'monospace' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#aaa' }}>Gross Profit:</span><span style={{ color: '#00cc66' }}>{formatCur(solution.grossProfit)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Net Cleared:</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{formatCur(solution.netCleared)}</span></div>
          </div>
        </div>

        {/* --- Card 3: Compound Wealth --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #ffb703', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem', textAlign: 'center' }}>📈 Compound Wealth</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#ffb703', fontSize: '0.8rem', fontWeight: 'bold' }}>Principal ($)</label>
              <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
            </div>
            <div>
              <label style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: 'bold' }}>Monthly Add ($)</label>
              <input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Years to Grow</label>
              <input type="number" value={years} onChange={(e) => setYears(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Est. APY (%)</label>
              <input type="number" step="0.1" value={apy} onChange={(e) => setApy(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
            </div>
          </div>

          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#aaa' }}>Total Invested:</span><span style={{ color: '#fff' }}>{formatCur(solution.totalInvested)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><span style={{ color: '#aaa' }}>Interest Earned:</span><span style={{ color: '#00cc66' }}>+{formatCur(solution.interestEarned)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '10px', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Future Value:</span>
              <span style={{ color: '#ffb703', fontWeight: 'bold', fontSize: '1.2rem' }}>{formatCur(solution.futureValue)}</span>
            </div>
          </div>
        </div>

        {/* --- Card 4: Layman's Educational Guide --- */}
        <div style={{ background: '#181818', borderLeft: '4px solid #a600ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>📖 Layman's Tax Guide</h3>
          
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>Marginal vs. Effective Rate</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>Taxes work like filling up buckets. If you enter the "22% bracket", ONLY the money that spills into that specific bucket is taxed at 22%. Your <strong>Effective Rate</strong> is the true average percentage of your total income that went to the government.</p>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>W-2 vs. 1099 (Self-Employed)</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>As a W-2 employee, your boss secretly pays half of your Social Security & Medicare taxes. If you are a 1099 contractor, you must pay the full 15.3% yourself (known as SE Tax), but the IRS allows you to deduct half of it from your taxable base.</p>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>The Standard Deduction</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>The IRS gives everyone a "free pass" on a chunk of their income where you pay $0 in federal tax. For 2026, a single filer gets their first $16,100 completely tax-free. You only pay taxes on the <em>Taxable Base (AGI)</em> left over.</p>
          </div>

          <div>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>Short vs. Long Term Capital Gains</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>If you sell a stock or crypto within 1 year of buying it, the profit is taxed at your high ordinary income rate (Short Term). If you hold it for over 1 year (Long Term), the IRS rewards you with a massive discount, dropping the tax rate down to 15% or even 0% depending on your total income!</p>
          </div>
        </div>

        {/* --- Card 5: Safety Disclaimer --- */}
        <div style={{ background: '#220000', border: '1px solid #d00000', borderRadius: '8px', padding: '16px' }}>
          <div style={{ color: '#ff4444', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '6px', textAlign: 'center' }}>⚠️ CRITICAL DISCLAIMER</div>
          <p style={{ color: '#ffaaaa', fontSize: '0.75rem', margin: '0', lineHeight: '1.5', textAlign: 'justify' }}>
            This engine utilizes standard 2026 IRS federal tax brackets and FICA guidelines. It is designed for educational and high-level estimation purposes only. State tax systems vary wildly, and this tool uses a flat percentage estimation. Real-world tax returns are deeply affected by pre-tax deductions (like 401ks), itemized deductions, AMT, and shifting tax credits. <strong>NEVER</strong> rely solely on a digital calculator for your official IRS filings. ALWAYS consult a Certified Public Accountant (CPA).
          </p>
        </div>

      </div>
    </div>
  );
}

export default TaxCalc;
