import { Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { styles } from './iconButton.styles';

export default function IconButton({ name, onPress, showDot, label, color = colors.textPrimary }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label || name}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Feather name={name} size={20} color={color} />
      {showDot && <View style={styles.dot} />}
    </Pressable>
  );
}
