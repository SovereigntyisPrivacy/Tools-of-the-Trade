import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ShootingCalc() {
  const navigate = useNavigate();

  const [weight, setWeight] = useState('168'); 
  const [velocity, setVelocity] = useState('2600'); 
  const [bc, setBc] = useState('0.462'); 

  const [distance, setDistance] = useState('1000'); 
  const [altitude, setAltitude] = useState('2400'); 
  const [temp, setTemp] = useState('90'); 
  const [windSpeed, setWindSpeed] = useState('10'); 

  const m = parseFloat(weight) || 0;
  const v0 = parseFloat(velocity) || 0;
  const c = parseFloat(bc) || 0.1;
  const distYards = parseFloat(distance) || 0;
  const distFeet = distYards * 3;
  const windMph = parseFloat(windSpeed) || 0;

  const muzzleEnergy = (m * Math.pow(v0, 2)) / 450240;
  const altModifier = 1 + ((parseFloat(altitude) || 0) / 100000); 
  const effectiveBc = c * altModifier;
  const vTarget = v0 * Math.exp(-distFeet / (28000 * effectiveBc));
  
  const averageVelocity = (v0 + vTarget) / 2;
  const timeOfFlight = averageVelocity > 0 ? distFeet / averageVelocity : 0;
  
  const dropFeet = 0.5 * 32.174 * Math.pow(timeOfFlight, 2);
  const dropInches = dropFeet * 12;
  const moaDrop = distYards > 0 ? dropInches / (distYards / 100) / 1.047 : 0;
  
  const windDriftInches = windMph * timeOfFlight * 12 * 0.15; 
  const moaWind = distYards > 0 ? windDriftInches / (distYards / 100) / 1.047 : 0;
  const targetEnergy = (m * Math.pow(vTarget, 2)) / 450240;

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Shooting Range</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        <div className="input-card" style={{ borderTop: '4px solid #ff4444' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>🎯 Load Specifications</h3>
          
          <label>Bullet Weight (gr)</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} style={{ marginBottom: '15px' }} />
          
          <label>Muzzle Velocity (fps)</label>
          <input type="number" value={velocity} onChange={(e) => setVelocity(e.target.value)} style={{ marginBottom: '15px' }} />
          
          <label>Ballistic Coefficient (BC)</label>
          <input type="number" value={bc} onChange={(e) => setBc(e.target.value)} />
        </div>

        <div className="input-card" style={{ borderTop: '4px solid #00ffff' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>🌍 Atmosphere & Target</h3>
          
          <label>Distance (Yards)</label>
          <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} style={{ marginBottom: '15px' }} />
          
          <label>Wind Speed (mph)</label>
          <input type="number" value={windSpeed} onChange={(e) => setWindSpeed(e.target.value)} style={{ marginBottom: '15px' }} />
          
          <label>Altitude (ft)</label>
          <input type="number" value={altitude} onChange={(e) => setAltitude(e.target.value)} style={{ marginBottom: '15px' }} />
          
          <label>Temp (°F)</label>
          <input type="number" value={temp} onChange={(e) => setTemp(e.target.value)} />
        </div>

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
