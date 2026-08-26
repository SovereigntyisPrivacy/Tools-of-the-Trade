import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LearningHub() {
  const navigate = useNavigate();

  // Navigation State - Defaulted to 'starthere' as requested
  const [activeCategory, setActiveCategory] = useState('starthere');
  const [activeSubTab, setActiveSubTab] = useState('wicca');
  const [activeTarotTab, setActiveTarotTab] = useState('basics');
  const [activeWiccaTab, setActiveWiccaTab] = useState('lunar');
  const [activeEntityTab, setActiveEntityTab] = useState('goddesses');
  
  // Anime & School State
  const [activeLetter, setActiveLetter] = useState('A');
  const [activeGrade, setActiveGrade] = useState('K');
  const [expandedItem, setExpandedItem] = useState(null);

  const alphabet = ['All', ...Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i))];
  const gradesList = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', 'College'];

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
    { name: 'Samhain', date: 'Oct 31st', type: 'Greater Sabbat / Fire Festival', desc: '(Pronounced Sowin). Marks the pagan New Year, Halloween or All Hallows Eve. Was the final harvest for our ancestors & was the inauguration of winter.' },
    { name: 'Yule', date: 'Dec 21st or 22nd', type: 'Lesser Sabbat / Solar Festival', desc: 'Winter Solstice. Shortest day of the year. Celebrated as the rebirth of the sun - The light of the world.' },
    { name: 'Imbolc', date: 'Feb 2nd', type: 'Greater Sabbat / Fire Festival', desc: 'Marks the successful completion of winter. Now is the time to prepare for the new.' },
    { name: 'Ostara', date: 'March 21st or 22nd', type: 'Lesser Sabbat / Solar Festival', desc: 'Spring Equinox. Equinoxes are about equilibrium; days & nights are of equal length.' },
    { name: 'Beltane', date: 'May 1st', type: 'Greater Sabbat / Fire Festival', desc: '(Also May Day). Final fertility festival of spring, marks the arrival of summer at the beginning of May.' },
    { name: 'Litha', date: 'June 21st or 22nd', type: 'Lesser Sabbat / Solar Festival', desc: 'Summer Solstice / Midsummer. Celebration of the longest day of the year and the peak of the sun\'s power.' },
    { name: 'Lammas / Lughnasa', date: 'Aug 2nd', type: 'Greater Sabbat / Fire Festival', desc: 'Festival of the first harvest. A time of reaping what has been sown.' },
    { name: 'Mabon', date: 'Sept 21st or 22nd', type: 'Lesser Sabbat / Solar Festival', desc: 'Autumn Equinox. The second harvest and the balance of light and dark before winter.' }
  ];

  const lunarDB = [
    { name: 'The Triple Goddess', type: 'Archetypes', desc: 'The Maiden (New/Waxing Moon): Wild, free, developing like a budding rose. The Mother (Full Moon): Full of potent creative power and solid stability. The Crone (Waning/Dark Moon): Wise and experienced.' },
    { name: 'Esbats', type: 'Lunar Magick', desc: 'Gatherings to perform rites and magickal works utilizing the phases of the moon.' },
    { name: 'Dark Moon', type: 'Death / Shadow', desc: 'Exceptionally potent for Shadow Work. Most conductive time for urgent, forceful banishing.' },
    { name: 'New Moon', type: 'Rebirth', desc: 'Prime workings: blessing new projects, setting intentions to reinvent yourself, scouting new ideas.' },
    { name: 'Waxing Moon', type: 'Solar Spring', desc: 'Spells for any type of gain or increase correspond with this energy.' },
    { name: 'Full Moon', type: 'Potent Power', desc: 'Most potent time to do any magickal work. Invoking, protecting, or healing.' },
    { name: 'Waning Moon', type: 'Solar Autumn', desc: 'About diminishing and clearing things out. Workings to gradually and organically banish are optimal here.' }
  ];

  const goddessesDB = [
    { name: 'Hathor', origin: 'Egyptian', desc: 'Helps you to your inner light, shows you how truly beautiful you are.' },
    { name: 'Lilith', origin: 'Mesopotamian / Abrahamic', desc: 'Adam\'s first wife. Helps you discover your dark and wild side.' },
    { name: 'Oya', origin: 'Yoruba / Orisha', desc: 'Helps you welcome the winds of change.' },
    { name: 'Mary (Mother of Jesus)', origin: 'Christian', desc: 'Not a goddess, however has all the powers of a divine female. She helps you connect to your healing power.' },
    { name: 'Sophia / Athena', origin: 'Greek / Gnostic', desc: 'Goddess of wisdom. Helps you tap into & trust your own intuition.' },
    { name: 'Kuan Yin', origin: 'Chinese / Buddhist', desc: 'Goddess of healing. Helps you find compassion for yourself & others.' },
    { name: 'Green Tara', origin: 'Buddhist', desc: 'Goddess of protection. Helps you feel safe & shows you how to stay calm in a crisis.' },
    { name: 'White Buffalo Calf Woman', origin: 'Native American', desc: 'Spiritual woman. Helps you connect with the true nature of the soul.' },
    { name: 'Venus / Aphrodite', origin: 'Roman / Greek', desc: 'Goddess of love and beauty. Shows you that self-love and appreciation is the first step to embracing your own divinity.' },
    { name: 'Pele', origin: 'Hawaiian', desc: 'Fire goddess. Shows you how to channel and express anger and heal hostility in a healthy way.' },
    { name: 'Butterfly Maiden', origin: 'Native American', desc: 'Spirit woman. Takes you from cocoon to butterfly and helps you transform your life.' },
    { name: 'Durga', origin: 'Hindu', desc: 'Mother goddess of protection & war. Helps you draw your boundaries and protect yourself.' },
    { name: 'Kali', origin: 'Hindu', desc: 'Goddess of death, time, and doomsday. Symbol of mother nature. Colors: purple & red. Perform Puja.' },
    { name: 'Hecate', origin: 'Greek', desc: 'Goddess of magic, witchcraft, the night, and the moon. The ultimate guide through the dark.' },
    { name: 'The Morrigan', origin: 'Celtic', desc: 'The Phantom Queen. Goddess of war, fate, and sovereignty, often appearing as a crow.' },
    { name: 'Freyja', origin: 'Norse', desc: 'Goddess of love, beauty, fertility, and Seiðr (magic). Drives a chariot pulled by cats.' }
  ];

  const creaturesDB = [
    { name: 'Hellspawn / High Demons', threat: 'Extreme', desc: 'Entities originating from infernal realms. They frequently utilize necroplasmic energy or celestial pacts.' },
    { name: 'The Slayer Archetype', threat: 'Apex / Extinction', desc: 'Relentless supernatural hunters driven by pure rage. Often siphon absolute power directly from demonic entities.' },
    { name: 'Vampire (Nosferatu / Alpha)', threat: 'Severe', desc: 'Predatory undead entities. High-tier variants possess the ability to consume souls to create familiars.' },
    { name: 'Occult Detective / Hedge Mage', threat: 'Variable (Tactical)', desc: 'Mortal practitioners relying on sigil magic, exorcism rituals, and pure trickery.' }
  ];

  const animeDB = [
    { title: 'A Certain Magical Index', genre: 'Sci-Fi / Fantasy', era: '2000s', desc: 'In a city of espers, a boy with the power to negate any ability meets a nun running from sorcerers.' },
    { title: 'A Certain Scientific Railgun', genre: 'Sci-Fi / Action', era: '2000s', desc: 'A spin-off of Magical Index focusing on Mikoto Misaka, the third strongest esper in Academy City.' },
    { title: 'A Lull in the Sea (Nagi-Asu)', genre: 'Drama / Romance', era: '2010s', desc: 'Middle school students from a village beneath the sea must attend school on the surface after their school closes.' },
    { title: 'A Place Further Than the Universe', genre: 'Adventure / Slice of Life', era: '2010s', desc: 'Four high school girls embark on a journey to Antarctica to find a missing mother.' },
    { title: 'A Silent Voice', genre: 'Drama / Romance', era: '2010s', desc: 'A former bully tries to make amends with a deaf girl he tormented in elementary school.' },
    { title: 'Afro Samurai', genre: 'Action / Samurai', era: '2000s', desc: 'A samurai seeks revenge against the man who killed his father, fighting his way to the Number One headband.' },
    { title: 'Aggretsuko', genre: 'Comedy / Slice of Life', era: '2010s', desc: 'A frustrated red panda accountant deals with her stressful corporate life by singing death metal at karaoke.' },
    { title: 'Akame ga Kill!', genre: 'Dark Fantasy / Action', era: '2010s', desc: 'A young villager travels to the capital to raise money for his home, only to discover deep corruption and join an assassin group.' },
    { title: 'Akira', genre: 'Cyberpunk', era: '1980s', desc: 'A secret military project endangers Neo-Tokyo when it turns a biker gang member into a rampaging psychic psychopath.' },
    { title: 'Angel Beats!', genre: 'Drama / Supernatural', era: '2010s', desc: 'In an afterlife high school, teens who experienced trauma in life form a rebellion against God before they can reincarnate.' },
    { title: 'Assassination Classroom', genre: 'Action / Comedy', era: '2010s', desc: 'A class of misfits is tasked with assassinating their alien teacher, who threatens to destroy Earth.' },
    { title: 'Attack on Titan', genre: 'Dark Fantasy / Action', era: '2010s-2020s', desc: 'Humanity lives inside cities surrounded by enormous walls that protect them from gigantic man-eating humanoids called Titans.' },
    { title: 'Cowboy Bebop', genre: 'Sci-Fi / Western', era: '1990s', desc: 'The futuristic misadventures and tragedies of an easygoing bounty hunter and his partners.' },
    { title: 'Fullmetal Alchemist: Brotherhood', genre: 'Fantasy / Adventure', era: '2000s', desc: 'Two brothers search for a Philosopher\'s Stone after a forbidden attempt to revive their mother goes horribly awry.' },
    { title: 'My Hero Academia', genre: 'Shonen / Superhero', era: '2010s-2020s', desc: 'A boy without powers enrolls in a prestigious hero academy.' },
    { title: 'One Piece', genre: 'Adventure / Shonen', era: '1990s-Present', desc: 'Monkey D. Luffy and his pirate crew traverse the Grand Line.' }
  ].sort((a, b) => a.title.localeCompare(b.title));

  // School Reference Documents Data structure mapped by grade
  const schoolCurriculum = {
    'K': { math: 'Counting 1-100, basic shapes, simple addition concepts.', science: 'Five senses, weather patterns, animal habitats.', history: 'Family trees, community helpers, national symbols.', chemistry: 'States of matter (solid ice vs liquid water).' },
    '1st': { math: 'Addition/subtraction within 20, place value, time to the hour.', science: 'Plant life cycles, light & sound, sun/moon/stars.', history: 'Historical figures (Washington, Lincoln), past vs present.', chemistry: 'Mixing colors, dissolving sugar in water.' },
    '2nd': { math: 'Two-digit addition/subtraction, money, measurement, data graphs.', science: 'States of matter in depth, earth materials, ecosystems.', history: 'Local geography, maps, basic American history & civics.', chemistry: 'Reversible vs irreversible changes (melting vs burning).' },
    '3rd': { math: 'Multiplication & division, fractions, area & perimeter.', science: 'Life cycles (metamorphosis), forces & motion, magnets.', history: 'World geography, ancient civilizations (Egypt, Greece), indigenous peoples.', chemistry: 'Introduction to atoms, molecules, and simple mixtures.' },
    '4th': { math: 'Multi-digit multiplication, fraction equivalence, angle measurements.', science: 'Energy transfer, electricity, rock cycle, erosion.', history: 'State history, exploration, colonization era.', chemistry: 'Solutions, solutes, solvents, and concentration.' },
    '5th': { math: 'Decimal operations, volume, coordinate planes, adding unlike fractions.', science: 'Cell structure, food webs, solar system mechanics, gravity.', history: 'American Revolution, Declaration of Independence, U.S. Constitution.', chemistry: 'Chemical vs physical changes, basic chemical reactions (baking soda & vinegar).' },
    '6th': { math: 'Ratios, unit rates, algebraic expressions, introduction to negative numbers.', science: 'Plate tectonics, earthquakes, ecosystems, thermal energy.', history: 'Ancient world history (Mesopotamia, Indus Valley, Early China, Rome).', chemistry: 'Elements, the Periodic Table basics, atomic structure (protons, neutrons, electrons).' },
    '7th': { math: 'Proportional relationships, inequalities, circle geometry, probability.', science: 'Human body systems (circulatory, respiratory, nervous), genetics & heredity.', history: 'Medieval history, feudalism, the Renaissance, global trade routes.', chemistry: 'Compounds, chemical formulas, balancing simple equations.' },
    '8th': { math: 'Linear equations, functions, Pythagorean theorem, volume of cones/cylinders.', science: 'Chemical reactions, waves, electromagnetic spectrum, space exploration.', history: 'U.S. History from colonization through Reconstruction & Civil War.', chemistry: 'States of matter phase changes, kinetic molecular theory, reaction rates.' },
    '9th': { math: 'Algebra I: Quadratics, polynomials, exponential functions, systems of equations.', science: 'Biology: Cell biology, photosynthesis, cellular respiration, DNA & protein synthesis.', history: 'World Geography & Modern Global History (1900 to Present).', chemistry: 'Stoichiometry intro, mole concept, molar mass calculations.' },
    '10th': { math: 'Geometry: Proofs, triangle similarity, trigonometry ratios, circle theorems.', science: 'Earth & Space Science: Climate science, plate tectonics, stellar evolution, biogeochemical cycles.', history: 'World History II: Imperialism, World Wars, Cold War, Decolonization.', chemistry: 'General Chemistry: Gas laws (Boyle, Charles, Ideal Gas), electron configurations, periodic trends.' },
    '11th': { math: 'Algebra II / Pre-Calculus: Logarithms, complex numbers, matrices, conic sections, sequences.', science: 'Chemistry: Thermochemistry, acid-base equilibrium (pH, pOH), oxidation-reduction (redox) reactions.', history: 'U.S. History: Industrialization, Great Depression, New Deal, Civil Rights Movement.', chemistry: 'Advanced Bonding: VSEPR theory, intermolecular forces, molecular geometry.' },
    '12th': { math: 'Calculus AB/BC or Statistics: Limits, derivatives, integrals, probability distributions.', science: 'Physics or Advanced Biology: Mechanics, kinematics, thermodynamics, or advanced genetics & evolution.', history: 'Government & Economics: Micro/Macroeconomics, U.S. Constitution in depth, civic duties.', chemistry: 'Organic Chemistry / Biochemistry: Hydrocarbons, functional groups, polymers, amino acids.' },
    'College': { math: 'Multivariable Calculus, Linear Algebra, Differential Equations, Real Analysis.', science: 'Advanced Physics (Quantum/Electromagnetism), Organic Chemistry, Molecular Biology.', history: 'Historiography, Specialized Global Studies, Geopolitics.', chemistry: 'Thermodynamics, Quantum Chemistry, Spectroscopy, Synthesis.' }
  };

  const filteredAnime = activeLetter === 'All' ? animeDB : animeDB.filter(a => a.title.toUpperCase().startsWith(activeLetter));
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

      {/* TOP NAV: Main Categories */}
      <div style={{ display: 'flex', gap: '10px', padding: '15px 15px 0 15px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <button onClick={() => setActiveCategory('starthere')} style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeCategory === 'starthere' ? '#3b82f6' : '#222', color: activeCategory === 'starthere' ? '#fff' : '#888' }}>
          📑 Start Here
        </button>
        <button onClick={() => setActiveCategory('supernatural')} style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeCategory === 'supernatural' ? '#a855f7' : '#222', color: activeCategory === 'supernatural' ? '#fff' : '#888' }}>
          🔮 Supernatural
        </button>
        <button onClick={() => setActiveCategory('anime')} style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeCategory === 'anime' ? '#ef4444' : '#222', color: activeCategory === 'anime' ? '#fff' : '#888' }}>
          ⛩️ Anime
        </button>
        <button onClick={() => setActiveCategory('school')} style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeCategory === 'school' ? '#f59e0b' : '#222', color: activeCategory === 'school' ? '#000' : '#888' }}>
          📚 School
        </button>
        <button onClick={() => setActiveCategory('paganism')} style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeCategory === 'paganism' ? '#10b981' : '#222', color: activeCategory === 'paganism' ? '#fff' : '#888' }}>
          🌿 Paganism
        </button>
      </div>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>

        {/* START HERE / MANIFESTO (Default Landing) */}
        {activeCategory === 'starthere' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6', padding: '25px 20px' }}>
            <h2 style={{ color: '#3b82f6', margin: '0 0 20px 0', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center' }}>Forward</h2>
            
            <div style={{ color: '#ccc', lineHeight: '1.7', fontSize: '0.95em', textAlign: 'left', marginBottom: '25px' }}>
              <p style={{ marginBottom: '20px' }}>All information contained within this archive is individually researched and gained from public sources or other individuals respected in their craft or field.</p>
              
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid #ef4444', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
                <strong style={{ color: '#ef4444', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Disclaimer & Info</strong>
                Always <strong>do your own research</strong>. The contents provided here are for educational, organizational, and informational purposes only. They do not constitute professional, legal, or medical advice. 
              </div>
            </div>

            <div style={{ borderTop: '1px dashed #333', paddingTop: '25px', marginTop: '15px', textAlign: 'center' }}>
              <p style={{ color: '#888', fontStyle: 'italic', marginBottom: '25px', lineHeight: '1.6', padding: '0 10px' }}>
                "Developed to provide information and knowledge to the masses when it is so hard to come by if you don't have the means."
              </p>
              
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '8px', border: '1px solid #222' }}>
                <h3 style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, fontSize: '1.1em', lineHeight: '1.8' }}>
                  Sovereignty is privacy.<br/>
                  <span style={{ color: '#3b82f6' }}>Take back your freedom.</span><br/>
                  Stay sovereign.
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* PAGANISM PLACEHOLDER */}
        {activeCategory === 'paganism' && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
            <span style={{ fontSize: '3em', display: 'block', marginBottom: '15px' }}>🌿</span>
            <h3 style={{ color: '#10b981', margin: '0 0 10px 0' }}>Paganism Database</h3>
            <p>This category is primed and waiting for future module expansion.</p>
          </div>
        )}

        {/* SCHOOL REFERENCE ARCHIVE */}
        {activeCategory === 'school' && (
          <div style={{ borderTop: '4px solid #f59e0b', paddingTop: '10px' }}>
            <h3 style={{ color: '#f59e0b', margin: '0 0 15px 0', textTransform: 'uppercase', fontSize: '0.95em', textAlign: 'center' }}>Academic Grade Levels</h3>
            
            <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '15px', WebkitOverflowScrolling: 'touch' }}>
              {gradesList.map(g => (
                <button key={g} onClick={() => setActiveGrade(g)} style={{ flex: '0 0 auto', padding: '8px 16px', borderRadius: '8px', background: activeGrade === g ? '#f59e0b' : '#222', color: activeGrade === g ? '#000' : '#888', border: 'none', fontWeight: 'bold' }}>
                  {g}
                </button>
              ))}
            </div>

            <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
              <h3 style={{ color: '#f59e0b', margin: '0 0 15px 0', textTransform: 'uppercase' }}>Grade {activeGrade} Curriculum</h3>
              
              <div style={{ marginBottom: '15px', borderBottom: '1px dashed #333', paddingBottom: '10px' }}>
                <div style={{ color: '#3b82f6', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>🔢 Math Reference</div>
                <div style={{ color: '#eee', fontSize: '0.95em' }}>{schoolCurriculum[activeGrade].math}</div>
              </div>

              <div style={{ marginBottom: '15px', borderBottom: '1px dashed #333', paddingBottom: '10px' }}>
                <div style={{ color: '#10b981', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>🧪 Chemistry Focus</div>
                <div style={{ color: '#eee', fontSize: '0.95em' }}>{schoolCurriculum[activeGrade].chemistry}</div>
              </div>

              <div style={{ marginBottom: '15px', borderBottom: '1px dashed #333', paddingBottom: '10px' }}>
                <div style={{ color: '#ef4444', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>🔬 Science Reference</div>
                <div style={{ color: '#eee', fontSize: '0.95em' }}>{schoolCurriculum[activeGrade].science}</div>
              </div>

              <div>
                <div style={{ color: '#f59e0b', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>📜 History Reference</div>
                <div style={{ color: '#eee', fontSize: '0.95em' }}>{schoolCurriculum[activeGrade].history}</div>
              </div>
            </div>
          </div>
        )}

        {/* ANIME ARCHIVE */}
        {activeCategory === 'anime' && (
          <div style={{ borderTop: '4px solid #ef4444', paddingTop: '10px' }}>
            <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '15px', WebkitOverflowScrolling: 'touch' }}>
              {alphabet.map(l => (
                <button key={l} onClick={() => setActiveLetter(l)} style={{ flex: '0 0 auto', padding: '8px 15px', borderRadius: '8px', background: activeLetter === l ? '#ef4444' : '#222', color: activeLetter === l ? '#fff' : '#888', border: 'none', fontWeight: 'bold' }}>
                  {l}
                </button>
              ))}
            </div>

            {filteredAnime.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#666', fontStyle: 'italic' }}>No database entries for '{activeLetter}' yet.</div>
            ) : (
              filteredAnime.map((anime, idx) => (
                <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                  <div onClick={() => toggleExpand(anime.title)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{anime.title}</h4>
                    <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{expandedItem === anime.title ? '−' : '+'}</span>
                  </div>
                  {expandedItem === anime.title && (
                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}>
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                        <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold' }}>{anime.genre}</span>
                        <span style={{ background: '#222', color: '#aaa', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold' }}>{anime.era}</span>
                      </div>
                      <div style={{ color: '#00ffff', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Synopsis</div>
                      <div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em' }}>{anime.desc}</div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* SUPERNATURAL CONTENT */}
        {activeCategory === 'supernatural' && (
          <>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', overflowX: 'auto' }}>
              <button onClick={() => setActiveSubTab('tarot')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: activeSubTab === 'tarot' ? '1px solid #a855f7' : '1px solid #333', background: activeSubTab === 'tarot' ? 'rgba(168, 85, 247, 0.1)' : 'transparent', color: activeSubTab === 'tarot' ? '#a855f7' : '#888', fontWeight: 'bold' }}>Tarot</button>
              <button onClick={() => setActiveSubTab('wicca')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: activeSubTab === 'wicca' ? '1px solid #10b981' : '1px solid #333', background: activeSubTab === 'wicca' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: activeSubTab === 'wicca' ? '#10b981' : '#888', fontWeight: 'bold' }}>Wicca</button>
              <button onClick={() => setActiveSubTab('entities')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: activeSubTab === 'entities' ? '1px solid #ef4444' : '1px solid #333', background: activeSubTab === 'entities' ? 'rgba(239, 68, 68, 0.1)' : 'transparent', color: activeSubTab === 'entities' ? '#ef4444' : '#888', fontWeight: 'bold' }}>Entities & Lore</button>
            </div>

            {activeSubTab === 'tarot' && (
              <div style={{ borderTop: '1px solid #222', paddingTop: '15px' }}>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
                  <button onClick={() => setActiveTarotTab('basics')} style={tertTabStyle('basics', activeTarotTab, '#a855f7')}>Basics</button>
                  <button onClick={() => setActiveTarotTab('interpretations')} style={tertTabStyle('interpretations', activeTarotTab, '#a855f7')}>Interpretations</button>
                </div>
                {activeTarotTab === 'interpretations' ? tarotDeck.map((card, idx) => (
                  <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
                    <div onClick={() => toggleExpand(card.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}><h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{card.name}</h4><span style={{ color: '#a855f7', fontWeight: 'bold' }}>{expandedItem === card.name ? '−' : '+'}</span></div>
                    {expandedItem === card.name && (
                      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}>
                        <div style={{ color: '#00ffff', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Keywords</div><div style={{ color: '#aaa', fontStyle: 'italic', marginBottom: '15px' }}>{card.keywords}</div>
                        <div style={{ color: '#00ffff', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Interpretation</div><div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em' }}>{card.desc}</div>
                      </div>
                    )}
                  </div>
                )) : <div style={cardStyle}><h3 style={{ color: '#a855f7', marginTop: 0 }}>Section Template</h3><p style={{ color: '#ccc' }}>Ready for additional notes...</p></div>}
              </div>
            )}

            {activeSubTab === 'wicca' && (
              <div style={{ borderTop: '1px solid #222', paddingTop: '15px' }}>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
                  <button onClick={() => setActiveWiccaTab('lunar')} style={tertTabStyle('lunar', activeWiccaTab, '#10b981')}>Lunar Cycles</button>
                  <button onClick={() => setActiveWiccaTab('elements')} style={tertTabStyle('elements', activeWiccaTab, '#10b981')}>The 5 Elements</button>
                  <button onClick={() => setActiveWiccaTab('rede')} style={tertTabStyle('rede', activeWiccaTab, '#10b981')}>Wiccan Rede</button>
                  <button onClick={() => setActiveWiccaTab('sabbats')} style={tertTabStyle('sabbats', activeWiccaTab, '#10b981')}>The Sabbats</button>
                </div>
                {activeWiccaTab === 'lunar' && lunarDB.map((moon, idx) => (
                  <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                    <div onClick={() => toggleExpand(moon.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}><h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{moon.name}</h4><span style={{ color: '#10b981', fontWeight: 'bold' }}>{expandedItem === moon.name ? '−' : '+'}</span></div>
                    {expandedItem === moon.name && (
                      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}><div style={{ color: '#00ffff', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Energy / Archetype</div><div style={{ color: '#aaa', fontStyle: 'italic', marginBottom: '15px' }}>{moon.type}</div><div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em' }}>{moon.desc}</div></div>
                    )}
                  </div>
                ))}
                {activeWiccaTab === 'sabbats' && sabbatsDB.map((sab, idx) => (
                  <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                    <div onClick={() => toggleExpand(sab.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}><h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{sab.name} <span style={{ color: '#888', fontSize: '0.8em', fontWeight: 'normal' }}>({sab.date})</span></h4><span style={{ color: '#10b981', fontWeight: 'bold' }}>{expandedItem === sab.name ? '−' : '+'}</span></div>
                    {expandedItem === sab.name && (
                      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}><div style={{ display: 'inline-block', background: '#222', color: sab.type.includes('Fire') ? '#ef4444' : '#3b82f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold', marginBottom: '15px' }}>{sab.type}</div><div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em' }}>{sab.desc}</div></div>
                    )}
                  </div>
                ))}
                {activeWiccaTab === 'elements' && elementsDB.map((el, idx) => (
                  <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                    <div onClick={() => toggleExpand(el.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}><h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{el.name}</h4><span style={{ color: '#10b981', fontWeight: 'bold' }}>{expandedItem === el.name ? '−' : '+'}</span></div>
                    {expandedItem === el.name && (
                      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}><div style={{ color: '#aaa', fontStyle: 'italic', marginBottom: '15px' }}>Color: {el.color} | Direction: {el.direction}<br/>Properties: {el.props}</div><div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em' }}>{el.desc}</div></div>
                    )}
                  </div>
                ))}
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
                    <div onClick={() => toggleExpand(god.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}><h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{god.name}</h4><span style={{ color: '#ef4444', fontWeight: 'bold' }}>{expandedItem === god.name ? '−' : '+'}</span></div>
                    {expandedItem === god.name && (
                      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}><div style={{ display: 'inline-block', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold', marginBottom: '15px' }}>Origin: {god.origin}</div><div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em' }}>{god.desc}</div></div>
                    )}
                  </div>
                ))}
                {activeEntityTab === 'creatures' && creaturesDB.map((creature, idx) => (
                  <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                    <div onClick={() => toggleExpand(creature.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}><h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{creature.name}</h4><span style={{ color: '#ef4444', fontWeight: 'bold' }}>{expandedItem === creature.name ? '−' : '+'}</span></div>
                    {expandedItem === creature.name && (
                      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}><div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}><span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold' }}>Threat: {creature.threat}</span></div><div style={{ color: '#00ffff', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Field Notes</div><div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em' }}>{creature.desc}</div></div>
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
