import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 32 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  heading: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },

  art: {
    alignSelf: 'center',
    marginTop: 24,
    width: '92%',
    aspectRatio: 1,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
  },
  artImage: { ...StyleSheet.absoluteFillObject },
  frame: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    bottom: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  tag: {
    position: 'absolute',
    right: 28,
    bottom: 26,
    color: 'rgba(255,255,255,0.75)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  infoCard: {
    marginTop: 18,
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginRight: 10,
  },
  status: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 6,
  },
  artist: { color: colors.textSecondary, fontSize: 13, fontWeight: '600', marginTop: 4 },
  progress: { marginTop: 14 },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  time: { color: colors.textSecondary, fontSize: 9, fontWeight: '600' },

  block: { marginTop: 14 },
});
