import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AgronomyCalc() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Environment'); 
  const [guideTab, setGuideTab] = useState('Deficiencies'); 

  // --- ENVIRONMENT STATE ---
  const [ppfd, setPpfd] = useState('900');
  const [lightHours, setLightHours] = useState('12');
  const [tempF, setTempF] = useState('78');
  const [rh, setRh] = useState('55');
  
  // --- NUTRIENTS STATE ---
  const [feedPpm, setFeedPpm] = useState('600');
  const [runoffPpm, setRunoffPpm] = useState('850');

  // --- EXTRACTION STATE ---
  const [wetWeight, setWetWeight] = useState('1000');
  const [inputBiomass, setInputBiomass] = useState('454');
  const [targetYield, setTargetYield] = useState('15');
  const [crudeMass, setCrudeMass] = useState('10');
  const [crudePurity, setCrudePurity] = useState('75');
  const [carrierVol, setCarrierVol] = useState('30');

  const parse = (val) => parseFloat(val) || 0;

  // --- MATH ENGINES ---
  const dli = (parse(ppfd) * parse(lightHours) * 3600) / 1000000;
  
  // VPD Calculation (Temp F -> C, saturation vapor pressure -> VPD kPa)
  const tC = (parse(tempF) - 32) * (5/9);
  const svp = 0.61078 * Math.exp((17.27 * tC) / (tC + 237.3));
  const vpd = svp * (1 - (parse(rh) / 100));
  
  let vpdStatus = { text: "Optimal", color: "#00cc66" };
  if (vpd < 0.8) vpdStatus = { text: "Low (Risk of Mold/Slow Growth)", color: "#3b82f6" };
  if (vpd > 1.2) vpdStatus = { text: "High (Plant Stress/Leaf Curl)", color: "#ef4444" };

  const ppmDelta = parse(runoffPpm) - parse(feedPpm);
  let runoffStatus = { text: "Optimal Range", color: "#00cc66" };
  if (ppmDelta > 300) runoffStatus = { text: "Salt Buildup - Flush with plain water", color: "#ef4444" };
  if (ppmDelta < -100) runoffStatus = { text: "Hungry - Increase feeding strength", color: "#f59e0b" };

  const estDryYield = parse(wetWeight) * 0.22; // ~22% average dry retention
  const estCrude = parse(inputBiomass) * (parse(targetYield) / 100);
  const totalActive = parse(crudeMass) * 1000 * (parse(crudePurity) / 100);
  const concentration = totalActive / (parse(carrierVol) || 1);

  // --- STYLES ---
  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.05em', marginTop: '4px' };
  const labelStyle = { color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate('/calculator')}>Hub</button>
        <h2>Agronomy & Extract</h2>
      </header>

      {/* TOP TABS */}
      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Environment', 'Nutrients', 'Extract', 'Guide'].map(tab => (
          <button 
            key={tab} onClick={() => setActiveTab(tab)}
            style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: activeTab === tab ? '#00cc66' : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>
            {tab}
          </button>
        ))}
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '95px' }}>
        
        {/* ========================================== */}
        {/* TAB 1: ENVIRONMENT                         */}
        {/* ========================================== */}
        {activeTab === 'Environment' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>Vapor Pressure Deficit (VPD)</h3>
              <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}>Balance Temp and RH to control plant transpiration rates.</p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#ef4444'}}>Temp (°F)<input type="number" value={tempF} onChange={e=>setTempF(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#ef4444'}}>Humidity (%)<input type="number" value={rh} onChange={e=>setRh(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <strong style={{ color: '#fff', fontSize: '1.1em' }}>VPD:</strong>
                  <strong style={{ color: vpdStatus.color, fontSize: '1.3em' }}>{vpd.toFixed(2)} kPa</strong>
                </div>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: vpdStatus.color, fontWeight: 'bold', fontSize: '0.9em' }}>
                  {vpdStatus.text}
                </div>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>Photobiology (DLI)</h3>
              <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}>Calculate Daily Light Integral to optimize canopy mass.</p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#f59e0b'}}>PPFD (µmol/m²/s)<input type="number" value={ppfd} onChange={e=>setPpfd(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#f59e0b'}}>Light Hours/Day<input type="number" value={lightHours} onChange={e=>setLightHours(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #222' }}>
                <strong style={{ color: '#fff', fontSize: '1.2em' }}>Total DLI:</strong>
                <strong style={{ color: dli >= 40 ? '#ef4444' : '#00cc66', fontSize: '1.5em' }}>{dli.toFixed(1)} <span style={{fontSize: '0.5em', color: '#888'}}>mol/m²/d</span></strong>
              </div>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* TAB 2: NUTRIENTS                           */}
        {/* ========================================== */}
        {activeTab === 'Nutrients' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>Runoff Delta Tracker</h3>
            <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}>Measure runoff to prevent root lockout and salt buildup.</p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#3b82f6'}}>Feed PPM<input type="number" value={feedPpm} onChange={e=>setFeedPpm(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#3b82f6'}}>Runoff PPM<input type="number" value={runoffPpm} onChange={e=>setRunoffPpm(e.target.value)} style={inputStyle} /></label></div>
            </div>
            <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <strong style={{ color: '#fff', fontSize: '1.1em' }}>PPM Delta:</strong>
                <strong style={{ color: ppmDelta > 0 ? '#ef4444' : '#3b82f6', fontSize: '1.3em' }}>{ppmDelta > 0 ? '+' : ''}{ppmDelta} PPM</strong>
              </div>
              <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: runoffStatus.color, fontWeight: 'bold', fontSize: '0.9em' }}>
                {runoffStatus.text}
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: EXTRACTION                          */}
        {/* ========================================== */}
        {activeTab === 'Extract' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>Wet-to-Dry Estimator</h3>
              <div style={{ marginBottom: '15px' }}>
                <label style={{...labelStyle, color: '#3b82f6'}}>Fresh Chopped Wet Weight (g)
                  <input type="number" value={wetWeight} onChange={e=>setWetWeight(e.target.value)} style={{...inputStyle, borderColor: '#3b82f6'}} />
                </label>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #222' }}>
                <strong style={{ color: '#fff', fontSize: '1.1em' }}>Est. Cured Yield:</strong>
                <strong style={{ color: '#3b82f6', fontSize: '1.4em' }}>{estDryYield.toFixed(1)} g</strong>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #00cc66' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#00cc66' }}>Biomass Yield</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#00cc66'}}>Input Mass (g)<input type="number" value={inputBiomass} onChange={e=>setInputBiomass(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#00cc66'}}>Target Yield (%)<input type="number" value={targetYield} onChange={e=>setTargetYield(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #222' }}>
                <strong style={{ color: '#fff', fontSize: '1.1em' }}>Est. Crude:</strong>
                <strong style={{ color: '#00cc66', fontSize: '1.4em' }}>{estCrude.toFixed(1)} g</strong>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#a855f7' }}>Volumetric Concentration</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#a855f7'}}>Crude Mass (g)<input type="number" value={crudeMass} onChange={e=>setCrudeMass(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#a855f7'}}>Purity (%)<input type="number" value={crudePurity} onChange={e=>setCrudePurity(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ marginBottom: '15px' }}><label style={{...labelStyle, color: '#00ffff'}}>Carrier Volume (mL)<input type="number" value={carrierVol} onChange={e=>setCarrierVol(e.target.value)} style={{...inputStyle, borderColor: '#00ffff'}} /></label></div>
              
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px', borderBottom: '1px dashed #333', paddingBottom: '10px' }}>
                  <span>Total Active:</span> <span>{totalActive.toFixed(0)} mg</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#fff', fontSize: '1.1em' }}>Concentration:</strong>
                  <strong style={{ color: '#a855f7', fontSize: '1.4em' }}>{concentration.toFixed(1)} mg / mL</strong>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* TAB 4: THE GUIDE                           */}
        {/* ========================================== */}
        {activeTab === 'Guide' && (
          <>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {['Deficiencies', 'Soil & NPK', 'Climate', 'Propagation', 'Training', 'Flowering', 'IPM & Health'].map(sub => (
                <button
                  key={sub} onClick={() => setGuideTab(sub)}
                  style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', fontSize: '0.85em', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: guideTab === sub ? 'rgba(0, 204, 102, 0.2)' : '#151515', color: guideTab === sub ? '#00cc66' : '#888', border: guideTab === sub ? '1px solid #00cc66' : '1px solid #222' }}>
                  {sub}
                </button>
              ))}
            </div>

            {guideTab === 'Deficiencies' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#f59e0b' }}>Nitrogen (N)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    <strong>Symptoms:</strong> Older, lower leaves turn pale yellow and eventually drop off. Plant looks generally pale and stunted.<br/><br/>
                    <strong>Fix:</strong> Extremely mobile nutrient. Add a high-N vegetative fertilizer. Plants recover quickly.
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#a855f7' }}>Phosphorus (P)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    <strong>Symptoms:</strong> Stunted growth with dark, bluish-green leaves. Stems and petioles often turn deep purple or red. Leaves may develop dark copper or purplish dead spots.<br/><br/>
                    <strong>Fix:</strong> Often caused by pH lockout or cold root zones. Correct pH (6.0-6.5 soil, 5.8-6.0 coco) and ensure temperatures are stable.
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>Potassium (K)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    <strong>Symptoms:</strong> Edges of leaves look burnt or scorched, curling upward. Brown spots may appear on older leaves while the veins stay green.<br/><br/>
                    <strong>Fix:</strong> Flush the medium with pH-balanced water (salt buildup often causes K lockout), then re-feed with a balanced PK booster.
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #fff' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#fff' }}>Calcium & Magnesium (CalMag)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    <strong>Calcium:</strong> Tiny brown/bronze spots appear on *new* growth. Leaves may crinkle or twist. Highly immobile.<br/><br/>
                    <strong>Magnesium:</strong> Interveinal chlorosis on *older* leaves (veins stay dark green, but the tissue between them turns bright yellow). Leaves may eventually turn crispy.<br/><br/>
                    <strong>Fix:</strong> These usually appear together, especially in RO water or Coco Coir. Add a Cal/Mag supplement immediately.
                  </p>
                </div>
              </div>
            )}

            {/* ... The rest of your existing guide tabs (Soil, Climate, Propagation, Training, Flowering, IPM) remain exactly as they were in the previous block! ... */}
            {guideTab === 'Soil & NPK' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#f59e0b' }}>Macronutrients (NPK)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    <strong>N</strong>itrogen - <strong>P</strong>hosphorus - <strong>K</strong>otassium<br/>
                    • <strong>Veg Phase:</strong> 3-1-1 or 8-4-4 (High Nitrogen)<br/>
                    • <strong>Flower Phase:</strong> 1-3-2 or 0-3-3 (High Phosphorus/Potassium)
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#3b82f6' }}>Water, pH & Mediums</h3>
                  <ul style={{ color: '#aaa', fontSize: '0.85em', paddingLeft: '16px', lineHeight: '1.5', margin: 0 }}>
                    <li><strong>Tap Water:</strong> Contains 100-500 PPM of additives. High PPM can overwhelm roots. Use <strong>RO (Reverse Osmosis)</strong> water.</li>
                    <li><strong>Soil (FoxFarm):</strong> Ocean Forest or Happy Frog. Avoid generic potting soil. Safe pH: <strong>6.0 - 6.5</strong>. Don't pack soil tight.</li>
                    <li><strong>Coco Coir:</strong> Great water retention, drains easily. Neutral pH. Contains zero nutrients (requires heavy monitoring). Safe pH: <strong>5.8</strong>.</li>
                  </ul>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#00cc66' }}>The Mixing Order</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', fontStyle: 'italic', marginBottom: '8px' }}>Add one at a time. Stir after each. Let sit 5 mins before testing pH.</p>
                  <ol style={{ color: '#fff', fontSize: '0.85em', paddingLeft: '16px', lineHeight: '1.5', margin: 0, fontWeight: 'bold' }}>
                    <li>Silica (Optional - for stronger cells/stems)</li>
                    <li>Cal / Mag</li>
                    <li>Base Nutrients (e.g. Flora Grow, Micro, Bloom)</li>
                    <li>Boosters or Additives</li>
                    <li>Adjust pH (Up or Down)</li>
                    <li>Beneficial Microbes</li>
                  </ol>
                  <p style={{ color: '#888', fontSize: '0.8em', marginTop: '10px' }}>*Measurement: 1 tsp = 5 mL | 1 tbsp = 15 mL</p>
                </div>
              </div>
            )}

            {guideTab === 'Climate' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00ffff' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#00ffff' }}>Relative Humidity (RH)</h3>
                  <ul style={{ color: '#aaa', fontSize: '0.85em', paddingLeft: '16px', lineHeight: '1.5', margin: 0 }}>
                    <li><strong>Seedlings:</strong> 65% - 80% RH (Use humidifier/dome)</li>
                    <li><strong>Veg (Weeks 3-4):</strong> 45% - 65% RH</li>
                    <li><strong>Early Bloom:</strong> 40% - 55% RH</li>
                    <li><strong>Late Bloom:</strong> 30% - 50% RH</li>
                  </ul>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>Temperature & Airflow</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    • <strong>Lights ON:</strong> 70°F - 85°F<br/>
                    • <strong>Lights OFF:</strong> 60°F - 75°F<br/>
                    • <strong>Canopy:</strong> 70°F - 80°F (Hang probe at top of plant level)<br/>
                    • <strong>Airflow:</strong> Bring new air in one side, exhaust old air on the opposite side.
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#f59e0b' }}>LED Lighting</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    <strong>Height:</strong> 2 to 2.5 feet above seedlings on low brightness. Too high causes stretching (skinny/unstable stems). Too close causes leaf curling, burning, or turning pale/white.<br/><br/>
                    <strong>Veg Schedule:</strong> 18 hours ON / 6 hours OFF for the first 4 weeks. Ensure timer is exact. <strong>ZERO light leaks</strong> during the off cycle.
                  </p>
                </div>
              </div>
            )}

            {guideTab === 'Propagation' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#3b82f6' }}>Seeds & Germination</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    <strong>Feminized:</strong> Guaranteed female. <strong>Auto:</strong> Transitions based on age, not light. <strong>Regular:</strong> 50/50 male/female.<br/><br/>
                    <strong>Germination:</strong> Wet paper towel/coffee filter in a plastic bag. Keep in dark, warm spot (70-80°F, 78°F is sweet spot). Good seeds are dark brown w/ tiger stripes and hard. Pale/green/white seeds are dead. Tap root should show in 36 hrs to 4 days. Plant 1/4 inch deep. Don't pack dirt over seed.
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#a855f7' }}>The Cloning Process</h3>
                  <ol style={{ color: '#aaa', fontSize: '0.85em', paddingLeft: '16px', lineHeight: '1.5', margin: 0 }}>
                    <li>Select healthiest mother plant, ensure it's fully fed.</li>
                    <li>Use a sharp, sterilized blade. Make a 45° angle cut.</li>
                    <li>Cutting should be 4-6 inches and have at least 2 sets of leaves.</li>
                    <li>Apply Rooting Gel / Hormone to the end of the stalk immediately.</li>
                    <li>Place in rooting medium (soil plugs) in high humidity.</li>
                  </ol>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#00cc66' }}>Transplanting</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    Pots too small cause root binding. Do not cramp pots together, give them space. A 5-gallon soil bag fills roughly 2 pots.<br/><br/>
                    Transplant 2 days after watering. Sprinkle germ nutrients directly on roots during transplant.
                  </p>
                </div>
              </div>
            )}

            {guideTab === 'Training' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>Topping</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    Removing the apical meristem (top of the main stem) causes the plant to produce two main stems instead of one, resulting in bushier plants and bigger yields. <br/><br/>
                    • Wait until weeks 3-5 of veg growth.<br/>
                    • Ensure the plant has 5 to 6 nodes before cutting so the root system is solid enough to heal.<br/>
                    • <strong>NEVER</strong> top a sick/infested plant, and <strong>NEVER</strong> top after flipping to flower.
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #00ffff' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#00ffff' }}>Trellis Nets</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    Use plastic nets, not fiber ones. Spread branches as wide as you can to ensure light hits all branches equally. <br/><br/>
                    If you need to bend a branch, pinch it softly until it becomes slightly workable. Bent joints come back thicker and stronger. The more even your canopy, the better the yield.
                  </p>
                </div>
                
                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#f59e0b' }}>Lollipopping (Pruning)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    Cut off the bottom 1/3 to 2/3 of leaves and bottom branches. This redirects energy to get bigger buds on top, and drastically increases airflow to help prevent powdery mildew.
                  </p>
                </div>
              </div>
            )}

            {guideTab === 'Flowering' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#a855f7' }}>The 12/12 Flip & Stretch</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    Trigger flower by switching the light cycle to exactly <strong>12 hours ON / 12 hours OFF</strong>. <br/><br/>
                    <strong>The Stretch:</strong> After flipping, plants will shoot up and get taller for up to 21 days (Sativas stretch more than Indicas). <br/><br/>
                    <strong>Light Leaks:</strong> Any light entering the tent during the 12-hour OFF cycle can stress the plant into becoming a Hermie (growing bananas/seeds and losing THC).
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#3b82f6' }}>Late Flower Feeding</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    During the second half of flower, plants need less Nitrogen and more Phosphorus/Potassium (PK). It is normal to feed 1,000 - 1,500 PPM during this stage, but increase slowly to avoid shocking the plants.<br/><br/>
                    Stop feeding and <strong>flush with plain water</strong> for the last 2 weeks prior to harvest.
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>Late Flower Climate</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    Keep lights at 100% but watch closely for light bleaching/burn (keep ~12" away depending on LED strength).<br/><br/>
                    <strong>Temp Drop:</strong> Lower temp from 85° to around 75°. Aim for a max temp swing of 15° between day and night.<br/><br/>
                    <strong>Humidity Drop:</strong> Drop RH to 50% at Week 4, and drop it every week until it hits 30%. Excess water causes <em>Botrytis</em> (Bud Rot). Keep exhaust and fans moving constantly!
                  </p>
                </div>
              </div>
            )}

            {guideTab === 'IPM & Health' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>Pests & Contamination</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    Keep a sterile room. Wash hands, wear clean clothes, wear gloves.<br/><br/>
                    • <strong>Fungus Gnats:</strong> They lay larvae on topsoil. Let your soil dry out to kill them, and use yellow sticky catchers.<br/>
                    • <strong>Thrips:</strong> Look for spots/damage on leaves.<br/>
                    • <strong>Spider Mites:</strong> White clouding on leaves, spots of necrosis, webbing over plant.<br/>
                    • <strong>Root Rot:</strong> Caused by overwatering. Roots need time to dry out.<br/><br/>
                    <em>*If plants show signs of severe infestation, remove immediately to save the rest.</em>
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#00cc66' }}>Treatments & Sprays</h3>
                  <ul style={{ color: '#aaa', fontSize: '0.85em', paddingLeft: '16px', lineHeight: '1.5', margin: 0 }}>
                    <li><strong>Diatomaceous Earth:</strong> Microscopic sharp edges. Harmless to humans/plants, but shreds gnats and insects when sprinkled on topsoil.</li>
                    <li><strong>Neem Oil:</strong> Prevents bugs from feeding and affects their eggs. Good for aphids, mites, and white flies.</li>
                    <li><strong>Captain Jacks / Athena IPM:</strong> Great for thrips, rust, and fungal/bacterial infections.</li>
                  </ul>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#f59e0b' }}>Spraying Rules</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    <strong>Rotate Sprays:</strong> Switch between horticultural oils to prevent pests from building genetic immunity. They work by suffocating bugs, unlike chemical pesticides.<br/><br/>
                    <strong>Timing:</strong> Spray every 7 days during veg. <strong>NEVER</strong> spray buds (stop spraying at first sign of flower). <br/><br/>
                    <strong>Lights:</strong> Only spray 4 hours before lights out. Do not put them back under intense light immediately after spraying.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
