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

  // --- STATE: RELOADING BENCH ---
  const [reloadMode, setReloadMode] = useState('Metallic'); 
  const [brassCost, setBrassCost] = useState('0'); 
  const [brassQty, setBrassQty] = useState('100');
  const [primerCost, setPrimerCost] = useState('85.00');
  const [primerQty, setPrimerQty] = useState('1000');
  const [projCost, setProjCost] = useState('38.50');
  const [projQty, setProjQty] = useState('100');
  const [pwdCost, setPwdCost] = useState('45.00');
  const [pwdLbs, setPwdLbs] = useState('1');
  const [pwdCharge, setPwdCharge] = useState('44.0');
  
  const [hullCost, setHullCost] = useState('0');
  const [hullQty, setHullQty] = useState('100');
  const [wadCost, setWadCost] = useState('15.00');
  const [wadQty, setWadQty] = useState('500');
  const [shotCost, setShotCost] = useState('55.00');
  const [shotLbs, setShotLbs] = useState('25');
  const [shotOz, setShotOz] = useState('1.125');

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

  // --- TAB 4: RELOADING MATH ---
  const pCost = parse(primerQty) > 0 ? parse(primerCost) / parse(primerQty) : 0;
  const totalPowderGrains = parse(pwdLbs) * 7000;
  const pwdCostPerRound = (totalPowderGrains > 0 ? parse(pwdCost) / totalPowderGrains : 0) * parse(pwdCharge);
  const yieldPerJug = parse(pwdCharge) > 0 ? Math.floor(totalPowderGrains / parse(pwdCharge)) : 0;

  const bCost = parse(brassQty) > 0 ? parse(brassCost) / parse(brassQty) : 0;
  const prCost = parse(projQty) > 0 ? parse(projCost) / parse(projQty) : 0;
  const metCpr = bCost + pCost + prCost + pwdCostPerRound;

  const hCost = parse(hullQty) > 0 ? parse(hullCost) / parse(hullQty) : 0;
  const wCost = parse(wadQty) > 0 ? parse(wadCost) / parse(wadQty) : 0;
  const totalShotOunces = parse(shotLbs) * 16;
  const shotCostPerShell = (totalShotOunces > 0 ? parse(shotCost) / totalShotOunces : 0) * parse(shotOz);
  const shellCpr = hCost + pCost + wCost + shotCostPerShell + pwdCostPerRound;

  // --- STYLES ---
  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.1em', marginTop: '6px' };
  const labelStyle = { color: '#00ffff', fontSize: '0.85em', fontWeight: 'bold' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '20px' };
  const flexWrap = { display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '10px' };
  const inputWrap = { flex: '1 1 120px', minWidth: '120px' };

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate('/calculator')}>Hub</button>
        <h2>Ballistics & Armory</h2>
      </header>

      {/* TOP TAB NAVIGATION */}
      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Solution', 'Comparator', 'DOPE Card', 'Reloading', 'Guide'].map(tab => (
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
              <div style={flexWrap}>
                <div style={inputWrap}><label style={labelStyle}>Bullet (gr)<input type="number" value={bulletGr} onChange={e=>setBulletGr(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>Muzzle (fps)<input type="number" value={muzzleFps} onChange={e=>setMuzzleFps(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>BC (G1)<input type="number" value={bc} onChange={e=>setBc(e.target.value)} style={inputStyle} /></label></div>
              </div>
            </div>

            <div style={{...cardStyle, borderTop: '4px solid #00cc66'}}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🌍 Target Vector</h3>
              <div style={flexWrap}>
                <div style={inputWrap}><label style={labelStyle}>Distance (Yds)<input type="number" value={distance} onChange={e=>setDistance(e.target.value)} style={{...inputStyle, border: '1px solid #00cc66'}} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>Wind (mph)<input type="number" value={windSpd} onChange={e=>setWindSpd(e.target.value)} style={inputStyle} /></label></div>
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
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 140px', ...cardStyle, borderTop: '4px solid #ef4444' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#ef4444', textAlign: 'center' }}>Load A</h3>
                <label style={{...labelStyle, color: '#fff'}}>Grains<input type="number" value={loadAGr} onChange={e=>setLoadAGr(e.target.value)} style={inputStyle} /></label>
                <label style={{...labelStyle, color: '#fff', display: 'block', marginTop: '10px'}}>Muzzle FPS<input type="number" value={loadAVel} onChange={e=>setLoadAVel(e.target.value)} style={inputStyle} /></label>
              </div>
              <div style={{ flex: '1 1 140px', ...cardStyle, borderTop: '4px solid #3b82f6' }}>
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
        {/* TAB 4: RELOADING BENCH                     */}
        {/* ========================================== */}
        {activeTab === 'Reloading' && (
          <>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button onClick={() => setReloadMode('Metallic')} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: reloadMode === 'Metallic' ? '#a855f7' : '#222', color: reloadMode === 'Metallic' ? '#fff' : '#888' }}>Metallic Cartridge</button>
              <button onClick={() => setReloadMode('Shotshell')} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: reloadMode === 'Shotshell' ? '#ef4444' : '#222', color: reloadMode === 'Shotshell' ? '#fff' : '#888' }}>Shotgun Shells</button>
            </div>

            <div style={{...cardStyle, borderLeft: reloadMode === 'Metallic' ? '4px solid #a855f7' : '4px solid #ef4444'}}>
              <h3 style={{ margin: '0 0 10px 0', color: reloadMode === 'Metallic' ? '#a855f7' : '#ef4444' }}>Hardware</h3>
              {reloadMode === 'Metallic' ? (
                <>
                  <div style={flexWrap}>
                    <div style={inputWrap}><label style={labelStyle}>Brass Cost ($)<input type="number" value={brassCost} onChange={e=>setBrassCost(e.target.value)} style={inputStyle} /></label></div>
                    <div style={inputWrap}><label style={labelStyle}>Brass Qty<input type="number" value={brassQty} onChange={e=>setBrassQty(e.target.value)} style={inputStyle} /></label></div>
                  </div>
                  <div style={flexWrap}>
                    <div style={inputWrap}><label style={labelStyle}>Proj. Cost ($)<input type="number" value={projCost} onChange={e=>setProjCost(e.target.value)} style={inputStyle} /></label></div>
                    <div style={inputWrap}><label style={labelStyle}>Proj. Qty<input type="number" value={projQty} onChange={e=>setProjQty(e.target.value)} style={inputStyle} /></label></div>
                  </div>
                </>
              ) : (
                <>
                  <div style={flexWrap}>
                    <div style={inputWrap}><label style={labelStyle}>Hull Cost ($)<input type="number" value={hullCost} onChange={e=>setHullCost(e.target.value)} style={inputStyle} /></label></div>
                    <div style={inputWrap}><label style={labelStyle}>Hull Qty<input type="number" value={hullQty} onChange={e=>setHullQty(e.target.value)} style={inputStyle} /></label></div>
                  </div>
                  <div style={flexWrap}>
                    <div style={inputWrap}><label style={labelStyle}>Shot Bag Cost ($)<input type="number" value={shotCost} onChange={e=>setShotCost(e.target.value)} style={inputStyle} /></label></div>
                    <div style={inputWrap}><label style={labelStyle}>Payload (oz)<input type="number" value={shotOz} onChange={e=>setShotOz(e.target.value)} style={inputStyle} /></label></div>
                  </div>
                </>
              )}
            </div>
            <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '20px', fontFamily: 'monospace', fontSize: '1.1em' }}>
              <h3 style={{ color: '#00ffff', textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Reloading Yield</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00cc66', fontWeight: 'bold', fontSize: '1.2em' }}>
                <span>Total CPR:</span> <span>${reloadMode === 'Metallic' ? metCpr.toFixed(3) : shellCpr.toFixed(3)}</span>
              </div>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* TAB 5: ARMORY & LEGAL GUIDE                */}
        {/* ========================================== */}
        {activeTab === 'Guide' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{...cardStyle, borderTop: '4px solid #fff', borderBottom: '4px solid #fff', background: 'rgba(255, 255, 255, 0.05)', padding: '25px 20px', marginBottom: 0 }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.2em' }}>The Second Amendment</h3>
              <p style={{ color: '#fff', fontSize: '1.15em', lineHeight: '1.6', fontStyle: 'italic', textAlign: 'center', fontWeight: 'bold', margin: 0 }}>
                "A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed."
              </p>
            </div>
            
            <div style={{...cardStyle, borderLeft: '4px solid #3b82f6', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>1. Firearm Classifications</h3>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}><strong>Handguns:</strong> Designed to be fired with one hand. Used for concealed carry, personal defense, and duty sidearms.</p>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}><strong>Rifles:</strong> Fired from the shoulder with a rifled barrel. Used for hunting and long-range precision.</p>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}><strong>Shotguns:</strong> Fired from the shoulder with a smoothbore barrel. Fires multiple pellets or slugs.</p>
            </div>

            <div style={{...cardStyle, borderLeft: '4px solid #10b981', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#10b981' }}>2. The Caliber Cheat Sheet</h3>
              <ul style={{ color: '#aaa', fontSize: '0.9em', paddingLeft: '20px', lineHeight: '1.6', margin: 0 }}>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>.22 LR:</strong> A tiny "rimfire" cartridge. Almost zero recoil and dirt cheap. Perfect for training or plinking.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>9mm Luger:</strong> The global king of handguns. Optimal balance of capacity and recoil.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>.38 Special & .357 Magnum:</strong> The legendary wheel-gun powerhouse. Known for incredible kinetic energy transfer and stopping power. When fired out of a long-barreled revolver, the slow-burning magnum powder has time to fully ignite, creating a devastatingly fast and accurate projectile. As a bonus, any .357 revolver can safely fire cheaper, lower-recoil .38 Special ammunition.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>.45 ACP:</strong> A heavy, slow, naturally subsonic round. Won "Two World Wars." Incredible stopping power out of a 1911 pistol.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>10mm Auto:</strong> An overpowered handgun cartridge primarily used by guides and hunters in Alaska to stop charging bears.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>5.56x45mm NATO / .223 Rem:</strong> Standard AR-15 round. Fires a light bullet at blistering speeds.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>.300 Blackout:</strong> A rifle round specifically engineered to be fired through a short barrel with a suppressor. Highly effective at close ranges.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>7.62x39mm:</strong> The classic AK-47 round. Shoots a heavier, slower bullet than the 5.56 NATO.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>.308 Winchester / 7.62 NATO:</strong> The classic heavy-hitter. Fantastic for dropping large game or ringing steel out to 800 yards.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>6.5 Creedmoor:</strong> The modern long-range cheat code. Highly aerodynamic bullet that stays supersonic past 1,000 yards.</li>
                <li><strong style={{color:'#fff'}}>.50 BMG:</strong> A massive anti-materiel cartridge designed for heavy machine guns and extreme long-range rifles. Can disable vehicles.</li>
              </ul>
            </div>

            <div style={{...cardStyle, borderLeft: '4px solid #ec4899', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#ec4899' }}>3. Ammunition Types & Pressures</h3>
              <ul style={{ color: '#aaa', fontSize: '0.9em', paddingLeft: '20px', lineHeight: '1.6', margin: 0 }}>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>FMJ (Full Metal Jacket):</strong> Lead core wrapped in copper. Does not expand. Over-penetrates in defense scenarios.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>JHP (Jacketed Hollow Point):</strong> The gold standard for defense. Tip expands instantly upon hitting liquid/tissue, transferring massive energy.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>Hard Cast Lead:</strong> Solid, unjacketed blocks of lead hardened with antimony. Designed to smash entirely through bone and deep muscle without expanding. Ideal for bear defense.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>Wadcutter (WC) & Semi-Wadcutter (SWC):</strong> Completely flat-faced bullets designed to punch perfectly clean, circular holes in paper targets for competition scoring.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>Overpressure (+P and +P+):</strong> Ammunition loaded with extra gunpowder to exceed standard SAAMI pressure limits. Generates much higher velocities, but can dangerously damage firearms not explicitly rated for "+P" pressures.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>OTM (Open Tip Match):</strong> Looks like a hollow point, but the hole is a byproduct of manufacturing to make the bullet perfectly balanced for extreme precision. Not designed to expand.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>Frangible:</strong> Compressed copper dust. Disintegrates into powder upon hitting steel targets to prevent dangerous ricochets at close range.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>Subsonic:</strong> Extra-heavy bullets loaded to travel slower than the speed of sound (under ~1,125 fps). Eliminates the supersonic "crack."</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>Armor Piercing (AP):</strong> Features a hardened steel or tungsten penetrator core. Highly restricted.</li>
                <li><strong style={{color:'#fff'}}>Incendiary / Tracer:</strong> Contains a pyrotechnic charge that either burns brightly in flight (Tracer) or detonates/burns upon impact (Incendiary). Heavily regulated and banned at most civilian ranges due to severe fire hazard.</li>
              </ul>
            </div>

            <div style={{...cardStyle, borderLeft: '4px solid #14b8a6', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#14b8a6' }}>4. The 4 Universal Rules of Safety</h3>
              <ol style={{ color: '#fff', fontSize: '0.9em', paddingLeft: '20px', lineHeight: '1.6', margin: 0, fontWeight: 'bold' }}>
                <li style={{ marginBottom: '8px' }}>ALL GUNS ARE ALWAYS LOADED.</li>
                <li style={{ marginBottom: '8px' }}>NEVER LET THE MUZZLE COVER ANYTHING YOU ARE NOT WILLING TO DESTROY.</li>
                <li style={{ marginBottom: '8px' }}>KEEP YOUR FINGER OFF THE TRIGGER UNTIL YOUR SIGHTS ARE ON THE TARGET.</li>
                <li>BE SURE OF YOUR TARGET AND WHAT IS BEYOND IT.</li>
              </ol>
            </div>

            <div style={{...cardStyle, borderLeft: '4px solid #ef4444', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>5. Legalities: Transport, Checks & NFA</h3>
              <ul style={{ color: '#aaa', fontSize: '0.9em', paddingLeft: '20px', lineHeight: '1.5' }}>
                <li style={{ marginBottom: '10px' }}><strong>FOPA Safe Passage:</strong> Under 18 U.S.C. § 926A, travelers can legally transport firearms through highly restrictive states as long as the gun is legal in their origin and destination states. The gun must be unloaded and locked in a container totally inaccessible to the passenger compartment.</li>
                <li style={{ marginBottom: '10px' }}><strong>Universal Background Checks vs. Private Sales:</strong> Under federal law, buying a gun from a licensed dealer requires a Form 4473 and an FBI NICS background check. In many free states, private sales between residents do not require this. However, restrictive states have implemented "Universal" checks, forcing private sellers to go through a dealer anyway.</li>
                <li style={{ marginBottom: '10px' }}><strong>Red Flag Laws (ERPOs):</strong> Extreme Risk Protection Orders allow police to temporarily confiscate an individual's firearms based on sworn claims that the person is a danger to themselves or others, often without a prior criminal conviction.</li>
                <li style={{ marginBottom: '10px' }}><strong>Title II (NFA Items):</strong> Suppressors, Short-Barreled Rifles (SBRs), and Short-Barreled Shotguns (SBSs). Requires an ATF Form 1 or 4, a $200 tax stamp, fingerprints, and wait periods.</li>
                <li><strong>Machine Guns:</strong> Post-1986 fully automatic weapons are strictly illegal for civilians.</li>
              </ul>
            </div>

            <div style={{...cardStyle, borderLeft: '4px solid #eab308', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#eab308' }}>6. Legalities: Self-Defense & Use of Force</h3>
              <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: '10px', borderRadius: '8px', border: '1px dashed #eab308', marginBottom: '15px' }}>
                <p style={{ color: '#eab308', fontSize: '0.85em', margin: 0, textAlign: 'justify', lineHeight: '1.4' }}><strong>DISCLAIMER:</strong> Self-defense laws vary wildly by state. The developers are not lawyers. This is a baseline definition of terms, not legal advice.</p>
              </div>
              <ul style={{ color: '#aaa', fontSize: '0.9em', paddingLeft: '20px', lineHeight: '1.5' }}>
                <li style={{ marginBottom: '10px' }}><strong>Castle Doctrine:</strong> A common law principle stating you have no legal duty to retreat when defending yourself from an intruder inside your own home, vehicle, or workplace.</li>
                <li style={{ marginBottom: '10px' }}><strong>Stand Your Ground:</strong> An expansion of the Castle Doctrine that removes the "duty to retreat" in any public space where you have a legal right to be. If threatened with lethal force, you can meet it with lethal force without attempting to run away first.</li>
                <li style={{ marginBottom: '10px' }}><strong>Duty to Retreat:</strong> Enforced in restrictive states. It legally mandates that an individual must attempt to flee or safely escape a deadly threat before they are legally allowed to use deadly force to defend themselves.</li>
                <li><strong>Civil Liability Shields:</strong> In roughly 23 states, if you are cleared of criminal charges in a self-defense shooting, the law shields you from being sued for monetary damages in civil court by the attacker or their family.</li>
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
