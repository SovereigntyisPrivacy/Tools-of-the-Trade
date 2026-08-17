import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ElectricCalc() {
  const navigate = useNavigate();

  // Breaker Check (Find Amps)
  const [watts1, setWatts1] = useState('');
  const [volts1, setVolts1] = useState('120'); // Standard US outlet
  const calculatedAmps = (parseFloat(watts1) || 0) / (parseFloat(volts1) || 1);

  // Total Load (Find Watts)
  const [amps2, setAmps2] = useState('');
  const [volts2, setVolts2] = useState('120');
  const calculatedWatts = (parseFloat(amps2) || 0) * (parseFloat(volts2) || 0);

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Electrical Load</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* Find Amperage (Breaker Check) */}
        <div className="input-card" style={{ borderTop: '4px solid #ff4444' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>🔌 Amperage Draw (Breaker Check)</h3>
          
          <label>Device Wattage (W)</label>
          <input type="number" placeholder="e.g. 1500" value={watts1} onChange={(e) => setWatts1(e.target.value)} />

          <label>Circuit Voltage (V)</label>
          <input type="number" placeholder="120" value={volts1} onChange={(e) => setVolts1(e.target.value)} />

          <div className="result-card" style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', border: 'none', boxShadow: 'none' }}>
            <div className="result-row net-pay" style={{ margin: 0, fontSize: '1.2em' }}>
              <span>Current Draw:</span>
              <span style={{ color: '#ff4444' }}>{calculatedAmps.toFixed(2)} Amps</span>
            </div>
          </div>
        </div>

        {/* Find Wattage (Total Power) */}
        <div className="input-card" style={{ borderTop: '4px solid #00ffff' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>⚡ Total Power Load (Wattage)</h3>
          
          <label>Device Current (Amps)</label>
          <input type="number" placeholder="e.g. 15" value={amps2} onChange={(e) => setAmps2(e.target.value)} />

          <label>Circuit Voltage (V)</label>
          <input type="number" placeholder="120" value={volts2} onChange={(e) => setVolts2(e.target.value)} />

          <div className="result-card" style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', border: 'none', boxShadow: 'none' }}>
             <div className="result-row net-pay" style={{ margin: 0, fontSize: '1.2em' }}>
              <span>Power Used:</span>
              <span style={{ color: '#00cc66' }}>{calculatedWatts.toFixed(0)} Watts</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ElectricCalc;
