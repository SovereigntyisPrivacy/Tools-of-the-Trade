import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRScanner() {
  const navigate = useNavigate();
  // 4 Tabs: Scanner, Create, Saved Scans (Data), My QRs (Images)
  const [activeTab, setActiveTab] = useState('scanner');
  
  // Scanner State
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false); // Wait for explicit start to trigger permissions
  
  // Saved Scans (Data)
  const [savedScans, setSavedScans] = useState(() => JSON.parse(localStorage.getItem('tot_saved_scans')) || []);
  const [scanNote, setScanNote] = useState('');

  // Generator & My QRs (Images)
  const [createData, setCreateData] = useState('');
  const [qrTitle, setQrTitle] = useState('');
  const [myQRs, setMyQRs] = useState(() => JSON.parse(localStorage.getItem('tot_my_qrs')) || []);

  useEffect(() => {
    localStorage.setItem('tot_saved_scans', JSON.stringify(savedScans));
    localStorage.setItem('tot_my_qrs', JSON.stringify(myQRs));
  }, [savedScans, myQRs]);


  // --- CAMERA & SCANNER LOGIC ---
  const startLiveScanner = async () => {
    try {
      // Force the Android permission prompt
      await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setIsScanning(true);
    } catch (err) {
      alert("Camera blocked. Please allow permissions in Android Settings, or use the 'Scan from Image' option below.");
    }
  };

  useEffect(() => {
    let scanner;
    if (activeTab === 'scanner' && isScanning && !scanResult) {
      scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 }, false);
      scanner.render(
        (decodedText) => { setScanResult(decodedText); setIsScanning(false); scanner.clear().catch(console.error); },
        (error) => {} // Silent errors during frame seeks
      );
    }
    return () => { if (scanner) scanner.clear().catch(console.error); };
  }, [isScanning, activeTab, scanResult]);

  const scanImageFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const html5QrCode = new Html5Qrcode("hidden-qr-canvas");
    html5QrCode.scanFile(e.target.files[0], true)
      .then(decodedText => { setScanResult(decodedText); setIsScanning(false); })
      .catch(err => alert("No QR code detected in that image. Make sure it is clear and in focus."));
    e.target.value = null;
  };

  // --- DATA ACTIONS ---
  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); alert("Copied to clipboard!"); };

  const openLink = (text) => {
    if (text.startsWith('http://') || text.startsWith('https://')) window.open(text, '_blank', 'noopener,noreferrer');
    else window.open(`https://duckduckgo.com/?q=${encodeURIComponent(text)}`, '_blank');
  };

  const saveScan = () => {
    setSavedScans([{ id: Date.now(), data: scanResult, note: scanNote, date: new Date().toLocaleDateString() }, ...savedScans]);
    setScanNote(''); alert("Scan saved!"); setActiveTab('saved');
  };

  const deleteScan = (id) => { if(window.confirm("Delete this saved scan?")) setSavedScans(savedScans.filter(s => s.id !== id)); };

  const moveScan = (index, direction) => {
    const newScans = [...savedScans];
    if (direction === 'up' && index > 0) [newScans[index - 1], newScans[index]] = [newScans[index], newScans[index - 1]];
    else if (direction === 'down' && index < newScans.length - 1) [newScans[index + 1], newScans[index]] = [newScans[index], newScans[index + 1]];
    setSavedScans(newScans);
  };

  const scanAgain = () => { setScanResult(null); setScanNote(''); setIsScanning(false); };

  // --- NEW: GENERATOR & VISUAL VAULT LOGIC ---
  const saveGeneratedQR = () => {
    if (!qrTitle) return alert("Please give your QR code a title before saving.");
    const canvas = document.getElementById('qr-canvas');
    if (!canvas) return;
    const base64Image = canvas.toDataURL('image/png');
    
    setMyQRs([{ id: Date.now(), title: qrTitle, data: createData, date: new Date().toLocaleDateString(), image: base64Image }, ...myQRs]);
    alert("QR Code Saved to your Vault!");
    setCreateData(''); setQrTitle('');
    setActiveTab('vault');
  };

  const downloadVaultQR = async (imageSrc, title) => {
    try {
      const blob = await (await fetch(imageSrc)).blob();
      const file = new File([blob], `QR_${title.replace(/\s+/g, '_')}_${Date.now()}.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `QR Code: ${title}` });
      } else {
        const link = document.createElement('a');
        link.href = imageSrc; link.download = `QR_${title.replace(/\s+/g, '_')}_${Date.now()}.png`;
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
      }
    } catch (err) { console.error('Error sharing QR:', err); }
  };

  const deleteVaultQR = (id) => { if(window.confirm("Delete this QR code from your vault?")) setMyQRs(myQRs.filter(q => q.id !== id)); };

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
        <button onClick={() => { setActiveTab('scanner'); scanAgain(); }} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'scanner' ? '#06b6d4' : '#222', color: activeTab === 'scanner' ? '#000' : '#888' }}>Scan</button>
        <button onClick={() => setActiveTab('create')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'create' ? '#a855f7' : '#222', color: activeTab === 'create' ? '#fff' : '#888' }}>Create</button>
        <button onClick={() => setActiveTab('saved')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'saved' ? '#10b981' : '#222', color: activeTab === 'saved' ? '#000' : '#888' }}>Scan Log</button>
        <button onClick={() => setActiveTab('vault')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'vault' ? '#f59e0b' : '#222', color: activeTab === 'vault' ? '#000' : '#888' }}>My QRs</button>
      </div>

      <div id="hidden-qr-canvas" style={{ display: 'none' }}></div>
      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>

        {/* --- 1. SCANNER TAB --- */}
        {activeTab === 'scanner' && (
          <>
            {!scanResult ? (
              <div style={{ ...cardStyle, borderTop: '4px solid #06b6d4', textAlign: 'center' }}>
                <h3 style={{ color: '#06b6d4', marginTop: 0, textTransform: 'uppercase' }}>Universal Reader</h3>
                
                {isScanning ? (
                  <>
                    <p style={{ color: '#888', fontSize: '0.9em', marginBottom: '20px' }}>Align the code within the viewfinder.</p>
                    <div id="qr-reader" style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', border: '2px solid #333', background: '#000', marginBottom: '20px' }}></div>
                    <button onClick={() => setIsScanning(false)} style={{ ...btnStyle('transparent', '#ef4444'), border: '1px solid #ef4444' }}>Cancel Camera</button>
                  </>
                ) : (
                  <>
                    <p style={{ color: '#888', fontSize: '0.9em', marginBottom: '20px', lineHeight: '1.5' }}>Use your live camera, or extract a code from a screenshot in your gallery.</p>
                    <button onClick={startLiveScanner} style={{ ...btnStyle('#06b6d4', '#000'), marginBottom: '15px' }}>📷 Start Live Camera</button>
                    <div style={{ position: 'relative' }}>
                      <label style={{ ...btnStyle('transparent', '#a855f7'), border: '1px dashed #a855f7', display: 'block' }}>
                        🖼️ Scan from Image
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={scanImageFile} />
                      </label>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div style={{ ...cardStyle, borderTop: '4px solid #10b981' }}>
                <h2 style={{ color: '#10b981', marginTop: 0, textAlign: 'center' }}>SCAN SUCCESS</h2>
                <div style={{ background: '#0a0a0a', border: '1px solid #333', padding: '15px', borderRadius: '8px', marginBottom: '20px', wordWrap: 'break-word', fontFamily: 'monospace', fontSize: '1.1em', color: '#fff' }}>{scanResult}</div>
                <label style={{ color: '#06b6d4', fontSize: '0.85em', fontWeight: 'bold', marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Add a Note (Optional)</label>
                <input type="text" placeholder="e.g., Garage Router..." value={scanNote} onChange={(e) => setScanNote(e.target.value)} style={inputStyle} />
                <button onClick={saveScan} style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '15px' }}>💾 Save to Scan Log</button>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <button onClick={() => copyToClipboard(scanResult)} style={{ flex: 1, background: '#a855f7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>📋 Copy</button>
                  <button onClick={() => openLink(scanResult)} style={{ flex: 1, background: (scanResult.startsWith('http') || scanResult.startsWith('www')) ? '#3b82f6' : '#f59e0b', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>{(scanResult.startsWith('http') || scanResult.startsWith('www')) ? '🌐 Open Link' : '🔍 Search'}</button>
                </div>
                <button onClick={scanAgain} style={{ width: '100%', background: 'transparent', color: '#06b6d4', border: '1px dashed #06b6d4', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>📷 Scan Another</button>
              </div>
            )}
          </>
        )}

        {/* --- 2. CREATE TAB --- */}
        {activeTab === 'create' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #a855f7', textAlign: 'center' }}>
            <h2 style={{ color: '#a855f7', marginTop: 0, textTransform: 'uppercase' }}>Offline Generator</h2>
            <p style={{ color: '#888', fontSize: '0.9em', marginBottom: '20px' }}>Generate a secure, tracking-free QR code.</p>
            <textarea placeholder="Enter WiFi, crypto address, or text..." value={createData} onChange={(e) => setCreateData(e.target.value)} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} />
            {createData && (
              <>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', display: 'inline-block', marginBottom: '15px' }}><QRCodeCanvas id="qr-canvas" value={createData} size={200} /></div>
                <input type="text" placeholder="Title (e.g. My BTC Wallet)" value={qrTitle} onChange={(e) => setQrTitle(e.target.value)} style={{ ...inputStyle, textAlign: 'center' }} />
                <button onClick={saveGeneratedQR} style={{ width: '100%', background: '#f59e0b', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>💾 Save to My QRs</button>
              </>
            )}
          </div>
        )}

        {/* --- 3. SAVED SCANS LOG --- */}
        {activeTab === 'saved' && (
          <>
            <h3 style={{ color: '#10b981', textAlign: 'center', textTransform: 'uppercase', marginBottom: '20px' }}>Scan Log</h3>
            {savedScans.length === 0 ? <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No saved scans yet.</p> : (
              savedScans.map((scan, index) => (
                <div key={scan.id} style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9em' }}>{scan.date}</span>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button onClick={() => moveScan(index, 'up')} disabled={index === 0} style={{ background: '#222', color: index === 0 ? '#444' : '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>▲</button>
                      <button onClick={() => moveScan(index, 'down')} disabled={index === savedScans.length - 1} style={{ background: '#222', color: index === savedScans.length - 1 ? '#444' : '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>▼</button>
                    </div>
                  </div>
                  {scan.note && <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1.2em' }}>{scan.note}</h3>}
                  <div style={{ background: '#0a0a0a', padding: '10px', borderRadius: '6px', border: '1px solid #333', color: '#ccc', fontFamily: 'monospace', fontSize: '0.9em', wordWrap: 'break-word', marginBottom: '15px' }}>{scan.data}</div>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <button onClick={() => copyToClipboard(scan.data)} style={{ flex: 1, background: '#222', color: '#a855f7', border: '1px solid #a855f7', padding: '8px', borderRadius: '6px', fontWeight: 'bold' }}>📋 Copy</button>
                    <button onClick={() => openLink(scan.data)} style={{ flex: 1, background: '#222', color: '#3b82f6', border: '1px solid #3b82f6', padding: '8px', borderRadius: '6px', fontWeight: 'bold' }}>🌐 Open</button>
                  </div>
                  <button onClick={() => deleteScan(scan.id)} style={{ width: '100%', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '8px', borderRadius: '6px', fontWeight: 'bold' }}>🗑️ Delete Scan</button>
                </div>
              ))
            )}
          </>
        )}

        {/* --- 4. MY QRS (THE VISUAL VAULT) --- */}
        {activeTab === 'vault' && (
          <>
            <h3 style={{ color: '#f59e0b', textAlign: 'center', textTransform: 'uppercase', marginBottom: '20px' }}>My QRs</h3>
            {myQRs.length === 0 ? <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No generated QRs saved.</p> : (
              myQRs.map((qr) => (
                <div key={qr.id} style={{ ...cardStyle, borderTop: '4px solid #f59e0b', textAlign: 'center' }}>
                  <h3 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '1.2em', textTransform: 'uppercase' }}>{qr.title}</h3>
                  <span style={{ color: '#888', fontSize: '0.8em', display: 'block', marginBottom: '15px' }}>Created: {qr.date}</span>
                  
                  <div style={{ background: '#fff', padding: '15px', borderRadius: '12px', display: 'inline-block', marginBottom: '15px' }}>
                    <img src={qr.image} alt={qr.title} style={{ width: '200px', height: '200px' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => downloadVaultQR(qr.image, qr.title)} style={{ flex: 2, background: '#f59e0b', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>📤 Share / Save Image</button>
                    <button onClick={() => deleteVaultQR(qr.id)} style={{ flex: 1, background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>🗑️ Delete</button>
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
