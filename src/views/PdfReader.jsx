import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

// 100% Offline Local Worker - Prevents CORS blocks and allows off-grid reading
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function PdfReader() {
  const { fileName } = useParams();
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const result = await Filesystem.getUri({
          path: fileName,
          directory: Directory.Data,
        });
        
        const safeUrl = Capacitor.convertFileSrc(result.uri);
        setFileUrl(safeUrl);
      } catch (err) {
        console.error("PDF Load Error:", err);
        setError(err.message);
      }
    };
    loadPdf();
  }, [fileName]);

  return (
    <div className="view-wrapper">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/vault')}>← Vault</button>
        <h2 style={{ fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
          {fileName}
        </h2>
      </header>
      
      <div style={{ padding: '10px', overflowY: 'auto', height: '100%', background: '#111', paddingBottom: '80px' }}>
        {error && (
          <div style={{ color: '#ff4444', textAlign: 'center', padding: '20px', border: '1px solid #ff4444', margin: '20px', borderRadius: '8px', background: 'rgba(255,0,0,0.1)' }}>
            <p style={{ fontWeight: 'bold' }}>Engine Failure</p>
            <p>{error}</p>
          </div>
        )}
        
        {fileUrl && !error ? (
          <Document 
            file={fileUrl} 
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(err) => setError(err.message)}
            loading={<div style={{ color: '#00ffff', textAlign: 'center', marginTop: '40px' }}>⚙️ Booting Local PDF Engine...</div>}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div key={`page_${index + 1}`} style={{ marginBottom: '10px', border: '1px solid #333', boxShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>
                <Page 
                  pageNumber={index + 1} 
                  width={window.innerWidth - 20} 
                  renderTextLayer={false} 
                  renderAnnotationLayer={false} 
                />
              </div>
            ))}
          </Document>
        ) : !error && (
          <div style={{ color: '#fff', textAlign: 'center', marginTop: '40px' }}>Initializing Vault Viewer...</div>
        )}
      </div>
    </div>
  );
}

export default PdfReader;
