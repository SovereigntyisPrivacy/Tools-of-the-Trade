import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SolarCalc() {
  const navigate = useNavigate();

  const [wh, setWh] = useState('');
  const [autonomy, setAutonomy] = useState('1');
  const [peakSun, setPeakSun] = useState('5.5');
  const [panelW, setPanelW] = useState('400');
  const [bankV, setBankV] = useState('48');
  const [efficiency, setEfficiency] = useState('0.75');
  const [chemistry, setChemistry] = useState('0.85'); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const dailyWh = parseFloat(wh) || 0;
  const daysAutonomy = parseFloat(autonomy) || 1;
  const sunHours = parseFloat(peakSun) || 1;
  const panelRating = parseFloat(panelW) || 1;
  const volts = parseFloat(bankV) || 12;
  const eff = parseFloat(efficiency) || 0.75;
  const dod = parseFloat(chemistry) || 0.5;

  const minArrayW = dailyWh > 0 ? (dailyWh / sunHours) / eff : 0;
  const panelsReq = dailyWh > 0 ? Math.ceil(minArrayW / panelRating) : 0;
  const minBatteryWh = dailyWh > 0 ? (dailyWh * daysAutonomy) / dod : 0;
  const minCapacityAh = minBatteryWh > 0 ? minBatteryWh / volts : 0;
  const chargeControllerAmps = dailyWh > 0 ? (minArrayW / volts) * 1.25 : 0;

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

        <div style={{ ...sectionStyle, borderLeft: '4px solid #a855f7' }}>
          <div 
            onClick={() => setIsGuideOpen(!isGuideOpen)} 
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          >
            <h3 style={{ color: '#3b82f6', margin: 0, flex: 1, textAlign: 'center' }}>📖 Off-Grid Master Guide</h3>
            <span style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '1.5em', lineHeight: '1' }}>{isGuideOpen ? '−' : '+'}</span>
          </div>
          
          {isGuideOpen && (
            <div style={{ marginTop: '20px', color: '#ccc', textAlign: 'left', lineHeight: '1.5' }}>
              
              <blockquote style={{ background: 'rgba(168, 85, 247, 0.1)', borderLeft: '3px solid #a855f7', padding: '10px', margin: '0 0 15px 0', color: '#fff', fontFamily: 'monospace' }}>
                The Master Equation:<br/>
                $Watts = Volts \times Amps$
              </blockquote>
              <p style={{ fontSize: '0.9em', margin: '0 0 20px 0' }}>This single equation dictates all your wire sizing and fuse limits. If you need 2400 Watts on a 12V system, you are pushing a massive 200 Amps ($2400 = 12 \times 200$). That requires incredibly thick gauge wire. Bumping up to a 48V battery bank drops that same load to just 50 Amps, allowing for much thinner, cheaper wire.</p>

              <h4 style={{ color: '#00ffff', margin: '0 0 5px 0', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Panel Types</h4>
              <ul style={{ paddingLeft: '20px', margin: '0 0 15px 0', fontSize: '0.9em' }}>
                  <li style={{ marginBottom: '8px' }}><strong>Monocrystalline (Black cells):</strong> High efficiency, excellent low-light performance, and space-saving. Best if you have limited roof or rack space.</li>
                  <li><strong>Polycrystalline (Blue cells):</strong> Cheaper, but less efficient. You will need a much larger physical footprint to achieve the same wattage.</li>
              </ul>

              <h4 style={{ color: '#00ffff', margin: '0 0 5px 0', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Wiring: Series vs. Parallel</h4>
              <ul style={{ paddingLeft: '20px', margin: '0 0 15px 0', fontSize: '0.9em' }}>
                  <li style={{ marginBottom: '8px' }}><strong>Series (Daisy Chained):</strong> Voltage increases, Amps stay the same. Ideal for long cable runs to minimize voltage drop. <em>Warning:</em> Without bypass diodes, if a single leaf shades one panel, the entire string loses power.</li>
                  <li><strong>Parallel (Positives to Positives):</strong> Amps increase, Voltage stays the same. Highly resilient against partial shading, but requires thick, expensive copper wiring to handle the high amperage safely.</li>
              </ul>

              <h4 style={{ color: '#00ffff', margin: '0 0 5px 0', borderBottom: '1px solid #333', paddingBottom: '5px' }}>The Temperature Curveball</h4>
              <p style={{ fontSize: '0.9em', margin: '0 0 15px 0' }}>Panels lose efficiency rapidly as they heat up. A panel rated for 400W at a mild 77°F might only push 320W when baking in a 115°F desert summer. Conversely, extreme freezing temperatures will actually <em>spike</em> panel voltage, which can instantly fry a charge controller if you didn't calculate a 20% safety margin. Batteries are the opposite—heat is fine, but extreme cold kills their capacity.</p>

              <h4 style={{ color: '#00ffff', margin: '0 0 5px 0', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Controllers: MPPT vs. PWM</h4>
              <ul style={{ paddingLeft: '20px', margin: '0 0 15px 0', fontSize: '0.9em' }}>
                  <li style={{ marginBottom: '8px' }}><strong>MPPT (Maximum Power Point Tracking):</strong> The gold standard. It takes high voltage from your panels and efficiently steps it down to charge your battery, recovering up to 30% more total power.</li>
                  <li><strong>PWM (Pulse Width Modulation):</strong> Outdated tech. It simply clips off excess voltage and wastes it as heat. Only acceptable for tiny, ultra-budget setups.</li>
              </ul>

              <h4 style={{ color: '#00ffff', margin: '0 0 5px 0', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Inverter Sizing for Continuous Loads</h4>
              <p style={{ fontSize: '0.9em', margin: '0 0 15px 0' }}>If you are powering sensitive electronics, GPUs, or continuous heavy loads, you must use a <strong>Pure Sine Wave</strong> inverter. Your inverter must be sized to handle your "Continuous Load" (everything running simultaneously) PLUS a safety buffer. Standard practice is buying an inverter rated 25% higher than your max expected continuous draw.</p>

            </div>
          )}
        </div>

        <div style={{ border: '1px solid #ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '15px', borderRadius: '8px', color: '#ef4444', textAlign: 'justify', lineHeight: '1.4', fontSize: '0.9em' }}>
          <h4 style={{ margin: '0 0 10px 0', textAlign: 'center', textTransform: 'uppercase' }}>⚠️ Critical Disclaimer</h4>
          This engine provides theoretical hardware estimates based on idealized conditions. High-amperage DC battery banks and AC inverter wiring present severe electrocution and fire hazards. This tool does not account for necessary wire gauge sizing, proper fusing, or NEC (National Electrical Code) compliance. <strong>NEVER</strong> attempt to build or wire a large-scale off-grid system without consulting a licensed electrician.
        </div>

      </div>
    </div>
  );
}
