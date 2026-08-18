import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filesystem, Directory } from '@capacitor/filesystem';

function Vault() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

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

  useEffect(() => {
    loadFiles();
  }, []);

  const deleteFile = async (fileName) => {
    if(window.confirm(`Are you sure you want to delete ${fileName} from the Vault?`)) {
      try {
        await Filesystem.deleteFile({
          path: fileName,
          directory: Directory.Data
        });
        loadFiles(); // Refresh the list
      } catch (e) {
        console.error("Delete failed:", e);
      }
    }
  };

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/')}>← Home</button>
        <h2>Stealth Vault</h2>
      </header>
      
      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        <p style={{ color: '#00cc66', fontWeight: 'bold', marginBottom: '20px' }}>🗄️ Internal Secure Storage</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {files.map(file => (
            <div key={file.name} style={{ display: 'flex', flexDirection: 'column', background: 'rgba(20, 20, 20, 0.8)', border: '1px solid #444', borderRadius: '8px', overflow: 'hidden' }}>
              <button 
                style={{ padding: '15px', background: 'transparent', border: 'none', color: '#fff', textAlign: 'left', fontSize: '1em', wordBreak: 'break-word', cursor: 'pointer' }}
                onClick={() => navigate(`/vault/view/${file.name}`)}
              >
                📄 <span style={{ color: '#00ffff' }}>{file.name}</span>
              </button>
              <div style={{ display: 'flex', borderTop: '1px solid #333' }}>
                <button 
                  onClick={() => navigate(`/vault/view/${file.name}`)}
                  style={{ flex: 1, padding: '10px', background: 'rgba(0, 255, 255, 0.1)', color: '#00ffff', border: 'none', fontWeight: 'bold' }}
                >
                  Read
                </button>
                <div style={{ width: '1px', background: '#333' }}></div>
                <button 
                  onClick={() => deleteFile(file.name)}
                  style={{ flex: 1, padding: '10px', background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', border: 'none', fontWeight: 'bold' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {files.length === 0 && (
            <div style={{ color: '#aaa', textAlign: 'center', marginTop: '20px', padding: '20px', border: '1px dashed #444', borderRadius: '8px' }}>
              The Vault is currently empty.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Vault;
