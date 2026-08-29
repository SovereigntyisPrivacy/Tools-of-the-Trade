import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TCCC_GUIDES = [
  {
    title: 'Massive Hemorrhage (Bleeding)',
    icon: '🩸',
    steps: [
      '1. Identify life-threatening arterial bleeding (bright red, spurting, or pooling rapidly).',
      '2. Apply a TQ (Tourniquet) 2-3 inches above the wound, not over a joint.',
      '3. If bleeding continues, apply a second TQ side-by-side above the first.',
      '4. Tighten the windlass until bleeding completely stops. Secure the windlass.',
      '5. Note the exact time of TQ application on the patient (e.g., write on their forehead).'
    ]
  },
  {
    title: 'Airway & Chest Wounds',
    icon: '🫁',
    steps: [
      '1. Assess for penetrating trauma to the chest, back, or armpits.',
      '2. Wipe the area dry of blood and sweat.',
      '3. Apply a vented chest seal over the hole during EXHALATION.',
      '4. Check for an exit wound on the back and seal it as well.',
      '5. Place the casualty in the recovery position (on their side) with the injured side down.'
    ]
  },
  {
    title: 'Hypovolemic Shock',
    icon: '🥶',
    steps: [
      '1. Assess for shock: pale, cold, clammy skin, rapid breathing, confusion.',
      '2. Stop all massive bleeding first (Tourniquets / wound packing).',
      '3. Keep the casualty extremely warm (space blanket, sleeping bag, body heat).',
      '4. Elevate the legs slightly if no spinal injury is suspected.',
      '5. Do NOT give them food or water, even if they beg for it (as surgery may be required).'
    ]
  }
];

const GENERAL_GUIDES = [
  {
    title: 'Burns (Thermal)',
    steps: ['1. Remove the casualty from the heat source.', '2. Cool the burn immediately with cool (not freezing) running water for 10-20 minutes.', '3. Do NOT pop blisters. Do NOT apply ice, butter, or ointments to severe burns.', '4. Cover with a sterile, non-fluffy dressing or cling film.']
  },
  {
    title: 'Choking (Heimlich)',
    steps: ['1. Ask "Are you choking?" If they cannot cough or speak, act immediately.', '2. Stand behind them, wrap your arms around their waist.', '3. Make a fist with one hand, place it just above their belly button.', '4. Grab your fist with the other hand and perform quick, upward thrusts until the object is dislodged.']
  }
];

export default function FirstAidHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cpr');

  // CPR Metronome State
  const [cprActive, setCprActive] = useState(false);
  const [compressionCount, setCompressionCount] = useState(0);
  const [phase, setPhase] = useState('standby'); // standby, compressions, breaths
  const [pulseToggle, setPulseToggle] = useState(false);

  // --- CPR METRONOME LOGIC ---
  useEffect(() => {
    let interval;
    if (cprActive && phase === 'compressions') {
      // 100 BPM = 600ms per beat
      interval = setInterval(() => {
        setPulseToggle(p => !p); // Visual flash
        
        setCompressionCount(prev => {
          if (prev >= 29) {
            setPhase('breaths');
            return 30;
          }
          return prev + 1;
        });
      }, 600);
    } else if (cprActive && phase === 'breaths') {
      // Pause for 5 seconds to allow 2 rescue breaths, then resume
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
      setCprActive(false);
      setPhase('standby');
      setCompressionCount(0);
    } else {
      setCprActive(true);
      setPhase('compressions');
      setCompressionCount(0);
    }
  };

  const glassCard = { background: 'rgba(17, 17, 17, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '15px' };

  const renderCPR = () => (
    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ ...glassCard, borderTop: '4px solid #ef4444', width: '100%', textAlign: 'center' }}>
        <h3 style={{ color: '#ef4444', marginTop: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>CPR Assistant</h3>
        <p style={{ color: '#ccc', fontSize: '0.85rem', marginBottom: '20px' }}>Standard Adult CPR: Push hard and fast in the center of the chest. 30 compressions, followed by 2 rescue breaths.</p>
        
        <div style={{ 
          width: '220px', height: '220px', borderRadius: '50%', margin: '0 auto 25px auto',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          background: phase === 'compressions' ? (pulseToggle ? '#ef4444' : '#7f1d1d') : (phase === 'breaths' ? '#3b82f6' : '#111'),
          border: `4px solid ${phase === 'standby' ? '#333' : (phase === 'breaths' ? '#60a5fa' : '#fca5a5')}`,
          boxShadow: phase === 'compressions' && pulseToggle ? '0 0 30px rgba(239, 68, 68, 0.8)' : 'none',
          transition: 'background 0.1s, box-shadow 0.1s'
        }}>
          {phase === 'standby' && <span style={{ color: '#888', fontSize: '1.2rem', fontWeight: 'bold' }}>READY</span>}
          {phase === 'compressions' && (
            <>
              <span style={{ color: '#fff', fontSize: '4rem', fontWeight: '900', lineHeight: '1' }}>{compressionCount}</span>
              <span style={{ color: '#fca5a5', fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase' }}>PUSH</span>
            </>
          )}
          {phase === 'breaths' && (
            <>
              <span style={{ color: '#fff', fontSize: '2rem', fontWeight: '900', textAlign: 'center', padding: '0 10px' }}>GIVE 2 BREATHS</span>
            </>
          )}
        </div>

        <button onClick={toggleCPR} style={{ width: '100%', background: cprActive ? '#222' : '#ef4444', color: cprActive ? '#ef4444' : '#fff', border: cprActive ? '2px solid #ef4444' : 'none', padding: '18px', borderRadius: '8px', fontWeight: '900', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {cprActive ? '🛑 STOP CPR' : '🚨 START CPR METRONOME'}
        </button>
      </div>

      <div style={{ ...glassCard, width: '100%', borderLeft: '4px solid #facc15' }}>
        <h4 style={{ color: '#facc15', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Good Samaritan Law</h4>
        <p style={{ color: '#888', fontSize: '0.8rem', margin: 0 }}>In most jurisdictions, bystanders who provide emergency medical assistance in good faith are legally protected from civil liability. Do not hesitate to act.</p>
      </div>
    </div>
  );

  const renderDatabase = (db) => (
    <div style={{ marginTop: '20px' }}>
      {db.map((item, idx) => (
        <div key={idx} style={{ ...glassCard, borderLeft: '4px solid #ef4444', padding: '0', overflow: 'hidden' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '15px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>{item.icon || '🚑'}</span>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>{item.title}</h3>
          </div>
          <div style={{ padding: '15px' }}>
            {item.steps.map((step, sIdx) => (
              <p key={sIdx} style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 10px 0', paddingLeft: '10px', textIndent: '-10px' }}>
                {step}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.8)' }}>
        <button onClick={() => { if(cprActive) toggleCPR(); navigate(-1); }} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#ef4444', fontSize: '1.2rem' }}>Trauma & First Aid</h2>
      </header>

      {/* EMERGENCY RED BANNER */}
      <div style={{ background: '#7f1d1d', padding: '10px', textAlign: 'center', fontSize: '0.75rem', color: '#fca5a5', fontWeight: 'bold', letterSpacing: '1px' }}>
        FOR EDUCATIONAL REFERENCE. CALL 911 IMMEDIATELY IN AN EMERGENCY.
      </div>

      <div style={{ display: 'flex', padding: '15px', gap: '8px', background: 'rgba(0,0,0,0.5)', overflowX: 'auto' }}>
        <button onClick={() => setActiveTab('cpr')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'cpr' ? '#ef4444' : '#222', color: activeTab === 'cpr' ? '#fff' : '#888' }}>CPR Assistant</button>
        <button onClick={() => setActiveTab('tccc')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'tccc' ? '#f97316' : '#222', color: activeTab === 'tccc' ? '#fff' : '#888' }}>TCCC / Trauma</button>
        <button onClick={() => setActiveTab('general')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'general' ? '#3b82f6' : '#222', color: activeTab === 'general' ? '#fff' : '#888' }}>General Aid</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        {activeTab === 'cpr' && renderCPR()}
        {activeTab === 'tccc' && renderDatabase(TCCC_GUIDES)}
        {activeTab === 'general' && renderDatabase(GENERAL_GUIDES)}
      </div>
    </div>
  );
}
