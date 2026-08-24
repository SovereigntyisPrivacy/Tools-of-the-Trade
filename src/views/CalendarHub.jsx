import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../core/CalendarContext';

export default function CalendarHub() {
  const navigate = useNavigate();
  const { globalDate, setGlobalDate, reminders, addReminder, removeReminder } = useCalendar();
  
  // Grid View State
  const [viewDate, setViewDate] = useState(new Date(globalDate + 'T00:00:00'));
  const [newText, setNewText] = useState('');
  const [newPriority, setNewPriority] = useState('Normal');

  // Date Math for the Grid
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days = Array.from({length: daysInMonth}, (_, i) => i + 1);
  const blanks = Array.from({length: firstDay}, (_, i) => i);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleDayClick = (day) => {
    const selected = new Date(year, month, day);
    const y = selected.getFullYear();
    const m = String(selected.getMonth() + 1).padStart(2, '0');
    const d = String(selected.getDate()).padStart(2, '0');
    setGlobalDate(`${y}-${m}-${d}`);
  };

  const handleAdd = () => {
    if (!newText) return;
    addReminder(globalDate, newText, 'Manual', newPriority);
    setNewText('');
  };

  // Pull reminders only for the day you clicked on
  const activeReminders = reminders.filter(r => r.date === globalDate);

  // Helper to render colored dots under the calendar numbers
  const getDots = (day) => {
    const checkDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayRems = reminders.filter(r => r.date === checkDate);
    if (dayRems.length === 0) return null;
    return (
      <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', marginTop: '4px' }}>
        {dayRems.slice(0, 3).map((r, i) => (
          <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: r.priority === 'High' ? '#ef4444' : r.priority === 'Done' ? '#00cc66' : '#a855f7' }} />
        ))}
        {dayRems.length > 3 && <span style={{color: '#888', fontSize: '8px'}}>+</span>}
      </div>
    );
  };

  const inputStyle = { width: '100%', padding: '12px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', marginBottom: '10px' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Master Calendar</h2>
      </header>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        {/* Visual Calendar Grid */}
        <div style={{ ...cardStyle, padding: '20px 15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button onClick={prevMonth} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold' }}>◀</button>
            <h3 style={{ margin: 0, color: '#00ffff', textTransform: 'uppercase', letterSpacing: '1px' }}>{monthNames[month]} {year}</h3>
            <button onClick={nextMonth} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold' }}>▶</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center', color: '#888', fontSize: '0.8em', fontWeight: 'bold', marginBottom: '10px' }}>
            <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
            {blanks.map(b => <div key={`blank-${b}`} style={{ padding: '15px 0' }} />)}
            {days.map(day => {
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = dateStr === globalDate;
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
                  {getDots(day)}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda */}
        <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
            <span>Agenda:</span>
            <span style={{ color: '#a855f7' }}>{new Date(globalDate + 'T00:00:00').toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
          </h3>
          
          {activeReminders.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#555', padding: '10px 0', fontStyle: 'italic' }}>No events scheduled for this day.</div>
          ) : (
            activeReminders.map(r => (
              <div key={r.id} style={{ background: '#000', padding: '15px', borderRadius: '8px', borderLeft: r.priority === 'High' ? '4px solid #ef4444' : r.priority === 'Done' ? '4px solid #00cc66' : '4px solid #a855f7', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#fff', fontWeight: 'bold' }}>{r.text}</div>
                  <div style={{ color: '#555', fontSize: '0.75em', marginTop: '4px', textTransform: 'uppercase' }}>Source: {r.module}</div>
                </div>
                <button onClick={() => removeReminder(r.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.2em', padding: '10px' }}>×</button>
              </div>
            ))
          )}
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' }}>
            <input type="text" placeholder="Add custom event..." value={newText} onChange={e=>setNewText(e.target.value)} style={{ ...inputStyle, flex: 2, marginBottom: 0 }} />
            <select value={newPriority} onChange={e=>setNewPriority(e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 0 }}>
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
