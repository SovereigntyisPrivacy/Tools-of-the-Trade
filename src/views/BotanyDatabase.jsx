import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OFFLINE_FLORA_DB = [
  {
    id: 'f1',
    name: 'Prickly Pear Cactus (Opuntia)',
    type: 'Edible / Hydration',
    dangerLevel: 'Low (Physical Spines)',
    color: '#00cc66',
    icon: '🌵',
    description: 'Segmented, flat cactus pads with red/purple bulbous fruit.',
    details: 'Both the pads (nopales) and the fruit (tuna) are highly nutritious and water-dense. You MUST burn or scrape off the microscopic hair-like spines (glochids) before processing or consumption.',
    lookalikes: 'Other cacti (mostly non-toxic, but often unpalatable).'
  },
  {
    id: 'f2',
    name: 'Saguaro (Carnegiea gigantea)',
    type: 'Edible / Hydration',
    dangerLevel: 'Low',
    color: '#00cc66',
    icon: '🏜️',
    description: 'Massive, towering columnar cactus native to the Sonoran ecosystem.',
    details: 'Produces ruby-red, incredibly nutrient-dense fruit in mid-summer. DO NOT cut into the main trunk for water; the interior is woody ribs and the fluid is highly alkaline and induces vomiting.',
    lookalikes: 'Cardón cactus (similar, also produces edible fruit).'
  },
  {
    id: 'f3',
    name: 'Creosote Bush (Larrea tridentata)',
    type: 'Medicinal / Utility',
    dangerLevel: 'Moderate (Internal Toxicity)',
    color: '#3b82f6',
    icon: '🌿',
    description: 'Resinous evergreen shrub with small yellow flowers. Smells strongly of desert rain.',
    details: 'Externally: Boil leaves to create a potent antibacterial/antifungal wash or poultice for wounds and burns. Internally: Avoid heavy ingestion; high doses of chaparral extract cause severe liver toxicity.',
    lookalikes: 'None (distinctive smell).'
  },
  {
    id: 'f4',
    name: 'Datura / Jimsonweed (Datura stramonium)',
    type: 'Toxic / Deliriant',
    dangerLevel: 'EXTREME (LETHAL)',
    color: '#ef4444',
    icon: '☠️',
    description: 'Bushy weed with large, white, upward-facing trumpet flowers and spiked seed pods.',
    details: 'DO NOT INGEST. Contains lethal levels of scopolamine and atropine. Causes severe tachycardia, hyperthermia, terrifying prolonged delirium, and death. Handle with gloves if removal is necessary.',
    lookalikes: 'Moonflower (Ipomoea alba) - also toxic.'
  },
  {
    id: 'f5',
    name: 'Broadleaf Plantain (Plantago major)',
    type: 'Medicinal / Edible',
    dangerLevel: 'None',
    color: '#3b82f6',
    icon: '🌱',
    description: 'Low-growing weed with broad, ribbed green leaves found in compacted soil.',
    details: 'Often called "Nature\'s Band-Aid". Chew the leaves into a pulp to create an instant drawing poultice for bee stings, spider bites, and minor cuts. Young leaves are edible raw.',
    lookalikes: 'Hosta (non-toxic).'
  },
  {
    id: 'f6',
    name: 'Poison Hemlock (Conium maculatum)',
    type: 'Toxic / LETHAL',
    dangerLevel: 'EXTREME (LETHAL)',
    color: '#ef4444',
    icon: '☠️',
    description: 'Tall plant with lacy, fern-like leaves and umbrella-shaped clusters of white flowers.',
    details: 'DO NOT TOUCH OR INGEST. Highly neurotoxic. Attacks the central nervous system causing rapid respiratory failure. Key identifier: Smooth, hairless stems with PURPLE splotches.',
    lookalikes: 'Wild Carrot / Queen Anne\'s Lace (has hairy stems, no purple), Wild Parsley.'
  }
];

export default function BotanyDatabase() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(OFFLINE_FLORA_DB);

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setQuery(val);
    
    if (!val.trim()) {
      setResults(OFFLINE_FLORA_DB);
      return;
    }

    const filtered = OFFLINE_FLORA_DB.filter(plant => 
      plant.name.toLowerCase().includes(val) || 
      plant.type.toLowerCase().includes(val) ||
      plant.description.toLowerCase().includes(val)
    );
    setResults(filtered);
  };

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '15px' };

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#00cc66', fontSize: '1.2em' }}>Botany & Foraging</h2>
      </header>

      <div style={{ padding: '20px', overflowY: 'auto' }}>
        
        {/* Bridge to AI Scanner */}
        <button onClick={() => navigate('/schematics/scanner')} style={{ width: '100%', padding: '15px', background: 'rgba(0, 204, 102, 0.1)', border: '1px solid #00cc66', borderRadius: '8px', color: '#00cc66', fontWeight: 'bold', fontSize: '1em', marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <span>👁️</span> Unknown Target? Use AI Visual Scanner
        </button>

        <p style={{ color: '#00cc66', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>🌿 Offline Field Guide</p>

        <input 
          type="text" 
          placeholder="Search 'Edible', 'Medicinal', or 'Cactus'..." 
          value={query}
          onChange={handleSearch}
          style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #00cc66', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1.1em', marginBottom: '25px', boxSizing: 'border-box' }}
        />

        {results.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No offline records found for "{query}".</div>
        ) : (
          results.map(plant => (
            <div key={plant.id} style={{ ...cardStyle, borderLeft: `4px solid ${plant.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', borderBottom: '1px solid #222', paddingBottom: '15px' }}>
                <div style={{ fontSize: '2.5rem', background: '#000', padding: '10px', borderRadius: '50%', border: '1px solid #333' }}>{plant.icon}</div>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '1.1em' }}>{plant.name}</h3>
                  <span style={{ background: 'rgba(255,255,255,0.1)', color: plant.color, padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase' }}>{plant.type}</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <span style={{ color: '#888', fontSize: '0.85em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Identification</span>
                <p style={{ color: '#ccc', margin: 0, fontSize: '0.95em', lineHeight: '1.5' }}>{plant.description}</p>
              </div>

              <div style={{ marginBottom: '15px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
                <span style={{ color: plant.color, fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Field Notes & Uses</span>
                <p style={{ color: '#fff', margin: 0, fontSize: '0.95em', lineHeight: '1.5' }}>{plant.details}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em' }}>
                  <span style={{ color: '#888' }}>DANGER LEVEL:</span>
                  <strong style={{ color: plant.dangerLevel.includes('EXTREME') ? '#ef4444' : '#f59e0b' }}>{plant.dangerLevel}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em' }}>
                  <span style={{ color: '#888' }}>LOOKALIKES:</span>
                  <span style={{ color: '#ccc', textAlign: 'right', maxWidth: '60%' }}>{plant.lookalikes}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
