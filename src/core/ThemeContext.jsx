import React, { createContext, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  useEffect(() => {
    const scale = localStorage.getItem('fleet_textScale') || '16';
    const accent = localStorage.getItem('fleet_accent') || '#3b82f6';
    const wallpaper = localStorage.getItem('fleet_wallpaper') || 'Deep Obsidian';
    const customBg = localStorage.getItem('fleet_wallpaper_custom');
    
    // Custom Gallery Adjustments
    const blur = localStorage.getItem('fleet_bg_blur') || '0';
    const bright = localStorage.getItem('fleet_bg_bright') || '1';
    const bgSize = localStorage.getItem('fleet_bg_size') || 'cover';
    
    const root = document.documentElement;
    root.style.setProperty('--global-font-scale', `${scale}px`);
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--text-accent', accent);
    
    if (wallpaper === 'Custom' && customBg) {
        root.style.setProperty('--bg-image', `url(${customBg})`);
        root.style.setProperty('--bg-size', bgSize);
        root.style.setProperty('--bg-blur', `${blur}px`);
        root.style.setProperty('--bg-brightness', bright);
        root.style.setProperty('--bg-color', '#000');
    } else if (wallpaper === 'Cyber Grid') {
        // Uses your accent color to draw a tactical grid
        root.style.setProperty('--bg-image', `linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)`);
        root.style.setProperty('--bg-size', '30px 30px');
        root.style.setProperty('--bg-blur', '0px');
        root.style.setProperty('--bg-brightness', '0.15'); // Dimmed so it's not blinding
        root.style.setProperty('--bg-color', '#000');
    } else if (wallpaper === 'Tactical Flare') {
        root.style.setProperty('--bg-image', `radial-gradient(circle at top center, var(--accent) 0%, transparent 60%)`);
        root.style.setProperty('--bg-size', 'cover');
        root.style.setProperty('--bg-blur', '0px');
        root.style.setProperty('--bg-brightness', '0.2');
        root.style.setProperty('--bg-color', '#050505');
    } else {
        root.style.setProperty('--bg-image', 'none');
        root.style.setProperty('--bg-color', wallpaper === 'Midnight Blue' ? '#000511' : '#0a0a0a');
    }
  }, []);

  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
}
