import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeVariant = 'noir' | 'pure-noir' | 'high-contrast' | 'mono-pro';

interface ThemeContextType {
  theme: ThemeVariant;
  setTheme: (theme: ThemeVariant) => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const THEME_STORAGE_KEY = 'aj-noir-chat-theme';
const DEFAULT_THEME: ThemeVariant = 'pure-noir';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeVariant;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = DEFAULT_THEME,
}) => {
  const [theme, setThemeState] = useState<ThemeVariant>(defaultTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeVariant;
    if (savedTheme && isValidTheme(savedTheme)) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme(defaultTheme);
    }
  }, [defaultTheme]);

  const isValidTheme = (theme: string): theme is ThemeVariant => {
    return ['noir', 'pure-noir', 'high-contrast', 'mono-pro'].includes(theme);
  };

  const applyTheme = (newTheme: ThemeVariant) => {
    const root = document.documentElement;
    
    // Remove existing theme attributes
    root.removeAttribute('data-theme');
    root.classList.remove('dark');
    
    // Apply new theme
    if (newTheme !== 'noir') {
      root.setAttribute('data-theme', newTheme);
    }
    
    // Always add dark class for compatibility
    root.classList.add('dark');
  };

  const setTheme = (newTheme: ThemeVariant) => {
    if (newTheme === theme) return;

    setIsTransitioning(true);
    
    // Add transition classes
    const root = document.documentElement;
    root.style.setProperty('--theme-transition', '0.3s ease-in-out');
    
    // Apply new theme after a brief delay for smooth transition
    setTimeout(() => {
      setThemeState(newTheme);
      applyTheme(newTheme);
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    }, 50);

    // Remove transition classes after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
      root.style.removeProperty('--theme-transition');
    }, 350);
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    isTransitioning,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const themeConfig = {
  noir: {
    name: 'Noir',
    description: 'Deep black with subtle grays and high contrast',
    icon: '🖤',
  },
  'pure-noir': {
    name: 'Pure Noir',
    description: 'Absolute black and white for maximum contrast',
    icon: '⚫',
  },
  'high-contrast': {
    name: 'High Contrast',
    description: 'Enhanced visibility with stark contrasts',
    icon: '🔲',
  },
  'mono-pro': {
    name: 'Monochrome Pro',
    description: 'Professional grayscale with refined details',
    icon: '⬛',
  },
} as const;