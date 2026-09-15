import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Appointments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Upcoming');
  
  // Form States
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('General');
  const [notes, setNotes] = useState('');

  // Persistent Storage
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('sovereign_appointments');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sovereign_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const categories = [
    { id: 'General', color: '#a855f7' },
    { id: 'Medical', color: '#ef4444' },
    { id: 'Vehicle', color: '#f59e0b' },
    { id: 'Travel', color: '#3b82f6' }
  ];

  const addAppointment = () => {
    if (!title || !date) return;
    
    const newAppt = {
      id: Date.now().toString(),
      title,
      date,
      time,
      category,
      notes,
      status: 'upcoming'
    };
    
    // Sort by date automatically
    const updated = [...appointments, newAppt].sort((a, b) => new Date(a.date) - new Date(b.date));
    setAppointments(updated);
    
    // Reset form
    setTitle(''); setDate(''); setTime(''); setNotes(''); setCategory('General');
  };

  const markCompleted = (id) => {
    setAppointments(appointments.map(appt => 
      appt.id === id ? { ...appt, status: 'completed' } : appt
    ));
  };

  const deleteAppt = (id) => {
    setAppointments(appointments.filter(appt => appt.id !== id));
  };

  const upcoming = appointments.filter(a => a.status === 'upcoming');
  const past = appointments.filter(a => a.status === 'completed');

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER */}
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#3b82f6', fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '1px' }}>Appointments</h2>
      </header>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '10px', padding: '15px', borderBottom: '1px solid #222' }}>
        <button 
          onClick={() => setActiveTab('Upcoming')}
          style={{ flex: 1, padding: '10px', background: activeTab === 'Upcoming' ? 'rgba(59, 130, 246, 0.15)' : '#111', color: activeTab === 'Upcoming' ? '#3b82f6' : '#888', border: activeTab === 'Upcoming' ? '1px solid #3b82f6' : '1px solid #333', borderRadius: '8px', fontWeight: 'bold', transition: 'all 0.2s' }}>
          Upcoming
        </button>
        <button 
          onClick={() => setActiveTab('Past')}
          style={{ flex: 1, padding: '10px', background: activeTab === 'Past' ? 'rgba(16, 185, 129, 0.15)' : '#111', color: activeTab === 'Past' ? '#10b981' : '#888', border: activeTab === 'Past' ? '1px solid #10b981' : '1px solid #333', borderRadius: '8px', fontWeight: 'bold', transition: 'all 0.2s' }}>
          History
        </button>
      </div>

      <div style={{ padding: '20px', overflowY: 'auto' }}>
        
        {activeTab === 'Upcoming' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* CREATION BLOCK */}
            <div style={{ background: '#111', padding: '15px', borderRadius: '12px', border: '1px dashed #333', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Title (e.g., Oil Change, Dentist)" value={title} onChange={e => setTitle(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #222', background: '#000', color: '#fff' }} />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #222', background: '#000', color: '#fff' }} />
                <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #222', background: '#000', color: '#fff' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '5px' }}>
                {categories.map(c => (
                  <button key={c.id} onClick={() => setCategory(c.id)} style={{ padding: '8px 12px', borderRadius: '20px', border: category === c.id ? `1px solid ${c.color}` : '1px solid #333', background: category === c.id ? `rgba(${hexToRgb(c.color)}, 0.15)` : '#000', color: category === c.id ? c.color : '#888', fontSize: '0.85em', fontWeight: 'bold' }}>{c.id}</button>
                ))}
              </div>
              
              <input type="text" placeholder="Location / Notes..." value={notes} onChange={e => setNotes(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #222', background: '#000', color: '#fff' }} />
              
              <button onClick={addAppointment} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginTop: '5px' }}>SCHEDULE LOG</button>
            </div>

            {/* LISTING UPCOMING */}
            {upcoming.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#555', padding: '20px 0' }}>No upcoming appointments scheduled.</div>
            ) : (
              upcoming.map(appt => {
                const catColor = categories.find(c => c.id === appt.category)?.color || '#888';
                return (
                  <div key={appt.id} style={{ background: '#111', borderRadius: '12px', padding: '15px', borderLeft: `4px solid ${catColor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ margin: '0 0 5px 0', color: '#fff' }}>{appt.title}</h3>
                        <p style={{ margin: 0, color: '#aaa', fontSize: '0.9em' }}>📅 {appt.date} {appt.time && `| ⏰ ${appt.time}`}</p>
                      </div>
                      <span style={{ color: catColor, fontSize: '0.75em', fontWeight: 'bold', textTransform: 'uppercase', background: '#000', padding: '4px 8px', borderRadius: '4px' }}>{appt.category}</span>
                    </div>
                    {appt.notes && <p style={{ color: '#888', margin: '10px 0 0 0', fontSize: '0.9em', fontStyle: 'italic' }}>{appt.notes}</p>}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      <button onClick={() => markCompleted(appt.id)} style={{ flex: 1, background: '#000', color: '#10b981', border: '1px solid #10b981', padding: '8px', borderRadius: '6px', fontWeight: 'bold' }}>MARK COMPLETED</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'Past' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {past.length === 0 ? (
               <div style={{ textAlign: 'center', color: '#555', padding: '40px 0' }}>History is empty.</div>
            ) : (
              past.map(appt => {
                const catColor = categories.find(c => c.id === appt.category)?.color || '#888';
                return (
                  <div key={appt.id} style={{ background: '#0a0a0a', borderRadius: '12px', padding: '15px', border: '1px solid #222', opacity: 0.7 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', color: '#888', textDecoration: 'line-through' }}>{appt.title}</h4>
                        <p style={{ margin: 0, color: '#555', fontSize: '0.85em' }}>{appt.date}</p>
                      </div>
                      <button onClick={() => deleteAppt(appt.id)} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75em', fontWeight: 'bold' }}>PURGE</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '128, 128, 128';
}
