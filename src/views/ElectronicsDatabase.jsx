import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ElectronicsDatabase() {
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
    try {
      // Direct hook into the iFixit public API for hardware guides
      const res = await fetch(`https://www.ifixit.com/api/2.0/search/${encodeURIComponent(query)}?filter=guide`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Hardware DB Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/schematics')}>← Hub</button>
        <h2>Electronics & Wiring</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        <p style={{ color: '#00ffff', fontWeight: 'bold', marginBottom: '15px' }}>🔌 Hardware & Teardown Database</p>
        
        <form onSubmit={handleSearch} style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="e.g., 'Samsung Galaxy', 'Drone', 'PS5'..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #00ffff', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1.1em' }}
            />
            <button type="submit" style={{ padding: '0 20px', background: '#00ffff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
              Search
            </button>
          </div>
        </form>

        {loading ? (
          <div style={{ color: '#aaa', textAlign: 'center', marginTop: '20px' }}>Accessing hardware mainframe...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {results.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(20, 20, 20, 0.8)', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
                {item.image && item.image.standard && (
                  <div style={{ width: '100%', height: '150px', backgroundImage: `url(${item.image.standard})`, backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid #444' }}></div>
                )}
                <div style={{ padding: '15px' }}>
                  <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.1em', marginBottom: '8px' }}>{item.display_title}</div>
                  <div style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '12px', lineHeight: '1.4' }}>{item.summary}</div>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ display: 'inline-block', padding: '8px 15px', background: 'rgba(0, 255, 255, 0.1)', color: '#00ffff', border: '1px solid #00ffff', borderRadius: '5px', textDecoration: 'none', fontSize: '0.9em', fontWeight: 'bold' }}
                  >
                    View Full Schematic ↗
                  </a>
                </div>
              </div>
            ))}

            {searched && results.length === 0 && !loading && (
              <div style={{ color: '#ff4444', textAlign: 'center', marginTop: '20px' }}>
                No hardware schematics found for that query. Try a broader term.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default ElectronicsDatabase;
