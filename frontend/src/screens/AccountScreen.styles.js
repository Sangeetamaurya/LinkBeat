import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },

  card: {
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
  },
  label: { color: colors.textSecondary, fontSize: 9, fontWeight: '700', letterSpacing: 2 },
  value: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginTop: 6 },
  line: { height: 1, backgroundColor: colors.glassBorder, marginVertical: 14 },

  section: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginTop: 28, marginBottom: 14 },
  message: { color: '#FF5A5F', fontSize: 13, marginBottom: 4 },
  messageOk: { color: '#4ADE80' },
  button: {
    height: 52,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#000000', fontSize: 15, fontWeight: '600' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginTop: 10,
  },
  rowTop: { marginTop: 32 },
  rowText: { color: '#FF5A5F', fontSize: 14, fontWeight: '600', marginLeft: 12 },
});
