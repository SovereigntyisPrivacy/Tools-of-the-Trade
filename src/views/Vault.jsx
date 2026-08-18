import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filesystem, Directory } from '@capacitor/filesystem';

function Vault() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const result = await Filesystem.readdir({
          path: '',
          directory: Directory.Data,
        });
        const pdfs = result.files.filter(f => f.name.endsWith('.pdf'));
        setFiles(pdfs);
      } catch (e) {
        console.error("Vault access error:", e);
      }
    };
    loadFiles();
  }, []);

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/')}>← Home</button>
        <h2>Stealth Vault</h2>
      </header>
      
      <div className="calc-content" style={{ padding: '20px' }}>
        <p style={{ color: '#aaa', marginBottom: '20px' }}>Accessing internal `/data` storage...</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {files.map(file => (
            <button 
              key={file.name} 
              className="calc-list-item"
              onClick={() => navigate(`/vault/view/${file.name}`)}
            >
              <span>📄 {file.name}</span>
            </button>
          ))}
          {files.length === 0 && <p style={{ color: '#ff4444' }}>No PDF manuals found in internal storage.</p>}
        </div>
      </div>
    </div>
  );
}

export default Vault;
