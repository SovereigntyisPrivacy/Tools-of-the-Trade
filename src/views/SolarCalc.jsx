import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SolarCalc() {
  const navigate = useNavigate();

  // --- STATE ---
  const [wh, setWh] = useState('');
  const [autonomy, setAutonomy] = useState('1');
  const [peakSun, setPeakSun] = useState('5.5');
  const [panelW, setPanelW] = useState('400');
  const [bankV, setBankV] = useState('48');
  const [efficiency, setEfficiency] = useState('0.75');
  const [chemistry, setChemistry] = useState('0.85'); // DoD
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // --- MATH ENGINE ---
  const dailyWh = parseFloat(wh) || 0;
  const daysAutonomy = parseFloat(autonomy) || 1;
  const sunHours = parseFloat(peakSun) || 1;
  const panelRating = parseFloat(panelW) || 1;
  const volts = parseFloat(bankV) || 12;
  const eff = parseFloat(efficiency) || 0.75;
  const dod = parseFloat(chemistry) || 0.5;

  // 1. Array Size
  const minArrayW = dailyWh > 0 ? (dailyWh / sunHours) / eff : 0;
  const panelsReq = dailyWh > 0 ? Math.ceil(minArrayW / panelRating) : 0;

  // 2. Battery Bank
  const minBatteryWh = dailyWh > 0 ? (dailyWh * daysAutonomy) / dod : 0;
  const minCapacityAh = minBatteryWh > 0 ? minBatteryWh / volts : 0;

  // 3. Charge Controller (Standard NEC rule of thumb: Array Watts / Bank Volts * 1.25 safety factor)
  const chargeControllerAmps = dailyWh > 0 ? (minArrayW / volts) * 1.25 : 0;

  // --- STYLES ---
  const inputStyle = { width: '100%', padding: '12px', background: '#111', border: '1px solid #333', borderRadius: '6px', color: '#fff', fontSize: '1.1em', marginTop: '6px', outline: 'none' };
  const labelStyle = { color: '#888', fontSize: '0.9em' };
  const sectionStyle = { background: '#1a1a1a', padding: '15px', borderRadius: '12px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #333', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#3b82f6', fontSize: '1.2em' }}>Solar & Battery Architect</h2>
      </header>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '50px' }}>
        
        {/* LOAD & ENVIRONMENT */}
        <div style={{ ...sectionStyle, borderTop: '2px solid #f59e0b' }}>
          <h3 style={{ color: '#3b82f6', margin: '0 0 15px 0', textAlign: 'center' }}>⚡ Load & Environment</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#00ffff', fontWeight: 'bold' }}>Daily Power Consumption (Watt-hours)</label>
            <input type="number" value={wh} onChange={e => setWh(e.target.value)} placeholder="e.g. 2400" style={{ ...inputStyle, border: '1px solid #00ffff' }} />
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Days of Autonomy</label>
              <input type="number" value={autonomy} onChange={e => setAutonomy(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Peak Sun Hours</label>
              <input type="number" value={peakSun} onChange={e => setPeakSun(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* HARDWARE SPECS */}
        <div style={{ ...sectionStyle, borderTop: '2px solid #00ffff' }}>
          <h3 style={{ color: '#3b82f6', margin: '0 0 15px 0', textAlign: 'center' }}>⚙️ Hardware Specs</h3>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Panel Rating (W)</label>
              <input type="number" value={panelW} onChange={e => setPanelW(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Bank Volts (V)</label>
              <select value={bankV} onChange={e => setBankV(e.target.value)} style={inputStyle}>
                <option value="12">12V System</option>
                <option value="24">24V System</option>
                <option value="48">48V System</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>System Efficiency</label>
              <select value={efficiency} onChange={e => setEfficiency(e.target.value)} style={inputStyle}>
                <option value="0.75">75% (Standard)</option>
                <option value="0.85">85% (High/MPPT)</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Battery Chemistry</label>
              <select value={chemistry} onChange={e => setChemistry(e.target.value)} style={inputStyle}>
                <option value="0.85">LiFePO4 (85% DoD)</option>
                <option value="0.50">Lead-Acid (50% DoD)</option>
              </select>
            </div>
          </div>
        </div>
        {/* SYSTEM BLUEPRINT */}
        <div style={{ ...sectionStyle, border: '2px solid #00cc66' }}>
          <h3 style={{ color: '#3b82f6', margin: '0 0 15px 0', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>SYSTEM BLUEPRINT</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#aaa' }}>
            <span>Min. Array Size:</span>
            <strong style={{ color: '#f59e0b' }}>{Math.round(minArrayW).toLocaleString()} Watts</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px dashed #333', paddingBottom: '15px' }}>
            <strong style={{ color: '#fff' }}>Panels Required:</strong>
            <strong style={{ color: '#f59e0b', fontSize: '1.2em' }}>{panelsReq}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#aaa' }}>
            <span>Min. Battery:</span>
            <strong style={{ color: '#00cc66' }}>{Math.round(minBatteryWh).toLocaleString()} Wh</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px dashed #333', paddingBottom: '15px' }}>
            <strong style={{ color: '#fff' }}>Min. Capacity:</strong>
            <strong style={{ color: '#00cc66', fontSize: '1.2em' }}>{Math.round(minCapacityAh).toLocaleString()} Ah</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ color: '#fff' }}>Min. Charge Controller:</strong>
            <strong style={{ color: '#00ffff', fontSize: '1.2em' }}>{Math.round(chargeControllerAmps)} Amps</strong>
          </div>
        </div>

        {/* COLLAPSIBLE GUIDE */}
        <div style={{ ...sectionStyle, borderLeft: '4px solid #a855f7' }}>
          <div 
            onClick={() => setIsGuideOpen(!isGuideOpen)} 
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          >
            <h3 style={{ color: '#3b82f6', margin: 0, flex: 1, textAlign: 'center' }}>📖 Layman's Field Guide</h3>
            <span style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '1.5em', lineHeight: '1' }}>{isGuideOpen ? '−' : '+'}</span>
          </div>
          
          {isGuideOpen && (
            <div style={{ marginTop: '20px', color: '#ccc', textAlign: 'center', lineHeight: '1.5' }}>
              <h4 style={{ color: '#a855f7', margin: '0 0 5px 0' }}>Watts vs. Watt-Hours (Wh)</h4>
              <p style={{ margin: '0 0 15px 0' }}>Think of a car. "Watts" is your speed (how fast you are drawing power right now). "Watt-hours" is your distance (how much total power you consumed over the whole day). Solar math always starts with your total daily Watt-hours.</p>
              
              <h4 style={{ color: '#a855f7', margin: '0 0 5px 0' }}>Depth of Discharge (DoD)</h4>
              <p style={{ margin: '0 0 15px 0' }}>You can never use 100% of a battery. If you drain a traditional Lead-Acid battery past 50%, it permanently damages the cells. Modern Lithium (LiFePO4) batteries are much better and let you safely use up to 85-90% of their rated capacity before needing a charge.</p>

              <h4 style={{ color: '#a855f7', margin: '0 0 5px 0' }}>System Efficiency & Heat Loss</h4>
              <p style={{ margin: '0 0 15px 0' }}>Inverters waste power when converting DC battery juice into AC wall power. If you are running continuous heavy loads like an AI workstation or hashing rig 24/7, heat, wire resistance, and inverter conversion will eat up to 25% of your generated power. Always design your panels to produce 25% more than you think you need.</p>

              <h4 style={{ color: '#a855f7', margin: '0 0 5px 0' }}>Days of Autonomy</h4>
              <p style={{ margin: '0' }}>How many cloudy, rainy days in a row do you want your system to survive without any help from the sun? For off-grid cabins, 3 days is standard.</p>
            </div>
          )}
        </div>

        {/* DISCLAIMER */}
        <div style={{ border: '1px solid #ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '15px', borderRadius: '8px', color: '#ef4444', textAlign: 'justify', lineHeight: '1.4', fontSize: '0.9em' }}>
          <h4 style={{ margin: '0 0 10px 0', textAlign: 'center', textTransform: 'uppercase' }}>⚠️ Critical Disclaimer</h4>
          This engine provides theoretical hardware estimates based on idealized conditions. High-amperage DC battery banks and AC inverter wiring present severe electrocution and fire hazards. This tool does not account for necessary wire gauge sizing, proper fusing, or NEC (National Electrical Code) compliance. <strong>NEVER</strong> attempt to build or wire a large-scale off-grid system without consulting a licensed electrician.
        </div>

      </div>
    </div>
  );
}
