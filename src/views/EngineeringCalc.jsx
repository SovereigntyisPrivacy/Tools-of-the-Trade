import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EngineeringCalc() {
  const navigate = useNavigate();

  // Torque & Leverage
  const [force, setForce] = useState('');
  const [leverLength, setLeverLength] = useState('5'); // Default to a 5ft bar
  const [angle, setAngle] = useState('90');

  // Volume & Weight
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [density, setDensity] = useState('490'); // Default to Steel (lb/ft^3)

  // --- Leverage Math ---
  const numForce = parseFloat(force) || 0;
  const numLever = parseFloat(leverLength) || 0;
  const numAngle = parseFloat(angle) || 90;
  
  // Torque (ft-lbs) = r * F * sin(theta)
  const angleInRadians = numAngle * (Math.PI / 180);
  const calculatedTorque = numLever * numForce * Math.sin(angleInRadians);
  const mechanicalAdvantage = numForce > 0 ? calculatedTorque / numForce : 0;

  // --- Volume & Weight Math ---
  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const h = parseFloat(height) || 0;
  const d = parseFloat(density) || 0;

  const volumeCuFt = l * w * h;
  const totalWeightLbs = volumeCuFt * d;

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Engineering</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* Torque & Leverage */}
        <div className="input-card" style={{ borderTop: '4px solid #ffaa00' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>🔧 Torque & Leverage</h3>
          
          <label>Applied Force (lbs)</label>
          <input type="number" placeholder="e.g. 150" value={force} onChange={(e) => setForce(e.target.value)} style={{ marginBottom: '15px' }} />

          <label>Lever Arm Length (ft)</label>
          <input type="number" value={leverLength} onChange={(e) => setLeverLength(e.target.value)} style={{ marginBottom: '15px' }} />

          <label>Angle of Force (Degrees)</label>
          <input type="number" value={angle} onChange={(e) => setAngle(e.target.value)} />

          <div className="result-card" style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', border: 'none', boxShadow: 'none' }}>
            <div className="result-row">
              <span>Mech. Advantage:</span>
              <span style={{ color: '#00ffff' }}>{mechanicalAdvantage.toFixed(2)}x</span>
            </div>
            <div className="result-row net-pay" style={{ margin: '5px 0 0 0', fontSize: '1.2em' }}>
              <span>Torque Generated:</span>
              <span style={{ color: '#ffaa00' }}>{calculatedTorque.toFixed(0)} ft-lbs</span>
            </div>
          </div>
        </div>

        {/* Volume & Weight */}
        <div className="input-card" style={{ borderTop: '4px solid #00ffff' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>📦 Material Weight Limits</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label>L (ft)</label>
              <input type="number" placeholder="0" value={length} onChange={(e) => setLength(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label>W (ft)</label>
              <input type="number" placeholder="0" value={width} onChange={(e) => setWidth(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label>H (ft)</label>
              <input type="number" placeholder="0" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
          </div>

          <label>Material Density (lbs/ft³)</label>
          <input type="number" value={density} onChange={(e) => setDensity(e.target.value)} />

          <div className="result-card" style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', border: 'none', boxShadow: 'none' }}>
             <div className="result-row">
              <span>Total Volume:</span>
              <span>{volumeCuFt.toFixed(2)} ft³</span>
            </div>
             <div className="result-row net-pay" style={{ margin: '5px 0 0 0', fontSize: '1.2em' }}>
              <span>Est. Weight:</span>
              <span style={{ color: '#00cc66' }}>{totalWeightLbs.toFixed(0)} lbs</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default EngineeringCalc;
