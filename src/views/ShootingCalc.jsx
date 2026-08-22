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

            {/* 2nd Amendment Header */}
            <div style={{...cardStyle, borderTop: '4px solid #fff', borderBottom: '4px solid #fff', background: 'rgba(255, 255, 255, 0.05)', padding: '25px 20px', marginBottom: 0 }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.2em' }}>The Second Amendment</h3>
              <p style={{ color: '#fff', fontSize: '1.15em', lineHeight: '1.6', fontStyle: 'italic', textAlign: 'center', fontWeight: 'bold', margin: 0 }}>
                "A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed."
              </p>
            </div>
            
            {/* 1. Firearm Classifications */}
            <div style={{...cardStyle, borderLeft: '4px solid #3b82f6', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>1. Firearm Classifications</h3>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}><strong>Handguns (Pistols & Revolvers):</strong> Designed to be fired with one hand. Used for concealed carry, personal defense, and duty sidearms.</p>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}><strong>Rifles (Long Guns):</strong> Fired from the shoulder with a rifled barrel (spiral grooves spin the bullet). Used for hunting and long-range precision.</p>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}><strong>Shotguns (Long Guns):</strong> Fired from the shoulder with a smoothbore barrel. Fires multiple pellets (shot) or a single heavy slug. Excellent for close-quarters.</p>
            </div>

            {/* 2. Calibers & Grains */}
            <div style={{...cardStyle, borderLeft: '4px solid #10b981', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#10b981' }}>2. The Caliber Cheat Sheet</h3>
              <ul style={{ color: '#aaa', fontSize: '0.9em', paddingLeft: '20px', lineHeight: '1.6', margin: 0 }}>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>.22 LR:</strong> A tiny "rimfire" cartridge. Almost zero recoil and dirt cheap. Perfect for training or plinking.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>9mm Luger:</strong> The global king of handguns. Optimal balance of capacity and recoil.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>5.56x45mm NATO / .223 Rem:</strong> Standard AR-15 round. Fires a light bullet at blistering speeds.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>.308 Winchester / 7.62 NATO:</strong> The classic heavy-hitter. Fantastic for dropping large game or ringing steel out to 800 yards.</li>
                <li><strong style={{color:'#fff'}}>6.5 Creedmoor:</strong> The modern long-range cheat code. Highly aerodynamic bullet that stays supersonic past 1,000 yards.</li>
              </ul>
            </div>

            {/* 3. EXPANDED Ammo Types */}
            <div style={{...cardStyle, borderLeft: '4px solid #ec4899', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#ec4899' }}>3. Ammunition Types & Behavior</h3>
              <ul style={{ color: '#aaa', fontSize: '0.9em', paddingLeft: '20px', lineHeight: '1.6', margin: 0 }}>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>FMJ (Full Metal Jacket):</strong> "Ball" ammo. Lead core wrapped entirely in copper. Does not expand. Great for cheap target practice; over-penetrates in defense scenarios.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>JHP (Jacketed Hollow Point):</strong> The gold standard for self-defense. The tip has a hollow cavity designed to instantly "mushroom" and expand upon hitting liquid/tissue, transferring massive energy.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>SP (Soft Point):</strong> Exposed lead tip that expands slower than a hollow point. Great for hunting thick-skinned game where deep penetration before expansion is needed.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>OTM (Open Tip Match):</strong> Looks like a hollow point, but the hole is just a byproduct of the manufacturing process to make the bullet perfectly balanced for extreme long-range accuracy. Not designed to expand.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>Ballistic Polymer Tip:</strong> Features a sleek plastic tip that makes the bullet fly straight. Upon impact, the plastic is driven violently back into the core, expanding it like a hollow point.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>Frangible:</strong> Made of compressed copper dust. Disintegrates into powder upon hitting steel targets to prevent dangerous ricochets at close range.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>Subsonic:</strong> Extra-heavy bullets loaded with less powder to travel slower than the speed of sound (under ~1,125 fps). Eliminates the supersonic "crack," making them incredibly quiet with a suppressor.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>Armor Piercing (AP):</strong> Features a hardened steel or tungsten penetrator core instead of soft lead. Designed to punch through body armor. Highly restricted.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>Tracer:</strong> The base of the bullet contains a pyrotechnic charge that burns brightly so the shooter can see the exact trajectory. Highly restricted at civilian ranges due to severe fire hazard.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>Shotgun - Birdshot:</strong> Hundreds of tiny lead or steel BBs. Excellent for shooting clay pigeons or birds. Terrible for defense.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>Shotgun - Buckshot:</strong> Contains 8 or 9 large lead balls. The absolute king of close-quarters home defense.</li>
                <li><strong style={{color:'#fff'}}>Shotgun - Slugs:</strong> A single, massive chunk of lead (usually 1 ounce). Turns a close-range shotgun into a rifle capable of punching through engine blocks.</li>
              </ul>
            </div>

            {/* 4. Safety & Storage */}
            <div style={{...cardStyle, borderLeft: '4px solid #14b8a6', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#14b8a6' }}>4. The 4 Universal Rules of Safety</h3>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5', fontStyle: 'italic', marginBottom: '15px' }}>These rules apply 100% of the time, with zero exceptions.</p>
              <ol style={{ color: '#fff', fontSize: '0.9em', paddingLeft: '20px', lineHeight: '1.6', margin: 0, fontWeight: 'bold' }}>
                <li style={{ marginBottom: '8px' }}>ALL GUNS ARE ALWAYS LOADED.</li>
                <li style={{ marginBottom: '8px' }}>NEVER LET THE MUZZLE COVER ANYTHING YOU ARE NOT WILLING TO DESTROY.</li>
                <li style={{ marginBottom: '8px' }}>KEEP YOUR FINGER OFF THE TRIGGER UNTIL YOUR SIGHTS ARE ON THE TARGET.</li>
                <li>BE SURE OF YOUR TARGET AND WHAT IS BEYOND IT.</li>
              </ol>
              <div style={{ borderTop: '1px dashed #333', marginTop: '15px', paddingTop: '15px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#14b8a6' }}>Storage & Protection</h4>
                <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}>Guns must be stored in a cool, dry place. A heavy steel gun safe is ideal, but a reinforced lockbox prevents unauthorized access. Always store ammunition in a separate, locked container. Throwing a few silica gel desiccant packs into your safe will suck moisture out of the air and prevent rust.</p>
              </div>
            </div>

            {/* 5. Cleaning & Caring */}
            <div style={{...cardStyle, borderLeft: '4px solid #f97316', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#f97316' }}>5. Cleaning & Maintenance</h3>
              <ul style={{ color: '#aaa', fontSize: '0.9em', paddingLeft: '20px', lineHeight: '1.6', margin: 0 }}>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>Field Stripping:</strong> Taking the weapon apart into its major component groups (slide, barrel, recoil spring, frame) without using specialized tools. Always visually and physically clear the chamber before stripping.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>Bore Snake & Solvents:</strong> A carbon-cutting solvent combined with a brass brush or a pull-through "Bore Snake" will clear the lead and copper fouling out of the barrel's rifling to maintain accuracy.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>Internal Lubrication:</strong> Standard commercial CLP (Clean, Lubricate, Protect) is the go-to for keeping internal moving parts like the bolt carrier group and trigger sear running smoothly.</li>
                <li><strong style={{color:'#fff'}}>External Protection:</strong> Bare metal will rust if exposed to skin oils and moisture. For wiping down blades, tools, and exterior gun metal, natural palm seed oil or coconut oil are exceptional, heavy-duty protectants against surface corrosion.</li>
              </ul>
            </div>

            {/* 6. Legalities */}
            <div style={{...cardStyle, borderLeft: '4px solid #ef4444', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>6. Federal NFA Regulations</h3>
              <ul style={{ color: '#aaa', fontSize: '0.9em', paddingLeft: '20px', lineHeight: '1.5' }}>
                <li><strong>Title I:</strong> Rifles (16"+ barrel), shotguns (18"+ barrel), and handguns. Require an ATF Form 4473 check.</li>
                <li><strong>Title II (NFA Items):</strong> Requires an ATF Form 1 or 4, a $200 tax stamp, fingerprints, and wait periods.</li>
                <li><strong>SBRs & SBSs:</strong> Short-Barreled Rifles/Shotguns with a stock are highly restricted.</li>
                <li><strong>Suppressors:</strong> Muffle the explosion; highly restricted NFA items.</li>
                <li><strong>Machine Guns:</strong> Post-1986 fully automatic weapons are strictly illegal for civilians.</li>
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
