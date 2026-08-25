import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LearningHub() {
  const navigate = useNavigate();

  // Navigation State
  const [activeSubTab, setActiveSubTab] = useState('wicca');
  const [activeTarotTab, setActiveTarotTab] = useState('basics');
  const [activeWiccaTab, setActiveWiccaTab] = useState('lunar');
  const [activeEntityTab, setActiveEntityTab] = useState('goddesses');
  const [expandedItem, setExpandedItem] = useState(null);

  // --- DATABASES ---
  const tarotDeck = [
    { name: '0 - The Fool', keywords: 'New beginnings, spontaneity, blind faith', desc: 'Represents a leap into the unknown. A reminder to embrace chaos and trust the journey without knowing the destination.' },
    { name: 'I - The Magician', keywords: 'Willpower, manifestation, resourcefulness', desc: 'You have the tools and the power to manipulate your reality. Action and concentration are required to bridge the spiritual and physical.' },
    { name: 'XIII - Death', keywords: 'Transformation, endings, transition', desc: 'Rarely means physical death. It signifies the absolute end of a cycle, forcing a clearing of the old to make way for the new.' },
    { name: 'XV - The Devil', keywords: 'Bondage, materialism, shadow self', desc: 'Being trapped by toxic habits, earthly desires, or making deals that bind your soul. Breaking these chains requires confronting your own darkness.' },
    { name: 'XVI - The Tower', keywords: 'Sudden upheaval, revelation, disaster', desc: 'The violent destruction of false paradigms. A sudden, inescapable change that tears down weak foundations so truth can be rebuilt.' }
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
    { name: 'Yule', date: 'Dec 21st or 22nd', type: 'Lesser Sabbat / Solar Festival', desc: 'Winter Solstice. Shortest day of the year. Celebrated as the rebirth of the sun - The light of the world. Celebrations include: burning the yule log, collecting mistletoe from oak trees & decorating the home with holly.' },
    { name: 'Imbolc', date: 'Feb 2nd', type: 'Greater Sabbat / Fire Festival', desc: 'Marks the successful completion of winter. Now is the time to prepare for the new. Traditions center around clearing your home of old junk that may have gathered over the past year. A besom is traditionally used to sweep stale and negative energy right out the front door. Time to let go of the past & allow space for future growth.' },
    { name: 'Ostara', date: 'March 21st or 22nd', type: 'Lesser Sabbat / Solar Festival', desc: 'Spring Equinox. Equinoxes are about equilibrium; days & nights are of equal length. Balance of energy being equally masculine and feminine. Incorporates fertility symbols such as eggs & hares. Eggs are a universal symbol of fertility & life.' },
    { name: 'Beltane', date: 'May 1st', type: 'Greater Sabbat / Fire Festival', desc: '(Also May Day). Final fertility festival of spring, marks the arrival of summer at the beginning of May. The veil between here & there is the thinnest. Represents the transitional moments between life and death. When Faerie folk awaken from their winter slumber. Celebrations include: maypole rituals, bonfires & feasting.' },
    { name: 'Litha', date: 'June 21st or 22nd', type: 'Lesser Sabbat / Solar Festival', desc: 'Summer Solstice / Midsummer. Celebration of the longest day of the year and the peak of the sun\'s power.' },
    { name: 'Lammas / Lughnasa', date: 'Aug 2nd', type: 'Greater Sabbat / Fire Festival', desc: 'Festival of the first harvest. A time of reaping what has been sown.' },
    { name: 'Mabon', date: 'Sept 21st or 22nd', type: 'Lesser Sabbat / Solar Festival', desc: 'Autumn Equinox. The second harvest and the balance of light and dark before winter.' }
  ];

  const lunarDB = [
    { name: 'The Triple Goddess', type: 'Archetypes', desc: 'The Maiden (New/Waxing Moon): Wild, free, developing like a budding rose. The Mother (Full Moon): Full of potent creative power and solid stability. The Crone (Waning/Dark Moon): Wise and experienced.' },
    { name: 'Esbats', type: 'Lunar Magick', desc: 'Gatherings to perform rites and magickal works utilizing the phases of the moon. Each phase has corresponding energy that aids in specific spell work. The 13th full moon in a solar year is referred to as a Blue Moon.' },
    { name: 'Dark Moon', type: 'Death / Shadow', desc: 'The time between the end of the Waning moon and the beginning of the Waxing period. Represents the death of the crone. Exceptionally potent for Shadow Work (processing traits we find displeasing). Most conductive time for urgent, forceful banishing.' },
    { name: 'New Moon', type: 'Rebirth', desc: 'Marks the end of the dark moon; the Goddess is reborn as a maiden. Prime workings: blessing new projects, setting intentions to reinvent yourself, scouting new ideas, starting fresh paradigms, or changes in alignment with renewal.' },
    { name: 'Waxing Moon (First Quarter)', type: 'Solar Spring', desc: 'Goddess in maiden form. Spells for any type of gain or increase correspond with this energy. Examples: financial abundance, making lasting friendships. Promotes anything you want to create, grow, or bring into your life.' },
    { name: 'Full Moon', type: 'Potent Power', desc: 'Most potent time to do any magickal work. Goddess is in her Mother aspect. Invoking, protecting, or healing all correspond to the energies of this powerful phase.' },
    { name: 'Waning Moon (Last Quarter)', type: 'Solar Autumn', desc: 'About diminishing and clearing things out. Goddess is in her Crone phase. Workings to gradually and organically banish are optimal here.' }
  ];

  const goddessesDB = [
    { name: 'Hathor', origin: 'Egyptian', desc: 'Helps you to your inner light, shows you how truly beautiful you are.' },
    { name: 'Lilith', origin: 'Mesopotamian / Abrahamic', desc: 'Adam\'s first wife. Helps you discover your dark and wild side.' },
    { name: 'Oya', origin: 'Yoruba / Orisha', desc: 'Helps you welcome the winds of change.' },
    { name: 'Mary (Mother of Jesus)', origin: 'Christian', desc: 'Not a goddess, however has all the powers of a divine female. She helps you connect to your healing power.' },
    { name: 'Sophia / Athena', origin: 'Greek / Gnostic', desc: 'Goddess of wisdom. Helps you tap into & trust your own intuition.' },
    { name: 'Kuan Yin', origin: 'Chinese / Buddhist', desc: 'Goddess of healing. Helps you find compassion for yourself & others.' },
    { name: 'Green Tara', origin: 'Buddhist', desc: 'Goddess of protection. Helps you feel safe & shows you how to stay calm in a crisis.' },
    { name: 'White Buffalo Calf Woman', origin: 'Native American', desc: 'Spiritual woman. Helps you connect with the true nature of the soul and create a more peaceful life and world.' },
    { name: 'Venus / Aphrodite', origin: 'Roman / Greek', desc: 'Goddess of love and beauty. Shows you that self-love and appreciation is the first step to embracing your own divinity and empowering your sense of self-worth.' },
    { name: 'Pele', origin: 'Hawaiian', desc: 'Fire goddess. Shows you how to channel and express anger and heal hostility in a healthy way.' },
    { name: 'Butterfly Maiden', origin: 'Native American', desc: 'Spirit woman. Takes you from cocoon to butterfly and helps you transform your life.' },
    { name: 'Durga', origin: 'Hindu', desc: 'Mother goddess of protection & war. Helps you draw your boundaries and protect yourself from negative energies.' },
    { name: 'Kali', origin: 'Hindu', desc: 'Goddess of death, time, and doomsday. Symbol of mother nature. Female form of Shiva. Colors: purple & red. Perform Puja.' },
    { name: 'Hecate', origin: 'Greek', desc: 'Goddess of magic, witchcraft, the night, and the moon. Associated with crossroads, torches, and dogs. The ultimate guide through the dark.' },
    { name: 'The Morrigan', origin: 'Celtic', desc: 'The Phantom Queen. Goddess of war, fate, and sovereignty, often appearing as a crow.' },
    { name: 'Freyja', origin: 'Norse', desc: 'Goddess of love, beauty, fertility, and Seiðr (magic). Drives a chariot pulled by cats.' }
  ];

  const creaturesDB = [
    { name: 'Hellspawn / High Demons', threat: 'Extreme', desc: 'Entities originating from infernal realms. They frequently utilize necroplasmic energy or celestial pacts. While highly durable and capable of reality manipulation, they are inherently susceptible to holy or angelic armaments.' },
    { name: 'The Slayer Archetype', threat: 'Apex / Extinction', desc: 'Relentless supernatural hunters driven by pure rage. Rather than traditional magic, they often utilize specialized praetor-class armor and siphon absolute power directly from the demonic entities they execute.' },
    { name: 'Vampire (Nosferatu / Alpha)', threat: 'Severe', desc: 'Predatory undead entities. High-tier variants possess the ability to consume souls to create familiars and exhibit extreme bodily regeneration. They are typically only permanently halted by complete decapitation, holy artifacts, or sunlight.' },
    { name: 'Occult Detective / Hedge Mage', threat: 'Variable (Tactical)', desc: 'Mortal practitioners of the dark arts. They rely heavily on sigil magic, exorcism rituals, demonic pacts, and pure trickery to outsmart higher-tier entities that vastly outclass them in raw physical power.' }
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

      <div style={{ display: 'flex', gap: '10px', padding: '15px 15px 0 15px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <button style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: '#a855f7', color: '#fff' }}>
          🔮 Supernatural
        </button>
        <button style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: '1px dashed #333', fontWeight: 'bold', background: 'transparent', color: '#555' }}>+ Add Hub</button>
      </div>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', overflowX: 'auto' }}>
          <button onClick={() => setActiveSubTab('tarot')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: activeSubTab === 'tarot' ? '1px solid #a855f7' : '1px solid #333', background: activeSubTab === 'tarot' ? 'rgba(168, 85, 247, 0.1)' : 'transparent', color: activeSubTab === 'tarot' ? '#a855f7' : '#888', fontWeight: 'bold' }}>Tarot</button>
          <button onClick={() => setActiveSubTab('wicca')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: activeSubTab === 'wicca' ? '1px solid #10b981' : '1px solid #333', background: activeSubTab === 'wicca' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: activeSubTab === 'wicca' ? '#10b981' : '#888', fontWeight: 'bold' }}>Wicca</button>
          <button onClick={() => setActiveSubTab('paganism')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: activeSubTab === 'paganism' ? '1px solid #f59e0b' : '1px solid #333', background: activeSubTab === 'paganism' ? 'rgba(245, 158, 11, 0.1)' : 'transparent', color: activeSubTab === 'paganism' ? '#f59e0b' : '#888', fontWeight: 'bold' }}>Paganism</button>
          <button onClick={() => setActiveSubTab('entities')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: activeSubTab === 'entities' ? '1px solid #ef4444' : '1px solid #333', background: activeSubTab === 'entities' ? 'rgba(239, 68, 68, 0.1)' : 'transparent', color: activeSubTab === 'entities' ? '#ef4444' : '#888', fontWeight: 'bold' }}>Entities & Lore</button>
        </div>

        {activeSubTab === 'tarot' && (
          <div style={{ borderTop: '1px solid #222', paddingTop: '15px' }}>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
              <button onClick={() => setActiveTarotTab('basics')} style={tertTabStyle('basics', activeTarotTab, '#a855f7')}>Basics</button>
              <button onClick={() => setActiveTarotTab('interpretations')} style={tertTabStyle('interpretations', activeTarotTab, '#a855f7')}>Interpretations</button>
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

        {activeSubTab === 'wicca' && (
          <div style={{ borderTop: '1px solid #222', paddingTop: '15px' }}>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
              <button onClick={() => setActiveWiccaTab('lunar')} style={tertTabStyle('lunar', activeWiccaTab, '#10b981')}>Lunar Cycles & Esbats</button>
              <button onClick={() => setActiveWiccaTab('elements')} style={tertTabStyle('elements', activeWiccaTab, '#10b981')}>The 5 Elements</button>
              <button onClick={() => setActiveWiccaTab('rede')} style={tertTabStyle('rede', activeWiccaTab, '#10b981')}>Wiccan Rede</button>
              <button onClick={() => setActiveWiccaTab('sabbats')} style={tertTabStyle('sabbats', activeWiccaTab, '#10b981')}>The Sabbats</button>
            </div>

            {activeWiccaTab === 'lunar' && lunarDB.map((moon, idx) => (
              <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                <div onClick={() => toggleExpand(moon.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{moon.name}</h4>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>{expandedItem === moon.name ? '−' : '+'}</span>
                </div>
                {expandedItem === moon.name && (
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}>
                    <div style={{ color: '#00ffff', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Energy / Archetype</div>
                    <div style={{ color: '#aaa', fontStyle: 'italic', marginBottom: '15px' }}>{moon.type}</div>
                    <div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em' }}>{moon.desc}</div>
                  </div>
                )}
              </div>
            ))}

            {activeWiccaTab === 'sabbats' && sabbatsDB.map((sab, idx) => (
              <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                <div onClick={() => toggleExpand(sab.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{sab.name} <span style={{ color: '#888', fontSize: '0.8em', fontWeight: 'normal' }}>({sab.date})</span></h4>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>{expandedItem === sab.name ? '−' : '+'}</span>
                </div>
                {expandedItem === sab.name && (
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}>
                    <div style={{ display: 'inline-block', background: '#222', color: sab.type.includes('Fire') ? '#ef4444' : '#3b82f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold', marginBottom: '15px' }}>{sab.type}</div>
                    <div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em' }}>{sab.desc}</div>
                  </div>
                )}
              </div>
            ))}

            {activeWiccaTab === 'elements' && elementsDB.map((el, idx) => (
              <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                <div onClick={() => toggleExpand(el.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{el.name}</h4>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>{expandedItem === el.name ? '−' : '+'}</span>
                </div>
                {expandedItem === el.name && (
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}>
                    <div style={{ color: '#aaa', fontStyle: 'italic', marginBottom: '15px' }}>Color: {el.color} | Direction: {el.direction}<br/>Properties: {el.props}</div>
                    <div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em' }}>{el.desc}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'paganism' && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
            <span style={{ fontSize: '3em', display: 'block', marginBottom: '15px' }}>🌿</span>
            <h3 style={{ color: '#f59e0b', margin: '0 0 10px 0' }}>Paganism Database</h3>
            <p>This category is primed and waiting for future module expansion.</p>
          </div>
        )}

        {activeSubTab === 'entities' && (
          <div style={{ borderTop: '1px solid #222', paddingTop: '15px' }}>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
              <button onClick={() => setActiveEntityTab('goddesses')} style={tertTabStyle('goddesses', activeEntityTab, '#ef4444')}>Goddesses & Deities</button>
              <button onClick={() => setActiveEntityTab('creatures')} style={tertTabStyle('creatures', activeEntityTab, '#ef4444')}>Threat Index</button>
            </div>

            {activeEntityTab === 'goddesses' && goddessesDB.map((god, idx) => (
              <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                <div onClick={() => toggleExpand(god.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{god.name}</h4>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{expandedItem === god.name ? '−' : '+'}</span>
                </div>
                {expandedItem === god.name && (
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}>
                    <div style={{ display: 'inline-block', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold', marginBottom: '15px' }}>Origin: {god.origin}</div>
                    <div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em' }}>{god.desc}</div>
                  </div>
                )}
              </div>
            ))}

            {activeEntityTab === 'creatures' && creaturesDB.map((creature, idx) => (
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

      </div>
    </div>
  );
}
