import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickCalc() {
  const navigate = useNavigate();
  const [bill, setBill] = useState('');
  const [tax, setTax] = useState('8.7');
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
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Quick Tax & Tip</h2>
      </header>

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto', paddingBottom: '100px' }}>
        
        {/* Bill Amount */}
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

        {/* Tax & Custom Tip Inputs */}
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

        {/* Quick Tip Buttons */}
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

        {/* Grand Total Card */}
        <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}>
            <span>Subtotal:</span> <span>${b.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}>
            <span>Tax ({tRate}%):</span> <span>${taxAmt.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed #333' }}>
            <span>Tip ({tipRate}%):</span> <span>${tipAmt.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ color: '#fff', fontSize: '1.2em' }}>TOTAL:</strong>
            <strong style={{ color: '#fff', fontSize: '2.2em' }}>${total.toFixed(2)}</strong>
          </div>
        </div>

        {/* Split the Bill */}
        <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
