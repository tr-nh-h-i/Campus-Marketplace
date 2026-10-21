import { StateCreator } from 'zustand';

export interface PreferencesSlice {
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
}

export const createPreferencesSlice: StateCreator<
  PreferencesSlice,
  [],
  [],
  PreferencesSlice
> = (set, get) => ({
  themeMode: 'system',

  setThemeMode: (themeMode) => {
    set({ themeMode });
  },

  toggleTheme: () => {
    const current = get().themeMode;
    const next = current === 'dark' ? 'light' : 'dark';
    set({ themeMode: next });
  },
});
