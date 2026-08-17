import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const showBanner = async () => {
      try {
        await AdMob.initialize();
        await AdMob.showBanner({
          adId: 'ca-app-pub-3940256099942544~3347511713',
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: true
        });
      } catch (e) {
        console.error("AdMob Error:", e);
      }
    };
    showBanner();
  }, []);

  // Settings is removed from the grid and moved to the corner
  const tools = [
    { id: 'vault', name: 'Stealth Vault', path: '/vault', icon: '🔒' },
    { id: 'schematics', name: 'Schematics', path: '/schematics', icon: '📐' },
    { id: 'cacher', name: 'Zero-Signal Cacher', path: '/cacher', icon: '📡' },
    { id: 'calculator', name: 'Omni-Calculator', path: '/calculator', icon: '🧮' },
  ];

  return (
    <div className="view-wrapper pb-safe">
      
      {/* Floating Top-Right Settings Button */}
      <button className="corner-settings-btn" onClick={() => navigate('/settings')}>
        ⚙️
      </button>

      <header className="header" style={{ paddingTop: '30px' }}>
        <h1 className="friendly-title">T⚙️⚙️ls of the Trade</h1>
      </header>
      
      <div className="grid-container" style={{ marginTop: '20px' }}>
        {tools.map((tool) => (
          <button 
            key={tool.id} 
            className="tool-card"
            onClick={() => navigate(tool.path)}
          >
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-name">{tool.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
