import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FitnessHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Fitness');

  // --- HEALTH STATE ---
  const [bw, setBw] = useState(() => localStorage.getItem('tot_bw') || '185');
  const [bh, setBh] = useState(() => localStorage.getItem('tot_bh') || '71');
  const [ba, setBa] = useState(() => localStorage.getItem('tot_ba') || '30');
  const [weightLogs, setWeightLogs] = useState(() => JSON.parse(localStorage.getItem('tot_weight_logs')) || []);

  useEffect(() => {
    localStorage.setItem('tot_bw', bw); localStorage.setItem('tot_bh', bh); localStorage.setItem('tot_ba', ba);
    localStorage.setItem('tot_weight_logs', JSON.stringify(weightLogs));
  }, [bw, bh, ba, weightLogs]);

  const bmi = ((parseFloat(bw)||0) / Math.pow(parseFloat(bh)||1, 2)) * 703;
  // Mifflin-St Jeor Equation
  const bmr = 10 * ((parseFloat(bw)||0) * 0.453592) + 6.25 * ((parseFloat(bh)||0) * 2.54) - 5 * (parseFloat(ba)||30) + 5;

  const logWeight = () => setWeightLogs([{ date: new Date().toLocaleDateString(), wt: bw }, ...weightLogs]);

  // --- FITNESS STATE ---
  const [liftWt, setLiftWt] = useState('225');
  const [liftReps, setLiftReps] = useState('5');
  const oneRM = (parseFloat(liftWt)||0) * (1 + ((parseFloat(liftReps)||0) / 30));

  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate('/')} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#10b981', fontSize: '1.2rem' }}>Fitness & Health</h2>
      </header>

      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '6px' }}>
        {['Fitness', 'Health'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === tab ? '#10b981' : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>{tab}</button>
        ))}
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1 }}>
        {activeTab === 'Fitness' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🏋️ Kinetic Strength (1RM)</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}><label style={{ color: '#00ffff', fontSize: '0.8rem', fontWeight: 'bold' }}>Weight Lifted</label><input type="number" value={liftWt} onChange={e=>setLiftWt(e.target.value)} style={inputStyle} /></div>
              <div style={{ flex: 1 }}><label style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold' }}>Reps</label><input type="number" value={liftReps} onChange={e=>setLiftReps(e.target.value)} style={inputStyle} /></div>
            </div>
            <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222', marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #333' }}>
                <strong style={{ color: '#fff', fontSize: '1.2rem' }}>1-Rep Max:</strong>
                <strong style={{ color: '#ef4444', fontSize: '1.5rem' }}>{oneRM.toFixed(0)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px' }}><span>90% (Heavy Double):</span><span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{(oneRM*0.9).toFixed(0)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}><span>80% (5x5 Working):</span><span style={{ color: '#00cc66', fontWeight: 'bold' }}>{(oneRM*0.8).toFixed(0)}</span></div>
            </div>
          </div>
        )}

        {activeTab === 'Health' && (
          <>
            <div style={{ ...cardStyle, borderTop: '4px solid #00cc66' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🔥 BMI & BMR</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label style={{ color: '#00ffff', fontSize: '0.8rem', fontWeight: 'bold' }}>Weight (lbs)</label><input type="number" value={bw} onChange={e=>setBw(e.target.value)} style={inputStyle} /></div>
                <div style={{ flex: 1 }}><label style={{ color: '#3b82f6', fontSize: '0.8rem', fontWeight: 'bold' }}>Height (in)</label><input type="number" value={bh} onChange={e=>setBh(e.target.value)} style={inputStyle} /></div>
                <div style={{ flex: 1 }}><label style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold' }}>Age</label><input type="number" value={ba} onChange={e=>setBa(e.target.value)} style={inputStyle} /></div>
              </div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px dashed #333' }}><span>BMI Score:</span><strong style={{ color: '#f59e0b', fontSize: '1.2rem' }}>{bmi.toFixed(1)}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}><span>Resting BMR:</span><strong style={{ color: '#00ffff', fontSize: '1.2rem' }}>{bmr.toFixed(0)} <span style={{fontSize:'0.8rem', color:'#aaa'}}>kcal</span></strong></div>
              </div>
              <button onClick={logWeight} style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>💾 Log Weight</button>
            </div>
            
            <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>📈 Weight History</h3>
              {weightLogs.length === 0 ? <p style={{color:'#888', fontStyle:'italic'}}>No weight logs yet.</p> : weightLogs.slice(0,10).map((log, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #222', color: '#ccc' }}>
                  <span>{log.date}</span><strong style={{color:'#10b981'}}>{log.wt} lbs</strong>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
