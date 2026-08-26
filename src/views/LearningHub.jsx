import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LearningHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('curriculum'); // curriculum, chem
  const [activeGrade, setActiveGrade] = useState('K-5');
  
  // Test State
  const [activeTest, setActiveTest] = useState(null); // null or grade string
  const [testAnswers, setTestAnswers] = useState({});
  const [testResults, setTestResults] = useState(null);

  const curriculumData = {
    'K-5': {
      title: "Foundations (K-5th Grade)",
      focus: ["Phonics & Reading Comprehension", "Basic Arithmetic (Add, Subtract, Multiply, Divide)", "Fractions & Decimals", "Earth Science (Weather, Solar System)", "Basic US History"],
    },
    'Middle': {
      title: "Intermediate (6th-8th Grade)",
      focus: ["Pre-Algebra & Geometry Basics", "Life Science (Cells, Ecosystems)", "World History & Ancient Civilizations", "Literary Themes & Citations", "Basic Chemistry (States of Matter)"],
    },
    'High': {
      title: "Advanced (9th-12th Grade)",
      focus: ["Algebra I & II, Geometry, Trigonometry", "Biology, Chemistry, & Physics", "US History & Global Conflicts", "Research Papers & Critical Analysis"],
    },
    'GED': {
      title: "GED Mastery",
      focus: ["Mathematical Reasoning (Polynomials, Graphs)", "Science Data Analysis & Scientific Method", "Reasoning Through Language Arts", "Social Studies (Economics, Civics)"],
    }
  };

  const testBank = {
    'K-5': [
      { q: "What is 8 x 7?", options: ["42", "54", "56", "64"], a: "56" },
      { q: "What state of matter is ice?", options: ["Liquid", "Solid", "Gas", "Plasma"], a: "Solid" },
      { q: "Which planet is closest to the sun?", options: ["Venus", "Mars", "Mercury", "Earth"], a: "Mercury" }
    ],
    'Middle': [
      { q: "Solve for x: 4x - 2 = 14", options: ["x = 3", "x = 4", "x = 8", "x = 16"], a: "x = 4" },
      { q: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"], a: "Mitochondria" },
      { q: "What is the pH of pure water?", options: ["0", "5", "7", "14"], a: "7" }
    ],
    'High': [
      { q: "What is the chemical formula for table salt?", options: ["NaCl", "H2O", "CO2", "HCl"], a: "NaCl" },
      { q: "Which of these is the Pythagorean theorem?", options: ["E = mc²", "a² + b² = c²", "F = ma", "πr²"], a: "a² + b² = c²" },
      { q: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Homer"], a: "William Shakespeare" }
    ],
    'GED': [
      { q: "If a car travels 60 mph for 2.5 hours, how far does it go?", options: ["120 miles", "150 miles", "180 miles", "200 miles"], a: "150 miles" },
      { q: "What is the chemical formula for Glucose?", options: ["C6H12O6", "CO2", "NaCl", "H2SO4"], a: "C6H12O6" },
      { q: "Newton's Third Law states:", options: ["Force equals mass times acceleration", "Objects in motion stay in motion", "Every action has an equal and opposite reaction", "Energy cannot be destroyed"], a: "Every action has an equal and opposite reaction" }
    ]
  };

  // --- ACTIONS ---
  const startTest = (grade) => {
    setActiveTest(grade);
    setTestAnswers({});
    setTestResults(null);
  };

  const handleAnswer = (qIndex, answer) => {
    setTestAnswers({ ...testAnswers, [qIndex]: answer });
  };

  const submitTest = () => {
    const questions = testBank[activeTest];
    let score = 0;
    let incorrect = [];

    questions.forEach((q, idx) => {
      if (testAnswers[idx] === q.a) {
        score++;
      } else {
        incorrect.push({
          question: q.q,
          yourAnswer: testAnswers[idx] || "No Answer selected",
          correctAnswer: q.a
        });
      }
    });

    setTestResults({ score, total: questions.length, incorrect });
  };

  const closeTest = () => {
    setActiveTest(null);
    setTestResults(null);
  };

  // --- STYLES ---
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #222', padding: '20px', marginBottom: '20px' };
  const btnStyle = (bg, color) => ({ background: bg, color: color, border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', width: '100%', fontSize: '1em' });
  const tabBtnStyle = (isActive, color) => ({ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: isActive ? color : '#222', color: isActive ? '#fff' : '#888' });


  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
          <h2 style={{ margin: 0, color: '#3b82f6', fontSize: '1.2em' }}>Learning Center</h2>
        </div>
      </header>

      {!activeTest ? (
        <>
          <div style={{ display: 'flex', gap: '10px', padding: '15px', overflowX: 'auto' }}>
            <button onClick={() => setActiveTab('curriculum')} style={tabBtnStyle(activeTab === 'curriculum', '#3b82f6')}>K-GED Academy</button>
            <button onClick={() => setActiveTab('chem')} style={tabBtnStyle(activeTab === 'chem', '#a855f7')}>Chem & Physics</button>
          </div>

          <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
            
            {/* --- CHEMISTRY & PHYSICS TAB --- */}
            {activeTab === 'chem' && (
              <>
                <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
                  <h3 style={{ color: '#a855f7', textAlign: 'center', margin: '0 0 15px 0', textTransform: 'uppercase' }}>The pH Scale</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.9em' }}>
                    <div style={{ background: '#ef4444', color: '#fff', padding: '8px', borderRadius: '4px' }}>0 - Battery Acid (Highly Acidic)</div>
                    <div style={{ background: '#f97316', color: '#fff', padding: '8px', borderRadius: '4px' }}>2 - Lemon Juice / Stomach Acid</div>
                    <div style={{ background: '#facc15', color: '#000', padding: '8px', borderRadius: '4px' }}>4 - Tomato Juice / Acid Rain</div>
                    <div style={{ background: '#10b981', color: '#fff', padding: '8px', borderRadius: '4px', fontWeight: 'bold' }}>7 - Pure Water (Neutral)</div>
                    <div style={{ background: '#06b6d4', color: '#fff', padding: '8px', borderRadius: '4px' }}>9 - Baking Soda</div>
                    <div style={{ background: '#3b82f6', color: '#fff', padding: '8px', borderRadius: '4px' }}>11 - Ammonia Solution</div>
                    <div style={{ background: '#4f46e5', color: '#fff', padding: '8px', borderRadius: '4px' }}>13 - Bleach / Lye (Highly Alkaline)</div>
                  </div>
                </div>

                <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
                  <h3 style={{ color: '#3b82f6', textAlign: 'center', margin: '0 0 15px 0', textTransform: 'uppercase' }}>Common Chemical Formulas</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.95em' }}>
                    <div style={{ background: '#111', padding: '10px', border: '1px solid #333', borderRadius: '6px' }}><strong style={{ color: '#3b82f6' }}>Water:</strong> H₂O</div>
                    <div style={{ background: '#111', padding: '10px', border: '1px solid #333', borderRadius: '6px' }}><strong style={{ color: '#3b82f6' }}>Carbon Dioxide:</strong> CO₂</div>
                    <div style={{ background: '#111', padding: '10px', border: '1px solid #333', borderRadius: '6px' }}><strong style={{ color: '#3b82f6' }}>Table Salt:</strong> NaCl</div>
                    <div style={{ background: '#111', padding: '10px', border: '1px solid #333', borderRadius: '6px' }}><strong style={{ color: '#3b82f6' }}>Glucose:</strong> C₆H₁₂O₆</div>
                    <div style={{ background: '#111', padding: '10px', border: '1px solid #333', borderRadius: '6px' }}><strong style={{ color: '#3b82f6' }}>Ammonia:</strong> NH₃</div>
                    <div style={{ background: '#111', padding: '10px', border: '1px solid #333', borderRadius: '6px' }}><strong style={{ color: '#3b82f6' }}>Sulfuric Acid:</strong> H₂SO₄</div>
                  </div>
                </div>

                <div style={{ ...cardStyle, borderTop: '4px solid #10b981' }}>
                  <h3 style={{ color: '#10b981', textAlign: 'center', margin: '0 0 15px 0', textTransform: 'uppercase' }}>Core Physics & Math</h3>
                  <div style={{ color: '#ccc', lineHeight: '1.8' }}>
                    <p><strong style={{ color: '#fff' }}>Newton's 2nd Law:</strong> F = ma (Force = mass × acceleration)</p>
                    <p><strong style={{ color: '#fff' }}>Pythagorean Theorem:</strong> a² + b² = c²</p>
                    <p><strong style={{ color: '#fff' }}>Quadratic Formula:</strong> x = [-b ± √(b² - 4ac)] / 2a</p>
                    <p><strong style={{ color: '#fff' }}>Area of a Circle:</strong> A = πr²</p>
                  </div>
                </div>
              </>
            )}

            {/* --- K-GED CURRICULUM TAB --- */}
            {activeTab === 'curriculum' && (
              <>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto' }}>
                  {Object.keys(curriculumData).map(grade => (
                    <button key={grade} onClick={() => setActiveGrade(grade)} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeGrade === grade ? '#3b82f6' : '#222', color: activeGrade === grade ? '#fff' : '#888' }}>
                      {grade}
                    </button>
                  ))}
                </div>

                <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
                  <h2 style={{ color: '#3b82f6', marginTop: 0 }}>{curriculumData[activeGrade].title}</h2>
                  <h4 style={{ color: '#888', textTransform: 'uppercase', marginBottom: '10px' }}>Primary Focus Points:</h4>
                  <ul style={{ color: '#ccc', paddingLeft: '20px', lineHeight: '1.6', marginBottom: '25px' }}>
                    {curriculumData[activeGrade].focus.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>

                  <button onClick={() => startTest(activeGrade)} style={btnStyle('#10b981', '#000')}>📝 TAKE PLACEMENT TEST</button>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        /* --- ACTIVE TEST & RESULTS VIEW --- */
        <div style={{ padding: '20px', overflowY: 'auto', paddingBottom: '100px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#10b981', margin: 0 }}>{activeTest} Diagnostic</h2>
            <button onClick={closeTest} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold' }}>Exit</button>
          </div>

          {!testResults ? (
            <>
              {testBank[activeTest].map((q, idx) => (
                <div key={idx} style={{ ...cardStyle, borderLeft: '3px solid #3b82f6' }}>
                  <h4 style={{ color: '#fff', margin: '0 0 15px 0' }}>{idx + 1}. {q.q}</h4>
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
              <button onClick={submitTest} style={{ ...btnStyle('#10b981', '#000'), marginTop: '10px' }}>Submit & Grade Test</button>
            </>
          ) : (
            <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
              <h2 style={{ textAlign: 'center', color: '#a855f7', margin: '0 0 10px 0' }}>TEST RESULTS</h2>
              <div style={{ textAlign: 'center', fontSize: '3em', fontWeight: 'bold', color: testResults.score === testResults.total ? '#10b981' : '#f59e0b', marginBottom: '20px' }}>
                {testResults.score} / {testResults.total}
              </div>

              {testResults.incorrect.length === 0 ? (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '15px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>Perfect Score! You have mastered this level.</div>
              ) : (
                <>
                  <h4 style={{ color: '#ef4444', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Areas for Improvement:</h4>
                  {testResults.incorrect.map((err, idx) => (
                    <div key={idx} style={{ background: '#0a0a0a', padding: '15px', borderRadius: '8px', marginBottom: '10px', borderLeft: '2px solid #ef4444' }}>
                      <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>Q: {err.question}</div>
                      <div style={{ color: '#888', fontSize: '0.9em', textDecoration: 'line-through' }}>You answered: {err.yourAnswer}</div>
                      <div style={{ color: '#10b981', fontWeight: 'bold', marginTop: '5px' }}>Correct Answer: {err.correctAnswer}</div>
                    </div>
                  ))}
                </>
              )}
              
              <button onClick={closeTest} style={{ ...btnStyle('#222', '#fff'), marginTop: '20px', border: '1px solid #444' }}>Return to Curriculum</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
