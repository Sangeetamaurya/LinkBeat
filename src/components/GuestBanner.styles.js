import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginTop: 20,
  },
  textBox: { flex: 1 },
  title: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
  caption: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
});
