import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LearningHub() {
  const navigate = useNavigate();

  // Navigation State
  const [activeCategory, setActiveCategory] = useState('supernatural');
  const [activeSubTab, setActiveSubTab] = useState('tarot');
  const [activeTarotTab, setActiveTarotTab] = useState('basics');
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
    { name: 'Hellspawn / High Demons', threat: 'Extreme', desc: 'Entities originating from infernal realms. They frequently utilize necroplasmic energy or celestial pacts. While highly durable and capable of reality manipulation, they are inherently susceptible to holy or angelic armaments.' },
    { name: 'The Slayer Archetype', threat: 'Apex / Extinction', desc: 'Relentless supernatural hunters driven by pure rage. Rather than traditional magic, they often utilize specialized praetor-class armor and siphon absolute power directly from the demonic entities they execute.' },
    { name: 'Vampire (Nosferatu / Alpha)', threat: 'Severe', desc: 'Predatory undead entities. High-tier variants possess the ability to consume souls to create familiars and exhibit extreme bodily regeneration. They are typically only permanently halted by complete decapitation, holy artifacts, or sunlight.' },
    { name: 'Occult Detective / Hedge Mage', threat: 'Variable (Tactical)', desc: 'Mortal practitioners of the dark arts. They rely heavily on sigil magic, exorcism rituals, demonic pacts, and pure trickery to outsmart higher-tier entities that vastly outclass them in raw physical power.' }
  ];

  const toggleExpand = (name) => {
    setExpandedItem(expandedItem === name ? null : name);
  };

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #222', padding: '15px', marginBottom: '15px' };
  const tarotTabStyle = (tabName) => ({
    flex: '0 0 auto', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85em', fontWeight: 'bold', border: '1px solid #a855f7',
    background: activeTarotTab === tabName ? '#a855f7' : 'transparent', color: activeTarotTab === tabName ? '#fff' : '#a855f7'
  });

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#3b82f6', fontSize: '1.2em' }}>Learning Center</h2>
      </header>

      {/* TOP NAV: Main Categories */}
      <div style={{ display: 'flex', gap: '10px', padding: '15px 15px 0 15px', overflowX: 'auto' }}>
        <button 
          onClick={() => setActiveCategory('supernatural')} 
          style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeCategory === 'supernatural' ? '#a855f7' : '#222', color: activeCategory === 'supernatural' ? '#fff' : '#888' }}
        >
          🔮 Supernatural
        </button>
        <button style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: '1px dashed #333', fontWeight: 'bold', background: 'transparent', color: '#555' }}>
          + Add Category
        </button>
      </div>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        {activeCategory === 'supernatural' && (
          <>
            {/* SUB-NAV: Supernatural Topics */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <button 
                onClick={() => setActiveSubTab('tarot')} 
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: activeSubTab === 'tarot' ? '1px solid #a855f7' : '1px solid #333', background: activeSubTab === 'tarot' ? 'rgba(168, 85, 247, 0.1)' : 'transparent', color: activeSubTab === 'tarot' ? '#a855f7' : '#888', fontWeight: 'bold' }}
              >
                Tarot Arcana
              </button>
              <button 
                onClick={() => setActiveSubTab('creatures')} 
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: activeSubTab === 'creatures' ? '1px solid #ef4444' : '1px solid #333', background: activeSubTab === 'creatures' ? 'rgba(239, 68, 68, 0.1)' : 'transparent', color: activeSubTab === 'creatures' ? '#ef4444' : '#888', fontWeight: 'bold' }}
              >
                Creatures & Entities
              </button>
            </div>
            {/* CONTENT: TAROT */}
            {activeSubTab === 'tarot' && (
              <div style={{ borderTop: '1px solid #222', paddingTop: '15px' }}>
                
                {/* TERTIARY NAV: Tarot Deep Dive */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
                  <button onClick={() => setActiveTarotTab('basics')} style={tarotTabStyle('basics')}>Basics</button>
                  <button onClick={() => setActiveTarotTab('fundamentals')} style={tarotTabStyle('fundamentals')}>Fundamentals</button>
                  <button onClick={() => setActiveTarotTab('reading')} style={tarotTabStyle('reading')}>Reading</button>
                  <button onClick={() => setActiveTarotTab('interpretations')} style={tarotTabStyle('interpretations')}>Interpretations</button>
                  <button onClick={() => setActiveTarotTab('plants')} style={tarotTabStyle('plants')}>Plants & Herbs</button>
                  <button onClick={() => setActiveTarotTab('numbers')} style={tarotTabStyle('numbers')}>Numerology</button>
                </div>

                {activeTarotTab === 'basics' && (
                  <div style={cardStyle}>
                    <h3 style={{ color: '#a855f7', marginTop: 0 }}>The Basics</h3>
                    <p style={{ color: '#ccc', lineHeight: '1.5', fontSize: '0.95em' }}>A standard tarot deck consists of 78 cards, split into two main sections: The Major Arcana (22 cards representing significant life events and spiritual lessons) and the Minor Arcana (56 cards reflecting day-to-day trials and tribulations).</p>
                  </div>
                )}

                {activeTarotTab === 'fundamentals' && (
                  <div style={cardStyle}>
                    <h3 style={{ color: '#a855f7', marginTop: 0 }}>Fundamentals of the Suits</h3>
                    <p style={{ color: '#ccc', lineHeight: '1.5', fontSize: '0.95em' }}>The Minor Arcana is divided into four suits, each corresponding to an element: Wands (Fire/Action), Cups (Water/Emotion), Swords (Air/Intellect), and Pentacles (Earth/Material).</p>
                  </div>
                )}

                {activeTarotTab === 'reading' && (
                  <div style={cardStyle}>
                    <h3 style={{ color: '#a855f7', marginTop: 0 }}>Reading & Spreads</h3>
                    <p style={{ color: '#ccc', lineHeight: '1.5', fontSize: '0.95em' }}>Before drawing, a reader must center their intent. Popular introductory layouts include the 3-card spread (Past, Present, Future) and the more complex 10-card Celtic Cross.</p>
                  </div>
                )}

                {activeTarotTab === 'plants' && (
                  <div style={cardStyle}>
                    <h3 style={{ color: '#a855f7', marginTop: 0 }}>Botanical Correspondences</h3>
                    <p style={{ color: '#ccc', lineHeight: '1.5', fontSize: '0.95em' }}>Incorporating flora into your practice can heavily amplify a reading. For example, coating reading candles or anointing pulse points with natural plant oils like coconut oil or palm seed oil can help ground the reader's energy and clear the physical space before drawing any cards.</p>
                  </div>
                )}

                {activeTarotTab === 'numbers' && (
                  <div style={cardStyle}>
                    <h3 style={{ color: '#a855f7', marginTop: 0 }}>Numerology in Tarot</h3>
                    <p style={{ color: '#ccc', lineHeight: '1.5', fontSize: '0.95em' }}>Numbers carry inherent frequencies. Aces represent raw potential and new beginnings, Threes signify growth and collaboration, while Tens denote completion or the absolute end of a cycle.</p>
                  </div>
                )}
                {activeTarotTab === 'interpretations' && (
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
              </div>
            )}

            {/* CONTENT: CREATURES */}
            {activeSubTab === 'creatures' && (
              <div style={{ borderTop: '1px solid #222', paddingTop: '15px' }}>
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
