
import { useState, useLayoutEffect } from 'react';
import { themes } from '../../themes';

export const useTheme = (initialTheme: 'dark' | 'light' = 'dark') => {
  const [theme, setTheme] = useState<'dark' | 'light'>(initialTheme);

  useLayoutEffect(() => {
    const themeKey = theme === 'dark' ? 'gruvbox-dark' : 'gruvbox-light';
    const themeColors = (themes as any)[themeKey];
    
    const root = document.documentElement;
    
    // Inject CSS variables
    for (const [key, value] of Object.entries(themeColors)) {
        root.style.setProperty(key, value as string);
    }
    
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return { theme, toggleTheme };
};
