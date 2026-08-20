import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LifestyleCalc() {
  const navigate = useNavigate();

  // --- Recipe & Oven State ---
  const [origYield, setOrigYield] = useState('4');
  const [targetYield, setTargetYield] = useState('10');
  const [tempF, setTempF] = useState('350');
  const [sampleIngredient, setSampleIngredient] = useState('');

  // --- Brine State ---
  const [meatGrams, setMeatGrams] = useState('1500');
  const [waterGrams, setWaterGrams] = useState('1000');
  const [salinity, setSalinity] = useState('1.5');
  const [includeSugar, setIncludeSugar] = useState(false);

  // --- Strength / 1RM State ---
  const [liftWeight, setLiftWeight] = useState('185');
  const [liftReps, setLiftReps] = useState('5');

  // Calculations
  const origYNum = parseFloat(origYield) || 0;
  const targetYNum = parseFloat(targetYield) || 0;
  const multiplier = origYNum > 0 && targetYNum > 0 ? (targetYNum / origYNum) : 0;

  const tempFNum = parseFloat(tempF) || 0;
  const tempC = tempF ? ((tempFNum - 32) * (5 / 9)).toFixed(1) : '0.0';
  const tempFanC = tempF ? (((tempFNum - 32) * (5 / 9)) - 20).toFixed(1) : '0.0';

  const scaledSample = (parseFloat(sampleIngredient) || 0) * multiplier;

  const totalMass = (parseFloat(meatGrams) || 0) + (parseFloat(waterGrams) || 0);
  const saltRequired = ((totalMass * (parseFloat(salinity) || 0)) / 100).toFixed(1);
  const approxSaltTbsp = (parseFloat(saltRequired) / 17).toFixed(1);
  const sugarRequired = includeSugar ? ((totalMass * 0.75) / 100).toFixed(1) : null;

  const weightNum = parseFloat(liftWeight) || 0;
  const repsNum = parseFloat(liftReps) || 0;
  const oneRepMax = repsNum > 0 && weightNum > 0 
    ? Math.round(weightNum * (1 + repsNum / 30)) 
    : 0;

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Lifestyle & Field Health</h2>
      </header>

      <div className="calc-content" style={{ padding: '16px', overflowY: 'auto', height: '100%', paddingBottom: '140px' }}>

        {/* --- Card 1: Recipe Scaling & Oven Intel --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #00e5ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🍳 Recipe Scaler & Oven Intel
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: 'bold' }}>Original Servings</label>
              <input 
                type="number" 
                value={origYield} 
                onChange={(e) => setOrigYield(e.target.value)} 
                style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '4px' }}
              />
            </div>
            <div>
              <label style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: 'bold' }}>Target Servings</label>
              <input 
                type="number" 
                value={targetYield} 
                onChange={(e) => setTargetYield(e.target.value)} 
                style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '4px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Oven Temperature (°F)</label>
            <input 
              type="number" 
              value={tempF} 
              onChange={(e) => setTempF(e.target.value)} 
              style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '4px' }}
            />
          </div>

          {/* Scaler / Temp Outputs */}
          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '12px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#aaa' }}>Batch Multiplier:</span>
              <span style={{ color: '#00e5ff', fontWeight: 'bold', fontSize: '1.1rem' }}>{multiplier.toFixed(2)}x</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#aaa' }}>Conventional Oven:</span>
              <span style={{ color: '#ffb703', fontWeight: 'bold' }}>{tempC}°C</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#aaa' }}>Fan / Convection Oven:</span>
              <span style={{ color: '#fb8500', fontWeight: 'bold' }}>{tempFanC}°C</span>
            </div>
          </div>

          {/* Quick Ingredient Scaler */}
          <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '12px' }}>
            <label style={{ color: '#888', fontSize: '0.75rem' }}>Quick Ingredient Scaler (Enter any single amount):</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
              <input 
                type="number" 
                placeholder="e.g. 2 (cups/oz/g)" 
                value={sampleIngredient} 
                onChange={(e) => setSampleIngredient(e.target.value)} 
                style={{ flex: 1, background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '8px', borderRadius: '6px' }}
              />
              <span style={{ color: '#666' }}>→</span>
              <div style={{ flex: 1, background: '#121212', border: '1px solid #222', padding: '8px', borderRadius: '6px', color: '#00e5ff', fontWeight: 'bold', textAlign: 'center' }}>
                {scaledSample ? scaledSample.toFixed(2) : '--'}
              </div>
            </div>
          </div>
        </div>

        {/* --- Card 2: Equilibrium Brine Suite --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #fb8500', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🥩 Equilibrium Brining (Zero-Mistake Salting)
          </h3>
          <p style={{ color: '#888', fontSize: '0.75rem', margin: '0 0 14px 0', lineHeight: '1.3' }}>
            Standard brining can easily over-salt meat if left too long. Equilibrium brining calculates total water + meat mass so the meat reaches a target salinity and stops absorbing.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#fb8500', fontSize: '0.8rem', fontWeight: 'bold' }}>Meat Mass (grams)</label>
              <input 
                type="number" 
                value={meatGrams} 
                onChange={(e) => setMeatGrams(e.target.value)} 
                style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '4px' }}
              />
            </div>
            <div>
              <label style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: 'bold' }}>Water / Liquid (grams/ml)</label>
              <input 
                type="number" 
                value={waterGrams} 
                onChange={(e) => setWaterGrams(e.target.value)} 
                style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '4px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Target Profile</label>
            <select 
              value={salinity} 
              onChange={(e) => setSalinity(e.target.value)} 
              style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '4px' }}
            >
              <option value="1.25">1.25% - Mild / Subtle (Fish, Poultry Breast)</option>
              <option value="1.50">1.50% - Standard Optimal (Pork Chops, Bone-in Chicken)</option>
              <option value="1.80">1.80% - Bold / Savory (Roasts, Thick Beef Cuts)</option>
              <option value="2.25">2.25% - Cured / Jerky Profile</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <input 
              type="checkbox" 
              id="sugarCheck" 
              checked={includeSugar} 
              onChange={(e) => setIncludeSugar(e.target.checked)} 
            />
            <label htmlFor="sugarCheck" style={{ color: '#ccc', fontSize: '0.8rem' }}>Add balancing sweetness (+0.75% Sugar/Honey)</label>
          </div>

          {/* Brine Output Card */}
          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ color: '#aaa' }}>Required Kosher Salt:</span>
              <span style={{ color: '#00e5ff', fontWeight: 'bold', fontSize: '1.2rem' }}>{saltRequired}g</span>
            </div>
            <div style={{ color: '#666', fontSize: '0.75rem', textAlign: 'right', marginBottom: '8px' }}>
              ≈ {approxSaltTbsp} level tablespoons (Diamond Crystal equivalent)
            </div>

            {includeSugar && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #222', paddingTop: '8px' }}>
                <span style={{ color: '#aaa' }}>Required Sugar / Honey:</span>
                <span style={{ color: '#ffb703', fontWeight: 'bold' }}>{sugarRequired}g</span>
              </div>
            )}
          </div>
        </div>

        {/* --- Card 3: Meat Done-ness & Pull Temps (Field Guide) --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1.1rem' }}>
            🌡️ Internal Pull Temperatures
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem' }}>
            <div style={{ background: '#0a0a0a', padding: '10px', borderRadius: '6px', border: '1px solid #222' }}>
              <div style={{ color: '#00cc66', fontWeight: 'bold' }}>Poultry (Dark/Bone-in)</div>
              <div style={{ color: '#fff', marginTop: '2px' }}>Pull: 170°F - 175°F</div>
              <div style={{ color: '#666', fontSize: '0.7rem' }}>Collagens break down</div>
            </div>
            <div style={{ background: '#0a0a0a', padding: '10px', borderRadius: '6px', border: '1px solid #222' }}>
              <div style={{ color: '#00cc66', fontWeight: 'bold' }}>Poultry (Breast)</div>
              <div style={{ color: '#fff', marginTop: '2px' }}>Pull: 155°F (Rest to 165°F)</div>
              <div style={{ color: '#666', fontSize: '0.7rem' }}>Juicy, tender finish</div>
            </div>
            <div style={{ background: '#0a0a0a', padding: '10px', borderRadius: '6px', border: '1px solid #222' }}>
              <div style={{ color: '#00cc66', fontWeight: 'bold' }}>Pork Loin / Chops</div>
              <div style={{ color: '#fff', marginTop: '2px' }}>Pull: 140°F (Rest to 145°F)</div>
              <div style={{ color: '#666', fontSize: '0.7rem' }}>Slight blush pink</div>
            </div>
            <div style={{ background: '#0a0a0a', padding: '10px', borderRadius: '6px', border: '1px solid #222' }}>
              <div style={{ color: '#00cc66', fontWeight: 'bold' }}>Beef (Med-Rare)</div>
              <div style={{ color: '#fff', marginTop: '2px' }}>Pull: 125°F (Rest to 135°F)</div>
              <div style={{ color: '#666', fontSize: '0.7rem' }}>Peak tenderness</div>
            </div>
          </div>
        </div>

        {/* --- Card 4: Strength & Kinetic Load --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #d00000', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🏋️ Strength & 1RM Load Estimator
          </h3>
          <p style={{ color: '#888', fontSize: '0.75rem', margin: '0 0 14px 0' }}>
            Estimates your theoretical maximum single effort (1RM) using the Epley formula to help calibrate working sets.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#d00000', fontSize: '0.8rem', fontWeight: 'bold' }}>Weight Lifted (lbs)</label>
              <input 
                type="number" 
                value={liftWeight} 
                onChange={(e) => setLiftWeight(e.target.value)} 
                style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '4px' }}
              />
            </div>
            <div>
              <label style={{ color: '#d00000', fontSize: '0.8rem', fontWeight: 'bold' }}>Completed Reps</label>
              <input 
                type="number" 
                value={liftReps} 
                onChange={(e) => setLiftReps(e.target.value)} 
                style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '4px' }}
              />
            </div>
          </div>

          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: '#aaa' }}>Estimated 1-Rep Max:</span>
              <span style={{ color: '#d00000', fontWeight: 'bold', fontSize: '1.2rem' }}>{oneRepMax} lbs</span>
            </div>

            <div style={{ borderTop: '1px solid #222', paddingTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', fontSize: '0.75rem' }}>
              <div>
                <div style={{ color: '#888' }}>Heavy (90%)</div>
                <div style={{ color: '#fff', fontWeight: 'bold', marginTop: '2px' }}>{Math.round(oneRepMax * 0.9)} lbs</div>
              </div>
              <div>
                <div style={{ color: '#888' }}>Volume (80%)</div>
                <div style={{ color: '#fff', fontWeight: 'bold', marginTop: '2px' }}>{Math.round(oneRepMax * 0.8)} lbs</div>
              </div>
              <div>
                <div style={{ color: '#888' }}>Stamina (70%)</div>
                <div style={{ color: '#fff', fontWeight: 'bold', marginTop: '2px' }}>{Math.round(oneRepMax * 0.7)} lbs</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LifestyleCalc;
