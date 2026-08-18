import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

function VisualScanner() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [engine, setEngine] = useState('gemini'); // Default to Gemini
  const [hasKey, setHasKey] = useState(false);
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem(`${engine}_api_key`);
    if (savedKey) {
      setApiKey(savedKey);
      setHasKey(true);
    } else {
      setApiKey('');
      setHasKey(false);
    }
  }, [engine]);

  const saveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(`${engine}_api_key`, apiKey.trim());
      setHasKey(true);
    }
  };

  const captureImage = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
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
      if (engine === 'gemini') {
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
      } 
      else if (engine === 'openai') {
        // OpenAI GPT-4o Vision API Logic
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{
              role: "user",
              content: [
                { type: "text", text: "You are a tactical field guide. Identify the primary subject in this image. Detail hazards, uses, or functions. Be concise." },
                { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Data}` } }
              ]
            }],
            max_tokens: 300
          })
        });
        const data = await response.json();
        if (data.choices && data.choices[0].message.content) {
          setAnalysis(data.choices[0].message.content);
        } else {
          setAnalysis("OpenAI Engine failed to process the image.");
        }
      }
      else if (engine === 'local') {
        setAnalysis("Local Offline Node targeting is under construction. Future updates will allow routing to a local IP address.");
      }
    } catch (error) {
      console.error("AI API Error:", error);
      setAnalysis(`Connection to ${engine.toUpperCase()} mainframe failed. Verify your API key and network connection.`);
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
        
        {/* Engine Selector always visible */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontWeight: 'bold' }}>Select Neural Engine:</label>
          <select 
            value={engine} 
            onChange={(e) => setEngine(e.target.value)}
            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.8)', color: '#00ffff', border: '1px solid #00ffff', borderRadius: '8px', fontSize: '1em' }}
          >
            <option value="gemini">Google Gemini (Free Tier)</option>
            <option value="openai">OpenAI GPT-4o (Premium)</option>
            <option value="local">Custom Local Node (Offline)</option>
          </select>
        </div>

        {!hasKey && engine !== 'local' ? (
          <div className="input-card" style={{ borderTop: '4px solid #ff4444' }}>
            <h3 style={{ color: '#fff', marginBottom: '10px' }}>🔑 Engine Authorization</h3>
            <p style={{ color: '#aaa', fontSize: '0.9em', marginBottom: '15px' }}>
              Enter your API key for <strong>{engine.toUpperCase()}</strong>. By using your own key, Tools of the Trade remains 100% free forever with no hidden subscriptions.
            </p>
            
            <input 
              type="password" 
              placeholder="Paste API Key here..." 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', background: '#000', color: '#fff', marginBottom: '15px' }}
            />
            
            <button onClick={saveKey} style={{ width: '100%', padding: '12px', background: '#00cc66', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', marginBottom: '20px' }}>
              Authorize Scanner
            </button>

            {engine === 'gemini' && (
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
                <h4 style={{ color: '#ffaa00', marginTop: 0, marginBottom: '8px' }}>ℹ️ How to get a free key</h4>
                <p style={{ color: '#ccc', fontSize: '0.85em', lineHeight: '1.4', marginBottom: '12px' }}>
                  Tap the link below. When Google asks if you are a "developer", <strong>check the box</strong>. You are the developer of your own toolkit! 
                  <br/><br/>
                  <strong style={{ color: '#ff4444' }}>Privacy Notice:</strong> Images scanned here are sent to Google's cloud. Do not scan sensitive personal documents.
                </p>
                <button 
                  onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}
                  style={{ width: '100%', padding: '10px', background: 'transparent', color: '#ffaa00', border: '1px solid #ffaa00', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Get API Key (Opens Browser) ↗
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button 
              onClick={captureImage}
              style={{ width: '100%', padding: '20px', background: 'rgba(0, 255, 255, 0.1)', border: '2px dashed #00ffff', borderRadius: '12px', color: '#00ffff', fontSize: '1.2em', fontWeight: 'bold', marginBottom: '20px', display: engine === 'local' ? 'none' : 'block' }}
            >
              📷 Activate Camera Uplink
            </button>

            {engine === 'local' && (
              <div style={{ color: '#aaa', textAlign: 'center', padding: '20px', border: '1px dashed #555', borderRadius: '8px' }}>
                Local Node targeting requires configuring an IP address for an offline LLM (e.g., LM Studio / Ollama). This feature is coming in a future update.
              </div>
            )}

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
            
            {engine !== 'local' && (
              <button onClick={() => { localStorage.removeItem(`${engine}_api_key`); setHasKey(false); }} style={{ marginTop: '40px', background: 'transparent', border: 'none', color: '#555', textDecoration: 'underline', width: '100%' }}>
                Reset API Key
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default VisualScanner;
