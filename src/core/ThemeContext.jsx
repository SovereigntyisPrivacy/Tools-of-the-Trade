import React, { createContext, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  useEffect(() => {
    const scale = localStorage.getItem('fleet_textScale') || '16';
    const accent = localStorage.getItem('fleet_accent') || '#3b82f6';
    const wallpaper = localStorage.getItem('fleet_wallpaper') || 'Deep Obsidian';
    const customBg = localStorage.getItem('fleet_wallpaper_custom');
    
    const blur = localStorage.getItem('fleet_bg_blur') || '0';
    const bright = localStorage.getItem('fleet_bg_bright') || '1';
    const zoom = localStorage.getItem('fleet_bg_zoom') || '1';
    const posX = localStorage.getItem('fleet_bg_x') || '50';
    const posY = localStorage.getItem('fleet_bg_y') || '50';
    
    const root = document.documentElement;
    root.style.setProperty('--global-font-scale', `${scale}px`);
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--text-accent', accent);
    
    if (wallpaper === 'Custom' && customBg) {
        root.style.setProperty('--bg-image', `url(${customBg})`);
        root.style.setProperty('--bg-blur', `${blur}px`);
        root.style.setProperty('--bg-brightness', bright);
        root.style.setProperty('--bg-zoom', zoom);
        root.style.setProperty('--bg-pos-x', `${posX}%`);
        root.style.setProperty('--bg-pos-y', `${posY}%`);
    } else if (wallpaper === 'Cyber Grid') {
        root.style.setProperty('--bg-image', `linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)`);
        root.style.setProperty('--bg-size', '30px 30px');
        root.style.setProperty('--bg-zoom', '1');
        root.style.setProperty('--bg-brightness', '0.15');
    } else if (wallpaper === 'Tactical Flare') {
        root.style.setProperty('--bg-image', `radial-gradient(circle at top center, var(--accent) 0%, transparent 60%)`);
        root.style.setProperty('--bg-zoom', '1');
        root.style.setProperty('--bg-brightness', '0.2');
    } else if (wallpaper === 'Matrix Rain') {
        root.style.setProperty('--bg-image', `repeating-linear-gradient(180deg, transparent, transparent 10px, var(--accent) 10px, var(--accent) 20px)`);
        root.style.setProperty('--bg-zoom', '1');
        root.style.setProperty('--bg-brightness', '0.1');
    } else if (wallpaper === 'Crimson Hex') {
        root.style.setProperty('--bg-image', `radial-gradient(circle, var(--accent) 2px, transparent 3px)`);
        root.style.setProperty('--bg-size', '20px 20px');
        root.style.setProperty('--bg-zoom', '1');
        root.style.setProperty('--bg-brightness', '0.2');
    } else {
        root.style.setProperty('--bg-image', 'none');
        document.body.style.backgroundColor = wallpaper === 'Midnight Blue' ? '#000511' : '#0a0a0a';
    }
  }, []);

  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
}
