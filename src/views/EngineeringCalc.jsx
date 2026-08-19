import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EngineeringCalc() {
  const navigate = useNavigate();

  // 1. Torque & Leverage
  const [force, setForce] = useState('');
  const [leverLength, setLeverLength] = useState('5');
  const [forceAngle, setForceAngle] = useState('90');

  // 2. Rigging & Sling Tension
  const [loadWeight, setLoadWeight] = useState('');
  const [slingLegs, setSlingLegs] = useState('2');
  const [slingAngle, setSlingAngle] = useState('60'); // Degrees from horizontal

  // 3. Beam Deflection (Simply Supported)
  const [beamLoad, setBeamLoad] = useState(''); // lbs
  const [beamLength, setBeamLength] = useState(''); // inches
  const [modulusE, setModulusE] = useState('29000000'); // Steel default (psi)
  const [momentI, setMomentI] = useState(''); // in^4
  const [loadType, setLoadType] = useState('point'); // point vs uniform

  // 4. Hydraulic Force
  const [psi, setPsi] = useState('');
  const [boreDiameter, setBoreDiameter] = useState('');

  // 5. Material Weight Estimator
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [density, setDensity] = useState('490'); // Steel lbs/ft^3 default

  // --- Calculations ---

  // 1. Torque: T = F * r * sin(theta)
  let torque = 0;
  let mechAdvantage = 0;
  if (force && leverLength && forceAngle) {
    const r = parseFloat(leverLength);
    const f = parseFloat(force);
    const thetaRad = parseFloat(forceAngle) * (Math.PI / 180);
    torque = f * r * Math.sin(thetaRad);
    mechAdvantage = r * Math.sin(thetaRad); // Effective lever arm multiplier
  }

  // 2. Rigging Tension: Tension = Load / (Legs * sin(angle))
  let slingTension = 0;
  if (loadWeight && slingLegs && slingAngle) {
    const w = parseFloat(loadWeight);
    const legs = parseFloat(slingLegs);
    const angleRad = parseFloat(slingAngle) * (Math.PI / 180);
    if (angleRad > 0 && legs > 0) {
      slingTension = w / (legs * Math.sin(angleRad));
    }
  }

  // 3. Beam Deflection
  // Point Load: Deflection = (P * L^3) / (48 * E * I)
  // Uniform Load: Deflection = (5 * W * L^3) / (384 * E * I)
  let maxDeflection = 0;
  if (beamLoad && beamLength && modulusE && momentI) {
    const P = parseFloat(beamLoad);
    const L = parseFloat(beamLength);
    const E = parseFloat(modulusE);
    const I = parseFloat(momentI);
    
    if (E > 0 && I > 0) {
      if (loadType === 'point') {
        maxDeflection = (P * Math.pow(L, 3)) / (48 * E * I);
      } else {
        maxDeflection = (5 * P * Math.pow(L, 3)) / (384 * E * I);
      }
    }
  }

  // 4. Hydraulic Force: F = P * Area -> Area = PI * (D/2)^2
  let hydraulicForce = 0;
  if (psi && boreDiameter) {
    const p = parseFloat(psi);
    const r = parseFloat(boreDiameter) / 2;
    const area = Math.PI * Math.pow(r, 2);
    hydraulicForce = p * area;
  }

  // 5. Material Weight
  let volume = 0;
  let estWeight = 0;
  if (length && width && height && density) {
    volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
    estWeight = volume * parseFloat(density);
  }

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Engineering & Mechanics</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* 1. Torque & Leverage */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ffaa00', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🔧 Torque & Leverage</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Force (lbs)</label>
              <input type="number" placeholder="e.g. 150" value={force} onChange={e => setForce(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Lever Arm (ft)</label>
              <input type="number" placeholder="e.g. 5" value={leverLength} onChange={e => setLeverLength(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Angle of Force (°)</label>
          <input type="number" placeholder="90" value={forceAngle} onChange={e => setForceAngle(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}>
              <span style={{ color: '#aaa' }}>Mech. Advantage:</span>
              <span style={{ color: '#00ffff', fontWeight: 'bold' }}>{mechAdvantage.toFixed(2)}x</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', paddingTop: '8px', borderTop: '1px dashed #333' }}>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>Torque Gen:</span>
              <span style={{ color: '#ffaa00', fontWeight: 'bold' }}>{torque.toFixed(0)} ft-lbs</span>
            </div>
          </div>
        </div>

        {/* 2. Rigging & Sling Tension */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ff4444', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🏗️ Rigging & Sling Tension</h3>
          
          <label style={{ display: 'block', color: '#ff4444', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '4px' }}>Total Load Weight (lbs)</label>
          <input type="number" placeholder="e.g. 5000" value={loadWeight} onChange={e => setLoadWeight(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '10px' }} />
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Sling Legs</label>
              <select value={slingLegs} onChange={e => setSlingLegs(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}>
                <option value="1">1 Leg (Vertical)</option>
                <option value="2">2 Legs</option>
                <option value="3">3 Legs</option>
                <option value="4">4 Legs</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Angle (Horizontal)</label>
              <input type="number" placeholder="60" value={slingAngle} onChange={e => setSlingAngle(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Tension Per Leg:</span>
            <span style={{ color: '#ff4444', fontWeight: 'bold' }}>{slingTension.toFixed(0)} lbs</span>
          </div>
          {slingAngle < 45 && slingAngle > 0 && (
            <div style={{ color: '#ff4444', fontSize: '0.85em', marginTop: '8px', textAlign: 'center' }}>⚠️ WARNING: Shallow angles heavily multiply tension.</div>
          )}
        </div>

        {/* 3. Beam Deflection */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🏢 Structural Beam Deflection</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00cc66', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Total Load (lbs)</label>
              <input type="number" placeholder="10000" value={beamLoad} onChange={e => setBeamLoad(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Span (Inches)</label>
              <input type="number" placeholder="e.g. 120" value={beamLength} onChange={e => setBeamLength(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Material Modulus (E)</label>
              <select value={modulusE} onChange={e => setModulusE(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}>
                <option value="29000000">Steel (29M psi)</option>
                <option value="10000000">Aluminum (10M psi)</option>
                <option value="1500000">Wood / Timber (1.5M psi)</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Moment of Inertia (I)</label>
              <input type="number" placeholder="in⁴" value={momentI} onChange={e => setMomentI(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>
          
          <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Load Distribution</label>
          <select value={loadType} onChange={e => setLoadType(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px' }}>
            <option value="point">Center Point Load</option>
            <option value="uniform">Uniformly Distributed Load</option>
          </select>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Max Deflection:</span>
            <span style={{ color: '#00cc66', fontWeight: 'bold' }}>{maxDeflection.toFixed(4)}"</span>
          </div>
        </div>

        {/* 4. Hydraulics */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00ffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🚜 Hydraulic Cylinder Force</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Pressure (PSI)</label>
              <input type="number" placeholder="e.g. 2500" value={psi} onChange={e => setPsi(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Bore Diameter (in)</label>
              <input type="number" placeholder="e.g. 3" value={boreDiameter} onChange={e => setBoreDiameter(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Push Force:</span>
            <span style={{ color: '#00ffff', fontWeight: 'bold' }}>{hydraulicForce.toFixed(0)} lbs</span>
          </div>
        </div>

        {/* 5. Material Density Estimator */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #cc6600', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>📦 Material Weight Limits</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px' }}>L (ft)</label>
              <input type="number" placeholder="0" value={length} onChange={e => setLength(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px' }}>W (ft)</label>
              <input type="number" placeholder="0" value={width} onChange={e => setWidth(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px' }}>H (ft)</label>
              <input type="number" placeholder="0" value={height} onChange={e => setHeight(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Material Density (lbs/ft³)</label>
          <select value={density} onChange={e => setDensity(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px' }}>
            <option value="490">Solid Steel (490)</option>
            <option value="150">Concrete (150)</option>
            <option value="62.4">Water (62.4)</option>
            <option value="45">Hardwood / Oak (45)</option>
            <option value="110">Gravel / Sand (110)</option>
          </select>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}>
              <span style={{ color: '#aaa' }}>Total Volume:</span>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>{volume.toFixed(2)} ft³</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', paddingTop: '8px', borderTop: '1px dashed #333' }}>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>Est. Weight:</span>
              <span style={{ color: '#00cc66', fontWeight: 'bold' }}>{estWeight.toFixed(0)} lbs</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default EngineeringCalc;
