import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ShootingCalc() {
  const navigate = useNavigate();

  // --- Weapon & Load State ---
  const [bulletGr, setBulletGr] = useState('168');
  const [muzzleFps, setMuzzleFps] = useState('2600');
  const [bc, setBc] = useState('0.462');
  const [zeroYds, setZeroYds] = useState('100');
  const [opticHt, setOpticHt] = useState('1.5');

  // --- Atmospherics State ---
  const [altitude, setAltitude] = useState('2400');
  const [tempF, setTempF] = useState('90');

  // --- Target Vector State ---
  const [targetYds, setTargetYds] = useState('1000');
  const [incline, setIncline] = useState('0');
  const [windMph, setWindMph] = useState('10');
  const [windAngle, setWindAngle] = useState('90'); // 90 = Full Value

  // --- Output State ---
  const [solution, setSolution] = useState({
    tof: 0,
    termVel: 0,
    muzEnergy: 0,
    termEnergy: 0,
    dropMil: 0,
    dropMoa: 0,
    dropIn: 0,
    windMil: 0,
    windMoa: 0,
    windIn: 0,
    adr: 1.0
  });

  // --- Ballistics Engine Logic ---
  useEffect(() => {
    // 1. Calculate Air Density Ratio (ADR)
    const alt = parseFloat(altitude) || 0;
    const tF = parseFloat(tempF) || 59;
    // Standard temp is 59F. Simplified density altitude math:
    const adr = Math.exp(-alt / 31500) * ((460 + 59) / (460 + tF));
    
    // 2. Parse Inputs
    const mFps = parseFloat(muzzleFps) || 0;
    const bGr = parseFloat(bulletGr) || 0;
    const g1 = parseFloat(bc) || 0.001;
    const distYds = parseFloat(targetYds) || 0;
    const wMph = parseFloat(windMph) || 0;
    const wAng = parseFloat(windAngle) || 0;
    const incDeg = parseFloat(incline) || 0;
    const optIn = parseFloat(opticHt) || 0;
    const zYds = parseFloat(zeroYds) || 100;

    if (mFps === 0 || bGr === 0 || distYds === 0) return;

    // 3. Energy Math
    const muzE = (bGr * Math.pow(mFps, 2)) / 450240;

    // 4. Simplified G1 Point Mass Iteration (Approximation for Field Use)
    // Adjust BC for air density
    const effectiveBc = g1 / adr;
    
    // Constant for G1 drag estimation
    const dragCoeff = 28500 * effectiveBc;
    
    // Distance in feet
    const distFt = distYds * 3;
    const zeroFt = zYds * 3;

    // Terminal Velocity (Approximation)
    const termV = mFps * Math.exp(-distFt / dragCoeff);
    const termE = (bGr * Math.pow(termV, 2)) / 450240;

    // Time of Flight (Approximation)
    const tof = (dragCoeff / mFps) * (Math.exp(distFt / dragCoeff) - 1);

    // Bullet Drop (Gravity = 32.174 ft/s^2)
    const dropFt = 0.5 * 32.174 * Math.pow(tof, 2);
    const dropInches = dropFt * 12;

    // Zeroing Offset (Calculate drop at zero range to find the bore angle)
    const zeroTof = (dragCoeff / mFps) * (Math.exp(zeroFt / dragCoeff) - 1);
    const zeroDropInches = (0.5 * 32.174 * Math.pow(zeroTof, 2)) * 12;
    const boreAngleMoa = ((zeroDropInches + optIn) / zYds) * 0.955; // 1 MOA = 1.047" at 100yds

    // Adjusted Drop for Distance & Incline
    const slantCos = Math.cos(incDeg * (Math.PI / 180));
    const totalDropInches = (dropInches * slantCos) - (boreAngleMoa * distYds * 1.047 / 100) + optIn;

    // Windage (Approximation using Time of Flight minus Vacuum Time)
    const vacTof = distFt / mFps;
    const windLag = tof - vacTof;
    const crossWindMph = wMph * Math.sin(wAng * (Math.PI / 180));
    const windFps = crossWindMph * 1.46667;
    const windDeflectFt = windFps * windLag;
    const windDeflectInches = Math.abs(windDeflectFt * 12);

    // Conversions
    const dropMoaCalc = totalDropInches / (distYds * 1.047 / 100);
    const dropMilCalc = dropMoaCalc / 3.438;

    const windMoaCalc = windDeflectInches / (distYds * 1.047 / 100);
    const windMilCalc = windMoaCalc / 3.438;

    setSolution({
      tof: tof.toFixed(3),
      termVel: Math.round(termV),
      muzEnergy: Math.round(muzE),
      termEnergy: Math.round(termE),
      dropIn: totalDropInches.toFixed(1),
      dropMoa: dropMoaCalc.toFixed(1),
      dropMil: dropMilCalc.toFixed(1),
      windIn: windDeflectInches.toFixed(1),
      windMoa: windMoaCalc.toFixed(1),
      windMil: windMilCalc.toFixed(1),
      adr: adr.toFixed(3)
    });

  }, [bulletGr, muzzleFps, bc, zeroYds, opticHt, altitude, tempF, targetYds, incline, windMph, windAngle]);

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Ballistics Engine</h2>
      </header>

      <div className="calc-content" style={{ padding: '16px', overflowY: 'auto', height: '100%', paddingBottom: '20px' }}>

        {/* --- Card 1: Weapon & Load --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #d00000', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem', textAlign: 'center' }}>🎯 Weapon & Load</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
            <div><label style={{ color: '#00e5ff', fontSize: '0.75rem', fontWeight: 'bold' }}>Bullet (gr)</label><input type="number" value={bulletGr} onChange={(e) => setBulletGr(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} /></div>
            <div><label style={{ color: '#00e5ff', fontSize: '0.75rem', fontWeight: 'bold' }}>Muzzle (fps)</label><input type="number" value={muzzleFps} onChange={(e) => setMuzzleFps(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} /></div>
            <div><label style={{ color: '#00e5ff', fontSize: '0.75rem', fontWeight: 'bold' }}>BC (G1)</label><input type="number" step="0.001" value={bc} onChange={(e) => setBc(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div><label style={{ color: '#aaa', fontSize: '0.75rem' }}>Zero Range (yds)</label><input type="number" value={zeroYds} onChange={(e) => setZeroYds(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} /></div>
            <div><label style={{ color: '#aaa', fontSize: '0.75rem' }}>Optic Height (in)</label><input type="number" step="0.1" value={opticHt} onChange={(e) => setOpticHt(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} /></div>
          </div>
        </div>

        {/* --- Card 2: Atmospherics --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #ffb703', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem', textAlign: 'center' }}>🌡️ Atmospherics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
            <div><label style={{ color: '#aaa', fontSize: '0.75rem', textAlign: 'center', display: 'block' }}>Altitude (ft)</label><input type="number" value={altitude} onChange={(e) => setAltitude(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} /></div>
            <div><label style={{ color: '#aaa', fontSize: '0.75rem', textAlign: 'center', display: 'block' }}>Temp (°F)</label><input type="number" value={tempF} onChange={(e) => setTempF(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} /></div>
          </div>
          <div style={{ textAlign: 'center', color: '#666', fontSize: '0.75rem' }}>Air Density Factor: {solution.adr} (1.0 = Sea Level)</div>
        </div>

        {/* --- Card 3: Target Vector --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #00e5ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem', textAlign: 'center' }}>🌍 Target Vector</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div><label style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: 'bold' }}>Distance (Yards)</label><input type="number" value={targetYds} onChange={(e) => setTargetYds(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #00e5ff', color: '#fff', padding: '10px', borderRadius: '8px' }} /></div>
            <div><label style={{ color: '#aaa', fontSize: '0.8rem' }}>Incline (°)</label><input type="number" value={incline} onChange={(e) => setIncline(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div><label style={{ color: '#aaa', fontSize: '0.75rem' }}>Wind Spd (mph)</label><input type="number" value={windMph} onChange={(e) => setWindMph(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} /></div>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.75rem' }}>Wind Angle (°)</label>
              <select value={windAngle} onChange={(e) => setWindAngle(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }}>
                <option value="90">90° (Full Value)</option>
                <option value="45">45° (Half Value)</option>
                <option value="30">30° (Low Value)</option>
                <option value="0">0° (Head/Tail Wind)</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- Card 4: Firing Solution --- */}
        <div style={{ background: '#0a0a0a', border: '2px solid #00e5ff', borderRadius: '12px', padding: '16px', marginBottom: '20px', boxShadow: '0 0 15px rgba(0,229,255,0.1)' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '2px' }}>FIRING SOLUTION</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#aaa' }}>Time of Flight:</span><span style={{ color: '#fff', fontWeight: 'bold' }}>{solution.tof} sec</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#aaa' }}>Term. Velocity:</span><span style={{ color: '#fff', fontWeight: 'bold' }}>{solution.termVel} fps</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#aaa' }}>Muzzle Energy:</span><span style={{ color: '#ffb703', fontWeight: 'bold' }}>{solution.muzEnergy} ft-lbs</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}><span style={{ color: '#aaa' }}>Term. Energy:</span><span style={{ color: '#ffb703', fontWeight: 'bold' }}>{solution.termEnergy} ft-lbs</span></div>

          <div style={{ background: '#121212', border: '1px solid #333', borderRadius: '8px', padding: '14px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: '900', fontSize: '1.1rem', letterSpacing: '1px' }}>ELEVATION:</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#d00000', fontWeight: '900', fontSize: '1.4rem' }}>{solution.dropMil} MIL</div>
                <div style={{ color: '#aaa', fontSize: '0.8rem' }}>{solution.dropMoa} MOA ({solution.dropIn}")</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#121212', border: '1px solid #333', borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: '900', fontSize: '1.1rem', letterSpacing: '1px' }}>WINDAGE:</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#00e5ff', fontWeight: '900', fontSize: '1.4rem' }}>{solution.windMil} MIL</div>
                <div style={{ color: '#aaa', fontSize: '0.8rem' }}>{solution.windMoa} MOA ({solution.windIn}")</div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Card 5: Layman's Educational Guide --- */}
        <div style={{ background: '#181818', borderLeft: '4px solid #a600ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>📖 Layman's Field Guide</h3>
          
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>MIL vs. MOA</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>They are just different units of measurement for angles (like Celsius vs Fahrenheit). <strong>1 MOA</strong> is roughly 1 inch at 100 yards. <strong>1 MIL</strong> is exactly 10 cm at 100 meters (or ~3.6 inches at 100 yards). Check your scope turrets to see which one you have.</p>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>The Wind Clock</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>Wind blowing directly across your face (3 or 9 o'clock) pushes the bullet the hardest (<strong>Full Value / 90°</strong>). Wind blowing diagonally (like 2 o'clock) is <strong>Half Value</strong>. Wind blowing straight at your face or back (12 or 6 o'clock) does not push the bullet left or right at all.</p>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>Atmospherics & Thin Air</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>Bullets are lazy. They fly faster and drop less in "thin" air. For example, hot summer air at a high altitude in Arizona has very low density, meaning your bullet will hit much higher on the target than it would on a freezing, sea-level day.</p>
          </div>

          <div>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>Angles & Gravity</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>Whether you are shooting steeply UPHILL or DOWNHILL, you must aim lower than you think. Gravity only affects the bullet over the flat horizontal distance, not the angled distance.</p>
          </div>
        </div>

        {/* --- Card 6: Safety Disclaimer --- */}
        <div style={{ background: '#220000', border: '1px solid #d00000', borderRadius: '8px', padding: '16px' }}>
          <div style={{ color: '#ff4444', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '6px', textAlign: 'center' }}>⚠️ CRITICAL DISCLAIMER</div>
          <p style={{ color: '#ffaaaa', fontSize: '0.75rem', margin: '0', lineHeight: '1.5', textAlign: 'justify' }}>
            This engine utilizes a standardized G1 point-mass mathematical model. It is designed for educational, theoretical, and estimation purposes only. Real-world ballistics are deeply affected by barrel harmonics, ammunition lot variance, spin drift, aerodynamic jump, Coriolis effect, and shifting micro-climates. <strong>NEVER</strong> rely solely on a digital calculator for an ethical or critical shot. ALWAYS true your DOPE (Data on Previous Engagements) physically on the range.
          </p>
        </div>

      </div>
    </div>
  );
}

export default ShootingCalc;
