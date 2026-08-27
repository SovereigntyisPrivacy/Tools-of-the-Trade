import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function QRScanner() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('scanner');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  
  // Saved Scans State
  const [savedScans, setSavedScans] = useState(() => JSON.parse(localStorage.getItem('tot_saved_scans')) || []);
  const [scanNote, setScanNote] = useState('');

  useEffect(() => {
    localStorage.setItem('tot_saved_scans', JSON.stringify(savedScans));
  }, [savedScans]);

  useEffect(() => {
    let scanner;
    if (activeTab === 'scanner' && isScanning) {
      scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        false
      );

      scanner.render(
        (decodedText) => {
          setScanResult(decodedText);
          setIsScanning(false);
          scanner.clear().catch(console.error);
        },
        (error) => {} // Silent frame errors
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [isScanning, activeTab]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Data copied to clipboard!");
  };

  const openLink = (text) => {
    if (text.startsWith('http://') || text.startsWith('https://')) {
      window.open(text, '_blank', 'noopener,noreferrer');
    } else {
      window.open(`https://duckduckgo.com/?q=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const saveScan = () => {
    const newScan = { id: Date.now(), data: scanResult, note: scanNote, date: new Date().toLocaleDateString() };
    setSavedScans([newScan, ...savedScans]);
    setScanNote('');
    alert("Scan saved to ledger!");
    setActiveTab('saved');
  };

  const deleteScan = (id) => {
    if(window.confirm("Delete this saved scan?")) {
      setSavedScans(savedScans.filter(s => s.id !== id));
    }
  };

  const scanAgain = () => {
    setScanResult(null);
    setScanNote('');
    setIsScanning(true);
  };

  const cardStyle = { background: 'rgba(17, 17, 17, 0.95)', borderRadius: '12px', border: '1px solid #222', padding: '20px', marginBottom: '15px' };
  const inputStyle = { background: '#000', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '6px', width: '100%', marginBottom: '15px', fontSize: '1em' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
          <h2 style={{ margin: 0, color: '#06b6d4', fontSize: '1.2em' }}>Universal Lens</h2>
        </div>
      </header>

      <div style={{ display: 'flex', padding: '15px', gap: '10px', background: 'rgba(0,0,0,0.6)' }}>
        <button onClick={() => { setActiveTab('scanner'); scanAgain(); }} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'scanner' ? '#06b6d4' : '#222', color: activeTab === 'scanner' ? '#000' : '#888' }}>Scanner</button>
        <button onClick={() => setActiveTab('saved')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'saved' ? '#10b981' : '#222', color: activeTab === 'saved' ? '#000' : '#888' }}>Saved Scans</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        
        {activeTab === 'scanner' && (
          <>
            {isScanning ? (
              <div style={{ ...cardStyle, borderTop: '4px solid #06b6d4', textAlign: 'center' }}>
                <h3 style={{ color: '#06b6d4', marginTop: 0, textTransform: 'uppercase' }}>Scan Code</h3>
                <p style={{ color: '#888', fontSize: '0.9em', marginBottom: '20px' }}>Align the code within the viewfinder.</p>
                <div id="qr-reader" style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', border: '2px solid #333', background: '#000' }}></div>
              </div>
            ) : (
              <div style={{ ...cardStyle, borderTop: '4px solid #10b981' }}>
                <h2 style={{ color: '#10b981', marginTop: 0, textAlign: 'center' }}>SCAN SUCCESS</h2>
                
                <div style={{ background: '#0a0a0a', border: '1px solid #333', padding: '15px', borderRadius: '8px', marginBottom: '20px', wordWrap: 'break-word', fontFamily: 'monospace', fontSize: '1.1em', color: '#fff' }}>
                  {scanResult}
                </div>

                <label style={{ color: '#06b6d4', fontSize: '0.85em', fontWeight: 'bold', marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Add a Note (Optional)</label>
                <input type="text" placeholder="e.g., Garage Router, Crypto Wallet..." value={scanNote} onChange={(e) => setScanNote(e.target.value)} style={inputStyle} />

                <button onClick={saveScan} style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '15px' }}>💾 Save to Ledger</button>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <button onClick={() => copyToClipboard(scanResult)} style={{ flex: 1, background: '#a855f7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>📋 Copy</button>
                  <button onClick={() => openLink(scanResult)} style={{ flex: 1, background: (scanResult.startsWith('http') || scanResult.startsWith('www')) ? '#3b82f6' : '#f59e0b', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>
                    {(scanResult.startsWith('http') || scanResult.startsWith('www')) ? '🌐 Open Link' : '🔍 Search'}
                  </button>
                </div>

                <button onClick={scanAgain} style={{ width: '100%', background: 'transparent', color: '#06b6d4', border: '1px dashed #06b6d4', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>📷 Scan Another</button>
              </div>
            )}
          </>
        )}

        {activeTab === 'saved' && (
          <>
            <h3 style={{ color: '#10b981', textAlign: 'center', textTransform: 'uppercase', marginBottom: '20px' }}>Saved Scans</h3>
            {savedScans.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No saved scans yet.</p>
            ) : (
              savedScans.map((scan) => (
                <div key={scan.id} style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9em' }}>{scan.date}</span>
                    <button onClick={() => deleteScan(scan.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontWeight: 'bold', fontSize: '1.2em', padding: 0 }}>×</button>
                  </div>
                  
                  {scan.note && <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1.2em' }}>{scan.note}</h3>}
                  
                  <div style={{ background: '#0a0a0a', padding: '10px', borderRadius: '6px', border: '1px solid #333', color: '#ccc', fontFamily: 'monospace', fontSize: '0.9em', wordWrap: 'break-word', marginBottom: '15px' }}>
                    {scan.data}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => copyToClipboard(scan.data)} style={{ flex: 1, background: '#222', color: '#a855f7', border: '1px solid #a855f7', padding: '8px', borderRadius: '6px', fontWeight: 'bold' }}>Copy</button>
                    <button onClick={() => openLink(scan.data)} style={{ flex: 1, background: '#222', color: '#3b82f6', border: '1px solid #3b82f6', padding: '8px', borderRadius: '6px', fontWeight: 'bold' }}>Open / Search</button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

      </div>
    </div>
  );
}
