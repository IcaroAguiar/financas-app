// src/styles/theme.ts

// Define os tipos para o nosso objeto de tema para garantir consistência
interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  primary: string;
  primaryDark: string;
  textPrimary: string;
  textSecondary: string;
  textLight: string;
  border: string;
  borderLight: string;
  success: string;
  error: string;
  warning: string;
  neutral: string;
  white: string;
}

interface ThemeFonts {
  regular: string;
  bold: string;
  light: string;
}

interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  sides: number;
  sections: number;
}

interface ThemeIconSizes {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

interface ThemeTypography {
  header: { fontSize: number; fontWeight: '700'; lineHeight: number };
  subheader: { fontSize: number; fontWeight: '600'; lineHeight: number };
  body: { fontSize: number; fontWeight: '400'; lineHeight: number };
  caption: { fontSize: number; fontWeight: '400'; lineHeight: number };
  bodyMedium: { fontSize: number; fontWeight: '500'; lineHeight: number };
  bodyBold: { fontSize: number; fontWeight: '700'; lineHeight: number };
}

interface ThemeBorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface AppTheme {
  colors: ThemeColors;
  fonts: ThemeFonts;
  spacing: ThemeSpacing;
  iconSizes: ThemeIconSizes;
  typography: ThemeTypography;
  borderRadius: ThemeBorderRadius;
}

// O objeto 'theme' é a nossa fonte única da verdade para estilos
export const theme: AppTheme = {
  colors: {
    background: "#f8f9fa", // --color-background
    surface: "#ffffff", // --color-surface
    card: "#ffffff", // --color-card
    primary: "#2a9d8f", // --color-primary (main brand color)
    primaryDark: "#238276", // --color-primary-dark
    textPrimary: "#1a1a1a", // --color-text-primary
    textSecondary: "#6c757d", // --color-text-secondary
    textLight: "#adb5bd", // --color-text-light
    border: "#e9ecef", // --color-border
    borderLight: "#f1f3f4", // --color-border-light
    success: "#28a745", // --color-success (green)
    error: "#dc3545", // --color-error (red)
    warning: "#ffc107", // --color-warning (yellow)
    neutral: "#6c757d", // --color-neutral (gray)
    white: "#ffffff", // --color-white
  },
  // Nomes genéricos para facilitar a troca de fontes no futuro, se necessário
  fonts: {
    light: "Roboto_300Light",
    regular: "Roboto_400Regular",
    bold: "Roboto_700Bold",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    sides: 16,
    sections: 24,
  },
  iconSizes: {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
  typography: {
    header: { fontSize: 22, fontWeight: '700', lineHeight: 28 },
    subheader: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
    body: { fontSize: 15, fontWeight: '400', lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
    bodyMedium: { fontSize: 15, fontWeight: '500', lineHeight: 20 },
    bodyBold: { fontSize: 15, fontWeight: '700', lineHeight: 20 },
  },
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
  },
};
