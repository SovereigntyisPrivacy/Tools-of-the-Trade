import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../core/CalendarContext';

export default function CalendarHub() {
  const navigate = useNavigate();
  const { globalDate, setGlobalDate, reminders, addReminder, removeReminder } = useCalendar();
  
  const [newText, setNewText] = useState('');
  const [newDate, setNewDate] = useState(globalDate);
  const [newPriority, setNewPriority] = useState('Normal');

  const handleAdd = () => {
    if (!newText) return;
    addReminder(newDate, newText, 'Manual', newPriority);
    setNewText('');
  };

  // Sort reminders chronologically
  const sortedReminders = [...reminders].sort((a, b) => new Date(a.date) - new Date(b.date));

  const inputStyle = { width: '100%', padding: '12px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', marginBottom: '10px' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Master Calendar</h2>
      </header>

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        {/* Global Date Controller */}
        <div style={{ ...cardStyle, borderTop: '4px solid #a855f7', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#a855f7', fontSize: '0.9em', textTransform: 'uppercase' }}>App Global Date</h3>
          <input 
            type="date" 
            value={globalDate} 
            onChange={(e) => setGlobalDate(e.target.value)} 
            style={{ width: '100%', padding: '15px', background: '#000', border: '1px solid #a855f7', borderRadius: '8px', color: '#00ffff', fontSize: '1.2em', fontWeight: 'bold', textAlign: 'center' }} 
          />
          <div style={{ color: '#888', fontSize: '0.8em', marginTop: '10px' }}>Changing this date updates the default view in Timesheets and Ledgers.</div>
        </div>

        {/* Add Reminder */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>+ New Reminder</h3>
          <input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} style={inputStyle} />
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input type="text" placeholder="E.g. Renew Box Truck LDW" value={newText} onChange={e=>setNewText(e.target.value)} style={{ ...inputStyle, flex: 2, marginBottom: 0 }} />
            <select value={newPriority} onChange={e=>setNewPriority(e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 0 }}>
              <option value="Normal">Normal</option>
              <option value="High">High ⚠️</option>
            </select>
          </div>
          <button onClick={handleAdd} style={{ width: '100%', padding: '12px', background: '#00cc66', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Save Event</button>
        </div>

        {/* Global Schedule List */}
        <h3 style={{ margin: '25px 0 15px 0', color: '#fff', textTransform: 'uppercase', fontSize: '0.9em', letterSpacing: '1px' }}>Global Schedule</h3>
        {sortedReminders.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#555', padding: '20px' }}>No upcoming events or warnings.</div>
        ) : (
          sortedReminders.map(r => (
            <div key={r.id} style={{ background: '#111', padding: '15px', borderRadius: '8px', borderLeft: r.priority === 'High' ? '4px solid #ef4444' : '4px solid #3b82f6', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#00ffff', fontWeight: 'bold', fontSize: '0.9em', marginBottom: '4px' }}>{new Date(r.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                <div style={{ color: '#fff' }}>{r.text}</div>
                <div style={{ color: '#555', fontSize: '0.75em', marginTop: '4px', textTransform: 'uppercase' }}>Source: {r.module}</div>
              </div>
              <button onClick={() => removeReminder(r.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.2em', padding: '10px' }}>×</button>
            </div>
          ))
        )}

      </div>
    </div>
  );
}
