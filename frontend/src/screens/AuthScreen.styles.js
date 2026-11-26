import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 32 },

  topRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  skip: {
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },

  title: { color: colors.textPrimary, fontSize: 30, fontWeight: '700', marginTop: 16 },
  caption: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 8 },

  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 999,
    padding: 4,
    marginTop: 28,
    marginBottom: 20,
  },
  toggleItem: { flex: 1, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  toggleActive: { backgroundColor: '#FFFFFF' },
  toggleText: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  toggleTextActive: { color: '#000000' },

  error: { color: '#FF5A5F', fontSize: 13, marginTop: 2, marginBottom: 4 },

  button: {
    height: 56,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: { color: '#000000', fontSize: 16, fontWeight: '600' },

  guestLink: { alignItems: 'center', marginTop: 18 },
  guestText: { color: colors.textSecondary, fontSize: 14 },
});
