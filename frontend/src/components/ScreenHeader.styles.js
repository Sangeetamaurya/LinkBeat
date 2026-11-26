import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 12, marginBottom: 20 },
  title: {
    flex: 1,
    textAlign: 'center',
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  space: { width: 40 },
});
