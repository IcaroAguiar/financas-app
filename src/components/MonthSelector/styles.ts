import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  monthList: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 0,
  },
  monthButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    minWidth: 60,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  monthButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  monthText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  monthTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  separator: {
    width: 6,
  },
  yearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  calendarButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  // Calendar Modal Styles
  calendarModal: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingTop: 60, // Safe area
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: 8,
  },
  calendarGrid: {
    padding: 20,
    gap: 12,
  },
  calendarSeparator: {
    height: 8,
  },
});