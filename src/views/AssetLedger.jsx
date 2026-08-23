import React, { useState, useEffect, Component } from 'react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#ff4444', background: '#0a0a0a', minHeight: '100vh' }}>
          <h2>⚠️ Ledger Module Crashed</h2>
          <p style={{ fontFamily: 'monospace', background: '#111', padding: '10px' }}>{this.state.error?.toString()}</p>
          <button onClick={() => window.history.back()} style={{ padding: '10px', background: '#333', color: '#fff', border: 'none', borderRadius: '8px' }}>Go Back</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function LedgerUI() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Ledger');
  const [guideTab, setGuideTab] = useState('Insurance');
  const [showForm, setShowForm] = useState(false);

  // Load from LocalStorage
  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem('fleet_assets');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fleet_assets', JSON.stringify(assets));
  }, [assets]);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [warranty, setWarranty] = useState('12');
  const [sec179, setSec179] = useState(true);
  const [status, setStatus] = useState('Deployed');

  const addAsset = () => {
    if (!name || !price || !date) return alert("Fill out Name, Price, and Date.");
    const newAsset = { id: Date.now(), name, price: parseFloat(price), date, warranty: parseInt(warranty), sec179, status };
    setAssets([newAsset, ...assets]);
    setShowForm(false);
    setName(''); setPrice(''); setDate('');
  };

  const deleteAsset = (id) => { setAssets(assets.filter(a => a.id !== id)); };

  const totalValue = assets.reduce((sum, a) => sum + a.price, 0);

  // Math Engines
  const calculateDepreciation = (purchasePrice, purchaseDate) => {
    const monthsOld = (new Date() - new Date(purchaseDate)) / (1000 * 60 * 60 * 24 * 30.44);
    if (monthsOld < 0) return purchasePrice;
    const monthlyDepreciation = purchasePrice / 60; // 5-year commercial straight-line
    const bookValue = purchasePrice - (monthlyDepreciation * monthsOld);
    return bookValue > 0 ? bookValue : 0;
  };

  const checkWarranty = (purchaseDate, warrantyMonths) => {
    const monthsOld = (new Date() - new Date(purchaseDate)) / (1000 * 60 * 60 * 24 * 30.44);
    return monthsOld <= warrantyMonths;
  };

  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', marginTop: '4px', marginBottom: '12px' };
  const labelStyle = { color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Asset & Gear Ledger</h2>
      </header>

      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '6px' }}>
        {['Ledger', 'Guide'].map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setShowForm(false); }} style={{ flex: 1, padding: '8px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === tab ? '#00cc66' : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>{tab}</button>
        ))}
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '95px' }}>
        {activeTab === 'Ledger' && !showForm && (
          <>
            <div style={{ background: '#111', border: '1px solid #00cc66', borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '15px' }}>
              <div style={{ color: '#aaa', fontSize: '0.85em', fontWeight: 'bold', letterSpacing: '1px' }}>TOTAL FLEET VALUE</div>
              <div style={{ color: '#00cc66', fontSize: '2.5em', fontWeight: 'bold', margin: '5px 0' }}>${totalValue.toFixed(2)}</div>
              <div style={{ color: '#888', fontSize: '0.9em' }}>{assets.length} Tracked Assets</div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button onClick={() => setShowForm(true)} style={{ flex: 1, background: '#3b82f6', color: '#fff', fontWeight: 'bold', padding: '12px', border: 'none', borderRadius: '8px' }}>+ Log New Asset</button>
              <button style={{ flex: 1, background: '#222', color: '#fff', fontWeight: 'bold', padding: '12px', border: 'none', borderRadius: '8px' }}>📋 Export CSV</button>
            </div>

            {assets.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#555', marginTop: '40px' }}>No assets logged in this category.</div>
            ) : (
              assets.map(asset => {
                const bookValue = calculateDepreciation(asset.price, asset.date);
                const hasWarranty = checkWarranty(asset.date, asset.warranty);
                return (
                  <div key={asset.id} style={{ ...cardStyle, borderLeft: asset.status === 'Deployed' ? '4px solid #00cc66' : '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px 0', color: '#fff' }}>{asset.name}</h3>
                        <span style={{ fontSize: '0.8em', background: '#222', padding: '2px 6px', borderRadius: '4px', color: '#aaa' }}>{asset.status}</span>
                        {asset.sec179 && <span style={{ fontSize: '0.8em', background: 'rgba(168,85,247,0.2)', padding: '2px 6px', borderRadius: '4px', color: '#a855f7', marginLeft: '6px' }}>IRS Sec 179</span>}
                      </div>
                      <button onClick={() => deleteAsset(asset.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.2em' }}>×</button>
                    </div>
                    
                    <div style={{ display: 'flex', marginTop: '15px', gap: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#888', fontSize: '0.75em', textTransform: 'uppercase' }}>Purchase Price</div>
                        <div style={{ color: '#fff', fontWeight: 'bold' }}>${asset.price.toFixed(2)}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#888', fontSize: '0.75em', textTransform: 'uppercase' }}>Book Value (Depr)</div>
                        <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>${bookValue.toFixed(2)}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#888', fontSize: '0.75em', textTransform: 'uppercase' }}>Warranty</div>
                        <div style={{ color: hasWarranty ? '#00cc66' : '#ef4444', fontWeight: 'bold' }}>{hasWarranty ? 'Active' : 'Expired'}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {activeTab === 'Ledger' && showForm && (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>Log New Asset</h3>
            <label style={labelStyle}>Asset Brand & Model<input type="text" value={name} onChange={e=>setName(e.target.value)} style={inputStyle} placeholder="e.g. DeWalt 20V Max Drill" /></label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>Price ($)<input type="number" value={price} onChange={e=>setPrice(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Date Acquired<input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inputStyle} /></label></div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>Warranty (Months)<input type="number" value={warranty} onChange={e=>setWarranty(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Status
                <select value={status} onChange={e=>setStatus(e.target.value)} style={{ ...inputStyle, height: '44px' }}>
                  <option value="Deployed">Deployed</option>
                  <option value="Storage">In Storage</option>
                  <option value="Repair">Needs Repair</option>
                </select>
              </label></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #333' }}>
              <input type="checkbox" checked={sec179} onChange={e=>setSec179(e.target.checked)} style={{ width: '20px', height: '20px' }} />
              <div>
                <div style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '0.9em' }}>Flag for IRS Section 179</div>
                <div style={{ color: '#888', fontSize: '0.75em' }}>Deduct full purchase price this tax year.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px', background: '#222', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Cancel</button>
              <button onClick={addAsset} style={{ flex: 1, padding: '12px', background: '#00cc66', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Save Asset</button>
            </div>
          </div>
        )}
        {activeTab === 'Guide' && (
          <>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {['Insurance', 'Taxes (179)', 'Depreciation', 'Lifecycle', '3-Photo Rule'].map(sub => (
                <button key={sub} onClick={() => setGuideTab(sub)} style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: guideTab === sub ? 'rgba(0, 204, 102, 0.2)' : '#151515', color: guideTab === sub ? '#00cc66' : '#888' }}>{sub}</button>
              ))}
            </div>

            {guideTab === 'Insurance' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#ef4444' }}>RCV vs. ACV (Don't Get Scammed)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>Always ensure your commercial policy has <strong>Replacement Cost Value (RCV)</strong>, not Actual Cash Value (ACV). If a 5-year-old generator is stolen, an ACV policy pays its depreciated pawn-shop value ($150). An RCV policy pays exactly what it costs to buy a brand-new equivalent model today.</p>
                </div>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00ffff' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#00ffff' }}>The Burden of Proof</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>Adjusters will default to the cheapest possible replacement brand if you just write "Drill" on a claim. To force them to pay for professional-grade gear, your ledger must clearly state the exact Make and Model Number.</p>
                </div>
              </div>
            )}

            {guideTab === 'Taxes (179)' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#a855f7' }}>IRS Section 179 Deduction</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>Normally, when a business buys a $5,000 piece of equipment, they have to capitalize it and write off a fraction of the cost over 5 years. <strong>Section 179</strong> allows you to deduct the <em>entire purchase price</em> from your gross income in the very first year it is placed into service. Flag high-value tools in this ledger to hand to your CPA.</p>
                </div>
              </div>
            )}

            {guideTab === 'Depreciation' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#3b82f6' }}>Straight-Line vs. MACRS</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>• <strong>Straight-Line:</strong> The ledger calculates this automatically. The asset loses an equal amount of value every month for 5 years (standard commercial lifespan).<br/>• <strong>MACRS:</strong> The IRS standard for accelerated depreciation, meaning you write off a larger chunk of the asset's value in the first two years. Good for heavy equipment that degrades quickly.</p>
                </div>
              </div>
            )}

            {guideTab === 'Lifecycle' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#00cc66' }}>Preventative Maintenance (PM)</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>Generators, lifts, and fleet vehicles require tracked service intervals (Run Hours). Missing a scheduled oil change or hydraulic inspection on commercial gear immediately voids the manufacturer warranty. Update the asset status to "Needs Repair" to pull it from the active deployment pool.</p>
                </div>
              </div>
            )}

            {guideTab === '3-Photo Rule' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#f59e0b' }}>Bulletproof Evidence</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>To guarantee insurance payouts, physically backup your ledger with three photos per asset:<br/><strong>1. The Wide Shot:</strong> Showing overall condition.<br/><strong>2. The Data Plate:</strong> Macro shot of the Serial and Model numbers.<br/><strong>3. The Receipt:</strong> Original invoice proving purchase price and date.</p>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default function AssetLedger() {
  return <ErrorBoundary><LedgerUI /></ErrorBoundary>;
}
