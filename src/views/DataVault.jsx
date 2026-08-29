import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';

const CATEGORIES = ['All', 'IDs & Badges', 'Legal & Tax', 'Crypto Seeds', 'Hardware Serials', 'Misc'];

export default function DataVault() {
  const navigate = useNavigate();
  const [activeFolder, setActiveFolder] = useState('All');
  const [documents, setDocuments] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // New Document Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('IDs & Badges');
  const [docNotes, setDocNotes] = useState('');

  // Full Screen Preview Modal
  const [selectedDoc, setSelectedDoc] = useState(null);

  // --- NATIVE HARDWARE PERSISTENCE ---
  useEffect(() => {
    const loadVault = async () => {
      const { value } = await Preferences.get({ key: 'tot_paperless_safe' });
      if (value) {
        try { setDocuments(JSON.parse(value)); } catch(e) {}
      }
      setIsLoaded(true);
    };
    loadVault();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      Preferences.set({ key: 'tot_paperless_safe', value: JSON.stringify(documents) });
    }
  }, [documents, isLoaded]);

  // --- CAPTURE & CONVERSION ENGINE ---
  const snapCamera = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });
      setTempImage(`data:image/jpeg;base64,${photo.base64String}`);
      setShowAddModal(true);
    } catch (err) {
      if (err.message && !err.message.includes('User cancelled')) alert("Camera Error: " + err.message);
    }
  };

  const importGallery = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setTempImage(reader.result);
      setShowAddModal(true);
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const handleSaveDocument = () => {
    if (!docTitle.trim()) return alert("Please provide a title for this document.");
    if (!tempImage) return alert("No image data detected.");

    const newDoc = {
      id: `doc_${Date.now()}`,
      title: docTitle.trim(),
      category: docCategory,
      notes: docNotes.trim(),
      date: new Date().toLocaleDateString(),
      image: tempImage
    };

    setDocuments([newDoc, ...documents]);
    // Reset Form
    setDocTitle('');
    setDocNotes('');
    setDocCategory('IDs & Badges');
    setTempImage(null);
    setShowAddModal(false);
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
      if (navigator.share) {
        await navigator.share({ files: [file], title: doc.title });
      } else {
        const link = document.createElement('a');
        link.href = doc.image;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (e) {
      alert("Export failed: " + e.message);
    }
  };

  const glassCard = { background: 'rgba(17, 17, 17, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #222', padding: '15px', marginBottom: '15px' };
  const inputStyle = { background: '#0a0a0a', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '6px', width: '100%', marginBottom: '15px', fontSize: '1rem' };

  const filteredDocs = documents.filter(d => activeFolder === 'All' || d.category === activeFolder);

  if (!isLoaded) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', color: '#00ffff' }}><h2>Loading Safe...</h2></div>;

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.8)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#00ffff', fontSize: '1.2rem' }}>Paperless Safe</h2>
      </header>

      {/* QUICK ACTIONS */}
      <div style={{ padding: '15px 15px 0 15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button onClick={snapCamera} style={{ background: '#00ffff', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem' }}>📸 Snap Doc</button>
        <label style={{ background: 'transparent', color: '#a855f7', border: '1px dashed #a855f7', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem', textAlign: 'center', cursor: 'pointer', display: 'block' }}>
          🖼️ Import Doc
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={importGallery} />
        </label>
      </div>

      {/* FOLDER PILLS */}
      <div style={{ display: 'flex', gap: '8px', padding: '15px', overflowX: 'auto' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveFolder(cat)} style={{ flex: '0 0 auto', padding: '8px 14px', borderRadius: '20px', border: 'none', fontWeight: 'bold', fontSize: '0.8rem', background: activeFolder === cat ? '#00ffff' : '#222', color: activeFolder === cat ? '#000' : '#888' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* DOCUMENT VAULT LIST */}
      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        {filteredDocs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
            <p style={{ fontSize: '1.5rem', margin: '0 0 10px 0' }}>🗄️</p>
            <p style={{ margin: 0, fontStyle: 'italic' }}>No documents in this category.</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {filteredDocs.map(doc => (
            <div key={doc.id} style={{ ...glassCard, margin: 0, borderTop: '3px solid #00ffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.65rem', background: '#222', color: '#00ffff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{doc.category}</span>
                  <span style={{ fontSize: '0.65rem', color: '#777' }}>{doc.date}</span>
                </div>
                <h4 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</h4>
                
                {/* SHOULDER-SURFING BLURRED THUMBNAIL */}
                <div onClick={() => setSelectedDoc(doc)} style={{ position: 'relative', width: '100%', height: '110px', background: '#000', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #333' }}>
                  <img src={doc.image} alt={doc.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(8px)', transform: 'scale(1.1)' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.3)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fff', background: 'rgba(0,0,0,0.75)', padding: '4px 8px', borderRadius: '4px' }}>👁️ Tap to View</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                <button onClick={() => handleExportDocument(doc)} style={{ flex: 1, background: '#222', color: '#00ffff', border: '1px solid #333', padding: '6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>📤 Export</button>
                <button onClick={() => handleDeleteDocument(doc.id)} style={{ background: '#222', color: '#ef4444', border: '1px solid #333', padding: '6px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD / SAVE DOCUMENT MODAL */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ color: '#00ffff', marginTop: 0, textTransform: 'uppercase' }}>Secure Document</h3>
            
            {tempImage && (
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <img src={tempImage} alt="Preview" style={{ maxHeight: '160px', maxWidth: '100%', borderRadius: '8px', border: '1px solid #333' }} />
              </div>
            )}

            <label style={{ color: '#888', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Document Title</label>
            <input type="text" placeholder="e.g. CCW Permit / Seed Phrase" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} style={inputStyle} />

            <label style={{ color: '#888', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Category</label>
            <select value={docCategory} onChange={(e) => setDocCategory(e.target.value)} style={{ ...inputStyle, background: '#0a0a0a' }}>
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label style={{ color: '#888', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Notes / Serial (Optional)</label>
            <textarea placeholder="Add encrypted notes or extra details..." value={docNotes} onChange={(e) => setDocNotes(e.target.value)} style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => { setShowAddModal(false); setTempImage(null); }} style={{ background: '#222', color: '#888', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>Cancel</button>
              <button onClick={handleSaveDocument} style={{ background: '#00ffff', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>Lock in Safe</button>
            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN SECURE PREVIEW MODAL */}
      {selectedDoc && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#000', zIndex: 10000, display: 'flex', flexDirection: 'column', padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
            <div>
              <h3 style={{ margin: 0, color: '#00ffff', fontSize: '1.1rem' }}>{selectedDoc.title}</h3>
              <span style={{ color: '#888', fontSize: '0.75rem' }}>{selectedDoc.category} • {selectedDoc.date}</span>
            </div>
            <button onClick={() => setSelectedDoc(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold' }}>✕ Close</button>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'auto', background: '#050505', borderRadius: '8px', padding: '10px' }}>
            <img src={selectedDoc.image} alt={selectedDoc.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '6px' }} />
          </div>

          {selectedDoc.notes && (
            <div style={{ background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '10px', marginTop: '10px' }}>
              <span style={{ color: '#888', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Notes:</span>
              <p style={{ margin: '4px 0 0 0', color: '#ccc', fontSize: '0.85rem' }}>{selectedDoc.notes}</p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <button onClick={() => handleExportDocument(selectedDoc)} style={{ background: '#00ffff', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>📤 Export / Share</button>
            <button onClick={() => handleDeleteDocument(selectedDoc.id)} style={{ background: '#222', color: '#ef4444', border: '1px solid #ef4444', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>🗑️ Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
