import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Appointments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Upcoming');
  
  // Core Form States
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('General');
  
  // Expanded Detail States
  const [location, setLocation] = useState('');
  const [meetingWith, setMeetingWith] = useState('');
  const [bookedBy, setBookedBy] = useState('');
  const [bringAlong, setBringAlong] = useState('');
  const [price, setPrice] = useState('');
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
      location,
      meetingWith,
      bookedBy,
      bringAlong,
      price,
      notes,
      status: 'upcoming'
    };
    
    // Sort by date automatically
    const updated = [...appointments, newAppt].sort((a, b) => new Date(a.date) - new Date(b.date));
    setAppointments(updated);
    
    // Reset form
    setTitle(''); setDate(''); setTime(''); setCategory('General');
    setLocation(''); setMeetingWith(''); setBookedBy(''); setBringAlong(''); setPrice(''); setNotes('');
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

  // Reusable styling for the new inputs
  const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.6)', color: '#fff', width: '100%', boxSizing: 'border-box' };

  return (
    <div className="view-wrapper pb-safe" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER */}
      <header className="header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '15px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#3b82f6', fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Appointments</h2>
      </header>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '10px', padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)' }}>
        <button 
          onClick={() => setActiveTab('Upcoming')}
          style={{ flex: 1, padding: '10px', background: activeTab === 'Upcoming' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(0,0,0,0.6)', color: activeTab === 'Upcoming' ? '#3b82f6' : '#888', border: activeTab === 'Upcoming' ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontWeight: 'bold', transition: 'all 0.2s', backdropFilter: 'blur(4px)' }}>
          Upcoming
        </button>
        <button 
          onClick={() => setActiveTab('Past')}
          style={{ flex: 1, padding: '10px', background: activeTab === 'Past' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0,0,0,0.6)', color: activeTab === 'Past' ? '#10b981' : '#888', border: activeTab === 'Past' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontWeight: 'bold', transition: 'all 0.2s', backdropFilter: 'blur(4px)' }}>
          History
        </button>
      </div>

      <div style={{ padding: '20px', overflowY: 'auto', paddingBottom: '100px' }}>
        
        {activeTab === 'Upcoming' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* CREATION BLOCK */}
            <div style={{ background: 'rgba(17, 17, 17, 0.7)', padding: '15px', borderRadius: '12px', border: '1px dashed #555', display: 'flex', flexDirection: 'column', gap: '10px', backdropFilter: 'blur(5px)' }}>
              
              <input type="text" placeholder="Title (e.g., Oil Change, Dentist)*" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
                <input type="time" value={time} onChange={e => setTime(e.target.value)} style={inputStyle} />
              </div>
              
              <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '5px' }}>
                {categories.map(c => (
                  <button key={c.id} onClick={() => setCategory(c.id)} style={{ padding: '8px 12px', borderRadius: '20px', border: category === c.id ? `1px solid ${c.color}` : '1px solid rgba(255,255,255,0.2)', background: category === c.id ? `rgba(255,255,255,0.15)` : 'rgba(0,0,0,0.5)', color: category === c.id ? c.color : '#888', fontSize: '0.85em', fontWeight: 'bold' }}>{c.id}</button>
                ))}
              </div>
              
              <input type="text" placeholder="Location / Address" value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Meeting With (Optional)" value={meetingWith} onChange={e => setMeetingWith(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Booked By (Optional)" value={bookedBy} onChange={e => setBookedBy(e.target.value)} style={inputStyle} />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Bring Along (Optional)" value={bringAlong} onChange={e => setBringAlong(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Price/Cost (Optional)" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} />
              </div>

              <textarea placeholder="Additional Notes..." value={notes} onChange={e => setNotes(e.target.value)} rows="3" style={{ ...inputStyle, resize: 'none' }} />
              
              <button onClick={addAppointment} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginTop: '5px', boxShadow: '0 4px 6px rgba(0,0,0,0.5)' }}>SCHEDULE LOG</button>
            </div>

            {/* LISTING UPCOMING */}
            {upcoming.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#ccc', padding: '20px 0', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>No upcoming appointments scheduled.</div>
            ) : (
              upcoming.map(appt => {
                const catColor = categories.find(c => c.id === appt.category)?.color || '#888';
                return (
                  <div key={appt.id} style={{ background: 'rgba(17, 17, 17, 0.85)', borderRadius: '12px', padding: '15px', borderLeft: `4px solid ${catColor}`, backdropFilter: 'blur(4px)', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ margin: '0 0 5px 0', color: '#fff' }}>{appt.title}</h3>
                        <p style={{ margin: 0, color: '#aaa', fontSize: '0.9em' }}>📅 {appt.date} {appt.time && `| ⏰ ${appt.time}`}</p>
                      </div>
                      <span style={{ color: catColor, fontSize: '0.75em', fontWeight: 'bold', textTransform: 'uppercase', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px' }}>{appt.category}</span>
                    </div>
                    
                    {/* Conditionally rendered extra details */}
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9em', color: '#ddd' }}>
                      {appt.location && <div>📍 <strong>Location:</strong> {appt.location}</div>}
                      {appt.meetingWith && <div>🤝 <strong>Meeting:</strong> {appt.meetingWith}</div>}
                      {appt.bookedBy && <div>👤 <strong>Booked By:</strong> {appt.bookedBy}</div>}
                      {appt.bringAlong && <div>🎒 <strong>Bring:</strong> {appt.bringAlong}</div>}
                      {appt.price && <div>💰 <strong>Cost:</strong> {appt.price}</div>}
                      {appt.notes && <div style={{ color: '#aaa', fontStyle: 'italic', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>"{appt.notes}"</div>}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      <button onClick={() => markCompleted(appt.id)} style={{ flex: 1, background: 'rgba(0,0,0,0.6)', color: '#10b981', border: '1px solid #10b981', padding: '8px', borderRadius: '6px', fontWeight: 'bold' }}>MARK COMPLETED</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'Past' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {past.length === 0 ? (
               <div style={{ textAlign: 'center', color: '#ccc', padding: '40px 0', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>History is empty.</div>
            ) : (
              past.map(appt => {
                const catColor = categories.find(c => c.id === appt.category)?.color || '#888';
                return (
                  <div key={appt.id} style={{ background: 'rgba(10, 10, 10, 0.8)', borderRadius: '12px', padding: '15px', border: '1px solid rgba(255,255,255,0.1)', opacity: 0.85, backdropFilter: 'blur(4px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', color: '#888', textDecoration: 'line-through' }}>{appt.title}</h4>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.85em' }}>{appt.date}</p>
                      </div>
                      <button onClick={() => deleteAppt(appt.id)} style={{ background: 'rgba(0,0,0,0.5)', color: '#ef4444', border: '1px solid #ef4444', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75em', fontWeight: 'bold' }}>PURGE</button>
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
