import React, { useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#ff4444', background: '#0a0a0a', minHeight: '100vh' }}>
          <h2>⚠️ Vehicle Module Crashed</h2>
          <p style={{ fontFamily: 'monospace', background: '#111', padding: '10px' }}>{this.state.error?.toString()}</p>
          <button onClick={() => window.history.back()} style={{ padding: '10px', background: '#333', color: '#fff', border: 'none', borderRadius: '8px' }}>Go Back</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function VehicleUI() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Towing');
  const [guideTab, setGuideTab] = useState('Limits');

  // Towing State
  const [curWt, setCurWt] = useState('5500');
  const [gvwr, setGvwr] = useState('7200');
  const [gcwr, setGcwr] = useState('15000');
  const [cargoWt, setCargoWt] = useState('400');
  const [trlWt, setTrlWt] = useState('6000');

  const cWt = parseFloat(curWt)||0;
  const gv = parseFloat(gvwr)||0;
  const gc = parseFloat(gcwr)||0;
  const cgWt = parseFloat(cargoWt)||0;
  const tWt = parseFloat(trlWt)||0;

  const maxPayload = gv - cWt;
  const tongueWt = tWt * 0.125; // 12.5% safe standard
  const remPayload = maxPayload - cgWt - tongueWt;
  const maxTow = gc - cWt - cgWt;

  // Fuel State
  const [dist, setDist] = useState('350');
  const [mpg, setMpg] = useState('14');
  const [price, setPrice] = useState('3.85');
  const [split, setSplit] = useState('1');

  const gals = (parseFloat(dist)||0) / (parseFloat(mpg)||1);
  const tripCost = gals * (parseFloat(price)||0);
  const perPerson = tripCost / (parseFloat(split)||1);

  // Winch State
  const [recWt, setRecWt] = useState('6000');
  const [mire, setMire] = useState('1.0');
  const [grad, setGrad] = useState('0.25');

  const wWt = parseFloat(recWt)||0;
  const mFac = parseFloat(mire)||0;
  const gFac = parseFloat(grad)||0;
  const reqPull = (wWt * mFac) + (wWt * gFac);
  const minWinch = reqPull * 1.5; // 1.5x Safety Factor

  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.05em', marginTop: '4px' };
  const labelStyle = { color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const infoStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid #222', borderRadius: '8px', padding: '10px', marginBottom: '12px', fontSize: '0.82em', lineHeight: '1.4' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Vehicle & Fleet</h2>
      </header>

      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Towing', 'Trip Cost', 'Winch', 'Reference'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: activeTab === tab ? '#00cc66' : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>{tab}</button>
        ))}
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '95px' }}>
        {activeTab === 'Towing' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#ef4444' }}>GVWR & Payload Safety</h3>
              <div style={infoStyle}><strong style={{ color: '#00ffff' }}>What it does:</strong> Calculates your true available payload after passengers, cargo, and trailer tongue weight are factored in.</div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>GVWR (lbs)<input type="number" value={gvwr} onChange={e=>setGvwr(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Curb Wt (lbs)<input type="number" value={curWt} onChange={e=>setCurWt(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Cargo/Pax (lbs)<input type="number" value={cargoWt} onChange={e=>setCargoWt(e.target.value)} style={inputStyle} /></label></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Trailer (lbs)<input type="number" value={trlWt} onChange={e=>setTrlWt(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Max Payload:</span> <span>{maxPayload} lbs</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed #333' }}><span>Tongue Wt (12.5%):</span> <span style={{ color: '#f59e0b' }}>-{tongueWt.toFixed(0)} lbs</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#fff' }}>Remaining Payload:</strong>
                  <strong style={{ color: remPayload < 0 ? '#ef4444' : '#00cc66', fontSize: '1.2em' }}>{remPayload.toFixed(0)} lbs</strong>
                </div>
                {remPayload < 0 && <div style={{ color: '#ef4444', fontSize: '0.8em', marginTop: '10px', textAlign: 'right' }}>⚠️ OVERLOADED: Rear axle suspension failure risk.</div>}
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#3b82f6' }}>GCWR Max Tow Limit</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>GCWR (lbs)<input type="number" value={gcwr} onChange={e=>setGcwr(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#aaa' }}>Max Safe Trailer Wt:</span>
                <strong style={{ color: maxTow < tWt ? '#ef4444' : '#3b82f6', fontSize: '1.2em' }}>{maxTow.toFixed(0)} lbs</strong>
              </div>
            </div>
          </>
        )}

        {activeTab === 'Trip Cost' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #00cc66' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>⛽ Route & Fuel Matrix</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>Distance (mi)<input type="number" value={dist} onChange={e=>setDist(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Avg MPG<input type="number" value={mpg} onChange={e=>setMpg(e.target.value)} style={inputStyle} /></label></div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>Fuel Price ($)<input type="number" step="0.01" value={price} onChange={e=>setPrice(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Split Ways<input type="number" value={split} onChange={e=>setSplit(e.target.value)} style={inputStyle} /></label></div>
            </div>
            <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Gallons Required:</span> <span>{gals.toFixed(1)} gal</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed #333' }}><span>Total Trip Cost:</span> <span style={{ color: '#ef4444' }}>${tripCost.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#fff' }}>Cost Per Person:</strong>
                <strong style={{ color: '#00cc66', fontSize: '1.5em' }}>${perPerson.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'Winch' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
            <h3 style={{ margin: '0 0 6px 0', color: '#f59e0b' }}>🪝 Winch Recovery Pull</h3>
            <div style={infoStyle}><strong style={{ color: '#00ffff' }}>What it does:</strong> Calculates the sheer physical pulling force required to extract a stuck vehicle based on mire depth and incline.</div>
            <div style={{ marginBottom: '15px' }}><label style={labelStyle}>Stuck Vehicle Weight (lbs)<input type="number" value={recWt} onChange={e=>setRecWt(e.target.value)} style={inputStyle} /></label></div>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Mire Depth</label>
                <select value={mire} onChange={e=>setMire(e.target.value)} style={{ ...inputStyle, height: '44px' }}>
                  <option value="0.1">Hard Surface / Flat</option>
                  <option value="1.0">Wheel Deep (Mud/Sand)</option>
                  <option value="2.0">Fender Deep (Bog)</option>
                  <option value="3.0">Cab Deep (Total Loss)</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Gradient</label>
                <select value={grad} onChange={e=>setGrad(e.target.value)} style={{ ...inputStyle, height: '44px' }}>
                  <option value="0">Flat (0°)</option>
                  <option value="0.25">Mild (15°)</option>
                  <option value="0.50">Steep (30°)</option>
                  <option value="0.75">Extreme (45°)</option>
                </select>
              </div>
            </div>

            <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Resistance Pull:</span> <span>{reqPull.toFixed(0)} lbs</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed #333' }}><span>With Snatch Block (2:1):</span> <span style={{ color: '#00cc66' }}>{(reqPull/2).toFixed(0)} lbs</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#fff' }}>Min Winch Rating (1.5x):</strong>
                <strong style={{ color: '#f59e0b', fontSize: '1.2em' }}>{minWinch.toFixed(0)} lbs</strong>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Reference' && (
          <>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {['Limits', 'Snatch Blocks', 'Tires'].map(sub => (
                <button key={sub} onClick={() => setGuideTab(sub)} style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: guideTab === sub ? 'rgba(0, 204, 102, 0.2)' : '#151515', color: guideTab === sub ? '#00cc66' : '#888' }}>{sub}</button>
              ))}
            </div>

            {guideTab === 'Limits' && (
              <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>Towing Data Plates</h3>
                <p style={{ color: '#aaa', fontSize: '0.85em', margin: '0 0 8px 0', lineHeight: '1.4' }}>• <strong>GVWR (Gross Vehicle Weight Rating):</strong> The absolute maximum your truck can weigh (Truck + Fuel + People + Cargo + Trailer Tongue). Exceeding this voids insurance.<br/><br/>• <strong>GCWR (Gross Combined):</strong> The absolute maximum your truck AND the trailer can weigh together.<br/><br/>• <strong>Tongue Weight:</strong> The downward force the trailer applies to the hitch. Must be 10% to 15% of the total trailer weight to prevent lethal highway sway.</p>
              </div>
            )}

            {guideTab === 'Snatch Blocks' && (
              <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>Mechanical Advantage</h3>
                <p style={{ color: '#aaa', fontSize: '0.85em', margin: '0 0 8px 0', lineHeight: '1.4' }}>A snatch block is a heavy-duty pulley. Running your winch cable out to a snatch block (attached to a tree) and back to your own bumper creates a <strong>2:1 mechanical advantage</strong>.<br/><br/>This instantly doubles the pulling power of your winch (a 9,000 lb winch pulls 18,000 lbs) but cuts the line speed exactly in half. Crucial for deep mud extractions.</p>
              </div>
            )}

            {guideTab === 'Tires' && (
              <div style={{ ...cardStyle, borderLeft: '4px solid #00ffff' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#00ffff' }}>LT Ply Ratings</h3>
                <p style={{ color: '#aaa', fontSize: '0.85em', margin: '0 0 8px 0', lineHeight: '1.4' }}>Light Truck (LT) tires are required for heavy towing. Passenger (P) tires will blow out under heavy tongue weight.<br/><br/>• <strong>Load Range C:</strong> 6-Ply Equivalent (Light towing/Off-road)<br/>• <strong>Load Range D:</strong> 8-Ply Equivalent (Medium towing)<br/>• <strong>Load Range E:</strong> 10-Ply Equivalent (Heavy Duty / 3/4 Ton Trucks, 80 PSI max)</p>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default function VehicleCalc() {
  return <ErrorBoundary><VehicleUI /></ErrorBoundary>;
}
