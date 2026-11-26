import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  tile: {
    width: '48%',
    height: 100,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  pressed: { opacity: 0.75 },
  image: { ...StyleSheet.absoluteFillObject },
  shade: { ...StyleSheet.absoluteFillObject },
  textBox: { padding: 14 },
  label: { color: colors.textPrimary, fontSize: 15, fontWeight: '800' },
});
