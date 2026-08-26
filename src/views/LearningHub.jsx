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
    { name: 'Samhain', date: 'Oct 31st', type: 'Greater Sabbat / Fire Festival', desc: '(Pronounced Sowin). Marks the pagan New Year, Halloween or All Hallows Eve.' },
    { name: 'Yule', date: 'Dec 21st or 22nd', type: 'Lesser Sabbat / Solar Festival', desc: 'Winter Solstice. Shortest day of the year.' }
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
      math: [{ topic: 'Linear Equations', content: 'The slope-intercept form is $y=mx+b$, where $m$ is the slope (rise over run) and $b$ is the y-intercept.' }],
      science: [{ topic: 'Waves', content: 'Electromagnetic waves do not require a medium (e.g., light). Mechanical waves do (e.g., sound).' }],
      chemistry: [{ topic: 'Chemical Reactions', content: 'Reactants turn into Products. The Law of Conservation of Mass states matter cannot be created or destroyed in a reaction.' }],
      history: [{ topic: 'The Civil War', content: 'Fought between the Union (North) and Confederacy (South) from 1861-1865 over state rights and slavery.' }]
    },
    '9th': {
      math: [{ topic: 'Algebra I (Quadratics)', content: 'The standard form is $ax^2+bx+c=0$. The quadratic formula is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$.' }],
      science: [{ topic: 'Cellular Biology', content: 'Mitosis creates two identical daughter cells. Meiosis creates four unique sex cells (gametes).' }],
      chemistry: [{ topic: 'Molar Mass', content: 'A mole is $6.022 \times 10^{23}$ particles. Molar mass converts between grams and moles.' }],
      language: [{ topic: 'Literary Devices', content: 'Metaphors directly compare without "like" or "as". Foreshadowing hints at future plot events.' }]
    },
    '10th': {
      math: [{ topic: 'Geometry', content: 'The Pythagorean Theorem for right triangles is $a^2+b^2=c^2$. The area of a circle is $A=\pi r^2$.' }],
      science: [{ topic: 'Earth & Space', content: 'Stars fuse hydrogen into helium. Supernovas forge heavier elements.' }],
      history: [{ topic: 'World War II', content: 'Fought from 1939-1945. The Axis (Germany, Italy, Japan) vs. the Allies (US, UK, USSR).' }],
      language: [{ topic: 'Rhetoric', content: 'Ethos (credibility), Pathos (emotion), Logos (logic).' }]
    },
    '11th': {
      math: [{ topic: 'Algebra II', content: 'Logarithms are the inverse of exponentials. If $b^y = x$, then $\log_b(x) = y$.' }],
      science: [{ topic: 'Ecology', content: 'Carrying capacity is the maximum population size an environment can sustain indefinitely.' }],
      chemistry: [{ topic: 'Acids & Bases', content: 'The pH scale ranges from 0-14. Less than 7 is acidic, 7 is neutral (pure water), greater than 7 is basic.' }],
      history: [{ topic: 'The Cold War', content: 'A geopolitical standoff between the US (Capitalism) and USSR (Communism) involving nuclear proliferation and proxy wars.' }]
    },
    'GED': {
      math: [{ topic: 'GED Math Core', content: 'You must master linear equations ($y=mx+b$), interpreting graphs, applying geometry formulas ($A=\frac{1}{2}bh$ for triangles), and basic probability.' }],
      science: [{ topic: 'GED Science Core', content: 'Focus on scientific method, interpreting data, and core formulas. Newton\'s Second Law is $F=ma$. Photosynthesis is $$6CO_2+6H_2O\rightarrow C_6H_{12}O_6+6O_2$$' }],
      history: [{ topic: 'GED Social Studies', content: 'Focus on Civics, Economics, and US History. The Constitution separates power to prevent tyranny. Supply and Demand dictate market prices.' }],
      language: [{ topic: 'GED Reading & Language Arts', content: 'You must be able to identify the main idea, evaluate the strength of an author\'s argument, and identify bias or logical fallacies in text.' }]
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
      { q: 'Who is the leader of a city or town?', options: ['President', 'Governor', 'Mayor', 'Teacher'], answer: 'Mayor' },
      { q: 'What shows directions on a map?', options: ['Compass Rose', 'Legend', 'Scale', 'Title'], answer: 'Compass Rose' },
      { q: 'Is melting ice a reversible change?', options: ['Yes', 'No', 'Sometimes', 'Never'], answer: 'Yes' },
      { q: 'What type of change is burning wood?', options: ['Reversible', 'Irreversible', 'Temporary', 'Liquid'], answer: 'Irreversible' },
      { q: 'How many inches are in 1 foot?', options: ['10', '12', '24', '36'], answer: '12' },
      { q: 'Which coin is worth 10¢?', options: ['Penny', 'Nickel', 'Dime', 'Quarter'], answer: 'Dime' },
      { q: 'Which of these is an ecosystem?', options: ['A Forest', 'A Car', 'A House', 'A Book'], answer: 'A Forest' }
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
    ],
    '7th': [
      { q: 'If x > 5, which of the following is a possible value for x?', options: ['4', '5', '6', '-5'], answer: '6' },
      { q: 'What diagram is used to predict genetic probabilities?', options: ['Venn Diagram', 'Pie Chart', 'Punnett Square', 'Histogram'], answer: 'Punnett Square' },
      { q: 'Which trait masks a recessive trait?', options: ['Hidden', 'Dominant', 'Neutral', 'Passive'], answer: 'Dominant' },
      { q: 'A proportion states that two ratios are...', options: ['Unequal', 'Opposites', 'Equal', 'Negative'], answer: 'Equal' },
      { q: 'Elements in the same Group on the Periodic Table share...', options: ['Atomic Mass', 'Chemical Properties', 'Proton count', 'Nothing'], answer: 'Chemical Properties' },
      { q: 'Feudalism is a system based on the exchange of land for...', options: ['Money', 'Military Service & Labor', 'Titles', 'Religious freedom'], answer: 'Military Service & Labor' },
      { q: 'In genetics, DNA stands for Deoxyribonucleic...', options: ['Atom', 'Acid', 'Base', 'Alloy'], answer: 'Acid' },
      { q: 'What is a mathematical sentence that contains an equals sign called?', options: ['Expression', 'Variable', 'Equation', 'Inequality'], answer: 'Equation' },
      { q: 'What carries genetic information in living things?', options: ['RNA', 'DNA', 'Proteins', 'Lipids'], answer: 'DNA' },
      { q: 'Which period in history is associated with knights, lords, and peasants?', options: ['Renaissance', 'Industrial', 'Medieval', 'Modern'], answer: 'Medieval' }
    ],
    '8th': [
      { q: 'In the equation y = mx + b, what does "m" represent?', options: ['Y-intercept', 'Variable', 'Slope', 'Origin'], answer: 'Slope' },
      { q: 'Which type of wave does NOT require a medium to travel?', options: ['Sound', 'Mechanical', 'Electromagnetic', 'Ocean'], answer: 'Electromagnetic' },
      { q: 'The Law of Conservation of Mass states that matter cannot be...', options: ['Heated or Cooled', 'Created or Destroyed', 'Solid or Liquid', 'Mixed'], answer: 'Created or Destroyed' },
      { q: 'The US Civil War was fought between the Union and the...', options: ['British', 'French', 'Confederacy', 'Spanish'], answer: 'Confederacy' },
      { q: 'In a chemical reaction, the starting materials are called...', options: ['Products', 'Yields', 'Reactants', 'Isotopes'], answer: 'Reactants' },
      { q: 'What is the y-intercept in the equation y = 2x + 4?', options: ['2', 'x', 'y', '4'], answer: '4' },
      { q: 'Which war took place from 1861 to 1865 in America?', options: ['Revolutionary War', 'WWI', 'Civil War', 'Vietnam War'], answer: 'Civil War' },
      { q: 'Rise over run is the formula for calculating...', options: ['Area', 'Slope', 'Volume', 'Perimeter'], answer: 'Slope' },
      { q: 'Light is an example of what kind of wave?', options: ['Mechanical', 'Electromagnetic', 'Sound', 'Seismic'], answer: 'Electromagnetic' },
      { q: 'In y = mx + b, what does "b" represent?', options: ['Slope', 'X-intercept', 'Y-intercept', 'Origin'], answer: 'Y-intercept' }
    ],
    '9th': [
      { q: 'What is the standard form of a quadratic equation?', options: ['y=mx+b', 'ax^2+bx+c=0', 'a^2+b^2=c^2', 'A=pi*r^2'], answer: 'ax^2+bx+c=0' },
      { q: 'Which process creates two identical daughter cells?', options: ['Meiosis', 'Osmosis', 'Mitosis', 'Photosynthesis'], answer: 'Mitosis' },
      { q: 'A mole contains approximately how many particles?', options: ['1 Million', '6.022 x 10^23', '3.14', '100'], answer: '6.022 x 10^23' },
      { q: 'Which literary device compares two things without using "like" or "as"?', options: ['Simile', 'Foreshadowing', 'Metaphor', 'Hyperbole'], answer: 'Metaphor' },
      { q: 'Meiosis is the process of creating what kind of cells?', options: ['Skin cells', 'Brain cells', 'Identical cells', 'Sex cells (gametes)'], answer: 'Sex cells (gametes)' },
      { q: 'What hints at future events in a story?', options: ['Flashback', 'Foreshadowing', 'Metaphor', 'Irony'], answer: 'Foreshadowing' },
      { q: 'What is used to convert between grams and moles?', options: ['Atomic radius', 'Molar mass', 'Volume', 'Density'], answer: 'Molar mass' },
      { q: 'What shape does a graphed quadratic equation make?', options: ['Straight line', 'Circle', 'Parabola (U-shape)', 'Wave'], answer: 'Parabola (U-shape)' },
      { q: 'Which formula solves for x in a quadratic equation?', options: ['Pythagorean', 'Quadratic Formula', 'Slope-intercept', 'Distance formula'], answer: 'Quadratic Formula' },
      { q: 'If a cell has 46 chromosomes, how many will a daughter cell have after mitosis?', options: ['23', '46', '92', '0'], answer: '46' }
    ],
    '10th': [
      { q: 'What is the Pythagorean Theorem?', options: ['A=pi*r^2', 'y=mx+b', 'a^2+b^2=c^2', 'F=ma'], answer: 'a^2+b^2=c^2' },
      { q: 'How do stars generate energy?', options: ['Fission', 'Burning coal', 'Fusing hydrogen into helium', 'Reflecting light'], answer: 'Fusing hydrogen into helium' },
      { q: 'Which countries made up the Axis powers in WWII?', options: ['US, UK, USSR', 'Germany, Italy, Japan', 'France, China, Spain', 'Germany, Russia, France'], answer: 'Germany, Italy, Japan' },
      { q: 'In rhetoric, what does "Logos" appeal to?', options: ['Emotion', 'Credibility', 'Logic', 'Fear'], answer: 'Logic' },
      { q: 'What is the formula for the area of a circle?', options: ['A=pi*r^2', 'A=2*pi*r', 'A=l*w', 'A=1/2*b*h'], answer: 'A=pi*r^2' },
      { q: 'What event forged the heavy elements in the universe?', options: ['Big Bang', 'Supernovas', 'Black Holes', 'Solar Flares'], answer: 'Supernovas' },
      { q: 'What year did WWII end?', options: ['1918', '1939', '1945', '1965'], answer: '1945' },
      { q: 'In rhetoric, "Ethos" relies on establishing what?', options: ['Logic', 'Anger', 'Credibility/Authority', 'Sadness'], answer: 'Credibility/Authority' },
      { q: 'The Pythagorean Theorem only applies to what kind of triangles?', options: ['Isosceles', 'Equilateral', 'Right', 'Scalene'], answer: 'Right' },
      { q: 'Which rhetoric technique appeals to the audience\'s emotions?', options: ['Logos', 'Pathos', 'Ethos', 'Mythos'], answer: 'Pathos' }
    ],
    '11th': [
      { q: 'What is the mathematical inverse of an exponential function?', options: ['Derivative', 'Integral', 'Logarithm', 'Polynomial'], answer: 'Logarithm' },
      { q: 'What is the maximum population size an environment can sustain called?', options: ['Growth rate', 'Carrying capacity', 'Death rate', 'Biome limit'], answer: 'Carrying capacity' },
      { q: 'On the pH scale, a value of 2 is considered...', options: ['Neutral', 'Basic', 'Acidic', 'Alkaline'], answer: 'Acidic' },
      { q: 'The Cold War was primarily a standoff between the US and...', options: ['China', 'Germany', 'The USSR', 'Japan'], answer: 'The USSR' },
      { q: 'If b^y = x, then log_b(x) = ?', options: ['b', 'x', 'y', '1'], answer: 'y' },
      { q: 'Pure water has a pH of exactly...', options: ['0', '7', '14', '10'], answer: '7' },
      { q: 'Which economic system was the USSR promoting during the Cold War?', options: ['Capitalism', 'Feudalism', 'Communism', 'Monarchy'], answer: 'Communism' },
      { q: 'A substance with a pH of 12 is a...', options: ['Strong Acid', 'Weak Acid', 'Neutral', 'Base'], answer: 'Base' },
      { q: 'What does "proxy war" mean in the context of the Cold War?', options: ['Nuclear war', 'Wars fought through supported third parties', 'Cyber warfare', 'Trade embargoes'], answer: 'Wars fought through supported third parties' },
      { q: 'In a log equation log_10(100) = 2, what is the base?', options: ['2', '10', '100', '0'], answer: '10' }
    ],
    'GED': [
      { q: 'According to Newton\'s Second Law, Force equals Mass times...', options: ['Velocity', 'Acceleration', 'Gravity', 'Energy'], answer: 'Acceleration' },
      { q: 'In economics, if Supply is low and Demand is high, what happens to the Price?', options: ['It drops', 'It stays the same', 'It rises', 'It becomes free'], answer: 'It rises' },
      { q: 'Which equation represents a linear relationship?', options: ['y=x^2', 'y=mx+b', 'A=pi*r^2', 'E=mc^2'], answer: 'y=mx+b' },
      { q: 'What is the primary purpose of the US Constitution separating government powers?', options: ['To save money', 'To prevent tyranny (Checks & Balances)', 'To speed up laws', 'To elect presidents faster'], answer: 'To prevent tyranny (Checks & Balances)' },
      { q: 'What gas do plants take in during photosynthesis?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide (CO2)', 'Helium'], answer: 'Carbon Dioxide (CO2)' },
      { q: 'When evaluating an author\'s argument, you should look out for...', options: ['Page count', 'Logical fallacies and bias', 'Font size', 'Chapter titles'], answer: 'Logical fallacies and bias' },
      { q: 'What is the formula for the area of a triangle?', options: ['A=bh', 'A=1/2*bh', 'A=pi*r^2', 'A=L+W'], answer: 'A=1/2*bh' },
      { q: 'What are the products of photosynthesis?', options: ['Water and Light', 'Carbon Dioxide and Soil', 'Glucose (Sugar) and Oxygen', 'Heat and Nitrogen'], answer: 'Glucose (Sugar) and Oxygen' },
      { q: 'In reading comprehension, the "main idea" is...', options: ['A minor detail', 'The central point the author is making', 'The last sentence', 'The author\'s name'], answer: 'The central point the author is making' },
      { q: 'If a car accelerates at 5 m/s^2 and has a mass of 1000 kg, what is the Force? (F=ma)', options: ['200 N', '1005 N', '5000 N', '50000 N'], answer: '5000 N' }
    ]
  };

  // --- ACTIONS ---
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
                    <button onClick={() => setQuizActive(true)} style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginTop: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
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
