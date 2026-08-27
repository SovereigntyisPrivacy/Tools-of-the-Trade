import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { QRCodeCanvas } from 'qrcode.react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import Tesseract from 'tesseract.js';

export default function QRScanner() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('scanner');
  
  // Scanner State
  const [scanResult, setScanResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); 
  const [savedScans, setSavedScans] = useState(() => JSON.parse(localStorage.getItem('tot_saved_scans')) || []);
  const [scanNote, setScanNote] = useState('');

  // Pro Generator State
  const [qrType, setQrType] = useState('text'); // text, wifi, phone, email
  const [createData, setCreateData] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiType, setWifiType] = useState('WPA');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBg, setQrBg] = useState('#ffffff');
  const [qrTitle, setQrTitle] = useState('');
  const [myQRs, setMyQRs] = useState(() => JSON.parse(localStorage.getItem('tot_my_qrs')) || []);

  // Compile QR Data based on Type
  const getCompiledQrData = () => {
    if (qrType === 'wifi') return `WIFI:S:${wifiSsid};T:${wifiType};P:${wifiPass};;`;
    if (qrType === 'phone') return `tel:${createData}`;
    if (qrType === 'email') return `mailto:${createData}`;
    return createData;
  };

  useEffect(() => {
    localStorage.setItem('tot_saved_scans', JSON.stringify(savedScans));
    localStorage.setItem('tot_my_qrs', JSON.stringify(myQRs));
  }, [savedScans, myQRs]);

  // --- THE OMNI-SCAN ENGINE (One function to rule them all) ---
  const processImageForEverything = async (photoPath) => {
    setIsProcessing(true);
    try {
      const img = new Image();
      img.src = photoPath;
      await new Promise(resolve => img.onload = resolve);

      // STAGE 1: Native Hardware Barcode/Matrix Detector
      if ('BarcodeDetector' in window) {
        try {
          const detector = new window.BarcodeDetector();
          const barcodes = await detector.detect(img);
          if (barcodes.length > 0) {
            setScanResult(barcodes[0].rawValue); setIsProcessing(false); return;
          }
        } catch (e) { console.log('Native detector failed, falling back...'); }
      }

      // STAGE 2: HTML5 Software Decoder Fallback
      try {
        const response = await fetch(photoPath);
        const file = new File([await response.blob()], 'temp_qr.jpg', { type: 'image/jpeg' });
        const html5QrCode = new Html5Qrcode("hidden-qr-canvas");
        const decodedText = await html5QrCode.scanFile(file, true);
        setScanResult(decodedText); setIsProcessing(false); return;
      } catch (e) { console.log('HTML5 detector failed, falling back to OCR...'); }

      // STAGE 3: Tesseract OCR (If no codes exist, read the text)
      const result = await Tesseract.recognize(photoPath, 'eng');
      const text = result.data.text.trim();
      
      if (text && text.length > 1) {
        setScanResult(text);
      } else {
        alert("No barcodes, QR codes, or readable text found in this image. Please ensure good lighting and focus.");
      }
    } catch (err) {
      alert("Error processing image.");
    }
    setIsProcessing(false);
  };

  // Trigger Omni-Scan via Camera
  const scanNativeCamera = async () => {
    try {
      const photo = await Camera.getPhoto({ quality: 100, allowEditing: false, resultType: CameraResultType.Uri, source: CameraSource.Camera });
      await processImageForEverything(photo.webPath);
    } catch (err) {
      if (err.message && !err.message.includes('User cancelled')) alert("Camera error: " + err.message);
    }
  };

  // Trigger Omni-Scan via Gallery File
  const scanImageFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const fileUrl = URL.createObjectURL(e.target.files[0]);
    processImageForEverything(fileUrl);
    e.target.value = null;
  };

  // --- ACTIONS ---
  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); alert("Copied!"); };
  const openLink = (text) => {
    if (text.startsWith('http')) window.open(text, '_blank', 'noopener,noreferrer');
    else window.open(`https://duckduckgo.com/?q=${encodeURIComponent(text)}`, '_blank');
  };

  const saveScan = () => {
    setSavedScans([{ id: Date.now(), data: scanResult, note: scanNote, date: new Date().toLocaleDateString() }, ...savedScans]);
    setScanNote(''); alert("Saved to Log!"); setActiveTab('saved');
  };
  const deleteScan = (id) => { if(window.confirm("Delete this scan?")) setSavedScans(savedScans.filter(s => s.id !== id)); };
  
  const moveScan = (index, direction) => {
    const newScans = [...savedScans];
    if (direction === 'up' && index > 0) [newScans[index - 1], newScans[index]] = [newScans[index], newScans[index - 1]];
    else if (direction === 'down' && index < newScans.length - 1) [newScans[index + 1], newScans[index]] = [newScans[index], newScans[index + 1]];
    setSavedScans(newScans);
  };

  const saveGeneratedQR = () => {
    if (!qrTitle) return alert("Please add a title.");
    const canvas = document.getElementById('qr-canvas');
    if (!canvas) return;
    setMyQRs([{ id: Date.now(), title: qrTitle, data: getCompiledQrData(), date: new Date().toLocaleDateString(), image: canvas.toDataURL('image/png') }, ...myQRs]);
    alert("Saved to Vault!"); setCreateData(''); setWifiSsid(''); setWifiPass(''); setQrTitle(''); setActiveTab('vault');
  };
  
  const downloadVaultQR = async (imageSrc, title) => {
    try {
      const blob = await (await fetch(imageSrc)).blob();
      const file = new File([blob], `QR_${title.replace(/\s+/g, '_')}.png`, { type: 'image/png' });
      if (navigator.share) await navigator.share({ files: [file], title: title });
      else {
        const link = document.createElement('a'); link.href = imageSrc; link.download = file.name;
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
      }
    } catch (err) { console.error('Error sharing:', err); }
  };
  const deleteVaultQR = (id) => { if(window.confirm("Delete this QR?")) setMyQRs(myQRs.filter(q => q.id !== id)); };

  const glassCard = { background: 'rgba(17, 17, 17, 0.6)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #222', padding: '20px', marginBottom: '15px' };
  const inputStyle = { background: '#0a0a0a', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '6px', width: '100%', marginBottom: '15px', fontSize: '1rem' };
  const btnStyle = (bg, color) => ({ background: bg, color: color, border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', width: '100%', fontSize: '1.1rem', cursor: 'pointer' });

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.8)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#06b6d4', fontSize: '1.2rem' }}>Universal Lens</h2>
      </header>

      <div style={{ display: 'flex', padding: '15px', gap: '8px', background: 'rgba(0,0,0,0.5)', overflowX: 'auto' }}>
        <button onClick={() => { setActiveTab('scanner'); setScanResult(null); }} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'scanner' ? '#06b6d4' : '#222', color: activeTab === 'scanner' ? '#000' : '#888' }}>Omni-Scan</button>
        <button onClick={() => setActiveTab('create')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'create' ? '#a855f7' : '#222', color: activeTab === 'create' ? '#fff' : '#888' }}>Pro Generator</button>
        <button onClick={() => setActiveTab('saved')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'saved' ? '#10b981' : '#222', color: activeTab === 'saved' ? '#000' : '#888' }}>Scan Log</button>
        <button onClick={() => setActiveTab('vault')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'vault' ? '#f59e0b' : '#222', color: activeTab === 'vault' ? '#000' : '#888' }}>My QRs</button>
      </div>

      <div id="hidden-qr-canvas" style={{ width: '0px', height: '0px', overflow: 'hidden' }}></div>
      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        
        {activeTab === 'scanner' && (
          <>
            {isProcessing ? (
              <div style={{ ...glassCard, borderTop: '4px solid #3b82f6', textAlign: 'center', marginTop: '20px' }}>
                <h2 style={{ color: '#3b82f6', textTransform: 'uppercase', margin: '0 0 10px 0' }}>Processing Image...</h2>
                <p style={{ color: '#888' }}>Running 3-stage extraction protocol. Please wait.</p>
              </div>
            ) : !scanResult ? (
              <div style={{ ...glassCard, borderTop: '4px solid #06b6d4', textAlign: 'center', marginTop: '20px' }}>
                <h3 style={{ color: '#06b6d4', marginTop: 0, textTransform: 'uppercase' }}>Omni-Scan Engine</h3>
                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>One button. Point it at a Barcode, QR Code, Data Matrix, or physical text (OCR) and we will extract it automatically.</p>
                <button onClick={scanNativeCamera} style={{ ...btnStyle('#06b6d4', '#000'), marginBottom: '15px' }}>📸 Omni-Scan (Camera)</button>
                <div style={{ position: 'relative' }}>
                  <label style={{ ...btnStyle('transparent', '#a855f7'), border: '1px dashed #a855f7', display: 'block' }}>
                    🖼️ Scan from Gallery
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={scanImageFile} />
                  </label>
                </div>
              </div>
            ) : (
              <div style={{ ...glassCard, borderTop: '4px solid #10b981', marginTop: '20px' }}>
                <h2 style={{ color: '#10b981', margin: '0 0 15px 0', textAlign: 'center' }}>EXTRACTION SUCCESS</h2>
                <textarea readOnly value={scanResult} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} />
                <input type="text" placeholder="Add a Note (e.g. Serial Number)" value={scanNote} onChange={(e) => setScanNote(e.target.value)} style={inputStyle} />
                <button onClick={saveScan} style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '15px' }}>💾 Save to Scan Log</button>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <button onClick={() => copyToClipboard(scanResult)} style={{ flex: 1, background: '#a855f7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>📋 Copy</button>
                  <button onClick={() => openLink(scanResult)} style={{ flex: 1, background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>🌐 Search</button>
                </div>
                <button onClick={() => setScanResult(null)} style={{ width: '100%', background: 'transparent', color: '#06b6d4', border: '1px dashed #06b6d4', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>📷 Scan Another</button>
              </div>
            )}
          </>
        )}

        {activeTab === 'create' && (
          <div style={{ ...glassCard, borderTop: '4px solid #a855f7', marginTop: '20px' }}>
            <h3 style={{ color: '#a855f7', marginTop: 0, textTransform: 'uppercase', textAlign: 'center' }}>Pro Generator</h3>
            
            <label style={{ color: '#888', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Data Type</label>
            <select value={qrType} onChange={(e) => setQrType(e.target.value)} style={inputStyle}>
              <option value="text">Text / URL</option>
              <option value="wifi">WiFi Network</option>
              <option value="phone">Phone Number</option>
              <option value="email">Email Address</option>
            </select>

            {qrType === 'wifi' ? (
              <>
                <input type="text" placeholder="WiFi Network Name (SSID)" value={wifiSsid} onChange={e => setWifiSsid(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="WiFi Password" value={wifiPass} onChange={e => setWifiPass(e.target.value)} style={inputStyle} />
                <select value={wifiType} onChange={e => setWifiType(e.target.value)} style={inputStyle}>
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Open (No Password)</option>
                </select>
              </>
            ) : (
              <textarea placeholder={`Enter ${qrType} data...`} value={createData} onChange={e => setCreateData(e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
            )}

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#888', fontSize: '0.7rem', display: 'block', marginBottom: '5px' }}>QR Color</label>
                <input type="color" value={qrColor} onChange={e => setQrColor(e.target.value)} style={{ width: '100%', height: '40px', border: 'none', background: 'transparent' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#888', fontSize: '0.7rem', display: 'block', marginBottom: '5px' }}>Background</label>
                <input type="color" value={qrBg} onChange={e => setQrBg(e.target.value)} style={{ width: '100%', height: '40px', border: 'none', background: 'transparent' }} />
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              {(createData || wifiSsid) && (
                <>
                  <div style={{ background: qrBg, padding: '15px', borderRadius: '12px', display: 'inline-block', marginBottom: '15px', border: '2px solid #333' }}>
                    <QRCodeCanvas id="qr-canvas" value={getCompiledQrData()} size={200} fgColor={qrColor} bgColor={qrBg} level="H" />
                  </div>
                  <input type="text" placeholder="Title (e.g. Home WiFi)" value={qrTitle} onChange={(e) => setQrTitle(e.target.value)} style={{ ...inputStyle, textAlign: 'center' }} />
                  <button onClick={saveGeneratedQR} style={{ width: '100%', background: '#f59e0b', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}>💾 Save to My QRs</button>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div style={{ marginTop: '20px' }}>
            {savedScans.length === 0 && <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No scans logged yet.</p>}
            {savedScans.map((scan, index) => (
              <div key={scan.id} style={{ ...glassCard, borderLeft: '4px solid #10b981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>{scan.date}</span>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => moveScan(index, 'up')} disabled={index === 0} style={{ background: '#222', color: index === 0 ? '#444' : '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px' }}>▲</button>
                    <button onClick={() => moveScan(index, 'down')} disabled={index === savedScans.length - 1} style={{ background: '#222', color: index === savedScans.length - 1 ? '#444' : '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px' }}>▼</button>
                  </div>
                </div>
                {scan.note && <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>{scan.note}</h3>}
                <div style={{ background: '#0a0a0a', padding: '10px', borderRadius: '6px', border: '1px solid #333', color: '#ccc', fontFamily: 'monospace', wordWrap: 'break-word', marginBottom: '15px' }}>{scan.data}</div>
                <button onClick={() => deleteScan(scan.id)} style={{ width: '100%', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '8px', borderRadius: '6px', fontWeight: 'bold' }}>🗑️ Delete</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'vault' && (
          <div style={{ marginTop: '20px' }}>
            {myQRs.length === 0 && <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No generated QRs saved.</p>}
            {myQRs.map((qr) => (
              <div key={qr.id} style={{ ...glassCard, borderTop: '4px solid #f59e0b', textAlign: 'center' }}>
                <h3 style={{ color: '#fff', margin: '0 0 5px 0', textTransform: 'uppercase' }}>{qr.title}</h3>
                <span style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '15px' }}>{qr.date}</span>
                <div style={{ background: '#000', padding: '15px', borderRadius: '12px', display: 'inline-block', marginBottom: '15px', border: '1px solid #333' }}>
                  <img src={qr.image} alt={qr.title} style={{ width: '200px', height: '200px' }} />
                </div>
                <button onClick={() => downloadVaultQR(qr.image, qr.title)} style={{ width: '100%', background: '#f59e0b', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '10px' }}>📤 Share / Save Image</button>
                <button onClick={() => deleteVaultQR(qr.id)} style={{ width: '100%', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>🗑️ Delete</button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
