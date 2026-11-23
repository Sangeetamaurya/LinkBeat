import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  safe: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  ringBig: {
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -90,
    right: -90,
  },
  ringSmall: {
    width: 190,
    height: 190,
    borderRadius: 95,
    top: -35,
    right: -35,
  },
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
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  tagText: { color: colors.textPrimary, fontSize: 12, fontWeight: '600' },
  title: {
    color: colors.textPrimary,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
    marginTop: 16,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  dots: { marginTop: 28 },
  button: {
    height: 56,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  pressed: { opacity: 0.85 },
  buttonText: { color: '#000000', fontSize: 16, fontWeight: '600' },
});