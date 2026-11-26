import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  empty: { alignItems: 'center', marginTop: 56, paddingHorizontal: 24 },
  emptyTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginTop: 14 },
  emptyText: { color: colors.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 6 },
});
