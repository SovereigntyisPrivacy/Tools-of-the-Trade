import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SolarCalc() {
  const navigate = useNavigate();
  
  const [dailyLoad, setDailyLoad] = useState(''); 
  const [sunHours, setSunHours] = useState('6.5');
  const [panelWatts, setPanelWatts] = useState('400');
  const [battVolts, setBattVolts] = useState('48');
  const [autonomy, setAutonomy] = useState('1');

  const numLoad = parseFloat(dailyLoad) || 0;
  const numSun = parseFloat(sunHours) || 0.1;
  const numPanel = parseFloat(panelWatts) || 1;
  const numVolts = parseFloat(battVolts) || 12;
  const numDays = parseFloat(autonomy) || 1;

  const requiredArrayWatts = (numLoad / numSun) / 0.8;
  const panelsNeeded = Math.ceil(requiredArrayWatts / numPanel);
  const requiredBatteryWh = (numLoad * numDays) / 0.8;
  const requiredBatteryAh = requiredBatteryWh / numVolts;

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Solar & Battery</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        <div className="input-card" style={{ borderTop: '4px solid #ffaa00' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>⚡ Power Requirements</h3>
          
          <label>Daily Power Consumption (Watt-hours)</label>
          <input type="number" placeholder="e.g. 2400" value={dailyLoad} onChange={(e) => setDailyLoad(e.target.value)} />
          
          <label>Days of Autonomy (No sun)</label>
          <input type="number" placeholder="1" value={autonomy} onChange={(e) => setAutonomy(e.target.value)} />
            
          <label>Peak Sun Hours</label>
          <input type="number" placeholder="6.5" value={sunHours} onChange={(e) => setSunHours(e.target.value)} />
        </div>

        <div className="input-card" style={{ borderTop: '4px solid #00ffff' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>⚙️ Hardware Specs</h3>
          
          <label>Panel Rating (Watts)</label>
          <input type="number" placeholder="400" value={panelWatts} onChange={(e) => setPanelWatts(e.target.value)} />
            
          <label>Battery Bank Voltage (V)</label>
          <input type="number" placeholder="48" value={battVolts} onChange={(e) => setBattVolts(e.target.value)} />
        </div>

        <div className="result-card" style={{ marginTop: '20px', padding: '15px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px', textAlign: 'center', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>System Build</h3>
          
          <div className="result-row">
            <span>Min. Array Size:</span>
            <span style={{ color: '#ffaa00' }}>{Math.ceil(requiredArrayWatts)} W</span>
          </div>
          <div className="result-row net-pay" style={{ margin: '5px 0 15px 0', fontSize: '1.2em' }}>
            <span>Panels Needed:</span>
            <span style={{ color: '#ffaa00' }}>{panelsNeeded}</span>
          </div>
          
          <div style={{ height: '1px', background: '#444', margin: '15px 0' }}></div>

          <div className="result-row">
            <span>Min. Battery (Wh):</span>
            <span style={{ color: '#00cc66' }}>{Math.ceil(requiredBatteryWh)} Wh</span>
          </div>
          <div className="result-row net-pay" style={{ margin: '5px 0 0 0', fontSize: '1.2em' }}>
            <span>Min. Capacity (Ah):</span>
            <span style={{ color: '#00cc66' }}>{Math.ceil(requiredBatteryAh)} Ah</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SolarCalc;
