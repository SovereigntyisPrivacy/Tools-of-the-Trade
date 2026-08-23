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
          <p style={{ fontFamily: 'monospace', background: '#111', padding: '10px' }}>{this.state.error?.toString()}</p>
          <button onClick={() => window.history.back()} style={{ padding: '10px', background: '#333', color: '#fff', border: 'none', borderRadius: '8px' }}>Go Back</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function LifestyleUI() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Culinary');

  // --- CULINARY STATE ---
  const [origY, setOrigY] = useState('2');
  const [targetY, setTargetY] = useState('1');
  
  // Seeded with a default glaze baseline
  const [ingredients, setIngredients] = useState([
    { id: 1, qty: '1/2', unit: 'cup', name: 'Soy Sauce' },
    { id: 2, qty: '1/4', unit: 'cup', name: 'Honey' },
    { id: 3, qty: '4', unit: 'cloves', name: 'Garlic' }
  ]);
  
  const addIng = () => setIngredients([...ingredients, { id: Date.now(), qty: '', unit: 'tsp', name: '' }]);
  const updateIng = (id, field, val) => setIngredients(ingredients.map(i => i.id === id ? { ...i, [field]: val } : i));
  const removeIng = id => setIngredients(ingredients.filter(i => i.id !== id));

  // The Fraction Translation Engine
  const parseFraction = (str) => {
    if (!str) return 0;
    let total = 0;
    str.toString().trim().split(' ').forEach(p => {
      if (p.includes('/')) {
        const [n, d] = p.split('/');
        total += (parseFloat(n) / parseFloat(d)) || 0;
      } else { total += parseFloat(p) || 0; }
    });
    return total;
  };

  const decimalToFraction = (decimal) => {
    if (!decimal || isNaN(decimal)) return '';
    const w = Math.floor(decimal);
    const f = decimal - w;
    if (f < 0.05) return w > 0 ? w.toString() : '';
    if (f > 0.95) return (w + 1).toString();
    const fracs = [
        { v: 1/8, s: '1/8' }, { v: 1/4, s: '1/4' }, { v: 1/3, s: '1/3' },
        { v: 3/8, s: '3/8' }, { v: 1/2, s: '1/2' }, { v: 5/8, s: '5/8' },
        { v: 2/3, s: '2/3' }, { v: 3/4, s: '3/4' }, { v: 7/8, s: '7/8' }
    ];
    let closest = fracs[0], min = Math.abs(f - closest.v);
    for (let i=1; i<fracs.length; i++) {
        let diff = Math.abs(f - fracs[i].v);
        if (diff < min) { min = diff; closest = fracs[i]; }
    }
    return w === 0 ? closest.s : `${w} ${closest.s}`;
  };

  const multiplier = (parseFloat(targetY) || 1) / (parseFloat(origY) || 1);

  // Bake Adjuster
  const [origTime, setOrigTime] = useState('45');
  const [origTemp, setOrigTemp] = useState('350');
  const [newTemp, setNewTemp] = useState('400');
  const adjTime = (parseFloat(origTime)||0) * ((parseFloat(origTemp)||0) / (parseFloat(newTemp)||1));
  
  // Equilibrium Brine
  const [meatWt, setMeatWt] = useState('1500');
  const [liqWt, setLiqWt] = useState('1000');
  const [saltPct, setSaltPct] = useState('1.25');
  const brineSalt = ((parseFloat(meatWt)||0) + (parseFloat(liqWt)||0)) * ((parseFloat(saltPct)||0) / 100);

  // Baker's Percentages
  const [flour, setFlour] = useState('1000');
  const [wPct, setWPct] = useState('70');
  const [sPct, setSPct] = useState('2');
  const [yPct, setYPct] = useState('1');
  const bFlour = parseFloat(flour)||0;
  const bWater = bFlour * ((parseFloat(wPct)||0)/100);
  const bSalt = bFlour * ((parseFloat(sPct)||0)/100);
  const bYeast = bFlour * ((parseFloat(yPct)||0)/100);
  const bYield = bFlour + bWater + bSalt + bYeast;

  // --- FITNESS & HEALTH STATE ---
  const [liftWt, setLiftWt] = useState('225');
  const [liftReps, setLiftReps] = useState('5');
  const oneRM = (parseFloat(liftWt)||0) * (1 + ((parseFloat(liftReps)||0) / 30));

  const [bw, setBw] = useState('185');
  const [bh, setBh] = useState('71');
  const [ba, setBa] = useState('30');
  
  // Styles
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
              <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🍳 Master Recipe Scaler</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={{ color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold' }}>Original Yield</label><input type="number" value={origY} onChange={e=>setOrigY(e.target.value)} style={inputStyle} /></div>
                <div style={{ flex: 1 }}><label style={{ color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold' }}>Target Yield</label><input type="number" value={targetY} onChange={e=>setTargetY(e.target.value)} style={inputStyle} /></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px dashed #333' }}>
                <span style={{ color: '#aaa' }}>Multiplier:</span><strong style={{ color: '#00ffff' }}>{multiplier.toFixed(2)}x</strong>
              </div>
              
              {ingredients.map(ing => {
                const baseVal = parseFraction(ing.qty);
                const scaledVal = baseVal * multiplier;
                const fractionStr = decimalToFraction(scaledVal);
                
                return (
                  <div key={ing.id} style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #222', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
                      <input type="text" placeholder="Ingredient Name" value={ing.name} onChange={e=>updateIng(ing.id, 'name', e.target.value)} style={{ ...inputStyle, flex: 1, padding: '8px' }} />
                      <button onClick={() => removeIng(ing.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', width: '35px', fontWeight: 'bold' }}>X</button>
                    </div>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                      <input type="text" placeholder="Qty (e.g. 1 1/2)" value={ing.qty} onChange={e=>updateIng(ing.id, 'qty', e.target.value)} style={{ ...inputStyle, width: '90px', padding: '8px' }} />
                      <input type="text" placeholder="Unit" value={ing.unit} onChange={e=>updateIng(ing.id, 'unit', e.target.value)} style={{ ...inputStyle, width: '70px', padding: '8px' }} />
                      <span style={{ color: '#555', margin: '0 5px' }}>→</span>
                      <div style={{ color: '#00ffff', fontWeight: 'bold', flex: 1, textAlign: 'right' }}>
                        {scaledVal > 0 ? `${scaledVal.toFixed(2)} ${ing.unit}` : '-'}
                        {fractionStr && scaledVal > 0 && <span style={{ color: '#aaa', fontSize: '0.85em', display: 'block' }}>(~{fractionStr} {ing.unit})</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              <button onClick={addIng} style={{ width: '100%', padding: '12px', background: '#222', color: '#fff', border: '1px dashed #555', borderRadius: '8px', marginTop: '10px' }}>+ Add Ingredient</button>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>⏱️ Bake Time Adjuster</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={{ color: '#aaa', fontSize: '0.75em' }}>Orig Time (m)</label><input type="number" value={origTime} onChange={e=>setOrigTime(e.target.value)} style={inputStyle} /></div>
                <div style={{ flex: 1 }}><label style={{ color: '#aaa', fontSize: '0.75em' }}>Orig Temp (°F)</label><input type="number" value={origTemp} onChange={e=>setOrigTemp(e.target.value)} style={inputStyle} /></div>
                <div style={{ flex: 1 }}><label style={{ color: '#f59e0b', fontSize: '0.75em', fontWeight: 'bold' }}>New Temp (°F)</label><input type="number" value={newTemp} onChange={e=>setNewTemp(e.target.value)} style={inputStyle} /></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#aaa' }}>Adjusted Bake Time:</span><strong style={{ color: '#f59e0b', fontSize: '1.2em' }}>{adjTime.toFixed(1)} min</strong>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🥩 Equilibrium Brine</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={{ color: '#ef4444', fontSize: '0.75em', fontWeight: 'bold' }}>Meat (grams)</label><input type="number" value={meatWt} onChange={e=>setMeatWt(e.target.value)} style={inputStyle} /></div>
                <div style={{ flex: 1 }}><label style={{ color: '#00ffff', fontSize: '0.75em', fontWeight: 'bold' }}>Liquid (grams)</label><input type="number" value={liqWt} onChange={e=>setLiqWt(e.target.value)} style={inputStyle} /></div>
              </div>
              <select value={saltPct} onChange={e=>setSaltPct(e.target.value)} style={{ ...inputStyle, marginBottom: '15px' }}>
                <option value="1.25">1.25% (Mild - Fish, Poultry Breast)</option>
                <option value="1.5">1.50% (Standard - Pork, Chicken)</option>
                <option value="2.0">2.00% (Heavy - Large Roasts)</option>
              </select>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
                <span style={{ color: '#aaa' }}>Required Salt:</span><strong style={{ color: '#00cc66', fontSize: '1.2em' }}>{brineSalt.toFixed(1)} grams</strong>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🍞 Baker's Percentages</h3>
              <label style={{ color: '#f59e0b', fontSize: '0.8em', fontWeight: 'bold' }}>Total Flour (grams)</label>
              <input type="number" value={flour} onChange={e=>setFlour(e.target.value)} style={{ ...inputStyle, marginBottom: '15px' }} />
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={{ color: '#00ffff', fontSize: '0.75em' }}>Water (%)</label><input type="number" value={wPct} onChange={e=>setWPct(e.target.value)} style={inputStyle} /></div>
                <div style={{ flex: 1 }}><label style={{ color: '#aaa', fontSize: '0.75em' }}>Salt (%)</label><input type="number" value={sPct} onChange={e=>setSPct(e.target.value)} style={inputStyle} /></div>
                <div style={{ flex: 1 }}><label style={{ color: '#f59e0b', fontSize: '0.75em' }}>Yeast (%)</label><input type="number" value={yPct} onChange={e=>setYPct(e.target.value)} style={inputStyle} /></div>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Water:</span> <span style={{ color: '#00ffff' }}>{bWater.toFixed(1)} g</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Salt:</span> <span>{bSalt.toFixed(1)} g</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed #333' }}><span>Yeast:</span> <span style={{ color: '#f59e0b' }}>{bYeast.toFixed(1)} g</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: '#fff' }}>Dough Yield:</strong> <strong style={{ color: '#00cc66' }}>{bYield.toFixed(1)} g</strong></div>
              </div>
            </div>
          </>
        )}
        {activeTab === 'Fitness' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🏋️ Kinetic Strength (1RM)</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={{ color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold' }}>Weight Lifted (lbs)</label><input type="number" value={liftWt} onChange={e=>setLiftWt(e.target.value)} style={inputStyle} /></div>
                <div style={{ flex: 1 }}><label style={{ color: '#ef4444', fontSize: '0.8em', fontWeight: 'bold' }}>Reps</label><input type="number" value={liftReps} onChange={e=>setLiftReps(e.target.value)} style={inputStyle} /></div>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #333' }}>
                  <strong style={{ color: '#fff', fontSize: '1.2em' }}>1-Rep Max:</strong>
                  <strong style={{ color: '#ef4444', fontSize: '1.5em' }}>{oneRM.toFixed(0)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px' }}><span>90% (Heavy Double):</span> <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{(oneRM*0.9).toFixed(0)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px' }}><span>80% (5x5 Working):</span> <span style={{ color: '#00cc66', fontWeight: 'bold' }}>{(oneRM*0.8).toFixed(0)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}><span>70% (Speed):</span> <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{(oneRM*0.7).toFixed(0)}</span></div>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #ec4899' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>💓 Cardio & Heart Rate</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#000', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                <span style={{ color: '#aaa' }}>Absolute Max HR (Est):</span>
                <strong style={{ color: '#ec4899' }}>{220 - (parseFloat(ba)||30)} BPM</strong>
              </div>
              <div style={{ padding: '15px', background: '#000', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px' }}><span>Zone 2 (Fat Burn):</span> <span style={{ color: '#00cc66', fontWeight: 'bold' }}>{Math.round((220-(parseFloat(ba)||30))*0.6)} - {Math.round((220-(parseFloat(ba)||30))*0.7)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px' }}><span>Zone 3 (Aerobic):</span> <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{Math.round((220-(parseFloat(ba)||30))*0.7)} - {Math.round((220-(parseFloat(ba)||30))*0.8)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}><span>Zone 5 (VO2 Max):</span> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{Math.round((220-(parseFloat(ba)||30))*0.9)} - {220-(parseFloat(ba)||30)}</span></div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'Health' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #00cc66' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🔥 Metabolic, BMI & Diet</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={{ color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold' }}>Weight (lbs)</label><input type="number" value={bw} onChange={e=>setBw(e.target.value)} style={inputStyle} /></div>
                <div style={{ flex: 1 }}><label style={{ color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold' }}>Height (in)</label><input type="number" value={bh} onChange={e=>setBh(e.target.value)} style={inputStyle} /></div>
                <div style={{ flex: 1 }}><label style={{ color: '#3b82f6', fontSize: '0.8em', fontWeight: 'bold' }}>Age</label><input type="number" value={ba} onChange={e=>setBa(e.target.value)} style={inputStyle} /></div>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px' }}><span>BMI Score:</span> <strong style={{ color: '#f59e0b' }}>{((parseFloat(bw)||0) / Math.pow(parseFloat(bh)||1, 2) * 703).toFixed(1)}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed #333' }}><span>Resting BMR:</span> <strong style={{ color: '#00ffff' }}>{Math.round(10 * ((parseFloat(bw)||0)*0.453592) + 6.25 * ((parseFloat(bh)||0)*2.54) - 5 * (parseFloat(ba)||30) + 5)} kcal</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#fff' }}>Target Intake (Maint):</strong>
                  <strong style={{ color: '#f59e0b', fontSize: '1.2em' }}>{Math.round((10 * ((parseFloat(bw)||0)*0.453592) + 6.25 * ((parseFloat(bh)||0)*2.54) - 5 * (parseFloat(ba)||30) + 5) * 1.55)} kcal</strong>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'Reference' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #00cc66' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🌡️ Pull Temps (Field Guide)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: '#000', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid #222' }}>
                  <div style={{ color: '#00cc66', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '8px' }}>Poultry (Dark/Bone)</div>
                  <div style={{ color: '#aaa', fontSize: '0.8em' }}>Pull: 170°F - 175°F</div>
                </div>
                <div style={{ background: '#000', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid #222' }}>
                  <div style={{ color: '#00cc66', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '8px' }}>Poultry (Breast)</div>
                  <div style={{ color: '#aaa', fontSize: '0.8em' }}>Pull: 155°F (Rest 165°F)</div>
                </div>
                <div style={{ background: '#000', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid #222' }}>
                  <div style={{ color: '#00cc66', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '8px' }}>Pork Loin / Chops</div>
                  <div style={{ color: '#aaa', fontSize: '0.8em' }}>Pull: 140°F (Rest 145°F)</div>
                </div>
                <div style={{ background: '#000', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid #222' }}>
                  <div style={{ color: '#00cc66', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '8px' }}>Beef (Med-Rare)</div>
                  <div style={{ color: '#aaa', fontSize: '0.8em' }}>Pull: 125°F (Rest 135°F)</div>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default function LifestyleCalc() {
  return <ErrorBoundary><LifestyleUI /></ErrorBoundary>;
}
