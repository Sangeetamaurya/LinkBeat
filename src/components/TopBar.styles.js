import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
  },
  avatarEmpty: { alignItems: 'center', justifyContent: 'center' },
  textBox: { marginLeft: 10 },
  greeting: { color: colors.textSecondary, fontSize: 12 },
  name: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
  right: { flexDirection: 'row', alignItems: 'center' },
  gap: { width: 10 },
});