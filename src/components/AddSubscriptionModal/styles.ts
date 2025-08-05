// src/components/AddSubscriptionModal/styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '90%',
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Form
  form: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.text.light,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.surface,
  },
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.text.light,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
  },
  currencySymbol: {
    paddingLeft: theme.spacing.md,
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.secondary,
  },
  currencyInput: {
    flex: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.text.light,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  selectorText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
  },
  hint: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    gap: theme.spacing.md,
  },
  footerButton: {
    flex: 1,
  },

  // Picker Overlays
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  pickerContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  pickerTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  pickerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xs,
  },
  pickerOptionSelected: {
    backgroundColor: theme.colors.background,
  },
  pickerOptionText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
  },
  pickerOptionTextSelected: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
  },
  pickerCancel: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background,
  },
  pickerCancelText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.secondary,
  },
});