import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();

  // --- STATE WITH LOCAL STORAGE PERSISTENCE ---
  const [textSize, setTextSize] = useState(localStorage.getItem('tot_txt_size') || '15');
  const [textColor, setTextColor] = useState(localStorage.getItem('tot_txt_color') || '#00ffff');
  const [bgColor, setBgColor] = useState(localStorage.getItem('tot_bg_color') || '#000000');
  const [wallpaper, setWallpaper] = useState(localStorage.getItem('tot_wallpaper') || '');

  // --- GLOBAL DOM MUTATIONS ---
  useEffect(() => {
    document.body.style.fontSize = `${textSize}px`;
    document.documentElement.style.setProperty('--app-font-size', `${textSize}px`);
    localStorage.setItem('tot_txt_size', textSize);
  }, [textSize]);

  useEffect(() => {
    document.body.style.color = textColor;
    document.documentElement.style.setProperty('--app-text-color', textColor);
    localStorage.setItem('tot_txt_color', textColor);
  }, [textColor]);

  useEffect(() => {
    if (wallpaper) {
      document.body.style.backgroundImage = `url(${wallpaper})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      document.body.style.backgroundImage = 'none';
      document.body.style.backgroundColor = bgColor;
    }
    document.documentElement.style.setProperty('--app-bg-color', bgColor);
    localStorage.setItem('tot_bg_color', bgColor);
    localStorage.setItem('tot_wallpaper', wallpaper);
  }, [bgColor, wallpaper]);

  // --- WALLPAPER UPLOAD ENGINE ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWallpaper(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearWallpaper = () => setWallpaper('');

  // --- STYLES ---
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '20px' };

  return (
    <div className="view-wrapper pb-safe" style={{ background: 'transparent', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', background: '#0a0a0a' }}>
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2>Settings</h2>
      </header>

      {/* Added bottom padding to clear the ad block */}
      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', flex: 1, paddingBottom: '120px' }}>
        
        {/* SOVEREIGN TOOLS PLUG */}
        <div style={{ ...cardStyle, borderTop: '4px solid #ef4444', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>🛡️ Sovereign Tools</h3>
          <p style={{ color: '#aaa', fontSize: '0.9em', marginBottom: '15px' }}>Take back your privacy. Get the ultimate offline utility and privacy suite.</p>
          <button onClick={() => window.open('https://github.com/xNoOnex/SovereignTools1', '_blank')} style={{ padding: '10px 20px', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', width: '100%' }}>View Project ➔</button>
        </div>

        {/* APPEARANCE & WALLPAPER ENGINE */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 15px 0', color: '#00ffff', textAlign: 'center' }}>Appearance</h3>
          
          <label style={{ color: '#00ffff', fontSize: '0.85em', fontWeight: 'bold', display: 'block', textAlign: 'center', marginBottom: '10px' }}>Text Size ({textSize}px)</label>
          <input type="range" min="12" max="22" value={textSize} onChange={e => setTextSize(e.target.value)} style={{ width: '100%', marginBottom: '20px' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ color: '#00ffff', fontSize: '0.85em', fontWeight: 'bold' }}>Text Color</span>
            <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} style={{ width: '40px', height: '40px', background: 'none', border: 'none', cursor: 'pointer' }} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ color: '#00ffff', fontSize: '0.85em', fontWeight: 'bold' }}>Background Color</span>
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: '40px', height: '40px', background: 'none', border: 'none', cursor: 'pointer' }} />
          </div>

          <div style={{ borderTop: '1px dashed #333', paddingTop: '15px' }}>
            <span style={{ color: '#00ffff', fontSize: '0.85em', fontWeight: 'bold', display: 'block', textAlign: 'center', marginBottom: '10px' }}>Custom Wallpaper</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ width: '100%', color: '#aaa', fontSize: '0.9em', marginBottom: '10px' }} />
            {wallpaper && (
              <button onClick={clearWallpaper} style={{ width: '100%', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', fontWeight: 'bold' }}>
                Remove Wallpaper
              </button>
            )}
          </div>
        </div>

        {/* SUPPORT BUTTON */}
        <div style={{ ...cardStyle, textAlign: 'center', borderTop: '4px solid #f59e0b' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#fff' }}>Support the Creator</h3>
          <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px', lineHeight: '1.4' }}>If ToT helps you out in the field, support open development or request personal builds!</p>
          <button 
            onClick={() => navigate('/support')}
            style={{ width: '100%', padding: '14px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid #f59e0b', borderRadius: '8px', fontWeight: 'bold', fontSize: '1em' }}>
            Support the Project
          </button>
        </div>

      </div>
    </div>
  );
}
