import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BuilderCalc() {
  const navigate = useNavigate();

  // Material Estimator State
  const [area, setArea] = useState('');
  
  // Concrete Estimator State
  const [concLength, setConcLength] = useState('');
  const [concWidth, setConcWidth] = useState('');
  const [concDepth, setConcDepth] = useState('');

  // Framing Estimator State
  const [wallLength, setWallLength] = useState('');
  const [studSpacing, setStudSpacing] = useState('16');

  // Vehicle Payload & Towing State
  const [gvwr, setGvwr] = useState('');
  const [gcwr, setGcwr] = useState(''); // Gross Combined Weight Rating
  const [curbWeight, setCurbWeight] = useState('');
  const [passengerGearWeight, setPassengerGearWeight] = useState('');

  // Vehicle Range State
  const [tank, setTank] = useState('');
  const [mpg, setMpg] = useState('');

  // --- Calculations ---
  
  // Materials (Paint, Flooring, Drywall, Roofing)
  const safeArea = parseFloat(area) || 0;
  const paintGallons = safeArea ? Math.ceil(safeArea / 350) : 0;
  const flooringBoxes = safeArea ? Math.ceil((safeArea * 1.1) / 20) : 0; 
  const drywallSheets = safeArea ? Math.ceil((safeArea * 1.1) / 32) : 0; // 4x8 sheet = 32 sq ft + 10% waste
  const roofingSquares = safeArea ? (safeArea / 100).toFixed(1) : 0;
  const roofingBundles = safeArea ? Math.ceil(safeArea / 33.3) : 0; // Approx 3 bundles per square

  // Concrete
  let cubicYards = 0;
  let bags80lb = 0;
  if (concLength && concWidth && concDepth) {
    const volCubicFeet = parseFloat(concLength) * parseFloat(concWidth) * (parseFloat(concDepth) / 12);
    cubicYards = (volCubicFeet / 27).toFixed(2);
    bags80lb = Math.ceil(cubicYards * 45); 
  }

  // Framing
  let studsNeeded = 0;
  if (wallLength && studSpacing) {
    const lengthInches = parseFloat(wallLength) * 12;
    const basicStuds = Math.ceil(lengthInches / parseFloat(studSpacing)) + 1;
    studsNeeded = Math.ceil(basicStuds * 1.1); 
  }

  // Payload & Towing
  let maxPayload = 0;
  let availablePayload = 0;
  let maxTowing = 0;
  if (gvwr && curbWeight) {
    const safeGvwr = parseFloat(gvwr);
    const safeCurb = parseFloat(curbWeight);
    const safeGear = parseFloat(passengerGearWeight) || 0;
    
    maxPayload = safeGvwr - safeCurb;
    availablePayload = maxPayload - safeGear;
    
    if (gcwr) {
      // Gross Vehicle Weight (Curb + whatever is currently loaded inside)
      const currentGvw = safeCurb + safeGear; 
      maxTowing = parseFloat(gcwr) - currentGvw;
    }
  }

  // Range
  const maxRange = (tank && mpg) ? (parseFloat(tank) * parseFloat(mpg)).toFixed(1) : 0;

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>DIY & Vehicle</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* 1. Master Material Estimator */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ffaa00', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🧱 Material Estimator</h3>
          <label style={{ display: 'block', color: '#00ffff', fontWeight: 'bold', marginBottom: '8px' }}>Surface Area (Sq. Ft.)</label>
          <input type="number" placeholder="e.g. 500" value={area} onChange={e => setArea(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}>
              <span style={{ color: '#aaa' }}>Paint:</span>
              <span style={{ color: '#00ffff', fontWeight: 'bold' }}>{paintGallons} Gallons</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}>
              <span style={{ color: '#aaa' }}>Flooring:</span>
              <span style={{ color: '#ffaa00', fontWeight: 'bold' }}>{flooringBoxes} Boxes</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}>
              <span style={{ color: '#aaa' }}>Drywall (4x8):</span>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>{drywallSheets} Sheets</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', borderTop: '1px solid #333', paddingTop: '8px', marginTop: '4px' }}>
              <span style={{ color: '#aaa' }}>Roofing:</span>
              <span style={{ color: '#ff4444', fontWeight: 'bold' }}>{roofingSquares} Sq / {roofingBundles} Bundles</span>
            </div>
          </div>
        </div>

        {/* 2. Concrete Estimator */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #aaa', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🪨 Concrete Estimator</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Length (Ft)</label>
              <input type="number" placeholder="10" value={concLength} onChange={e => setConcLength(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Width (Ft)</label>
              <input type="number" placeholder="10" value={concWidth} onChange={e => setConcWidth(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Depth (In)</label>
              <input type="number" placeholder="4" value={concDepth} onChange={e => setConcDepth(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '1.1em' }}>
            <span style={{ color: '#aaa' }}>Total Volume:</span>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>{cubicYards} Cu. Yds</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}>
            <span style={{ color: '#aaa' }}>80lb Bags Required:</span>
            <span style={{ color: '#00cc66', fontWeight: 'bold' }}>{bags80lb} Bags</span>
          </div>
        </div>

        {/* 3. Framing Estimator */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #cc6600', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🔨 Wall Framing</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', color: '#cc6600', fontWeight: 'bold', marginBottom: '4px' }}>Wall Length (Ft)</label>
              <input type="number" placeholder="e.g. 20" value={wallLength} onChange={e => setWallLength(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Spacing (In)</label>
              <select value={studSpacing} onChange={e => setStudSpacing(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}>
                <option value="16">16" OC</option>
                <option value="24">24" OC</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}>
            <span style={{ color: '#aaa' }}>Total Studs (+10% Waste):</span>
            <span style={{ color: '#cc6600', fontWeight: 'bold' }}>{studsNeeded} Studs</span>
          </div>
        </div>

        {/* 4. Vehicle Payload & Towing */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ff4444', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🛻 Hauling & Towing Limits</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#ff4444', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>GVWR (Lbs)</label>
              <input type="number" placeholder="e.g. 7000" value={gvwr} onChange={e => setGvwr(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#ffaa00', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>GCWR (Lbs)</label>
              <input type="number" placeholder="e.g. 13000" value={gcwr} onChange={e => setGcwr(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Curb Weight</label>
              <input type="number" placeholder="e.g. 5200" value={curbWeight} onChange={e => setCurbWeight(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Pax & Gear Weight</label>
              <input type="number" placeholder="e.g. 450" value={passengerGearWeight} onChange={e => setPassengerGearWeight(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1em' }}>
              <span style={{ color: '#aaa' }}>Max Vehicle Payload:</span>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>{maxPayload} Lbs</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', paddingTop: '8px', borderTop: '1px dashed #444' }}>
              <span style={{ color: '#fff' }}>Available Payload:</span>
              <span style={{ color: availablePayload < 0 ? '#ff4444' : '#00cc66', fontWeight: 'bold' }}>{availablePayload} Lbs</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em', paddingTop: '8px', borderTop: '1px solid #333' }}>
              <span style={{ color: '#fff' }}>Max Towing (Hitch):</span>
              <span style={{ color: maxTowing < 0 ? '#ff4444' : '#ffaa00', fontWeight: 'bold' }}>{maxTowing} Lbs</span>
            </div>
          </div>
        </div>

        {/* 5. Vehicle Range */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🚙 Vehicle Range</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontWeight: 'bold', marginBottom: '8px' }}>Tank (Gal)</label>
              <input type="number" placeholder="18" value={tank} onChange={e => setTank(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontWeight: 'bold', marginBottom: '8px' }}>Avg MPG</label>
              <input type="number" placeholder="22" value={mpg} onChange={e => setMpg(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', background: '#000', padding: '15px', borderRadius: '8px' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Max Range:</span>
            <span style={{ color: '#00cc66', fontWeight: 'bold' }}>{maxRange} Miles</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BuilderCalc;
