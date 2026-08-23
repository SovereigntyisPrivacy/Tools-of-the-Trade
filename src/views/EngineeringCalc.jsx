import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EngineeringCalc() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Torque'); 
  const [guideTab, setGuideTab] = useState('Pro Tips'); 

  // --- STATE ---
  const [tForce, setTForce] = useState('');
  const [tLever, setTLever] = useState('');
  const [tAngle, setTAngle] = useState('90');
  
  const [rLoad, setRLoad] = useState('');
  const [rLegs, setRLegs] = useState('2');
  const [rAngle, setRAngle] = useState('60');

  const [bLoad, setBLoad] = useState('');
  const [bSpan, setBSpan] = useState('');
  const [bModulus, setBModulus] = useState('29000000'); 
  const [bInertia, setBInertia] = useState('');
  const [bDist, setBDist] = useState('center');

  const [hPsi, setHPsi] = useState('');
  const [hBore, setHBore] = useState('');

  const [mL, setML] = useState('');
  const [mW, setMW] = useState('');
  const [mH, setMH] = useState('');
  const [mDensity, setMDensity] = useState('490');

  const parse = (val) => parseFloat(val) || 0;

  // --- MATH ENGINES ---
  const tRad = parse(tAngle) * (Math.PI / 180);
  const effectiveLever = parse(tLever) * Math.sin(tRad);
  const torqueGen = parse(tForce) * effectiveLever;

  const tensionPerLeg = parse(rAngle) > 0 ? (parse(rLoad) / parse(rLegs)) / Math.sin(parse(rAngle) * (Math.PI / 180)) : 0;

  let deflection = 0;
  if (parse(bModulus) > 0 && parse(bInertia) > 0) {
    const L3 = Math.pow(parse(bSpan), 3);
    if (bDist === 'center') {
      deflection = (parse(bLoad) * L3) / (48 * parse(bModulus) * parse(bInertia));
    } else {
      deflection = (5 * parse(bLoad) * L3) / (384 * parse(bModulus) * parse(bInertia));
    }
  }

  const hArea = Math.PI * Math.pow(parse(hBore) / 2, 2);
  const hForce = parse(hPsi) * hArea;

  const mVol = parse(mL) * parse(mW) * parse(mH);
  const mWeight = mVol * parse(mDensity);

  // --- STYLES ---
  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.05em', marginTop: '4px' };
  const labelStyle = { fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate('/')}>Hub</button>
        <h2>Engineering & Mechanics</h2>
      </header>

      {/* TOP TABS */}
      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Torque', 'Rigging', 'Beam', 'Hydraulic', 'Material', 'Guide'].map(tab => {
          let activeColor = '#fff';
          if (tab === 'Torque') activeColor = '#00ffff';
          if (tab === 'Rigging') activeColor = '#ef4444';
          if (tab === 'Beam') activeColor = '#00cc66';
          if (tab === 'Hydraulic') activeColor = '#3b82f6';
          if (tab === 'Material') activeColor = '#f59e0b';
          if (tab === 'Guide') activeColor = '#a855f7';

          return (
            <button 
              key={tab} onClick={() => setActiveTab(tab)}
              style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: activeTab === tab ? activeColor : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>
              {tab}
            </button>
          )
        })}
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '95px' }}>
        
        {/* ========================================== */}
        {/* TAB 1: TORQUE                              */}
        {/* ========================================== */}
        {activeTab === 'Torque' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #00ffff' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#00ffff', textAlign: 'center' }}>🔧 Torque & Leverage</h3>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#00ffff'}}>Force (lbs)<input type="number" placeholder="e.g. 150" value={tForce} onChange={e=>setTForce(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#00ffff'}}>Lever Arm (ft)<input type="number" placeholder="e.g. 5" value={tLever} onChange={e=>setTLever(e.target.value)} style={inputStyle} /></label></div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{...labelStyle, color: '#aaa'}}>Angle of Force (°)<input type="number" value={tAngle} onChange={e=>setTAngle(e.target.value)} style={inputStyle} /></label>
            </div>

            <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px', borderBottom: '1px dashed #333', paddingBottom: '10px' }}>
                <span>Mech. Advantage:</span> <span>{Math.sin(tRad).toFixed(2)}x</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#fff', fontSize: '1.2em' }}>Torque Gen:</strong>
                <strong style={{ color: '#f59e0b', fontSize: '1.4em' }}>{torqueGen.toFixed(0)} ft-lbs</strong>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: RIGGING                             */}
        {/* ========================================== */}
        {activeTab === 'Rigging' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#ef4444', textAlign: 'center' }}>🏗️ Rigging & Sling Tension</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{...labelStyle, color: '#ef4444'}}>Total Load Weight (lbs)<input type="number" placeholder="e.g. 5000" value={rLoad} onChange={e=>setRLoad(e.target.value)} style={{...inputStyle, borderColor: '#ef4444'}} /></label>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{...labelStyle, color: '#aaa'}}>Sling Legs</label>
                <select value={rLegs} onChange={e=>setRLegs(e.target.value)} style={inputStyle}>
                  <option value="1">1 Leg (Vertical)</option>
                  <option value="2">2 Legs</option>
                  <option value="3">3 Legs</option>
                  <option value="4">4 Legs</option>
                </select>
              </div>
              <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#aaa'}}>Angle (Horizontal)<input type="number" value={rAngle} onChange={e=>setRAngle(e.target.value)} style={inputStyle} /></label></div>
            </div>

            <div style={{ background: '#000', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #222' }}>
              <strong style={{ color: '#fff', fontSize: '1.2em' }}>Tension Per Leg:</strong>
              <strong style={{ color: '#ef4444', fontSize: '1.4em' }}>{tensionPerLeg.toFixed(0)} lbs</strong>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: BEAM DEFLECTION                     */}
        {/* ========================================== */}
        {activeTab === 'Beam' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #00cc66' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#00cc66', textAlign: 'center' }}>🏢 Structural Beam Deflection</h3>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#00cc66'}}>Total Load (lbs)<input type="number" placeholder="e.g. 10000" value={bLoad} onChange={e=>setBLoad(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#aaa'}}>Span (Inches)<input type="number" placeholder="e.g. 120" value={bSpan} onChange={e=>setBSpan(e.target.value)} style={inputStyle} /></label></div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{...labelStyle, color: '#aaa'}}>Material Modulus (E)</label>
                <select value={bModulus} onChange={e=>setBModulus(e.target.value)} style={inputStyle}>
                  <option value="29000000">Steel (29M psi)</option>
                  <option value="10000000">Aluminum (10M psi)</option>
                  <option value="1500000">Wood (1.5M psi)</option>
                </select>
              </div>
              <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#aaa'}}>Moment of Inertia (I)<input type="number" placeholder="in⁴" value={bInertia} onChange={e=>setBInertia(e.target.value)} style={inputStyle} /></label></div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{...labelStyle, color: '#aaa'}}>Load Distribution</label>
              <select value={bDist} onChange={e=>setBDist(e.target.value)} style={inputStyle}>
                <option value="center">Center Point Load</option>
                <option value="uniform">Uniformly Distributed Load</option>
              </select>
            </div>

            <div style={{ background: '#000', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #222' }}>
              <strong style={{ color: '#fff', fontSize: '1.2em' }}>Max Deflection:</strong>
              <strong style={{ color: '#00cc66', fontSize: '1.4em' }}>{deflection.toFixed(4)}"</strong>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: HYDRAULIC                           */}
        {/* ========================================== */}
        {activeTab === 'Hydraulic' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#3b82f6', textAlign: 'center' }}>🚜 Hydraulic Cylinder Force</h3>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#00ffff'}}>Pressure (PSI)<input type="number" placeholder="e.g. 2500" value={hPsi} onChange={e=>setHPsi(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#aaa'}}>Bore Diameter (in)<input type="number" placeholder="e.g. 3" value={hBore} onChange={e=>setHBore(e.target.value)} style={inputStyle} /></label></div>
            </div>

            <div style={{ background: '#000', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #222' }}>
              <strong style={{ color: '#fff', fontSize: '1.2em' }}>Push Force:</strong>
              <strong style={{ color: '#00ffff', fontSize: '1.4em' }}>{hForce.toFixed(0)} lbs</strong>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 5: MATERIAL                            */}
        {/* ========================================== */}
        {activeTab === 'Material' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#f59e0b', textAlign: 'center' }}>📦 Material Weight Limits</h3>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#00ffff'}}>L (ft)<input type="number" placeholder="0" value={mL} onChange={e=>setML(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#00ffff'}}>W (ft)<input type="number" placeholder="0" value={mW} onChange={e=>setMW(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#00ffff'}}>H (ft)<input type="number" placeholder="0" value={mH} onChange={e=>setMH(e.target.value)} style={inputStyle} /></label></div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{...labelStyle, color: '#aaa'}}>Material Density (lbs/ft³)</label>
              <select value={mDensity} onChange={e=>setMDensity(e.target.value)} style={inputStyle}>
                <option value="490">Solid Steel (490)</option>
                <option value="170">Aluminum (170)</option>
                <option value="150">Concrete (150)</option>
                <option value="62.4">Water (62.4)</option>
                <option value="45">Wood - Oak (45)</option>
              </select>
            </div>

            <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px', borderBottom: '1px dashed #333', paddingBottom: '10px' }}>
                <span>Total Volume:</span> <span>{mVol.toFixed(2)} ft³</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#fff', fontSize: '1.2em' }}>Est. Weight:</strong>
                <strong style={{ color: '#00cc66', fontSize: '1.4em' }}>{mWeight.toFixed(0)} lbs</strong>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 6: THE GUIDE                           */}
        {/* ========================================== */}
        {activeTab === 'Guide' && (
          <>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {['Pro Tips', 'Compliance & Fees', 'Info'].map(sub => (
                <button
                  key={sub} onClick={() => setGuideTab(sub)}
                  style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', fontSize: '0.85em', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: guideTab === sub ? 'rgba(168, 85, 247, 0.2)' : '#151515', color: guideTab === sub ? '#a855f7' : '#888', border: guideTab === sub ? '1px solid #a855f7' : '1px solid #222' }}>
                  {sub}
                </button>
              ))}
            </div>

            {guideTab === 'Pro Tips' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#ef4444' }}>The 30-Degree Rigging Danger Rule</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>
                    If your sling angle drops to 30 degrees from horizontal, the tension on EACH leg equals the TOTAL weight of the load. At 15 degrees, tension is double the load. <strong>Never rig below 30°!</strong>
                  </p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00ffff' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#00ffff' }}>Safety Factors (Working Load Limit)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>
                    Never load hardware to its breaking strength. General industry standard uses a <strong>5:1 Safety Factor</strong> (e.g., a cable breaking at 10,000 lbs has a working limit of 2,000 lbs). Lifting human personnel requires a strict <strong>10:1 Safety Factor</strong>.
                  </p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#00cc66' }}>Torque Wrench Extensions (Crowfoots)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>
                    If you add a crowfoot or extension to a torque wrench that increases its overall length, it acts as a longer lever arm. Your wrench will click *before* you reach the actual applied torque on the bolt. If the extension is placed at a 90° angle to the wrench head, it does not change the torque value.
                  </p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#f59e0b' }}>Quick Steel Weight Estimate</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>
                    Steel weighs roughly 490 lbs per cubic foot. For quick plate math in the field: A 1 sq ft piece of 1-inch thick solid steel plate weighs exactly <strong>40.8 lbs</strong>.
                  </p>
                </div>
              </div>
            )}

            {guideTab === 'Compliance & Fees' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#3b82f6' }}>PE Stamping & Structural Permits</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>
                    If you are building custom shop hoists, mezzanines, or modifying structural building members, municipal codes require a licensed Professional Engineer (PE) to review and stamp your drawings. <br/><br/>
                    <strong>Expected Fees:</strong> PE stamping usually runs between <strong>$500 to $2,500+</strong> depending on the state, liability risk, and complexity of the structural math. Un-permitted structural builds can void commercial insurance policies.
                  </p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00ffff' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#00ffff' }}>OSHA & ASME Rigging Standards</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>
                    <strong>OSHA 1926.251:</strong> Dictates that custom, field-fabricated rigging equipment (like spreader bars or hooks) must be proof-tested to <strong>125% of their Safe Working Load (SWL)</strong> before being put into service.<br/><br/>
                    <strong>ASME B30:</strong> The overarching safety standard for cables, cranes, hoists, and hooks. All purchased hardware should be ASME B30 compliant and stamped with a visible WLL.
                  </p>
                </div>
                <div style={{ ...cardStyle, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.5)', borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>⚠️ Liability & Safety Disclaimer</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.5' }}>
                    Calculations in this application are strictly for theoretical estimation. They do not account for dynamic loading, material fatigue, weld quality, or environmental factors. <strong>Do not use these tools as a substitute for professional engineering.</strong> The developer assumes absolutely zero liability for property damage, injury, or loss of life resulting from the use of this utility.
                  </p>
                </div>
              </div>
            )}

            {guideTab === 'Info' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00ffff' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#00ffff' }}>Torque & Leverage</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>
                    Calculates rotational force. Maximum mechanical advantage is achieved at exactly a 90° angle of force. As the angle deviates from 90°, the effective lever arm decreases.
                  </p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#ef4444' }}>Rigging Tension</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>
                    Calculates the actual load experienced by each leg of a sling. The lower the horizontal angle, the exponentially higher the tension. A 90° vertical lift shares the weight perfectly.
                  </p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#00cc66' }}>Beam Deflection</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>
                    Estimates the physical bend of a structural member under load based on material stiffness (Modulus of Elasticity, E) and cross-sectional shape (Moment of Inertia, I).
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
