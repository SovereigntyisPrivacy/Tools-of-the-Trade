import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MasterCalendar() {
  const navigate = useNavigate();
  
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [events, setEvents] = useState([]);
  
  // Custom Agenda State
  const [customEvents, setCustomEvents] = useState(() => JSON.parse(localStorage.getItem('tot_custom_agenda')) || []);
  const [customText, setCustomText] = useState('');
  const [customType, setCustomType] = useState('Normal');

  // --- CALENDAR MATH ---
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

  // --- DATE NORMALIZER (Crucial for unifying different app formats) ---
  const normalizeDate = (dStr) => {
    if (!dStr) return null;
    if (dStr.includes('/')) {
      const parts = dStr.split('/');
      return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
    }
    return dStr; 
  };

  const toYMD = (dateObj) => `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

  // Save custom events whenever they change
  useEffect(() => {
    localStorage.setItem('tot_custom_agenda', JSON.stringify(customEvents));
  }, [customEvents]);

  // --- MASTER WRAPPER SCANNER ---
  useEffect(() => {
    const scanModules = () => {
      let globalEvents = [...customEvents];

      const incomes = JSON.parse(localStorage.getItem('tot_incomes')) || [];
      const bills = JSON.parse(localStorage.getItem('tot_bills')) || [];
      const assets = JSON.parse(localStorage.getItem('tot_assets')) || [];
      const dotLogs = JSON.parse(localStorage.getItem('hos_dotArchives')) || [];
      const invoices = JSON.parse(localStorage.getItem('hos_invoiceArchives')) || [];

      const viewStart = new Date(currentYear, currentMonth, 1);
      const viewEnd = new Date(currentYear, currentMonth + 1, 0);

      // 1. BUDGET RECURRENCE ENGINE
      const processRecurring = (items, type, color) => {
        items.forEach(item => {
          const rawDate = item.date || item.dueDate;
          if (!rawDate) return;
          const [y, m, d] = rawDate.split('-');
          const baseDate = new Date(y, m - 1, d);

          if (item.frequency === 'None') {
            globalEvents.push({ id: `${type}_${item.id}`, date: rawDate, title: `${type}: ${item.name}`, amount: item.amount, color, isPaid: item.isPaid });
          } else if (item.frequency === 'Monthly') {
             const targetDate = new Date(currentYear, currentMonth, baseDate.getDate());
             if (targetDate >= baseDate) {
                globalEvents.push({ id: `${type}_${item.id}_M`, date: toYMD(targetDate), title: `${type}: ${item.name} 🔁`, amount: item.amount, color, isPaid: item.isPaid });
             }
          } else if (item.frequency === 'Weekly' || item.frequency === 'Bi-Weekly') {
             const interval = item.frequency === 'Weekly' ? 7 : 14;
             let stepDate = new Date(baseDate);
             let safety = 0;
             while (stepDate <= viewEnd && safety < 100) {
               if (stepDate >= viewStart && stepDate >= baseDate) {
                 globalEvents.push({ id: `${type}_${item.id}_${stepDate.getTime()}`, date: toYMD(stepDate), title: `${type}: ${item.name} 🔁`, amount: item.amount, color, isPaid: item.isPaid });
               }
               stepDate.setDate(stepDate.getDate() + interval);
               safety++;
             }
          }
        });
      };
      
      processRecurring(incomes, 'Income', '#10b981'); 
      processRecurring(bills, 'Bill', '#ef4444');

      // 2. ASSET LEDGER (WarrantIES)
      assets.forEach(a => {
        if (a.warranty !== 'None' && a.warranty !== 'Lifetime' && a.date) {
           const [y, m, d] = a.date.split('-');
           let exp = new Date(y, m - 1, d);
           if (a.warranty === '30 Days') exp.setDate(exp.getDate() + 30);
           if (a.warranty === '90 Days') exp.setDate(exp.getDate() + 90);
           if (a.warranty === '1 Year') exp.setFullYear(exp.getFullYear() + 1);
           if (a.warranty === '2 Years') exp.setFullYear(exp.getFullYear() + 2);
           if (a.warranty === '5 Years') exp.setFullYear(exp.getFullYear() + 5);
           globalEvents.push({ id: `ast_${a.id}`, date: toYMD(exp), title: `Warranty Exp: ${a.name}`, color: '#a855f7' }); 
        }
      });

      // 3. CHRONOS HUB (Logs & Jobs)
      dotLogs.forEach(d => {
         const normDate = normalizeDate(d.date);
         if (normDate) globalEvents.push({ id: `dot_${d.id}`, date: normDate, title: `DOT Shift Logged`, color: '#3b82f6' });
      });
      invoices.forEach(i => {
         const normDate = normalizeDate(i.date);
         if (normDate) globalEvents.push({ id: `inv_${i.id}`, date: normDate, title: `Job Invoice`, amount: i.total, color: '#f59e0b' });
      });

      setEvents(globalEvents);
    };

    scanModules();
    const intervalId = setInterval(scanModules, 2000); 
    return () => clearInterval(intervalId);
  }, [currentYear, currentMonth, customEvents]); 

  // --- ACTIONS ---
  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  
  const handleDayClick = (day) => {
    const clickedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(clickedDateStr);
  };

  const handleAddCustomEvent = () => {
    if (!customText) return;
    let color = '#fff';
    if (customType === 'Priority') color = '#f59e0b';
    if (customType === 'Urgent') color = '#ef4444';
    if (customType === 'Task') color = '#3b82f6';

    const newEvent = { id: `custom_${Date.now()}`, date: selectedDate, title: customText, color: color, isCustom: true };
    setCustomEvents([...customEvents, newEvent]);
    setCustomText('');
  };

  const deleteCustomEvent = (id) => {
    setCustomEvents(customEvents.filter(e => e.id !== id));
  };

  // --- RENDER GRID ---
  const renderCells = () => {
    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<div key={`blank_${i}`} style={{ background: '#0a0a0a', border: '1px solid #111', minHeight: '60px' }}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cellDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === cellDateStr);
      const isSelected = cellDateStr === selectedDate;
      const isToday = cellDateStr === todayStr;

      cells.push(
        <div key={day} onClick={() => handleDayClick(day)} style={{ background: '#111', border: isSelected ? '2px solid #06b6d4' : '1px solid #222', minHeight: '60px', padding: '5px', display: 'flex', flexDirection: 'column', cursor: 'pointer', position: 'relative' }}>
          <span style={{ color: isSelected ? '#06b6d4' : isToday ? '#10b981' : '#fff', fontWeight: 'bold', fontSize: '0.9em', alignSelf: 'center', marginBottom: '5px' }}>{day}</span>
          
          {dayEvents.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', justifyContent: 'center' }}>
              {dayEvents.slice(0, 4).map((e, idx) => (
                <div key={idx} style={{ width: '8px', height: '8px', borderRadius: '50%', background: e.color }}></div>
              ))}
              {dayEvents.length > 4 && <span style={{ color: '#888', fontSize: '0.6em' }}>+</span>}
            </div>
          )}
        </div>
      );
    }
    return cells;
  };

  const selectedDayEvents = events.filter(e => e.date === selectedDate);
  const displayDateText = new Date(selectedDate + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const inputStyle = { background: '#111', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '6px' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Master Calendar</h2>
        </div>
      </header>

      {/* MONTH NAVIGATION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#111', borderBottom: '1px solid #222', borderRadius: '12px 12px 0 0', margin: '10px 10px 0 10px' }}>
        <button onClick={prevMonth} style={{ background: '#222', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>◀</button>
        <h2 style={{ margin: 0, color: '#ef4444', fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '1px' }}>{monthNames[currentMonth]} {currentYear}</h2>
        <button onClick={nextMonth} style={{ background: '#222', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>▶</button>
      </div>

      {/* CALENDAR GRID */}
      <div style={{ padding: '0 10px 10px 10px', background: '#111', borderRadius: '0 0 12px 12px', margin: '0 10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 'bold', color: '#888', padding: '10px 0', fontSize: '0.85em' }}>
          <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {renderCells()}
        </div>
      </div>

      {/* AGENDA SECTION (MATCHING SCREENSHOT) */}
      <div style={{ background: '#111', margin: '15px 10px 100px 10px', borderRadius: '12px', padding: '20px', borderTop: '4px solid #a855f7' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>
          <h3 style={{ color: '#ef4444', margin: 0 }}>Agenda:</h3>
          <span style={{ color: '#a855f7', fontWeight: 'bold' }}>{displayDateText}</span>
        </div>

        {selectedDayEvents.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', margin: '30px 0' }}>No events or data found for this day.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {selectedDayEvents.map((e, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0a0a', padding: '12px', borderRadius: '8px', borderLeft: `3px solid ${e.color}` }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: e.color, fontWeight: 'bold', fontSize: '0.95em', textDecoration: e.isPaid ? 'line-through' : 'none' }}>{e.title}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {e.amount && <span style={{ color: e.color, fontWeight: 'bold' }}>${parseFloat(e.amount).toFixed(2)}</span>}
                  {e.isCustom && <button onClick={() => deleteCustomEvent(e.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.2em', fontWeight: 'bold' }}>×</button>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', borderTop: '1px dashed #333', paddingTop: '20px' }}>
          <input type="text" placeholder="Add custom event..." value={customText} onChange={(e) => setCustomText(e.target.value)} style={{ ...inputStyle, flex: 2, margin: 0 }} />
          <select value={customType} onChange={(e) => setCustomType(e.target.value)} style={{ ...inputStyle, flex: 1, margin: 0 }}>
            <option>Normal</option>
            <option>Task</option>
            <option>Priority</option>
            <option>Urgent</option>
          </select>
        </div>
        <button onClick={handleAddCustomEvent} style={{ width: '100%', background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', border: '1px solid #06b6d4', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em', marginTop: '15px' }}>
          + Log to Agenda
        </button>
      </div>

    </div>
  );
}
