import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TaxCalc() {
  const navigate = useNavigate();

  // --- State ---
  const [gross, setGross] = useState('');
  const [stateTax, setStateTax] = useState('2.5');
  const [filingStatus, setFilingStatus] = useState('Single');
  const [dependents, setDependents] = useState('');
  const [empType, setEmpType] = useState('W2'); 

  const [num401k, setNum401k] = useState('');
  const [numHsa, setNumHsa] = useState('');
  const [studentLoan, setStudentLoan] = useState('');
  const [businessExpenses, setBusinessExpenses] = useState('');

  const [propertyTax, setPropertyTax] = useState('');
  const [mortgageInt, setMortgageInt] = useState('');
  const [solarCost, setSolarCost] = useState('');
  const [eduCredits, setEduCredits] = useState('');

  const [cryptoMined, setCryptoMined] = useState('');
  const [costBasis, setCostBasis] = useState('');
  const [soldFor, setSoldFor] = useState('');
  const [capGainsType, setCapGainsType] = useState('Short'); 
  
  const [showGuide, setShowGuide] = useState(false);

  // --- Math Helpers ---
  const parseNum = (val) => parseFloat(val) || 0;
  const fmt = (val) => '$' + val.toLocaleString('en-US', { maximumFractionDigits: 0 });

  const calculateFederalTax = (taxableIncome) => {
    const brackets = [
      { limit: 11600, rate: 0.10 }, { limit: 47150, rate: 0.12 },
      { limit: 100525, rate: 0.22 }, { limit: 191950, rate: 0.24 },
      { limit: 243725, rate: 0.32 }, { limit: 609350, rate: 0.35 },
      { limit: Infinity, rate: 0.37 }
    ];
    let tax = 0, prevLimit = 0;
    for (let b of brackets) {
      if (taxableIncome > prevLimit) {
        let taxableAtBracket = Math.min(taxableIncome - prevLimit, b.limit - prevLimit);
        tax += taxableAtBracket * b.rate;
        prevLimit = b.limit;
      } else break;
    }
    return tax;
  };

  // --- Engine Logic ---
  const numGross = parseNum(gross);
  const netBusinessIncome = empType === '1099' ? Math.max(0, numGross - parseNum(businessExpenses)) : 0;
  const seTaxAmount = empType === '1099' ? (netBusinessIncome * 0.9235 * 0.153) : 0;
  const ficaAmount = empType === 'W2' ? (numGross * 0.0765) : 0;

  let capLossOffset = 0, taxableCapGains = 0;
  if (costBasis !== '' || soldFor !== '') {
    const netCapGains = parseNum(soldFor) - parseNum(costBasis);
    if (netCapGains < 0) capLossOffset = Math.min(3000, Math.abs(netCapGains));
    else taxableCapGains = netCapGains;
  }

  const baseIncome = empType === 'W2' ? numGross : netBusinessIncome;
  const totalGrossIncome = baseIncome + parseNum(cryptoMined);
  const aboveTheLine = parseNum(num401k) + parseNum(numHsa) + parseNum(studentLoan) + (seTaxAmount * 0.5) + capLossOffset;
  const agi = Math.max(0, totalGrossIncome - aboveTheLine);

  const stateIncomeTaxEst = totalGrossIncome * (parseNum(stateTax) / 100);
  const itemized = Math.min(10000, parseNum(propertyTax) + stateIncomeTaxEst) + parseNum(mortgageInt);

  let standardDed = 16100;
  if (filingStatus === 'Joint') standardDed = 32200;
  if (filingStatus === 'Head') standardDed = 24150; 

  const activeDeduction = Math.max(itemized, standardDed);
  const deductionMethod = itemized > standardDed ? 'Itemized' : 'Standard';

  const qbiDeduction = empType === '1099' ? Math.max(0, netBusinessIncome - (seTaxAmount * 0.5)) * 0.20 : 0;
  let taxableIncome = Math.max(0, agi - activeDeduction - qbiDeduction);

  let fedIncomeTax = 0, capGainsTaxAmount = 0, niitAmount = 0;
  if (capGainsType === 'Short' && taxableCapGains > 0) {
    taxableIncome += taxableCapGains; 
    fedIncomeTax = calculateFederalTax(taxableIncome);
  } else {
    fedIncomeTax = calculateFederalTax(taxableIncome);
    if (taxableCapGains > 0) {
      if (agi > 492300) capGainsTaxAmount = taxableCapGains * 0.20;
      else if (agi > 47025) capGainsTaxAmount = taxableCapGains * 0.15;
      if (agi > (filingStatus === 'Joint' ? 250000 : 200000)) niitAmount = taxableCapGains * 0.038; 
    }
  }

  const totalCredits = (parseNum(dependents) * 2000) + (parseNum(solarCost) * 0.30) + parseNum(eduCredits);
  const fedTaxAfterCredits = Math.max(0, fedIncomeTax + capGainsTaxAmount + niitAmount - totalCredits);
  const totalTaxes = fedTaxAfterCredits + stateIncomeTaxEst + seTaxAmount + ficaAmount;
  
  const netTakeHome = totalGrossIncome + taxableCapGains - capLossOffset - totalTaxes;
  const effectiveRate = totalGrossIncome > 0 ? (totalTaxes / totalGrossIncome) * 100 : 0;

  // --- Styles ---
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '20px' };
  const flexWrap = { display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '10px' };
  const inputWrap = { flex: '1 1 120px', minWidth: '120px' };
  const inputStyle = { width: '100%', padding: '12px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1em', marginTop: '6px' };
  const labelStyle = { color: '#aaa', fontSize: '0.85em', fontWeight: 'bold' };

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate('/calculator')}>Hub</button>
        <h2>CPA Tax Engine</h2>
      </header>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', paddingBottom: '120px' }}>
        
        <div style={{...cardStyle, borderLeft: '4px solid #00cc66'}}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>1. Income & Status</h3>
          <label style={labelStyle}>Gross Annual Income ($)
            <input type="number" placeholder="65000" value={gross} onChange={e => setGross(e.target.value)} style={{...inputStyle, border: '1px solid #00cc66'}} />
          </label>
          <div style={flexWrap}>
            <div style={inputWrap}><label style={labelStyle}>Filing Status<select value={filingStatus} onChange={e => setFilingStatus(e.target.value)} style={inputStyle}><option value="Single">Single</option><option value="Head">Head of Household</option><option value="Joint">Married Joint</option></select></label></div>
            <div style={inputWrap}><label style={labelStyle}>State Tax (%)<input type="number" value={stateTax} onChange={e => setStateTax(e.target.value)} style={inputStyle} /></label></div>
          </div>
          <div style={flexWrap}>
            <div style={inputWrap}><label style={labelStyle}>Dependents<input type="number" placeholder="0" value={dependents} onChange={e => setDependents(e.target.value)} style={inputStyle} /></label></div>
            <div style={inputWrap}><label style={labelStyle}>Employment<select value={empType} onChange={e => setEmpType(e.target.value)} style={{...inputStyle, color: empType==='1099'?'#ffaa00':'#fff'}}><option value="W2">W-2</option><option value="1099">1099</option></select></label></div>
          </div>
        </div>

        {empType === '1099' && (
          <div style={{...cardStyle, borderLeft: '4px solid #ffaa00'}}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ffaa00' }}>2. Business Write-Offs</h3>
            <label style={labelStyle}>Deductible Expenses ($)<input type="number" placeholder="Tools, mileage..." value={businessExpenses} onChange={e => setBusinessExpenses(e.target.value)} style={{...inputStyle, border: '1px solid #ffaa00'}} /></label>
          </div>
        )}

        <div style={{...cardStyle, borderLeft: '4px solid #3b82f6'}}>
          <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>3. Pre-Tax Adjustments</h3>
          <div style={flexWrap}>
            <div style={inputWrap}><label style={labelStyle}>401(k)<input type="number" placeholder="$0" value={num401k} onChange={e => setNum401k(e.target.value)} style={inputStyle} /></label></div>
            <div style={inputWrap}><label style={labelStyle}>HSA / FSA<input type="number" placeholder="$0" value={numHsa} onChange={e => setNumHsa(e.target.value)} style={inputStyle} /></label></div>
            <div style={inputWrap}><label style={labelStyle}>Student Loan Int.<input type="number" placeholder="$0" value={studentLoan} onChange={e => setStudentLoan(e.target.value)} style={inputStyle} /></label></div>
          </div>
        </div>

        <div style={{...cardStyle, borderLeft: '4px solid #a855f7'}}>
          <h3 style={{ margin: '0 0 10px 0', color: '#a855f7' }}>4. Escrow & Credits</h3>
          <div style={flexWrap}>
            <div style={inputWrap}><label style={labelStyle}>Property Tax<input type="number" placeholder="$0" value={propertyTax} onChange={e => setPropertyTax(e.target.value)} style={inputStyle} /></label></div>
            <div style={inputWrap}><label style={labelStyle}>Mortgage Interest<input type="number" placeholder="$0" value={mortgageInt} onChange={e => setMortgageInt(e.target.value)} style={inputStyle} /></label></div>
          </div>
          <div style={flexWrap}>
            <div style={inputWrap}><label style={labelStyle}>Solar Cost (30% Cr)<input type="number" placeholder="$0" value={solarCost} onChange={e => setSolarCost(e.target.value)} style={inputStyle} /></label></div>
            <div style={inputWrap}><label style={labelStyle}>Edu Credits<input type="number" placeholder="$0" value={eduCredits} onChange={e => setEduCredits(e.target.value)} style={inputStyle} /></label></div>
          </div>
        </div>

        <div style={{...cardStyle, borderLeft: '4px solid #ef4444'}}>
          <h3 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>5. Crypto & Cap Gains</h3>
          <label style={labelStyle}>Mined Coins (FMV $)<input type="number" placeholder="$0" value={cryptoMined} onChange={e => setCryptoMined(e.target.value)} style={inputStyle} /></label>
          <div style={{...flexWrap, marginTop: '10px'}}>
            <div style={inputWrap}><label style={labelStyle}>Cost Basis<input type="number" placeholder="$0" value={costBasis} onChange={e => setCostBasis(e.target.value)} style={inputStyle} /></label></div>
            <div style={inputWrap}><label style={labelStyle}>Sold For<input type="number" placeholder="$0" value={soldFor} onChange={e => setSoldFor(e.target.value)} style={inputStyle} /></label></div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setCapGainsType('Short')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: capGainsType==='Short'?'#ef4444':'#222', color: capGainsType==='Short'?'#fff':'#888' }}>Short Term</button>
            <button onClick={() => setCapGainsType('Long')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: capGainsType==='Long'?'#00cc66':'#222', color: capGainsType==='Long'?'#000':'#888' }}>Long Term</button>
          </div>
        </div>

        {/* --- LIVE OUTPUT MATRIX --- */}
        <div style={{ background: '#000', padding: '20px', borderRadius: '12px', border: '1px solid #444', fontFamily: 'monospace', fontSize: '1.1em', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#00ffff', textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Final Tax Analysis</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}><span>AGI:</span> <span>{fmt(agi)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', margin: '8px 0' }}><span>[{deductionMethod}]:</span> <span>-{fmt(activeDeduction)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00cc66' }}><span>Total Credits:</span> <span>-{fmt(totalCredits)}</span></div>
          <div style={{ borderBottom: '1px dashed #444', margin: '15px 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff4444' }}><span>Fed + Cap Gains:</span> <span>-{fmt(fedTaxAfterCredits)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff4444', margin: '8px 0' }}><span>State Tax:</span> <span>-{fmt(stateIncomeTaxEst)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff4444' }}><span>FICA / SE Tax:</span> <span>-{fmt(seTaxAmount + ficaAmount)}</span></div>
          <div style={{ borderBottom: '1px solid #444', margin: '15px 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00cc66', fontWeight: 'bold', fontSize: '1.3em' }}><span>Take-Home:</span> <span>{fmt(netTakeHome)}</span></div>
          <div style={{ textAlign: 'center', marginTop: '15px', color: '#888' }}>Effective Rate: <strong style={{ color: '#fff' }}>{effectiveRate.toFixed(1)}%</strong></div>
        </div>

        {/* --- LAYMAN'S GUIDE ACCORDION --- */}
        <div style={{ background: '#1a1a1a', borderRadius: '12px', border: '1px solid #444', overflow: 'hidden' }}>
          <button onClick={() => setShowGuide(!showGuide)} style={{ width: '100%', padding: '15px', background: '#222', border: 'none', color: '#fff', fontSize: '1.1em', fontWeight: 'bold', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
            📖 The Layman's Tax Guide <span>{showGuide ? '▲' : '▼'}</span>
          </button>
          {showGuide && (
            <div style={{ padding: '20px', color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}>
              <h4 style={{ color: '#a855f7', margin: '0 0 5px 0' }}>Marginal vs. Effective</h4>
              <p style={{ marginBottom: '15px' }}>Taxes fill up in "buckets." Just because you hit the 22% bracket doesn't mean all your money is taxed at 22%—only the money inside that specific bucket. Your <strong>Effective Rate</strong> (at the bottom) is the true average you actually paid.</p>
              
              <h4 style={{ color: '#00ffff', margin: '0 0 5px 0' }}>The 1099 Pass-Through Loophole</h4>
              <p style={{ marginBottom: '15px' }}>If you are a 1099 worker, you pay double the FICA tax (15.3%). However, the IRS lets you subtract 50% of that tax from your gross income, AND gives you a 20% Qualified Business Income (QBI) deduction on your profits.</p>

              <h4 style={{ color: '#ef4444', margin: '0 0 5px 0' }}>Loss Harvesting</h4>
              <p style={{ margin: 0 }}>If you sell crypto or stocks at a loss, the IRS allows you to deduct up to $3,000 of those losses against your regular paycheck income every single year.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
