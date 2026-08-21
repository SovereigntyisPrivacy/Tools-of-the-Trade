import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SolarCalc() {
  const navigate = useNavigate();

  // --- Input State ---
  const [dailyWh, setDailyWh] = useState('');
  const [daysAuto, setDaysAuto] = useState('1');
  const [peakSun, setPeakSun] = useState('5.5');
  
  const [panelW, setPanelW] = useState('400');
  const [bankV, setBankV] = useState('48');
  const [sysEff, setSysEff] = useState('0.75');
  const [batChem, setBatChem] = useState('0.85'); // DoD

  // --- Output State ---
  const [solution, setSolution] = useState({
    minArrayW: 0,
    panelsReq: 0,
    minBatWh: 0,
    minBatAh: 0,
    ccAmps: 0
  });

  useEffect(() => {
    const wh = parseFloat(dailyWh) || 0;
    const days = parseFloat(daysAuto) || 1;
    const sun = parseFloat(peakSun) || 1;
    const pW = parseFloat(panelW) || 1;
    const bV = parseFloat(bankV) || 12;
    const eff = parseFloat(sysEff) || 0.75;
    const dod = parseFloat(batChem) || 0.85;

    if (wh === 0) return;

    // 1. Array Math (Accounting for System Efficiency / Inverter Loss)
    const dailyWhNeededFromPanels = wh / eff;
    const minArraySizeW = dailyWhNeededFromPanels / sun;
    const panelsCount = Math.ceil(minArraySizeW / pW);

    // 2. Battery Math (Accounting for Depth of Discharge and Days of Autonomy)
    const minBatteryWh = (wh * days) / dod;
    const minBatteryAh = minBatteryWh / bV;

    // 3. Charge Controller Math (Solar Watts / Bank Volts * 1.25 Safety Factor)
    const ccAmperage = (minArraySizeW / bV) * 1.25;

    setSolution({
      minArrayW: Math.round(minArraySizeW),
      panelsReq: panelsCount,
      minBatWh: Math.round(minBatteryWh),
      minBatAh: Math.round(minBatteryAh),
      ccAmps: Math.ceil(ccAmperage)
    });

  }, [dailyWh, daysAuto, peakSun, panelW, bankV, sysEff, batChem]);

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Solar & Battery Architect</h2>
      </header>

      <div className="calc-content" style={{ padding: '16px', overflowY: 'auto', height: '100%', paddingBottom: '20px' }}>

        {/* --- Card 1: Load & Environment --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #ffb703', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem', textAlign: 'center' }}>⚡ Load & Environment</h3>
          
          <div style={{ marginBottom: '14px' }}>
            <label style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: 'bold' }}>Daily Power Consumption (Watt-hours)</label>
            <input type="number" placeholder="e.g. 2400" value={dailyWh} onChange={(e) => setDailyWh(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #00e5ff', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Days of Autonomy</label>
              <input type="number" value={daysAuto} onChange={(e) => setDaysAuto(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Peak Sun Hours</label>
              <input type="number" step="0.1" value={peakSun} onChange={(e) => setPeakSun(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
            </div>
          </div>
        </div>

        {/* --- Card 2: Hardware Specs --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #00e5ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem', textAlign: 'center' }}>⚙️ Hardware Specs</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Panel Rating (W)</label>
              <input type="number" value={panelW} onChange={(e) => setPanelW(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Bank Volts (V)</label>
              <select value={bankV} onChange={(e) => setBankV(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }}>
                <option value="12">12V System</option>
                <option value="24">24V System</option>
                <option value="48">48V System</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.8rem' }}>System Efficiency</label>
              <select value={sysEff} onChange={(e) => setSysEff(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }}>
                <option value="0.75">75% (Standard)</option>
                <option value="0.85">85% (Premium)</option>
                <option value="0.65">65% (Sub-Par)</option>
              </select>
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Battery Chemistry</label>
              <select value={batChem} onChange={(e) => setBatChem(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }}>
                <option value="0.85">LiFePO4 (85% DoD)</option>
                <option value="0.50">Lead-Acid (50% DoD)</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- Card 3: System Blueprint --- */}
        <div style={{ background: '#0a0a0a', border: '2px solid #00cc66', borderRadius: '12px', padding: '16px', marginBottom: '20px', boxShadow: '0 0 15px rgba(0,204,102,0.1)' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '2px' }}>SYSTEM BLUEPRINT</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#aaa' }}>Min. Array Size:</span><span style={{ color: '#ffb703', fontWeight: 'bold' }}>{solution.minArrayW.toLocaleString()} Watts</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Panels Required:</span><span style={{ color: '#ffb703', fontWeight: 'bold', fontSize: '1.2rem' }}>{solution.panelsReq}</span></div>
          
          <div style={{ height: '1px', background: '#333', marginBottom: '16px' }}></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#aaa' }}>Min. Battery:</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{solution.minBatWh.toLocaleString()} Wh</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Min. Capacity:</span><span style={{ color: '#00cc66', fontWeight: 'bold', fontSize: '1.2rem' }}>{solution.minBatAh.toLocaleString()} Ah</span></div>

          <div style={{ height: '1px', background: '#333', marginBottom: '16px' }}></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Min. Charge Controller:</span>
            <span style={{ color: '#00e5ff', fontWeight: 'bold', fontSize: '1.2rem' }}>{solution.ccAmps} Amps</span>
          </div>
        </div>

        {/* --- Card 4: Layman's Educational Guide --- */}
        <div style={{ background: '#181818', borderLeft: '4px solid #a600ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>📖 Layman's Field Guide</h3>
          
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>Watts vs. Watt-Hours (Wh)</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>Think of a car. "Watts" is your speed (how fast you are drawing power right now). "Watt-hours" is your distance (how much total power you consumed over the whole day). Solar math always starts with your total daily Watt-hours.</p>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>Depth of Discharge (DoD)</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>You can never use 100% of a battery. If you drain a traditional Lead-Acid battery past 50%, it permanently damages the cells. Modern Lithium (LiFePO4) batteries are much better and let you safely use up to 85-90% of their rated capacity before needing a charge.</p>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>System Efficiency & Heat Loss</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>Inverters waste power when converting DC battery juice into AC wall power. If you are running continuous heavy loads like an AI workstation or hashing rig 24/7, heat, wire resistance, and inverter conversion will eat up to 25% of your generated power. Always design your panels to produce 25% more than you think you need.</p>
          </div>

          <div>
            <strong style={{ color: '#a600ff', fontSize: '0.9rem' }}>Days of Autonomy</strong>
            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>How many cloudy, rainy days in a row do you want your system to survive without any help from the sun? For off-grid cabins, 3 days is standard.</p>
          </div>
        </div>

        {/* --- Card 5: Safety Disclaimer --- */}
        <div style={{ background: '#220000', border: '1px solid #d00000', borderRadius: '8px', padding: '16px' }}>
          <div style={{ color: '#ff4444', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '6px', textAlign: 'center' }}>⚠️ CRITICAL DISCLAIMER</div>
          <p style={{ color: '#ffaaaa', fontSize: '0.75rem', margin: '0', lineHeight: '1.5', textAlign: 'justify' }}>
            This engine provides theoretical hardware estimates based on idealized conditions. High-amperage DC battery banks and AC inverter wiring present severe electrocution and fire hazards. This tool does not account for necessary wire gauge sizing, proper fusing, or NEC (National Electrical Code) compliance. <strong>NEVER</strong> attempt to build or wire a large-scale off-grid system without consulting a licensed electrician.
          </p>
        </div>

      </div>
    </div>
  );
}

export default SolarCalc;
