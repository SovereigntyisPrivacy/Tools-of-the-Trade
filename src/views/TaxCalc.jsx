import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TaxCalc() {
  const navigate = useNavigate();

  // --- State: Income & Adjustments ---
  const [gross, setGross] = useState('');
  const [stateTax, setStateTax] = useState('2.5');
  const [filingStatus, setFilingStatus] = useState('Single');
  const [dependents, setDependents] = useState('');
  const [empType, setEmpType] = useState('W2'); 

  // --- State: Above The Line (Pre-Tax) ---
  const [num401k, setNum401k] = useState('');
  const [numHsa, setNumHsa] = useState('');
  const [studentLoan, setStudentLoan] = useState('');

  // --- State: 1099 Business ---
  const [businessExpenses, setBusinessExpenses] = useState('');

  // --- State: Real Estate & Escrow ---
  const [propertyTax, setPropertyTax] = useState('');
  const [mortgageInt, setMortgageInt] = useState('');

  // --- State: Tax Credits ---
  const [solarCost, setSolarCost] = useState('');
  const [eduCredits, setEduCredits] = useState('');

  // --- State: Crypto & Cap Gains ---
  const [cryptoMined, setCryptoMined] = useState('');
  const [costBasis, setCostBasis] = useState('');
  const [soldFor, setSoldFor] = useState('');
  const [capGainsType, setCapGainsType] = useState('Short'); 

  // --- MATH HELPERS ---
  const parseNum = (val) => parseFloat(val) || 0;

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

  // --- EXECUTE CORE ENGINE ---
  const numGross = parseNum(gross);
  const numBizExp = parseNum(businessExpenses);
  
  // 1. 1099 Business Logic
  const netBusinessIncome = empType === '1099' ? Math.max(0, numGross - numBizExp) : 0;
  const seTaxAmount = empType === '1099' ? (netBusinessIncome * 0.9235 * 0.153) : 0;
  const ficaAmount = empType === 'W2' ? (numGross * 0.0765) : 0;
  const halfSE = seTaxAmount * 0.5;

  // 2. Cap Gains & Loss Harvesting
  let capLossOffset = 0;
  let taxableCapGains = 0;
  if (costBasis !== '' || soldFor !== '') {
    const netCapGains = parseNum(soldFor) - parseNum(costBasis);
    if (netCapGains < 0) capLossOffset = Math.min(3000, Math.abs(netCapGains));
    else taxableCapGains = netCapGains;
  }

  // 3. Adjusted Gross Income (AGI)
  const baseIncome = empType === 'W2' ? numGross : netBusinessIncome;
  const totalGrossIncome = baseIncome + parseNum(cryptoMined);
  const aboveTheLine = parseNum(num401k) + parseNum(numHsa) + parseNum(studentLoan) + halfSE + capLossOffset;
  const agi = Math.max(0, totalGrossIncome - aboveTheLine);

  // 4. SALT Cap & Itemization
  const stateIncomeTaxEst = totalGrossIncome * (parseNum(stateTax) / 100);
  const saltDeduction = Math.min(10000, parseNum(propertyTax) + stateIncomeTaxEst);
  const itemized = saltDeduction + parseNum(mortgageInt);

  let standardDed = 14600;
  if (filingStatus === 'Joint') standardDed = 29200;
  if (filingStatus === 'Head') standardDed = 21900; 

  const activeDeduction = Math.max(itemized, standardDed);
  const deductionMethod = itemized > standardDed ? 'Itemized' : 'Standard';

  // 5. Section 199A QBI Deduction (20% of net business income)
  const qbiDeduction = empType === '1099' ? Math.max(0, netBusinessIncome - halfSE) * 0.20 : 0;
  let taxableIncome = Math.max(0, agi - activeDeduction - qbiDeduction);

  // 6. Tax Generation
  let fedIncomeTax = 0;
  let capGainsTaxAmount = 0;
  let niitAmount = 0;

  if (capGainsType === 'Short' && taxableCapGains > 0) {
    taxableIncome += taxableCapGains; // Short term adds to ordinary
    fedIncomeTax = calculateFederalTax(taxableIncome);
  } else {
    fedIncomeTax = calculateFederalTax(taxableIncome);
    if (taxableCapGains > 0) {
      if (agi > 492300) capGainsTaxAmount = taxableCapGains * 0.20;
      else if (agi > 47025) capGainsTaxAmount = taxableCapGains * 0.15;
      
      const niitThreshold = filingStatus === 'Joint' ? 250000 : 200000;
      if (agi > niitThreshold) niitAmount = taxableCapGains * 0.038; // 3.8% Net Investment Income Tax
    }
  }

  // 7. High-Value Tax Credits (Dollar-for-Dollar)
  const ctc = parseNum(dependents) * 2000;
  const cleanEnergyCredit = parseNum(solarCost) * 0.30;
  const totalCredits = ctc + cleanEnergyCredit + parseNum(eduCredits);
  
  const fedTaxAfterCredits = Math.max(0, fedIncomeTax + capGainsTaxAmount + niitAmount - totalCredits);
  const totalTaxes = fedTaxAfterCredits + stateIncomeTaxEst + seTaxAmount + ficaAmount;
  
  const netTakeHome = totalGrossIncome + taxableCapGains - capLossOffset - totalTaxes;
  const effectiveRate = totalGrossIncome > 0 ? (totalTaxes / totalGrossIncome) * 100 : 0;

  const fmt = (val) => '$' + val.toLocaleString('en-US', { maximumFractionDigits: 0 });

  const inputStyle = { width: '100%', padding: '12px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1em', marginBottom: '6px' };
  const labelStyle = { display: 'block', color: '#aaa', marginBottom: '6px', fontSize: '0.85em', fontWeight: 'bold' };
  const helperStyle = { display: 'block', color: '#00ffff', fontSize: '0.75em', marginBottom: '15px', fontStyle: 'italic', opacity: 0.8 };

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate('/calculator')}>Hub</button>
        <h2>CPA Tax Engine</h2>
      </header>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', paddingBottom: '120px' }}>
        
        {/* --- 1. INCOME & DEMOGRAPHICS --- */}
        <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '20px', borderLeft: '4px solid #00cc66' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>1. Income & Status</h3>
          
          <label style={labelStyle}>Gross Annual Income ($)</label>
          <input type="number" placeholder="e.g. 65000" value={gross} onChange={e => setGross(e.target.value)} style={{...inputStyle, border: '1px solid #00cc66'}} />
          <span style={helperStyle}>Base salary before any taxes or deductions.</span>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '5px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Filing Status</label>
              <select value={filingStatus} onChange={e => setFilingStatus(e.target.value)} style={inputStyle}>
                <option value="Single">Single</option>
                <option value="Head">Head of Household</option>
                <option value="Joint">Married Joint</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>State Tax (%)</label>
              <input type="number" value={stateTax} onChange={e => setStateTax(e.target.value)} style={inputStyle} />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Kids (Dependents)</label>
              <input type="number" placeholder="0" value={dependents} onChange={e => setDependents(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Employment Type</label>
              <select value={empType} onChange={e => setEmpType(e.target.value)} style={{...inputStyle, background: empType === '1099' ? 'rgba(255, 170, 0, 0.1)' : '#000', color: empType === '1099' ? '#ffaa00' : '#fff'}}>
                <option value="W2">W-2 Employee</option>
                <option value="1099">1099 Contractor</option>
              </select>
            </div>
          </div>
          {empType === '1099' && <span style={{...helperStyle, color: '#ffaa00', marginTop: '5px'}}>Warning: Subject to 15.3% Self-Employment Tax.</span>}
        </div>

        {/* --- 2. 1099 BUSINESS DEDUCTIONS --- */}
        {empType === '1099' && (
          <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '20px', borderLeft: '4px solid #ffaa00' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#ffaa00' }}>2. Business Pass-Through</h3>
            <label style={labelStyle}>Business Write-Offs ($)</label>
            <input type="number" placeholder="Tools, mileage, internet..." value={businessExpenses} onChange={e => setBusinessExpenses(e.target.value)} style={{...inputStyle, border: '1px solid #ffaa00'}} />
            <span style={helperStyle}>Lowers your taxable gross. We automatically apply your 50% SE Tax Deduction and 20% QBI Deduction!</span>
          </div>
        )}

        {/* --- 3. ABOVE THE LINE (PRE-TAX) --- */}
        <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '20px', borderLeft: '4px solid #3b82f6' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#3b82f6' }}>3. Pre-Tax Adjustments</h3>
          <span style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '15px', lineHeight: '1.4' }}>"Above the line" deductions physically lower your Adjusted Gross Income (AGI), unlocking more credits.</span>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Traditional 401(k)</label>
              <input type="number" placeholder="$0" value={num401k} onChange={e => setNum401k(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>HSA / FSA</label>
              <input type="number" placeholder="$0" value={numHsa} onChange={e => setNumHsa(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <label style={labelStyle}>Student Loan Interest Paid</label>
            <input type="number" placeholder="Capped at $2,500..." value={studentLoan} onChange={e => setStudentLoan(e.target.value)} style={inputStyle} />
          </div>
        </div>

        {/* --- 4. HOUSING & CREDITS --- */}
        <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '20px', borderLeft: '4px solid #a855f7' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#a855f7' }}>4. Escrow & Credits</h3>
          
          <label style={{ display: 'block', color: '#fff', fontSize: '0.9em', marginBottom: '10px', borderBottom: '1px dashed #333', paddingBottom: '5px' }}>Itemized Escrow vs. Standard</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Property Tax</label>
              <input type="number" placeholder="$0" value={propertyTax} onChange={e => setPropertyTax(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Mortgage Interest</label>
              <input type="number" placeholder="$0" value={mortgageInt} onChange={e => setMortgageInt(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <span style={helperStyle}>SALT Rule: Property + State Income taxes are strictly capped at $10,000. Engine auto-selects Standard if it's higher.</span>

          <label style={{ display: 'block', color: '#fff', fontSize: '0.9em', marginBottom: '10px', marginTop: '10px', borderBottom: '1px dashed #333', paddingBottom: '5px' }}>High-Value Credits (Dollar-for-Dollar)</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Solar Install Cost</label>
              <input type="number" placeholder="Total bill..." value={solarCost} onChange={e => setSolarCost(e.target.value)} style={inputStyle} />
              <span style={helperStyle}>Instantly applies 30% Fed Credit.</span>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>College Credits</label>
              <input type="number" placeholder="$0" value={eduCredits} onChange={e => setEduCredits(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* --- 5. CRYPTO & CAP GAINS --- */}
        <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '20px', borderLeft: '4px solid #ef4444' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#ef4444' }}>5. Crypto & Cap Gains</h3>
          
          <label style={labelStyle}>Mined/Staked Coins (Ordinary Income)</label>
          <input type="number" placeholder="Fair Market Value at receipt..." value={cryptoMined} onChange={e => setCryptoMined(e.target.value)} style={inputStyle} />
          
          <label style={{...labelStyle, marginTop: '10px'}}>Asset Sales & Loss Harvesting</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input type="number" placeholder="Cost Basis" value={costBasis} onChange={e => setCostBasis(e.target.value)} style={inputStyle} />
            <input type="number" placeholder="Sold For" value={soldFor} onChange={e => setSoldFor(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setCapGainsType('Short')} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: capGainsType === 'Short' ? '#ef4444' : '#222', color: capGainsType === 'Short' ? '#fff' : '#888' }}>&lt; 1 Yr (Short)</button>
            <button onClick={() => setCapGainsType('Long')} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: capGainsType === 'Long' ? '#00cc66' : '#222', color: capGainsType === 'Long' ? '#000' : '#888' }}>&gt; 1 Yr (Long)</button>
          </div>
          <span style={{...helperStyle, marginTop: '10px'}}>If you sold at a loss, engine automatically offsets up to $3,000 against ordinary income! NIIT (3.8%) applies for high earners.</span>
        </div>

        {/* --- 6. LIVE OUTPUT MATRIX --- */}
        <div style={{ background: '#000', padding: '20px', borderRadius: '12px', border: '1px solid #444', fontFamily: 'monospace', fontSize: '1.1em', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,255,255,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#00ffff', textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Final Tax Analysis</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#aaa', fontSize: '0.9em' }}><span>Adjusted Gross (AGI):</span> <span>{fmt(agi)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#aaa', fontSize: '0.9em' }}><span>Active Deduction:</span> <span>[{deductionMethod}] {fmt(activeDeduction)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#00cc66', fontSize: '0.9em' }}><span>Total Credits Applied:</span> <span>-{fmt(totalCredits)}</span></div>
          
          <div style={{ borderBottom: '1px dashed #444', margin: '15px 0' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#ff4444' }}><span>Fed Income + Cap Gains:</span> <span>-{fmt(fedTaxAfterCredits)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#ff4444' }}><span>State Tax Estimate:</span> <span>-{fmt(stateIncomeTaxEst)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#ff4444' }}><span>FICA / SE Tax:</span> <span>-{fmt(seTaxAmount + ficaAmount)}</span></div>
          
          <div style={{ borderBottom: '1px solid #444', margin: '15px 0' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00cc66', fontWeight: 'bold', fontSize: '1.3em' }}><span>Net Take-Home:</span> <span>{fmt(netTakeHome)}</span></div>
          <div style={{ textAlign: 'center', marginTop: '15px', color: '#888', fontSize: '0.9em' }}>True Effective Rate: <strong style={{ color: '#fff' }}>{effectiveRate.toFixed(1)}%</strong></div>
        </div>

      </div>
    </div>
  );
}
