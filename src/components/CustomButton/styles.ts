// @/components/CustomButton/styles.ts
import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
  // Container base, comum a todas as variantes
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  // Texto base, comum a todas as variantes
  buttonText: {
    fontFamily: theme.fonts.bold,
    textAlign: "center",
  },

  // --- CONTAINER DE CONTEÚDO ---
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginHorizontal: 6,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  // --- VARIANTES DE ESTILO ---

  // Primary
  primaryContainer: {
    backgroundColor: theme.colors.primary,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  primaryText: {
    color: theme.colors.white, // Ensure contrast against primary background
  },

  // Secondary
  secondaryContainer: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  secondaryText: {
    color: theme.colors.primary,
  },

  // Outline
  outlineContainer: {
    backgroundColor: "transparent",
    borderWidth: 2, // Increased border width for better visibility
    borderColor: theme.colors.primary,
  },
  outlineText: {
    color: theme.colors.primary,
  },

  // Danger
  dangerContainer: {
    backgroundColor: theme.colors.error,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  dangerText: {
    color: theme.colors.white, // Ensure contrast against error background
  },

  // Ghost
  ghostContainer: {
    backgroundColor: "transparent",
    borderWidth: 1, // Add subtle border for visibility
    borderColor: theme.colors.borderLight,
  },
  ghostText: {
    color: theme.colors.textPrimary, // Use darker color for better contrast
  },

  // --- TAMANHOS ---

  // Small
  smallContainer: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 20,
    minHeight: 48,
  },
  smallText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Medium
  mediumContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 24,
    minHeight: 52,
  },
  mediumText: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Large
  largeContainer: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 28,
    minHeight: 56,
  },
  largeText: {
    fontSize: 18,
    fontWeight: '600',
  },

  // --- ESTADOS ---

  // Disabled
  disabledContainer: {
    opacity: 0.6,
    backgroundColor: theme.colors.neutral,
  },
  disabledText: {
    color: theme.colors.textLight,
  },
});
