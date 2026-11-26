import { Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { styles } from './ControlBar.styles';

export default function ControlBar({
  isPlaying,
  repeat,
  shuffle,
  onToggle,
  onPrev,
  onNext,
  onRepeat,
  onShuffle,
}) {
  return (
    <View style={styles.bar}>
      <Pressable onPress={onRepeat} style={styles.side}>
        <Feather
          name="repeat"
          size={18}
          color={repeat ? colors.textPrimary : colors.textSecondary}
        />
        {repeat && <View style={styles.activeDot} />}
      </Pressable>

      <Pressable onPress={onPrev} style={styles.side}>
        <Feather name="skip-back" size={20} color={colors.textPrimary} />
      </Pressable>

      <Pressable onPress={onToggle} style={styles.play}>
        <Feather name={isPlaying ? 'pause' : 'play'} size={24} color="#000000" />
      </Pressable>

      <Pressable onPress={onNext} style={styles.side}>
        <Feather name="skip-forward" size={20} color={colors.textPrimary} />
      </Pressable>

      <Pressable onPress={onShuffle} style={styles.side}>
        <Feather
          name="shuffle"
          size={18}
          color={shuffle ? colors.textPrimary : colors.textSecondary}
        />
        {shuffle && <View style={styles.activeDot} />}
      </Pressable>
    </View>
  );
}
