import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TechCalc() {
  const navigate = useNavigate();

  // 1. Local AI Model VRAM Estimator
  const [paramsB, setParamsB] = useState('8'); // Billions
  const [quantBits, setQuantBits] = useState('4'); // bits per weight

  // 2. Mesh Network Fresnel Zone
  const [linkDistance, setLinkDistance] = useState('5'); // km
  const [freqGhz, setFreqGhz] = useState('2.4'); // GHz (standard WiFi/Mesh)

  // 3. RAID Array Architect
  const [driveSize, setDriveSize] = useState('4'); // TB
  const [driveCount, setDriveCount] = useState('4');
  const [raidType, setRaidType] = useState('5');

  // 4. Data Transfer (Real-World)
  const [fileSizeGB, setFileSizeGB] = useState('50');
  const [speedMbps, setSpeedMbps] = useState('300');

  // 5. Advanced Subnet
  const [cidr, setCidr] = useState('24');

  // --- Calculations ---

  // 1. AI VRAM
  let vramBase = 0, vramTotal = 0;
  if (paramsB && quantBits) {
    // 1 Billion parameters = 1 GB at 8-bit precision. 
    // Base VRAM = (Params * Quantization) / 8
    vramBase = (parseFloat(paramsB) * parseFloat(quantBits)) / 8;
    // Add 20% overhead for Context Window (KV Cache)
    vramTotal = vramBase * 1.2;
  }

  // 2. Fresnel Zone (Max radius at center of link)
  // R = 8.656 * sqrt(D / f) where D is km, f is GHz. R is in meters.
  let fresnelRadiusM = 0, fresnelRadiusFt = 0, earthClearanceFt = 0;
  if (linkDistance && freqGhz) {
    const d = parseFloat(linkDistance);
    const f = parseFloat(freqGhz);
    fresnelRadiusM = 8.656 * Math.sqrt(d / f);
    fresnelRadiusFt = fresnelRadiusM * 3.28084;
    // Standard rule: 60% of Fresnel zone must be clear of obstructions
    earthClearanceFt = fresnelRadiusFt * 0.6;
  }

  // 3. RAID Storage
  let usableCapacity = 0, faultTolerance = '';
  if (driveSize && driveCount && raidType) {
    const size = parseFloat(driveSize);
    const count = parseInt(driveCount);
    
    switch(raidType) {
      case '0':
        usableCapacity = size * count;
        faultTolerance = '0 Drives (High Risk)';
        break;
      case '1':
        usableCapacity = size * (count / 2);
        faultTolerance = '1 Drive per Mirrored Pair';
        break;
      case '5':
        if (count >= 3) {
          usableCapacity = size * (count - 1);
          faultTolerance = '1 Drive Total';
        } else {
          faultTolerance = 'Requires Min 3 Drives';
        }
        break;
      case '6':
        if (count >= 4) {
          usableCapacity = size * (count - 2);
          faultTolerance = '2 Drives Total';
        } else {
          faultTolerance = 'Requires Min 4 Drives';
        }
        break;
      case '10':
        if (count >= 4 && count % 2 === 0) {
          usableCapacity = size * (count / 2);
          faultTolerance = '1 Drive per Sub-Array';
        } else {
          faultTolerance = 'Requires Min 4 Drives (Even Number)';
        }
        break;
      default:
        break;
    }
  }

  // 4. Data Transfer (with 10% TCP/IP Overhead)
  let transferHours = 0, transferMinutes = 0, transferSeconds = 0;
  if (fileSizeGB && speedMbps) {
    const megabits = parseFloat(fileSizeGB) * 8192; // 1 GB = 1024 MB * 8 bits
    const realWorldSpeed = parseFloat(speedMbps) * 0.9; // 10% protocol overhead loss
    const totalSeconds = megabits / realWorldSpeed;
    
    transferHours = Math.floor(totalSeconds / 3600);
    transferMinutes = Math.floor((totalSeconds % 3600) / 60);
    transferSeconds = Math.floor(totalSeconds % 60);
  }

  // 5. IPv4 Subnet
  let hosts = 0, subnetMask = '';
  if (cidr) {
    const c = parseInt(cidr);
    if (c >= 0 && c <= 32) {
      if (c === 32) hosts = 1;
      else if (c === 31) hosts = 2;
      else hosts = Math.pow(2, 32 - c) - 2;

      // Calculate dotted decimal mask
      let maskNum = (0xffffffff << (32 - c)) >>> 0;
      subnetMask = [
        (maskNum >>> 24) & 255,
        (maskNum >>> 16) & 255,
        (maskNum >>> 8) & 255,
        maskNum & 255
      ].join('.');
    } else {
      subnetMask = 'Invalid CIDR';
    }
  }

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Hardware & Networking</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* 1. Local AI Engine */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #a55eea', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🧠 Local AI VRAM Estimator</h3>
          <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}>Calculates GPU VRAM required to host local LLMs, factoring in KV Cache overhead.</p>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#a55eea', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Parameters (Billions)</label>
              <input type="number" placeholder="8" value={paramsB} onChange={e => setParamsB(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Quantization</label>
              <select value={quantBits} onChange={e => setQuantBits(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}>
                <option value="4">4-Bit (Standard GGUF)</option>
                <option value="8">8-Bit (High Quality)</option>
                <option value="16">16-Bit (FP16 Raw)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Model Weight Size:</span><span style={{ color: '#fff', fontWeight: 'bold' }}>{vramBase.toFixed(1)} GB</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', paddingTop: '8px', borderTop: '1px dashed #333' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Req. VRAM (w/ Cache):</span><span style={{ color: '#a55eea', fontWeight: 'bold' }}>{vramTotal.toFixed(1)} GB</span></div>
          </div>
        </div>

        {/* 2. Mesh Networking */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00ffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>📡 Mesh Network (Fresnel Zone)</h3>
          <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}>Line-of-Sight is not enough. Calculates the required radius to clear the RF "football" for off-grid directional antennas.</p>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Link Distance (km)</label>
              <input type="number" placeholder="5" value={linkDistance} onChange={e => setLinkDistance(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Frequency (GHz)</label>
              <input type="number" placeholder="2.4" value={freqGhz} onChange={e => setFreqGhz(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Max RF Radius:</span><span style={{ color: '#fff', fontWeight: 'bold' }}>{fresnelRadiusFt.toFixed(1)} ft</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', paddingTop: '8px', borderTop: '1px dashed #333' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Required Tower/Mast Height:</span><span style={{ color: '#00ffff', fontWeight: 'bold' }}>{earthClearanceFt.toFixed(1)} ft</span></div>
            <div style={{ color: '#888', fontSize: '0.75em', marginTop: '5px', textAlign: 'center' }}>(Accounts for 60% absolute clearance threshold)</div>
          </div>
        </div>

        {/* 3. RAID Storage Array */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ffaa00', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🗄️ RAID Array Architect</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#ffaa00', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Drive Size (TB)</label>
              <input type="number" placeholder="4" value={driveSize} onChange={e => setDriveSize(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Drive Count</label>
              <input type="number" placeholder="4" value={driveCount} onChange={e => setDriveCount(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>RAID Type</label>
              <select value={raidType} onChange={e => setRaidType(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}>
                <option value="0">RAID 0</option>
                <option value="1">RAID 1</option>
                <option value="5">RAID 5</option>
                <option value="6">RAID 6</option>
                <option value="10">RAID 10</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Fault Tolerance:</span><span style={{ color: '#ff4444', fontWeight: 'bold' }}>{faultTolerance}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', paddingTop: '8px', borderTop: '1px dashed #333' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Usable Capacity:</span><span style={{ color: '#ffaa00', fontWeight: 'bold' }}>{usableCapacity > 0 ? usableCapacity.toFixed(1) : 0} TB</span></div>
          </div>
        </div>

        {/* 4. Subnet & IP */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🌐 IPv4 Subnet Allocator</h3>
          <label style={{ display: 'block', color: '#00cc66', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '4px' }}>CIDR Notation (e.g. 24 for /24)</label>
          <input type="number" placeholder="24" value={cidr} onChange={e => setCidr(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Subnet Mask:</span><span style={{ color: '#fff', fontWeight: 'bold' }}>{subnetMask}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', paddingTop: '8px', borderTop: '1px dashed #333' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Usable Host IPs:</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{hosts.toLocaleString()}</span></div>
          </div>
        </div>

        {/* 5. Real-World Data Transfer */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ff4444', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🚀 Data Transfer (w/ TCP Overhead)</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#ff4444', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>File Size (GB)</label>
              <input type="number" placeholder="50" value={fileSizeGB} onChange={e => setFileSizeGB(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Network Speed (Mbps)</label>
              <input type="number" placeholder="300" value={speedMbps} onChange={e => setSpeedMbps(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Est. Transfer Time:</span>
            <span style={{ color: '#00ffff', fontWeight: 'bold' }}>{transferHours}h {transferMinutes}m {transferSeconds}s</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TechCalc;
