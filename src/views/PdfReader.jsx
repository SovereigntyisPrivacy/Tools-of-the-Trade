import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Browser } from '@capacitor/browser';

export default function PdfReader() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');

  const handleDownload = async () => {
    if (!url) return alert('Please enter a valid URL.');
    try {
      await Browser.open({ url });
    } catch (e) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
        <h2>Universal Downloader</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', height: '100%' }}>
        <p style={{ color: '#aaa', marginBottom: '20px', lineHeight: '1.5' }}>
          Enter a direct link to any manual or schematic (PDF, EPUB, ZIP). Android will securely download it directly to your device's native Downloads folder.
        </p>
        
        <input 
          type="url" 
          placeholder="Paste file URL here..." 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          style={{ width: '100%', padding: '12px', background: '#000', color: '#fff', border: '1px solid #444', borderRadius: '8px', marginBottom: '20px' }}
        />

        <button 
          onClick={handleDownload} 
          style={{ width: '100%', padding: '15px', background: '#00cc66', color: '#000', fontWeight: 'bold', fontSize: '1.1em', borderRadius: '8px', border: 'none' }}
        >
          ⬇️ Secure Download
        </button>
      </div>
    </div>
  );
}
