import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function GlobalSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';

  const [wikiResults, setWikiResults] = useState([]);
  const [bookResults, setBookResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch from Wikimedia (General Knowledge & Concepts)
        const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`);
        const wikiData = await wikiRes.json();
        if (wikiData.query && wikiData.query.search) {
          setWikiResults(wikiData.query.search.slice(0, 5)); // Grab top 5 results
        }

        // 2. Fetch from OpenLibrary (Books & Manuals)
        const bookRes = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`);
        const bookData = await bookRes.json();
        if (bookData.docs) {
          setBookResults(bookData.docs);
        }
      } catch (error) {
        console.error("API Fetch Error:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [query]);

  // Strip HTML tags from Wikipedia snippets
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/schematics')}>← Hub</button>
        <h2>Global Search</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        <h3 style={{ color: '#00ffff', marginBottom: '5px' }}>Results for: "{query}"</h3>
        <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '20px' }}>Scraping Wikipedia and OpenLibrary databases...</p>

        {loading ? (
          <div style={{ color: '#fff', textAlign: 'center', marginTop: '40px', fontSize: '1.2em' }}>
            📡 Uplink established. Downloading data...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Wikipedia Results */}
            {wikiResults.length > 0 && (
              <div className="input-card" style={{ borderTop: '4px solid #fff' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>🌐 Encylopedia Data</h3>
                {wikiResults.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: idx === wikiResults.length - 1 ? 'none' : '1px solid #333' }}>
                    <div style={{ fontWeight: 'bold', color: '#00ffff', fontSize: '1.1em', marginBottom: '5px' }}>{item.title}</div>
                    <div style={{ color: '#ccc', fontSize: '0.9em', lineHeight: '1.4' }}>{stripHtml(item.snippet)}...</div>
                    <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '8px', color: '#ffaa00', textDecoration: 'none', fontSize: '0.85em' }}>Read Full Article ↗</a>
                  </div>
                ))}
              </div>
            )}

            {/* OpenLibrary Results */}
            {bookResults.length > 0 && (
              <div className="input-card" style={{ borderTop: '4px solid #ffaa00' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>📚 Library & Manuals</h3>
                {bookResults.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: idx === bookResults.length - 1 ? 'none' : '1px solid #333' }}>
                    <div style={{ fontWeight: 'bold', color: '#ffaa00', fontSize: '1.1em', marginBottom: '5px' }}>{item.title}</div>
                    <div style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '5px' }}>Author: {item.author_name ? item.author_name.join(', ') : 'Unknown'}</div>
                    <div style={{ color: '#ccc', fontSize: '0.85em' }}>Published: {item.first_publish_year || 'N/A'}</div>
                    <a href={`https://openlibrary.org${item.key}`} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '8px', color: '#00ffff', textDecoration: 'none', fontSize: '0.85em' }}>View Text Archive ↗</a>
                  </div>
                ))}
              </div>
            )}

            {!loading && wikiResults.length === 0 && bookResults.length === 0 && (
              <div style={{ color: '#ff4444', textAlign: 'center', marginTop: '20px' }}>
                No records found in global databases.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default GlobalSearch;
