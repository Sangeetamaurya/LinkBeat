import { Pressable, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { styles } from './RecentRow.styles';

export default function RecentRow({ text, onPress, onRemove }) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Feather name="clock" size={16} color={colors.textSecondary} />
      <Text style={styles.text} numberOfLines={1}>
        {text}
      </Text>
      <Pressable onPress={onRemove} hitSlop={12}>
        <Feather name="x" size={16} color={colors.textSecondary} />
      </Pressable>
    </Pressable>
  );
}
