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
          adId: 'ca-app-pub-3940256099942544/6300978111',
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: true
        });
      } catch (e) {
        console.error('AdMob Error:', e);
      }
    };
    showBanner();
  }, []);

  const tools = [
    { id: "schematics", name: "Schematics", path: "/schematics", icon: "📐" },
    { id: "cacher", name: "Zero-Signal Cacher", path: "/cacher", icon: "📡" },
    { id: "calculator", name: "Omni-Calculator", path: "/calculator", icon: "🧮" }
  ];

  return (
    <div className="view-wrapper pb-safe">
      <button className="corner-settings-btn" onClick={() => navigate('/settings')}>
        ⚙️
      </button>
      
      <header className="header" style={{ paddingTop: '40px' }}>
        <h1 className="friendly-title">Tools of the Trade</h1>
      </header>

      <div className="grid-container" style={{ marginTop: '40px' }}>
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
