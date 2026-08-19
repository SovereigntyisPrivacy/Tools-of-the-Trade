import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LifestyleCalc() {
  const navigate = useNavigate();

  // 1. Base Scaling & Temp
  const [oldYield, setOldYield] = useState('');
  const [newYield, setNewYield] = useState('');
  const [fTemp, setFTemp] = useState('');

  // 2. Equilibrium Brine & Marinade
  const [meatWeight, setMeatWeight] = useState('1500'); // grams
  const [liquidWeight, setLiquidWeight] = useState('1000'); // grams
  const [saltTarget, setSaltTarget] = useState('1.5'); // %

  // 3. Baker's Percentages
  const [flour, setFlour] = useState('1000'); // grams
  const [hydration, setHydration] = useState('70'); // %
  const [saltPercent, setSaltPercent] = useState('2'); // %
  const [yeastPercent, setYeastPercent] = useState('1'); // %

  // 4. Kinetic Strength (1RM & Programming)
  const [liftWeight, setLiftWeight] = useState('225');
  const [liftReps, setLiftReps] = useState('5');

  // --- Calculations ---

  // 1. Base
  const multiplier = (oldYield && newYield) ? (parseFloat(newYield) / parseFloat(oldYield)).toFixed(2) : '0.00';
  const cTemp = fTemp ? ((parseFloat(fTemp) - 32) * 5 / 9).toFixed(1) : '0.0';

  // 2. Equilibrium Brine
  let totalMass = 0;
  let requiredSalt = 0;
  if (meatWeight && liquidWeight && saltTarget) {
    totalMass = parseFloat(meatWeight) + parseFloat(liquidWeight);
    requiredSalt = (totalMass * (parseFloat(saltTarget) / 100)).toFixed(1);
  }

  // 3. Baker's Math
  let waterW = 0, saltW = 0, yeastW = 0, doughTotal = 0;
  if (flour && hydration && saltPercent && yeastPercent) {
    const f = parseFloat(flour);
    waterW = (f * (parseFloat(hydration) / 100)).toFixed(0);
    saltW = (f * (parseFloat(saltPercent) / 100)).toFixed(1);
    yeastW = (f * (parseFloat(yeastPercent) / 100)).toFixed(1);
    doughTotal = (f + parseFloat(waterW) + parseFloat(saltW) + parseFloat(yeastW)).toFixed(0);
  }

  // 4. Kinetic Strength (Epley Formula)
  let oneRepMax = 0, p90 = 0, p80 = 0, p70 = 0;
  if (liftWeight && liftReps) {
    const w = parseFloat(liftWeight);
    const r = parseFloat(liftReps);
    if (r === 1) {
      oneRepMax = w;
    } else if (r > 1) {
      oneRepMax = w * (1 + (r / 30));
    }
    p90 = (oneRepMax * 0.90).toFixed(0);
    p80 = (oneRepMax * 0.80).toFixed(0);
    p70 = (oneRepMax * 0.70).toFixed(0);
  }

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Lifestyle & Health</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* 1. Base Scaling */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00ffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🍳 Recipe Scaling & Temp</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px' }}>Original Yield</label>
              <input type="number" placeholder="e.g. 4" value={oldYield} onChange={e => setOldYield(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Target Yield</label>
              <input type="number" placeholder="e.g. 10" value={newYield} onChange={e => setNewYield(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>
          
          <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Oven Temp (°F)</label>
          <input type="number" placeholder="e.g. 350" value={fTemp} onChange={e => setFTemp(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}>
              <span style={{ color: '#aaa' }}>Ingredient Multiplier:</span>
              <span style={{ color: '#00ffff', fontWeight: 'bold' }}>{multiplier}x</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', paddingTop: '8px', borderTop: '1px dashed #333' }}>
              <span style={{ color: '#aaa' }}>Celsius:</span>
              <span style={{ color: '#ffaa00', fontWeight: 'bold' }}>{cTemp}°C</span>
            </div>
          </div>
        </div>

        {/* 2. Equilibrium Brine / Marinade */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #cc6600', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🥩 Equilibrium Brine Engine</h3>
          <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}>Calculates total salt mass based on the combined weight of the meat and liquid. Prevents over-salting during long marinades.</p>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#cc6600', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Meat Wt (grams)</label>
              <input type="number" placeholder="1500" value={meatWeight} onChange={e => setMeatWeight(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Liquid Wt (grams)</label>
              <input type="number" placeholder="1000" value={liquidWeight} onChange={e => setLiquidWeight(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Target Salt Concentration (%)</label>
          <select value={saltTarget} onChange={e => setSaltTarget(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px' }}>
            <option value="1.0">1.0% (Light Poultry / Seafood)</option>
            <option value="1.5">1.5% (Standard Pork / Chicken)</option>
            <option value="2.0">2.0% (Heavy Beef / Curing)</option>
          </select>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Required Salt:</span>
            <span style={{ color: '#00cc66', fontWeight: 'bold' }}>{requiredSalt} grams</span>
          </div>
        </div>

        {/* 3. Baker's Math */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ffaa00', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🍞 Professional Baker's Math</h3>
          
          <label style={{ display: 'block', color: '#ffaa00', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '4px' }}>Total Flour Weight (grams)</label>
          <input type="number" placeholder="1000" value={flour} onChange={e => setFlour(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px' }} />

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px' }}>Hydration (%)</label>
              <input type="number" placeholder="70" value={hydration} onChange={e => setHydration(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Salt (%)</label>
              <input type="number" placeholder="2" value={saltPercent} onChange={e => setSaltPercent(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Yeast (%)</label>
              <input type="number" placeholder="1" value={yeastPercent} onChange={e => setYeastPercent(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Water:</span><span style={{ color: '#00ffff', fontWeight: 'bold' }}>{waterW} g</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Salt:</span><span style={{ color: '#fff', fontWeight: 'bold' }}>{saltW} g</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Yeast:</span><span style={{ color: '#ffaa00', fontWeight: 'bold' }}>{yeastW} g</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', paddingTop: '8px', borderTop: '1px dashed #333' }}><span style={{ color: '#aaa' }}>Total Dough Yield:</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{doughTotal} g</span></div>
          </div>
        </div>

        {/* 4. Kinetic Strength */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ff4444', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🏋️ Kinetic Strength (1RM)</h3>
          <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}>Calculates true 1-Rep Max via the Epley formula for barbell and heavy implement lifting.</p>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Weight Lifted (lbs/kg)</label>
              <input type="number" placeholder="225" value={liftWeight} onChange={e => setLiftWeight(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#ff4444', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Reps</label>
              <input type="number" placeholder="5" value={liftReps} onChange={e => setLiftReps(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3em', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #333' }}>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>Est. 1-Rep Max:</span>
              <span style={{ color: '#ff4444', fontWeight: 'bold' }}>{oneRepMax > 0 ? oneRepMax.toFixed(0) : '0'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1em' }}><span style={{ color: '#aaa' }}>90% Load (Heavy Double):</span><span style={{ color: '#00ffff', fontWeight: 'bold' }}>{p90}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1em' }}><span style={{ color: '#aaa' }}>80% Load (5x5 Working):</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{p80}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1em' }}><span style={{ color: '#aaa' }}>70% Load (Volume/Speed):</span><span style={{ color: '#ffaa00', fontWeight: 'bold' }}>{p70}</span></div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LifestyleCalc;
