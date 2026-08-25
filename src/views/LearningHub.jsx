import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LearningHub() {
  const navigate = useNavigate();

  // Navigation State
  const [activeCategory, setActiveCategory] = useState('supernatural');
  const [activeSubTab, setActiveSubTab] = useState('tarot');
  const [activeTarotTab, setActiveTarotTab] = useState('basics');
  const [activeWiccaTab, setActiveWiccaTab] = useState('elements');
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

  const elementsDB = [
    { name: 'Earth', color: 'Green or Brown', direction: 'North', props: 'Grounding, nurturing, supportive, stable, feminine & receptive', desc: 'Represents the very base of existence; it is the foundation. It is the element of unshakeable physicality. All that is solid, 3D.' },
    { name: 'Air', color: 'Yellow', direction: 'East', props: 'Transport, movement, communication, sound, intellect, travel', desc: 'Represents movement & the breath of life. Masculine & projective.' },
    { name: 'Water', color: 'Blue', direction: 'West', props: 'Cleansing, healing, purifying, feminine & receptive', desc: 'Corresponds to emotions.' },
    { name: 'Fire', color: 'Red', direction: 'South', props: 'Transformative, destructive, purifying, passionate, consuming, masculine, projective', desc: 'Represents swift transformation.' },
    { name: 'Spirit (Aether)', color: 'Black', direction: 'All', props: 'Raw potentiality, being and un-being, feminine & masculine, receptive, projective', desc: 'It is the prime divine essence. It is the Akasha, the Two, the All and the nothingness. Quintessence. It is the space in which all exists & it is what binds all matter.' }
  ];

  const sabbatsDB = [
    { name: 'Samhain', date: 'Oct 31st', type: 'Greater Sabbat / Fire Festival', desc: '(Pronounced Sowin). Marks the pagan New Year, Halloween or All Hallows Eve. Was the final harvest for our ancestors & was the inauguration of winter. The most potent night of the year for all forms of divination & intense self-reflection.' },
    { name: 'Yule', date: 'Dec 21st or 22nd', type: 'Lesser Sabbat / Solar Festival (Winter Solstice)', desc: 'Shortest day of the year. Celebrated as the rebirth of the sun - The light of the world. Celebrations include: burning the yule log, collecting mistletoe from oak trees & decorating the home with holly.' },
    { name: 'Imbolc', date: 'Feb 2nd', type: 'Greater Sabbat / Fire Festival', desc: 'Marks the successful completion of winter. Now is the time to prepare for the new. Traditions center around clearing your home of old junk that may have gathered over the past year (a good spring cleaning). A besom is traditionally used to sweep stale and negative energy right out the front door. Time to let go of the past & allow space for future growth.' },
    { name: 'Ostara', date: 'March 21st or 22nd', type: 'Lesser Sabbat / Solar Festival (Spring Equinox)', desc: 'Equinoxes are about equilibrium; days & nights are of equal length. Balance of energy being equally masculine and feminine. Incorporates fertility symbols such as eggs & hares. Eggs are a universal symbol of fertility & life.' },
    { name: 'Beltane', date: 'May 1st', type: 'Greater Sabbat / Fire Festival', desc: '(Also May Day). Final fertility festival of spring, marks the arrival of summer at the beginning of May. The veil between here & there is the thinnest. Represents the transitional moments between life and death. When Faerie folk awaken from their winter slumber. Celebrations include: maypole rituals, bonfires & feasting, may baskets, drums, and fairy pot offerings.' },
    { name: 'Litha', date: 'June 21st or 22nd', type: 'Lesser Sabbat / Solar Festival (Summer Solstice / Midsummer)', desc: 'Celebration of the longest day of the year.' },
    { name: 'Lammas / Lughnasa', date: 'Aug 2nd', type: 'Greater Sabbat / Fire Festival', desc: 'Festival of the first harvest.' },
    { name: 'Mabon', date: 'Sept 21st or 22nd', type: 'Lesser Sabbat / Solar Festival (Autumn Equinox)', desc: 'The second harvest and balance of the autumn equinox.' }
  ];

  const toggleExpand = (name) => setExpandedItem(expandedItem === name ? null : name);

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #222', padding: '15px', marginBottom: '15px' };
  const tertTabStyle = (tabName, activeName, color) => ({
    flex: '0 0 auto', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85em', fontWeight: 'bold', border: `1px solid ${color}`,
    background: activeName === tabName ? color : 'transparent', color: activeName === tabName ? '#fff' : color
  });

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#3b82f6', fontSize: '1.2em' }}>Learning Center</h2>
      </header>

      <div style={{ display: 'flex', gap: '10px', padding: '15px 15px 0 15px', overflowX: 'auto' }}>
        <button onClick={() => setActiveCategory('supernatural')} style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeCategory === 'supernatural' ? '#a855f7' : '#222', color: activeCategory === 'supernatural' ? '#fff' : '#888' }}>
          🔮 Supernatural
        </button>
        <button style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: '1px dashed #333', fontWeight: 'bold', background: 'transparent', color: '#555' }}>+ Add Category</button>
      </div>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        {activeCategory === 'supernatural' && (
          <>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', overflowX: 'auto' }}>
              <button onClick={() => setActiveSubTab('tarot')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: activeSubTab === 'tarot' ? '1px solid #a855f7' : '1px solid #333', background: activeSubTab === 'tarot' ? 'rgba(168, 85, 247, 0.1)' : 'transparent', color: activeSubTab === 'tarot' ? '#a855f7' : '#888', fontWeight: 'bold' }}>Tarot</button>
              <button onClick={() => setActiveSubTab('wicca')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: activeSubTab === 'wicca' ? '1px solid #10b981' : '1px solid #333', background: activeSubTab === 'wicca' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: activeSubTab === 'wicca' ? '#10b981' : '#888', fontWeight: 'bold' }}>Wicca & Paganism</button>
              <button onClick={() => setActiveSubTab('creatures')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: activeSubTab === 'creatures' ? '1px solid #ef4444' : '1px solid #333', background: activeSubTab === 'creatures' ? 'rgba(239, 68, 68, 0.1)' : 'transparent', color: activeSubTab === 'creatures' ? '#ef4444' : '#888', fontWeight: 'bold' }}>Creatures</button>
            </div>

            {activeSubTab === 'tarot' && (
              <div style={{ borderTop: '1px solid #222', paddingTop: '15px' }}>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
                  <button onClick={() => setActiveTarotTab('basics')} style={tertTabStyle('basics', activeTarotTab, '#a855f7')}>Basics</button>
                  <button onClick={() => setActiveTarotTab('fundamentals')} style={tertTabStyle('fundamentals', activeTarotTab, '#a855f7')}>Fundamentals</button>
                  <button onClick={() => setActiveTarotTab('reading')} style={tertTabStyle('reading', activeTarotTab, '#a855f7')}>Reading</button>
                  <button onClick={() => setActiveTarotTab('interpretations')} style={tertTabStyle('interpretations', activeTarotTab, '#a855f7')}>Interpretations</button>
                  <button onClick={() => setActiveTarotTab('plants')} style={tertTabStyle('plants', activeTarotTab, '#a855f7')}>Plants & Herbs</button>
                  <button onClick={() => setActiveTarotTab('numbers')} style={tertTabStyle('numbers', activeTarotTab, '#a855f7')}>Numerology</button>
                </div>
                {activeTarotTab === 'interpretations' ? (
                  tarotDeck.map((card, idx) => (
                    <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
                      <div onClick={() => toggleExpand(card.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
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
                  ))
                ) : (
                  <div style={cardStyle}><h3 style={{ color: '#a855f7', marginTop: 0 }}>Section Template</h3><p style={{ color: '#ccc' }}>Ready for additional notes...</p></div>
                )}
              </div>
            )}

            {activeSubTab === 'creatures' && (
              <div style={{ borderTop: '1px solid #222', paddingTop: '15px' }}>
                {creaturesDB.map((creature, idx) => (
                  <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                    <div onClick={() => toggleExpand(creature.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                      <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{creature.name}</h4>
                      <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{expandedItem === creature.name ? '−' : '+'}</span>
                    </div>
                    {expandedItem === creature.name && (
                      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}><span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold' }}>Threat: {creature.threat}</span></div>
                        <div style={{ color: '#00ffff', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Field Notes</div>
                        <div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em' }}>{creature.desc}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {activeSubTab === 'wicca' && (
              <div style={{ borderTop: '1px solid #222', paddingTop: '15px' }}>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
                  <button onClick={() => setActiveWiccaTab('elements')} style={tertTabStyle('elements', activeWiccaTab, '#10b981')}>The 5 Elements</button>
                  <button onClick={() => setActiveWiccaTab('rede')} style={tertTabStyle('rede', activeWiccaTab, '#10b981')}>Wiccan Rede</button>
                  <button onClick={() => setActiveWiccaTab('sabbats')} style={tertTabStyle('sabbats', activeWiccaTab, '#10b981')}>The Sabbats</button>
                </div>

                {activeWiccaTab === 'elements' && elementsDB.map((el, idx) => (
                  <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                    <div onClick={() => toggleExpand(el.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                      <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{el.name}</h4>
                      <span style={{ color: '#10b981', fontWeight: 'bold' }}>{expandedItem === el.name ? '−' : '+'}</span>
                    </div>
                    {expandedItem === el.name && (
                      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}>
                        <div style={{ color: '#00ffff', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Attributes</div>
                        <div style={{ color: '#aaa', fontStyle: 'italic', marginBottom: '15px' }}>Color: {el.color} | Direction: {el.direction}<br/>Properties: {el.props}</div>
                        <div style={{ color: '#00ffff', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Representation</div>
                        <div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em' }}>{el.desc}</div>
                      </div>
                    )}
                  </div>
                ))}

                {activeWiccaTab === 'rede' && (
                  <div style={{ ...cardStyle, borderLeft: '4px solid #10b981', textAlign: 'center', padding: '25px 15px' }}>
                    <div style={{ fontStyle: 'italic', lineHeight: '1.8', fontSize: '1.05em', color: '#ccc' }}>
                      "Bide the Wiccan law ye must,<br/>
                      In perfect love and perfect trust.<br/>
                      Eight words the Wiccan Rede fulfill:<br/>
                      And it harm none, do what ye will.<br/>
                      What ye send forth comes back to thee,<br/>
                      So ever mind the Law of Three.<br/>
                      Follow this with mind and heart,<br/>
                      Merry ye meet, and merry ye part."
                    </div>
                    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed #333', color: '#10b981', fontWeight: 'bold', fontSize: '1.1em' }}>
                      Every action has a reaction.<br/>Everything comes full circle.
                    </div>
                  </div>
                )}

                {activeWiccaTab === 'sabbats' && (
                  <>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '15px', borderRadius: '8px', color: '#10b981', marginBottom: '15px', fontSize: '0.9em', textAlign: 'center' }}>
                      <strong>Note:</strong> No magickal workings are done during sabbats. Sabbats are for festivity and honoring the season.
                    </div>
                    {sabbatsDB.map((sab, idx) => (
                      <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                        <div onClick={() => toggleExpand(sab.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                          <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{sab.name} <span style={{ color: '#888', fontSize: '0.8em', fontWeight: 'normal' }}>({sab.date})</span></h4>
                          <span style={{ color: '#10b981', fontWeight: 'bold' }}>{expandedItem === sab.name ? '−' : '+'}</span>
                        </div>
                        {expandedItem === sab.name && (
                          <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}>
                            <div style={{ display: 'inline-block', background: '#222', color: '#10b981', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold', marginBottom: '15px' }}>{sab.type}</div>
                            <div style={{ color: '#00ffff', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Traditions & Lore</div>
                            <div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em' }}>{sab.desc}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
}
