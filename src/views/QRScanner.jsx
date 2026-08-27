import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { QRCodeCanvas } from 'qrcode.react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export default function QRScanner() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('scanner');
  
  const [scanResult, setScanResult] = useState(null);
  const [savedScans, setSavedScans] = useState(() => JSON.parse(localStorage.getItem('tot_saved_scans')) || []);
  const [scanNote, setScanNote] = useState('');

  const [createData, setCreateData] = useState('');
  const [qrTitle, setQrTitle] = useState('');
  const [myQRs, setMyQRs] = useState(() => JSON.parse(localStorage.getItem('tot_my_qrs')) || []);

  useEffect(() => {
    localStorage.setItem('tot_saved_scans', JSON.stringify(savedScans));
    localStorage.setItem('tot_my_qrs', JSON.stringify(myQRs));
  }, [savedScans, myQRs]);

  // --- NATIVE CAMERA DECODER (BYPASSES WEBVIEW PERMISSION) ---
  const scanNativeCamera = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      
      const response = await fetch(photo.webPath);
      const blob = await response.blob();
      const file = new File([blob], 'qr_capture.jpg', { type: 'image/jpeg' });
      
      const html5QrCode = new Html5Qrcode("hidden-qr-canvas");
      const decodedText = await html5QrCode.scanFile(file, true);
      setScanResult(decodedText);
    } catch (err) {
      if (err.message && err.message.includes('User cancelled')) return;
      alert("No QR code detected in that photo. Make sure it's clear and in focus.");
    }
  };

  const scanImageFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const html5QrCode = new Html5Qrcode("hidden-qr-canvas");
    html5QrCode.scanFile(e.target.files[0], true)
      .then(decodedText => setScanResult(decodedText))
      .catch(err => alert("No QR code detected in that image."));
    e.target.value = null;
  };

  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); alert("Copied!"); };
  const openLink = (text) => {
    if (text.startsWith('http://') || text.startsWith('https://')) window.open(text, '_blank', 'noopener,noreferrer');
    else window.open(`https://duckduckgo.com/?q=${encodeURIComponent(text)}`, '_blank');
  };

  const saveScan = () => {
    setSavedScans([{ id: Date.now(), data: scanResult, note: scanNote, date: new Date().toLocaleDateString() }, ...savedScans]);
    setScanNote(''); alert("Saved to Log!"); setActiveTab('saved');
  };
  const deleteScan = (id) => { if(window.confirm("Delete this scan?")) setSavedScans(savedScans.filter(s => s.id !== id)); };
  
  const saveGeneratedQR = () => {
    if (!qrTitle) return alert("Please add a title.");
    const canvas = document.getElementById('qr-canvas');
    if (!canvas) return;
    setMyQRs([{ id: Date.now(), title: qrTitle, data: createData, date: new Date().toLocaleDateString(), image: canvas.toDataURL('image/png') }, ...myQRs]);
    alert("Saved to Vault!"); setCreateData(''); setQrTitle(''); setActiveTab('vault');
  };
  const deleteVaultQR = (id) => { if(window.confirm("Delete this QR?")) setMyQRs(myQRs.filter(q => q.id !== id)); };

  const cardStyle = { background: 'rgba(17, 17, 17, 0.95)', borderRadius: '12px', border: '1px solid #222', padding: '20px', marginBottom: '15px' };
  const inputStyle = { background: '#000', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '6px', width: '100%', marginBottom: '15px', fontSize: '1em' };
  const btnStyle = (bg, color) => ({ background: bg, color: color, border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', width: '100%', fontSize: '1.1em', cursor: 'pointer' });

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
          <h2 style={{ margin: 0, color: '#06b6d4', fontSize: '1.2em' }}>Universal Lens</h2>
        </div>
      </header>

      <div style={{ display: 'flex', padding: '15px', gap: '8px', background: 'rgba(0,0,0,0.6)', overflowX: 'auto' }}>
        <button onClick={() => { setActiveTab('scanner'); setScanResult(null); }} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'scanner' ? '#06b6d4' : '#222', color: activeTab === 'scanner' ? '#000' : '#888' }}>Scan</button>
        <button onClick={() => setActiveTab('create')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'create' ? '#a855f7' : '#222', color: activeTab === 'create' ? '#fff' : '#888' }}>Create</button>
        <button onClick={() => setActiveTab('saved')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'saved' ? '#10b981' : '#222', color: activeTab === 'saved' ? '#000' : '#888' }}>Scan Log</button>
        <button onClick={() => setActiveTab('vault')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'vault' ? '#f59e0b' : '#222', color: activeTab === 'vault' ? '#000' : '#888' }}>My QRs</button>
      </div>

      <div id="hidden-qr-canvas" style={{ width: '0px', height: '0px', overflow: 'hidden' }}></div>
      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        
        {activeTab === 'scanner' && (
          <>
            {!scanResult ? (
              <div style={{ ...cardStyle, borderTop: '4px solid #06b6d4', textAlign: 'center', marginTop: '20px' }}>
                <h3 style={{ color: '#06b6d4', marginTop: 0, textTransform: 'uppercase' }}>Snap to Decode</h3>
                <p style={{ color: '#888', fontSize: '0.9em', marginBottom: '20px', lineHeight: '1.5' }}>Use your native camera to snap a photo of a code, or extract one from your gallery.</p>
                <button onClick={scanNativeCamera} style={{ ...btnStyle('#06b6d4', '#000'), marginBottom: '15px' }}>📷 Take Photo of Code</button>
                <label style={{ ...btnStyle('transparent', '#a855f7'), border: '1px dashed #a855f7', display: 'block' }}>
                  🖼️ Scan from Gallery
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={scanImageFile} />
                </label>
              </div>
            ) : (
              <div style={{ ...cardStyle, borderTop: '4px solid #10b981', marginTop: '20px' }}>
                <h2 style={{ color: '#10b981', margin: '0 0 15px 0', textAlign: 'center' }}>SCAN SUCCESS</h2>
                <div style={{ background: '#0a0a0a', border: '1px solid #333', padding: '15px', borderRadius: '8px', marginBottom: '20px', wordWrap: 'break-word', fontFamily: 'monospace', fontSize: '1.1em', color: '#fff' }}>{scanResult}</div>
                <input type="text" placeholder="Add a Note (e.g. WiFi Password)" value={scanNote} onChange={(e) => setScanNote(e.target.value)} style={inputStyle} />
                <button onClick={saveScan} style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '15px' }}>💾 Save to Scan Log</button>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <button onClick={() => copyToClipboard(scanResult)} style={{ flex: 1, background: '#a855f7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>📋 Copy</button>
                  <button onClick={() => openLink(scanResult)} style={{ flex: 1, background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>🌐 Open</button>
                </div>
                <button onClick={() => setScanResult(null)} style={{ width: '100%', background: 'transparent', color: '#06b6d4', border: '1px dashed #06b6d4', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>📷 Scan Another</button>
              </div>
            )}
          </>
        )}
        {activeTab === 'create' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #a855f7', textAlign: 'center', marginTop: '20px' }}>
            <h2 style={{ color: '#a855f7', marginTop: 0, textTransform: 'uppercase' }}>Offline Generator</h2>
            <textarea placeholder="Enter data..." value={createData} onChange={(e) => setCreateData(e.target.value)} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} />
            {createData && (
              <>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', display: 'inline-block', marginBottom: '15px' }}><QRCodeCanvas id="qr-canvas" value={createData} size={200} /></div>
                <input type="text" placeholder="Title (e.g. My BTC Wallet)" value={qrTitle} onChange={(e) => setQrTitle(e.target.value)} style={{ ...inputStyle, textAlign: 'center' }} />
                <button onClick={saveGeneratedQR} style={{ width: '100%', background: '#f59e0b', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>💾 Save to My QRs</button>
              </>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div style={{ marginTop: '20px' }}>
            {savedScans.map((scan) => (
              <div key={scan.id} style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>{scan.date}</span>
                {scan.note && <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>{scan.note}</h3>}
                <div style={{ background: '#0a0a0a', padding: '10px', borderRadius: '6px', border: '1px solid #333', color: '#ccc', fontFamily: 'monospace', wordWrap: 'break-word', marginBottom: '15px' }}>{scan.data}</div>
                <button onClick={() => deleteScan(scan.id)} style={{ width: '100%', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '8px', borderRadius: '6px', fontWeight: 'bold' }}>🗑️ Delete</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'vault' && (
          <div style={{ marginTop: '20px' }}>
            {myQRs.map((qr) => (
              <div key={qr.id} style={{ ...cardStyle, borderTop: '4px solid #f59e0b', textAlign: 'center' }}>
                <h3 style={{ color: '#fff', margin: '0 0 5px 0', textTransform: 'uppercase' }}>{qr.title}</h3>
                <span style={{ color: '#888', fontSize: '0.8em', display: 'block', marginBottom: '15px' }}>{qr.date}</span>
                <div style={{ background: '#fff', padding: '15px', borderRadius: '12px', display: 'inline-block', marginBottom: '15px' }}><img src={qr.image} alt={qr.title} style={{ width: '200px', height: '200px' }} /></div>
                <button onClick={() => deleteVaultQR(qr.id)} style={{ width: '100%', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>🗑️ Delete</button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
