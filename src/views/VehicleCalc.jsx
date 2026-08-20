import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function VehicleCalc() {
  const navigate = useNavigate();

  // 1. Hauling & Towing
  const [gvwr, setGvwr] = useState('');
  const [gcwr, setGcwr] = useState('');
  const [curb, setCurb] = useState('');
  const [paxGear, setPaxGear] = useState('');

  // 2. Trailer & Hitch
  const [trailerWeight, setTrailerWeight] = useState('');
  
  // 3. Range & Trip Cost
  const [tank, setTank] = useState('');
  const [mpg, setMpg] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [tripMiles, setTripMiles] = useState('');

  // 4. Off-Road Recovery
  const [stuckWeight, setStuckWeight] = useState('');
  const [surfaceType, setSurfaceType] = useState('1.5'); // Mire factor

  // --- Calculations ---

  // 1. Towing
  let maxPayload = 0, availPayload = 0, maxTowing = 0;
  if (gvwr && curb) {
    maxPayload = parseFloat(gvwr) - parseFloat(curb);
    availPayload = maxPayload - (parseFloat(paxGear) || 0);
  }
  if (gcwr && gvwr) {
    maxTowing = parseFloat(gcwr) - parseFloat(gvwr);
  }

  // 2. Tongue & Hitch
  let tongueMin = 0, tongueMax = 0, hitchClass = '';
  if (trailerWeight) {
    const tw = parseFloat(trailerWeight);
    tongueMin = tw * 0.10;
    tongueMax = tw * 0.15;
    
    if (tw <= 2000) hitchClass = 'Class I (2,000 lbs)';
    else if (tw <= 3500) hitchClass = 'Class II (3,500 lbs)';
    else if (tw <= 8000) hitchClass = 'Class III (8,000 lbs)';
    else if (tw <= 10000) hitchClass = 'Class IV (10,000 lbs)';
    else hitchClass = 'Class V / Gooseneck';
  }

  // 3. Range
  let maxRange = 0, tripCost = 0, fuelNeeded = 0;
  if (tank && mpg) {
    maxRange = parseFloat(tank) * parseFloat(mpg);
  }
  if (tripMiles && mpg && fuelPrice) {
    fuelNeeded = parseFloat(tripMiles) / parseFloat(mpg);
    tripCost = fuelNeeded * parseFloat(fuelPrice);
  }

  // 4. Winch Recovery
  let minWinch = 0, snatchBlockAdvantage = 0;
  if (stuckWeight) {
    const w = parseFloat(stuckWeight);
    const mireFactor = parseFloat(surfaceType);
    // Winch rating needs to handle the mire factor + a 1.5x safety/stall margin
    minWinch = w * mireFactor * 1.5; 
    snatchBlockAdvantage = minWinch / 2; // Adding 1 pulley cuts load in half
  }

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Vehicle & Fleet</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* 1. Hauling Limits */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ff4444', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🛻 Hauling & Towing Limits</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#ff4444', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>GVWR (lbs)</label><input type="number" placeholder="7000" value={gvwr} onChange={e => setGvwr(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#ffaa00', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>GCWR (lbs)</label><input type="number" placeholder="13000" value={gcwr} onChange={e => setGcwr(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Curb Weight</label><input type="number" placeholder="5200" value={curb} onChange={e => setCurb(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Pax & Gear Wt</label><input type="number" placeholder="450" value={paxGear} onChange={e => setPaxGear(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Max Payload:</span><span style={{ color: '#fff', fontWeight: 'bold' }}>{maxPayload > 0 ? maxPayload : 0} lbs</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', paddingTop: '8px', borderTop: '1px dashed #333' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Avail. Payload:</span><span style={{ color: availPayload >= 0 ? '#00cc66' : '#ff4444', fontWeight: 'bold' }}>{availPayload} lbs</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', paddingTop: '8px', borderTop: '1px solid #333' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Max Towing:</span><span style={{ color: '#ffaa00', fontWeight: 'bold' }}>{maxTowing > 0 ? maxTowing : 0} lbs</span></div>
            {availPayload < 0 && <div style={{ color: '#ff4444', fontSize: '0.85em', textAlign: 'center', marginTop: '5px' }}>⚠️ Overloaded. Remove gear to prevent suspension damage.</div>}
          </div>
        </div>

        {/* 2. Trailer & Hitch */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ffaa00', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🔗 Trailer Tongue & Hitch Planner</h3>
          <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}>Improper tongue weight causes fatal trailer sway. Targets mandatory 10-15% distribution.</p>
          
          <label style={{ display: 'block', color: '#ffaa00', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '4px' }}>Total Loaded Trailer Weight (lbs)</label>
          <input type="number" placeholder="e.g. 6500" value={trailerWeight} onChange={e => setTrailerWeight(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px', fontSize: '1.1em' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Min Tongue Wt (10%):</span><span style={{ color: '#fff', fontWeight: 'bold' }}>{tongueMin.toFixed(0)} lbs</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Max Tongue Wt (15%):</span><span style={{ color: '#fff', fontWeight: 'bold' }}>{tongueMax.toFixed(0)} lbs</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', paddingTop: '8px', borderTop: '1px dashed #333' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Req. Hitch:</span><span style={{ color: '#ffaa00', fontWeight: 'bold' }}>{hitchClass || 'N/A'}</span></div>
          </div>
        </div>

        {/* 3. Range & Fuel */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>⛽ Range & Trip Cost</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px' }}>Tank (Gal)</label><input type="number" placeholder="18" value={tank} onChange={e => setTank(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px' }}>Avg MPG</label><input type="number" placeholder="22" value={mpg} onChange={e => setMpg(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333', marginBottom: '15px' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Max Range:</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{maxRange > 0 ? maxRange.toFixed(0) : 0} Miles</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Trip Dist (Mi)</label><input type="number" placeholder="350" value={tripMiles} onChange={e => setTripMiles(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Fuel Price ($)</label><input type="number" placeholder="3.50" value={fuelPrice} onChange={e => setFuelPrice(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Fuel Needed:</span><span style={{ color: '#fff', fontWeight: 'bold' }}>{fuelNeeded > 0 ? fuelNeeded.toFixed(1) : 0} Gal</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', paddingTop: '8px', borderTop: '1px dashed #333' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Trip Cost:</span><span style={{ color: '#ff4444', fontWeight: 'bold' }}>${tripCost > 0 ? tripCost.toFixed(2) : 0}</span></div>
          </div>
        </div>

        {/* 4. Winch Recovery */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #a55eea', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>⛓️ Off-Road Winch Recovery</h3>
          <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}>Accounts for surface suction/drag and minimum 1.5x winch stall safety factor.</p>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', color: '#a55eea', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Stuck Weight</label><input type="number" placeholder="5500" value={stuckWeight} onChange={e => setStuckWeight(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} /></div>
            <div style={{ flex: 2 }}><label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Surface Mire / Grade</label>
              <select value={surfaceType} onChange={e => setSurfaceType(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}>
                <option value="1.0">Flat Hard Surface (1.0x)</option>
                <option value="1.5">Deep Sand / Gravel (1.5x)</option>
                <option value="2.0">Deep Mud / Suction (2.0x)</option>
                <option value="2.5">Steep Incline + Mud (2.5x)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Min Winch Rating:</span><span style={{ color: '#ff4444', fontWeight: 'bold' }}>{minWinch > 0 ? minWinch.toFixed(0) : 0} lbs</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', paddingTop: '8px', borderTop: '1px dashed #333' }}><span style={{ color: '#aaa' }}>w/ Snatch Block:</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{snatchBlockAdvantage > 0 ? snatchBlockAdvantage.toFixed(0) : 0} lbs</span></div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default VehicleCalc;
