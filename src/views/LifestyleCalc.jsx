import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LifestyleCalc() {
  const navigate = useNavigate();

  // 1. Base Scaling
  const [oldYield, setOldYield] = useState('');
  const [newYield, setNewYield] = useState('');
  const [fTemp, setFTemp] = useState('');

  // 2. Equilibrium Brine
  const [meatWeight, setMeatWeight] = useState('');
  const [liquidWeight, setLiquidWeight] = useState('');
  const [saltTarget, setSaltTarget] = useState('1.5');

  // 3. Baker's Math
  const [flour, setFlour] = useState('');
  const [hydration, setHydration] = useState('70');
  const [saltPercent, setSaltPercent] = useState('2');
  const [yeastPercent, setYeastPercent] = useState('1');

  // 4. Kinetic Strength
  const [liftWeight, setLiftWeight] = useState('');
  const [liftReps, setLiftReps] = useState('');

  // 5. Metabolic & Hydration
  const [bodyWeight, setBodyWeight] = useState(''); // lbs
  const [heightInches, setHeightInches] = useState(''); // inches
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('M');
  const [activity, setActivity] = useState('1.55'); // Default moderate

  // 6. Circadian Sleep Optimizer
  const [wakeTime, setWakeTime] = useState('');

  // --- Calculations ---

  // 1. Recipe
  const multiplier = (oldYield && newYield) ? (parseFloat(newYield) / parseFloat(oldYield)).toFixed(2) : '0.00';
  const cTemp = fTemp ? ((parseFloat(fTemp) - 32) * 5 / 9).toFixed(1) : '0.0';

  // 2. Brine
  let totalMass = 0, requiredSalt = 0;
  if (meatWeight && liquidWeight && saltTarget) {
    totalMass = parseFloat(meatWeight) + parseFloat(liquidWeight);
    requiredSalt = (totalMass * (parseFloat(saltTarget) / 100)).toFixed(1);
  }

  // 3. Baker's
  let waterW = 0, saltW = 0, yeastW = 0, doughTotal = 0;
  if (flour && hydration && saltPercent && yeastPercent) {
    const f = parseFloat(flour);
    waterW = (f * (parseFloat(hydration) / 100)).toFixed(0);
    saltW = (f * (parseFloat(saltPercent) / 100)).toFixed(1);
    yeastW = (f * (parseFloat(yeastPercent) / 100)).toFixed(1);
    doughTotal = (f + parseFloat(waterW) + parseFloat(saltW) + parseFloat(yeastW)).toFixed(0);
  }

  // 4. Strength
  let oneRepMax = 0, p90 = 0, p80 = 0, p70 = 0;
  if (liftWeight && liftReps) {
    const w = parseFloat(liftWeight);
    const r = parseFloat(liftReps);
    if (r === 1) oneRepMax = w;
    else if (r > 1) oneRepMax = w * (1 + (r / 30));
    p90 = (oneRepMax * 0.90).toFixed(0);
    p80 = (oneRepMax * 0.80).toFixed(0);
    p70 = (oneRepMax * 0.70).toFixed(0);
  }

  // 5. Metabolic (Mifflin-St Jeor)
  let bmr = 0, tdee = 0, waterOz = 0;
  if (bodyWeight && heightInches && age) {
    const wKg = parseFloat(bodyWeight) * 0.453592;
    const hCm = parseFloat(heightInches) * 2.54;
    const a = parseFloat(age);
    
    if (gender === 'M') {
      bmr = (10 * wKg) + (6.25 * hCm) - (5 * a) + 5;
    } else {
      bmr = (10 * wKg) + (6.25 * hCm) - (5 * a) - 161;
    }
    tdee = bmr * parseFloat(activity);
    
    // Base hydration + extra for activity levels
    const baseWater = parseFloat(bodyWeight) * 0.5; // half bodyweight in oz
    const activityBonus = (parseFloat(activity) - 1.2) * 100; // rough sweat offset
    waterOz = baseWater + activityBonus;
  }

  // 6. Sleep Optimizer (90 Min Cycles + 15 min fall-asleep time)
  const getSleepTimes = () => {
    if (!wakeTime) return [];
    const [h, m] = wakeTime.split(':').map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(h, m, 0, 0);

    // 6 cycles (9 hrs), 5 cycles (7.5 hrs), 4 cycles (6 hrs)
    return [6, 5, 4].map(cycles => {
      const msToSubtract = (cycles * 90 * 60000) + (15 * 60000);
      const sleepDate = new Date(wakeDate.getTime() - msToSubtract);
      return {
        cycles,
        hours: (cycles * 1.5).toFixed(1),
        time: sleepDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    });
  };
  const sleepCycles = getSleepTimes();

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
              <input type="number" placeholder="4" value={oldYield} onChange={e => setOldYield(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Target Yield</label>
              <input type="number" placeholder="10" value={newYield} onChange={e => setNewYield(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>
          <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Oven Temp (°F)</label>
          <input type="number" placeholder="350" value={fTemp} onChange={e => setFTemp(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Multiplier:</span><span style={{ color: '#00ffff', fontWeight: 'bold' }}>{multiplier}x</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', paddingTop: '8px', borderTop: '1px dashed #333' }}><span style={{ color: '#aaa' }}>Celsius:</span><span style={{ color: '#ffaa00', fontWeight: 'bold' }}>{cTemp}°C</span></div>
          </div>
        </div>

        {/* 2. Equilibrium Brine */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #cc6600', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🥩 Equilibrium Brine</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#cc6600', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Meat (grams)</label>
              <input type="number" placeholder="1500" value={meatWeight} onChange={e => setMeatWeight(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Liquid (grams)</label>
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
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Required Salt:</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{requiredSalt} grams</span>
          </div>
        </div>

        {/* 3. Baker's Math */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ffaa00', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🍞 Baker's Percentages</h3>
          <label style={{ display: 'block', color: '#ffaa00', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '4px' }}>Total Flour Weight (grams)</label>
          <input type="number" placeholder="1000" value={flour} onChange={e => setFlour(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px' }} />
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px' }}>Water (%)</label>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', paddingTop: '8px', borderTop: '1px dashed #333' }}><span style={{ color: '#aaa' }}>Dough Yield:</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{doughTotal} g</span></div>
          </div>
        </div>

        {/* 4. Kinetic Strength */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ff4444', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🏋️ Kinetic Strength (1RM)</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Weight Lifted</label>
              <input type="number" placeholder="225" value={liftWeight} onChange={e => setLiftWeight(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#ff4444', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Reps</label>
              <input type="number" placeholder="5" value={liftReps} onChange={e => setLiftReps(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3em', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #333' }}>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>1-Rep Max:</span><span style={{ color: '#ff4444', fontWeight: 'bold' }}>{oneRepMax > 0 ? oneRepMax.toFixed(0) : '0'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1em' }}><span style={{ color: '#aaa' }}>90% (Heavy Double):</span><span style={{ color: '#00ffff', fontWeight: 'bold' }}>{p90}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1em' }}><span style={{ color: '#aaa' }}>80% (5x5 Working):</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{p80}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1em' }}><span style={{ color: '#aaa' }}>70% (Speed):</span><span style={{ color: '#ffaa00', fontWeight: 'bold' }}>{p70}</span></div>
          </div>
        </div>

        {/* 5. Metabolic & Hydration */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🔥 Metabolic & Hydration</h3>
          <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}>Calculates exact Basal Metabolic Rate and harsh-environment hydration baselines.</p>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px' }}>Weight (lbs)</label>
              <input type="number" placeholder="185" value={bodyWeight} onChange={e => setBodyWeight(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px' }}>Height (in)</label>
              <input type="number" placeholder="71" value={heightInches} onChange={e => setHeightInches(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px' }}>Age</label>
              <input type="number" placeholder="30" value={age} onChange={e => setAge(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Activity Level</label>
              <select value={activity} onChange={e => setActivity(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}>
                <option value="1.2">Sedentary (Desk Job)</option>
                <option value="1.375">Light (1-3 days/wk)</option>
                <option value="1.55">Moderate (3-5 days/wk)</option>
                <option value="1.725">Heavy (6-7 days/wk)</option>
                <option value="1.9">Extreme (Physical Job + Training)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Resting BMR:</span><span style={{ color: '#00ffff', fontWeight: 'bold' }}>{bmr > 0 ? bmr.toFixed(0) : '0'} kcal</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', paddingTop: '8px', borderTop: '1px dashed #333' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Daily TDEE:</span><span style={{ color: '#ffaa00', fontWeight: 'bold' }}>{tdee > 0 ? tdee.toFixed(0) : '0'} kcal</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', paddingTop: '8px', borderTop: '1px solid #333' }}><span style={{ color: '#aaa' }}>Min Hydration:</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{waterOz > 0 ? waterOz.toFixed(0) : '0'} oz / day</span></div>
          </div>
        </div>

        {/* 6. Circadian Sleep Optimizer */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #a55eea', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🌙 Circadian Shift Optimizer</h3>
          <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}>Calculates optimal sleep initiation times based on 90-minute REM cycles to prevent mid-cycle disruption (includes 15m to fall asleep). Critical for day-sleeping or split shifts.</p>
          
          <label style={{ display: 'block', color: '#a55eea', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '4px' }}>Target Wake Up Time</label>
          <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px' }} />

          {wakeTime && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
              <div style={{ color: '#fff', fontWeight: 'bold', borderBottom: '1px solid #333', paddingBottom: '8px', marginBottom: '4px' }}>Be asleep at exactly:</div>
              {sleepCycles.map((cycle, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}>
                  <span style={{ color: '#aaa' }}>{cycle.cycles} Cycles ({cycle.hours} hrs):</span>
                  <span style={{ color: '#a55eea', fontWeight: 'bold' }}>{cycle.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default LifestyleCalc;
