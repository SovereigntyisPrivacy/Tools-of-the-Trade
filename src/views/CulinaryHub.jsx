import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CulinaryHub() {
  const navigate = useNavigate();
  
  // --- MAIN TABS ---
  const [activeTab, setActiveTab] = useState('Tools');
  const [toolsTab, setToolsTab] = useState('Converter');
  const [refTab, setRefTab] = useState('Conversions');

  // --- CONVERTER STATE ---
  const [convAmt, setConvAmt] = useState('1 3/4');
  const [convFrom, setConvFrom] = useState('Cups');
  const [convTo, setConvTo] = useState('Grams');
  const [convIng, setConvIng] = useState('Flour (AP)');

  // --- RECIPE CHECKLIST STATE ---
  const [recipes, setRecipes] = useState(() => JSON.parse(localStorage.getItem('tot_recipes_v1')) || []);
  const [showRecBuilder, setShowRecBuilder] = useState(false);
  const [newRec, setNewRec] = useState({ title: '', ingredients: '', steps: '' });
  const [activeRecipeId, setActiveRecipeId] = useState(null);

  // --- EXISTING TOOL STATE ---
  const [bakeFlour, setBakeFlour] = useState(1000);
  const [bakeHyd, setBakeHyd] = useState(70);
  const [bakeSalt, setBakeSalt] = useState(2);
  const [bakeYeast, setBakeYeast] = useState(1);

  const [brineMeat, setBrineMeat] = useState(1500);
  const [brineLiq, setBrineLiq] = useState(1000);
  const [brinePct, setBrinePct] = useState(1.25);

  const [scaleOrig, setScaleOrig] = useState(2);
  const [scaleTarget, setScaleTarget] = useState(1);
  const [scaleIngs, setScaleIngs] = useState([{ id: 1, name: 'Soy Sauce', amt: 0.5, unit: 'cup', approx: '~(1/4 cup)' }]);

  // --- UNIVERSAL CONVERSION DATA ---
  const volUnits = { 'tsp': 4.92892, 'Tbsp': 14.7868, 'fl oz': 29.5735, 'Cups': 236.588, 'Pints': 473.176, 'Quarts': 946.353, 'Gallons': 3785.41, 'mL': 1, 'Liters': 1000 };
  const massUnits = { 'Grams': 1, 'Ounces': 28.3495, 'Pounds': 453.592, 'Kilograms': 1000 };
  // Density = Grams per 1 US Cup (236.588 mL)
  
  // Helper to convert decimals back to clean kitchen fractions
  const toKitchenFraction = (decimal) => {
    if (!decimal || isNaN(decimal)) return "";
    const whole = Math.floor(decimal);
    const remainder = decimal - whole;
    const tolerance = 0.04;
    const fractions = [
      { val: 0.125, text: "1/8" },
      { val: 0.25, text: "1/4" },
      { val: 0.333, text: "1/3" },
      { val: 0.375, text: "3/8" },
      { val: 0.5, text: "1/2" },
      { val: 0.625, text: "5/8" },
      { val: 0.666, text: "2/3" },
      { val: 0.75, text: "3/4" },
      { val: 0.875, text: "7/8" }
    ];
    for (let f of fractions) {
      if (Math.abs(remainder - f.val) < tolerance) {
        return whole > 0 ? ` (~ ${whole} ${f.text})` : ` (~ ${f.text})`;
      }
    }
    return "";
  };

  const densities = { 'Flour (AP)': 125, 'Sugar (White)': 200, 'Sugar (Brown)': 220, 'Butter': 227, 'Water / Liquid': 236, 'Milk': 245, 'Salt (Kosher)': 130, 'Salt (Table)': 273, 'Honey / Syrup': 340, 'Oil': 216 };


  // Persistence
  useEffect(() => { localStorage.setItem('tot_recipes_v1', JSON.stringify(recipes)); }, [recipes]);

  // --- FRACTION PARSER LOGIC ---
  const parseFraction = (val) => {
    if (!val) return 0;
    const str = String(val).trim();
    if (!str.includes('/')) return parseFloat(str) || 0;
    const parts = str.split(' ');
    let whole = 0, frac = str;
    if (parts.length > 1) { whole = parseFloat(parts[0]); frac = parts[1]; }
    const [num, den] = frac.split('/');
    return whole + (parseFloat(num) / parseFloat(den));
  };

  // --- MASTER CONVERTER MATH ---
  let convResult = 0;
  const baseAmt = parseFraction(convAmt);
  const isFromVol = convFrom in volUnits;
  const isToVol = convTo in volUnits;
  
  // Is this a Mass <-> Volume crossover?
  const needsDensity = (isFromVol && !isToVol) || (!isFromVol && isToVol);

  if (isFromVol && isToVol) {
    convResult = (baseAmt * volUnits[convFrom]) / volUnits[convTo];
  } else if (!isFromVol && !isToVol) {
    convResult = (baseAmt * massUnits[convFrom]) / massUnits[convTo];
  } else if (isFromVol && !isToVol) {
    const gPerMl = densities[convIng] / 236.588;
    const grams = baseAmt * volUnits[convFrom] * gPerMl;
    convResult = grams / massUnits[convTo];
  } else {
    const gPerMl = densities[convIng] / 236.588;
    const ml = (baseAmt * massUnits[convFrom]) / gPerMl;
    convResult = ml / volUnits[convTo];
  }

  // --- EXISTING CALCULATOR MATH ---
  const bWater = Math.round((bakeFlour * bakeHyd) / 100);
  const bSalt = Math.round((bakeFlour * bakeSalt) / 100);
  const bYeast = Math.round((bakeFlour * bakeYeast) / 100);
  const bYield = bakeFlour + bWater + bSalt + bYeast;
  const reqSalt = (((parseFloat(brineMeat)||0) + (parseFloat(brineLiq)||0)) * (brinePct / 100)).toFixed(1);
  const multiplier = ((parseFloat(scaleTarget)||1) / (parseFloat(scaleOrig)||1));

  // --- RECIPE BUILDER LOGIC ---
  const saveRecipe = () => {
    if (!newRec.title) return alert("Please enter a title.");
    const ingArray = newRec.ingredients.split('\n').filter(i => i.trim() !== '').map(i => ({ text: i, done: false }));
    const stepArray = newRec.steps.split('\n').filter(s => s.trim() !== '').map(s => ({ text: s, done: false }));
    setRecipes([{ id: Date.now(), title: newRec.title, ings: ingArray, steps: stepArray }, ...recipes]);
    setNewRec({ title: '', ingredients: '', steps: '' }); setShowRecBuilder(false);
  };
  const toggleRecItem = (recId, type, idx) => {
    setRecipes(recipes.map(r => {
      if (r.id !== recId) return r;
      const updated = { ...r };
      updated[type][idx].done = !updated[type][idx].done;
      return updated;
    }));
  };
  const deleteRecipe = (id) => { if(window.confirm("Delete this recipe?")) setRecipes(recipes.filter(r => r.id !== id)); };

  
  const swapUnits = () => {
    const temp = convFrom;
    setConvFrom(convTo);
    setConvTo(temp);
  };

  const addScaleIng = () => setScaleIngs([...scaleIngs, { id: Date.now(), name: '', amt: 1, unit: 'unit', approx: '' }]);
  const updateScaleIng = (id, field, val) => setScaleIngs(scaleIngs.map(ing => ing.id === id ? { ...ing, [field]: val } : ing));
  const removeScaleIng = (id) => setScaleIngs(scaleIngs.filter(ing => ing.id !== id));

  // --- STYLES ---
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const inputStyle = { background: '#000', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' };
  const btnStyle = (bg, color) => ({ background: bg, color: color, border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', width: '100%', cursor: 'pointer' });
  const rowStyle = { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #222' };


  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/')} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#ef4444', fontSize: '1.2rem' }}>Culinary Engine</h2>
      </header>

      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333' }}>
        {['Tools', 'Recipes', 'Reference'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '12px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === tab ? '#f59e0b' : 'transparent', color: activeTab === tab ? '#000' : '#888', transition: 'all 0.2s' }}>{tab}</button>
        ))}
      </div>

      <div style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '80px' }}>
        
        {activeTab === 'Tools' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', background: '#000', padding: '5px', borderRadius: '8px', border: '1px solid #333', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {['Converter', 'Baker %', 'Brine', 'Scaler'].map(t => (
                <button key={t} onClick={() => setToolsTab(t)} style={{ flex: '1 0 auto', padding: '8px 12px', background: toolsTab === t ? '#333' : 'transparent', color: toolsTab === t ? '#00ffff' : '#888', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>{t}</button>
              ))}
            </div>

            {toolsTab === 'Converter' && (
              <div style={{ ...cardStyle, borderTop: '4px solid #00ffff' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#00ffff', textAlign: 'center' }}>⚖️ Master Converter</h3>
                <p style={{ color: '#aaa', fontSize: '0.8rem', textAlign: 'center', marginBottom: '15px' }}>Accepts fractions (e.g., "1 3/4") and decimals.</p>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "8px", alignItems: "end", marginBottom: "15px" }}>
                  <div>
                    <label style={{display:"block", color:"#aaa", fontSize:"0.8rem", fontWeight:"bold", marginBottom:"5px"}}>From</label>
                    <select value={convFrom} onChange={e=>setConvFrom(e.target.value)} style={inputStyle}>
                      <optgroup label="Volume">{Object.keys(volUnits).map(k=><option key={k}>{k}</option>)}</optgroup>
                      <optgroup label="Mass / Weight">{Object.keys(massUnits).map(k=><option key={k}>{k}</option>)}</optgroup>
                    </select>
                  </div>
                  <button onClick={swapUnits} title="Swap Units" style={{ background: "#222", border: "1px solid #444", color: "#00ffff", padding: "10px 12px", borderRadius: "8px", fontSize: "1.2rem", cursor: "pointer", height: "46px" }}>⇄</button>
                  <div>
                    <label style={{display:"block", color:"#10b981", fontSize:"0.8rem", fontWeight:"bold", marginBottom:"5px"}}>To</label>
                    <select value={convTo} onChange={e=>setConvTo(e.target.value)} style={inputStyle}>
                      <optgroup label="Volume">{Object.keys(volUnits).map(k=><option key={k}>{k}</option>)}</optgroup>
                      <optgroup label="Mass / Weight">{Object.keys(massUnits).map(k=><option key={k}>{k}</option>)}</optgroup>
                    </select>
                  </div>
                </div>

                {needsDensity && (
                  <div style={{ marginBottom: '20px', padding: '10px', background: 'rgba(245, 158, 11, 0.1)', border: '1px dashed #f59e0b', borderRadius: '8px' }}>
                    <label style={{display:'block', color:'#f59e0b', fontSize:'0.8rem', fontWeight:'bold', marginBottom:'5px'}}>Ingredient Density Required</label>
                    <select value={convIng} onChange={e=>setConvIng(e.target.value)} style={inputStyle}>{Object.keys(densities).map(k=><option key={k}>{k}</option>)}</select>
                  </div>
                )}

                <div style={{ background: '#000', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid #222' }}>
                  <span style={{ color: '#aaa' }}>Converted Result:</span>
                  <strong style={{ display: "block", color: "#10b981", fontSize: "2.3rem", marginTop: "5px" }}>{convResult.toFixed(2)} <span style={{fontSize:"1.2rem"}}>{convTo}</span><span style={{color: "#f59e0b", fontSize: "1.2rem", display: "block", marginTop: "4px"}}>{toKitchenFraction(convResult)}</span></strong>
                </div>
              </div>
            )}

            {toolsTab === 'Baker %' && (
              <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#f59e0b', textAlign: 'center' }}>🍞 Interactive Baker's %</h3>
                <label style={{display:'block', color:'#f59e0b', fontSize:'0.85rem', fontWeight:'bold', marginBottom:'5px', textAlign:'center'}}>Total Flour (grams)</label>
                <input type="number" value={bakeFlour} onChange={e=>setBakeFlour(parseFloat(e.target.value)||0)} style={{...inputStyle, marginBottom: '20px', textAlign: 'center', fontSize: '1.2rem'}} />
                <label style={{display:'block', color:'#00ffff', fontSize:'0.85rem', fontWeight:'bold', marginBottom:'5px', textAlign:'center'}}>Hydration (Water %): <span style={{color:'#fff'}}>{bakeHyd}%</span></label>
                <input type="range" min="40" max="100" value={bakeHyd} onChange={e=>setBakeHyd(e.target.value)} style={{width: '100%', marginBottom: '20px', accentColor: '#00ffff'}} />
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                  <div style={{flex: 1}}><label style={{display:'block', color:'#aaa', fontSize:'0.85rem', fontWeight:'bold', marginBottom:'5px', textAlign:'center'}}>Salt: {bakeSalt}%</label><input type="range" min="0" max="4" step="0.5" value={bakeSalt} onChange={e=>setBakeSalt(e.target.value)} style={{width: '100%'}} /></div>
                  <div style={{flex: 1}}><label style={{display:'block', color:'#f59e0b', fontSize:'0.85rem', fontWeight:'bold', marginBottom:'5px', textAlign:'center'}}>Yeast: {bakeYeast}%</label><input type="range" min="0" max="4" step="0.5" value={bakeYeast} onChange={e=>setBakeYeast(e.target.value)} style={{width: '100%', accentColor: '#f59e0b'}} /></div>
                </div>
                <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
                  <div style={rowStyle}><span style={{color:'#aaa'}}>Water:</span><strong style={{color:'#00ffff'}}>{bWater} g</strong></div>
                  <div style={rowStyle}><span style={{color:'#aaa'}}>Salt:</span><strong style={{color:'#ccc'}}>{bSalt.toFixed(1)} g</strong></div>
                  <div style={{...rowStyle, borderBottom: 'none'}}><span style={{color:'#aaa'}}>Yeast:</span><strong style={{color:'#f59e0b'}}>{bYeast.toFixed(1)} g</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '15px', marginTop: '10px', borderTop: '1px dashed #444', fontSize: '1.1rem' }}><strong style={{color:'#fff'}}>Dough Yield:</strong><strong style={{color:'#10b981'}}>{bYield.toFixed(0)} g</strong></div>
                </div>
              </div>
            )}

            {toolsTab === 'Brine' && (
              <div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#ef4444', textAlign: 'center' }}>🥩 Equilibrium Brine</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <div style={{flex: 1}}><label style={{display:'block', color:'#ef4444', fontSize:'0.8rem', fontWeight:'bold', marginBottom:'5px'}}>Meat (grams)</label><input type="number" value={brineMeat} onChange={e=>setBrineMeat(e.target.value)} style={inputStyle} /></div>
                  <div style={{flex: 1}}><label style={{display:'block', color:'#00ffff', fontSize:'0.8rem', fontWeight:'bold', marginBottom:'5px'}}>Liquid (grams)</label><input type="number" value={brineLiq} onChange={e=>setBrineLiq(e.target.value)} style={inputStyle} /></div>
                </div>
                <select value={brinePct} onChange={e=>setBrinePct(e.target.value)} style={{...inputStyle, marginBottom: '20px'}}>
                  <option value="1.00">1.00% (Very Mild)</option><option value="1.25">1.25% (Mild - Fish, Poultry)</option><option value="1.50">1.50% (Standard - Pork, Chicken)</option><option value="1.75">1.75% (Strong)</option><option value="2.00">2.00% (Very Strong - Beef)</option>
                </select>
                <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222', textAlign: 'center' }}>
                  <span style={{ color: '#aaa', marginRight: '10px' }}>Required Salt:</span>
                  <strong style={{ color: '#10b981', fontSize: '1.5rem' }}>{reqSalt} grams</strong>
                </div>
              </div>
            )}

            {toolsTab === 'Scaler' && (
              <div style={{ ...cardStyle, borderTop: '4px solid #8b5cf6' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#a855f7', textAlign: 'center' }}>🍳 Recipe Scaler</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <div style={{flex: 1}}><label style={{display:'block', color:'#a855f7', fontSize:'0.8rem', fontWeight:'bold', marginBottom:'5px', textAlign:'center'}}>Orig Yield</label><input type="number" value={scaleOrig} onChange={e=>setScaleOrig(e.target.value)} style={{...inputStyle, textAlign:'center'}} /></div>
                  <div style={{flex: 1}}><label style={{display:'block', color:'#a855f7', fontSize:'0.8rem', fontWeight:'bold', marginBottom:'5px', textAlign:'center'}}>Target Yield</label><input type="number" value={scaleTarget} onChange={e=>setScaleTarget(e.target.value)} style={{...inputStyle, textAlign:'center'}} /></div>
                </div>
                <div style={{ textAlign: 'center', color: '#aaa', marginBottom: '20px' }}>Multiplier: <strong style={{color:'#a855f7'}}>{multiplier.toFixed(2)}x</strong></div>
                {scaleIngs.map((ing) => (
                  <div key={ing.id} style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #222', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input type="text" placeholder="Ingredient" value={ing.name} onChange={e=>updateScaleIng(ing.id, 'name', e.target.value)} style={{...inputStyle, flex: 1, padding: '8px'}} />
                      <button onClick={() => removeScaleIng(ing.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', width: '40px' }}>X</button>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input type="number" value={ing.amt} onChange={e=>updateScaleIng(ing.id, 'amt', e.target.value)} style={{...inputStyle, width: '70px', padding: '8px'}} />
                      <span style={{color:'#ccc'}}>{ing.unit}</span><span style={{color:'#555'}}>=&gt;</span>
                      <div style={{ flex: 1, textAlign: 'right' }}><strong style={{color:'#a855f7', display:'block', fontSize:'1.1rem'}}>{(ing.amt * multiplier).toFixed(2)}</strong>{ing.approx && <span style={{color:'#888', fontSize:'0.8rem'}}>{ing.approx}</span>}</div>
                    </div>
                  </div>
                ))}
                <button onClick={addScaleIng} style={{ background: '#222', color: '#aaa', border: '1px dashed #444', padding: '12px', borderRadius: '8px', width: '100%', marginTop: '10px' }}>+ Add Ingredient</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Recipes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button onClick={() => setShowRecBuilder(!showRecBuilder)} style={btnStyle('transparent', '#10b981', {border: '1px dashed #10b981'})}>{showRecBuilder ? 'Cancel Builder' : '+ Add New Recipe'}</button>
            
            {showRecBuilder && (
              <div style={{ ...cardStyle, border: '1px solid #10b981' }}>
                <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '15px', fontStyle: 'italic', textAlign: 'center' }}>Pro Tip: Open your camera, copy text from a physical recipe book, and paste it directly into the boxes below!</p>
                <input type="text" placeholder="Recipe Title" value={newRec.title} onChange={e=>setNewRec({...newRec, title: e.target.value})} style={{...inputStyle, marginBottom: '10px', fontSize: '1.2rem'}} />
                <label style={{display:'block', color:'#00ffff', fontSize:'0.85rem', fontWeight:'bold', marginBottom:'5px'}}>Ingredients (Paste one per line)</label>
                <textarea placeholder="2 cups flour&#10;1 tsp salt" value={newRec.ingredients} onChange={e=>setNewRec({...newRec, ingredients: e.target.value})} style={{...inputStyle, height: '100px', marginBottom: '15px'}} />
                <label style={{display:'block', color:'#f59e0b', fontSize:'0.85rem', fontWeight:'bold', marginBottom:'5px'}}>Steps (Paste one per line)</label>
                <textarea placeholder="Mix dry ingredients.&#10;Add wet ingredients." value={newRec.steps} onChange={e=>setNewRec({...newRec, steps: e.target.value})} style={{...inputStyle, height: '100px', marginBottom: '15px'}} />
                <button onClick={saveRecipe} style={btnStyle('#10b981', '#000')}>💾 Save to Recipe Book</button>
              </div>
            )}

            {recipes.map(rec => (
              <div key={rec.id} style={{ ...cardStyle, borderTop: activeRecipeId === rec.id ? '4px solid #10b981' : '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: activeRecipeId === rec.id ? '15px' : '0' }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setActiveRecipeId(activeRecipeId === rec.id ? null : rec.id)}>{rec.title}</h3>
                  <button onClick={() => deleteRecipe(rec.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontWeight: 'bold' }}>🗑️ Delete</button>
                </div>
                
                {activeRecipeId === rec.id && (
                  <div>
                    <h4 style={{ color: '#00ffff', margin: '10px 0 5px 0', borderBottom: '1px dashed #333', paddingBottom: '5px' }}>Ingredients</h4>
                    {rec.ings.map((ing, i) => (
                      <div key={i} onClick={() => toggleRecItem(rec.id, 'ings', i)} style={{ padding: '8px', marginBottom: '5px', background: ing.done ? 'rgba(16, 185, 129, 0.1)' : '#000', border: ing.done ? '1px solid #10b981' : '1px solid #222', borderRadius: '6px', color: ing.done ? '#888' : '#fff', textDecoration: ing.done ? 'line-through' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                        {ing.done ? '✓ ' : '⬜ '}{ing.text}
                      </div>
                    ))}

                    <h4 style={{ color: '#f59e0b', margin: '15px 0 5px 0', borderBottom: '1px dashed #333', paddingBottom: '5px' }}>Steps</h4>
                    {rec.steps.map((step, i) => (
                      <div key={i} onClick={() => toggleRecItem(rec.id, 'steps', i)} style={{ padding: '10px', marginBottom: '5px', background: step.done ? 'rgba(16, 185, 129, 0.1)' : '#000', border: step.done ? '1px solid #10b981' : '1px solid #222', borderRadius: '6px', color: step.done ? '#888' : '#fff', textDecoration: step.done ? 'line-through' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <strong style={{color: step.done ? '#10b981' : '#f59e0b'}}>{i + 1}. </strong>{step.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Reference' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', background: '#000', padding: '5px', borderRadius: '8px', border: '1px solid #333', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {['Conversions', 'Meats', 'Seafood', 'Guides'].map(t => (
                <button key={t} onClick={() => setRefTab(t)} style={{ flex: '1 0 auto', padding: '8px 12px', background: refTab === t ? '#333' : 'transparent', color: refTab === t ? '#f59e0b' : '#888', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>{t}</button>
              ))}
            </div>

            {refTab === 'Conversions' && (
              <div style={{ ...cardStyle, borderLeft: '4px solid #00ffff' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#00ffff', textAlign: 'center' }}>📏 Kitchen Equivalents</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', color: '#aaa', fontSize: '0.9rem', marginBottom: '15px' }}>
                  <div style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #222' }}><strong style={{color:'#fff', display:'block'}}>3 tsp</strong> = 1 Tbsp</div>
                  <div style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #222' }}><strong style={{color:'#fff', display:'block'}}>4 Tbsp</strong> = 1/4 Cup</div>
                  <div style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #222' }}><strong style={{color:'#fff', display:'block'}}>16 Tbsp</strong> = 1 Cup</div>
                  <div style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #222' }}><strong style={{color:'#fff', display:'block'}}>2 Cups</strong> = 1 Pint</div>
                  <div style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #222' }}><strong style={{color:'#fff', display:'block'}}>2 Pints</strong> = 1 Quart</div>
                  <div style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #222' }}><strong style={{color:'#fff', display:'block'}}>4 Quarts</strong> = 1 Gallon</div>
                  <div style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #222', gridColumn: 'span 2' }}><strong style={{color:'#fff', display:'block'}}>1 Cup (Liquid)</strong> = 8 fl oz = 236.5 mL</div>
                </div>
                <p style={{ color: '#aaa', fontSize: '0.85rem', lineHeight: '1.4', textAlign: 'center', background: 'rgba(59, 130, 246, 0.1)', padding: '10px', borderRadius: '8px', border: '1px dashed #3b82f6' }}>Fluid Ounces (fl oz) measure <strong>Volume</strong>. Regular Ounces (oz) measure <strong>Weight/Mass</strong>. 1 cup of Flour is NOT 8 ounces of weight!</p>
              </div>
            )}

            {refTab === 'Meats' && (
              <>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#ef4444' }}>🥩 Beef (Steaks & Roasts)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '5px', fontWeight: 'bold', color: '#fff', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '5px' }}><span>Doneness</span><span>Pull Temp</span><span>Rest Temp</span></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '5px', color: '#aaa', marginBottom: '8px' }}><span>Rare <span style={{fontSize:'0.75rem'}}>(Cool Red)</span></span><strong style={{color:'#ef4444'}}>120°F</strong><span>125°F</span></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '5px', color: '#aaa', marginBottom: '8px' }}><span>Med-Rare <span style={{fontSize:'0.75rem'}}>(Warm Red)</span></span><strong style={{color:'#f59e0b'}}>130°F</strong><span>135°F</span></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '5px', color: '#aaa', marginBottom: '15px' }}><span>Medium <span style={{fontSize:'0.75rem'}}>(Warm Pink)</span></span><strong style={{color:'#10b981'}}>140°F</strong><span>145°F</span></div>
                  <h4 style={{ color: '#fff', margin: '0 0 5px 0', textAlign: 'center' }}>Bake & Sear (Reverse Sear):</h4>
                  <p style={{ color: '#aaa', fontSize: '0.85rem', lineHeight: '1.4', textAlign: 'center' }}>Bake at 250°F until internal temp is 15°F below target. Rest 10 mins. Sear on cast iron (500°F+) for 1 min per side.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#f59e0b' }}>🍗 Poultry (Chicken & Turkey)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '5px', fontWeight: 'bold', color: '#fff', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '5px' }}><span>Cut</span><span>Pull Temp</span><span>Rest Temp</span></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '5px', color: '#aaa', marginBottom: '8px' }}><span>White Meat <span style={{fontSize:'0.75rem'}}>(Breast)</span></span><strong style={{color:'#10b981'}}>155°F</strong><span>165°F <span style={{fontSize:'0.75rem'}}>(Safe)</span></span></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '5px', color: '#aaa', marginBottom: '15px' }}><span>Dark Meat <span style={{fontSize:'0.75rem'}}>(Thigh/Leg)</span></span><strong style={{color:'#f59e0b'}}>170°F</strong><span>175°F <span style={{fontSize:'0.75rem'}}>(Tender)</span></span></div>
                  <h4 style={{ color: '#fff', margin: '0 0 5px 0', textAlign: 'center' }}>Bake Times:</h4>
                  <p style={{ color: '#aaa', fontSize: '0.85rem', lineHeight: '1.4', textAlign: 'center' }}><strong style={{color:'#ccc'}}>Breasts:</strong> 375°F for 20-30 minutes.<br/><strong style={{color:'#ccc'}}>Whole Bird:</strong> 350°F for 20 mins per pound.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#ef4444' }}>🥓 Pork (Chops & Shoulder)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '5px', fontWeight: 'bold', color: '#fff', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '5px' }}><span>Cut</span><span>Pull Temp</span><span>Rest Temp</span></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '5px', color: '#aaa', marginBottom: '8px', alignItems: 'center' }}><span>Chops / Tenderloin</span><strong style={{color:'#10b981'}}>140°F</strong><span>145°F <span style={{fontSize:'0.7rem'}}>(Pink is safe)</span></span></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '5px', color: '#aaa', marginBottom: '15px', alignItems: 'center' }}><span>Shoulder <span style={{fontSize:'0.75rem'}}>(Pulled Pork)</span></span><strong style={{color:'#ef4444'}}>200°F</strong><span>205°F <span style={{fontSize:'0.7rem'}}>(Fat melts)</span></span></div>
                  <h4 style={{ color: '#fff', margin: '0 0 5px 0', textAlign: 'center' }}>Bake & Smoke Times:</h4>
                  <p style={{ color: '#aaa', fontSize: '0.85rem', lineHeight: '1.4', textAlign: 'center' }}><strong style={{color:'#ccc'}}>Chops:</strong> 400°F for 15-20 minutes.<br/><strong style={{color:'#ccc'}}>Shoulder (Low & Slow):</strong> 225°F for 1.5 to 2 hours per pound until it shreds effortlessly.</p>
                </div>
              </>
            )}

            {refTab === 'Seafood' && (
              <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#ef4444' }}>🐟 Seafood (Salmon & Whitefish)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '5px', fontWeight: 'bold', color: '#fff', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '5px' }}><span>Type</span><span>Pull Temp</span><span>Rest Temp</span></div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '5px', color: '#aaa', marginBottom: '8px', alignItems: 'center' }}><span>Salmon <span style={{fontSize:'0.75rem'}}>(Medium)</span></span><strong style={{color:'#10b981'}}>130°F</strong><span>135°F <span style={{fontSize:'0.7rem'}}>(Flaky)</span></span></div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '5px', color: '#aaa', marginBottom: '8px', alignItems: 'center' }}><span>Whitefish <span style={{fontSize:'0.75rem'}}>(Cod/Tilapia)</span></span><strong style={{color:'#10b981'}}>140°F</strong><span>145°F <span style={{fontSize:'0.7rem'}}>(Opaque)</span></span></div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '5px', color: '#aaa', marginBottom: '15px', alignItems: 'center' }}><span>Shrimp / Scallops</span><strong style={{color:'#f59e0b'}}>120°F</strong><span>120°F <span style={{fontSize:'0.7rem'}}>(Curls to 'C')</span></span></div>
                <h4 style={{ color: '#fff', margin: '0 0 5px 0', textAlign: 'center' }}>Bake & Sear Times:</h4>
                <p style={{ color: '#aaa', fontSize: '0.85rem', lineHeight: '1.4', textAlign: 'center' }}><strong style={{color:'#ccc'}}>Bake:</strong> 400°F for 12-15 mins.<br/><strong style={{color:'#ccc'}}>Pan Sear:</strong> High heat, 4 mins skin-side down, flip, 1 min flesh-side. Baste with butter.</p>
              </div>
            )}

            {refTab === 'Guides' && (
              <>
                <div style={{ ...cardStyle, borderLeft: '4px solid #8b5cf6' }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#ef4444' }}>🔥 Oil Smoke Points (Searing Guide)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', gap: '5px', fontWeight: 'bold', color: '#fff', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '5px' }}><span>Fat / Oil</span><span>Smoke Pt</span><span>Best Use</span></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', gap: '5px', color: '#aaa', marginBottom: '8px' }}><span>Butter</span><strong style={{color:'#ef4444'}}>302°F</strong><span>Finishing/Basting</span></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', gap: '5px', color: '#aaa', marginBottom: '8px' }}><span>Extra Virgin Olive Oil</span><strong style={{color:'#f59e0b'}}>350°F</strong><span>Sauté/Dressings</span></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', gap: '5px', color: '#aaa', marginBottom: '8px' }}><span>Beef Tallow / Lard</span><strong style={{color:'#10b981'}}>400°F</strong><span>Deep Fry/Roast</span></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', gap: '5px', color: '#aaa', marginBottom: '15px' }}><span>Avocado / Grapeseed</span><strong style={{color:'#3b82f6'}}>520°F</strong><span>Cast Iron Searing</span></div>
                  <p style={{ color: '#aaa', fontSize: '0.85rem', lineHeight: '1.4', textAlign: 'center', background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #222' }}><strong style={{color:'#fff'}}>Pro Tip:</strong> Never sear a steak in butter. Sear in Avocado oil or Tallow, turn off the heat, <i>then</i> add butter and aromatics to baste.</p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #8b5cf6' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>🪵 Smoking Woods Matrix</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85rem', lineHeight: '1.5', textAlign: 'center' }}><strong style={{color:'#fff'}}>Apple / Cherry:</strong> Mild & sweet. Perfect for Pork, Poultry, and Salmon.<br/><strong style={{color:'#fff'}}>Hickory:</strong> Strong, savory, bacon-like. Best for Pork Ribs and Beef Roasts.<br/><strong style={{color:'#fff'}}>Mesquite:</strong> Extremely intense & earthy. Use ONLY for Beef Brisket/Steaks. Will overpower and ruin poultry.</p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#ef4444', textAlign: 'center' }}>🥚 Perfect Egg Boiling</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85rem', lineHeight: '1.4', textAlign: 'center', fontStyle: 'italic', marginBottom: '15px' }}>Drop large eggs straight from fridge into a rolling boil, then immediately ice bath.</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px', padding: '8px', background: '#000', borderRadius: '8px' }}><span>6 Mins:</span><strong style={{color:'#f59e0b'}}>Liquid Yolk (Ramen Egg)</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px', padding: '8px', background: '#000', borderRadius: '8px' }}><span>7 Mins:</span><strong style={{color:'#10b981'}}>Jammy / Custard Yolk</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', padding: '8px', background: '#000', borderRadius: '8px' }}><span>9 Mins:</span><strong style={{color:'#3b82f6'}}>Firm but Creamy</strong></div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
