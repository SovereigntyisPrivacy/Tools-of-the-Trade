import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ShootingCalc() {
  const navigate = useNavigate();

  // Load Specs
  const [weight, setWeight] = useState('168');
  const [velocity, setVelocity] = useState('2600');
  const [bc, setBc] = useState('0.462'); 

  // Rifle Specs
  const [zeroRange, setZeroRange] = useState('100');
  const [sightHeight, setSightHeight] = useState('1.5');

  // Environment
  const [altitude, setAltitude] = useState('2400'); // feet
  const [temp, setTemp] = useState('90'); // Fahrenheit

  // Target & Wind
  const [distance, setDistance] = useState('1000'); // Line of Sight yards
  const [incline, setIncline] = useState('0'); // Degrees uphill/downhill
  const [windSpeed, setWindSpeed] = useState('10'); 
  const [windAngle, setWindAngle] = useState('90'); 

  const calculateBallistics = () => {
    const w = parseFloat(weight) || 0;
    const v0 = parseFloat(velocity) || 0;
    const baseBc = parseFloat(bc) || 0;
    const distYdsLoS = parseFloat(distance) || 0;
    const zRangeYds = parseFloat(zeroRange) || 100;
    const sHeight = parseFloat(sightHeight) || 0;
    const wSpeed = parseFloat(windSpeed) || 0;
    const wAngle = parseFloat(windAngle) || 0;
    const alt = parseFloat(altitude) || 0;
    const t = parseFloat(temp) || 59; // Standard temp is 59F
    const angleDeg = parseFloat(incline) || 0;

    if (!w || !v0 || !baseBc || !distYdsLoS) return null;

    // 1. Atmospherics (Density Altitude Adjustment)
    // Calculate air density factor relative to standard sea level (59F, 0ft)
    const tempRankine = t + 459.67;
    const standardRankine = 59 + 459.67;
    const pressureFactor = Math.exp(-alt / 31500); // Standard atmospheric decay
    const densityFactor = pressureFactor * (standardRankine / tempRankine);
    
    // Adjusted BC based on air density (thinner air = higher effective BC)
    const adjBc = baseBc / densityFactor;

    // 2. True Horizontal Range (Gravity only acts on horizontal distance)
    const angleRad = angleDeg * (Math.PI / 180);
    const distYdsHorizontal = distYdsLoS * Math.cos(angleRad);
    
    // 3. Velocity & Time of Flight (using LoS distance for flight time)
    const decayConstant = 28000 * adjBc; 
    const distFtLoS = distYdsLoS * 3;
    const vX = v0 * Math.exp(-distFtLoS / decayConstant);
    const tFlight = distFtLoS / ((v0 + vX) / 2);

    // 4. Energies
    const muzzleEnergy = (w * Math.pow(v0, 2)) / 450436;
    const terminalEnergy = (w * Math.pow(vX, 2)) / 450436;

    // 5. Gravity Drop (acting on Horizontal Time)
    const distFtHorizontal = distYdsHorizontal * 3;
    const vXHorizontal = v0 * Math.exp(-distFtHorizontal / decayConstant);
    const tFlightHorizontal = distFtHorizontal / ((v0 + vXHorizontal) / 2);
    
    const g = 32.174;
    const rawDropInches = (0.5 * g * Math.pow(tFlightHorizontal, 2)) * 12;

    // 6. Zero Range Compensation
    const zRangeFt = zRangeYds * 3;
    const vZ = v0 * Math.exp(-zRangeFt / decayConstant);
    const tZero = zRangeFt / ((v0 + vZ) / 2);
    const rawZeroDropInches = (0.5 * g * Math.pow(tZero, 2)) * 12;
    const boreAngleCorrection = (rawZeroDropInches + sHeight) / zRangeYds; 

    // 7. Actual Drop at Target
    const actualDropInches = rawDropInches - (boreAngleCorrection * distYdsHorizontal) - sHeight;

    // 8. Wind Drift (Using LoS Time of Flight)
    const windFps = wSpeed * 1.46667;
    const crossWindFps = windFps * Math.sin(wAngle * (Math.PI / 180));
    const tVacuum = distFtLoS / v0;
    const windDriftInches = 12 * crossWindFps * (tFlight - tVacuum);

    // 9. Turret Conversions based on Line of Sight distance to target
    const dropMOA = actualDropInches / (distYdsLoS * 0.01047);
    const dropMIL = actualDropInches / (distYdsLoS * 0.036);
    
    const windMOA = windDriftInches / (distYdsLoS * 0.01047);
    const windMIL = windDriftInches / (distYdsLoS * 0.036);

    return {
      muzzleEnergy: muzzleEnergy.toFixed(0),
      terminalVelocity: vX.toFixed(0),
      terminalEnergy: terminalEnergy.toFixed(0),
      timeOfFlight: tFlight.toFixed(3),
      dropInches: actualDropInches.toFixed(1),
      dropMOA: dropMOA.toFixed(1),
      dropMIL: dropMIL.toFixed(1),
      windInches: windDriftInches.toFixed(1),
      windMOA: windMOA.toFixed(1),
      windMIL: windMIL.toFixed(1),
      densityFactor: densityFactor.toFixed(3)
    };
  };

  const solution = calculateBallistics();

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Ballistics Engine</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* Load & Rifle */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ff4444', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🎯 Weapon & Load</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '4px' }}>Bullet (gr)</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '4px' }}>Muzzle (fps)</label>
              <input type="number" value={velocity} onChange={e => setVelocity(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '4px' }}>BC (G1)</label>
              <input type="number" value={bc} onChange={e => setBc(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Zero Range (yds)</label>
              <input type="number" value={zeroRange} onChange={e => setZeroRange(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Optic Height (in)</label>
              <input type="number" value={sightHeight} onChange={e => setSightHeight(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>
        </div>

        {/* Environment */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ffaa00', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🌡️ Atmospherics</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Altitude (ft)</label>
              <input type="number" value={altitude} onChange={e => setAltitude(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Temp (°F)</label>
              <input type="number" value={temp} onChange={e => setTemp(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>
          {solution && (
            <div style={{ marginTop: '10px', fontSize: '0.85em', color: '#888', textAlign: 'right' }}>
              Air Density Factor: {solution.densityFactor} (1.0 = Sea Level)
            </div>
          )}
        </div>

        {/* Target & Wind */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00ffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🌍 Target Vector</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', color: '#00ffff', fontWeight: 'bold', marginBottom: '8px' }}>Distance (Yards)</label>
              <input type="number" value={distance} onChange={e => setDistance(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #00ffff', color: '#fff', borderRadius: '8px', fontSize: '1.2em' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '8px' }}>Incline (°)</label>
              <input type="number" value={incline} onChange={e => setIncline(e.target.value)} placeholder="0" style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Wind Spd (mph)</label>
              <input type="number" value={windSpeed} onChange={e => setWindSpeed(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Wind Angle (°)</label>
              <select value={windAngle} onChange={e => setWindAngle(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}>
                <option value="90">90° (Full Value)</option>
                <option value="45">45° (Half Value)</option>
                <option value="0">0° (Head/Tail)</option>
              </select>
            </div>
          </div>
        </div>

        {/* HUD */}
        <div style={{ background: 'rgba(10,10,10,0.95)', border: '2px solid #00ffff', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0, 255, 255, 0.1)' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px', textAlign: 'center' }}>FIRING SOLUTION</h3>
          
          {solution ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '1.1em' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>Time of Flight:</span><span style={{ color: '#fff' }}>{solution.timeOfFlight} sec</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>Term. Velocity:</span><span style={{ color: '#fff' }}>{solution.terminalVelocity} fps</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>Muzzle Energy:</span><span style={{ color: '#ffaa00' }}>{solution.muzzleEnergy} ft-lbs</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>Term. Energy:</span><span style={{ color: '#ffaa00' }}>{solution.terminalEnergy} ft-lbs</span></div>
              </div>

              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #333' }}>
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2em' }}>ELEVATION:</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#ff4444', fontWeight: 'bold', fontSize: '1.3em' }}>{solution.dropMIL} MIL</div>
                    <div style={{ color: '#aaa', fontSize: '0.9em' }}>{solution.dropMOA} MOA ({solution.dropInches}")</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2em' }}>WINDAGE:</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#00ffff', fontWeight: 'bold', fontSize: '1.3em' }}>{solution.windMIL} MIL</div>
                    <div style={{ color: '#aaa', fontSize: '0.9em' }}>{solution.windMOA} MOA ({solution.windInches}")</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ color: '#ff4444', textAlign: 'center' }}>Invalid Load Data. Check parameters.</div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ShootingCalc;
