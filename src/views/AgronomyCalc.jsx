import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AgronomyCalc() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Environment'); 
  const [guideTab, setGuideTab] = useState('Harvest & Cure'); 

  // --- ENVIRONMENT STATE ---
  const [ppfd, setPpfd] = useState('900');
  const [lightHours, setLightHours] = useState('12');
  const [tempF, setTempF] = useState('78');
  const [rh, setRh] = useState('55');
  const [tentL, setTentL] = useState('4');
  const [tentW, setTentW] = useState('4');
  const [tentH, setTentH] = useState('6.5');
  const [targetCo2, setTargetCo2] = useState('1200');
  
  // --- NUTRIENTS STATE ---
  const [feedPpm, setFeedPpm] = useState('600');
  const [runoffPpm, setRunoffPpm] = useState('850');
  const [inputEc, setInputEc] = useState('1.6');

  // --- EXTRACTION STATE ---
  const [wetWeight, setWetWeight] = useState('1000');
  const [inputBiomass, setInputBiomass] = useState('454');
  const [targetYield, setTargetYield] = useState('15');
  const [rawAcidMass, setRawAcidMass] = useState('100');
  const [crudeMass, setCrudeMass] = useState('10');
  const [crudePurity, setCrudePurity] = useState('75');
  const [carrierVol, setCarrierVol] = useState('30');

  const parse = (val) => parseFloat(val) || 0;

  // --- MATH ENGINES ---
  const dli = (parse(ppfd) * parse(lightHours) * 3600) / 1000000;
  
  const tC = (parse(tempF) - 32) * (5/9);
  const svp = 0.61078 * Math.exp((17.27 * tC) / (tC + 237.3));
  const vpd = svp * (1 - (parse(rh) / 100));
  
  let vpdStatus = { text: "Optimal Transpiration", color: "#00cc66" };
  if (vpd < 0.8) vpdStatus = { text: "Low VPD (High Mold Risk / Stagnant)", color: "#3b82f6" };
  if (vpd > 1.4) vpdStatus = { text: "High VPD (Plant Stress / Stomata Close)", color: "#ef4444" };

  const tentCuFt = parse(tentL) * parse(tentW) * parse(tentH);
  const co2NeededCuFt = tentCuFt * ((parse(targetCo2) - 400) / 1000000);

  const ecVal = parse(inputEc);
  const ppm500 = ecVal * 500;
  const ppm700 = ecVal * 700;

  const ppmDelta = parse(runoffPpm) - parse(feedPpm);
  let runoffStatus = { text: "Optimal Nutrient Consumption", color: "#00cc66" };
  if (ppmDelta > 300) runoffStatus = { text: "Salt Accumulation (Flush Medium)", color: "#ef4444" };
  if (ppmDelta < -100) runoffStatus = { text: "Underfed (Increase Baseline PPM)", color: "#f59e0b" };

  const estDryYield = parse(wetWeight) * 0.22;
  const estCrude = parse(inputBiomass) * (parse(targetYield) / 100);
  const postDecarbActive = parse(rawAcidMass) * 0.877;
  const totalActive = parse(crudeMass) * 1000 * (parse(crudePurity) / 100);
  const concentration = totalActive / (parse(carrierVol) || 1);

  // --- STYLES ---
  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.05em', marginTop: '4px' };
  const labelStyle = { color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const infoBlockStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid #222', borderRadius: '8px', padding: '10px', marginBottom: '12px', fontSize: '0.82em', lineHeight: '1.4' };

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
              <h3 style={{ margin: '0 0 6px 0', color: '#ef4444' }}>Vapor Pressure Deficit (VPD)</h3>
              
              <div style={infoBlockStyle}>
                <div style={{ color: '#00ffff', fontWeight: 'bold', marginBottom: '2px' }}>What it does:</div>
                <div style={{ color: '#ccc', marginBottom: '6px' }}>Calculates the atmospheric drying power by measuring the gap between leaf moisture pressure and room air saturation.</div>
                <div style={{ color: '#00cc66', fontWeight: 'bold', marginBottom: '2px' }}>Why use it:</div>
                <div style={{ color: '#aaa' }}>Controls transpiration. Low VPD stalls nutrient intake and causes mold; high VPD closes stomata and stresses leaves.</div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#ef4444'}}>Temp (°F)<input type="number" value={tempF} onChange={e=>setTempF(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#ef4444'}}>Humidity (%)<input type="number" value={rh} onChange={e=>setRh(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <strong style={{ color: '#fff', fontSize: '1.1em' }}>VPD Value:</strong>
                  <strong style={{ color: vpdStatus.color, fontSize: '1.3em' }}>{vpd.toFixed(2)} kPa</strong>
                </div>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: vpdStatus.color, fontWeight: 'bold', fontSize: '0.9em' }}>
                  {vpdStatus.text}
                </div>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#f59e0b' }}>Photobiology (DLI)</h3>
              
              <div style={infoBlockStyle}>
                <div style={{ color: '#00ffff', fontWeight: 'bold', marginBottom: '2px' }}>What it does:</div>
                <div style={{ color: '#ccc', marginBottom: '6px' }}>Converts continuous PPFD light intensity into cumulative photosynthetically active photons delivered over 24 hours.</div>
                <div style={{ color: '#00cc66', fontWeight: 'bold', marginBottom: '2px' }}>Why use it:</div>
                <div style={{ color: '#aaa' }}>Prevents light bleaching and wasted electricity by dialing in exact light saturation without exceeding photosynthetic limits.</div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#f59e0b'}}>PPFD (µmol/m²/s)<input type="number" value={ppfd} onChange={e=>setPpfd(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#f59e0b'}}>Light Hours/Day<input type="number" value={lightHours} onChange={e=>setLightHours(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #222' }}>
                <strong style={{ color: '#fff', fontSize: '1.1em' }}>Total DLI:</strong>
                <strong style={{ color: dli >= 40 ? '#ef4444' : '#00cc66', fontSize: '1.4em' }}>{dli.toFixed(1)} <span style={{fontSize: '0.6em', color: '#888'}}>mol/m²/d</span></strong>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #00ffff' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#00ffff' }}>CO2 Tent Injection Engine</h3>
              
              <div style={infoBlockStyle}>
                <div style={{ color: '#00ffff', fontWeight: 'bold', marginBottom: '2px' }}>What it does:</div>
                <div style={{ color: '#ccc', marginBottom: '6px' }}>Calculates the exact volume of pure CO2 gas needed to elevate room atmosphere from 400 PPM to enrichment targets.</div>
                <div style={{ color: '#00cc66', fontWeight: 'bold', marginBottom: '2px' }}>Why use it:</div>
                <div style={{ color: '#aaa' }}>CO2 enrichment (1,200–1,500 PPM) allows plants to process high-intensity light (PPFD &gt; 1000) and withstand warmer temps.</div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>L (ft)<input type="number" value={tentL} onChange={e=>setTentL(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>W (ft)<input type="number" value={tentW} onChange={e=>setTentW(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>H (ft)<input type="number" value={tentH} onChange={e=>setTentH(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Target CO2 (PPM)<input type="number" value={targetCo2} onChange={e=>setTargetCo2(e.target.value)} style={inputStyle} /></label>
              </div>
              <div style={{ background: '#000', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #222' }}>
                <span style={{ color: '#aaa', fontSize: '0.9em' }}>Volume: <strong>{tentCuFt.toFixed(1)} cu ft</strong></span>
                <strong style={{ color: '#00ffff', fontSize: '1.2em' }}>+{co2NeededCuFt.toFixed(3)} cu ft CO2</strong>
              </div>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* TAB 2: NUTRIENTS                           */}
        {/* ========================================== */}
        {activeTab === 'Nutrients' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#3b82f6' }}>Runoff Delta Tracker</h3>
              
              <div style={infoBlockStyle}>
                <div style={{ color: '#00ffff', fontWeight: 'bold', marginBottom: '2px' }}>What it does:</div>
                <div style={{ color: '#ccc', marginBottom: '6px' }}>Measures the difference between input feed mineral concentration and drainage runoff.</div>
                <div style={{ color: '#00cc66', fontWeight: 'bold', marginBottom: '2px' }}>Why use it:</div>
                <div style={{ color: '#aaa' }}>Detects salt accumulation before visible tip burns occur, and alerts when root-zone flushing is required.</div>
              </div>

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

            <div style={{ ...cardStyle, borderTop: '4px solid #00ffff' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#00ffff' }}>EC to PPM Dual-Scale Bridge</h3>
              
              <div style={infoBlockStyle}>
                <div style={{ color: '#00ffff', fontWeight: 'bold', marginBottom: '2px' }}>What it does:</div>
                <div style={{ color: '#ccc', marginBottom: '6px' }}>Bridges raw Electrical Conductivity (mS/cm) across 500 (Hanna) and 700 (Truncheon) standard conversion curves.</div>
                <div style={{ color: '#00cc66', fontWeight: 'bold', marginBottom: '2px' }}>Why use it:</div>
                <div style={{ color: '#aaa' }}>Eliminates accidental overfeeding caused by misinterpreting meter manufacturer conversion factors.</div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>Electrical Conductivity (EC / mS/cm)
                  <input type="number" step="0.1" value={inputEc} onChange={e=>setInputEc(e.target.value)} style={{...inputStyle, borderColor: '#00ffff'}} />
                </label>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1, background: '#000', padding: '12px', borderRadius: '8px', border: '1px solid #222', textAlign: 'center' }}>
                  <span style={{ color: '#888', fontSize: '0.75em', display: 'block', textTransform: 'uppercase' }}>500 Scale (Hanna)</span>
                  <strong style={{ color: '#00cc66', fontSize: '1.3em' }}>{ppm500.toFixed(0)} PPM</strong>
                </div>
                <div style={{ flex: 1, background: '#000', padding: '12px', borderRadius: '8px', border: '1px solid #222', textAlign: 'center' }}>
                  <span style={{ color: '#888', fontSize: '0.75em', display: 'block', textTransform: 'uppercase' }}>700 Scale (Truncheon)</span>
                  <strong style={{ color: '#f59e0b', fontSize: '1.3em' }}>{ppm700.toFixed(0)} PPM</strong>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* TAB 3: EXTRACTION                          */}
        {/* ========================================== */}
        {activeTab === 'Extract' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#3b82f6' }}>Wet-to-Dry Estimator</h3>
              
              <div style={infoBlockStyle}>
                <div style={{ color: '#00ffff', fontWeight: 'bold', marginBottom: '2px' }}>What it does:</div>
                <div style={{ color: '#ccc', marginBottom: '6px' }}>Projects cured flower mass from wet harvest weight based on ~78% moisture dissipation.</div>
                <div style={{ color: '#00cc66', fontWeight: 'bold', marginBottom: '2px' }}>Why use it:</div>
                <div style={{ color: '#aaa' }}>Accurately estimates drying rack space, trim labor, and jar capacity requirements immediately after harvest.</div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{...labelStyle, color: '#3b82f6'}}>Fresh Chopped Wet Weight (g)
                  <input type="number" value={wetWeight} onChange={e=>setWetWeight(e.target.value)} style={{...inputStyle, borderColor: '#3b82f6'}} />
                </label>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #222' }}>
                <strong style={{ color: '#fff', fontSize: '1.1em' }}>Est. Cured Yield (22%):</strong>
                <strong style={{ color: '#3b82f6', fontSize: '1.4em' }}>{estDryYield.toFixed(1)} g</strong>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#f59e0b' }}>Decarboxylation Loss Engine</h3>
              
              <div style={infoBlockStyle}>
                <div style={{ color: '#00ffff', fontWeight: 'bold', marginBottom: '2px' }}>What it does:</div>
                <div style={{ color: '#ccc', marginBottom: '6px' }}>Calculates true active yield after thermal CO2 carboxyl group detachment ($THCA \times 0.877$).</div>
                <div style={{ color: '#00cc66', fontWeight: 'bold', marginBottom: '2px' }}>Why use it:</div>
                <div style={{ color: '#aaa' }}>Ensures accurate dosing in edibles, oils, and tinctures by avoiding overestimating active potency.</div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{...labelStyle, color: '#f59e0b'}}>Raw Acid Form Mass (THCA/CBDA g)
                  <input type="number" value={rawAcidMass} onChange={e=>setRawAcidMass(e.target.value)} style={inputStyle} />
                </label>
              </div>
              <div style={{ background: '#000', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #222' }}>
                <strong style={{ color: '#fff', fontSize: '1.05em' }}>Activated Neutral Yield:</strong>
                <strong style={{ color: '#f59e0b', fontSize: '1.3em' }}>{postDecarbActive.toFixed(2)} g</strong>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #00cc66' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#00cc66' }}>Biomass Extraction Yield</h3>
              
              <div style={infoBlockStyle}>
                <div style={{ color: '#00ffff', fontWeight: 'bold', marginBottom: '2px' }}>What it does:</div>
                <div style={{ color: '#ccc', marginBottom: '6px' }}>Calculates raw crude resin extract output based on starting dry biomass weight and efficiency.</div>
                <div style={{ color: '#00cc66', fontWeight: 'bold', marginBottom: '2px' }}>Why use it:</div>
                <div style={{ color: '#aaa' }}>Tracks solvent recovery efficiency and monitors baseline trichome yield across batches.</div>
              </div>

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
              <h3 style={{ margin: '0 0 6px 0', color: '#a855f7' }}>Volumetric Concentration</h3>
              
              <div style={infoBlockStyle}>
                <div style={{ color: '#00ffff', fontWeight: 'bold', marginBottom: '2px' }}>What it does:</div>
                <div style={{ color: '#ccc', marginBottom: '6px' }}>Calculates final liquid milligram concentration per milliliter for infusions and tinctures.</div>
                <div style={{ color: '#00cc66', fontWeight: 'bold', marginBottom: '2px' }}>Why use it:</div>
                <div style={{ color: '#aaa' }}>Guarantees exact, repeatable dropper dosing when formulating carrier tinctures.</div>
              </div>

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
              {['Harvest & Cure', 'Deficiencies', 'Soil & NPK', 'Climate', 'Propagation', 'Training', 'Flowering', 'IPM'].map(sub => (
                <button
                  key={sub} onClick={() => setGuideTab(sub)}
                  style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', fontSize: '0.82em', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: guideTab === sub ? 'rgba(0, 204, 102, 0.2)' : '#151515', color: guideTab === sub ? '#00cc66' : '#888', border: guideTab === sub ? '1px solid #00cc66' : '1px solid #222' }}>
                  {sub}
                </button>
              ))}
            </div>

            {guideTab === 'Harvest & Cure' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#00cc66' }}>Trichome Maturity Ratios</h3>
                  <ul style={{ color: '#aaa', fontSize: '0.85em', paddingLeft: '16px', lineHeight: '1.5', margin: 0 }}>
                    <li><strong>Clear (Immature):</strong> Translucent heads. Low potency. Do not harvest.</li>
                    <li><strong>Milky / Cloudy (Peak):</strong> Maximum active cannabinoid density and terpenes. Strong cerebral effect.</li>
                    <li><strong>Amber (Sedating):</strong> Degrading into sedative CBN. Target ratio: <strong>70% Cloudy / 20–30% Amber</strong>.</li>
                  </ul>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#3b82f6' }}>The "60 / 60" Dry SOP</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    • <strong>Environment:</strong> Keep drying space at exactly <strong>60°F and 60% RH</strong> in complete darkness.<br/>
                    • <strong>Duration:</strong> 10 to 14 days. Dry until smaller stems snap cleanly.<br/>
                    • <strong>Airflow:</strong> Low exhaust; no direct oscillating fan drafts hitting hanging colas.
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#f59e0b' }}>Jar Curing & Burping Schedule</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    Fill airtight glass jars 75% full with mini hygrometers.<br/>
                    • <strong>Week 1:</strong> Burp jars twice daily for 15 mins. Target internal RH: 58–62%.<br/>
                    • <strong>Week 2–3:</strong> Burp once daily for 10 mins.<br/>
                    • <strong>Week 4+:</strong> Burp once per week. Chlorophyll breaks down into smooth terpenes.
                  </p>
                </div>
              </div>
            )}

            {guideTab === 'Deficiencies' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#f59e0b' }}>Nitrogen (N)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    <strong>Symptoms:</strong> Older, lower leaves turn pale yellow and drop off. Highly mobile.<br/>
                    <strong>Fix:</strong> Apply balanced vegetative formula with high N.
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#a855f7' }}>Phosphorus (P)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    <strong>Symptoms:</strong> Dark bluish leaves, purple petioles, bronze necrotic patches.<br/>
                    <strong>Fix:</strong> Correct pH (6.0-6.5 soil, 5.8 coco); feed PK booster.
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>Potassium (K)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    <strong>Symptoms:</strong> Burnt leaf margins, curling tips, interveinal spotting.<br/>
                    <strong>Fix:</strong> Flush root zone with clean RO water; reset nutrient solution.
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #fff' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#fff' }}>Calcium & Magnesium (CalMag)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    <strong>Calcium:</strong> Copper spots on new upper foliage.<br/>
                    <strong>Magnesium:</strong> Yellowing between green veins on mature leaves.<br/>
                    <strong>Fix:</strong> Add 3–5 mL/gal Cal/Mag supplement immediately.
                  </p>
                </div>
              </div>
            )}

            {guideTab === 'Soil & NPK' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#f59e0b' }}>Macronutrients (NPK)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    <strong>N</strong>itrogen - <strong>P</strong>hosphorus - <strong>K</strong>otassium<br/>
                    • <strong>Veg:</strong> 3-1-1 or 8-4-4 (High Nitrogen)<br/>
                    • <strong>Flower:</strong> 1-3-2 or 0-3-3 (High Phosphorus & Potassium)
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#3b82f6' }}>Water, pH & Mediums</h3>
                  <ul style={{ color: '#aaa', fontSize: '0.85em', paddingLeft: '16px', lineHeight: '1.5', margin: 0 }}>
                    <li><strong>Tap Water:</strong> 100–500 PPM baseline contaminants. Use <strong>RO Water</strong>.</li>
                    <li><strong>FoxFarm Soil:</strong> Ocean Forest or Happy Frog. Target pH: <strong>6.0 - 6.5</strong>.</li>
                    <li><strong>Coco Coir:</strong> Zero baseline minerals. Target pH: <strong>5.8</strong>.</li>
                  </ul>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#00cc66' }}>The Mixing Order</h3>
                  <ol style={{ color: '#fff', fontSize: '0.85em', paddingLeft: '16px', lineHeight: '1.5', margin: 0, fontWeight: 'bold' }}>
                    <li>Silica (Optional - stem thickness)</li>
                    <li>Cal / Mag</li>
                    <li>Base Nutrients (Micro ➔ Grow ➔ Bloom)</li>
                    <li>Boosters & PK Additives</li>
                    <li>Adjust pH (Up or Down)</li>
                    <li>Beneficial Microbes / Mycorrhizae</li>
                  </ol>
                </div>
              </div>
            )}

            {guideTab === 'Climate' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00ffff' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#00ffff' }}>Relative Humidity (RH)</h3>
                  <ul style={{ color: '#aaa', fontSize: '0.85em', paddingLeft: '16px', lineHeight: '1.5', margin: 0 }}>
                    <li><strong>Seedlings:</strong> 65% - 80% RH</li>
                    <li><strong>Veg:</strong> 45% - 65% RH</li>
                    <li><strong>Early Bloom:</strong> 40% - 55% RH</li>
                    <li><strong>Late Bloom:</strong> 30% - 50% RH</li>
                  </ul>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>Temperature & Airflow</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    • <strong>Lights ON:</strong> 70°F - 85°F<br/>
                    • <strong>Lights OFF:</strong> 60°F - 75°F (Max 15° day/night swing)<br/>
                    • <strong>Air Intake:</strong> Passive low intake on one side, powered exhaust high on opposite side.
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#f59e0b' }}>LED Lighting</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    • <strong>Height:</strong> 24–30 inches for seedlings; 12–18 inches in late flower.<br/>
                    • <strong>Photoperiod:</strong> 18/6 for Veg; strictly 12/12 for Bloom. Zero light leaks.
                  </p>
                </div>
              </div>
            )}

            {guideTab === 'Propagation' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#3b82f6' }}>Seed Germination</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    Moist paper towel in sealed plastic bag. Dark and warm (78°F sweet spot). Plant 1/4" deep once taproot extends. Lightly dust soil; do not pack down.
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#a855f7' }}>Cloning Protocol</h3>
                  <ol style={{ color: '#aaa', fontSize: '0.85em', paddingLeft: '16px', lineHeight: '1.5', margin: 0 }}>
                    <li>Select healthy mother with fed root zone.</li>
                    <li>Sterilized razor cut at 45° angle (4–6" cutting with 2 leaf sets).</li>
                    <li>Dip immediately in rooting gel/hormone.</li>
                    <li>Insert into pre-soaked rooting plug in 80%+ humidity dome.</li>
                  </ol>
                </div>
              </div>
            )}

            {guideTab === 'Training' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>Topping</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    Snip main apical stem above the 5th or 6th node during weeks 3–5 of veg. Creates two dominant colas and triggers hormonal redistribution to lower branches.
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #00ffff' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#00ffff' }}>SCROG & Trellis Netting</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    Spread canopy horizontally across plastic trellis. Soft-pinch stems (supercropping) until fibrous joint bends without snapping to create knuckle reinforcements.
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#f59e0b' }}>Lollipopping</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    Strip the lower 1/3 to 2/3 of shaded larf growth before week 3 of flower to divert all hydraulic vascular pressure to top buds.
                  </p>
                </div>
              </div>
            )}

            {guideTab === 'Flowering' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#a855f7' }}>The 12/12 Flip & 21-Day Stretch</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    Flip light timers to 12 hours ON / 12 hours OFF. Plants will double in height over 3 weeks. Check for light leaks to prevent stress hermaphroditism.
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>Late Flower Flush & Botrytis Defense</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    Drop humidity to 35–40% in final weeks. Flush medium with pure RO water for the final 10–14 days. Ensure 24/7 internal oscillating airflow.
                  </p>
                </div>
              </div>
            )}

            {guideTab === 'IPM' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>Pest Identification</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    • <strong>Fungus Gnats:</strong> Larvae in damp topsoil. Let soil dry out; topdress with Diatomaceous Earth.<br/>
                    • <strong>Spider Mites:</strong> Necrotic specks and fine webbing under leaves.<br/>
                    • <strong>Thrips:</strong> Silver/white leaf scarring with black waste dots.
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#00cc66' }}>IPM Rotation Protocol</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    Rotate between Neem Oil, Horticultural Soaps, and Athena IPM every 7 days during veg. <strong>Never spray flowers or within 4 hours of intense lights.</strong>
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
