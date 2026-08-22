import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ShootingCalc() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Solution'); 

  // --- UNIT SELECTION ---
  const [angleUnit, setAngleUnit] = useState('MIL'); // 'MIL' or 'MOA'

  // --- STATE: WEAPON, SIGHT & LOAD ---
  const [bulletGr, setBulletGr] = useState('168');
  const [muzzleFps, setMuzzleFps] = useState('2600');
  const [bc, setBc] = useState('0.462');
  const [sightHeight, setSightHeight] = useState('1.5'); // Inches over bore
  const [zeroRange, setZeroRange] = useState('100');     // Yards

  // --- STATE: ENVIRONMENT & TARGET ---
  const [distance, setDistance] = useState('1000');
  const [windSpd, setWindSpd] = useState('10');
  const [windClock, setWindClock] = useState('3'); // 3 o'clock (90 deg full value)
  const [tempF, setTempF] = useState('70');
  const [altitude, setAltitude] = useState('2400');

  // --- STATE: COMPARATOR ---
  const [loadAGr, setLoadAGr] = useState('150');
  const [loadAVel, setLoadAVel] = useState('2820');
  const [loadABc, setLoadABc] = useState('0.350');
  const [loadBGr, setLoadBGr] = useState('175');
  const [loadBVel, setLoadBVel] = useState('2550');
  const [loadBBc, setLoadBBc] = useState('0.505');

  // --- STATE: DOPE CARD ---
  const [dopeStart, setDopeStart] = useState('100');
  const [dopeEnd, setDopeEnd] = useState('1000');
  const [dopeStep, setDopeStep] = useState('50');
  const [dopeWind, setDopeWind] = useState('10');

  // --- STATE: RELOADING BENCH ---
  const [reloadMode, setReloadMode] = useState('Metallic'); 
  const [factoryBoxPrice, setFactoryBoxPrice] = useState('32.00');
  const [factoryBoxCount, setFactoryBoxCount] = useState('20');

  // Metallic Inputs
  const [brassCost, setBrassCost] = useState('65.00'); 
  const [brassQty, setBrassQty] = useState('100');
  const [brassReuses, setBrassReuses] = useState('5');
  const [primerCost, setPrimerCost] = useState('85.00');
  const [primerQty, setPrimerQty] = useState('1000');
  const [projCost, setProjCost] = useState('42.00');
  const [projQty, setProjQty] = useState('100');
  const [pwdCost, setPwdCost] = useState('48.00');
  const [pwdLbs, setPwdLbs] = useState('1');
  const [pwdCharge, setPwdCharge] = useState('43.5');

  // Shotshell Inputs
  const [hullCost, setHullCost] = useState('0');
  const [hullQty, setHullQty] = useState('100');
  const [hullReuses, setHullReuses] = useState('4');
  const [wadCost, setWadCost] = useState('16.00');
  const [wadQty, setWadQty] = useState('500');
  const [shotCost, setShotCost] = useState('54.00');
  const [shotLbs, setShotLbs] = useState('25');
  const [shotOz, setShotOz] = useState('1.125');

  const parse = (val) => parseFloat(val) || 0;

  // --- BALLISTICS MATHEMATICAL ENGINE ---
  const calcBallistics = (distYds, v0, weightGr, g1Bc, hBore, zeroYds, wMph, clock) => {
    const d = parse(distYds);
    const v = parse(v0);
    const gr = parse(weightGr);
    const b = Math.max(0.05, parse(g1Bc));
    const sh = parse(hBore);
    const z = Math.max(25, parse(zeroYds));
    const wind = parse(wMph);

    // Velocity Decay
    const dragFactor = 800 / (b * 1000 + 200);
    const termV = Math.max(400, v - (d * dragFactor * 0.62));
    const avgV = (v + termV) / 2;
    const tof = avgV > 0 ? (d * 3) / avgV : 0;

    // Physical Drop
    const dropAtD = 0.5 * 32.174 * Math.pow(tof, 2) * 12;
    const tofZero = (z * 3) / (v - (z * dragFactor * 0.31));
    const dropAtZero = 0.5 * 32.174 * Math.pow(tofZero, 2) * 12;
    
    // Trajectory adjustment relative to sight line
    const netDropInches = dropAtD - (dropAtZero * (d / z)) + sh * ((d / z) - 1);
    
    // Angular Units
    const milElev = d > 0 ? (netDropInches / (d * 0.036)) : 0;
    const moaElev = milElev * 3.4377;

    // Wind Drift
    const clockRad = (parse(clock) / 12) * 2 * Math.PI;
    const crosswindMph = wind * Math.abs(Math.sin(clockRad));
    const windDeflectionInches = crosswindMph * (tof - (d * 3 / v)) * 1.6;
    const milWind = d > 0 ? (windDeflectionInches / (d * 0.036)) : 0;
    const moaWind = milWind * 3.4377;

    // Kinetics
    const muzEnergy = (gr * Math.pow(v, 2)) / 450240;
    const termEnergy = (gr * Math.pow(termV, 2)) / 450240;

    return {
      termV,
      tof,
      netDropInches,
      milElev,
      moaElev,
      milWind,
      moaWind,
      muzEnergy,
      termEnergy,
      isSubsonic: termV < 1125,
      isTransonic: termV >= 1125 && termV <= 1340
    };
  };

  const sol = calcBallistics(distance, muzzleFps, bulletGr, bc, sightHeight, zeroRange, windSpd, windClock);

  // --- RELOADING MATHEMATICAL ENGINE ---
  const pCost = parse(primerQty) > 0 ? parse(primerCost) / parse(primerQty) : 0;
  const totalPowderGrains = parse(pwdLbs) * 7000;
  const pwdCostPerGrain = totalPowderGrains > 0 ? parse(pwdCost) / totalPowderGrains : 0;
  const pwdCostPerCharge = pwdCostPerGrain * parse(pwdCharge);
  const yieldPerJug = parse(pwdCharge) > 0 ? Math.floor(totalPowderGrains / parse(pwdCharge)) : 0;

  // Metallic
  const effBrassCost = (parse(brassQty) > 0 && parse(brassReuses) > 0) ? (parse(brassCost) / parse(brassQty)) / parse(brassReuses) : 0;
  const prCost = parse(projQty) > 0 ? parse(projCost) / parse(projQty) : 0;
  const metCpr = effBrassCost + pCost + prCost + pwdCostPerCharge;
  const metBox50 = metCpr * 50;
  const metCase1000 = metCpr * 1000;

  // Shotshell
  const effHullCost = (parse(hullQty) > 0 && parse(hullReuses) > 0) ? (parse(hullCost) / parse(hullQty)) / parse(hullReuses) : 0;
  const wCost = parse(wadQty) > 0 ? parse(wadCost) / parse(wadQty) : 0;
  const totalShotOunces = parse(shotLbs) * 16;
  const shotCostPerOz = totalShotOunces > 0 ? parse(shotCost) / totalShotOunces : 0;
  const shotCostPerShell = shotCostPerOz * parse(shotOz);
  const shellsPerBag = parse(shotOz) > 0 ? Math.floor(totalShotOunces / parse(shotOz)) : 0;
  const shellCpr = effHullCost + pCost + wCost + shotCostPerShell + pwdCostPerCharge;
  const shellBox25 = shellCpr * 25;
  const shellFlat250 = shellCpr * 250;

  // Factory Comparison
  const currentCpr = reloadMode === 'Metallic' ? metCpr : shellCpr;
  const fBoxP = parse(factoryBoxPrice);
  const fBoxC = Math.max(1, parse(factoryBoxCount));
  const factoryCpr = fBoxP / fBoxC;
  const savingsPerRound = Math.max(0, factoryCpr - currentCpr);
  const savingsPer1000 = savingsPerRound * 1000;

  // --- STYLES ---
  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.05em', marginTop: '4px' };
  const labelStyle = { color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const flexWrap = { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' };
  const inputWrap = { flex: '1 1 110px', minWidth: '110px' };

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate('/calculator')}>Hub</button>
        <h2>Ballistics & Armory</h2>
      </header>

      {/* TABS */}
      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Solution', 'Comparator', 'DOPE Card', 'Reloading', 'Guide'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ padding: '8px 14px', borderRadius: '8px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: activeTab === tab ? '#00ffff' : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>
            {tab}
          </button>
        ))}
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', paddingBottom: '120px' }}>
        
        {/* ========================================== */}
        {/* TAB 1: ADVANCED FIRING SOLUTION            */}
        {/* ========================================== */}
        {activeTab === 'Solution' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', background: '#151515', padding: '10px 15px', borderRadius: '10px', border: '1px solid #333' }}>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>Angular Standard:</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => setAngleUnit('MIL')} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', fontWeight: 'bold', background: angleUnit === 'MIL' ? '#00ffff' : '#252525', color: angleUnit === 'MIL' ? '#000' : '#888' }}>MIL (0.1)</button>
                <button onClick={() => setAngleUnit('MOA')} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', fontWeight: 'bold', background: angleUnit === 'MOA' ? '#ffaa00' : '#252525', color: angleUnit === 'MOA' ? '#000' : '#888' }}>MOA (1/4)</button>
              </div>
            </div>

            <div style={{...cardStyle, borderTop: '4px solid #ef4444'}}>
              <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1em' }}>🎯 Weapon & Load Dynamics</h3>
              <div style={flexWrap}>
                <div style={inputWrap}><label style={labelStyle}>Bullet (gr)<input type="number" value={bulletGr} onChange={e=>setBulletGr(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>Muzzle (fps)<input type="number" value={muzzleFps} onChange={e=>setMuzzleFps(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>G1 BC<input type="number" step="0.001" value={bc} onChange={e=>setBc(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={flexWrap}>
                <div style={inputWrap}><label style={labelStyle}>Sight Height (in)<input type="number" step="0.1" value={sightHeight} onChange={e=>setSightHeight(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>Zero Range (yds)<input type="number" value={zeroRange} onChange={e=>setZeroRange(e.target.value)} style={inputStyle} /></label></div>
              </div>
            </div>

            <div style={{...cardStyle, borderTop: '4px solid #00cc66'}}>
              <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1em' }}>🌍 Environment & Target</h3>
              <div style={flexWrap}>
                <div style={inputWrap}><label style={labelStyle}>Target Dist (yds)<input type="number" value={distance} onChange={e=>setDistance(e.target.value)} style={{...inputStyle, border: '1px solid #00cc66'}} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>Wind (mph)<input type="number" value={windSpd} onChange={e=>setWindSpd(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}>
                  <label style={labelStyle}>Clock Angle
                    <select value={windClock} onChange={e=>setWindClock(e.target.value)} style={inputStyle}>
                      <option value="12">12:00 (Headwind)</option>
                      <option value="1">1:00 (Cross)</option>
                      <option value="2">2:00 (Cross)</option>
                      <option value="3">3:00 (Full 90°)</option>
                      <option value="6">6:00 (Tailwind)</option>
                      <option value="9">9:00 (Full 90°)</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

            {/* BALLISTIC HUD MATRIX */}
            <div style={{ border: '2px solid #00ffff', borderRadius: '12px', padding: '16px', background: '#000', marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>
                <span style={{ color: '#00ffff', letterSpacing: '1.5px', fontWeight: 'bold', fontSize: '1.05em' }}>BALLISTIC SOLUTION</span>
                <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.75em', fontWeight: 'bold', background: sol.isSubsonic ? 'rgba(239,68,68,0.2)' : sol.isTransonic ? 'rgba(255,170,0,0.2)' : 'rgba(0,204,102,0.2)', color: sol.isSubsonic ? '#ef4444' : sol.isTransonic ? '#ffaa00' : '#00cc66', border: `1px solid ${sol.isSubsonic ? '#ef4444' : sol.isTransonic ? '#ffaa00' : '#00cc66'}` }}>
                  {sol.isSubsonic ? '🔴 SUBSONIC' : sol.isTransonic ? '🟡 TRANSONIC' : '🟢 SUPERSONIC'}
                </span>
              </div>

              {/* PRIMARY TURRET HOLDS */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1, background: '#111', padding: '12px', borderRadius: '8px', border: '1px solid #ef4444', textAlign: 'center' }}>
                  <div style={{ color: '#aaa', fontSize: '0.75em', textTransform: 'uppercase' }}>Elevation Hold</div>
                  <div style={{ color: '#ef4444', fontSize: '1.8em', fontWeight: 'bold' }}>
                    {angleUnit === 'MIL' ? sol.milElev.toFixed(1) : sol.moaElev.toFixed(1)} <span style={{ fontSize: '0.5em' }}>{angleUnit}</span>
                  </div>
                  <div style={{ color: '#888', fontSize: '0.8em', marginTop: '2px' }}>
                    {angleUnit === 'MIL' ? `${Math.round(sol.milElev * 10)} clicks (0.1)` : `${Math.round(sol.moaElev * 4)} clicks (¼)`}
                  </div>
                </div>

                <div style={{ flex: 1, background: '#111', padding: '12px', borderRadius: '8px', border: '1px solid #00ffff', textAlign: 'center' }}>
                  <div style={{ color: '#aaa', fontSize: '0.75em', textTransform: 'uppercase' }}>Windage Hold</div>
                  <div style={{ color: '#00ffff', fontSize: '1.8em', fontWeight: 'bold' }}>
                    {angleUnit === 'MIL' ? sol.milWind.toFixed(1) : sol.moaWind.toFixed(1)} <span style={{ fontSize: '0.5em' }}>{angleUnit}</span>
                  </div>
                  <div style={{ color: '#888', fontSize: '0.8em', marginTop: '2px' }}>
                    {angleUnit === 'MIL' ? `${Math.round(sol.milWind * 10)} clicks (0.1)` : `${Math.round(sol.moaWind * 4)} clicks (¼)`}
                  </div>
                </div>
              </div>

              {/* FLIGHT METRICS TABLE */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.9em', color: '#aaa' }}>
                <div style={{ background: '#0a0a0a', padding: '10px', borderRadius: '6px', border: '1px solid #222' }}>
                  <span style={{ display: 'block', fontSize: '0.8em', color: '#666' }}>Linear Gravity Drop:</span>
                  <strong style={{ color: '#fff' }}>{sol.netDropInches.toFixed(1)} in</strong>
                </div>
                <div style={{ background: '#0a0a0a', padding: '10px', borderRadius: '6px', border: '1px solid #222' }}>
                  <span style={{ display: 'block', fontSize: '0.8em', color: '#666' }}>Time of Flight:</span>
                  <strong style={{ color: '#fff' }}>{sol.tof.toFixed(3)} sec</strong>
                </div>
                <div style={{ background: '#0a0a0a', padding: '10px', borderRadius: '6px', border: '1px solid #222' }}>
                  <span style={{ display: 'block', fontSize: '0.8em', color: '#666' }}>Impact Velocity:</span>
                  <strong style={{ color: '#fff' }}>{sol.termV.toFixed(0)} fps</strong>
                </div>
                <div style={{ background: '#0a0a0a', padding: '10px', borderRadius: '6px', border: '1px solid #222' }}>
                  <span style={{ display: 'block', fontSize: '0.8em', color: '#666' }}>Terminal Energy:</span>
                  <strong style={{ color: '#ffaa00' }}>{sol.termEnergy.toFixed(0)} ft-lbs</strong>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* TAB 2: LOAD COMPARATOR                     */}
        {/* ========================================== */}
        {activeTab === 'Comparator' && (
          <>
            <p style={{ color: '#aaa', textAlign: 'center', marginBottom: '15px' }}>Side-by-side trajectory and kinetic comparison.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1, ...cardStyle, borderTop: '4px solid #ef4444' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#ef4444', textAlign: 'center' }}>Load A</h4>
                <label style={labelStyle}>Grains<input type="number" value={loadAGr} onChange={e=>setLoadAGr(e.target.value)} style={inputStyle} /></label>
                <label style={{...labelStyle, marginTop: '8px', display: 'block'}}>FPS<input type="number" value={loadAVel} onChange={e=>setLoadAVel(e.target.value)} style={inputStyle} /></label>
                <label style={{...labelStyle, marginTop: '8px', display: 'block'}}>BC<input type="number" step="0.001" value={loadABc} onChange={e=>setLoadABc(e.target.value)} style={inputStyle} /></label>
              </div>
              <div style={{ flex: 1, ...cardStyle, borderTop: '4px solid #3b82f6' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#3b82f6', textAlign: 'center' }}>Load B</h4>
                <label style={labelStyle}>Grains<input type="number" value={loadBGr} onChange={e=>setLoadBGr(e.target.value)} style={inputStyle} /></label>
                <label style={{...labelStyle, marginTop: '8px', display: 'block'}}>FPS<input type="number" value={loadBVel} onChange={e=>setLoadBVel(e.target.value)} style={inputStyle} /></label>
                <label style={{...labelStyle, marginTop: '8px', display: 'block'}}>BC<input type="number" step="0.001" value={loadBBc} onChange={e=>setLoadBBc(e.target.value)} style={inputStyle} /></label>
              </div>
            </div>

            {/* COMPARATOR MATRIX */}
            <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '15px' }}>
              <h4 style={{ color: '#fff', textAlign: 'center', margin: '0 0 15px 0' }}>500 Yard Analytics</h4>
              {[
                { label: 'Muzzle Energy', a: `${((parse(loadAGr)*Math.pow(parse(loadAVel),2))/450240).toFixed(0)} ft-lbs`, b: `${((parse(loadBGr)*Math.pow(parse(loadBVel),2))/450240).toFixed(0)} ft-lbs` },
                { label: '500y Velocity', a: `${calcBallistics(500, loadAVel, loadAGr, loadABc, 1.5, 100, 10, 3).termV.toFixed(0)} fps`, b: `${calcBallistics(500, loadBVel, loadBGr, loadBBc, 1.5, 100, 10, 3).termV.toFixed(0)} fps` },
                { label: '500y Energy', a: `${calcBallistics(500, loadAVel, loadAGr, loadABc, 1.5, 100, 10, 3).termEnergy.toFixed(0)} ft-lbs`, b: `${calcBallistics(500, loadBVel, loadBGr, loadBBc, 1.5, 100, 10, 3).termEnergy.toFixed(0)} ft-lbs` },
                { label: '500y Drop (MIL)', a: `${calcBallistics(500, loadAVel, loadAGr, loadABc, 1.5, 100, 10, 3).milElev.toFixed(1)} MIL`, b: `${calcBallistics(500, loadBVel, loadBGr, loadBBc, 1.5, 100, 10, 3).milElev.toFixed(1)} MIL` },
                { label: '10mph Wind Hold', a: `${calcBallistics(500, loadAVel, loadAGr, loadABc, 1.5, 100, 10, 3).milWind.toFixed(1)} MIL`, b: `${calcBallistics(500, loadBVel, loadBGr, loadBBc, 1.5, 100, 10, 3).milWind.toFixed(1)} MIL` }
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #222', fontSize: '0.9em' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold', width: '30%', textAlign: 'left' }}>{row.a}</span>
                  <span style={{ color: '#aaa', width: '40%', textAlign: 'center', fontSize: '0.85em' }}>{row.label}</span>
                  <span style={{ color: '#3b82f6', fontWeight: 'bold', width: '30%', textAlign: 'right' }}>{row.b}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* TAB 3: DYNAMIC DOPE CARD                   */}
        {/* ========================================== */}
        {activeTab === 'DOPE Card' && (
          <>
            <div style={{...cardStyle, borderTop: '4px solid #00ffff'}}>
              <h3 style={{ margin: '0 0 12px 0', color: '#00ffff', fontSize: '1.1em' }}>⚙️ Card Generation Bounds</h3>
              <div style={flexWrap}>
                <div style={inputWrap}><label style={labelStyle}>Start (yds)<input type="number" value={dopeStart} onChange={e=>setDopeStart(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>End (yds)<input type="number" value={dopeEnd} onChange={e=>setDopeEnd(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>Step (yds)<input type="number" value={dopeStep} onChange={e=>setDopeStep(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>Wind (mph)<input type="number" value={dopeWind} onChange={e=>setDopeWind(e.target.value)} style={inputStyle} /></label></div>
              </div>
            </div>

            <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', overflow: 'hidden' }}>
              <div style={{ background: '#111', padding: '12px', textAlign: 'center', borderBottom: '1px solid #333' }}>
                <h4 style={{ margin: 0, color: '#fff' }}>BALLISTIC DOPE TABLE</h4>
                <div style={{ color: '#00ffff', fontSize: '0.8em', marginTop: '4px' }}>{bulletGr}gr | {muzzleFps} fps | BC: {bc} | Zero: {zeroRange}y</div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.8em' }}>
                  <thead>
                    <tr style={{ background: '#222', color: '#aaa' }}>
                      <th style={{ padding: '10px 6px', textAlign: 'center' }}>Yards</th>
                      <th style={{ padding: '10px 6px', textAlign: 'center' }}>Elev ({angleUnit})</th>
                      <th style={{ padding: '10px 6px', textAlign: 'center' }}>Wind ({angleUnit})</th>
                      <th style={{ padding: '10px 6px', textAlign: 'center' }}>Drop (in)</th>
                      <th style={{ padding: '10px 6px', textAlign: 'center' }}>Vel (fps)</th>
                      <th style={{ padding: '10px 6px', textAlign: 'center' }}>Energy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const rows = [];
                      const s = Math.max(0, parse(dopeStart));
                      const e = Math.max(s, parse(dopeEnd));
                      const step = Math.max(10, parse(dopeStep));
                      for (let r = s; r <= e; r += step) {
                        const pt = calcBallistics(r, muzzleFps, bulletGr, bc, sightHeight, zeroRange, dopeWind, 3);
                        rows.push(
                          <tr key={r} style={{ borderBottom: '1px solid #1a1a1a' }}>
                            <td style={{ padding: '10px 6px', fontWeight: 'bold', textAlign: 'center' }}>{r}</td>
                            <td style={{ padding: '10px 6px', textAlign: 'center', color: '#ef4444', fontWeight: 'bold' }}>{angleUnit === 'MIL' ? pt.milElev.toFixed(1) : pt.moaElev.toFixed(1)}</td>
                            <td style={{ padding: '10px 6px', textAlign: 'center', color: '#00ffff' }}>{angleUnit === 'MIL' ? pt.milWind.toFixed(1) : pt.moaWind.toFixed(1)}</td>
                            <td style={{ padding: '10px 6px', textAlign: 'center', color: '#aaa' }}>{pt.netDropInches.toFixed(1)}</td>
                            <td style={{ padding: '10px 6px', textAlign: 'center', color: pt.isSubsonic ? '#ef4444' : pt.isTransonic ? '#ffaa00' : '#fff' }}>{pt.termV.toFixed(0)}</td>
                            <td style={{ padding: '10px 6px', textAlign: 'center', color: '#ffaa00' }}>{pt.termEnergy.toFixed(0)}</td>
                          </tr>
                        );
                      }
                      return rows;
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* TAB 4: ADVANCED RELOADING BENCH            */}
        {/* ========================================== */}
        {activeTab === 'Reloading' && (
          <>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <button onClick={() => setReloadMode('Metallic')} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: reloadMode === 'Metallic' ? '#a855f7' : '#222', color: reloadMode === 'Metallic' ? '#fff' : '#888' }}>Metallic Cartridge</button>
              <button onClick={() => setReloadMode('Shotshell')} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: reloadMode === 'Shotshell' ? '#ef4444' : '#222', color: reloadMode === 'Shotshell' ? '#fff' : '#888' }}>Shotgun Shells</button>
            </div>

            {/* HARDWARE REPO */}
            <div style={{...cardStyle, borderLeft: reloadMode === 'Metallic' ? '4px solid #a855f7' : '4px solid #ef4444'}}>
              <h3 style={{ margin: '0 0 10px 0', color: reloadMode === 'Metallic' ? '#a855f7' : '#ef4444', fontSize: '1.1em' }}>1. Hardware Components & Lifecycles</h3>
              
              {reloadMode === 'Metallic' ? (
                <>
                  <div style={flexWrap}>
                    <div style={inputWrap}><label style={labelStyle}>Brass Lot ($)<input type="number" value={brassCost} onChange={e=>setBrassCost(e.target.value)} style={inputStyle} /></label></div>
                    <div style={inputWrap}><label style={labelStyle}>Brass Count<input type="number" value={brassQty} onChange={e=>setBrassQty(e.target.value)} style={inputStyle} /></label></div>
                    <div style={inputWrap}><label style={labelStyle}>Reuse Cycles<input type="number" value={brassReuses} onChange={e=>setBrassReuses(e.target.value)} style={{...inputStyle, border: '1px solid #a855f7'}} /></label></div>
                  </div>
                  <div style={flexWrap}>
                    <div style={inputWrap}><label style={labelStyle}>Bullets ($)<input type="number" value={projCost} onChange={e=>setProjCost(e.target.value)} style={inputStyle} /></label></div>
                    <div style={inputWrap}><label style={labelStyle}>Bullet Qty<input type="number" value={projQty} onChange={e=>setProjQty(e.target.value)} style={inputStyle} /></label></div>
                  </div>
                </>
              ) : (
                <>
                  <div style={flexWrap}>
                    <div style={inputWrap}><label style={labelStyle}>Hulls ($)<input type="number" value={hullCost} onChange={e=>setHullCost(e.target.value)} style={inputStyle} /></label></div>
                    <div style={inputWrap}><label style={labelStyle}>Hull Qty<input type="number" value={hullQty} onChange={e=>setHullQty(e.target.value)} style={inputStyle} /></label></div>
                    <div style={inputWrap}><label style={labelStyle}>Reuse Cycles<input type="number" value={hullReuses} onChange={e=>setHullReuses(e.target.value)} style={{...inputStyle, border: '1px solid #ef4444'}} /></label></div>
                  </div>
                  <div style={flexWrap}>
                    <div style={inputWrap}><label style={labelStyle}>Wad Cost ($)<input type="number" value={wadCost} onChange={e=>setWadCost(e.target.value)} style={inputStyle} /></label></div>
                    <div style={inputWrap}><label style={labelStyle}>Wad Qty<input type="number" value={wadQty} onChange={e=>setWadQty(e.target.value)} style={inputStyle} /></label></div>
                  </div>
                  <div style={flexWrap}>
                    <div style={inputWrap}><label style={labelStyle}>Shot Bag ($)<input type="number" value={shotCost} onChange={e=>setShotCost(e.target.value)} style={inputStyle} /></label></div>
                    <div style={inputWrap}><label style={labelStyle}>Bag Lbs<input type="number" value={shotLbs} onChange={e=>setShotLbs(e.target.value)} style={inputStyle} /></label></div>
                    <div style={inputWrap}><label style={labelStyle}>Payload (oz)<input type="number" step="0.0625" value={shotOz} onChange={e=>setShotOz(e.target.value)} style={inputStyle} /></label></div>
                  </div>
                </>
              )}

              <div style={flexWrap}>
                <div style={inputWrap}><label style={labelStyle}>Primers ($)<input type="number" value={primerCost} onChange={e=>setPrimerCost(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>Primer Qty<input type="number" value={primerQty} onChange={e=>setPrimerQty(e.target.value)} style={inputStyle} /></label></div>
              </div>
            </div>

            {/* POWDER REPO */}
            <div style={{...cardStyle, borderLeft: '4px solid #f59e0b'}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b', fontSize: '1.1em' }}>2. Gunpowder Charge Matrix</h3>
              <div style={flexWrap}>
                <div style={inputWrap}><label style={labelStyle}>Powder ($)<input type="number" value={pwdCost} onChange={e=>setPwdCost(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>Jug Lbs<input type="number" value={pwdLbs} onChange={e=>setPwdLbs(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>Charge (gr)<input type="number" step="0.1" value={pwdCharge} onChange={e=>setPwdCharge(e.target.value)} style={{...inputStyle, border: '1px solid #f59e0b'}} /></label></div>
              </div>
            </div>

            {/* ITEMIZED COST & YIELD MATRIX */}
            <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '16px', marginBottom: '15px' }}>
              <h4 style={{ color: '#00ffff', textAlign: 'center', margin: '0 0 15px 0', borderBottom: '1px solid #222', paddingBottom: '8px' }}>ITEMIZED COMPONENT BREAKDOWN</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.85em', color: '#aaa', marginBottom: '15px' }}>
                <div>Case / Hull: <strong style={{ color: '#fff' }}>${(reloadMode === 'Metallic' ? effBrassCost : effHullCost).toFixed(3)}</strong></div>
                <div>Primer: <strong style={{ color: '#fff' }}>${pCost.toFixed(3)}</strong></div>
                <div>Powder: <strong style={{ color: '#fff' }}>${pwdCostPerCharge.toFixed(3)}</strong></div>
                <div>{reloadMode === 'Metallic' ? 'Bullet' : 'Wad + Shot'}: <strong style={{ color: '#fff' }}>${(reloadMode === 'Metallic' ? prCost : (wCost + shotCostPerShell)).toFixed(3)}</strong></div>
              </div>

              <div style={{ borderTop: '1px dashed #333', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#00cc66', fontWeight: 'bold', fontSize: '1.2em' }}>TOTAL CPR:</span>
                <span style={{ color: '#00cc66', fontWeight: 'bold', fontSize: '1.5em' }}>${currentCpr.toFixed(3)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.9em', marginTop: '8px' }}>
                <span>Cost per Box ({reloadMode === 'Metallic' ? '50' : '25'}):</span>
                <strong style={{ color: '#fff' }}>${(reloadMode === 'Metallic' ? metBox50 : shellBox25).toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.9em', marginTop: '4px' }}>
                <span>Cost per Case ({reloadMode === 'Metallic' ? '1,000' : '250'}):</span>
                <strong style={{ color: '#fff' }}>${(reloadMode === 'Metallic' ? metCase1000 : shellFlat250).toFixed(2)}</strong>
              </div>

              <div style={{ borderTop: '1px solid #222', marginTop: '12px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85em' }}>
                <span style={{ color: '#3b82f6' }}>Powder Yield: <strong>{yieldPerJug} rds / jug</strong></span>
                {reloadMode === 'Shotshell' && (
                  <span style={{ color: '#ef4444' }}>Shot Yield: <strong>{shellsPerBag} shells / bag</strong></span>
                )}
              </div>
            </div>

            {/* COMMERCIAL SAVINGS BENCH */}
            <div style={{...cardStyle, borderTop: '4px solid #00cc66'}}>
              <h4 style={{ margin: '0 0 10px 0', color: '#00cc66' }}>💰 Factory Ammo ROI Comparison</h4>
              <div style={flexWrap}>
                <div style={inputWrap}><label style={labelStyle}>Store Box Price ($)<input type="number" value={factoryBoxPrice} onChange={e=>setFactoryBoxPrice(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>Rounds / Box<input type="number" value={factoryBoxCount} onChange={e=>setFactoryBoxCount(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ background: '#000', padding: '12px', borderRadius: '8px', border: '1px solid #222', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#aaa', fontSize: '0.9em' }}>Savings per 1,000 rds:</span>
                <strong style={{ color: '#00cc66', fontSize: '1.3em' }}>${savingsPer1000.toFixed(2)}</strong>
              </div>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* TAB 5: ARMORY & LEGAL GUIDE                */}
        {/* ========================================== */}
        {activeTab === 'Guide' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{...cardStyle, borderTop: '4px solid #fff', borderBottom: '4px solid #fff', background: 'rgba(255, 255, 255, 0.05)', padding: '20px 15px', marginBottom: 0 }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#fff', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.1em' }}>The Second Amendment</h3>
              <p style={{ color: '#fff', fontSize: '1.05em', lineHeight: '1.5', fontStyle: 'italic', textAlign: 'center', fontWeight: 'bold', margin: 0 }}>
                "A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed."
              </p>
            </div>

            <div style={{...cardStyle, borderLeft: '4px solid #3b82f6', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>1. Firearm Classifications</h3>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}><strong>Handguns:</strong> Fired with one hand. Primary for CCW and duty sidearms.</p>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}><strong>Rifles:</strong> Shoulder-fired with rifled barrels for long-range gyroscopic stabilization.</p>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}><strong>Shotguns:</strong> Smoothbore shoulder-fired weapons for shot pellets or lead slugs.</p>
            </div>

            <div style={{...cardStyle, borderLeft: '4px solid #10b981', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#10b981' }}>2. Caliber Cheat Sheet</h3>
              <ul style={{ color: '#aaa', fontSize: '0.9em', paddingLeft: '18px', lineHeight: '1.5', margin: 0 }}>
                <li><strong>.22 LR:</strong> Rimfire, cheap, zero recoil training.</li>
                <li><strong>9mm Luger:</strong> Global standard defensive handgun round.</li>
                <li><strong>.38 Spl / .357 Mag:</strong> Iconic revolver power; long barrels allow complete magnum powder ignition for massive velocity.</li>
                <li><strong>.45 ACP:</strong> Heavy, slow, naturally subsonic stopping power.</li>
                <li><strong>10mm Auto:</strong> High-pressure magnum automatic round used for defense against large predators.</li>
                <li><strong>5.56 NATO / .223:</strong> High-velocity, flat-shooting standard AR rifle cartridge.</li>
                <li><strong>.300 Blackout:</strong> Optimized for suppressed short-barrel performance.</li>
                <li><strong>.308 Win / 7.62 NATO:</strong> Battle-proven medium/long-range heavy hitter.</li>
                <li><strong>6.5 Creedmoor:</strong> High-BC aerodynamic long-range match caliber.</li>
              </ul>
            </div>

            <div style={{...cardStyle, borderLeft: '4px solid #ec4899', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#ec4899' }}>3. Projectile & Terminal Types</h3>
              <ul style={{ color: '#aaa', fontSize: '0.9em', paddingLeft: '18px', lineHeight: '1.5', margin: 0 }}>
                <li><strong>FMJ (Ball):</strong> Copper-wrapped lead. Non-expanding target ammo.</li>
                <li><strong>JHP (Hollow Point):</strong> Expands violently on soft tissue to dump energy and prevent over-penetration.</li>
                <li><strong>Hard Cast:</strong> Antimony-hardened lead for smashing bone without deformation.</li>
                <li><strong>OTM (Open Tip Match):</strong> Precision-manufactured aerodynamic match bullet.</li>
                <li><strong>Frangible:</strong> Compressed copper powder that disintegrates on steel to prevent splashback.</li>
                <li><strong>Subsonic:</strong> Velocity under 1,125 fps to eliminate the supersonic crack when suppressed.</li>
              </ul>
            </div>

            <div style={{...cardStyle, borderLeft: '4px solid #14b8a6', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#14b8a6' }}>4. 4 Universal Safety Rules</h3>
              <ol style={{ color: '#fff', fontSize: '0.9em', paddingLeft: '18px', lineHeight: '1.5', margin: 0, fontWeight: 'bold' }}>
                <li>ALL GUNS ARE ALWAYS LOADED.</li>
                <li>NEVER POINT AT ANYTHING YOU ARE NOT WILLING TO DESTROY.</li>
                <li>KEEP FINGER OFF TRIGGER UNTIL ON TARGET.</li>
                <li>BE SURE OF YOUR TARGET AND WHAT IS BEYOND IT.</li>
              </ol>
            </div>

            <div style={{...cardStyle, borderLeft: '4px solid #ef4444', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>5. Legal & Safe Harbor Statutes</h3>
              <ul style={{ color: '#aaa', fontSize: '0.9em', paddingLeft: '18px', lineHeight: '1.5' }}>
                <li><strong>FOPA (18 U.S.C. § 926A):</strong> Protects interstate transport if the firearm is unloaded and locked in a separate compartment inaccessible to the vehicle cabin.</li>
                <li><strong>Title II NFA:</strong> SBRs (&lt;16" barrel + stock), SBSs (&lt;18" barrel + stock), and Suppressors require Form 1/4 and a $200 Tax Stamp.</li>
                <li><strong>Castle Doctrine / Stand Your Ground:</strong> Defines absence of duty to retreat when facing lethal threats in your domicile or public spaces where legally present.</li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
