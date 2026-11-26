import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { styles } from './ProgressBar.styles';

// progress is 0 to 1. Tapping the bar calls onSeek with the tapped position (0 to 1).
export default function ProgressBar({ progress, onSeek }) {
  const [width, setWidth] = useState(0);
  const safe = Math.min(Math.max(progress || 0, 0), 1);
  const percent = safe * 100 + '%';

  const handlePress = (event) => {
    if (!onSeek || width === 0) return;
    const ratio = event.nativeEvent.locationX / width;
    onSeek(Math.min(Math.max(ratio, 0), 1));
  };

  return (
    <Pressable
      style={styles.hit}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      onPress={handlePress}
    >
      <View style={styles.track}>
        <View style={[styles.fill, { width: percent }]} />
        <View style={[styles.thumb, { left: percent }]} />
      </View>
    </Pressable>
  );
}
