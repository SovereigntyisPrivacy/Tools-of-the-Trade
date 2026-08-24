import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChronosHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Stopwatch');

  // --- STOPWATCH LOGIC ---
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const logToBurner = () => {
     const existing = localStorage.getItem('fleet_burner_text') || '';
     const newLog = `\n[JOB TIMER] Logged ${formatTime(time)} at ${new Date().toLocaleTimeString()}`;
     localStorage.setItem('fleet_burner_text', (existing + newLog).trim());
     localStorage.setItem('fleet_burner_time', Date.now().toString());
     alert('Logged to Burner Pad!');
     setTime(0); setIsRunning(false);
  };

  // --- BREAK COUNTDOWN LOGIC ---
  const [breakTime, setBreakTime] = useState(0);
  const [isBreakRunning, setIsBreakRunning] = useState(false);
  const breakRef = useRef(null);

  useEffect(() => {
    if (isBreakRunning && breakTime > 0) {
      breakRef.current = setInterval(() => setBreakTime(t => t - 1), 1000);
    } else if (breakTime === 0 && isBreakRunning) {
      setIsBreakRunning(false);
      alert('Break time is over! Clock back in.');
    } else {
      clearInterval(breakRef.current);
    }
    return () => clearInterval(breakRef.current);
  }, [isBreakRunning, breakTime]);

  const startBreak = (minutes) => {
      setBreakTime(minutes * 60);
      setIsBreakRunning(true);
  };

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Chronos Hub</h2>
      </header>

      <div style={{ display: 'flex', background: '#111', padding: '10px', gap: '6px' }}>
        <button onClick={() => setActiveTab('Stopwatch')} style={{ flex: 1, padding: '8px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === 'Stopwatch' ? '#3b82f6' : '#222', color: activeTab === 'Stopwatch' ? '#fff' : '#aaa' }}>Job Stopwatch</button>
        <button onClick={() => setActiveTab('Break')} style={{ flex: 1, padding: '8px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === 'Break' ? '#f59e0b' : '#222', color: activeTab === 'Break' ? '#fff' : '#aaa' }}>Break Timer</button>
      </div>

      <div style={{ padding: '15px', flex: 1 }}>
        {activeTab === 'Stopwatch' && (
          <div style={{...cardStyle, textAlign: 'center', padding: '30px 15px', borderTop: '4px solid #3b82f6'}}>
             <div style={{ color: '#888', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '10px' }}>Active Billable Time</div>
             <div style={{ fontSize: '4em', color: isRunning ? '#00cc66' : '#fff', fontWeight: 'bold', fontFamily: 'monospace', textShadow: isRunning ? '0 0 10px rgba(0,204,102,0.5)' : 'none', marginBottom: '30px' }}>
                {formatTime(time)}
             </div>
             <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setIsRunning(!isRunning)} style={{ flex: 2, padding: '15px', fontSize: '1.2em', fontWeight: 'bold', borderRadius: '8px', border: 'none', background: isRunning ? '#ef4444' : '#00cc66', color: '#000' }}>
                   {isRunning ? 'STOP' : 'START'}
                </button>
                <button onClick={() => { setTime(0); setIsRunning(false); }} style={{ flex: 1, padding: '15px', background: '#222', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Reset</button>
             </div>
             {time > 0 && !isRunning && (
                 <button onClick={logToBurner} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px dashed #3b82f6', color: '#3b82f6', borderRadius: '8px', marginTop: '15px', fontWeight: 'bold' }}>
                    Push to Burner Pad
                 </button>
             )}
          </div>
        )}

        {activeTab === 'Break' && (
          <div style={{...cardStyle, textAlign: 'center', padding: '30px 15px', borderTop: '4px solid #f59e0b'}}>
             <div style={{ color: '#888', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '10px' }}>Rest / Compliance Countdown</div>
             <div style={{ fontSize: '4em', color: isBreakRunning ? '#f59e0b' : '#fff', fontWeight: 'bold', fontFamily: 'monospace', textShadow: isBreakRunning ? '0 0 10px rgba(245,158,11,0.5)' : 'none', marginBottom: '30px' }}>
                {formatTime(breakTime)}
             </div>
             
             {!isBreakRunning && breakTime === 0 ? (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                     <button onClick={() => startBreak(15)} style={{ padding: '12px', background: '#222', color: '#fff', border: '1px solid #333', borderRadius: '8px', fontWeight: 'bold' }}>15 Min (Quick Rest)</button>
                     <button onClick={() => startBreak(30)} style={{ padding: '12px', background: '#222', color: '#fff', border: '1px solid #333', borderRadius: '8px', fontWeight: 'bold' }}>30 Min (Lunch Break)</button>
                     <button onClick={() => startBreak(60)} style={{ padding: '12px', background: '#222', color: '#fff', border: '1px solid #333', borderRadius: '8px', fontWeight: 'bold' }}>60 Min (Full Hour)</button>
                 </div>
             ) : (
                 <div style={{ display: 'flex', gap: '10px' }}>
                     <button onClick={() => setIsBreakRunning(!isBreakRunning)} style={{ flex: 2, padding: '15px', fontSize: '1.2em', fontWeight: 'bold', borderRadius: '8px', border: 'none', background: isBreakRunning ? '#222' : '#00cc66', color: isBreakRunning ? '#fff' : '#000' }}>
                        {isBreakRunning ? 'PAUSE' : 'RESUME'}
                     </button>
                     <button onClick={() => { setBreakTime(0); setIsBreakRunning(false); }} style={{ flex: 1, padding: '15px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Cancel</button>
                 </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
