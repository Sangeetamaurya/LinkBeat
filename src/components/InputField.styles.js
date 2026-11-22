import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  boxFocused: { borderColor: '#FFFFFF', borderWidth: 1.5 },
  input: { flex: 1, color: colors.textPrimary, fontSize: 15, marginLeft: 12 },
});
