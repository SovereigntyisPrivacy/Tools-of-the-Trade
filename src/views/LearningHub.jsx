import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LearningHub() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('starthere');
  const [activeSubTab, setActiveSubTab] = useState('wicca');
  const [activeTarotTab, setActiveTarotTab] = useState('basics');
  const [activeWiccaTab, setActiveWiccaTab] = useState('intro');
  
  const [activeGrade, setActiveGrade] = useState('GED');
  const [expandedItem, setExpandedItem] = useState(null);
  
  const [quizActive, setQuizActive] = useState(false);
  const [activeQuizPool, setActiveQuizPool] = useState([]); 
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const gradesList = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', 'GED'];

  // --- SUPERNATURAL DATABASES ---
  const wiccaIntro = { title: "History & The Wiccan Path", content: "Wicca is a modern pagan, nature-based spiritual path and lifestyle. It was introduced to the public in the 1950s by Gerald Gardner, drawing heavily upon ancient European pagan traditions, folklore, and hermetic philosophies. Rather than a highly dogmatic religion with strict rules, Wicca is largely decentralized. Practitioners focus on personal responsibility, reverence for the earth, and the dualistic balance of nature. People study and adopt this lifestyle to reconnect with natural cycles, practice mindfulness, and reclaim their personal and spiritual sovereignty." };
  const wiccanRede = { title: "The Wiccan Rede & Rule of Three", content: "Because Wicca lacks a central authority or 'sin' based commandments, its core moral framework is summarized in the Wiccan Rede: 'Eight words the Wiccan Rede fulfill, An it harm none do what ye will.' This emphasizes absolute personal freedom, so long as your actions do not bring physical or emotional harm to yourself or others. This is inherently paired with the 'Rule of Three' (or Threefold Law), the karmic belief that whatever energy a person puts out into the world will be returned to them three times over." };
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
    { name: 'Samhain', date: 'Oct 31st', type: 'Greater Sabbat / Fire Festival', desc: 'Marks the pagan New Year, Halloween or All Hallows Eve. The veil between worlds is thinnest.' },
    { name: 'Yule', date: 'Dec 21st or 22nd', type: 'Lesser Sabbat / Solar Festival', desc: 'Winter Solstice. Shortest day of the year. Celebrated as the rebirth of the sun.' }
  ];
  const lunarDB = [
    { name: 'The Triple Goddess', type: 'Archetypes', desc: 'The Maiden (New/Waxing Moon), The Mother (Full Moon), The Crone (Waning/Dark Moon).' },
    { name: 'Full Moon', type: 'Potent Power', desc: 'Most potent time to do any magickal work. Invoking, protecting, or healing.' }
  ];

  // --- SCHOOL CURRICULUM ---
  const schoolCurriculum = {
    'K': { 
      math: [{ topic: 'Counting & Numbers', content: 'Numbers tell us how many of something there are. Practice counting aloud: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10.\n\nAdding means putting things together. If you have one apple, and your friend gives you another apple, you now have two apples. This is written as 1 + 1 = 2.' }, { topic: 'Basic Shapes', content: 'Everything is made of shapes.\n\n- Circle: Round, with no corners (like a wheel).\n- Square: Four sides that are all exactly the same length.\n- Triangle: Three sides and three sharp corners.' }],
      science: [{ topic: 'The Five Senses', content: 'Humans use five senses to understand the world around them:\n\n1. Sight: We use our eyes to see colors and shapes.\n2. Hearing: We use our ears to listen to sounds.\n3. Smell: We use our nose to detect scents.\n4. Taste: We use our tongue to tell if food is sweet, salty, or sour.\n5. Touch: We use our skin and hands to feel if something is hot, cold, soft, or rough.' }],
      language: [{ topic: 'The Alphabet', content: 'There are 26 letters in the English alphabet. They start at A and end at Z. Letters combine to make words. \n\nVowels are special letters that help make sounds in almost every word: A, E, I, O, U. The rest of the letters are called consonants.' }],
      history: [{ topic: 'Community Helpers', content: 'A community is a place where people live and work together. \n\n- Firefighters put out dangerous fires.\n- Doctors and Nurses keep us healthy and heal us when we are sick.\n- Teachers help us learn how to read and write.\n- Police Officers make sure the rules are followed to keep everyone safe.' }]
    },
    '1st': { 
      math: [{ topic: 'Addition & Subtraction', content: 'Addition is combining two numbers to make a bigger number. Example: 10 + 5 = 15.\n\nSubtraction is taking an amount away from a number. Example: 15 - 5 = 10. If you have 10 cookies and eat 3, you subtract 3. You have 7 left (10 - 3 = 7).' }, { topic: 'Place Value', content: 'Big numbers are broken down into "Tens" and "Ones". \n\nLook at the number 42. It is made of 4 Tens (which is 40) and 2 Ones (which is 2). In the number 18, there is 1 Ten and 8 Ones.' }],
      science: [{ topic: 'Plant Life Cycles', content: 'Plants are living things. They usually start as a small Seed planted in the dirt. With water and sunlight, the seed grows roots down into the soil and sprouts a stem upwards. \n\nThis small plant is called a Seedling. Eventually, it grows into an Adult Plant that can produce flowers, fruit, and new seeds to start the cycle over.' }],
      language: [{ topic: 'Nouns & Verbs', content: 'Sentences are made of different types of words.\n\n- Nouns: A noun is a Person, Place, or Thing. Examples: Dog, Teacher, School, Apple, Car.\n- Verbs: A verb is an Action word. It describes something you can do. Examples: Run, Jump, Read, Eat, Sleep.\n\nIn the sentence "The dog runs", "dog" is the noun and "runs" is the verb.' }],
      history: [{ topic: 'Past vs. Present', content: 'History is the study of time.\n\nThe "Past" is everything that has already happened. Long ago in the past, people rode horses because cars were not invented yet.\n\nThe "Present" is what is happening right now today. \n\nThe "Future" is what has not happened yet.' }]
    },
    '8th': {
      math: [{ topic: 'Linear Equations & Slope', content: 'A linear equation creates a straight line when graphed on a coordinate plane. The most common format is the slope-intercept form:\n\ny = mx + b\n\n- "y" and "x" represent the coordinates on the graph.\n- "m" represents the slope. Slope is the steepness of the line, calculated as "Rise over Run" (how much it goes up divided by how much it goes sideways).\n- "b" represents the y-intercept. This is the exact point where the line crosses the vertical Y-axis.\n\nTo find the slope between two points, use the formula: m = (y2 - y1) / (x2 - x1).' }],
      science: [{ topic: 'Waves & Energy', content: 'Energy travels in waves. There are two main categories:\n\n1. Mechanical Waves: These require a physical "medium" (like water, air, or solid rock) to travel through. Sound waves are mechanical; they cannot travel through the vacuum of space because there is no air to vibrate.\n\n2. Electromagnetic Waves: These do not require a medium and can travel through the vacuum of space. Light, radio waves, microwaves, and X-rays are all electromagnetic.' }],
      chemistry: [{ topic: 'Chemical Reactions', content: 'In a chemical reaction, the starting materials are called Reactants. The new substances formed are called Products.\n\nThe Law of Conservation of Mass states that matter cannot be created or destroyed. In any closed system, the mass of the Reactants will always exactly equal the mass of the Products. The atoms just rearrange themselves into new combinations.' }],
      history: [{ topic: 'The American Civil War', content: 'Fought between 1861 and 1865, the Civil War tore the United States apart. The Northern states (The Union) fought against the Southern states (The Confederacy).\n\nThe primary cause of the war was the Southern states\' desire to maintain and expand the institution of slavery, leading them to secede from the Union. The war resulted in the defeat of the Confederacy, the preservation of the United States, and the eventual passage of the 13th Amendment, which formally abolished slavery.' }]
    },
    '10th': {
      math: [{ topic: 'Geometry & Trigonometry', content: 'The Pythagorean Theorem is used to find the missing length of a right triangle. The formula is:\n\na^2 + b^2 = c^2 (where "c" is always the longest side, called the hypotenuse).\n\nTrigonometry deals with the angles and sides of triangles. The acronym SOH-CAH-TOA helps you remember the formulas:\n- Sine = Opposite / Hypotenuse\n- Cosine = Adjacent / Hypotenuse\n- Tangent = Opposite / Adjacent' }],
      science: [{ topic: 'Newton\'s Laws of Motion', content: 'Sir Isaac Newton formulated three laws that govern classical mechanics:\n\n1. Law of Inertia: An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction unless acted upon by an outside force.\n2. F = ma: Force equals Mass times Acceleration. The heavier an object is, and the faster it is accelerating, the more force it generates.\n3. Action/Reaction: For every action, there is an equal and opposite reaction.' }],
      history: [{ topic: 'World War II', content: 'The deadliest conflict in human history (1939-1945). It divided the world into two military alliances:\n\n- The Axis Powers: Driven by fascist and imperialist ideologies (Nazi Germany, Italy, Imperial Japan).\n- The Allied Powers: Led by Great Britain, the United States, and the Soviet Union.\n\nThe war ended in 1945 following the Allied invasion of Germany and the United States dropping two atomic bombs on the Japanese cities of Hiroshima and Nagasaki.' }],
      language: [{ topic: 'Rhetoric & Persuasion', content: 'Rhetoric is the art of persuasive speaking and writing. Aristotle defined three main modes of persuasion:\n\n- Ethos: An appeal to credibility and authority. (e.g., "As a doctor with 20 years of experience...")\n- Pathos: An appeal to the audience\'s emotions. (e.g., "Think of the innocent children suffering...")\n- Logos: An appeal to logic, using facts, data, and statistics. (e.g., "Studies show a 40% decrease in accidents...")' }]
    },
    'GED': {
      math: [{ topic: 'Algebra & Functions', content: 'To pass the GED math section, you must be comfortable isolating variables. To solve an equation like 4x + 10 = 30, you must perform inverse operations. First, subtract 10 from both sides (4x = 20). Then, divide by 4. (x = 5).\n\nYou will also see functions written as f(x). Think of f(x) as a machine. If f(x) = 2x^2 + 3, and you are asked to evaluate for x = 3, you plug 3 into the equation: 2(3^2) + 3. First do the exponent (9), then multiply by 2 (18), then add 3. The answer is 21.' },
             { topic: 'Data & Geometry', content: 'You will need to interpret bar graphs, scatter plots, and pie charts. You must also know basic geometry. The area of a rectangle is Length x Width. The area of a triangle is A = 1/2 * base * height.' }],
      science: [{ topic: 'The Scientific Method', content: 'All science relies on this process:\n1. Observation\n2. Hypothesis (an educated, testable guess)\n3. Experiment\n4. Data Analysis\n5. Conclusion\n\nIn an experiment, the Independent Variable is the one thing you intentionally change. The Dependent Variable is what you measure as a result. The Control variables are kept perfectly identical so they don\'t mess up the test.' },
                { topic: 'Genetics & Punnett Squares', content: 'Traits are passed down through DNA. A Punnett square is a grid used to predict the probability of a child inheriting certain traits. Dominant traits (capital letters) will always mask Recessive traits (lowercase letters).' }],
      history: [{ topic: 'Government & Civics', content: 'The U.S. Constitution separates the government into three branches to prevent tyranny. This is called "Checks and Balances."\n\n1. Legislative Branch (Congress): Makes the laws.\n2. Executive Branch (The President): Enforces the laws.\n3. Judicial Branch (Supreme Court): Interprets the laws.\n\nYou must also know the Bill of Rights. The 1st Amendment protects freedom of speech, religion, assembly, and the press.' },
                { topic: 'Economics Basics', content: 'The foundation of a free market is Supply and Demand. \n\n- Supply is how much of a product is available.\n- Demand is how many people want to buy it.\nIf supply is low and demand is high, the price will rise drastically. If supply is high and nobody wants to buy it (low demand), the price drops.' }],
      language: [{ topic: 'Reading Comprehension', content: 'When reading a passage on the GED, you must identify the "Main Idea." The main idea is the central, overarching point the author is trying to make. Do not confuse it with minor supporting details.\n\nYou must also identify the author\'s tone and purpose. Are they trying to Inform you, Persuade you, or Entertain you?' },
                 { topic: 'Logical Fallacies', content: 'A logical fallacy is a flaw in reasoning that weakens an argument. You will be tested on identifying these in text.\n\n- Ad Hominem: Attacking the person making the argument instead of the argument itself.\n- Strawman: Intentionally misrepresenting or exaggerating someone\'s argument to make it easier to attack and defeat.\n- Slippery Slope: Arguing that a small, minor action will inevitably lead to a massive, disastrous outcome.' }]
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
    'GED': [
      { q: 'Solve for x: 4x + 10 = 30', options: ['4', '5', '10', '20'], answer: '5' },
      { q: 'According to Newton\'s Second Law, if m=10kg and a=5m/s^2, what is the Force?', options: ['2 N', '15 N', '50 N', '500 N'], answer: '50 N' },
      { q: 'In economics, if supply increases and demand remains the same, what happens to the price?', options: ['It drops', 'It rises', 'It stays the same', 'It doubles'], answer: 'It drops' },
      { q: 'Which US Constitutional Amendment abolished slavery?', options: ['1st', '2nd', '13th', '19th'], answer: '13th' },
      { q: 'What is the primary purpose of Checks and Balances in the US government?', options: ['To speed up laws', 'To prevent any one branch from becoming too powerful', 'To raise taxes', 'To elect officials'], answer: 'To prevent any one branch from becoming too powerful' },
      { q: 'What gas is a product of photosynthesis that humans need to survive?', options: ['Carbon Dioxide', 'Nitrogen', 'Oxygen', 'Helium'], answer: 'Oxygen' },
      { q: 'In an experiment, what is the "control" variable?', options: ['The part that is measured', 'The part that is kept the same', 'The part that changes', 'The hypothesis'], answer: 'The part that is kept the same' },
      { q: 'A logical fallacy is...', options: ['A strong argument', 'A flaw in reasoning that weakens the argument', 'A metaphor', 'A historical fact'], answer: 'A flaw in reasoning that weakens the argument' },
      { q: 'Evaluate f(x) = 2x^2 + 3 for x = 3', options: ['9', '15', '21', '36'], answer: '21' },
      { q: 'What does the First Amendment protect?', options: ['Right to bear arms', 'Right to a fair trial', 'Freedom of speech, religion, and press', 'Abolition of slavery'], answer: 'Freedom of speech, religion, and press' },
      { q: 'What is the slope of a line passing through (1, 2) and (3, 6)?', options: ['1', '2', '3', '4'], answer: '2' },
      { q: 'Which logical fallacy involves attacking the person instead of the argument?', options: ['Strawman', 'Slippery Slope', 'Ad Hominem', 'Red Herring'], answer: 'Ad Hominem' },
      { q: 'Which branch of government is responsible for making the laws?', options: ['Executive', 'Judicial', 'Military', 'Legislative'], answer: 'Legislative' },
      { q: 'If a triangle has a base of 10 and a height of 4, what is its area?', options: ['14', '20', '40', '80'], answer: '20' }
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
            </div>
            {activeSubTab === 'tarot' && tarotDeck.map((card, idx) => (
              <div key={idx} style={{ ...cardStyle, borderLeft: '4px solid #a855f7' }}>
                <div onClick={() => toggleExpand(card.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}><h4 style={{ margin: 0, color: '#fff', fontSize: '1.1em' }}>{card.name}</h4><span style={{ color: '#a855f7', fontWeight: 'bold' }}>{expandedItem === card.name ? '−' : '+'}</span></div>
                {expandedItem === card.name && (
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}><div style={{ color: '#00ffff', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Interpretation</div><div style={{ color: '#eee', lineHeight: '1.5', fontSize: '0.95em' }}>{card.desc}</div></div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
