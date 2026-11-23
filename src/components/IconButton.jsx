import { Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { styles } from './iconButton.styles';

export default function IconButton({ name, onPress, showDot, color = colors.textPrimary }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Feather name={name} size={20} color={color} />
      {showDot && <View style={styles.dot} />}
    </Pressable>
  );
}
