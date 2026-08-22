import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TaxCalc() {
  const navigate = useNavigate();

  // --- UI STATE ---
  const [step, setStep] = useState(1);
  const [showGuide, setShowGuide] = useState(false);

  // --- 1. PROFILE STATE ---
  const [gross, setGross] = useState('');
  const [stateTax, setStateTax] = useState('2.5');
  const [filingStatus, setFilingStatus] = useState('Single');
  const [dependents, setDependents] = useState('');
  const [empType, setEmpType] = useState('W2'); 

  // --- 2. DEDUCTIONS STATE ---
  const [num401k, setNum401k] = useState('');
  const [numHsa, setNumHsa] = useState('');
  const [studentLoan, setStudentLoan] = useState('');
  const [businessExpenses, setBusinessExpenses] = useState('');

  // --- 3. ASSETS & ESCROW STATE ---
  const [propertyTax, setPropertyTax] = useState('');
  const [mortgageInt, setMortgageInt] = useState('');
  const [solarCost, setSolarCost] = useState('');
  const [eduCredits, setEduCredits] = useState('');
  const [cryptoMined, setCryptoMined] = useState('');
  const [costBasis, setCostBasis] = useState('');
  const [soldFor, setSoldFor] = useState('');
  const [capGainsType, setCapGainsType] = useState('Short'); 

  // --- MATH HELPERS ---
  const parseNum = (val) => parseFloat(val) || 0;
  const fmt = (val) => '$' + val.toLocaleString('en-US', { maximumFractionDigits: 0 });

  const calculateFederalTax = (taxableIncome) => {
    const brackets = [
      { limit: 12400, rate: 0.10 }, { limit: 50400, rate: 0.12 },
      { limit: 105700, rate: 0.22 }, { limit: 201775, rate: 0.24 },
      { limit: 256225, rate: 0.32 }, { limit: 640600, rate: 0.35 },
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

  // --- ENGINE LOGIC ---
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
      if (agi > 545500) capGainsTaxAmount = taxableCapGains * 0.20;
      else if (agi > 49450) capGainsTaxAmount = taxableCapGains * 0.15;
      if (agi > (filingStatus === 'Joint' ? 250000 : 200000)) niitAmount = taxableCapGains * 0.038; 
    }
  }

  const totalCredits = (parseNum(dependents) * 2000) + (parseNum(solarCost) * 0.30) + parseNum(eduCredits);
  const fedTaxAfterCredits = Math.max(0, fedIncomeTax + capGainsTaxAmount + niitAmount - totalCredits);
  const totalTaxes = fedTaxAfterCredits + stateIncomeTaxEst + seTaxAmount + ficaAmount;
  
  const netTakeHome = totalGrossIncome + taxableCapGains - capLossOffset - totalTaxes;
  const effectiveRate = totalGrossIncome > 0 ? (totalTaxes / totalGrossIncome) * 100 : 0;

  // --- STYLES ---
  const inputStyle = { width: '100%', padding: '12px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.1em', marginTop: '6px' };
  const labelStyle = { color: '#00ffff', fontSize: '0.85em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' };
  const flexWrap = { display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' };
  const inputWrap = { flex: '1 1 140px', minWidth: '140px' };

  // --- WIZARD NAVIGATION ---
  const nextStep = () => setStep(s => Math.min(4, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate('/calculator')}>Hub</button>
        <h2>Pro-Forma Tax Suite</h2>
      </header>

      {/* PROGRESS BAR */}
      <div style={{ display: 'flex', padding: '15px 20px', background: '#111', borderBottom: '1px solid #333', gap: '5px' }}>
        {[1, 2, 3, 4].map(num => (
          <div key={num} style={{ flex: 1, height: '6px', borderRadius: '3px', background: step >= num ? '#00cc66' : '#333', transition: 'background 0.3s' }}></div>
        ))}
      </div>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
        
        {step === 1 && (
          <div style={{...cardStyle, borderTop: '4px solid #00cc66'}}>
            <h3 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '1.4em' }}>1. Basic Profile</h3>
            <p style={{ color: '#aaa', fontSize: '0.9em', marginBottom: '20px' }}>Let's start with your standard income and demographics.</p>
            <label style={labelStyle}>Gross Annual Income ($)<input type="number" placeholder="65000" value={gross} onChange={e => setGross(e.target.value)} style={{...inputStyle, border: '1px solid #00cc66', marginBottom: '15px'}} /></label>
            <div style={flexWrap}>
              <div style={inputWrap}><label style={labelStyle}>Filing Status<select value={filingStatus} onChange={e => setFilingStatus(e.target.value)} style={inputStyle}><option value="Single">Single</option><option value="Head">Head of Household</option><option value="Joint">Married Joint</option></select></label></div>
              <div style={inputWrap}><label style={labelStyle}>State Tax (%)<input type="number" value={stateTax} onChange={e => setStateTax(e.target.value)} style={inputStyle} /></label></div>
            </div>
            <div style={flexWrap}>
              <div style={inputWrap}><label style={labelStyle}>Dependents (Kids)<input type="number" placeholder="0" value={dependents} onChange={e => setDependents(e.target.value)} style={inputStyle} /></label></div>
              <div style={inputWrap}><label style={labelStyle}>Employment<select value={empType} onChange={e => setEmpType(e.target.value)} style={{...inputStyle, color: empType==='1099'?'#ffaa00':'#fff'}}><option value="W2">W-2 Employee</option><option value="1099">1099 Contractor</option></select></label></div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{...cardStyle, borderTop: '4px solid #3b82f6'}}>
            <h3 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '1.4em' }}>2. Deductions</h3>
            <p style={{ color: '#aaa', fontSize: '0.9em', marginBottom: '20px' }}>These inputs lower your Adjusted Gross Income (AGI) before taxes are calculated.</p>
            {empType === '1099' && (
              <div style={{ padding: '15px', background: 'rgba(255,170,0,0.1)', border: '1px dashed #ffaa00', borderRadius: '8px', marginBottom: '20px' }}>
                <label style={{...labelStyle, color: '#ffaa00'}}>Business Write-Offs ($)<input type="number" placeholder="Tools, mileage..." value={businessExpenses} onChange={e => setBusinessExpenses(e.target.value)} style={{...inputStyle, border: '1px solid #ffaa00'}} /></label>
                <p style={{ color: '#ffaa00', fontSize: '0.8em', margin: '8px 0 0 0' }}>*This lowers your 15.3% Self-Employment tax burden.</p>
              </div>
            )}
            <div style={flexWrap}>
              <div style={inputWrap}><label style={labelStyle}>401(k) Deposits<input type="number" placeholder="$0" value={num401k} onChange={e => setNum401k(e.target.value)} style={inputStyle} /></label></div>
              <div style={inputWrap}><label style={labelStyle}>HSA / FSA<input type="number" placeholder="$0" value={numHsa} onChange={e => setNumHsa(e.target.value)} style={inputStyle} /></label></div>
            </div>
            <div style={inputWrap}><label style={labelStyle}>Student Loan Interest<input type="number" placeholder="$0 (Capped at $2,500)" value={studentLoan} onChange={e => setStudentLoan(e.target.value)} style={inputStyle} /></label></div>
          </div>
        )}

        {step === 3 && (
          <div style={{...cardStyle, borderTop: '4px solid #a855f7'}}>
            <h3 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '1.4em' }}>3. Assets & Escrow</h3>
            <p style={{ color: '#aaa', fontSize: '0.9em', marginBottom: '20px' }}>Enter property escrow, high-value credits, and capital gains.</p>
            <div style={{ borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '15px' }}>
              <div style={flexWrap}>
                <div style={inputWrap}><label style={labelStyle}>Property Tax<input type="number" placeholder="$0" value={propertyTax} onChange={e => setPropertyTax(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>Mortgage Interest<input type="number" placeholder="$0" value={mortgageInt} onChange={e => setMortgageInt(e.target.value)} style={inputStyle} /></label></div>
              </div>
            </div>
            <div style={{ borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '15px' }}>
              <div style={flexWrap}>
                <div style={inputWrap}><label style={labelStyle}>Solar / Battery Install Cost<input type="number" placeholder="$0" value={solarCost} onChange={e => setSolarCost(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>Edu Credits<input type="number" placeholder="$0" value={eduCredits} onChange={e => setEduCredits(e.target.value)} style={inputStyle} /></label></div>
              </div>
            </div>
            <div>
              <h4 style={{ color: '#ef4444', margin: '0 0 10px 0' }}>Crypto & Investments</h4>
              <label style={{...labelStyle, color: '#aaa'}}>Mined Coins (FMV $)<input type="number" placeholder="$0" value={cryptoMined} onChange={e => setCryptoMined(e.target.value)} style={inputStyle} /></label>
              <div style={{...flexWrap, marginTop: '15px'}}>
                <div style={inputWrap}><label style={{...labelStyle, color: '#aaa'}}>Cost Basis<input type="number" placeholder="$0" value={costBasis} onChange={e => setCostBasis(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={{...labelStyle, color: '#aaa'}}>Sold For<input type="number" placeholder="$0" value={soldFor} onChange={e => setSoldFor(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setCapGainsType('Short')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: capGainsType==='Short'?'#ef4444':'#222', color: capGainsType==='Short'?'#fff':'#888', fontWeight: 'bold' }}>Short Term</button>
                <button onClick={() => setCapGainsType('Long')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: capGainsType==='Long'?'#00cc66':'#222', color: capGainsType==='Long'?'#000':'#888', fontWeight: 'bold' }}>Long Term</button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <>
            <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '20px', fontFamily: 'monospace', fontSize: '1.1em', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#00ffff', textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>Pro-Forma 1040 Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}><span>AGI:</span> <span>{fmt(agi)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', margin: '8px 0' }}><span>[{deductionMethod}]:</span> <span>-{fmt(activeDeduction)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00cc66' }}><span>Total Credits:</span> <span>-{fmt(totalCredits)}</span></div>
              <div style={{ borderBottom: '1px dashed #444', margin: '15px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff4444' }}><span>Fed + Cap Gains:</span> <span>-{fmt(fedTaxAfterCredits)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff4444', margin: '8px 0' }}><span>State Tax:</span> <span>-{fmt(stateIncomeTaxEst)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff4444' }}><span>FICA / SE Tax:</span> <span>-{fmt(seTaxAmount + ficaAmount)}</span></div>
              <div style={{ borderBottom: '1px solid #444', margin: '15px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00cc66', fontWeight: 'bold', fontSize: '1.3em' }}><span>Est. Take-Home:</span> <span>{fmt(netTakeHome)}</span></div>
              <div style={{ textAlign: 'center', marginTop: '15px', color: '#888' }}>Effective Rate: <strong style={{ color: '#fff' }}>{effectiveRate.toFixed(1)}%</strong></div>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '12px', padding: '15px', marginBottom: '20px' }}>
              <h4 style={{ color: '#ef4444', margin: '0 0 10px 0', textAlign: 'center' }}>DISCLAIMER</h4>
              <p style={{ color: '#ef4444', fontSize: '0.8em', margin: 0, textAlign: 'justify', lineHeight: '1.4' }}>This suite organizes estimates based on 2026 data. It is an educational simulator, not an authorized IRS e-file provider. You must export these estimates to a licensed CPA or an authorized filing portal to transmit official returns.</p>
            </div>
          </>
        )}

        {/* --- EXPANDED LAYMAN'S GUIDE ACCORDION (PERSISTENT) --- */}
        <div style={{ background: '#1a1a1a', borderRadius: '12px', border: '1px solid #444', overflow: 'hidden', marginTop: '10px' }}>
          <button onClick={() => setShowGuide(!showGuide)} style={{ width: '100%', padding: '15px', background: '#222', border: 'none', color: '#fff', fontSize: '1.1em', fontWeight: 'bold', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
            📖 The Layman's Tax Guide <span>{showGuide ? '▲' : '▼'}</span>
          </button>
          {showGuide && (
            <div style={{ padding: '20px', color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}>
              
              <h4 style={{ color: '#00cc66', margin: '0 0 5px 0' }}>The "Big Refund" Trap</h4>
              <p style={{ marginBottom: '15px' }}>A massive tax refund isn't a gift from the government; it means you overpaid out of your paycheck all year and gave the IRS an interest-free loan. You can adjust your W-4 with your employer to hold less out of your checks, giving you more take-home pay every week to invest or pay off debt.</p>

              <h4 style={{ color: '#a855f7', margin: '0 0 5px 0' }}>The HSA "Triple-Tax" Cheat Code</h4>
              <p style={{ marginBottom: '15px' }}>If you have a High Deductible Health Plan, a Health Savings Account (HSA) is arguably the greatest tax shelter available. The money goes in tax-free, it can be invested to grow tax-free, and it comes out completely tax-free if used for medical expenses.</p>

              <h4 style={{ color: '#3b82f6', margin: '0 0 5px 0' }}>Solar & Battery Backup Credits</h4>
              <p style={{ marginBottom: '15px' }}>Installing permanent solar panels or massive off-grid home battery systems qualifies for the Residential Clean Energy Credit. You can deduct up to 30% of the total installation and hardware cost directly off your final tax bill (this is a true dollar-for-dollar credit, not just a deduction).</p>

              <h4 style={{ color: '#f59e0b', margin: '0 0 5px 0' }}>Hardware & Home Office Write-Offs</h4>
              <p style={{ marginBottom: '15px' }}>If you build a custom PC rig specifically for AI inference, graphic design, or hashing, and you operate as a registered sole proprietor or LLC, that hardware is a business deduction. Furthermore, if you use a dedicated area of your home <em>exclusively</em> for that business, you can deduct a percentage of your rent, internet, and power.</p>
              
              <h4 style={{ color: '#00ffff', margin: '0 0 5px 0' }}>Automated Audit Red Flags</h4>
              <p style={{ marginBottom: '15px' }}>When writing off business expenses as a 1099 worker, never use perfect "round numbers" (e.g., claiming exactly $1,000 for supplies or exactly $500 for tools), and never claim 100% business use on a personal cell phone or vehicle. The IRS uses automated algorithms to flag these exact anomalies for audits.</p>

              <h4 style={{ color: '#ef4444', margin: '0 0 5px 0' }}>Crypto & "Taxable Events"</h4>
              <p style={{ marginBottom: '15px' }}>Simply buying cryptocurrency and holding it is not taxed. A "Taxable Event" only occurs when you <strong>sell it for fiat cash</strong>, <strong>swap it for another coin</strong> (e.g., trading BTC for Monero), or <strong>buy a physical good</strong> with it. Furthermore, if you <em>mine</em> or <em>hash</em> crypto yourself, the Fair Market Value of the coin on the exact day it hits your wallet is taxed as standard income.</p>

              <h4 style={{ color: '#ef4444', margin: '0 0 5px 0' }}>Short-Term vs. Long-Term Gains</h4>
              <p style={{ marginBottom: '15px' }}>If you buy an asset (stocks, crypto, property) and sell it in under 365 days, your profits are taxed at your standard, expensive income tax bracket. If you hold the asset for exactly 1 year and 1 day, the IRS rewards you with the Long-Term Capital Gains rate, which is significantly cheaper (often 0% or 15% for average earners).</p>

              <h4 style={{ color: '#ef4444', margin: '0 0 5px 0' }}>Loss Harvesting</h4>
              <p style={{ margin: 0 }}>If you sell crypto or stocks at a massive loss, you don't just lose money. The IRS allows you to deduct up to $3,000 of those "realized losses" directly against your regular W-2 paycheck income every single year, lowering your overall tax burden.</p>

            </div>
          )}
        </div>

      </div>

      {/* BOTTOM NAVIGATION WIZARD */}
      <div style={{ display: 'flex', padding: '15px 20px', background: '#111', borderTop: '1px solid #222', gap: '15px' }}>
        <button 
          onClick={prevStep} 
          disabled={step === 1}
          style={{ flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid #444', background: 'transparent', color: step === 1 ? '#444' : '#fff', fontWeight: 'bold' }}>
          Back
        </button>
        <button 
          onClick={nextStep} 
          disabled={step === 4}
          style={{ flex: 2, padding: '15px', borderRadius: '8px', border: 'none', background: step === 4 ? '#222' : '#00cc66', color: step === 4 ? '#555' : '#000', fontWeight: 'bold' }}>
          {step === 4 ? 'Review Complete' : 'Next Step ➔'}
        </button>
      </div>

    </div>
  );
}
