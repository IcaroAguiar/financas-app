import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  monthButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    minWidth: 70,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  monthButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  monthText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_500Medium',
  },
  monthTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'Roboto_700Bold',
  },
  separator: {
    width: 8,
  },
});