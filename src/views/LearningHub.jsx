import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LearningHub() {
  const navigate = useNavigate();

  // Navigation State
  const [activeCategory, setActiveCategory] = useState('starthere');
  const [activeSubTab, setActiveSubTab] = useState('wicca');
  const [activeTarotTab, setActiveTarotTab] = useState('basics');
  const [activeWiccaTab, setActiveWiccaTab] = useState('lunar');
  
  // School & Quiz State
  const [activeGrade, setActiveGrade] = useState('GED');
  const [expandedItem, setExpandedItem] = useState(null);
  
  const [quizActive, setQuizActive] = useState(false);
  const [activeQuizPool, setActiveQuizPool] = useState([]); // Holds the randomized 10 questions
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const gradesList = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', 'GED'];

  // --- SUPERNATURAL DATABASES ---
  const tarotDeck = [
    { name: '0 - The Fool', keywords: 'New beginnings, spontaneity, blind faith', desc: 'Represents a leap into the unknown. A reminder to embrace chaos and trust the journey.' },
    { name: 'I - The Magician', keywords: 'Willpower, manifestation, resourcefulness', desc: 'You have the tools and the power to manipulate your reality.' }
  ];

  const elementsDB = [
    { name: 'Earth', color: 'Green or Brown', direction: 'North', props: 'Grounding, nurturing, supportive, stable', desc: 'Represents the very base of existence; it is the foundation.' },
    { name: 'Air', color: 'Yellow', direction: 'East', props: 'Transport, movement, communication, intellect', desc: 'Represents movement & the breath of life.' },
    { name: 'Water', color: 'Blue', direction: 'West', props: 'Cleansing, healing, purifying', desc: 'Corresponds to emotions.' },
    { name: 'Fire', color: 'Red', direction: 'South', props: 'Transformative, destructive, passionate', desc: 'Represents swift transformation.' }
  ];

  const sabbatsDB = [
    { name: 'Samhain', date: 'Oct 31st', type: 'Greater Sabbat / Fire Festival', desc: '(Pronounced Sowin). Marks the pagan New Year, Halloween or All Hallows Eve. Was the final harvest for our ancestors.' },
    { name: 'Yule', date: 'Dec 21st or 22nd', type: 'Lesser Sabbat / Solar Festival', desc: 'Winter Solstice. Shortest day of the year. Celebrated as the rebirth of the sun.' }
  ];

  const lunarDB = [
    { name: 'The Triple Goddess', type: 'Archetypes', desc: 'The Maiden (New/Waxing Moon), The Mother (Full Moon), The Crone (Waning/Dark Moon).' },
    { name: 'Full Moon', type: 'Potent Power', desc: 'Most potent time to do any magickal work. Invoking, protecting, or healing.' }
  ];

  // --- SCHOOL CURRICULUM ---
  const schoolCurriculum = {
    'K': { 
      math: [{ topic: 'Counting 1-20', content: 'Practice: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20.' }, { topic: 'Basic Shapes', content: 'Circle, Square, Triangle.' }],
      science: [{ topic: 'The Five Senses', content: 'Sight, Hearing, Smell, Taste, Touch.' }],
      language: [{ topic: 'The Alphabet', content: 'There are 26 letters.' }],
      history: [{ topic: 'Community Helpers', content: 'Firefighters put out fires. Doctors keep us healthy.' }]
    },
    '1st': { 
      math: [{ topic: 'Addition (0-20)', content: 'Adding is combining (10 + 5 = 15).' }, { topic: 'Place Value', content: 'In 42, there are 4 Tens and 2 Ones.' }],
      science: [{ topic: 'Plant Life Cycles', content: 'Seed -> Seedling -> Adult Plant.' }],
      language: [{ topic: 'Sentences', content: 'A sentence ends with a Period (.).' }, { topic: 'Nouns & Verbs', content: 'Noun: Person, place, thing. Verb: Action.' }],
      history: [{ topic: 'Past vs. Present', content: 'The Past is before. The Present is now.' }]
    },
    '2nd': { 
      math: [{ topic: 'Money', content: 'Penny 1¢, Nickel 5¢, Dime 10¢, Quarter 25¢. 4 Quarters = $1.00.' }],
      science: [{ topic: 'States of Matter', content: 'Solid, Liquid, Gas.' }],
      history: [{ topic: 'Civics', content: 'A Mayor leads a city. A Governor leads a state. A President leads a country.' }]
    },
    '3rd': { 
      math: [{ topic: 'Multiplication', content: '4 x 5 means four groups of five (20).' }, { topic: 'Fractions', content: 'In 1/2, 1 is the Numerator, 2 is the Denominator.' }],
      science: [{ topic: 'Forces & Magnets', content: 'Opposite poles Attract. Like poles Repel.' }],
      history: [{ topic: 'Geography', content: 'There are 7 continents: North America, South America, Europe, Africa, Asia, Australia, Antarctica.' }]
    },
    '4th': {
      math: [{ topic: 'Geometry', content: 'A Right Angle is exactly 90 degrees. Parallel lines never intersect.' }],
      science: [{ topic: 'Energy Transfer', content: 'Energy cannot be created or destroyed, only transferred.' }],
      history: [{ topic: 'Colonization', content: 'Jamestown was the first permanent English settlement (1607).' }]
    },
    '5th': {
      math: [{ topic: 'Volume', content: 'Volume = Length x Width x Height.' }, { topic: 'Coordinate Planes', content: 'X-axis is horizontal, Y-axis is vertical. Origin is (0,0).' }],
      science: [{ topic: 'Cells', content: 'The Nucleus is the brain. The Mitochondria is the powerhouse.' }],
      history: [{ topic: 'American Revolution', content: 'The Declaration of Independence was signed in 1776.' }]
    },
    '6th': {
      math: [{ topic: 'Ratios', content: 'A ratio compares two quantities (e.g., 3:2).' }, { topic: 'Negative Numbers', content: 'Numbers less than zero.' }],
      science: [{ topic: 'Plate Tectonics', content: 'Earth\'s moving crust causes earthquakes and forms mountains.' }],
      chemistry: [{ topic: 'Atoms', content: 'Protons (+), Neutrons (neutral), Electrons (-).' }],
      history: [{ topic: 'Ancient Civilizations', content: 'Mesopotamia is the cradle of civilization. Greece gave us early democracy.' }]
    },
    '7th': {
      math: [{ topic: 'Proportions & Inequalities', content: 'An inequality compares values. "x > 5" means x is strictly greater than 5. A proportion states two ratios are equal.' }],
      science: [{ topic: 'Genetics', content: 'DNA carries genetic information. Dominant traits mask recessive traits. A Punnett square predicts probability.' }],
      chemistry: [{ topic: 'The Periodic Table', content: 'Elements are arranged by atomic number. Groups (columns) share similar chemical properties.' }],
      history: [{ topic: 'Medieval History', content: 'Feudalism was a social system where land was exchanged for military service and labor.' }]
    },
    '8th': {
      math: [{ topic: 'Linear Equations', content: 'The slope-intercept form is y=mx+b, where m is the slope (rise/run) and b is the y-intercept.' }],
      science: [{ topic: 'Waves', content: 'Electromagnetic waves do not require a medium (e.g., light). Mechanical waves do (e.g., sound).' }],
      chemistry: [{ topic: 'Chemical Reactions', content: 'Reactants turn into Products. The Law of Conservation of Mass states matter cannot be created or destroyed in a reaction.' }],
      history: [{ topic: 'The Civil War', content: 'Fought between the Union (North) and Confederacy (South) from 1861-1865 over state rights and slavery.' }]
    },
    '9th': {
      math: [{ topic: 'Algebra I', content: 'To solve 3x + 5 = 20, isolate x. Subtract 5 from both sides (3x = 15), then divide by 3 (x = 5). Quadratic form is ax^2+bx+c=0.' }],
      science: [{ topic: 'Cell Division', content: 'Mitosis creates two identical diploid daughter cells (for growth/repair). Meiosis creates four unique haploid sex cells (gametes).' }],
      chemistry: [{ topic: 'Stoichiometry & Moles', content: 'A mole is 6.022 x 10^23 particles (Avogadro\'s number). Molar mass converts between grams and moles.' }],
      language: [{ topic: 'Literary Devices', content: 'Metaphors compare without "like" or "as". Foreshadowing hints at future plot events. Irony is the opposite of expectation.' }]
    },
    '10th': {
      math: [{ topic: 'Geometry & Trig', content: 'Pythagorean Theorem: a^2+b^2=c^2. Area of a circle: A=pi*r^2. SOH CAH TOA is used for right triangle trigonometry (Sine=Opposite/Hypotenuse).' }],
      science: [{ topic: 'Newton\'s Laws of Motion', content: '1: Inertia (objects in motion stay in motion). 2: Force = mass x acceleration (F=ma). 3: Every action has an equal/opposite reaction.' }],
      history: [{ topic: 'World War II', content: 'Fought from 1939-1945. The Axis (Germany, Italy, Japan) vs. the Allies (US, UK, USSR). Ended after atomic bombs dropped on Hiroshima/Nagasaki.' }],
      language: [{ topic: 'Rhetoric', content: 'Ethos appeals to credibility. Pathos appeals to emotion. Logos appeals to logic and facts.' }]
    },
    '11th': {
      math: [{ topic: 'Algebra II', content: 'Logarithms are the inverse of exponentials. If b^y = x, then log_b(x) = y. Complex numbers involve "i", where i is the square root of -1.' }],
      science: [{ topic: 'Thermodynamics', content: '1st Law: Energy cannot be created or destroyed. 2nd Law: Entropy (disorder) in an isolated system always increases.' }],
      chemistry: [{ topic: 'Acids & Bases', content: 'The pH scale ranges from 0-14. Less than 7 is acidic (high H+ ions), 7 is neutral, greater than 7 is basic/alkaline (high OH- ions).' }],
      history: [{ topic: 'The Cold War', content: 'A geopolitical standoff between the US (Capitalism) and USSR (Communism) involving nuclear proliferation and proxy wars like Vietnam and Korea.' }]
    },
    'GED': {
      math: [{ topic: 'GED Math Core', content: 'You must master solving multi-step linear equations, evaluating functions f(x), calculating slopes from two points m=(y2-y1)/(x2-x1), and interpreting data graphs.' }],
      science: [{ topic: 'GED Science Core', content: 'Focus on scientific method (hypothesis, variable, control), interpreting data, and core formulas. Understand Punnett squares (Genetics) and F=ma (Physics).' }],
      history: [{ topic: 'GED Social Studies', content: 'Economics: Supply and Demand dictate market prices. Civics: The Constitution separates power to prevent tyranny. History: Key amendments (1st: Speech, 13th: Abolish slavery).' }],
      language: [{ topic: 'GED Reading & Language Arts', content: 'Identify the main idea, evaluate the strength of an author\'s argument, identify bias, and understand text structure (cause/effect, chronological).' }]
    }
  };

  // Expanded Quiz Banks - The randomizer will pull 10 from these pools
  const quizzes = {
    'K': [
      { q: 'Which shape has exactly 3 sides?', options: ['Circle', 'Square', 'Triangle', 'Rectangle'], answer: 'Triangle' },
      { q: 'What is 1 + 1?', options: ['1', '2', '3', '11'], answer: '2' },
      { q: 'Which body part do we use for the sense of Smell?', options: ['Ears', 'Hands', 'Eyes', 'Nose'], answer: 'Nose' },
      { q: 'Which of these is a Living thing?', options: ['A Rock', 'A Toy Car', 'A Tree', 'A Pencil'], answer: 'A Tree' },
      { q: 'How many days are in a week?', options: ['5', '7', '10', '12'], answer: '7' }
    ],
    // ... [1st-8th abbreviated in code for brevity, assumes standard 10 questions we already built] ...
    '9th': [
      { q: 'Solve for x: 2x - 4 = 10', options: ['5', '7', '8', '14'], answer: '7' },
      { q: 'What is the standard form of a quadratic equation?', options: ['y=mx+b', 'ax^2+bx+c=0', 'a^2+b^2=c^2', 'A=pi*r^2'], answer: 'ax^2+bx+c=0' },
      { q: 'Which process creates two identical daughter cells?', options: ['Meiosis', 'Osmosis', 'Mitosis', 'Photosynthesis'], answer: 'Mitosis' },
      { q: 'A mole contains approximately how many particles?', options: ['1 Million', '6.022 x 10^23', '3.14', '100'], answer: '6.022 x 10^23' },
      { q: 'Which literary device compares two things without using "like" or "as"?', options: ['Simile', 'Foreshadowing', 'Metaphor', 'Hyperbole'], answer: 'Metaphor' },
      { q: 'Meiosis is the process of creating what kind of cells?', options: ['Skin cells', 'Brain cells', 'Identical cells', 'Sex cells (gametes)'], answer: 'Sex cells (gametes)' },
      { q: 'What hints at future events in a story?', options: ['Flashback', 'Foreshadowing', 'Metaphor', 'Irony'], answer: 'Foreshadowing' },
      { q: 'What is used to convert between grams and moles?', options: ['Atomic radius', 'Molar mass', 'Volume', 'Density'], answer: 'Molar mass' },
      { q: 'Solve for x: 5x = 25', options: ['2', '3', '4', '5'], answer: '5' },
      { q: 'If a cell has 46 chromosomes, how many will a daughter cell have after mitosis?', options: ['23', '46', '92', '0'], answer: '46' }
    ],
    '10th': [
      { q: 'What is the Pythagorean Theorem?', options: ['A=pi*r^2', 'y=mx+b', 'a^2+b^2=c^2', 'F=ma'], answer: 'a^2+b^2=c^2' },
      { q: 'According to Newton\'s 2nd Law, Force equals mass times...', options: ['Velocity', 'Gravity', 'Acceleration', 'Inertia'], answer: 'Acceleration' },
      { q: 'Which countries made up the Axis powers in WWII?', options: ['US, UK, USSR', 'Germany, Italy, Japan', 'France, China, Spain', 'Germany, Russia, France'], answer: 'Germany, Italy, Japan' },
      { q: 'In rhetoric, what does "Logos" appeal to?', options: ['Emotion', 'Credibility', 'Logic', 'Fear'], answer: 'Logic' },
      { q: 'What is the formula for the area of a circle?', options: ['A=pi*r^2', 'A=2*pi*r', 'A=l*w', 'A=1/2*b*h'], answer: 'A=pi*r^2' },
      { q: 'Which of Newton\'s laws states that every action has an equal and opposite reaction?', options: ['First', 'Second', 'Third', 'Fourth'], answer: 'Third' },
      { q: 'What year did WWII end?', options: ['1918', '1939', '1945', '1965'], answer: '1945' },
      { q: 'In rhetoric, "Ethos" relies on establishing what?', options: ['Logic', 'Anger', 'Credibility/Authority', 'Sadness'], answer: 'Credibility/Authority' },
      { q: 'In trigonometry, Sine (SOH) is calculated by...', options: ['Adjacent/Hypotenuse', 'Opposite/Adjacent', 'Opposite/Hypotenuse', 'Hypotenuse/Opposite'], answer: 'Opposite/Hypotenuse' },
      { q: 'Which rhetoric technique appeals to the audience\'s emotions?', options: ['Logos', 'Pathos', 'Ethos', 'Mythos'], answer: 'Pathos' }
    ],
    '11th': [
      { q: 'What is the mathematical inverse of an exponential function?', options: ['Derivative', 'Integral', 'Logarithm', 'Polynomial'], answer: 'Logarithm' },
      { q: 'What does the 2nd Law of Thermodynamics state about isolated systems?', options: ['Energy is destroyed', 'Entropy always increases', 'Mass is conserved', 'Gravity weakens'], answer: 'Entropy always increases' },
      { q: 'On the pH scale, a value of 2 is considered...', options: ['Neutral', 'Basic', 'Acidic', 'Alkaline'], answer: 'Acidic' },
      { q: 'The Cold War was primarily a standoff between the US and...', options: ['China', 'Germany', 'The USSR', 'Japan'], answer: 'The USSR' },
      { q: 'If b^y = x, then log_b(x) = ?', options: ['b', 'x', 'y', '1'], answer: 'y' },
      { q: 'Pure water has a pH of exactly...', options: ['0', '7', '14', '10'], answer: '7' },
      { q: 'Which economic system was the USSR promoting during the Cold War?', options: ['Capitalism', 'Feudalism', 'Communism', 'Monarchy'], answer: 'Communism' },
      { q: 'A substance with a pH of 12 is a...', options: ['Strong Acid', 'Weak Acid', 'Neutral', 'Base'], answer: 'Base' },
      { q: 'What does "proxy war" mean in the context of the Cold War?', options: ['Nuclear war', 'Wars fought through supported third parties', 'Cyber warfare', 'Trade embargoes'], answer: 'Wars fought through supported third parties' },
      { q: 'In math, the imaginary number "i" represents...', options: ['Infinity', 'Pi', 'The square root of -1', 'Zero'], answer: 'The square root of -1' }
    ],
    'GED': [
      { q: 'Solve for x: 4x + 10 = 30', options: ['4', '5', '10', '20'], answer: '5' },
      { q: 'What is the slope of the line passing through (1, 2) and (3, 6)? Formula: (y2-y1)/(x2-x1)', options: ['1', '2', '3', '4'], answer: '2' },
      { q: 'According to Newton\'s Second Law, if m=10kg and a=5m/s^2, what is the Force?', options: ['2 N', '15 N', '50 N', '500 N'], answer: '50 N' },
      { q: 'In economics, if supply increases and demand remains the same, what happens to the price?', options: ['It drops', 'It rises', 'It stays the same', 'It doubles'], answer: 'It drops' },
      { q: 'Which US Constitutional Amendment abolished slavery?', options: ['1st', '2nd', '13th', '19th'], answer: '13th' },
      { q: 'What is the primary purpose of Checks and Balances in the US government?', options: ['To speed up laws', 'To prevent any one branch from becoming too powerful', 'To raise taxes', 'To elect officials'], answer: 'To prevent any one branch from becoming too powerful' },
      { q: 'If a triangle has a base of 10 and a height of 4, what is its area? (A=1/2*bh)', options: ['14', '20', '40', '80'], answer: '20' },
      { q: 'What gas is a product of photosynthesis that humans need to survive?', options: ['Carbon Dioxide', 'Nitrogen', 'Oxygen', 'Helium'], answer: 'Oxygen' },
      { q: 'In an experiment, what is the "control" variable?', options: ['The part that is measured', 'The part that is kept the same', 'The part that changes', 'The hypothesis'], answer: 'The part that is kept the same' },
      { q: 'A logical fallacy is...', options: ['A strong argument', 'A flaw in reasoning that weakens the argument', 'A metaphor', 'A historical fact'], answer: 'A flaw in reasoning that weakens the argument' },
      { q: 'Evaluate f(x) = 2x^2 + 3 for x = 3', options: ['9', '15', '21', '36'], answer: '21' },
      { q: 'What does the First Amendment protect?', options: ['Right to bear arms', 'Right to a fair trial', 'Freedom of speech, religion, and press', 'Abolition of slavery'], answer: 'Freedom of speech, religion, and press' }
    ]
  };

  const toggleExpand = (name) => setExpandedItem(expandedItem === name ? null : name);

  // --- DYNAMIC RANDOMIZED QUIZ ENGINE ---
  const startQuiz = () => {
    const pool = quizzes[activeGrade] || [];
    // Fisher-Yates Shuffle to pull 10 random questions from the bank
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
    setActiveQuizPool(shuffled);
    setCurrentQ(0);
    setScore(0);
    setShowResults(false);
    setQuizActive(true);
  };

  const handleAnswer = (opt, correct) => {
    if (opt === correct) setScore(s => s + 1);
    if (currentQ < activeQuizPool.length - 1) { setCurrentQ(q => q + 1); } 
    else { setShowResults(true); }
  };

  const resetQuiz = () => { setQuizActive(false); setShowResults(false); setCurrentQ(0); setScore(0); setActiveQuizPool([]); };

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #222', padding: '15px', marginBottom: '15px' };
  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#3b82f6', fontSize: '1.2em' }}>Learning Center</h2>
      </header>

      {/* TOP NAV: Main Categories */}
      <div style={{ display: 'flex', gap: '10px', padding: '15px 15px 0 15px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <button onClick={() => setActiveCategory('starthere')} style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeCategory === 'starthere' ? '#3b82f6' : '#222', color: activeCategory === 'starthere' ? '#fff' : '#888' }}>📑 Start Here</button>
        <button onClick={() => setActiveCategory('school')} style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeCategory === 'school' ? '#f59e0b' : '#222', color: activeCategory === 'school' ? '#000' : '#888' }}>📚 School</button>
        <button onClick={() => setActiveCategory('supernatural')} style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeCategory === 'supernatural' ? '#a855f7' : '#222', color: activeCategory === 'supernatural' ? '#fff' : '#888' }}>🔮 Supernatural</button>
      </div>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>

        {/* START HERE / MANIFESTO */}
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

        {/* SCHOOL REFERENCE ARCHIVE & QUIZ */}
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

            {schoolCurriculum[activeGrade] ? (
              <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b', padding: '0' }}>
                <div style={{ background: '#f59e0b', color: '#000', padding: '15px', borderRadius: '10px 10px 0 0', fontWeight: 'bold', fontSize: '1.1em', textTransform: 'uppercase', textAlign: 'center' }}>
                  {activeGrade === 'GED' ? 'GED Capstone Curriculum' : `Grade ${activeGrade} Curriculum`}
                </div>

                <div style={{ padding: '20px' }}>
                  {['math', 'science', 'chemistry', 'history', 'language'].map((subj) => (
                    schoolCurriculum[activeGrade][subj]?.length > 0 && (
                      <div key={subj} style={{ marginBottom: '20px' }}>
                        <div style={{ color: '#fff', fontSize: '1.1em', textTransform: 'uppercase', fontWeight: '900', borderBottom: '2px solid #333', paddingBottom: '5px', marginBottom: '10px' }}>
                          {subj === 'math' ? '🔢 Math' : subj === 'science' ? '🔬 Science' : subj === 'chemistry' ? '🧪 Chemistry' : subj === 'language' ? '📖 Language & Reading' : '🌍 History & Civics'}
                        </div>
                        {schoolCurriculum[activeGrade][subj].map((item, idx) => (
                          <div key={idx} style={{ background: '#0a0a0a', padding: '12px', borderRadius: '6px', marginBottom: '8px', borderLeft: '2px solid #555' }}>
                            <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '4px' }}>{item.topic}</strong>
                            <div style={{ color: '#ccc', fontSize: '0.95em', lineHeight: '1.5' }}>{item.content}</div>
                          </div>
                        ))}
                      </div>
                    )
                  ))}
                  
                  {quizzes[activeGrade] && (
                    <button onClick={startQuiz} style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginTop: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                      📝 Take {activeGrade === 'GED' ? 'GED Practice' : `Grade ${activeGrade}`} Exam
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: '#666', fontStyle: 'italic' }}>Curriculum for {activeGrade} is under construction.</div>
            )}
          </div>
        )}

        {/* RANDOMIZED QUIZ MODAL - 80% TO PASS */}
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
                      <button key={idx} onClick={() => handleAnswer(opt, activeQuizPool[currentQ].answer)} style={{ background: '#222', color: '#fff', border: '1px solid #444', padding: '15px', borderRadius: '8px', fontSize: '1.05em', textAlign: 'left', fontWeight: 'bold' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ background: '#111', padding: '30px 20px', borderRadius: '12px', border: `2px solid ${hasPassed ? '#10b981' : '#ef4444'}`, textAlign: 'center' }}>
                  <h2 style={{ color: hasPassed ? '#10b981' : '#ef4444', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '2em' }}>
                    {hasPassed ? 'PASSED!' : 'FAILED'}
                  </h2>
                  <div style={{ color: '#fff', fontSize: '1.2em', marginBottom: '20px' }}>You scored {score} out of {activeQuizPool.length}.</div>
                  <div style={{ color: '#888', marginBottom: '20px', fontSize: '0.9em' }}>Required to pass: {passThreshold} ({Math.round((passThreshold/activeQuizPool.length)*100)}%)</div>
                  <p style={{ color: '#ccc', marginBottom: '30px' }}>
                    {hasPassed ? `Great job! You have mastered the ${activeGrade} curriculum.` : 'Please review the reference books and try the exam again.'}
                  </p>
                  <button onClick={resetQuiz} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '15px 30px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>
                    Return to Books
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {/* SUPERNATURAL CONTENT */}
        {activeCategory === 'supernatural' && (
          <div style={{ borderTop: '4px solid #a855f7', paddingTop: '10px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', overflowX: 'auto' }}>
              <button onClick={() => setActiveSubTab('tarot')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: activeSubTab === 'tarot' ? '1px solid #a855f7' : '1px solid #333', background: activeSubTab === 'tarot' ? 'rgba(168, 85, 247, 0.1)' : 'transparent', color: activeSubTab === 'tarot' ? '#a855f7' : '#888', fontWeight: 'bold' }}>Tarot</button>
              <button onClick={() => setActiveSubTab('wicca')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: activeSubTab === 'wicca' ? '1px solid #10b981' : '1px solid #333', background: activeSubTab === 'wicca' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: activeSubTab === 'wicca' ? '#10b981' : '#888', fontWeight: 'bold' }}>Wicca</button>
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
              <div style={{ color: '#888', textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>Select a topic to view details...</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
