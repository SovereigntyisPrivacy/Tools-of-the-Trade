import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LearningHub() {
  const navigate = useNavigate();

  // Navigation State
  const [activeCategory, setActiveCategory] = useState('supernatural');
  const [activeSubTab, setActiveSubTab] = useState('tarot');
  const [expandedItem, setExpandedItem] = useState(null);

  // --- DATABASES ---
  const tarotDeck = [
    { name: '0 - The Fool', keywords: 'New beginnings, spontaneity, blind faith', desc: 'Represents a leap into the unknown. A reminder to embrace chaos and trust the journey without knowing the destination.' },
    { name: 'I - The Magician', keywords: 'Willpower, manifestation, resourcefulness', desc: 'You have the tools and the power to manipulate your reality. Action and concentration are required to bridge the spiritual and physical.' },
    { name: 'XIII - Death', keywords: 'Transformation, endings, transition', desc: 'Rarely means physical death. It signifies the absolute end of a cycle, forcing a clearing of the old to make way for the new.' },
    { name: 'XV - The Devil', keywords: 'Bondage, materialism, shadow self', desc: 'Being trapped by toxic habits, earthly desires, or making deals that bind your soul. Breaking these chains requires confronting your own darkness.' },
    { name: 'XVI - The Tower', keywords: 'Sudden upheaval, revelation, disaster', desc: 'The violent destruction of false paradigms. A sudden, inescapable change that tears down weak foundations so truth can be rebuilt.' }
  ];

  const creaturesDB = [
    { 
      name: 'Hellspawn / High Demons', 
      threat: 'Extreme', 
      desc: 'Entities originating from infernal realms. They frequently utilize necroplasmic energy or celestial pacts. While highly durable and capable of reality manipulation, they are inherently susceptible to holy or angelic armaments.' 
    },
    { 
      name: 'The Slayer Archetype', 
      threat: 'Apex / Extinction', 
      desc: 'Relentless supernatural hunters driven by pure rage. Rather than traditional magic, they often utilize specialized praetor-class armor and siphon absolute power directly from the demonic entities they execute.' 
    },
    { 
      name: 'Vampire (Nosferatu / Alpha)', 
      threat: 'Severe', 
      desc: 'Predatory undead entities. High-tier variants possess the ability to consume souls to create familiars and exhibit extreme bodily regeneration. They are typically only permanently halted by complete decapitation, holy artifacts, or sunlight.' 
    },
    { 
      name: 'Occult Detective / Hedge Mage', 
      threat: 'Variable (Tactical)', 
      desc: 'Mortal practitioners of the dark arts. They rely heavily on sigil magic, exorcism rituals, demonic pacts, and pure trickery to outsmart higher-tier entities that vastly outclass them in raw physical power.' 
    }
  ];

  const toggleExpand = (name) => {
    setExpandedItem(expandedItem === name ? null : name);
  };

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #222', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#a855f7', fontSize: '1.2em' }}>Learning Center</h2>
      </header>

      {/* TOP NAV: Main Categories */}
      <div style={{ display: 'flex', gap: '10px', padding: '15px 15px 0 15px', overflowX: 'auto' }}>
        <button 
          onClick={() => setActiveCategory('supernatural')} 
          style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeCategory === 'supernatural' ? '#a855f7' : '#222', color: activeCategory === 'supernatural' ? '#fff' : '#888' }}
        >
          🔮 Supernatural
        </button>
        <button 
          style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: '1px dashed #333', fontWeight: 'bold', background: 'transparent', color: '#555' }}
        >
          + Add Category
        </button>
      </div>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        {activeCategory === 'supernatural' && (
          <>
            {/* SUB-NAV: Supernatural Topics */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '15px' }}>
              <button 
                onClick={() => setActiveSubTab('tarot')} 
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: activeSubTab === 'tarot' ? '1px solid #a855f7' : '1px solid #333', background: activeSubTab === 'tarot' ? 'rgba(168, 85, 247, 0.1)' : 'transparent', color: activeSubTab === 'tarot' ? '#a855f7' : '#888', fontWeight: 'bold' }}
              >
                Tarot Arcana
              </button>
              <button 
                onClick={() => setActiveSubTab('creatures')} 
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: activeSubTab === 'creatures' ? '1px solid #ef4444' : '1px solid #333', background: activeSubTab === 'creatures' ? 'rgba(239, 68, 68, 0.1)' : 'transparent', color: activeSubTab === 'creatures' ? '#ef4444' : '#888', fontWeight: 'bold' }}
              >
                Creatures & Entities
              </button>
            </div>

            {/* CONTENT: TAROT */}
            {activeSubTab === 'tarot' && (
              <div>
                <h3 style={{ color: '#a855f7', margin: '0 0 15px 0', textTransform: 'uppercase', fontSize: '1em' }}>The Major Arcana</h3>
                {tarotDeck.map((card, idx) => (
                  <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
                    <div 
                      onClick={() => toggleExpand(card.name)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    >
                      <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{card.name}</h4>
                      <span style={{ color: '#a855f7', fontWeight: 'bold' }}>{expandedItem === card.name ? '−' : '+'}</span>
                    </div>
                    {expandedItem === card.name && (
                      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}>
                        <div style={{ color: '#00ffff', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Keywords</div>
                        <div style={{ color: '#aaa', fontStyle: 'italic', marginBottom: '15px' }}>{card.keywords}</div>
                        <div style={{ color: '#00ffff', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Interpretation</div>
                        <div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em' }}>{card.desc}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* CONTENT: CREATURES */}
            {activeSubTab === 'creatures' && (
              <div>
                <h3 style={{ color: '#ef4444', margin: '0 0 15px 0', textTransform: 'uppercase', fontSize: '1em' }}>Entity Threat Index</h3>
                {creaturesDB.map((creature, idx) => (
                  <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                    <div 
                      onClick={() => toggleExpand(creature.name)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    >
                      <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{creature.name}</h4>
                      <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{expandedItem === creature.name ? '−' : '+'}</span>
                    </div>
                    {expandedItem === creature.name && (
                      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                          <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold' }}>
                            Threat: {creature.threat}
                          </span>
                        </div>
                        <div style={{ color: '#00ffff', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Field Notes</div>
                        <div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em' }}>{creature.desc}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
