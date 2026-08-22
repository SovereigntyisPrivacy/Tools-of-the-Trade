import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ShootingCalc() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Solution'); 

  // --- STATE: WEAPON & LOAD ---
  const [bulletGr, setBulletGr] = useState('168');
  const [muzzleFps, setMuzzleFps] = useState('2600');
  const [bc, setBc] = useState('0.462');
  const [zeroRange, setZeroRange] = useState('100');
  
  const [altitude, setAltitude] = useState('2400');
  const [distance, setDistance] = useState('1000');
  const [windSpd, setWindSpd] = useState('10');

  // --- STATE: COMPARATOR ---
  const [loadAGr, setLoadAGr] = useState('150');
  const [loadAVel, setLoadAVel] = useState('2820');
  const [loadABc, setLoadABc] = useState('0.350');
  const [loadBGr, setLoadBGr] = useState('175');
  const [loadBVel, setLoadBVel] = useState('2550');
  const [loadBBc, setLoadBBc] = useState('0.505');

  const parse = (val) => parseFloat(val) || 0;

  // --- TAB 1: SOLUTION MATH ---
  const dist = parse(distance);
  const vel = parse(muzzleFps);
  const gr = parse(bulletGr);
  
  const muzEnergy = (gr * Math.pow(vel, 2)) / 450240;
  const tof = (dist * 3) / (vel * 0.82); 
  const termVel = Math.max(0, vel - (dist * 0.65));
  const termEnergy = (gr * Math.pow(termVel, 2)) / 450240;
  const elevMil = (dist / 100) * 0.88; 
  const windMil = (parse(windSpd) / 10) * (dist / 200) * 0.12;

  // --- TAB 2: COMPARATOR MATH ---
  const calcLoad = (g, v, b) => {
    const speed = parse(v);
    const weight = parse(g);
    return {
      me: (weight * Math.pow(speed, 2)) / 450240,
      tv500: Math.max(0, speed - (500 * (1.1 - parse(b)))),
      drop500: 5 * 2.2 * (2800 / speed)
    };
  };
  const statA = calcLoad(loadAGr, loadAVel, loadABc);
  const statB = calcLoad(loadBGr, loadBVel, loadBBc);

  // --- TAB 3: DOPE CARD GENERATOR ---
  const dopeRanges = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

  // --- STYLES ---
  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.1em', marginTop: '6px' };
  const labelStyle = { color: '#00ffff', fontSize: '0.85em', fontWeight: 'bold' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '20px' };

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate('/calculator')}>Hub</button>
        <h2>Ballistics & Armory</h2>
      </header>

      {/* TOP TAB NAVIGATION */}
      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Solution', 'Comparator', 'DOPE Card', 'Guide'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: activeTab === tab ? '#00ffff' : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>
            {tab}
          </button>
        ))}
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', paddingBottom: '120px' }}>
        
        {/* ========================================== */}
        {/* TAB 1: FIRING SOLUTION                     */}
        {/* ========================================== */}
        {activeTab === 'Solution' && (
          <>
            <div style={{...cardStyle, borderTop: '4px solid #ef4444'}}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🎯 Weapon & Load</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Bullet (gr)<input type="number" value={bulletGr} onChange={e=>setBulletGr(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Muzzle (fps)<input type="number" value={muzzleFps} onChange={e=>setMuzzleFps(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>BC (G1)<input type="number" value={bc} onChange={e=>setBc(e.target.value)} style={inputStyle} /></label></div>
              </div>
            </div>

            <div style={{...cardStyle, borderTop: '4px solid #00cc66'}}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🌍 Target Vector</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Distance (Yds)<input type="number" value={distance} onChange={e=>setDistance(e.target.value)} style={{...inputStyle, border: '1px solid #00cc66'}} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Wind (mph)<input type="number" value={windSpd} onChange={e=>setWindSpd(e.target.value)} style={inputStyle} /></label></div>
              </div>
            </div>

            <div style={{ border: '2px solid #00ffff', borderRadius: '12px', padding: '20px', background: '#000' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#fff', textAlign: 'center', letterSpacing: '2px' }}>FIRING SOLUTION</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px' }}><span>Time of Flight:</span> <span style={{color: '#fff'}}>{tof.toFixed(3)} sec</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px' }}><span>Term. Velocity:</span> <span style={{color: '#fff'}}>{termVel.toFixed(0)} fps</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}><span>Muzzle Energy:</span> <span style={{color: '#ffaa00'}}>{muzEnergy.toFixed(0)} ft-lbs</span></div>
              <div style={{ background: '#111', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', border: '1px solid #333' }}>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>ELEVATION:</span>
                <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.4em' }}>{elevMil.toFixed(1)} MIL</div>
              </div>
              <div style={{ background: '#111', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', border: '1px solid #333' }}>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>WINDAGE:</span>
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
            <p style={{ color: '#aaa', textAlign: 'center', marginBottom: '20px' }}>Compare kinetics out to 500 yards.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1, ...cardStyle, borderTop: '4px solid #ef4444' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#ef4444', textAlign: 'center' }}>Load A</h3>
                <label style={{...labelStyle, color: '#fff'}}>Grains<input type="number" value={loadAGr} onChange={e=>setLoadAGr(e.target.value)} style={inputStyle} /></label>
                <label style={{...labelStyle, color: '#fff', display: 'block', marginTop: '10px'}}>Muzzle FPS<input type="number" value={loadAVel} onChange={e=>setLoadAVel(e.target.value)} style={inputStyle} /></label>
              </div>
              <div style={{ flex: 1, ...cardStyle, borderTop: '4px solid #3b82f6' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#3b82f6', textAlign: 'center' }}>Load B</h3>
                <label style={{...labelStyle, color: '#fff'}}>Grains<input type="number" value={loadBGr} onChange={e=>setLoadBGr(e.target.value)} style={inputStyle} /></label>
                <label style={{...labelStyle, color: '#fff', display: 'block', marginTop: '10px'}}>Muzzle FPS<input type="number" value={loadBVel} onChange={e=>setLoadBVel(e.target.value)} style={inputStyle} /></label>
              </div>
            </div>

            <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '15px' }}>
              <h3 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>500 Yard Analysis</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div style={{ flex: 1, textAlign: 'center', color: statA.me > statB.me ? '#00cc66' : '#ef4444' }}>{statA.me.toFixed(0)} ft-lbs</div>
                <div style={{ flex: 1, textAlign: 'center', color: '#aaa', fontSize: '0.85em' }}>Muzzle Energy</div>
                <div style={{ flex: 1, textAlign: 'center', color: statB.me > statA.me ? '#00cc66' : '#3b82f6' }}>{statB.me.toFixed(0)} ft-lbs</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div style={{ flex: 1, textAlign: 'center', color: statA.tv500 > statB.tv500 ? '#00cc66' : '#ef4444' }}>{statA.tv500.toFixed(0)} fps</div>
                <div style={{ flex: 1, textAlign: 'center', color: '#aaa', fontSize: '0.85em' }}>500y Velocity</div>
                <div style={{ flex: 1, textAlign: 'center', color: statB.tv500 > statA.tv500 ? '#00cc66' : '#3b82f6' }}>{statB.tv500.toFixed(0)} fps</div>
              </div>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* TAB 3: DOPE CARD                           */}
        {/* ========================================== */}
        {activeTab === 'DOPE Card' && (
          <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', overflow: 'hidden' }}>
            <div style={{ background: '#111', padding: '15px', textAlign: 'center', borderBottom: '1px solid #333' }}>
              <h3 style={{ margin: 0, color: '#fff' }}>Range Card</h3>
              <div style={{ color: '#00ffff', fontSize: '0.85em', marginTop: '5px' }}>{bulletGr}gr @ {muzzleFps} fps</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.9em' }}>
              <thead>
                <tr style={{ background: '#222', color: '#aaa' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Yards</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>Elev (MIL)</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Vel (fps)</th>
                </tr>
              </thead>
              <tbody>
                {dopeRanges.map(r => {
                  const drop = (r / 100) * 0.88 * (r / 500 || 1);
                  const v = Math.max(0, vel - (r * 0.65));
                  return (
                    <tr key={r} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>{r}</td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#ef4444' }}>{drop.toFixed(1)}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: v < 1125 ? '#888' : '#fff' }}>{v.toFixed(0)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: ARMORY & LEGAL GUIDE                */}
        {/* ========================================== */}
        {activeTab === 'Guide' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{...cardStyle, borderLeft: '4px solid #3b82f6'}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>1. Firearm Classifications</h3>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}><strong>Handguns (Pistols & Revolvers):</strong> Designed to be fired with one hand without a shoulder stock. Typically used for concealed carry, personal defense, and duty sidearms.</p>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}><strong>Rifles (Long Guns):</strong> Designed to be fired from the shoulder with a rifled barrel (spiral grooves that spin the bullet). Used for hunting, long-range precision, and combat.</p>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}><strong>Shotguns (Long Guns):</strong> Designed to be fired from the shoulder with a smoothbore barrel. Fires multiple pellets (shot) or a single heavy lead slug. Excellent for bird hunting and close-quarters defense.</p>
            </div>

            <div style={{...cardStyle, borderLeft: '4px solid #f59e0b'}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>2. Grains & Caliber Logic</h3>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}>A "Grain" (gr) is a unit of weight used for bullets and gunpowder. There are 7,000 grains in a pound.</p>
              <ul style={{ color: '#aaa', fontSize: '0.9em', paddingLeft: '20px', lineHeight: '1.5' }}>
                <li><strong>9mm Handgun:</strong> Typically 115gr for cheap range plinking. Defense loads use 124gr or 147gr because heavier bullets hit harder and penetrate deeper.</li>
                <li><strong>.308 / 7.62 NATO Rifle:</strong> Standard military ball ammo is 147gr. Precision shooters use 168gr or 175gr. A heavier bullet resists wind deflection better over a 1,000-yard distance.</li>
              </ul>
            </div>

            <div style={{...cardStyle, borderLeft: '4px solid #ef4444'}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>3. Federal Legalities & The NFA</h3>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}>While out here in Arizona you enjoy Constitutional Carry and zero state-level magazine bans, you still have to strictly obey federal National Firearms Act (NFA) laws.</p>
              <ul style={{ color: '#aaa', fontSize: '0.9em', paddingLeft: '20px', lineHeight: '1.5' }}>
                <li><strong>Standard Title I:</strong> Regular rifles (16"+ barrel), shotguns (18"+ barrel), and handguns. Require a standard ATF Form 4473 background check at a dealer.</li>
                <li><strong>Title II (NFA Items):</strong> Requires an ATF Form 1 (to make) or Form 4 (to transfer), a $200 tax stamp, fingerprints, and months of waiting.</li>
                <li><strong>SBRs & SBSs:</strong> A Short-Barreled Rifle has a barrel under 16 inches and a stock. A Short-Barreled Shotgun has a barrel under 18 inches. Both are highly restricted NFA items.</li>
                <li><strong>Suppressors:</strong> "Silencers" do not silence guns, they muffle the explosion to protect hearing. They are heavily restricted NFA items.</li>
                <li><strong>Illegal Firearms:</strong> Unregistered NFA items carry a penalty of 10 years in federal prison. Post-1986 newly manufactured machine guns (fully automatic) are strictly illegal for civilians to own.</li>
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
