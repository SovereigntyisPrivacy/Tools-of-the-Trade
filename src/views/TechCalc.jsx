import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TechCalc() {
  const navigate = useNavigate();

  // 1. AI VRAM Estimator
  const [paramsB, setParamsB] = useState('8');
  const [quantBits, setQuantBits] = useState('4');

  // 2. Mesh Network (Fresnel & RF Link Budget)
  const [linkDistance, setLinkDistance] = useState('5'); // km
  const [freqGhz, setFreqGhz] = useState('2.4'); // GHz
  const [txPowerDbm, setTxPowerDbm] = useState('20'); // dBm (e.g., 100mW)
  const [txGainDbi, setTxGainDbi] = useState('12'); // Transmitter Antenna Gain
  const [rxGainDbi, setRxGainDbi] = useState('12'); // Receiver Antenna Gain
  const [rxSensitivity, setRxSensitivity] = useState('-85'); // Receiver threshold

  // 3. RAID Storage Array
  const [driveSize, setDriveSize] = useState('4');
  const [driveCount, setDriveCount] = useState('4');
  const [raidType, setRaidType] = useState('5');

  // 4. Data Transfer
  const [fileSizeGB, setFileSizeGB] = useState('50');
  const [speedMbps, setSpeedMbps] = useState('300');

  // 5. IPv4 Subnet
  const [cidr, setCidr] = useState('24');

  // 6. Game Dev: Texture & VRAM
  const [texW, setTexW] = useState('4096');
  const [texH, setTexH] = useState('4096');
  const [texFormat, setTexFormat] = useState('32');
  const [hasMipmaps, setHasMipmaps] = useState(true);

  // 7. Game Dev: Frame Budget
  const [targetFps, setTargetFps] = useState('60');

  // 8. Embedded Hardware: IoT Battery
  const [battMah, setBattMah] = useState('2500');
  const [activeMa, setActiveMa] = useState('120');
  const [sleepUa, setSleepUa] = useState('10');
  const [activeMs, setActiveMs] = useState('500');
  const [wakeSec, setWakeSec] = useState('60');

  // 9. Node & Crypto Hashing Efficiency
  const [hashrate, setHashrate] = useState('45000'); // e.g., H/s
  const [powerDrawWatts, setPowerDrawWatts] = useState('150'); // Watts
  const [powerCostKwh, setPowerCostKwh] = useState('0.14'); // $ per kWh

  // --- Calculations ---

  // 1. AI VRAM
  let vramBase = 0, vramTotal = 0;
  if (paramsB && quantBits) {
    vramBase = (parseFloat(paramsB) * parseFloat(quantBits)) / 8;
    vramTotal = vramBase * 1.2;
  }

  // 2. Mesh Network RF Math
  let fresnelRadiusFt = 0, earthClearanceFt = 0, fspl = 0, rxPower = 0, linkMargin = 0;
  if (linkDistance && freqGhz) {
    const d = parseFloat(linkDistance);
    const f = parseFloat(freqGhz);
    
    // Fresnel
    const rMeters = 8.656 * Math.sqrt(d / f);
    fresnelRadiusFt = rMeters * 3.28084;
    earthClearanceFt = fresnelRadiusFt * 0.6;

    // Free Space Path Loss (dB) = 20log10(d) + 20log10(f) + 92.45
    fspl = (20 * Math.log10(d)) + (20 * Math.log10(f)) + 92.45;
    
    // Link Budget
    const txP = parseFloat(txPowerDbm) || 0;
    const txG = parseFloat(txGainDbi) || 0;
    const rxG = parseFloat(rxGainDbi) || 0;
    const rxS = parseFloat(rxSensitivity) || -85;
    
    rxPower = txP + txG + rxG - fspl;
    linkMargin = rxPower - rxS; // Must be positive for a stable link
  }

  // 3. RAID
  let usableCapacity = 0, faultTolerance = '';
  if (driveSize && driveCount && raidType) {
    const size = parseFloat(driveSize), count = parseInt(driveCount);
    switch(raidType) {
      case '0': usableCapacity = size * count; faultTolerance = '0 Drives (Danger)'; break;
      case '1': usableCapacity = size * (count / 2); faultTolerance = '1 Drive per Pair'; break;
      case '5': usableCapacity = count >= 3 ? size * (count - 1) : 0; faultTolerance = count >= 3 ? '1 Drive Total' : 'Min 3 Drives'; break;
      case '6': usableCapacity = count >= 4 ? size * (count - 2) : 0; faultTolerance = count >= 4 ? '2 Drives Total' : 'Min 4 Drives'; break;
      case '10': usableCapacity = (count >= 4 && count % 2 === 0) ? size * (count / 2) : 0; faultTolerance = (count >= 4 && count % 2 === 0) ? '1 Drive per Sub-Array' : 'Min 4 (Even)'; break;
      default: break;
    }
  }

  // 4. Data Transfer
  let tHrs = 0, tMins = 0, tSecs = 0;
  if (fileSizeGB && speedMbps) {
    const megabits = parseFloat(fileSizeGB) * 8192;
    const realSpeed = parseFloat(speedMbps) * 0.9;
    const tSec = megabits / realSpeed;
    tHrs = Math.floor(tSec / 3600); tMins = Math.floor((tSec % 3600) / 60); tSecs = Math.floor(tSec % 60);
  }

  // 5. Subnet
  let hosts = 0, subnetMask = '';
  if (cidr) {
    const c = parseInt(cidr);
    if (c >= 0 && c <= 32) {
      if (c === 32) hosts = 1; else if (c === 31) hosts = 2; else hosts = Math.pow(2, 32 - c) - 2;
      let maskNum = (0xffffffff << (32 - c)) >>> 0;
      subnetMask = [(maskNum >>> 24) & 255, (maskNum >>> 16) & 255, (maskNum >>> 8) & 255, maskNum & 255].join('.');
    }
  }

  // 6. Game Dev Texture
  let texSizeMB = 0;
  if (texW && texH && texFormat) {
    const w = parseFloat(texW), h = parseFloat(texH), bpp = parseFloat(texFormat);
    let bytes = (w * h * bpp) / 8;
    if (hasMipmaps) bytes = bytes * 1.3333; 
    texSizeMB = bytes / 1024 / 1024;
  }

  // 7. Game Frame Budget
  let frameMs = targetFps ? 1000 / parseFloat(targetFps) : 0;

  // 8. IoT Deep Sleep
  let iotDays = 0, iotYears = 0;
  if (battMah && activeMa && sleepUa && activeMs && wakeSec) {
    const actT = parseFloat(activeMs) / 1000;
    const interval = parseFloat(wakeSec);
    if (interval > actT) {
      const dutyCycle = actT / interval;
      const avgCurrent = (parseFloat(activeMa) * dutyCycle) + ((parseFloat(sleepUa) / 1000) * (1 - dutyCycle));
      const hours = parseFloat(battMah) / avgCurrent;
      iotDays = hours / 24; iotYears = iotDays / 365.25;
    }
  }

  // 9. Crypto Node Efficiency
  let effHashWatt = 0, dailyCost = 0, monthlyCost = 0;
  if (hashrate && powerDrawWatts && powerCostKwh) {
    const h = parseFloat(hashrate);
    const w = parseFloat(powerDrawWatts);
    const kwhPrice = parseFloat(powerCostKwh);
    
    if (w > 0) {
      effHashWatt = h / w;
      dailyCost = (w / 1000) * 24 * kwhPrice;
      monthlyCost = dailyCost * 30.44;
    }
  }

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Hardware & Networking</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* RF Link Budget & Fresnel */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00ffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>📡 Mesh RF Link Architect</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Distance (km)</label>
              <input type="number" value={linkDistance} onChange={e => setLinkDistance(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Freq (GHz)</label>
              <input type="number" value={freqGhz} onChange={e => setFreqGhz(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>TX Power (dBm)</label>
              <input type="number" value={txPowerDbm} onChange={e => setTxPowerDbm(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>TX Gain (dBi)</label>
              <input type="number" value={txGainDbi} onChange={e => setTxGainDbi(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>RX Gain (dBi)</label>
              <input type="number" value={rxGainDbi} onChange={e => setRxGainDbi(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Min Tower Height:</span><span style={{ color: '#fff', fontWeight: 'bold' }}>{earthClearanceFt.toFixed(1)} ft</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Path Loss (FSPL):</span><span style={{ color: '#ff4444', fontWeight: 'bold' }}>-{fspl.toFixed(1)} dB</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', paddingTop: '8px', borderTop: '1px dashed #333' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Fade Margin:</span><span style={{ color: linkMargin > 10 ? '#00cc66' : '#ffaa00', fontWeight: 'bold' }}>{linkMargin.toFixed(1)} dB</span></div>
            {linkMargin < 10 && <div style={{ color: '#ffaa00', fontSize: '0.85em', textAlign: 'center', marginTop: '5px' }}>Margin under 10dB. Link may be unstable in weather.</div>}
          </div>
        </div>

        {/* Node & Crypto Efficiency */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ffaa00', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>⛏️ Node Power Efficiency</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#ffaa00', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Hashrate / Output</label>
              <input type="number" placeholder="45000" value={hashrate} onChange={e => setHashrate(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#ff4444', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Power (Watts)</label>
              <input type="number" placeholder="150" value={powerDrawWatts} onChange={e => setPowerDrawWatts(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>
          
          <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Electricity Cost ($ / kWh)</label>
          <input type="number" placeholder="0.14" value={powerCostKwh} onChange={e => setPowerCostKwh(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Efficiency (Hash/W):</span><span style={{ color: '#00ffff', fontWeight: 'bold' }}>{effHashWatt.toFixed(2)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', paddingTop: '8px', borderTop: '1px dashed #333' }}><span style={{ color: '#aaa' }}>Daily Op. Cost:</span><span style={{ color: '#ff4444', fontWeight: 'bold' }}>${dailyCost.toFixed(2)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', paddingTop: '8px', borderTop: '1px solid #333' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Monthly Burn:</span><span style={{ color: '#ff4444', fontWeight: 'bold' }}>${monthlyCost.toFixed(2)}</span></div>
          </div>
        </div>

        {/* AI VRAM */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #a55eea', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🧠 Local AI VRAM Estimator</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#a55eea', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Params (Billions)</label><input type="number" value={paramsB} onChange={e => setParamsB(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Quantization</label><select value={quantBits} onChange={e => setQuantBits(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}><option value="4">4-Bit</option><option value="8">8-Bit</option><option value="16">16-Bit</option></select></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Req. VRAM (w/ Cache):</span><span style={{ color: '#a55eea', fontWeight: 'bold' }}>{vramTotal.toFixed(1)} GB</span></div>
        </div>

        {/* Embedded IoT Battery */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🔋 Embedded IoT Battery</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#00cc66', fontSize: '0.85em', marginBottom: '4px' }}>Cap (mAh)</label><input type="number" value={battMah} onChange={e => setBattMah(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Wake Interval (s)</label><input type="number" value={wakeSec} onChange={e => setWakeSec(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Act. mA</label><input type="number" value={activeMa} onChange={e => setActiveMa(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Slp. µA</label><input type="number" value={sleepUa} onChange={e => setSleepUa(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Act. ms</label><input type="number" value={activeMs} onChange={e => setActiveMs(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Est. Lifespan:</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{iotYears.toFixed(2)} Yrs</span></div>
        </div>

        {/* Game Dev Engine */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ff00ff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🎮 Game Engine Architect</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}><label style={{ color: '#ff00ff', fontWeight: 'bold' }}>Target FPS:</label><input type="number" value={targetFps} onChange={e => setTargetFps(e.target.value)} style={{ width: '80px', padding: '8px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', textAlign: 'center' }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', marginBottom: '15px' }}><span style={{ color: '#aaa' }}>Frame Budget:</span><span style={{ color: '#ff00ff', fontWeight: 'bold' }}>{frameMs.toFixed(2)} ms</span></div>
          <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Texture (W x H) & Format</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input type="number" value={texW} onChange={e => setTexW(e.target.value)} style={{ flex: 1, padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            <input type="number" value={texH} onChange={e => setTexH(e.target.value)} style={{ flex: 1, padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            <select value={texFormat} onChange={e => setTexFormat(e.target.value)} style={{ flex: 1, padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}><option value="24">RGB8</option><option value="32">RGBA8</option><option value="64">RGBA16F</option></select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>VRAM Cost: {texSizeMB.toFixed(2)} MB</span>
            <button onClick={() => setHasMipmaps(!hasMipmaps)} style={{ padding: '8px 15px', background: hasMipmaps ? '#00cc66' : '#444', color: hasMipmaps ? '#000' : '#aaa', fontWeight: 'bold', border: 'none', borderRadius: '8px' }}>{hasMipmaps ? 'Mips ON' : 'Mips OFF'}</button>
          </div>
        </div>

        {/* RAID & Subnet / Data */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #444', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🗄️ RAID & Subnet</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input type="number" placeholder="TB Size" value={driveSize} onChange={e => setDriveSize(e.target.value)} style={{ flex: 1, padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            <input type="number" placeholder="Count" value={driveCount} onChange={e => setDriveCount(e.target.value)} style={{ flex: 1, padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            <select value={raidType} onChange={e => setRaidType(e.target.value)} style={{ flex: 1, padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}><option value="0">RAID 0</option><option value="1">RAID 1</option><option value="5">RAID 5</option><option value="6">RAID 6</option><option value="10">RAID 10</option></select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', marginBottom: '15px' }}><span style={{ color: '#aaa' }}>Usable RAID Cap:</span><span style={{ color: '#ffaa00', fontWeight: 'bold' }}>{usableCapacity > 0 ? usableCapacity.toFixed(1) : 0} TB</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', paddingTop: '15px', borderTop: '1px solid #333' }}><span style={{ color: '#aaa' }}>Subnet /CIDR:</span><input type="number" value={cidr} onChange={e => setCidr(e.target.value)} style={{ width: '60px', padding: '5px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '5px', textAlign: 'center' }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', marginTop: '10px' }}><span style={{ color: '#aaa' }}>Usable IPs:</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{hosts.toLocaleString()}</span></div>
        </div>

      </div>
    </div>
  );
}

export default TechCalc;
