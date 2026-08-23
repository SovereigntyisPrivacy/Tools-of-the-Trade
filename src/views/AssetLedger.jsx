import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AssetLedger() {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem('tot_asset_ledger');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [copied, setCopied] = useState(false);

  // --- NEW ASSET FORM ---
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'Tools & Hardware', serial: '', value: '', date: '' });

  // --- LOGIC ---
  useEffect(() => {
    localStorage.setItem('tot_asset_ledger', JSON.stringify(assets));
  }, [assets]);

  const handleAdd = () => {
    if (!newItem.name) return alert('Asset name is required.');
    setAssets([...assets, { ...newItem, id: Date.now() }]);
    setNewItem({ name: '', category: 'Tools & Hardware', serial: '', value: '', date: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this asset from the ledger?')) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const exportCSV = () => {
    let csv = "Category,Item Name,Serial/VIN,Est. Value,Acquisition Date\n";
    assets.forEach(a => {
      csv += `"${a.category}","${a.name}","${a.serial}","$${parseFloat(a.value||0).toFixed(2)}","${a.date}"\n`;
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
        <button className="back-btn" onClick={() => navigate(-1)}>← Hub</button>
        <h2>Asset & Gear Ledger</h2>
      </header>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '95px' }}>
        
        {/* DASHBOARD SUMMARY */}
        <div style={{ ...cardStyle, borderTop: '4px solid #00cc66', textAlign: 'center' }}>
          <span style={{ color: '#aaa', fontSize: '0.9em', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Fleet Value</span>
          <h2 style={{ color: '#00cc66', fontSize: '2.5em', margin: '5px 0' }}>${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
          <span style={{ color: '#888', fontSize: '0.85em' }}>{assets.length} Tracked Assets</span>
        </div>

        {/* CONTROLS */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button onClick={() => setShowForm(!showForm)} style={{ flex: 1, padding: '12px', background: showForm ? '#333' : '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
            {showForm ? 'Cancel Entry' : '+ Log New Asset'}
          </button>
          <button onClick={exportCSV} style={{ flex: 1, padding: '12px', background: copied ? '#00cc66' : '#222', color: copied ? '#000' : '#fff', border: '1px solid #444', borderRadius: '8px', fontWeight: 'bold' }}>
            {copied ? '✅ Copied CSV' : '📋 Export Ledger'}
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

            <button onClick={handleAdd} style={{ width: '100%', padding: '12px', background: '#00cc66', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginTop: '5px' }}>
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
            <div key={asset.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#00ffff', fontSize: '0.75em', textTransform: 'uppercase', letterSpacing: '1px' }}>{asset.category}</span>
                <h4 style={{ margin: '4px 0', color: '#fff', fontSize: '1.1em' }}>{asset.name}</h4>
                <div style={{ color: '#888', fontSize: '0.85em' }}>
                  {asset.serial && <span style={{ display: 'block' }}>S/N: {asset.serial}</span>}
                  {asset.date && <span>Acquired: {asset.date}</span>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ color: '#00cc66', fontSize: '1.2em', display: 'block', marginBottom: '10px' }}>
                  ${parseFloat(asset.value || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
                </strong>
                <button onClick={() => handleDelete(asset.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', padding: '6px 12px', fontWeight: 'bold' }}>
                  Drop
                </button>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}
