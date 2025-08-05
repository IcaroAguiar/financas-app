// src/components/AddEditAccountModal/styles.ts

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
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  form: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.surface,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  typeSelectorText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
  },
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
  },
  currencySymbol: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.secondary,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.sm,
  },
  currencyInput: {
    flex: 1,
    padding: theme.spacing.md,
    paddingLeft: 0,
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
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background,
    gap: theme.spacing.md,
  },
  footerButton: {
    flex: 1,
  },
  // Type Picker Styles
  typePickerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  typePickerTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.medium,
    color: theme.colors.surface,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  typeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  typeOptionSelected: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  typeOptionText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
  },
  typeOptionTextSelected: {
    color: '#007AFF',
    fontFamily: theme.fonts.medium,
  },
  cancelTypeSelection: {
    backgroundColor: theme.colors.danger,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
  },
  cancelTypeText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.surface,
    textAlign: 'center',
  },
});