import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LearningHub() {
  const navigate = useNavigate();

  // Navigation State
  const [activeCategory, setActiveCategory] = useState('starthere');
  const [activeSubTab, setActiveSubTab] = useState('wicca');
  const [activeTarotTab, setActiveTarotTab] = useState('basics');
  const [activeWiccaTab, setActiveWiccaTab] = useState('intro'); // Default to History/Intro
  
  // School & Quiz State
  const [activeGrade, setActiveGrade] = useState('GED');
  const [expandedItem, setExpandedItem] = useState(null);
  
  const [quizActive, setQuizActive] = useState(false);
  const [activeQuizPool, setActiveQuizPool] = useState([]); 
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const gradesList = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', 'GED'];

  // --- SUPERNATURAL DATABASES ---
  const wiccaIntro = {
    title: "History & The Wiccan Path",
    content: "Wicca is a modern pagan, nature-based spiritual path and lifestyle. It was introduced to the public in the 1950s by Gerald Gardner, drawing heavily upon ancient European pagan traditions, folklore, and hermetic philosophies. Rather than a highly dogmatic religion with strict rules, Wicca is largely decentralized. Practitioners (often called Witches or Wiccans) focus on personal responsibility, reverence for the earth, and the dualistic balance of nature (often personified as a Moon Goddess and a Horned God). People study and adopt this lifestyle to reconnect with natural cycles, practice mindfulness, and reclaim their personal and spiritual sovereignty."
  };

  const wiccanRede = {
    title: "The Wiccan Rede & Rule of Three",
    content: "Because Wicca lacks a central authority or 'sin' based commandments, its core moral framework is summarized in the Wiccan Rede: 'Eight words the Wiccan Rede fulfill, An it harm none do what ye will.' This emphasizes absolute personal freedom, so long as your actions do not bring physical or emotional harm to yourself or others. This is inherently paired with the 'Rule of Three' (or Threefold Law), the karmic belief that whatever energy a person puts out into the world—be it positive or negative—will be returned to them three times over."
  };

  const tarotDeck = [
    { name: '0 - The Fool', keywords: 'New beginnings, spontaneity, blind faith', desc: 'Represents a leap into the unknown. A reminder to embrace chaos and trust the journey.' },
    { name: 'I - The Magician', keywords: 'Willpower, manifestation, resourcefulness', desc: 'You have the tools and the power to manipulate your reality.' }
  ];

  const elementsDB = [
    { name: 'Earth', color: 'Green or Brown', direction: 'North', props: 'Grounding, nurturing, supportive, stable, feminine & receptive', desc: 'Represents the very base of existence; it is the foundation. It is the element of unshakeable physicality. All that is solid, 3D.' },
    { name: 'Air', color: 'Yellow', direction: 'East', props: 'Transport, movement, communication, sound, intellect, travel', desc: 'Represents movement & the breath of life. Masculine & projective.' },
    { name: 'Water', color: 'Blue', direction: 'West', props: 'Cleansing, healing, purifying, feminine & receptive', desc: 'Corresponds to emotions.' },
    { name: 'Fire', color: 'Red', direction: 'South', props: 'Transformative, destructive, purifying, passionate, consuming, masculine, projective', desc: 'Represents swift transformation.' },
    { name: 'Spirit (Aether)', color: 'Black/White', direction: 'Center/All', props: 'Raw potentiality, being and un-being', desc: 'It is the prime divine essence. It is the space in which all exists & it is what binds all matter.' }
  ];

  const sabbatsDB = [
    { name: 'Samhain', date: 'Oct 31st', type: 'Greater Sabbat / Fire Festival', desc: '(Pronounced Sowin). Marks the pagan New Year, Halloween or All Hallows Eve. The veil between worlds is thinnest. Time for divination and honoring ancestors.' },
    { name: 'Yule', date: 'Dec 21st or 22nd', type: 'Lesser Sabbat / Solar Festival', desc: 'Winter Solstice. Shortest day of the year. Celebrated as the rebirth of the sun. Traditions include the yule log and decorating with holly.' },
    { name: 'Imbolc', date: 'Feb 1st or 2nd', type: 'Greater Sabbat / Fire Festival', desc: 'Marks the successful completion of winter. A time of purification, clearing out the old, and preparing for the new spring growth.' },
    { name: 'Ostara', date: 'March 21st or 22nd', type: 'Lesser Sabbat / Solar Festival', desc: 'Spring Equinox. Day and night are of equal length. Represents perfect equilibrium and incorporates fertility symbols like eggs and hares.' },
    { name: 'Beltane', date: 'May 1st', type: 'Greater Sabbat / Fire Festival', desc: 'The final fertility festival of spring. A celebration of life, passion, and the awakening of nature. Celebrations include maypoles and bonfires.' },
    { name: 'Litha', date: 'June 21st or 22nd', type: 'Lesser Sabbat / Solar Festival', desc: 'Summer Solstice / Midsummer. The longest day of the year. A celebration of light and the peak of the sun\'s power before the days begin to shorten.' },
    { name: 'Lammas / Lughnasadh', date: 'Aug 1st or 2nd', type: 'Greater Sabbat / Fire Festival', desc: 'Festival of the first harvest. A time of reaping what has been sown and showing gratitude for the earth\'s bounty.' },
    { name: 'Mabon', date: 'Sept 21st or 22nd', type: 'Lesser Sabbat / Solar Festival', desc: 'Autumn Equinox. The second harvest. A time of balance and reflection, giving thanks for the fruits of the earth before the descent into winter.' }
  ];

  const lunarDB = [
    { name: 'The Triple Goddess', type: 'Archetypes', desc: 'The Maiden (New/Waxing Moon): Wild and developing. The Mother (Full Moon): Potent creative power. The Crone (Waning/Dark Moon): Wise and experienced.' },
    { name: 'Esbats', type: 'Lunar Magick', desc: 'Gatherings to perform rites and magickal works utilizing the phases of the moon. A 13th full moon in a solar year is a Blue Moon.' },
    { name: 'Dark Moon', type: 'Death / Shadow', desc: 'Exceptionally potent for Shadow Work. Most conductive time for urgent, forceful banishing.' },
    { name: 'New Moon', type: 'Rebirth', desc: 'Prime workings: blessing new projects, setting intentions to reinvent yourself, scouting new ideas.' },
    { name: 'Waxing Moon', type: 'Solar Spring', desc: 'Spells for any type of gain or increase correspond with this energy.' },
    { name: 'Full Moon', type: 'Potent Power', desc: 'Most potent time to do any magickal work. Invoking, protecting, or healing.' },
    { name: 'Waning Moon', type: 'Solar Autumn', desc: 'About diminishing and clearing things out. Workings to gradually and organically banish are optimal here.' }
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
      science: [{ topic: 'Cell Division', content: 'Mitosis creates two identical diploid daughter cells. Meiosis creates four unique haploid sex cells (gametes).' }],
      chemistry: [{ topic: 'Stoichiometry & Moles', content: 'A mole is 6.022 x 10^23 particles (Avogadro\'s number). Molar mass converts between grams and moles.' }],
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
      math: [{ topic: 'GED Math Core', content: 'Master solving multi-step linear equations, evaluating functions, calculating slopes, and interpreting data graphs.' }],
      science: [{ topic: 'GED Science Core', content: 'Focus on scientific method, interpreting data, and core formulas (Punnett squares and F=ma).' }],
      history: [{ topic: 'GED Social Studies', content: 'Economics: Supply/Demand. Civics: Checks & Balances. History: Key amendments (1st: Speech, 13th: Abolish slavery).' }],
      language: [{ topic: 'GED Reading & Language Arts', content: 'Identify the main idea, evaluate the strength of an author\'s argument, identify bias, and understand text structure.' }]
    }
  };

  const quizzes = {
    'K': [
      { q: 'Which shape has exactly 3 sides?', options: ['Circle', 'Square', 'Triangle', 'Rectangle'], answer: 'Triangle' },
      { q: 'What is 1 + 1?', options: ['1', '2', '3', '11'], answer: '2' },
      { q: 'Which body part do we use for the sense of Smell?', options: ['Ears', 'Hands', 'Eyes', 'Nose'], answer: 'Nose' },
      { q: 'Which of these is a Living thing?', options: ['A Rock', 'A Toy Car', 'A Tree', 'A Pencil'], answer: 'A Tree' },
      { q: 'How many days are in a week?', options: ['5', '7', '10', '12'], answer: '7' }
    ],
    '1st': [
      { q: 'How many Tens are in the number 42?', options: ['2', '4', '6', '42'], answer: '4' },
      { q: 'What goes at the end of a regular sentence?', options: ['A Capital Letter', 'A Number', 'A Period (.)', 'A Noun'], answer: 'A Period (.)' },
      { q: 'What is 15 - 5?', options: ['5', '10', '20', '9'], answer: '10' },
      { q: 'Which word is a Verb (an action word)?', options: ['Apple', 'Run', 'School', 'Blue'], answer: 'Run' },
      { q: 'What does a plant start as before it grows?', options: ['A Flower', 'A Leaf', 'A Seed', 'A Tree'], answer: 'A Seed' }
    ],
    '2nd': [
      { q: 'What is 25 + 14?', options: ['30', '39', '41', '49'], answer: '39' },
      { q: 'How many quarters make 1 Dollar?', options: ['2', '3', '4', '10'], answer: '4' },
      { q: 'What state of matter is water?', options: ['Solid', 'Liquid', 'Gas', 'Plasma'], answer: 'Liquid' },
      { q: 'Who is the leader of a city or town?', options: ['President', 'Governor', 'Mayor', 'Teacher'], answer: 'Mayor' },
      { q: 'What shows directions on a map?', options: ['Compass Rose', 'Legend', 'Scale', 'Title'], answer: 'Compass Rose' }
    ],
    '3rd': [
      { q: 'What is 4 x 5?', options: ['9', '16', '20', '25'], answer: '20' },
      { q: 'In the fraction 1/2, what is the top number called?', options: ['Denominator', 'Numerator', 'Quotient', 'Factor'], answer: 'Numerator' },
      { q: 'What is the process of a caterpillar turning into a butterfly?', options: ['Photosynthesis', 'Erosion', 'Metamorphosis', 'Evaporation'], answer: 'Metamorphosis' },
      { q: 'Opposite poles of a magnet will do what?', options: ['Repel', 'Attract', 'Explode', 'Nothing'], answer: 'Attract' },
      { q: 'Which ancient civilization built the Pyramids?', options: ['Greece', 'Rome', 'Egypt', 'China'], answer: 'Egypt' }
    ],
    '4th': [
      { q: 'How many degrees is a Right Angle?', options: ['45', '90', '180', '360'], answer: '90' },
      { q: 'Which type of rock is formed by extreme heat and pressure?', options: ['Igneous', 'Sedimentary', 'Metamorphic', 'Lunar'], answer: 'Metamorphic' },
      { q: 'In a saltwater solution, the salt is called the...', options: ['Solvent', 'Mixture', 'Solute', 'Element'], answer: 'Solute' },
      { q: 'What was the first permanent English settlement in the Americas?', options: ['Plymouth', 'Roanoke', 'Jamestown', 'Boston'], answer: 'Jamestown' },
      { q: 'Which lines never intersect?', options: ['Perpendicular', 'Parallel', 'Diagonal', 'Curved'], answer: 'Parallel' }
    ],
    '5th': [
      { q: 'What is the formula for Volume?', options: ['L + W + H', 'L x W x H', 'Base x Height', 'Pi x R'], answer: 'L x W x H' },
      { q: 'Which part of the cell is known as the "powerhouse"?', options: ['Nucleus', 'Membrane', 'Mitochondria', 'Wall'], answer: 'Mitochondria' },
      { q: 'What is at the center of our solar system?', options: ['Earth', 'Mars', 'The Moon', 'The Sun'], answer: 'The Sun' },
      { q: 'Tearing a piece of paper is an example of a...', options: ['Physical Change', 'Chemical Change', 'Reaction', 'Solution'], answer: 'Physical Change' },
      { q: 'What year was the Declaration of Independence signed?', options: ['1492', '1776', '1812', '1865'], answer: '1776' }
    ],
    '6th': [
      { q: 'Which shows a ratio of 3 apples to 2 oranges?', options: ['3:2', '2:3', '3+2', '3/5'], answer: '3:2' },
      { q: 'What causes earthquakes and creates mountains?', options: ['Erosion', 'Tornadoes', 'Plate Tectonics', 'Tides'], answer: 'Plate Tectonics' },
      { q: 'Heat transfer through direct contact is called...', options: ['Convection', 'Radiation', 'Conduction', 'Freezing'], answer: 'Conduction' },
      { q: 'Which subatomic particle has a positive charge?', options: ['Electron', 'Neutron', 'Proton', 'Nucleus'], answer: 'Proton' },
      { q: 'Which ancient civilization gave us early democracy?', options: ['Rome', 'Egypt', 'China', 'Greece'], answer: 'Greece' }
    ],
    '7th': [
      { q: 'If x > 5, which of the following is a possible value for x?', options: ['4', '5', '6', '-5'], answer: '6' },
      { q: 'What diagram is used to predict genetic probabilities?', options: ['Venn Diagram', 'Pie Chart', 'Punnett Square', 'Histogram'], answer: 'Punnett Square' },
      { q: 'Elements in the same Group on the Periodic Table share...', options: ['Atomic Mass', 'Chemical Properties', 'Proton count', 'Nothing'], answer: 'Chemical Properties' },
      { q: 'Feudalism is a system based on the exchange of land for...', options: ['Money', 'Military Service', 'Titles', 'Freedom'], answer: 'Military Service' },
      { q: 'What carries genetic information in living things?', options: ['RNA', 'DNA', 'Proteins', 'Lipids'], answer: 'DNA' }
    ],
    '8th': [
      { q: 'In the equation y = mx + b, what does "m" represent?', options: ['Y-intercept', 'Variable', 'Slope', 'Origin'], answer: 'Slope' },
      { q: 'Which type of wave does NOT require a medium to travel?', options: ['Sound', 'Mechanical', 'Electromagnetic', 'Ocean'], answer: 'Electromagnetic' },
      { q: 'The US Civil War was fought between the Union and the...', options: ['British', 'French', 'Confederacy', 'Spanish'], answer: 'Confederacy' },
      { q: 'In a chemical reaction, the starting materials are called...', options: ['Products', 'Yields', 'Reactants', 'Isotopes'], answer: 'Reactants' },
      { q: 'Rise over run is the formula for calculating...', options: ['Area', 'Slope', 'Volume', 'Perimeter'], answer: 'Slope' }
    ],
    '9th': [
      { q: 'Solve for x: 2x - 4 = 10', options: ['5', '7', '8', '14'], answer: '7' },
      { q: 'What is the standard form of a quadratic equation?', options: ['y=mx+b', 'ax^2+bx+c=0', 'a^2+b^2=c^2', 'A=pi*r^2'], answer: 'ax^2+bx+c=0' },
      { q: 'Which process creates two identical daughter cells?', options: ['Meiosis', 'Osmosis', 'Mitosis', 'Photosynthesis'], answer: 'Mitosis' },
      { q: 'Which literary device compares two things without using "like" or "as"?', options: ['Simile', 'Foreshadowing', 'Metaphor', 'Hyperbole'], answer: 'Metaphor' },
      { q: 'What hints at future events in a story?', options: ['Flashback', 'Foreshadowing', 'Metaphor', 'Irony'], answer: 'Foreshadowing' }
    ],
    '10th': [
      { q: 'According to Newton\'s 2nd Law, Force equals mass times...', options: ['Velocity', 'Gravity', 'Acceleration', 'Inertia'], answer: 'Acceleration' },
      { q: 'Which countries made up the Axis powers in WWII?', options: ['US, UK, USSR', 'Germany, Italy, Japan', 'France, China', 'Germany, Russia'], answer: 'Germany, Italy, Japan' },
      { q: 'What is the formula for the area of a circle?', options: ['A=pi*r^2', 'A=2*pi*r', 'A=l*w', 'A=1/2*b*h'], answer: 'A=pi*r^2' },
      { q: 'In rhetoric, "Ethos" relies on establishing what?', options: ['Logic', 'Anger', 'Credibility/Authority', 'Sadness'], answer: 'Credibility/Authority' },
      { q: 'In trigonometry, Sine (SOH) is calculated by...', options: ['Adj/Hyp', 'Opp/Adj', 'Opp/Hyp', 'Hyp/Opp'], answer: 'Opp/Hyp' }
    ],
    '11th': [
      { q: 'What is the mathematical inverse of an exponential function?', options: ['Derivative', 'Integral', 'Logarithm', 'Polynomial'], answer: 'Logarithm' },
      { q: 'What does the 2nd Law of Thermodynamics state about isolated systems?', options: ['Energy is destroyed', 'Entropy always increases', 'Mass is conserved', 'Gravity weakens'], answer: 'Entropy always increases' },
      { q: 'On the pH scale, a value of 2 is considered...', options: ['Neutral', 'Basic', 'Acidic', 'Alkaline'], answer: 'Acidic' },
      { q: 'The Cold War was primarily a standoff between the US and...', options: ['China', 'Germany', 'The USSR', 'Japan'], answer: 'The USSR' },
      { q: 'What does "proxy war" mean in the context of the Cold War?', options: ['Nuclear war', 'Wars fought through third parties', 'Cyber warfare', 'Trade embargoes'], answer: 'Wars fought through third parties' }
    ],
    'GED': [
      { q: 'Solve for x: 4x + 10 = 30', options: ['4', '5', '10', '20'], answer: '5' },
      { q: 'According to Newton\'s Second Law, if m=10kg and a=5m/s^2, what is the Force?', options: ['2 N', '15 N', '50 N', '500 N'], answer: '50 N' },
      { q: 'In economics, if supply increases and demand remains the same, what happens to the price?', options: ['It drops', 'It rises', 'It stays the same', 'It doubles'], answer: 'It drops' },
      { q: 'Which US Constitutional Amendment abolished slavery?', options: ['1st', '2nd', '13th', '19th'], answer: '13th' },
      { q: 'What is the primary purpose of Checks and Balances in the US government?', options: ['To speed up laws', 'To prevent any one branch from becoming too powerful', 'To raise taxes', 'To elect officials'], answer: 'To prevent any one branch from becoming too powerful' },
      { q: 'What gas is a product of photosynthesis that humans need to survive?', options: ['Carbon Dioxide', 'Nitrogen', 'Oxygen', 'Helium'], answer: 'Oxygen' },
      { q: 'In an experiment, what is the "control" variable?', options: ['The part that is measured', 'The part that is kept the same', 'The part that changes', 'The hypothesis'], answer: 'The part that is kept the same' },
      { q: 'A logical fallacy is...', options: ['A strong argument', 'A flaw in reasoning that weakens the argument', 'A metaphor', 'A historical fact'], answer: 'A flaw in reasoning that weakens the argument' }
    ]
  };

  const toggleExpand = (name) => setExpandedItem(expandedItem === name ? null : name);

  const startQuiz = () => {
    const pool = quizzes[activeGrade] || [];
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
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
                  {['math', 'science', 'chemistry', 'history', 'language'].map((subj) => (
                    schoolCurriculum[activeGrade][subj]?.length > 0 && (
                      <div key={subj} style={{ marginBottom: '20px' }}>
                        <div style={{ color: '#fff', fontSize: '1.1em', textTransform: 'uppercase', fontWeight: '900', borderBottom: '2px solid #333', paddingBottom: '5px', marginBottom: '10px' }}>
                          {subj === 'math' ? '🔢 Math' : subj === 'science' ? '🔬 Science' : subj === 'chemistry' ? '🧪 Chemistry' : subj === 'language' ? '📖 Language & Reading' : '🌍 History & Civics'}
                        </div>
                        {schoolCurriculum[activeGrade][subj].map((item, idx) => (
                          <div key={idx} style={{ background: '#0a0a0a', padding: '12px', borderRadius: '6px', marginBottom: '8px', borderLeft: '2px solid #555' }}>
                            <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '4px' }}>{item.topic}</strong><div style={{ color: '#ccc', fontSize: '0.95em', lineHeight: '1.5' }}>{item.content}</div>
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
            ) : <div style={{ textAlign: 'center', padding: '30px', color: '#666', fontStyle: 'italic' }}>Curriculum for {activeGrade} is under construction.</div>}
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
                      <button key={idx} onClick={() => handleAnswer(opt, activeQuizPool[currentQ].answer)} style={{ background: '#222', color: '#fff', border: '1px solid #444', padding: '15px', borderRadius: '8px', fontSize: '1.05em', textAlign: 'left', fontWeight: 'bold' }}>{opt}</button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ background: '#111', padding: '30px 20px', borderRadius: '12px', border: `2px solid ${hasPassed ? '#10b981' : '#ef4444'}`, textAlign: 'center' }}>
                  <h2 style={{ color: hasPassed ? '#10b981' : '#ef4444', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '2em' }}>{hasPassed ? 'PASSED!' : 'FAILED'}</h2>
                  <div style={{ color: '#fff', fontSize: '1.2em', marginBottom: '20px' }}>You scored {score} out of {activeQuizPool.length}.</div>
                  <div style={{ color: '#888', marginBottom: '20px', fontSize: '0.9em' }}>Required to pass: {passThreshold} ({Math.round((passThreshold/activeQuizPool.length)*100)}%)</div>
                  <p style={{ color: '#ccc', marginBottom: '30px' }}>{hasPassed ? `Great job! You have mastered the ${activeGrade} curriculum.` : 'Please review the reference books and try the exam again.'}</p>
                  <button onClick={resetQuiz} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '15px 30px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>Return to Books</button>
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
              <div style={{ borderTop: '1px solid #222', paddingTop: '15px' }}>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
                  <button onClick={() => setActiveWiccaTab('intro')} style={tertTabStyle('intro', activeWiccaTab, '#10b981')}>History & Path</button>
                  <button onClick={() => setActiveWiccaTab('lunar')} style={tertTabStyle('lunar', activeWiccaTab, '#10b981')}>Lunar Cycles</button>
                  <button onClick={() => setActiveWiccaTab('elements')} style={tertTabStyle('elements', activeWiccaTab, '#10b981')}>The 5 Elements</button>
                  <button onClick={() => setActiveWiccaTab('rede')} style={tertTabStyle('rede', activeWiccaTab, '#10b981')}>Wiccan Rede</button>
                  <button onClick={() => setActiveWiccaTab('sabbats')} style={tertTabStyle('sabbats', activeWiccaTab, '#10b981')}>The Sabbats</button>
                </div>

                {activeWiccaTab === 'intro' && (
                  <div style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                    <h3 style={{ color: '#10b981', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '1.1em' }}>{wiccaIntro.title}</h3>
                    <div style={{ color: '#eee', lineHeight: '1.6', fontSize: '0.95em' }}>{wiccaIntro.content}</div>
                  </div>
                )}

                {activeWiccaTab === 'rede' && (
                  <div style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
                    <h3 style={{ color: '#10b981', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '1.1em' }}>{wiccanRede.title}</h3>
                    <div style={{ color: '#eee', lineHeight: '1.6', fontSize: '0.95em' }}>{wiccanRede.content}</div>
                  </div>
                )}

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
          </div>
        )}

      </div>
    </div>
  );
}
