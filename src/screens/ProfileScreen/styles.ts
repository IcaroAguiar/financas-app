import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md, // More conservative padding (12 instead of 16)
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sections,
    gap: theme.spacing.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: theme.spacing.md, // Reduced padding for smaller screens
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(42, 157, 143, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  summaryValue: {
    fontSize: 14, // Reduced from 16 for smaller screens
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
    flexShrink: 1, // Allow text to shrink if necessary
  },
  summaryLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.sections,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
  },
  infoSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.subheader,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  fieldContainer: {
    marginBottom: theme.spacing.lg,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  fieldValue: {
    ...theme.typography.subheader,
    color: theme.colors.textPrimary,
    paddingVertical: theme.spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  editButtonContainer: {
    // Container for single edit button - no flexDirection: 'row'
    marginTop: theme.spacing.sm,
  },
  editButton: {
    // Let CustomButton handle its own styling
  },
  saveButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  settingsSection: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.sections,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  settingButton: {
    marginBottom: theme.spacing.md,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: 22, // Extra rounded for modern look
  },
  logoutContainer: {
    marginTop: theme.spacing.sections,
    marginBottom: 120, // Extra space for tab bar + safe area
    paddingHorizontal: theme.spacing.md,
  },
  logoutButton: {
    borderColor: theme.colors.error,
    borderWidth: 1,
    borderRadius: 22, // Extra rounded for modern look
  },
  logoutButtonText: {
    color: theme.colors.error,
  },
  signOutButton: {
    // Deprecated - using logoutButton instead
  },
});