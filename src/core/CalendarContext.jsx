import React, { createContext, useState, useContext, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

const CalendarContext = createContext();

export function CalendarProvider({ children }) {
  const [globalDate, setGlobalDate] = useState(() => {
    const d = new Date();
    return localStorage.getItem('global_date') || `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  });

  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('global_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  const [alertCount, setAlertCount] = useState(0);
  const [alertColor, setAlertColor] = useState('#a855f7');

  useEffect(() => { localStorage.setItem('global_date', globalDate); }, [globalDate]);
  useEffect(() => { localStorage.setItem('global_reminders', JSON.stringify(reminders)); }, [reminders]);

  const addReminder = (date, text, module, priority = 'Normal') => {
    setReminders([...reminders, { id: Date.now().toString(), date, text, module, priority }]);
  };

  const removeReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const triggerNativeNotification = async (count) => {
    try {
      const permStatus = await LocalNotifications.requestPermissions();
      if (permStatus.display === 'granted') {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: "Tools of the Trade",
              body: `You have ${count} pending item(s) on your agenda today.`,
              id: 1,
              schedule: { at: new Date(Date.now() + 1000) } 
            }
          ]
        });
      }
    } catch (e) {}
  };

  const scanForAlerts = () => {
    let count = 0;
    let hasHigh = false;
    let hasNormal = false;
    let hasDone = false;

    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;
    const targetDateObj = new Date(y, now.getMonth(), now.getDate());

    const parseLocalDate = (dateStr) => {
      if (!dateStr) return new Date();
      try {
        const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
        const [py, pm, pd] = cleanStr.split('-').map(Number);
        return new Date(py, pm - 1, pd);
      } catch(e) { return new Date(); }
    };

    const shortDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const fleetDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    const dayName = shortDays[targetDateObj.getDay()];
    const fleetDayName = fleetDays[targetDateObj.getDay()];

    const getJSON = (k) => { try { return JSON.parse(localStorage.getItem(k)||'[]') || []; } catch { return []; } };
    const getObj = (k) => { try { return JSON.parse(localStorage.getItem(k)||'{}') || {}; } catch { return {}; } };

    // 1. Reminders
    reminders.forEach(r => {
      if (r.date === todayStr && !r.text.includes('[SUB RENEWAL]') && !r.text.includes('[BILL]') && !r.text.includes('[INCOME]')) {
        count++;
        if (r.priority === 'High') hasHigh = true;
        else if (r.priority === 'Done') hasDone = true;
        else hasNormal = true;
      }
    });

    // 2. Personal Shifts
    try {
      const shiftData = getObj('tot_shift_shifts');
      const startOfWeek = new Date(targetDateObj);
      startOfWeek.setDate(targetDateObj.getDate() - targetDateObj.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      if (targetDateObj >= startOfWeek && targetDateObj <= endOfWeek) {
        const dayShifts = shiftData[dayName];
        if (Array.isArray(dayShifts)) {
          dayShifts.forEach(shift => {
            if (shift && shift.start && shift.end && shift.start.trim() !== '' && shift.end.trim() !== '') {
              count++; hasDone = true; 
            }
          });
        }
      }
    } catch(e){}

    // 3. Fleet Schedules (Crew)
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
                count++; hasDone = true;
              }
            });
          }
        });
      }
    } catch(e){}

    // 4. Assets
    try {
      const assets = getJSON('tot_assets');
      if (Array.isArray(assets)) {
        assets.forEach(asset => {
          if (!asset) return;
          if (asset.date === todayStr) { count++; hasDone = true; }
          if (asset.date && asset.warranty && asset.warranty !== 'None' && asset.warranty !== 'Lifetime') {
            const expDate = parseLocalDate(asset.date);
            if (asset.warranty === '30 Days') expDate.setDate(expDate.getDate() + 30);
            else if (asset.warranty === '90 Days') expDate.setDate(expDate.getDate() + 90);
            else if (asset.warranty === '1 Year') expDate.setFullYear(expDate.getFullYear() + 1);
            else if (asset.warranty === '2 Years') expDate.setFullYear(expDate.getFullYear() + 2);
            else if (asset.warranty === '5 Years') expDate.setFullYear(expDate.getFullYear() + 5);

            const expDateStr = `${expDate.getFullYear()}-${String(expDate.getMonth() + 1).padStart(2, '0')}-${String(expDate.getDate()).padStart(2, '0')}`;
            if (expDateStr === todayStr) { count++; hasHigh = true; }
          }
        });
      }
    } catch(e){}

    // 5. Subscriptions
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

          if (isDue || sub.renewal.includes(todayStr)) { count++; hasHigh = true; }
        });
      }
    } catch(e){}

    // 6. Bills
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

          if (isDue || bill.due.includes(todayStr)) {
            count++;
            if (bill.isPaid) hasDone = true;
            else hasHigh = true;
          }
        });
      }
    } catch(e){}

    setAlertCount(count);
    
    let newColor = '#a855f7';
    if (hasHigh) newColor = '#ef4444';
    else if (hasNormal) newColor = '#a855f7';
    else if (hasDone) newColor = '#00cc66';
    
    setAlertColor(newColor);

    if (count > 0) {
      const lastNotified = localStorage.getItem('tot_last_notification');
      if (lastNotified !== todayStr) {
        triggerNativeNotification(count);
        localStorage.setItem('tot_last_notification', todayStr);
      }
    }
  };

  useEffect(() => {
    scanForAlerts();
    const interval = setInterval(scanForAlerts, 2000);
    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <CalendarContext.Provider value={{ globalDate, setGlobalDate, reminders, addReminder, removeReminder, alertCount, alertColor }}>
      {children}
    </CalendarContext.Provider>
  );
}

export const useCalendar = () => useContext(CalendarContext);
