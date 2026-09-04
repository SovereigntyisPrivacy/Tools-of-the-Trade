import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FitnessHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Routines');
  const [vaultTab, setVaultTab] = useState('Workouts');

  const [bw, setBw] = useState(() => parseFloat(localStorage.getItem('tot_bw')) || 185);
  const [bh, setBh] = useState(() => parseFloat(localStorage.getItem('tot_bh')) || 71);
  const [ba, setBa] = useState(() => parseFloat(localStorage.getItem('tot_ba')) || 30);
  const [macros, setMacros] = useState(() => JSON.parse(localStorage.getItem('tot_macros')) || { p: 150, c: 200, f: 70 });
  const [waterOz, setWaterOz] = useState(() => parseInt(localStorage.getItem('tot_water_oz')) || 0);
  const [currentHR, setCurrentHR] = useState('');
  
  const [calcWt, setCalcWt] = useState(225);
  const [calcReps, setCalcReps] = useState(5);

  const [weightLogs, setWeightLogs] = useState(() => JSON.parse(localStorage.getItem('tot_weight_logs')) || []);
  const [hrLogs, setHrLogs] = useState(() => JSON.parse(localStorage.getItem('tot_hr_logs')) || []);
  const [hydroVault, setHydroVault] = useState(() => JSON.parse(localStorage.getItem('tot_hydro_vault')) || []);
  const [runLogs, setRunLogs] = useState(() => JSON.parse(localStorage.getItem('tot_run_logs')) || []);
  const [workoutVault, setWorkoutVault] = useState(() => JSON.parse(localStorage.getItem('tot_workout_vault')) || []);

  // V5 Database - Now with 'reps', 'time', and 'hold' types!
  const defaultRoutines = [
    { id: 'r1', title: "Bodyweight Basics", type: "No Equipment", color: "#f59e0b", restTime: 45, desc: "Uses just your body. Great for getting strong anywhere!", movements: [ { name: "Push-ups", sets: 4, type: 'reps', defaultWt: 0, defaultReps: 10 }, { name: "Air Squats", sets: 4, type: 'reps', defaultWt: 0, defaultReps: 15 }, { name: "Plank Hold", sets: 3, type: 'time', duration: 60, desc: "Squeeze your core! The coach will time you." } ] },
    { id: 'r2', title: "Dumbbell Full Body", type: "Gym Weights", color: "#ef4444", restTime: 60, desc: "Use hand weights to build strong muscles safely.", movements: [ { name: "Goblet Squats", sets: 4, type: 'reps', defaultWt: 20, defaultReps: 10 }, { name: "Dumbbell Rows", sets: 3, type: 'reps', defaultWt: 20, defaultReps: 10 } ] },
    { id: 'r5', title: "Second Shift Primer", type: "Mobility", color: "#00cccc", restTime: 30, desc: "Pre-shift mobility to loosen your joints.", movements: [ { name: "Deep Squat Hold", sets: 2, type: 'time', duration: 60, desc: "Sit deep. The coach will track your 60 seconds." }, { name: "Dead-hang", sets: 2, type: 'time', duration: 60 } ] },
    { id: 'r6', title: "Mindful Box Breathing", type: "Mindful", color: "#10b981", restTime: 10, desc: "Guided breathing to lower heart rate and stress.", movements: [ { name: "Box Breathing Flow", sets: 1, type: 'hold', holdSecs: 4, relSecs: 4, cycles: 10, desc: "Follow the guided coach. Inhale/Hold, then Exhale/Release." } ] }
  ];
  
  const [routines, setRoutines] = useState(() => JSON.parse(localStorage.getItem('tot_routines_v5')) || defaultRoutines);
  const [showBuilder, setShowBuilder] = useState(false);
  const [newRoutine, setNewRoutine] = useState({ title: '', desc: '', restTime: 60 });
  const [bMovements, setBMovements] = useState([{ name: '', type: 'reps', sets: 3, defaultReps: 10, duration: 60, holdSecs: 5, relSecs: 5, cycles: 5 }]);

  const [activeSession, setActiveSession] = useState(null);
  const [sessionLogs, setSessionLogs] = useState({});
  const [sessionTime, setSessionTime] = useState(0); 
  const [sessionPaused, setSessionPaused] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  
  // NEW: The Action Coach State
  const [coach, setCoach] = useState(null); // { mIdx, sIdx, move, phase: 'prep'|'work'|'hold'|'release', timeLeft, cycle }

  const [runTime, setRunTime] = useState(0);
  const [runActive, setRunActive] = useState(false);

  const sessionRef = useRef(null); const restIntervalRef = useRef(null); const runRef = useRef(null); const coachRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('tot_bw', bw); localStorage.setItem('tot_bh', bh); localStorage.setItem('tot_ba', ba);
    localStorage.setItem('tot_macros', JSON.stringify(macros)); localStorage.setItem('tot_water_oz', waterOz.toString());
    localStorage.setItem('tot_hydro_vault', JSON.stringify(hydroVault)); localStorage.setItem('tot_weight_logs', JSON.stringify(weightLogs));
    localStorage.setItem('tot_hr_logs', JSON.stringify(hrLogs)); localStorage.setItem('tot_run_logs', JSON.stringify(runLogs));
    localStorage.setItem('tot_workout_vault', JSON.stringify(workoutVault)); localStorage.setItem('tot_routines_v5', JSON.stringify(routines));
  }, [bw, bh, ba, macros, waterOz, hydroVault, weightLogs, hrLogs, runLogs, workoutVault, routines]);


  const formatTime = (secs) => { const h = Math.floor(secs/3600); const m = Math.floor((secs%3600)/60); const s = secs%60; return h > 0 ? `${h}:${m < 10 ? '0':''}${m}:${s < 10 ? '0':''}${s}` : `${m}:${s < 10 ? '0':''}${s}`; };
  const totalCals = (macros.p * 4) + (macros.c * 4) + (macros.f * 9);
  const estMiles = ((runTime / 60) * 150 * (bh * 0.413) / 63360).toFixed(2);
  const oneRM = Math.round(calcWt * (1 + (calcReps / 30)));
  const waterPercent = Math.min((waterOz / 128) * 100, 100);

  // --- PROGRESS BAR MATH ---
  let totalSets = 0; let completedSets = 0;
  if (activeSession) {
    Object.keys(sessionLogs).forEach(mIdx => {
      sessionLogs[mIdx].forEach(set => { totalSets++; if(set.done) completedSets++; });
    });
  }
  const sessionProgress = totalSets === 0 ? 0 : Math.round((completedSets / totalSets) * 100);

  // --- DELETERS & LOGGERS ---
  const updateMacro = (field, val) => setMacros(prev => ({ ...prev, [field]: parseInt(val)||0 }));
  const logWeight = () => { setWeightLogs([{ id: Date.now(), date: new Date().toLocaleString(), wt: bw }, ...weightLogs]); alert("Weight saved!"); };
  const logHR = () => { if(currentHR) { setHrLogs([{ id: Date.now(), date: new Date().toLocaleString(), bpm: currentHR }, ...hrLogs]); setCurrentHR(''); alert("Heart Rate saved!"); }};
  const addWater = (amt) => setWaterOz(prev => prev + amt);
  const resetWater = () => { if(window.confirm("Archive water to Vault and reset?")) { setHydroVault([{ id: Date.now(), date: new Date().toLocaleDateString(), oz: waterOz }, ...hydroVault]); setWaterOz(0); } };
  const toggleRun = () => { if (runActive) { clearInterval(runRef.current); setRunActive(false); } else { setRunActive(true); runRef.current = setInterval(() => setRunTime(prev => prev + 1), 1000); } };
  const saveRun = () => { if(runTime === 0) return; setRunLogs([{ id: Date.now(), date: new Date().toLocaleString(), time: formatTime(runTime), dist: estMiles }, ...runLogs]); clearInterval(runRef.current); setRunActive(false); setRunTime(0); alert("Run archived to Vault!"); };
  
  const deleteLog = (type, id) => {
    if(!window.confirm("Permanently delete this record?")) return;
    if(type === 'workout') setWorkoutVault(prev => prev.filter(l => l.id !== id));
    if(type === 'weight') setWeightLogs(prev => prev.filter(l => l.id !== id));
    if(type === 'water') setHydroVault(prev => prev.filter(l => l.id !== id));
    if(type === 'run') setRunLogs(prev => prev.filter(l => l.id !== id));
    if(type === 'hr') setHrLogs(prev => prev.filter(l => l.id !== id));
  };
  const deleteRoutine = (id) => { if(window.confirm("Delete this routine?")) setRoutines(routines.filter(r => r.id !== id)); };

  const exportData = () => {
    const backup = JSON.stringify({ workouts: workoutVault, weight: weightLogs, hr: hrLogs, run: runLogs, water: hydroVault, macros: macros }, null, 2);
    const blob = new Blob([backup], { type: "application/json" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `Sovereign_OS_Backup_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  // --- CUSTOM BUILDER ---
  const addCustomMove = () => setBMovements([...bMovements, { name: '', type: 'reps', sets: 3, defaultReps: 10, duration: 60, holdSecs: 5, relSecs: 5, cycles: 5 }]);
  const updateCMove = (idx, field, val) => { const newM = [...bMovements]; newM[idx][field] = val; setBMovements(newM); };
  const saveCustomRoutine = () => {
    if(!newRoutine.title) return alert("Title required.");
    setRoutines([...routines, { id: 'c'+Date.now(), title: newRoutine.title, type: 'Custom', color: '#00cc66', restTime: newRoutine.restTime || 60, desc: newRoutine.desc, movements: bMovements }]);
    setShowBuilder(false); setNewRoutine({ title: '', desc: '', restTime: 60 }); setBMovements([{ name: '', type: 'reps', sets: 3, defaultReps: 10, duration: 60, holdSecs: 5, relSecs: 5, cycles: 5 }]); alert("Custom Routine Saved!");
  };

  // --- THE ACTION COACH ENGINE ---
  const startActionCoach = (mIdx, sIdx, move) => {
    setCoach({ mIdx, sIdx, move, phase: 'prep', timeLeft: 3, cycle: 1 });
    clearInterval(sessionRef.current); clearInterval(coachRef.current);
    coachRef.current = setInterval(() => {
      setCoach(prev => {
        if(!prev) return null;
        if(prev.timeLeft <= 1) {
          if(prev.phase === 'prep') return { ...prev, phase: prev.move.type === 'time' ? 'work' : 'hold', timeLeft: prev.move.type === 'time' ? prev.move.duration : prev.move.holdSecs };
          if(prev.move.type === 'time' && prev.phase === 'work') { endActionCoach(prev.mIdx, prev.sIdx); return null; }
          if(prev.move.type === 'hold') {
            if(prev.phase === 'hold') return { ...prev, phase: 'release', timeLeft: prev.move.relSecs };
            if(prev.phase === 'release') {
              if(prev.cycle >= prev.move.cycles) { endActionCoach(prev.mIdx, prev.sIdx); return null; }
              return { ...prev, phase: 'hold', timeLeft: prev.move.holdSecs, cycle: prev.cycle + 1 };
            }
          }
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };
  const endActionCoach = (mIdx, sIdx) => { clearInterval(coachRef.current); setCoach(null); toggleSetDone(mIdx, sIdx, true); sessionRef.current = setInterval(() => setSessionTime(p => p + 1), 1000); };
  const abortCoach = () => { clearInterval(coachRef.current); setCoach(null); sessionRef.current = setInterval(() => setSessionTime(p => p + 1), 1000); };

  // --- SESSION ENGINE ---
  const startRest = () => {
    setRestTimeLeft(activeSession.restTime || 60); setIsResting(true); setSessionPaused(true);
    clearInterval(sessionRef.current); clearInterval(restIntervalRef.current);
    restIntervalRef.current = setInterval(() => { setRestTimeLeft(prev => { if (prev <= 1) { endRest(); return 0; } return prev - 1; }); }, 1000);
  };
  const endRest = () => { clearInterval(restIntervalRef.current); setIsResting(false); setSessionPaused(false); sessionRef.current = setInterval(() => setSessionTime(p => p + 1), 1000); };

  const startWorkout = (rt) => {
    let initialLogs = {}; 
    rt.movements.forEach((m, i) => { initialLogs[i] = Array.from({ length: m.sets }).map(() => ({ wt: m.defaultWt || 0, reps: m.defaultReps || 0, done: false })); });
    setSessionLogs(initialLogs); setActiveSession(rt); setSessionTime(0); setSessionPaused(false); setIsResting(false);
    setCurrentQuote(animeQuotes[Math.floor(Math.random() * animeQuotes.length)]);
    sessionRef.current = setInterval(() => { setSessionTime(prev => prev + 1); }, 1000);
  };
  
  const toggleMasterPause = () => {
    if (sessionPaused) { sessionRef.current = setInterval(() => setSessionTime(p => p + 1), 1000); setSessionPaused(false); } 
    else { clearInterval(sessionRef.current); setSessionPaused(true); }
  };

  const updateSet = (mIdx, sIdx, field, val) => { const updated = { ...sessionLogs }; updated[mIdx][sIdx][field] = val; setSessionLogs(updated); };
  const toggleSetDone = (mIdx, sIdx, forceDone = false) => { 
    const updated = { ...sessionLogs }; const isDone = forceDone ? true : !updated[mIdx][sIdx].done; 
    updated[mIdx][sIdx].done = isDone; setSessionLogs(updated); 
    if (isDone) startRest(); 
  };

  const finishWorkout = (status) => {
    if(!window.confirm(`Log this session as ${status}?`)) return;
    clearInterval(sessionRef.current); clearInterval(restIntervalRef.current); clearInterval(coachRef.current);
    let totalVol = 0;
    
    const updatedRoutines = routines.map(rt => {
      if (rt.id === activeSession.id && status === 'Completed') {
        const updatedMovements = rt.movements.map((m, mIdx) => {
          if (m.type !== 'reps') return m;
          let maxLoggedWt = 0; let maxLoggedReps = 0;
          sessionLogs[mIdx].forEach(set => { if (set.done) { const w = parseFloat(set.wt)||0; const r = parseFloat(set.reps)||0; if(w > maxLoggedWt) maxLoggedWt = w; if(r > maxLoggedReps) maxLoggedReps = r; }});
          return { ...m, defaultWt: maxLoggedWt > m.defaultWt ? maxLoggedWt : m.defaultWt, defaultReps: maxLoggedReps > m.defaultReps ? maxLoggedReps : m.defaultReps };
        });
        return { ...rt, movements: updatedMovements };
      } return rt;
    });
    setRoutines(updatedRoutines);
    Object.keys(sessionLogs).forEach(mIdx => { sessionLogs[mIdx].forEach(set => { if (set.done) { const w = parseFloat(set.wt)||0; const r = parseFloat(set.reps)||0; totalVol += (w === 0 && r > 0 ? r : w * r); } }); });
    setWorkoutVault([{ id: Date.now(), date: new Date().toLocaleString(), title: activeSession.title, volume: totalVol, duration: formatTime(sessionTime), status: status }, ...workoutVault]);
    setActiveSession(null); setActiveTab('Vault'); setVaultTab('Workouts');
  };


  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const inputStyle = { background: '#000', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' };
  const btnStyle = (bg, color) => ({ background: bg, color: color, border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', width: '100%', cursor: 'pointer' });

  if (activeSession) {
    return (
      <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#fff', position: 'relative' }}>
        
        {/* THE ACTION COACH OVERLAY */}
        {coach && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: coach.phase === 'hold' ? 'rgba(239, 68, 68, 0.95)' : coach.phase === 'release' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(0,0,0,0.95)', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'background 0.5s ease' }}>
            <h2 style={{ fontSize: '2rem', color: '#fff', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>
              {coach.phase === 'prep' ? 'Get Ready' : coach.phase === 'work' ? 'Go!' : coach.phase === 'hold' ? 'HOLD' : 'RELEASE'}
            </h2>
            {coach.move.type === 'hold' && <div style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '20px' }}>Cycle {coach.cycle} of {coach.move.cycles}</div>}
            <div style={{ fontSize: '7rem', fontWeight: 'bold', color: '#fff', marginBottom: '40px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>{coach.timeLeft}s</div>
            <button onClick={abortCoach} style={{ background: '#222', color: '#fff', padding: '15px 40px', fontSize: '1.2rem', borderRadius: '30px', fontWeight: 'bold', border: '2px solid #fff' }}>⏹ Cancel Set</button>
          </div>
        )}

        {/* BREATHE OVERLAY */}
        {isResting && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '4rem', color: '#00ffff', margin: '0 0 20px 0', letterSpacing: '2px' }}>🌬️ BREATHE</h1>
            <div style={{ fontSize: '6rem', fontWeight: 'bold', color: '#fff', marginBottom: '40px' }}>{restTimeLeft}s</div>
            <button onClick={endRest} style={{ background: '#3b82f6', color: '#fff', padding: '15px 40px', fontSize: '1.2rem', borderRadius: '30px', fontWeight: 'bold', border: 'none' }}>▶ Resume Early</button>
          </div>
        )}

        <header style={{ background: '#111', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><h2 style={{ margin: 0, color: activeSession.color, fontSize: '1.2rem' }}>{activeSession.title}</h2><span style={{ fontSize: '0.9rem', color: '#aaa' }}>Duration: <strong style={{color:'#fff'}}>{formatTime(sessionTime)}</strong></span></div>
            <button onClick={toggleMasterPause} style={{ background: sessionPaused ? '#10b981' : '#f59e0b', color: '#000', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', border: 'none' }}>{sessionPaused ? '▶ RESUME' : '⏸ PAUSE'}</button>
          </div>
          {/* THE PROGRESS BAR */}
          <div style={{ width: '100%', height: '6px', background: '#222' }}>
            <div style={{ width: `${sessionProgress}%`, background: activeSession.color, height: '100%', transition: 'width 0.3s ease' }}></div>
          </div>
        </header>
        
        <div style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '100px', opacity: sessionPaused ? 0.3 : 1, pointerEvents: sessionPaused ? 'none' : 'auto' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px dashed #3b82f6', padding: '15px', borderRadius: '8px', marginBottom: '15px', color: '#3b82f6', fontStyle: 'italic', textAlign: 'center', fontSize: '0.95rem' }}>{currentQuote}</div>
          
          {activeSession.movements.map((m, mIdx) => (
            <div key={mIdx} style={{ ...cardStyle, borderLeft: `4px solid ${activeSession.color}` }}>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: activeSession.color }}>{m.name}</h3>
              <p style={{ color: '#aaa', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '15px', fontStyle: 'italic' }}>{m.desc}</p>
              
              {m.type === 'reps' && (
                <>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', paddingLeft: '28px', color: '#888', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}><span style={{flex: 1}}>Weight (Lbs)</span><span style={{flex: 1}}>Reps</span><span style={{width: '45px'}}></span></div>
                  {sessionLogs[mIdx]?.map((set, sIdx) => (
                    <div key={sIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', background: set.done ? 'rgba(16, 185, 129, 0.1)' : '#000', padding: '8px', borderRadius: '8px', border: set.done ? '1px solid #10b981' : '1px solid #222' }}>
                      <span style={{ color: '#888', fontWeight: 'bold', width: '20px' }}>{sIdx + 1}</span>
                      <input type="number" placeholder="Lbs" value={set.wt} onChange={e=>updateSet(mIdx, sIdx, 'wt', e.target.value)} disabled={set.done} style={{ ...inputStyle, padding: '8px', flex: 1, opacity: set.done ? 0.5 : 1 }} />
                      <input type="number" placeholder="Reps" value={set.reps} onChange={e=>updateSet(mIdx, sIdx, 'reps', e.target.value)} disabled={set.done} style={{ ...inputStyle, padding: '8px', flex: 1, opacity: set.done ? 0.5 : 1 }} />
                      <button onClick={() => toggleSetDone(mIdx, sIdx)} style={{ background: set.done ? '#10b981' : '#333', color: set.done ? '#000' : '#fff', border: 'none', borderRadius: '6px', width: '45px', height: '40px', fontWeight: 'bold', fontSize: '1.2rem' }}>{set.done ? '✓' : ''}</button>
                    </div>
                  ))}
                </>
              )}

              {(m.type === 'time' || m.type === 'hold') && sessionLogs[mIdx]?.map((set, sIdx) => (
                <div key={sIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', background: set.done ? 'rgba(16, 185, 129, 0.1)' : '#000', padding: '8px', borderRadius: '8px', border: set.done ? '1px solid #10b981' : '1px solid #222' }}>
                  <span style={{ color: '#888', fontWeight: 'bold', width: '20px' }}>{sIdx + 1}</span>
                  <div style={{ flex: 1, color: set.done ? '#10b981' : '#aaa', fontSize: '0.9rem' }}>
                    {m.type === 'time' ? `${m.duration}s Timer` : `${m.holdSecs}s Hold / ${m.relSecs}s Rel (${m.cycles}x)`}
                  </div>
                  {set.done ? (
                    <button onClick={() => toggleSetDone(mIdx, sIdx)} style={{ background: 'transparent', color: '#10b981', border: '1px solid #10b981', borderRadius: '6px', padding: '8px 15px', fontWeight: 'bold' }}>✓ DONE</button>
                  ) : (
                    <button onClick={() => startActionCoach(mIdx, sIdx, m)} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 15px', fontWeight: 'bold' }}>▶ START</button>
                  )}
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
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/')} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#ef4444', fontSize: '1.2rem' }}>Performance Engine</h2>
      </header>

      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Routines', 'Cardio', 'Metrics', 'Vault'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === tab ? '#10b981' : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>{tab}</button>
        ))}
      </div>

      <div style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '80px' }}>
        {activeTab === 'Routines' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button onClick={() => setShowBuilder(!showBuilder)} style={btnStyle('transparent', '#10b981', {border: '1px dashed #10b981'})}>{showBuilder ? 'Cancel Builder' : '+ Build Custom Routine'}</button>
            
            {showBuilder && (
              <div style={{ ...cardStyle, border: '1px solid #10b981' }}>
                <input type="text" placeholder="Workout Title (e.g. Leg Day)" value={newRoutine.title} onChange={e=>setNewRoutine({...newRoutine, title: e.target.value})} style={{...inputStyle, marginBottom: '10px'}} />
                <input type="text" placeholder="Short Description..." value={newRoutine.desc} onChange={e=>setNewRoutine({...newRoutine, desc: e.target.value})} style={{...inputStyle, marginBottom: '10px'}} />
                <div style={{ marginBottom: '15px' }}>
                  <label style={{display:'block', color:'#00cc66', fontSize:'0.8rem', fontWeight:'bold', marginBottom:'5px'}}>Rest Between Sets (Seconds)</label>
                  <input type="number" value={newRoutine.restTime} onChange={e=>setNewRoutine({...newRoutine, restTime: parseInt(e.target.value)})} style={inputStyle} />
                </div>

                <h4 style={{ color: '#00cc66', margin: '0 0 10px 0' }}>Exercises</h4>
                {bMovements.map((m, idx) => (
                  <div key={idx} style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #333', marginBottom: '10px' }}>
                    <input type="text" placeholder="Exercise Name" value={m.name} onChange={e=>updateCMove(idx, 'name', e.target.value)} style={{...inputStyle, marginBottom: '10px'}} />
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                      <select value={m.type} onChange={e=>updateCMove(idx, 'type', e.target.value)} style={{...inputStyle, flex: 1, padding: '8px'}}>
                        <option value="reps">Weight/Reps</option><option value="time">Duration Timer</option><option value="hold">Hold & Release</option>
                      </select>
                      <input type="number" placeholder="Sets" value={m.sets} onChange={e=>updateCMove(idx, 'sets', parseInt(e.target.value))} style={{...inputStyle, flex: 1, padding: '8px'}} />
                    </div>
                    {m.type === 'reps' && <input type="number" placeholder="Target Reps" value={m.defaultReps} onChange={e=>updateCMove(idx, 'defaultReps', parseInt(e.target.value))} style={inputStyle} />}
                    {m.type === 'time' && <input type="number" placeholder="Duration (Seconds)" value={m.duration} onChange={e=>updateCMove(idx, 'duration', parseInt(e.target.value))} style={inputStyle} />}
                    {m.type === 'hold' && (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <input type="number" placeholder="Hold (s)" value={m.holdSecs} onChange={e=>updateCMove(idx, 'holdSecs', parseInt(e.target.value))} style={inputStyle} />
                        <input type="number" placeholder="Rel (s)" value={m.relSecs} onChange={e=>updateCMove(idx, 'relSecs', parseInt(e.target.value))} style={inputStyle} />
                        <input type="number" placeholder="Cycles" value={m.cycles} onChange={e=>updateCMove(idx, 'cycles', parseInt(e.target.value))} style={inputStyle} />
                      </div>
                    )}
                  </div>
                ))}
                <button onClick={addCustomMove} style={{ background: '#222', color: '#fff', border: '1px dashed #555', padding: '10px', borderRadius: '6px', width: '100%', marginBottom: '15px' }}>+ Add Another</button>
                <button onClick={saveCustomRoutine} style={btnStyle('#10b981', '#000')}>💾 Save Routine</button>
              </div>
            )}

            {routines.map((rt) => (
              <div key={rt.id} style={{ ...cardStyle, borderLeft: `4px solid ${rt.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '1.1rem' }}>{rt.title}</h3>
                  <button onClick={() => deleteRoutine(rt.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontWeight: 'bold' }}>🗑️ Delete</button>
                </div>
                <p style={{ color: '#aaa', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '15px' }}>{rt.desc}</p>
                <button onClick={() => startWorkout(rt)} style={{ ...btnStyle(rt.color, '#000') }}>▶ Start Workout</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Cardio' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #00ffff', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#00ffff' }}>🏃 Offline Cardio</h3>
            <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '20px' }}>Distance uses your height algorithm, not GPS.</p>
            <div style={{ background: '#000', width: '200px', height: '200px', borderRadius: '50%', border: runActive ? '4px solid #00ffff' : '4px solid #333', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <span style={{ fontSize: '3.5rem', fontWeight: 'bold', color: runActive ? '#fff' : '#555', fontVariantNumeric: 'tabular-nums' }}>{formatTime(runTime)}</span>
              <span style={{ color: '#00ffff', fontSize: '1.2rem', fontWeight: 'bold' }}>{estMiles} mi</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={toggleRun} style={{ ...btnStyle(runActive ? '#f59e0b' : '#00ffff', '#000'), flex: 2 }}>{runActive ? '⏸ Pause' : '▶ Start Run'}</button>
              <button onClick={saveRun} style={{ ...btnStyle('#10b981', '#000'), flex: 1 }}>💾 Save</button>
            </div>
          </div>
        )}

        {activeTab === 'Metrics' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #ef4444', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#ef4444' }}>🏋️ 1-Rep Max Calculator</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{flex: 1}}><label style={{display:'block', color:'#888', fontSize:'0.8rem'}}>Weight (Lbs)</label><input type="number" value={calcWt} onChange={e=>setCalcWt(e.target.value)} style={inputStyle} /></div>
                <div style={{flex: 1}}><label style={{display:'block', color:'#888', fontSize:'0.8rem'}}>Reps</label><input type="number" value={calcReps} onChange={e=>setCalcReps(e.target.value)} style={inputStyle} /></div>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
                <span style={{ color: '#aaa', display: 'block' }}>Estimated 1-Rep Max:</span>
                <strong style={{ color: '#ef4444', fontSize: '2rem' }}>{oneRM} lbs</strong>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#f59e0b' }}>⚖️ Body Weight & Height</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#000', borderRadius: '12px', padding: '10px', border: '1px solid #333', marginBottom: '15px' }}>
                <button onClick={() => setBw(prev => Math.max(0, prev - 1))} style={{ background: '#222', color: '#f59e0b', border: 'none', fontSize: '2rem', width: '60px', height: '60px', borderRadius: '8px' }}>-</button>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fff' }}>{bw} <span style={{fontSize:'1rem', color:'#888'}}>lbs</span></div>
                <button onClick={() => setBw(prev => prev + 1)} style={{ background: '#222', color: '#f59e0b', border: 'none', fontSize: '2rem', width: '60px', height: '60px', borderRadius: '8px' }}>+</button>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{flex: 1}}><label style={{display:'block', color:'#888', fontSize:'0.8rem'}}>Height (inches)</label><input type="number" value={bh} onChange={e=>setBh(parseFloat(e.target.value))} style={inputStyle} /></div>
                <div style={{flex: 1}}><label style={{display:'block', color:'#888', fontSize:'0.8rem'}}>Age</label><input type="number" value={ba} onChange={e=>setBa(parseFloat(e.target.value))} style={inputStyle} /></div>
              </div>
              <button onClick={logWeight} style={{...btnStyle('#10b981', '#000'), width: '100%'}}>💾 Log to Vault</button>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#a855f7' }}>🔥 Daily Macros</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{flex: 1}}><label style={{display:'block', color:'#3b82f6', fontSize:'0.8rem'}}>Protein (g)</label><input type="number" value={macros.p} onChange={e=>updateMacro('p', e.target.value)} style={inputStyle} /></div>
                <div style={{flex: 1}}><label style={{display:'block', color:'#10b981', fontSize:'0.8rem'}}>Carbs (g)</label><input type="number" value={macros.c} onChange={e=>updateMacro('c', e.target.value)} style={inputStyle} /></div>
                <div style={{flex: 1}}><label style={{display:'block', color:'#f59e0b', fontSize:'0.8rem'}}>Fats (g)</label><input type="number" value={macros.f} onChange={e=>updateMacro('f', e.target.value)} style={inputStyle} /></div>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222', textAlign: 'center' }}>
                <span style={{ color: '#aaa', display: 'block' }}>Estimated Calories:</span>
                <strong style={{ color: '#a855f7', fontSize: '2rem' }}>{totalCals}</strong>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#3b82f6' }}>💧 Drink Water ({waterOz} / 128 oz)</h3>
              <div style={{ width: '100%', background: '#222', height: '12px', borderRadius: '10px', marginBottom: '20px', overflow: 'hidden' }}>
                <div style={{ width: `${waterPercent}%`, background: '#3b82f6', height: '100%', transition: 'width 0.3s ease' }}></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <button onClick={() => addWater(8)} style={{...btnStyle('#222', '#3b82f6'), border: '1px solid #3b82f6'}}>+ 8</button>
                <button onClick={() => addWater(16)} style={{...btnStyle('#3b82f6', '#000')}}>+ 16</button>
                <button onClick={() => addWater(32)} style={{...btnStyle('#222', '#3b82f6'), border: '1px solid #3b82f6'}}>+ 32</button>
              </div>
              <button onClick={resetWater} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '0.85rem' }}>Archive to Vault & Reset Day</button>
            </div>
          </>
        )}

        {activeTab === 'Vault' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button onClick={exportData} style={{ background: '#222', border: '1px dashed #a855f7', color: '#a855f7', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>💾 Export All Vault Data (.json)</button>
            
            <div style={{ display: 'flex', background: '#000', padding: '5px', borderRadius: '8px', border: '1px solid #333' }}>
              {['Workouts', 'Biometrics', 'Cardio'].map(t => (
                <button key={t} onClick={() => setVaultTab(t)} style={{ flex: 1, padding: '8px', background: vaultTab === t ? '#333' : 'transparent', color: vaultTab === t ? '#fff' : '#888', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>{t}</button>
              ))}
            </div>

            {vaultTab === 'Workouts' && (
              <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#a855f7' }}>🏆 Workout History</h3>
                {workoutVault.length === 0 ? <p style={{color:'#888', fontStyle:'italic'}}>No workouts saved yet.</p> : workoutVault.map((log) => (
                  <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #222' }}>
                    <div>
                      <strong style={{color:'#fff', display:'block'}}>{log.title}</strong>
                      <span style={{color: log.status === 'Completed' ? '#10b981' : '#ef4444', fontSize: '0.8rem', fontWeight: 'bold'}}>{log.status} </span>
                      <span style={{color:'#666', fontSize:'0.8rem'}}>• {log.date}</span>
                    </div>
                    <div style={{textAlign:'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px'}}>
                      <div><strong style={{color:'#a855f7'}}>{log.volume > 0 ? log.volume : '-'}</strong><span style={{color:'#888', fontSize:'0.8rem', marginLeft: '5px'}}>Vol/Reps</span></div>
                      <button onClick={() => deleteLog('workout', log.id)} style={{background:'transparent', color:'#ef4444', border:'none', fontSize:'0.8rem', cursor:'pointer'}}>🗑️ Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {vaultTab === 'Biometrics' && (
              <>
                <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>⚖️ Weight & BMI Log</h3>
                  {weightLogs.length === 0 ? <p style={{color:'#888'}}>No weights logged.</p> : weightLogs.map((log, i) => {
                    const prevWt = weightLogs[i+1]?.wt;
                    const diff = prevWt ? (log.wt - prevWt).toFixed(1) : 0;
                    const logBmi = (((log.wt / (bh * bh)) * 703)).toFixed(1);
                    return (
                      <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #222' }}>
                        <div>
                          <span style={{color:'#ccc', display: 'block', marginBottom: '5px'}}>{log.date}</span>
                          <button onClick={() => deleteLog('weight', log.id)} style={{background:'transparent', color:'#ef4444', border:'none', fontSize:'0.8rem', padding: 0}}>🗑️ Delete</button>
                        </div>
                        <div style={{textAlign:'right'}}>
                          <strong style={{color:'#f59e0b', fontSize:'1.1rem'}}>{log.wt} lbs <span style={{fontSize:'0.85rem', color:'#aaa'}}>(BMI: {logBmi})</span></strong>
                          {prevWt && <span style={{display:'block', fontSize:'0.85rem', color: diff > 0 ? '#ef4444' : '#10b981', marginTop: '4px'}}>{diff > 0 ? '↑ Gained' : '↓ Lost'} {Math.abs(diff)} lbs</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>❤️ Heart Rate Log</h3>
                  {hrLogs.length === 0 ? <p style={{color:'#888'}}>No heart rates logged.</p> : hrLogs.map((log) => (
                    <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #222' }}>
                      <div><span style={{color:'#ccc', display: 'block'}}>{log.date}</span><button onClick={() => deleteLog('hr', log.id)} style={{background:'transparent', color:'#ef4444', border:'none', fontSize:'0.8rem', padding: 0}}>🗑️ Delete</button></div>
                      <strong style={{color:'#ef4444', fontSize: '1.2rem'}}>{log.bpm} BPM</strong>
                    </div>
                  ))}
                </div>
              </>
            )}

            {vaultTab === 'Cardio' && (
              <div style={{ ...cardStyle, borderTop: '4px solid #00ffff' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#00ffff' }}>🏃 Run Log</h3>
                {runLogs.length === 0 ? <p style={{color:'#888'}}>No runs logged.</p> : runLogs.map(log => (
                  <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #222' }}>
                    <div>
                      <span style={{color:'#ccc', display: 'block'}}>{log.date}</span>
                      <button onClick={() => deleteLog('run', log.id)} style={{background:'transparent', color:'#ef4444', border:'none', fontSize:'0.8rem', padding: 0, marginTop: '5px'}}>🗑️ Delete</button>
                    </div>
                    <div style={{textAlign:'right'}}><strong style={{color:'#00ffff', display:'block', fontSize: '1.2rem'}}>{log.dist} mi</strong><span style={{color:'#888', fontSize:'0.8rem'}}>{log.time}</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
