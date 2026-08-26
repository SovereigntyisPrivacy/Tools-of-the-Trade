import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LearningHub() {
  const navigate = useNavigate();

  // Navigation State
  const [activeCategory, setActiveCategory] = useState('supernatural');
  const [activeSubTab, setActiveSubTab] = useState('wicca');
  const [activeTarotTab, setActiveTarotTab] = useState('basics');
  const [activeWiccaTab, setActiveWiccaTab] = useState('intro');
  const [activeEntityTab, setActiveEntityTab] = useState('goddesses');
  
  // School & Quiz State
  const [activeGrade, setActiveGrade] = useState('GED');
  const [expandedItem, setExpandedItem] = useState(null);
  const [quizActive, setQuizActive] = useState(false);
  const [activeQuizPool, setActiveQuizPool] = useState([]); 
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [encouragement, setEncouragement] = useState("");

  const encouragements = [
    "It's okay to read a sentence five times before it clicks. Learning is a process, not a race. Take your time.",
    "You are building your future right now, one concept at a time. Keep pushing.",
    "Don't let frustration win. Step back, take a deep breath, and tackle it again. You've got this.",
    "You're doing this for you. Your sovereignty, your freedom, your mind. Don't quit.",
    "Every expert was once a beginner who refused to give up. Be stubborn about your goals."
  ];

  useEffect(() => { setEncouragement(encouragements[Math.floor(Math.random() * encouragements.length)]); }, [activeGrade]);

  const gradesList = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', 'GED'];

  // --- SUPERNATURAL & LORE DATABASE ---
  const wiccaIntro = { 
    title: "History & The Wiccan Path", 
    content: "Wicca is a modern pagan, nature-based spiritual path. It was introduced to the public in the 1950s by a retired British civil servant named Gerald Gardner. Gardner claimed to have been initiated into a surviving coven of historical witches, drawing upon ancient European pagan traditions, folk magic, and hermetic philosophies to build the framework of modern Wicca.\n\nUnlike Abrahamic religions, Wicca is highly decentralized. There is no 'Pope' of Wicca, no central church, and no absolute holy text like a Bible. While covens use a 'Book of Shadows' to record rituals and spells, these books are highly personal and customized by the practitioner.\n\nPractitioners (often called Wiccans or Witches) focus on personal responsibility, deep reverence for the earth, and the dualistic balance of nature—often personified as a Triple Moon Goddess and a Horned God of the wild. People adopt this lifestyle to reconnect with natural cycles, practice mindfulness, and reclaim their spiritual sovereignty outside of organized, dogmatic religion." 
  };
  
  const wiccanRede = { 
    title: "The Wiccan Rede & Rule of Three", 
    content: "Because Wicca lacks a central authority or 'sin' based commandments, its core moral framework relies entirely on personal accountability. This is summarized in the Wiccan Rede (first publicly recorded in a 1964 speech by Doreen Valiente):\n\n'Eight words the Wiccan Rede fulfill, An it harm none do what ye will.'\n\nThis emphasizes absolute personal freedom. You can live however you want, practice whatever magic you desire, and follow your own path—so long as your actions do not bring physical, emotional, or spiritual harm to yourself or others.\n\nThis is paired with the 'Rule of Three' (or Threefold Law), the karmic belief that whatever energy you put out into the world (good or bad, helpful or manipulative) will be returned to you three times over. It forces practitioners to be hyper-aware of their intentions before casting a spell or making a choice." 
  };

  const elementsDB = [
    { name: 'Earth', color: 'Green, Brown, Black', direction: 'North', props: 'Grounding, nurturing, stability, wealth, the physical body.', desc: 'Earth represents the very base of existence; the foundation. It is the element of unshakeable physicality, nature, and the material world. In ritual, Earth is represented by dirt, salt, crystals, or the Pentacle (a disc inscribed with a five-pointed star). Used in spells for prosperity, grounding, and physical healing.' },
    { name: 'Air', color: 'Yellow, White', direction: 'East', props: 'Intellect, communication, travel, freedom, the mind.', desc: 'Air represents movement, the breath of life, and the realm of thoughts and ideas. It is masculine and projective. In ritual, Air is represented by incense smoke, feathers, or the Athame (a ritual knife used to direct energy, not to cut physical objects). Used in spells for clarity, passing exams, and communication.' },
    { name: 'Fire', color: 'Red, Orange', direction: 'South', props: 'Transformation, passion, destruction, courage, will.', desc: 'Fire represents swift change, ambition, and raw power. Fire consumes to create ash for new growth. It is highly projective and volatile. In ritual, Fire is represented by candles, ash, or the Wand. Used in spells for rapid transformation, banishing negative energy, and drawing courage.' },
    { name: 'Water', color: 'Blue, Indigo', direction: 'West', props: 'Emotion, intuition, healing, cleansing, the subconscious.', desc: 'Water corresponds to the depths of the human heart, dreams, and psychic abilities. It is feminine and receptive. In ritual, Water is represented by bowls of fresh water, shells, or the Chalice (a ritual cup). Used in spells for deep emotional healing, purification, and enhancing intuition.' },
    { name: 'Spirit (Aether)', color: 'Clear, Purple, White', direction: 'Center / All', props: 'Raw potentiality, connection to the divine, the soul.', desc: 'Spirit is the prime divine essence. It is the space in which all exists and the energy that binds the other four elements together. It represents the spark of life and the bridge between the physical and the supernatural.' }
  ];

  const sabbatsDB = [
    { name: 'Samhain (Oct 31)', type: 'Greater Sabbat / Fire Festival', desc: '(Pronounced Sowin). The Pagan New Year and the origin of Halloween. It marks the final harvest before the dead of winter. During Samhain, the veil between the physical world and the spirit realm is believed to be at its absolute thinnest. It is a profound time for honoring deceased ancestors, practicing divination (like Tarot reading), and embracing the dark, introspective half of the year.' },
    { name: 'Yule (Dec 21)', type: 'Lesser Sabbat / Solar Festival', desc: 'The Winter Solstice. The longest night and shortest day of the year. Pagan lore celebrates this as the rebirth of the Sun God, bringing the promise that light will slowly return to the world. Traditions include burning a Yule log for protection, decorating with evergreen branches (which symbolize eternal life), and feasting.' },
    { name: 'Imbolc (Feb 1-2)', type: 'Greater Sabbat / Fire Festival', desc: 'Marks the first subtle stirrings of spring in the belly of the earth. A festival of purification, clearing out the old winter stagnation, and dedicating oneself to new growth. It is heavily associated with the Celtic Goddess Brigid, the keeper of the sacred flame, poetry, and healing.' },
    { name: 'Ostara (Mar 21)', type: 'Lesser Sabbat / Solar Festival', desc: 'The Spring Equinox. Day and night are perfectly equal. Represents absolute equilibrium and the triumph of light over dark as the days grow longer. It is a festival of fierce fertility and new beginnings. Symbols include eggs and hares, which were later adapted into the Easter holiday.' },
    { name: 'Beltane (May 1)', type: 'Greater Sabbat / Fire Festival', desc: 'A massive celebration of passion, vitality, and the peak of spring. Bonfires are traditionally lit to protect crops and people. It represents the sexual and spiritual union of the God and Goddess, bringing life to the earth. Traditions include dancing around the Maypole.' },
    { name: 'Litha (Jun 21)', type: 'Lesser Sabbat / Solar Festival', desc: 'The Summer Solstice. The longest day of the year and the absolute peak of the Sun\'s power. A time of triumph, light, and high energy. Folklore states that fae/fairy magic is highly active during Midsummer eve.' },
    { name: 'Lammas / Lughnasadh (Aug 1)', type: 'Greater Sabbat / Fire Festival', desc: 'The festival of the first harvest (grain). A time of reaping what has been sown, baking bread, and showing deep gratitude for the earth\'s bounty as the wildness of summer begins to fade into autumn.' },
    { name: 'Mabon (Sep 21)', type: 'Lesser Sabbat / Solar Festival', desc: 'The Autumn Equinox. The second harvest. Another point of perfect balance between light and dark before the final descent into the cold winter months. A time of deep reflection, thanksgiving, and preparing the home for the coming dark.' }
  ];

  const lunarDB = [
    { name: 'The Triple Goddess', type: 'Archetypes', desc: 'Wicca often views the divine feminine through three distinct phases of a woman\'s life, mirrored by the moon.\n\n- The Maiden (Waxing Moon): Represents youth, wildness, innocence, and new beginnings.\n- The Mother (Full Moon): Represents creation, nurturing, sexuality, and peak power.\n- The Crone (Waning/Dark Moon): Represents deep wisdom, endings, rest, and acceptance of death.' },
    { name: 'New Moon', type: 'Rebirth & Intentions', desc: 'The sky is dark, but the cycle has reset. Prime workings: blessing new projects, setting powerful intentions for the coming month, reinventing yourself, and planting the seeds for new ideas.' },
    { name: 'Waxing Moon', type: 'Growth & Attraction', desc: 'The moon is visibly growing larger in the sky. Spells for gain, increase, financial abundance, drawing luck, and building relationships correspond perfectly with this building energy.' },
    { name: 'Full Moon', type: 'Peak Power', desc: 'The moon is fully illuminated. This is the most potent time to do any magickal work. The energy is at its absolute peak. Perfect for charging crystals, making moon water, intense invoking, protection spells, and profound healing.' },
    { name: 'Waning Moon', type: 'Diminishing & Releasing', desc: 'The moon is shrinking in the sky. Magick is focused on diminishing and clearing things out. Workings to gradually release bad habits, cut toxic ties, or end bad luck are optimal here.' },
    { name: 'Dark Moon', type: 'Shadow Work & Banishing', desc: 'The 1-2 days right before the New Moon where the sky is entirely void of light. Exceptionally potent for "Shadow Work" (processing internal trauma and facing your darkest fears) and urgent, forceful banishing of extreme negativity.' }
  ];

  const goddessesDB = [
    { name: 'Hecate', origin: 'Greek', desc: 'The Titan Goddess of magic, witchcraft, crossroads, and the night. Often depicted holding twin torches and accompanied by black dogs. She is the ultimate guide through the dark. Call upon her for protection, deep shadow work, and unlocking hidden, occult knowledge.' },
    { name: 'Lilith', origin: 'Mesopotamian / Abrahamic', desc: 'In lore, she was Adam\'s first wife who was banished from Eden because she refused to submit to him. She represents dark feminine energy, radical independence, and sexual sovereignty. Call upon her to discover your wild side and destroy submissive habits.' },
    { name: 'The Morrigan', origin: 'Celtic', desc: 'The Phantom Queen. A fierce, shape-shifting Goddess of war, fate, and sovereignty, often appearing over battlefields as a crow or raven. Call upon her for immense courage during literal or metaphorical battles.' },
    { name: 'Freyja', origin: 'Norse', desc: 'Goddess of love, beauty, fertility, and Seiðr (Norse magic). She is a fierce warrior who drives a chariot pulled by giant cats and receives half of the slain warriors in battle. Represents fierce independence combined with deep passion.' },
    { name: 'Brigid', origin: 'Celtic', desc: 'A beloved Goddess of fire, the hearth, poetry, and healing. She is the patron of the Imbolc Sabbat. Call upon her for protection of the home, creative inspiration, and healing from illness.' },
    { name: 'Artemis / Diana', origin: 'Greek / Roman', desc: 'Goddess of the hunt, the wilderness, and the moon. A fierce protector of young women and wild animals. Call upon her for independence, focus, and connection to untamed nature.' },
    { name: 'Kali', origin: 'Hindu', desc: 'Goddess of death, time, and doomsday. She destroys the ego and illusions to bring liberation. A terrifying but ultimately fiercely loving mother figure who violently destroys evil to protect her children.' }
  ];

  const creaturesDB = [
    { name: 'The Fae (Fair Folk)', threat: 'Unpredictable', desc: 'Ancient nature spirits originating primarily in Celtic lore. Do NOT confuse them with modern fairy-tale depictions. They are divided into the Seelie Court (generally neutral/favorable to humans but easily offended) and the Unseelie Court (malicious and predatory). Never give a Fae your true name, and never eat their food.' },
    { name: 'Hellspawn / High Demons', threat: 'Extreme', desc: 'Malevolent entities originating from infernal realms. They frequently utilize necroplasmic energy, possession, or celestial pacts to bind mortal souls. Highly manipulative and capable of reality distortion. Inherently susceptible to holy armaments, ancient warding sigils, and extreme banishing rituals.' },
    { name: 'Vampire (Nosferatu / Alpha)', threat: 'Severe', desc: 'Predatory undead entities that sustain themselves on the life force (blood or psychic energy) of the living. High-tier variants possess extreme bodily regeneration, supernatural speed, and the ability to consume souls to create familiars.' },
    { name: 'Poltergeist', threat: 'Moderate to High', desc: 'Translated as "noisy ghost." Unlike residual hauntings (which act like a film playing on loop), poltergeists are intelligent, kinetic anomalies capable of manipulating physical objects. They are often theorized to be manifestations of extreme, repressed adolescent psychological trauma rather than actual dead spirits.' },
    { name: 'The Slayer Archetype', threat: 'Apex / Extinction', desc: 'Relentless, highly specialized supernatural hunters driven by pure rage or an ancient bloodline. Rather than traditional magic, they utilize extreme martial prowess, specialized armaments, and sheer force of will to execute demonic entities.' }
  ];

  const tarotDeck = [
    { name: '0 - The Fool', keywords: 'New beginnings, spontaneity, blind faith', desc: 'Represents a leap into the unknown. A reminder to embrace chaos and trust the journey.' },
    { name: 'I - The Magician', keywords: 'Willpower, manifestation, resourcefulness', desc: 'You have the tools and the power to manipulate your reality.' }
  ];


  // --- SCHOOL CURRICULUM ---
  const schoolCurriculum = {
    'GED': {
      math: [
        { topic: 'Algebra: Solving Linear Equations', content: 'To solve an algebraic equation, your goal is to isolate the variable (x) by performing inverse operations.\n\nExample: 4x + 10 = 30\n1. Subtract 10 from both sides: 4x = 20\n2. Divide both sides by 4: x = 5\n\nIf you have variables on both sides (e.g., 5x = 2x + 12), subtract 2x from both sides first (3x = 12), then divide by 3 (x = 4).' },
        { topic: 'Algebra: Slope & Graphing', content: 'Linear equations are graphed on an X-Y plane using the formula: y = mx + b\n\n- "m" is the Slope (Rise over Run). How steep the line is.\n- "b" is the Y-Intercept. Exactly where the line hits the vertical Y-axis.\n\nTo find the slope between two points like (1, 2) and (3, 6), use the slope formula:\nm = (y2 - y1) / (x2 - x1)\nm = (6 - 2) / (3 - 1)\nm = 4 / 2 = 2. The slope is 2.' },
        { topic: 'Geometry: Area & Perimeter', content: 'Perimeter is the distance around the outside of a shape. Add all the sides together.\nArea is the space inside a shape.\n\n- Rectangle Area: Length × Width (A = lw)\n- Triangle Area: Half of Base × Height (A = 1/2bh). If base is 10 and height is 4, Area = 20.\n- Circle Area: Pi × Radius squared (A = πr²). Pi is approx 3.14.' },
        { topic: 'Data: Mean, Median, Mode', content: 'Mean (Average): Add all numbers up, divide by how many numbers there are.\nMedian (Middle): Put numbers in order from smallest to largest. Find the exact middle number. (If there are two middle numbers, average them).\nMode (Most): The number that shows up the most frequently.' }
      ],
      science: [
        { topic: 'The Scientific Method', content: 'The foundation of scientific inquiry:\n1. Observation\n2. Hypothesis (Testable prediction)\n3. Experiment\n4. Data Analysis\n5. Conclusion\n\nVariables are critical:\n- Independent Variable: The ONE thing the scientist changes.\n- Dependent Variable: What is measured (the result).\n- Control Group: The group kept perfectly normal to use as a baseline comparison.' },
        { topic: 'Genetics & Heredity', content: 'Traits are passed via DNA inside cells. \n\n- Dominant Traits (represented by capital letters like "A") will always mask or hide Recessive Traits (lowercase "a").\n- A person with "AA" or "Aa" will show the dominant trait.\n- A person must have "aa" to show the recessive trait.\n\nPunnett Squares are 4-box grids used to calculate the percentage chance a child will inherit specific traits.' },
        { topic: 'Physics: Newton\'s Laws', content: '1. Inertia: An object at rest stays at rest, an object in motion stays in motion, unless acted upon by force.\n2. F = ma: Force = mass × acceleration. If you push a 10kg object at 5m/s², the Force is 50 Newtons (10 × 5 = 50).\n3. Action/Reaction: For every action, there is an equal and opposite reaction.\n\nKinetic Energy is the energy of motion. Potential Energy is stored energy (like a rock sitting at the top of a hill).' }
      ],
      history: [
        { topic: 'Civics: The US Constitution', content: 'The Constitution establishes a system of "Checks and Balances" by separating power into three branches so no single group becomes tyrannical:\n1. Legislative (Congress): Makes laws.\n2. Executive (President): Enforces laws.\n3. Judicial (Supreme Court): Interprets laws.\n\nFederalism is the sharing of power between the National (Federal) government and State governments.' },
        { topic: 'Economics: Supply & Demand', content: 'In a capitalist market:\n- Supply: How much of a good is available.\n- Demand: How many people want to buy it.\nIf supply is LOW and demand is HIGH, prices skyrocket. If supply is HIGH and demand is LOW, prices crash.\n\nOpportunity Cost: The value of the next best alternative you give up when making a decision (e.g., if you spend $20 on a movie, the opportunity cost is the book you could have bought instead).' }
      ],
      language: [
        { topic: 'Reading Comprehension', content: 'The most important skill on the GED is finding the Main Idea. This is the central, overarching point the author is trying to prove, not the minor details used to support it.\n\nYou must also identify Source Types:\n- Primary Source: A first-hand account from someone who was there (e.g., a diary, a photograph, original raw data).\n- Secondary Source: Written after the fact by someone studying the event (e.g., a textbook, an encyclopedia).' },
        { topic: 'Logical Fallacies', content: 'A logical fallacy is a flaw in reasoning that makes an argument invalid.\n\n- Ad Hominem: Attacking the person making the argument instead of attacking the argument itself.\n- Strawman: Exaggerating or twisting someone\'s argument to make it ridiculous and easier to defeat.\n- Slippery Slope: Falsely claiming that one small action will inevitably lead to a massive, disastrous chain reaction.' }
      ]
    },
    '11th': { math: [{ topic: 'Algebra II', content: 'Logarithms are the inverse of exponentials. If b^y = x, then log_b(x) = y.' }], science: [{ topic: 'Thermodynamics', content: '1st Law: Energy cannot be created or destroyed. 2nd Law: Entropy always increases.' }], chemistry: [{ topic: 'Acids & Bases', content: 'The pH scale ranges from 0-14. Less than 7 is acidic, exactly 7 is neutral, greater than 7 is basic.' }], history: [{ topic: 'The Cold War', content: 'A standoff between the US and USSR involving nuclear proliferation and proxy wars.' }] },
    '10th': { math: [{ topic: 'Geometry & Trig', content: 'Pythagorean Theorem: a^2+b^2=c^2. Area of a circle: A=pi*r^2.' }], science: [{ topic: 'Newton\'s Laws', content: '1: Inertia. 2: F=ma. 3: Action/Reaction.' }], history: [{ topic: 'World War II', content: '1939-1945. Axis vs Allies.' }], language: [{ topic: 'Rhetoric', content: 'Ethos (credibility), Pathos (emotion), Logos (logic).' }] }
  };

  const quizzes = {
    'GED': [
      { q: 'Solve for x: 4x + 10 = 30', options: ['4', '5', '10', '20'], answer: '5' },
      { q: 'Solve for x: 5x = 2x + 12', options: ['2', '4', '6', '12'], answer: '4' },
      { q: 'What is the slope of the line passing through (1, 2) and (3, 6)?', options: ['1', '2', '3', '4'], answer: '2' },
      { q: 'Evaluate f(x) = 2x^2 + 3 for x = 3', options: ['9', '15', '21', '36'], answer: '21' },
      { q: 'If a triangle has a base of 10 and a height of 4, what is its area?', options: ['14', '20', '40', '80'], answer: '20' },
      { q: 'What is the median of this data set: 2, 5, 8, 11, 14?', options: ['5', '8', '11', '14'], answer: '8' },
      { q: 'What is 20% of 80?', options: ['16', '20', '40', '60'], answer: '16' },
      { q: 'In y = mx + b, what does "b" represent?', options: ['Slope', 'X-intercept', 'Y-intercept', 'Variable'], answer: 'Y-intercept' },
      { q: 'According to Newton\'s 2nd Law, if m=10kg and a=5m/s^2, Force is?', options: ['2 N', '15 N', '50 N', '500 N'], answer: '50 N' },
      { q: 'What gas is a product of photosynthesis that humans need to survive?', options: ['Carbon Dioxide', 'Nitrogen', 'Oxygen', 'Helium'], answer: 'Oxygen' },
      { q: 'In an experiment, the "control" is...', options: ['Measured', 'Kept the same', 'Changed', 'Hypothesis'], answer: 'Kept the same' },
      { q: 'Energy of motion is called...', options: ['Potential', 'Kinetic', 'Thermal', 'Chemical'], answer: 'Kinetic' },
      { q: 'Stored energy (like a rock on a hill) is called...', options: ['Potential', 'Kinetic', 'Nuclear', 'Solar'], answer: 'Potential' },
      { q: 'Which organelle is the "powerhouse" of the cell?', options: ['Nucleus', 'Mitochondria', 'Chloroplast', 'Ribosome'], answer: 'Mitochondria' },
      { q: 'In genetics, which trait will mask the other?', options: ['Recessive', 'Dominant', 'Neutral', 'Passive'], answer: 'Dominant' },
      { q: 'If supply is low and demand is high, price will...', options: ['Drop', 'Rise', 'Stay same', 'Crash'], answer: 'Rise' },
      { q: 'Which Amendment abolished slavery?', options: ['1st', '2nd', '13th', '19th'], answer: '13th' },
      { q: 'What is the primary purpose of Checks and Balances?', options: ['Speed laws', 'Prevent tyranny', 'Raise taxes', 'Elect judges'], answer: 'Prevent tyranny' },
      { q: 'First Amendment protects...', options: ['Bear arms', 'Fair trial', 'Speech/Religion/Press', 'Voting'], answer: 'Speech/Religion/Press' },
      { q: 'Branch of government that makes laws?', options: ['Executive', 'Judicial', 'Military', 'Legislative'], answer: 'Legislative' },
      { q: 'Power shared between National and State governments is...', options: ['Federalism', 'Monarchy', 'Communism', 'Tyranny'], answer: 'Federalism' },
      { q: 'What you give up to get something else in economics is...', options: ['Inflation', 'Supply', 'Opportunity Cost', 'Demand'], answer: 'Opportunity Cost' },
      { q: 'A logical fallacy is...', options: ['Strong argument', 'Flaw in reasoning', 'Metaphor', 'Fact'], answer: 'Flaw in reasoning' },
      { q: 'Attacking the person instead of the argument is...', options: ['Strawman', 'Ad Hominem', 'Red Herring', 'Slippery Slope'], answer: 'Ad Hominem' },
      { q: 'A first-hand historical account (like a diary) is a...', options: ['Secondary Source', 'Primary Source', 'Fallacy', 'Hypothesis'], answer: 'Primary Source' },
      { q: 'Exaggerating someone\'s argument to make it easier to attack is...', options: ['Strawman', 'Ad Hominem', 'Ethos', 'Pathos'], answer: 'Strawman' },
      { q: 'Which is a Fact, not an Opinion?', options: ['Pizza is best', 'Water boils at 100°C', 'Math is hard', 'Dogs are cute'], answer: 'Water boils at 100°C' },
      { q: 'In reading comprehension, the "Main Idea" is...', options: ['A minor detail', 'The central, overarching point', 'The author\'s name', 'The conclusion'], answer: 'The central, overarching point' }
    ]
  };

  const toggleExpand = (name) => setExpandedItem(expandedItem === name ? null : name);

  const startQuiz = () => {
    const pool = quizzes[activeGrade] || [];
    const testLength = activeGrade === 'GED' ? 15 : 5;
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, testLength);
    setActiveQuizPool(shuffled); setCurrentQ(0); setScore(0); setShowResults(false); setQuizActive(true);
  };

  const handleAnswer = (opt, correct) => {
    if (opt === correct) setScore(s => s + 1);
    if (currentQ < activeQuizPool.length - 1) { setCurrentQ(q => q + 1); } 
    else { setShowResults(true); }
  };

  const resetQuiz = () => { setQuizActive(false); setShowResults(false); setCurrentQ(0); setScore(0); setActiveQuizPool([]); };

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #222', padding: '15px', marginBottom: '15px' };
  const tertTabStyle = (tabName, activeName, color) => ({ flex: '0 0 auto', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85em', fontWeight: 'bold', border: `1px solid ${color}`, background: activeName === tabName ? color : 'transparent', color: activeName === tabName ? '#fff' : color });

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#3b82f6', fontSize: '1.2em' }}>Learning Center</h2>
      </header>

      {/* TOP NAV */}
      <div style={{ display: 'flex', gap: '10px', padding: '15px 15px 0 15px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <button onClick={() => setActiveCategory('starthere')} style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeCategory === 'starthere' ? '#3b82f6' : '#222', color: activeCategory === 'starthere' ? '#fff' : '#888' }}>📑 Start Here</button>
        <button onClick={() => setActiveCategory('school')} style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeCategory === 'school' ? '#f59e0b' : '#222', color: activeCategory === 'school' ? '#000' : '#888' }}>📚 School</button>
        <button onClick={() => setActiveCategory('supernatural')} style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeCategory === 'supernatural' ? '#a855f7' : '#222', color: activeCategory === 'supernatural' ? '#fff' : '#888' }}>🔮 Supernatural</button>
      </div>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>

        {/* MANIFESTO */}
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
              <p style={{ color: '#888', fontStyle: 'italic', marginBottom: '25px', lineHeight: '1.6', padding: '0 10px' }}>"Developed to provide information and knowledge to the masses when it is so hard to come by if you don't have the means."</p>
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '8px', border: '1px solid #222' }}>
                <h3 style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, fontSize: '1.1em', lineHeight: '1.8' }}>
                  Sovereignty is privacy.<br/><span style={{ color: '#3b82f6' }}>Take back your freedom.</span><br/>Stay sovereign.
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* SCHOOL */}
        {activeCategory === 'school' && (
          <div style={{ borderTop: '4px solid #f59e0b', paddingTop: '10px' }}>
            <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '15px', WebkitOverflowScrolling: 'touch' }}>
              {gradesList.map(g => (
                <button key={g} onClick={() => setActiveGrade(g)} style={{ flex: '0 0 auto', padding: '8px 16px', borderRadius: '8px', background: activeGrade === g ? '#f59e0b' : '#222', color: activeGrade === g ? '#000' : '#888', border: 'none', fontWeight: 'bold' }}>{g}</button>
              ))}
            </div>

            {schoolCurriculum[activeGrade] ? (
              <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b', padding: '0' }}>
                <div style={{ background: '#f59e0b', color: '#000', padding: '15px', borderRadius: '10px 10px 0 0', fontWeight: 'bold', fontSize: '1.1em', textTransform: 'uppercase', textAlign: 'center' }}>
                  {activeGrade === 'GED' ? 'GED Capstone Curriculum' : `Grade ${activeGrade} Curriculum`}
                </div>
                <div style={{ padding: '20px' }}>
                  {activeGrade === 'GED' && (
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', color: '#3b82f6', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontStyle: 'italic', fontSize: '0.95em', lineHeight: '1.5' }}>
                      <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>💡 A quick note:</span>"{encouragement}"
                    </div>
                  )}

                  {['math', 'science', 'chemistry', 'history', 'language'].map((subj) => (
                    schoolCurriculum[activeGrade][subj]?.length > 0 && (
                      <div key={subj} style={{ marginBottom: '20px' }}>
                        <div style={{ color: '#fff', fontSize: '1.1em', textTransform: 'uppercase', fontWeight: '900', borderBottom: '2px solid #333', paddingBottom: '5px', marginBottom: '10px' }}>
                          {subj === 'math' ? '🔢 Math' : subj === 'science' ? '🔬 Science' : subj === 'chemistry' ? '🧪 Chemistry' : subj === 'language' ? '📖 Language & Reading' : '🌍 History & Civics'}
                        </div>
                        {schoolCurriculum[activeGrade][subj].map((item, idx) => {
                          const itemKey = `${activeGrade}-${subj}-${idx}`;
                          return (
                            <div key={idx} style={{ background: '#0a0a0a', padding: '12px', borderRadius: '6px', marginBottom: '8px', borderLeft: '2px solid #555' }}>
                              <div onClick={() => toggleExpand(itemKey)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                <h4 style={{ margin: 0, color: '#f59e0b', fontSize: '1.05em' }}>{item.topic}</h4>
                                <span style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '1.2em' }}>{expandedItem === itemKey ? '−' : '+'}</span>
                              </div>
                              {expandedItem === itemKey && (
                                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #333', color: '#ccc', fontSize: '0.95em', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{item.content}</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )
                  ))}
                  {quizzes[activeGrade] && (
                    <button onClick={startQuiz} style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginTop: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                      📝 Take {activeGrade === 'GED' ? '15-Question GED' : `Grade ${activeGrade}`} Exam
                    </button>
                  )}
                </div>
              </div>
            ) : <div style={{ textAlign: 'center', padding: '30px', color: '#666', fontStyle: 'italic' }}>Curriculum for {activeGrade} is under construction.</div>}
          </div>
        )}

        {/* QUIZ MODAL */}
        {quizActive && activeQuizPool.length > 0 && (() => {
          const passThreshold = Math.ceil(activeQuizPool.length * 0.8);
          const hasPassed = score >= passThreshold;
          return (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#000', zIndex: 100, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f59e0b', paddingBottom: '15px', marginBottom: '20px' }}>
                <h2 style={{ color: '#f59e0b', margin: 0, textTransform: 'uppercase' }}>{activeGrade} Exam</h2>
                <button onClick={resetQuiz} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Exit</button>
              </div>
              {!showResults ? (
                <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
                  <div style={{ color: '#888', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>Question {currentQ + 1} of {activeQuizPool.length}</div>
                  <h3 style={{ color: '#fff', margin: '0 0 20px 0', fontSize: '1.2em', lineHeight: '1.4' }}>{activeQuizPool[currentQ].q}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {activeQuizPool[currentQ].options.map((opt, idx) => (
                      <button key={idx} onClick={() => handleAnswer(opt, activeQuizPool[currentQ].answer)} style={{ background: '#222', color: '#fff', border: '1px solid #444', padding: '15px', borderRadius: '8px', fontSize: '1.05em', textAlign: 'left', fontWeight: 'bold' }}>{opt}</button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ background: '#111', padding: '30px 20px', borderRadius: '12px', border: `2px solid ${hasPassed ? '#10b981' : '#ef4444'}`, textAlign: 'center' }}>
                  <h2 style={{ color: hasPassed ? '#10b981' : '#ef4444', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '2.5em' }}>{hasPassed ? 'PASSED!' : 'FAILED'}</h2>
                  <div style={{ color: '#fff', fontSize: '1.2em', marginBottom: '20px' }}>You scored {score} out of {activeQuizPool.length}.</div>
                  <div style={{ color: '#888', marginBottom: '20px', fontSize: '0.9em' }}>Required to pass: {passThreshold}</div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px', marginBottom: '30px', fontStyle: 'italic', color: '#ccc' }}>
                    {hasPassed ? "Outstanding work. Take a breath and be proud of yourself." : "Failure is just data. Step back, re-read, and hit it again."}
                  </div>
                  <button onClick={resetQuiz} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '15px 30px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', width: '100%' }}>Return to Books</button>
                </div>
              )}
            </div>
          );
        })()}

        {/* SUPERNATURAL TAB (FULLY RESTORED) */}
        {activeCategory === 'supernatural' && (
          <div style={{ borderTop: '4px solid #a855f7', paddingTop: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
              <button onClick={() => setActiveSubTab('tarot')} style={tertTabStyle('tarot', activeSubTab, '#a855f7')}>Tarot</button>
              <button onClick={() => setActiveSubTab('wicca')} style={tertTabStyle('wicca', activeSubTab, '#10b981')}>Wicca</button>
              <button onClick={() => setActiveSubTab('entities')} style={tertTabStyle('entities', activeSubTab, '#ef4444')}>Entities & Lore</button>
            </div>

            {activeSubTab === 'tarot' && tarotDeck.map((card, idx) => (
              <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
                <div onClick={() => toggleExpand(card.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}><h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{card.name}</h4><span style={{ color: '#a855f7', fontWeight: 'bold' }}>{expandedItem === card.name ? '−' : '+'}</span></div>
                {expandedItem === card.name && (
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}><div style={{ color: '#00ffff', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Interpretation</div><div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em' }}>{card.desc}</div></div>
                )}
              </div>
            ))}

            {activeSubTab === 'wicca' && (
              <div style={{ borderTop: '1px solid #222', paddingTop: '15px' }}>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
                  <button onClick={() => setActiveWiccaTab('intro')} style={tertTabStyle('intro', activeWiccaTab, '#10b981')}>History</button>
                  <button onClick={() => setActiveWiccaTab('lunar')} style={tertTabStyle('lunar', activeWiccaTab, '#10b981')}>Lunar Cycles</button>
                  <button onClick={() => setActiveWiccaTab('elements')} style={tertTabStyle('elements', activeWiccaTab, '#10b981')}>The 5 Elements</button>
                  <button onClick={() => setActiveWiccaTab('rede')} style={tertTabStyle('rede', activeWiccaTab, '#10b981')}>Wiccan Rede</button>
                  <button onClick={() => setActiveWiccaTab('sabbats')} style={tertTabStyle('sabbats', activeWiccaTab, '#10b981')}>Sabbats</button>
                </div>

                {activeWiccaTab === 'intro' && (
                  <div style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}><h3 style={{ color: '#10b981', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '1.1em' }}>{wiccaIntro.title}</h3><div style={{ color: '#eee', lineHeight: '1.6', fontSize: '0.95em', whiteSpace: 'pre-wrap' }}>{wiccaIntro.content}</div></div>
                )}
                {activeWiccaTab === 'rede' && (
                  <div style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}><h3 style={{ color: '#10b981', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '1.1em' }}>{wiccanRede.title}</h3><div style={{ color: '#eee', lineHeight: '1.6', fontSize: '0.95em', whiteSpace: 'pre-wrap' }}>{wiccanRede.content}</div></div>
                )}
                {activeWiccaTab === 'lunar' && lunarDB.map((moon, idx) => (
                  <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                    <div onClick={() => toggleExpand(moon.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}><h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{moon.name}</h4><span style={{ color: '#10b981', fontWeight: 'bold' }}>{expandedItem === moon.name ? '−' : '+'}</span></div>
                    {expandedItem === moon.name && (
                      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}><div style={{ color: '#00ffff', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Energy / Archetype</div><div style={{ color: '#aaa', fontStyle: 'italic', marginBottom: '15px' }}>{moon.type}</div><div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em', whiteSpace: 'pre-wrap' }}>{moon.desc}</div></div>
                    )}
                  </div>
                ))}
                {activeWiccaTab === 'sabbats' && sabbatsDB.map((sab, idx) => (
                  <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                    <div onClick={() => toggleExpand(sab.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}><h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{sab.name}</h4><span style={{ color: '#10b981', fontWeight: 'bold' }}>{expandedItem === sab.name ? '−' : '+'}</span></div>
                    {expandedItem === sab.name && (
                      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}><div style={{ display: 'inline-block', background: '#222', color: sab.type?.includes('Fire') ? '#ef4444' : '#3b82f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold', marginBottom: '15px' }}>{sab.type}</div><div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em', whiteSpace: 'pre-wrap' }}>{sab.desc}</div></div>
                    )}
                  </div>
                ))}
                {activeWiccaTab === 'elements' && elementsDB.map((el, idx) => (
                  <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                    <div onClick={() => toggleExpand(el.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}><h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{el.name}</h4><span style={{ color: '#10b981', fontWeight: 'bold' }}>{expandedItem === el.name ? '−' : '+'}</span></div>
                    {expandedItem === el.name && (
                      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}><div style={{ color: '#aaa', fontStyle: 'italic', marginBottom: '15px' }}>Color: {el.color} | Direction: {el.direction}<br/>Properties: {el.props}</div><div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em', whiteSpace: 'pre-wrap' }}>{el.desc}</div></div>
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
                      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}><div style={{ display: 'inline-block', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold', marginBottom: '15px' }}>Origin: {god.origin}</div><div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em', whiteSpace: 'pre-wrap' }}>{god.desc}</div></div>
                    )}
                  </div>
                ))}
                {activeEntityTab === 'creatures' && creaturesDB.map((creature, idx) => (
                  <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                    <div onClick={() => toggleExpand(creature.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}><h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{creature.name}</h4><span style={{ color: '#ef4444', fontWeight: 'bold' }}>{expandedItem === creature.name ? '−' : '+'}</span></div>
                    {expandedItem === creature.name && (
                      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}><div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}><span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold' }}>Threat: {creature.threat}</span></div><div style={{ color: '#00ffff', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Field Notes</div><div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em', whiteSpace: 'pre-wrap' }}>{creature.desc}</div></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
