import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../core/CalendarContext';

export default function CalendarHub() {
  const navigate = useNavigate();
  const { globalDate, setGlobalDate, reminders, addReminder, removeReminder } = useCalendar();

  // BULLETPROOF DATE PARSER: Strips time signatures and forces Local Time
  const parseLocalDate = (dateStr) => {
    if (!dateStr) return new Date();
    const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const [y, m, d] = cleanStr.split('-').map(Number);
    // JS Months are 0-indexed. This exact format prevents the UTC rollback bug.
    return new Date(y, m - 1, d); 
  };

  const [viewDate, setViewDate] = useState(parseLocalDate(globalDate));
  const [newText, setNewText] = useState('');
  const [newPriority, setNewPriority] = useState('Normal');

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  // Hardcoded short days to prevent localization mapping bugs
  const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // CACHE ENGINE: Reads from localStorage exactly ONCE per load to prevent UI freezing
  const db = useMemo(() => {
    const getJSON = (key) => {
      try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
    };
    
    let ledgers = [];
    ['asset_ledger', 'assets', 'fleet_assets', 'LedgerItems', 'Ledger'].forEach(key => {
      const data = getJSON(key);
      if (Array.isArray(data)) ledgers = [...ledgers, ...data];
    });

    return {
      schedules: getJSON('fleet_schedules'),
      subscriptions: getJSON('fleet_subscriptions'),
      ledgers: ledgers
    };
  }, []);

  // SYNTHESIS ENGINE
  const getAllEventsForDate = (dateStr) => {
    // Start with Manual Reminders
    const events = [...reminders.filter(r => r.date === dateStr)];
    const targetDateObj = parseLocalDate(dateStr);
    const dayName = shortDays[targetDateObj.getDay()];

    // 1. Pull Timesheet Shifts
    db.schedules.forEach(week => {
      if (!week.weekDate) return;
      const weekStart = parseLocalDate(week.weekDate);
      const diffDays = Math.round((targetDateObj - weekStart) / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= 6) {
        (week.roster || []).forEach(emp => {
          const shift = (week.shifts && week.shifts[emp.id]) ? week.shifts[emp.id][dayName] : null;
          if (shift && shift.in && shift.out) {
            events.push({
              id: `shift_${emp.id}_${dateStr}`,
              text: `[SHIFT] ${emp.name || 'Worker'}: ${shift.in} to ${shift.out}`,
              module: 'Timesheet',
              priority: 'Done', // Green
              isDynamic: true
            });
          }
        });
      }
    });

    // 2. Pull Ledger Assets
    db.ledgers.forEach(item => {
      const itemDate = item.date || item.purchaseDate || item.warrantyDate || item.expDate || item.purchase_date;
      if (itemDate && typeof itemDate === 'string' && itemDate.startsWith(dateStr)) {
        events.push({
          id: `asset_${item.id || Math.random()}`,
          text: `[ASSET] ${item.name || item.assetName || item.tag || 'Asset Log'}: ${item.status || item.condition || 'Checked'}`,
          module: 'Ledger',
          priority: 'High', // Red
          isDynamic: true
        });
      }
    });

    // 3. Pull Recurring Subscriptions
    db.subscriptions.forEach(sub => {
      if (!sub.renewal) return;
      const renewDate = parseLocalDate(sub.renewal);
      let isDue = false;

      // Cycle Logic
      if (sub.cycle === 'Monthly' && targetDateObj >= renewDate && targetDateObj.getDate() === renewDate.getDate()) isDue = true;
      if (sub.cycle === 'Yearly' && targetDateObj >= renewDate && targetDateObj.getMonth() === renewDate.getMonth() && targetDateObj.getDate() === renewDate.getDate()) isDue = true;
      if (sub.cycle === 'Weekly') {
         const daysSince = Math.round((targetDateObj - renewDate) / (1000 * 60 * 60 * 24));
         if (targetDateObj >= renewDate && daysSince % 7 === 0) isDue = true;
      }

      if (isDue || dateStr === sub.renewal.split('T')[0]) {
        // Strip out accidental string symbols in the cost before parsing
        const safeCost = parseFloat(String(sub.cost || 0).replace(/[^0-9.]/g, '')).toFixed(2);
        events.push({
          id: `sub_${sub.id}_${dateStr}`,
          text: `[RENEWAL] ${sub.name || 'Sub'} - $${safeCost}`,
          module: 'Subscriptions',
          priority: 'High', // Red
          isDynamic: true
        });
      }
    });

    return events;
  };

  const handleDayClick = (day) => {
    const y = year;
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    setGlobalDate(`${y}-${m}-${d}`);
  };

  const activeEvents = getAllEventsForDate(globalDate);

  const renderDots = (dayEvts) => {
    if (dayEvts.length === 0) return null;
    return (
      <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', marginTop: '4px' }}>
        {dayEvts.slice(0, 3).map((r, i) => (
          <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: r.priority === 'High' ? '#ef4444' : r.priority === 'Done' ? '#00cc66' : '#a855f7' }} />
        ))}
        {dayEvts.length > 3 && <span style={{ color: '#888', fontSize: '8px', fontWeight: 'bold' }}>+</span>}
      </div>
    );
  };

  const handleAdd = () => {
    if (!newText) return;
    addReminder(globalDate, newText, 'Manual', newPriority);
    setNewText('');
  };

  const inputStyle = { width: '100%', padding: '12px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', marginBottom: '10px' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#00ffff', fontSize: '1.2em' }}>Master Calendar</h2>
      </header>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        <div style={{ ...cardStyle, padding: '20px 15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button onClick={() => setViewDate(new Date(year, month - 1, 1))} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold' }}>&lt;</button>
            <h3 style={{ margin: 0, color: '#00ffff', textTransform: 'uppercase', letterSpacing: '1px' }}>{monthNames[month]} {year}</h3>
            <button onClick={() => setViewDate(new Date(year, month + 1, 1))} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold' }}>&gt;</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center', color: '#888', fontSize: '0.8em', fontWeight: 'bold', marginBottom: '10px' }}>
            <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
            {blanks.map(b => <div key={`blank-${b}`} style={{ padding: '15px 0' }} />)}
            
            {days.map(day => {
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = dateStr === globalDate;
              const dayEvts = getAllEventsForDate(dateStr);
              
              return (
                <div 
                  key={day} 
                  onClick={() => handleDayClick(day)}
                  style={{
                    padding: '12px 0', textAlign: 'center', borderRadius: '8px', cursor: 'pointer',
                    background: isSelected ? 'rgba(0, 255, 255, 0.15)' : '#000',
                    border: isSelected ? '1px solid #00ffff' : '1px solid #222',
                    color: isSelected ? '#00ffff' : '#fff'
                  }}
                >
                  <div style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>{day}</div>
                  {renderDots(dayEvts)}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
            <span>Agenda:</span>
            <span style={{ color: '#a855f7' }}>{parseLocalDate(globalDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </h3>

          {activeEvents.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#555', padding: '10px 0', fontStyle: 'italic' }}>No events or data found for this day.</div>
          ) : (
            activeEvents.map(r => (
              <div key={r.id} style={{ background: '#000', padding: '15px', borderRadius: '8px', borderLeft: r.priority === 'High' ? '4px solid #ef4444' : r.priority === 'Done' ? '4px solid #00cc66' : '4px solid #a855f7', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#fff', fontWeight: 'bold' }}>{r.text}</div>
                  <div style={{ color: '#555', fontSize: '0.75em', marginTop: '4px', textTransform: 'uppercase' }}>Source: {r.module}</div>
                </div>
                {!r.isDynamic && <button onClick={() => removeReminder(r.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.2em', padding: '10px' }}>x</button>}
              </div>
            ))
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}>
            <input type="text" placeholder="Add custom event..." value={newText} onChange={e => setNewText(e.target.value)} style={{ ...inputStyle, flex: 2, marginBottom: 0 }} />
            <select value={newPriority} onChange={e => setNewPriority(e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 0 }}>
              <option value="Normal">Normal</option>
              <option value="High">High ⚠️</option>
              <option value="Done">Done ✓</option>
            </select>
          </div>
          <button onClick={handleAdd} style={{ width: '100%', padding: '12px', background: '#222', color: '#00ffff', border: '1px dashed #00ffff', borderRadius: '8px', marginTop: '10px', fontWeight: 'bold' }}>+ Log to Agenda</button>
        </div>
      </div>
    </div>
  );
}
