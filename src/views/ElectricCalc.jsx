import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ElectricCalc() {
  const navigate = useNavigate();

  // 1. Basic Load State
  const [deviceWatts, setDeviceWatts] = useState('');
  const [circuitVolts, setCircuitVolts] = useState('120');
  const [deviceAmps, setDeviceAmps] = useState('');
  const [circuitVolts2, setCircuitVolts2] = useState('120');

  // 2. Voltage Drop & Wire Gauge State
  const [vdAmps, setVdAmps] = useState('');
  const [vdDistance, setVdDistance] = useState(''); // feet
  const [vdVolts, setVdVolts] = useState('120');
  const [wireGauge, setWireGauge] = useState('6530'); // Default 12 AWG CMil

  // 3. Off-Grid Battery Runtime State
  const [battAh, setBattAh] = useState('');
  const [battVolts, setBattVolts] = useState('12');
  const [battType, setBattType] = useState('1.0'); // Lithium = 100%, Lead = 50%
  const [loadWatts, setLoadWatts] = useState('');
  const [inverterEff, setInverterEff] = useState('85'); // %

  // 4. Generator Sizing State
  const [runningWatts, setRunningWatts] = useState('');
  const [surgeMultiplier, setSurgeMultiplier] = useState('1.5');

  // --- Calculations ---

  // 1. Basic
  const calcAmps = (deviceWatts && circuitVolts) ? (parseFloat(deviceWatts) / parseFloat(circuitVolts)).toFixed(2) : '0.00';
  const calcWatts = (deviceAmps && circuitVolts2) ? (parseFloat(deviceAmps) * parseFloat(circuitVolts2)).toFixed(0) : '0';

  // 2. Voltage Drop (Single Phase Copper)
  // VD = 2 * K * I * D / CM. (K for Copper = 12.9)
  let voltDrop = 0;
  let voltDropPercent = 0;
  let voltageAtEquipment = 0;
  if (vdAmps && vdDistance && vdVolts) {
    voltDrop = (2 * 12.9 * parseFloat(vdAmps) * parseFloat(vdDistance)) / parseFloat(wireGauge);
    voltDropPercent = (voltDrop / parseFloat(vdVolts)) * 100;
    voltageAtEquipment = parseFloat(vdVolts) - voltDrop;
  }

  // 3. Battery Runtime
  let runtimeHours = 0;
  if (battAh && battVolts && loadWatts) {
    const totalWh = parseFloat(battAh) * parseFloat(battVolts);
    const usableWh = totalWh * parseFloat(battType);
    const actualLoad = parseFloat(loadWatts) / (parseFloat(inverterEff) / 100);
    runtimeHours = (usableWh / actualLoad).toFixed(2);
  }

  // 4. Generator
  const surgeWatts = runningWatts ? (parseFloat(runningWatts) * parseFloat(surgeMultiplier)).toFixed(0) : '0';
  const recGenSize = surgeWatts ? (parseFloat(surgeWatts) * 1.2).toFixed(0) : '0'; // 20% safety buffer

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Electrical & Off-Grid</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* 1. Basic Load Check */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ff4444', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🔌 Amperage Draw (Breaker Check)</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '4px' }}>Device (Watts)</label>
              <input type="number" placeholder="1500" value={deviceWatts} onChange={e => setDeviceWatts(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '4px' }}>Circuit (Volts)</label>
              <input type="number" value={circuitVolts} onChange={e => setCircuitVolts(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Current Draw:</span>
            <span style={{ color: '#ff4444', fontWeight: 'bold' }}>{calcAmps} Amps</span>
          </div>
        </div>

        {/* 2. Voltage Drop & Wire Gauge */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ffaa00', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>⚡ Voltage Drop & Wire Sizing</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Load (Amps)</label>
              <input type="number" placeholder="20" value={vdAmps} onChange={e => setVdAmps(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Distance (Ft)</label>
              <input type="number" placeholder="100" value={vdDistance} onChange={e => setVdDistance(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Voltage (V)</label>
              <input type="number" value={vdVolts} onChange={e => setVdVolts(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#ffaa00', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Copper Wire Gauge</label>
              <select value={wireGauge} onChange={e => setWireGauge(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}>
                <option value="4110">14 AWG</option>
                <option value="6530">12 AWG</option>
                <option value="10380">10 AWG</option>
                <option value="16510">8 AWG</option>
                <option value="26240">6 AWG</option>
                <option value="41740">4 AWG</option>
                <option value="66360">2 AWG</option>
                <option value="105600">1/0 AWG</option>
                <option value="133100">2/0 AWG</option>
                <option value="211600">4/0 AWG</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}>
              <span style={{ color: '#aaa' }}>Voltage Drop:</span>
              <span style={{ color: voltDropPercent > 3 ? '#ff4444' : '#00cc66', fontWeight: 'bold' }}>{voltDrop.toFixed(2)}V ({voltDropPercent.toFixed(1)}%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', paddingTop: '8px', borderTop: '1px dashed #333' }}>
              <span style={{ color: '#fff' }}>Volts at Equipment:</span>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>{voltageAtEquipment.toFixed(1)} V</span>
            </div>
            {voltDropPercent > 3 && (
              <div style={{ color: '#ff4444', fontSize: '0.85em', marginTop: '5px' }}>⚠️ Drop exceeds 3%. Thicker wire recommended.</div>
            )}
          </div>
        </div>

        {/* 3. Off-Grid Battery Runtime */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🔋 Battery Bank Runtime</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00cc66', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Capacity (Ah)</label>
              <input type="number" placeholder="100" value={battAh} onChange={e => setBattAh(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Voltage (V)</label>
              <select value={battVolts} onChange={e => setBattVolts(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}>
                <option value="12">12V System</option>
                <option value="24">24V System</option>
                <option value="48">48V System</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Chemistry (DoD)</label>
              <select value={battType} onChange={e => setBattType(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}>
                <option value="1.0">LiFePO4 (100%)</option>
                <option value="0.5">Lead-Acid / AGM (50%)</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Inverter Eff (%)</label>
              <input type="number" value={inverterEff} onChange={e => setInverterEff(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <label style={{ display: 'block', color: '#ff4444', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Active Draw / Load (Watts)</label>
          <input type="number" placeholder="e.g. 500" value={loadWatts} onChange={e => setLoadWatts(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Est. Runtime:</span>
            <span style={{ color: '#00cc66', fontWeight: 'bold' }}>{runtimeHours} Hours</span>
          </div>
        </div>

        {/* 4. Generator Sizing */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00ffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>⚙️ Generator Sizing</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Base Running Load (Watts)</label>
              <input type="number" placeholder="e.g. 3000" value={runningWatts} onChange={e => setRunningWatts(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Motor Surge</label>
              <select value={surgeMultiplier} onChange={e => setSurgeMultiplier(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}>
                <option value="1.0">None (Resistive)</option>
                <option value="1.5">1.5x (Fridge/Pumps)</option>
                <option value="2.0">2.0x (AC Units/Saws)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}>
              <span style={{ color: '#aaa' }}>Starting (Surge) Load:</span>
              <span style={{ color: '#ffaa00', fontWeight: 'bold' }}>{surgeWatts} W</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', paddingTop: '8px', borderTop: '1px dashed #333' }}>
              <span style={{ color: '#fff' }}>Min Recommended Gen:</span>
              <span style={{ color: '#00ffff', fontWeight: 'bold' }}>{recGenSize} W</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ElectricCalc;
