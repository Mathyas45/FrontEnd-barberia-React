'use client';

/**
 * ============================================================
 * THEME CONTEXT - Modo Oscuro/Claro (Sin next-themes)
 * ============================================================
 * Implementación manual para control total del tema.
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'barberia-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Leer tema guardado al montar
  useEffect(() => {
    setMounted(true);
    
    // Leer de localStorage
    const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initialTheme = savedTheme || 'light';
    
    setThemeState(initialTheme);
    
    // Aplicar clase al HTML
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Función para cambiar tema
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [theme, setTheme]);

  // No renderizar hasta que esté montado para evitar hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  // Si no hay contexto, retornar valores por defecto seguros
  if (context === undefined) {
    return {
      theme: 'light',
      isDark: false,
      toggleTheme: () => {
        // Toggle manual sin contexto
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        if (isDark) {
          html.classList.remove('dark');
          localStorage.setItem(STORAGE_KEY, 'light');
        } else {
          html.classList.add('dark');
          localStorage.setItem(STORAGE_KEY, 'dark');
        }
      },
      setTheme: (newTheme: Theme) => {
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        localStorage.setItem(STORAGE_KEY, newTheme);
      },
    };
  }
  
  return context;
}
