import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 40 },

  note: { color: '#4ADE80', fontSize: 13, marginBottom: 6 },
  section: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginTop: 16, marginBottom: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  rowText: { flex: 1, marginLeft: 12, marginRight: 8 },
  rowLabel: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  rowHint: { color: colors.textSecondary, fontSize: 11, marginTop: 3 },

  about: {
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  aboutTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
  aboutText: { color: colors.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 6 },
});
