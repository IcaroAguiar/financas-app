// src/styles/theme.ts

// Define os tipos para o nosso objeto de tema para garantir consistência
interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  primaryDark: string;
  textPrimary: string;
  textSecondary: string;
}

interface ThemeFonts {
  regular: string;
  bold: string;
  light: string;
}

export interface AppTheme {
  colors: ThemeColors;
  fonts: ThemeFonts;
}

// O objeto 'theme' é a nossa fonte única da verdade para estilos
export const theme: AppTheme = {
  colors: {
    background: "#f4f4f9", // --color-background
    surface: "#ffffff", // --color-surface
    primary: "#2a9d8f", // --color-primary
    primaryDark: "#238276", // --color-primary-dark
    textPrimary: "#1c1c1c", // --color-text-primary
    textSecondary: "#555555", // --color-text-secondary
  },
  // Nomes genéricos para facilitar a troca de fontes no futuro, se necessário
  fonts: {
    light: "Roboto_300Light",
    regular: "Roboto_400Regular",
    bold: "Roboto_700Bold",
  },
};
