
import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const savedPrefs = localStorage.getItem('mypoint-preferences');
    if (savedPrefs) {
      try {
        const preferences = JSON.parse(savedPrefs);
        setTheme(preferences.theme || 'system');
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.setAttribute('data-theme', systemTheme);
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const setThemeAndSave = (newTheme: Theme) => {
    setTheme(newTheme);
    
    // Update preferences in localStorage
    const savedPrefs = localStorage.getItem('mypoint-preferences');
    const preferences = savedPrefs ? JSON.parse(savedPrefs) : {};
    preferences.theme = newTheme;
    localStorage.setItem('mypoint-preferences', JSON.stringify(preferences));
  };

  return { theme, setTheme: setThemeAndSave };
};
