import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NuclearCalc() {
  const navigate = useNavigate();

  // Half-Life State
  const [initialQty, setInitialQty] = useState('');
  const [halfLife, setHalfLife] = useState('');
  const [timeElapsed, setTimeElapsed] = useState('');

  // Shielding State
  const [initialRad, setInitialRad] = useState('');
  const [hvl, setHvl] = useState('');
  const [thickness, setThickness] = useState('');

  // --- Half-Life Math ---
  const n0 = parseFloat(initialQty) || 0;
  const tHalf = parseFloat(halfLife) || 1;
  const t = parseFloat(timeElapsed) || 0;
  const remainingQty = n0 * Math.pow(0.5, t / tHalf);

  // --- Shielding Math ---
  const i0 = parseFloat(initialRad) || 0;
  const hvlVal = parseFloat(hvl) || 1;
  const x = parseFloat(thickness) || 0;
  const remainingRad = i0 * Math.pow(0.5, x / hvlVal);

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Nuclear Decay</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '80px' }}>
        
        {/* Isotope Half-Life */}
        <div className="input-card" style={{ borderTop: '4px solid #ffaa00' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>☢️ Isotope Half-Life</h3>
          
          <label>Initial Quantity (Mass / Activity)</label>
          <input type="number" placeholder="e.g. 100" value={initialQty} onChange={(e) => setInitialQty(e.target.value)} style={{ marginBottom: '15px' }} />

          <label>Half-Life Duration</label>
          <input type="number" placeholder="e.g. 5.27" value={halfLife} onChange={(e) => setHalfLife(e.target.value)} style={{ marginBottom: '15px' }} />

          <label>Time Elapsed</label>
          <input type="number" placeholder="Must match half-life unit" value={timeElapsed} onChange={(e) => setTimeElapsed(e.target.value)} />

          <div className="result-card" style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', border: 'none', boxShadow: 'none' }}>
            <div className="result-row net-pay" style={{ margin: 0, fontSize: '1.2em' }}>
              <span>Remaining:</span>
              <span style={{ color: '#ffaa00' }}>{remainingQty.toFixed(4)}</span>
            </div>
          </div>
        </div>

        {/* Radiation Shielding */}
        <div className="input-card" style={{ borderTop: '4px solid #00ffff' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>🛡️ Radiation Shielding (HVL)</h3>
          
          <label>Initial Radiation Intensity</label>
          <input type="number" placeholder="e.g. 500 mR/hr" value={initialRad} onChange={(e) => setInitialRad(e.target.value)} style={{ marginBottom: '15px' }} />

          <label>Material Half-Value Layer (HVL)</label>
          <input type="number" placeholder="e.g. 0.4 (inches of Lead)" value={hvl} onChange={(e) => setHvl(e.target.value)} style={{ marginBottom: '15px' }} />

          <label>Shield Thickness</label>
          <input type="number" placeholder="Must match HVL unit" value={thickness} onChange={(e) => setThickness(e.target.value)} />

          <div className="result-card" style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', border: 'none', boxShadow: 'none' }}>
            <div className="result-row net-pay" style={{ margin: 0, fontSize: '1.2em' }}>
              <span>Transmitted Dose:</span>
              <span style={{ color: '#00cc66' }}>{remainingRad.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default NuclearCalc;
