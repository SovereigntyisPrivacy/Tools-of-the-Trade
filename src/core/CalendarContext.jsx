import React, { createContext, useState, useContext, useEffect } from 'react';

const CalendarContext = createContext();

export function CalendarProvider({ children }) {
  // Global Date State (Defaults to today)
  const [globalDate, setGlobalDate] = useState(() => {
    const saved = localStorage.getItem('global_date');
    return saved || new Date().toISOString().split('T')[0];
  });

  // Global Reminders State (Warranties, Shifts, Ag Stops, etc.)
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('global_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  // Auto-save to Local Storage
  useEffect(() => {
    localStorage.setItem('global_date', globalDate);
  }, [globalDate]);

  useEffect(() => {
    localStorage.setItem('global_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = (date, text, module, priority = 'Normal') => {
    setReminders([...reminders, { id: Date.now().toString(), date, text, module, priority }]);
  };

  const removeReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <CalendarContext.Provider value={{ globalDate, setGlobalDate, reminders, addReminder, removeReminder }}>
      {children}
    </CalendarContext.Provider>
  );
}

export const useCalendar = () => useContext(CalendarContext);
