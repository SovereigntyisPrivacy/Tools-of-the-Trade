import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BuilderCalc() {
  const navigate = useNavigate();

  // Construction
  const [sqft, setSqft] = useState('');

  // Vehicle
  const [gallons, setGallons] = useState('');
  const [mpg, setMpg] = useState('');

  const area = parseFloat(sqft) || 0;
  const paintGals = area / 350; // Standard coverage
  const floorBoxes = (area * 1.1) / 20; // 10% waste, 20 sqft per box

  const range = (parseFloat(gallons) || 0) * (parseFloat(mpg) || 0);

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>DIY & Vehicle</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* Construction */}
        <div className="input-card" style={{ borderTop: '4px solid #ffaa00' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>🧱 Material Estimator</h3>
          
          <label>Surface Area (Sq. Ft.)</label>
          <input type="number" placeholder="e.g. 500" value={sqft} onChange={(e) => setSqft(e.target.value)} />

          <div className="result-card" style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', border: 'none', boxShadow: 'none' }}>
            <div className="result-row">
              <span>Paint Needed:</span>
              <span style={{ color: '#00ffff' }}>{Math.ceil(paintGals)} Gallons</span>
            </div>
            <div className="result-row net-pay" style={{ margin: '5px 0 0 0', fontSize: '1.2em' }}>
              <span>Flooring Needed:</span>
              <span style={{ color: '#ffaa00' }}>{Math.ceil(floorBoxes)} Boxes</span>
            </div>
          </div>
        </div>

        {/* Vehicle */}
        <div className="input-card" style={{ borderTop: '4px solid #ff4444' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>🚙 Vehicle Range</h3>
          
          <label>Fuel Tank Capacity (Gallons)</label>
          <input type="number" placeholder="e.g. 18" value={gallons} onChange={(e) => setGallons(e.target.value)} style={{ marginBottom: '15px' }} />
          
          <label>Current Avg. MPG</label>
          <input type="number" placeholder="e.g. 22" value={mpg} onChange={(e) => setMpg(e.target.value)} />

          <div className="result-card" style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', border: 'none', boxShadow: 'none' }}>
            <div className="result-row net-pay" style={{ margin: 0, fontSize: '1.2em' }}>
              <span>Max Operational Range:</span>
              <span style={{ color: '#00cc66' }}>{range.toFixed(0)} Miles</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BuilderCalc;
