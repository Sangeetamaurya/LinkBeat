import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 18,
    padding: 10,
    marginBottom: 10,
  },
  pressed: { opacity: 0.75 },
  cover: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2A2A2A',
  },
  textBox: { flex: 1, marginLeft: 12, marginRight: 8 },
  title: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
  match: { color: colors.highlight },
  artist: { color: colors.textSecondary, fontSize: 12, marginTop: 3 },
  like: { marginRight: 12 },
  time: { color: colors.textSecondary, fontSize: 12 },
});
