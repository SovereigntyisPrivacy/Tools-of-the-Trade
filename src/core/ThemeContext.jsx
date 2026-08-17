import React, { createContext, useState, useEffect, useContext } from 'react';
import { Preferences } from '@capacitor/preferences';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    textSize: 16,
    textColor: '#00ffff', 
    bgColor: '#121212',
    bgImage: '',
    bgPosX: 50,
    bgPosY: 50,
  });

  useEffect(() => {
    const loadTheme = async () => {
      const { value } = await Preferences.get({ key: 'tot_theme_settings' });
      if (value) {
        const savedTheme = JSON.parse(value);
        const mergedTheme = { ...theme, ...savedTheme };
        setTheme(mergedTheme);
        applyThemeToDOM(mergedTheme);
      } else {
        applyThemeToDOM(theme);
      }
    };
    loadTheme();
  }, []);

  const applyThemeToDOM = (currentTheme) => {
    const root = document.documentElement;
    root.style.setProperty('--tot-text-size', `${currentTheme.textSize}px`);
    root.style.setProperty('--tot-text-color', currentTheme.textColor);
    
    if (currentTheme.bgImage) {
      root.style.setProperty('--tot-bg', `url(${currentTheme.bgImage})`);
      root.style.backgroundSize = 'cover';
      root.style.backgroundAttachment = 'fixed';
      root.style.backgroundPosition = `${currentTheme.bgPosX ?? 50}% ${currentTheme.bgPosY ?? 50}%`;
    } else {
      root.style.setProperty('--tot-bg', currentTheme.bgColor);
      root.style.backgroundImage = 'none';
    }
  };

  const updateTheme = async (newSettings) => {
    const updatedTheme = { ...theme, ...newSettings };
    setTheme(updatedTheme);
    applyThemeToDOM(updatedTheme);
    await Preferences.set({
      key: 'tot_theme_settings',
      value: JSON.stringify(updatedTheme),
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
