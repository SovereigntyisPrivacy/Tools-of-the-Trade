import React, { useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../core/CalendarContext';

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
  const [activeTab, setActiveTab] = useState('Fuel');
  const [guideTab, setGuideTab] = useState('Rental');
  const { addReminder, globalDate } = useCalendar();

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
  const tongueWt = tWt * 0.125; 
  const remPayload = maxPayload - cgWt - tongueWt;
  const maxTow = gc - cWt - cgWt;

  // Fuel & Range State (Restored!)
  const [preset, setPreset] = useState('');
  const [dist, setDist] = useState('350');
  const [mpg, setMpg] = useState('14');
  const [tank, setTank] = useState('25');
  const [price, setPrice] = useState('3.85');
  
  const handlePreset = (val) => {
    setPreset(val);
    if(val === 'cargo') { setMpg('18'); setTank('25'); }
    if(val === '15ft') { setMpg('10'); setTank('33'); }
    if(val === '26ft') { setMpg('8'); setTank('40'); }
  };

  const gals = (parseFloat(dist)||0) / (parseFloat(mpg)||1);
  const tripCost = gals * (parseFloat(price)||0);
  const maxRange = (parseFloat(mpg)||0) * (parseFloat(tank)||0);

  // Winch State
  const [recWt, setRecWt] = useState('6000');
  const [mire, setMire] = useState('1.0');
  const [grad, setGrad] = useState('0.25');

  const wWt = parseFloat(recWt)||0;
  const reqPull = (wWt * parseFloat(mire)||0) + (wWt * parseFloat(grad)||0);
  const minWinch = reqPull * 1.5;

  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.05em', marginTop: '4px' };
  const labelStyle = { color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Vehicle & Fleet</h2>
      </header>

      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Fuel', 'Towing', 'Winch', 'DVIR', 'Reference'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: activeTab === tab ? '#00cc66' : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>{tab}</button>
        ))}
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '95px' }}>
        {activeTab === 'Fuel' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #00cc66' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#00cc66', textAlign: 'center' }}>Trip Fuel Estimator</h3>
            
            <select value={preset} onChange={e=>handlePreset(e.target.value)} style={{ ...inputStyle, height: '45px', marginBottom: '20px', background: '#222' }}>
              <option value="">Standard Select...</option>
              <option value="cargo">Cargo Van (18 MPG | 25 Gal)</option>
              <option value="15ft">15ft Box Truck (10 MPG | 33 Gal)</option>
              <option value="26ft">26ft Box Truck (8 MPG | 40 Gal)</option>
            </select>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>Distance (mi)<input type="number" value={dist} onChange={e=>setDist(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Fuel Price ($)<input type="number" step="0.01" value={price} onChange={e=>setPrice(e.target.value)} style={inputStyle} /></label></div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#aaa'}}>Avg MPG<input type="number" value={mpg} onChange={e=>setMpg(e.target.value)} style={inputStyle} /></label></div>
              <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#aaa'}}>Tank (Gal)<input type="number" value={tank} onChange={e=>setTank(e.target.value)} style={inputStyle} /></label></div>
            </div>

            <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px' }}><span>Max Range (Full Tank):</span> <span style={{ fontWeight: 'bold' }}>{maxRange.toFixed(0)} Miles</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed #333' }}><span>Total Fuel Required:</span> <span>{gals.toFixed(1)} Gal</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#fff', fontSize: '1.1em' }}>Est. Trip Cost:</strong>
                <strong style={{ color: '#00cc66', fontSize: '1.8em' }}>${tripCost.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Towing' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#ef4444' }}>GVWR & Payload Safety</h3>
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
              </div>
            </div>
          </>
        )}
        {activeTab === 'Winch' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
            <h3 style={{ margin: '0 0 6px 0', color: '#f59e0b' }}>🪝 Winch Recovery Pull</h3>
            <div style={{ marginBottom: '15px' }}><label style={labelStyle}>Stuck Vehicle Weight (lbs)<input type="number" value={recWt} onChange={e=>setRecWt(e.target.value)} style={inputStyle} /></label></div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Mire Depth</label>
                <select value={mire} onChange={e=>setMire(e.target.value)} style={{ ...inputStyle, height: '44px' }}>
                  <option value="0.1">Hard Surface / Flat</option><option value="1.0">Wheel Deep (Mud)</option>
                  <option value="2.0">Fender Deep (Bog)</option><option value="3.0">Cab Deep</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Gradient</label>
                <select value={grad} onChange={e=>setGrad(e.target.value)} style={{ ...inputStyle, height: '44px' }}>
                  <option value="0">Flat (0°)</option><option value="0.25">Mild (15°)</option>
                  <option value="0.50">Steep (30°)</option><option value="0.75">Extreme (45°)</option>
                </select>
              </div>
            </div>
            <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed #333' }}><span>Resistance Pull:</span> <span>{reqPull.toFixed(0)} lbs</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#fff' }}>Min Winch Rating (1.5x):</strong>
                <strong style={{ color: '#f59e0b', fontSize: '1.2em' }}>{minWinch.toFixed(0)} lbs</strong>
              </div>
            </div>
          </div>
        )}

        
        {activeTab === 'DVIR' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #00ffff' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#00ffff' }}>📋 Daily DOT Inspection</h3>
            <div style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}>Drivers must clear this checklist before deploying commercial assets over 10k lbs.</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222', marginBottom: '15px' }}>
              {['Brakes (Air/Hydraulic) Checked', 'Tire Pressure & Tread Depth Safe', 'Headlights, Signals & Hazards Active', 'Wipers & Horn Operational', 'No Active Fluid Leaks'].map((item, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#fff', fontSize: '0.9em', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ width: '22px', height: '22px', accentColor: '#00cc66' }} />
                  {item}
                </label>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input type="text" id="dvir_driver" placeholder="Driver Name" style={{...inputStyle, flex: 1, marginTop: 0}} />
              <input type="text" id="dvir_truck" placeholder="Truck ID" style={{...inputStyle, flex: 1, marginTop: 0}} />
            </div>

            <button onClick={() => {
              const driver = document.getElementById('dvir_driver').value || 'Unknown';
              const truck = document.getElementById('dvir_truck').value || 'Unknown Truck';
              addReminder(globalDate, `[DVIR CLEARED] ${truck} checked by ${driver}`, 'Vehicle', 'Done');
              alert("DVIR Logged to Master Calendar!");
            }} style={{ width: '100%', padding: '12px', background: '#00cc66', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Submit Clear Inspection</button>
          </div>
        )}

        {activeTab === 'Reference' && (
          <>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {['Rental', 'Limits', 'Snatch Blocks', 'Tires'].map(sub => (
                <button key={sub} onClick={() => setGuideTab(sub)} style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: guideTab === sub ? 'rgba(0, 204, 102, 0.2)' : '#151515', color: guideTab === sub ? '#00cc66' : '#888' }}>{sub}</button>
              ))}
            </div>

            {guideTab === 'Rental' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#ef4444', textAlign: 'center' }}>⚠️ The Credit Card Insurance Myth</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.5' }}>Virtually <strong>all</strong> personal auto insurance policies and premium credit cards (Visa Signature, Amex Platinum) explicitly <strong>exclude coverage for commercial box trucks</strong> and any vehicle over 10,000 lbs GVWR. If you hit a bridge or total a 26ft rental truck, you are personally liable for the $60,000+ replacement cost unless you purchase the rental company's LDW (Loss Damage Waiver).</p>
                </div>
                
                <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>🏢 Corporate Breakdown</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: '0 0 8px 0', lineHeight: '1.4' }}>• <strong>Penske:</strong> Commercial-grade fleet. Usually more expensive base rate, but they guarantee reservations and often give unlimited miles on One-Way moves.</p>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: '0 0 8px 0', lineHeight: '1.4' }}>• <strong>U-Haul:</strong> Franchise model. They have the most locations, but reservations are <em>not</em> fully guaranteed (they will move your pickup location or downgrade your truck size if fleet is low). Local moves charge heavily per mile.</p>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>• <strong>Budget:</strong> Usually the cheapest option, but their fleet tends to run older. Good for strict budgets.</p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#00cc66' }}>⚖️ Weigh Stations & Clearances</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: '0 0 8px 0', lineHeight: '1.4' }}>• <strong>Weigh Stations:</strong> Rules vary wildly by state. In general, rental trucks over 10,000 lbs (like a loaded 26ft Penske) may be required to stop at scales, especially in states like California or Florida. When in doubt, pull in.</p>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>• <strong>Clearances (The 11'8" Rule):</strong> Box trucks are generally 12 to 13.5 feet tall. Do <strong>not</strong> go through fast-food drive-thrus, parking garages, or under unmarked old city bridges. Hitting an awning will peel the roof back like a tin can.</p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#a855f7' }}>🛂 Borders & Agriculture Stops</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: '0 0 8px 0', lineHeight: '1.4' }}><strong>Mexico:</strong> Absolutely prohibited. Rental insurance voids the moment you cross the southern border.</p>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: '0 0 8px 0', lineHeight: '1.4' }}><strong>Canada:</strong> Generally allowed, but you MUST declare it at the time of reservation to ensure your contract and insurance paperwork are valid at the border.</p>
                  <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}><strong>State Ag Stops (e.g., California):</strong> You must stop at agricultural inspection checkpoints. Have your padlock keys ready; they will ask to open the back of the truck to check for invasive plants or livestock.</p>
                </div>
              </div>
            )}

            {guideTab === 'Limits' && (
              <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>Towing Data Plates</h3>
                <p style={{ color: '#aaa', fontSize: '0.85em', margin: '0 0 8px 0', lineHeight: '1.4' }}>• <strong>GVWR (Gross Vehicle Weight Rating):</strong> The absolute maximum your truck can weigh (Truck + Fuel + People + Cargo + Trailer Tongue).</p>
                <p style={{ color: '#aaa', fontSize: '0.85em', margin: '0 0 8px 0', lineHeight: '1.4' }}>• <strong>GCWR (Gross Combined):</strong> The absolute maximum your truck AND the trailer can weigh together.</p>
              </div>
            )}
            
            {guideTab === 'Snatch Blocks' && (
              <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>Mechanical Advantage</h3>
                <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>A snatch block is a heavy-duty pulley. Running your winch cable out to a snatch block (attached to a tree) and back to your own bumper creates a <strong>2:1 mechanical advantage</strong>, doubling the pulling power but cutting line speed in half.</p>
              </div>
            )}

            {guideTab === 'Tires' && (
              <div style={{ ...cardStyle, borderLeft: '4px solid #00ffff' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#00ffff' }}>LT Ply Ratings</h3>
                <p style={{ color: '#aaa', fontSize: '0.85em', margin: '0 0 8px 0', lineHeight: '1.4' }}>Light Truck (LT) tires are required for heavy towing. Passenger (P) tires will blow out under heavy tongue weight.</p>
                <p style={{ color: '#aaa', fontSize: '0.85em', margin: 0, lineHeight: '1.4' }}>• <strong>Load Range C:</strong> 6-Ply Eq.<br/>• <strong>Load Range D:</strong> 8-Ply Eq.<br/>• <strong>Load Range E:</strong> 10-Ply Eq. (Heavy Duty / 80 PSI max)</p>
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
