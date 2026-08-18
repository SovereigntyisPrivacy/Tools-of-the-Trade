import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TechCalc() {
  const navigate = useNavigate();

  // Bandwidth
  const [fileSize, setFileSize] = useState('');
  const [networkSpeed, setNetworkSpeed] = useState('');

  // Subnet
  const [cidr, setCidr] = useState('24');

  // Math
  const gb = parseFloat(fileSize) || 0;
  const mbps = parseFloat(networkSpeed) || 1;
  const transferSeconds = (gb * 8192) / mbps;
  const hrs = Math.floor(transferSeconds / 3600);
  const mins = Math.floor((transferSeconds % 3600) / 60);

  const cidrNum = parseInt(cidr) || 32;
  const usableIps = cidrNum < 31 ? Math.pow(2, 32 - cidrNum) - 2 : 0;

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Tech & Network</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* Bandwidth */}
        <div className="input-card" style={{ borderTop: '4px solid #00ffff' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>📡 Data Transfer</h3>
          
          <label>File Size (Gigabytes)</label>
          <input type="number" placeholder="e.g. 50" value={fileSize} onChange={(e) => setFileSize(e.target.value)} style={{ marginBottom: '15px' }} />
          
          <label>Network Speed (Mbps)</label>
          <input type="number" placeholder="e.g. 300" value={networkSpeed} onChange={(e) => setNetworkSpeed(e.target.value)} />

          <div className="result-card" style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', border: 'none', boxShadow: 'none' }}>
            <div className="result-row net-pay" style={{ margin: 0, fontSize: '1.2em' }}>
              <span>Est. Transfer Time:</span>
              <span style={{ color: '#00ffff' }}>{hrs}h {mins}m</span>
            </div>
          </div>
        </div>

        {/* Subnet */}
        <div className="input-card" style={{ borderTop: '4px solid #ffaa00' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>🌐 IPv4 Subnet Allocator</h3>
          
          <label>CIDR Notation (e.g. 24 for /24)</label>
          <input type="number" placeholder="24" value={cidr} onChange={(e) => setCidr(e.target.value)} />

          <div className="result-card" style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', border: 'none', boxShadow: 'none' }}>
            <div className="result-row net-pay" style={{ margin: 0, fontSize: '1.2em' }}>
              <span>Usable Host IPs:</span>
              <span style={{ color: '#00cc66' }}>{usableIps}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TechCalc;
