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
          adId: 'ca-app-pub-2156721625422799/4098150349',
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
    { id: "schematics", name: "Schematics", path: "/schematics", icon: "📐", badge: "MASSIVE WIP", badgeColor: "#d00000" },
    { id: "cacher", name: "Zero-Signal Cacher", path: "/cacher", icon: "📡", badge: "COMING SOON", badgeColor: "#ffb703" },
    { id: "calculator", name: "Omni-Calculator", path: "/calculator", icon: "🧮" },
    { id: "ledger", name: "Asset Ledger", path: "/ledger", icon: "📋" },
    { id: "civics", name: "Civics path: "/ledger", icon: "📋" } Rights", path: "/civics", icon: "⚖️" },
  ];

  return (
    <div className="view-wrapper pb-safe">
      <button className="corner-settings-btn" onClick={() => navigate('/settings')}>
        ⚙️
      </button>
      
      <header className="header" style={{ paddingTop: '40px' }}>
        <h1 className="friendly-title" style={{ lineHeight: '1.2', paddingBottom: '10px' }}>T⚙️⚙️ls of the Trade</h1>
      </header>

      <div className="grid-container" style={{ marginTop: '40px' }}>
        {tools.map((tool) => (
          <button 
            key={tool.id}
            className="tool-card"
            style={{ position: 'relative' }}
            onClick={() => navigate(tool.path)}
          >
            {tool.badge && (
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                background: tool.badgeColor,
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: '900',
                padding: '6px 10px',
                borderRadius: '8px',
                border: '2px solid #111',
                transform: 'rotate(5deg)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.6)',
                zIndex: 10,
                whiteSpace: 'nowrap'
              }}>
                {tool.badge}
              </div>
            )}
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-name">{tool.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
