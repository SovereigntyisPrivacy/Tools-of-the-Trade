import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filesystem, Directory } from '@capacitor/filesystem';

function MechanicsDatabase() {
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
      // Scrape Internet Archive specifically for texts/manuals
      const archiveQuery = `${query} (manual OR repair OR service OR diagram)`;
      const res = await fetch(`https://archive.org/advancedsearch.php?q=${encodeURIComponent(archiveQuery)}+AND+mediatype:texts&fl[]=identifier,title,creator,year&rows=15&output=json`);
      const data = await res.json();
      setResults(data.response.docs || []);
    } catch (error) {
      console.error("Mechanics DB Error:", error);
    }
    setLoading(false);
  };

  const ripToVault = async (identifier, rawTitle) => {
    setDownloadingId(identifier);
    try {
      // Direct raw PDF download URL format for Archive.org
      const pdfUrl = `https://archive.org/download/${identifier}/${identifier}.pdf`;
      
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error('File not found or format unsupported');
      const blob = await response.blob();
      
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];
        const safeTitle = rawTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 40);
        const fileName = `${safeTitle}.pdf`;
        
        await Filesystem.writeFile({
          path: fileName,
          data: base64data,
          directory: Directory.Data
        });
        
        setDownloadingId(null);
        navigate(`/vault/view/${fileName}`);
      };
    } catch (e) {
      console.error(e);
      alert("Failed to rip PDF. This specific archive may not have a standard PDF format available.");
      setDownloadingId(null);
    }
  };

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/schematics')}>← Hub</button>
        <h2>Mechanics & Engines</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        <p style={{ color: '#ffaa00', fontWeight: 'bold', marginBottom: '15px' }}>⚙️ Unrestricted Archive Database</p>
        
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
          <div style={{ color: '#aaa', textAlign: 'center', marginTop: '20px' }}>Querying unrestricted archives...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {results.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(20, 20, 20, 0.8)', border: '1px solid #444', borderLeft: '4px solid #ffaa00', borderRadius: '8px', padding: '15px' }}>
                <div style={{ fontWeight: 'bold', color: '#ffaa00', fontSize: '1.1em', marginBottom: '5px' }}>{item.title}</div>
                <div style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '5px' }}><span style={{ color: '#fff' }}>Author:</span> {item.creator ? item.creator : 'Unknown'}</div>
                <div style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '12px' }}><span style={{ color: '#fff' }}>Year:</span> {item.year || 'N/A'}</div>
                
                <button 
                  onClick={() => ripToVault(item.identifier, item.title)}
                  disabled={downloadingId === item.identifier}
                  style={{ width: '100%', padding: '12px', background: 'rgba(255, 170, 0, 0.1)', color: '#ffaa00', border: '1px solid #ffaa00', borderRadius: '5px', fontSize: '1em', fontWeight: 'bold' }}
                >
                  {downloadingId === item.identifier ? '⬇ Extracting Manual...' : '⬇ Save to Stealth Vault'}
                </button>
              </div>
            ))}
            {searched && results.length === 0 && !loading && (
              <div style={{ color: '#ff4444', textAlign: 'center', marginTop: '20px' }}>No manuals found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MechanicsDatabase;
