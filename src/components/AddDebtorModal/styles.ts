import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
  },
  note: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 15,
  },
  formContent: {
    paddingBottom: 40,
  },
  paymentPlanToggle: {
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  installmentRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  frequencySelector: {
    flexDirection: 'row',
    marginTop: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 2,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  frequencyButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  frequencyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  frequencyButtonTextSelected: {
    color: theme.colors.surface,
  },
  installmentPreview: {
    backgroundColor: '#F0F9FF',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    padding: 16,
    marginBottom: 20,
    borderRadius: theme.borderRadius.md,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  previewText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
});