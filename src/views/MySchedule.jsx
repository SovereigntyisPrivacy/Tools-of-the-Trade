import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const STATE_TAXES = [
  { name: 'Arizona (2.5%)', rate: 2.5 },
  { name: 'California (9.3%)', rate: 9.3 },
  { name: 'Texas (0%)', rate: 0 },
  { name: 'Nevada (0%)', rate: 0 },
  { name: 'Custom Flat (5.0%)', rate: 5.0 }
];

export default function MySchedule() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tracker');
  const [showReport, setShowReport] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // Prevents wiping data before it loads

  // Initialize empty state, we will pull from native hardware instantly
  const [hourlyRate, setHourlyRate] = useState('16.00');
  const [shifts, setShifts] = useState([]);
  const [taxProfile, setTaxProfile] = useState('W2 Employee');
  const [stateTax, setStateTax] = useState('Arizona (2.5%)');
  const [fedTax, setFedTax] = useState('10');
  const [archives, setArchives] = useState([]);

  // --- NATIVE HARDWARE BOOT SEQUENCE ---
  useEffect(() => {
    const initDB = async () => {
      const { value: hr } = await Preferences.get({ key: 'tot_hourly_rate' });
      if (hr) setHourlyRate(hr);
      
      const { value: sh } = await Preferences.get({ key: 'tot_shifts' });
      if (sh) try { setShifts(JSON.parse(sh)); } catch(e){}
      
      const { value: tp } = await Preferences.get({ key: 'tot_tax_profile' });
      if (tp) setTaxProfile(tp);
      
      const { value: st } = await Preferences.get({ key: 'tot_state_tax' });
      if (st) setStateTax(st);
      
      const { value: ft } = await Preferences.get({ key: 'tot_fed_tax' });
      if (ft) setFedTax(ft);
      
      const { value: ar } = await Preferences.get({ key: 'tot_shift_archives' });
      if (ar) try { setArchives(JSON.parse(ar)); } catch(e){}
      
      setIsLoaded(true);
    };
    initDB();
  }, []);

  // --- WRITE TO HARDWARE ON EVERY CHANGE ---
  // The 'isLoaded' check ensures we don't accidentally save blank defaults over your data during boot
  useEffect(() => { if (isLoaded) Preferences.set({ key: 'tot_hourly_rate', value: hourlyRate.toString() }); }, [hourlyRate, isLoaded]);
  useEffect(() => { if (isLoaded) Preferences.set({ key: 'tot_shifts', value: JSON.stringify(shifts) }); }, [shifts, isLoaded]);
  useEffect(() => { if (isLoaded) Preferences.set({ key: 'tot_tax_profile', value: taxProfile }); }, [taxProfile, isLoaded]);
  useEffect(() => { if (isLoaded) Preferences.set({ key: 'tot_state_tax', value: stateTax }); }, [stateTax, isLoaded]);
  useEffect(() => { if (isLoaded) Preferences.set({ key: 'tot_fed_tax', value: fedTax.toString() }); }, [fedTax, isLoaded]);
  useEffect(() => { if (isLoaded) Preferences.set({ key: 'tot_shift_archives', value: JSON.stringify(archives) }); }, [archives, isLoaded]);

  // --- MATH ENGINE ---
  const calculateShiftHours = (inTime, outTime) => {
    if (!inTime || !outTime) return 0;
    const [h1, m1] = inTime.split(':').map(Number);
    const [h2, m2] = outTime.split(':').map(Number);
    let m1Total = h1 * 60 + m1;
    let m2Total = h2 * 60 + m2;
    if (m2Total < m1Total) m2Total += 24 * 60; 
    return (m2Total - m1Total) / 60;
  };

  let totalHours = 0;
  shifts.forEach(s => { totalHours += calculateShiftHours(s.in, s.out); });

  const rate = parseFloat(hourlyRate) || 0;
  const regHours = Math.min(totalHours, 40);
  const otHours = Math.max(0, totalHours - 40);
  
  const regPay = regHours * rate;
  const otPay = otHours * (rate * 1.5);
  const grossPay = regPay + otPay;

  // Deductions
  const isW2 = taxProfile === 'W2 Employee';
  const ssDed = isW2 ? grossPay * 0.062 : 0; 
  const medDed = isW2 ? grossPay * 0.0145 : 0; 
  
  const stateRate = STATE_TAXES.find(t => t.name === stateTax)?.rate || 0;
  const stateDed = grossPay * (stateRate / 100);
  const fedDed = grossPay * (parseFloat(fedTax) / 100 || 0);

  const totalDed = ssDed + medDed + stateDed + fedDed;
  const netPay = grossPay - totalDed;

  // --- HANDLERS ---
  const handleAddShift = (day) => { setShifts([...shifts, { id: Date.now(), day, in: '16:00', out: '22:00' }]); };
  const handleRemoveShift = (id) => { setShifts(shifts.filter(s => s.id !== id)); };
  const handleUpdateShift = (id, field, value) => { setShifts(shifts.map(s => s.id === id ? { ...s, [field]: value } : s)); };
  const handleClearWeek = () => { if (window.confirm('Wipe all shifts for this week?')) setShifts([]); };

  const handleSaveToArchives = () => {
    const report = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      totalHours: totalHours.toFixed(2),
      gross: grossPay.toFixed(2),
      net: netPay.toFixed(2),
      shifts: [...shifts]
    };
    setArchives([report, ...archives]);
    setShowReport(false);
    setShifts([]);
    alert("Timesheet Archived & Week Cleared!");
    setActiveTab('archives');
  };

  // --- STYLES ---
  const glassCard = { background: 'rgba(17,17,17,0.6)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '20px', marginBottom: '15px', border: '1px solid #222' };
  const inputStyle = { background: '#0a0a0a', color: '#fff', border: '1px solid #333', padding: '10px', borderRadius: '6px', fontSize: '1rem' };

  if (!isLoaded) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', color: '#e879f9' }}><h2>Loading Data...</h2></div>;

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.8)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#e879f9', fontSize: '1.2rem' }}>My Schedule</h2>
      </header>

      <div style={{ display: 'flex', padding: '15px', gap: '8px', background: 'rgba(0,0,0,0.5)', overflowX: 'auto' }}>
        <button onClick={() => setActiveTab('tracker')} style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'tracker' ? '#10b981' : '#222', color: activeTab === 'tracker' ? '#000' : '#888' }}>Tracker</button>
        <button onClick={() => setActiveTab('info')} style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'info' ? '#3b82f6' : '#222', color: activeTab === 'info' ? '#fff' : '#888' }}>Guides & Info</button>
        <button onClick={() => setActiveTab('archives')} style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'archives' ? '#f59e0b' : '#222', color: activeTab === 'archives' ? '#000' : '#888' }}>Archives</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        
        {activeTab === 'tracker' && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ ...glassCard, borderTop: '4px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#888', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>MY HOURLY RATE</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>$</span>
                  <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} style={{ ...inputStyle, width: '100px', fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }} />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#888', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>TOTAL HOURS</span>
                <h2 style={{ color: '#10b981', margin: '5px 0 0 0' }}>{totalHours.toFixed(1)}</h2>
              </div>
            </div>

            <div style={{ ...glassCard, padding: '10px 20px' }}>
              <h3 style={{ color: '#e879f9', textAlign: 'center', marginBottom: '20px' }}>This Week's Shifts</h3>
              
              {DAYS.map(day => {
                const dayShifts = shifts.filter(s => s.day === day);
                return (
                  <div key={day} style={{ borderBottom: '1px dashed #333', paddingBottom: '15px', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ color: '#fff', fontWeight: 'bold' }}>{day}</span>
                      <button onClick={() => handleAddShift(day)} style={{ background: 'transparent', color: '#10b981', border: '1px solid #10b981', borderRadius: '4px', padding: '4px 10px', fontSize: '0.8rem', fontWeight: 'bold' }}>+ ADD SHIFT</button>
                    </div>
                    {dayShifts.map(shift => (
                      <div key={shift.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <input type="time" value={shift.in} onChange={(e) => handleUpdateShift(shift.id, 'in', e.target.value)} style={{ ...inputStyle, flex: 1, padding: '8px' }} />
                        <span style={{ color: '#888' }}>to</span>
                        <input type="time" value={shift.out} onChange={(e) => handleUpdateShift(shift.id, 'out', e.target.value)} style={{ ...inputStyle, flex: 1, padding: '8px' }} />
                        <button onClick={() => handleRemoveShift(shift.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>×</button>
                      </div>
                    ))}
                  </div>
                );
              })}
              <button onClick={handleClearWeek} style={{ width: '100%', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>CLEAR WEEK</button>
            </div>

            <div style={{ ...glassCard, borderLeft: '4px solid #10b981' }}>
              <h3 style={{ color: '#e879f9', textAlign: 'center', marginTop: 0 }}>PAYCHECK ESTIMATOR</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#ccc' }}>Regular Pay ({regHours.toFixed(1)}h)</span>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>${regPay.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ color: '#ccc' }}>Overtime Pay ({otHours.toFixed(1)}h)</span>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>${otPay.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: 'bold' }}>TAX PROFILE</span>
                <select value={taxProfile} onChange={(e) => setTaxProfile(e.target.value)} style={{ ...inputStyle, width: '160px', margin: 0, padding: '8px', color: '#3b82f6' }}>
                  <option value="W2 Employee">W2 Employee</option>
                  <option value="1099 Contractor">1099 Contractor</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: 'bold' }}>STATE TAX</span>
                <select value={stateTax} onChange={(e) => setStateTax(e.target.value)} style={{ ...inputStyle, width: '160px', margin: 0, padding: '8px' }}>
                  {STATE_TAXES.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: 'bold' }}>FED TAX (%)</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="number" value={fedTax} onChange={(e) => setFedTax(e.target.value)} style={{ ...inputStyle, width: '80px', margin: 0, padding: '8px' }} />
                  <span style={{ color: '#888' }}>%</span>
                </div>
              </div>

              <h4 style={{ color: '#fff', textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '10px', margin: '20px 0' }}>ESTIMATED DEDUCTIONS</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ color: '#888' }}>Social Security (FICA)</span><span style={{ color: '#ef4444' }}>-${ssDed.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ color: '#888' }}>Medicare (FICA)</span><span style={{ color: '#ef4444' }}>-${medDed.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ color: '#888' }}>Federal Tax ({fedTax}%)</span><span style={{ color: '#ef4444' }}>-${fedDed.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><span style={{ color: '#888' }}>{stateTax}</span><span style={{ color: '#ef4444' }}>-${stateDed.toFixed(2)}</span></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #333', paddingTop: '15px' }}>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Est. Net Pay</span>
                <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.4rem' }}>${netPay.toFixed(2)}</span>
              </div>
              <button onClick={() => setShowReport(true)} style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', marginTop: '20px' }}>📄 VIEW FULL REPORT</button>
            </div>
          </div>
        )}

        {activeTab === 'archives' && (
          <div style={{ marginTop: '20px' }}>
            {archives.length === 0 && <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No archived timesheets.</p>}
            {archives.map((arc, i) => (
              <div key={arc.id} style={{ ...glassCard, borderLeft: '4px solid #f59e0b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, color: '#f59e0b' }}>Week of {arc.date}</h3>
                  <button onClick={() => setArchives(archives.filter((_, idx) => idx !== i))} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontWeight: 'bold' }}>🗑️</button>
                </div>
                <p style={{ margin: '5px 0', color: '#ccc' }}>Total Hours: <strong>{arc.totalHours}</strong></p>
                <p style={{ margin: '5px 0', color: '#ccc' }}>Gross Pay: <strong style={{ color: '#fff' }}>${arc.gross}</strong></p>
                <p style={{ margin: '5px 0', color: '#ccc' }}>Net Take Home: <strong style={{ color: '#10b981' }}>${arc.net}</strong></p>
              </div>
            ))}
          </div>
        )}

        {showReport && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#000', zIndex: 9999, overflowY: 'auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
              <h2 style={{ color: '#e879f9', margin: 0, textTransform: 'uppercase' }}>Timesheet Report</h2>
              <button onClick={() => setShowReport(false)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
            </div>

            <div style={{ ...glassCard }}>
              <h3 style={{ color: '#e879f9', textAlign: 'center', marginTop: 0, borderBottom: '1px dashed #333', paddingBottom: '10px' }}>Daily Breakdown</h3>
              {shifts.length === 0 && <p style={{ color: '#888', textAlign: 'center' }}>No shifts logged.</p>}
              {shifts.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div><span style={{ color: '#10b981', fontWeight: 'bold', marginRight: '10px' }}>{s.day}</span></div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#fff', fontWeight: 'bold' }}>{calculateShiftHours(s.in, s.out).toFixed(2)}h</span><br/>
                    <span style={{ color: '#888', fontSize: '0.8rem' }}>{s.in} to {s.out}</span>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '10px', marginTop: '10px' }}>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>Total Logged:</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>{totalHours.toFixed(2)} Hours</span>
              </div>
            </div>

            <div style={{ ...glassCard }}>
              <h3 style={{ color: '#e879f9', textAlign: 'center', marginTop: 0, borderBottom: '1px dashed #333', paddingBottom: '10px' }}>Financial Breakdown</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}><span style={{ color: '#ccc' }}>Gross Pay:</span><span style={{ color: '#fff' }}>${grossPay.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}><span style={{ color: '#ef4444' }}>Total Taxes/Deductions:</span><span style={{ color: '#ef4444' }}>-${totalDed.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '15px' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>Take Home:</span><span style={{ color: '#10b981', fontWeight: 'bold' }}>${netPay.toFixed(2)}</span></div>
            </div>

            <button onClick={handleSaveToArchives} style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '40px' }}>💾 SAVE TO ARCHIVES</button>
          </div>
        )}

      </div>
    </div>
  );
}
