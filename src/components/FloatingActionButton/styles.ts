// @/components/FloatingActionButton/styles.ts
import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
  container: {
    position: "absolute", // Flutua sobre o conteúdo
    bottom: 110, // Adjusted for proper tab bar clearance
    right: 30,
    width: 56, // Slightly smaller to match CentralActionButton
    height: 56,
    borderRadius: 28, // Half of width/height
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
