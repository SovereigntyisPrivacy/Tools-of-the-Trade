import React, { useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#ff4444', background: '#0a0a0a', minHeight: '100vh' }}>
          <h2>⚠️ Agronomy Module Crashed</h2>
          <p style={{ fontFamily: 'monospace', background: '#111', padding: '10px' }}>{this.state.error?.toString()}</p>
          <button onClick={() => window.history.back()} style={{ padding: '10px', background: '#333', color: '#fff', border: 'none', borderRadius: '8px' }}>Go Back</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AgronomyUI() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Guide');
  const [guideTab, setGuideTab] = useState('Compliance');

  const [tempF, setTempF] = useState('78');
  const [rh, setRh] = useState('55');
  const [ppfd, setPpfd] = useState('900');
  const [lightHours, setLightHours] = useState('12');
  const [tentL, setTentL] = useState('4');
  const [tentW, setTentW] = useState('4');
  const [tentH, setTentH] = useState('6.5');
  const [targetCo2, setTargetCo2] = useState('1200');
  const [hasFilter, setHasFilter] = useState(true);
  const [powerWatts, setPowerWatts] = useState('480');
  const [kwhRate, setKwhRate] = useState('0.14');
  const [feedPpm, setFeedPpm] = useState('600');
  const [runoffPpm, setRunoffPpm] = useState('850');
  const [inputEc, setInputEc] = useState('1.6');
  const [potSizeGal, setPotSizeGal] = useState('5');
  const [wetWeight, setWetWeight] = useState('1000');
  const [rosinInput, setRosinInput] = useState('28');
  const [rosinOutput, setRosinOutput] = useState('5.6');
  const [rawAcidMass, setRawAcidMass] = useState('100');
  const [inputBiomass, setInputBiomass] = useState('454');
  const [targetYield, setTargetYield] = useState('15');
  const [crudeMass, setCrudeMass] = useState('10');
  const [crudePurity, setCrudePurity] = useState('75');
  const [carrierVol, setCarrierVol] = useState('30');

  const parse = (val) => parseFloat(val) || 0;

  const dli = (parse(ppfd) * parse(lightHours) * 3600) / 1000000;
  const tC = (parse(tempF) - 32) * (5/9);
  const svp = 0.61078 * Math.exp((17.27 * tC) / (tC + 237.3));
  const vpd = svp * (1 - (parse(rh) / 100));
  let vpdStatus = { text: "Optimal Transpiration", color: "#00cc66" };
  if (vpd < 0.8) vpdStatus = { text: "Low VPD (Mold Risk)", color: "#3b82f6" };
  if (vpd > 1.4) vpdStatus = { text: "High VPD (Plant Stress)", color: "#ef4444" };

  const tentCuFt = parse(tentL) * parse(tentW) * parse(tentH);
  const co2NeededCuFt = tentCuFt * ((parse(targetCo2) - 400) / 1000000);
  const reqCfm = tentCuFt * (hasFilter ? 1.35 : 1.0);
  const dailyKwh = (parse(powerWatts) * parse(lightHours)) / 1000;
  const monthlyCost = dailyKwh * parse(kwhRate) * 30.4;
  const ecVal = parse(inputEc);
  const ppm500 = ecVal * 500;
  const ppm700 = ecVal * 700;
  const flushGal = parse(potSizeGal) * 3;
  const ppmDelta = parse(runoffPpm) - parse(feedPpm);
  let runoffStatus = { text: "Optimal Nutrient Consumption", color: "#00cc66" };
  if (ppmDelta > 300) runoffStatus = { text: "Salt Accumulation (Flush)", color: "#ef4444" };
  if (ppmDelta < -100) runoffStatus = { text: "Underfed (Increase PPM)", color: "#f59e0b" };

  const estDryYield = parse(wetWeight) * 0.22;
  const rosinYieldPct = parse(rosinInput) > 0 ? (parse(rosinOutput) / parse(rosinInput)) * 100 : 0;
  const postDecarbActive = parse(rawAcidMass) * 0.877;
  const estCrude = parse(inputBiomass) * (parse(targetYield) / 100);
  const totalActive = parse(crudeMass) * 1000 * (parse(crudePurity) / 100);
  const concentration = parse(carrierVol) > 0 ? (totalActive / parse(carrierVol)) : 0;

  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.05em', marginTop: '4px' };
  const labelStyle = { color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const infoStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid #222', borderRadius: '8px', padding: '10px', marginBottom: '12px', fontSize: '0.82em', lineHeight: '1.4' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Back</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Agronomy & Extract</h2>
      </header>

      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Environment', 'Nutrients', 'Extract', 'Guide'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: activeTab === tab ? '#00cc66' : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>{tab}</button>
        ))}
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '95px' }}>
        {activeTab === 'Environment' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#ef4444' }}>Vapor Pressure Deficit (VPD)</h3>
              <div style={infoStyle}><strong style={{ color: '#00ffff' }}>What it does:</strong> Measures drying potential between leaves and room air.</div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Temp (°F)<input type="number" value={tempF} onChange={e=>setTempF(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Humidity (%)<input type="number" value={rh} onChange={e=>setRh(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><strong style={{ color: '#fff' }}>VPD:</strong><strong style={{ color: vpdStatus.color }}>{vpd.toFixed(2)} kPa</strong></div>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: vpdStatus.color, fontWeight: 'bold' }}>{vpdStatus.text}</div>
              </div>
            </div>
            <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#f59e0b' }}>Photobiology (DLI)</h3>
              <div style={infoStyle}><strong style={{ color: '#00ffff' }}>What it does:</strong> Converts continuous PPFD intensity into cumulative photons delivered over 24 hours.</div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>PPFD (µmol)<input type="number" value={ppfd} onChange={e=>setPpfd(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Hours/Day<input type="number" value={lightHours} onChange={e=>setLightHours(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', border: '1px solid #222' }}><strong style={{ color: '#fff' }}>Total DLI:</strong><strong style={{ color: dli >= 40 ? '#ef4444' : '#00cc66' }}>{dli.toFixed(1)}</strong></div>
            </div>
            <div style={{ ...cardStyle, borderTop: '4px solid #00ffff' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#00ffff' }}>CO2 & Vent Engine</h3>
              <div style={infoStyle}><strong style={{ color: '#00ffff' }}>What it does:</strong> Calculates required gas volume to hit 1200 PPM target and the minimum exhaust CFM needed to clear the space.</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>L (ft)<input type="number" value={tentL} onChange={e=>setTentL(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>W (ft)<input type="number" value={tentW} onChange={e=>setTentW(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>H (ft)<input type="number" value={tentH} onChange={e=>setTentH(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ marginBottom: '12px' }}><label style={labelStyle}>Target CO2 (PPM)<input type="number" value={targetCo2} onChange={e=>setTargetCo2(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ background: '#000', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', border: '1px solid #222' }}><span style={{ color: '#aaa' }}>CO2 Needed:</span><strong style={{ color: '#00ffff' }}>+{co2NeededCuFt.toFixed(3)} cu ft</strong></div>
              <div style={{ background: '#000', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', border: '1px solid #222', marginTop: '10px' }}><span style={{ color: '#aaa' }}>Exhaust Need:</span><strong style={{ color: '#3b82f6' }}>{Math.ceil(reqCfm)} CFM</strong></div>
            </div>
            <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#a855f7' }}>Electrical Cost</h3>
              <div style={infoStyle}><strong style={{ color: '#00ffff' }}>What it does:</strong> Projects true monthly operating expenses based on actual wattage draw and local utility rates.</div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Watts<input type="number" value={powerWatts} onChange={e=>setPowerWatts(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Cost/kWh ($)<input type="number" step="0.01" value={kwhRate} onChange={e=>setKwhRate(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ background: '#000', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>Monthly Draw:</span><strong style={{ color: '#00cc66' }}>${monthlyCost.toFixed(2)} / mo</strong></div>
            </div>
          </>
        )}

        {activeTab === 'Nutrients' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#3b82f6' }}>Runoff Delta Tracker</h3>
              <div style={infoStyle}><strong style={{ color: '#00ffff' }}>What it does:</strong> Measures the difference between feed input and drainage to detect toxic salt lockout.</div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Feed PPM<input type="number" value={feedPpm} onChange={e=>setFeedPpm(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Runoff PPM<input type="number" value={runoffPpm} onChange={e=>setRunoffPpm(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><strong style={{ color: '#fff' }}>PPM Delta:</strong><strong style={{ color: runoffStatus.color }}>{ppmDelta > 0 ? '+' : ''}{ppmDelta} PPM</strong></div>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: runoffStatus.color, fontWeight: 'bold' }}>{runoffStatus.text}</div>
              </div>
            </div>
            <div style={{ ...cardStyle, borderTop: '4px solid #00ffff' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#00ffff' }}>EC to PPM Bridge</h3>
              <div style={infoStyle}><strong style={{ color: '#00ffff' }}>What it does:</strong> Converts electrical conductivity (mS/cm) into standard 500 (Hanna) or 700 (Truncheon) PPM scales.</div>
              <div style={{ marginBottom: '15px' }}><label style={labelStyle}>Conductivity (EC)<input type="number" step="0.1" value={inputEc} onChange={e=>setInputEc(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1, background: '#000', padding: '12px', borderRadius: '8px', textAlign: 'center' }}><span style={{ color: '#888', display: 'block' }}>500 Scale</span><strong style={{ color: '#00cc66' }}>{ppm500.toFixed(0)}</strong></div>
                <div style={{ flex: 1, background: '#000', padding: '12px', borderRadius: '8px', textAlign: 'center' }}><span style={{ color: '#888', display: 'block' }}>700 Scale</span><strong style={{ color: '#f59e0b' }}>{ppm700.toFixed(0)}</strong></div>
              </div>
            </div>
            <div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#ef4444' }}>Flush Volume Sizer</h3>
              <div style={infoStyle}><strong style={{ color: '#00ffff' }}>What it does:</strong> Calculates the exact 3x volume of RO water required to safely strip accumulated salts from the root zone.</div>
              <div style={{ marginBottom: '12px' }}><label style={labelStyle}>Pot Size (Gal)<input type="number" value={potSizeGal} onChange={e=>setPotSizeGal(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ background: '#000', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>Target Flush:</span><strong style={{ color: '#ef4444' }}>{flushGal} Gal RO</strong></div>
            </div>
          </>
        )}

        {activeTab === 'Extract' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#3b82f6' }}>Wet-to-Dry Estimator</h3>
              <div style={infoStyle}><strong style={{ color: '#00ffff' }}>What it does:</strong> Projects final cured mass from wet harvest weight based on standard 78% moisture dissipation.</div>
              <div style={{ marginBottom: '15px' }}><label style={labelStyle}>Fresh Wet Weight (g)<input type="number" value={wetWeight} onChange={e=>setWetWeight(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: '#fff' }}>Cured (22%):</strong><strong style={{ color: '#3b82f6' }}>{estDryYield.toFixed(1)} g</strong></div>
            </div>
            <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#f59e0b' }}>Rosin Press Yield</h3>
              <div style={infoStyle}><strong style={{ color: '#00ffff' }}>What it does:</strong> Calculates true mechanical extraction efficiency percentage from raw hash or flower inputs.</div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Input (g)<input type="number" value={rosinInput} onChange={e=>setRosinInput(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Output (g)<input type="number" value={rosinOutput} onChange={e=>setRosinOutput(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ background: '#000', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>Efficiency:</span><strong style={{ color: '#00cc66' }}>{rosinYieldPct.toFixed(1)}%</strong></div>
            </div>
            <div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#ef4444' }}>Decarb Loss Engine</h3>
              <div style={infoStyle}><strong style={{ color: '#00ffff' }}>What it does:</strong> Calculates the true active yield remaining after thermal CO2 carboxyl groups detach during baking/heating.</div>
              <div style={{ marginBottom: '12px' }}><label style={labelStyle}>Raw Acid Mass (g)<input type="number" value={rawAcidMass} onChange={e=>setRawAcidMass(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ background: '#000', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>Active Yield:</span><strong style={{ color: '#ef4444' }}>{postDecarbActive.toFixed(2)} g</strong></div>
            </div>
            <div style={{ ...cardStyle, borderTop: '4px solid #00cc66' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#00cc66' }}>Biomass Yield</h3>
              <div style={infoStyle}><strong style={{ color: '#00ffff' }}>What it does:</strong> Estimates total crude oil return based on target solvent efficiency and starting biomass.</div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Input Mass (g)<input type="number" value={inputBiomass} onChange={e=>setInputBiomass(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Target Yield (%)<input type="number" value={targetYield} onChange={e=>setTargetYield(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: '#fff' }}>Est. Crude:</strong><strong style={{ color: '#00cc66' }}>{estCrude.toFixed(1)} g</strong></div>
            </div>
            <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#a855f7' }}>Volumetric Concentration</h3>
              <div style={infoStyle}><strong style={{ color: '#00ffff' }}>What it does:</strong> Determines the exact final milligram per milliliter (mg/mL) dosing strength for mixed tinctures and cartridges.</div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Crude Mass (g)<input type="number" value={crudeMass} onChange={e=>setCrudeMass(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Purity (%)<input type="number" value={crudePurity} onChange={e=>setCrudePurity(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ marginBottom: '15px' }}><label style={labelStyle}>Carrier Volume (mL)<input type="number" value={carrierVol} onChange={e=>setCarrierVol(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px', borderBottom: '1px dashed #333', paddingBottom: '10px' }}><span>Total Active:</span> <span>{totalActive.toFixed(0)} mg</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: '#fff' }}>Concentration:</strong><strong style={{ color: '#a855f7' }}>{concentration.toFixed(1)} mg/mL</strong></div>
              </div>
            </div>
          </>
        )}
        {activeTab === 'Guide' && (
          <>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {['Compliance', 'Terpenes', 'Lighting', 'Pro Tips', 'Climate', 'Soil & NPK', 'Deficiencies', 'Cloning', 'Training', 'Flowering', 'Harvest', 'IPM'].map(sub => (
                <button key={sub} onClick={() => setGuideTab(sub)} style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: guideTab === sub ? 'rgba(0, 204, 102, 0.2)' : '#151515', color: guideTab === sub ? '#00cc66' : '#888' }}>{sub}</button>
              ))}
            </div>

            {guideTab === 'Compliance' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#ef4444' }}>Legal Framework & Processing Laws</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>• <strong>Hemp Threshold:</strong> Federal 2018 Farm Bill limits dry-weight Δ9-THC to 0.3%. Extraction concentrates cannabinoids, which can elevate crude extract above statutory limits during processing.<br/>• <strong>Volatile Solvents:</strong> Residential open-blast or closed-loop butane/propane extractions are criminalized in most jurisdictions. Mechanical heat/pressure (rosin) and ice water separation are legally distinct non-volatile methods.<br/>• <strong>Enclosed Space & Plant Caps:</strong> State-regulated home cultivation universally requires locked, fully enclosed spaces shielded from public view with strict household plant limits.</p>
                </div>
              </div>
            )}

            {guideTab === 'Terpenes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, background: 'rgba(168, 85, 247, 0.05)', borderLeft: '4px solid #a855f7' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#a855f7' }}>What is a Terpene?</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.5' }}>
                    Terpenes are highly volatile aromatic compounds produced in resin glands. They dictate unique smells and flavors. More importantly, they work synergistically with cannabinoids (the "Entourage Effect") to steer physical and psychoactive effects.
                  </p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 4px 0', color: '#f59e0b' }}>Myrcene (Boiling Pt: 332°F)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}><strong>Aroma:</strong> Earthy, herbal, clove.<br/><strong>Effects:</strong> Heavy sedative, "couch-lock", muscle relaxation. Enhances THC blood-brain barrier permeability.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00ffff' }}>
                  <h3 style={{ margin: '0 0 4px 0', color: '#00ffff' }}>Limonene (Boiling Pt: 349°F)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}><strong>Aroma:</strong> Sharp citrus, lemon.<br/><strong>Effects:</strong> Uplifting, mood elevation, anxiety relief.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 4px 0', color: '#ef4444' }}>β-Caryophyllene (Boiling Pt: 266°F)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}><strong>Aroma:</strong> Black pepper, spicy.<br/><strong>Effects:</strong> Binds directly to CB2 peripheral receptors. Powerful anti-inflammatory and pain relief.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                  <h3 style={{ margin: '0 0 4px 0', color: '#3b82f6' }}>Linalool (Boiling Pt: 388°F)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}><strong>Aroma:</strong> Floral, lavender.<br/><strong>Effects:</strong> Strong sedative, calming, anticonvulsant.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 4px 0', color: '#00cc66' }}>Pinene (Boiling Pt: 311°F)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}><strong>Aroma:</strong> Pine needles, fresh forest.<br/><strong>Effects:</strong> Alertness, memory retention, bronchodilator.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #a3e635' }}>
                  <h3 style={{ margin: '0 0 4px 0', color: '#a3e635' }}>Humulene (Boiling Pt: 223°F)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}><strong>Aroma:</strong> Earthy, woody, hops.<br/><strong>Effects:</strong> Appetite suppressant, antibacterial.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #fbbf24' }}>
                  <h3 style={{ margin: '0 0 4px 0', color: '#fbbf24' }}>Terpinolene (Boiling Pt: 366°F)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}><strong>Aroma:</strong> Piney, floral, herbal.<br/><strong>Effects:</strong> Sedating, antioxidant.</p>
                </div>
              </div>
            )}

            {guideTab === 'Lighting' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#f59e0b' }}>Grow Light Technologies</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>• <strong>LED:</strong> High efficiency, low heat. Best for power budgets.<br/>• <strong>CMH:</strong> Great penetration, runs cooler than HPS.<br/>• <strong>HPS:</strong> Traditional flowering giant. Draws heavy power.</p>
                </div>
              </div>
            )}
            
            {guideTab === 'Pro Tips' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00ffff' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#00ffff' }}>Leaf Surface Temperature</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>Active transpiration cools leaves <strong>2°F to 5°F below ambient air</strong>. Measure canopy tops with an IR thermometer for precision VPD.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#3b82f6' }}>Reservoir Temp</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>Maintain water strictly at <strong>65°F to 68°F</strong> to prevent Pythium and maximize dissolved oxygen.</p>
                </div>
              </div>
            )}

            {guideTab === 'Climate' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#00cc66' }}>Humidity Targets</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>• <strong>Veg:</strong> 50–65% RH<br/>• <strong>Bloom:</strong> 35–45% RH<br/>• <strong>Day/Night Swing:</strong> Maximum 15°F drop to prevent condensation and Botrytis spores.</p>
                </div>
              </div>
            )}

            {guideTab === 'Soil & NPK' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#00cc66' }}>The Mixing Order</h3>
                  <ol style={{ color: '#fff', fontSize: '0.85em', paddingLeft: '16px', lineHeight: '1.5', margin: 0 }}>
                    <li>Silica (Stem rigidity)</li>
                    <li>Cal / Mag</li>
                    <li>Base Nutrients (Micro ➔ Grow ➔ Bloom)</li>
                    <li>PK Boosters & Additives</li>
                    <li>pH Correction (5.8 coco / 6.3 soil)</li>
                    <li>Beneficial Microbes</li>
                  </ol>
                </div>
              </div>
            )}

            {guideTab === 'Deficiencies' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#f59e0b' }}>Nitrogen (N)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0 }}>Lower mature leaves yellowing and dropping off. Mobile element.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#a855f7' }}>Phosphorus (P)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0 }}>Dark purple petioles, bronze necrotic patches, stunted bloom growth.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>Potassium (K)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0 }}>Scorched leaf margins, curling edges, brown necrosis.</p>
                </div>
              </div>
            )}

            {guideTab === 'Cloning' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#3b82f6' }}>Cloning & Propagation</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0 }}>Make razor cuts at a 45° angle, dip immediately in IBA rooting hormone, and maintain 80%+ humidity inside a dome under low PPFD (100–150).</p>
                </div>
              </div>
            )}

            {guideTab === 'Training' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>Canopy Management</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0 }}>Top main stem above the 5th node. Soft-pinch stems (supercropping) into horizontal trellis grids to create an even light canopy and maximize yield.</p>
                </div>
              </div>
            )}

            {guideTab === 'Flowering' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#a855f7' }}>The 12/12 Flip</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0 }}>Transition light timers to 12 hours ON / 12 hours OFF. Ensure absolutely zero light leaks during the dark cycle to eliminate hermaphroditic stress.</p>
                </div>
              </div>
            )}

            {guideTab === 'Harvest' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#00cc66' }}>Trichome Maturity Ratios</h3>
                  <ul style={{ color: '#aaa', fontSize: '0.85em', paddingLeft: '16px', lineHeight: '1.5', margin: 0 }}>
                    <li><strong>Clear:</strong> Immature. Low cannabinoid content.</li>
                    <li><strong>Milky:</strong> Peak potency and terpene expression.</li>
                    <li><strong>Amber:</strong> Degradation into sedative CBN (Harvest target: 70% Milky / 25% Amber).</li>
                  </ul>
                </div>
              </div>
            )}

            {guideTab === 'IPM' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>Integrated Pest Management</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0 }}>Apply Diatomaceous Earth to dry topsoil for gnat larvae. Rotate cold-pressed Neem and botanical soaps weekly during veg. Never spray flowers.</p>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default function AgronomyCalc() {
  return <ErrorBoundary><AgronomyUI /></ErrorBoundary>;
}
        {activeTab === 'Guide' && (
          <>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {['Compliance', 'Terpenes', 'Lighting', 'Pro Tips', 'Climate', 'Soil & NPK', 'Deficiencies', 'Cloning', 'Training', 'Flowering', 'Harvest', 'IPM'].map(sub => (
                <button key={sub} onClick={() => setGuideTab(sub)} style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: guideTab === sub ? 'rgba(0, 204, 102, 0.2)' : '#151515', color: guideTab === sub ? '#00cc66' : '#888' }}>{sub}</button>
              ))}
            </div>

            {guideTab === 'Compliance' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#ef4444' }}>Legal Framework & Processing Laws</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>• <strong>Hemp Threshold:</strong> Federal 2018 Farm Bill limits dry-weight Δ9-THC to 0.3%. Extraction concentrates cannabinoids, which can elevate crude extract above statutory limits during processing.<br/>• <strong>Volatile Solvents:</strong> Residential open-blast or closed-loop butane/propane extractions are criminalized in most jurisdictions. Mechanical heat/pressure (rosin) and ice water separation are legally distinct non-volatile methods.<br/>• <strong>Enclosed Space & Plant Caps:</strong> State-regulated home cultivation universally requires locked, fully enclosed spaces shielded from public view with strict household plant limits.</p>
                </div>
              </div>
            )}

            {guideTab === 'Terpenes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, background: 'rgba(168, 85, 247, 0.05)', borderLeft: '4px solid #a855f7' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#a855f7' }}>What is a Terpene?</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.5' }}>
                    Terpenes are highly volatile aromatic compounds produced in resin glands. They dictate unique smells and flavors. More importantly, they work synergistically with cannabinoids (the "Entourage Effect") to steer physical and psychoactive effects.
                  </p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 4px 0', color: '#f59e0b' }}>Myrcene (Boiling Pt: 332°F)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}><strong>Aroma:</strong> Earthy, herbal, clove.<br/><strong>Effects:</strong> Heavy sedative, "couch-lock", muscle relaxation. Enhances THC blood-brain barrier permeability.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00ffff' }}>
                  <h3 style={{ margin: '0 0 4px 0', color: '#00ffff' }}>Limonene (Boiling Pt: 349°F)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}><strong>Aroma:</strong> Sharp citrus, lemon.<br/><strong>Effects:</strong> Uplifting, mood elevation, anxiety relief.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 4px 0', color: '#ef4444' }}>β-Caryophyllene (Boiling Pt: 266°F)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}><strong>Aroma:</strong> Black pepper, spicy.<br/><strong>Effects:</strong> Binds directly to CB2 peripheral receptors. Powerful anti-inflammatory and pain relief.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                  <h3 style={{ margin: '0 0 4px 0', color: '#3b82f6' }}>Linalool (Boiling Pt: 388°F)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}><strong>Aroma:</strong> Floral, lavender.<br/><strong>Effects:</strong> Strong sedative, calming, anticonvulsant.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 4px 0', color: '#00cc66' }}>Pinene (Boiling Pt: 311°F)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}><strong>Aroma:</strong> Pine needles, fresh forest.<br/><strong>Effects:</strong> Alertness, memory retention, bronchodilator.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #a3e635' }}>
                  <h3 style={{ margin: '0 0 4px 0', color: '#a3e635' }}>Humulene (Boiling Pt: 223°F)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}><strong>Aroma:</strong> Earthy, woody, hops.<br/><strong>Effects:</strong> Appetite suppressant, antibacterial.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #fbbf24' }}>
                  <h3 style={{ margin: '0 0 4px 0', color: '#fbbf24' }}>Terpinolene (Boiling Pt: 366°F)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}><strong>Aroma:</strong> Piney, floral, herbal.<br/><strong>Effects:</strong> Sedating, antioxidant.</p>
                </div>
              </div>
            )}

            {guideTab === 'Lighting' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#f59e0b' }}>Grow Light Technologies</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>• <strong>LED:</strong> High efficiency, low heat. Best for power budgets.<br/>• <strong>CMH:</strong> Great penetration, runs cooler than HPS.<br/>• <strong>HPS:</strong> Traditional flowering giant. Draws heavy power.</p>
                </div>
              </div>
            )}
            
            {guideTab === 'Pro Tips' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00ffff' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#00ffff' }}>Leaf Surface Temperature</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>Active transpiration cools leaves <strong>2°F to 5°F below ambient air</strong>. Measure canopy tops with an IR thermometer for precision VPD.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#3b82f6' }}>Reservoir Temp</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>Maintain water strictly at <strong>65°F to 68°F</strong> to prevent Pythium and maximize dissolved oxygen.</p>
                </div>
              </div>
            )}

            {guideTab === 'Climate' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#00cc66' }}>Humidity Targets</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>• <strong>Veg:</strong> 50–65% RH<br/>• <strong>Bloom:</strong> 35–45% RH<br/>• <strong>Day/Night Swing:</strong> Maximum 15°F drop to prevent condensation and Botrytis spores.</p>
                </div>
              </div>
            )}

            {guideTab === 'Soil & NPK' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#00cc66' }}>The Mixing Order</h3>
                  <ol style={{ color: '#fff', fontSize: '0.85em', paddingLeft: '16px', lineHeight: '1.5', margin: 0 }}>
                    <li>Silica (Stem rigidity)</li>
                    <li>Cal / Mag</li>
                    <li>Base Nutrients (Micro ➔ Grow ➔ Bloom)</li>
                    <li>PK Boosters & Additives</li>
                    <li>pH Correction (5.8 coco / 6.3 soil)</li>
                    <li>Beneficial Microbes</li>
                  </ol>
                </div>
              </div>
            )}

            {guideTab === 'Deficiencies' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#f59e0b' }}>Nitrogen (N)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0 }}>Lower mature leaves yellowing and dropping off. Mobile element.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#a855f7' }}>Phosphorus (P)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0 }}>Dark purple petioles, bronze necrotic patches, stunted bloom growth.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>Potassium (K)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0 }}>Scorched leaf margins, curling edges, brown necrosis.</p>
                </div>
              </div>
            )}

            {guideTab === 'Cloning' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#3b82f6' }}>Cloning & Propagation</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0 }}>Make razor cuts at a 45° angle, dip immediately in IBA rooting hormone, and maintain 80%+ humidity inside a dome under low PPFD (100–150).</p>
                </div>
              </div>
            )}

            {guideTab === 'Training' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>Canopy Management</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0 }}>Top main stem above the 5th node. Soft-pinch stems (supercropping) into horizontal trellis grids to create an even light canopy and maximize yield.</p>
                </div>
              </div>
            )}

            {guideTab === 'Flowering' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#a855f7' }}>The 12/12 Flip</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0 }}>Transition light timers to 12 hours ON / 12 hours OFF. Ensure absolutely zero light leaks during the dark cycle to eliminate hermaphroditic stress.</p>
                </div>
              </div>
            )}

            {guideTab === 'Harvest' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#00cc66' }}>Trichome Maturity Ratios</h3>
                  <ul style={{ color: '#aaa', fontSize: '0.85em', paddingLeft: '16px', lineHeight: '1.5', margin: 0 }}>
                    <li><strong>Clear:</strong> Immature. Low cannabinoid content.</li>
                    <li><strong>Milky:</strong> Peak potency and terpene expression.</li>
                    <li><strong>Amber:</strong> Degradation into sedative CBN (Harvest target: 70% Milky / 25% Amber).</li>
                  </ul>
                </div>
              </div>
            )}

            {guideTab === 'IPM' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>Integrated Pest Management</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0 }}>Apply Diatomaceous Earth to dry topsoil for gnat larvae. Rotate cold-pressed Neem and botanical soaps weekly during veg. Never spray flowers.</p>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default function AgronomyCalc() {
  return <ErrorBoundary><AgronomyUI /></ErrorBoundary>;
}
