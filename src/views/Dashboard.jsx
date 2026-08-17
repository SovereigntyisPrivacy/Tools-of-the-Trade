import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const tools = [
    { id: 'settings', name: 'Settings', path: '/settings', icon: '⚙️' },
    { id: 'vault', name: 'Stealth Vault', path: '/vault', icon: '🔒' },
    { id: 'schematics', name: 'Schematics', path: '/schematics', icon: '📐' },
    { id: 'cacher', name: 'Zero-Signal Cacher', path: '/cacher', icon: '📡' },
    { id: 'calculator', name: 'Omni-Calculator', path: '/calculator', icon: '🧮' },
  ];

  return (
    <div className="view-wrapper">
      <header className="header">
        <h1>Tools of the Trade</h1>
      </header>
      
      <div className="grid-container">
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

