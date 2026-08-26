import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LearningHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('math'); 
  const [openSection, setOpenSection] = useState(null);
  
  // Test State
  const [activeTest, setActiveTest] = useState(null); 
  const [currentQuestions, setCurrentQuestions] = useState([]); // Holds the randomized test
  const [testAnswers, setTestAnswers] = useState({});
  const [testResults, setTestResults] = useState(null);

  const toggleSection = (section) => setOpenSection(openSection === section ? null : section);

  const mathData = [
    {
      title: "Algebra & Linear Equations",
      content: [
        "Slope Formula: m = (y₂ - y₁) / (x₂ - x₁)",
        "Slope-Intercept Form: y = mx + b",
        "Quadratic Formula: x = [-b ± √(b² - 4ac)] / 2a",
        "Distance Formula: d = √[(x₂ - x₁)² + (y₂ - y₁)²]",
        "Midpoint Formula: M = ((x₁+x₂)/2 , (y₁+y₂)/2)"
      ]
    },
    {
      title: "Geometry: Area & Perimeter",
      content: [
        "Area of a Circle: A = πr²",
        "Circumference of a Circle: C = 2πr",
        "Area of a Triangle: A = 1/2(base × height)",
        "Area of a Trapezoid: A = 1/2(a + b)h",
        "Pythagorean Theorem (Right Triangles): a² + b² = c²"
      ]
    },
    {
      title: "Geometry: Surface Area & Volume",
      content: [
        "Volume of a Cylinder: V = πr²h",
        "Volume of a Sphere: V = (4/3)πr³",
        "Volume of a Cone: V = (1/3)πr²h",
        "Surface Area of a Sphere: SA = 4πr²",
        "Surface Area of a Cylinder: SA = 2πrh + 2πr²"
      ]
    }
  ];

  const scienceData = [
    {
      title: "Physics & Mechanics",
      content: [
        "Newton's 1st Law: An object at rest stays at rest unless acted upon by a force (Inertia).",
        "Newton's 2nd Law: Force = mass × acceleration (F = ma).",
        "Newton's 3rd Law: For every action, there is an equal and opposite reaction.",
        "Kinetic Energy: KE = 1/2(mv²)",
        "Gravitational Potential Energy: PE = mgh"
      ]
    },
    {
      title: "Chemistry: Bonds & Formulas",
      content: [
        "Covalent Bond: Atoms share electrons (e.g., H₂O).",
        "Ionic Bond: One atom transfers electrons to another (e.g., NaCl).",
        "Water: H₂O | Carbon Dioxide: CO₂ | Glucose: C₆H₁₂O₆",
        "Ammonia: NH₃ | Sulfuric Acid: H₂SO₄ | Methane: CH₄"
      ]
    },
    {
      title: "Biology & Life Sciences",
      content: [
        "DNA (Deoxyribonucleic Acid): Double helix carrying genetic instructions. Base pairs: A-T, C-G.",
        "Mitosis: Cell division resulting in two identical cells (growth/repair).",
        "Meiosis: Cell division resulting in four sex cells with half the chromosomes.",
        "Photosynthesis: 6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂"
      ]
    }
  ];

  const historyData = [
    {
      title: "World History: Ancient to Renaissance",
      content: [
        "c. 3000 BCE: Invention of writing (Cuneiform) in Sumer.",
        "476 CE: The Fall of the Western Roman Empire.",
        "1215 CE: Signing of the Magna Carta, limiting monarch power.",
        "14th Century: The Renaissance begins in Italy.",
        "1440 CE: Johannes Gutenberg invents the printing press."
      ]
    },
    {
      title: "U.S. History Milestones",
      content: [
        "1776: Declaration of Independence signed.",
        "1787: The U.S. Constitution is written.",
        "1861 - 1865: The American Civil War.",
        "1920: 19th Amendment guarantees women the right to vote.",
        "1964: The Civil Rights Act outlaws discrimination."
      ]
    }
  ];

  const testBank = {
    'K-5': [
      { q: "What is 8 × 7?", options: ["42", "54", "56", "64"], a: "56" },
      { q: "What state of matter is ice?", options: ["Liquid", "Solid", "Gas", "Plasma"], a: "Solid" },
      { q: "Which planet is closest to the sun?", options: ["Venus", "Mars", "Mercury", "Earth"], a: "Mercury" },
      { q: "What is the noun in: 'The quick dog ran'?", options: ["The", "quick", "dog", "ran"], a: "dog" },
      { q: "Who was the first U.S. President?", options: ["Lincoln", "Washington", "Jefferson", "Adams"], a: "Washington" }
    ],
    'Middle': [
      { q: "Solve for x: 4x - 2 = 14", options: ["x = 3", "x = 4", "x = 8", "x = 16"], a: "x = 4" },
      { q: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"], a: "Mitochondria" },
      { q: "What is the pH of pure water?", options: ["0", "5", "7", "14"], a: "7" },
      { q: "When did the American Civil War begin?", options: ["1776", "1812", "1861", "1914"], a: "1861" },
      { q: "Area of a triangle with base 4 and height 5?", options: ["9", "10", "18", "20"], a: "10" }
    ],
    'High': [
      { q: "Chemical formula for Glucose?", options: ["C₆H₁₂O₆", "H₂O", "CO₂", "NaCl"], a: "C₆H₁₂O₆" },
      { q: "Pythagorean Theorem formula?", options: ["y = mx + b", "a² + b² = c²", "F = ma", "A = πr²"], a: "a² + b² = c²" },
      { q: "Event starting WWI?", options: ["Invasion of Poland", "Pearl Harbor", "Archduke Ferdinand Assassination", "Berlin Wall"], a: "Archduke Ferdinand Assassination" },
      { q: "Bond involving shared electrons?", options: ["Ionic", "Covalent", "Hydrogen", "Metallic"], a: "Covalent" },
      { q: "Solve for x: x² - 9 = 0", options: ["x = 3", "x = -3", "x = 3, -3", "x = 9"], a: "x = 3, -3" }
    ],
    'GED': [
      // 40-Question Massive Bank for Randomization
      { q: "Math: If a car travels 60 mph for 2.5 hours, how far does it go?", options: ["120 miles", "150 miles", "180 miles", "200 miles"], a: "150 miles" },
      { q: "Math: Simplify: 3(2x - 4) + 5", options: ["6x - 7", "6x - 12", "6x + 1", "5x - 7"], a: "6x - 7" },
      { q: "Math: What is the median of: 4, 1, 7, 9, 3?", options: ["4", "4.8", "5", "7"], a: "4" },
      { q: "Math: Solve for y: 2y + 6 = 18", options: ["y = 4", "y = 6", "y = 8", "y = 12"], a: "y = 6" },
      { q: "Math: A $40 shirt is 25% off. What is the sale price?", options: ["$10", "$25", "$30", "$35"], a: "$30" },
      { q: "Math: What is the slope of the line y = -3x + 4?", options: ["4", "-3", "3", "-4"], a: "-3" },
      { q: "Math: Evaluate 5² - (3 + 4)", options: ["18", "16", "14", "12"], a: "18" },
      { q: "Math: What is the perimeter of a rectangle with sides 5 and 8?", options: ["13", "26", "40", "18"], a: "26" },
      { q: "Math: Probability of flipping a coin and getting heads twice in a row?", options: ["1/2", "1/4", "1/8", "1"], a: "1/4" },
      { q: "Math: Find the area of a circle with radius 3 (use π ≈ 3.14)", options: ["18.84", "28.26", "9.42", "7.06"], a: "28.26" },
      { q: "Science: In an experiment, the variable you change is the:", options: ["Dependent variable", "Independent variable", "Control", "Constant"], a: "Independent variable" },
      { q: "Science: What process do plants use to make food?", options: ["Cellular Respiration", "Mitosis", "Photosynthesis", "Osmosis"], a: "Photosynthesis" },
      { q: "Science: Newton's Third Law states:", options: ["F = ma", "Objects at rest stay at rest", "Every action has an equal/opposite reaction", "Energy is conserved"], a: "Every action has an equal/opposite reaction" },
      { q: "Science: What gas do humans exhale as a waste product?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"], a: "Carbon Dioxide" },
      { q: "Science: Kinetic energy is the energy of:", options: ["Position", "Motion", "Heat", "Light"], a: "Motion" },
      { q: "Science: The structural center of an atom is the:", options: ["Electron cloud", "Nucleus", "Proton", "Molecule"], a: "Nucleus" },
      { q: "Science: Which is a renewable energy source?", options: ["Coal", "Natural Gas", "Solar", "Petroleum"], a: "Solar" },
      { q: "Science: Water freezing into ice is a:", options: ["Chemical change", "Physical change", "Nuclear change", "Biological change"], a: "Physical change" },
      { q: "Science: What blood cells fight infection?", options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"], a: "White blood cells" },
      { q: "Science: The movement of tectonic plates causes:", options: ["Hurricanes", "Tornadoes", "Earthquakes", "Tides"], a: "Earthquakes" },
      { q: "Social Studies: The first ten amendments to the Constitution are the:", options: ["Preamble", "Articles of Confederation", "Bill of Rights", "Emancipation Proclamation"], a: "Bill of Rights" },
      { q: "Social Studies: The three branches of the U.S. government are:", options: ["Local, State, Federal", "Executive, Legislative, Judicial", "House, Senate, Supreme Court", "Army, Navy, Air Force"], a: "Executive, Legislative, Judicial" },
      { q: "Social Studies: What was the primary cause of the U.S. Civil War?", options: ["Taxation", "Slavery", "Foreign invasion", "Religious freedom"], a: "Slavery" },
      { q: "Social Studies: Who vetoes bills in the U.S. government?", options: ["The President", "The Supreme Court", "The Senate", "The Speaker of the House"], a: "The President" },
      { q: "Social Studies: In economics, if demand goes up and supply stays the same, price:", options: ["Decreases", "Increases", "Stays the same", "Drops to zero"], a: "Increases" },
      { q: "Social Studies: What document freed slaves in the Confederacy?", options: ["Constitution", "Bill of Rights", "Emancipation Proclamation", "Declaration of Independence"], a: "Emancipation Proclamation" },
      { q: "Social Studies: The Cold War was primarily between the U.S. and:", options: ["Germany", "Japan", "Soviet Union", "China"], a: "Soviet Union" },
      { q: "Social Studies: Which of these is a civic duty?", options: ["Voting", "Serving on a jury", "Running for office", "Watching the news"], a: "Serving on a jury" },
      { q: "Social Studies: The U.S. economy is best described as a:", options: ["Command economy", "Mixed market economy", "Traditional economy", "Socialist economy"], a: "Mixed market economy" },
      { q: "Social Studies: Who has the power to declare war?", options: ["The President", "The Supreme Court", "Congress", "The Pentagon"], a: "Congress" },
      { q: "RLA: Which word is an adjective in 'The loud engine roared'?", options: ["The", "loud", "engine", "roared"], a: "loud" },
      { q: "RLA: 'He was as fast as a cheetah' is an example of:", options: ["Metaphor", "Simile", "Personification", "Hyperbole"], a: "Simile" },
      { q: "RLA: The main point the author is trying to make is called the:", options: ["Climax", "Resolution", "Main Idea", "Setting"], a: "Main Idea" },
      { q: "RLA: What is the correct spelling?", options: ["Accomodate", "Acommodate", "Accommodate", "Acomodate"], a: "Accommodate" },
      { q: "RLA: A story written about a person's life by another person is a:", options: ["Autobiography", "Biography", "Fiction", "Memoir"], a: "Biography" },
      { q: "RLA: Identify the verb: 'She quickly ran to the store.'", options: ["She", "quickly", "ran", "store"], a: "ran" },
      { q: "RLA: What does 'infer' mean?", options: ["Read quickly", "Guess based on evidence", "Memorize facts", "Write an essay"], a: "Guess based on evidence" },
      { q: "RLA: Choose the correct word: 'Their/There/They're going to the park.'", options: ["Their", "There", "They're", "Ther"], a: "They're" },
      { q: "RLA: The time and place a story happens is the:", options: ["Plot", "Conflict", "Setting", "Theme"], a: "Setting" },
      { q: "RLA: Which sentence is grammatically correct?", options: ["He don't know.", "He doesn't know.", "He not know.", "He knowing not."], a: "He doesn't know." }
    ]
  };

  // --- TEST ACTIONS (WITH GED RANDOMIZER) ---
  const startTest = (grade) => {
    setActiveTest(grade);
    setTestAnswers({});
    setTestResults(null);

    let selectedQuestions = testBank[grade];

    // If GED is selected, shuffle the 40-question bank and select exactly 10
    if (grade === 'GED') {
      const shuffled = [...testBank['GED']].sort(() => 0.5 - Math.random());
      selectedQuestions = shuffled.slice(0, 10);
    }
    
    setCurrentQuestions(selectedQuestions);
  };

  const handleAnswer = (qIndex, answer) => setTestAnswers({ ...testAnswers, [qIndex]: answer });

  const submitTest = () => {
    let score = 0;
    let incorrect = [];

    currentQuestions.forEach((q, idx) => {
      if (testAnswers[idx] === q.a) {
        score++;
      } else {
        incorrect.push({ question: q.q, yourAnswer: testAnswers[idx] || "No Answer", correctAnswer: q.a });
      }
    });

    const percent = (score / currentQuestions.length) * 100;
    const passed = percent >= 80; 
    setTestResults({ score, total: currentQuestions.length, percent, passed, incorrect });
  };

  const closeTest = () => {
    setActiveTest(null);
    setCurrentQuestions([]);
    setTestResults(null);
  };

  // --- STYLES & RENDER HELPERS ---
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #222', padding: '20px', marginBottom: '20px' };
  const btnStyle = (bg, color) => ({ background: bg, color: color, border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', width: '100%', fontSize: '1em' });
  const tabBtnStyle = (isActive, color) => ({ flex: '0 0 auto', padding: '12px 18px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: isActive ? color : '#222', color: isActive ? '#fff' : '#888' });

  const renderAccordion = (dataArray, color) => (
    <div style={{ marginTop: '10px' }}>
      {dataArray.map((item, idx) => (
        <div key={idx} style={{ background: '#111', borderRadius: '8px', border: `1px solid #333`, borderLeft: `3px solid ${color}`, marginBottom: '10px', overflow: 'hidden' }}>
          <button onClick={() => toggleSection(item.title)} style={{ width: '100%', background: '#111', color: '#fff', border: 'none', padding: '15px', textAlign: 'left', fontWeight: 'bold', fontSize: '1.05em', display: 'flex', justifyContent: 'space-between' }}>
            {item.title} <span style={{ color: color }}>{openSection === item.title ? '▼' : '▶'}</span>
          </button>
          {openSection === item.title && (
            <div style={{ padding: '0 15px 15px 15px', color: '#ccc', lineHeight: '1.8', fontSize: '0.95em' }}>
              {item.content.map((line, i) => <div key={i} style={{ marginBottom: '6px', borderBottom: '1px dashed #222', paddingBottom: '6px' }}>{line}</div>)}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
          <h2 style={{ margin: 0, color: '#3b82f6', fontSize: '1.2em' }}>Pocket Academy</h2>
        </div>
      </header>

      {!activeTest ? (
        <>
          <div style={{ display: 'flex', gap: '10px', padding: '15px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <button onClick={() => {setActiveTab('math'); setOpenSection(null);}} style={tabBtnStyle(activeTab === 'math', '#ef4444')}>Mathematics</button>
            <button onClick={() => {setActiveTab('science'); setOpenSection(null);}} style={tabBtnStyle(activeTab === 'science', '#10b981')}>Sciences</button>
            <button onClick={() => {setActiveTab('history'); setOpenSection(null);}} style={tabBtnStyle(activeTab === 'history', '#f59e0b')}>History</button>
            <button onClick={() => setActiveTab('tests')} style={tabBtnStyle(activeTab === 'tests', '#3b82f6')}>Testing Engine</button>
          </div>

          <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
            {activeTab === 'math' && (<><h3 style={{ color: '#ef4444', textAlign: 'center', textTransform: 'uppercase', marginBottom: '15px' }}>Math Matrix</h3>{renderAccordion(mathData, '#ef4444')}</>)}
            {activeTab === 'science' && (<><h3 style={{ color: '#10b981', textAlign: 'center', textTransform: 'uppercase', marginBottom: '15px' }}>Science Vault</h3>{renderAccordion(scienceData, '#10b981')}</>)}
            {activeTab === 'history' && (<><h3 style={{ color: '#f59e0b', textAlign: 'center', textTransform: 'uppercase', marginBottom: '15px' }}>History Archive</h3>{renderAccordion(historyData, '#f59e0b')}</>)}

            {activeTab === 'tests' && (
              <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
                <h3 style={{ color: '#3b82f6', textAlign: 'center', textTransform: 'uppercase', marginBottom: '15px' }}>Placement Diagnostics</h3>
                <p style={{ color: '#888', textAlign: 'center', marginBottom: '20px', fontSize: '0.9em' }}>A score of 80% or higher is required to pass each module. The GED exam is dynamically randomized.</p>
                
                {Object.keys(testBank).map(grade => (
                  <button key={grade} onClick={() => startTest(grade)} style={{ width: '100%', background: '#111', border: '1px solid #3b82f6', color: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '10px', fontWeight: 'bold', fontSize: '1.1em', display: 'flex', justifyContent: 'space-between' }}>
                    {grade} Exam <span>▶</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* --- ACTIVE TEST & DIAGNOSTICS VIEW --- */
        <div style={{ padding: '20px', overflowY: 'auto', paddingBottom: '100px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#3b82f6', margin: 0 }}>{activeTest} Exam</h2>
            <button onClick={closeTest} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold' }}>Abort</button>
          </div>

          {!testResults ? (
            <>
              {currentQuestions.map((q, idx) => (
                <div key={idx} style={{ ...cardStyle, borderLeft: '3px solid #3b82f6' }}>
                  <h4 style={{ color: '#fff', margin: '0 0 15px 0', lineHeight: '1.4' }}>{idx + 1}. {q.q}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {q.options.map(opt => (
                      <button 
                        key={opt} 
                        onClick={() => handleAnswer(idx, opt)}
                        style={{ padding: '12px', background: testAnswers[idx] === opt ? '#3b82f6' : '#111', color: testAnswers[idx] === opt ? '#fff' : '#ccc', border: '1px solid #333', borderRadius: '6px', textAlign: 'left', fontWeight: 'bold' }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={submitTest} style={{ ...btnStyle('#10b981', '#000'), marginTop: '10px' }}>Submit & Grade Exam</button>
            </>
          ) : (
            <div style={{ ...cardStyle, borderTop: `4px solid ${testResults.passed ? '#10b981' : '#ef4444'}` }}>
              <h2 style={{ textAlign: 'center', color: testResults.passed ? '#10b981' : '#ef4444', margin: '0 0 10px 0' }}>{testResults.passed ? 'PASSED' : 'FAILED'}</h2>
              <div style={{ textAlign: 'center', fontSize: '3em', fontWeight: 'bold', color: testResults.passed ? '#10b981' : '#ef4444', marginBottom: '5px' }}>{testResults.percent}%</div>
              <div style={{ textAlign: 'center', color: '#888', marginBottom: '20px' }}>Score: {testResults.score} / {testResults.total} (80% Required)</div>

              {testResults.incorrect.length === 0 ? (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '15px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>Perfect Score! No diagnostic corrections needed.</div>
              ) : (
                <>
                  <h4 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Diagnostic Corrections:</h4>
                  {testResults.incorrect.map((err, idx) => (
                    <div key={idx} style={{ background: '#0a0a0a', padding: '15px', borderRadius: '8px', marginBottom: '10px', borderLeft: '2px solid #ef4444' }}>
                      <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px', lineHeight: '1.4' }}>Q: {err.question}</div>
                      <div style={{ color: '#888', fontSize: '0.9em', textDecoration: 'line-through' }}>You answered: {err.yourAnswer}</div>
                      <div style={{ color: '#10b981', fontWeight: 'bold', marginTop: '5px' }}>Correct Answer: {err.correctAnswer}</div>
                    </div>
                  ))}
                </>
              )}
              <button onClick={closeTest} style={{ ...btnStyle('#222', '#fff'), marginTop: '20px', border: '1px solid #444' }}>Return to Academy</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
