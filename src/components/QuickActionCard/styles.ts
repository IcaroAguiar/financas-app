// @/components/QuickActionCard/styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: theme.spacing.md, // Reduced from lg (16 to 12)
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    minHeight: 76, // Slightly reduced
    maxWidth: 85, // Prevent text overflow on small screens
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.caption,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    lineHeight: 14, // Better line spacing for wrapping
    flexShrink: 1, // Allow text to shrink if necessary
  },
});