import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MasterCalendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);

  // --- CALENDAR GRID MATH ---
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 (Sun) to 6 (Sat)
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  // --- MASTER WRAPPER SCANNER ---
  useEffect(() => {
    const scanModules = () => {
      const incomes = JSON.parse(localStorage.getItem('tot_incomes')) || [];
      const bills = JSON.parse(localStorage.getItem('tot_bills')) || [];
      const assets = JSON.parse(localStorage.getItem('tot_assets')) || [];
      const dotLogs = JSON.parse(localStorage.getItem('hos_dotArchives')) || [];
      const invoices = JSON.parse(localStorage.getItem('hos_invoiceArchives')) || [];

      let globalEvents = [];

      // --- 1. BUDGET ENGINE: INCOMES & BILLS (WITH RECURRENCE) ---
      const processRecurring = (items, type, color) => {
        const viewStart = new Date(currentYear, currentMonth, 1);
        const viewEnd = new Date(currentYear, currentMonth + 1, 0);

        items.forEach(item => {
          const baseDateStr = item.date || item.dueDate;
          if (!baseDateStr) return;
          const [y, m, d] = baseDateStr.split('-');
          const baseDate = new Date(y, m - 1, d);

          if (item.frequency === 'None') {
            globalEvents.push({ id: `${type}_${item.id}`, date: baseDateStr, title: item.name, type, amount: item.amount, color, isPaid: item.isPaid });
          } else if (item.frequency === 'Monthly') {
             const targetDate = new Date(currentYear, currentMonth, baseDate.getDate());
             if (targetDate >= baseDate) {
                globalEvents.push({ id: `${type}_${item.id}_M`, date: targetDate.toISOString().split('T')[0], title: `${item.name} 🔁`, type, amount: item.amount, color, isPaid: item.isPaid });
             }
          } else if (item.frequency === 'Weekly' || item.frequency === 'Bi-Weekly') {
             const interval = item.frequency === 'Weekly' ? 7 : 14;
             let stepDate = new Date(baseDate);
             while (stepDate <= viewEnd) {
               if (stepDate >= viewStart && stepDate >= baseDate) {
                 globalEvents.push({ id: `${type}_${item.id}_${stepDate.getTime()}`, date: stepDate.toISOString().split('T')[0], title: `${item.name} 🔁`, type, amount: item.amount, color, isPaid: item.isPaid });
               }
               stepDate.setDate(stepDate.getDate() + interval);
             }
          }
        });
      };
      
      processRecurring(incomes, 'Income', '#10b981'); // Green
      processRecurring(bills, 'Bill', '#ef4444');    // Red

      // --- 2. ASSET LEDGER: WARRANTY EXPIRATIONS ---
      assets.forEach(a => {
        if (a.warranty !== 'None' && a.warranty !== 'Lifetime' && a.date) {
           const [y, m, d] = a.date.split('-');
           let exp = new Date(y, m - 1, d);
           if (a.warranty === '30 Days') exp.setDate(exp.getDate() + 30);
           if (a.warranty === '90 Days') exp.setDate(exp.getDate() + 90);
           if (a.warranty === '1 Year') exp.setFullYear(exp.getFullYear() + 1);
           if (a.warranty === '2 Years') exp.setFullYear(exp.getFullYear() + 2);
           if (a.warranty === '5 Years') exp.setFullYear(exp.getFullYear() + 5);
           
           globalEvents.push({ id: `ast_${a.id}`, date: exp.toISOString().split('T')[0], title: `Warranty: ${a.name}`, type: 'Asset', color: '#a855f7' }); // Purple
        }
      });

      // --- 3. CHRONOS HUB: LOGS & INVOICES ---
      dotLogs.forEach(d => {
         const dObj = new Date(d.date);
         if (!isNaN(dObj)) globalEvents.push({ id: `dot_${d.id}`, date: dObj.toISOString().split('T')[0], title: `DOT Shift Log`, type: 'DOT', color: '#3b82f6' }); // Blue
      });
      invoices.forEach(i => {
         const dObj = new Date(i.date);
         if (!isNaN(dObj)) globalEvents.push({ id: `inv_${i.id}`, date: dObj.toISOString().split('T')[0], title: `Contractor Job`, type: 'Job', amount: i.total, color: '#f59e0b' }); // Orange
      });

      setEvents(globalEvents);
    };

    scanModules(); // Run immediately on render
    const intervalId = setInterval(scanModules, 2000); // Poll every 2 seconds
    return () => clearInterval(intervalId);
  }, [currentYear, currentMonth]); // Re-run math when user changes the month view

  // --- RENDER HELPERS ---
  const handleDayClick = (day) => {
    const clickedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = events.filter(e => e.date === clickedDateStr);
    if (dayEvents.length > 0) setSelectedDayEvents({ date: clickedDateStr, list: dayEvents });
  };

  const renderCells = () => {
    const cells = [];
    const todayStr = new Date().toISOString().split('T')[0];

    // Blank cells for days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<div key={`blank_${i}`} style={{ background: '#0a0a0a', border: '1px solid #222', minHeight: '80px' }}></div>);
    }

    // Actual month days
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === cellDateStr);
      const isToday = cellDateStr === todayStr;

      cells.push(
        <div key={day} onClick={() => handleDayClick(day)} style={{ background: isToday ? 'rgba(59, 130, 246, 0.2)' : '#111', border: isToday ? '1px solid #3b82f6' : '1px solid #333', minHeight: '80px', padding: '5px', display: 'flex', flexDirection: 'column', cursor: dayEvents.length > 0 ? 'pointer' : 'default' }}>
          <span style={{ color: isToday ? '#3b82f6' : '#fff', fontWeight: 'bold', fontSize: '0.9em', alignSelf: 'flex-end' }}>{day}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '5px', overflowY: 'hidden' }}>
            {dayEvents.slice(0, 3).map((e, idx) => (
              <div key={idx} style={{ background: e.color, color: '#fff', fontSize: '0.6em', padding: '2px 4px', borderRadius: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 'bold', textDecoration: e.isPaid ? 'line-through' : 'none' }}>
                {e.title}
              </div>
            ))}
            {dayEvents.length > 3 && <span style={{ color: '#888', fontSize: '0.7em', textAlign: 'center' }}>+{dayEvents.length - 3} more</span>}
          </div>
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
          <h2 style={{ margin: 0, color: '#a855f7', fontSize: '1.2em' }}>Master Calendar</h2>
        </div>
      </header>

      {/* MONTH NAVIGATION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 15px', background: '#111', borderBottom: '1px solid #222' }}>
        <button onClick={prevMonth} style={{ background: '#222', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '6px', fontWeight: 'bold' }}>◀ Prev</button>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.4em' }}>{monthNames[currentMonth]} {currentYear}</h2>
          <button onClick={goToToday} style={{ background: 'transparent', color: '#3b82f6', border: 'none', marginTop: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Go to Today</button>
        </div>
        <button onClick={nextMonth} style={{ background: '#222', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Next ▶</button>
      </div>

      {/* CALENDAR GRID */}
      <div style={{ padding: '10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 'bold', color: '#888', marginBottom: '10px', fontSize: '0.85em' }}>
          <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', background: '#222', border: '1px solid #222' }}>
          {renderCells()}
        </div>
      </div>

      {/* DAILY EVENT MODAL */}
      {selectedDayEvents && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #a855f7', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2 style={{ color: '#a855f7', margin: 0, textTransform: 'uppercase' }}>{selectedDayEvents.date}</h2>
            <button onClick={() => setSelectedDayEvents(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}>Close</button>
          </div>

          {selectedDayEvents.list.map((e, idx) => (
            <div key={idx} style={{ background: '#111', borderLeft: `4px solid ${e.color}`, padding: '15px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: e.color, fontWeight: 'bold', fontSize: '0.8em', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>{e.type}</span>
                <strong style={{ color: '#fff', fontSize: '1.1em', textDecoration: e.isPaid ? 'line-through' : 'none' }}>{e.title}</strong>
              </div>
              {e.amount && <div style={{ color: e.color, fontWeight: 'bold', fontSize: '1.2em' }}>${parseFloat(e.amount).toFixed(2)}</div>}
            </div>
          ))}
          
          <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic', marginTop: '20px', fontSize: '0.9em' }}>
            Close this menu and tap the module in the Hub to edit these entries.
          </p>
        </div>
      )}

    </div>
  );
}
