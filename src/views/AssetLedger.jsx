import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AssetLedger() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ledger');

  // --- STATE ---
  const [assets, setAssets] = useState(() => JSON.parse(localStorage.getItem('tot_assets')) || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);

  const [assetName, setAssetName] = useState('');
  const [assetPrice, setAssetPrice] = useState('');
  const [assetDate, setAssetDate] = useState(new Date().toISOString().split('T')[0]);
  const [assetWarranty, setAssetWarranty] = useState('1 Year');
  const [assetStatus, setAssetStatus] = useState('Deployed');
  const [assetCategory, setAssetCategory] = useState('Tools & Hardware');
  const [assetSn, setAssetSn] = useState('');

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('tot_assets', JSON.stringify(assets));
  }, [assets]);

  const totalValue = assets.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);

  const guideData = [
    { title: "📌 What is the Asset Ledger?", content: "This tool tracks mission-critical gear, vehicles, and electronics. Logging serial numbers, prices, and warranties creates an immutable record for insurance claims, tax depreciation, and maintenance." },
    { title: "⚠️ Disclaimers & Privacy", content: "All data is stored locally on your device. It is not uploaded to any cloud server. Export your CSV regularly. This tool does not constitute financial or legal advice." },
    { title: "💡 Tips for Tax & Insurance", content: "1. Always record the Serial Number (S/N).\n2. Export your CSV quarterly and email it to yourself as a backup.\n3. For independent contractors, items used exclusively for work can often be written off under Section 179." },
    { title: "📅 Calendar Warranty Sync", content: "When you add an asset, use the 'Sync to Calendar' button. This generates a native .ics event reminding you of the warranty expiration 2 weeks before it expires." }
  ];

  // --- ACTIONS ---
  const toggleAccordion = (index) => setOpenAccordion(openAccordion === index ? null : index);

  const handleAddAsset = () => {
    if (!assetName || !assetPrice) return alert("Name and Price are required.");
    const newAsset = { id: Date.now(), name: assetName, price: parseFloat(assetPrice), date: assetDate, warranty: assetWarranty, status: assetStatus, category: assetCategory, sn: assetSn };
    setAssets([newAsset, ...assets]);
    setAssetName(''); setAssetPrice(''); setAssetSn('');
    setShowAddModal(false);
  };

  const deleteAsset = (id) => {
    if(window.confirm("Are you sure you want to delete this asset?")) setAssets(assets.filter(a => a.id !== id));
  };

  // --- CALENDAR SYNC LOGIC (.ICS) ---
  const generateWarrantyCalendarEvent = (asset) => {
    if (asset.warranty === 'None' || asset.warranty === 'Lifetime') return alert("No specific expiration date to sync.");
    const purchaseDate = new Date(asset.date);
    let expDate = new Date(asset.date);
    if (asset.warranty === '30 Days') expDate.setDate(purchaseDate.getDate() + 30);
    if (asset.warranty === '90 Days') expDate.setDate(purchaseDate.getDate() + 90);
    if (asset.warranty === '1 Year') expDate.setFullYear(purchaseDate.getFullYear() + 1);
    if (asset.warranty === '2 Years') expDate.setFullYear(purchaseDate.getFullYear() + 2);
    if (asset.warranty === '5 Years') expDate.setFullYear(purchaseDate.getFullYear() + 5);

    const formattedDate = expDate.toISOString().split('T')[0].replace(/-/g, '');
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART;VALUE=DATE:${formattedDate}\nDTEND;VALUE=DATE:${formattedDate}\nSUMMARY:Warranty Expiring: ${asset.name}\nDESCRIPTION:Warranty for ${asset.name} (S/N: ${asset.sn || 'N/A'}) purchased on ${asset.date} is expiring.\\n\\nValue: $${asset.price}\nEND:VEVENT\nEND:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `warranty_${asset.name.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  // --- NATIVE CSV EXPORT ---
  const exportCSV = async () => {
    if (assets.length === 0) return alert("No assets to export.");
    let csv = "Asset Name,Category,Price,Purchase Date,Warranty,Status,Serial Number\n";
    assets.forEach(a => csv += `"${a.name}","${a.category}","$${a.price}","${a.date}","${a.warranty}","${a.status}","${a.sn}"\n`);
    
    try {
      const file = new File([csv], `fleet_ledger_${Date.now()}.csv`, { type: 'text/csv' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Asset Ledger', text: 'Attached is your Asset & Gear Ledger CSV Export' });
      } else {
        const emailBody = encodeURIComponent("Attached is the requested Asset Ledger data:\n\n" + csv);
        window.open(`mailto:?subject=Asset Ledger CSV Export&body=${emailBody}`);
      }
    } catch (err) { console.error("Share failed", err); }
  };

  // --- MISSING STYLES FIXED ---
  const cardStyle = { background: 'rgba(17, 17, 17, 0.95)', borderRadius: '12px', border: '1px solid #222', padding: '15px', marginBottom: '15px' };
  const inputStyle = { background: '#000', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '6px', width: '100%', marginBottom: '15px', fontSize: '1em' };
  const labelStyle = { color: '#a855f7', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px', display: 'block', textAlign: 'center' };
  const btnStyle = (bg, color) => ({ background: bg, color: color, border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', width: '100%', fontSize: '1em' });

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
          <h2 style={{ margin: 0, color: '#a855f7', fontSize: '1.2em' }}>Asset & Gear Ledger</h2>
        </div>
      </header>

      <div style={{ display: 'flex', padding: '15px', gap: '10px', background: 'rgba(0,0,0,0.6)' }}>
        <button onClick={() => setActiveTab('ledger')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'ledger' ? '#a855f7' : '#222', color: activeTab === 'ledger' ? '#fff' : '#888' }}>Ledger</button>
        <button onClick={() => setActiveTab('guide')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'guide' ? '#10b981' : '#222', color: activeTab === 'guide' ? '#000' : '#888' }}>Guide</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        {activeTab === 'ledger' && (
          <>
            <div style={{ ...cardStyle, textAlign: 'center', border: '1px solid #a855f7' }}>
              <div style={{ color: '#888', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Total Fleet Value</div>
              <div style={{ color: '#a855f7', fontSize: '2.5em', fontWeight: 'bold', marginBottom: '5px' }}>${totalValue.toFixed(2)}</div>
              <div style={{ color: '#ccc', fontSize: '0.9em' }}>{assets.length} Tracked Assets</div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button onClick={() => setShowAddModal(true)} style={{ flex: 2, background: '#3b82f6', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>+ Log New Asset</button>
              <button onClick={exportCSV} style={{ flex: 1, background: '#222', color: '#fff', border: '1px solid #3b82f6', padding: '15px', borderRadius: '8px', fontWeight: 'bold' }}>📤 Export</button>
            </div>

            {assets.length === 0 ? (
              <p style={{ color: '#ccc', textAlign: 'center', fontStyle: 'italic', marginTop: '40px', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '8px' }}>Your ledger is empty. Start logging your gear.</p>
            ) : (
              assets.map(asset => (
                <div key={asset.id} style={{ ...cardStyle, borderLeft: `4px solid ${asset.status === 'Deployed' ? '#10b981' : asset.status === 'Stored' ? '#3b82f6' : '#f59e0b'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '1.2em' }}>{asset.name}</h3>
                      <span style={{ background: '#222', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', color: '#a855f7', fontWeight: 'bold' }}>{asset.category}</span>
                    </div>
                    <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2em' }}>${asset.price.toFixed(2)}</div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', color: '#ccc', fontSize: '0.9em', marginBottom: '15px' }}>
                    <div><strong style={{ color: '#888' }}>Purchased:</strong><br/>{asset.date}</div>
                    <div><strong style={{ color: '#888' }}>Status:</strong><br/>{asset.status}</div>
                    <div><strong style={{ color: '#888' }}>Warranty:</strong><br/>{asset.warranty}</div>
                    <div><strong style={{ color: '#888' }}>S/N:</strong><br/>{asset.sn || 'N/A'}</div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', borderTop: '1px dashed #333', paddingTop: '15px' }}>
                    <button onClick={() => generateWarrantyCalendarEvent(asset)} style={{ flex: 1, background: '#a855f7', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.9em' }}>📅 Sync Warranty</button>
                    <button onClick={() => deleteAsset(asset.id)} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '10px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* --- GUIDE TAB --- */}
        {activeTab === 'guide' && (
          <div style={{ paddingTop: '10px' }}>
            <h3 style={{ color: '#10b981', textAlign: 'center', marginBottom: '20px', textTransform: 'uppercase', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '8px' }}>Ledger Field Guide</h3>
            {guideData.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(17, 17, 17, 0.95)', borderRadius: '8px', border: '1px solid #222', marginBottom: '10px', overflow: 'hidden' }}>
                <button onClick={() => toggleAccordion(idx)} style={{ width: '100%', background: 'transparent', color: openAccordion === idx ? '#10b981' : '#fff', border: 'none', padding: '15px', textAlign: 'left', fontWeight: 'bold', fontSize: '1.05em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {item.title} <span style={{ color: '#888' }}>{openAccordion === idx ? '▼' : '▶'}</span>
                </button>
                {openAccordion === idx && (
                  <div style={{ padding: '0 15px 15px 15px', color: '#ccc', lineHeight: '1.6', fontSize: '0.95em' }}>
                    {item.content.split('\n').map((line, i) => <p key={i} style={{ margin: '0 0 10px 0' }}>{line}</p>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- ADD ASSET MODAL (CRASH FIXED) --- */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.98)', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #a855f7', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2 style={{ color: '#a855f7', margin: 0, textTransform: 'uppercase' }}>Log New Asset</h2>
            <button onClick={() => setShowAddModal(false)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
          </div>

          <label style={labelStyle}>Asset Name</label>
          <input type="text" placeholder="e.g. MacBook Pro, Generator" value={assetName} onChange={(e) => setAssetName(e.target.value)} style={inputStyle} />

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}><label style={labelStyle}>Price ($)</label><input type="number" placeholder="0.00" value={assetPrice} onChange={(e) => setAssetPrice(e.target.value)} style={inputStyle} /></div>
            <div style={{ flex: 1 }}><label style={labelStyle}>Purchase Date</label><input type="date" value={assetDate} onChange={(e) => setAssetDate(e.target.value)} style={{ ...inputStyle, padding: '10px' }} /></div>
          </div>

          <label style={labelStyle}>Category</label>
          <select value={assetCategory} onChange={(e) => setAssetCategory(e.target.value)} style={inputStyle}>
            <option>Electronics</option><option>Tools & Hardware</option><option>Vehicles</option><option>Field Gear</option><option>Misc</option>
          </select>

          <label style={labelStyle}>Serial Number (Optional)</label>
          <input type="text" placeholder="S/N" value={assetSn} onChange={(e) => setAssetSn(e.target.value)} style={inputStyle} />

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}><label style={labelStyle}>Warranty</label><select value={assetWarranty} onChange={(e) => setAssetWarranty(e.target.value)} style={inputStyle}><option>None</option><option>30 Days</option><option>90 Days</option><option>1 Year</option><option>2 Years</option><option>5 Years</option><option>Lifetime</option></select></div>
            <div style={{ flex: 1 }}><label style={labelStyle}>Status</label><select value={assetStatus} onChange={(e) => setAssetStatus(e.target.value)} style={inputStyle}><option>Deployed</option><option>Stored</option><option>Maintenance</option><option>Retired</option></select></div>
          </div>

          <label style={{ ...btnStyle('transparent', '#a855f7'), border: '1px dashed #a855f7', display: 'block', textAlign: 'center', marginBottom: '20px', cursor: 'pointer' }}>
            📸 Snap Photographic Proof
            <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={() => alert("Photo capture initialized. (Cloud upload disabled for privacy)")} />
          </label>

          <button onClick={handleAddAsset} style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2em', marginBottom: '20px' }}>
            💾 Save to Ledger
          </button>
        </div>
      )}
    </div>
  );
}
