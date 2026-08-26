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
  const [activeGrade, setActiveGrade] = useState('4th');
  const [expandedItem, setExpandedItem] = useState(null);
  
  const [quizActive, setQuizActive] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const gradesList = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', 'GED'];

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
      math: [
        { topic: 'Counting 1-20', content: 'Practice: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20.' },
        { topic: 'Basic Shapes', content: 'Circle (round), Square (4 equal sides), Triangle (3 sides).' },
        { topic: 'Simple Addition', content: 'Adding means putting things together. 1 + 1 = 2.' }
      ],
      science: [
        { topic: 'The Five Senses', content: 'Sight (Eyes), Hearing (Ears), Smell (Nose), Taste (Tongue), Touch (Hands).' },
        { topic: 'Living vs. Non-Living', content: 'Living things grow and breathe (Trees, Dogs). Non-living things do not (Rocks, Cars).' }
      ],
      language: [
        { topic: 'The Alphabet', content: 'There are 26 letters. The letter after A is B. Vowels are A, E, I, O, U.' },
        { topic: 'Sight Words', content: 'Words you should recognize instantly: The, And, Is, It, We, To, You, He, I.' }
      ],
      history: [
        { topic: 'Community Helpers', content: 'Firefighters put out fires. Doctors keep us healthy. Teachers help us learn.' },
        { topic: 'Time & Days', content: 'There are 7 days in a week.' }
      ]
    },
    '1st': { 
      math: [
        { topic: 'Addition & Subtraction (0-20)', content: 'Adding is combining (10 + 5 = 15). Subtraction is taking away (15 - 5 = 10).' },
        { topic: 'Place Value', content: 'Numbers are made of Tens and Ones. In 42, there are 4 Tens and 2 Ones.' },
        { topic: 'Telling Time', content: 'The short hand is the Hour, the long hand is the Minute. There are 60 minutes in 1 hour.' }
      ],
      science: [
        { topic: 'Plant Life Cycles', content: 'Plants start as a Seed, grow roots, sprout into a Seedling, and become an Adult.' },
        { topic: 'Sky Patterns', content: 'The Sun gives us light and warmth during the day. The Moon is out at night.' }
      ],
      language: [
        { topic: 'Sentences & Punctuation', content: 'A sentence always ends with punctuation like a Period (.).' },
        { topic: 'Nouns & Verbs', content: 'A Noun is a person, place, or thing (Apple). A Verb is an action word (Run).' }
      ],
      history: [
        { topic: 'Past vs. Present', content: 'The Past is what happened before. The Present is happening now.' },
        { topic: 'Maps & Globes', content: 'A globe is a round model of the Earth.' }
      ]
    },
    '2nd': { 
      math: [
        { topic: 'Two-Digit Arithmetic', content: 'Adding larger numbers requires stacking them. 25 + 14 = 39. Always start with the ones column.' },
        { topic: 'Money', content: 'A Penny is 1¢. A Nickel is 5¢. A Dime is 10¢. A Quarter is 25¢. 4 Quarters make 1 Dollar ($1.00).' },
        { topic: 'Measurement', content: 'We measure length in inches or centimeters. There are 12 inches in 1 foot.' }
      ],
      science: [
        { topic: 'States of Matter', content: 'Solid (keeps its shape, like ice). Liquid (flows, like water). Gas (spreads out, like steam).' },
        { topic: 'Ecosystems', content: 'A community of living and non-living things working together, like a Forest or a Desert.' }
      ],
      chemistry: [
        { topic: 'Reversible vs Irreversible Changes', content: 'Melting ice is a reversible change. Burning wood is an irreversible change (it becomes ash).' }
      ],
      history: [
        { topic: 'Local Geography & Map Skills', content: 'A Compass Rose shows directions: North, South, East, West.' },
        { topic: 'Civics', content: 'A Mayor is the leader of a city. A Governor leads a state. A President leads a country.' }
      ]
    },
    '3rd': { 
      math: [
        { topic: 'Multiplication', content: 'Multiplication is fast addition. 4 x 5 means four groups of five, which equals 20.' },
        { topic: 'Fractions', content: 'A fraction shows parts of a whole. In 1/2, the top number is the Numerator, and the bottom is the Denominator.' },
        { topic: 'Geometry', content: 'Perimeter is the distance around the outside of a shape. Area is the space inside.' }
      ],
      science: [
        { topic: 'Life Cycles', content: 'Metamorphosis is a drastic physical change in an animal\'s life, like a caterpillar turning into a butterfly.' },
        { topic: 'Forces & Motion', content: 'A Force is a push or a pull on an object. Gravity is a force that pulls things to Earth.' },
        { topic: 'Magnets', content: 'Magnets have a North and South pole. Opposite poles Attract. Like poles Repel.' }
      ],
      chemistry: [
        { topic: 'Atoms & Molecules', content: 'An Atom is the smallest building block of all matter. When two or more atoms bond, they form a Molecule.' }
      ],
      history: [
        { topic: 'World Geography', content: 'There are 7 continents: North America, South America, Europe, Africa, Asia, Australia, and Antarctica.' },
        { topic: 'Ancient Civilizations', content: 'Ancient Egypt was built along the Nile River and is famous for building the Pyramids.' }
      ]
    },
    '4th': {
      math: [
        { topic: 'Multi-Digit Multiplication', content: 'Multiplying larger numbers (e.g., 23 x 14) requires multiplying each digit and adding the partial products.' },
        { topic: 'Equivalent Fractions', content: 'Fractions that look different but have the same value. Example: 1/2 is the same as 2/4 or 4/8.' },
        { topic: 'Lines & Angles', content: 'A Right Angle is exactly 90 degrees (like the corner of a square). Parallel lines never intersect.' }
      ],
      science: [
        { topic: 'Energy Transfer', content: 'Energy cannot be created or destroyed, only transferred. Examples include heat, light, and sound energy.' },
        { topic: 'The Rock Cycle', content: 'Rocks change over time. Igneous (from magma), Sedimentary (from pressed sand/pebbles), Metamorphic (changed by heat/pressure).' }
      ],
      chemistry: [
        { topic: 'Solutions & Mixtures', content: 'A Solute (like salt) dissolves into a Solvent (like water) to create a Solution (saltwater).' }
      ],
      history: [
        { topic: 'State History & Colonization', content: 'The first permanent English settlement in the Americas was Jamestown, founded in 1607.' },
        { topic: 'Westward Expansion', content: 'Pioneers traveled west across North America using trails like the Oregon Trail during the 1800s.' }
      ]
    },
    '5th': {
      math: [
        { topic: 'Decimal Operations', content: 'Adding, subtracting, and multiplying numbers with decimals. Always line up the decimal point when adding!' },
        { topic: 'Volume', content: 'Volume measures the space inside a 3D object. Formula: Length x Width x Height.' },
        { topic: 'Coordinate Planes', content: 'A grid with an X-axis (horizontal) and Y-axis (vertical). The origin is at (0,0).' }
      ],
      science: [
        { topic: 'Cell Structure', content: 'Cells are the basic units of life. The Nucleus is the brain of the cell, and the Mitochondria is the powerhouse.' },
        { topic: 'The Solar System', content: 'The Sun is at the center. The order of planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.' }
      ],
      chemistry: [
        { topic: 'Physical vs. Chemical Changes', content: 'Physical: Changes appearance but not the substance (tearing paper). Chemical: Creates a new substance (rusting iron).' }
      ],
      history: [
        { topic: 'The American Revolution', content: 'The 13 Colonies fought against Great Britain for independence. The Declaration of Independence was signed in 1776.' },
        { topic: 'The U.S. Constitution', content: 'The supreme law of the US, featuring 3 branches of government: Executive, Legislative, and Judicial.' }
      ]
    },
    '6th': {
      math: [
        { topic: 'Ratios & Rates', content: 'A ratio compares two quantities (e.g., 3 apples for every 2 oranges = 3:2). A unit rate is a ratio per 1 unit (e.g., 60 miles per 1 hour).' },
        { topic: 'Algebraic Expressions', content: 'Using letters (variables) to represent numbers. Example: "Five more than x" is written as x + 5.' },
        { topic: 'Negative Numbers', content: 'Numbers less than zero. They are located to the left of zero on a number line.' }
      ],
      science: [
        { topic: 'Plate Tectonics', content: 'The Earth\'s crust is divided into massive plates that move, causing earthquakes, volcanoes, and forming mountains.' },
        { topic: 'Thermal Energy', content: 'Heat transfers in three ways: Conduction (direct contact), Convection (fluids/gases), and Radiation (waves).' }
      ],
      chemistry: [
        { topic: 'The Periodic Table', content: 'A chart organizing all known elements. Oxygen is O, Carbon is C. Columns are "Groups" and rows are "Periods".' },
        { topic: 'Atomic Structure', content: 'Atoms have a nucleus containing Protons (positive) and Neutrons (neutral), surrounded by Electrons (negative).' }
      ],
      history: [
        { topic: 'Ancient Civilizations II', content: 'Mesopotamia (land between the Tigris and Euphrates rivers) is known as the cradle of civilization.' },
        { topic: 'Ancient Rome & Greece', content: 'Greece gave us early democracy and the Olympics. Rome gave us the Republic and massive engineering like aqueducts.' }
      ]
    }
  };

  const quizzes = {
    'K': [
      { q: 'Which shape has exactly 3 sides?', options: ['Circle', 'Square', 'Triangle', 'Rectangle'], answer: 'Triangle' },
      { q: 'What is 1 + 1?', options: ['1', '2', '3', '11'], answer: '2' },
      { q: 'Which body part do we use for the sense of Smell?', options: ['Ears', 'Hands', 'Eyes', 'Nose'], answer: 'Nose' },
      { q: 'Which of these is a Living thing?', options: ['A Rock', 'A Toy Car', 'A Tree', 'A Pencil'], answer: 'A Tree' },
      { q: 'How many days are in a week?', options: ['5', '7', '10', '12'], answer: '7' },
      { q: 'What letter comes after A?', options: ['C', 'B', 'D', 'Z'], answer: 'B' },
      { q: 'What body part do you use to see?', options: ['Eyes', 'Ears', 'Mouth', 'Hands'], answer: 'Eyes' },
      { q: 'Which of these is a Sight Word?', options: ['Tyrannosaurus', 'The', 'Helicopter', 'Photosynthesis'], answer: 'The' },
      { q: 'Who puts out fires?', options: ['Teacher', 'Doctor', 'Firefighter', 'Police Officer'], answer: 'Firefighter' },
      { q: 'Is a dog living or non-living?', options: ['Living', 'Non-Living', 'Both', 'Neither'], answer: 'Living' }
    ],
    '1st': [
      { q: 'How many Tens are in the number 42?', options: ['2', '4', '6', '42'], answer: '4' },
      { q: 'What goes at the end of a regular sentence?', options: ['A Capital Letter', 'A Number', 'A Period (.)', 'A Noun'], answer: 'A Period (.)' },
      { q: 'What is 15 - 5?', options: ['5', '10', '20', '9'], answer: '10' },
      { q: 'Which word is a Verb (an action word)?', options: ['Apple', 'Run', 'School', 'Blue'], answer: 'Run' },
      { q: 'What does a plant start as before it grows?', options: ['A Flower', 'A Leaf', 'A Seed', 'A Tree'], answer: 'A Seed' },
      { q: 'What is 10 + 5?', options: ['11', '12', '15', '20'], answer: '15' },
      { q: 'How many minutes are in an hour?', options: ['30', '50', '60', '100'], answer: '60' },
      { q: 'What gives us light during the day?', options: ['The Moon', 'The Stars', 'The Sun', 'A Lamp'], answer: 'The Sun' },
      { q: 'A globe is a round model of what?', options: ['The Moon', 'The Sun', 'The Earth', 'A City'], answer: 'The Earth' },
      { q: 'Which word is a Noun?', options: ['Jump', 'Apple', 'Quickly', 'Run'], answer: 'Apple' }
    ],
    '2nd': [
      { q: 'What is 25 + 14?', options: ['30', '39', '41', '49'], answer: '39' },
      { q: 'How many quarters make 1 Dollar?', options: ['2', '3', '4', '10'], answer: '4' },
      { q: 'What state of matter is water?', options: ['Solid', 'Liquid', 'Gas', 'Plasma'], answer: 'Liquid' },
      { q: 'Which of these is an ecosystem?', options: ['A Forest', 'A Car', 'A House', 'A Book'], answer: 'A Forest' },
      { q: 'Who is the leader of a city or town?', options: ['President', 'Governor', 'Mayor', 'Teacher'], answer: 'Mayor' },
      { q: 'What shows directions on a map?', options: ['Compass Rose', 'Legend', 'Scale', 'Title'], answer: 'Compass Rose' },
      { q: 'Is melting ice a reversible change?', options: ['Yes', 'No', 'Sometimes', 'Never'], answer: 'Yes' },
      { q: 'What type of change is burning wood?', options: ['Reversible', 'Irreversible', 'Temporary', 'Liquid'], answer: 'Irreversible' },
      { q: 'How many inches are in 1 foot?', options: ['10', '12', '24', '36'], answer: '12' },
      { q: 'Which coin is worth 10¢?', options: ['Penny', 'Nickel', 'Dime', 'Quarter'], answer: 'Dime' }
    ],
    '3rd': [
      { q: 'What is 4 x 5?', options: ['9', '16', '20', '25'], answer: '20' },
      { q: 'In the fraction 1/2, what is the top number called?', options: ['Denominator', 'Numerator', 'Quotient', 'Factor'], answer: 'Numerator' },
      { q: 'What is the process of a caterpillar turning into a butterfly?', options: ['Photosynthesis', 'Erosion', 'Metamorphosis', 'Evaporation'], answer: 'Metamorphosis' },
      { q: 'Opposite poles of a magnet will do what?', options: ['Repel', 'Attract', 'Explode', 'Nothing'], answer: 'Attract' },
      { q: 'Which ancient civilization built the Pyramids?', options: ['Greece', 'Rome', 'Egypt', 'China'], answer: 'Egypt' },
      { q: 'How many continents are there on Earth?', options: ['5', '6', '7', '8'], answer: '7' },
      { q: 'What is the smallest building block of matter?', options: ['Cell', 'Atom', 'Molecule', 'Proton'], answer: 'Atom' },
      { q: 'Two or more atoms bonded together make a...', options: ['Molecule', 'Nucleus', 'Liquid', 'Force'], answer: 'Molecule' },
      { q: 'The distance around the outside of a shape is called its...', options: ['Area', 'Volume', 'Perimeter', 'Mass'], answer: 'Perimeter' },
      { q: 'A push or a pull on an object is called a...', options: ['Friction', 'Gravity', 'Force', 'Energy'], answer: 'Force' }
    ],
    '4th': [
      { q: 'How many degrees is a Right Angle?', options: ['45', '90', '180', '360'], answer: '90' },
      { q: 'Which fraction is equivalent to 1/2?', options: ['1/3', '2/4', '3/8', '4/10'], answer: '2/4' },
      { q: 'Which type of rock is formed by extreme heat and pressure?', options: ['Igneous', 'Sedimentary', 'Metamorphic', 'Lunar'], answer: 'Metamorphic' },
      { q: 'In a saltwater solution, the salt is called the...', options: ['Solvent', 'Mixture', 'Solute', 'Element'], answer: 'Solute' },
      { q: 'What was the first permanent English settlement in the Americas?', options: ['Plymouth', 'Roanoke', 'Jamestown', 'Boston'], answer: 'Jamestown' },
      { q: 'Which lines never intersect?', options: ['Perpendicular', 'Parallel', 'Diagonal', 'Curved'], answer: 'Parallel' },
      { q: 'What dissolves a solute in a solution?', options: ['Solid', 'Solvent', 'Reactant', 'Gas'], answer: 'Solvent' },
      { q: 'Energy cannot be created or destroyed, only...', options: ['Deleted', 'Frozen', 'Transferred', 'Hidden'], answer: 'Transferred' },
      { q: 'What is 10 x 12?', options: ['100', '112', '120', '144'], answer: '120' },
      { q: 'Which trail did pioneers use to travel west in the 1800s?', options: ['Appalachian', 'Oregon Trail', 'Silk Road', 'Route 66'], answer: 'Oregon Trail' }
    ],
    '5th': [
      { q: 'What is the formula for Volume?', options: ['L + W + H', 'L x W x H', 'Base x Height', 'Pi x R'], answer: 'L x W x H' },
      { q: 'What is 0.5 + 0.3?', options: ['0.08', '0.8', '8.0', '1.5'], answer: '0.8' },
      { q: 'Which part of the cell is known as the "powerhouse"?', options: ['Nucleus', 'Membrane', 'Mitochondria', 'Wall'], answer: 'Mitochondria' },
      { q: 'What is at the center of our solar system?', options: ['Earth', 'Mars', 'The Moon', 'The Sun'], answer: 'The Sun' },
      { q: 'Tearing a piece of paper is an example of a...', options: ['Physical Change', 'Chemical Change', 'Reaction', 'Solution'], answer: 'Physical Change' },
      { q: 'Rusting iron is an example of a...', options: ['Physical Change', 'Chemical Change', 'Evaporation', 'Mixture'], answer: 'Chemical Change' },
      { q: 'What year was the Declaration of Independence signed?', options: ['1492', '1776', '1812', '1865'], answer: '1776' },
      { q: 'On a coordinate plane, what is the origin?', options: ['(1,1)', '(0,0)', '(10,10)', '(x,y)'], answer: '(0,0)' },
      { q: 'What is the "brain" of a cell called?', options: ['Nucleus', 'Mitochondria', 'Blood', 'Bone'], answer: 'Nucleus' },
      { q: 'How many branches of government are in the U.S. Constitution?', options: ['1', '2', '3', '5'], answer: '3' }
    ],
    '6th': [
      { q: 'Which shows a ratio of 3 apples to 2 oranges?', options: ['3:2', '2:3', '3+2', '3/5'], answer: '3:2' },
      { q: 'How do you write "five more than x" as an algebraic expression?', options: ['5x', 'x - 5', 'x + 5', '5 / x'], answer: 'x + 5' },
      { q: 'What causes earthquakes and creates mountains?', options: ['Erosion', 'Tornadoes', 'Plate Tectonics', 'Tides'], answer: 'Plate Tectonics' },
      { q: 'Heat transfer through direct contact is called...', options: ['Convection', 'Radiation', 'Conduction', 'Freezing'], answer: 'Conduction' },
      { q: 'What is the chemical symbol for Oxygen?', options: ['Ox', 'O', 'Oxg', 'O2'], answer: 'O' },
      { q: 'Which subatomic particle has a positive charge?', options: ['Electron', 'Neutron', 'Proton', 'Nucleus'], answer: 'Proton' },
      { q: 'Mesopotamia was located between which two rivers?', options: ['Nile & Amazon', 'Tigris & Euphrates', 'Mississippi & Ohio', 'Yellow & Yangtze'], answer: 'Tigris & Euphrates' },
      { q: 'Which ancient civilization gave us early democracy?', options: ['Rome', 'Egypt', 'China', 'Greece'], answer: 'Greece' },
      { q: 'Which number is smaller than -5?', options: ['-2', '0', '-10', '4'], answer: '-10' },
      { q: 'On the periodic table, what are the vertical columns called?', options: ['Rows', 'Periods', 'Groups', 'Sectors'], answer: 'Groups' }
    ]
  };

  const toggleExpand = (name) => setExpandedItem(expandedItem === name ? null : name);

  const handleAnswer = (opt, correct) => {
    if (opt === correct) setScore(s => s + 1);
    if (currentQ < quizzes[activeGrade].length - 1) { setCurrentQ(q => q + 1); } 
    else { setShowResults(true); }
  };

  const resetQuiz = () => { setQuizActive(false); setShowResults(false); setCurrentQ(0); setScore(0); };

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
                  Grade {activeGrade} Curriculum
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
                    <button onClick={() => setQuizActive(true)} style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginTop: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                      📝 Take Grade {activeGrade} Final Exam
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: '#666', fontStyle: 'italic' }}>Curriculum for Grade {activeGrade} is under construction.</div>
            )}
          </div>
        )}

        {/* QUIZ MODAL - 80% TO PASS */}
        {quizActive && quizzes[activeGrade] && (() => {
          const passThreshold = Math.ceil(quizzes[activeGrade].length * 0.8);
          const hasPassed = score >= passThreshold;
          
          return (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#000', zIndex: 100, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f59e0b', paddingBottom: '15px', marginBottom: '20px' }}>
                <h2 style={{ color: '#f59e0b', margin: 0, textTransform: 'uppercase' }}>{activeGrade} Exam</h2>
                <button onClick={resetQuiz} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Exit</button>
              </div>

              {!showResults ? (
                <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
                  <div style={{ color: '#888', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>Question {currentQ + 1} of {quizzes[activeGrade].length}</div>
                  <h3 style={{ color: '#fff', margin: '0 0 20px 0', fontSize: '1.2em', lineHeight: '1.4' }}>{quizzes[activeGrade][currentQ].q}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {quizzes[activeGrade][currentQ].options.map((opt, idx) => (
                      <button key={idx} onClick={() => handleAnswer(opt, quizzes[activeGrade][currentQ].answer)} style={{ background: '#222', color: '#fff', border: '1px solid #444', padding: '15px', borderRadius: '8px', fontSize: '1.05em', textAlign: 'left', fontWeight: 'bold' }}>
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
                  <div style={{ color: '#fff', fontSize: '1.2em', marginBottom: '20px' }}>You scored {score} out of {quizzes[activeGrade].length}.</div>
                  <div style={{ color: '#888', marginBottom: '20px', fontSize: '0.9em' }}>Required to pass: {passThreshold} ({Math.round((passThreshold/quizzes[activeGrade].length)*100)}%)</div>
                  <p style={{ color: '#ccc', marginBottom: '30px' }}>
                    {hasPassed ? `Great job! You have mastered the Grade ${activeGrade} curriculum.` : 'Please review the reference books and try the exam again.'}
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
