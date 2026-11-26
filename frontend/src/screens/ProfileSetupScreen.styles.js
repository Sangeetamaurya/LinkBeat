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

  avatarWrap: { alignSelf: 'center', marginVertical: 28 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#2A2A2A',
    borderColor: '#FFFFFF',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // exact size (110 minus the 2px border on each side), see CoverImage for why
  avatarImage: { width: 106, height: 106, borderRadius: 53 },
  avatarHint: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: -16,
    marginBottom: 20,
  },
  camera: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1C1C1E',
    borderColor: colors.glassBorder,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  error: { color: '#FF5A5F', fontSize: 12, marginTop: -6, marginBottom: 10 },

  section: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 14,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },

  button: {
    height: 56,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#000000', fontSize: 16, fontWeight: '600' },

  skipLink: { alignItems: 'center', marginTop: 16 },
  skipLinkText: { color: colors.textSecondary, fontSize: 14 },
});
