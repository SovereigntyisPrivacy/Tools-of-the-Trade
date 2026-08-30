import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../core/CalendarContext';

export default function CalendarHub() {
  const navigate = useNavigate();
  const { globalDate, setGlobalDate, reminders, addReminder, removeReminder } = useCalendar();

  // Strip timezones forcefully to prevent UTC rollback bugs
  const parseLocalDate = (dateStr) => {
    if (!dateStr) return new Date();
    try {
      const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
      const [y, m, d] = cleanStr.split('-').map(Number);
      return new Date(y, m - 1, d); 
    } catch (e) {
      return new Date();
    }
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
  const shortDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // ZERO-CACHE AGGRESSIVE SCRAPER
  const getAllEventsForDate = (dateStr) => {
    let events = [];

    // 1. Manual Reminders (Safely filtering out auto-generated dupes)
    if (Array.isArray(reminders)) {
      reminders.forEach(r => {
        if (r && r.date === dateStr && r.text && !r.text.includes('[SUB RENEWAL]')) {
          events.push({ ...r, isDynamic: false });
        }
      });
    }

    const targetDateObj = parseLocalDate(dateStr);
    const dayName = shortDays[targetDateObj.getDay()];

    // 2. Pull Shifts (Directly from drive)
    try {
      const shiftData = JSON.parse(localStorage.getItem('tot_shift_shifts') || '{}');
      
      // Calculate boundaries for the current week to map the template
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      if (targetDateObj >= startOfWeek && targetDateObj <= endOfWeek) {
        const dayShifts = shiftData[dayName];
        if (Array.isArray(dayShifts)) {
          dayShifts.forEach((shift, idx) => {
            // Ignore empty default strings
            if (shift && shift.start && shift.end && shift.start.trim() !== '' && shift.end.trim() !== '') {
              events.push({
                id: `shift_${dayName}_${idx}`,
                text: `[SHIFT] ${shift.start} to ${shift.end}`,
                module: 'My Schedule',
                priority: 'Done', // Green Dot
                isDynamic: true
              });
            }
          });
        }
      }
    } catch (e) { /* Fail silently to prevent UI crash */ }

    // 3. Pull Ledger Assets
    try {
      const assets = JSON.parse(localStorage.getItem('tot_assets') || '[]');
      if (Array.isArray(assets)) {
        assets.forEach(asset => {
          // If the date exists literally ANYWHERE in the asset object, flag it.
          if (asset && (asset.date === dateStr || JSON.stringify(asset).includes(dateStr))) {
            events.push({
              id: `asset_${asset.id || Math.random()}`,
              text: `[ASSET] ${asset.name || 'Logged Item'}`,
              module: 'Asset Ledger',
              priority: 'High', // Red Dot
              isDynamic: true
            });
          }
        });
      }
    } catch (e) {}

    // 4. Pull Subscriptions
    try {
      const subs = JSON.parse(localStorage.getItem('fleet_subscriptions') || '[]');
      if (Array.isArray(subs)) {
        subs.forEach(sub => {
          if (!sub || !sub.renewal) return;
          const renewDate = parseLocalDate(sub.renewal);
          const cycle = String(sub.cycle || '').toLowerCase();
          let isDue = false;

          if (cycle === 'monthly' && targetDateObj >= renewDate && targetDateObj.getDate() === renewDate.getDate()) isDue = true;
          else if (cycle === 'yearly' && targetDateObj >= renewDate && targetDateObj.getMonth() === renewDate.getMonth() && targetDateObj.getDate() === renewDate.getDate()) isDue = true;
          else if (cycle === 'weekly' && targetDateObj >= renewDate) {
             const daysSince = Math.round((targetDateObj - renewDate) / (1000 * 60 * 60 * 24));
             if (daysSince % 7 === 0) isDue = true;
          }

          if (isDue || sub.renewal.includes(dateStr)) {
            const safeCost = parseFloat(String(sub.cost || 0).replace(/[^0-9.]/g, '')).toFixed(2);
            events.push({
              id: `sub_${sub.id || Math.random()}_${dateStr}`,
              text: `[RENEWAL] ${sub.name || 'Sub'} - $${safeCost}`,
              module: 'Subscriptions',
              priority: 'High', // Red Dot
              isDynamic: true
            });
          }
        });
      }
    } catch (e) {}

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
    if (!dayEvts || dayEvts.length === 0) return null;
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
