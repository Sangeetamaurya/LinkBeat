import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { styles } from './GuestBanner.styles';

export default function GuestBanner({ onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.banner}>
      <View style={styles.textBox}>
        <Text style={styles.title}>Set up your profile</Text>
        <Text style={styles.caption}>Get music picked just for you.</Text>
      </View>
      <Feather name="chevron-right" size={20} color={colors.textPrimary} />
    </Pressable>
  );
}
