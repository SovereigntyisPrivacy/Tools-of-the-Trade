import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../core/ThemeContext';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

function Settings() {
  const navigate = useNavigate();
  const { theme, updateTheme } = useTheme();
  const [rawImage, setRawImage] = useState(null);
  const cropperRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRawImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveCrop = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedBase64 = cropperRef.current.cropper.getCroppedCanvas({
        maxWidth: 1080,
        maxHeight: 1920
      }).toDataURL('image/jpeg', 0.85);
      
      updateTheme({ bgImage: croppedBase64 });
      setRawImage(null);
    }
  };

  if (rawImage) {
    return (
      <div className="view-wrapper" style={{ height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', paddingTop: '10px' }}>
        
        <div style={{ flex: 1, background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333', marginTop: '50px' }}>
          <Cropper
            src={rawImage}
            style={{ height: '100%', width: '100%' }}
            initialAspectRatio={window.innerWidth / window.innerHeight}
            guides={true}
            ref={cropperRef}
            viewMode={1}
            dragMode="move"
            background={false}
            responsive={true}
          />
        </div>
        
        {/* Massive 120px bottom padding added here to permanently clear the ad banner */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '15px 0 120px 0' }}>
          <button className="action-btn" onClick={() => cropperRef.current.cropper.rotate(-90)}>↺ Rotate Left</button>
          <button className="action-btn" onClick={() => cropperRef.current.cropper.rotate(90)}>Rotate Right ↻</button>
          <button className="action-btn" style={{ background: 'rgba(255, 68, 68, 0.2)', border: '1px solid #ff4444', color: '#ff4444' }} onClick={() => setRawImage(null)}>Cancel</button>
          <button className="action-btn" style={{ background: '#00cc66', color: '#000', fontWeight: 'bold', border: 'none' }} onClick={saveCrop}>Accept</button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-wrapper pb-safe" style={{ paddingBottom: '120px' }}>
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h2>Settings</h2>
      </header>

      <div className="settings-content">
        
        <section className="settings-group promo-banner" onClick={() => window.open('https://github.com/xNoOnex/SovereignTools1', '_blank')}>
          <div className="promo-content">
            <h3>🛡️ Sovereign Tools</h3>
            <p>Take back your privacy. Get the ultimate offline utility and privacy suite.</p>
            <span className="promo-btn">View Project &rarr;</span>
          </div>
        </section>

        <section className="settings-group">
          <h3>Appearance</h3>
          
          <label>
            Text Size ({theme.textSize}px)
            <input type="range" min="12" max="32" value={theme.textSize} onChange={(e) => updateTheme({ textSize: Number(e.target.value) })}/>
          </label>

          <div className="color-row">
            <span>Text Color</span>
            <label className="clean-color-picker" style={{ backgroundColor: theme.textColor }}>
              <input type="color" value={theme.textColor} onChange={(e) => updateTheme({ textColor: e.target.value })}/>
            </label>
          </div>

          <div className="color-row">
            <span>Background Color</span>
            <label className="clean-color-picker" style={{ backgroundColor: theme.bgColor }}>
              <input type="color" value={theme.bgColor} onChange={(e) => updateTheme({ bgColor: e.target.value })}/>
            </label>
          </div>

          <label style={{ marginTop: '15px' }}>
            Custom Wallpaper
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>
          
          {theme.bgImage && (
             <button className="action-btn" style={{marginTop: '10px', background: 'rgba(255,68,68,0.2)', color: '#ff4444', borderColor: '#ff4444'}} onClick={() => updateTheme({ bgImage: '' })}>Clear Wallpaper</button>
          )}
        </section>

        <section className="settings-group">
          <h3>Support the Creator</h3>
          <p>If ToT helps you out in the field, consider supporting development!</p>
          <button className="action-btn" onClick={() => window.open('https://github.com/sponsors', '_blank')}>
            Support the Project
          </button>
        </section>
      </div>
    </div>
  );
}

export default Settings;
