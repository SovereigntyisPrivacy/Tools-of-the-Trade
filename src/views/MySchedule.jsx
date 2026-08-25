import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MySchedule() {
  const navigate = useNavigate();

  const [rate, setRate] = useState(() => parseFloat(localStorage.getItem('fleet_hourly_rate')) || 15.00);
  const [taxProfile, setTaxProfile] = useState(() => localStorage.getItem('fleet_tax_profile') || 'W2_AZ');

  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  
  const [shifts, setShifts] = useState(() => {
    const saved = localStorage.getItem('fleet_shifts_v2');
    if (saved) return JSON.parse(saved);
    return days.reduce((acc, day) => ({ ...acc, [day]: [{ id: Date.now() + Math.random(), start: '', end: '' }] }), {});
  });

  useEffect(() => { localStorage.setItem('fleet_hourly_rate', rate.toString()); }, [rate]);
  useEffect(() => { localStorage.setItem('fleet_tax_profile', taxProfile); }, [taxProfile]);
  useEffect(() => { localStorage.setItem('fleet_shifts_v2', JSON.stringify(shifts)); }, [shifts]);

  const updateShift = (day, id, field, value) => {
    setShifts({ ...shifts, [day]: shifts[day].map(s => s.id === id ? { ...s, [field]: value } : s) });
  };

  const addShift = (day) => {
    setShifts({ ...shifts, [day]: [...shifts[day], { id: Date.now() + Math.random(), start: '', end: '' }] });
  };

  const removeShift = (day, id) => {
    setShifts({ ...shifts, [day]: shifts[day].filter(s => s.id !== id) });
  };

  const clearWeek = () => {
    setShifts(days.reduce((acc, day) => ({ ...acc, [day]: [{ id: Date.now() + Math.random(), start: '', end: '' }] }), {}));
  };

  const calculateHours = (start, end) => {
    if (!start || !end) return 0;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let diff = (eh + em/60) - (sh + sm/60);
    if (diff < 0) diff += 24; 
    return diff;
  };

  let totalHours = 0;
  days.forEach(day => {
    shifts[day].forEach(shift => {
      totalHours += calculateHours(shift.start, shift.end);
    });
  });

  const regHours = Math.min(totalHours, 40);
  const otHours = Math.max(totalHours - 40, 0);
  const regPay = regHours * rate;
  const otPay = otHours * rate * 1.5;
  const grossPay = regPay + otPay;

  const isW2 = taxProfile.startsWith('W2');
  const fica = isW2 ? grossPay * 0.062 : 0;
  const med = isW2 ? grossPay * 0.0145 : 0;
  const fed = isW2 ? grossPay * (taxProfile === 'W2_HIGH' ? 0.22 : 0.10) : 0;
  const state = isW2 ? grossPay * 0.025 : 0; 
  const netPay = grossPay - fica - med - fed - state;

  const cardStyle = { background: 'rgba(17, 17, 17, 0.85)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const inputStyle = { background: 'rgba(0,0,0,0.6)', border: '1px solid #444', color: '#fff', padding: '8px', borderRadius: '6px', outline: 'none' };
  const dedStyle = { display: 'flex', justifyContent: 'space-between', color: isW2 ? '#ef4444' : '#555', marginBottom: '6px', fontSize: '0.9em' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(10px)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: 'var(--text-accent, #00cc66)' }}>My Schedule</h2>
      </header>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', borderTop: '4px solid var(--accent, #3b82f6)' }}>
            <div style={{ color: '#aaa', fontSize: '0.8em', textTransform: 'uppercase', fontWeight: 'bold' }}>My Hourly Rate
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                    <span style={{ color: '#00cc66', fontWeight: 'bold', marginRight: '5px', fontSize: '1.2em' }}>$</span>
                    <input type="number" value={rate || ''} onChange={e => setRate(parseFloat(e.target.value) || 0)} style={{ ...inputStyle, width: '80px', fontSize: '1.2em', fontWeight: 'bold', padding: '4px 8px' }} />
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#aaa', fontSize: '0.8em', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Hours</div>
                <div style={{ color: 'var(--accent, #3b82f6)', fontSize: '1.8em', fontWeight: 'bold' }}>{totalHours.toFixed(1)}</div>
            </div>
        </div>

        <div style={{ ...cardStyle }}>
            <h3 style={{ color: 'var(--text-accent, #00cc66)', margin: '0 0 15px 0' }}>This Week's Shifts</h3>
            
            {days.map(day => {
                const dayTotal = shifts[day].reduce((sum, s) => sum + calculateHours(s.start, s.end), 0);
                return (
                    <div key={day} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                        {shifts[day].map((shift, i) => (
                            <div key={shift.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 'bold', width: '40px', color: i === 0 ? '#fff' : 'transparent' }}>
                                    {i === 0 ? day : ''}
                                </span>
                                <input type="time" value={shift.start} onChange={e => updateShift(day, shift.id, 'start', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                                <span style={{ margin: '0 10px', color: '#888' }}>to</span>
                                <input type="time" value={shift.end} onChange={e => updateShift(day, shift.id, 'end', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                                
                                <span style={{ width: '45px', textAlign: 'right', fontFamily: 'monospace' }}>
                                    {i === 0 ? (
                                        <span onClick={() => addShift(day)} style={{ color: dayTotal > 0 ? '#00cc66' : '#555', cursor: 'pointer', fontSize: '1.1em', fontWeight: 'bold' }}>
                                            {dayTotal > 0 ? dayTotal.toFixed(1) : '+'}
                                        </span>
                                    ) : (
                                        <span onClick={() => removeShift(day, shift.id)} style={{ color: '#ef4444', cursor: 'pointer', fontSize: '1.5em', lineHeight: '0' }}>×</span>
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                );
            })}
            
            <button onClick={clearWeek} style={{ width: '100%', padding: '12px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>Clear Week</button>
        </div>

        <div style={{ ...cardStyle }}>
            <h3 style={{ color: 'var(--text-accent, #00cc66)', margin: '0 0 15px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Paycheck Estimator</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', color: '#ccc' }}>
                <span>Regular Pay ({regHours.toFixed(1)}h)</span>
                <span>${regPay.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#ccc' }}>
                <span>Overtime Pay ({otHours.toFixed(1)}h)</span>
                <span style={{ color: otHours > 0 ? '#f59e0b' : '#ccc' }}>${otPay.toFixed(2)}</span>
            </div>

            <div style={{ padding: '10px 0', borderTop: '1px solid #333', borderBottom: '1px solid #333', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#aaa', fontSize: '0.8em', textTransform: 'uppercase', fontWeight: 'bold' }}>Tax Profile</span>
                <select value={taxProfile} onChange={e => setTaxProfile(e.target.value)} style={{ background: '#222', color: 'var(--text-accent, #00cc66)', border: '1px solid #444', padding: '6px 10px', borderRadius: '6px', outline: 'none', fontSize: '0.9em', fontWeight: 'bold' }}>
                    <option value="W2_AZ">W2 - AZ Standard</option>
                    <option value="W2_HIGH">W2 - High Fed Bracket</option>
                    <option value="1099">1099 / Independent</option>
                    <option value="CASH">Cash / None</option>
                </select>
            </div>

            <div style={{ color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.85em', marginBottom: '10px' }}>Standard Deductions</div>
            
            <div style={dedStyle}><span>Social Security (FICA 6.2%)</span><span>-${fica.toFixed(2)}</span></div>
            <div style={dedStyle}><span>Medicare (1.45%)</span><span>-${med.toFixed(2)}</span></div>
            <div style={dedStyle}><span>Federal Tax (Est. {taxProfile === 'W2_HIGH' ? '22%' : '10%'})</span><span>-${fed.toFixed(2)}</span></div>
            <div style={dedStyle}><span>State Tax (AZ 2.5%)</span><span>-${state.toFixed(2)}</span></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #444', marginTop: '15px', paddingTop: '15px', fontWeight: 'bold', fontSize: '1.2em' }}>
                <span style={{ color: '#fff' }}>Est. Net Pay</span>
                <span style={{ color: '#00cc66' }}>${netPay.toFixed(2)}</span>
            </div>
        </div>

      </div>
    </div>
  );
}
