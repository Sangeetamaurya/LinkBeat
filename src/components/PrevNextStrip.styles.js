import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 8,
  },
  side: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  sideRight: { justifyContent: 'flex-end' },
  thumb: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
  },
  textLeft: { marginLeft: 10, flex: 1 },
  textRight: { marginRight: 10, flex: 1, alignItems: 'flex-end' },
  label: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
});
