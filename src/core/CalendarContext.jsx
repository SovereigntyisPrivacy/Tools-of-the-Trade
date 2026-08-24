import React, { createContext, useState, useContext, useEffect } from 'react';

const CalendarContext = createContext();

export function CalendarProvider({ children }) {
  const [globalDate, setGlobalDate] = useState(() => {
    return localStorage.getItem('global_date') || new Date().toISOString().split('T')[0];
  });

  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('global_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  // The new global tally state
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => { localStorage.setItem('global_date', globalDate); }, [globalDate]);
  useEffect(() => { localStorage.setItem('global_reminders', JSON.stringify(reminders)); }, [reminders]);

  const addReminder = (date, text, module, priority = 'Normal') => {
    setReminders([...reminders, { id: Date.now().toString(), date, text, module, priority }]);
  };
  
  const removeReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  // --- OMNI-PULL BACKGROUND SCANNER ---
  const scanForAlerts = () => {
    let count = 0;
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Hunt for Overtime (40+ hours)
    try {
      const schedules = JSON.parse(localStorage.getItem('fleet_schedules') || '[]');
      schedules.forEach(week => {
        week.roster.forEach(emp => {
          let totalHrs = 0;
          const shifts = week.shifts[emp.id] || {};
          Object.values(shifts).forEach(s => {
            if (s && s.in && s.out) {
              const [h1, m1] = s.in.split(':').map(Number);
              const [h2, m2] = s.out.split(':').map(Number);
              let m1Total = h1 * 60 + m1;
              let m2Total = h2 * 60 + m2;
              if (m2Total < m1Total) m2Total += 24 * 60; // Handle night shifts
              totalHrs += (m2Total - m1Total) / 60;
            }
          });
          if (totalHrs >= 40) count++;
        });
      });
    } catch(e) {}

    // 2. Hunt for Expired Warranties
    try {
      let ledgerItems = [];
      ['asset_ledger', 'assets', 'fleet_assets', 'ledgerItems', 'ledger'].forEach(key => {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(data)) ledgerItems = [...ledgerItems, ...data];
      });
      ledgerItems.forEach(item => {
        const wStatus = (item.warranty || item.warrantyStatus || '').toString().toLowerCase();
        const wDate = item.expDate || item.warrantyExp || item.warrantyDate;
        if (wStatus.includes('expire') || (wDate && wDate <= todayStr)) {
          count++;
        }
      });
    } catch(e) {}

    // 3. Hunt for High-Priority Manual Reminders due today or past due
    reminders.forEach(r => {
       if (r.priority === 'High' && r.date <= todayStr) count++;
    });

    setAlertCount(count);
  };

  // Poll the device memory every 2 seconds to keep the badge live
  useEffect(() => {
    scanForAlerts();
    const interval = setInterval(scanForAlerts, 2000); 
    return () => clearInterval(interval);
  }, [reminders, globalDate]);

  return (
    <CalendarContext.Provider value={{ globalDate, setGlobalDate, reminders, addReminder, removeReminder, alertCount }}>
      {children}
    </CalendarContext.Provider>
  );
}

export const useCalendar = () => useContext(CalendarContext);
