import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NuclearCalc() {
  const navigate = useNavigate();

  // 1. Isotope Decay State
  const [initQty, setInitQty] = useState('');
  const [halfLife, setHalfLife] = useState('');
  const [timeElapsed, setTimeElapsed] = useState('');

  // 2. Point Source Dosimetry State
  const [sourceActivity, setSourceActivity] = useState(''); // Curies (Ci)
  const [gammaConstant, setGammaConstant] = useState('1.32'); // R·m²/hr·Ci
  const [distance, setDistance] = useState(''); // Meters

  // 3. Shielding & Attenuation State
  const [initDose, setInitDose] = useState('');
  const [hvl, setHvl] = useState('');
  const [thickness, setThickness] = useState('');
  const [buildupFactor, setBuildupFactor] = useState('1.0'); // Account for Compton scattering

  // 4. ALARA Stay Time State
  const [workAreaDose, setWorkAreaDose] = useState(''); // mR/hr
  const [doseLimit, setDoseLimit] = useState(''); // mR

  // --- Physics Calculations ---

  // 1. Exponential Decay: N(t) = N0 * e^(-(ln(2)/t_half) * t)
  let remainingQty = 0;
  let decayedPercent = 0;
  if (initQty && halfLife && timeElapsed) {
    const n0 = parseFloat(initQty);
    const thalf = parseFloat(halfLife);
    const t = parseFloat(timeElapsed);
    const decayConstant = Math.LN2 / thalf;
    remainingQty = n0 * Math.exp(-decayConstant * t);
    decayedPercent = ((n0 - remainingQty) / n0) * 100;
  }

  // 2. Point Source Inverse Square: Dose = (Gamma * Activity) / Distance^2
  let pointDoseRate = 0;
  if (sourceActivity && gammaConstant && distance) {
    const act = parseFloat(sourceActivity);
    const gamma = parseFloat(gammaConstant);
    const d = parseFloat(distance);
    if (d > 0) {
      pointDoseRate = (gamma * act) / Math.pow(d, 2); // Result in Rem/hr
    }
  }

  // 3. Shielding with Buildup: I = I0 * B * (0.5)^(x/HVL)
  let transmittedDose = 0;
  let attenuationPercent = 0;
  if (initDose && hvl && thickness) {
    const i0 = parseFloat(initDose);
    const h = parseFloat(hvl);
    const x = parseFloat(thickness);
    const b = parseFloat(buildupFactor) || 1.0;
    
    if (h > 0) {
      transmittedDose = i0 * b * Math.pow(0.5, x / h); 
      attenuationPercent = ((i0 - transmittedDose) / i0) * 100;
    }
  }

  // 4. Stay Time: Time = Limit / Rate
  let stayTimeHours = 0;
  let stayTimeMinutes = 0;
  if (workAreaDose && doseLimit) {
    const rate = parseFloat(workAreaDose);
    const limit = parseFloat(doseLimit);
    if (rate > 0) {
      stayTimeHours = limit / rate;
      stayTimeMinutes = stayTimeHours * 60;
    }
  }

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Health Physics & Nuclear</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* 1. Point Source Dosimetry */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ff4444', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>☢️ Gamma Point Source</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#ff4444', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Activity (Curies)</label>
              <input type="number" placeholder="e.g. 10" value={sourceActivity} onChange={e => setSourceActivity(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Distance (Meters)</label>
              <input type="number" placeholder="e.g. 2" value={distance} onChange={e => setDistance(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Isotope Gamma Constant (Γ)</label>
          <select value={gammaConstant} onChange={e => setGammaConstant(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px', fontSize: '1em' }}>
            <optgroup label="Industrial & Radiography">
              <option value="1.32">Cobalt-60 (1.32)</option>
              <option value="0.33">Cesium-137 (0.33)</option>
              <option value="0.48">Iridium-192 (0.48)</option>
              <option value="0.825">Radium-226 (0.825)</option>
              <option value="0.27">Zinc-65 (0.27)</option>
              <option value="1.84">Sodium-24 (1.84)</option>
            </optgroup>
            <optgroup label="Medical & Diagnostic">
              <option value="0.22">Iodine-131 (0.22)</option>
              <option value="0.072">Technetium-99m (0.072)</option>
              <option value="0.57">Fluorine-18 (0.57)</option>
              <option value="0.23">Gold-198 (0.23)</option>
              <option value="0.015">Xenon-133 (0.015)</option>
              <option value="0.20">Selenium-75 (0.20)</option>
            </optgroup>
            <optgroup label="Smoke Detectors & Special">
              <option value="0.015">Americium-241 (0.015)</option>
            </optgroup>
          </select>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Unshielded Dose:</span>
            <span style={{ color: '#ff4444', fontWeight: 'bold' }}>{pointDoseRate.toFixed(3)} Rem/hr</span>
          </div>
        </div>

        {/* 2. Shielding & Attenuation */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00ffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🛡️ Shielding (Buildup Factor)</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Init. Dose Rate</label>
              <input type="number" placeholder="500" value={initDose} onChange={e => setInitDose(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>HVL Thickness</label>
              <input type="number" placeholder="0.4" value={hvl} onChange={e => setHvl(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Actual Shield Thk.</label>
              <input type="number" placeholder="Match HVL unit" value={thickness} onChange={e => setThickness(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#ffaa00', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Buildup Factor (B)</label>
              <input type="number" placeholder="1.0" value={buildupFactor} onChange={e => setBuildupFactor(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}>
              <span style={{ color: '#aaa' }}>Transmitted Dose:</span>
              <span style={{ color: '#00ffff', fontWeight: 'bold' }}>{transmittedDose.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', paddingTop: '8px', borderTop: '1px dashed #333' }}>
              <span style={{ color: '#aaa' }}>Radiation Blocked:</span>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>{attenuationPercent.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* 3. ALARA Stay Time */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>⏱️ ALARA Stay Time</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Field Rate (mR/hr)</label>
              <input type="number" placeholder="e.g. 250" value={workAreaDose} onChange={e => setWorkAreaDose(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00cc66', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Dose Limit (mR)</label>
              <input type="number" placeholder="e.g. 50" value={doseLimit} onChange={e => setDoseLimit(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Max Stay Time:</span>
            <span style={{ color: '#00cc66', fontWeight: 'bold' }}>{stayTimeMinutes.toFixed(1)} Minutes</span>
          </div>
        </div>

        {/* 4. Isotope Decay Engine */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ffaa00', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>📉 Exponential Decay</h3>
          
          <label style={{ display: 'block', color: '#ffaa00', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '4px' }}>Initial Quantity (Mass / Activity)</label>
          <input type="number" placeholder="e.g. 100" value={initQty} onChange={e => setInitQty(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '10px' }} />
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Half-Life (t½)</label>
              <input type="number" placeholder="e.g. 5.27" value={halfLife} onChange={e => setHalfLife(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Time Elapsed</label>
              <input type="number" placeholder="Must match t½ unit" value={timeElapsed} onChange={e => setTimeElapsed(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}>
              <span style={{ color: '#aaa' }}>Remaining:</span>
              <span style={{ color: '#ffaa00', fontWeight: 'bold' }}>{remainingQty.toFixed(4)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', paddingTop: '8px', borderTop: '1px dashed #333' }}>
              <span style={{ color: '#aaa' }}>Total Decay:</span>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>{decayedPercent.toFixed(2)}%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default NuclearCalc;
