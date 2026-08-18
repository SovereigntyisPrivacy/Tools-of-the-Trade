import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PharmacologyDatabase() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setSearched(true);
    setResults([]);
    
    try {
      // Query the OpenFDA Drug Label API (No API key required)
      const res = await fetch(`https://api.fda.gov/drug/label.json?search="${encodeURIComponent(query)}"&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("FDA DB Error:", error);
    }
    setLoading(false);
  };

  // Helper to keep massive FDA labels from flooding the screen
  const truncateText = (text, maxLength = 300) => {
    if (!text) return 'Data not provided on official label.';
    const str = Array.isArray(text) ? text.join(' ') : text;
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  };

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/schematics')}>← Hub</button>
        <h2>Pharmacology</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* Bridge to the AI Scanner for unmarked pills */}
        <button 
          onClick={() => navigate('/schematics/scanner')}
          style={{ width: '100%', padding: '15px', background: 'rgba(255, 68, 68, 0.1)', border: '1px solid #ff4444', borderRadius: '8px', color: '#ff4444', fontWeight: 'bold', fontSize: '1em', marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          <span>👁️</span> Unmarked Pill? Use AI Visual Scanner
        </button>

        <p style={{ color: '#ff4444', fontWeight: 'bold', marginBottom: '15px' }}>💊 FDA Open Data Archive</p>
        
        <form onSubmit={handleSearch} style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="e.g., 'Ibuprofen', 'Amoxicillin'..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ff4444', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1.1em' }}
            />
            <button type="submit" style={{ padding: '0 20px', background: '#ff4444', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
              Search
            </button>
          </div>
        </form>

        {loading ? (
          <div style={{ color: '#aaa', textAlign: 'center', marginTop: '20px' }}>Querying FDA medical mainframes...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {results.map((item, idx) => {
              const brandName = item.openfda?.brand_name?.[0] || item.openfda?.generic_name?.[0] || 'Unknown Compound';
              const genericName = item.openfda?.generic_name?.[0] || 'N/A';
              
              return (
                <div key={idx} style={{ background: 'rgba(20, 20, 20, 0.8)', border: '1px solid #444', borderLeft: '4px solid #ff4444', borderRadius: '8px', padding: '15px' }}>
                  <div style={{ fontWeight: 'bold', color: '#ff4444', fontSize: '1.2em', marginBottom: '4px' }}>{brandName}</div>
                  <div style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px', fontStyle: 'italic' }}>Generic: {genericName}</div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ color: '#fff', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Indications & Usage:</span>
                    <span style={{ color: '#ccc', fontSize: '0.9em', lineHeight: '1.4' }}>{truncateText(item.indications_and_usage || item.purpose)}</span>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ color: '#ffaa00', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>⚠️ Warnings / Contraindications:</span>
                    <span style={{ color: '#ccc', fontSize: '0.9em', lineHeight: '1.4' }}>{truncateText(item.warnings || item.boxed_warning || item.do_not_use)}</span>
                  </div>

                  <div>
                    <span style={{ color: '#00cc66', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Dosage & Admin:</span>
                    <span style={{ color: '#ccc', fontSize: '0.9em', lineHeight: '1.4' }}>{truncateText(item.dosage_and_administration)}</span>
                  </div>
                </div>
              );
            })}
            
            {searched && results.length === 0 && !loading && (
              <div style={{ color: '#ff4444', textAlign: 'center', marginTop: '20px', padding: '20px', border: '1px dashed #ff4444', borderRadius: '8px' }}>
                No clinical data found. Verify spelling or try searching by active ingredient.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PharmacologyDatabase;
