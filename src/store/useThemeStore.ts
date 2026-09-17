import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  themeMode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setThemeMode: (mode: ThemeMode) => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeMode: 'dark',
  resolvedTheme: 'dark',

  setThemeMode: (mode: ThemeMode) => {
    localStorage.setItem('app_theme_mode', mode);
    let resolved: 'light' | 'dark' = 'dark';

    if (mode === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolved = mode;
    }

    if (resolved === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }

    set({ themeMode: mode, resolvedTheme: resolved });
  },

  initTheme: () => {
    const saved = (localStorage.getItem('app_theme_mode') as ThemeMode) || 'dark';
    get().setThemeMode(saved);

    // Pasang listener jika mode sistem berubah di OS
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (get().themeMode === 'system') {
        get().setThemeMode('system');
      }
    });
  },
}));