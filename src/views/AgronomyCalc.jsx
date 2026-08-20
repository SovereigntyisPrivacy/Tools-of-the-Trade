import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AgronomyCalc() {
  const navigate = useNavigate();

  // 1. Botanical Lighting (DLI)
  const [ppfd, setPpfd] = useState('900'); // µmol/m²/s
  const [lightHours, setLightHours] = useState('12');

  // 2. Extraction Yield Predictor
  const [biomassGrams, setBiomassGrams] = useState('454'); // 1 lb in grams
  const [targetExtractPct, setTargetExtractPct] = useState('15'); // 15% return

  // 3. Volumetric Concentration (Tincture / Oil)
  const [crudeGrams, setCrudeGrams] = useState('10');
  const [crudePurity, setCrudePurity] = useState('75'); // %
  const [carrierVolumeMl, setCarrierVolumeMl] = useState('30'); // Standard dropper bottle

  // 4. Hydroponic Nutrient Dosing
  const [waterGallons, setWaterGallons] = useState('50');
  const [nutrientGrams, setNutrientGrams] = useState('150');

  // --- Calculations ---

  // 1. Daily Light Integral (DLI): DLI = PPFD * (3600 * hours) / 1,000,000
  let dli = 0;
  if (ppfd && lightHours) {
    dli = (parseFloat(ppfd) * 3600 * parseFloat(lightHours)) / 1000000;
  }

  // 2. Extraction Yield
  let expectedYieldGrams = 0;
  if (biomassGrams && targetExtractPct) {
    expectedYieldGrams = parseFloat(biomassGrams) * (parseFloat(targetExtractPct) / 100);
  }

  // 3. Volumetric Concentration (mg per mL)
  let activeMgPerMl = 0, totalActiveMg = 0;
  if (crudeGrams && crudePurity && carrierVolumeMl) {
    // 1 gram = 1000 mg
    totalActiveMg = (parseFloat(crudeGrams) * 1000) * (parseFloat(crudePurity) / 100);
    activeMgPerMl = totalActiveMg / parseFloat(carrierVolumeMl);
  }

  // 4. Rough Hydroponic PPM Estimator
  // 1 gram in 1 gallon = ~264 ppm.
  let estimatedPpm = 0;
  if (waterGallons && nutrientGrams) {
    const gal = parseFloat(waterGallons);
    if (gal > 0) {
      estimatedPpm = (parseFloat(nutrientGrams) / gal) * 264.172;
    }
  }

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Agronomy & Extraction</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* 1. Botanical Lighting (DLI) */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #ffaa00', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>☀️ Photobiology (DLI)</h3>
          <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}>Calculates Daily Light Integral to optimize flowering canopy mass.</p>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#ffaa00', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>PPFD (µmol/m²/s)</label>
              <input type="number" placeholder="900" value={ppfd} onChange={e => setPpfd(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px', fontWeight: 'bold' }}>Light Hours / Day</label>
              <input type="number" placeholder="12" value={lightHours} onChange={e => setLightHours(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Total DLI:</span>
            <span style={{ color: dli > 40 ? '#ff4444' : '#00cc66', fontWeight: 'bold' }}>{dli.toFixed(1)} mol/m²/d</span>
          </div>
          {dli > 45 && <div style={{ color: '#ff4444', fontSize: '0.8em', marginTop: '5px', textAlign: 'center' }}>⚠️ High DLI. Supplemental CO2 recommended.</div>}
        </div>

        {/* 2. Extraction Yield Predictor */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🧪 Biomass Extraction Yield</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00cc66', fontSize: '0.85em', marginBottom: '4px' }}>Input Biomass (g)</label>
              <input type="number" placeholder="454" value={biomassGrams} onChange={e => setBiomassGrams(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Target Yield (%)</label>
              <input type="number" placeholder="15" value={targetExtractPct} onChange={e => setTargetExtractPct(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Est. Crude Output:</span>
            <span style={{ color: '#00cc66', fontWeight: 'bold' }}>{expectedYieldGrams.toFixed(1)} g</span>
          </div>
        </div>

        {/* 3. Volumetric Dosing */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #a55eea', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>💧 Volumetric Concentration</h3>
          <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}>Dilution math for exact active compound dosing in carrier oils/tinctures.</p>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#a55eea', fontSize: '0.85em', marginBottom: '4px' }}>Crude Mass (g)</label>
              <input type="number" placeholder="10" value={crudeGrams} onChange={e => setCrudeGrams(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Crude Purity (%)</label>
              <input type="number" placeholder="75" value={crudePurity} onChange={e => setCrudePurity(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <label style={{ display: 'block', color: '#00ffff', fontSize: '0.85em', marginBottom: '4px' }}>Target Carrier Volume (mL)</label>
          <input type="number" placeholder="30" value={carrierVolumeMl} onChange={e => setCarrierVolumeMl(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1em' }}><span style={{ color: '#aaa' }}>Total Active Compound:</span><span style={{ color: '#fff', fontWeight: 'bold' }}>{totalActiveMg.toFixed(0)} mg</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', paddingTop: '8px', borderTop: '1px dashed #333' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Concentration:</span><span style={{ color: '#a55eea', fontWeight: 'bold' }}>{activeMgPerMl.toFixed(1)} mg / mL</span></div>
          </div>
        </div>

        {/* 4. Hydroponic Nutrients */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #3498db', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>🌊 Hydroponic Reservoir PPM</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#3498db', fontSize: '0.85em', marginBottom: '4px' }}>Reservoir Vol (Gal)</label>
              <input type="number" placeholder="50" value={waterGallons} onChange={e => setWaterGallons(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85em', marginBottom: '4px' }}>Salt / Nutrients (g)</label>
              <input type="number" placeholder="150" value={nutrientGrams} onChange={e => setNutrientGrams(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Est. Concentration:</span>
            <span style={{ color: '#3498db', fontWeight: 'bold' }}>{estimatedPpm.toFixed(0)} PPM</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AgronomyCalc;
