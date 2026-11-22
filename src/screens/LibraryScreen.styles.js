import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 210 },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
  },
  title: { color: colors.textPrimary, fontSize: 30, fontWeight: '800', marginTop: 4 },

  tabs: { flexDirection: 'row', marginTop: 20 },
  chip: {
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },
  chipText: { color: colors.textPrimary, fontSize: 12, fontWeight: '700' },
  chipTextActive: { color: '#0B0B0F' },

  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 18,
  },
  sortText: { color: colors.link, fontSize: 12, marginHorizontal: 6 },

  list: { marginTop: 6 },
  section: { marginTop: 8 },
  empty: { alignItems: 'center', marginTop: 56, paddingHorizontal: 24 },
  emptyTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginTop: 14 },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
  },

  // opened playlist / artist
  detailTop: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  detailHeading: {
    flex: 1,
    textAlign: 'center',
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginRight: 40,
  },
  detailArt: {
    alignSelf: 'center',
    width: 190,
    height: 190,
    borderRadius: 28,
    marginTop: 22,
  },
  detailTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 16,
  },
  detailCount: { color: colors.link, fontSize: 12, textAlign: 'center', marginTop: 4 },
  playButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 26,
    paddingVertical: 11,
    marginTop: 16,
    marginBottom: 22,
  },
  playText: { color: '#0B0B0F', fontSize: 13, fontWeight: '800', marginLeft: 8 },
});
