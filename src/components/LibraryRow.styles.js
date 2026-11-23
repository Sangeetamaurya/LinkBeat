import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  pressed: { opacity: 0.75 },

  pinned: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 24,
    padding: 14,
    marginTop: 18,
    marginBottom: 6,
  },
  pinnedArt: { width: 62, height: 62, borderRadius: 18 },
  heartTile: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinnedLabel: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  pinnedTitle: { color: colors.textPrimary, fontSize: 17, fontWeight: '800', marginTop: 2 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  divider: { borderBottomColor: 'rgba(255,255,255,0.12)', borderBottomWidth: 1 },
  art: { width: 54, height: 54, borderRadius: 14 },
  artRound: { borderRadius: 27 },

  textBox: { flex: 1, marginLeft: 14, marginRight: 8 },
  title: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  count: { color: colors.link, fontSize: 12, marginTop: 3 },
});
