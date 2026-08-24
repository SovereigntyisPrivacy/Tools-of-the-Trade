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
        root.style.setProperty('--bg-brightness', '0.25'); // Boosted brightness
    } else if (wallpaper === 'Tactical Flare') {
        root.style.setProperty('--bg-image', `radial-gradient(circle at top center, var(--accent) 0%, transparent 60%)`);
        root.style.setProperty('--bg-zoom', '1');
        root.style.setProperty('--bg-brightness', '0.35'); // Boosted brightness
    } else if (wallpaper === 'Matrix Rain') {
        // Layer 1: Black masking lines to create gaps. Layer 2: Vertical accent lines.
        root.style.setProperty('--bg-image', `repeating-linear-gradient(180deg, rgba(0,0,0,1) 0px, transparent 4px, rgba(0,0,0,1) 8px), repeating-linear-gradient(90deg, transparent 0px, transparent 15px, var(--accent) 16px, transparent 17px, transparent 30px)`);
        root.style.setProperty('--bg-size', '100% 8px, 30px 100%');
        root.style.setProperty('--bg-zoom', '1');
        root.style.setProperty('--bg-brightness', '0.6'); // Needs to be bright to punch through the black mask
    } else if (wallpaper === 'Crimson Hex') {
        // Dual offset radials create an alternating hex-node mesh
        root.style.setProperty('--bg-image', `radial-gradient(circle at 15px 15px, var(--accent) 2px, transparent 3px), radial-gradient(circle at 35px 35px, var(--accent) 2px, transparent 3px)`);
        root.style.setProperty('--bg-size', '40px 40px');
        root.style.setProperty('--bg-zoom', '1');
        root.style.setProperty('--bg-brightness', '0.5'); // Bright enough to glow on black
    } else {
        root.style.setProperty('--bg-image', 'none');
        document.body.style.backgroundColor = wallpaper === 'Midnight Blue' ? '#000511' : '#0a0a0a';
    }
  }, []);

  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
}
