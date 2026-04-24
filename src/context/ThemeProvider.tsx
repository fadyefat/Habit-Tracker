import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export type Theme = 'dark' | 'light' | 'auto';

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'auto',
  isDark: false,
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'auto',
  storageKey = 'habit-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [isDarkResolved, setIsDarkResolved] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;

    const updateTheme = () => {
      let resolvedTheme: 'light' | 'dark';
      
      if (theme === 'auto') {
        const hour = new Date().getHours();
        resolvedTheme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
      } else {
        resolvedTheme = theme as 'light' | 'dark';
      }

      root.classList.remove('light', 'dark');
      root.classList.add(resolvedTheme);
      setIsDarkResolved(resolvedTheme === 'dark');
    };

    updateTheme();

    const interval = setInterval(() => {
      if (theme === 'auto') updateTheme();
    }, 60000);

    return () => clearInterval(interval);
  }, [theme]);

  const value = {
    theme,
    isDark: isDarkResolved,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
