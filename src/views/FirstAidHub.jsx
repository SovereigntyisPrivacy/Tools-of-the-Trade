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
    steps: ['1. Assess for shock: pale, cold, clammy skin, rapid breathing, confusion.', '2. Stop all massive bleeding first.', '3. Keep the casualty extremely warm (space blanket, body heat).', '4. Elevate the legs slightly if no spinal injury is suspected.', '5. DO NOT give them food or water, even if they beg for it.'],
    tip: 'PRO-TIP: Shock kills after the bleeding stops. Heat retention is your primary fight once the holes are plugged.'
  }
];

const GENERAL_GUIDES = [
  {
    title: 'Automated External Defibrillator (AED)', icon: '⚡',
    steps: ['1. Use immediately if casualty is unresponsive and not breathing normally.', '2. Turn the AED on. It will give audible voice prompts.', '3. Bare the patient\'s chest. Wipe it completely dry if wet.', '4. Apply the pads exactly as shown in the pictures on the pads.', '5. Plug in the connector if necessary.', '6. Loudly command "CLEAR" and ensure no one is touching the patient when analyzing or shocking.'],
    tip: 'PRO-TIP: Resume CPR immediately after a shock is delivered or if no shock is advised. Do not remove the pads.'
  },
  {
    title: 'Naloxone (Narcan) Administration', icon: '💉',
    steps: ['1. Identify opioid overdose: pinpoint pupils, slow/no breathing, blue lips, unresponsiveness.', '2. Peel back the package. Hold the device with your thumb on the bottom plunger and two fingers on the nozzle.', '3. Insert the nozzle fully into one nostril until your fingers touch the bottom of their nose.', '4. Press the plunger firmly to release the dose.', '5. Begin CPR immediately if they are not breathing. If no response in 2-3 minutes, give a second dose in the other nostril.'],
    tip: 'PRO-TIP: Narcan will NOT harm someone if they are not experiencing an opioid overdose. When in doubt, administer it.'
  },
  {
    title: 'Splinting (Fractures & Sprains)', icon: '🦴',
    steps: ['1. Splint if you suspect a fracture, dislocation, or severe sprain to prevent further nerve/tissue damage.', '2. DO NOT try to realign or straighten the injured limb.', '3. Find two rigid objects (sticks, rolled magazines, boards, tent poles).', '4. Pad the rigid objects with clothing or towels to prevent pressure sores.', '5. Place them on either side of the limb, securing them snugly above and below the injury using cloth strips, duct tape, or bandages.'],
    tip: 'PRO-TIP: Always check circulation after splinting. Pinch a fingernail or toenail on the injured limb; if the pink color does not return in 2 seconds, the splint is too tight.'
  },
  {
    title: 'Wrapping a Sprain (ACE Wrap)', icon: '🩹',
    steps: ['1. Start wrapping the elastic bandage BELOW the injury (furthest from the heart) to push swelling upward.', '2. Wrap in a figure-eight pattern around joints (like ankles or wrists) for stability.', '3. Overlap each layer by roughly half the width of the bandage.', '4. Secure the end with clips, tape, or by tucking it under a fold.'],
    tip: 'PRO-TIP: Remove the wrap at night while sleeping to ensure unrestricted blood flow.'
  },
  {
    title: 'The Recovery Position', icon: '🛌',
    steps: ['1. Extend the arm closest to you at a right angle (like a wave).', '2. Bring their other arm across their chest, placing the back of their hand against their opposite cheek.', '3. Bend their furthest knee so their foot is flat on the floor.', '4. Pull the bent knee towards you, smoothly rolling them onto their side.', '5. Tilt their head back slightly to keep the airway open.'],
    tip: 'PRO-TIP: Gravity keeps the airway clear of the tongue and vomit. Never use this if severe spinal injury is suspected unless their airway is completely blocked.'
  },
  {
    title: 'Burns (Thermal)', icon: '🔥',
    steps: ['1. Remove the casualty from the heat source.', '2. Cool the burn immediately with cool (not freezing) running water for 10-20 minutes.', '3. DO NOT pop blisters. DO NOT apply ice or butter to severe burns.', '4. Cover with a sterile, non-fluffy dressing.'],
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
    title: 'Homemade Slush Ice Pack', icon: '🧊',
    steps: ['1. Pour 1 part rubbing alcohol (isopropyl) and 2 parts water into a sealable plastic bag (like a Ziploc).', '2. Add a handful of cotton swabs or cotton balls to absorb the liquid and hold the chill.', '3. Squeeze out as much air as possible and seal tightly.', '4. Double-bag it to prevent leaks and place in the freezer.'],
    tip: 'PRO-TIP: The alcohol lowers the freezing point of the water, creating a flexible, slushy gel pack instead of a rock-hard block of ice.'
  },
  {
    title: 'Tooth & Gum Pain (Clove)', icon: '🦷',
    steps: ['1. Brew a strong tea using whole cloves and cinnamon sticks.', '2. Let it cool until warm, then swish vigorously in the mouth.', '3. Alternatively, dab diluted essential clove oil directly onto the affected tooth.'],
    tip: 'PRO-TIP: Clove contains Eugenol, a scientifically proven natural anesthetic and antibacterial agent used in professional dentistry.'
  },
  {
    title: 'Congestion & Sinus (Cayenne & Honey)', icon: '🌶️',
    steps: ['1. Mix a pinch of cayenne pepper into a spoonful of raw honey (or hot water with lemon).', '2. Consume slowly to coat the throat.', '3. Expect your nose to run immediately—keep tissues handy.'],
    tip: 'PRO-TIP: Capsaicin in cayenne rapidly thins mucus and stimulates drainage, while honey acts as a natural antimicrobial throat coat.'
  },
  {
    title: 'Cough & Sickness Syrup (Onion & Honey)', icon: '🧅',
    steps: ['1. Chop a raw onion and place it in a jar.', '2. Cover the chopped onion entirely in raw honey and seal the jar.', '3. Let it sit on the counter for 8-12 hours until the honey draws out the onion juice.', '4. Take a spoonful of the resulting liquid syrup for coughs.'],
    tip: 'PRO-TIP: Onions are packed with Quercetin (an antihistamine) and sulfur compounds that reduce inflammation. The honey preserves it and suppresses coughing.'
  },
  {
    title: 'Deep Muscle & Nerve Pain (Capsaicin)', icon: '🦵',
    steps: ['1. Create a topical salve using cayenne pepper powder and a carrier oil (like coconut oil).', '2. Rub directly into the skin over the aching joint, muscle, or nerve.', '3. Wash hands thoroughly. DO NOT touch your eyes.'],
    tip: 'PRO-TIP: The intense burning sensation safely depletes "Substance P", a chemical that carries pain signals to your brain.'
  },
  {
    title: 'Burns, Cuts & Skin Trauma (Aloe Vera)', icon: '🪴',
    steps: ['1. Break or tear off a piece of a raw Aloe Vera plant.', '2. Squeeze the inner gel directly onto the wound, rash, or burn.', '3. Reapply as it dries out to maintain a protective, cooling barrier.'],
    tip: 'PRO-TIP: Raw aloe is naturally antimicrobial and accelerates cellular regeneration for surface-level trauma.'
  },
  {
    title: 'Nausea & Digestion (Ginger)', icon: '🤢',
    steps: ['1. Chew on a small piece of raw, peeled ginger root.', '2. Alternatively, steep sliced ginger in hot water for 10 minutes to make a potent tea.'],
    tip: 'PRO-TIP: Gingerol, the active compound in ginger, is a scientifically proven antiemetic that blocks nausea signals in the gut.'
  }
];

const WARNINGS_GUIDES = [
  {
    title: 'Impaled Objects', icon: '📌',
    desc: 'NEVER pull a knife, stick, shrapnel, or glass out of a deep wound. The object is acting as a plug preventing them from bleeding out. Pack dressings heavily around the object to stabilize it in place and wrap tightly.'
  },
  {
    title: 'Frostbite & Severe Cold', icon: '🥶',
    desc: 'NEVER aggressively rub frostbitten skin or throw the casualty into a hot bath. This physically destroys the frozen tissue and the sudden temperature change can shock the heart. Warm them slowly with body heat and blankets.'
  },
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

  // --- AUDIO GENERATOR FOR METRONOME BEEP ---
  const playBeep = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime); // High pitch sharp beep
      gain.gain.setValueAtTime(1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch(e) {}
  };

  useEffect(() => {
    let beatInterval;
    let flashTimeout;

    if (cprActive && phase === 'compressions') {
      beatInterval = setInterval(() => {
        playBeep(); // Trigger sound exactly on the beat
        
        // Trigger visual flash
        setPulseToggle(true);
        
        // Increment count immediately
        setCompressionCount(prev => {
          const next = prev + 1;
          if (next > 30) {
            setPhase('breaths');
            return 30; // Hold at 30 visually until breath phase resets it
          }
          return next;
        });

        // Turn OFF the visual flash after 150ms to create a sharp "strobe" effect
        flashTimeout = setTimeout(() => {
          setPulseToggle(false);
        }, 150);

      }, 600); // 100 BPM

    } else if (cprActive && phase === 'breaths') {
      beatInterval = setTimeout(() => {
        setPhase('compressions');
        setCompressionCount(0);
      }, 5000); // Wait 5 seconds for breaths
    }

    return () => {
      clearInterval(beatInterval);
      clearTimeout(beatInterval);
      clearTimeout(flashTimeout);
    };
  }, [cprActive, phase]);

  const toggleCPR = () => {
    if (cprActive) {
      setCprActive(false); setPhase('standby'); setCompressionCount(0); setPulseToggle(false);
    } else {
      // Browsers require a user interaction to play audio. This click satisfies it.
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
          boxShadow: phase === 'compressions' && pulseToggle ? '0 0 40px rgba(239, 68, 68, 1)' : 'none',
          transition: 'none' // REMOVED CSS TRANSITION TO FIX GHOSTING
        }}>
          {phase === 'standby' && <span style={{ color: '#888', fontSize: '1.2rem', fontWeight: 'bold' }}>READY</span>}
          
          {phase === 'compressions' && (
            <>
              {/* Number is always visible so they don't lose track */}
              <span style={{ color: '#fff', fontSize: '5rem', fontWeight: '900', lineHeight: '1' }}>{compressionCount}</span>
              {/* "PUSH" flashes dynamically with the pulse logic */}
              <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '900', textTransform: 'uppercase', opacity: pulseToggle ? 1 : 0, transition: 'none' }}>PUSH</span>
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
        <p style={{ color: '#ccc', fontSize: '0.8rem', margin: '0 0 10px 0' }}>If you are untrained or fear disease transmission, skip the breaths entirely and provide continuous compressions. The blood already contains enough oxygen to keep the brain alive for several minutes.</p>
      </div>

      <div style={{ ...glassCard, width: '100%', borderLeft: '4px solid #ef4444', padding: '0', overflow: 'hidden' }}>
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '15px', borderBottom: '1px solid #333' }}>
          <h4 style={{ color: '#ef4444', margin: '0', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '1px' }}>Depth & Technique Scaling</h4>
        </div>
        <div style={{ padding: '15px' }}>
          <p style={{ color: '#fff', fontSize: '0.9rem', margin: '0 0 15px 0' }}>🧑 <strong>Adult (Puberty & Older):</strong><br/><span style={{ color: '#ccc', fontSize: '0.8rem' }}>Use two hands interlocked. Compress center of chest <strong>at least 2 inches deep</strong>.</span></p>
          <p style={{ color: '#fff', fontSize: '0.9rem', margin: '0 0 15px 0' }}>👦 <strong>Child (1 Yr to Puberty):</strong><br/><span style={{ color: '#ccc', fontSize: '0.8rem' }}>Use one or two hands. Compress center of chest <strong>about 2 inches deep</strong>.</span></p>
          <p style={{ color: '#fff', fontSize: '0.9rem', margin: '0' }}>👶 <strong>Infant (Under 1 Yr):</strong><br/><span style={{ color: '#ccc', fontSize: '0.8rem' }}>Use two fingers in the center of the chest, just below the nipple line. Compress <strong>about 1.5 inches deep</strong>. If doing breaths, only use gentle puffs, not full lung capacities.</span></p>
        </div>
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
      {WARNINGS_GUIDES.map((warn, idx) => (
        <div key={idx} style={{ ...glassCard, borderTop: '3px solid #ef4444', margin: '0 0 15px 0', padding: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>{warn.icon}</span>
            <h4 style={{ margin: 0, color: '#ef4444', fontSize: '1rem', textTransform: 'uppercase' }}>{warn.title}</h4>
          </div>
          <p style={{ color: '#ccc', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>{warn.desc}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.8)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
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
