import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BallisticsCalc() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Solution'); // 'Solution', 'Comparator', 'DOPE', 'Reloading', 'Guide'
  const [guideTab, setGuideTab] = useState('Safety & Law');

  // --- BALLISTICS STATE ---
  const [bulletWeight, setBulletWeight] = useState('168');
  const [muzzleVelocity, setMuzzleVelocity] = useState('2600');
  const [g1Bc, setG1Bc] = useState('0.462');
  const [sightHeight, setSightHeight] = useState('1.5');
  const [zeroRange, setZeroRange] = useState('100');
  const [targetDist, setTargetDist] = useState('300');
  const [windSpeed, setWindSpeed] = useState('10');
  const [windAngle, setWindAngle] = useState('90');
  const [angularUnit, setAngularUnit] = useState('MIL'); // MIL or MOA

  // --- RELOADING STATE ---
  const [caseLength, setCaseLength] = useState('2.005');
  const [maxCaseLength, setMaxCaseLength] = useState('2.015');

  const parse = (val) => parseFloat(val) || 0;

  // --- BALLISTICS MATH ENGINE ---
  const w = parse(bulletWeight);
  const v = parse(muzzleVelocity);
  const bc = parse(g1Bc);
  const dist = parse(targetDist);
  const zero = parse(zeroRange);
  const wind = parse(windSpeed);

  // Simplified point-mass trajectory approximation for field use
  const dropInches = bc > 0 ? ((dist - zero) * (dist / 100) * (2800 / Math.max(500, v))) : 0;
  const dropClicks = angularUnit === 'MIL' 
    ? (dropInches / (dist * 0.036)).toFixed(1) 
    : (dropInches / (dist * 0.01047)).toFixed(1);

  // Wind drift approximation
  const driftInches = bc > 0 ? ((wind * Math.pow(dist / 100, 1.5)) * (2000 / Math.max(500, v))) : 0;
  const driftClicks = angularUnit === 'MIL'
    ? (driftInches / (dist * 0.036)).toFixed(1)
    : (driftInches / (dist * 0.01047)).toFixed(1);

  // --- STYLES ---
  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.05em', marginTop: '4px' };
  const labelStyle = { color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate('/calculator')}>Hub</button>
        <h2>Ballistics & Armory</h2>
      </header>

      {/* TABS */}
      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Solution', 'Comparator', 'DOPE Card', 'Reloading', 'Guide'].map(tab => (
          <button 
            key={tab} onClick={() => setActiveTab(tab)}
            style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: activeTab === tab ? '#00ffff' : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>
            {tab}
          </button>
        ))}
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1 }}>
        
        {/* ========================================== */}
        {/* TAB 1: SOLUTION                            */}
        {/* ========================================== */}
        {activeTab === 'Solution' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #00ffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ margin: 0, color: '#00ffff' }}>Angular Standard</h4>
                <div style={{ display: 'flex', background: '#000', borderRadius: '6px', padding: '2px', border: '1px solid #333' }}>
                  <button onClick={() => setAngularUnit('MIL')} style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', background: angularUnit === 'MIL' ? '#00ffff' : 'transparent', color: angularUnit === 'MIL' ? '#000' : '#888', fontWeight: 'bold' }}>MIL</button>
                  <button onClick={() => setAngularUnit('MOA')} style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', background: angularUnit === 'MOA' ? '#00ffff' : 'transparent', color: angularUnit === 'MOA' ? '#000' : '#888', fontWeight: 'bold' }}>MOA</button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Bullet (gr)<input type="number" value={bulletWeight} onChange={e=>setBulletWeight(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Muzzle (fps)<input type="number" value={muzzleVelocity} onChange={e=>setMuzzleVelocity(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ marginBottom: '10px' }}><label style={labelStyle}>G1 BC<input type="number" step="0.001" value={g1Bc} onChange={e=>setG1Bc(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Sight Ht (in)<input type="number" step="0.1" value={sightHeight} onChange={e=>setSightHeight(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Zero (yds)<input type="number" value={zeroRange} onChange={e=>setZeroRange(e.target.value)} style={inputStyle} /></label></div>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #00cc66' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#00cc66' }}>Target & Environment</h4>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Target Dist (yds)<input type="number" value={targetDist} onChange={e=>setTargetDist(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Wind (mph)<input type="number" value={windSpeed} onChange={e=>setWindSpeed(e.target.value)} style={inputStyle} /></label></div>
              </div>
            </div>

            <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '20px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#00ffff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>FIRING SOLUTION</h3>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div>
                  <span style={{ color: '#888', fontSize: '0.85em', display: 'block', textTransform: 'uppercase' }}>Elevation Hold</span>
                  <strong style={{ color: '#00cc66', fontSize: '2em' }}>{dropClicks} <span style={{ fontSize: '0.6em' }}>{angularUnit}</span></strong>
                  <span style={{ color: '#aaa', display: 'block', fontSize: '0.8em' }}>({dropInches.toFixed(1)} inches)</span>
                </div>
                <div style={{ borderRight: '1px solid #333' }}></div>
                <div>
                  <span style={{ color: '#888', fontSize: '0.85em', display: 'block', textTransform: 'uppercase' }}>Windage Hold</span>
                  <strong style={{ color: '#f59e0b', fontSize: '2em' }}>{driftClicks} <span style={{ fontSize: '0.6em' }}>{angularUnit}</span></strong>
                  <span style={{ color: '#aaa', display: 'block', fontSize: '0.8em' }}>({driftInches.toFixed(1)} inches)</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* TAB 2: COMPARATOR                          */}
        {/* ========================================== */}
        {activeTab === 'Comparator' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#a855f7' }}>Trajectory Comparator</h3>
            <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.4' }}>
              Quick load comparison against standard military and hunting rounds coming soon in the next patch iteration.
            </p>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: DOPE CARD                           */}
        {/* ========================================== */}
        {activeTab === 'DOPE Card' && (
          <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '15px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#00ffff', textAlign: 'center' }}>GENERATED DOPE CARD</h3>
            <table style={{ width: '100%', color: '#fff', textAlign: 'center', borderCollapse: 'collapse', fontSize: '0.95em' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333', color: '#00ffff' }}>
                  <th style={{ padding: '8px' }}>Range</th>
                  <th style={{ padding: '8px' }}>Drop ({angularUnit})</th>
                  <th style={{ padding: '8px' }}>Wind ({angularUnit})</th>
                </tr>
              </thead>
              <tbody>
                {[200, 300, 400, 500, 600, 700, 800, 900, 1000].map(yds => {
                  const dIn = bc > 0 ? ((yds - zero) * (yds / 100) * (2800 / Math.max(500, v))) : 0;
                  const dCl = angularUnit === 'MIL' ? (dIn / (yds * 0.036)).toFixed(1) : (dIn / (yds * 0.01047)).toFixed(1);
                  return (
                    <tr key={yds} style={{ borderBottom: '1px solid #111' }}>
                      <td style={{ padding: '8px', color: '#888' }}>{yds}y</td>
                      <td style={{ padding: '8px', color: '#00cc66', fontWeight: 'bold' }}>{dCl}</td>
                      <td style={{ padding: '8px', color: '#f59e0b' }}>{(yds / 200).toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: RELOADING BENCH                     */}
        {/* ========================================== */}
        {activeTab === 'Reloading' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>Case Trim & Shoulder Gauge</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>Current Length<input type="number" step="0.001" value={caseLength} onChange={e=>setCaseLength(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Max Length<input type="number" step="0.001" value={maxCaseLength} onChange={e=>setMaxCaseLength(e.target.value)} style={inputStyle} /></label></div>
            </div>
            <div style={{ background: '#000', padding: '12px', borderRadius: '8px', textAlign: 'center', marginTop: '15px' }}>
              <span style={{ color: '#888', fontSize: '0.85em', display: 'block' }}>Trim Status</span>
              <strong style={{ color: parse(caseLength) >= parse(maxCaseLength) ? '#ef4444' : '#00cc66', fontSize: '1.2em' }}>
                {parse(caseLength) >= parse(maxCaseLength) ? '⚠️ TRIM REQUIRED' : '✅ WITHIN SPEC'}
              </strong>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 5: GUIDE & LEGAL LIBRARY               */}
        {/* ========================================== */}
        {activeTab === 'Guide' && (
          <>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {['Safety & Law', 'Caliber Data', 'Ammo Types'].map(sub => (
                <button
                  key={sub}
                  onClick={() => setGuideTab(sub)}
                  style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', fontSize: '0.85em', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: guideTab === sub ? 'rgba(0, 255, 255, 0.2)' : '#151515', color: guideTab === sub ? '#00ffff' : '#888', border: guideTab === sub ? '1px solid #00ffff' : '1px solid #222' }}>
                  {sub}
                </button>
              ))}
            </div>

            {guideTab === 'Safety & Law' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #fff', padding: '15px' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>The Second Amendment</h3>
                  <p style={{ color: '#fff', fontSize: '1em', fontStyle: 'italic', margin: 0, lineHeight: '1.5' }}>
                    "A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed."
                  </p>
                </div>

                <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', borderLeft: '4px solid #00ffff' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#00ffff' }}>4 Universal Safety Rules</h3>
                  <ol style={{ color: '#aaa', fontSize: '0.85em', paddingLeft: '16px', lineHeight: '1.5', margin: 0, fontWeight: 'bold' }}>
                    <li style={{color: '#fff'}}>ALL GUNS ARE ALWAYS LOADED.</li>
                    <li style={{color: '#fff'}}>NEVER POINT AT ANYTHING YOU ARE NOT WILLING TO DESTROY.</li>
                    <li style={{color: '#fff'}}>KEEP YOUR FINGER OFF THE TRIGGER UNTIL ON TARGET.</li>
                    <li style={{color: '#fff'}}>KNOW YOUR TARGET AND WHAT IS BEYOND IT.</li>
                  </ol>
                </div>

                <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>Federal NFA & Travel Laws</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    <strong>SBRs vs Pistols:</strong> Rifles with barrels under 16" are NFA items requiring a $200 tax stamp. AR-style pistols utilize a stabilizing brace rather than a stock to bypass this, though ATF rulings continuously fluctuate.<br/><br/>
                    <strong>FOPA (Travel):</strong> The Firearm Owners Protection Act protects interstate travel with firearms, provided they are unloaded, locked in a trunk, and legal in both the origin and destination states. (Note: NY and NJ routinely ignore this; travel with extreme caution).
                  </p>
                </div>
              </div>
            )}

            {guideTab === 'Caliber Data' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', borderLeft: '4px solid #a855f7' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#a855f7' }}>The Wheel-Gun Standard</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    <strong>.357 Magnum:</strong> The undisputed king of the revolver world. A 125gr JHP moving at 1,450 fps delivers ~580 ft-lbs of kinetic energy, boasting a one-shot stop ratio that semi-autos still chase. You can also safely fire cheaper, lower-recoil .38 Special loads out of any .357 cylinder.
                  </p>
                </div>

                <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', borderLeft: '4px solid #3b82f6' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#3b82f6' }}>Defensive Semi-Autos</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    <strong>9mm Parabellum:</strong> Global standard. 115gr to 147gr. Low recoil, high capacity. Modern JHP tech makes it equal to heavier calibers in soft tissue.<br/>
                    <strong>10mm Auto:</strong> Bear defense. Pushes 180gr to 1,200+ fps. Generates magnum-level kinetic energy out of a semi-auto frame.<br/>
                    <strong>.45 ACP:</strong> Subsonic by nature. 230gr flying at 850 fps. Massive permanent wound cavity, heavily relied upon when suppressed.
                  </p>
                </div>

                <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#00cc66' }}>Rifle Ballistics</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    <strong>5.56x45mm NATO:</strong> 55gr to 77gr. Relies on hyper-velocity (3,000+ fps) to induce hydrostatic shock and fragmentation. <br/>
                    <strong>.300 Blackout:</strong> Optimized for short barrels and suppressors. 220gr subs are whisper quiet; 110gr supers mimic 7.62x39mm ballistics.<br/>
                    <strong>.308 Winchester:</strong> Full-power battle rifle cartridge. 168gr to 175gr. Exceptional barrier penetration and supersonic range up to 800+ yards.
                  </p>
                </div>
              </div>
            )}

            {guideTab === 'Ammo Types' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#f59e0b' }}>Projectile Dynamics</h3>
                  <ul style={{ color: '#aaa', fontSize: '0.85em', paddingLeft: '16px', lineHeight: '1.5', margin: 0 }}>
                    <li><strong>FMJ (Ball):</strong> Copper-wrapped lead. Non-expanding target ammo. Tends to over-penetrate.</li>
                    <li><strong>JHP (Hollow Point):</strong> Expands violently in fluid/tissue to dump all kinetic energy and prevent over-penetration. Mandatory for carry.</li>
                    <li><strong>Hard Cast:</strong> Antimony-hardened lead. Designed for maximum penetration to crush heavy bone (e.g., bear defense) without deforming.</li>
                    <li><strong>Frangible:</strong> Compressed copper powder. Disintegrates instantly upon hitting steel targets to prevent lethal splashback at close ranges.</li>
                    <li><strong>Subsonic:</strong> Engineered to remain under the speed of sound (~1,125 fps at sea level) to eliminate the supersonic crack when firing suppressed.</li>
                  </ul>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
