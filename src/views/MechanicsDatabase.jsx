import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MechanicsDatabase() {
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
      // Appending "repair manual" to bias the OpenLibrary search toward technical documents
      const searchQuery = `${query} repair manual`;
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=15`);
      const data = await res.json();
      setResults(data.docs || []);
    } catch (error) {
      console.error("Mechanics DB Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/schematics')}>← Hub</button>
        <h2>Mechanics & Engines</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        <p style={{ color: '#ffaa00', fontWeight: 'bold', marginBottom: '15px' }}>⚙️ Vehicle & Machining Archive</p>
        
        <form onSubmit={handleSearch} style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="e.g., 'Honda Civic', 'Small Engine', 'Lathe'..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ffaa00', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1.1em' }}
            />
            <button type="submit" style={{ padding: '0 20px', background: '#ffaa00', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
              Search
            </button>
          </div>
        </form>

        {loading ? (
          <div style={{ color: '#aaa', textAlign: 'center', marginTop: '20px' }}>Querying technical archives...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {results.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(20, 20, 20, 0.8)', border: '1px solid #444', borderLeft: '4px solid #ffaa00', borderRadius: '8px', padding: '15px' }}>
                <div style={{ fontWeight: 'bold', color: '#ffaa00', fontSize: '1.1em', marginBottom: '5px' }}>{item.title}</div>
                
                <div style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '5px' }}>
                  <span style={{ color: '#fff' }}>Author/Publisher:</span> {item.author_name ? item.author_name.join(', ') : 'Unknown'}
                </div>
                
                <div style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '12px' }}>
                  <span style={{ color: '#fff' }}>Year:</span> {item.first_publish_year || 'N/A'}
                </div>
                
                <a 
                  href={`https://openlibrary.org${item.key}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ display: 'inline-block', padding: '8px 15px', background: 'rgba(255, 170, 0, 0.1)', color: '#ffaa00', border: '1px solid #ffaa00', borderRadius: '5px', textDecoration: 'none', fontSize: '0.9em', fontWeight: 'bold' }}
                >
                  View Document ↗
                </a>
              </div>
            ))}

            {searched && results.length === 0 && !loading && (
              <div style={{ color: '#ff4444', textAlign: 'center', marginTop: '20px' }}>
                No manuals found for that query. Try using just the Make and Model.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default MechanicsDatabase;
