import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filesystem, Directory } from '@capacitor/filesystem';

function FirearmsDatabase() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setSearched(true);
    try {
      // FIX: Force exact phrase matching by wrapping the entire query in quotes
      const exactMatchQuery = `"${query.trim()}"`;
      
      const strictQuery = `(${exactMatchQuery}) AND (title:manual OR title:schematic OR title:armorer OR title:operator OR title:field OR subject:manual OR subject:firearm)`;
      const res = await fetch(`https://archive.org/advancedsearch.php?q=${encodeURIComponent(strictQuery)}+AND+mediatype:texts&fl[]=identifier,title,creator,year&rows=15&output=json`);
      const data = await res.json();
      setResults(data.response?.docs || []);
    } catch (error) {
      console.error("Armory DB Error:", error);
    }
    setLoading(false);
  };

  const ripToVault = async (identifier, rawTitle) => {
    setDownloadingId(identifier);
    try {
      const metaRes = await fetch(`https://archive.org/metadata/${identifier}`);
      const metaData = await metaRes.json();
      const pdfFile = metaData.files?.find(f => f.name.endsWith('.pdf'));
      
      if (!pdfFile) {
        throw new Error("No PDF format attached to this specific archive item.");
      }
      
      const pdfUrl = `https://archive.org/download/${identifier}/${pdfFile.name}`;
      const safeTitle = rawTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 40);
      const fileName = `${safeTitle}.pdf`;
      
      await Filesystem.downloadFile({
        url: pdfUrl,
        path: fileName,
        directory: Directory.Data
      });
      
      setDownloadingId(null);
      navigate(`/vault/view/${fileName}`);
    } catch (e) {
      console.error(e);
      alert(`Download Failed: ${e.message}`);
      setDownloadingId(null);
    }
  };

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/schematics')}>← Hub</button>
        <h2>Firearms & Armory</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        <p style={{ color: '#aaaaaa', fontWeight: 'bold', marginBottom: '15px' }}>🔫 Weapons & Armorer Archive</p>
        
        <form onSubmit={handleSearch} style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="e.g., 'AR-15', 'Glock 19', 'Remington 870'..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #aaaaaa', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1.1em' }}
            />
            <button type="submit" style={{ padding: '0 20px', background: '#aaaaaa', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
              Search
            </button>
          </div>
        </form>

        {loading ? (
          <div style={{ color: '#aaa', textAlign: 'center', marginTop: '20px' }}>Querying tactical archives...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {results.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(20, 20, 20, 0.8)', border: '1px solid #333', borderLeft: '4px solid #aaaaaa', borderRadius: '8px', padding: '15px' }}>
                <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.1em', marginBottom: '5px' }}>{item.title}</div>
                <div style={{ color: '#888', fontSize: '0.85em', marginBottom: '5px' }}><span style={{ color: '#aaa' }}>Publisher:</span> {item.creator ? item.creator : 'Unknown'}</div>
                <div style={{ color: '#888', fontSize: '0.85em', marginBottom: '12px' }}><span style={{ color: '#aaa' }}>Year:</span> {item.year || 'N/A'}</div>
                
                <button 
                  onClick={() => ripToVault(item.identifier, item.title)}
                  disabled={downloadingId === item.identifier}
                  style={{ width: '100%', padding: '12px', background: 'rgba(170, 170, 170, 0.1)', color: '#aaaaaa', border: '1px solid #aaaaaa', borderRadius: '5px', fontSize: '1em', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {downloadingId === item.identifier ? '⬇ Extracting Manual...' : '⬇ Save to Stealth Vault'}
                </button>
              </div>
            ))}
            {searched && results.length === 0 && !loading && (
              <div style={{ color: '#ff4444', textAlign: 'center', marginTop: '20px' }}>No exact manual matches found. Try shortening your search to just the manufacturer or model series.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FirearmsDatabase;
