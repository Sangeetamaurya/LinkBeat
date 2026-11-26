import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 210 },
  title: { color: colors.textPrimary, fontSize: 30, fontWeight: '800', marginTop: 12 },
  bar: { marginTop: 18 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
    marginBottom: 6,
  },
  sectionTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  clear: { color: colors.textSecondary, fontSize: 11 },
  genresTitle: { marginTop: 28, marginBottom: 14 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  hint: { color: colors.textSecondary, fontSize: 13, marginTop: 8 },
  resultsBox: { marginTop: 22 },
  loader: { marginTop: 40 },
  centerBox: { alignItems: 'center', marginTop: 40 },
  emptyTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '700', marginTop: 12 },
  retry: {
    marginTop: 14,
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  retryText: { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
});
