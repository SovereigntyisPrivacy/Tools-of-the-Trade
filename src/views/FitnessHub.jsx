import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FitnessHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Routines');

  // --- STATE: METRICS, HR & HYDRATION ---
  const [bw, setBw] = useState(() => localStorage.getItem('tot_bw') || '260');
  const [bh, setBh] = useState(() => localStorage.getItem('tot_bh') || '71');
  const [ba, setBa] = useState(() => localStorage.getItem('tot_ba') || '29');
  const [meas, setMeas] = useState(() => JSON.parse(localStorage.getItem('tot_meas')) || { neck: '', chest: '', waist: '', bicep: '', thigh: '' });
  const [currentHR, setCurrentHR] = useState('');
  
  const [waterOz, setWaterOz] = useState(() => parseInt(localStorage.getItem('tot_water_oz')) || 0);
  
  // --- STATE: VAULTS (The Permanent Archives) ---
  const [hydroVault, setHydroVault] = useState(() => JSON.parse(localStorage.getItem('tot_hydro_vault')) || []);
  const [weightLogs, setWeightLogs] = useState(() => JSON.parse(localStorage.getItem('tot_weight_logs')) || []);
  const [hrLogs, setHrLogs] = useState(() => JSON.parse(localStorage.getItem('tot_hr_logs')) || []);
  const [runLogs, setRunLogs] = useState(() => JSON.parse(localStorage.getItem('tot_run_logs')) || []);
  const [workoutVault, setWorkoutVault] = useState(() => JSON.parse(localStorage.getItem('tot_workout_vault')) || []);

  // --- STATE: STRENGTH ---
  const [liftWt, setLiftWt] = useState('225');
  const [liftReps, setLiftReps] = useState('5');

  // --- STATE: ACTIVE SESSION & TIMERS ---
  const [activeSession, setActiveSession] = useState(null);
  const [sessionLogs, setSessionLogs] = useState({});
  const [sessionTime, setSessionTime] = useState(0); // Global Workout Stopwatch
  const [sessionPaused, setSessionPaused] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  
  const [timeLeft, setTimeLeft] = useState(0); // Auto-Rest Timer
  const [timerActive, setTimerActive] = useState(false);
  const [timerLabel, setTimerLabel] = useState('Ready');
  
  // --- STATE: CARDIO/RUN TRACKER ---
  const [runTime, setRunTime] = useState(0);
  const [runActive, setRunActive] = useState(false);
  const [runDistance, setRunDistance] = useState('');

  const timerRef = useRef(null);
  const sessionRef = useRef(null);
  const runRef = useRef(null);

  const animeQuotes = [
    '"A dropout will beat a genius through hard work." - Rock Lee',
    '"I do not fear this new challenge. Rather like a true warrior I will rise to meet it." - Vegeta',
    '"Whether you win or lose, looking back and learning from your experience is a part of life." - All Might',
    '"Push through the pain. Giving up hurts more." - Vegeta',
    '"Don\'t believe in yourself. Believe in me! Believe in the Kamina who believes in you!" - Kamina',
    '"Stand up and walk. Keep moving forward. You\'ve got two good legs." - Edward Elric',
    '"If you don\'t take risks, you can\'t create a future." - Monkey D. Luffy',
    '"There is no such thing as luck in this world. There is only hard work." - Saitama'
  ];

  // Persistence Engine
  useEffect(() => {
    localStorage.setItem('tot_bw', bw); localStorage.setItem('tot_bh', bh); localStorage.setItem('tot_ba', ba);
    localStorage.setItem('tot_meas', JSON.stringify(meas));
    localStorage.setItem('tot_water_oz', waterOz.toString());
    localStorage.setItem('tot_hydro_vault', JSON.stringify(hydroVault));
    localStorage.setItem('tot_weight_logs', JSON.stringify(weightLogs));
    localStorage.setItem('tot_hr_logs', JSON.stringify(hrLogs));
    localStorage.setItem('tot_run_logs', JSON.stringify(runLogs));
    localStorage.setItem('tot_workout_vault', JSON.stringify(workoutVault));
  }, [bw, bh, ba, meas, waterOz, hydroVault, weightLogs, hrLogs, runLogs, workoutVault]);

  // --- ROUTINE DATABASE ---
  const routines = [
    { title: "Bodyweight Foundation", type: "Calisthenics (No Gear)", color: "#f59e0b", desc: "Zero equipment required. Strict form, tempo, full range of motion.", movements: [ { name: "Push-ups", sets: 4, reps: "15" }, { name: "Air Squats", sets: 4, reps: "25" }, { name: "Walking Lunges", sets: 3, reps: "12/leg" }, { name: "Plank Hold", sets: 3, reps: "60s" } ] },
    { title: "Heavy Steel Conditioning", type: "Functional / Core", color: "#ef4444", desc: "Full-body kinetic linkage utilizing a 5-foot steel crowbar.", movements: [ { name: "Overhead Squats (Bar Locked)", sets: 4, reps: "10" }, { name: "Rotational Core Swings", sets: 4, reps: "15/side" }, { name: "Static Front Holds", sets: 3, reps: "45s" }, { name: "Lunging Strikes", sets: 3, reps: "12/leg" } ] },
    { title: "5x5 Heavy Barbell (A)", type: "Strength", color: "#3b82f6", desc: "Classic linear progression. Rest 90-180 seconds between sets.", movements: [ { name: "Barbell Back Squat", sets: 5, reps: "5" }, { name: "Barbell Bench Press", sets: 5, reps: "5" }, { name: "Barbell Pendlay Row", sets: 5, reps: "5" } ] },
    { title: "Vinyasa Yoga Flow", type: "Flexibility & Breath", color: "#8b5cf6", desc: "Connect breath to movement. Open hips, chest, and lengthen spine.", movements: [ { name: "Sun Salutations", sets: 1, reps: "5 mins" }, { name: "Downward Dog", sets: 1, reps: "60s" }, { name: "Warrior I & II", sets: 1, reps: "60s/side" }, { name: "Pigeon Pose", sets: 1, reps: "2 mins/side" } ] },
    { title: "Tai Chi (8-Form)", type: "Mindful Movement", color: "#10b981", desc: "Ancient martial art focusing on slow transfer of internal energy (Qi).", movements: [ { name: "Opening & Centering", sets: 1, reps: "2 mins" }, { name: "Part Wild Horse's Mane", sets: 1, reps: "3/side" }, { name: "Brush Knee & Push", sets: 1, reps: "3/side" }, { name: "Repulse Monkey", sets: 1, reps: "4 steps" }, { name: "Cloud Hands", sets: 1, reps: "1 min" } ] }
  ];

  const formatTime = (secs) => { const h = Math.floor(secs/3600); const m = Math.floor((secs%3600)/60); const s = secs%60; return h > 0 ? `${h}:${m < 10 ? '0':''}${m}:${s < 10 ? '0':''}${s}` : `${m}:${s < 10 ? '0':''}${s}`; };

  // --- METRICS LOGIC ---
  const bmi = ((parseFloat(bw)||0) / Math.pow(parseFloat(bh)||1, 2)) * 703;
  const bmr = 10 * ((parseFloat(bw)||0) * 0.453592) + 6.25 * ((parseFloat(bh)||0) * 2.54) - 5 * (parseFloat(ba)||30) + 5;
  const oneRM = (parseFloat(liftWt)||0) * (1 + ((parseFloat(liftReps)||0) / 30));

  const logWeight = () => setWeightLogs([{ date: new Date().toLocaleDateString(), wt: bw }, ...weightLogs]);
  const logHR = () => { if(currentHR) { setHrLogs([{ date: new Date().toLocaleString(), bpm: currentHR }, ...hrLogs]); setCurrentHR(''); }};
  const addWater = (amt) => setWaterOz(prev => prev + amt);
  const resetWater = () => { if(window.confirm("Archive water to Vault and reset?")) { setHydroVault([{ date: new Date().toLocaleDateString(), oz: waterOz }, ...hydroVault]); setWaterOz(0); } };
  const updateMeas = (field, val) => setMeas(prev => ({ ...prev, [field]: val }));

  // --- INTERVAL / REST ENGINE ---
  const startTimer = (seconds, label) => {
    clearInterval(timerRef.current); setTimeLeft(seconds); setTimerLabel(label); setTimerActive(true);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { clearInterval(timerRef.current); setTimerActive(false); setTimerLabel('Rest Complete!'); return 0; } return prev - 1; });
    }, 1000);
  };
  const stopTimer = () => { clearInterval(timerRef.current); setTimerActive(false); };

  // --- RUN / CARDIO ENGINE ---
  const toggleRun = () => {
    if (runActive) { clearInterval(runRef.current); setRunActive(false); }
    else { setRunActive(true); runRef.current = setInterval(() => setRunTime(prev => prev + 1), 1000); }
  };
  const saveRun = () => {
    if(!runDistance && runTime === 0) return alert("Log distance or time first.");
    setRunLogs([{ id: Date.now(), date: new Date().toLocaleString(), time: formatTime(runTime), dist: runDistance || '0' }, ...runLogs]);
    clearInterval(runRef.current); setRunActive(false); setRunTime(0); setRunDistance('');
    alert("Run archived to Vault!");
  };

  // --- ACTIVE SESSION ENGINE ---
  const startWorkout = (rt) => {
    let initialLogs = {};
    rt.movements.forEach((m, i) => { initialLogs[i] = Array.from({ length: m.sets }).map(() => ({ wt: '', reps: '', done: false })); });
    setSessionLogs(initialLogs); setActiveSession(rt); setSessionTime(0); setSessionPaused(false);
    setCurrentQuote(animeQuotes[Math.floor(Math.random() * animeQuotes.length)]);
    sessionRef.current = setInterval(() => { setSessionTime(prev => prev + 1); }, 1000);
  };
  
  const toggleMasterPause = () => {
    if (sessionPaused) { sessionRef.current = setInterval(() => { setSessionTime(prev => prev + 1); }, 1000); setSessionPaused(false); } 
    else { clearInterval(sessionRef.current); setSessionPaused(true); }
  };

  const updateSet = (mIdx, sIdx, field, val) => { const updated = { ...sessionLogs }; updated[mIdx][sIdx][field] = val; setSessionLogs(updated); };
  const toggleSetDone = (mIdx, sIdx) => {
    const updated = { ...sessionLogs }; const isDone = !updated[mIdx][sIdx].done; updated[mIdx][sIdx].done = isDone; setSessionLogs(updated);
    if (isDone && activeSession.type.includes('Strength')) startTimer(90, 'Auto-Rest');
    else if (isDone) startTimer(45, 'Auto-Rest');
  };

  const finishWorkout = (status) => {
    if(!window.confirm(`Are you sure you want to log this as ${status}?`)) return;
    clearInterval(sessionRef.current); stopTimer();
    let totalVol = 0;
    Object.keys(sessionLogs).forEach(mIdx => {
      sessionLogs[mIdx].forEach(set => {
        if (set.done) { const w = parseFloat(set.wt)||0; const r = parseFloat(set.reps)||0; totalVol += (w === 0 && r > 0 ? r : w * r); }
      });
    });
    setWorkoutVault([{ id: Date.now(), date: new Date().toLocaleString(), title: activeSession.title, volume: totalVol, duration: formatTime(sessionTime), status: status }, ...workoutVault]);
    setActiveSession(null); setActiveTab('Vault');
  };

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const inputStyle = { background: '#000', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' };
  const btnStyle = (bg, color) => ({ background: bg, color: color, border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', width: '100%', cursor: 'pointer' });
  const labelStyle = { color: '#00ffff', fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '5px' };

  // --- ACTIVE SESSION OVERLAY ---
  if (activeSession) {
    return (
      <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#fff' }}>
        <header style={{ padding: '15px', background: '#111', borderBottom: `2px solid ${activeSession.color}`, position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <h2 style={{ margin: 0, color: activeSession.color, fontSize: '1.2rem' }}>{activeSession.title}</h2>
              <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Duration: <strong style={{color:'#fff'}}>{formatTime(sessionTime)}</strong></span>
            </div>
            <button onClick={toggleMasterPause} style={{ background: sessionPaused ? '#10b981' : '#f59e0b', color: '#000', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', border: 'none' }}>
              {sessionPaused ? '▶ RESUME' : '⏸ PAUSE'}
            </button>
          </div>
          {timerActive && !sessionPaused && (
            <div onClick={stopTimer} style={{ background: '#ef4444', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center', border: '1px solid #fff' }}>
              Rest Timer: {formatTime(timeLeft)} (Tap to Skip)
            </div>
          )}
        </header>
        
        <div style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '100px', opacity: sessionPaused ? 0.3 : 1, pointerEvents: sessionPaused ? 'none' : 'auto' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px dashed #3b82f6', padding: '15px', borderRadius: '8px', marginBottom: '15px', color: '#3b82f6', fontStyle: 'italic', textAlign: 'center', fontSize: '0.95rem' }}>
            {currentQuote}
          </div>

          {activeSession.movements.map((m, mIdx) => (
            <div key={mIdx} style={{ ...cardStyle, borderLeft: `4px solid ${activeSession.color}` }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem' }}>{m.name} <span style={{ color: '#888', fontSize: '0.9rem', fontWeight: 'normal' }}>({m.sets} x {m.reps})</span></h3>
              {sessionLogs[mIdx]?.map((set, sIdx) => (
                <div key={sIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', background: set.done ? 'rgba(16, 185, 129, 0.1)' : '#000', padding: '8px', borderRadius: '8px', border: set.done ? '1px solid #10b981' : '1px solid #222', transition: 'all 0.2s' }}>
                  <span style={{ color: '#888', fontWeight: 'bold', width: '20px' }}>{sIdx + 1}</span>
                  <input type="number" placeholder="lbs" value={set.wt} onChange={e=>updateSet(mIdx, sIdx, 'wt', e.target.value)} disabled={set.done} style={{ ...inputStyle, padding: '8px', flex: 1, opacity: set.done ? 0.5 : 1 }} />
                  <input type="number" placeholder="reps" value={set.reps} onChange={e=>updateSet(mIdx, sIdx, 'reps', e.target.value)} disabled={set.done} style={{ ...inputStyle, padding: '8px', flex: 1, opacity: set.done ? 0.5 : 1 }} />
                  <button onClick={() => toggleSetDone(mIdx, sIdx)} style={{ background: set.done ? '#10b981' : '#333', color: set.done ? '#000' : '#fff', border: 'none', borderRadius: '6px', width: '45px', height: '40px', fontWeight: 'bold', fontSize: '1.2rem' }}>{set.done ? '✓' : ''}</button>
                </div>
              ))}
            </div>
          ))}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={() => finishWorkout('Aborted')} style={{ ...btnStyle('transparent', '#ef4444'), border: '1px solid #ef4444', flex: 1 }}>Abort</button>
            <button onClick={() => finishWorkout('Completed')} style={{ ...btnStyle(activeSession.color, '#000'), flex: 2, fontSize: '1.1rem' }}>🏁 Finish Session</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/')} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#ef4444', fontSize: '1.2rem' }}>Performance Engine</h2>
      </header>

      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Routines', 'Run / Cardio', 'Metrics', 'Timers', 'Vault'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === tab ? '#10b981' : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>{tab}</button>
        ))}
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '80px' }}>
        
        {activeTab === 'Routines' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {routines.map((rt, idx) => (
              <div key={idx} style={{ ...cardStyle, borderLeft: `4px solid ${rt.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', flex: 1 }}>{rt.title}</h3>
                  <span style={{ background: '#000', color: rt.color, padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', border: `1px solid ${rt.color}` }}>{rt.type}</span>
                </div>
                <p style={{ color: '#aaa', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '15px' }}>{rt.desc}</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px', borderTop: '1px dashed #333', paddingTop: '15px' }}>
                  <button onClick={() => startWorkout(rt)} style={{ ...btnStyle(rt.color, '#000'), flex: 2 }}>▶ Start Live Session</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Run / Cardio' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #00ffff', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#00ffff' }}>🏃 Run / Cardio Tracker</h3>
            <div style={{ background: '#000', width: '200px', height: '200px', borderRadius: '50%', border: runActive ? '4px solid #00ffff' : '4px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <span style={{ fontSize: '3.5rem', fontWeight: 'bold', color: runActive ? '#fff' : '#555', fontVariantNumeric: 'tabular-nums' }}>{formatTime(runTime)}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button onClick={toggleRun} style={{ ...btnStyle(runActive ? '#f59e0b' : '#00ffff', '#000'), flex: 1 }}>{runActive ? '⏸ Pause' : '▶ Start Run'}</button>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input type="number" placeholder="Distance (mi/km)" value={runDistance} onChange={e=>setRunDistance(e.target.value)} style={{ ...inputStyle, flex: 2 }} />
              <button onClick={saveRun} style={{ ...btnStyle('#10b981', '#000'), flex: 1 }}>💾 Save</button>
            </div>
          </div>
        )}

        {activeTab === 'Metrics' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#3b82f6' }}>💧 Hydration Tracker</h3>
              <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '15px' }}>{waterOz}<span style={{ fontSize: '1.2rem', color: '#3b82f6', marginLeft: '5px' }}>oz</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <button onClick={() => addWater(8)} style={{...btnStyle('#222', '#3b82f6'), border: '1px solid #3b82f6'}}>+ 8</button><button onClick={() => addWater(16)} style={{...btnStyle('#3b82f6', '#000')}}>+ 16</button><button onClick={() => addWater(32)} style={{...btnStyle('#222', '#3b82f6'), border: '1px solid #3b82f6'}}>+ 32</button>
              </div>
              <button onClick={resetWater} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '0.85rem' }}>Archive to Vault & Reset</button>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#ef4444' }}>❤️ Heart Rate Monitor</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="number" placeholder="Enter BPM..." value={currentHR} onChange={e=>setCurrentHR(e.target.value)} style={inputStyle} />
                <button onClick={logHR} style={btnStyle('#ef4444', '#fff')}>Log BPM</button>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#f59e0b' }}>📏 Body Composition</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <div><label style={labelStyle}>Wt (lbs)</label><input type="number" value={bw} onChange={e=>setBw(e.target.value)} style={inputStyle} /></div>
                <div><label style={labelStyle}>Ht (in)</label><input type="number" value={bh} onChange={e=>setBh(e.target.value)} style={inputStyle} /></div>
                <div><label style={labelStyle}>Age</label><input type="number" value={ba} onChange={e=>setBa(e.target.value)} style={inputStyle} /></div>
              </div>
              <h4 style={{ color: '#aaa', margin: '0 0 10px 0', fontSize: '0.85rem' }}>Tape (in)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <input type="number" placeholder="Chest" value={meas.chest} onChange={e=>updateMeas('chest', e.target.value)} style={inputStyle} />
                <input type="number" placeholder="Waist" value={meas.waist} onChange={e=>updateMeas('waist', e.target.value)} style={inputStyle} />
                <input type="number" placeholder="Bicep" value={meas.bicep} onChange={e=>updateMeas('bicep', e.target.value)} style={inputStyle} />
              </div>
              <button onClick={logWeight} style={btnStyle('#10b981', '#000')}>💾 Save Snapshot to Vault</button>
            </div>
          </>
        )}

        {activeTab === 'Timers' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #a855f7', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#a855f7' }}>⏱️ Interval Engine</h3>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px' }}>{timerLabel}</p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', width: '200px', height: '200px', margin: '0 auto 25px auto', borderRadius: '50%', border: timerActive ? '4px solid #10b981' : '4px solid #333' }}>
              <span style={{ fontSize: '4rem', fontWeight: 'bold', color: timerActive ? '#fff' : '#555', fontVariantNumeric: 'tabular-nums' }}>{formatTime(timeLeft)}</span>
            </div>
            {timerActive ? ( <button onClick={stopTimer} style={btnStyle('#ef4444', '#fff')}>⏹ STOP TIMER</button> ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button onClick={() => startTimer(45, 'Hypertrophy Rest')} style={{...btnStyle('#222', '#fff'), border: '1px solid #444'}}>45s Rest</button>
                <button onClick={() => startTimer(180, 'Deep Stretch')} style={{...btnStyle('#222', '#3b82f6'), border: '1px solid #3b82f6'}}>3m Stretch</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Vault' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#a855f7' }}>🏆 Workout History</h3>
              {workoutVault.length === 0 ? <p style={{color:'#888', fontStyle:'italic'}}>No workouts archived yet.</p> : workoutVault.map((log) => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #222' }}>
                  <div>
                    <strong style={{color:'#fff', display:'block'}}>{log.title}</strong>
                    <span style={{color: log.status === 'Completed' ? '#10b981' : '#ef4444', fontSize: '0.8rem', fontWeight: 'bold'}}>{log.status} </span>
                    <span style={{color:'#666', fontSize:'0.8rem'}}>• {log.date} • {log.duration}</span>
                  </div>
                  <div style={{textAlign:'right'}}><strong style={{color:'#a855f7'}}>{log.volume > 0 ? log.volume : '-'}</strong><span style={{color:'#888', fontSize:'0.8rem', display:'block'}}>Vol/Reps</span></div>
                </div>
              ))}
            </div>
            <div style={{ ...cardStyle, borderTop: '4px solid #00ffff' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#00ffff' }}>🏃 Run Archive</h3>
              {runLogs.length === 0 ? <p style={{color:'#888'}}>No runs logged.</p> : runLogs.slice(0,5).map(log => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #222' }}><span style={{color:'#ccc'}}>{log.date}</span><strong style={{color:'#00ffff'}}>{log.dist} @ {log.time}</strong></div>
              ))}
            </div>
            <div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>❤️ Vitals Archive (HR & Wt)</h3>
              {hrLogs.slice(0,3).map((log, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><span style={{color:'#888', fontSize:'0.85rem'}}>{log.date}</span><strong style={{color:'#ef4444'}}>{log.bpm} BPM</strong></div>)}
              {weightLogs.slice(0,3).map((log, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><span style={{color:'#888', fontSize:'0.85rem'}}>{log.date}</span><strong style={{color:'#10b981'}}>{log.wt} lbs</strong></div>)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
