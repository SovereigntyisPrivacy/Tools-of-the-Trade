import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FitnessHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Metrics');

  // --- METRICS STATE ---
  const [bw, setBw] = useState(() => localStorage.getItem('tot_bw') || '260');
  const [bh, setBh] = useState(() => localStorage.getItem('tot_bh') || '71');
  const [ba, setBa] = useState(() => localStorage.getItem('tot_ba') || '29');
  const [weightLogs, setWeightLogs] = useState(() => JSON.parse(localStorage.getItem('tot_weight_logs')) || []);
  const [waterOz, setWaterOz] = useState(() => parseInt(localStorage.getItem('tot_water_oz')) || 0);
  
  // New: Tape Measurements
  const [meas, setMeas] = useState(() => JSON.parse(localStorage.getItem('tot_meas')) || { neck: '', chest: '', waist: '', bicep: '', thigh: '' });

  // --- STRENGTH STATE ---
  const [liftWt, setLiftWt] = useState('225');
  const [liftReps, setLiftReps] = useState('5');

  // --- TIMER STATE ---
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerLabel, setTimerLabel] = useState('Ready');
  const timerRef = useRef(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('tot_bw', bw); localStorage.setItem('tot_bh', bh); localStorage.setItem('tot_ba', ba);
    localStorage.setItem('tot_weight_logs', JSON.stringify(weightLogs));
    localStorage.setItem('tot_water_oz', waterOz.toString());
    localStorage.setItem('tot_meas', JSON.stringify(meas));
  }, [bw, bh, ba, weightLogs, waterOz, meas]);

  // Formulas
  const bmi = ((parseFloat(bw)||0) / Math.pow(parseFloat(bh)||1, 2)) * 703;
  const bmr = 10 * ((parseFloat(bw)||0) * 0.453592) + 6.25 * ((parseFloat(bh)||0) * 2.54) - 5 * (parseFloat(ba)||30) + 5;
  const oneRM = (parseFloat(liftWt)||0) * (1 + ((parseFloat(liftReps)||0) / 30));

  const logWeight = () => setWeightLogs([{ date: new Date().toLocaleDateString(), wt: bw }, ...weightLogs]);
  const addWater = (amount) => setWaterOz(prev => prev + amount);
  const resetWater = () => { if(window.confirm("Reset water tracker for today?")) setWaterOz(0); };
  const updateMeas = (field, val) => setMeas(prev => ({ ...prev, [field]: val }));

  // Timer Engine
  const startTimer = (seconds, label) => {
    clearInterval(timerRef.current);
    setTimeLeft(seconds); setTimerLabel(label); setTimerActive(true);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); setTimerActive(false); setTimerLabel('Completed!'); return 0; }
        return prev - 1;
      });
    }, 1000);
  };
  const stopTimer = () => { clearInterval(timerRef.current); setTimerActive(false); };
  const formatTime = (secs) => { const m = Math.floor(secs/60); const s = secs%60; return `${m}:${s < 10 ? '0' : ''}${s}`; };

  // --- CALENDAR SYNC (.ICS) ---
  const scheduleWorkout = (routine) => {
    const today = new Date();
    // Schedule for 5PM today as a default block
    today.setHours(17, 0, 0); 
    const startIso = today.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    today.setHours(18, 0, 0);
    const endIso = today.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const manifest = routine.movements.join('\\n- ');
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${startIso}\nDTEND:${endIso}\nSUMMARY:Workout: ${routine.title}\nDESCRIPTION:Category: ${routine.type}\\n\\nProtocol:\\n- ${manifest}\\n\\nNotes: ${routine.desc}\nEND:VEVENT\nEND:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Workout_${routine.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  // --- MASSIVE ROUTINE DATABASE ---
  const routines = [
    { 
      title: "Heavy Steel Conditioning", type: "Functional / Core", color: "#ef4444", 
      desc: "Full-body functional kinetic linkage utilizing a 5-foot steel crowbar. Brutal core stabilization.",
      movements: ["Overhead Squats (Bar Locked): 4x10", "Rotational Core Swings: 4x15/side", "Static Front Holds: 3x45s", "Lunging Strikes: 3x12/leg"]
    },
    {
      title: "Second Shift Primer", type: "Mobility", color: "#10b981",
      desc: "Pre-shift mobility flow to open hips, decompress the spine, and prep the nervous system for an evening clock-in or heavy manual labor.",
      movements: ["Deep Squat Prys: 2 mins", "Thoracic Rotations: 10/side", "Dead-hang (Spinal Decompression): 60s", "Dynamic Calf Stretches: 15/leg"]
    },
    {
      title: "5x5 Heavy Barbell (Workout A)", type: "Strength", color: "#3b82f6",
      desc: "Classic linear progression strength protocol. Rest 90-180 seconds between sets.",
      movements: ["Barbell Back Squat: 5x5", "Barbell Bench Press: 5x5", "Barbell Pendlay Row: 5x5"]
    },
    {
      title: "5x5 Heavy Barbell (Workout B)", type: "Strength", color: "#3b82f6",
      desc: "Alternating day for linear progression.",
      movements: ["Barbell Back Squat: 5x5", "Strict Overhead Press: 5x5", "Conventional Deadlift: 1x5 (Heavy)"]
    },
    {
      title: "Lower Back / Sciatica Rehab", type: "Rehab / Stretch", color: "#a855f7",
      desc: "Gentle decompression and nerve flossing. Never push into sharp pain.",
      movements: ["Cat-Cow Flow: 2x15", "Bird-Dog Extensions: 3x10/side", "Supine Piriformis Stretch: 2x60s", "McGill Curl-ups: 3x10"]
    },
    {
      title: "Tactical Box Breathing", type: "Recovery", color: "#8b5cf6",
      desc: "Autonomic nervous system reset. Use to lower cortisol and steady heart rate instantly.",
      movements: ["Inhale: 4 Seconds", "Hold: 4 Seconds", "Exhale: 4 Seconds", "Hold Empty: 4 Seconds", "Repeat for 5 Minutes"]
    }
  ];

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const inputStyle = { background: '#000', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' };
  const btnStyle = (bg, color) => ({ background: bg, color: color, border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', width: '100%', cursor: 'pointer' });
  const labelStyle = { color: '#00ffff', fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '5px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/')} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#ef4444', fontSize: '1.2rem' }}>Fitness & Health</h2>
      </header>

      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Metrics', 'Strength', 'Timers', 'Routines'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === tab ? '#10b981' : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>{tab}</button>
        ))}
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '80px' }}>
        
        {activeTab === 'Metrics' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#3b82f6' }}>💧 Hydration Tracker</h3>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#fff' }}>{waterOz}</span><span style={{ fontSize: '1.2rem', color: '#3b82f6', marginLeft: '5px' }}>oz</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <button onClick={() => addWater(8)} style={{...btnStyle('#222', '#3b82f6'), border: '1px solid #3b82f6'}}>+ 8 oz</button>
                <button onClick={() => addWater(16)} style={{...btnStyle('#3b82f6', '#000')}}>+ 16 oz</button>
                <button onClick={() => addWater(32)} style={{...btnStyle('#222', '#3b82f6'), border: '1px solid #3b82f6'}}>+ 32 oz</button>
              </div>
              <button onClick={resetWater} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '0.85rem' }}>Reset Day</button>
            </div>

            <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#f59e0b' }}>📏 Body Composition</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <div><label style={{...labelStyle, color: '#00ffff'}}>Wt (lbs)</label><input type="number" value={bw} onChange={e=>setBw(e.target.value)} style={inputStyle} /></div>
                <div><label style={{...labelStyle, color: '#3b82f6'}}>Ht (in)</label><input type="number" value={bh} onChange={e=>setBh(e.target.value)} style={inputStyle} /></div>
                <div><label style={{...labelStyle, color: '#f59e0b'}}>Age</label><input type="number" value={ba} onChange={e=>setBa(e.target.value)} style={inputStyle} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px', padding: '15px', background: '#000', borderRadius: '8px', border: '1px solid #222' }}>
                <div style={{ color: '#aaa' }}>BMI:<strong style={{ color: '#f59e0b', display: 'block', fontSize: '1.2rem' }}>{bmi.toFixed(1)}</strong></div>
                <div style={{ color: '#aaa' }}>BMR:<strong style={{ color: '#00ffff', display: 'block', fontSize: '1.2rem' }}>{bmr.toFixed(0)} <span style={{fontSize:'0.8rem', color:'#666'}}>kcal</span></strong></div>
              </div>
              
              <h4 style={{ color: '#aaa', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '0.85rem' }}>Tape Measurements (inches)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <input type="number" placeholder="Neck" value={meas.neck} onChange={e=>updateMeas('neck', e.target.value)} style={inputStyle} />
                <input type="number" placeholder="Chest" value={meas.chest} onChange={e=>updateMeas('chest', e.target.value)} style={inputStyle} />
                <input type="number" placeholder="Waist" value={meas.waist} onChange={e=>updateMeas('waist', e.target.value)} style={inputStyle} />
                <input type="number" placeholder="Bicep" value={meas.bicep} onChange={e=>updateMeas('bicep', e.target.value)} style={inputStyle} />
                <input type="number" placeholder="Thigh" value={meas.thigh} onChange={e=>updateMeas('thigh', e.target.value)} style={{...inputStyle, gridColumn: 'span 2'}} />
              </div>
              <button onClick={logWeight} style={btnStyle('#10b981', '#000')}>💾 Save Snapshot</button>
            </div>
          </>
        )}

        {activeTab === 'Strength' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#ef4444' }}>🏋️ 1-Rep Max (1RM)</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#00ffff'}}>Weight Lifted</label><input type="number" value={liftWt} onChange={e=>setLiftWt(e.target.value)} style={inputStyle} /></div>
              <div style={{ flex: 1 }}><label style={{...labelStyle, color: '#ef4444'}}>Reps</label><input type="number" value={liftReps} onChange={e=>setLiftReps(e.target.value)} style={inputStyle} /></div>
            </div>
            <div style={{ background: '#000', padding: '20px', borderRadius: '12px', border: '1px solid #222' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #333' }}>
                <strong style={{ color: '#fff', fontSize: '1.4rem' }}>1-Rep Max:</strong>
                <strong style={{ color: '#ef4444', fontSize: '2rem' }}>{oneRM.toFixed(0)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px' }}><span style={{fontSize: '1.1rem'}}>90% (Heavy Double):</span><strong style={{ color: '#3b82f6', fontSize: '1.2rem' }}>{(oneRM*0.9).toFixed(0)}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}><span style={{fontSize: '1.1rem'}}>80% (5x5 Working):</span><strong style={{ color: '#10b981', fontSize: '1.2rem' }}>{(oneRM*0.8).toFixed(0)}</strong></div>
            </div>
          </div>
        )}

        {activeTab === 'Timers' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #a855f7', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#a855f7' }}>⏱️ Interval Engine</h3>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px' }}>{timerLabel}</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', width: '200px', height: '200px', margin: '0 auto 25px auto', borderRadius: '50%', border: timerActive ? '4px solid #10b981' : '4px solid #333' }}>
              <span style={{ fontSize: '4rem', fontWeight: 'bold', color: timerActive ? '#fff' : '#555', fontVariantNumeric: 'tabular-nums' }}>{formatTime(timeLeft)}</span>
            </div>

            {timerActive ? (
              <button onClick={stopTimer} style={btnStyle('#ef4444', '#fff')}>⏹ STOP TIMER</button>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button onClick={() => startTimer(45, 'Hypertrophy Rest')} style={{...btnStyle('#222', '#fff'), border: '1px solid #444'}}>45s Rest</button>
                <button onClick={() => startTimer(90, 'Strength Rest')} style={{...btnStyle('#222', '#fff'), border: '1px solid #444'}}>90s Rest</button>
                <button onClick={() => startTimer(180, 'Deep Stretch Hold')} style={{...btnStyle('#222', '#3b82f6'), border: '1px solid #3b82f6'}}>3m Stretch</button>
                <button onClick={() => startTimer(900, 'Shift Break')} style={{...btnStyle('#222', '#f59e0b'), border: '1px solid #f59e0b'}}>15m Break</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Routines' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {routines.map((rt, idx) => (
              <div key={idx} style={{ ...cardStyle, borderLeft: `4px solid ${rt.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', flex: 1 }}>{rt.title}</h3>
                  <span style={{ background: '#000', color: rt.color, padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', border: `1px solid ${rt.color}` }}>{rt.type}</span>
                </div>
                <p style={{ color: '#aaa', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '15px' }}>{rt.desc}</p>
                <ul style={{ color: '#ccc', paddingLeft: '20px', margin: 0, fontSize: '0.9rem', lineHeight: '1.6', background: '#000', padding: '15px 15px 15px 30px', borderRadius: '8px', border: '1px solid #222' }}>
                  {rt.movements.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
                <button onClick={() => scheduleWorkout(rt)} style={{ ...btnStyle('transparent', rt.color), border: `1px solid ${rt.color}`, marginTop: '15px' }}>
                  📅 Schedule to Calendar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
