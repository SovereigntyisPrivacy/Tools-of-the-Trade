import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';

const DEFAULT_FOLDERS = ['IDs & Badges', 'Legal & Tax', 'Crypto Seeds'];

export default function DataVault() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  // Data States
  const [activeFolder, setActiveFolder] = useState('ALL');
  const [folders, setFolders] = useState([]);
  const [documents, setDocuments] = useState([]);

  // Camera & Image States
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Form States
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState(DEFAULT_FOLDERS[0]);
  const [docNotes, setDocNotes] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);

  // --- NATIVE HARDWARE BOOT ---
  useEffect(() => {
    const loadVault = async () => {
      const { value: docs } = await Preferences.get({ key: 'tot_paperless_safe' });
      if (docs) { try { setDocuments(JSON.parse(docs)); } catch(e) {} }

      const { value: flds } = await Preferences.get({ key: 'tot_custom_folders' });
      if (flds) {
        try { setFolders(JSON.parse(flds)); } catch(e) { setFolders(DEFAULT_FOLDERS); }
      } else {
        setFolders(DEFAULT_FOLDERS);
      }
      setIsLoaded(true);
    };
    loadVault();
  }, []);

  // --- SYNC ENGINE ---
  useEffect(() => {
    if (isLoaded) {
      Preferences.set({ key: 'tot_paperless_safe', value: JSON.stringify(documents) });
      Preferences.set({ key: 'tot_custom_folders', value: JSON.stringify(folders) });
    }
  }, [documents, folders, isLoaded]);

  // --- COMPRESSION ENGINE ---
  const compressImage = (dataUrl, callback) => {
    const img = new Image();
    img.onload = () => {
      const MAX_WIDTH = 1200;
      let width = img.width; let height = img.height;
      if (width > MAX_WIDTH) { height = Math.round((height * MAX_WIDTH) / width); width = MAX_WIDTH; }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.src = dataUrl;
  };

  // --- SANDBOXED IN-APP CAMERA ---
  const startInAppCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return alert("Camera API blocked by OS. Ensure camera permissions are granted.");
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      alert("Camera access denied. Check device permissions.");
    }
  };

  const stopInAppCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    setIsCameraActive(false);
  };

  const captureInAppPhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const rawBase64 = canvas.toDataURL('image/jpeg');
      stopInAppCamera();

      // Compress before saving to RAM
      compressImage(rawBase64, (compressed) => {
        setTempImage(compressed);
        setShowAddModal(true);
      });
    }
  };

  const importGallery = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      compressImage(reader.result, (compressed) => {
        setTempImage(compressed);
        setShowAddModal(true);
      });
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  // --- DATA HANDLERS ---
  const handleAddFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    if (folders.includes(name)) return alert("Folder already exists.");
    setFolders([...folders, name]);
    setNewFolderName('');
    setShowFolderModal(false);
  };

  const handleSaveDocument = () => {
    if (!docTitle.trim()) return alert("Please provide a title.");
    if (!tempImage) return alert("No image data detected.");
    const newDoc = { id: `doc_${Date.now()}`, title: docTitle.trim(), category: docCategory, notes: docNotes.trim(), date: new Date().toLocaleDateString(), image: tempImage };
    setDocuments([newDoc, ...documents]);
    setDocTitle(''); setDocNotes(''); setTempImage(null); setShowAddModal(false);
  };

  const handleDeleteDocument = (id) => {
    if (window.confirm("Permanently destroy this secure document?")) {
      setDocuments(documents.filter(d => d.id !== id));
      if (selectedDoc && selectedDoc.id === id) setSelectedDoc(null);
    }
  };

  const handleExportDocument = async (doc) => {
    try {
      const blob = await (await fetch(doc.image)).blob();
      const file = new File([blob], `${doc.title.replace(/\s+/g, '_')}.jpg`, { type: 'image/jpeg' });
      if (navigator.share) await navigator.share({ files: [file], title: doc.title });
      else {
        const link = document.createElement('a'); link.href = doc.image; link.download = file.name;
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
      }
    } catch (e) { alert("Export failed: " + e.message); }
  };

  const glassCard = { background: 'rgba(17, 17, 17, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #222', padding: '15px', marginBottom: '15px' };
  const inputStyle = { background: '#0a0a0a', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '6px', width: '100%', marginBottom: '15px', fontSize: '1rem' };
  const filteredDocs = documents.filter(d => activeFolder === 'ALL' || d.category === activeFolder);

  if (!isLoaded) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', color: '#00ffff' }}><h2>Loading Safe...</h2></div>;

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', color: '#fff' }}>
      
      {/* CAMERA VIEWFINDER OVERLAY */}
      {isCameraActive && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#000', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '85%', objectFit: 'cover' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: '#111', padding: '20px' }}>
            <button onClick={stopInAppCamera} style={{ background: '#222', color: '#fff', border: 'none', padding: '15px 30px', borderRadius: '8px', fontWeight: 'bold' }}>Cancel</button>
            <button onClick={captureInAppPhoto} style={{ background: '#00ffff', color: '#000', border: 'none', padding: '15px 40px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}>📸 Snap</button>
          </div>
        </div>
      )}

      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.8)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#00ffff', fontSize: '1.2rem' }}>Paperless Safe</h2>
      </header>

      <div style={{ padding: '15px 15px 0 15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button onClick={startInAppCamera} style={{ background: '#00ffff', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem' }}>
          📸 Snap Doc
        </button>
        <label style={{ background: 'transparent', color: '#a855f7', border: '1px dashed #a855f7', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem', textAlign: 'center', cursor: 'pointer', display: 'block' }}>
          🖼️ Import Doc
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={importGallery} />
        </label>
      </div>

      <div style={{ display: 'flex', gap: '8px', padding: '15px', overflowX: 'auto', alignItems: 'center' }}>
        <button onClick={() => setActiveFolder('ALL')} style={{ flex: '0 0 auto', padding: '8px 14px', borderRadius: '20px', border: 'none', fontWeight: 'bold', fontSize: '0.8rem', background: activeFolder === 'ALL' ? '#00ffff' : '#222', color: activeFolder === 'ALL' ? '#000' : '#888' }}>ALL</button>
        {folders.map(cat => (
          <button key={cat} onClick={() => setActiveFolder(cat)} style={{ flex: '0 0 auto', padding: '8px 14px', borderRadius: '20px', border: 'none', fontWeight: 'bold', fontSize: '0.8rem', background: activeFolder === cat ? '#00ffff' : '#222', color: activeFolder === cat ? '#000' : '#888' }}>{cat}</button>
        ))}
        <button onClick={() => setShowFolderModal(true)} style={{ flex: '0 0 auto', padding: '8px 14px', borderRadius: '20px', border: '1px dashed #00ffff', background: 'transparent', color: '#00ffff', fontWeight: 'bold', fontSize: '0.8rem' }}>+ New</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        {filteredDocs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
            <p style={{ fontSize: '1.5rem', margin: '0 0 10px 0' }}>🗄️</p>
            <p style={{ margin: 0, fontStyle: 'italic' }}>Vault is empty.</p>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {filteredDocs.map(doc => (
            <div key={doc.id} style={{ ...glassCard, margin: 0, borderTop: '3px solid #00ffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.65rem', background: '#222', color: '#00ffff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{doc.category}</span>
                <span style={{ fontSize: '0.65rem', color: '#777' }}>{doc.date}</span>
              </div>
              <h4 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</h4>
              <div onClick={() => setSelectedDoc(doc)} style={{ position: 'relative', width: '100%', height: '110px', background: '#000', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #333' }}>
                <img src={doc.image} alt={doc.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(8px)', transform: 'scale(1.1)' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.3)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fff', background: 'rgba(0,0,0,0.75)', padding: '4px 8px', borderRadius: '4px' }}>👁️ View</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                <button onClick={() => handleExportDocument(doc)} style={{ flex: 1, background: '#222', color: '#00ffff', border: '1px solid #333', padding: '6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>📤 Out</button>
                <button onClick={() => handleDeleteDocument(doc.id)} style={{ flex: 1, background: '#222', color: '#ef4444', border: '1px solid #333', padding: '6px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEW FOLDER MODAL */}
      {showFolderModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', width: '100%' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#00ffff', textAlign: 'center' }}>Create Vault Folder</h3>
            <input type="text" placeholder="Folder Name" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} style={inputStyle} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button onClick={() => setShowFolderModal(false)} style={{ background: '#222', color: '#888', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>Cancel</button>
              <button onClick={handleAddFolder} style={{ background: '#00ffff', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD DOCUMENT MODAL */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ color: '#00ffff', marginTop: 0, textTransform: 'uppercase' }}>Secure Document</h3>
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <img src={tempImage} alt="Preview" style={{ maxHeight: '160px', maxWidth: '100%', borderRadius: '8px', border: '1px solid #333' }} />
            </div>
            <label style={{ color: '#888', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Document Title</label>
            <input type="text" placeholder="e.g. Passport" value={docTitle} onChange={e => setDocTitle(e.target.value)} style={inputStyle} />
            <label style={{ color: '#888', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Category</label>
            <select value={docCategory} onChange={e => setDocCategory(e.target.value)} style={{ ...inputStyle, background: '#0a0a0a' }}>
              {folders.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <label style={{ color: '#888', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Notes / Serial (Optional)</label>
            <textarea placeholder="Add secure notes..." value={docNotes} onChange={e => setDocNotes(e.target.value)} style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => { setShowAddModal(false); setTempImage(null); }} style={{ background: '#222', color: '#888', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>Cancel</button>
              <button onClick={handleSaveDocument} style={{ background: '#00ffff', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>🔒 Lock in Safe</button>
            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN PREVIEW */}
      {selectedDoc && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#000', zIndex: 10001, display: 'flex', flexDirection: 'column', padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
            <h3 style={{ margin: 0, color: '#00ffff', fontSize: '1.1rem' }}>{selectedDoc.title}<br/><span style={{ color: '#888', fontSize: '0.75rem' }}>{selectedDoc.category} • {selectedDoc.date}</span></h3>
            <button onClick={() => setSelectedDoc(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold' }}>x Close</button>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'auto', background: '#050505', borderRadius: '8px', padding: '10px' }}>
            <img src={selectedDoc.image} alt={selectedDoc.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '6px' }} />
          </div>
          {selectedDoc.notes && (
            <div style={{ background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '10px', marginTop: '10px' }}>
              <span style={{ color: '#888', fontSize: '0.75rem', textTransform: 'uppercase' }}>Notes:</span>
              <p style={{ margin: '4px 0 0 0', color: '#ccc', fontSize: '0.85rem' }}>{selectedDoc.notes}</p>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <button onClick={() => handleExportDocument(selectedDoc)} style={{ background: '#00ffff', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>📤 Export</button>
            <button onClick={() => handleDeleteDocument(selectedDoc.id)} style={{ background: '#222', color: '#ef4444', border: '1px solid #ef4444', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>🗑️ Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
