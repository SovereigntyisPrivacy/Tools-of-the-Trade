import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyShiftTracker() {
  const navigate = useNavigate();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('tracker'); // tracker, guides, archives
  const [hourlyRate, setHourlyRate] = useState(16.00);
  
  // Tax & Deductions State
  const [taxProfile, setTaxProfile] = useState('W2 Employee');
  const [stateTax, setStateTax] = useState(2.5); // Default AZ 2.5%
  const [fedTax, setFedTax] = useState(10.0);
  
  const [showReport, setShowReport] = useState(false);
  const [archives, setArchives] = useState([]); // Holds saved weeks

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Shift State - Now supports arrays for multiple shifts per day
  const [shifts, setShifts] = useState({
    SUN: [{ start: '', end: '' }],
    MON: [{ start: '16:00', end: '22:00' }], // Defaulted to your standard shift
    TUE: [{ start: '', end: '' }],
    WED: [{ start: '', end: '' }],
    THU: [{ start: '', end: '' }],
    FRI: [{ start: '', end: '' }],
    SAT: [{ start: '', end: '' }]
  });

  const stateTaxOptions = [
    { label: 'Arizona (2.5%)', value: 2.5 },
    { label: 'California (9.3%)', value: 9.3 },
    { label: 'Texas (0%)', value: 0.0 },
    { label: 'Nevada (0%)', value: 0.0 },
    { label: 'Custom Flat (5.0%)', value: 5.0 }
  ];

  const laborGuides = [
    {
      title: "Wage & Overtime Rights (FLSA)",
      content: "Under the Fair Labor Standards Act (FLSA), federal law mandates that covered nonexempt employees must receive overtime pay for hours worked over 40 per workweek at a rate not less than time and one-half their regular rates of pay. Employers cannot force you to work 'off the clock' or average your hours across two weeks to avoid overtime.",
      contact: "Wage and Hour Division (WHD): 1-866-487-9243"
    },
    {
      title: "Right to Discuss Pay (NLRB)",
      content: "Under the National Labor Relations Act (NLRA), you have the federally protected right to discuss your wages, hours, and working conditions with your coworkers. If an employer has a policy forbidding you from discussing pay, or if they fire/retaliate against you for doing so, they are breaking federal law.",
      contact: "National Labor Relations Board: 1-844-762-6572"
    },
    {
      title: "Workplace Safety (OSHA)",
      content: "You have the right to a safe workplace. The Occupational Safety and Health Act strictly prohibits employers from retaliating against employees who raise safety or health concerns. You have the right to refuse dangerous work if you genuinely believe it exposes you to an imminent danger of death or serious injury, and your employer cannot fire you for it.",
      contact: "OSHA Emergency Line: 1-800-321-6742"
    },
    {
      title: "1099 vs W2 Misclassification",
      content: "Many companies misclassify workers as 1099 Independent Contractors to avoid paying employer taxes, overtime, and benefits. If your employer dictates exactly when, where, and how you do your job, you are legally a W2 employee. Misclassification is tax fraud by the employer."
    }
  ];

  // --- ACTIONS ---
  const handleShiftChange = (day, index, field, value) => {
    const newShifts = [...shifts[day]];
    newShifts[index][field] = value;
    setShifts(prev => ({ ...prev, [day]: newShifts }));
  };

  const addShift = (day) => {
    setShifts(prev => ({ ...prev, [day]: [...prev[day], { start: '', end: '' }] }));
  };

  const removeShift = (day, index) => {
    const newShifts = shifts[day].filter((_, i) => i !== index);
    if (newShifts.length === 0) newShifts.push({ start: '', end: '' }); // Keep at least one empty box
    setShifts(prev => ({ ...prev, [day]: newShifts }));
  };

  const clearWeek = () => {
    setShifts({
      SUN: [{ start: '', end: '' }], MON: [{ start: '', end: '' }], TUE: [{ start: '', end: '' }],
      WED: [{ start: '', end: '' }], THU: [{ start: '', end: '' }], FRI: [{ start: '', end: '' }],
      SAT: [{ start: '', end: '' }]
    });
  };

  // --- CALCULATIONS ---
  let totalHours = 0;
  let dailyBreakdown = [];

  daysOfWeek.forEach((day) => {
    let dayHours = 0;
    let shiftStrs = [];
    
    shifts[day].forEach(shift => {
      if (shift.start && shift.end) {
        let startD = new Date(`1970-01-01T${shift.start}`);
        let endD = new Date(`1970-01-01T${shift.end}`);
        
        // Handle overnight shifts perfectly
        if (endD < startD) endD.setDate(endD.getDate() + 1); 
        
        let diff = (endD - startD) / 3600000; 
        dayHours += diff;
        totalHours += diff;
        shiftStrs.push(`${shift.start} to ${shift.end}`);
      }
    });

    if (dayHours > 0) {
      dailyBreakdown.push({ day, hours: dayHours.toFixed(2), shifts: shiftStrs });
    }
  });

  const regHours = Math.min(totalHours, 40);
  const otHours = Math.max(0, totalHours - 40);
  const regPay = regHours * hourlyRate;
  const otPay = otHours * (hourlyRate * 1.5);
  const grossPay = regPay + otPay;

  const isW2 = taxProfile === 'W2 Employee';
  const ssTax = isW2 ? grossPay * 0.062 : grossPay * 0.124; 
  const medTax = isW2 ? grossPay * 0.0145 : grossPay * 0.029;
  
  const calculatedStateTax = grossPay * (stateTax / 100);
  const calculatedFedTax = grossPay * (fedTax / 100);

  const totalDeductions = ssTax + medTax + calculatedStateTax + calculatedFedTax;
  const netPay = grossPay - totalDeductions;

  // --- ARCHIVING ---
  const saveToArchive = () => {
    if (totalHours === 0) return alert("Log hours before saving.");
    const newArchive = {
      id: Date.now(),
      dateSaved: new Date().toLocaleDateString(),
      totalHours: totalHours.toFixed(2),
      grossPay: grossPay.toFixed(2),
      netPay: netPay.toFixed(2),
      breakdown: dailyBreakdown
    };
    setArchives([newArchive, ...archives]);
    setShowReport(false);
    clearWeek();
  };

  // --- STYLES ---
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #222', padding: '20px', marginBottom: '20px' };
  const inputStyle = { background: '#000', color: '#fff', border: '1px solid #333', padding: '10px', borderRadius: '6px', width: '100%', fontSize: '1em' };
  const labelStyle = { color: '#888', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px', display: 'block' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
          <h2 style={{ margin: 0, color: '#10b981', fontSize: '1.2em' }}>My Schedule</h2>
        </div>
      </header>

      {/* TABS */}
      <div style={{ display: 'flex', padding: '15px', gap: '8px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <button onClick={() => setActiveTab('tracker')} style={{ flex: '0 0 auto', padding: '12px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'tracker' ? '#10b981' : '#222', color: activeTab === 'tracker' ? '#000' : '#888' }}>Tracker</button>
        <button onClick={() => setActiveTab('guides')} style={{ flex: '0 0 auto', padding: '12px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'guides' ? '#10b981' : '#222', color: activeTab === 'guides' ? '#000' : '#888' }}>Guides & Info</button>
        <button onClick={() => setActiveTab('archives')} style={{ flex: '0 0 auto', padding: '12px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'archives' ? '#10b981' : '#222', color: activeTab === 'archives' ? '#000' : '#888' }}>Archives</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        
        {activeTab === 'tracker' && (
          <>
            <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '4px solid #10b981' }}>
              <div style={{ width: '45%' }}>
                <label style={labelStyle}>My Hourly Rate</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2em' }}>$</span>
                  <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)} style={inputStyle} />
                </div>
              </div>
              <div style={{ width: '45%', textAlign: 'right' }}>
                <label style={labelStyle}>Total Hours</label>
                <div style={{ color: '#10b981', fontSize: '2em', fontWeight: 'bold' }}>{totalHours.toFixed(1)}</div>
              </div>
            </div>

            <div style={cardStyle}>
              <h3 style={{ color: '#10b981', margin: '0 0 20px 0', textAlign: 'center' }}>This Week's Shifts</h3>
              {daysOfWeek.map((day) => (
                <div key={day} style={{ marginBottom: '15px', borderBottom: '1px dashed #222', paddingBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong style={{ fontSize: '1em', color: shifts[day][0].start ? '#10b981' : '#fff' }}>{day}</strong>
                    <button onClick={() => addShift(day)} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid #10b981', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold' }}>+ ADD SHIFT</button>
                  </div>
                  
                  {shifts[day].map((shift, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <input type="time" value={shift.start} onChange={(e) => handleShiftChange(day, idx, 'start', e.target.value)} style={{ ...inputStyle, padding: '8px' }} />
                      <span style={{ color: '#666' }}>to</span>
                      <input type="time" value={shift.end} onChange={(e) => handleShiftChange(day, idx, 'end', e.target.value)} style={{ ...inputStyle, padding: '8px' }} />
                      <button onClick={() => removeShift(day, idx)} style={{ background: 'transparent', color: '#ef4444', border: 'none', padding: '8px', fontSize: '1.2em' }}>×</button>
                    </div>
                  ))}
                </div>
              ))}
              <button onClick={clearWeek} style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '15px', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>CLEAR WEEK</button>
            </div>

            <div style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
              <h3 style={{ color: '#10b981', margin: '0 0 20px 0', textTransform: 'uppercase', textAlign: 'center' }}>Paycheck Estimator</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '1.05em' }}>
                <span style={{ color: '#ccc' }}>Regular Pay ({regHours.toFixed(1)}h)</span><span style={{ fontWeight: 'bold' }}>${regPay.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.05em', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                <span style={{ color: '#ccc' }}>Overtime Pay ({otHours.toFixed(1)}h)</span><span style={{ fontWeight: 'bold' }}>${otPay.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                <label style={{ ...labelStyle, margin: 0, width: '40%' }}>Tax Profile</label>
                <select value={taxProfile} onChange={(e) => setTaxProfile(e.target.value)} style={{ ...inputStyle, width: '55%', color: '#3b82f6', fontWeight: 'bold' }}>
                  <option value="W2 Employee">W2 Employee</option>
                  <option value="1099 Contractor">1099 Contractor</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                <label style={{ ...labelStyle, margin: 0, width: '40%' }}>State Tax</label>
                <select value={stateTax} onChange={(e) => setStateTax(parseFloat(e.target.value))} style={{ ...inputStyle, width: '55%' }}>
                  {stateTaxOptions.map(opt => <option key={opt.label} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px', borderBottom: '1px dashed #333', paddingBottom: '20px' }}>
                <label style={{ ...labelStyle, margin: 0, width: '40%' }}>Fed Tax (%)</label>
                <div style={{ width: '55%', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="number" value={fedTax} onChange={(e) => setFedTax(parseFloat(e.target.value) || 0)} style={inputStyle} />
                  <span style={{ color: '#666', fontWeight: 'bold' }}>%</span>
                </div>
              </div>

              <h4 style={{ color: '#fff', textTransform: 'uppercase', fontSize: '0.9em', textAlign: 'center', marginBottom: '15px' }}>Estimated Deductions</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#888', fontSize: '0.95em' }}><span>Social Security (FICA)</span><span>-${ssTax.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#888', fontSize: '0.95em' }}><span>Medicare (FICA)</span><span>-${medTax.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#888', fontSize: '0.95em' }}><span>Federal Tax ({fedTax}%)</span><span>-${calculatedFedTax.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#888', fontSize: '0.95em', borderBottom: '1px solid #333', paddingBottom: '15px' }}><span>State Tax ({stateTax}%)</span><span>-${calculatedStateTax.toFixed(2)}</span></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2em' }}>
                <strong style={{ color: '#fff' }}>Est. Net Pay</strong><strong style={{ color: '#10b981', fontSize: '1.4em' }}>${netPay.toFixed(2)}</strong>
              </div>
              
              <button onClick={() => setShowReport(true)} style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', marginTop: '25px', fontSize: '1.05em' }}>
                📄 VIEW FULL REPORT
              </button>
            </div>
          </>
        )}

        {/* GUIDES TAB */}
        {activeTab === 'guides' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
            <h2 style={{ color: '#3b82f6', margin: '0 0 20px 0', textTransform: 'uppercase', textAlign: 'center' }}>Worker's Rights</h2>
            {laborGuides.map((guide, idx) => (
              <div key={idx} style={{ background: '#0a0a0a', padding: '15px', borderRadius: '8px', marginBottom: '15px', borderLeft: '2px solid #3b82f6' }}>
                <strong style={{ color: '#fff', fontSize: '1.1em', display: 'block', marginBottom: '8px' }}>{guide.title}</strong>
                <p style={{ color: '#ccc', lineHeight: '1.5', fontSize: '0.95em', margin: '0 0 10px 0' }}>{guide.content}</p>
                {guide.contact && (
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.9em' }}>
                    📞 {guide.contact}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ARCHIVES TAB */}
        {activeTab === 'archives' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
            <h2 style={{ color: '#a855f7', margin: '0 0 20px 0', textTransform: 'uppercase', textAlign: 'center' }}>Saved Timesheets</h2>
            {archives.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>No timesheets saved yet.</p>
            ) : (
              archives.map((arc) => (
                <div key={arc.id} style={{ background: '#0a0a0a', padding: '15px', borderRadius: '8px', marginBottom: '15px', borderLeft: '2px solid #a855f7' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong style={{ color: '#fff' }}>Saved: {arc.dateSaved}</strong>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>Net: ${arc.netPay}</span>
                  </div>
                  <div style={{ color: '#888', fontSize: '0.9em', marginBottom: '10px' }}>
                    Total Hours: {arc.totalHours}h | Gross: ${arc.grossPay}
                  </div>
                  <div style={{ borderTop: '1px dashed #333', paddingTop: '10px' }}>
                    {arc.breakdown.map((b, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', fontSize: '0.85em', marginBottom: '4px' }}>
                        <span>{b.day} ({b.hours}h)</span>
                        <span>{b.shifts.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* FULL REPORT MODAL */}
      {showReport && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#000', zIndex: 100, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #10b981', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2 style={{ color: '#10b981', margin: 0, textTransform: 'uppercase' }}>Timesheet Report</h2>
            <button onClick={() => setShowReport(false)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
          </div>

          <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #333', marginBottom: '20px' }}>
            <h3 style={{ color: '#fff', borderBottom: '1px dashed #444', paddingBottom: '10px', marginBottom: '15px' }}>Daily Breakdown</h3>
            {dailyBreakdown.length === 0 ? (
              <p style={{ color: '#888', fontStyle: 'italic' }}>No shifts logged this week.</p>
            ) : (
              dailyBreakdown.map((log) => (
                <div key={log.day} style={{ marginBottom: '10px', color: '#ccc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 'bold', color: '#10b981' }}>{log.day}</span>
                    <span style={{ fontWeight: 'bold', color: '#fff' }}>{log.hours}h</span>
                  </div>
                  {log.shifts.map((s, i) => (
                    <div key={i} style={{ fontSize: '0.85em', color: '#888', textAlign: 'right' }}>{s}</div>
                  ))}
                </div>
              ))
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #333', fontSize: '1.1em', fontWeight: 'bold' }}>
              <span>Total Logged:</span><span style={{ color: '#10b981' }}>{totalHours.toFixed(2)} Hours</span>
            </div>
          </div>

          <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #333', marginBottom: '20px' }}>
            <h3 style={{ color: '#fff', borderBottom: '1px dashed #444', paddingBottom: '10px', marginBottom: '15px' }}>Financial Breakdown</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', marginBottom: '8px' }}><span>Gross Pay:</span> <span>${grossPay.toFixed(2)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', marginBottom: '8px' }}><span>Total Taxes/Deductions:</span> <span>-${totalDeductions.toFixed(2)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '2px solid #333', fontSize: '1.3em', fontWeight: 'bold' }}>
              <span>Take Home:</span><span style={{ color: '#10b981' }}>${netPay.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={saveToArchive} style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '20px' }}>
            💾 SAVE TO ARCHIVES
          </button>
        </div>
      )}
    </div>
  );
}
