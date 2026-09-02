import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AssetLedger() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Ledger');
  const [filterCategory, setFilterCategory] = useState('All');

  // --- STATE ---
  const [assets, setAssets] = useState(() => JSON.parse(localStorage.getItem('tot_assets')) || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);

  // --- DYNAMIC FORM STATE ---
  const [assetCategory, setAssetCategory] = useState('Tools & Hardware');
  const [assetName, setAssetName] = useState('');
  const [assetPrice, setAssetPrice] = useState('');
  const [assetQuantity, setAssetQuantity] = useState('1');
  const [assetDate, setAssetDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [assetWarranty, setAssetWarranty] = useState('1 Year');
  const [assetStatus, setAssetStatus] = useState('Deployed');
  const [assetSn, setAssetSn] = useState('');
  const [assetAssignedTo, setAssetAssignedTo] = useState('');
  const [assetLocation, setAssetLocation] = useState('');
  const [assetPhotos, setAssetPhotos] = useState([]);

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('tot_assets', JSON.stringify(assets));
  }, [assets]);

  const totalValue = assets.reduce((acc, curr) => acc + (parseFloat(curr.price) * (parseFloat(curr.quantity) || 1) || 0), 0);

  const guideData = [
    { title: "📌 What is the Pro Ledger?", content: "Tracks mission-critical gear, deployments, and materials. Logging serials and warranties creates an immutable record for insurance, tax depreciation, and maintenance." },
    { title: "⚠️ Privacy & Security", content: "All data and photos are stored locally on your device. The file picker is sandboxed by Android for your privacy. Export your CSV regularly." },
    { title: "💡 Dynamic Entry", content: "Select your category first. The form will dynamically shape-shift to only show you fields relevant to Tools, Materials, or Heavy Equipment." },
    { title: "📅 Warranty Sync", content: "When you add a Tool or Equipment, use the 'Sync Warranty' button to generate a native .ics calendar event reminding you 2 weeks before expiration." }
  ];

  const toggleAccordion = (index) => setOpenAccordion(openAccordion === index ? null : index);

  const handlePhotoCapture = (e) => {
    if (assetPhotos.length >= 4) return alert("Maximum of 4 photos per asset.");
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500; 
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.5); 
        setAssetPhotos(prev => [...prev, dataUrl]);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = null; 
  };

  const removePhoto = (index) => setAssetPhotos(assetPhotos.filter((_, i) => i !== index));

  const handleAddAsset = () => {
    if (!assetName || !assetPrice) return alert("Name and Cost/Value are required.");
    const newAsset = { 
      id: Date.now(), name: assetName, price: parseFloat(assetPrice), quantity: parseFloat(assetQuantity) || 1,
      date: assetDate, warranty: assetWarranty, status: assetStatus, category: assetCategory, 
      sn: assetSn, assignedTo: assetAssignedTo, location: assetLocation, photos: assetPhotos 
    };
    setAssets([newAsset, ...assets]);
    
    setAssetName(''); setAssetPrice(''); setAssetQuantity('1'); setAssetSn(''); setAssetAssignedTo(''); setAssetLocation(''); setAssetPhotos([]);
    setShowAddModal(false);
  };

  const deleteAsset = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) setAssets(assets.filter(a => a.id !== id));
  };

  // --- CALENDAR SYNC LOGIC (.ICS) ---
  const generateWarrantyCalendarEvent = (asset) => {
    if (asset.warranty === 'None' || asset.warranty === 'Lifetime' || !asset.warranty) return alert("No specific expiration date to sync.");
    const purchaseDate = new Date(asset.date);
    let expDate = new Date(asset.date);
    if (asset.warranty === '30 Days') expDate.setDate(purchaseDate.getDate() + 30);
    else if (asset.warranty === '90 Days') expDate.setDate(purchaseDate.getDate() + 90);
    else if (asset.warranty === '1 Year') expDate.setFullYear(purchaseDate.getFullYear() + 1);
    else if (asset.warranty === '2 Years') expDate.setFullYear(purchaseDate.getFullYear() + 2);
    else if (asset.warranty === '5 Years') expDate.setFullYear(purchaseDate.getFullYear() + 5);

    const formattedDate = expDate.toISOString().split('T')[0].replace(/-/g, '');
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART;VALUE=DATE:${formattedDate}\nDTEND;VALUE=DATE:${formattedDate}\nSUMMARY:Warranty Expiring: ${asset.name}\nDESCRIPTION:Warranty for ${asset.name} (S/N: ${asset.sn || 'N/A'}) purchased on ${asset.date} is expiring.\n\nValue: $${asset.price}\nEND:VEVENT\nEND:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Warranty_${asset.name.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  // --- EXPORT CONTROLS ---
  const getCSVString = () => {
    let csv = "Category,Asset Name,Qty,Total Cost,Purchase Date,Assigned To,Location/Job,Status,Warranty,Serial Number\n";
    assets.forEach(a => {
      const safeName = `"${a.name || ''}"`;
      const cost = `"$${((a.price || 0) * (a.quantity || 1)).toFixed(2)}"`;
      csv += `"${a.category}",${safeName},"${a.quantity || 1}",${cost},"${a.date}","${a.assignedTo || ''}","${a.location || ''}","${a.status || ''}","${a.warranty || ''}","${a.sn || ''}"\n`;
    });
    return csv;
  };

  const downloadCSVFile = () => {
    if (assets.length === 0) return alert("No assets to export.");
    const blob = new Blob([getCSVString()], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Fleet_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const copyCSVToClipboard = () => {
    if (assets.length === 0) return alert("No assets to export.");
    navigator.clipboard.writeText(getCSVString());
    alert("CSV Data securely copied to your clipboard!");
  };

  // --- STYLES ---
  const cardStyle = { background: 'rgba(17, 17, 17, 0.95)', borderRadius: '12px', border: '1px solid #222', padding: '15px', marginBottom: '15px' };
  const inputStyle = { background: '#000', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '6px', width: '100%', marginBottom: '15px', fontSize: '1rem', boxSizing: 'border-box' };
  const labelStyle = { color: '#a855f7', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px', display: 'block' };
  const btnStyle = (bg, color) => ({ background: bg, color: color, border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', width: '100%', fontSize: '1rem', cursor: 'pointer' });
  const filterBtnStyle = (active) => ({ flex: '0 0 auto', padding: '8px 15px', background: active ? '#a855f7' : '#111', color: active ? '#fff' : '#888', border: active ? '1px solid #a855f7' : '1px solid #333', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap' });

  const filteredAssets = filterCategory === 'All' ? assets : assets.filter(a => a.category === filterCategory);

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
          <h2 style={{ margin: 0, color: '#a855f7', fontSize: '1.2rem' }}>Pro Equipment Ledger</h2>
        </div>
      </header>

      <div style={{ display: 'flex', padding: '15px', gap: '10px', background: 'rgba(0,0,0,0.6)' }}>
        <button onClick={() => setActiveTab('Ledger')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'Ledger' ? '#a855f7' : '#222', color: activeTab === 'Ledger' ? '#fff' : '#888' }}>Ledger</button>
        <button onClick={() => setActiveTab('guide')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'guide' ? '#10b981' : '#222', color: activeTab === 'guide' ? '#000' : '#888' }}>Guide</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        {activeTab === 'Ledger' && (
          <>
            <div style={{ ...cardStyle, textAlign: 'center', border: '1px solid #a855f7' }}>
              <div style={{ color: '#888', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Total Fleet/Material Value</div>
              <div style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 'bold' }}>${totalValue.toFixed(2)}</div>
              <div style={{ color: '#ccc', fontSize: '0.9rem' }}>{assets.length} Tracked Records</div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button onClick={() => setShowAddModal(true)} style={{ flex: 2, background: '#a855f7', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}>+ Log New Record</button>
              <button onClick={() => setShowExportModal(true)} style={{ flex: 1, background: '#222', color: '#fff', border: '1px solid #3b82f6', padding: '15px', borderRadius: '8px', fontWeight: 'bold' }}>📤 Export</button>
            </div>

            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '10px' }}>
              {['All', 'Tools & Hardware', 'Materials & Consumables', 'Heavy Equipment', 'General Assets'].map(cat => (
                <button key={cat} onClick={() => setFilterCategory(cat)} style={filterBtnStyle(filterCategory === cat)}>{cat.split(' ')[0]}</button>
              ))}
            </div>

            {filteredAssets.length === 0 ? (
              <p style={{ color: '#ccc', textAlign: 'center', fontStyle: 'italic', marginTop: '40px' }}>No records found for this category.</p>
            ) : (
              filteredAssets.map(asset => (
                <div key={asset.id} style={{ ...cardStyle, borderLeft: `4px solid ${asset.category.includes('Materials') ? '#f59e0b' : asset.category.includes('Equipment') ? '#ef4444' : '#a855f7'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '1.2rem' }}>{asset.name} {asset.quantity > 1 && <span style={{color: '#a855f7'}}>(x{asset.quantity})</span>}</h3>
                    <span style={{ background: '#222', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#a855f7', fontWeight: 'bold' }}>{asset.category.split(' ')[0]}</span>
                  </div>
                  <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '15px' }}>
                    ${((asset.price || 0) * (asset.quantity || 1)).toFixed(2)} <span style={{fontSize:'0.85rem', color:'#666', fontWeight:'normal'}}>{asset.quantity > 1 ? `($${asset.price.toFixed(2)}/ea)` : ''}</span>
                  </div>

                  {asset.photos && asset.photos.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '15px', paddingBottom: '5px' }}>
                      {asset.photos.map((photo, idx) => (
                        <img key={idx} src={photo} alt="Proof" style={{ height: '80px', width: 'auto', borderRadius: '6px', border: '1px solid #333', objectFit: 'cover' }} />
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', color: '#ccc', fontSize: '0.9rem', marginBottom: '15px', background: '#0a0a0a', padding: '10px', borderRadius: '8px' }}>
                    {asset.assignedTo && <div><span style={{color:'#888', display:'block', fontSize:'0.75rem'}}>ASSIGNED TO</span><strong style={{color:'#fff'}}>{asset.assignedTo}</strong></div>}
                    {asset.location && <div><span style={{color:'#888', display:'block', fontSize:'0.75rem'}}>LOCATION / SITE</span><strong style={{color:'#fff'}}>{asset.location}</strong></div>}
                    <div><span style={{color:'#888', display:'block', fontSize:'0.75rem'}}>STATUS</span><strong style={{color: asset.status === 'Deployed' ? '#10b981' : '#fff'}}>{asset.status}</strong></div>
                    <div><span style={{color:'#888', display:'block', fontSize:'0.75rem'}}>PURCHASED</span><strong style={{color:'#fff'}}>{asset.date}</strong></div>
                    {asset.sn && <div><span style={{color:'#888', display:'block', fontSize:'0.75rem'}}>SERIAL #</span><strong style={{color:'#fff'}}>{asset.sn}</strong></div>}
                    {asset.warranty && <div><span style={{color:'#888', display:'block', fontSize:'0.75rem'}}>WARRANTY</span><strong style={{color:'#fff'}}>{asset.warranty}</strong></div>}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', borderTop: '1px dashed #333', paddingTop: '15px' }}>
                    {asset.warranty && asset.warranty !== 'None' && asset.warranty !== 'Lifetime' && !asset.category.includes('Materials') && (
                      <button onClick={() => generateWarrantyCalendarEvent(asset)} style={{ flex: 1, background: '#222', color: '#a855f7', border: '1px solid #333', padding: '10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>📅 Sync Warranty</button>
                    )}
                    <button onClick={() => deleteAsset(asset.id)} style={{ flex: asset.warranty && asset.warranty !== 'None' ? 1 : '1 1 100%', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'guide' && (
          <div style={{ paddingTop: '10px' }}>
            <h3 style={{ color: '#10b981', textAlign: 'center', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Pro Ledger Guide</h3>
            {guideData.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(17,17,17,0.95)', borderRadius: '8px', border: '1px solid #222', marginBottom: '10px', overflow: 'hidden' }}>
                <button onClick={() => toggleAccordion(idx)} style={{ width: '100%', background: 'transparent', color: openAccordion === idx ? '#10b981' : '#fff', border: 'none', padding: '15px', textAlign: 'left', fontWeight: 'bold', fontSize: '1.05rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.title}</span><span style={{ color: '#888' }}>{openAccordion === idx ? '▼' : '▶'}</span>
                </button>
                {openAccordion === idx && (
                  <div style={{ padding: '0 15px 15px 15px', color: '#ccc', lineHeight: '1.6', fontSize: '0.95rem' }}>
                    {item.content.split('\n').map((line, i) => <p key={i} style={{ margin: '0 0 10px 0' }}>{line}</p>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {showExportModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #3b82f6', width: '100%' }}>
              <h2 style={{ color: '#3b82f6', marginTop: 0, textAlign: 'center', textTransform: 'uppercase' }}>Export Controls</h2>
              <p style={{ color: '#ccc', textAlign: 'center', marginBottom: '25px', fontSize: '0.9rem' }}>Export your encrypted ledger data to a CSV for your records.</p>
              <button onClick={downloadCSVFile} style={{ ...btnStyle('#3b82f6', '#fff'), marginBottom: '15px' }}>📥 Download .CSV File</button>
              <button onClick={copyCSVToClipboard} style={{ ...btnStyle('#222', '#3b82f6'), border: '1px solid #3b82f6', marginBottom: '25px' }}>📋 Copy Raw Data</button>
              <button onClick={() => setShowExportModal(false)} style={{ ...btnStyle('transparent', '#ef4444'), border: '1px solid #ef4444' }}>Cancel</button>
            </div>
          </div>
        )}

        {showAddModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.98)', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #a855f7', paddingBottom: '15px', marginBottom: '20px' }}>
              <h2 style={{ color: '#a855f7', margin: 0, textTransform: 'uppercase' }}>Log New Record</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
            </div>

            <label style={labelStyle}>Record Category</label>
            <select value={assetCategory} onChange={(e) => setAssetCategory(e.target.value)} style={{ ...inputStyle, border: '1px solid #a855f7', color: '#a855f7', fontWeight: 'bold' }}>
              <option value="Tools & Hardware">🛠️ Tools & Hardware</option>
              <option value="Materials & Consumables">🧱 Materials & Consumables</option>
              <option value="Heavy Equipment">🚜 Heavy Equipment</option>
              <option value="General Assets">📦 General Assets</option>
            </select>

            <label style={labelStyle}>{assetCategory.includes('Materials') ? 'Material / Item Name' : 'Asset Make & Model'}</label>
            <input type="text" placeholder="e.g. DeWalt Hammer Drill, Drywall Sheets" value={assetName} onChange={(e) => setAssetName(e.target.value)} style={inputStyle} />

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>{assetCategory.includes('Materials') ? 'Cost Per Unit ($)' : 'Value / Price ($)'}</label>
                <input type="number" placeholder="0.00" value={assetPrice} onChange={(e) => setAssetPrice(e.target.value)} style={inputStyle} />
              </div>
              {assetCategory.includes('Materials') && (
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Quantity</label>
                  <input type="number" value={assetQuantity} onChange={(e) => setAssetQuantity(e.target.value)} style={inputStyle} />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Purchase / Log Date</label>
                <input type="date" value={assetDate} onChange={(e) => setAssetDate(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Status</label>
                <select value={assetStatus} onChange={(e) => setAssetStatus(e.target.value)} style={inputStyle}>
                  <option>Deployed</option><option>Stored</option><option>Maintenance</option><option>Consumed</option><option>Retired</option>
                </select>
              </div>
            </div>

            {/* DYNAMIC FIELDS: Hide for Materials */}
            {!assetCategory.includes('Materials') && (
              <>
                <label style={labelStyle}>Serial Number / VIN (Optional)</label>
                <input type="text" placeholder="S/N or VIN" value={assetSn} onChange={(e) => setAssetSn(e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Warranty Period</label>
                <select value={assetWarranty} onChange={(e) => setAssetWarranty(e.target.value)} style={inputStyle}>
                  <option>None</option><option>30 Days</option><option>90 Days</option><option>1 Year</option><option>2 Years</option><option>5 Years</option><option>Lifetime</option>
                </select>
              </>
            )}

            {/* DYNAMIC FIELDS: Deployment Tracking */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {!assetCategory.includes('Materials') && (
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Assigned To</label>
                  <input type="text" placeholder="e.g. Employee 1" value={assetAssignedTo} onChange={(e) => setAssetAssignedTo(e.target.value)} style={inputStyle} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Job Site / Location</label>
                <input type="text" placeholder="e.g. Smith Build, Truck 2" value={assetLocation} onChange={(e) => setAssetLocation(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <label style={labelStyle}>Photographic Proof ({assetPhotos.length}/4)</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <label style={{ ...btnStyle('transparent', '#10b981'), border: '1px dashed #10b981', flex: 1, textAlign: 'center' }}>
                📸 Camera <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handlePhotoCapture} />
              </label>
              <label style={{ ...btnStyle('transparent', '#3b82f6'), border: '1px dashed #3b82f6', flex: 1, textAlign: 'center' }}>
                🖼️ Gallery <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoCapture} />
              </label>
            </div>

            {assetPhotos.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '10px' }}>
                {assetPhotos.map((photo, idx) => (
                  <div key={idx} style={{ position: 'relative', flex: '0 0 auto' }}>
                    <img src={photo} alt="Preview" style={{ height: '80px', borderRadius: '6px', border: '1px solid #555' }} />
                    <button onClick={() => removePhoto(idx)} style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', fontWeight: 'bold', cursor: 'pointer' }}>×</button>
                  </div>
                ))}
              </div>
            )}

            <button onClick={handleAddAsset} style={{ width: '100%', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem', padding: '15px', marginBottom: '40px' }}>
              💾 Save to Ledger
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
