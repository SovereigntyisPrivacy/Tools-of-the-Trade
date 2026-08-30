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

  useEffect(() => {
    const initChannel = async () => {
      try {
        await LocalNotifications.createChannel({
          id: 'tot_alerts', name: 'Tools of the Trade Alerts', description: 'High-priority task and schedule notifications',
          importance: 5, visibility: 1, vibration: true, sound: 'default'
        });
      } catch (e) {}
    };
    initChannel();
  }, []);

  useEffect(() => { localStorage.setItem('global_date', globalDate); }, [globalDate]);
  useEffect(() => { localStorage.setItem('global_reminders', JSON.stringify(reminders)); }, [reminders]);

  const addReminder = (date, text, module, priority = 'Normal') => {
    setReminders([...reminders, { id: Date.now().toString(), date, text, module, priority }]);
  };
  const removeReminder = (id) => setReminders(reminders.filter(r => r.id !== id));

  const triggerImmediateNotification = async (count) => {
    try {
      const perm = await LocalNotifications.checkPermissions();
      if (perm.display !== 'granted') {
        const req = await LocalNotifications.requestPermissions();
        if (req.display !== 'granted') return;
      }
      await LocalNotifications.schedule({
        notifications: [{ title: "Tools of the Trade", body: `You have ${count} pending item(s) on your agenda today.`, id: 9999, channelId: 'tot_alerts', schedule: { at: new Date(Date.now() + 1000) } }]
      });
    } catch (e) {}
  };

  const syncOSNotifications = async () => {
    try {
      const perm = await LocalNotifications.checkPermissions();
      if (perm.display !== 'granted') return;
      const pending = await LocalNotifications.getPending();
      if (pending && pending.notifications.length > 0) await LocalNotifications.cancel(pending);

      let futureNotifs = []; let idCounter = 1;
      const getJSON = (k) => { try { return JSON.parse(localStorage.getItem(k)||'[]') || []; } catch { return []; } };
      const now = new Date();

      getJSON('fleet_sops').forEach(list => {
        if (list.scheduledDate && (!list.tasks || list.tasks.some(t => !t.done))) {
          const [y, m, d] = list.scheduledDate.split('-').map(Number);
          const targetDate = new Date(y, m - 1, d, 9, 0, 0); 
          if (targetDate > now) futureNotifs.push({ title: "Tasklist Due", body: list.title, id: idCounter++, channelId: 'tot_alerts', schedule: { at: targetDate } });
        }
      });

      // Income & Bill OS Alarms
      getJSON('tot_bills').forEach(b => {
        if (b.due) {
          const [y, m, d] = b.due.split('-').map(Number); const targetDate = new Date(y, m - 1, d, 9, 0, 0);
          if (targetDate > now) futureNotifs.push({ title: "Bill Due", body: b.name, id: idCounter++, channelId: 'tot_alerts', schedule: { at: targetDate } });
        }
      });
      getJSON('tot_incomes').forEach(i => {
        if (i.date) {
          const [y, m, d] = i.date.split('-').map(Number); const targetDate = new Date(y, m - 1, d, 9, 0, 0);
          if (targetDate > now) futureNotifs.push({ title: "Income Expected", body: i.name, id: idCounter++, channelId: 'tot_alerts', schedule: { at: targetDate } });
        }
      });

      reminders.forEach(r => {
        if (r.date && !r.text.includes('[SUB RENEWAL]') && !r.text.includes('[BILL]')) {
          const [y, m, d] = r.date.split('-').map(Number); const targetDate = new Date(y, m - 1, d, 9, 0, 0);
          if (targetDate > now) futureNotifs.push({ title: "Agenda Reminder", body: r.text, id: idCounter++, channelId: 'tot_alerts', schedule: { at: targetDate } });
        }
      });

      if (futureNotifs.length > 0) await LocalNotifications.schedule({ notifications: futureNotifs });
    } catch (e) {}
  };

  const scanForAlerts = () => {
    let count = 0; let hasHigh = false; let hasNormal = false; let hasDone = false;
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const getJSON = (k) => { try { return JSON.parse(localStorage.getItem(k)||'[]') || []; } catch { return []; } };

    reminders.forEach(r => {
      if (r.date === todayStr && !r.text.includes('[SUB RENEWAL]') && !r.text.includes('[BILL]') && !r.text.includes('[INCOME]')) {
        count++; if (r.priority === 'High') hasHigh = true; else if (r.priority === 'Done') hasDone = true; else hasNormal = true;
      }
    });

    try {
      getJSON('fleet_sops').forEach(list => {
        if (list.scheduledDate === todayStr) { count++; hasHigh = true; }
      });
      getJSON('tot_bills').forEach(b => {
        if (b.due === todayStr) { count++; hasHigh = true; }
      });
      getJSON('tot_incomes').forEach(i => {
        if (i.date === todayStr) { count++; hasDone = true; }
      });
    } catch(e) {}

    setAlertCount(count);
    let newColor = '#a855f7';
    if (hasHigh) newColor = '#ef4444'; else if (hasNormal) newColor = '#a855f7'; else if (hasDone) newColor = '#00cc66';
    setAlertColor(newColor);

    if (count > 0) {
      const lastNotified = localStorage.getItem('tot_last_notification');
      if (lastNotified !== todayStr) { triggerImmediateNotification(count); localStorage.setItem('tot_last_notification', todayStr); }
    }
  };

  useEffect(() => {
    scanForAlerts(); syncOSNotifications();
    const interval = setInterval(scanForAlerts, 4000);
    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <CalendarContext.Provider value={{ globalDate, setGlobalDate, reminders, addReminder, removeReminder, alertCount, alertColor }}>
      {children}
    </CalendarContext.Provider>
  );
}

export const useCalendar = () => useContext(CalendarContext);
