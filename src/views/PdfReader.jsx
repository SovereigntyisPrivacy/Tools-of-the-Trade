import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

// Configure the web worker for heavy PDF rendering
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PdfReader() {
  const { fileName } = useParams();
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        // Grab the native device path instead of loading the file into RAM
        const result = await Filesystem.getUri({
          path: fileName,
          directory: Directory.Data,
        });
        
        // Convert the native path to a secure WebView streaming URL
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
        {/* Truncate super long manual names so they don't break the header */}
        <h2 style={{ fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
          {fileName}
        </h2>
      </header>
      
      <div style={{ padding: '10px', overflowY: 'auto', height: '100%', background: '#111', paddingBottom: '80px' }}>
        {error && (
          <div style={{ color: '#ff4444', textAlign: 'center', padding: '20px', border: '1px solid #ff4444', margin: '20px', borderRadius: '8px', background: 'rgba(255,0,0,0.1)' }}>
            <p style={{ fontWeight: 'bold' }}>Engine Failure</p>
            <p>{error}</p>
            <p style={{ fontSize: '0.85em', color: '#aaa', marginTop: '10px' }}>The archive file may be corrupted, or it was downloaded as a webpage instead of a raw PDF document.</p>
          </div>
        )}
        
        {fileUrl && !error ? (
          <Document 
            file={fileUrl} 
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(err) => setError(err.message)}
            loading={<div style={{ color: '#00ffff', textAlign: 'center', marginTop: '40px' }}>⚙️ Streaming heavy document from Vault...</div>}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div key={`page_${index + 1}`} style={{ marginBottom: '10px', border: '1px solid #333', boxShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>
                <Page 
                  pageNumber={index + 1} 
                  width={window.innerWidth - 20} 
                  renderTextLayer={false} // Dramatically improves mobile performance
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
