import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ThemeColors } from '../constants/theme';
import { useAppStore } from '../store';

export function useTheme(): { colors: ThemeColors; isDark: boolean } {
  const systemScheme = useColorScheme();
  const themeMode = useAppStore((state) => state.themeMode);

  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');

  const colors = isDark ? darkColors : lightColors;

  return { colors, isDark };
}
