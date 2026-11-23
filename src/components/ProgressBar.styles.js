import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  hit: { height: 24, justifyContent: 'center' },
  track: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    pointerEvents: 'none',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  thumb: {
    position: 'absolute',
    top: -4.5,
    width: 12,
    height: 12,
    marginLeft: -6,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
});
