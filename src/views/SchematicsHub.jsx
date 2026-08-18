import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SchematicsHub() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'electronics', icon: '🔌', title: 'Electronics & Wiring', desc: 'Circuit diagrams, pinouts, and hardware teardowns.' },
    { id: 'mechanics', icon: '⚙️', title: 'Mechanics & Engines', desc: 'Vehicle manuals, engine diagrams, and machining blueprints.' },
    { id: 'botany', icon: '🌿', title: 'Botany & Foraging', desc: 'Plant identification, medicinal uses, and toxicity warnings.' },
    { id: 'pharmacology', icon: '💊', title: 'Pharmacology', desc: 'Pill identification, dosages, and chemical contraindications.' },
    { id: 'firearms', icon: '🔫', title: 'Firearms & Armory', desc: 'Weapon schematics, assembly/disassembly, and maintenance.' },
    { id: 'library', icon: '📚', title: 'Survival Library', desc: 'Field manuals, medical guides, and PDF reference books.' },
    { id: 'local', icon: '📁', title: 'Local SD Card Storage', desc: 'Browse and load your personally downloaded offline archives.' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Search engine logic for "${searchQuery}" coming next!`);
  };

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h2>Schematics Archive</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* Global Search Bar */}
        <form onSubmit={handleSearch} style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="Search all databases..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid #00ffff', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1.1em' }}
            />
            <button type="submit" style={{ padding: '0 20px', background: '#00ffff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2em' }}>
              🔍
            </button>
          </div>
        </form>

        <h3 style={{ borderBottom: '2px solid #444', paddingBottom: '10px', color: '#fff', marginBottom: '15px' }}>Database Categories</h3>

        {/* Directory Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {categories.map(cat => (
            <button 
              key={cat.id} 
              style={{ display: 'flex', alignItems: 'center', background: 'rgba(20, 20, 20, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', padding: '15px', textAlign: 'left', width: '100%' }}
              onClick={() => alert(`Entering ${cat.title} database...`)}
            >
              <span style={{ fontSize: '32px', marginRight: '15px', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}>{cat.icon}</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'var(--tot-text-color, #00ffff)', fontWeight: '900', fontSize: '1.1em', marginBottom: '4px' }}>{cat.title}</span>
                <span style={{ color: '#ccc', fontSize: '0.85em', lineHeight: '1.3' }}>{cat.desc}</span>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

export default SchematicsHub;
