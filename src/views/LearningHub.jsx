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
  const [activeGrade, setActiveGrade] = useState('1st');
  const [expandedItem, setExpandedItem] = useState(null);
  
  const [quizActive, setQuizActive] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const gradesList = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', 'GED / College'];

  // --- SUPERNATURAL DATABASES ---
  const tarotDeck = [
    { name: '0 - The Fool', keywords: 'New beginnings, spontaneity, blind faith', desc: 'Represents a leap into the unknown. A reminder to embrace chaos and trust the journey.' },
    { name: 'I - The Magician', keywords: 'Willpower, manifestation, resourcefulness', desc: 'You have the tools and the power to manipulate your reality.' }
  ];

  const elementsDB = [
    { name: 'Earth', color: 'Green or Brown', direction: 'North', props: 'Grounding, nurturing, supportive, stable, feminine & receptive', desc: 'Represents the very base of existence; it is the foundation.' },
    { name: 'Air', color: 'Yellow', direction: 'East', props: 'Transport, movement, communication, sound, intellect, travel', desc: 'Represents movement & the breath of life.' },
    { name: 'Water', color: 'Blue', direction: 'West', props: 'Cleansing, healing, purifying, feminine & receptive', desc: 'Corresponds to emotions.' },
    { name: 'Fire', color: 'Red', direction: 'South', props: 'Transformative, destructive, purifying, passionate, consuming, masculine, projective', desc: 'Represents swift transformation.' }
  ];

  const sabbatsDB = [
    { name: 'Samhain', date: 'Oct 31st', type: 'Greater Sabbat / Fire Festival', desc: '(Pronounced Sowin). Marks the pagan New Year, Halloween or All Hallows Eve.' },
    { name: 'Yule', date: 'Dec 21st or 22nd', type: 'Lesser Sabbat / Solar Festival', desc: 'Winter Solstice. Shortest day of the year. Celebrated as the rebirth of the sun.' }
  ];

  const lunarDB = [
    { name: 'The Triple Goddess', type: 'Archetypes', desc: 'The Maiden (New/Waxing Moon), The Mother (Full Moon), The Crone (Waning/Dark Moon).' },
    { name: 'Full Moon', type: 'Potent Power', desc: 'Most potent time to do any magickal work. Invoking, protecting, or healing.' }
  ];

  // --- SCHOOL CURRICULUM & QUIZ DATABASES ---
  const schoolCurriculum = {
    'K': { 
      math: [
        { topic: 'Counting 1-20', content: 'Numbers tell us how many. Practice: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20.' },
        { topic: 'Basic Shapes', content: 'Circle (round, no corners). Square (4 equal sides). Triangle (3 sides).' },
        { topic: 'Simple Addition', content: 'Adding means putting things together. If you have 1 apple and get 1 more, you have 2 apples (1 + 1 = 2).' }
      ],
      science: [
        { topic: 'The Five Senses', content: 'Sight (Eyes), Hearing (Ears), Smell (Nose), Taste (Tongue), Touch (Skin/Hands).' },
        { topic: 'Living vs. Non-Living', content: 'Living things grow, eat, and breathe (Trees, Dogs, People). Non-living things do not (Rocks, Cars, Toys).' }
      ],
      language: [
        { topic: 'The Alphabet', content: 'There are 26 letters. Vowels are A, E, I, O, U. The rest are consonants.' },
        { topic: 'Sight Words', content: 'Words you should recognize instantly: The, And, Is, It, We, To, You, He, I.' }
      ],
      history: [
        { topic: 'Community Helpers', content: 'Firefighters put out fires. Doctors keep us healthy. Teachers help us learn. Police keep us safe.' },
        { topic: 'Time & Days', content: 'There are 7 days in a week: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.' }
      ]
    },
    '1st': { 
      math: [
        { topic: 'Addition & Subtraction (0-20)', content: 'Adding is combining numbers (8 + 4 = 12). Subtraction is taking away (15 - 5 = 10).' },
        { topic: 'Place Value', content: 'Numbers are made of Tens and Ones. In the number 34, there are 3 Tens and 4 Ones.' },
        { topic: 'Telling Time', content: 'The short hand is the Hour, the long hand is the Minute. There are 60 minutes in 1 hour.' }
      ],
      science: [
        { topic: 'Plant Life Cycles', content: 'Plants start as a Seed, grow roots, sprout into a Seedling, and become an Adult Plant with flowers.' },
        { topic: 'Light & Sound', content: 'Light from the sun helps us see. Sound is made by vibrations that travel to our ears.' },
        { topic: 'Sky Patterns', content: 'The Sun gives us light and warmth during the day. The Moon and stars are visible at night.' }
      ],
      language: [
        { topic: 'Sentences & Punctuation', content: 'A sentence always starts with a Capital Letter and ends with punctuation like a period (.) or question mark (?).' },
        { topic: 'Nouns & Verbs', content: 'A Noun is a person, place, or thing (Dog, School, Apple). A Verb is an action word (Run, Jump, Read).' }
      ],
      history: [
        { topic: 'Past vs. Present', content: 'The Past is what happened before (long ago, people rode horses). The Present is happening now (we drive cars).' },
        { topic: 'Maps & Globes', content: 'A map is a flat picture of a place. A globe is a round model of the whole Earth.' }
      ]
    },
    '2nd': { math: [{topic:'Notice', content:'Module currently under construction.'}], science: [], language: [], history: [] }
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
      { q: 'What is 12 - 4?', options: ['8', '16', '6', '9'], answer: '8' },
      { q: 'Which word is a Verb (an action word)?', options: ['Apple', 'Run', 'School', 'Blue'], answer: 'Run' },
      { q: 'What does a plant start as before it grows?', options: ['A Flower', 'A Leaf', 'A Seed', 'A Tree'], answer: 'A Seed' }
    ]
  };

  // --- ACTIONS ---
  const toggleExpand = (name) => setExpandedItem(expandedItem === name ? null : name);

  const handleAnswer = (opt, correct) => {
    if (opt === correct) setScore(s => s + 1);
    if (currentQ < quizzes[activeGrade].length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setQuizActive(false); setShowResults(false); setCurrentQ(0); setScore(0);
  };

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #222', padding: '15px', marginBottom: '15px' };
  const tertTabStyle = (tabName, activeName, color) => ({
    flex: '0 0 auto', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85em', fontWeight: 'bold', border: `1px solid ${color}`,
    background: activeName === tabName ? color : 'transparent', color: activeName === tabName ? '#fff' : color
  });

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
        <button onClick={() => setActiveCategory('paganism')} style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeCategory === 'paganism' ? '#10b981' : '#222', color: activeCategory === 'paganism' ? '#fff' : '#888' }}>🌿 Paganism</button>
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
                  {['math', 'science', 'language', 'history'].map((subj) => (
                    schoolCurriculum[activeGrade][subj]?.length > 0 && (
                      <div key={subj} style={{ marginBottom: '20px' }}>
                        <div style={{ color: '#fff', fontSize: '1.1em', textTransform: 'uppercase', fontWeight: '900', borderBottom: '2px solid #333', paddingBottom: '5px', marginBottom: '10px' }}>
                          {subj === 'math' ? '🔢 Math' : subj === 'science' ? '🔬 Science' : subj === 'language' ? '📖 Language & Reading' : '🌍 History & Society'}
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

        {/* QUIZ MODAL */}
        {quizActive && quizzes[activeGrade] && (
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
              <div style={{ background: '#111', padding: '30px 20px', borderRadius: '12px', border: `2px solid ${(score / quizzes[activeGrade].length) >= 0.8 ? '#10b981' : '#ef4444'}`, textAlign: 'center' }}>
                <h2 style={{ color: (score / quizzes[activeGrade].length) >= 0.8 ? '#10b981' : '#ef4444', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '2em' }}>
                  {(score / quizzes[activeGrade].length) >= 0.8 ? 'PASSED!' : 'FAILED'}
                </h2>
                <div style={{ color: '#fff', fontSize: '1.2em', marginBottom: '20px' }}>You scored {score} out of {quizzes[activeGrade].length}.</div>
                <p style={{ color: '#ccc', marginBottom: '30px' }}>
                  {(score / quizzes[activeGrade].length) >= 0.8 ? `Great job! You have mastered the Grade ${activeGrade} curriculum.` : 'Please review the reference books and try the exam again.'}
                </p>
                <button onClick={resetQuiz} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '15px 30px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>
                  Return to Books
                </button>
              </div>
            )}
          </div>
        )}

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
          </div>
        )}

      </div>
    </div>
  );
}
