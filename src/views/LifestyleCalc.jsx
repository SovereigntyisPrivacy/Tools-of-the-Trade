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

  // --- Baker's Percentages State ---
  const [flourGrams, setFlourGrams] = useState('1000');
  const [waterPct, setWaterPct] = useState('70');
  const [saltPct, setSaltPct] = useState('2');
  const [yeastPct, setYeastPct] = useState('1');

  // --- Strength / 1RM State ---
  const [liftWeight, setLiftWeight] = useState('225');
  const [liftReps, setLiftReps] = useState('5');

  // --- Metabolic & Hydration State ---
  const [bodyWeight, setBodyWeight] = useState('185');
  const [heightInches, setHeightInches] = useState('71');
  const [ageYears, setAgeYears] = useState('30');
  const [gender, setGender] = useState('M');
  const [activityLevel, setActivityLevel] = useState('1.55');

  // --- Circadian Shift State ---
  const [wakeTime, setWakeTime] = useState('');

  // --- CALCULATIONS ---
  
  // Recipe
  const origYNum = parseFloat(origYield) || 0;
  const targetYNum = parseFloat(targetYield) || 0;
  const multiplier = origYNum > 0 && targetYNum > 0 ? (targetYNum / origYNum) : 0;
  const tempFNum = parseFloat(tempF) || 0;
  const tempC = tempF ? ((tempFNum - 32) * (5 / 9)).toFixed(1) : '0.0';
  const tempFanC = tempF ? (((tempFNum - 32) * (5 / 9)) - 20).toFixed(1) : '0.0';
  const scaledSample = (parseFloat(sampleIngredient) || 0) * multiplier;

  // Brine
  const totalMass = (parseFloat(meatGrams) || 0) + (parseFloat(waterGrams) || 0);
  const saltRequired = ((totalMass * (parseFloat(salinity) || 0)) / 100).toFixed(1);
  const approxSaltTbsp = (parseFloat(saltRequired) / 17).toFixed(1);
  const sugarRequired = includeSugar ? ((totalMass * 0.75) / 100).toFixed(1) : null;

  // Baker's Math
  const fGrams = parseFloat(flourGrams) || 0;
  const wGrams = (fGrams * (parseFloat(waterPct) || 0) / 100).toFixed(1);
  const sGrams = (fGrams * (parseFloat(saltPct) || 0) / 100).toFixed(1);
  const yGrams = (fGrams * (parseFloat(yeastPct) || 0) / 100).toFixed(1);
  const totalDough = (fGrams + parseFloat(wGrams) + parseFloat(sGrams) + parseFloat(yGrams)).toFixed(1);

  // Strength
  const weightNum = parseFloat(liftWeight) || 0;
  const repsNum = parseFloat(liftReps) || 0;
  const oneRepMax = repsNum > 0 && weightNum > 0 ? Math.round(weightNum * (1 + repsNum / 30)) : 0;

  // Metabolic
  const wKg = (parseFloat(bodyWeight) || 0) / 2.205;
  const hCm = (parseFloat(heightInches) || 0) * 2.54;
  const aYrs = parseFloat(ageYears) || 0;
  let bmr = 0;
  if (wKg && hCm && aYrs) {
    bmr = (10 * wKg) + (6.25 * hCm) - (5 * aYrs);
    bmr += gender === 'M' ? 5 : -161;
  }
  const tdee = Math.round(bmr * parseFloat(activityLevel || 1.2));
  const waterOz = Math.round((parseFloat(bodyWeight) || 0) * 0.5);

  // Circadian
  const calculateSleepTimes = (wake) => {
    if(!wake) return [];
    const [h, m] = wake.split(':').map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(h, m, 0, 0);
    // 6 cycles (9h), 5 cycles (7.5h), 4 cycles (6h), 3 cycles (4.5h) + 15m fall asleep
    const cycles = [6, 5, 4, 3]; 
    return cycles.map(c => {
      const sleepTime = new Date(wakeDate.getTime() - (c * 90 * 60000) - (15 * 60000));
      return {
        time: sleepTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        hours: (c * 90) / 60
      };
    });
  };
  const sleepTimes = calculateSleepTimes(wakeTime);

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Lifestyle & Health</h2>
      </header>

      {/* Reduced paddingBottom to 20px so the AdMob banner overlaps intentionally */}
      <div className="calc-content" style={{ padding: '16px', overflowY: 'auto', height: '100%', paddingBottom: '20px' }}>

        {/* --- Card 1: Recipe Scaling & Oven Intel --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #00e5ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>🍳 Recipe Scaler & Temp</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: 'bold' }}>Original Yield</label>
              <input type="number" value={origYield} onChange={(e) => setOrigYield(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: 'bold' }}>Target Yield</label>
              <input type="number" value={targetYield} onChange={(e) => setTargetYield(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Oven Temp (°F)</label>
            <input type="number" value={tempF} onChange={(e) => setTempF(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
          </div>
          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '12px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#aaa' }}>Multiplier:</span><span style={{ color: '#00e5ff', fontWeight: 'bold' }}>{multiplier.toFixed(2)}x</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#aaa' }}>Celsius (Standard):</span><span style={{ color: '#ffb703', fontWeight: 'bold' }}>{tempC}°C</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#aaa' }}>Celsius (Fan/Convection):</span><span style={{ color: '#fb8500', fontWeight: 'bold' }}>{tempFanC}°C</span>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '12px' }}>
            <label style={{ color: '#888', fontSize: '0.75rem' }}>Quick Ingredient Scaler (Type any amount):</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <input type="number" placeholder="e.g. 2" value={sampleIngredient} onChange={(e) => setSampleIngredient(e.target.value)} style={{ flex: 1, background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '8px', borderRadius: '6px' }} />
              <div style={{ flex: 1, background: '#121212', border: '1px solid #222', padding: '8px', borderRadius: '6px', color: '#00e5ff', fontWeight: 'bold', textAlign: 'center' }}>
                {scaledSample ? scaledSample.toFixed(2) : '--'}
              </div>
            </div>
          </div>
        </div>

        {/* --- Card 2: Equilibrium Brine --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #fb8500', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1.1rem' }}>🥩 Equilibrium Brine</h3>
          <p style={{ color: '#888', fontSize: '0.75rem', margin: '0 0 14px 0' }}>Zero-mistake salting. Meat will stop absorbing exactly at the target percentage.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#fb8500', fontSize: '0.8rem', fontWeight: 'bold' }}>Meat (grams)</label>
              <input type="number" value={meatGrams} onChange={(e) => setMeatGrams(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: 'bold' }}>Liquid (grams)</label>
              <input type="number" value={waterGrams} onChange={(e) => setWaterGrams(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <select value={salinity} onChange={(e) => setSalinity(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }}>
              <option value="1.25">1.25% (Mild - Fish, Poultry Breast)</option>
              <option value="1.50">1.5% (Standard Pork / Chicken)</option>
              <option value="1.80">1.8% (Bold - Thick Beef Roasts)</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <input type="checkbox" id="sugarCheck" checked={includeSugar} onChange={(e) => setIncludeSugar(e.target.checked)} />
            <label htmlFor="sugarCheck" style={{ color: '#ccc', fontSize: '0.8rem' }}>Add balancing sweetener (+0.75%)</label>
          </div>
          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#aaa', fontWeight: 'bold' }}>Required Salt:</span>
              <span style={{ color: '#00cc66', fontWeight: 'bold', fontSize: '1.2rem' }}>{saltRequired} grams</span>
            </div>
            {includeSugar && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', borderTop: '1px solid #222', paddingTop: '8px' }}>
                <span style={{ color: '#aaa', fontWeight: 'bold' }}>Required Sugar:</span>
                <span style={{ color: '#ffb703', fontWeight: 'bold' }}>{sugarRequired} grams</span>
              </div>
            )}
          </div>
        </div>

        {/* --- Card 3: Meat Done-ness (Cheat Sheet) --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1.1rem' }}>🌡️ Pull Temps (Field Guide)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
            <div style={{ background: '#0a0a0a', padding: '10px', borderRadius: '6px', border: '1px solid #222' }}>
              <div style={{ color: '#00cc66', fontWeight: 'bold' }}>Poultry (Dark/Bone)</div><div style={{ color: '#fff' }}>Pull: 170°F - 175°F</div>
            </div>
            <div style={{ background: '#0a0a0a', padding: '10px', borderRadius: '6px', border: '1px solid #222' }}>
              <div style={{ color: '#00cc66', fontWeight: 'bold' }}>Poultry (Breast)</div><div style={{ color: '#fff' }}>Pull: 155°F (Rest 165°F)</div>
            </div>
            <div style={{ background: '#0a0a0a', padding: '10px', borderRadius: '6px', border: '1px solid #222' }}>
              <div style={{ color: '#00cc66', fontWeight: 'bold' }}>Pork Loin / Chops</div><div style={{ color: '#fff' }}>Pull: 140°F (Rest 145°F)</div>
            </div>
            <div style={{ background: '#0a0a0a', padding: '10px', borderRadius: '6px', border: '1px solid #222' }}>
              <div style={{ color: '#00cc66', fontWeight: 'bold' }}>Beef (Med-Rare)</div><div style={{ color: '#fff' }}>Pull: 125°F (Rest 135°F)</div>
            </div>
          </div>
        </div>

        {/* --- Card 4: Baker's Percentages --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #ffb703', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>🍞 Baker's Percentages</h3>
          <label style={{ color: '#ffb703', fontSize: '0.8rem', fontWeight: 'bold' }}>Total Flour Weight (grams)</label>
          <input type="number" value={flourGrams} onChange={(e) => setFlourGrams(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginBottom: '14px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#00e5ff', fontSize: '0.8rem' }}>Water (%)</label>
              <input type="number" value={waterPct} onChange={(e) => setWaterPct(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Salt (%)</label>
              <input type="number" value={saltPct} onChange={(e) => setSaltPct(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ color: '#ffb703', fontSize: '0.8rem' }}>Yeast (%)</label>
              <input type="number" value={yeastPct} onChange={(e) => setYeastPct(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
          </div>
          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>Water:</span><span style={{ color: '#00e5ff', fontWeight: 'bold' }}>{wGrams} g</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}><span style={{ color: '#aaa' }}>Salt:</span><span style={{ color: '#fff', fontWeight: 'bold' }}>{sGrams} g</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><span style={{ color: '#aaa' }}>Yeast:</span><span style={{ color: '#ffb703', fontWeight: 'bold' }}>{yGrams} g</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '10px' }}>
              <span style={{ color: '#aaa', fontWeight: 'bold' }}>Dough Yield:</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{totalDough} g</span>
            </div>
          </div>
        </div>

        {/* --- Card 5: Kinetic Strength (1RM) --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #d00000', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>🏋️ Kinetic Strength (1RM)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: 'bold' }}>Weight Lifted</label>
              <input type="number" value={liftWeight} onChange={(e) => setLiftWeight(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ color: '#d00000', fontSize: '0.8rem', fontWeight: 'bold' }}>Reps</label>
              <input type="number" value={liftReps} onChange={(e) => setLiftReps(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
          </div>
          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '10px' }}>
              <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>1-Rep Max:</span>
              <span style={{ color: '#d00000', fontWeight: 'bold', fontSize: '1.2rem' }}>{oneRepMax}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#aaa' }}>90% (Heavy Double):</span><span style={{ color: '#00e5ff', fontWeight: 'bold' }}>{Math.round(oneRepMax * 0.9)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#aaa' }}>80% (5x5 Working):</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{Math.round(oneRepMax * 0.8)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>70% (Speed):</span><span style={{ color: '#ffb703', fontWeight: 'bold' }}>{Math.round(oneRepMax * 0.7)}</span></div>
          </div>
        </div>

        {/* --- Card 6: Metabolic & Hydration --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1.1rem' }}>🔥 Metabolic & Hydration</h3>
          <p style={{ color: '#888', fontSize: '0.75rem', margin: '0 0 14px 0' }}>Calculates exact Basal Metabolic Rate and harsh-environment hydration baselines.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#00e5ff', fontSize: '0.8rem' }}>Weight (lbs)</label>
              <input type="number" value={bodyWeight} onChange={(e) => setBodyWeight(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ color: '#00e5ff', fontSize: '0.8rem' }}>Height (in)</label>
              <input type="number" value={heightInches} onChange={(e) => setHeightInches(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ color: '#00e5ff', fontSize: '0.8rem' }}>Age</label>
              <input type="number" value={ageYears} onChange={(e) => setAgeYears(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }}>
              <option value="M">Male</option><option value="F">Female</option>
            </select>
            <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} style={{ background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }}>
              <option value="1.2">Sedentary</option>
              <option value="1.375">Light (1-3 days)</option>
              <option value="1.55">Moderate (3-5 days)</option>
              <option value="1.725">Heavy (6-7 days)</option>
            </select>
          </div>
          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#aaa' }}>Resting BMR:</span><span style={{ color: '#00e5ff', fontWeight: 'bold' }}>{Math.round(bmr)} kcal</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Daily TDEE:</span><span style={{ color: '#ffb703', fontWeight: 'bold', fontSize: '1.1rem' }}>{tdee} kcal</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '10px' }}>
              <span style={{ color: '#aaa' }}>Min Hydration:</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{waterOz} oz / day</span>
            </div>
          </div>
        </div>

        {/* --- Card 7: Circadian Shift Optimizer --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #a600ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1.1rem' }}>🌙 Circadian Shift Optimizer</h3>
          <p style={{ color: '#888', fontSize: '0.75rem', margin: '0 0 14px 0' }}>Calculates exact sleep initiation times based on 90-minute REM cycles to prevent grogginess. Critical for managing day-sleeping between overnight shifts.</p>
          <label style={{ color: '#a600ff', fontSize: '0.8rem', fontWeight: 'bold' }}>Target Wake Up Time</label>
          <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px', marginBottom: '14px' }} />
          
          {sleepTimes.length > 0 && (
            <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px' }}>
              <div style={{ color: '#fff', fontSize: '0.85rem', marginBottom: '10px', textAlign: 'center' }}>Fall asleep at one of these times:</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {sleepTimes.map((st, i) => (
                  <div key={i} style={{ background: '#1a1a1a', padding: '10px', borderRadius: '6px', textAlign: 'center', border: '1px solid #333' }}>
                    <div style={{ color: '#a600ff', fontWeight: 'bold', fontSize: '1.1rem' }}>{st.time}</div>
                    <div style={{ color: '#666', fontSize: '0.7rem' }}>{st.hours} hours sleep</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default LifestyleCalc;
