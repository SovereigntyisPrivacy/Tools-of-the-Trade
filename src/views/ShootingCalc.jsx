import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ShootingCalc() {
  const navigate = useNavigate();

  // --- UI State ---
  const [activeTab, setActiveTab] = useState('Solution'); // 'Solution' or 'Comparator'

  // ==========================================
  // TAB 1 STATE: SINGLE FIRING SOLUTION
  // ==========================================
  const [bulletGr, setBulletGr] = useState('168');
  const [muzzleFps, setMuzzleFps] = useState('2600');
  const [bc, setBc] = useState('0.462');
  const [zeroRange, setZeroRange] = useState('100');
  const [opticHeight, setOpticHeight] = useState('1.5');
  const [altitude, setAltitude] = useState('2400');
  const [temp, setTemp] = useState('90');
  const [distance, setDistance] = useState('1000');
  const [incline, setIncline] = useState('0');
  const [windSpd, setWindSpd] = useState('10');
  const [windAngle, setWindAngle] = useState('90');
  const [rifleWeight, setRifleWeight] = useState('10.5');
  const [powderCharge, setPowderCharge] = useState('44.0');
  const [targetSpeed, setTargetSpeed] = useState('3.0'); 
  const [caliber, setCaliber] = useState('0.308');
  const [bulletLength, setBulletLength] = useState('1.2');
  const [barrelTwist, setBarrelTwist] = useState('10');
  const [vitalZone, setVitalZone] = useState('8');

  const [tof, setTof] = useState(0);
  const [termVel, setTermVel] = useState(0);
  const [muzEnergy, setMuzEnergy] = useState(0);
  const [termEnergy, setTermEnergy] = useState(0);
  const [elevMil, setElevMil] = useState(0);
  const [windMil, setWindMil] = useState(0);
  const [recoilEnergy, setRecoilEnergy] = useState(0);
  const [leadMil, setLeadMil] = useState(0);
  const [sg, setSg] = useState(0);
  const [mpbr, setMpbr] = useState(0);

  // ==========================================
  // TAB 2 STATE: LOAD COMPARATOR
  // ==========================================
  const [loadAGr, setLoadAGr] = useState('150');
  const [loadAVel, setLoadAVel] = useState('2820');
  const [loadABc, setLoadABc] = useState('0.350');
  
  const [loadBGr, setLoadBGr] = useState('175');
  const [loadBVel, setLoadBVel] = useState('2550');
  const [loadBBc, setLoadBBc] = useState('0.505');

  const parse = (val) => parseFloat(val) || 0;

  // --- TAB 1 LOGIC ---
  useEffect(() => {
    const dist = parse(distance);
    const vel = parse(muzzleFps);
    const gr = parse(bulletGr);
    const speedMph = parse(targetSpeed);
    const rWeight = parse(rifleWeight);
    const pCharge = parse(powderCharge);
    
    if (dist > 0 && vel > 0 && gr > 0) {
      setMuzEnergy((gr * Math.pow(vel, 2)) / 450240);
      const estTof = (dist * 3) / (vel * 0.82); 
      setTof(estTof);
      const tv = vel - (dist * 0.65);
      setTermVel(Math.max(0, tv));
      setTermEnergy((gr * Math.pow(Math.max(0, tv), 2)) / 450240);
      setElevMil((dist / 100) * 0.88); 
      setWindMil((parse(windSpd) / 10) * (dist / 200) * 0.12);

      const recVel = ((gr * vel) + (pCharge * 4000)) / (rWeight * 7000);
      setRecoilEnergy((rWeight * Math.pow(recVel, 2)) / 64.32);
      
      const leadFeet = (speedMph * 1.46667) * estTof;
      setLeadMil((leadFeet * 1000) / (dist * 3));

      const d = parse(caliber);
      const l = parse(bulletLength);
      const t = parse(barrelTwist);
      if (d > 0 && l > 0 && t > 0) {
        const lenCal = l / d;
        const sgBase = (30 * gr) / (Math.pow(t, 2) * Math.pow(d, 3) * lenCal * (1 + Math.pow(lenCal, 2)));
        setSg(sgBase * Math.pow(vel / 2800, 1/3) * 1.8);
      }

      if (parse(vitalZone) > 0) setMpbr((vel / 10) + (parse(vitalZone) * 8) + (parse(bc) * 100));
    }
  }, [distance, muzzleFps, bulletGr, windSpd, targetSpeed, rifleWeight, powderCharge, caliber, bulletLength, barrelTwist, vitalZone, bc]);

  const airDensity = 1.0 - (parse(altitude) * 0.00003) - ((parse(temp) - 59) * 0.001);

  // --- TAB 2 LOGIC (COMPARATOR) ---
  const calcLoad = (gr, vel, bc) => {
    const weight = parse(gr);
    const speed = parse(vel);
    const drag = parse(bc);
    const me = (weight * Math.pow(speed, 2)) / 450240;
    // Approximations for 500 yards
    const tv500 = Math.max(0, speed - (500 * (1.1 - drag))); 
    const te500 = (weight * Math.pow(tv500, 2)) / 450240;
    const drop500 = (500 / 100) * 2.2 * (2800 / speed); // Rough MIL drop scale
    return { me, tv500, te500, drop500 };
  };

  const statA = calcLoad(loadAGr, loadAVel, loadABc);
  const statB = calcLoad(loadBGr, loadBVel, loadBBc);

  // --- STYLES ---
  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.1em', marginTop: '6px' };
  const labelStyle = { color: '#00ffff', fontSize: '0.85em', fontWeight: 'bold' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '20px' };

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate('/calculator')}>Hub</button>
        <h2>Ballistics Engine</h2>
      </header>

      {/* TOP TAB NAVIGATION */}
      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '10px' }}>
        <button 
          onClick={() => setActiveTab('Solution')}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === 'Solution' ? '#00ffff' : '#222', color: activeTab === 'Solution' ? '#000' : '#888' }}>
          Firing Solution
        </button>
        <button 
          onClick={() => setActiveTab('Comparator')}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === 'Comparator' ? '#ffaa00' : '#222', color: activeTab === 'Comparator' ? '#000' : '#888' }}>
          Load Comparator
        </button>
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', paddingBottom: '120px' }}>
        
        {/* ========================================== */}
        {/* TAB 1: FIRING SOLUTION                     */}
        {/* ========================================== */}
        {activeTab === 'Solution' && (
          <>
            <div style={{...cardStyle, borderTop: '4px solid #ef4444'}}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🎯 Weapon & Load</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Bullet (gr)<input type="number" value={bulletGr} onChange={e=>setBulletGr(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Muzzle (fps)<input type="number" value={muzzleFps} onChange={e=>setMuzzleFps(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>BC (G1)<input type="number" value={bc} onChange={e=>setBc(e.target.value)} style={inputStyle} /></label></div>
              </div>
            </div>

            <div style={{...cardStyle, borderTop: '4px solid #f59e0b'}}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🌡️ Atmospherics</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#aaa'}}>Altitude (ft)<input type="number" value={altitude} onChange={e=>setAltitude(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#aaa'}}>Temp (°F)<input type="number" value={temp} onChange={e=>setTemp(e.target.value)} style={inputStyle} /></label></div>
              </div>
            </div>

            <div style={{...cardStyle, borderTop: '4px solid #00cc66'}}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🌍 Target Vector</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Distance (Yards)<input type="number" value={distance} onChange={e=>setDistance(e.target.value)} style={{...inputStyle, border: '1px solid #00cc66'}} /></label></div>
                <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#aaa'}}>Wind Spd (mph)<input type="number" value={windSpd} onChange={e=>setWindSpd(e.target.value)} style={inputStyle} /></label></div>
              </div>
            </div>

            <div style={{ border: '2px solid #00ffff', borderRadius: '12px', padding: '20px', background: '#000', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#fff', textAlign: 'center', letterSpacing: '2px' }}>FIRING SOLUTION</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px' }}><span>Time of Flight:</span> <span style={{color: '#fff', fontWeight: 'bold'}}>{tof.toFixed(3)} sec</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px' }}><span>Term. Velocity:</span> <span style={{color: '#fff', fontWeight: 'bold'}}>{termVel.toFixed(0)} fps</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px' }}><span>Muzzle Energy:</span> <span style={{color: '#ffaa00', fontWeight: 'bold'}}>{muzEnergy.toFixed(0)} ft-lbs</span></div>
              
              <div style={{ background: '#111', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', border: '1px solid #333' }}>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2em' }}>ELEVATION:</span>
                <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.4em' }}>{elevMil.toFixed(1)} MIL</div>
              </div>
              
              <div style={{ background: '#111', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', border: '1px solid #333' }}>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2em' }}>WINDAGE:</span>
                <div style={{ color: '#00ffff', fontWeight: 'bold', fontSize: '1.4em' }}>{windMil.toFixed(1)} MIL</div>
              </div>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* TAB 2: LOAD COMPARATOR                     */}
        {/* ========================================== */}
        {activeTab === 'Comparator' && (
          <>
            <p style={{ color: '#aaa', textAlign: 'center', marginBottom: '20px' }}>Directly compare ballistics and kinetic energy out to 500 yards.</p>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              {/* LOAD A */}
              <div style={{ flex: 1, ...cardStyle, borderTop: '4px solid #ef4444' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#ef4444', textAlign: 'center' }}>Load A</h3>
                <label style={{...labelStyle, color: '#fff'}}>Grains<input type="number" value={loadAGr} onChange={e=>setLoadAGr(e.target.value)} style={inputStyle} /></label>
                <label style={{...labelStyle, color: '#fff', display: 'block', marginTop: '10px'}}>Muzzle FPS<input type="number" value={loadAVel} onChange={e=>setLoadAVel(e.target.value)} style={inputStyle} /></label>
                <label style={{...labelStyle, color: '#fff', display: 'block', marginTop: '10px'}}>BC (G1)<input type="number" value={loadABc} onChange={e=>setLoadABc(e.target.value)} style={inputStyle} /></label>
              </div>

              {/* LOAD B */}
              <div style={{ flex: 1, ...cardStyle, borderTop: '4px solid #3b82f6' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#3b82f6', textAlign: 'center' }}>Load B</h3>
                <label style={{...labelStyle, color: '#fff'}}>Grains<input type="number" value={loadBGr} onChange={e=>setLoadBGr(e.target.value)} style={inputStyle} /></label>
                <label style={{...labelStyle, color: '#fff', display: 'block', marginTop: '10px'}}>Muzzle FPS<input type="number" value={loadBVel} onChange={e=>setLoadBVel(e.target.value)} style={inputStyle} /></label>
                <label style={{...labelStyle, color: '#fff', display: 'block', marginTop: '10px'}}>BC (G1)<input type="number" value={loadBBc} onChange={e=>setLoadBBc(e.target.value)} style={inputStyle} /></label>
              </div>
            </div>

            {/* RESULTS */}
            <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '15px' }}>
              <h3 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>500 Yard Analysis</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                <div style={{ flex: 1, textAlign: 'center', color: statA.me > statB.me ? '#00cc66' : '#ef4444', fontWeight: 'bold' }}>{statA.me.toFixed(0)} ft-lbs</div>
                <div style={{ flex: 1, textAlign: 'center', color: '#aaa', fontSize: '0.85em' }}>Muzzle Energy</div>
                <div style={{ flex: 1, textAlign: 'center', color: statB.me > statA.me ? '#00cc66' : '#3b82f6', fontWeight: 'bold' }}>{statB.me.toFixed(0)} ft-lbs</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                <div style={{ flex: 1, textAlign: 'center', color: statA.tv500 > statB.tv500 ? '#00cc66' : '#ef4444', fontWeight: 'bold' }}>{statA.tv500.toFixed(0)} fps</div>
                <div style={{ flex: 1, textAlign: 'center', color: '#aaa', fontSize: '0.85em' }}>500yd Velocity</div>
                <div style={{ flex: 1, textAlign: 'center', color: statB.tv500 > statA.tv500 ? '#00cc66' : '#3b82f6', fontWeight: 'bold' }}>{statB.tv500.toFixed(0)} fps</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                <div style={{ flex: 1, textAlign: 'center', color: statA.te500 > statB.te500 ? '#00cc66' : '#ef4444', fontWeight: 'bold' }}>{statA.te500.toFixed(0)} ft-lbs</div>
                <div style={{ flex: 1, textAlign: 'center', color: '#aaa', fontSize: '0.85em' }}>500yd Energy</div>
                <div style={{ flex: 1, textAlign: 'center', color: statB.te500 > statA.te500 ? '#00cc66' : '#3b82f6', fontWeight: 'bold' }}>{statB.te500.toFixed(0)} ft-lbs</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '10px', borderRadius: '8px', border: '1px solid #222' }}>
                <div style={{ flex: 1, textAlign: 'center', color: statA.drop500 < statB.drop500 ? '#00cc66' : '#ef4444', fontWeight: 'bold' }}>{statA.drop500.toFixed(1)} MIL</div>
                <div style={{ flex: 1, textAlign: 'center', color: '#fff', fontSize: '0.85em', fontWeight: 'bold' }}>500yd Drop</div>
                <div style={{ flex: 1, textAlign: 'center', color: statB.drop500 < statA.drop500 ? '#00cc66' : '#3b82f6', fontWeight: 'bold' }}>{statB.drop500.toFixed(1)} MIL</div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
