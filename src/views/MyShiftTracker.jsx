import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyShiftTracker() {
  const navigate = useNavigate();

  const [myRate, setMyRate] = useState(() => localStorage.getItem('my_hourly_rate') || '15.00');
  const [myShifts, setMyShifts] = useState(() => {
    const saved = localStorage.getItem('my_personal_shifts');
    return saved ? JSON.parse(saved) : { Mon: {in:'', out:''}, Tue: {in:'', out:''}, Wed: {in:'', out:''}, Thu: {in:'', out:''}, Fri: {in:'', out:''}, Sat: {in:'', out:''}, Sun: {in:'', out:''} };
  });

  useEffect(() => { localStorage.setItem('my_hourly_rate', myRate); }, [myRate]);
  useEffect(() => { localStorage.setItem('my_personal_shifts', JSON.stringify(myShifts)); }, [myShifts]);

  const calcHrs = (inTime, outTime) => {
    if (!inTime || !outTime) return 0;
    const [h1, m1] = inTime.split(':').map(Number);
    const [h2, m2] = outTime.split(':').map(Number);
    let mins1 = h1 * 60 + m1; let mins2 = h2 * 60 + m2;
    if (mins2 < mins1) mins2 += 24 * 60; 
    return (mins2 - mins1) / 60;
  };

  let totalHrs = 0;
  Object.values(myShifts).forEach(s => totalHrs += calcHrs(s.in, s.out));
  
  const rate = parseFloat(myRate) || 0;
  const regHrs = Math.min(totalHrs, 40);
  const otHrs = Math.max(0, totalHrs - 40);
  const grossPay = (regHrs * rate) + (otHrs * rate * 1.5);
  
  // Hard Tax Itemization
  const socSec = grossPay * 0.062; // FICA 6.2%
  const medicare = grossPay * 0.0145; // Medicare 1.45%
  const fedTax = grossPay * 0.10; // Est. Federal 10%
  const stateTax = grossPay * 0.025; // Est. State 2.5%
  const estNetPay = grossPay - (socSec + medicare + fedTax + stateTax);

  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', textAlign: 'center' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>My Schedule</h2>
      </header>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#aaa', fontSize: '0.8em', textTransform: 'uppercase' }}>My Hourly Rate</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{color: '#00cc66', fontSize: '1.2em'}}>$</span>
                <input type="number" value={myRate} onChange={e=>setMyRate(e.target.value)} style={{ background: 'transparent', border: 'none', color: '#00cc66', fontSize: '1.5em', fontWeight: 'bold', width: '80px', padding: 0 }} />
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#aaa', fontSize: '0.8em', textTransform: 'uppercase' }}>Total Hours</div>
            <strong style={{ color: totalHrs > 40 ? '#f59e0b' : '#3b82f6', fontSize: '1.5em' }}>{totalHrs.toFixed(1)}</strong>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
             <h3 style={{ margin: 0, color: '#fff' }}>This Week's Shifts</h3>
          </div>
          
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
            const s = myShifts[day]; const hrs = calcHrs(s.in, s.out);
            return (
              <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '35px', color: '#aaa', fontWeight: 'bold', fontSize: '0.85em', textTransform: 'uppercase' }}>{day}</div>
                <input type="time" value={s.in} onChange={e => setMyShifts({...myShifts, [day]: {...s, in: e.target.value}})} style={{ ...inputStyle, color: '#00ffff' }} />
                <span style={{ color: '#555' }}>to</span>
                <input type="time" value={s.out} onChange={e => setMyShifts({...myShifts, [day]: {...s, out: e.target.value}})} style={{ ...inputStyle, color: '#f59e0b' }} />
                <div style={{ width: '45px', textAlign: 'right', color: hrs > 0 ? '#00cc66' : '#555', fontWeight: 'bold' }}>{hrs > 0 ? hrs.toFixed(1) : '-'}</div>
              </div>
            )
          })}
          <button onClick={() => setMyShifts({ Mon: {in:'', out:''}, Tue: {in:'', out:''}, Wed: {in:'', out:''}, Thu: {in:'', out:''}, Fri: {in:'', out:''}, Sat: {in:'', out:''}, Sun: {in:'', out:''} })} style={{ width: '100%', padding: '10px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', marginTop: '10px' }}>Clear Week</button>
        </div>

        <div style={{ ...cardStyle, background: '#000' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#a855f7', textAlign: 'center', textTransform: 'uppercase' }}>Paycheck Estimator</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '10px' }}>
                <span style={{ color: '#888' }}>Regular Pay ({regHrs.toFixed(1)}h)</span>
                <span style={{ color: '#fff' }}>${(regHrs * rate).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>
                <span style={{ color: '#888' }}>Overtime Pay ({otHrs.toFixed(1)}h)</span>
                <span style={{ color: '#f59e0b' }}>${(otHrs * rate * 1.5).toFixed(2)}</span>
            </div>

            <div style={{ color: '#aaa', fontSize: '0.85em', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 'bold' }}>Standard Deductions</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9em' }}>
                <span style={{ color: '#ef4444' }}>Social Security (FICA 6.2%)</span><span style={{ color: '#ef4444' }}>-${socSec.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9em' }}>
                <span style={{ color: '#ef4444' }}>Medicare (1.45%)</span><span style={{ color: '#ef4444' }}>-${medicare.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9em' }}>
                <span style={{ color: '#ef4444' }}>Federal Tax (Est. 10%)</span><span style={{ color: '#ef4444' }}>-${fedTax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px dashed #333', marginBottom: '15px', fontSize: '0.9em' }}>
                <span style={{ color: '#ef4444' }}>State Tax (Est. 2.5%)</span><span style={{ color: '#ef4444' }}>-${stateTax.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#fff' }}>Est. Net Pay</strong>
                <strong style={{ color: '#00cc66', fontSize: '1.5em' }}>${estNetPay.toFixed(2)}</strong>
            </div>
        </div>
      </div>
    </div>
  );
}
