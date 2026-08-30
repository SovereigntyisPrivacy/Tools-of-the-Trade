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

  const triggerImmediateNotification = async (count) => {
    try {
      const permStatus = await LocalNotifications.requestPermissions();
      if (permStatus.display === 'granted') {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: "Tools of the Trade",
              body: `You have ${count} pending item(s) on your agenda today.`,
              id: 9999, // Static ID so it overwrites itself instead of spamming
              schedule: { at: new Date(Date.now() + 1000) }
            }
          ]
        });
      }
    } catch (e) {}
  };

  const syncOSNotifications = async () => {
    try {
      const permStatus = await LocalNotifications.requestPermissions();
      if (permStatus.display !== 'granted') return;

      const pending = await LocalNotifications.getPending();
      if (pending && pending.notifications.length > 0) {
        await LocalNotifications.cancel(pending);
      }

      let futureNotifs = [];
      let idCounter = 1;
      const getJSON = (k) => { try { return JSON.parse(localStorage.getItem(k)||'[]') || []; } catch { return []; } };
      const now = new Date();

      getJSON('fleet_sops').forEach(list => {
        if (list.scheduledDate && (!list.tasks || list.tasks.some(t => !t.done))) {
          const [y, m, d] = list.scheduledDate.split('-').map(Number);
          const targetDate = new Date(y, m - 1, d, 9, 0, 0); 
          if (targetDate > now) {
            futureNotifs.push({ title: "Tasklist Due", body: list.title, id: idCounter++, schedule: { at: targetDate } });
          }
        }
      });

      reminders.forEach(r => {
        if (r.date && !r.text.includes('[SUB RENEWAL]') && !r.text.includes('[BILL]')) {
          const [y, m, d] = r.date.split('-').map(Number);
          const targetDate = new Date(y, m - 1, d, 9, 0, 0);
          if (targetDate > now) {
            futureNotifs.push({ title: "Agenda Reminder", body: r.text, id: idCounter++, schedule: { at: targetDate } });
          }
        }
      });

      if (futureNotifs.length > 0) {
        await LocalNotifications.schedule({ notifications: futureNotifs });
      }
    } catch (e) {}
  };

  const scanForAlerts = () => {
    let count = 0; let hasHigh = false; let hasNormal = false; let hasDone = false;
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const getJSON = (k) => { try { return JSON.parse(localStorage.getItem(k)||'[]') || []; } catch { return []; } };

    reminders.forEach(r => {
      if (r.date === todayStr && !r.text.includes('[SUB RENEWAL]') && !r.text.includes('[BILL]') && !r.text.includes('[INCOME]')) {
        count++;
        if (r.priority === 'High') hasHigh = true;
        else if (r.priority === 'Done') hasDone = true;
        else hasNormal = true;
      }
    });

    try {
      const tasklists = getJSON('fleet_sops');
      tasklists.forEach(list => {
        if (list.scheduledDate === todayStr) {
          const total = list.tasks ? list.tasks.length : 0;
          const done = list.tasks ? list.tasks.filter(t => t.done).length : 0;
          const progress = total === 0 ? 0 : Math.round((done / total) * 100);
          count++;
          if (progress === 100) hasDone = true;
          else if (progress > 0) hasNormal = true;
          else hasHigh = true;
        }
      });
    } catch(e) {}

    setAlertCount(count);
    
    let newColor = '#a855f7';
    if (hasHigh) newColor = '#ef4444';
    else if (hasNormal) newColor = '#a855f7';
    else if (hasDone) newColor = '#00cc66';
    setAlertColor(newColor);

    // If there are pending items today, fire the immediate notification (once per day)
    if (count > 0) {
      const lastNotified = localStorage.getItem('tot_last_notification');
      if (lastNotified !== todayStr) {
        triggerImmediateNotification(count);
        localStorage.setItem('tot_last_notification', todayStr);
      }
    }
  };

  useEffect(() => {
    scanForAlerts();
    syncOSNotifications(); 
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
