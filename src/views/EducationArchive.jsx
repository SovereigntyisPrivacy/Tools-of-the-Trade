import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GRADES = ['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'];
const SUBJECTS = [
  { id: 'Math', icon: '➗', color: '#3b82f6' },
  { id: 'Science', icon: '🔬', color: '#10b981' },
  { id: 'English', icon: '📚', color: '#a855f7' },
  { id: 'History', icon: '🏛️', color: '#f59e0b' }
];

const EDU_DB = {
  'Kindergarten': {
    'Math': { what: 'Counting to 100, basic addition/subtraction (1-10), identifying 2D and 3D shapes.', why: 'Establishes the absolute baseline of numerical logic.', how: 'Use physical manipulatives like beans or blocks.' },
    'Science': { what: 'The five senses, basic weather patterns, distinguishing living vs. non-living things.', why: 'Teaches empirical observation.', how: 'Have them categorize rocks versus plants outside.' },
    'English': { what: 'Phonics (letter sounds), basic sight words, writing their own name.', why: 'Language is the operating system of the brain.', how: 'Focus strictly on phonics (sounding it out).' },
    'History': { what: 'Understanding time (yesterday, today, tomorrow), community helpers.', why: 'Builds a foundational understanding of sequence.', how: 'Create a simple physical timeline on a wall.' }
  },
  '1st Grade': {
    'Math': { what: 'Addition/subtraction to 20, place value (tens and ones), telling time.', why: 'Place value makes large numbers comprehensible.', how: 'Bundle sticks into groups of 10 to add physically.' },
    'Science': { what: 'Plant life cycles, animal habitats, states of matter.', why: 'Introduces physical states and biology.', how: 'Boil water to physically show a liquid turning to a gas.' },
    'English': { what: 'Sentence structure, reading simple books independently.', why: 'Transitions from learning to read, into reading to learn.', how: 'Write simple sentences without punctuation and have them fix it.' },
    'History': { what: 'Past vs. Present, basic economics (needs vs. wants).', why: 'Introduces resource scarcity.', how: 'Categorize items in your house as "needs" versus "wants".' }
  },
  '2nd Grade': {
    'Math': { what: 'Addition to 100, measuring lengths, counting money.', why: 'Moves from concept to daily survival math.', how: 'Dump a jar of mixed coins and have them calculate the total.' },
    'Science': { what: 'Earth surface, properties of materials.', why: 'Builds an understanding of geology.', how: 'Test different materials for water resistance.' },
    'English': { what: 'Paragraph structure, distinguishing fiction vs. non-fiction.', why: 'Teaches how to organize chaotic thoughts.', how: 'Use the "Hamburger" method for writing paragraphs.' },
    'History': { what: 'Government basics (rules/laws), geography.', why: 'Introduces the concept of civic structure.', how: 'Draft a "Constitution" for your household.' }
  },
  '3rd Grade': {
    'Math': { what: 'Multiplication (1-10), fractions, area and perimeter.', why: 'Multiplication is rapid addition.', how: 'Use Lego bricks to teach area and fractions.' },
    'Science': { what: 'Forces and motion, weather patterns vs. climate.', why: 'Introduces Newtonian physics.', how: 'Demonstrate leverage using a crowbar.' },
    'English': { what: 'Identifying the main idea, writing narratives.', why: 'Perfects communication and logic.', how: 'Have them write literal instructions for making a sandwich.' },
    'History': { what: 'Local state history, intro to ancient civilizations.', why: 'Contextualizes their physical location.', how: 'Teach grid coordinates using a local map.' }
  },
  '4th Grade': {
    'Math': { what: 'Multi-digit multiplication, long division, angles.', why: 'Scales arithmetic up to complex problem solving.', how: 'Use protractors to measure angles around the house.' },
    'Science': { what: 'Energy transfer, wave patterns, plate tectonics.', why: 'Teaches physical laws of energy.', how: 'Demonstrate sound waves using water and a tuning fork.' },
    'English': { what: 'Theme, point of view, conducting research.', why: 'Transitions to analyzing the *intent* behind data.', how: 'Identify an author\'s bias in a news article.' },
    'History': { what: 'Early exploration, cause and effect in history.', why: 'Demonstrates history as a chain reaction.', how: 'Study the logistics and supply chains of exploration.' }
  },
  '5th Grade': {
    'Math': { what: 'Multiplying/dividing fractions, calculating volume, coordinate planes.', why: 'Moves from 2D math into 3D reality.', how: 'Calculate the volume of moving boxes.' },
    'Science': { what: 'Ecosystems, the water cycle, astronomy.', why: 'Teaches macro-systems.', how: 'Build a sealed terrarium to witness a self-sustaining ecosystem.' },
    'English': { what: 'Persuasive writing, quoting sources to avoid plagiarism.', why: 'Teaches academic integrity and argumentation.', how: 'Write a persuasive essay requiring two physical sources.' },
    'History': { what: 'US History, the Constitution, civic duties.', why: 'Explains the legal framework of the nation.', how: 'Break down the Bill of Rights.' }
  },
  
  // THE NEW INTERACTIVE TEXTBOOK FORMAT
  '6th Grade': {
    'Math': {
      isTextbook: true,
      overview: 'Welcome to Algebra. This is the critical bridge between basic arithmetic and advanced logic. You will learn how to mathematically solve for the unknown.',
      chapters: [
        {
          title: '1. Ratios and Unit Rates',
          concept: 'A ratio compares two quantities. A unit rate finds the value of a single unit to make rapid comparisons easy.',
          example: 'PROBLEM: A solar panel generates 150 watts in 3 hours. How many watts does it generate in 1 hour?\n\nStep 1: Write the ratio.\n150 watts / 3 hours\n\nStep 2: Divide the numerator by the denominator to find the rate for 1 hour.\n150 ÷ 3 = 50\n\nANSWER: 50 watts per hour.',
          application: 'Calculating fuel efficiency. If you drive 300 miles on 15 gallons of gas, your unit rate is 20 MPG. This is mandatory for operational logistics.'
        },
        {
          title: '2. Introduction to Variables (Solving for X)',
          concept: 'A variable (like "x") is a placeholder for an unknown number. The goal is to isolate "x" on one side of the equals sign by performing the opposite operation.',
          example: 'EQUATION: 4x + 2 = 14\n\nStep 1: Isolate the variable term by subtracting 2 from both sides to keep the scale balanced.\n4x + 2 (- 2) = 14 (- 2)\n4x = 12\n\nStep 2: Isolate x by dividing both sides by 4.\n4x / 4 = 12 / 4\nx = 3\n\nANSWER: x = 3',
          application: 'Budgeting: If you have $14, and buy a $2 cable, how many $4 batteries (x) can you afford? 4x + 2 = 14. You can buy 3.'
        },
        {
          title: '3. Dividing Fractions',
          concept: 'To divide by a fraction, you multiply by its reciprocal. This is known as Keep-Change-Flip.',
          example: 'PROBLEM: 1/2 ÷ 3/4\n\nStep 1: KEEP the first fraction (1/2).\nStep 2: CHANGE division to multiplication (×).\nStep 3: FLIP the second fraction (4/3).\n\nEquation becomes: 1/2 × 4/3\n\nStep 4: Multiply straight across (numerators together, denominators together).\n(1 × 4) / (2 × 3) = 4/6\n\nStep 5: Simplify. Both divide by 2.\nANSWER: 2/3.',
          application: 'Scaling down a recipe or calculating medication dosages when dealing with fractional supply.'
        }
      ]
    },
    'Science': {
      isTextbook: true,
      overview: '6th Grade science shifts from localized biology to massive planetary physics. It teaches the scale of the universe and the immense geological forces that dictate human habitats.',
      chapters: [
        {
          title: '1. Plate Tectonics & Earth\'s Crust',
          concept: 'The Earth\'s crust is broken into massive plates floating on molten mantle. Their interactions create earthquakes, volcanoes, and mountains.',
          example: 'PLATE BOUNDARIES:\n\n1. Convergent: Plates crash together (creates mountains, e.g., Himalayas).\n2. Divergent: Plates pull apart (creates new ocean floor, e.g., Mid-Atlantic Ridge).\n3. Transform: Plates slide past each other (creates severe earthquakes, e.g., San Andreas Fault).',
          application: 'If you are establishing an off-grid location, checking fault lines and tectonic maps prevents building critical infrastructure in earthquake or volcanic zones.'
        },
        {
          title: '2. The Solar System & Mathematical Scale',
          concept: 'The universe is unfathomably vast. Earth is a tiny rocky body orbiting an average star.',
          example: 'SCALE MATHEMATICS:\n\nIf the Earth was the size of a standard classroom globe (12 inches across):\n- The Moon would be a baseball 30 feet away.\n- The Sun would be a 109-foot-wide sphere located 2.2 miles away.\n- The nearest star (Proxima Centauri) would be 580,000 miles away.',
          application: 'Understanding the physics of vast scale is critical for everything from radio wave propagation to long-distance ballistics and satellite navigation.'
        }
      ]
    },
    'English': {
      isTextbook: true,
      overview: 'This is the age of critical defense. Students must learn that not everything written is true, and that words are actively weaponized to manipulate human emotion.',
      chapters: [
        {
          title: '1. Argumentative Structure (CER)',
          concept: 'A structured argument relies on three pillars: Claim, Evidence, and Reasoning (CER). Without all three, an argument is just an opinion.',
          example: 'TOPIC: Solar vs. Gas Generators\n\nCLAIM: Solar panels are superior for long-term survival.\n\nEVIDENCE: Gas generators require refined fuel, which degrades within 6 months. Solar panels degrade at 0.5% per year.\n\nREASONING: Because long-term survival limits access to refined fuel supply chains, a power source that relies on an infinite external resource (the sun) is mathematically superior.',
          application: 'Use CER to defend operational decisions. If you cannot provide evidence and reasoning for a plan, the plan is flawed and dangerous.'
        },
        {
          title: '2. Analyzing Propaganda & Bias',
          concept: 'Identifying how authors use emotional language, omission of facts, and logical fallacies to manipulate the reader.',
          example: 'TEXT ANALYSIS:\n"The reckless new law will destroy our beautiful community."\n\nBREAKDOWN:\n- "Reckless" and "Destroy" are emotionally charged words meant to trigger fear.\n- "Beautiful community" invokes tribal loyalty.\n- The author provides zero factual evidence of *what* the law does, relying entirely on emotional manipulation.',
          application: 'Defending yourself against political, corporate, and media manipulation by stripping emotion from the text and looking only at the raw data.'
        }
      ]
    },
    'History': {
      isTextbook: true,
      overview: 'To understand why modern society and laws look the way they do, one must understand how the very first societies solved the primitive problems of starvation and resource distribution.',
      chapters: [
        {
          title: '1. The Agricultural Revolution',
          concept: 'The transition from nomadic hunter-gatherer tribes to settled farming communities. This created food surpluses, allowing for specialized labor and the birth of cities.',
          example: 'SCENARIO ANALYSIS:\n\nNomadic Tribe: Spends 90% of energy hunting/foraging. Cannot store food long-term. Population size is severely limited by wild game.\n\nAgricultural Society: 50% of the population farms. The food surplus allows the other 50% to become soldiers, builders, and scholars. Civilization begins.',
          application: 'Analyze off-grid survival. Hunting is unsustainable long-term. True survival requires establishing sustainable, defensible agriculture.'
        },
        {
          title: '2. Mesopotamia & The First Laws',
          concept: 'Located between the Tigris and Euphrates rivers. They created the first written language (Cuneiform) and the first written legal code (Code of Hammurabi).',
          example: 'HAMMURABI\'S CODE: "An eye for an eye."\n\nANALYSIS:\nWhile it sounds brutal today, establishing a written code prevented arbitrary, infinite punishment by rulers. If the law is written in stone, the King cannot change it on a whim. It established the concept of the Rule of Law.',
          application: 'Understanding why written constitutions (like the US Bill of Rights) exist: to mathematically bind the hands of the government and prevent arbitrary tyranny.'
        }
      ]
    }
  }
};

export default function EducationArchive() {
  const navigate = useNavigate();
  const [activeGrade, setActiveGrade] = useState('6th Grade');
  const [activeSubject, setActiveSubject] = useState('Math');

  const currentData = EDU_DB[activeGrade]?.[activeSubject];

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER */}
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#f59e0b', fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '1px' }}>Education Archive</h2>
      </header>

      {/* GRADE SCROLL BAR */}
      <div style={{ padding: '15px', overflowX: 'auto', display: 'flex', gap: '10px', borderBottom: '1px solid #222', scrollbarWidth: 'none' }}>
        {GRADES.map(grade => (
          <button
            key={grade}
            onClick={() => setActiveGrade(grade)}
            style={{
              background: activeGrade === grade ? 'rgba(245, 158, 11, 0.15)' : '#111',
              color: activeGrade === grade ? '#f59e0b' : '#888',
              border: activeGrade === grade ? '1px solid #f59e0b' : '1px solid #333',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              fontSize: '1em',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {grade}
          </button>
        ))}
      </div>

      {/* SUBJECT SELECTOR */}
      <div style={{ padding: '15px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', borderBottom: '1px solid #222' }}>
        {SUBJECTS.map(sub => (
          <button
            key={sub.id}
            onClick={() => setActiveSubject(sub.id)}
            style={{
              background: activeSubject === sub.id ? `rgba(${hexToRgb(sub.color)}, 0.15)` : '#111',
              color: activeSubject === sub.id ? sub.color : '#888',
              border: activeSubject === sub.id ? `1px solid ${sub.color}` : '1px solid #333',
              padding: '12px 5px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '0.85em',
              textTransform: 'uppercase',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '1.5em' }}>{sub.icon}</span>
            {sub.id}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div style={{ padding: '20px', overflowY: 'auto' }}>
        {currentData ? (
          currentData.isTextbook ? (
            // TEXTBOOK RENDER ENGINE (6TH GRADE & UP)
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: '#111', borderRadius: '12px', padding: '20px', borderLeft: `4px solid ${SUBJECTS.find(s => s.id === activeSubject).color}` }}>
                <h3 style={{ color: '#fff', marginTop: 0, textTransform: 'uppercase' }}>{activeSubject} Overview</h3>
                <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '1em', margin: 0 }}>{currentData.overview}</p>
              </div>

              {currentData.chapters.map((chap, idx) => (
                <div key={idx} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #333' }}>
                  <h4 style={{ color: SUBJECTS.find(s => s.id === activeSubject).color, marginTop: 0, fontSize: '1.1em', borderBottom: '1px solid #222', paddingBottom: '10px' }}>{chap.title}</h4>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#fff', textTransform: 'uppercase', fontSize: '0.85em', letterSpacing: '1px' }}>Core Concept:</strong>
                    <p style={{ color: '#ccc', margin: '5px 0 0 0', lineHeight: '1.5', fontSize: '0.95em' }}>{chap.concept}</p>
                  </div>
                  
                  <div style={{ background: '#000', padding: '15px', borderRadius: '8px', borderLeft: `2px solid ${SUBJECTS.find(s => s.id === activeSubject).color}`, marginBottom: '15px' }}>
                    <strong style={{ color: SUBJECTS.find(s => s.id === activeSubject).color, display: 'block', marginBottom: '8px', textTransform: 'uppercase', fontSize: '0.85em' }}>Worked Example / Breakdown:</strong>
                    <pre style={{ color: '#aaa', margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9em', lineHeight: '1.5' }}>{chap.example}</pre>
                  </div>
                  
                  <div>
                    <strong style={{ color: '#fff', textTransform: 'uppercase', fontSize: '0.85em', letterSpacing: '1px' }}>Tactical Application:</strong>
                    <p style={{ color: '#aaa', margin: '5px 0 0 0', lineHeight: '1.5', fontSize: '0.9em', fontStyle: 'italic' }}>{chap.application}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // BASIC OVERVIEW RENDER ENGINE (K-5)
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: '#111', borderRadius: '12px', padding: '20px', borderLeft: `4px solid ${SUBJECTS.find(s => s.id === activeSubject).color}` }}>
                <h3 style={{ color: '#fff', marginTop: 0, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: SUBJECTS.find(s => s.id === activeSubject).color }}>WHAT</span> To Teach
                </h3>
                <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '1em', margin: 0 }}>{currentData.what}</p>
              </div>

              <div style={{ background: '#111', borderRadius: '12px', padding: '20px', borderLeft: '4px solid #f97316' }}>
                <h3 style={{ color: '#fff', marginTop: 0, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#f97316' }}>WHY</span> It Matters
                </h3>
                <p style={{ color: '#aaa', lineHeight: '1.6', fontSize: '0.95em', margin: 0 }}>{currentData.why}</p>
              </div>

              <div style={{ background: '#111', borderRadius: '12px', padding: '20px', borderLeft: '4px solid #10b981' }}>
                <h3 style={{ color: '#fff', marginTop: 0, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#10b981' }}>HOW</span> To Execute
                </h3>
                <p style={{ color: '#aaa', lineHeight: '1.6', fontSize: '0.95em', margin: 0 }}>{currentData.how}</p>
              </div>
            </div>
          )
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            <span style={{ fontSize: '3em', display: 'block', marginBottom: '15px' }}>🚧</span>
            <h3 style={{ margin: 0, color: '#fff' }}>Textbook in Development</h3>
            <p style={{ marginTop: '10px' }}>The rigorous interactive curriculum for {activeGrade} is being compiled by Sovereign engineers and will be injected in the next database update.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
}
