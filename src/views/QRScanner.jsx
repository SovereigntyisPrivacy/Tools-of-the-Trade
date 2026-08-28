import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { QRCodeCanvas } from 'qrcode.react';
import Barcode from 'react-barcode';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import Tesseract from 'tesseract.js';

export default function QRScanner() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('scanner');
  
  const [scanResult, setScanResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); 
  const [savedScans, setSavedScans] = useState(() => JSON.parse(localStorage.getItem('tot_saved_scans')) || []);
  const [scanNote, setScanNote] = useState('');

  // Generator States
  const [qrType, setQrType] = useState('text'); 
  const [createData, setCreateData] = useState('');
  const [qrEcc, setQrEcc] = useState('H');
  const [barcodeType, setBarcodeType] = useState('CODE128');
  
  const [wifiSsid, setWifiSsid] = useState(''); const [wifiPass, setWifiPass] = useState(''); const [wifiType, setWifiType] = useState('WPA');
  const [smsPhone, setSmsPhone] = useState(''); const [smsMsg, setSmsMsg] = useState('');
  const [cryptoType, setCryptoType] = useState('monero'); const [cryptoAddr, setCryptoAddr] = useState(''); const [cryptoAmt, setCryptoAmt] = useState('');
  const [vFirst, setVFirst] = useState(''); const [vLast, setVLast] = useState(''); const [vOrg, setVOrg] = useState(''); const [vTitle, setVTitle] = useState(''); const [vPhone, setVPhone] = useState(''); const [vEmail, setVEmail] = useState('');
  const [geoLat, setGeoLat] = useState(''); const [geoLong, setGeoLong] = useState('');

  // Folder States
  const [qrCategory, setQrCategory] = useState('Misc');
  const [activeFolder, setActiveFolder] = useState('All');

  const [qrColor, setQrColor] = useState('#000000'); const [qrBg, setQrBg] = useState('#ffffff');
  const [qrTitle, setQrTitle] = useState('');
  const [myQRs, setMyQRs] = useState(() => JSON.parse(localStorage.getItem('tot_my_qrs')) || []);

  const hasValidData = () => {
    if (qrType === 'wifi') return wifiSsid.trim() !== '';
    if (qrType === 'crypto') return cryptoAddr.trim() !== '';
    if (qrType === 'sms') return smsPhone.trim() !== '';
    if (qrType === 'geo') return geoLat !== '' && geoLong !== '';
    if (qrType === 'vcard') return vFirst.trim() !== '' || vLast.trim() !== '' || vOrg.trim() !== '' || vPhone.trim() !== '' || vEmail.trim() !== '';
    return createData.trim() !== '';
  };

  const getCompiledQrData = () => {
    if (qrType === 'wifi') return `WIFI:S:${wifiSsid};T:${wifiType};P:${wifiPass};;`;
    if (qrType === 'phone') return `tel:${createData}`;
    if (qrType === 'email') return `mailto:${createData}`;
    if (qrType === 'sms') return `smsto:${smsPhone}:${smsMsg}`;
    if (qrType === 'geo') return `geo:${geoLat},${geoLong}`;
    if (qrType === 'crypto') return `${cryptoType}:${cryptoAddr}${cryptoAmt ? `?amount=${cryptoAmt}` : ''}`;
    if (qrType === 'vcard') return `BEGIN:VCARD\nVERSION:3.0\nN:${vLast};${vFirst};;;\nFN:${vFirst} ${vLast}\nORG:${vOrg}\nTITLE:${vTitle}\nTEL:${vPhone}\nEMAIL:${vEmail}\nEND:VCARD`;
    return createData;
  };

  useEffect(() => { localStorage.setItem('tot_saved_scans', JSON.stringify(savedScans)); localStorage.setItem('tot_my_qrs', JSON.stringify(myQRs)); }, [savedScans, myQRs]);

  useEffect(() => {
    if (qrType === 'wifi') setQrCategory('WiFi');
    else if (qrType === 'crypto') setQrCategory('Crypto');
    else if (qrType === 'barcode') setQrCategory('Barcodes');
    else if (['sms', 'phone', 'email', 'vcard'].includes(qrType)) setQrCategory('Comms');
    else setQrCategory('Misc');
  }, [qrType]);

  const playSuccessBeep = () => { 
    try { 
      const ctx = new (window.AudioContext || window.webkitAudioContext)(); 
      const osc = ctx.createOscillator(); 
      osc.type = 'sine'; 
      osc.frequency.setValueAtTime(800, ctx.currentTime); 
      osc.connect(ctx.destination); 
      osc.start(); 
      osc.stop(ctx.currentTime + 0.1); 
    } catch(e) {} 
  };

  const processImageForEverything = async (photoPath) => {
    setIsProcessing(true);
    try {
      const img = new Image(); img.src = photoPath; await new Promise(resolve => img.onload = resolve);
      
      // STAGE 1: Native Hardware Detector
      if ('BarcodeDetector' in window) {
        try { 
          const detector = new window.BarcodeDetector(); 
          const barcodes = await detector.detect(img); 
          if (barcodes.length > 0) { 
            playSuccessBeep(); 
            setScanResult(barcodes[0].rawValue); 
            setIsProcessing(false); 
            return; 
          } 
        } catch (e) { }
      }
      
      // STAGE 2: HTML5 Software Fallback
      try {
        const response = await fetch(photoPath); 
        const file = new File([await response.blob()], 'temp.jpg', { type: 'image/jpeg' });
        const html5QrCode = new Html5Qrcode("hidden-qr-canvas"); 
        const decodedText = await html5QrCode.scanFile(file, true);
        playSuccessBeep(); 
        setScanResult(decodedText); 
        setIsProcessing(false); 
        return;
      } catch (e) { }
      
      // STAGE 3: Tesseract OCR Engine
      const result = await Tesseract.recognize(photoPath, 'eng'); 
      const text = result.data.text.trim();
      if (text && text.length > 1) { 
        playSuccessBeep(); 
        setScanResult(text); 
      } else {
        alert("No codes or readable text found.");
      }
    } catch (err) { 
      alert("Error processing image."); 
    }
    setIsProcessing(false);
  };

  const scanNativeCamera = async () => { 
    try { 
      const photo = await Camera.getPhoto({ quality: 100, allowEditing: false, resultType: CameraResultType.Uri, source: CameraSource.Camera }); 
      await processImageForEverything(photo.webPath); 
    } catch (err) { 
      if (err.message && !err.message.includes('User cancelled')) alert("Camera error: " + err.message); 
    } 
  };

  const scanImageFile = (e) => { 
    if (!e.target.files || e.target.files.length === 0) return; 
    processImageForEverything(URL.createObjectURL(e.target.files[0])); 
    e.target.value = null; 
  };

  const renderSmartActions = () => {
    if (!scanResult) return null;
    if (scanResult.startsWith('WIFI:')) {
      const passMatch = scanResult.match(/P:(.*?);/); 
      const pass = passMatch ? passMatch[1] : 'No Password';
      return <button onClick={() => { navigator.clipboard.writeText(pass); alert("WiFi Password Copied!"); }} style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '10px' }}>📶 Copy WiFi Password</button>;
    }
    if (scanResult.startsWith('BEGIN:VCARD')) {
      const downloadVCard = () => { 
        const blob = new Blob([scanResult], { type: 'text/vcard' }); 
        const url = URL.createObjectURL(blob); 
        const link = document.createElement('a'); 
        link.href = url; 
        link.download = 'contact.vcf'; 
        document.body.appendChild(link); 
        link.click(); 
        document.body.removeChild(link); 
        URL.revokeObjectURL(url); 
      };
      return <button onClick={downloadVCard} style={{ width: '100%', background: '#a855f7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '10px' }}>👤 Save as Contact</button>;
    }
    if (scanResult.startsWith('http')) return <button onClick={() => window.open(scanResult, '_system')} style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '10px' }}>🌐 Open Link</button>;
    if (scanResult.startsWith('tel:')) return <button onClick={() => window.open(scanResult, '_system')} style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '10px' }}>📞 Call Phone Number</button>;
    if (scanResult.startsWith('mailto:')) return <button onClick={() => window.open(scanResult, '_system')} style={{ width: '100%', background: '#ef4444', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '10px' }}>📧 Send Email</button>;
    if (scanResult.startsWith('smsto:')) { 
      const parts = scanResult.split(':'); 
      const phone = parts[1] || ''; 
      return <button onClick={() => window.open(`sms:${phone}`, '_system')} style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '10px' }}>💬 Open Text Message</button>; 
    }
    if (scanResult.startsWith('geo:')) return <button onClick={() => window.open(scanResult, '_system')} style={{ width: '100%', background: '#f59e0b', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '10px' }}>🗺️ Open Map Location</button>;
    return null;
  };

  const exportScanLogToCSV = async () => {
    if (savedScans.length === 0) return alert("No scans to export.");
    let csv = "Date,Note,Scanned Data\n";
    savedScans.forEach(s => { csv += `"${s.date}","${s.note || ''}","${s.data.replace(/"/g, '""')}"\n`; });
    const blob = new Blob([csv], { type: 'text/csv' });
    const file = new File([blob], `Scan_Log_${Date.now()}.csv`, { type: 'text/csv' });
    if (navigator.share) { 
      try { await navigator.share({ files: [file], title: 'Scan Log Export' }); return; } catch(e){} 
    }
    const url = URL.createObjectURL(blob); 
    const link = document.createElement('a'); 
    link.href = url; 
    link.download = file.name; 
    document.body.appendChild(link); 
    link.click(); 
    document.body.removeChild(link); 
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); alert("Copied!"); };
  const openLink = (text) => {
    if (text.startsWith('http')) window.open(text, '_system');
    else window.open(`https://duckduckgo.com/?q=${encodeURIComponent(text)}`, '_system');
  };

  const saveScan = () => { 
    setSavedScans([{ id: Date.now(), data: scanResult, note: scanNote, date: new Date().toLocaleDateString() }, ...savedScans]); 
    setScanNote(''); 
    alert("Saved to Log!"); 
    setActiveTab('saved'); 
  };
  const deleteScan = (id) => { if(window.confirm("Delete this scan?")) setSavedScans(savedScans.filter(s => s.id !== id)); };
  const moveScan = (i, dir) => { 
    const n = [...savedScans]; 
    if (dir === 'up' && i > 0) [n[i-1], n[i]] = [n[i], n[i-1]]; 
    else if (dir === 'down' && i < n.length - 1) [n[i+1], n[i]] = [n[i], n[i+1]]; 
    setSavedScans(n); 
  };

  const saveGeneratedQR = () => {
    if (!qrTitle) return alert("Please add a title.");
    const canvas = document.querySelector('#canvas-container canvas'); 
    if (!canvas) return;
    setMyQRs([{ id: Date.now(), title: qrTitle, data: getCompiledQrData(), date: new Date().toLocaleDateString(), image: canvas.toDataURL('image/png'), folder: qrCategory }, ...myQRs]);
    alert("Saved to Vault!"); 
    setActiveTab('vault');
  };

  const downloadVaultQR = async (img, title) => {
    try { 
      const b = await (await fetch(img)).blob(); 
      const f = new File([b], `${title.replace(/\s+/g, '_')}.png`, { type: 'image/png' });
      if (navigator.share) await navigator.share({ files: [f], title });
      else { 
        const l = document.createElement('a'); 
        l.href = img; 
        l.download = f.name; 
        document.body.appendChild(l); 
        l.click(); 
        document.body.removeChild(l); 
      }
    } catch (e) { }
  };
  const deleteVaultQR = (id) => { if(window.confirm("Delete this Code?")) setMyQRs(myQRs.filter(q => q.id !== id)); };

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
        <button onClick={() => setActiveTab('vault')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'vault' ? '#f59e0b' : '#222', color: activeTab === 'vault' ? '#000' : '#888' }}>My Vault</button>
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
                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>Point it at a Barcode, QR Code, Data Matrix, or physical text and we will extract it automatically.</p>
                <button onClick={scanNativeCamera} style={{ ...btnStyle('#06b6d4', '#000'), marginBottom: '15px' }}>📸 Omni-Scan (Camera)</button>
                <label style={{ ...btnStyle('transparent', '#a855f7'), border: '1px dashed #a855f7', display: 'block' }}>🖼️ Scan from Gallery<input type="file" accept="image/*" style={{ display: 'none' }} onChange={scanImageFile} /></label>
              </div>
            ) : (
              <div style={{ ...glassCard, borderTop: '4px solid #10b981', marginTop: '20px' }}>
                <h2 style={{ color: '#10b981', margin: '0 0 15px 0', textAlign: 'center' }}>EXTRACTION SUCCESS</h2>
                {renderSmartActions()}
                <textarea readOnly value={scanResult} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} />
                <input type="text" placeholder="Add a Note (Optional)" value={scanNote} onChange={(e) => setScanNote(e.target.value)} style={inputStyle} />
                <button onClick={saveScan} style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '15px' }}>💾 Save to Scan Log</button>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <button onClick={() => copyToClipboard(scanResult)} style={{ flex: 1, background: 'transparent', color: '#a855f7', border: '1px dashed #a855f7', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>📋 Copy Raw Text</button>
                  <button onClick={() => openLink(scanResult)} style={{ flex: 1, background: 'transparent', color: '#06b6d4', border: '1px dashed #06b6d4', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>🔍 Web Search</button>
                </div>
                <button onClick={() => setScanResult(null)} style={{ width: '100%', background: 'transparent', color: '#ef4444', border: '1px dashed #ef4444', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>📷 Scan Another</button>
              </div>
            )}
          </>
        )}

        {activeTab === 'create' && (
          <div style={{ ...glassCard, borderTop: '4px solid #a855f7', marginTop: '20px' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <p style={{ color: '#ef4444', margin: 0, fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' }}>⚠️ Tools of the Trade Mesh Prep</p>
              <p style={{ color: '#ccc', margin: '5px 0 0 0', fontSize: '0.75rem', textAlign: 'center' }}>Data generated here is unencrypted for seamless local mesh sharing. Do not broadcast sensitive keys.</p>
            </div>

            <h3 style={{ color: '#a855f7', marginTop: 0, textTransform: 'uppercase', textAlign: 'center' }}>Pro Generator</h3>
            <label style={{ color: '#888', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Data Type</label>
            <select value={qrType} onChange={(e) => setQrType(e.target.value)} style={inputStyle}>
              <option value="text">Text / URL (QR)</option><option value="wifi">WiFi Network (QR)</option><option value="crypto">Crypto Request (QR)</option><option value="vcard">Contact Card (QR)</option><option value="sms">SMS Message (QR)</option><option value="geo">GPS Coordinates (QR)</option><option value="phone">Phone Number (QR)</option><option value="email">Email Address (QR)</option><option value="barcode">1D Barcode</option>
            </select>

            {qrType === 'wifi' && ( <><input type="text" placeholder="WiFi Network Name (SSID)" value={wifiSsid} onChange={e => setWifiSsid(e.target.value)} style={inputStyle} /><input type="text" placeholder="WiFi Password" value={wifiPass} onChange={e => setWifiPass(e.target.value)} style={inputStyle} /><select value={wifiType} onChange={e => setWifiType(e.target.value)} style={inputStyle}><option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">Open (No Password)</option></select></> )}
            {qrType === 'crypto' && ( <><select value={cryptoType} onChange={e => setCryptoType(e.target.value)} style={inputStyle}><option value="monero">Monero (XMR)</option><option value="solana">Solana (SOL)</option><option value="bitcoin">Bitcoin (BTC)</option></select><input type="text" placeholder="Wallet Address" value={cryptoAddr} onChange={e => setCryptoAddr(e.target.value)} style={inputStyle} /><input type="number" placeholder="Amount (Optional)" value={cryptoAmt} onChange={e => setCryptoAmt(e.target.value)} style={inputStyle} /></> )}
            {qrType === 'sms' && ( <><input type="tel" placeholder="Phone Number" value={smsPhone} onChange={e => setSmsPhone(e.target.value)} style={inputStyle} /><textarea placeholder="Pre-filled Message..." value={smsMsg} onChange={e => setSmsMsg(e.target.value)} style={{...inputStyle, minHeight: '80px'}} /></> )}
            {qrType === 'geo' && ( <><input type="number" placeholder="Latitude (e.g. 32.2226)" value={geoLat} onChange={e => setGeoLat(e.target.value)} style={inputStyle} /><input type="number" placeholder="Longitude (e.g. -110.9747)" value={geoLong} onChange={e => setGeoLong(e.target.value)} style={inputStyle} /></> )}
            {qrType === 'vcard' && ( <><div style={{display:'flex', gap:'10px'}}><input type="text" placeholder="First Name" value={vFirst} onChange={e => setVFirst(e.target.value)} style={inputStyle} /><input type="text" placeholder="Last Name" value={vLast} onChange={e => setVLast(e.target.value)} style={inputStyle} /></div><input type="text" placeholder="Company / Org" value={vOrg} onChange={e => setVOrg(e.target.value)} style={inputStyle} /><input type="text" placeholder="Job Title" value={vTitle} onChange={e => setVTitle(e.target.value)} style={inputStyle} /><input type="tel" placeholder="Phone Number" value={vPhone} onChange={e => setVPhone(e.target.value)} style={inputStyle} /><input type="email" placeholder="Email Address" value={vEmail} onChange={e => setVEmail(e.target.value)} style={inputStyle} /></> )}
            {['text', 'phone', 'email', 'barcode'].includes(qrType) && ( <textarea placeholder={`Enter ${qrType} data...`} value={createData} onChange={e => setCreateData(e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} /> )}

            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}><label style={{ color: '#888', fontSize: '0.7rem', display: 'block', marginBottom: '5px' }}>Line Color</label><input type="color" value={qrColor} onChange={e => setQrColor(e.target.value)} style={{ width: '100%', height: '40px', border: 'none', background: 'transparent' }} /></div>
              <div style={{ flex: 1 }}><label style={{ color: '#888', fontSize: '0.7rem', display: 'block', marginBottom: '5px' }}>Background</label><input type="color" value={qrBg} onChange={e => setQrBg(e.target.value)} style={{ width: '100%', height: '40px', border: 'none', background: 'transparent' }} /></div>
            </div>

            {qrType === 'barcode' ? ( <div style={{ marginBottom: '15px' }}><label style={{ color: '#888', fontSize: '0.7rem', display: 'block', marginBottom: '5px' }}>Barcode Format</label><select value={barcodeType} onChange={e => setBarcodeType(e.target.value)} style={inputStyle}><option value="CODE128">CODE128 (Standard Alphanumeric)</option><option value="CODE39">CODE39 (Industrial Alphanumeric)</option></select></div>
            ) : ( <div style={{ marginBottom: '15px' }}><label style={{ color: '#888', fontSize: '0.7rem', display: 'block', marginBottom: '5px' }}>QR Error Correction (Damage Recovery)</label><select value={qrEcc} onChange={e => setQrEcc(e.target.value)} style={inputStyle}><option value="L">Low (7%)</option><option value="M">Medium (15%)</option><option value="Q">Quarter (25%)</option><option value="H">High (30% - Best for Mesh/Screens)</option></select></div> )}

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#888', fontSize: '0.7rem', display: 'block', marginBottom: '5px' }}>Vault Folder</label>
              <select value={qrCategory} onChange={e => setQrCategory(e.target.value)} style={{ ...inputStyle, border: '1px dashed #f59e0b', color: '#f59e0b' }}>
                <option value="Misc">Misc</option><option value="Barcodes">Barcodes</option><option value="Comms">Contacts & Comms</option><option value="Crypto">Crypto</option><option value="WiFi">WiFi</option>
              </select>
            </div>

            <div style={{ textAlign: 'center' }}>
              {hasValidData() && (
                <>
                  <div id="canvas-container" style={{ background: qrBg, padding: '15px', borderRadius: '12px', display: 'inline-block', marginBottom: '15px', border: '2px solid #333' }}>
                    {qrType === 'barcode' ? ( <Barcode value={createData || '00000000'} format={barcodeType} renderer="canvas" background={qrBg} lineColor={qrColor} displayValue={true} />
                    ) : ( <QRCodeCanvas value={getCompiledQrData()} size={200} fgColor={qrColor} bgColor={qrBg} level={qrEcc} /> )}
                  </div>
                  <input type="text" placeholder="Title (e.g. Storage Barcode)" value={qrTitle} onChange={(e) => setQrTitle(e.target.value)} style={{ ...inputStyle, textAlign: 'center' }} />
                  <button onClick={saveGeneratedQR} style={{ width: '100%', background: '#f59e0b', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}>💾 Save to Vault Folder</button>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div style={{ marginTop: '20px' }}>
            <button onClick={exportScanLogToCSV} style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', marginBottom: '15px' }}>📥 Download Log as CSV</button>
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
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => copyToClipboard(scan.data)} style={{ flex: 1, background: 'transparent', color: '#a855f7', border: '1px solid #a855f7', padding: '8px', borderRadius: '6px', fontWeight: 'bold' }}>📋 Copy</button>
                  <button onClick={() => deleteScan(scan.id)} style={{ flex: 1, background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '8px', borderRadius: '6px', fontWeight: 'bold' }}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'vault' && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '10px' }}>
              {['All', 'Barcodes', 'Comms', 'Crypto', 'WiFi', 'Misc'].map(folder => (
                <button key={folder} onClick={() => setActiveFolder(folder)} style={{ flex: '0 0 auto', background: activeFolder === folder ? '#f59e0b' : '#222', color: activeFolder === folder ? '#000' : '#888', border: 'none', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
                  {folder}
                </button>
              ))}
            </div>

            {myQRs.filter(q => activeFolder === 'All' || (q.folder || 'Misc') === activeFolder).length === 0 && <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No items in this folder.</p>}
            
            {myQRs.filter(q => activeFolder === 'All' || (q.folder || 'Misc') === activeFolder).map((qr) => (
              <div key={qr.id} style={{ ...glassCard, borderTop: '4px solid #f59e0b', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span style={{ background: '#222', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>📂 {qr.folder || 'Misc'}</span>
                  <span style={{ color: '#888', fontSize: '0.8rem' }}>{qr.date}</span>
                </div>
                <h3 style={{ color: '#fff', margin: '0 0 15px 0', textTransform: 'uppercase' }}>{qr.title}</h3>
                <p style={{ color: '#ccc', fontSize: '0.85rem', wordWrap: 'break-word', margin: '0 0 15px 0', background: '#0a0a0a', padding: '10px', borderRadius: '6px', border: '1px solid #333' }}>{qr.data}</p>
                <div style={{ background: '#fff', padding: '15px', borderRadius: '12px', display: 'inline-block', marginBottom: '15px', border: '1px solid #333' }}><img src={qr.image} alt={qr.title} style={{ maxWidth: '100%', height: 'auto' }} /></div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <button onClick={() => copyToClipboard(qr.data)} style={{ width: '100%', background: 'transparent', color: '#a855f7', border: '1px solid #a855f7', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>📋 Copy Data</button>
                  <button onClick={() => downloadVaultQR(qr.image, qr.title)} style={{ width: '100%', background: '#f59e0b', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>📤 Share Image</button>
                </div>
                <button onClick={() => deleteVaultQR(qr.id)} style={{ width: '100%', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>🗑️ Delete Entry</button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
