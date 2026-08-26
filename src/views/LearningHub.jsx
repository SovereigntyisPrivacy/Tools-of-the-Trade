import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LearningHub() {
  const navigate = useNavigate();

  // Navigation State
  const [activeCategory, setActiveCategory] = useState('starthere');
  const [activeSubTab, setActiveSubTab] = useState('wicca');
  const [activeTarotTab, setActiveTarotTab] = useState('basics');
  const [activeWiccaTab, setActiveWiccaTab] = useState('intro');
  
  // School & Quiz State
  const [activeGrade, setActiveGrade] = useState('GED');
  const [expandedItem, setExpandedItem] = useState(null);
  
  const [quizActive, setQuizActive] = useState(false);
  const [activeQuizPool, setActiveQuizPool] = useState([]); 
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Humanity & Encouragement Engine
  const [encouragement, setEncouragement] = useState("");

  const encouragements = [
    "It's okay to read a sentence five times before it clicks. Learning is a process, not a race. Take your time.",
    "You are building your future right now, one concept at a time. Keep pushing.",
    "Don't let frustration win. Step back, take a deep breath, and tackle it again. You've got this.",
    "You're doing this for you. Your sovereignty, your freedom, your mind. Don't quit.",
    "Every expert was once a beginner who refused to give up. Be stubborn about your goals.",
    "Struggling means your brain is growing. The friction is where the magic happens."
  ];

  useEffect(() => {
    // Pick a random encouragement when the grade changes
    setEncouragement(encouragements[Math.floor(Math.random() * encouragements.length)]);
  }, [activeGrade]);

  const gradesList = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', 'GED'];

  // --- SUPERNATURAL DATABASES (Preserved) ---
  const wiccaIntro = { title: "History & The Wiccan Path", content: "Wicca is a modern pagan, nature-based spiritual path and lifestyle... Practitioners focus on personal responsibility, reverence for the earth, and reclaiming their personal and spiritual sovereignty." };
  const wiccanRede = { title: "The Wiccan Rede & Rule of Three", content: "The core moral framework is summarized in the Wiccan Rede: 'Eight words the Wiccan Rede fulfill, An it harm none do what ye will.' This emphasizes absolute personal freedom... paired with the Rule of Three, the karmic belief that whatever energy you put out will be returned three times over." };
  const tarotDeck = [{ name: '0 - The Fool', keywords: 'New beginnings, spontaneity', desc: 'A leap into the unknown.' }, { name: 'I - The Magician', keywords: 'Willpower, manifestation', desc: 'You have the power to manipulate your reality.' }];
  const elementsDB = [{ name: 'Earth', color: 'Green/Brown', direction: 'North', props: 'Grounding, stable', desc: 'The foundation.' }, { name: 'Air', color: 'Yellow', direction: 'East', props: 'Intellect', desc: 'Breath of life.' }];
  const sabbatsDB = [{ name: 'Samhain', date: 'Oct 31st', type: 'Greater Sabbat', desc: 'Pagan New Year.' }, { name: 'Yule', date: 'Dec 21st', type: 'Lesser Sabbat', desc: 'Winter Solstice.' }];

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
      science: [{ topic: 'Cell Division', content: 'Mitosis creates two identical diploid daughter cells. Meiosis creates four unique haploid sex cells (gametes).' }],
      chemistry: [{ topic: 'Stoichiometry & Moles', content: 'A mole is 6.022 x 10^23 particles. Molar mass converts between grams and moles.' }],
      language: [{ topic: 'Literary Devices', content: 'Metaphors compare without "like" or "as". Foreshadowing hints at future plot events.' }]
    },
    '10th': {
      math: [{ topic: 'Geometry & Trig', content: 'Pythagorean Theorem: a^2+b^2=c^2. Area of a circle: A=pi*r^2. SOH CAH TOA is used for right triangle trigonometry.' }],
      science: [{ topic: 'Newton\'s Laws of Motion', content: '1: Inertia. 2: Force = mass x acceleration (F=ma). 3: Every action has an equal/opposite reaction.' }],
      history: [{ topic: 'World War II', content: 'Fought from 1939-1945. The Axis (Germany, Italy, Japan) vs. the Allies (US, UK, USSR).' }],
      language: [{ topic: 'Rhetoric', content: 'Ethos appeals to credibility. Pathos appeals to emotion. Logos appeals to logic and facts.' }]
    },
    '11th': {
      math: [{ topic: 'Algebra II', content: 'Logarithms are the inverse of exponentials. If b^y = x, then log_b(x) = y.' }],
      science: [{ topic: 'Thermodynamics', content: '1st Law: Energy cannot be created or destroyed. 2nd Law: Entropy in an isolated system always increases.' }],
      chemistry: [{ topic: 'Acids & Bases', content: 'The pH scale ranges from 0-14. Less than 7 is acidic, 7 is neutral, greater than 7 is basic.' }],
      history: [{ topic: 'The Cold War', content: 'A geopolitical standoff between the US and USSR involving nuclear proliferation and proxy wars.' }]
    },
    'GED': {
      math: [{ topic: 'GED Math Core', content: 'Master solving multi-step linear equations, evaluating functions f(x), calculating slopes from two points m=(y2-y1)/(x2-x1), applying the Pythagorean Theorem, finding area/volume, and calculating Probability and Mean/Median/Mode.' }],
      science: [{ topic: 'GED Science Core', content: 'Focus on the scientific method (Independent vs Dependent variables), interpreting data, Punnett squares (Genetics), and physics formulas (F=ma). Understand the difference between Kinetic (motion) and Potential (stored) energy.' }],
      history: [{ topic: 'GED Social Studies', content: 'Economics: Supply and Demand dictate market prices. Opportunity Cost is what you give up to get something else.\nCivics: Checks & Balances. Federalism (power shared between states and national government). Key amendments (1st: Speech, 13th: Abolish slavery).' }],
      language: [{ topic: 'GED Reading & Language Arts', content: 'Identify the "Main Idea". Understand Primary sources (first-hand accounts like diaries) vs Secondary sources (textbooks). Differentiate Fact from Opinion. Identify Logical Fallacies (Ad Hominem: attacking the person; Strawman: exaggerating an argument).' }]
    }
  };

  const quizzes = {
    'K': [ { q: 'Which shape has 3 sides?', options: ['Circle', 'Square', 'Triangle', 'Rectangle'], answer: 'Triangle' }, { q: 'What is 1 + 1?', options: ['1', '2', '3', '11'], answer: '2' }, { q: 'Which body part is for Smell?', options: ['Ears', 'Hands', 'Eyes', 'Nose'], answer: 'Nose' }, { q: 'Which is Living?', options: ['Rock', 'Car', 'Tree', 'Pencil'], answer: 'Tree' }, { q: 'Days in a week?', options: ['5', '7', '10', '12'], answer: '7' } ],
    '1st': [ { q: 'How many Tens in 42?', options: ['2', '4', '6', '42'], answer: '4' }, { q: 'Ends a sentence?', options: ['Letter', 'Number', 'Period (.)', 'Noun'], answer: 'Period (.)' }, { q: '15 - 5 = ?', options: ['5', '10', '20', '9'], answer: '10' }, { q: 'Which is a Verb?', options: ['Apple', 'Run', 'School', 'Blue'], answer: 'Run' }, { q: 'Plants start as a...', options: ['Flower', 'Leaf', 'Seed', 'Tree'], answer: 'Seed' } ],
    '2nd': [ { q: '25 + 14 = ?', options: ['30', '39', '41', '49'], answer: '39' }, { q: 'Quarters in $1?', options: ['2', '3', '4', '10'], answer: '4' }, { q: 'Water is a...', options: ['Solid', 'Liquid', 'Gas', 'Plasma'], answer: 'Liquid' }, { q: 'Leader of a city?', options: ['President', 'Governor', 'Mayor', 'Teacher'], answer: 'Mayor' }, { q: 'Shows map directions?', options: ['Compass Rose', 'Legend', 'Scale', 'Title'], answer: 'Compass Rose' } ],
    '3rd': [ { q: '4 x 5 = ?', options: ['9', '16', '20', '25'], answer: '20' }, { q: 'Top of a fraction?', options: ['Denominator', 'Numerator', 'Quotient', 'Factor'], answer: 'Numerator' }, { q: 'Caterpillar to butterfly?', options: ['Photosynthesis', 'Erosion', 'Metamorphosis', 'Evaporation'], answer: 'Metamorphosis' }, { q: 'Opposite magnets do what?', options: ['Repel', 'Attract', 'Explode', 'Nothing'], answer: 'Attract' }, { q: 'Built the Pyramids?', options: ['Greece', 'Rome', 'Egypt', 'China'], answer: 'Egypt' } ],
    '4th': [ { q: 'Degrees in a Right Angle?', options: ['45', '90', '180', '360'], answer: '90' }, { q: 'Rock from heat/pressure?', options: ['Igneous', 'Sedimentary', 'Metamorphic', 'Lunar'], answer: 'Metamorphic' }, { q: 'Salt in saltwater is the...', options: ['Solvent', 'Mixture', 'Solute', 'Element'], answer: 'Solute' }, { q: 'First English settlement?', options: ['Plymouth', 'Roanoke', 'Jamestown', 'Boston'], answer: 'Jamestown' }, { q: 'Lines that never cross?', options: ['Perpendicular', 'Parallel', 'Diagonal', 'Curved'], answer: 'Parallel' } ],
    '5th': [ { q: 'Volume formula?', options: ['L+W+H', 'LxWxH', 'B+H', 'Pi*R'], answer: 'LxWxH' }, { q: 'Cell powerhouse?', options: ['Nucleus', 'Membrane', 'Mitochondria', 'Wall'], answer: 'Mitochondria' }, { q: 'Center of solar system?', options: ['Earth', 'Mars', 'Moon', 'Sun'], answer: 'Sun' }, { q: 'Tearing paper is a...', options: ['Physical Change', 'Chemical Change', 'Reaction', 'Solution'], answer: 'Physical Change' }, { q: 'Declaration of Independence year?', options: ['1492', '1776', '1812', '1865'], answer: '1776' } ],
    '6th': [ { q: 'Ratio 3 apples to 2 oranges?', options: ['3:2', '2:3', '3+2', '3/5'], answer: '3:2' }, { q: 'Causes earthquakes?', options: ['Erosion', 'Tornadoes', 'Plate Tectonics', 'Tides'], answer: 'Plate Tectonics' }, { q: 'Heat via direct contact?', options: ['Convection', 'Radiation', 'Conduction', 'Freezing'], answer: 'Conduction' }, { q: 'Positive subatomic particle?', options: ['Electron', 'Neutron', 'Proton', 'Nucleus'], answer: 'Proton' }, { q: 'Gave us early democracy?', options: ['Rome', 'Egypt', 'China', 'Greece'], answer: 'Greece' } ],
    '7th': [ { q: 'If x > 5, x could be...', options: ['4', '5', '6', '-5'], answer: '6' }, { q: 'Predicts genetic probability?', options: ['Venn', 'Pie Chart', 'Punnett Square', 'Histogram'], answer: 'Punnett Square' }, { q: 'Elements in same Group share...', options: ['Mass', 'Chemical Properties', 'Protons', 'Nothing'], answer: 'Chemical Properties' }, { q: 'Feudalism exchanged land for...', options: ['Money', 'Military Service', 'Titles', 'Freedom'], answer: 'Military Service' }, { q: 'Carries genetic info?', options: ['RNA', 'DNA', 'Proteins', 'Lipids'], answer: 'DNA' } ],
    '8th': [ { q: 'In y = mx + b, "m" is...', options: ['Y-int', 'Variable', 'Slope', 'Origin'], answer: 'Slope' }, { q: 'Wave needing no medium?', options: ['Sound', 'Mechanical', 'Electromagnetic', 'Ocean'], answer: 'Electromagnetic' }, { q: 'Matter cannot be...', options: ['Heated', 'Created or Destroyed', 'Solid', 'Mixed'], answer: 'Created or Destroyed' }, { q: 'Civil War fought Union vs...', options: ['British', 'French', 'Confederacy', 'Spanish'], answer: 'Confederacy' }, { q: 'Starting materials in reaction?', options: ['Products', 'Yields', 'Reactants', 'Isotopes'], answer: 'Reactants' } ],
    '9th': [ { q: 'Solve: 2x - 4 = 10', options: ['5', '7', '8', '14'], answer: '7' }, { q: 'Quadratic standard form?', options: ['y=mx+b', 'ax^2+bx+c=0', 'a^2+b^2=c^2', 'A=pi*r^2'], answer: 'ax^2+bx+c=0' }, { q: 'Creates identical daughter cells?', options: ['Meiosis', 'Osmosis', 'Mitosis', 'Photosynthesis'], answer: 'Mitosis' }, { q: 'Compares without like/as?', options: ['Simile', 'Foreshadowing', 'Metaphor', 'Hyperbole'], answer: 'Metaphor' }, { q: 'Hints at future events?', options: ['Flashback', 'Foreshadowing', 'Metaphor', 'Irony'], answer: 'Foreshadowing' } ],
    '10th': [ { q: 'Pythagorean Theorem?', options: ['A=pi*r^2', 'y=mx+b', 'a^2+b^2=c^2', 'F=ma'], answer: 'a^2+b^2=c^2' }, { q: 'Force equals mass times...', options: ['Velocity', 'Gravity', 'Acceleration', 'Inertia'], answer: 'Acceleration' }, { q: 'Axis powers WWII?', options: ['US, UK, USSR', 'Germany, Italy, Japan', 'France, China', 'Germany, Russia'], answer: 'Germany, Italy, Japan' }, { q: '"Logos" appeals to...', options: ['Emotion', 'Credibility', 'Logic', 'Fear'], answer: 'Logic' }, { q: 'Sine (SOH) is...', options: ['Adj/Hyp', 'Opp/Adj', 'Opp/Hyp', 'Hyp/Opp'], answer: 'Opp/Hyp' } ],
    '11th': [ { q: 'Inverse of exponential?', options: ['Derivative', 'Integral', 'Logarithm', 'Polynomial'], answer: 'Logarithm' }, { q: '2nd Law Thermodynamics?', options: ['Energy destroyed', 'Entropy always increases', 'Mass conserved', 'Gravity weakens'], answer: 'Entropy always increases' }, { q: 'pH of 2 is...', options: ['Neutral', 'Basic', 'Acidic', 'Alkaline'], answer: 'Acidic' }, { q: 'Cold War was US vs...', options: ['China', 'Germany', 'The USSR', 'Japan'], answer: 'The USSR' }, { q: 'War via third parties?', options: ['Nuclear', 'Proxy War', 'Cyber', 'Embargo'], answer: 'Proxy War' } ],
    'GED': [
      { q: 'Solve for x: 4x + 10 = 30', options: ['4', '5', '10', '20'], answer: '5' },
      { q: 'What is the slope of the line passing through (1, 2) and (3, 6)?', options: ['1', '2', '3', '4'], answer: '2' },
      { q: 'According to Newton\'s 2nd Law, if m=10kg and a=5m/s^2, Force is?', options: ['2 N', '15 N', '50 N', '500 N'], answer: '50 N' },
      { q: 'If supply is low and demand is high, price will...', options: ['Drop', 'Rise', 'Stay same', 'Crash'], answer: 'Rise' },
      { q: 'Which Amendment abolished slavery?', options: ['1st', '2nd', '13th', '19th'], answer: '13th' },
      { q: 'Purpose of Checks and Balances?', options: ['Speed laws', 'Prevent tyranny', 'Raise taxes', 'Elect judges'], answer: 'Prevent tyranny' },
      { q: 'Area of triangle with base 10 and height 4?', options: ['14', '20', '40', '80'], answer: '20' },
      { q: 'Product of photosynthesis humans need?', options: ['Carbon Dioxide', 'Nitrogen', 'Oxygen', 'Helium'], answer: 'Oxygen' },
      { q: 'In an experiment, the "control" is...', options: ['Measured', 'Kept the same', 'Changed', 'Hypothesis'], answer: 'Kept the same' },
      { q: 'A logical fallacy is...', options: ['Strong argument', 'Flaw in reasoning', 'Metaphor', 'Fact'], answer: 'Flaw in reasoning' },
      { q: 'Evaluate f(x) = 2x^2 + 3 for x = 3', options: ['9', '15', '21', '36'], answer: '21' },
      { q: 'First Amendment protects...', options: ['Bear arms', 'Fair trial', 'Speech/Religion/Press', 'Voting'], answer: 'Speech/Religion/Press' },
      { q: 'Attacking the person instead of the argument is...', options: ['Strawman', 'Ad Hominem', 'Red Herring', 'Slippery Slope'], answer: 'Ad Hominem' },
      { q: 'Branch of government that makes laws?', options: ['Executive', 'Judicial', 'Military', 'Legislative'], answer: 'Legislative' },
      { q: 'What is 20% of 80?', options: ['16', '20', '40', '60'], answer: '16' },
      { q: 'A first-hand historical account (like a diary) is a...', options: ['Secondary Source', 'Primary Source', 'Fallacy', 'Hypothesis'], answer: 'Primary Source' },
      { q: 'Energy of motion is called...', options: ['Potential', 'Kinetic', 'Thermal', 'Chemical'], answer: 'Kinetic' },
      { q: 'Stored energy is called...', options: ['Potential', 'Kinetic', 'Nuclear', 'Solar'], answer: 'Potential' },
      { q: 'Exaggerating someone\'s argument to make it easier to attack is...', options: ['Strawman', 'Ad Hominem', 'Ethos', 'Pathos'], answer: 'Strawman' },
      { q: 'Solve: 3(x - 2) = 15', options: ['3', '5', '7', '17'], answer: '7' },
      { q: 'What is the median of this data set: 2, 5, 8, 11, 14?', options: ['5', '8', '11', '40'], answer: '8' },
      { q: 'Which is a Fact, not an Opinion?', options: ['Pizza is best', 'Water boils at 100°C', 'Math is hard', 'Dogs are cute'], answer: 'Water boils at 100°C' },
      { q: 'What you give up to get something else in economics is...', options: ['Inflation', 'Supply', 'Opportunity Cost', 'Demand'], answer: 'Opportunity Cost' },
      { q: 'Power shared between National and State governments is...', options: ['Federalism', 'Monarchy', 'Communism', 'Tyranny'], answer: 'Federalism' },
      { q: 'Which is a transitional word?', options: ['Apple', 'Therefore', 'Quickly', 'Run'], answer: 'Therefore' }
    ]
  };

  const toggleExpand = (name) => setExpandedItem(expandedItem === name ? null : name);

  const startQuiz = () => {
    const pool = quizzes[activeGrade] || [];
    const testLength = activeGrade === 'GED' ? 15 : 10;
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, testLength);
    setActiveQuizPool(shuffled);
    setCurrentQ(0); setScore(0); setShowResults(false); setQuizActive(true);
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
                <button key={g} onClick={() => setActiveGrade(g)} style={{ flex: '0 0 auto', padding: '8px 16px', borderRadius: '8px', background: activeGrade === g ? '#f59e0b' : '#222', color: activeGrade === g ? '#000' : '#888', border: 'none', fontWeight: 'bold' }}>{g}</button>
              ))}
            </div>

            {schoolCurriculum[activeGrade] ? (
              <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b', padding: '0' }}>
                <div style={{ background: '#f59e0b', color: '#000', padding: '15px', borderRadius: '10px 10px 0 0', fontWeight: 'bold', fontSize: '1.1em', textTransform: 'uppercase', textAlign: 'center' }}>
                  {activeGrade === 'GED' ? 'GED Capstone Curriculum' : `Grade ${activeGrade} Curriculum`}
                </div>

                <div style={{ padding: '20px' }}>
                  {/* HUMANITY ENGINE ENCOURAGEMENT */}
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', color: '#3b82f6', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontStyle: 'italic', fontSize: '0.95em', lineHeight: '1.5' }}>
                    <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>💡 A quick note:</span>
                    "{encouragement}"
                  </div>

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
                                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #333', color: '#ccc', fontSize: '0.95em', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                  {item.content}
                                </div>
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
                  <h2 style={{ color: hasPassed ? '#10b981' : '#ef4444', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '2.5em' }}>
                    {hasPassed ? 'PASSED!' : 'FAILED'}
                  </h2>
                  <div style={{ color: '#fff', fontSize: '1.2em', marginBottom: '20px' }}>You scored {score} out of {activeQuizPool.length}.</div>
                  <div style={{ color: '#888', marginBottom: '20px', fontSize: '0.9em' }}>Required to pass: {passThreshold} ({Math.round((passThreshold/activeQuizPool.length)*100)}%)</div>
                  
                  {/* HUMANITY ENGINE: POST-TEST ENCOURAGEMENT */}
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px', marginBottom: '30px', fontStyle: 'italic', color: '#ccc' }}>
                    {hasPassed 
                      ? "Outstanding work. You put in the focus, you trusted the process, and you proved you know this material. Take a breath and be proud of yourself." 
                      : "Failure is just data. It tells you exactly what you need to review. Don't let frustration win. Step back, re-read the curriculum, and hit it again when you're ready."}
                  </div>

                  <button onClick={resetQuiz} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '15px 30px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', width: '100%' }}>
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
