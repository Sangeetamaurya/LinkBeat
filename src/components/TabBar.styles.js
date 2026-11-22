import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 24,
    padding: 6,
  },
  tab: {
    flex: 1,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: { backgroundColor: colors.glass },
  label: { fontSize: 10, fontWeight: '600', marginTop: 3 },
});
