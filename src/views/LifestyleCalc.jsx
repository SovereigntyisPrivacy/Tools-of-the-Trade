import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LifestyleCalc() {
  const navigate = useNavigate();

  // Culinary
  const [baseYield, setBaseYield] = useState('');
  const [targetYield, setTargetYield] = useState('');
  const [tempF, setTempF] = useState('');

  // Fitness (1RM Epley Formula)
  const [liftWeight, setLiftWeight] = useState('');
  const [liftReps, setLiftReps] = useState('');

  const multiplier = (parseFloat(targetYield) || 0) / (parseFloat(baseYield) || 1);
  const tempC = tempF ? ((parseFloat(tempF) - 32) * 5/9).toFixed(1) : '0.0';

  const w = parseFloat(liftWeight) || 0;
  const r = parseFloat(liftReps) || 0;
  const oneRepMax = r > 1 ? w * (1 + (r / 30)) : w;

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Lifestyle & Health</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* Culinary */}
        <div className="input-card" style={{ borderTop: '4px solid #00ffff' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>🍳 Culinary & Recipe</h3>
          
          <label>Recipe Original Yield (Servings)</label>
          <input type="number" placeholder="e.g. 4" value={baseYield} onChange={(e) => setBaseYield(e.target.value)} style={{ marginBottom: '15px' }} />
          
          <label>Target Yield (Servings)</label>
          <input type="number" placeholder="e.g. 10" value={targetYield} onChange={(e) => setTargetYield(e.target.value)} style={{ marginBottom: '15px' }} />

          <label>Oven Temp (°F to °C)</label>
          <input type="number" placeholder="e.g. 350" value={tempF} onChange={(e) => setTempF(e.target.value)} />

          <div className="result-card" style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', border: 'none', boxShadow: 'none' }}>
            <div className="result-row">
              <span>Ingredient Multiplier:</span>
              <span style={{ color: '#00ffff' }}>Multiply all by {multiplier ? multiplier.toFixed(2) : 0}x</span>
            </div>
            <div className="result-row net-pay" style={{ margin: '5px 0 0 0', fontSize: '1.2em' }}>
              <span>Celsius:</span>
              <span style={{ color: '#ffaa00' }}>{tempC}°C</span>
            </div>
          </div>
        </div>

        {/* Fitness */}
        <div className="input-card" style={{ borderTop: '4px solid #ff4444' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>🏋️ Kinetic Strength (1RM)</h3>
          
          <label>Weight Lifted (lbs)</label>
          <input type="number" placeholder="e.g. 225" value={liftWeight} onChange={(e) => setLiftWeight(e.target.value)} style={{ marginBottom: '15px' }} />
          
          <label>Reps Completed</label>
          <input type="number" placeholder="e.g. 5" value={liftReps} onChange={(e) => setLiftReps(e.target.value)} />

          <div className="result-card" style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', border: 'none', boxShadow: 'none' }}>
            <div className="result-row net-pay" style={{ margin: 0, fontSize: '1.2em' }}>
              <span>Estimated 1-Rep Max:</span>
              <span style={{ color: '#00cc66' }}>{oneRepMax.toFixed(0)} lbs</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LifestyleCalc;
