import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyShiftTracker() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('calc');
  const [rate, setRate] = useState(() => parseFloat(localStorage.getItem('fleet_hourly_rate')) || 15.00);
  const [taxProfile, setTaxProfile] = useState(() => localStorage.getItem('fleet_tax_profile') || 'W2');
  const [stateTax, setStateTax] = useState(() => localStorage.getItem('fleet_state_tax') || 'AZ');
  const [fedRate, setFedRate] = useState(() => parseFloat(localStorage.getItem('fleet_fed_rate')) || 0);

  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  
  const [shifts, setShifts] = useState(() => {
    const saved = localStorage.getItem('fleet_shifts_v2');
    if (saved) return JSON.parse(saved);
    return days.reduce((acc, day) => ({ ...acc, [day]: [{ id: Date.now() + Math.random(), start: '', end: '' }] }), {});
  });

  const stateTaxRates = {
    'AK': 0.0, 'AL': 4.0, 'AR': 4.4, 'AZ': 2.5, 'CA': 8.0, 'CO': 4.4, 'CT': 5.0,
    'DE': 5.0, 'FL': 0.0, 'GA': 5.5, 'HI': 7.0, 'ID': 5.8, 'IL': 4.95, 'IN': 3.15,
    'IA': 5.7, 'KS': 5.7, 'KY': 4.0, 'LA': 4.0, 'ME': 7.1, 'MD': 5.0, 'MA': 5.0,
    'MI': 4.25, 'MN': 7.0, 'MS': 4.0, 'MO': 4.9, 'MT': 5.9, 'NE': 5.8, 'NV': 0.0,
    'NH': 0.0, 'NJ': 6.0, 'NM': 4.9, 'NY': 6.0, 'NC': 4.5, 'ND': 2.5, 'OH': 3.5,
    'OK': 4.75, 'OR': 8.0, 'PA': 3.07, 'RI': 5.0, 'SC': 6.5, 'SD': 0.0, 'TN': 0.0,
    'TX': 0.0, 'UT': 4.65, 'VT': 6.0, 'VA': 5.75, 'WA': 0.0, 'WV': 4.0, 'WI': 5.0, 'WY': 0.0
  };

  useEffect(() => { localStorage.setItem('fleet_hourly_rate', rate.toString()); }, [rate]);
  useEffect(() => { localStorage.setItem('fleet_tax_profile', taxProfile); }, [taxProfile]);
  useEffect(() => { localStorage.setItem('fleet_state_tax', stateTax); }, [stateTax]);
  useEffect(() => { localStorage.setItem('fleet_fed_rate', fedRate.toString()); }, [fedRate]);
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

  const isW2 = taxProfile === 'W2';
  const fica = isW2 ? grossPay * 0.062 : 0;
  const med = isW2 ? grossPay * 0.0145 : 0;
  const fed = isW2 ? grossPay * (fedRate / 100) : 0;
  const currentStateRate = stateTaxRates[stateTax] || 0;
  const stateDeduction = isW2 ? grossPay * (currentStateRate / 100) : 0; 

  const netPay = grossPay - fica - med - fed - stateDeduction;

  const cardStyle = { background: 'rgba(17, 17, 17, 0.85)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const inputStyle = { background: 'rgba(0,0,0,0.6)', border: '1px solid #444', color: '#fff', padding: '10px', borderRadius: '6px', outline: 'none' };
  const dedStyle = { display: 'flex', justifyContent: 'space-between', color: isW2 ? '#ef4444' : '#555', marginBottom: '8px', fontSize: '0.9em' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(10px)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: 'var(--text-accent, #3b82f6)' }}>My Schedule</h2>
      </header>

      <div style={{ display: 'flex', gap: '10px', padding: '15px 15px 0 15px' }}>
        <button onClick={() => setActiveTab('calc')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'calc' ? 'var(--text-accent, #3b82f6)' : '#222', color: activeTab === 'calc' ? '#fff' : '#888' }}>Tracker</button>
        <button onClick={() => setActiveTab('info')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'info' ? '#a855f7' : '#222', color: activeTab === 'info' ? '#fff' : '#888' }}>Guides & Info</button>
      </div>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        {activeTab === 'calc' ? (
          <>
            <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '4px solid var(--text-accent, #3b82f6)' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ color: '#aaa', fontSize: '0.8em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>My Hourly Rate</div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#00cc66', fontWeight: 'bold', marginRight: '5px', fontSize: '1.2em' }}>$</span>
                        <input type="number" value={rate || ''} onChange={e => setRate(parseFloat(e.target.value) || 0)} style={{ ...inputStyle, width: '90px', fontSize: '1.2em', fontWeight: 'bold', padding: '6px 8px' }} />
                    </div>
                </div>
                <div style={{ textAlign: 'right', flex: 1 }}>
                    <div style={{ color: '#aaa', fontSize: '0.8em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>Total Hours</div>
                    <div style={{ color: 'var(--text-accent, #3b82f6)', fontSize: '2em', fontWeight: 'bold', lineHeight: '1' }}>{totalHours.toFixed(1)}</div>
                </div>
            </div>

            <div style={{ ...cardStyle }}>
                <h3 style={{ color: 'var(--text-accent, #3b82f6)', margin: '0 0 20px 0' }}>This Week's Shifts</h3>
                
                {days.map(day => {
                    const dayTotal = shifts[day].reduce((sum, s) => sum + calculateHours(s.start, s.end), 0);
                    return (
                        <div key={day} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px dashed #333' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.1em', width: '45px', color: '#fff' }}>{day}</span>
                                    <button onClick={() => addShift(day)} style={{ background: 'rgba(0, 204, 102, 0.1)', color: '#00cc66', border: '1px solid #00cc66', borderRadius: '4px', padding: '4px 10px', fontSize: '0.75em', fontWeight: 'bold' }}>+ ADD</button>
                                </div>
                                <span style={{ color: '#aaa', fontSize: '0.9em', fontFamily: 'monospace' }}>{dayTotal > 0 ? `${dayTotal.toFixed(1)}h` : '-'}</span>
                            </div>
                            
                            {shifts[day].map((shift) => (
                                <div key={shift.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input type="time" value={shift.start} onChange={e => updateShift(day, shift.id, 'start', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                                    <span style={{ color: '#666', fontSize: '0.9em', fontWeight: 'bold' }}>to</span>
                                    <input type="time" value={shift.end} onChange={e => updateShift(day, shift.id, 'end', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                                    {shifts[day].length > 1 ? (
                                        <button onClick={() => removeShift(day, shift.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.8em', padding: '0 5px', lineHeight: '1' }}>×</button>
                                    ) : (
                                        <div style={{ width: '24px' }}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    );
                })}
                
                <button onClick={clearWeek} style={{ width: '100%', padding: '15px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Clear Week</button>
            </div>
            <div style={{ ...cardStyle }}>
                <h3 style={{ color: '#a855f7', margin: '0 0 20px 0', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>Paycheck Estimator</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#ccc', fontSize: '1.1em' }}>
                    <span>Regular Pay ({regHours.toFixed(1)}h)</span>
                    <span>${regPay.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#ccc', fontSize: '1.1em' }}>
                    <span>Overtime Pay ({otHours.toFixed(1)}h)</span>
                    <span style={{ color: otHours > 0 ? '#f59e0b' : '#ccc' }}>${otPay.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px 0', borderTop: '1px solid #333', borderBottom: '1px solid #333', marginBottom: '20px' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#aaa', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold' }}>Tax Profile</span>
                        <select value={taxProfile} onChange={e => setTaxProfile(e.target.value)} style={{ background: '#222', color: '#3b82f6', border: '1px solid #444', padding: '10px', borderRadius: '6px', outline: 'none', fontSize: '0.9em', fontWeight: 'bold', maxWidth: '65%' }}>
                            <option value="W2">W2 Employee</option>
                            <option value="1099">1099 / Cash (No Withholding)</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#aaa', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold' }}>State Tax</span>
                        <select value={stateTax} onChange={e => setStateTax(e.target.value)} disabled={!isW2} style={{ background: '#222', color: isW2 ? '#3b82f6' : '#555', border: '1px solid #444', padding: '10px', borderRadius: '6px', outline: 'none', fontSize: '0.9em', fontWeight: 'bold', maxWidth: '65%' }}>
                            {Object.keys(stateTaxRates).map(stateCode => (
                                <option key={stateCode} value={stateCode}>
                                    {stateCode} ({stateTaxRates[stateCode]}%)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#aaa', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold' }}>Fed Tax (%)</span>
                        <input type="number" value={fedRate} onChange={e => setFedRate(parseFloat(e.target.value) || 0)} disabled={!isW2} style={{ background: '#222', color: isW2 ? '#3b82f6' : '#555', border: '1px solid #444', padding: '10px', borderRadius: '6px', outline: 'none', fontSize: '1em', fontWeight: 'bold', width: '80px', textAlign: 'right' }} />
                    </div>

                </div>

                <div style={{ color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.9em', marginBottom: '15px', textAlign: 'center' }}>Estimated Deductions</div>
                
                <div style={dedStyle}><span>Social Security (FICA 6.2%)</span><span>-${fica.toFixed(2)}</span></div>
                <div style={dedStyle}><span>Medicare (1.45%)</span><span>-${med.toFixed(2)}</span></div>
                <div style={dedStyle}><span>Federal Tax ({fedRate}%)</span><span>-${fed.toFixed(2)}</span></div>
                <div style={dedStyle}><span>State Tax ({stateTax} {currentStateRate}%)</span><span>-${stateDeduction.toFixed(2)}</span></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #444', marginTop: '20px', paddingTop: '20px', fontWeight: 'bold', fontSize: '1.4em' }}>
                    <span style={{ color: '#fff' }}>Est. Net Pay</span>
                    <span style={{ color: '#00cc66' }}>${netPay.toFixed(2)}</span>
                </div>
            </div>
          </>
        ) : (
          <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
            <h3 style={{ color: '#a855f7', margin: '0 0 15px 0' }}>Tax & Withholding Guide</h3>
            
            <div style={{ color: '#ccc', lineHeight: '1.6', fontSize: '0.95em' }}>
                <p><strong style={{ color: '#fff' }}>Disclaimer:</strong> This tool provides estimates only and does not constitute financial or tax advice. Actual paycheck net amounts will vary based on your employer's payroll software, W-4 elections, and pre-tax deductions.</p>
                
                <hr style={{ border: 'none', borderTop: '1px dashed #444', margin: '15px 0' }} />
                
                <h4 style={{ color: '#3b82f6', margin: '0 0 5px 0' }}>FICA & Medicare (Payroll Taxes)</h4>
                <ul style={{ paddingLeft: '20px', margin: '0 0 15px 0' }}>
                    <li><strong>Social Security (6.2%):</strong> Deducted automatically from all W-2 wages.</li>
                    <li><strong>Medicare (1.45%):</strong> Deducted automatically from all W-2 wages.</li>
                </ul>

                <h4 style={{ color: '#3b82f6', margin: '0 0 5px 0' }}>Federal Income Tax</h4>
                <p style={{ margin: '0 0 15px 0' }}>Federal withholding is highly variable. If you work part-time and your annual income is below the Standard Deduction, your employer may withhold <strong>0%</strong> for Federal taxes. You can adjust this rate manually in the estimator.</p>

                <h4 style={{ color: '#3b82f6', margin: '0 0 5px 0' }}>State Income Tax</h4>
                <p style={{ margin: '0 0 15px 0' }}>Rates vary wildly by state. Some states (like TX, FL, NV) have 0% income tax. Others use a flat rate or progressive brackets. The selector in the estimator uses base aggregate estimates for each state.</p>

                <h4 style={{ color: '#3b82f6', margin: '0 0 5px 0' }}>1099 & Cash Work</h4>
                <p style={{ margin: '0' }}>If you select the 1099 / Cash profile, the estimator assumes no taxes are withheld at the time of payment. Remember that as a 1099 contractor, you are still liable for self-employment taxes (approx 15.3%) when you file your return.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
