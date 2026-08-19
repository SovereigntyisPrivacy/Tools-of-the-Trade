import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TechCalc() {
  const navigate = useNavigate();

  // 1. AI VRAM Estimator
  const [paramsB, setParamsB] = useState('8');
  const [quantBits, setQuantBits] = useState('4');

  // 2. Mesh Network (Fresnel & RF Link Budget)
  const [linkDistance, setLinkDistance] = useState('5'); 
  const [freqGhz, setFreqGhz] = useState('2.4'); 
  const [txPowerDbm, setTxPowerDbm] = useState('20'); 
  const [txGainDbi, setTxGainDbi] = useState('12'); 
  const [rxGainDbi, setRxGainDbi] = useState('12'); 
  const [rxSensitivity, setRxSensitivity] = useState('-85'); 

  // 3. RAID Storage Array
  const [driveSize, setDriveSize] = useState('4');
  const [driveCount, setDriveCount] = useState('4');
  const [raidType, setRaidType] = useState('5');

  // 4. IPv4 Subnet & Data Transfer
  const [cidr, setCidr] = useState('24');
  const [fileSizeGB, setFileSizeGB] = useState('50');
  const [speedMbps, setSpeedMbps] = useState('300');

  // 5. Game Dev: Texture & VRAM
  const [texW, setTexW] = useState('4096');
  const [texH, setTexH] = useState('4096');
  const [texFormat, setTexFormat] = useState('32');
  const [hasMipmaps, setHasMipmaps] = useState(true);
  const [targetFps, setTargetFps] = useState('60');

  // 6. Embedded Hardware: IoT Battery
  const [battMah, setBattMah] = useState('2500');
  const [activeMa, setActiveMa] = useState('120');
  const [sleepUa, setSleepUa] = useState('10');
  const [activeMs, setActiveMs] = useState('500');
  const [wakeSec, setWakeSec] = useState('60');

  // 7. Node & Crypto Efficiency
  const [hashrate, setHashrate] = useState('45000'); 
  const [powerDrawWatts, setPowerDrawWatts] = useState('150'); 
  const [powerCostKwh, setPowerCostKwh] = useState('0.14'); 

  // 8. 3D Printing & Prototyping
  const [printGrams, setPrintGrams] = useState('150');
  const [spoolCost, setSpoolCost] = useState('25.00'); // Cost per 1kg (1000g)
  
  // 9. Video Stream / Camera Storage
  const [camBitrate, setCamBitrate] = useState('4'); // Mbps (Standard 1080p stream)
  const [recordDays, setRecordDays] = useState('7');

  // --- Calculations ---

  // AI VRAM
  let vramTotal = 0;
  if (paramsB && quantBits) {
    vramTotal = ((parseFloat(paramsB) * parseFloat(quantBits)) / 8) * 1.2;
  }

  // Mesh Network RF Math
  let earthClearanceFt = 0, fspl = 0, linkMargin = 0;
  if (linkDistance && freqGhz) {
    const d = parseFloat(linkDistance), f = parseFloat(freqGhz);
    earthClearanceFt = (8.656 * Math.sqrt(d / f)) * 3.28084 * 0.6;
    fspl = (20 * Math.log10(d)) + (20 * Math.log10(f)) + 92.45;
    linkMargin = (parseFloat(txPowerDbm) || 0) + (parseFloat(txGainDbi) || 0) + (parseFloat(rxGainDbi) || 0) - fspl - (parseFloat(rxSensitivity) || -85);
  }

  // RAID
  let usableCapacity = 0, faultTolerance = '';
  if (driveSize && driveCount && raidType) {
    const size = parseFloat(driveSize), count = parseInt(driveCount);
    switch(raidType) {
      case '0': usableCapacity = size * count; faultTolerance = '0 Drives'; break;
      case '1': usableCapacity = size * (count / 2); faultTolerance = '1 Drive/Pair'; break;
      case '5': usableCapacity = count >= 3 ? size * (count - 1) : 0; faultTolerance = count >= 3 ? '1 Drive' : 'Min 3'; break;
      case '6': usableCapacity = count >= 4 ? size * (count - 2) : 0; faultTolerance = count >= 4 ? '2 Drives' : 'Min 4'; break;
      case '10': usableCapacity = (count >= 4 && count % 2 === 0) ? size * (count / 2) : 0; faultTolerance = '1 Drive/Sub'; break;
      default: break;
    }
  }

  // Subnet & Data Transfer
  let hosts = 0, subnetMask = '', tHrs = 0, tMins = 0;
  if (cidr) {
    const c = parseInt(cidr);
    if (c >= 0 && c <= 32) {
      hosts = c === 32 ? 1 : c === 31 ? 2 : Math.pow(2, 32 - c) - 2;
      let maskNum = (0xffffffff << (32 - c)) >>> 0;
      subnetMask = [(maskNum >>> 24) & 255, (maskNum >>> 16) & 255, (maskNum >>> 8) & 255, maskNum & 255].join('.');
    }
  }
  if (fileSizeGB && speedMbps) {
    const tSec = (parseFloat(fileSizeGB) * 8192) / (parseFloat(speedMbps) * 0.9);
    tHrs = Math.floor(tSec / 3600); tMins = Math.floor((tSec % 3600) / 60);
  }

  // Game Dev
  let texSizeMB = 0, frameMs = targetFps ? 1000 / parseFloat(targetFps) : 0;
  if (texW && texH && texFormat) {
    let bytes = (parseFloat(texW) * parseFloat(texH) * parseFloat(texFormat)) / 8;
    if (hasMipmaps) bytes *= 1.3333; 
    texSizeMB = bytes / 1024 / 1024;
  }

  // IoT Battery
  let iotYears = 0;
  if (battMah && activeMa && sleepUa && activeMs && wakeSec) {
    const actT = parseFloat(activeMs) / 1000, interval = parseFloat(wakeSec);
    if (interval > actT) {
      const dutyCycle = actT / interval;
      const avgCurrent = (parseFloat(activeMa) * dutyCycle) + ((parseFloat(sleepUa) / 1000) * (1 - dutyCycle));
      iotYears = (parseFloat(battMah) / avgCurrent) / 24 / 365.25;
    }
  }

  // Node Efficiency
  let effHashWatt = 0, monthlyCost = 0;
  if (hashrate && powerDrawWatts && powerCostKwh) {
    const w = parseFloat(powerDrawWatts);
    if (w > 0) {
      effHashWatt = parseFloat(hashrate) / w;
      monthlyCost = (w / 1000) * 24 * parseFloat(powerCostKwh) * 30.44;
    }
  }

  // 3D Printing Cost
  let partCost = 0;
  if (printGrams && spoolCost) {
    partCost = (parseFloat(printGrams) / 1000) * parseFloat(spoolCost);
  }

  // Video Stream Storage
  let storageGB = 0;
  if (camBitrate && recordDays) {
    // Mbps to GB per day = (Mbps * 60 * 60 * 24) / 8192
    const gbPerDay = (parseFloat(camBitrate) * 86400) / 8192;
    storageGB = gbPerDay * parseFloat(recordDays);
  }

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Tech & Engineering</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* RF Link Budget */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00ffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>📡 Mesh RF Link Architect</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px' }}>Dist (km)</label><input type="number" value={linkDistance} onChange={e => setLinkDistance(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Freq (GHz)</label><input type="number" value={freqGhz} onChange={e => setFreqGhz(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>TX (dBm)</label><input type="number" value={txPowerDbm} onChange={e => setTxPowerDbm(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>TX Gain</label><input type="number" value={txGainDbi} onChange={e => setTxGainDbi(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>RX Gain</label><input type="number" value={rxGainDbi} onChange={e => setRxGainDbi(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Min Tower Height:</span><span style={{ color: '#fff', fontWeight: 'bold' }}>{earthClearanceFt.toFixed(1)} ft</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', paddingTop: '8px', borderTop: '1px dashed #333' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Fade Margin:</span><span style={{ color: linkMargin > 10 ? '#00cc66' : '#ffaa00', fontWeight: 'bold' }}>{linkMargin.toFixed(1)} dB</span></div>
          </div>
        </div>

        {/* Node Power & 3D Prototyping */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexDirection: 'column' }}>
          
          <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ffaa00', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>⛏️ Node Power Cost</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}><input type="number" placeholder="Watts" value={powerDrawWatts} onChange={e => setPowerDrawWatts(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
              <div style={{ flex: 1 }}><input type="number" placeholder="$ / kWh" value={powerCostKwh} onChange={e => setPowerCostKwh(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em' }}><span style={{ color: '#aaa' }}>Monthly Burn:</span><span style={{ color: '#ff4444', fontWeight: 'bold' }}>${monthlyCost.toFixed(2)}</span></div>
          </div>

          <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #e67e22', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🖨️ 3D Print Cost Estimator</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Part Wt. (g)</label><input type="number" value={printGrams} onChange={e => setPrintGrams(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
              <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Spool (1kg) $</label><input type="number" value={spoolCost} onChange={e => setSpoolCost(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em' }}><span style={{ color: '#aaa' }}>Material Cost:</span><span style={{ color: '#e67e22', fontWeight: 'bold' }}>${partCost.toFixed(2)}</span></div>
          </div>

        </div>

        {/* Video Storage & Network */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #3498db', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>📹 Camera Stream Storage</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Bitrate (Mbps)</label><input type="number" value={camBitrate} onChange={e => setCamBitrate(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Record Days</label><input type="number" value={recordDays} onChange={e => setRecordDays(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em' }}><span style={{ color: '#aaa' }}>Required Disk:</span><span style={{ color: '#3498db', fontWeight: 'bold' }}>{storageGB > 1024 ? (storageGB / 1024).toFixed(2) + ' TB' : storageGB.toFixed(1) + ' GB'}</span></div>
        </div>

        {/* Subnet & Restored Data Transfer */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #444', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🌐 Network Specs</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', marginBottom: '10px' }}><span style={{ color: '#aaa' }}>Subnet CIDR:</span><input type="number" value={cidr} onChange={e => setCidr(e.target.value)} style={{ width: '60px', padding: '5px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '5px', textAlign: 'center' }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', marginBottom: '20px' }}><span style={{ color: '#aaa' }}>Usable IPs:</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{hosts.toLocaleString()}</span></div>
          
          <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Data Transfer (Size GB / Speed Mbps)</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input type="number" placeholder="50 GB" value={fileSizeGB} onChange={e => setFileSizeGB(e.target.value)} style={{ flex: 1, padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            <input type="number" placeholder="300 Mbps" value={speedMbps} onChange={e => setSpeedMbps(e.target.value)} style={{ flex: 1, padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Est. Time (w/ Overhead):</span><span style={{ color: '#fff', fontWeight: 'bold' }}>{tHrs}h {tMins}m</span></div>
        </div>

        {/* AI VRAM & IoT & Engine */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ background: 'rgba(20,20,20,0.8)', borderLeft: '4px solid #a55eea', borderRadius: '8px', padding: '15px' }}>
            <div style={{ color: '#a55eea', fontWeight: 'bold', marginBottom: '10px' }}>🧠 AI VRAM Estimator</div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input type="number" placeholder="Params (B)" value={paramsB} onChange={e => setParamsB(e.target.value)} style={{ flex: 1, padding: '8px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '5px' }} />
              <select value={quantBits} onChange={e => setQuantBits(e.target.value)} style={{ flex: 1, padding: '8px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '5px' }}><option value="4">4-Bit</option><option value="8">8-Bit</option></select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>Total VRAM:</span><span style={{ color: '#fff', fontWeight: 'bold' }}>{vramTotal.toFixed(1)} GB</span></div>
          </div>

          <div style={{ background: 'rgba(20,20,20,0.8)', borderLeft: '4px solid #00cc66', borderRadius: '8px', padding: '15px' }}>
            <div style={{ color: '#00cc66', fontWeight: 'bold', marginBottom: '10px' }}>🔋 IoT Battery Lifespan</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>Deep Sleep Target:</span><span style={{ color: '#fff', fontWeight: 'bold' }}>{iotYears.toFixed(2)} Years</span></div>
          </div>

          <div style={{ background: 'rgba(20,20,20,0.8)', borderLeft: '4px solid #ff00ff', borderRadius: '8px', padding: '15px' }}>
            <div style={{ color: '#ff00ff', fontWeight: 'bold', marginBottom: '10px' }}>🎮 Frame Budget</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <input type="number" value={targetFps} onChange={e => setTargetFps(e.target.value)} style={{ width: '80px', padding: '8px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '5px', textAlign: 'center' }} />
              <span style={{ color: '#fff', fontWeight: 'bold' }}>{frameMs.toFixed(2)} ms</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TechCalc;
