/**
 * CENTRAL DESIGN TOKENS (THEME TOKEN FILE)
 * 
 * BẮT BUỘC THEO QUY CHUẨN ĐỒ ÁN CUỐI KỲ (FINAL PROJECT BRIEF):
 * - "Light and dark colour schemes from one token file. No hex colour anywhere else in the codebase."
 * - "Accessibility: touch targets at least 44 × 44, body text contrast at least 4.5:1 in both schemes."
 * - Mọi thành phần trong toàn bộ dự án Campus Marketplace đều phải tham chiếu từ tệp này!
 */

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  background: string;
  surface: string;
  card: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnPrimary: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  offlineBannerBg: string;
  offlineBannerText: string;
  badgeBg: string;
  badgeText: string;
  favoriteHeart: string;
  inputBackground: string;
  skeletonBg: string;
}

export const lightColors: ThemeColors = {
  primary: '#0284C7',          // Sky-600
  primaryLight: '#E0F2FE',     // Sky-100
  primaryDark: '#0369A1',      // Sky-700
  background: '#F8FAFC',       // Slate-50
  surface: '#FFFFFF',          // White
  card: '#FFFFFF',             // White
  border: '#E2E8F0',           // Slate-200
  borderStrong: '#CBD5E1',     // Slate-300
  textPrimary: '#0F172A',      // Slate-900 (Tỉ lệ tương phản > 12:1 trên #FFF)
  textSecondary: '#334155',    // Slate-700 (Tỉ lệ tương phản > 7:1)
  textMuted: '#64748B',        // Slate-500 (Tỉ lệ tương phản > 4.6:1 trên #FFF)
  textOnPrimary: '#FFFFFF',
  success: '#16A34A',          // Green-600
  successLight: '#DCFCE7',     // Green-100
  warning: '#D97706',          // Amber-600
  warningLight: '#FEF3C7',     // Amber-100
  error: '#DC2626',            // Red-600
  errorLight: '#FEE2E2',       // Red-100
  offlineBannerBg: '#FEF3C7',  // Amber-100
  offlineBannerText: '#92400E',// Amber-800
  badgeBg: '#F1F5F9',          // Slate-100
  badgeText: '#475569',        // Slate-600
  favoriteHeart: '#E11D48',    // Rose-600
  inputBackground: '#F1F5F9',  // Slate-100
  skeletonBg: '#E2E8F0',       // Slate-200
};

export const darkColors: ThemeColors = {
  primary: '#38BDF8',          // Sky-400
  primaryLight: '#082F49',     // Sky-950
  primaryDark: '#0284C7',      // Sky-600
  background: '#0B1120',       // Slate-950
  surface: '#1E293B',          // Slate-800
  card: '#1E293B',             // Slate-800
  border: '#334155',           // Slate-700
  borderStrong: '#475569',     // Slate-600
  textPrimary: '#F8FAFC',      // Slate-50 (Tỉ lệ tương phản > 13:1 trên #1E293B)
  textSecondary: '#E2E8F0',    // Slate-200 (Tỉ lệ tương phản > 9:1)
  textMuted: '#94A3B8',        // Slate-400 (Tỉ lệ tương phản > 5.5:1)
  textOnPrimary: '#0F172A',
  success: '#4ADE80',          // Green-400
  successLight: '#052E16',     // Green-950
  warning: '#FBBF24',          // Amber-400
  warningLight: '#451A03',     // Amber-950
  error: '#F87171',            // Red-400
  errorLight: '#450A0A',       // Red-950
  offlineBannerBg: '#451A03',  // Dark Amber
  offlineBannerText: '#FDE68A',// Amber-200
  badgeBg: '#334155',          // Slate-700
  badgeText: '#CBD5E1',        // Slate-300
  favoriteHeart: '#FB7185',    // Rose-400
  inputBackground: '#0F172A',  // Slate-900
  skeletonBg: '#334155',       // Slate-700
};

export const typography = {
  fontSizes: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 18,
    xl: 20,
    xxl: 24,
    display: 28,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeights: {
    tight: 16,
    normal: 20,
    relaxed: 24,
    heading: 32,
  },
};

export const layout = {
  // Chuẩn WCAG Accessibility Touch Target: tối thiểu 44 x 44
  minTouchTarget: 44,
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
};
