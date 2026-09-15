import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalNotifications } from '@capacitor/local-notifications';

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

const BRING_OPTIONS = [
  'Birth Certificate',
  'Cash',
  'Checkbook',
  'Credit/Debit Card',
  'Driver\'s License',
  'Insurance Card',
  'Laptop',
  'Medical Records',
  'Medication List',
  'Notepad & Pen',
  'Passport',
  'Payment / Copay',
  'Proof of Address',
  'SS Card',
  'State ID',
  'Tool Kit',
  'Vehicle Title / Reg',
  'Vitals Log',
  'Water & Snacks'
];

export default function Appointments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Upcoming');
  
  // Core Form States
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('General');
  
  // Fully Separated Contact & Location
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [usState, setUsState] = useState('AZ');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Details
  const [meetingWith, setMeetingWith] = useState('');
  const [bookedBy, setBookedBy] = useState('');
  const [bringItems, setBringItems] = useState([]);
  const [customBring, setCustomBring] = useState('');
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

  const addBringItem = (item) => {
    if (item && !bringItems.includes(item)) {
      setBringItems([...bringItems, item]);
    }
    setCustomBring('');
  };

  const removeBringItem = (item) => {
    setBringItems(bringItems.filter(i => i !== item));
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  const addAppointment = async () => {
    if (!title || !date) {
      alert("Title and Date are required.");
      return;
    }
    
    // Build structured location string
    const locParts = [streetAddress, city, usState, zipCode].filter(Boolean);
    const fullLocation = locParts.length > 0 ? locParts.join(', ') : '';
    
    const newAppt = {
      id: Date.now().toString(),
      title,
      date,
      time,
      category,
      location: fullLocation,
      phone,
      email,
      meetingWith,
      bookedBy,
      bringAlong: bringItems,
      price,
      notes,
      status: 'upcoming'
    };

    if (time) {
      try {
        const apptDate = new Date(`${date}T${time}`);
        const dayBefore = new Date(apptDate.getTime() - (24 * 60 * 60 * 1000));
        const now = new Date();
        const notifs = [];
        const baseId = Math.floor(Math.random() * 100000);

        if (dayBefore > now) {
          notifs.push({
            title: `Reminder: ${title} Tomorrow`,
            body: `You have an appointment at ${time}.`,
            id: baseId,
            schedule: { at: dayBefore }
          });
        }

        if (apptDate > now) {
          notifs.push({
            title: `Appointment Now: ${title}`,
            body: fullLocation ? `Location: ${fullLocation}` : `It is time for your appointment.`,
            id: baseId + 1,
            schedule: { at: apptDate }
          });
        }

        if (notifs.length > 0) {
          await LocalNotifications.requestPermissions();
          await LocalNotifications.schedule({ notifications: notifs });
        }
      } catch (err) {
        console.error('Notification push failed:', err);
      }
    }
    
    const updated = [...appointments, newAppt].sort((a, b) => new Date(a.date) - new Date(b.date));
    setAppointments(updated);
    
    setTitle(''); setDate(''); setTime(''); setCategory('General');
    setStreetAddress(''); setCity(''); setUsState('AZ'); setZipCode('');
    setPhone(''); setEmail(''); setMeetingWith(''); setBookedBy(''); 
    setBringItems([]); setCustomBring(''); setPrice(''); setNotes('');
  };

  const markCompleted = (id) => {
    setAppointments(appointments.map(appt => 
      appt.id === id ? { ...appt, status: 'completed' } : appt
    ));
  };

  const deleteAppt = (id) => {
    setAppointments(appointments.filter(appt => appt.id !== id));
  };

  const formatPrice = (p) => {
    if (!p) return '';
    const num = parseFloat(p);
    return isNaN(num) ? p : `$${num.toFixed(2)}`;
  };

  const upcoming = appointments.filter(a => a.status === 'upcoming');
  const past = appointments.filter(a => a.status === 'completed');

  const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.6)', color: '#fff', width: '100%', boxSizing: 'border-box' };

  return (
    <div className="view-wrapper pb-safe" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <header className="header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '15px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#3b82f6', fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Appointments</h2>
      </header>

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
            
            <div style={{ background: 'rgba(17, 17, 17, 0.7)', padding: '15px', borderRadius: '12px', border: '1px dashed #555', display: 'flex', flexDirection: 'column', gap: '10px', backdropFilter: 'blur(5px)' }}>
              
              <input type="text" placeholder="Title (e.g., Oil Change, Dentist)*" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
                <input type="time" value={time} onChange={e => setTime(e.target.value)} style={inputStyle} />
              </div>
              
              <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '5px' }}>
                {categories.map(c => (
                  <button key={c.id} onClick={() => setCategory(c.id)} style={{ padding: '8px 12px', borderRadius: '20px', border: category === c.id ? `1px solid ${c.color}` : '1px solid rgba(255,255,255,0.2)', background: category === c.id ? `rgba(255,255,255,0.15)` : 'rgba(0,0,0,0.5)', color: category === c.id ? c.color : '#888', fontSize: '0.85em', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{c.id}</button>
                ))}
              </div>
              
              {/* Fully Separated Address Block */}
              <input type="text" placeholder="Street Address" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} style={inputStyle} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} style={{ ...inputStyle, flex: 2 }} />
                <select value={usState} onChange={e => setUsState(e.target.value)} style={{ ...inputStyle, flex: 1, padding: '12px 5px' }}>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input type="text" placeholder="ZIP" value={zipCode} onChange={e => setZipCode(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              </div>

              {/* Native Hooked Contact Info */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="tel" placeholder="Phone # (Optional)" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
                <input type="email" placeholder="Email (Optional)" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Meeting With (Optional)" value={meetingWith} onChange={e => setMeetingWith(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Booked By (Optional)" value={bookedBy} onChange={e => setBookedBy(e.target.value)} style={inputStyle} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.85em', color: '#aaa', fontWeight: 'bold' }}>Items to Bring:</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select onChange={e => { if(e.target.value) addBringItem(e.target.value); e.target.value=''; }} style={{...inputStyle, flex: 1}}>
                    <option value="">+ Add Preset...</option>
                    {BRING_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <div style={{ display: 'flex', flex: 1, gap: '5px' }}>
                    <input type="text" placeholder="Custom..." value={customBring} onChange={e => setCustomBring(e.target.value)} style={{...inputStyle, flex: 1}} onKeyDown={e => e.key === 'Enter' && addBringItem(customBring)} />
                    <button onClick={() => addBringItem(customBring)} style={{ background: '#10b981', color: '#000', border: 'none', borderRadius: '8px', padding: '0 12px', fontWeight: 'bold' }}>+</button>
                  </div>
                </div>
                {bringItems.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                    {bringItems.map(item => (
                      <span key={item} onClick={() => removeBringItem(item)} style={{ background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3b82f6', borderRadius: '15px', padding: '4px 10px', fontSize: '0.8em', color: '#fff', cursor: 'pointer' }}>
                        {item} ✕
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <input type="text" placeholder="Price/Cost (e.g., 20 or Free)" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} />

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
                    
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9em', color: '#ddd' }}>
                      
                      {/* NATIVE APP LINKS */}
                      {appt.location && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                          <span>📍 <strong>Location:</strong></span>
                          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                            <a href={`https://maps.google.com/?q=${encodeURIComponent(appt.location)}`} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold' }}>{appt.location}</a>
                            <button onClick={() => copyToClipboard(appt.location)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: '#fff', cursor: 'pointer', padding: '2px 6px', fontSize: '0.85em' }}>📋 Copy</button>
                          </div>
                        </div>
                      )}

                      {appt.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span>📞 <strong>Phone:</strong></span>
                          <a href={`tel:${appt.phone.replace(/[^0-9+]/g, '')}`} style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold' }}>{appt.phone}</a>
                        </div>
                      )}

                      {appt.email && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span>✉️ <strong>Email:</strong></span>
                          <a href={`mailto:${appt.email}`} style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold' }}>{appt.email}</a>
                        </div>
                      )}
                      
                      {appt.meetingWith && <div>🤝 <strong>Meeting:</strong> {appt.meetingWith}</div>}
                      {appt.bookedBy && <div>👤 <strong>Booked By:</strong> {appt.bookedBy}</div>}
                      
                      {appt.bringAlong && appt.bringAlong.length > 0 && (
                        <div>🎒 <strong>Bring:</strong> {Array.isArray(appt.bringAlong) ? appt.bringAlong.join(', ') : appt.bringAlong}</div>
                      )}
                      
                      {appt.price && <div>💰 <strong>Cost:</strong> {formatPrice(appt.price)}</div>}
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
