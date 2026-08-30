import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../core/CalendarContext';

export default function CalendarHub() {
  const navigate = useNavigate();
  const { globalDate, setGlobalDate, reminders, addReminder, removeReminder } = useCalendar();

  const parseLocalDate = (dateStr) => {
    if (!dateStr) return new Date();
    try {
      const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
      const [y, m, d] = cleanStr.split('-').map(Number);
      return new Date(y, m - 1, d); 
    } catch (e) { return new Date(); }
  };

  const [viewDate, setViewDate] = useState(parseLocalDate(globalDate));
  const [newText, setNewText] = useState('');
  const [newPriority, setNewPriority] = useState('Normal');

  useEffect(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;
    setGlobalDate(todayStr);
    setViewDate(new Date(y, now.getMonth(), now.getDate()));
  }, [setGlobalDate]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const shortDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const fleetDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getAllEventsForDate = (dateStr) => {
    let events = [];
    const getJSON = (k) => { try { return JSON.parse(localStorage.getItem(k)||'[]') || []; } catch { return []; } };
    const getObj = (k) => { try { return JSON.parse(localStorage.getItem(k)||'{}') || {}; } catch { return {}; } };

    if (Array.isArray(reminders)) {
      reminders.forEach(r => {
        if (r && r.date === dateStr && r.text && !r.text.includes('[SUB RENEWAL]') && !r.text.includes('[BILL]') && !r.text.includes('[INCOME]')) {
          events.push({ ...r, isDynamic: false });
        }
      });
    }

    const targetDateObj = parseLocalDate(dateStr);
    const dayName = shortDays[targetDateObj.getDay()];
    const fleetDayName = fleetDays[targetDateObj.getDay()];

    // LIVE TASKLIST PULLER
    try {
      const tasklists = getJSON('fleet_sops');
      if (Array.isArray(tasklists)) {
        tasklists.forEach(list => {
          if (list.scheduledDate === dateStr) {
            const total = list.tasks ? list.tasks.length : 0;
            const done = list.tasks ? list.tasks.filter(t => t.done).length : 0;
            const progress = total === 0 ? 0 : Math.round((done / total) * 100);
            let prio = 'High';
            if (progress === 100) prio = 'Done';
            else if (progress > 0) prio = 'Normal';
            events.push({
              id: `live_sop_${list.id}`,
              text: `[TASKLIST] ${list.title} (${progress}%)`,
              module: 'Tasklist Creator',
              priority: prio,
              isDynamic: true
            });
          }
        });
      }
    } catch (e) {}

    try {
      const shiftData = getObj('tot_shift_shifts');
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
            if (shift && shift.start && shift.end && shift.start.trim() !== '' && shift.end.trim() !== '') {
              events.push({ id: `shift_${dayName}_${idx}`, text: `[SHIFT] ${shift.start} to ${shift.end}`, module: 'My Schedule', priority: 'Done', isDynamic: true });
            }
          });
        }
      }
    } catch (e) {}

    try {
      const fleetSchedules = getJSON('fleet_schedules');
      if (Array.isArray(fleetSchedules)) {
        fleetSchedules.forEach(week => {
          if (!week || !week.weekDate) return;
          const weekStart = parseLocalDate(week.weekDate);
          const diffDays = Math.round((targetDateObj - weekStart) / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays <= 6) {
            (week.roster || []).forEach(emp => {
              const shift = (week.shifts && week.shifts[emp.id]) ? week.shifts[emp.id][fleetDayName] : null;
              if (shift && shift.in && shift.out && shift.in.trim() !== '') {
                events.push({ id: `fleet_${emp.id}_${dateStr}`, text: `[CREW] ${emp.name || 'Worker'}: ${shift.in} to ${shift.out}`, module: 'Fleet Payroll', priority: 'Done', isDynamic: true });
              }
            });
          }
        });
      }
    } catch(e) {}

    try {
      const assets = getJSON('tot_assets');
      if (Array.isArray(assets)) {
        assets.forEach(asset => {
          if (!asset) return;
          if (asset.date === dateStr) {
            events.push({ id: `asset_purch_${asset.id || Math.random()}`, text: `[PURCHASED] ${asset.name || 'Logged Item'}`, module: 'Asset Ledger', priority: 'Done', isDynamic: true });
          }
          if (asset.date && asset.warranty && asset.warranty !== 'None' && asset.warranty !== 'Lifetime') {
            const expDate = parseLocalDate(asset.date);
            if (asset.warranty === '30 Days') expDate.setDate(expDate.getDate() + 30);
            else if (asset.warranty === '90 Days') expDate.setDate(expDate.getDate() + 90);
            else if (asset.warranty === '1 Year') expDate.setFullYear(expDate.getFullYear() + 1);
            else if (asset.warranty === '2 Years') expDate.setFullYear(expDate.getFullYear() + 2);
            else if (asset.warranty === '5 Years') expDate.setFullYear(expDate.getFullYear() + 5);

            const expDateStr = `${expDate.getFullYear()}-${String(expDate.getMonth() + 1).padStart(2, '0')}-${String(expDate.getDate()).padStart(2, '0')}`;
            if (expDateStr === dateStr) {
              events.push({ id: `asset_exp_${asset.id || Math.random()}`, text: `[WARRANTY EXPIRING] ${asset.name || 'Logged Item'}`, module: 'Asset Ledger', priority: 'High', isDynamic: true });
            }
          }
        });
      }
    } catch (e) {}

    try {
      const subs = getJSON('fleet_subscriptions');
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
            events.push({ id: `sub_${sub.id || Math.random()}_${dateStr}`, text: `[RENEWAL] ${sub.name || 'Sub'} - $${safeCost}`, module: 'Subscriptions', priority: 'High', isDynamic: true });
          }
        });
      }
    } catch (e) {}

    try {
      const bills = getJSON('tot_bills');
      if (Array.isArray(bills)) {
        bills.forEach(bill => {
          if (!bill || !bill.due) return;
          const dueDate = parseLocalDate(bill.due);
          const freq = String(bill.frequency || '').toLowerCase();
          let isDue = false;

          if (targetDateObj >= dueDate) {
            const daysSince = Math.round((targetDateObj - dueDate) / (1000 * 60 * 60 * 24));
            const monthDiff = (targetDateObj.getFullYear() - dueDate.getFullYear()) * 12 + (targetDateObj.getMonth() - dueDate.getMonth());

            if (freq === 'weekly' && daysSince % 7 === 0) isDue = true;
            else if (freq === 'bi-weekly' && daysSince % 14 === 0) isDue = true;
            else if (freq === 'monthly' && targetDateObj.getDate() === dueDate.getDate()) isDue = true;
            else if (freq === 'bi-monthly' && monthDiff % 2 === 0 && targetDateObj.getDate() === dueDate.getDate()) isDue = true;
            else if (freq === 'quarterly' && monthDiff % 3 === 0 && targetDateObj.getDate() === dueDate.getDate()) isDue = true;
            else if (freq === 'bi-yearly' && monthDiff % 6 === 0 && targetDateObj.getDate() === dueDate.getDate()) isDue = true;
            else if (freq === 'yearly' && targetDateObj.getMonth() === dueDate.getMonth() && targetDateObj.getDate() === dueDate.getDate()) isDue = true;
          }

          if (isDue || bill.due.includes(dateStr)) {
            const safeCost = parseFloat(String(bill.cost || 0).replace(/[^0-9.]/g, '')).toFixed(2);
            events.push({ id: `bill_${bill.id || Math.random()}_${dateStr}`, text: `[BILL] ${bill.name || 'Liability'} - $${safeCost}`, module: 'Budget Engine', priority: bill.isPaid ? 'Done' : 'High', isDynamic: true });
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
        {dayEvts.slice(0, 3).map((r, i) => <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: r.priority === 'High' ? '#ef4444' : r.priority === 'Done' ? '#00cc66' : '#a855f7' }} />)}
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
                <div key={day} onClick={() => handleDayClick(day)} style={{ padding: '12px 0', textAlign: 'center', borderRadius: '8px', cursor: 'pointer', background: isSelected ? 'rgba(0, 255, 255, 0.15)' : '#000', border: isSelected ? '1px solid #00ffff' : '1px solid #222', color: isSelected ? '#00ffff' : '#fff' }}>
                  <div style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>{day}</div>
                  {renderDots(dayEvts)}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ ...cardStyle, borderTop: '4px solid #a855f7' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
            <span>Agenda:</span><span style={{ color: '#a855f7' }}>{parseLocalDate(globalDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
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
              <option value="Normal">Normal</option><option value="High">High ⚠️</option><option value="Done">Done ✓</option>
            </select>
          </div>
          <button onClick={handleAdd} style={{ width: '100%', padding: '12px', background: '#222', color: '#00ffff', border: '1px dashed #00ffff', borderRadius: '8px', marginTop: '10px', fontWeight: 'bold' }}>+ Log to Agenda</button>
        </div>
      </div>
    </div>
  );
}
