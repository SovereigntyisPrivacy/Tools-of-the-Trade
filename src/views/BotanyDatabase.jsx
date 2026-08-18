import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BotanyDatabase() {
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
      // 1. Search the open Wikipedia database specifically targeting plants/fungi
      const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' (plant OR fungus OR tree OR toxic)')}&utf8=&format=json&origin=*`);
      const searchData = await searchRes.json();
      const topHits = searchData.query?.search?.slice(0, 5) || [];
      
      // 2. Fetch the rich summary and thumbnail images for the top results
      const enrichedResults = await Promise.all(topHits.map(async (hit) => {
        try {
          const detailRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(hit.title)}`);
          if (detailRes.ok) {
            return await detailRes.json();
          }
        } catch (err) {
          console.error("Detail fetch error", err);
        }
        return null;
      }));
      
      setResults(enrichedResults.filter(r => r !== null));
    } catch (error) {
      console.error("Botany DB Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/schematics')}>← Hub</button>
        <h2>Botany & Foraging</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* Bridge to the AI Scanner */}
        <button 
          onClick={() => navigate('/schematics/scanner')}
          style={{ width: '100%', padding: '15px', background: 'rgba(0, 204, 102, 0.1)', border: '1px solid #00cc66', borderRadius: '8px', color: '#00cc66', fontWeight: 'bold', fontSize: '1em', marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          <span>👁️</span> Unknown Target? Use AI Visual Scanner
        </button>

        <p style={{ color: '#00cc66', fontWeight: 'bold', marginBottom: '15px' }}>🌿 Ecological Field Guide</p>
        
        <form onSubmit={handleSearch} style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="e.g., 'Nightshade', 'Saguaro', 'Dandelion'..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #00cc66', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1.1em' }}
            />
            <button type="submit" style={{ padding: '0 20px', background: '#00cc66', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
              Search
            </button>
          </div>
        </form>

        {loading ? (
          <div style={{ color: '#aaa', textAlign: 'center', marginTop: '20px' }}>Querying ecological databases...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {results.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(20, 20, 20, 0.8)', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
                {item.thumbnail && item.thumbnail.source && (
                  <div style={{ width: '100%', height: '200px', backgroundImage: `url(${item.thumbnail.source})`, backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid #444' }}></div>
                )}
                <div style={{ padding: '15px' }}>
                  <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.2em', marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ color: '#00cc66', fontSize: '0.9em', fontStyle: 'italic', marginBottom: '10px' }}>{item.description || 'Botanical Classification'}</div>
                  <div style={{ color: '#ccc', fontSize: '0.9em', marginBottom: '15px', lineHeight: '1.5' }}>{item.extract}</div>
                  
                  <a 
                    href={item.content_urls?.mobile?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ display: 'inline-block', width: '100%', textAlign: 'center', padding: '12px', background: 'rgba(0, 204, 102, 0.1)', color: '#00cc66', border: '1px solid #00cc66', borderRadius: '5px', textDecoration: 'none', fontSize: '1em', fontWeight: 'bold' }}
                  >
                    Read Full Ecological Profile ↗
                  </a>
                </div>
              </div>
            ))}
            {searched && results.length === 0 && !loading && (
              <div style={{ color: '#ff4444', textAlign: 'center', marginTop: '20px' }}>
                No records found. Try using a common or scientific name.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BotanyDatabase;
