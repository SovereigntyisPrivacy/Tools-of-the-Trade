import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TechCalc() {
  const navigate = useNavigate();

  // 1. AI VRAM Estimator
  const [paramsB, setParamsB] = useState('8');
  const [quantBits, setQuantBits] = useState('4');

  // 2. Mesh Network Fresnel Zone
  const [linkDistance, setLinkDistance] = useState('5');
  const [freqGhz, setFreqGhz] = useState('2.4');

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
  const [texFormat, setTexFormat] = useState('32'); // Bits per pixel (RGBA8)
  const [hasMipmaps, setHasMipmaps] = useState(true);

  // 7. Game Dev: Frame Budget
  const [targetFps, setTargetFps] = useState('60');

  // 8. Embedded Hardware: IoT Battery
  const [battMah, setBattMah] = useState('2500'); // Standard 18650
  const [activeMa, setActiveMa] = useState('120'); // mA during transmission
  const [sleepUa, setSleepUa] = useState('10'); // uA during deep sleep
  const [activeMs, setActiveMs] = useState('500'); // milliseconds awake
  const [wakeSec, setWakeSec] = useState('60'); // wake up every X seconds

  // --- Calculations ---

  // 1. AI VRAM
  let vramBase = 0, vramTotal = 0;
  if (paramsB && quantBits) {
    vramBase = (parseFloat(paramsB) * parseFloat(quantBits)) / 8;
    vramTotal = vramBase * 1.2; // 20% KV Cache overhead
  }

  // 2. Fresnel Zone
  let fresnelRadiusFt = 0, earthClearanceFt = 0;
  if (linkDistance && freqGhz) {
    const d = parseFloat(linkDistance);
    const f = parseFloat(freqGhz);
    const rMeters = 8.656 * Math.sqrt(d / f);
    fresnelRadiusFt = rMeters * 3.28084;
    earthClearanceFt = fresnelRadiusFt * 0.6;
  }

  // 3. RAID
  let usableCapacity = 0, faultTolerance = '';
  if (driveSize && driveCount && raidType) {
    const size = parseFloat(driveSize), count = parseInt(driveCount);
    switch(raidType) {
      case '0': usableCapacity = size * count; faultTolerance = '0 Drives'; break;
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

  // 6. Game Dev Texture VRAM
  let texSizeMB = 0;
  if (texW && texH && texFormat) {
    const w = parseFloat(texW);
    const h = parseFloat(texH);
    const bpp = parseFloat(texFormat);
    let bytes = (w * h * bpp) / 8;
    if (hasMipmaps) bytes = bytes * 1.3333; // Mipmaps add ~33% overhead
    texSizeMB = bytes / 1024 / 1024;
  }

  // 7. Game Dev Frame Budget
  let frameMs = 0;
  if (targetFps) {
    frameMs = 1000 / parseFloat(targetFps);
  }

  // 8. IoT Deep Sleep Battery
  let iotDays = 0, iotYears = 0;
  if (battMah && activeMa && sleepUa && activeMs && wakeSec) {
    const cap = parseFloat(battMah);
    const actI = parseFloat(activeMa);
    const slpI = parseFloat(sleepUa) / 1000; // convert uA to mA
    const actT = parseFloat(activeMs) / 1000; // convert ms to seconds
    const interval = parseFloat(wakeSec);
    
    if (interval > actT) {
      const dutyCycle = actT / interval;
      const avgCurrent = (actI * dutyCycle) + (slpI * (1 - dutyCycle));
      const hours = cap / avgCurrent;
      iotDays = hours / 24;
      iotYears = iotDays / 365.25;
    }
  }

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Tech & Engineering</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* Game Dev: Frame & Texture */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ff00ff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🎮 Game Engine Architect</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <label style={{ color: '#ff00ff', fontWeight: 'bold' }}>Target FPS:</label>
            <input type="number" placeholder="60" value={targetFps} onChange={e => setTargetFps(e.target.value)} style={{ width: '80px', padding: '8px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', textAlign: 'center' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333', marginBottom: '20px' }}>
            <span style={{ color: '#aaa' }}>Max Frame Budget:</span>
            <span style={{ color: '#ff00ff', fontWeight: 'bold' }}>{frameMs.toFixed(2)} ms</span>
          </div>

          <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Texture Resolution (W x H)</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input type="number" placeholder="4096" value={texW} onChange={e => setTexW(e.target.value)} style={{ flex: 1, padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            <input type="number" placeholder="4096" value={texH} onChange={e => setTexH(e.target.value)} style={{ flex: 1, padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Bit Format</label>
              <select value={texFormat} onChange={e => setTexFormat(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}>
                <option value="24">RGB8 (No Alpha - 24bpp)</option>
                <option value="32">RGBA8 (Standard - 32bpp)</option>
                <option value="64">RGBA16F (HDR/Normal - 64bpp)</option>
              </select>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={() => setHasMipmaps(!hasMipmaps)} style={{ width: '100%', padding: '10px', background: hasMipmaps ? '#00cc66' : '#444', color: hasMipmaps ? '#000' : '#aaa', fontWeight: 'bold', border: 'none', borderRadius: '8px' }}>
                {hasMipmaps ? '+ Mipmaps' : 'No Mips'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}>
            <span style={{ color: '#aaa' }}>Uncompressed VRAM:</span>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>{texSizeMB.toFixed(2)} MB</span>
          </div>
        </div>

        {/* Embedded Hardware: IoT Deep Sleep */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🔋 Embedded IoT Battery Life</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00cc66', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Capacity (mAh)</label>
              <input type="number" placeholder="2500" value={battMah} onChange={e => setBattMah(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Wake Interval (Sec)</label>
              <input type="number" placeholder="60" value={wakeSec} onChange={e => setWakeSec(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#ffaa00', fontSize: '0.85em', marginBottom: '4px' }}>Active Draw (mA)</label>
              <input type="number" placeholder="120" value={activeMa} onChange={e => setActiveMa(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px' }}>Sleep Draw (µA)</label>
              <input type="number" placeholder="10" value={sleepUa} onChange={e => setSleepUa(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#ff4444', fontSize: '0.85em', marginBottom: '4px' }}>Active Time (ms)</label>
              <input type="number" placeholder="500" value={activeMs} onChange={e => setActiveMs(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em' }}>
              <span style={{ color: '#aaa' }}>Est. Lifespan:</span>
              <span style={{ color: '#00cc66', fontWeight: 'bold' }}>{iotDays.toFixed(1)} Days</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', paddingTop: '8px', borderTop: '1px dashed #333' }}>
              <span style={{ color: '#aaa' }}>Years:</span>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>{iotYears.toFixed(2)} Yrs</span>
            </div>
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

        {/* Fresnel Zone */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00ffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>📡 Mesh Net Fresnel Zone</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Distance (km)</label><input type="number" value={linkDistance} onChange={e => setLinkDistance(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Frequency (GHz)</label><input type="number" value={freqGhz} onChange={e => setFreqGhz(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Required Antenna Height:</span><span style={{ color: '#00ffff', fontWeight: 'bold' }}>{earthClearanceFt.toFixed(1)} ft</span></div>
        </div>

        {/* RAID Storage */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ffaa00', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🗄️ RAID Storage Architect</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}><input type="number" placeholder="Size" value={driveSize} onChange={e => setDriveSize(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
            <div style={{ flex: 1 }}><input type="number" placeholder="Count" value={driveCount} onChange={e => setDriveCount(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
            <div style={{ flex: 1 }}><select value={raidType} onChange={e => setRaidType(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}><option value="0">RAID 0</option><option value="1">RAID 1</option><option value="5">RAID 5</option><option value="6">RAID 6</option><option value="10">RAID 10</option></select></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Capacity:</span><span style={{ color: '#ffaa00', fontWeight: 'bold' }}>{usableCapacity > 0 ? usableCapacity.toFixed(1) : 0} TB</span></div>
        </div>

        {/* Network Transfer & Subnet */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #444', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', marginBottom: '15px' }}><span style={{ color: '#aaa' }}>Subnet /CIDR:</span><input type="number" value={cidr} onChange={e => setCidr(e.target.value)} style={{ width: '60px', padding: '5px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '5px', textAlign: 'center' }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', marginBottom: '15px' }}><span style={{ color: '#aaa' }}>Hosts:</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{hosts.toLocaleString()}</span></div>
        </div>

      </div>
    </div>
  );
}

export default TechCalc;
