import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../core/ThemeContext';

function Settings() {
  const navigate = useNavigate();
  const { theme, updateTheme } = useTheme();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateTheme({ bgImage: reader.result, bgPosX: 50, bgPosY: 50 });
      };
      reader.readAsDataURL(file);
    }
  };

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

          <label>
            Custom Wallpaper
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>
          
          {theme.bgImage && (
             <div className="wallpaper-adjustments">
               <label>Slide Horizontal (Left/Right)
                 <input type="range" min="0" max="100" value={theme.bgPosX ?? 50} onChange={(e) => updateTheme({ bgPosX: Number(e.target.value) })}/>
               </label>
               <label>Slide Vertical (Up/Down)
                 <input type="range" min="0" max="100" value={theme.bgPosY ?? 50} onChange={(e) => updateTheme({ bgPosY: Number(e.target.value) })}/>
               </label>
               <button className="action-btn" style={{marginTop: '10px'}} onClick={() => updateTheme({ bgImage: '' })}>Clear Wallpaper</button>
             </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default Settings;
