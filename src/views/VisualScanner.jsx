import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

function VisualScanner() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setHasKey(true);
    }
  }, []);

  const saveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setHasKey(true);
    }
  };

  const captureImage = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera // Forces the native camera to open
      });
      setImage(`data:image/jpeg;base64,${photo.base64String}`);
      analyzeImage(photo.base64String);
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  const analyzeImage = async (base64Data) => {
    setLoading(true);
    setAnalysis('');
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "You are a tactical field guide. Identify the primary subject in this image. If it is a plant, state its name, edibility, medicinal uses, and toxicity. If it is a pill or chemical, state its likely identity and warnings. If it is a mechanical or electronic component, explain what it is and its function. Be concise, accurate, and format the output cleanly." },
              { inline_data: { mime_type: "image/jpeg", data: base64Data } }
            ]
          }]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        setAnalysis(data.candidates[0].content.parts[0].text);
      } else {
        setAnalysis("Scanner failed to extract meaningful data from the image.");
      }
    } catch (error) {
      console.error("AI API Error:", error);
      setAnalysis("Connection to AI mainframe failed. Verify your API key and network connection.");
    }
    setLoading(false);
  };

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/schematics')}>← Hub</button>
        <h2>AI Visual Scanner</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {!hasKey ? (
          <div className="input-card" style={{ borderTop: '4px solid #ff4444' }}>
            <h3 style={{ color: '#fff', marginBottom: '10px' }}>🔑 Engine Authorization</h3>
            <p style={{ color: '#aaa', fontSize: '0.9em', marginBottom: '15px' }}>
              To enable visual scanning, enter your free Google Gemini API key. This is stored locally on your device.
            </p>
            <input 
              type="text" 
              placeholder="Paste API Key here..." 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', background: '#000', color: '#fff', marginBottom: '15px' }}
            />
            <button onClick={saveKey} style={{ width: '100%', padding: '12px', background: '#00cc66', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px' }}>
              Authorize Scanner
            </button>
          </div>
        ) : (
          <>
            <button 
              onClick={captureImage}
              style={{ width: '100%', padding: '20px', background: 'rgba(0, 255, 255, 0.1)', border: '2px dashed #00ffff', borderRadius: '12px', color: '#00ffff', fontSize: '1.2em', fontWeight: 'bold', marginBottom: '20px' }}
            >
              📷 Activate Camera Uplink
            </button>

            {image && (
              <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #444' }}>
                <img src={image} alt="Scanned Target" style={{ width: '100%', display: 'block' }} />
              </div>
            )}

            {loading && (
              <div style={{ color: '#ffaa00', textAlign: 'center', padding: '20px', fontWeight: 'bold', fontSize: '1.1em', background: 'rgba(255, 170, 0, 0.1)', borderRadius: '8px', border: '1px solid #ffaa00' }}>
                Analyzing spectral data...
              </div>
            )}

            {analysis && !loading && (
              <div className="result-card" style={{ background: 'rgba(10, 10, 10, 0.9)', borderLeft: '4px solid #00cc66', padding: '20px' }}>
                <h3 style={{ marginTop: 0, color: '#00cc66', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>Identification Results</h3>
                <div style={{ color: '#fff', fontSize: '1em', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {analysis}
                </div>
              </div>
            )}
            
            <button onClick={() => { localStorage.removeItem('gemini_api_key'); setHasKey(false); }} style={{ marginTop: '40px', background: 'transparent', border: 'none', color: '#555', textDecoration: 'underline', width: '100%' }}>
              Reset API Key
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default VisualScanner;
