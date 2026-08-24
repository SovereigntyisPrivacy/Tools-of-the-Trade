import React, { createContext, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  useEffect(() => {
    const scale = localStorage.getItem('fleet_textScale') || '16';
    const accent = localStorage.getItem('fleet_accent') || '#3b82f6';
    const wallpaper = localStorage.getItem('fleet_wallpaper') || 'Deep Obsidian';
    const customBg = localStorage.getItem('fleet_wallpaper_custom');
    
    document.documentElement.style.fontSize = `${scale}px`;
    document.documentElement.style.setProperty('--accent', accent);
    document.documentElement.style.setProperty('--text-accent', accent);
    
    if (wallpaper === 'Custom' && customBg) {
        document.body.style.backgroundImage = `url(${customBg})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    } else {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = wallpaper === 'Midnight Blue' ? '#000511' : (wallpaper === 'Deep Obsidian' ? '#0a0a0a' : '#000');
    }
  }, []);

  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
}
