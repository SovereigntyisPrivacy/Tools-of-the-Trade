import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LearningHub() {
  const navigate = useNavigate();

  // Navigation State
  const [activeCategory, setActiveCategory] = useState('school');
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
    setEncouragement(encouragements[Math.floor(Math.random() * encouragements.length)]);
  }, [activeGrade]);

  const gradesList = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', 'GED'];

  // --- SUPERNATURAL DATABASES ---
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
      math: [{ topic: 'Addition (0-20)', content: 'Adding is combining (10 + 5 = 15).' }],
      science: [{ topic: 'Plant Life Cycles', content: 'Seed -> Seedling -> Adult Plant.' }],
      language: [{ topic: 'Sentences', content: 'A sentence ends with a Period (.).' }],
      history: [{ topic: 'Past vs. Present', content: 'The Past is before. The Present is now.' }]
    },
    '2nd': { 
      math: [{ topic: 'Money', content: 'Penny 1¢, Nickel 5¢, Dime 10¢, Quarter 25¢. 4 Quarters = $1.00.' }],
      science: [{ topic: 'States of Matter', content: 'Solid, Liquid, Gas.' }],
      history: [{ topic: 'Civics', content: 'A Mayor leads a city. A Governor leads a state. A President leads a country.' }]
    },
    '3rd': { 
      math: [{ topic: 'Multiplication', content: '4 x 5 means four groups of five (20).' }],
      science: [{ topic: 'Forces & Magnets', content: 'Opposite poles Attract. Like poles Repel.' }],
      history: [{ topic: 'Geography', content: 'There are 7 continents: North America, South America, Europe, Africa, Asia, Australia, Antarctica.' }]
    },
    '4th': {
      math: [{ topic: 'Geometry', content: 'A Right Angle is exactly 90 degrees. Parallel lines never intersect.' }],
      science: [{ topic: 'Energy Transfer', content: 'Energy cannot be created or destroyed, only transferred.' }],
      history: [{ topic: 'Colonization', content: 'Jamestown was the first permanent English settlement (1607).' }]
    },
    '5th': {
      math: [{ topic: 'Volume', content: 'Volume = Length x Width x Height.' }],
      science: [{ topic: 'Cells', content: 'The Nucleus is the brain. The Mitochondria is the powerhouse.' }],
      history: [{ topic: 'American Revolution', content: 'The Declaration of Independence was signed in 1776.' }]
    },
    '6th': {
      math: [{ topic: 'Ratios', content: 'A ratio compares two quantities (e.g., 3:2).' }],
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
      math: [{ topic: 'Linear Equations & Slope', content: 'A linear equation creates a straight line when graphed on a coordinate plane. The most common format is the slope-intercept form:\n\ny = mx + b\n\n- "y" and "x" represent the coordinates on the graph.\n- "m" represents the slope. Slope is the steepness of the line, calculated as "Rise over Run" (how much it goes up divided by how much it goes sideways).\n- "b" represents the y-intercept. This is the exact point where the line crosses the vertical Y-axis.\n\nTo find the slope between two points, use the formula: m = (y2 - y1) / (x2 - x1).' }],
      science: [{ topic: 'Waves & Energy', content: 'Energy travels in waves. There are two main categories:\n\n1. Mechanical Waves: These require a physical "medium" (like water, air, or solid rock) to travel through. Sound waves are mechanical; they cannot travel through the vacuum of space because there is no air to vibrate.\n\n2. Electromagnetic Waves: These do not require a medium and can travel through the vacuum of space. Light, radio waves, microwaves, and X-rays are all electromagnetic.' }],
      chemistry: [{ topic: 'Chemical Reactions', content: 'In a chemical reaction, the starting materials are called Reactants. The new substances formed are called Products.\n\nThe Law of Conservation of Mass states that matter cannot be created or destroyed. In any closed system, the mass of the Reactants will always exactly equal the mass of the Products. The atoms just rearrange themselves into new combinations.' }],
      history: [{ topic: 'The American Civil War', content: 'Fought between 1861 and 1865, the Civil War tore the United States apart. The Northern states (The Union) fought against the Southern states (The Confederacy).\n\nThe primary cause of the war was the Southern states\' desire to maintain and expand the institution of slavery, leading them to secede from the Union. The war resulted in the defeat of the Confederacy, the preservation of the United States, and the eventual passage of the 13th Amendment, which formally abolished slavery.' }]
    },
    '9th': {
      math: [{ topic: 'Algebra I: Isolating Variables', content: 'To solve an algebraic equation, your absolute goal is to isolate the variable (usually x) on one side of the equals sign. You do this by performing "inverse operations".\n\nExample: Solve 3x + 5 = 20\n\nStep 1: Get rid of the +5 by doing the opposite (subtracting 5) from BOTH sides.\n3x + 5 - 5 = 20 - 5\n3x = 15\n\nStep 2: Get rid of the 3 multiplied by x by dividing BOTH sides by 3.\n3x / 3 = 15 / 3\nx = 5' }],
      science: [{ topic: 'Cellular Division (Mitosis vs Meiosis)', content: 'Your body needs to make new cells to survive. It does this in two different ways:\n\nMitosis: This is for growth and healing (like healing a cut). A single parent cell divides to create TWO perfectly identical "daughter" cells. These cells are Diploid (they have a full set of 46 chromosomes).\n\nMeiosis: This is strictly for reproduction. A parent cell divides twice to create FOUR unique sex cells (sperm or egg). These cells are Haploid (they only have 23 chromosomes, half of a full set, because they will combine with another during reproduction).' }],
      chemistry: [{ topic: 'Stoichiometry & Moles', content: 'In chemistry, atoms are too small to count individually, so scientists use a unit called a "Mole".\n\n1 Mole always equals 6.022 x 10^23 particles (this is called Avogadro\'s number).\n\nMolar Mass is the weight of one mole of a specific element. You use it to convert between the weight of a substance (in grams) and the number of atoms (in moles).' }],
      language: [{ topic: 'Literary Devices', content: 'Authors use devices to make writing deeper:\n\n- Metaphor: A direct comparison between two things without using "like" or "as". (e.g., "The world is a stage.")\n- Simile: A comparison using "like" or "as". (e.g., "Brave as a lion.")\n- Foreshadowing: When the author drops subtle hints about what will happen later in the story.\n- Irony: When the opposite of what is expected happens.' }]
    },
    '10th': {
      math: [{ topic: 'Geometry & Trigonometry', content: 'The Pythagorean Theorem is used to find the missing length of a right triangle. The formula is:\n\na^2 + b^2 = c^2 (where "c" is always the longest side, called the hypotenuse).\n\nTrigonometry deals with the angles and sides of triangles. The acronym SOH-CAH-TOA helps you remember the formulas:\n- Sine = Opposite / Hypotenuse\n- Cosine = Adjacent / Hypotenuse\n- Tangent = Opposite / Adjacent' }],
      science: [{ topic: 'Newton\'s Laws of Motion', content: 'Sir Isaac Newton formulated three laws that govern classical mechanics:\n\n1. Law of Inertia: An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction unless acted upon by an outside force.\n2. F = ma: Force equals Mass times Acceleration. The heavier an object is, and the faster it is accelerating, the more force it generates.\n3. Action/Reaction: For every action, there is an equal and opposite reaction.' }],
      history: [{ topic: 'World War II (1939-1945)', content: 'The deadliest conflict in human history. It divided the world into two military alliances:\n\n- The Axis Powers: Driven by fascist and imperialist ideologies (Nazi Germany, Italy, Imperial Japan).\n- The Allied Powers: Led by Great Britain, the United States, and the Soviet Union.\n\nThe war ended in 1945 following the Allied invasion of Germany and the United States dropping two atomic bombs on the Japanese cities of Hiroshima and Nagasaki.' }],
      language: [{ topic: 'Rhetoric & Persuasion', content: 'Rhetoric is the art of persuasive speaking and writing. Aristotle defined three main modes of persuasion:\n\n- Ethos: An appeal to credibility and authority. (e.g., "As a doctor with 20 years of experience...")\n- Pathos: An appeal to the audience\'s emotions. (e.g., "Think of the innocent children suffering...")\n- Logos: An appeal to logic, using facts, data, and statistics. (e.g., "Studies show a 40% decrease in accidents...")' }]
    },
    '11th': {
      math: [{ topic: 'Algebra II: Logarithms', content: 'Logarithms are simply the mathematical inverse (the exact opposite) of exponential functions. They answer the question: "To what exponent must the base be raised to produce a given number?"\n\nIf you have the equation: b^y = x\nThe logarithmic form is: log_b(x) = y\n\nFor example, since 10^2 = 100, then log_10(100) = 2.' }],
      science: [{ topic: 'Thermodynamics', content: 'Thermodynamics is the study of heat, work, and temperature.\n\n- 1st Law: Energy cannot be created or destroyed, only altered in form. (The total energy of the universe is constant).\n- 2nd Law: Entropy (the measure of disorder or chaos) in an isolated system always increases over time. Things naturally move from order to disorder.' }],
      chemistry: [{ topic: 'Acids & Bases (pH Scale)', content: 'The pH scale measures how acidic or basic a substance is. It ranges from 0 to 14.\n\n- Less than 7: Acidic (High concentration of H+ ions. Think lemon juice or battery acid).\n- Exactly 7: Neutral (Pure water).\n- Greater than 7: Basic / Alkaline (High concentration of OH- ions. Think bleach or soap).' }],
      history: [{ topic: 'The Cold War', content: 'After WWII, the world entered a decades-long geopolitical standoff between the United States (promoting Capitalism and Democracy) and the Soviet Union (promoting Communism).\n\nBecause both superpowers possessed nuclear weapons, they never fought each other directly in a "hot" war. Instead, they fought "Proxy Wars"—supporting opposing sides in smaller conflicts around the globe, most notably in Korea and Vietnam.' }]
    },
    'GED': {
      math: [{ topic: 'GED Math Core', content: 'To pass the GED math section, you must be comfortable isolating variables. To solve an equation like 4x + 10 = 30, you must perform inverse operations. First, subtract 10 from both sides (4x = 20). Then, divide by 4. (x = 5).\n\nYou will also see functions written as f(x). Think of f(x) as a machine. If f(x) = 2x^2 + 3, and you are asked to evaluate for x = 3, you plug 3 into the equation: 2(3^2) + 3. First do the exponent (9), then multiply by 2 (18), then add 3. The answer is 21.' },
             { topic: 'Data & Geometry', content: 'You will need to interpret bar graphs, scatter plots, and pie charts. You must also know basic geometry. The area of a rectangle is Length x Width. The area of a triangle is A = 1/2 * base * height.' }],
      science: [{ topic: 'The Scientific Method', content: 'All science relies on this process:\n1. Observation\n2. Hypothesis (an educated, testable guess)\n3. Experiment\n4. Data Analysis\n5. Conclusion\n\nIn an experiment, the Independent Variable is the one thing you intentionally change. The Dependent Variable is what you measure as a result. The Control variables are kept perfectly identical so they don\'t mess up the test.' },
                { topic: 'Genetics & Punnett Squares', content: 'Traits are passed down through DNA. A Punnett square is a grid used to predict the probability of a child inheriting certain traits. Dominant traits (capital letters) will always mask Recessive traits (lowercase letters).' }],
      history: [{ topic: 'Government & Civics', content: 'The U.S. Constitution separates the government into three branches to prevent tyranny. This is called "Checks and Balances."\n\n1. Legislative Branch (Congress): Makes the laws.\n2. Executive Branch (The President): Enforces the laws.\n3. Judicial Branch (Supreme Court): Interprets the laws.\n\nYou must also know the Bill of Rights. The 1st Amendment protects freedom of speech, religion, assembly, and the press.' },
                { topic: 'Economics Basics', content: 'The foundation of a free market is Supply and Demand. \n\n- Supply is how much of a product is available.\n- Demand is how many people want to buy it.\nIf supply is low and demand is high, the price will rise drastically. If supply is high and nobody wants to buy it (low demand), the price drops.' }],
      language: [{ topic: 'Reading Comprehension', content: 'When reading a passage on the GED, you must identify the "Main Idea." The main idea is the central, overarching point the author is trying to make. Do not confuse it with minor supporting details.\n\nYou must also identify the author\'s tone and purpose. Are they trying to Inform you, Persuade you, or Entertain you?' },
                 { topic: 'Logical Fallacies', content: 'A logical fallacy is a flaw in reasoning that weakens an argument. You will be tested on identifying these in text.\n\n- Ad Hominem: Attacking the person making the argument instead of the argument itself.\n- Strawman: Intentionally misrepresenting or exaggerating someone\'s argument to make it easier to attack and defeat.\n- Slippery Slope: Arguing that a small, minor action will inevitably lead to a massive, disastrous outcome.' }]
    }
  };

  // Expanded Quiz Banks - Randomizer pulls 10 (or 15 for GED) from these pools
  const quizzes = {
    'K': [ { q: 'Which shape has 3 sides?', options: ['Circle', 'Square', 'Triangle', 'Rectangle'], answer: 'Triangle' }, { q: 'What is 1 + 1?', options: ['1', '2', '3', '11'], answer: '2' }, { q: 'Which body part is for Smell?', options: ['Ears', 'Hands', 'Eyes', 'Nose'], answer: 'Nose' }, { q: 'Which is Living?', options: ['Rock', 'Car', 'Tree', 'Pencil'], answer: 'Tree' }, { q: 'Days in a week?', options: ['5', '7', '10', '12'], answer: '7' } ],
    '1st': [ { q: 'How many Tens in 42?', options: ['2', '4', '6', '42'], answer: '4' }, { q: 'Ends a sentence?', options: ['Letter', 'Number', 'Period (.)', 'Noun'], answer: 'Period (.)' }, { q: '15 - 5 = ?', options: ['5', '10', '20', '9'], answer: '10' }, { q: 'Which is a Verb?', options: ['Apple', 'Run', 'School', 'Blue'], answer: 'Run' }, { q: 'Plants start as a...', options: ['Flower', 'Leaf', 'Seed', 'Tree'], answer: 'Seed' } ],
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
      { q: 'Which countries made up the Axis powers in WWII?', options: ['US, UK, USSR', 'Germany, Italy, Japan', 'France, China', 'Germany, Russia'], answer: 'Germany, Italy, Japan' },
      { q: 'In rhetoric, what does "Logos" appeal to?', options: ['Emotion', 'Credibility', 'Logic', 'Fear'], answer: 'Logic' },
      { q: 'What is the formula for the area of a circle?', options: ['A=pi*r^2', 'A=2*pi*r', 'A=l*w', 'A=1/2*b*h'], answer: 'A=pi*r^2' },
      { q: 'Which of Newton\'s laws states that every action has an equal and opposite reaction?', options: ['First', 'Second', 'Third', 'Fourth'], answer: 'Third' },
      { q: 'What year did WWII end?', options: ['1918', '1939', '1945', '1965'], answer: '1945' },
      { q: 'In rhetoric, "Ethos" relies on establishing what?', options: ['Logic', 'Anger', 'Credibility/Authority', 'Sadness'], answer: 'Credibility/Authority' },
      { q: 'In trigonometry, Sine (SOH) is calculated by...', options: ['Adj/Hyp', 'Opp/Adj', 'Opp/Hyp', 'Hyp/Opp'], answer: 'Opp/Hyp' },
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
      { q: 'What does "proxy war" mean in the context of the Cold War?', options: ['Nuclear war', 'Wars fought through third parties', 'Cyber warfare', 'Trade embargoes'], answer: 'Wars fought through third parties' }
    ],
    'GED': [
      { q: 'Solve for x: 4x + 10 = 30', options: ['4', '5', '10', '20'], answer: '5' },
      { q: 'What is the slope of the line passing through (1, 2) and (3, 6)?', options: ['1', '2', '3', '4'], answer: '2' },
      { q: 'According to Newton\'s 2nd Law, if m=10kg and a=5m/s^2, Force is?', options: ['2 N', '15 N', '50 N', '500 N'], answer: '50 N' },
      { q: 'If supply is low and demand is high, price will...', options: ['Drop', 'Rise', 'Stay same', 'Crash'], answer: 'Rise' },
      { q: 'Which Amendment abolished slavery?', options: ['1st', '2nd', '13th', '19th'], answer: '13th' },
      { q: 'Purpose of Checks and Balances?', options: ['Speed laws', 'Prevent tyranny', 'Raise taxes', 'Elect judges'], answer: 'Prevent tyranny' },
      { q: 'Area of triangle with base 10 and height 4? (A=1/2*b*h)', options: ['14', '20', '40', '80'], answer: '20' },
      { q: 'In an experiment, the "control" is...', options: ['Measured', 'Kept the same', 'Changed', 'Hypothesis'], answer: 'Kept the same' },
      { q: 'A logical fallacy is...', options: ['Strong argument', 'Flaw in reasoning', 'Metaphor', 'Fact'], answer: 'Flaw in reasoning' },
      { q: 'Evaluate f(x) = 2x^2 + 3 for x = 3', options: ['9', '15', '21', '36'], answer: '21' },
      { q: 'First Amendment protects...', options: ['Bear arms', 'Fair trial', 'Speech/Religion/Press', 'Voting'], answer: 'Speech/Religion/Press' },
      { q: 'Attacking the person instead of the argument is...', options: ['Strawman', 'Ad Hominem', 'Red Herring', 'Slippery Slope'], answer: 'Ad Hominem' },
      { q: 'Branch of government that makes laws?', options: ['Executive', 'Judicial', 'Military', 'Legislative'], answer: 'Legislative' },
      { q: 'Exaggerating someone\'s argument to make it easier to attack is...', options: ['Strawman', 'Ad Hominem', 'Ethos', 'Pathos'], answer: 'Strawman' },
      { q: 'Solve: 3(x - 2) = 15', options: ['3', '5', '7', '17'], answer: '7' }
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
            )}
            {activeSubTab === 'wicca' && (
              <div style={{ color: '#888', textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>Select a topic to view details...</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
