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
        updateTheme({ bgImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="view-wrapper">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h2>Settings</h2>
      </header>

      <div className="settings-content">
        <section className="settings-group">
          <h3>Appearance</h3>
          
          <label>
            Text Size ({theme.textSize}px)
            <input 
              type="range" 
              min="12" max="32" 
              value={theme.textSize}
              onChange={(e) => updateTheme({ textSize: Number(e.target.value) })}
            />
          </label>

          <label>
            Text Color
            <input 
              type="color" 
              value={theme.textColor}
              onChange={(e) => updateTheme({ textColor: e.target.value })}
            />
          </label>

          <label>
            Background Color
            <input 
              type="color" 
              value={theme.bgColor}
              onChange={(e) => updateTheme({ bgColor: e.target.value })}
            />
          </label>

          <label>
            Custom Wallpaper
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </label>
          {theme.bgImage && (
             <button className="action-btn" onClick={() => updateTheme({ bgImage: '' })}>Clear Wallpaper</button>
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

