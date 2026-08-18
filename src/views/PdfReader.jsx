import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { Filesystem, Directory } from '@capacitor/filesystem';

// Configure the worker for PDF rendering
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PdfReader() {
  const { fileName } = useParams();
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState(null);
  const [fileData, setFileData] = useState(null);

  React.useEffect(() => {
    const loadPdf = async () => {
      const contents = await Filesystem.readFile({
        path: fileName,
        directory: Directory.Data,
      });
      // Convert to base64 data URL
      setFileData(`data:application/pdf;base64,${contents.data}`);
    };
    loadPdf();
  }, [fileName]);

  return (
    <div className="view-wrapper">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/vault')}>← Back</button>
        <h2>{fileName}</h2>
      </header>
      
      <div style={{ padding: '10px', overflowY: 'auto', height: '100%' }}>
        {fileData ? (
          <Document file={fileData} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} width={window.innerWidth - 40} />
            ))}
          </Document>
        ) : <p style={{ color: '#fff' }}>Loading Document...</p>}
      </div>
    </div>
  );
}

export default PdfReader;
