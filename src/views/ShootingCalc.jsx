import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ShootingCalc() {
  const navigate = useNavigate();

  // --- Load Specifications ---
  const [weight, setWeight] = useState('168'); // Grains
  const [velocity, setVelocity] = useState('2600'); // FPS
  const [bc, setBc] = useState('0.462'); // Ballistic Coefficient (G1)

  // --- Environmental & Target ---
  const [distance, setDistance] = useState('1000'); // Yards
  const [altitude, setAltitude] = useState('2400'); // Feet
  const [temp, setTemp] = useState('90'); // Fahrenheit
  const [windSpeed, setWindSpeed] = useState('10'); // MPH

  // --- Physics Math ---
  const m = parseFloat(weight) || 0;
  const v0 = parseFloat(velocity) || 0;
  const c = parseFloat(bc) || 0.1;
  const distYards = parseFloat(distance) || 0;
  const distFeet = distYards * 3;
  const windMph = parseFloat(windSpeed) || 0;

  // 1. Muzzle Energy (Foot-Pounds of Energy)
  const muzzleEnergy = (m * Math.pow(v0, 2)) / 450240;

  // 2. Velocity Decay (Rough empirical approximation via BC and Altitude)
  // Higher altitude = thinner air = less velocity lost
  const altModifier = 1 + ((parseFloat(altitude) || 0) / 100000); 
  const effectiveBc = c * altModifier;
  
  // Velocity at target
  const vTarget = v0 * Math.exp(-distFeet / (28000 * effectiveBc));

  // 3. Time of Flight (seconds)
  const averageVelocity = (v0 + vTarget) / 2;
  const timeOfFlight = averageVelocity > 0 ? distFeet / averageVelocity : 0;

  // 4. Bullet Drop (Gravity = 32.174 ft/s^2)
  const dropFeet = 0.5 * 32.174 * Math.pow(timeOfFlight, 2);
  const dropInches = dropFeet * 12;

  // 5. MOA Conversion (1 MOA ~ 1.047 inches per 100 yards)
  const moaDrop = distYards > 0 ? dropInches / (distYards / 100) / 1.047 : 0;

  // 6. Rough Wind Drift (inches)
  const windDriftInches = windMph * timeOfFlight * 12 * 0.15; // Simplified wind deflection
  const moaWind = distYards > 0 ? windDriftInches / (distYards / 100) / 1.047 : 0;

  // 7. Energy at Target
  const targetEnergy = (m * Math.pow(vTarget, 2)) / 450240;

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Shooting Range</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* Load Specs */}
        <div className="input-card" style={{ borderTop: '4px solid #ff4444' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>🎯 Load Specifications</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label>Bullet Weight (gr)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div>
              <label>Muzzle Velocity (fps)</label>
              <input type="number" value={velocity} onChange={(e) => setVelocity(e.target.value)} />
            </div>
          </div>
          <label style={{ marginTop: '10px' }}>Ballistic Coefficient (BC)</label>
          <input type="number" value={bc} onChange={(e) => setBc(e.target.value)} />
        </div>

        {/* Environment & Target */}
        <div className="input-card" style={{ borderTop: '4px solid #00ffff' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>🌍 Atmosphere & Target</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label>Distance (Yards)</label>
              <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
            </div>
            <div>
              <label>Wind Speed (mph)</label>
              <input type="number" value={windSpeed} onChange={(e) => setWindSpeed(e.target.value)} />
            </div>
            <div>
              <label>Altitude (ft)</label>
              <input type="number" value={altitude} onChange={(e) => setAltitude(e.target.value)} />
            </div>
            <div>
              <label>Temp (°F)</label>
              <input type="number" value={temp} onChange={(e) => setTemp(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Firing Solution Readout */}
        <div className="result-card" style={{ marginTop: '20px', padding: '15px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px', textAlign: 'center', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Firing Solution</h3>
          
          <div className="result-row">
            <span>Muzzle Energy:</span>
            <span style={{ color: '#ffaa00' }}>{muzzleEnergy.toFixed(0)} ft-lbs</span>
          </div>
          <div className="result-row">
            <span>Terminal Velocity:</span>
            <span>{vTarget.toFixed(0)} fps</span>
          </div>
          <div className="result-row">
            <span>Terminal Energy:</span>
            <span style={{ color: '#ffaa00' }}>{targetEnergy.toFixed(0)} ft-lbs</span>
          </div>
          <div className="result-row">
            <span>Time of Flight:</span>
            <span>{timeOfFlight.toFixed(3)} sec</span>
          </div>

          <div style={{ height: '1px', background: '#444', margin: '15px 0' }}></div>

          <div className="result-row net-pay" style={{ margin: 0, fontSize: '1.2em' }}>
            <span>Elevation Drop:</span>
            <span style={{ color: '#ff4444' }}>{dropInches.toFixed(1)}" ({moaDrop.toFixed(1)} MOA)</span>
          </div>
          <div className="result-row net-pay" style={{ margin: '10px 0 0 0', fontSize: '1.2em' }}>
            <span>Windage Drift:</span>
            <span style={{ color: '#00ffff' }}>{windDriftInches.toFixed(1)}" ({moaWind.toFixed(1)} MOA)</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ShootingCalc;
