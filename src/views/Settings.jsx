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
        setRawImage(reader.result); // Hijack the screen to show the cropper
      };
      reader.readAsDataURL(file);
    }
  };

  const saveCrop = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      // Bake the cropped area into an optimized JPEG so it doesn't lag the app
      const croppedBase64 = cropperRef.current.cropper.getCroppedCanvas({
        maxWidth: 1080,
        maxHeight: 1920
      }).toDataURL('image/jpeg', 0.85);
      
      updateTheme({ bgImage: croppedBase64 });
      setRawImage(null); // Close the cropper
    }
  };

  // IF AN IMAGE IS SELECTED: Show the fullscreen cropping studio
  if (rawImage) {
    return (
      <div className="view-wrapper pb-safe" style={{ height: '90vh', display: 'flex', flexDirection: 'column' }}>
        <header className="header" style={{ justifyContent: 'space-between' }}>
          <button className="back-btn" onClick={() => setRawImage(null)}>Cancel</button>
          <h2 style={{ fontSize: '1.2em', margin: 0 }}>Adjust Wallpaper</h2>
          <button className="action-btn" style={{ background: '#ffffff', color: '#000', fontWeight: 'bold' }} onClick={saveCrop}>Save</button>
        </header>
        
        <div style={{ flex: 1, background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
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
        
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px 0' }}>
          <button className="action-btn" onClick={() => cropperRef.current.cropper.rotate(-90)}>↺ Rotate</button>
          <button className="action-btn" onClick={() => cropperRef.current.cropper.rotate(90)}>Rotate ↻</button>
        </div>
      </div>
    );
  }

  // STANDARD SETTINGS MENU
  return (
    <div className="view-wrapper pb-safe">
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
             <button className="action-btn" style={{marginTop: '10px'}} onClick={() => updateTheme({ bgImage: '' })}>Clear Wallpaper</button>
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
