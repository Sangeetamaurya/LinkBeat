import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 20,
    padding: 8,
    marginBottom: 10,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#2A2A2A',
  },
  textBox: { flex: 1, marginLeft: 10 },
  title: { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  artist: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
  control: { padding: 10 },
});
