import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  item: {
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
  },
  question: { flexDirection: 'row', alignItems: 'center' },
  questionText: { flex: 1, color: colors.textPrimary, fontSize: 14, fontWeight: '600', marginRight: 10 },
  answer: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginTop: 12 },
});
