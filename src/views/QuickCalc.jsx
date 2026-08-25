import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickCalc() {
  const navigate = useNavigate();
  const [bill, setBill] = useState('');
  const [tax, setTax] = useState('8.7'); // Default to Tucson, AZ
  const [tip, setTip] = useState('20');
  const [split, setSplit] = useState(1);

  const b = parseFloat(bill) || 0;
  const tRate = parseFloat(tax) || 0;
  const tipRate = parseFloat(tip) || 0;

  const taxAmt = b * (tRate / 100);
  const tipAmt = b * (tipRate / 100);
  const total = b + taxAmt + tipAmt;
  const perPerson = total / split;

  const inputStyle = { width: '100%', padding: '15px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.2em', marginTop: '6px', textAlign: 'right' };
  const labelStyle = { color: '#00ffff', fontSize: '0.85em', fontWeight: 'bold', textTransform: 'uppercase' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(10px)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Quick Tax & Tip</h2>
      </header>

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto', paddingBottom: '100px' }}>
        
        {/* BILL AMOUNT */}
        <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Bill / Pre-Tax Amount ($)</label>
            <input 
                type="number" 
                value={bill} 
                onChange={e => setBill(e.target.value)} 
                placeholder="0.00" 
                style={{ ...inputStyle, fontSize: '2em', color: '#00cc66', borderColor: '#00cc66' }} 
            />
        </div>

        {/* STATE TAX PRESETS */}
        <div style={{ marginBottom: '20px', background: 'rgba(17,17,17,0.85)', backdropFilter: 'blur(10px)', padding: '15px', borderRadius: '12px', border: '1px solid #333' }}>
             <label style={{...labelStyle, color: '#aaa', display: 'block', marginBottom: '8px'}}>State Sales Tax Preset</label>
             <select 
                onChange={(e) => setTax(e.target.value)}
                style={{ width: '100%', padding: '12px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '6px', fontSize: '1em', outline: 'none' }}
             >
                <option value="8.7">📍 AZ - Tucson (8.7%)</option>
                <option value="5.6">AZ - State Base (5.6%)</option>
                <option value="4.0">AL (4.0%)</option>
                <option value="0.0">AK (0.0%)</option>
                <option value="6.5">AR (6.5%)</option>
                <option value="7.25">CA (7.25%)</option>
                <option value="2.9">CO (2.9%)</option>
                <option value="6.35">CT (6.35%)</option>
                <option value="0.0">DE (0.0%)</option>
                <option value="6.0">FL (6.0%)</option>
                <option value="4.0">GA (4.0%)</option>
                <option value="4.0">HI (4.0%)</option>
                <option value="6.0">ID (6.0%)</option>
                <option value="6.25">IL (6.25%)</option>
                <option value="7.0">IN (7.0%)</option>
                <option value="6.0">IA (6.0%)</option>
                <option value="6.5">KS (6.5%)</option>
                <option value="6.0">KY (6.0%)</option>
                <option value="4.45">LA (4.45%)</option>
                <option value="5.5">ME (5.5%)</option>
                <option value="6.0">MD (6.0%)</option>
                <option value="6.25">MA (6.25%)</option>
                <option value="6.0">MI (6.0%)</option>
                <option value="6.88">MN (6.88%)</option>
                <option value="7.0">MS (7.0%)</option>
                <option value="4.23">MO (4.23%)</option>
                <option value="0.0">MT (0.0%)</option>
                <option value="5.5">NE (5.5%)</option>
                <option value="6.85">NV (6.85%)</option>
                <option value="0.0">NH (0.0%)</option>
                <option value="6.63">NJ (6.63%)</option>
                <option value="5.13">NM (5.13%)</option>
                <option value="4.0">NY (4.0%)</option>
                <option value="4.75">NC (4.75%)</option>
                <option value="5.0">ND (5.0%)</option>
                <option value="5.75">OH (5.75%)</option>
                <option value="4.5">OK (4.5%)</option>
                <option value="0.0">OR (0.0%)</option>
                <option value="6.0">PA (6.0%)</option>
                <option value="7.0">RI (7.0%)</option>
                <option value="6.0">SC (6.0%)</option>
                <option value="4.5">SD (4.5%)</option>
                <option value="7.0">TN (7.0%)</option>
                <option value="6.25">TX (6.25%)</option>
                <option value="4.7">UT (4.7%)</option>
                <option value="6.0">VT (6.0%)</option>
                <option value="5.3">VA (5.3%)</option>
                <option value="6.5">WA (6.5%)</option>
                <option value="6.0">WV (6.0%)</option>
                <option value="5.0">WI (5.0%)</option>
                <option value="4.0">WY (4.0%)</option>
                <option value="6.0">Washington DC (6.0%)</option>
             </select>
        </div>

        {/* TAX & CUSTOM TIP INPUTS */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
                <label style={labelStyle}>Tax Rate (%)</label>
                <input type="number" step="0.1" value={tax} onChange={e => setTax(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
                <label style={labelStyle}>Custom Tip (%)</label>
                <input type="number" value={tip} onChange={e => setTip(e.target.value)} style={inputStyle} />
            </div>
        </div>

        {/* QUICK TIP BUTTONS */}
        <label style={labelStyle}>Quick Tip</label>
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px', marginBottom: '25px' }}>
            {[15, 18, 20, 25].map(pct => (
                <button 
                    key={pct} 
                    onClick={() => setTip(pct.toString())} 
                    style={{ flex: 1, padding: '12px 0', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1.1em', background: tip === pct.toString() ? '#00cc66' : '#222', color: tip === pct.toString() ? '#000' : '#fff' }}
                >
                    {pct}%
                </button>
            ))}
        </div>

        {/* GRAND TOTAL CARD */}
        <div style={{ background: 'rgba(17,17,17,0.85)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}>
                <span>Subtotal:</span><span>${b.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}>
                <span>Tax ({tRate}%):</span><span>${taxAmt.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed #333' }}>
                <span>Tip ({tipRate}%):</span><span>${tipAmt.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#fff', fontSize: '1.2em' }}>TOTAL:</strong>
                <strong style={{ color: '#00cc66', fontSize: '2.2em' }}>${total.toFixed(2)}</strong>
            </div>
        </div>

        {/* SPLIT THE BILL */}
        <div style={{ background: 'rgba(17,17,17,0.85)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #333', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                <div style={{ color: '#00ffff', fontWeight: 'bold', fontSize: '0.85em', textTransform: 'uppercase' }}>Split Bill</div>
                <div style={{ color: '#888', fontSize: '0.9em' }}>{split} {split === 1 ? 'Person' : 'People'}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => setSplit(Math.max(1, split - 1))} style={{ background: '#222', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '8px', fontSize: '1.5em' }}>-</button>
                <strong style={{ color: '#fff', fontSize: '1.5em', minWidth: '30px', textAlign: 'center' }}>{split}</strong>
                <button onClick={() => setSplit(split + 1)} style={{ background: '#222', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '8px', fontSize: '1.5em' }}>+</button>
            </div>
        </div>

        {split > 1 && (
            <div style={{ textAlign: 'center', marginTop: '15px', padding: '15px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', borderRadius: '8px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '0.9em', textTransform: 'uppercase' }}>Each Person Pays</div>
                <div style={{ color: '#fff', fontSize: '2em', fontWeight: 'bold' }}>${perPerson.toFixed(2)}</div>
            </div>
        )}
      </div>
    </div>
  );
}
