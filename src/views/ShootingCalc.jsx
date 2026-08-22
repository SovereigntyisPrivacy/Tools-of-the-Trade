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
  const [brassCost, setBrassCost] = useState('0'); // Often reused
  const [brassQty, setBrassQty] = useState('100');
  const [primerCost, setPrimerCost] = useState('85.00');
  const [primerQty, setPrimerQty] = useState('1000');
  const [projCost, setProjCost] = useState('38.50');
  const [projQty, setProjQty] = useState('100');
  const [pwdCost, setPwdCost] = useState('45.00');
  const [pwdLbs, setPwdLbs] = useState('1');
  const [pwdCharge, setPwdCharge] = useState('44.0');

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
  const bCost = parse(brassQty) > 0 ? parse(brassCost) / parse(brassQty) : 0;
  const pCost = parse(primerQty) > 0 ? parse(primerCost) / parse(primerQty) : 0;
  const prCost = parse(projQty) > 0 ? parse(projCost) / parse(projQty) : 0;
  
  const totalPowderGrains = parse(pwdLbs) * 7000;
  const pwdCostPerGrain = totalPowderGrains > 0 ? parse(pwdCost) / totalPowderGrains : 0;
  const pwdCostPerRound = pwdCostPerGrain * parse(pwdCharge);
  
  const totalCpr = bCost + pCost + prCost + pwdCostPerRound;
  const boxCost = totalCpr * 50;
  const yieldPerJug = parse(pwdCharge) > 0 ? Math.floor(totalPowderGrains / parse(pwdCharge)) : 0;

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
            <p style={{ color: '#aaa', textAlign: 'center', marginBottom: '20px' }}>Calculate exact Cost Per Round (CPR) and powder yield.</p>
            
            <div style={{...cardStyle, borderLeft: '4px solid #a855f7'}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#a855f7' }}>1. Hardware Components</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Brass Cost ($)<input type="number" value={brassCost} onChange={e=>setBrassCost(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Brass Qty<input type="number" value={brassQty} onChange={e=>setBrassQty(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Primer Cost ($)<input type="number" value={primerCost} onChange={e=>setPrimerCost(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Primer Qty<input type="number" value={primerQty} onChange={e=>setPrimerQty(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Projectile Cost ($)<input type="number" value={projCost} onChange={e=>setProjCost(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Projectile Qty<input type="number" value={projQty} onChange={e=>setProjQty(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <p style={{ color: '#666', fontSize: '0.8em', marginTop: '10px', fontStyle: 'italic', marginBottom: 0 }}>*If you reuse fired brass, set Brass Cost to 0.</p>
            </div>

            <div style={{...cardStyle, borderLeft: '4px solid #f59e0b'}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>2. Gunpowder Logic</h3>
              <div style={flexWrap}>
                <div style={inputWrap}><label style={labelStyle}>Powder Cost ($)<input type="number" value={pwdCost} onChange={e=>setPwdCost(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>Total Lbs<input type="number" value={pwdLbs} onChange={e=>setPwdLbs(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>Charge (gr)<input type="number" value={pwdCharge} onChange={e=>setPwdCharge(e.target.value)} style={{...inputStyle, border: '1px solid #f59e0b'}} /></label></div>
              </div>
            </div>

            <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '20px', fontFamily: 'monospace', fontSize: '1.1em' }}>
              <h3 style={{ color: '#00ffff', textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Reloading Yield</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '12px' }}>
                <span>Hardware CPR:</span> <span>${(bCost + pCost + prCost).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px' }}>
                <span>Powder CPR:</span> <span>${pwdCostPerRound.toFixed(3)}</span>
              </div>
              <div style={{ borderBottom: '1px dashed #444', margin: '10px 0' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00cc66', fontWeight: 'bold', fontSize: '1.2em', marginBottom: '15px' }}>
                <span>Total CPR:</span> <span>${totalCpr.toFixed(3)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffaa00', marginBottom: '15px' }}>
                <span>Cost per Box (50):</span> <span>${boxCost.toFixed(2)}</span>
              </div>
              
              <div style={{ borderBottom: '1px solid #333', margin: '15px 0' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#3b82f6', fontWeight: 'bold' }}>
                <span>Rounds per Jug:</span> <span>{yieldPerJug} rds</span>
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
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}><strong>Handguns (Pistols & Revolvers):</strong> Designed to be fired with one hand. Typically used for concealed carry, personal defense, and duty sidearms.</p>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}><strong>Rifles (Long Guns):</strong> Designed to be fired from the shoulder with a rifled barrel (spiral grooves that spin the bullet). Used for hunting, long-range precision, and combat.</p>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}><strong>Shotguns (Long Guns):</strong> Designed to be fired from the shoulder with a smoothbore barrel. Fires multiple pellets (shot) or a single heavy lead slug. Excellent for close-quarters.</p>
            </div>

            <div style={{...cardStyle, borderLeft: '4px solid #f59e0b', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>2. Grains & Ballistics</h3>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}>A "Grain" (gr) is a unit of weight. There are 7,000 grains in a pound. Heavier bullets (higher grain) travel slower but hit with more force and resist wind better. Lighter bullets are faster and shoot flatter, but lose energy quickly.</p>
            </div>

            <div style={{...cardStyle, borderLeft: '4px solid #10b981', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#10b981' }}>3. The Caliber Cheat Sheet</h3>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5', marginBottom: '15px' }}>Caliber refers to the internal diameter of the barrel:</p>
              <ul style={{ color: '#aaa', fontSize: '0.9em', paddingLeft: '20px', lineHeight: '1.6', margin: 0 }}>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>.22 LR:</strong> A tiny "rimfire" cartridge. Almost zero recoil and dirt cheap. Perfect for training or plinking.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>9mm Luger:</strong> The undisputed global king of handguns. Offers the best balance of capacity and recoil.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>5.56x45mm NATO / .223 Rem:</strong> The standard AR-15 rifle round. Fires a light bullet at blistering speeds.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>.308 Winchester / 7.62 NATO:</strong> The classic heavy-hitter. Fantastic for dropping large game or ringing steel out to 800 yards.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>6.5 Creedmoor:</strong> The modern long-range cheat code. It fires a highly aerodynamic bullet that stays supersonic past 1,000 yards.</li>
                <li><strong style={{color:'#fff'}}>12 Gauge:</strong> The universal shotgun shell. Can be loaded with tiny pellets (birdshot), heavy lead balls (buckshot), or 1-ounce slugs.</li>
              </ul>
            </div>

            <div style={{...cardStyle, borderLeft: '4px solid #a855f7', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#a855f7' }}>4. Optics & Sighting</h3>
              <ul style={{ color: '#aaa', fontSize: '0.9em', paddingLeft: '20px', lineHeight: '1.6', margin: 0 }}>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>Red Dots & Holographics:</strong> 1x magnification. Infinite eye relief. You shoot with both eyes open for rapid target acquisition. Excellent for CQB.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>Prism Scopes:</strong> Fixed magnification (usually 3x or 4x). Uses an etched glass reticle, meaning it still works perfectly even if the battery dies. Great for shooters with astigmatism.</li>
                <li style={{ marginBottom: '10px' }}><strong style={{color:'#fff'}}>LPVO (Low Power Variable Optic):</strong> Usually 1-6x or 1-8x magnification. The most versatile rifle optic. Can be used at 1x like a red dot, or dialed up to shoot at 500 yards.</li>
                <li><strong style={{color:'#fff'}}>Precision Scopes (MPVO/HPVO):</strong> High magnification (e.g., 5-25x). Features exposed turrets so shooters can manually dial their Elevation and Windage DOPE for extreme long-range shots.</li>
              </ul>
            </div>

            <div style={{...cardStyle, borderLeft: '4px solid #ef4444', marginBottom: 0}}>
              <h3 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>5. Federal NFA Regulations</h3>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}>Federal law applies everywhere. Violating the National Firearms Act (NFA) is a felony.</p>
              <ul style={{ color: '#aaa', fontSize: '0.9em', paddingLeft: '20px', lineHeight: '1.5' }}>
                <li><strong>Title I (Standard):</strong> Rifles (16"+ barrel), shotguns (18"+ barrel), and handguns. Require an ATF Form 4473 background check.</li>
                <li><strong>Title II (NFA Items):</strong> Requires an ATF Form 1 (to make) or Form 4 (to transfer), a $200 tax stamp, fingerprints, and extensive waiting periods.</li>
                <li><strong>SBRs & SBSs:</strong> Short-Barreled Rifles (under 16") and Short-Barreled Shotguns (under 18") with a stock are highly restricted NFA items.</li>
                <li><strong>Suppressors:</strong> "Silencers" do not silence guns; they muffle the explosion. They are heavily restricted NFA items.</li>
                <li><strong>Machine Guns:</strong> Post-1986 newly manufactured fully automatic weapons are strictly illegal for civilians to own.</li>
              </ul>
            </div>

            <div style={{...cardStyle, borderLeft: '4px solid #eab308', marginBottom: 0}}>
              <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: '10px', borderRadius: '8px', border: '1px dashed #eab308', marginBottom: '15px' }}>
                <p style={{ color: '#eab308', fontSize: '0.85em', margin: 0, textAlign: 'justify', lineHeight: '1.4' }}><strong>DISCLAIMER:</strong> State laws and reciprocity agreements change constantly. This guide provides a generalized baseline. The developers are not lawyers. Always verify official, up-to-date local statutes before crossing state lines or carrying a firearm.</p>
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#eab308' }}>6. State Laws & Reciprocity</h3>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5' }}>State laws vary wildly. Crossing a border with a firearm legal in your state can be a felony in the next.</p>
              <ul style={{ color: '#aaa', fontSize: '0.9em', paddingLeft: '20px', lineHeight: '1.5' }}>
                <li style={{ marginBottom: '10px' }}><strong>Constitutional Carry:</strong> States that allow any legal gun owner over 21 to carry a concealed handgun without needing a permit.</li>
                <li style={{ marginBottom: '10px' }}><strong>Shall-Issue:</strong> States that require a Concealed Carry Weapon (CCW) permit, but must issue it to you if you pass the background check and training.</li>
                <li style={{ marginBottom: '10px' }}><strong>May-Issue / Strict States:</strong> States that heavily restrict permits, ban specific cosmetic rifle features (Assault Weapon Bans), and limit magazine capacities to 10 rounds.</li>
                <li><strong>Reciprocity:</strong> Just because you have a CCW in your home state does not mean another state honors it. Always check a reciprocity map before traveling.</li>
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
