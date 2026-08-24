import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AssetLedger() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState(() => JSON.parse(localStorage.getItem('asset_ledger') || '[]'));
  const [activeTab, setActiveTab] = useState('Ledger');

  // Edit & Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [purchDate, setPurchDate] = useState(new Date().toISOString().split('T')[0]);
  const [warrantyStr, setWarrantyStr] = useState('1 Year');
  const [status, setStatus] = useState('Deployed');
  const [photo, setPhoto] = useState(null);

  useEffect(() => { localStorage.setItem('asset_ledger', JSON.stringify(assets)); }, [assets]);

  // Straight-line depreciation (5 years)
  const getBookValue = (cost, pDate) => {
    if (!pDate || !cost) return cost || 0;
    const yearsElapsed = (new Date() - new Date(pDate)) / (1000 * 60 * 60 * 24 * 365);
    const depr = parseFloat(cost) * (yearsElapsed / 5);
    return Math.max(parseFloat(cost) - depr, 0).toFixed(2);
  };

  // The Time-Math Engine
  const calcExpDate = (startStr, duration) => {
    if (!startStr || duration === 'None') return '';
    const d = new Date(startStr + 'T00:00:00');
    if (duration === '1 Month') d.setMonth(d.getMonth() + 1);
    if (duration === '3 Months') d.setMonth(d.getMonth() + 3);
    if (duration === '6 Months') d.setMonth(d.getMonth() + 6);
    if (duration === '1 Year') d.setFullYear(d.getFullYear() + 1);
    if (duration === '3 Years') d.setFullYear(d.getFullYear() + 3);
    if (duration === 'Lifetime') return '2099-12-31';
    return d.toISOString().split('T')[0];
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name || !price) return alert('Name and Price are required.');
    
    // Engine mathematically calculates the exact expiration date for the Calendar Omni-Scraper
    const expDate = calcExpDate(purchDate, warrantyStr);

    const payload = {
      id: editingId || `ast_${Date.now()}`,
      name, price: parseFloat(price), purchDate, warrantyStr, expDate, status, photo
    };

    if (editingId) {
      setAssets(assets.map(a => a.id === editingId ? payload : a));
    } else {
      setAssets([...assets, payload]);
    }
    closeModal();
  };

  const openEdit = (asset) => {
    setEditingId(asset.id);
    setName(asset.name); setPrice(asset.price); setPurchDate(asset.purchDate || new Date().toISOString().split('T')[0]);
    setWarrantyStr(asset.warrantyStr || '1 Year'); setStatus(asset.status || 'Deployed'); setPhoto(asset.photo || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false); setEditingId(null);
    setName(''); setPrice(''); setPurchDate(new Date().toISOString().split('T')[0]);
    setWarrantyStr('1 Year'); setStatus('Deployed'); setPhoto(null);
  };

  const exportCSV = () => {
    let csv = "Asset,Status,Purchase Date,Purchase Price,Book Value,Warranty,Expiration\n";
    assets.forEach(a => {
      csv += `${a.name},${a.status},${a.purchDate},${a.price},${getBookValue(a.price, a.purchDate)},${a.warrantyStr},${a.expDate || 'N/A'}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Asset_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const totalVal = assets.reduce((sum, a) => sum + parseFloat(a.price || 0), 0);

  const inputStyle = { width: '100%', padding: '12px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', marginBottom: '10px' };
  const labelStyle = { color: '#a855f7', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', display: 'block' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Asset & Gear Ledger</h2>
      </header>

      <div style={{ display: 'flex', background: '#111', padding: '10px', gap: '6px' }}>
        <button onClick={() => setActiveTab('Ledger')} style={{ flex: 1, padding: '8px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === 'Ledger' ? '#00cc66' : '#222', color: activeTab === 'Ledger' ? '#000' : '#aaa' }}>Ledger</button>
        <button onClick={() => setActiveTab('Guide')} style={{ flex: 1, padding: '8px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === 'Guide' ? '#00cc66' : '#222', color: activeTab === 'Guide' ? '#000' : '#aaa' }}>Guide</button>
      </div>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        {activeTab === 'Ledger' && (
          <>
            <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #00cc66', padding: '20px', textAlign: 'center', marginBottom: '15px' }}>
              <div style={{ color: '#aaa', fontSize: '0.85em', fontWeight: 'bold', letterSpacing: '1px' }}>TOTAL FLEET VALUE</div>
              <div style={{ color: '#00cc66', fontSize: '2.5em', fontWeight: 'bold' }}>${totalVal.toFixed(2)}</div>
              <div style={{ color: '#888', fontSize: '0.9em' }}>{assets.length} Tracked Assets</div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button onClick={() => setShowModal(true)} style={{ flex: 1, background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>+ Log New Asset</button>
              <button onClick={exportCSV} style={{ flex: 1, background: '#222', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>📋 Export CSV</button>
            </div>

            {/* Asset Roster */}
            {assets.map(a => (
              <div key={a.id} style={{ background: '#111', borderRadius: '12px', border: '1px solid #222', borderLeft: a.status === 'Voided' ? '4px solid #ef4444' : '4px solid #00cc66', padding: '15px', marginBottom: '15px', position: 'relative' }}>
                <button onClick={(e) => { e.stopPropagation(); setAssets(assets.filter(ast => ast.id !== a.id)); }} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.2em' }}>×</button>
                
                {/* Clickable Area to Edit */}
                <div onClick={() => openEdit(a)} style={{ cursor: 'pointer' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1.2em' }}>{a.name}</h3>
                  <div style={{ display: 'inline-block', background: '#222', padding: '4px 8px', borderRadius: '4px', color: '#aaa', fontSize: '0.75em', marginBottom: '15px' }}>{a.status}</div>
                  
                  {a.photo && <img src={a.photo} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px', border: '1px solid #333' }} />}

                  <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
                    <div>
                      <div style={{ color: '#888', fontSize: '0.7em', textTransform: 'uppercase', marginBottom: '5px' }}>Purchase Price</div>
                      <strong style={{ color: '#fff', fontSize: '1.1em' }}>${a.price.toFixed(2)}</strong>
                    </div>
                    <div>
                      <div style={{ color: '#888', fontSize: '0.7em', textTransform: 'uppercase', marginBottom: '5px' }}>Book Value (Depr)</div>
                      <strong style={{ color: '#3b82f6', fontSize: '1.1em' }}>${getBookValue(a.price, a.purchDate)}</strong>
                    </div>
                    <div>
                      <div style={{ color: '#888', fontSize: '0.7em', textTransform: 'uppercase', marginBottom: '5px' }}>Warranty</div>
                      <strong style={{ color: a.status === 'Voided' ? '#ef4444' : '#00cc66', fontSize: '1.1em' }}>{a.status === 'Voided' ? 'Void' : 'Active'}</strong>
                      {a.expDate && <div style={{ color: '#555', fontSize: '0.7em', marginTop: '2px' }}>Ends: {a.expDate.substring(5)}</div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Edit / Log Modal */}
      {showModal && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', flexDirection: 'column', padding: '20px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#fff', margin: 0 }}>{editingId ? 'Edit Asset' : 'Log New Asset'}</h2>
            <button onClick={closeModal} style={{ background: 'transparent', color: '#fff', border: 'none', fontSize: '1.5em' }}>×</button>
          </div>

          <label style={labelStyle}>Asset Name</label>
          <input type="text" value={name} onChange={e=>setName(e.target.value)} style={inputStyle} />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}><label style={labelStyle}>Price ($)</label><input type="number" value={price} onChange={e=>setPrice(e.target.value)} style={inputStyle} /></div>
            <div style={{ flex: 1 }}><label style={labelStyle}>Purchase Date</label><input type="date" value={purchDate} onChange={e=>setPurchDate(e.target.value)} style={inputStyle} /></div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Warranty Length</label>
              <select value={warrantyStr} onChange={e=>setWarrantyStr(e.target.value)} style={inputStyle}>
                <option value="None">None</option>
                <option value="1 Month">1 Month</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year</option>
                <option value="3 Years">3 Years</option>
                <option value="Lifetime">Lifetime</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Status</label>
              <select value={status} onChange={e=>setStatus(e.target.value)} style={{...inputStyle, color: status === 'Voided' ? '#ef4444' : '#fff' }}>
                <option value="Deployed">Deployed</option>
                <option value="In Repair">In Repair</option>
                <option value="Voided">Voided</option>
                <option value="Lost/Stolen">Lost/Stolen</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', width: '100%', padding: '12px', background: '#222', border: '1px dashed #00ffff', borderRadius: '8px', color: '#00ffff', textAlign: 'center', cursor: 'pointer', fontWeight: 'bold' }}>
              📸 {photo ? 'Photo Captured (Tap to Retake)' : 'Snap Photographic Proof'}
              <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: 'none' }} />
            </label>
            {photo && <img src={photo} alt="Proof" style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />}
          </div>

          <button onClick={handleSave} style={{ width: '100%', padding: '15px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginTop: 'auto' }}>
            {editingId ? 'Update Asset' : 'Save to Ledger'}
          </button>
        </div>
      )}
    </div>
  );
}
