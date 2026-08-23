import React, { useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#ff4444', background: '#0a0a0a', minHeight: '100vh' }}>
          <h2>⚠️ Module Crashed</h2>
          <p style={{ fontFamily: 'monospace', background: '#111', padding: '10px', whiteSpace: 'pre-wrap' }}>{this.state.error?.toString()}</p>
          <button onClick={() => window.history.back()} style={{ padding: '10px', background: '#333', color: '#fff', border: 'none', borderRadius: '8px' }}>Go Back</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function LifestyleUI() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Reference'); // Defaulting here so you can see it instantly!

  // --- CULINARY STATE ---
  const [origY, setOrigY] = useState('2');
  const [targetY, setTargetY] = useState('1');
  const [ingredients, setIngredients] = useState([
    { id: 1, qty: '1/2', unit: 'cup', name: 'Soy Sauce' },
    { id: 2, qty: '1/4', unit: 'cup', name: 'Honey' },
    { id: 3, qty: '4', unit: 'cloves', name: 'Garlic' }
  ]);
  
  const addIng = () => setIngredients([...ingredients, { id: Date.now(), qty: '', unit: 'tsp', name: '' }]);
  const updateIng = (id, field, val) => setIngredients(ingredients.map(i => i.id === id ? { ...i, [field]: val } : i));
  const removeIng = id => setIngredients(ingredients.filter(i => i.id !== id));

  const parseFraction = (str) => {
    if (!str) return 0;
    let total = 0;
    str.toString().trim().split(' ').forEach(p => {
      if (p.includes('/')) { const [n, d] = p.split('/'); total += (parseFloat(n) / parseFloat(d)) || 0; } 
      else { total += parseFloat(p) || 0; }
    });
    return total;
  };

  const decimalToFraction = (decimal, unit) => {
    if (!decimal || isNaN(decimal)) return '';
    const w = Math.floor(decimal);
    const f = decimal - w;
    if (f < 0.05) return w > 0 ? w.toString() : '';
    if (f > 0.95) return (w + 1).toString();
    
    const u = (unit || '').toLowerCase();
    
    // Smart Cup Breakdowns (No more 3/8 or 5/8 cups!)
    if (u.includes('cup')) {
      if (Math.abs(f - 1/8) < 0.05) return w === 0 ? '2 tbsp' : `${w} cup + 2 tbsp`;
      if (Math.abs(f - 3/8) < 0.05) return w === 0 ? '1/4 cup + 2 tbsp' : `${w} 1/4 cup + 2 tbsp`;
      if (Math.abs(f - 5/8) < 0.05) return w === 0 ? '1/2 cup + 2 tbsp' : `${w} 1/2 cup + 2 tbsp`;
      if (Math.abs(f - 7/8) < 0.05) return w === 0 ? '3/4 cup + 2 tbsp' : `${w} 3/4 cup + 2 tbsp`;
    }
    
    // Smart Tablespoon Breakdowns (1 tbsp = 3 tsp)
    if (u.includes('tbsp') || u.includes('tablespoon')) {
      if (Math.abs(f - 1/3) < 0.08 || Math.abs(f - 3/8) < 0.08) return w === 0 ? '1 tsp' : `${w} tbsp + 1 tsp`;
      if (Math.abs(f - 1/2) < 0.08 || Math.abs(f - 5/8) < 0.08) return w === 0 ? '1 1/2 tsp' : `${w} tbsp + 1 1/2 tsp`;
      if (Math.abs(f - 2/3) < 0.08 || Math.abs(f - 3/4) < 0.08) return w === 0 ? '2 tsp' : `${w} tbsp + 2 tsp`;
    }

    // Default strictly to standard kitchen measuring spoon/cup sizes
    const fracs = [
        { v: 1/4, s: '1/4' }, { v: 1/3, s: '1/3' },
        { v: 1/2, s: '1/2' }, { v: 2/3, s: '2/3' }, { v: 3/4, s: '3/4' }
    ];
    let closest = fracs[0], min = Math.abs(f - closest.v);
    for (let i=1; i<fracs.length; i++) {
        let diff = Math.abs(f - fracs[i].v);
        if (diff < min) { min = diff; closest = fracs[i]; }
    }
    return w === 0 ? closest.s : `${w} ${closest.s}`;
  };

  const multiplier = (parseFloat(targetY) || 1) / (parseFloat(origY) || 1);

  // Bake Adjuster & Brine
  const [origTime, setOrigTime] = useState('45');
  const [origTemp, setOrigTemp] = useState('350');
  const [newTemp, setNewTemp] = useState('400');
  const adjTime = (parseFloat(origTime)||0) * ((parseFloat(origTemp)||0) / (parseFloat(newTemp)||1));
  const [meatWt, setMeatWt] = useState('1500');
  const [liqWt, setLiqWt] = useState('1000');
  const [saltPct, setSaltPct] = useState('1.25');
  const brineSalt = ((parseFloat(meatWt)||0) + (parseFloat(liqWt)||0)) * ((parseFloat(saltPct)||0) / 100);

  // NEW Baker's Percentages
  const [flour, setFlour] = useState('1000');
  const [wPct, setWPct] = useState('70');
  const [sPct, setSPct] = useState('2');
  const [yPct, setYPct] = useState('1');
  const bFlour = parseFloat(flour)||0;
  const bWater = bFlour * ((parseFloat(wPct)||0)/100);
  const bSalt = bFlour * ((parseFloat(sPct)||0)/100);
  const bYeast = bFlour * ((parseFloat(yPct)||0)/100);
  const bYield = bFlour + bWater + bSalt + bYeast;

  // NEW Master Converter
  const [convAmt, setConvAmt] = useState('1.5');
  const [convFrom, setConvFrom] = useState('cup');
  const [convTo, setConvTo] = useState('g');
  const [convIng, setConvIng] = useState('flour');

  const volMap = { 'tsp': 4.928, 'tbsp': 14.786, 'cup': 236.588, 'fl oz': 29.573, 'ml': 1, 'l': 1000 };
  const wtMap = { 'g': 1, 'oz': 28.349, 'lb': 453.592 };
  const denMap = { 'water': 1, 'flour': 0.528, 'sugar': 0.845, 'butter': 0.959, 'oil': 0.918, 'honey': 1.42 };

  const getConverted = () => {
    const amt = parseFraction(convAmt);
    if (volMap[convFrom] && volMap[convTo]) return amt * (volMap[convFrom] / volMap[convTo]);
    if (wtMap[convFrom] && wtMap[convTo]) return amt * (wtMap[convFrom] / wtMap[convTo]);
    if (volMap[convFrom] && wtMap[convTo]) {
      const ml = amt * volMap[convFrom];
      const g = ml * (denMap[convIng] || 1);
      return g / wtMap[convTo];
    }
    if (wtMap[convFrom] && volMap[convTo]) {
      const g = amt * wtMap[convFrom];
      const ml = g / (denMap[convIng] || 1);
      return ml / volMap[convTo];
    }
    return 0;
  };
  const convRes = getConverted();

  // --- FITNESS & HEALTH ---
  const [liftWt, setLiftWt] = useState('225');
  const [liftReps, setLiftReps] = useState('5');
  const oneRM = (parseFloat(liftWt)||0) * (1 + ((parseFloat(liftReps)||0) / 30));
  const [bw, setBw] = useState('185');
  const [bh, setBh] = useState('71');
  const [ba, setBa] = useState('30');

  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  
  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Lifestyle & Health</h2>
      </header>

      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Culinary', 'Fitness', 'Health', 'Reference'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === tab ? '#00cc66' : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>{tab}</button>
        ))}
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '95px' }}>
        {activeTab === 'Culinary' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #00ffff' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>⚖️ Master Converter</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold' }}>Amount</label>
                  <input type="text" value={convAmt} onChange={e=>setConvAmt(e.target.value)} style={inputStyle} placeholder="e.g. 1 1/2" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#aaa', fontSize: '0.8em', fontWeight: 'bold' }}>From</label>
                  <select value={convFrom} onChange={e=>setConvFrom(e.target.value)} style={{ ...inputStyle, height: '42px' }}>
                    <optgroup label="Volume"><option value="tsp">tsp</option><option value="tbsp">tbsp</option><option value="cup">Cups</option><option value="fl oz">Fluid Oz</option><option value="ml">mL</option></optgroup>
                    <optgroup label="Weight"><option value="g">Grams</option><option value="oz">Ounces (wt)</option><option value="lb">Pounds</option></optgroup>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#00cc66', fontSize: '0.8em', fontWeight: 'bold' }}>To</label>
                  <select value={convTo} onChange={e=>setConvTo(e.target.value)} style={{ ...inputStyle, height: '42px' }}>
                    <optgroup label="Weight"><option value="g">Grams</option><option value="oz">Ounces (wt)</option><option value="lb">Pounds</option></optgroup>
                    <optgroup label="Volume"><option value="tsp">tsp</option><option value="tbsp">tbsp</option><option value="cup">Cups</option><option value="fl oz">Fluid Oz</option><option value="ml">mL</option></optgroup>
                  </select>
                </div>
              </div>
              
              {((volMap[convFrom] && wtMap[convTo]) || (wtMap[convFrom] && volMap[convTo])) && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ color: '#f59e0b', fontSize: '0.8em', fontWeight: 'bold' }}>Ingredient Density</label>
                  <select value={convIng} onChange={e=>setConvIng(e.target.value)} style={{ ...inputStyle, height: '42px' }}>
                    <option value="water">Water / Liquids</option><option value="flour">Flour (AP)</option><option value="sugar">Sugar (White)</option>
                    <option value="butter">Butter</option><option value="oil">Oil (Olive/Veg)</option><option value="honey">Honey / Syrup</option>
                  </select>
                </div>
              )}

              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222', textAlign: 'center' }}>
                <span style={{ color: '#aaa', display: 'block', marginBottom: '5px' }}>Converted Result:</span>
                <strong style={{ color: '#00cc66', fontSize: '2em' }}>{convRes > 0 ? convRes.toFixed(1) : '0'} {convTo}</strong>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🍞 Interactive Baker's %</h3>
              <label style={{ color: '#f59e0b', fontSize: '0.8em', fontWeight: 'bold' }}>Total Flour (grams)</label>
              <input type="number" value={flour} onChange={e=>setFlour(e.target.value)} style={{ ...inputStyle, marginBottom: '20px' }} />
              
              <label style={{ color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}><span>Hydration (Water %)</span><span>{wPct}%</span></label>
              <input type="range" min="50" max="100" value={wPct} onChange={e=>setWPct(e.target.value)} style={{ width: '100%', accentColor: '#00ffff', marginBottom: '5px' }} />
              <div style={{ color: '#888', fontSize: '0.8em', marginBottom: '20px', fontStyle: 'italic' }}>
                {wPct < 60 ? 'Stiff (Bagels, Pretzels)' : wPct < 70 ? 'Standard (Sandwich Bread, Pizza)' : wPct < 80 ? 'Hydrated (Artisan, Sourdough)' : 'Wet (Ciabatta, Focaccia)'}
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#aaa', fontSize: '0.8em', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}><span>Salt</span><span>{sPct}%</span></label>
                  <input type="range" min="0.5" max="3" step="0.1" value={sPct} onChange={e=>setSPct(e.target.value)} style={{ width: '100%', accentColor: '#aaa' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#f59e0b', fontSize: '0.8em', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}><span>Yeast</span><span>{yPct}%</span></label>
                  <input type="range" min="0.1" max="3" step="0.1" value={yPct} onChange={e=>setYPct(e.target.value)} style={{ width: '100%', accentColor: '#f59e0b' }} />
                </div>
              </div>

              <div style={{ background: '#000', padding: '15px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Water:</span> <span style={{ color: '#00ffff', fontWeight: 'bold' }}>{bWater.toFixed(0)} g</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Salt:</span> <span style={{ fontWeight: 'bold' }}>{bSalt.toFixed(1)} g</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed #333' }}><span>Yeast:</span> <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{bYeast.toFixed(1)} g</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: '#fff' }}>Dough Yield:</strong> <strong style={{ color: '#00cc66' }}>{bYield.toFixed(0)} g</strong></div>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🥩 Equilibrium Brine</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={{ color: '#ef4444', fontSize: '0.75em', fontWeight: 'bold' }}>Meat (grams)</label><input type="number" value={meatWt} onChange={e=>setMeatWt(e.target.value)} style={inputStyle} /></div>
                <div style={{ flex: 1 }}><label style={{ color: '#00ffff', fontSize: '0.75em', fontWeight: 'bold' }}>Liquid (grams)</label><input type="number" value={liqWt} onChange={e=>setLiqWt(e.target.value)} style={inputStyle} /></div>
              </div>
              <select value={saltPct} onChange={e=>setSaltPct(e.target.value)} style={{ ...inputStyle, marginBottom: '15px', height: '42px' }}>
                <option value="1.25">1.25% (Mild - Fish, Poultry Breast)</option>
                <option value="1.5">1.50% (Standard - Pork, Chicken)</option>
                <option value="2.0">2.00% (Heavy - Large Roasts)</option>
              </select>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
                <span style={{ color: '#aaa' }}>Required Salt:</span><strong style={{ color: '#00cc66', fontSize: '1.2em' }}>{brineSalt.toFixed(1)} grams</strong>
              </div>
            </div>
            
            <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🍳 Recipe Scaler</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={{ color: '#a855f7', fontSize: '0.8em', fontWeight: 'bold' }}>Orig Yield</label><input type="number" value={origY} onChange={e=>setOrigY(e.target.value)} style={inputStyle} /></div>
                <div style={{ flex: 1 }}><label style={{ color: '#a855f7', fontSize: '0.8em', fontWeight: 'bold' }}>Target Yield</label><input type="number" value={targetY} onChange={e=>setTargetY(e.target.value)} style={inputStyle} /></div>
              </div>
              <div style={{ color: '#aaa', marginBottom: '15px' }}>Multiplier: <strong style={{ color: '#a855f7' }}>{multiplier.toFixed(2)}x</strong></div>
              {ingredients.map(ing => {
                const scaledVal = parseFraction(ing.qty) * multiplier;
                const fractionStr = decimalToFraction(scaledVal, ing.unit);
                return (
                  <div key={ing.id} style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #222', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
                      <input type="text" placeholder="Ingredient" value={ing.name} onChange={e=>updateIng(ing.id, 'name', e.target.value)} style={{ ...inputStyle, flex: 1, padding: '8px' }} />
                      <button onClick={() => removeIng(ing.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', width: '35px', fontWeight: 'bold' }}>X</button>
                    </div>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                      <input type="text" placeholder="Qty" value={ing.qty} onChange={e=>updateIng(ing.id, 'qty', e.target.value)} style={{ ...inputStyle, width: '70px', padding: '8px' }} />
                      <input type="text" placeholder="Unit" value={ing.unit} onChange={e=>updateIng(ing.id, 'unit', e.target.value)} style={{ ...inputStyle, width: '60px', padding: '8px' }} />
                      <span style={{ color: '#555', margin: '0 5px' }}>→</span>
                      <div style={{ color: '#a855f7', fontWeight: 'bold', flex: 1, textAlign: 'right' }}>
                        {scaledVal > 0 ? `${scaledVal.toFixed(2)}` : '-'}
                        {fractionStr && scaledVal > 0 && <span style={{ color: '#aaa', fontSize: '0.85em', display: 'block' }}>(~{fractionStr}{fractionStr.includes('tbsp') || fractionStr.includes('tsp') ? '' : ' ' + ing.unit})</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              <button onClick={addIng} style={{ width: '100%', padding: '12px', background: '#222', color: '#fff', border: '1px dashed #555', borderRadius: '8px', marginTop: '10px' }}>+ Add Ingredient</button>
            </div>
          </>
        )}

        {activeTab === 'Fitness' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🏋️ Kinetic Strength (1RM)</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}><label style={{ color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold' }}>Weight Lifted</label><input type="number" value={liftWt} onChange={e=>setLiftWt(e.target.value)} style={inputStyle} /></div>
              <div style={{ flex: 1 }}><label style={{ color: '#ef4444', fontSize: '0.8em', fontWeight: 'bold' }}>Reps</label><input type="number" value={liftReps} onChange={e=>setLiftReps(e.target.value)} style={inputStyle} /></div>
            </div>
            <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #333' }}>
                <strong style={{ color: '#fff', fontSize: '1.2em' }}>1-Rep Max:</strong>
                <strong style={{ color: '#ef4444', fontSize: '1.5em' }}>{oneRM.toFixed(0)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px' }}><span>90% (Heavy Double):</span> <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{(oneRM*0.9).toFixed(0)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px' }}><span>80% (5x5 Working):</span> <span style={{ color: '#00cc66', fontWeight: 'bold' }}>{(oneRM*0.8).toFixed(0)}</span></div>
            </div>
          </div>
        )}

        {activeTab === 'Health' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #00cc66' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🔥 BMI & BMR</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}><label style={{ color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold' }}>Weight (lbs)</label><input type="number" value={bw} onChange={e=>setBw(e.target.value)} style={inputStyle} /></div>
              <div style={{ flex: 1 }}><label style={{ color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold' }}>Height (in)</label><input type="number" value={bh} onChange={e=>setBh(e.target.value)} style={inputStyle} /></div>
              <div style={{ flex: 1 }}><label style={{ color: '#3b82f6', fontSize: '0.8em', fontWeight: 'bold' }}>Age</label><input type="number" value={ba} onChange={e=>setBa(e.target.value)} style={inputStyle} /></div>
            </div>
            <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px' }}><span>BMI Score:</span> <strong style={{ color: '#f59e0b' }}>{((parseFloat(bw)||0) / Math.pow(parseFloat(bh)||1, 2) * 703).toFixed(1)}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed #333' }}><span>Resting BMR:</span> <strong style={{ color: '#00ffff' }}>{Math.round(10 * ((parseFloat(bw)||0)*0.453592) + 6.25 * ((parseFloat(bh)||0)*2.54) - 5 * (parseFloat(ba)||30) + 5)} kcal</strong></div>
            </div>
          </div>
        )}
        {activeTab === 'Reference' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>🥩 Beef (Steaks & Roasts)</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold', fontSize: '0.9em', borderBottom: '1px solid #333', paddingBottom: '8px', marginBottom: '8px' }}><span>Doneness</span><span>Pull Temp</span><span>Rest Temp</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.85em', marginBottom: '5px' }}><span>Rare (Cool Red Center)</span><span>120°F</span><span style={{ color: '#ef4444' }}>125°F</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.85em', marginBottom: '5px' }}><span>Med-Rare (Warm Red)</span><span>130°F</span><span style={{ color: '#f59e0b' }}>135°F</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}><span>Medium (Warm Pink)</span><span>140°F</span><span style={{ color: '#00cc66' }}>145°F</span></div>
              
              <strong style={{ color: '#fff', fontSize: '0.85em', display: 'block', marginBottom: '4px' }}>Bake & Sear (Reverse Sear):</strong>
              <p style={{ color: '#aaa', fontSize: '0.8em', margin: '0 0 10px 0', lineHeight: '1.4' }}>Bake at 250°F until internal temp is 15°F below target. Rest 10 mins. Sear on cast iron (500°F+) for 1 min per side.</p>
              
              <strong style={{ color: '#fff', fontSize: '0.85em', display: 'block', marginBottom: '4px' }}>Marinades & Flavor:</strong>
              <p style={{ color: '#aaa', fontSize: '0.8em', margin: 0, lineHeight: '1.4' }}>• <strong>Time:</strong> 4 - 24 Hours. Tough cuts (Flank/Skirt) need acids (Vinegar/Wine) or enzymes (Pineapple).<br/>• <strong>Profile:</strong> Heavy Kosher Salt, Coarse Black Pepper, Rosemary, Thyme, Garlic, Coffee/Espresso rubs.</p>
            </div>

            <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>🍗 Poultry (Chicken & Turkey)</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold', fontSize: '0.9em', borderBottom: '1px solid #333', paddingBottom: '8px', marginBottom: '8px' }}><span>Cut</span><span>Pull Temp</span><span>Rest Temp</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.85em', marginBottom: '5px' }}><span>White Meat (Breast)</span><span>155°F</span><span style={{ color: '#00cc66' }}>165°F (Safe)</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}><span>Dark Meat (Thigh/Leg)</span><span>170°F</span><span style={{ color: '#f59e0b' }}>175°F (Tender)</span></div>
              
              <strong style={{ color: '#fff', fontSize: '0.85em', display: 'block', marginBottom: '4px' }}>Bake Times:</strong>
              <p style={{ color: '#aaa', fontSize: '0.8em', margin: '0 0 10px 0', lineHeight: '1.4' }}>• <strong>Breasts:</strong> 375°F for 20-30 minutes.<br/>• <strong>Whole Bird:</strong> 350°F for 20 mins per pound.</p>
              
              <strong style={{ color: '#fff', fontSize: '0.85em', display: 'block', marginBottom: '4px' }}>Marinades & Flavor:</strong>
              <p style={{ color: '#aaa', fontSize: '0.8em', margin: 0, lineHeight: '1.4' }}>• <strong>Time:</strong> 2 - 12 Hours. (Do NOT exceed 12 hours with heavy citrus/lemon, acid will turn meat to mush).<br/>• <strong>Profile:</strong> Paprika, Lemon Zest, Oregano, Basil, Sage, Buttermilk/Yogurt bases.</p>
            </div>

            <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#00cc66' }}>🥓 Pork (Chops & Shoulder)</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold', fontSize: '0.9em', borderBottom: '1px solid #333', paddingBottom: '8px', marginBottom: '8px' }}><span>Cut</span><span>Pull Temp</span><span>Rest Temp</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.85em', marginBottom: '5px' }}><span>Chops / Tenderloin</span><span>140°F</span><span style={{ color: '#00cc66' }}>145°F (Pink is safe)</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}><span>Shoulder (Pulled Pork)</span><span>200°F</span><span style={{ color: '#ef4444' }}>205°F (Fat melts)</span></div>
              
              <strong style={{ color: '#fff', fontSize: '0.85em', display: 'block', marginBottom: '4px' }}>Bake & Smoke Times:</strong>
              <p style={{ color: '#aaa', fontSize: '0.8em', margin: '0 0 10px 0', lineHeight: '1.4' }}>• <strong>Chops:</strong> 400°F for 15-20 minutes.<br/>• <strong>Shoulder (Low & Slow):</strong> 225°F for 1.5 to 2 hours per pound until it shreds effortlessly.</p>
              
              <strong style={{ color: '#fff', fontSize: '0.85em', display: 'block', marginBottom: '4px' }}>Marinades & Flavor:</strong>
              <p style={{ color: '#aaa', fontSize: '0.8em', margin: 0, lineHeight: '1.4' }}>• <strong>Time:</strong> 4 - 12 Hours. Apple cider and soy sauce bases work exceptionally well.<br/>• <strong>Profile:</strong> Brown Sugar, Smoked Paprika, Mustard Powder, Fennel, Cumin, Sage.</p>
            </div>

            <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>🐟 Seafood (Salmon & Whitefish)</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold', fontSize: '0.9em', borderBottom: '1px solid #333', paddingBottom: '8px', marginBottom: '8px' }}><span>Type</span><span>Pull Temp</span><span>Rest Temp</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.85em', marginBottom: '5px' }}><span>Salmon (Medium)</span><span>130°F</span><span style={{ color: '#00cc66' }}>135°F (Flaky)</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.85em', marginBottom: '5px' }}><span>Whitefish (Cod/Tilapia)</span><span>140°F</span><span style={{ color: '#00cc66' }}>145°F (Opaque)</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}><span>Shrimp / Scallops</span><span>120°F</span><span style={{ color: '#f59e0b' }}>120°F (Curls to 'C')</span></div>
              
              <strong style={{ color: '#fff', fontSize: '0.85em', display: 'block', marginBottom: '4px' }}>Bake & Sear Times:</strong>
              <p style={{ color: '#aaa', fontSize: '0.8em', margin: '0 0 10px 0', lineHeight: '1.4' }}>• <strong>Bake:</strong> 400°F for 12-15 mins.<br/>• <strong>Pan Sear:</strong> High heat, 4 mins skin-side down, flip, 1 min flesh-side. Baste with butter.</p>
              
              <strong style={{ color: '#fff', fontSize: '0.85em', display: 'block', marginBottom: '4px' }}>Flavor Profile:</strong>
              <p style={{ color: '#aaa', fontSize: '0.8em', margin: 0, lineHeight: '1.4' }}>Dill, Lemon Zest, Capers, White Wine, Garlic, Tarragon. Keep marinades under 30 mins to prevent acid cooking (Ceviche effect).</p>
            </div>

            <div style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#a855f7' }}>🔥 Oil Smoke Points (Searing Guide)</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold', fontSize: '0.9em', borderBottom: '1px solid #333', paddingBottom: '8px', marginBottom: '8px' }}><span>Fat / Oil</span><span>Smoke Pt</span><span>Best Use</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.85em', marginBottom: '5px' }}><span>Butter</span><span style={{ color: '#ef4444' }}>302°F</span><span>Finishing/Basting</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.85em', marginBottom: '5px' }}><span>Extra Virgin Olive Oil</span><span style={{ color: '#f59e0b' }}>350°F</span><span>Sauté/Dressings</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.85em', marginBottom: '5px' }}><span>Beef Tallow / Lard</span><span style={{ color: '#00cc66' }}>400°F</span><span>Deep Fry/Roast</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}><span>Avocado / Grapeseed</span><span style={{ color: '#3b82f6' }}>520°F</span><span>Cast Iron Searing</span></div>
              <p style={{ color: '#aaa', fontSize: '0.8em', margin: 0, lineHeight: '1.4' }}><strong>Pro Tip:</strong> Never sear a steak in butter. Sear in Avocado oil or Tallow, turn off the heat, <em>then</em> add butter and aromatics to baste.</p>
            </div>

            <div style={{ ...cardStyle, borderLeft: '4px solid #8b5cf6' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#8b5cf6' }}>🪵 Smoking Woods Matrix</h3>
              <p style={{ color: '#aaa', fontSize: '0.8em', margin: '0 0 8px 0', lineHeight: '1.4' }}>• <strong>Apple / Cherry:</strong> Mild & sweet. Perfect for Pork, Poultry, and Salmon.<br/>• <strong>Hickory:</strong> Strong, savory, bacon-like. Best for Pork Ribs and Beef Roasts.<br/>• <strong>Mesquite:</strong> Extremely intense & earthy. Use ONLY for Beef Brisket/Steaks. Will overpower and ruin poultry.</p>
            </div>

            <div style={{ ...cardStyle, borderLeft: '4px solid #eab308' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#eab308' }}>🥚 Perfect Egg Boiling</h3>
              <p style={{ color: '#aaa', fontSize: '0.8em', margin: '0 0 8px 0', lineHeight: '1.4' }}><em>Drop large eggs straight from fridge into a rolling boil, then immediately ice bath.</em></p>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.85em', marginBottom: '5px' }}><span>6 Mins:</span><span style={{ color: '#f59e0b' }}>Liquid Yolk (Ramen Egg)</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.85em', marginBottom: '5px' }}><span>7 Mins:</span><span style={{ color: '#00cc66' }}>Jammy / Custard Yolk</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.85em', marginBottom: '5px' }}><span>9 Mins:</span><span style={{ color: '#3b82f6' }}>Firm but Creamy</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.85em' }}><span>11 Mins:</span><span style={{ color: '#ef4444' }}>Hard Boiled (Deviled Eggs)</span></div>
            </div>


          </div>
        )}

      </div>
    </div>
  );
}

export default function LifestyleCalc() {
  return <ErrorBoundary><LifestyleUI /></ErrorBoundary>;
}
