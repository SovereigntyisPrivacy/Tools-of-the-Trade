import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TimesheetCalc() {
  const navigate = useNavigate();

  // Pay & Tax State
  const [hourlyWage, setHourlyWage] = useState('');
  const [taxRate, setTaxRate] = useState('');

  // Shift State: Object containing arrays of shifts for each day
  const defaultShifts = {
    Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: []
  };
  const [shifts, setShifts] = useState(defaultShifts);

  // Helper to parse "HH:mm" 24h format from native input type="time" into decimal hours
  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + (minutes / 60);
  };

  // Helper to calculate duration, automatically handling overnight shifts
  const calcDuration = (inTime, outTime) => {
    if (!inTime || !outTime) return 0;
    let start = parseTime(inTime);
    let end = parseTime(outTime);
    
    // Overnight Shift Logic (e.g., 22:00 to 06:00 crossover)
    if (end < start) {
      end += 24;
    }
    return end - start;
  };

  // Shift Management Functions
  const addShift = (day) => {
    setShifts({
      ...shifts,
      [day]: [...shifts[day], { in: '', out: '' }]
    });
  };

  const removeShift = (day, index) => {
    const updatedDay = [...shifts[day]];
    updatedDay.splice(index, 1);
    setShifts({ ...shifts, [day]: updatedDay });
  };

  const updateShift = (day, index, field, value) => {
    const updatedDay = [...shifts[day]];
    updatedDay[index][field] = value;
    setShifts({ ...shifts, [day]: updatedDay });
  };

  // --- Core Math ---
  let totalHours = 0;
  Object.keys(shifts).forEach(day => {
    shifts[day].forEach(shift => {
      totalHours += calcDuration(shift.in, shift.out);
    });
  });

  const regHours = Math.min(totalHours, 40);
  const otHours = Math.max(totalHours - 40, 0);

  const wage = parseFloat(hourlyWage) || 0;
  const tax = parseFloat(taxRate) || 0;

  const regPay = regHours * wage;
  const otPay = otHours * (wage * 1.5);
  const grossPay = regPay + otPay;
  const taxDeduction = grossPay * (tax / 100);
  const netPay = grossPay - taxDeduction;

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Timesheet & Payroll</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        {/* Wage Profile */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00ffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>💵 Wage Profile</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '4px' }}>Hourly Rate ($)</label>
              <input type="number" placeholder="25.00" value={hourlyWage} onChange={e => setHourlyWage(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#00ffff', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '4px' }}>Tax Deduction (%)</label>
              <input type="number" placeholder="15" value={taxRate} onChange={e => setTaxRate(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
            </div>
          </div>
        </div>

        {/* Dynamic Shift Log */}
        <div style={{ background: 'rgba(20,20,20,0.8)', borderTop: '4px solid #00cc66', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>
            <h3 style={{ color: '#fff', margin: 0 }}>⏰ Time Clock</h3>
            <div style={{ background: '#00cc66', color: '#000', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>
              {totalHours.toFixed(2)} Hrs
            </div>
          </div>

          <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '15px' }}>
            Tap <strong>+ Add Shift</strong> to log AM/PM punches. Supports split shifts, lunch breaks, and overnight crossovers.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {Object.keys(shifts).map(day => {
              const dayHours = shifts[day].reduce((sum, shift) => sum + calcDuration(shift.in, shift.out), 0);
              
              return (
                <div key={day} style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: shifts[day].length > 0 ? '10px' : '0' }}>
                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1em' }}>{day} <span style={{ color: '#aaa', fontSize: '0.8em', marginLeft: '5px' }}>({dayHours.toFixed(1)} hrs)</span></span>
                    <button onClick={() => addShift(day)} style={{ background: 'rgba(0, 204, 102, 0.2)', color: '#00cc66', border: '1px solid #00cc66', borderRadius: '5px', padding: '5px 10px', fontWeight: 'bold' }}>
                      + Add Shift
                    </button>
                  </div>
                  
                  {shifts[day].map((shift, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '5px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <label style={{ fontSize: '0.7em', color: '#00cc66', marginBottom: '2px', fontWeight: 'bold' }}>IN</label>
                        <input 
                          type="time" 
                          value={shift.in} 
                          onChange={(e) => updateShift(day, idx, 'in', e.target.value)} 
                          style={{ padding: '8px', background: '#000', border: '1px solid #444', color: '#fff', borderRadius: '5px', width: '100%' }} 
                        />
                      </div>
                      <span style={{ color: '#555', alignSelf: 'flex-end', paddingBottom: '8px' }}>→</span>
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <label style={{ fontSize: '0.7em', color: '#ff4444', marginBottom: '2px', fontWeight: 'bold' }}>OUT</label>
                        <input 
                          type="time" 
                          value={shift.out} 
                          onChange={(e) => updateShift(day, idx, 'out', e.target.value)} 
                          style={{ padding: '8px', background: '#000', border: '1px solid #444', color: '#fff', borderRadius: '5px', width: '100%' }} 
                        />
                      </div>
                      <button onClick={() => removeShift(day, idx)} style={{ background: 'transparent', border: 'none', color: '#ff4444', fontSize: '1.2em', padding: '0 5px', alignSelf: 'flex-end', marginBottom: '4px' }}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Firing Solution / Summary */}
        <div style={{ background: 'rgba(10,10,10,0.95)', border: '2px solid #00ffff', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0, 255, 255, 0.1)' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px', textAlign: 'center' }}>PAY SUMMARY</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '1.1em' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>Regular Hours:</span><span style={{ color: '#fff' }}>{regHours.toFixed(2)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>Overtime Hours:</span><span style={{ color: '#ffaa00' }}>{otHours.toFixed(2)}</span></div>
          </div>

          <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: '#aaa', fontSize: '1em' }}>Gross Pay:</span>
              <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1em' }}>${grossPay.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #333' }}>
              <span style={{ color: '#aaa', fontSize: '1em' }}>Est. Taxes:</span>
              <span style={{ color: '#ff4444', fontWeight: 'bold', fontSize: '1.1em' }}>-${taxDeduction.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.3em' }}>NET PAY:</span>
              <span style={{ color: '#00cc66', fontWeight: 'bold', fontSize: '1.4em' }}>${netPay.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TimesheetCalc;
