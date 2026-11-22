import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 210 },
  section: { marginTop: 24 },
  sectionLarge: { marginTop: 28 },
  loader: { marginTop: 48 },
  errorBox: { alignItems: 'center', marginTop: 48 },
  errorText: { color: colors.textSecondary, fontSize: 14 },
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
