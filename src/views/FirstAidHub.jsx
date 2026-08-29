import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TCCC_GUIDES = [
  {
    title: 'Massive Hemorrhage (Bleeding)', icon: '🩸',
    steps: ['1. Identify life-threatening arterial bleeding (bright red, spurting, or pooling rapidly).', '2. Apply a TQ (Tourniquet) 2-3 inches above the wound, not over a joint.', '3. If bleeding continues, apply a second TQ side-by-side above the first.', '4. Tighten the windlass until bleeding completely stops. Secure it.', '5. Note the exact time of TQ application on the patient.'],
    tip: 'PRO-TIP: A tourniquet will hurt the patient immensely. Ignore their screaming. It means they are alive.'
  },
  {
    title: 'Airway & Chest Wounds', icon: '🫁',
    steps: ['1. Assess for penetrating trauma to the chest, back, or armpits.', '2. Wipe the area dry of blood and sweat.', '3. Apply a vented chest seal over the hole during EXHALATION.', '4. Check for an exit wound on the back and seal it as well.', '5. Place the casualty in the recovery position (injured side down).'],
    tip: 'PRO-TIP: If you don\'t have a chest seal, duct tape and a plastic wrapper taped on 3 sides creates a makeshift flutter valve.'
  },
  {
    title: 'Hypovolemic Shock', icon: '🥶',
    steps: ['1. Assess for shock: pale, cold, clammy skin, rapid breathing, confusion.', '2. Stop all massive bleeding first.', '3. Keep the casualty extremely warm (space blanket, body heat).', '4. Elevate the legs slightly if no spinal injury is suspected.', '5. Do NOT give them food or water, even if they beg for it.'],
    tip: 'PRO-TIP: Shock kills after the bleeding stops. Heat retention is your primary fight once the holes are plugged.'
  }
];

const GENERAL_GUIDES = [
  {
    title: 'Burns (Thermal)', icon: '🔥',
    steps: ['1. Remove the casualty from the heat source.', '2. Cool the burn immediately with cool (not freezing) running water for 10-20 minutes.', '3. Do NOT pop blisters. Do NOT apply ice or butter to severe burns.', '4. Cover with a sterile, non-fluffy dressing.'],
    tip: 'PRO-TIP: Ice restricts blood flow and deepens tissue damage on a burn. Stick to cool water.'
  },
  {
    title: 'Choking (Heimlich)', icon: '🗣️',
    steps: ['1. Ask "Are you choking?" If they cannot speak, act immediately.', '2. Stand behind them, wrap your arms around their waist.', '3. Make a fist with one hand, place it just above their belly button.', '4. Grab your fist with the other hand and perform quick, upward thrusts.'],
    tip: 'PRO-TIP: If you are alone and choking, throw your upper abdomen over the hard edge of a chair or table.'
  }
];

const REMEDIES_GUIDES = [
  {
    title: 'Tooth & Gum Pain (Clove)', icon: '🦷',
    steps: ['1. Brew a strong tea using whole cloves and cinnamon sticks.', '2. Let it cool until warm, then swish vigorously in the mouth.', '3. Alternatively, dab diluted essential clove oil directly onto the affected tooth.'],
    tip: 'PRO-TIP: Clove contains Eugenol, a scientifically proven natural anesthetic and antibacterial agent used in professional dentistry.'
  },
  {
    title: 'Congestion & Sinus (Cayenne & Honey)', icon: '🍯',
    steps: ['1. Mix a pinch of cayenne pepper into a spoonful of raw honey (or hot water with lemon).', '2. Consume slowly to coat the throat.', '3. Expect your nose to run immediately—keep tissues handy.'],
    tip: 'PRO-TIP: Capsaicin in cayenne rapidly thins mucus and stimulates drainage, while honey acts as a natural antimicrobial throat coat.'
  },
  {
    title: 'Cough & Sickness Syrup (Onion & Honey)', icon: '🧅',
    steps: ['1. Chop a raw onion and place it in a jar.', '2. Cover the chopped onion entirely in raw honey and seal the jar.', '3. Let it sit on the counter for 8-12 hours until the honey draws out the onion juice.', '4. Take a spoonful of the resulting liquid syrup for coughs.'],
    tip: 'PRO-TIP: Onions are packed with Quercetin (an antihistamine) and sulfur compounds that reduce inflammation. The honey preserves it and suppresses coughing.'
  },
  {
    title: 'Deep Muscle & Nerve Pain (Capsaicin)', icon: '🌶️',
    steps: ['1. Create a topical salve using cayenne pepper powder and a carrier oil (like coconut oil).', '2. Rub directly into the skin over the aching joint, muscle, or nerve.', '3. Wash hands thoroughly. Do NOT touch your eyes.'],
    tip: 'PRO-TIP: The intense burning sensation safely depletes "Substance P", a chemical that carries pain signals to your brain.'
  },
  {
    title: 'Burns, Cuts & Skin Trauma (Aloe Vera)', icon: '🪴',
    steps: ['1. Break or tear off a piece of a raw Aloe Vera plant.', '2. Squeeze the inner gel directly onto the wound, rash, or burn.', '3. Reapply as it dries out to maintain a protective, cooling barrier.'],
    tip: 'PRO-TIP: Raw aloe is naturally antimicrobial and accelerates cellular regeneration for surface-level trauma.'
  },
  {
    title: 'Nausea & Digestion (Ginger)', icon: '🫚',
    steps: ['1. Chew on a small piece of raw, peeled ginger root.', '2. Alternatively, steep sliced ginger in hot water for 10 minutes to make a potent tea.'],
    tip: 'PRO-TIP: Gingerol, the active compound in ginger, is a scientifically proven antiemetic that blocks nausea signals in the gut.'
  }
];

const WARNINGS_GUIDES = [
  {
    title: 'Unwashed Poppy Seeds', icon: '⚠️',
    desc: 'Avoid consuming large amounts before medical, military, CDL, or employment drug screenings. They can trigger a false positive for opiates.'
  },
  {
    title: 'Activated Charcoal & Medications', icon: '⚠️',
    desc: 'Charcoal is great for food poisoning because it absorbs toxins in the stomach. However, it will also absorb and neutralize any prescription medications you took recently.'
  },
  {
    title: 'Undiluted Essential Oils', icon: '⚠️',
    desc: 'Never put "hot" oils (like Oregano, Clove, or Peppermint) directly on the skin without mixing them into a carrier oil (like coconut or olive oil) first. They can cause severe chemical burns.'
  }
];

export default function FirstAidHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cpr');
  const [cprActive, setCprActive] = useState(false);
  const [compressionCount, setCompressionCount] = useState(0);
  const [phase, setPhase] = useState('standby');
  const [pulseToggle, setPulseToggle] = useState(false);

  useEffect(() => {
    let interval;
    if (cprActive && phase === 'compressions') {
      interval = setInterval(() => {
        setPulseToggle(p => !p);
        setCompressionCount(prev => {
          if (prev >= 29) {
            setPhase('breaths');
            return 30;
          }
          return prev + 1;
        });
      }, 600); // 100 BPM
    } else if (cprActive && phase === 'breaths') {
      interval = setTimeout(() => {
        setPhase('compressions');
        setCompressionCount(0);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
      if (interval) clearTimeout(interval);
    };
  }, [cprActive, phase]);

  const toggleCPR = () => {
    if (cprActive) {
      setCprActive(false); setPhase('standby'); setCompressionCount(0);
    } else {
      setCprActive(true); setPhase('compressions'); setCompressionCount(0);
    }
  };

  const glassCard = { background: 'rgba(17, 17, 17, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '15px' };

  const renderCPR = () => (
    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ ...glassCard, borderTop: '4px solid #ef4444', width: '100%', textAlign: 'center' }}>
        <h3 style={{ color: '#ef4444', marginTop: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>CPR Assistant</h3>
        <p style={{ color: '#ccc', fontSize: '0.85rem', marginBottom: '20px' }}>
          <strong>HANDS-ONLY CPR:</strong> Push hard and fast in the center of the chest at 100 beats per minute. Do not stop until help arrives.
        </p>
        
        <div style={{ 
          width: '240px', height: '240px', borderRadius: '50%', margin: '0 auto 25px auto',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          background: phase === 'compressions' ? (pulseToggle ? '#ef4444' : '#7f1d1d') : (phase === 'breaths' ? '#1e3a8a' : '#111'),
          border: `4px solid ${phase === 'standby' ? '#333' : (phase === 'breaths' ? '#3b82f6' : '#fca5a5')}`,
          boxShadow: phase === 'compressions' && pulseToggle ? '0 0 30px rgba(239, 68, 68, 0.8)' : 'none',
          transition: 'background 0.1s, box-shadow 0.1s'
        }}>
          {phase === 'standby' && <span style={{ color: '#888', fontSize: '1.2rem', fontWeight: 'bold' }}>READY</span>}
          {phase === 'compressions' && (
            <>
              <span style={{ color: '#fff', fontSize: '5rem', fontWeight: '900', lineHeight: '1' }}>{compressionCount}</span>
              <span style={{ color: '#fca5a5', fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase' }}>PUSH</span>
            </>
          )}
          {phase === 'breaths' && (
            <>
              <span style={{ color: '#fff', fontSize: '1.6rem', fontWeight: '900', textAlign: 'center', padding: '0 10px' }}>GIVE 2 BREATHS</span>
              <span style={{ color: '#facc15', fontSize: '1rem', fontWeight: 'bold', marginTop: '10px', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px' }}>*OPTIONAL*</span>
            </>
          )}
        </div>

        <button onClick={toggleCPR} style={{ width: '100%', background: cprActive ? '#222' : '#ef4444', color: cprActive ? '#ef4444' : '#fff', border: cprActive ? '2px solid #ef4444' : 'none', padding: '18px', borderRadius: '8px', fontWeight: '900', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {cprActive ? '🛑 STOP CPR' : '🚨 START CPR METRONOME'}
        </button>
      </div>

      <div style={{ ...glassCard, width: '100%', borderLeft: '4px solid #facc15' }}>
        <h4 style={{ color: '#facc15', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Hands-Only vs. Standard</h4>
        <p style={{ color: '#888', fontSize: '0.8rem', margin: '0 0 10px 0' }}>If you are untrained or fear disease transmission, skip the breaths entirely and provide continuous compressions. The blood already contains enough oxygen to keep the brain alive for several minutes.</p>
      </div>
    </div>
  );

  const renderDatabase = (db, accentColor) => (
    <div style={{ marginTop: '20px' }}>
      {db.map((item, idx) => (
        <div key={idx} style={{ ...glassCard, borderLeft: `4px solid ${accentColor}`, padding: '0', overflow: 'hidden' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>{item.title}</h3>
          </div>
          <div style={{ padding: '15px' }}>
            {item.steps.map((step, sIdx) => (
              <p key={sIdx} style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 10px 0', paddingLeft: '10px', textIndent: '-10px' }}>
                {step}
              </p>
            ))}
            {item.tip && (
              <div style={{ marginTop: '15px', padding: '10px', background: '#111', borderRadius: '6px', border: `1px solid ${accentColor}` }}>
                <p style={{ margin: 0, color: accentColor, fontSize: '0.85rem', fontWeight: 'bold' }}>{item.tip}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderRemedies = () => (
    <div>
      {renderDatabase(REMEDIES_GUIDES, '#10b981')}
      
      <h3 style={{ color: '#ef4444', textTransform: 'uppercase', textAlign: 'center', marginTop: '30px', marginBottom: '15px', letterSpacing: '2px' }}>Red Flags & Avoidance</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {WARNINGS_GUIDES.map((warn, idx) => (
          <div key={idx} style={{ ...glassCard, borderTop: '3px solid #ef4444', margin: 0, padding: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>{warn.icon}</span>
              <h4 style={{ margin: 0, color: '#ef4444', fontSize: '1rem', textTransform: 'uppercase' }}>{warn.title}</h4>
            </div>
            <p style={{ color: '#ccc', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>{warn.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.8)' }}>
        <button onClick={() => { if(cprActive) toggleCPR(); navigate(-1); }} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#ef4444', fontSize: '1.2rem' }}>Trauma & First Aid</h2>
      </header>

      <div style={{ background: '#7f1d1d', padding: '10px', textAlign: 'center', fontSize: '0.75rem', color: '#fca5a5', fontWeight: 'bold', letterSpacing: '1px' }}>
        FOR EDUCATIONAL REFERENCE. CALL 911 IMMEDIATELY IN AN EMERGENCY.
      </div>

      <div style={{ display: 'flex', padding: '15px', gap: '8px', background: 'rgba(0,0,0,0.5)', overflowX: 'auto', whiteSpace: 'nowrap', WebkitOverflowScrolling: 'touch' }}>
        <button onClick={() => setActiveTab('cpr')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'cpr' ? '#ef4444' : '#222', color: activeTab === 'cpr' ? '#fff' : '#888' }}>CPR Assist</button>
        <button onClick={() => setActiveTab('tccc')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'tccc' ? '#f97316' : '#222', color: activeTab === 'tccc' ? '#fff' : '#888' }}>TCCC / Trauma</button>
        <button onClick={() => setActiveTab('general')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'general' ? '#3b82f6' : '#222', color: activeTab === 'general' ? '#fff' : '#888' }}>General Aid</button>
        <button onClick={() => setActiveTab('remedies')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'remedies' ? '#10b981' : '#222', color: activeTab === 'remedies' ? '#fff' : '#888' }}>Natural Remedies</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        {activeTab === 'cpr' && renderCPR()}
        {activeTab === 'tccc' && renderDatabase(TCCC_GUIDES, '#f97316')}
        {activeTab === 'general' && renderDatabase(GENERAL_GUIDES, '#3b82f6')}
        {activeTab === 'remedies' && renderRemedies()}
      </div>
    </div>
  );
}
