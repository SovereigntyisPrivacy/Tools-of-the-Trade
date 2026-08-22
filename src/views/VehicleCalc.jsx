import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VehicleCalc() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Trucking'); // 'Trucking', 'Towing', 'Recovery', 'Rental'

  // --- CDL & TRUCKING STATE ---
  const [driveHours, setDriveHours] = useState('0');
  const [dutyHours, setDutyHours] = useState('0');
  const [cycleHours, setCycleHours] = useState('0');

  // --- HOME TOWING STATE ---
  const [gvwr, setGvwr] = useState('7000');
  const [gcwr, setGcwr] = useState('13000');
  const [curbWt, setCurbWt] = useState('5200');
  const [gearWt, setGearWt] = useState('450');
  const [trailerWt, setTrailerWt] = useState('6500');

  // --- RECOVERY STATE ---
  const [stuckWt, setStuckWt] = useState('5500');
  const [mireLvl, setMireLvl] = useState('1'); // Surface resistance multiplier
  const [gradient, setGradient] = useState('0'); // Slope multiplier

  // --- RENTAL & TRIP STATE ---
  const [tripDist, setTripDist] = useState('350');
  const [fuelPrice, setFuelPrice] = useState('3.50');
  const [mpg, setMpg] = useState('10');
  const [tankSize, setTankSize] = useState('33');

  const parse = (val) => parseFloat(val) || 0;

  // --- MATH ENGINES ---
  // Trucking HOS
  const remainDrive = Math.max(0, 11 - parse(driveHours));
  const remainDuty = Math.max(0, 14 - parse(dutyHours));
  const remainCycle = Math.max(0, 70 - parse(cycleHours));
  const activeLimit = Math.min(remainDrive, remainDuty, remainCycle);

  // Towing Payload & GCWR
  const pGvwr = parse(gvwr), pGcwr = parse(gcwr), pCurb = parse(curbWt), pGear = parse(gearWt), pTrail = parse(trailerWt);
  const maxPayload = Math.max(0, pGvwr - pCurb);
  const availPayload = Math.max(0, maxPayload - pGear);
  const maxTowing = Math.max(0, pGcwr - pCurb - pGear);
  const minTongue = pTrail * 0.10;
  const maxTongue = pTrail * 0.15;
  const isOverweight = pTrail > maxTowing || maxTongue > availPayload;

  // Winch Recovery
  const wStuck = parse(stuckWt);
  const wMire = parse(mireLvl);
  const wGrad = parse(gradient);
  // Total Pull = Weight + (Weight * Mire) + (Weight * Gradient)
  const reqPull = wStuck + (wStuck * wMire) + (wStuck * wGrad);
  const safeWinch = reqPull * 1.5;
  const needSnatch = safeWinch > 12000; // Assuming standard 12k winch threshold

  // Rental / Trip
  const tDist = parse(tripDist), tMpg = parse(mpg), tPrice = parse(fuelPrice), tTank = parse(tankSize);
  const galNeeded = tMpg > 0 ? tDist / tMpg : 0;
  const tripCost = galNeeded * tPrice;
  const maxRange = tTank * tMpg;
  const fuelStops = maxRange > 0 ? Math.floor(tDist / maxRange) : 0;

  // --- STYLES ---
  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.05em', marginTop: '4px' };
  const labelStyle = { color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const flexWrap = { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' };
  const inputWrap = { flex: '1 1 110px', minWidth: '110px' };

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate('/calculator')}>Hub</button>
        <h2>Vehicle & Fleet</h2>
      </header>

      {/* TOP TABS */}
      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Trucking', 'Home Towing', 'Recovery', 'Rental'].map(tab => {
          let color = '#fff';
          if (tab === 'Trucking') color = '#3b82f6';
          if (tab === 'Home Towing') color = '#a855f7';
          if (tab === 'Recovery') color = '#f59e0b';
          if (tab === 'Rental') color = '#00cc66';

          return (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ padding: '8px 14px', borderRadius: '8px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: activeTab === tab ? color : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>
              {tab}
            </button>
          )
        })}
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '150px' }}>
        
        {/* ========================================== */}
        {/* TAB 1: CDL & TRUCKING                      */}
        {/* ========================================== */}
        {activeTab === 'Trucking' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>FMCSA Hours of Service (HOS)</h3>
              <div style={flexWrap}>
                <div style={inputWrap}><label style={{...labelStyle, color: '#3b82f6'}}>Driven Today (Hrs)<input type="number" step="0.5" value={driveHours} onChange={e=>setDriveHours(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={{...labelStyle, color: '#3b82f6'}}>On-Duty Today (Hrs)<input type="number" step="0.5" value={dutyHours} onChange={e=>setDutyHours(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={inputWrap}><label style={{...labelStyle, color: '#3b82f6'}}>Cycle Hours (Past 8 Days)<input type="number" step="1" value={cycleHours} onChange={e=>setCycleHours(e.target.value)} style={inputStyle} /></label></div>
            </div>

            <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '15px', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#fff', textAlign: 'center', borderBottom: '1px solid #222', paddingBottom: '10px' }}>LOGBOOK LIMITS</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>11-Hr Drive Limit:</span> <strong style={{color: remainDrive <= 1 ? '#ef4444' : '#fff'}}>{remainDrive.toFixed(1)} hrs left</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>14-Hr Shift Limit:</span> <strong style={{color: remainDuty <= 1 ? '#ef4444' : '#fff'}}>{remainDuty.toFixed(1)} hrs left</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px' }}><span>70-Hr Cycle Limit:</span> <strong style={{color: remainCycle <= 5 ? '#ef4444' : '#fff'}}>{remainCycle.toFixed(1)} hrs left</strong></div>
              <div style={{ borderTop: '1px dashed #444', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', color: '#00ffff', fontWeight: 'bold', fontSize: '1.2em' }}>
                <span>Remaining Drive Time:</span> <span>{Math.max(0, activeLimit).toFixed(1)} hrs</span>
              </div>
            </div>

            <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#00cc66' }}>Federal Axle Weight Limits</h3>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5', margin: 0 }}>
                Maximum Gross Vehicle Weight: <strong>80,000 lbs</strong><br/>
                Steer Axle: <strong>12,000 lbs</strong> (or tire rating)<br/>
                Drive Tandems: <strong>34,000 lbs</strong><br/>
                Trailer Tandems: <strong>34,000 lbs</strong><br/>
                <em>Note: Bridge laws may reduce these maximums based on axle spacing.</em>
              </p>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(59, 130, 246, 0.05)', border: '1px dashed #3b82f6', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '1.5em', display: 'block', marginBottom: '8px' }}>☕ 🛣️</span>
              <strong style={{ color: '#3b82f6', display: 'block', marginBottom: '4px' }}>Highway Humanity Check</strong>
              <span style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.4', display: 'block' }}>
                Pull over. Stretch your legs. Drink some water. White-line fever kills. No freight load is worth dying for, and dispatch isn't driving the rig.
              </span>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* TAB 2: HOME TOWING                         */}
        {/* ========================================== */}
        {activeTab === 'Home Towing' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#a855f7' }}>Tow Vehicle Specs</h3>
              <div style={flexWrap}>
                <div style={inputWrap}><label style={{...labelStyle, color: '#a855f7'}}>GVWR (lbs)<input type="number" value={gvwr} onChange={e=>setGvwr(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={{...labelStyle, color: '#a855f7'}}>GCWR (lbs)<input type="number" value={gcwr} onChange={e=>setGcwr(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={flexWrap}>
                <div style={inputWrap}><label style={labelStyle}>Curb Wt (lbs)<input type="number" value={curbWt} onChange={e=>setCurbWt(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>Pax & Gear (lbs)<input type="number" value={gearWt} onChange={e=>setGearWt(e.target.value)} style={inputStyle} /></label></div>
              </div>
            </div>

            <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '15px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Gross Payload Cap:</span> <span>{maxPayload.toLocaleString()} lbs</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px' }}><span>Avail. Payload (For Hitch):</span> <strong style={{color: availPayload < 0 ? '#ef4444' : '#00cc66'}}>{availPayload.toLocaleString()} lbs</strong></div>
              <div style={{ borderTop: '1px dashed #444', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', color: '#a855f7', fontWeight: 'bold', fontSize: '1.2em' }}>
                <span>Max Safe Towing:</span> <span>{maxTowing.toLocaleString()} lbs</span>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>Trailer Hitch Planner</h3>
              <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.4', marginBottom: '15px' }}>Improper tongue weight causes fatal highway trailer sway. Target 10% to 15% weight distribution on the hitch.</p>
              
              <label style={{...labelStyle, color: '#f59e0b'}}>Loaded Trailer Wt (lbs)<input type="number" value={trailerWt} onChange={e=>setTrailerWt(e.target.value)} style={inputStyle} /></label>
              
              <div style={{ marginTop: '15px', padding: '15px', background: '#000', borderRadius: '8px', border: isOverweight ? '1px solid #ef4444' : '1px solid #222' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Min Tongue (10%):</span> <span>{minTongue.toLocaleString()} lbs</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px' }}><span>Max Tongue (15%):</span> <span>{maxTongue.toLocaleString()} lbs</span></div>
                {isOverweight ? (
                  <div style={{ color: '#ef4444', fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '0.9em' }}>⚠️ DANGER: Trailer exceeds vehicle capacity or payload limits.</div>
                ) : (
                  <div style={{ color: '#00cc66', fontWeight: 'bold', textAlign: 'center', marginTop: '10px' }}>✅ Safe to Tow</div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* TAB 3: RECOVERY & WINCH                    */}
        {/* ========================================== */}
        {activeTab === 'Recovery' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>Winch Rigging Calculator</h3>
              <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.4', marginBottom: '15px' }}>Accounts for surface suction (Mire) and slope drag (Gradient).</p>

              <label style={{...labelStyle, color: '#f59e0b'}}>Stuck Vehicle Wt (lbs)<input type="number" value={stuckWt} onChange={e=>setStuckWt(e.target.value)} style={inputStyle} /></label>
              
              <div style={{ marginTop: '10px' }}>
                <label style={labelStyle}>Mire Depth (Suction)
                  <select value={mireLvl} onChange={e=>setMireLvl(e.target.value)} style={inputStyle}>
                    <option value="0.04">Hard Flat Surface (0.04x)</option>
                    <option value="0.33">Grass / Gravel (0.33x)</option>
                    <option value="1">Wheel Depth Mud (1x Wt)</option>
                    <option value="2">Fender Deep Mud (2x Wt)</option>
                    <option value="3">Frame Deep Suction (3x Wt)</option>
                  </select>
                </label>
              </div>

              <div style={{ marginTop: '10px' }}>
                <label style={labelStyle}>Slope / Gradient
                  <select value={gradient} onChange={e=>setGradient(e.target.value)} style={inputStyle}>
                    <option value="0">Flat (0°)</option>
                    <option value="0.25">15° Incline (0.25x Wt)</option>
                    <option value="0.5">30° Incline (0.5x Wt)</option>
                    <option value="0.75">45° Incline (0.75x Wt)</option>
                  </select>
                </label>
              </div>
            </div>

            <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '15px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Rolling Resistance:</span> <span>{wStuck.toLocaleString()} lbs</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Mire Suction:</span> <span>{(wStuck * wMire).toLocaleString()} lbs</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px' }}><span>Gradient Drag:</span> <span>{(wStuck * wGrad).toLocaleString()} lbs</span></div>
              
              <div style={{ borderTop: '1px solid #444', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold', fontSize: '1.2em' }}>
                <span>Total Pull Required:</span> <span>{reqPull.toLocaleString()} lbs</span>
              </div>
              
              <div style={{ borderTop: '1px dashed #444', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', color: '#f59e0b', fontWeight: 'bold', fontSize: '1.2em' }}>
                <span>Min Winch Rating (1.5x):</span> <span>{safeWinch.toLocaleString()} lbs</span>
              </div>
            </div>

            {needSnatch && (
              <div style={{ padding: '15px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#ef4444' }}>⚠️ Snatch Block Required</h4>
                <p style={{ color: '#aaa', fontSize: '0.9em', margin: 0, lineHeight: '1.4' }}>This pull exceeds a standard 12,000 lb truck winch. You MUST rig a 2-to-1 mechanical advantage using a snatch block to halve the winch load to <strong>{(safeWinch / 2).toLocaleString()} lbs</strong>.</p>
              </div>
            )}
          </>
        )}

        {/* ========================================== */}
        {/* TAB 4: RENTAL & TRIP                       */}
        {/* ========================================== */}
        {activeTab === 'Rental' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #00cc66' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#00cc66' }}>Trip Fuel Estimator</h3>
              
              <label style={labelStyle}>Quick Select Vehicle
                <select onChange={(e) => {
                  const vals = e.target.value.split(',');
                  setMpg(vals[0]); setTankSize(vals[1]);
                }} style={{...inputStyle, marginBottom: '10px'}}>
                  <option value="10,33">Standard Select...</option>
                  <option value="18,25">Cargo Van (18 MPG | 25 Gal)</option>
                  <option value="10,33">15ft Box Truck (10 MPG | 33 Gal)</option>
                  <option value="8,40">26ft Box Truck (8 MPG | 40 Gal)</option>
                </select>
              </label>

              <div style={flexWrap}>
                <div style={inputWrap}><label style={labelStyle}>Est. MPG<input type="number" value={mpg} onChange={e=>setMpg(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={labelStyle}>Tank (Gal)<input type="number" value={tankSize} onChange={e=>setTankSize(e.target.value)} style={inputStyle} /></label></div>
              </div>
              <div style={flexWrap}>
                <div style={inputWrap}><label style={{...labelStyle, color: '#00cc66'}}>Trip Distance (Mi)<input type="number" value={tripDist} onChange={e=>setTripDist(e.target.value)} style={inputStyle} /></label></div>
                <div style={inputWrap}><label style={{...labelStyle, color: '#00cc66'}}>Fuel Price ($)<input type="number" value={fuelPrice} onChange={e=>setFuelPrice(e.target.value)} style={inputStyle} /></label></div>
              </div>
            </div>

            <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '15px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Max Range (Full Tank):</span> <span>{maxRange.toLocaleString()} Miles</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px' }}><span>Est. Fuel Stops Needed:</span> <span>{fuelStops} stops</span></div>
              
              <div style={{ borderTop: '1px solid #444', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold' }}>
                <span>Total Fuel Needed:</span> <span>{galNeeded.toFixed(1)} Gallons</span>
              </div>
              <div style={{ borderTop: '1px dashed #444', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', color: '#00cc66', fontWeight: 'bold', fontSize: '1.3em' }}>
                <span>Estimated Trip Cost:</span> <span>${tripCost.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>Moving Truck Sizing Guide</h3>
              <ul style={{ color: '#aaa', fontSize: '0.9em', paddingLeft: '18px', lineHeight: '1.5', margin: 0 }}>
                <li><strong>Cargo Van / Pickup:</strong> Studio apt, college dorm, partial moves.</li>
                <li><strong>10 ft - 15 ft Truck:</strong> 1 to 2 bedroom apartment.</li>
                <li><strong>20 ft Truck:</strong> 2 to 3 bedroom house.</li>
                <li><strong>26 ft Truck:</strong> 3 to 4+ bedroom house. <em>(Note: Maximum size before requiring a CDL).</em></li>
              </ul>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
