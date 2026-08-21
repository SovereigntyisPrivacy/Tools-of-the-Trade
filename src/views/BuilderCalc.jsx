import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BuilderCalc() {
  const navigate = useNavigate();

  // --- Material Estimator State ---
  const [area, setArea] = useState('');

  // --- Concrete Estimator State ---
  const [concL, setConcL] = useState('10');
  const [concW, setConcW] = useState('10');
  const [concD, setConcD] = useState('4');

  // --- Wall Framing State ---
  const [wallL, setWallL] = useState('20');
  const [studSpacing, setStudSpacing] = useState('16');

  // --- Stair Stringer State ---
  const [stairRise, setStairRise] = useState('45'); // Total rise in inches

  // --- Landscaping / Mulch State ---
  const [landArea, setLandArea] = useState('150');
  const [landDepth, setLandDepth] = useState('3');

  // --- Lumber Board Foot State ---
  const [lumberT, setLumberT] = useState('2');
  const [lumberW, setLumberW] = useState('6');
  const [lumberL, setLumberL] = useState('10');
  const [lumberQty, setLumberQty] = useState('1');

  // --- CALCULATIONS ---

  // 1. Material Estimator
  const sqFt = parseFloat(area) || 0;
  const paintGals = Math.ceil(sqFt / 350); // ~350 sq ft per gallon
  const flooringBoxes = Math.ceil((sqFt * 1.1) / 24); // Assuming 24 sq ft box + 10% waste
  const drywallSheets = Math.ceil((sqFt * 1.1) / 32); // 4x8 sheet = 32 sq ft + 10% waste
  const roofSquares = Math.ceil(sqFt / 100);
  const roofBundles = roofSquares * 3; // 3 bundles per square

  // 2. Concrete Estimator
  const cL = parseFloat(concL) || 0;
  const cW = parseFloat(concW) || 0;
  const cD = parseFloat(concD) || 0;
  const cuFt = cL * cW * (cD / 12);
  const cuYds = (cuFt / 27).toFixed(2);
  const concBags = Math.ceil(cuFt / 0.6); // 80lb bag yields ~0.6 cu ft

  // 3. Wall Framing
  const wL = parseFloat(wallL) || 0;
  const spacing = parseFloat(studSpacing) || 16;
  const baseStuds = Math.ceil((wL * 12) / spacing) + 1; // Studs needed for length + 1 for the end
  const totalStuds = Math.ceil(baseStuds * 1.1); // Add 10% waste

  // 4. Stair Stringer (Targeting ~7.25" ideal riser height)
  const tRise = parseFloat(stairRise) || 0;
  let numSteps = 0;
  let actualRiser = 0;
  let stringerLenFt = 0;
  if (tRise > 0) {
    numSteps = Math.round(tRise / 7.25) || 1;
    actualRiser = (tRise / numSteps).toFixed(2);
    // Rough stringer estimate: Assume 10" run per step. Pythagorean theorem: a^2 + b^2 = c^2
    const stepHypotenuse = Math.sqrt(Math.pow(tRise/numSteps, 2) + Math.pow(10, 2));
    stringerLenFt = ((stepHypotenuse * numSteps) / 12).toFixed(1);
  }

  // 5. Landscaping & Mulch
  const lArea = parseFloat(landArea) || 0;
  const lDepth = parseFloat(landDepth) || 0;
  const landCuFt = lArea * (lDepth / 12);
  const landCuYds = (landCuFt / 27).toFixed(2);
  const landBags = Math.ceil(landCuFt / 2); // Standard 2 cu ft bag

  // 6. Board Feet
  const lT = parseFloat(lumberT) || 0;
  const lW = parseFloat(lumberW) || 0;
  const lLen = parseFloat(lumberL) || 0;
  const lQ = parseFloat(lumberQty) || 0;
  const boardFeet = ((lT * lW * lLen) / 12) * lQ;

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>DIY & Builder</h2>
      </header>

      {/* Reduced paddingBottom to 20px so the AdMob banner overlaps intentionally */}
      <div className="calc-content" style={{ padding: '16px', overflowY: 'auto', height: '100%', paddingBottom: '20px' }}>

        {/* --- Card 1: Material Estimator --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #ffb703', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>🧱 Material Estimator</h3>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: 'bold' }}>Surface Area (Sq. Ft.)</label>
            <input type="number" placeholder="e.g. 500" value={area} onChange={(e) => setArea(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', fontSize: '0.9rem', background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#aaa' }}>Paint (Covers ~350sqft):</span>
              <span style={{ color: '#00e5ff', fontWeight: 'bold' }}>{paintGals} Gallons</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#aaa' }}>Flooring (24sqft Box + 10%):</span>
              <span style={{ color: '#ffb703', fontWeight: 'bold' }}>{flooringBoxes} Boxes</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#aaa' }}>Drywall (4x8 Sheet + 10%):</span>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>{drywallSheets} Sheets</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '8px' }}>
              <span style={{ color: '#aaa' }}>Roofing (Squares / Bundles):</span>
              <span style={{ color: '#d00000', fontWeight: 'bold' }}>{roofSquares} Sq / {roofBundles} Bndl</span>
            </div>
          </div>
        </div>

        {/* --- Card 2: Concrete Estimator --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #ccc', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>🪨 Concrete Estimator</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.75rem' }}>Length (Ft)</label>
              <input type="number" value={concL} onChange={(e) => setConcL(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.75rem' }}>Width (Ft)</label>
              <input type="number" value={concW} onChange={(e) => setConcW(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.75rem' }}>Depth (In)</label>
              <input type="number" value={concD} onChange={(e) => setConcD(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
          </div>
          
          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#aaa' }}>Total Volume:</span>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>{cuYds > 0 ? cuYds : 0} Cu. Yds</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#aaa' }}>80lb Bags Required:</span>
              <span style={{ color: '#00cc66', fontWeight: 'bold' }}>{concBags > 0 ? concBags : 0} Bags</span>
            </div>
          </div>
        </div>

        {/* --- Card 3: Wall Framing --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #ffb703', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>🔨 Wall Framing</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#ffb703', fontSize: '0.8rem', fontWeight: 'bold' }}>Wall Length (Ft)</label>
              <input type="number" value={wallL} onChange={(e) => setWallL(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Spacing (In)</label>
              <select value={studSpacing} onChange={(e) => setStudSpacing(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }}>
                <option value="16">16" OC</option>
                <option value="24">24" OC</option>
              </select>
            </div>
          </div>
          
          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#aaa' }}>Total Studs (+10% Waste):</span>
            <span style={{ color: '#ffb703', fontWeight: 'bold' }}>{totalStuds > 0 ? totalStuds : 0} Studs</span>
          </div>
        </div>

        {/* --- Card 4: Stair Stringer Calculator --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #00e5ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>🪜 Stair Stringer</h3>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: 'bold' }}>Total Vertical Rise (Inches)</label>
            <input type="number" placeholder="Ground to deck height" value={stairRise} onChange={(e) => setStairRise(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', fontSize: '0.9rem', background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#aaa' }}>Total Steps Required:</span>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>{numSteps}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#aaa' }}>Exact Riser Cut Height:</span>
              <span style={{ color: '#00e5ff', fontWeight: 'bold' }}>{actualRiser}"</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '8px' }}>
              <span style={{ color: '#aaa' }}>Min. Stringer Board Length:</span>
              <span style={{ color: '#00cc66', fontWeight: 'bold' }}>{stringerLenFt} Ft</span>
            </div>
          </div>
        </div>

        {/* --- Card 5: Landscaping & Mulch --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>🪴 Mulch & Soil Estimator</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#00cc66', fontSize: '0.8rem', fontWeight: 'bold' }}>Bed Area (Sq Ft)</label>
              <input type="number" value={landArea} onChange={(e) => setLandArea(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Depth (In)</label>
              <input type="number" value={landDepth} onChange={(e) => setLandDepth(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '6px' }} />
            </div>
          </div>
          
          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#aaa' }}>Dump Truck Volume:</span>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>{landCuYds > 0 ? landCuYds : 0} Cu. Yds</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#aaa' }}>Hardware Store (2 cu.ft bags):</span>
              <span style={{ color: '#00cc66', fontWeight: 'bold' }}>{landBags > 0 ? landBags : 0} Bags</span>
            </div>
          </div>
        </div>

        {/* --- Card 6: Lumber Board Feet --- */}
        <div style={{ background: '#181818', borderTop: '4px solid #a600ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>🪵 Lumber Board Feet</h3>
          <p style={{ color: '#888', fontSize: '0.75rem', margin: '0 0 14px 0' }}>Calculate true volumetric board feet for raw milling or lumber yard purchases.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px', marginBottom: '14px' }}>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.7rem' }}>Thick (in)</label>
              <input type="number" value={lumberT} onChange={(e) => setLumberT(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.7rem' }}>Width (in)</label>
              <input type="number" value={lumberW} onChange={(e) => setLumberW(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '0.7rem' }}>Length (ft)</label>
              <input type="number" value={lumberL} onChange={(e) => setLumberL(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ color: '#a600ff', fontSize: '0.7rem', fontWeight: 'bold' }}>Qty</label>
              <input type="number" value={lumberQty} onChange={(e) => setLumberQty(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px' }} />
            </div>
          </div>
          
          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#aaa' }}>Total Board Feet (BF):</span>
            <span style={{ color: '#a600ff', fontWeight: 'bold', fontSize: '1.1rem' }}>{boardFeet > 0 ? boardFeet.toFixed(1) : 0}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BuilderCalc;
