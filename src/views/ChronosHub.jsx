import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChronosHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Timer');

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

  // --- WORLD CLOCK LOGIC ---
  const [clocks, setClocks] = useState(() => {
      const saved = localStorage.getItem('fleet_world_clocks');
      return saved ? JSON.parse(saved) : [
          { id: '1', name: 'Local Dispatch', tz: 'America/Phoenix' },
          { id: '2', name: 'East Coast HQ', tz: 'America/New_York' },
          { id: '3', name: 'UTC / Zulu', tz: 'UTC' }
      ];
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
     const int = setInterval(() => setCurrentTime(new Date()), 1000);
     return () => clearInterval(int);
  }, []);

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Chronos Hub</h2>
      </header>

      <div style={{ display: 'flex', background: '#111', padding: '10px', gap: '6px' }}>
        <button onClick={() => setActiveTab('Timer')} style={{ flex: 1, padding: '8px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === 'Timer' ? '#3b82f6' : '#222', color: activeTab === 'Timer' ? '#fff' : '#aaa' }}>Job Timer</button>
        <button onClick={() => setActiveTab('World')} style={{ flex: 1, padding: '8px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === 'World' ? '#3b82f6' : '#222', color: activeTab === 'World' ? '#fff' : '#aaa' }}>World Clock</button>
      </div>

      <div style={{ padding: '15px', flex: 1 }}>
        {activeTab === 'Timer' && (
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

        {activeTab === 'World' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {clocks.map(clock => {
                let timeString = 'Invalid TZ';
                try {
                    timeString = currentTime.toLocaleTimeString('en-US', { timeZone: clock.tz, hour12: true, hour: 'numeric', minute: '2px', second: '2-digit' });
                } catch(e) {}
                
                return (
                    <div key={clock.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1em' }}>{clock.name}</div>
                            <div style={{ color: '#555', fontSize: '0.8em', textTransform: 'uppercase' }}>{clock.tz}</div>
                        </div>
                        <div style={{ color: '#00ffff', fontSize: '1.5em', fontWeight: 'bold', fontFamily: 'monospace' }}>
                            {timeString}
                        </div>
                    </div>
                )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
