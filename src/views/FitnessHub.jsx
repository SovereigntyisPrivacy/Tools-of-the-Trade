import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FitnessHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Workouts');
  const [vaultTab, setVaultTab] = useState('Exercises');

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

  // V8 Database - Completely overhauled for family-friendly reading
  const defaultRoutines = [
    { id: 'r1', title: "Bodyweight Basics", type: "No Equipment", color: "#f59e0b", restTime: 45, desc: "Uses just your body. Great for getting strong anywhere!", movements: [ { name: "Push-ups", sets: 4, type: 'reps', defaultWt: 0, defaultReps: 10, desc: "Keep your body straight. Lower your chest to the floor and push up." }, { name: "Air Squats", sets: 4, type: 'reps', defaultWt: 0, defaultReps: 15, desc: "Pretend you are sitting down in a chair. Keep your chest up!" }, { name: "Lunges", sets: 3, type: 'reps', defaultWt: 0, defaultReps: 10, desc: "Take a big step forward and lower your back knee to gently kiss the ground." } ] },
    { id: 'r2', title: "Dumbbell Full Body", type: "Gym Weights", color: "#ef4444", restTime: 60, desc: "Use hand weights to build strong muscles safely.", movements: [ { name: "Goblet Squats", sets: 4, type: 'reps', defaultWt: 20, defaultReps: 10, desc: "Hold a single dumbbell at your chest. Squat down deep." }, { name: "Dumbbell Press", sets: 4, type: 'reps', defaultWt: 20, defaultReps: 10, desc: "Push the weights straight up over your head." }, { name: "Dumbbell Rows", sets: 3, type: 'reps', defaultWt: 20, defaultReps: 10, desc: "Bend over slightly, pull the weights up to your tummy." } ] },
    { id: 'r4', title: "Morning Energy Boost", type: "Warm-Up", color: "#eab308", restTime: 15, desc: "Quick 5-minute movements to wake up your body.", movements: [ { name: "Jumping Jacks", sets: 2, type: 'reps', defaultWt: 0, defaultReps: 30, desc: "Jump wide while clapping hands above your head." }, { name: "Arm Circles", sets: 2, type: 'reps', defaultWt: 0, defaultReps: 20, desc: "Make small forward circles, then backward." } ] },
    { id: 'r5', title: "Soreness Relief Stretches", type: "Stretching", color: "#00cccc", restTime: 30, desc: "Relieve lower back pain and leg tiredness from working all day.", movements: [ { name: "Standing Back Bends", sets: 2, type: 'time', duration: 60, desc: "Put hands on your hips and gently lean back." }, { name: "Hanging Stretch", sets: 2, type: 'time', duration: 60, desc: "Hang from a bar to stretch your back out." } ] },
    { id: 'r6', title: "Calm Focus Breathing", type: "Relaxation", color: "#10b981", restTime: 10, desc: "A simple breathing trick to steady your heart and feel calm.", movements: [ { name: "Guided Breathing", sets: 1, type: 'breathing', inhaleSecs: 4, hold1Secs: 4, exhaleSecs: 4, hold2Secs: 4, cycles: 10, desc: "Follow the coach: Inhale, Hold, Exhale, Hold Empty." } ] },
    { id: 'r7', title: "Deep Sleep Breathing", type: "Recovery", color: "#8b5cf6", restTime: 10, desc: "Helps you relax and fall asleep quickly at night.", movements: [ { name: "Sleep Breathing Flow", sets: 1, type: 'breathing', inhaleSecs: 4, hold1Secs: 7, exhaleSecs: 8, hold2Secs: 0, cycles: 8, desc: "Inhale fast, hold for a long time, exhale very slowly." } ] }
  ];
  
  const [routines, setRoutines] = useState(() => JSON.parse(localStorage.getItem('tot_routines_v8')) || defaultRoutines);
  const [showBuilder, setShowBuilder] = useState(false);
  const [newRoutine, setNewRoutine] = useState({ title: '', desc: '', restTime: 60 });
  const [bMovements, setBMovements] = useState([{ name: '', type: 'reps', sets: 3, defaultReps: 10, duration: 60, holdSecs: 5, relSecs: 5, inhaleSecs: 4, hold1Secs: 4, exhaleSecs: 4, hold2Secs: 4, cycles: 5 }]);

  const [activeSession, setActiveSession] = useState(null);
  const [sessionLogs, setSessionLogs] = useState({});
  const [sessionTime, setSessionTime] = useState(0); 
  const [sessionPaused, setSessionPaused] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [coach, setCoach] = useState(null);

  const [runTime, setRunTime] = useState(0);
  const [runActive, setRunActive] = useState(false);

  const sessionRef = useRef(null); const restIntervalRef = useRef(null); const runRef = useRef(null); const coachRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('tot_bw', bw); localStorage.setItem('tot_bh', bh); localStorage.setItem('tot_ba', ba);
    localStorage.setItem('tot_macros', JSON.stringify(macros)); localStorage.setItem('tot_water_oz', waterOz.toString());
    localStorage.setItem('tot_hydro_vault', JSON.stringify(hydroVault)); localStorage.setItem('tot_weight_logs', JSON.stringify(weightLogs));
    localStorage.setItem('tot_hr_logs', JSON.stringify(hrLogs)); localStorage.setItem('tot_run_logs', JSON.stringify(runLogs));
    localStorage.setItem('tot_workout_vault', JSON.stringify(workoutVault)); localStorage.setItem('tot_routines_v8', JSON.stringify(routines));
  }, [bw, bh, ba, macros, waterOz, hydroVault, weightLogs, hrLogs, runLogs, workoutVault, routines]);

  const formatTime = (secs) => { const h = Math.floor(secs/3600); const m = Math.floor((secs%3600)/60); const s = secs%60; return h > 0 ? `${h}:${m < 10 ? '0':''}${m}:${s < 10 ? '0':''}${s}` : `${m}:${s < 10 ? '0':''}${s}`; };
  const totalCals = (macros.p * 4) + (macros.c * 4) + (macros.f * 9);
  const estMiles = ((runTime / 60) * 150 * (bh * 0.413) / 63360).toFixed(2);
  const oneRM = Math.round(calcWt * (1 + (calcReps / 30)));
  const waterPercent = Math.min((waterOz / 128) * 100, 100);

  let totalSets = 0; let completedSets = 0;
  if (activeSession) { Object.keys(sessionLogs).forEach(mIdx => { sessionLogs[mIdx].forEach(set => { totalSets++; if(set.done) completedSets++; }); }); }
  const sessionProgress = totalSets === 0 ? 0 : Math.round((completedSets / totalSets) * 100);

  const updateMacro = (field, val) => setMacros(prev => ({ ...prev, [field]: parseInt(val)||0 }));
  const logWeight = () => { setWeightLogs([{ id: Date.now(), date: new Date().toLocaleString(), wt: bw }, ...weightLogs]); alert("Weight saved to History!"); };
  const logHR = () => { if(currentHR) { setHrLogs([{ id: Date.now(), date: new Date().toLocaleString(), bpm: currentHR }, ...hrLogs]); setCurrentHR(''); alert("Heart Rate saved!"); }};
  const addWater = (amt) => setWaterOz(prev => prev + amt);
  const resetWater = () => { if(window.confirm("Save water to History and reset?")) { setHydroVault([{ id: Date.now(), date: new Date().toLocaleDateString(), oz: waterOz }, ...hydroVault]); setWaterOz(0); } };
  const toggleRun = () => { if (runActive) { clearInterval(runRef.current); setRunActive(false); } else { setRunActive(true); runRef.current = setInterval(() => setRunTime(prev => prev + 1), 1000); } };
  const saveRun = () => { if(runTime === 0) return; setRunLogs([{ id: Date.now(), date: new Date().toLocaleString(), time: formatTime(runTime), dist: estMiles }, ...runLogs]); clearInterval(runRef.current); setRunActive(false); setRunTime(0); alert("Saved to History!"); };
  
  const deleteLog = (type, id) => {
    if(!window.confirm("Permanently delete this record?")) return;
    if(type === 'workout') setWorkoutVault(prev => prev.filter(l => l.id !== id));
    if(type === 'weight') setWeightLogs(prev => prev.filter(l => l.id !== id));
    if(type === 'water') setHydroVault(prev => prev.filter(l => l.id !== id));
    if(type === 'run') setRunLogs(prev => prev.filter(l => l.id !== id));
    if(type === 'hr') setHrLogs(prev => prev.filter(l => l.id !== id));
  };
  const deleteRoutine = (id) => { if(window.confirm("Delete this workout?")) setRoutines(routines.filter(r => r.id !== id)); };

  const exportData = () => {
    const backup = JSON.stringify({ workouts: workoutVault, weight: weightLogs, hr: hrLogs, run: runLogs, water: hydroVault, macros: macros }, null, 2);
    const blob = new Blob([backup], { type: "application/json" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `Health_History_Backup_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const addCustomMove = () => setBMovements([...bMovements, { name: '', type: 'reps', sets: 3, defaultReps: 10, duration: 60, holdSecs: 5, relSecs: 5, inhaleSecs: 4, hold1Secs: 4, exhaleSecs: 4, hold2Secs: 4, cycles: 5 }]);
  const updateCMove = (idx, field, val) => { const newM = [...bMovements]; newM[idx][field] = val; setBMovements(newM); };
  const saveCustomRoutine = () => {
    if(!newRoutine.title) return alert("Title required.");
    setRoutines([...routines, { id: 'c'+Date.now(), title: newRoutine.title, type: 'Custom', color: '#00cc66', restTime: newRoutine.restTime || 60, desc: newRoutine.desc, movements: bMovements }]);
    setShowBuilder(false); setNewRoutine({ title: '', desc: '', restTime: 60 }); setBMovements([{ name: '', type: 'reps', sets: 3, defaultReps: 10, duration: 60, holdSecs: 5, relSecs: 5, inhaleSecs: 4, hold1Secs: 4, exhaleSecs: 4, hold2Secs: 4, cycles: 5 }]); alert("Workout Saved!");
  };

  const startActionCoach = (mIdx, sIdx, move) => {
    setCoach({ mIdx, sIdx, move, phase: 'prep', timeLeft: 3, cycle: 1 });
    clearInterval(sessionRef.current); clearInterval(coachRef.current);
    
    coachRef.current = setInterval(() => {
      setCoach(prev => {
        if(!prev) return null;
        if(prev.timeLeft <= 1) {
          if(prev.move.type === 'time') {
             if(prev.phase === 'prep') return { ...prev, phase: 'work', timeLeft: prev.move.duration };
             endActionCoach(prev.mIdx, prev.sIdx); return null;
          }
          if(prev.move.type === 'hold') {
            if(prev.phase === 'prep') return { ...prev, phase: 'hold', timeLeft: prev.move.holdSecs };
            if(prev.phase === 'hold') return { ...prev, phase: 'release', timeLeft: prev.move.relSecs };
            if(prev.phase === 'release') {
              if(prev.cycle >= prev.move.cycles) { endActionCoach(prev.mIdx, prev.sIdx); return null; }
              return { ...prev, phase: 'hold', timeLeft: prev.move.holdSecs, cycle: prev.cycle + 1 };
            }
          }
          if(prev.move.type === 'breathing') {
            if(prev.phase === 'prep') return { ...prev, phase: 'inhale', timeLeft: prev.move.inhaleSecs };
            if(prev.phase === 'inhale') {
               if (prev.move.hold1Secs > 0) return { ...prev, phase: 'hold1', timeLeft: prev.move.hold1Secs };
               return { ...prev, phase: 'exhale', timeLeft: prev.move.exhaleSecs };
            }
            if(prev.phase === 'hold1') return { ...prev, phase: 'exhale', timeLeft: prev.move.exhaleSecs };
            if(prev.phase === 'exhale') {
               if (prev.move.hold2Secs > 0) return { ...prev, phase: 'hold2', timeLeft: prev.move.hold2Secs };
               if(prev.cycle >= prev.move.cycles) { endActionCoach(prev.mIdx, prev.sIdx); return null; }
               return { ...prev, phase: 'inhale', timeLeft: prev.move.inhaleSecs, cycle: prev.cycle + 1 };
            }
            if(prev.phase === 'hold2') {
               if(prev.cycle >= prev.move.cycles) { endActionCoach(prev.mIdx, prev.sIdx); return null; }
               return { ...prev, phase: 'inhale', timeLeft: prev.move.inhaleSecs, cycle: prev.cycle + 1 };
            }
          }
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };
  
  const endActionCoach = (mIdx, sIdx) => { clearInterval(coachRef.current); setCoach(null); toggleSetDone(mIdx, sIdx, true); sessionRef.current = setInterval(() => setSessionTime(p => p + 1), 1000); };
  const abortCoach = () => { clearInterval(coachRef.current); setCoach(null); sessionRef.current = setInterval(() => setSessionTime(p => p + 1), 1000); };

  const startRest = () => {
    setRestTimeLeft(activeSession.restTime || 60); setIsResting(true); setSessionPaused(true);
    clearInterval(sessionRef.current); clearInterval(restIntervalRef.current);
    restIntervalRef.current = setInterval(() => { setRestTimeLeft(prev => { if (prev <= 1) { endRest(); return 0; } return prev - 1; }); }, 1000);
  };
  const endRest = () => { clearInterval(restIntervalRef.current); setIsResting(false); setSessionPaused(false); sessionRef.current = setInterval(() => setSessionTime(p => p + 1), 1000); };

  const animeQuotes = ['"A dropout will beat a genius through hard work." - Rock Lee', '"I do not fear this new challenge. Rather like a true warrior I will rise to meet it." - Vegeta', '"Whether you win or lose, looking back and learning from your experience is a part of life." - All Might', '"Push through the pain. Giving up hurts more." - Vegeta', '"Don\'t believe in yourself. Believe in me! Believe in the Kamina who believes in you!" - Kamina', '"Stand up and walk. Keep moving forward. You\'ve got two good legs." - Edward Elric', '"If you don\'t take risks, you can\'t create a future." - Monkey D. Luffy', '"There is no such thing as luck in this world. There is only hard work." - Saitama', '"Hard work is worthless for those that don\'t believe in themselves." - Naruto Uzumaki', '"A lesson without pain is meaningless." - Edward Elric'];

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
    if(!window.confirm(`Log this workout as ${status}?`)) return;
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
    setActiveSession(null); setActiveTab('History'); setVaultTab('Exercises');
  };


  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const inputStyle = { background: '#000', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' };
  const btnStyle = (bg, color) => ({ background: bg, color: color, border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', width: '100%', cursor: 'pointer' });

  if (activeSession) {
    return (
      <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#fff', position: 'relative' }}>
        
        {coach && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: coach.phase === 'inhale' ? 'rgba(59, 130, 246, 0.95)' : coach.phase === 'hold1' ? 'rgba(139, 92, 246, 0.95)' : coach.phase === 'exhale' || coach.phase === 'release' ? 'rgba(16, 185, 129, 0.95)' : coach.phase === 'hold2' || coach.phase === 'hold' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(0,0,0,0.95)', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'background 0.5s ease' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#fff', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center' }}>
              {coach.phase === 'prep' ? 'Get Ready' : coach.phase === 'work' ? 'Go!' : coach.phase === 'hold' ? 'HOLD' : coach.phase === 'release' ? 'REST' : coach.phase === 'inhale' ? 'INHALE' : coach.phase === 'hold1' ? 'HOLD FULL' : coach.phase === 'exhale' ? 'EXHALE' : 'HOLD EMPTY'}
            </h2>
            {(coach.move.type === 'hold' || coach.move.type === 'breathing') && <div style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '20px' }}>Cycle {coach.cycle} of {coach.move.cycles}</div>}
            <div style={{ fontSize: '7rem', fontWeight: 'bold', color: '#fff', marginBottom: '40px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>{coach.timeLeft}s</div>
            <button onClick={abortCoach} style={{ background: '#222', color: '#fff', padding: '15px 40px', fontSize: '1.2rem', borderRadius: '30px', fontWeight: 'bold', border: '2px solid #fff' }}>⏹ Cancel Set</button>
          </div>
        )}

        {isResting && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '4rem', color: '#00ffff', margin: '0 0 20px 0', letterSpacing: '2px' }}>🌬️ REST</h1>
            <div style={{ fontSize: '6rem', fontWeight: 'bold', color: '#fff', marginBottom: '40px' }}>{restTimeLeft}s</div>
            <button onClick={endRest} style={{ background: '#3b82f6', color: '#fff', padding: '15px 40px', fontSize: '1.2rem', borderRadius: '30px', fontWeight: 'bold', border: 'none' }}>▶ Resume Early</button>
          </div>
        )}

        <header style={{ background: '#111', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><h2 style={{ margin: 0, color: activeSession.color, fontSize: '1.2rem' }}>{activeSession.title}</h2><span style={{ fontSize: '0.9rem', color: '#aaa' }}>Duration: <strong style={{color:'#fff'}}>{formatTime(sessionTime)}</strong></span></div>
            <button onClick={toggleMasterPause} style={{ background: sessionPaused ? '#10b981' : '#f59e0b', color: '#000', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', border: 'none' }}>{sessionPaused ? '▶ RESUME' : '⏸ PAUSE'}</button>
          </div>
          <div style={{ width: '100%', height: '6px', background: '#222' }}>
            <div style={{ width: `${sessionProgress}%`, background: activeSession.color, height: '100%', transition: 'width 0.3s ease' }}></div>
          </div>
        </header>
        
        <div style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '100px', opacity: sessionPaused ? 0.3 : 1, pointerEvents: sessionPaused ? 'none' : 'auto' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.15)', border: '2px solid #3b82f6', padding: '20px', borderRadius: '12px', marginBottom: '20px', color: '#60a5fa', fontStyle: 'italic', textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)' }}>{currentQuote}</div>
          
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

              {(m.type === 'time' || m.type === 'hold' || m.type === 'breathing') && sessionLogs[mIdx]?.map((set, sIdx) => (
                <div key={sIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', background: set.done ? 'rgba(16, 185, 129, 0.1)' : '#000', padding: '8px', borderRadius: '8px', border: set.done ? '1px solid #10b981' : '1px solid #222' }}>
                  <span style={{ color: '#888', fontWeight: 'bold', width: '20px' }}>{sIdx + 1}</span>
                  <div style={{ flex: 1, color: set.done ? '#10b981' : '#aaa', fontSize: '0.9rem' }}>
                    {m.type === 'time' && `${m.duration}s Timer`}
                    {m.type === 'hold' && `${m.holdSecs}s Hold / ${m.relSecs}s Rest (${m.cycles}x)`}
                    {m.type === 'breathing' && `Guided Breathing (${m.cycles} cycles)`}
                  </div>
                  {set.done ? (
                    <button onClick={() => toggleSetDone(mIdx, sIdx)} style={{ background: 'transparent', color: '#10b981', border: '1px solid #10b981', borderRadius: '6px', padding: '8px 15px', fontWeight: 'bold' }}>✓ DONE</button>
                  ) : (
                    <button onClick={() => startActionCoach(mIdx, sIdx, m)} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 15px', fontWeight: 'bold' }}>▶ START COACH</button>
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
        <h2 style={{ margin: 0, color: '#ef4444', fontSize: '1.2rem' }}>Fitness & Health</h2>
      </header>

      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Workouts', 'Run/Walk', 'Health Stats', 'History'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === tab ? '#10b981' : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>{tab}</button>
        ))}
      </div>

      <div style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '80px' }}>
        {activeTab === 'Workouts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button onClick={() => setShowBuilder(!showBuilder)} style={btnStyle('transparent', '#10b981', {border: '1px dashed #10b981'})}>{showBuilder ? 'Cancel Builder' : '+ Build Custom Workout'}</button>
            
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
                        <option value="reps">Lift Weights</option><option value="time">Timed Exercise</option>
                        <option value="hold">Hold Still</option><option value="breathing">Guided Breathing</option>
                      </select>
                      <input type="number" placeholder="Sets" value={m.sets} onChange={e=>updateCMove(idx, 'sets', parseInt(e.target.value))} style={{...inputStyle, flex: 1, padding: '8px'}} />
                    </div>
                    {m.type === 'reps' && <input type="number" placeholder="Target Reps" value={m.defaultReps} onChange={e=>updateCMove(idx, 'defaultReps', parseInt(e.target.value))} style={inputStyle} />}
                    {m.type === 'time' && <input type="number" placeholder="Duration (Seconds)" value={m.duration} onChange={e=>updateCMove(idx, 'duration', parseInt(e.target.value))} style={inputStyle} />}
                    {m.type === 'hold' && (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <input type="number" placeholder="Hold (s)" value={m.holdSecs} onChange={e=>updateCMove(idx, 'holdSecs', parseInt(e.target.value))} style={inputStyle} />
                        <input type="number" placeholder="Rest (s)" value={m.relSecs} onChange={e=>updateCMove(idx, 'relSecs', parseInt(e.target.value))} style={inputStyle} />
                        <input type="number" placeholder="Cycles" value={m.cycles} onChange={e=>updateCMove(idx, 'cycles', parseInt(e.target.value))} style={inputStyle} />
                      </div>
                    )}
                    {m.type === 'breathing' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                        <input type="number" placeholder="Inhale (s)" value={m.inhaleSecs} onChange={e=>updateCMove(idx, 'inhaleSecs', parseInt(e.target.value))} style={inputStyle} />
                        <input type="number" placeholder="Top Hold (s)" value={m.hold1Secs} onChange={e=>updateCMove(idx, 'hold1Secs', parseInt(e.target.value))} style={inputStyle} />
                        <input type="number" placeholder="Exhale (s)" value={m.exhaleSecs} onChange={e=>updateCMove(idx, 'exhaleSecs', parseInt(e.target.value))} style={inputStyle} />
                        <input type="number" placeholder="Btm Hold (s)" value={m.hold2Secs} onChange={e=>updateCMove(idx, 'hold2Secs', parseInt(e.target.value))} style={inputStyle} />
                        <input type="number" placeholder="Cycles" value={m.cycles} onChange={e=>updateCMove(idx, 'cycles', parseInt(e.target.value))} style={{...inputStyle, gridColumn: 'span 2'}} />
                      </div>
                    )}
                  </div>
                ))}
                <button onClick={addCustomMove} style={{ background: '#222', color: '#fff', border: '1px dashed #555', padding: '10px', borderRadius: '6px', width: '100%', marginBottom: '15px' }}>+ Add Another Exercise</button>
                <button onClick={saveCustomRoutine} style={btnStyle('#10b981', '#000')}>💾 Save Workout</button>
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

        {activeTab === 'Run/Walk' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #00ffff', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#00ffff' }}>🏃 Run & Walk Tracker</h3>
            <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '20px' }}>Distance is estimated automatically!</p>
            <div style={{ background: '#000', width: '200px', height: '200px', borderRadius: '50%', border: runActive ? '4px solid #00ffff' : '4px solid #333', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <span style={{ fontSize: '3.5rem', fontWeight: 'bold', color: runActive ? '#fff' : '#555', fontVariantNumeric: 'tabular-nums' }}>{formatTime(runTime)}</span>
              <span style={{ color: '#00ffff', fontSize: '1.2rem', fontWeight: 'bold' }}>{estMiles} mi</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={toggleRun} style={{ ...btnStyle(runActive ? '#f59e0b' : '#00ffff', '#000'), flex: 2 }}>{runActive ? '⏸ Pause' : '▶ Start'}</button>
              <button onClick={saveRun} style={{ ...btnStyle('#10b981', '#000'), flex: 1 }}>💾 Save</button>
            </div>
          </div>
        )}

        {activeTab === 'Health Stats' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #ef4444', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#ef4444' }}>🏋️ Strength Calculator (Max Lift)</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{flex: 1}}><label style={{display:'block', color:'#888', fontSize:'0.8rem'}}>Weight (Lbs)</label><input type="number" value={calcWt} onChange={e=>setCalcWt(e.target.value)} style={inputStyle} /></div>
                <div style={{flex: 1}}><label style={{display:'block', color:'#888', fontSize:'0.8rem'}}>Reps</label><input type="number" value={calcReps} onChange={e=>setCalcReps(e.target.value)} style={inputStyle} /></div>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
                <span style={{ color: '#aaa', display: 'block' }}>Estimated Maximum Lift:</span>
                <strong style={{ color: '#ef4444', fontSize: '2rem' }}>{oneRM} lbs</strong>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#f59e0b' }}>⚖️ Body Weight</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#000', borderRadius: '12px', padding: '10px', border: '1px solid #333', marginBottom: '15px' }}>
                <button onClick={() => setBw(prev => Math.max(0, prev - 1))} style={{ background: '#222', color: '#f59e0b', border: 'none', fontSize: '2rem', width: '60px', height: '60px', borderRadius: '8px' }}>-</button>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fff' }}>{bw} <span style={{fontSize:'1rem', color:'#888'}}>lbs</span></div>
                <button onClick={() => setBw(prev => prev + 1)} style={{ background: '#222', color: '#f59e0b', border: 'none', fontSize: '2rem', width: '60px', height: '60px', borderRadius: '8px' }}>+</button>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{flex: 1}}><label style={{display:'block', color:'#888', fontSize:'0.8rem'}}>Height (inches)</label><input type="number" value={bh} onChange={e=>setBh(parseFloat(e.target.value))} style={inputStyle} /></div>
                <div style={{flex: 1}}><label style={{display:'block', color:'#888', fontSize:'0.8rem'}}>Age</label><input type="number" value={ba} onChange={e=>setBa(parseFloat(e.target.value))} style={inputStyle} /></div>
              </div>
              <button onClick={logWeight} style={{...btnStyle('#10b981', '#000'), width: '100%'}}>💾 Log to History</button>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #ef4444', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#ef4444' }}>❤️ Heart Rate Monitor</h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="number" placeholder="Enter Beats Per Minute (BPM)" value={currentHR} onChange={e=>setCurrentHR(e.target.value)} style={{...inputStyle, flex: 2}} />
                <button onClick={logHR} style={{...btnStyle('#ef4444', '#fff'), flex: 1}}>Log BPM</button>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#a855f7' }}>🔥 Daily Food & Calories</h3>
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
                <button onClick={() => addWater(8)} style={{...btnStyle('#222', '#3b82f6'), border: '1px solid #3b82f6'}}>+ 8 oz</button>
                <button onClick={() => addWater(16)} style={{...btnStyle('#3b82f6', '#000')}}>+ 16 oz</button>
                <button onClick={() => addWater(32)} style={{...btnStyle('#222', '#3b82f6'), border: '1px solid #3b82f6'}}>+ 32 oz</button>
              </div>
              <button onClick={resetWater} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '0.85rem' }}>Save to History & Start New Day</button>
            </div>
          </>
        )}

        {activeTab === 'History' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button onClick={exportData} style={{ background: '#222', border: '1px dashed #a855f7', color: '#a855f7', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>💾 Backup My Data to Phone (.json)</button>
            
            <div style={{ display: 'flex', background: '#000', padding: '5px', borderRadius: '8px', border: '1px solid #333' }}>
              {['Exercises', 'Body Stats', 'Run/Walk'].map(t => (
                <button key={t} onClick={() => setVaultTab(t)} style={{ flex: '1', padding: '8px', background: vaultTab === t ? '#333' : 'transparent', color: vaultTab === t ? '#fff' : '#888', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>{t}</button>
              ))}
            </div>

            {vaultTab === 'Exercises' && (
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

            {vaultTab === 'Body Stats' && (
              <>
                <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>⚖️ Weight Log</h3>
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

            {vaultTab === 'Run/Walk' && (
              <div style={{ ...cardStyle, borderTop: '4px solid #00ffff' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#00ffff' }}>🏃 Run & Walk Log</h3>
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
