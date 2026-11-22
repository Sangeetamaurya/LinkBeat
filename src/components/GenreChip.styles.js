import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },
  text: { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  textSelected: { color: '#000000' },
});
