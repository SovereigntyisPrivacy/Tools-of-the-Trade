import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AssetLedger() {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [activeMainTab, setActiveMainTab] = useState('Ledger');
  const [guideTab, setGuideTab] = useState('Insurance Tactics');

  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem('tot_asset_ledger');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [copied, setCopied] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [newItem, setNewItem] = useState({ 
    name: '', category: 'Tools & Hardware', serial: '', value: '', date: '', photos: [] 
  });

  // --- LOGIC ---
  useEffect(() => {
    try {
      localStorage.setItem('tot_asset_ledger', JSON.stringify(assets));
    } catch (e) {
      alert("Local storage is full! Please export your ledger and delete older assets/photos to free up space.");
    }
  }, [assets]);

  // Multi-Image Canvas Compression
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 3); // Limit to 3 files max
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400; // Aggressive downscale to allow multiple photos
          const scaleSize = MAX_WIDTH / img.width;
          
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Convert to highly compressed JPEG base64 (40% quality)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.4);
          
          setNewItem(prev => {
            const currentPhotos = prev.photos || [];
            if (currentPhotos.length >= 3) return prev; // Hard cap at 3
            return { ...prev, photos: [...currentPhotos, compressedBase64] };
          });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setNewItem(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleAdd = () => {
    if (!newItem.name) return alert('Asset name is required.');
    setAssets([{ ...newItem, id: Date.now() }, ...assets]);
    setNewItem({ name: '', category: 'Tools & Hardware', serial: '', value: '', date: '', photos: [] });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this asset from the ledger? This cannot be undone.')) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const exportCSV = () => {
    let csv = "Category,Item Name,Serial/VIN,Est. Value,Acquisition Date,Photos Attached\n";
    assets.forEach(a => {
      const photoCount = a.photos ? a.photos.length : 0;
      csv += `"${a.category}","${a.name}","${a.serial}","$${parseFloat(a.value||0).toFixed(2)}","${a.date}","${photoCount}"\n`;
    });
    navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const totalValue = assets.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
  const categories = ['All', 'Tools & Hardware', 'Tech & Comms', 'Fleet & Vehicles', 'Armory'];
  const filteredAssets = activeCategory === 'All' ? assets : assets.filter(a => a.category === activeCategory);

  // --- STYLES ---
  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.05em', marginTop: '4px', marginBottom: '12px' };
  const labelStyle = { color: '#00ffff', fontSize: '0.85em', fontWeight: 'bold', textTransform: 'uppercase' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate('/')}>← Hub</button>
        <h2>Asset & Gear Ledger</h2>
      </header>

      {/* TOP TABS */}
      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '6px' }}>
        <button onClick={() => setActiveMainTab('Ledger')} style={{ flex: 1, padding: '8px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeMainTab === 'Ledger' ? '#00cc66' : '#222', color: activeMainTab === 'Ledger' ? '#000' : '#aaa' }}>
          Ledger
        </button>
        <button onClick={() => setActiveMainTab('Guide')} style={{ flex: 1, padding: '8px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeMainTab === 'Guide' ? '#f59e0b' : '#222', color: activeMainTab === 'Guide' ? '#000' : '#aaa' }}>
          Guide
        </button>
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '95px' }}>
        
        {/* ========================================== */}
        {/* TAB 1: THE LEDGER                          */}
        {/* ========================================== */}
        {activeMainTab === 'Ledger' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #00cc66', textAlign: 'center' }}>
              <span style={{ color: '#aaa', fontSize: '0.9em', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Fleet Value</span>
              <h2 style={{ color: '#00cc66', fontSize: '2.5em', margin: '5px 0' }}>${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
              <span style={{ color: '#888', fontSize: '0.85em' }}>{assets.length} Tracked Assets</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <button onClick={() => setShowForm(!showForm)} style={{ flex: 1, padding: '12px', background: showForm ? '#333' : '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
                {showForm ? 'Cancel Entry' : '+ Log New Asset'}
              </button>
              <button onClick={exportCSV} style={{ flex: 1, padding: '12px', background: copied ? '#00cc66' : '#222', color: copied ? '#000' : '#fff', border: '1px solid #444', borderRadius: '8px', fontWeight: 'bold' }}>
                {copied ? '✅ Copied CSV' : '📋 Export CSV'}
              </button>
            </div>

            {/* INPUT FORM */}
            {showForm && (
              <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#3b82f6' }}>Asset Entry</h3>
                
                <label style={labelStyle}>Category</label>
                <select value={newItem.category} onChange={e=>setNewItem({...newItem, category: e.target.value})} style={inputStyle}>
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <label style={labelStyle}>Item Make / Model</label>
                <input type="text" placeholder="e.g. DeWalt 20V Max Drill" value={newItem.name} onChange={e=>setNewItem({...newItem, name: e.target.value})} style={inputStyle} />

                <label style={labelStyle}>Serial Number / VIN</label>
                <input type="text" placeholder="S/N for Insurance/Warranty" value={newItem.serial} onChange={e=>setNewItem({...newItem, serial: e.target.value})} style={inputStyle} />

                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Est. Value ($)</label>
                    <input type="number" placeholder="0.00" value={newItem.value} onChange={e=>setNewItem({...newItem, value: e.target.value})} style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Acquired Date</label>
                    <input type="date" value={newItem.date} onChange={e=>setNewItem({...newItem, date: e.target.value})} style={inputStyle} />
                  </div>
                </div>

                {/* MULTI-PHOTO UPLOAD AREA */}
                <label style={{...labelStyle, color: '#a855f7'}}>Proof of Ownership (Max 3 Photos)</label>
                <div style={{ background: '#000', border: '1px dashed #444', borderRadius: '8px', padding: '10px', marginTop: '4px', textAlign: 'center' }}>
                  <span style={{ display: 'block', color: '#888', marginBottom: '10px', fontSize: '0.85em' }}>
                    Capture: (1) Front/Sides, (2) Serial Plate, (3) Receipt
                  </span>
                  
                  {newItem.photos && newItem.photos.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                      {newItem.photos.map((p, i) => (
                        <div key={i} style={{ position: 'relative' }}>
                          <img src={p} alt={`Preview ${i}`} style={{ height: '70px', borderRadius: '6px', border: '1px solid #333' }} />
                          <button onClick={() => removePhoto(i)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>X</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {(!newItem.photos || newItem.photos.length < 3) && (
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ width: '100%', color: '#aaa', fontSize: '0.9em' }} />
                  )}
                </div>

                <button onClick={handleAdd} style={{ width: '100%', padding: '12px', background: '#00cc66', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginTop: '15px' }}>
                  Save Asset to Ledger
                </button>
              </div>
            )}

            {/* CATEGORY FILTER */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '5px' }}>
              {categories.map(cat => (
                <button 
                  key={cat} onClick={() => setActiveCategory(cat)}
                  style={{ padding: '8px 12px', borderRadius: '20px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: activeCategory === cat ? '#fff' : '#222', color: activeCategory === cat ? '#000' : '#888' }}>
                  {cat}
                </button>
              ))}
            </div>

            {/* ASSET LIST */}
            {filteredAssets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>No assets logged in this category.</div>
            ) : (
              filteredAssets.map(asset => (
                <div key={asset.id} style={{ ...cardStyle, display: 'flex', gap: '15px', alignItems: 'center' }}>
                  
                  {/* Photo Thumbnail */}
                  <div style={{ width: '70px', height: '70px', background: '#000', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #333', flexShrink: 0, position: 'relative' }}>
                    {asset.photos && asset.photos.length > 0 ? (
                      <>
                        <img src={asset.photos[0]} alt="Asset" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {asset.photos.length > 1 && (
                          <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '0.75em', padding: '2px 6px', borderTopLeftRadius: '6px', fontWeight: 'bold' }}>
                            +{asset.photos.length - 1}
                          </div>
                        )}
                      </>
                    ) : (
                      <span style={{ fontSize: '1.5em' }}>📷</span>
                    )}
                  </div>

                  {/* Asset Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ color: '#00ffff', fontSize: '0.7em', textTransform: 'uppercase', letterSpacing: '1px' }}>{asset.category}</span>
                    <h4 style={{ margin: '2px 0', color: '#fff', fontSize: '1.1em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.name}</h4>
                    <div style={{ color: '#888', fontSize: '0.85em' }}>
                      {asset.serial && <span style={{ display: 'block' }}>S/N: {asset.serial}</span>}
                      {asset.date && <span>{asset.date}</span>}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <strong style={{ color: '#00cc66', fontSize: '1.2em', display: 'block', marginBottom: '10px' }}>
                      ${parseFloat(asset.value || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </strong>
                    <button onClick={() => handleDelete(asset.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', padding: '4px 10px', fontWeight: 'bold', fontSize: '0.85em' }}>
                      Drop
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* ========================================== */}
        {/* TAB 2: THE GUIDE                           */}
        {/* ========================================== */}
        {activeMainTab === 'Guide' && (
          <>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {['The 3-Photo Rule', 'Insurance Tactics', 'Disclaimer'].map(sub => (
                <button
                  key={sub} onClick={() => setGuideTab(sub)}
                  style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', fontSize: '0.85em', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: guideTab === sub ? 'rgba(245, 158, 11, 0.2)' : '#151515', color: guideTab === sub ? '#f59e0b' : '#888', border: guideTab === sub ? '1px solid #f59e0b' : '1px solid #222' }}>
                  {sub}
                </button>
              ))}
            </div>

            {guideTab === 'The 3-Photo Rule' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#00cc66' }}>Bulletproof Evidence</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>
                    Adjusters require irrefutable proof to pay full claims. Always maximize your ledger by attaching three specific photos to high-value assets:<br/><br/>
                    <strong>1. The Wide Shot:</strong> Front/side angles showing the overall condition of the item.<br/>
                    <strong>2. The Data Plate:</strong> A macro close-up of the manufacturer's plate showing the precise Model Number and Serial Number.<br/>
                    <strong>3. The Receipt:</strong> The original store receipt or digital invoice proving the purchase price and date.
                  </p>
                </div>
              </div>
            )}

            {guideTab === 'Insurance Tactics' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#ef4444' }}>RCV vs. ACV (Don't Get Scammed)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>
                    When setting up a policy for high-value tools or fleet assets, always ensure you have <strong>Replacement Cost Value (RCV)</strong> coverage, not <em>Actual Cash Value (ACV)</em>.<br/><br/>
                    If your 5-year-old generator is stolen, an ACV policy pays out its depreciated pawn-shop value (e.g., $150). An RCV policy pays out exactly what it costs to go to Home Depot and buy a brand new equivalent model today.
                  </p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00ffff' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#00ffff' }}>The Burden of Proof</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>
                    Adjusters will default to the cheapest possible replacement brand if you just write "Drill" on a claim. To force them to pay for professional-grade gear, your photos must clearly show the brand and model number.
                  </p>
                </div>
              </div>
            )}

            {guideTab === 'Disclaimer' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.5)', borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>⚠️ Notice & Offline Storage Limits</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.5' }}>
                    Because this app operates entirely offline with zero cloud servers, photos are compressed and stored locally on your device. Storage quotas are strictly limited by your browser. Export your CSV ledger periodically and back it up.<br/><br/>
                    The developer does not guarantee data retention against device failure or browser cache clearing. This guide does not constitute licensed insurance advice.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
