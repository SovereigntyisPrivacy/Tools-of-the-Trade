import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SolarCalc() {
  const navigate = useNavigate();

  // Load & Environment
  const [dailyWh, setDailyWh] = useState('');
  const [autonomy, setAutonomy] = useState('1');
  const [sunHours, setSunHours] = useState('5.5');

  // Hardware Specs
  const [panelWatts, setPanelWatts] = useState('400');
  const [battVolts, setBattVolts] = useState('48');
  
  // Advanced Realsim Variables
  const [sysEfficiency, setSysEfficiency] = useState('0.75'); // 25% loss to heat/wiring
  const [battDoD, setBattDoD] = useState('0.85'); // Lithium 85%, Lead Acid 50%

  // --- Calculations ---
  let requiredArrayWatts = 0;
  let panelsNeeded = 0;
  let requiredBatteryWh = 0;
  let requiredBatteryAh = 0;
  let chargeControllerAmps = 0;

  if (dailyWh && sunHours && panelWatts && battVolts) {
    const safeDailyWh = parseFloat(dailyWh);
    const safeSun = parseFloat(sunHours);
    const safePanel = parseFloat(panelWatts);
    const safeVolts = parseFloat(battVolts);
    const safeAutonomy = parseFloat(autonomy);
    const eff = parseFloat(sysEfficiency);
    const dod = parseFloat(battDoD);

    // 1. Array Sizing (Daily Load replenished in one day, accounting for efficiency loss)
    requiredArrayWatts = (safeDailyWh / safeSun) / eff;
    panelsNeeded = Math.ceil(requiredArrayWatts / safePanel);

    // 2. Battery Sizing (Accounting for Days of Autonomy and Depth of Discharge)
    const rawBatteryWh = safeDailyWh * safeAutonomy;
    requiredBatteryWh = rawBatteryWh / dod; // True battery size needed so we don't drain past safe limits
    requiredBatteryAh = requiredBatteryWh / safeVolts;

    // 3. MPPT Charge Controller Sizing (Total Panel Wattage / Battery Voltage * 1.25 NEC Safety Factor)
    const actualInstalledWatts = panelsNeeded * safePanel;
    chargeControllerAmps = (actualInstalledWatts / safeVolts) * 1.25;
  }

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Solar & Battery Architect</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* Load & Environment */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ffaa00', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>⚡ Load & Environment</h3>
          
          <label style={{ display: 'block', color: '#00ffff', fontWeight: 'bold', marginBottom: '8px' }}>Daily Power Consumption (Watt-hours)</label>
          <input type="number" placeholder="e.g. 2400" value={dailyWh} onChange={e => setDailyWh(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #00ffff', color: '#fff', borderRadius: '8px', marginBottom: '15px', fontSize: '1.1em' }} />

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Days of Autonomy</label>
              <input type="number" value={autonomy} onChange={e => setAutonomy(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Peak Sun Hours</label>
              <input type="number" value={sunHours} onChange={e => setSunHours(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>
        </div>

        {/* Hardware & Physics Specs */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00ffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>⚙️ Hardware Specs</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Panel Rating (W)</label>
              <input type="number" value={panelWatts} onChange={e => setPanelWatts(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Bank Volts (V)</label>
              <select value={battVolts} onChange={e => setBattVolts(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}>
                <option value="12">12V System</option>
                <option value="24">24V System</option>
                <option value="48">48V System</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>System Efficiency</label>
              <select value={sysEfficiency} onChange={e => setSysEfficiency(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}>
                <option value="0.85">85% (Premium)</option>
                <option value="0.75">75% (Standard)</option>
                <option value="0.65">65% (Heavy Dust/Heat)</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Battery Chemistry</label>
              <select value={battDoD} onChange={e => setBattDoD(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}>
                <option value="0.85">LiFePO4 (85% DoD)</option>
                <option value="0.5">Lead-Acid (50% DoD)</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Build Blueprint */}
        <div style={{ background: 'rgba(10,10,10,0.95)', border: '2px solid #00cc66', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0, 204, 102, 0.1)' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px', textAlign: 'center' }}>SYSTEM BLUEPRINT</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '1.1em' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#aaa' }}>Min. Array Size:</span>
              <span style={{ color: '#ffaa00', fontWeight: 'bold' }}>{requiredArrayWatts.toFixed(0)} Watts</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #333' }}>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>Panels Required:</span>
              <span style={{ color: '#ffaa00', fontWeight: 'bold', fontSize: '1.2em' }}>{panelsNeeded}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <span style={{ color: '#aaa' }}>Min. Battery:</span>
              <span style={{ color: '#00cc66', fontWeight: 'bold' }}>{requiredBatteryWh.toFixed(0)} Wh</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #333' }}>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>Min. Capacity:</span>
              <span style={{ color: '#00cc66', fontWeight: 'bold', fontSize: '1.2em' }}>{requiredBatteryAh.toFixed(0)} Ah</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>Min. Charge Controller:</span>
              <span style={{ color: '#00ffff', fontWeight: 'bold', fontSize: '1.2em' }}>{chargeControllerAmps.toFixed(0)} Amps</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SolarCalc;
