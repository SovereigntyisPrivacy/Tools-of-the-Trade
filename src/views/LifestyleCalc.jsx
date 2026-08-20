import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LifestyleCalc() {
  const navigate = useNavigate();

  // --- Recipe & Oven State ---
  const [origYield, setOrigYield] = useState('4');
  const [targetYield, setTargetYield] = useState('10');
  
  // Dynamic Recipe List (Pre-loaded with a honey garlic marinade example)
  const [recipe, setRecipe] = useState([
    { id: 1, name: 'Garlic (cloves)', amount: '3' },
    { id: 2, name: 'Honey (tbsp)', amount: '2' },
    { id: 3, name: 'Soy Sauce (cup)', amount: '0.25' },
    { id: 4, name: 'Pork / Chicken (lbs)', amount: '1.5' }
  ]);

  // Bake Time & Temp State
  const [origTime, setOrigTime] = useState('45');
  const [origBakeTemp, setOrigBakeTemp] = useState('350');
  const [targetBakeTemp, setTargetBakeTemp] = useState('400');

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

  // --- Health, Diet & Metabolic State ---
  const [bodyWeight, setBodyWeight] = useState('185');
  const [heightInches, setHeightInches] = useState('71');
  const [ageYears, setAgeYears] = useState('30');
  const [gender, setGender] = useState('M');
  const [activityLevel, setActivityLevel] = useState('1.55');
  const [dietGoal, setDietGoal] = useState('maintain');

  // --- Circadian Shift State ---
  const [wakeTime, setWakeTime] = useState('');

  // --- Converter State ---
  const [convAmt, setConvAmt] = useState('1');
  const [convUnit, setConvUnit] = useState('cup');

  // --- CALCULATIONS ---
  
  // Recipe Multiplier
  const origYNum = parseFloat(origYield) || 0;
  const targetYNum = parseFloat(targetYield) || 0;
  const multiplier = origYNum > 0 && targetYNum > 0 ? (targetYNum / origYNum) : 0;

  // Recipe Array Handlers
  const addIngredient = () => setRecipe([...recipe, { id: Date.now(), name: '', amount: '' }]);
  const updateIngredient = (id, field, value) => {
    setRecipe(recipe.map(ing => ing.id === id ? { ...ing, [field]: value } : ing));
  };
  const removeIngredient = (id) => setRecipe(recipe.filter(ing => ing.id !== id));

  // Time & Temp Adjuster
  const oTime = parseFloat(origTime) || 0;
  const oTemp = parseFloat(origBakeTemp) || 0;
  const tTemp = parseFloat(targetBakeTemp) || 0;
  const adjustedTime = (oTemp > 0 && tTemp > 0) ? (oTime * (oTemp / tTemp)).toFixed(1) : 0;
  const tempC = oTemp ? ((oTemp - 32) * (5 / 9)).toFixed(1) : '0.0';
  const tempFanC = oTemp ? (((oTemp - 32) * (5 / 9)) - 20).toFixed(1) : '0.0';

  // Brine
  const totalMass = (parseFloat(meatGrams) || 0) + (parseFloat(waterGrams) || 0);
  const saltRequired = ((totalMass * (parseFloat(salinity) || 0)) / 100).toFixed(1);
  const sugarRequired = includeSugar ? ((totalMass * 0.75) / 100).toFixed(1) : null;

  // Baker's Math
  const fGrams = parseFloat(flourGrams) || 0;
  const wGrams = (fGrams * (parseFloat(waterPct) || 0) / 100).toFixed(1);
  const sGrams = (fGrams * (parseFloat(saltPct) || 0) / 100).toFixed(1);
  const yGrams = (fGrams * (parseFloat(yeastPct) || 0) / 100).toFixed(1);
  const totalDough = (fGrams + parseFloat(wGrams) + parseFloat(sGrams) + parseFloat(yGrams)).toFixed(1);

  // Converter Engine
  const volRates = { ml: 1, L: 1000, tsp: 4.9289, tbsp: 14.7868, floz: 29.5735, cup: 236.588, pint: 473.176, quart: 946.353, gal: 3785.41 };
  const wtRates = { g: 1, kg: 1000, oz: 28.3495, lb: 453.592 };
  const amtNum = parseFloat(convAmt) || 0;
  const isVol = Object.keys(volRates).includes(convUnit);
  const baseValue = isVol ? amtNum * volRates[convUnit] : amtNum * wtRates[convUnit];
  const formatConv = (val) => {
    if (val < 0.1) return val.toFixed(3);
    if (val < 10) return val.toFixed(2);
    if (val < 100) return val.toFixed(1);
    return Math.round(val);
  };

  // Strength
  const weightNum = parseFloat(liftWeight) || 0;
  const repsNum = parseFloat(liftReps) || 0;
  const oneRepMax = repsNum > 0 && weightNum > 0 ? Math.round(weightNum * (1 + repsNum / 30)) : 0;

  // Metabolic & Health
  const wtLbs = parseFloat(bodyWeight) || 0;
  const htIn = parseFloat(heightInches) || 0;
  const aYrs = parseFloat(ageYears) || 0;
  const wKg = wtLbs / 2.205;
  const hCm = htIn * 2.54;
  
  const bmi = htIn > 0 ? ((wtLbs * 703) / (htIn * htIn)).toFixed(1) : '0.0';
  let bmiClass = '#aaa';
  if (bmi > 0) {
    if (bmi < 18.5) bmiClass = '#00e5ff';
    else if (bmi < 25) bmiClass = '#00cc66';
    else if (bmi < 30) bmiClass = '#ffb703';
    else bmiClass = '#d00000';
  }

  let bmr = 0;
  if (wKg && hCm && aYrs) {
    bmr = (10 * wKg) + (6.25 * hCm) - (5 * aYrs);
    bmr += gender === 'M' ? 5 : -161;
  }
  const tdee = Math.round(bmr * parseFloat(activityLevel || 1.2));
  const waterOz = Math.round(wtLbs * 0.5);

  let targetKcal = tdee;
  if (dietGoal === 'cut') targetKcal -= 500;
  if (dietGoal === 'bulk') targetKcal += 500;

  const proGrams = Math.round(wtLbs);
  const fatGrams = Math.round((targetKcal * 0.25) / 9);
  const carbGrams = Math.round((targetKcal - (proGrams * 4) - (fatGrams * 9)) / 4);

  // Heart Rate
  const maxHR = aYrs > 0 ? 220 - aYrs : 0;

  // Circadian
  const calculateSleepTimes = (wake) => {
    if(!wake) return [];
    const [h, m] = wake.split(':').map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(h, m, 0, 0);
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

      <div className="calc-content" style={{ padding: '16px', overflowY: 'auto', height: '100%', paddingBottom: '20px' }}>

        {/* --- Card 1: Full Recipe Scaler --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #00e5ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>🍳 Master Recipe Scaler</h3>
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
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', padding: '8px', background: '#0d0d0d', borderRadius: '8px', border: '1px solid #222' }}>
            <span style={{ color: '#aaa' }}>Multiplier:</span>
            <span style={{ color: '#00e5ff', fontWeight: 'bold' }}>{multiplier.toFixed(2)}x</span>
          </div>

          <div style={{ borderTop: '1px solid #333', paddingTop: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', color: '#888', fontSize: '0.75rem' }}>
              <span style={{ flex: 2 }}>Ingredient</span>
              <span style={{ flex: 1 }}>Amount</span>
              <span style={{ flex: 1, textAlign: 'center' }}>Scaled</span>
              <span style={{ width: '30px' }}></span>
            </div>
            {recipe.map((ing) => (
              <div key={ing.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Item" 
                  value={ing.name} 
                  onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)} 
                  style={{ flex: 2, background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '8px', borderRadius: '6px' }} 
                />
                <input 
                  type="number" 
                  placeholder="Amt" 
                  value={ing.amount} 
                  onChange={(e) => updateIngredient(ing.id, 'amount', e.target.value)} 
                  style={{ flex: 1, background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '8px', borderRadius: '6px' }} 
                />
                <div style={{ flex: 1, background: '#121212', border: '1px solid #222', padding: '8px', borderRadius: '6px', color: '#00e5ff', fontWeight: 'bold', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {ing.amount ? (parseFloat(ing.amount) * multiplier).toFixed(1) : '--'}
                </div>
                <button onClick={() => removeIngredient(ing.id)} style={{ width: '30px', background: '#d00000', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>X</button>
              </div>
            ))}
            <button onClick={addIngredient} style={{ width: '100%', padding: '10px', background: '#222', color: '#fff', border: '1px dashed #444', borderRadius: '8px', marginTop: '4px' }}>
              + Add Ingredient
            </button>
          </div>
        </div>

        {/* --- Card 2: Bake Time & Temp Adjuster --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #ffb703', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>⏱️ Bake Time Adjuster</h3>
          <p style={{ color: '#888', fontSize: '0.75rem', margin: '0 0 14px 0' }}>Adjusts cooking time dynamically when you change the oven temperature.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.75rem' }}>Orig Time (m)</label>
              <input type="number" value={origTime} onChange={(e) => setOrigTime(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.75rem' }}>Orig Temp (°F)</label>
              <input type="number" value={origBakeTemp} onChange={(e) => setOrigBakeTemp(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ color: '#ffb703', fontSize: '0.75rem', fontWeight: 'bold' }}>New Temp (°F)</label>
              <input type="number" value={targetBakeTemp} onChange={(e) => setTargetBakeTemp(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
          </div>
          
          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#aaa' }}>Adjusted Bake Time:</span>
              <span style={{ color: '#ffb703', fontWeight: 'bold', fontSize: '1.1rem' }}>{adjustedTime} min</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '8px' }}>
              <span style={{ color: '#777', fontSize: '0.8rem' }}>Orig Temp Celsius:</span>
              <span style={{ color: '#888', fontSize: '0.8rem' }}>{tempC}°C (Fan: {tempFanC}°C)</span>
            </div>
          </div>
        </div>

        {/* --- Card 3: Equilibrium Brine --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #fb8500', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1.1rem' }}>🥩 Equilibrium Brine</h3>
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
          </div>
        </div>

        {/* --- Card 4: Meat Done-ness --- */}
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

        {/* --- Card 5: Baker's Percentages --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #ffb703', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>🍞 Baker's Percentages</h3>
          <label style={{ color: '#ffb703', fontSize: '0.8rem', fontWeight: 'bold' }}>Total Flour (grams)</label>
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

        {/* --- Card 6: Master Culinary Converter --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #fff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>⚖️ Master Converter</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>Amount</label>
              <input type="number" value={convAmt} onChange={(e) => setConvAmt(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>Unit</label>
              <select value={convUnit} onChange={(e) => setConvUnit(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }}>
                <optgroup label="Volume">
                  <option value="tsp">Teaspoons</option>
                  <option value="tbsp">Tablespoons</option>
                  <option value="floz">Fluid Ounces</option>
                  <option value="cup">Cups (US)</option>
                  <option value="pint">Pints (US)</option>
                  <option value="quart">Quarts (US)</option>
                  <option value="gal">Gallons (US)</option>
                  <option value="ml">Milliliters</option>
                  <option value="L">Liters</option>
                </optgroup>
                <optgroup label="Weight">
                  <option value="g">Grams</option>
                  <option value="kg">Kilograms</option>
                  <option value="oz">Ounces (oz)</option>
                  <option value="lb">Pounds (lb)</option>
                </optgroup>
              </select>
            </div>
          </div>
          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px' }}>
            {isVol ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>tsp:</span><span style={{ color: '#00e5ff' }}>{formatConv(baseValue / volRates.tsp)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>tbsp:</span><span style={{ color: '#00e5ff' }}>{formatConv(baseValue / volRates.tbsp)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>fl oz:</span><span style={{ color: '#00e5ff' }}>{formatConv(baseValue / volRates.floz)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>cups:</span><span style={{ color: '#00e5ff' }}>{formatConv(baseValue / volRates.cup)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>gallons:</span><span style={{ color: '#00e5ff' }}>{formatConv(baseValue / volRates.gal)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '4px', gridColumn: 'span 2' }}>
                  <span style={{ color: '#aaa' }}>ml / Liters:</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{Math.round(baseValue)} ml / {(baseValue/1000).toFixed(3)} L</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>Ounces (oz):</span><span style={{ color: '#ffb703' }}>{formatConv(baseValue / wtRates.oz)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>Pounds (lbs):</span><span style={{ color: '#ffb703' }}>{formatConv(baseValue / wtRates.lb)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>Grams (g):</span><span style={{ color: '#00cc66' }}>{Math.round(baseValue)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>Kilograms (kg):</span><span style={{ color: '#00cc66' }}>{formatConv(baseValue / wtRates.kg)}</span></div>
              </div>
            )}
          </div>
        </div>

        {/* --- Card 7: Kinetic Strength (1RM) --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #d00000', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>🏋️ Kinetic Strength (1RM)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: 'bold' }}>Weight Lifted (lbs)</label>
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

        {/* --- Card 8: Metabolic, BMI & Diet Macros --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1.1rem' }}>🔥 Metabolic, BMI & Diet</h3>
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
          
          <div style={{ marginBottom: '14px' }}>
            <label style={{ color: '#ffb703', fontSize: '0.8rem', fontWeight: 'bold' }}>Diet Goal</label>
            <select value={dietGoal} onChange={(e) => setDietGoal(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '4px' }}>
              <option value="cut">Cut (Caloric Deficit -500)</option>
              <option value="maintain">Maintain Current Weight</option>
              <option value="bulk">Bulk (Caloric Surplus +500)</option>
            </select>
          </div>

          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#aaa' }}>BMI Score:</span><span style={{ color: bmiClass, fontWeight: 'bold' }}>{bmi}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#aaa' }}>Resting BMR:</span><span style={{ color: '#00e5ff' }}>{Math.round(bmr)} kcal</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Target Intake:</span><span style={{ color: '#ffb703', fontWeight: 'bold', fontSize: '1.1rem' }}>{targetKcal} kcal</span></div>
            
            <div style={{ borderTop: '1px solid #333', paddingTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', textAlign: 'center' }}>
              <div><div style={{ color: '#aaa', fontSize: '0.7rem' }}>Protein</div><div style={{ color: '#00cc66', fontWeight: 'bold' }}>{proGrams}g</div></div>
              <div><div style={{ color: '#aaa', fontSize: '0.7rem' }}>Carbs</div><div style={{ color: '#00e5ff', fontWeight: 'bold' }}>{carbGrams}g</div></div>
              <div><div style={{ color: '#aaa', fontSize: '0.7rem' }}>Fat</div><div style={{ color: '#ffb703', fontWeight: 'bold' }}>{fatGrams}g</div></div>
            </div>
          </div>
        </div>

        {/* --- Card 9: Cardio & Target Heart Rate Zones --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #ff0055', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>❤️ Cardio & Heart Rate</h3>
          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '10px' }}>
              <span style={{ color: '#aaa' }}>Absolute Max HR:</span>
              <span style={{ color: '#ff0055', fontWeight: 'bold' }}>{maxHR} BPM</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Zone 2 (Fat Burn / Endurance):</span>
              <span style={{ color: '#00cc66', fontWeight: 'bold' }}>{Math.round(maxHR * 0.6)} - {Math.round(maxHR * 0.7)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Zone 3 (Aerobic Cardio):</span>
              <span style={{ color: '#ffb703', fontWeight: 'bold' }}>{Math.round(maxHR * 0.7)} - {Math.round(maxHR * 0.8)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Zone 5 (VO2 Max / Sprints):</span>
              <span style={{ color: '#d00000', fontWeight: 'bold' }}>{Math.round(maxHR * 0.9)} - {maxHR}</span>
            </div>
          </div>
        </div>

        {/* --- Card 10: Circadian Shift Optimizer --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #a600ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1.1rem' }}>🌙 Circadian Shift</h3>
          <p style={{ color: '#888', fontSize: '0.75rem', margin: '0 0 14px 0' }}>Calculate exact sleep times based on 90-minute REM cycles.</p>
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
