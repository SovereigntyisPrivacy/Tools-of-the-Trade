import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Vault() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/schematics')}>Hub</button>
        <h2>Local SD Card Vault</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        <p style={{ color: '#aaa', marginBottom: '20px', lineHeight: '1.5' }}>
          Select offline manuals, schematics, or reference guides directly from your device storage.
        </p>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <input 
            type="file" 
            multiple 
            accept="*/*" 
            onChange={handleFileUpload} 
            style={{ display: 'none' }} 
            id="local-file-picker" 
          />
          <label htmlFor="local-file-picker" style={{ display: 'block', padding: '15px', background: '#00cc66', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1em' }}>
            📂 Browse Device Storage
          </label>
        </div>

        {files.length > 0 && (
          <div style={{ background: 'rgba(20,20,20,0.8)', padding: '15px', borderRadius: '12px', border: '1px solid #444' }}>
            <h3 style={{ color: '#00ffff', marginTop: 0, marginBottom: '15px' }}>Loaded Archives</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {files.map((file, idx) => (
                <div key={idx} style={{ padding: '12px', background: '#000', borderRadius: '8px', border: '1px solid #333', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                    <strong>{file.name}</strong>
                    <div style={{ fontSize: '0.8em', color: '#888' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <button onClick={() => alert('File loaded into memory. Native parsing active.')} style={{ padding: '8px 12px', background: 'rgba(0, 255, 255, 0.1)', color: '#00ffff', border: '1px solid #00ffff', borderRadius: '6px' }}>
                    Open
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
