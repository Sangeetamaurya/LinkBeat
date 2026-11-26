import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  item: { flexDirection: 'row', alignItems: 'flex-start' },
  nodeColumn: { alignItems: 'center' },
  circleBox: {
    height: 76,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCurrent: { borderWidth: 3, borderColor: '#FFFFFF' },
  liveWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  liveBadge: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  liveText: { color: '#FFFFFF', fontSize: 8, fontWeight: '800' },
  label: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  arrow: {
    height: 76,
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
