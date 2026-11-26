import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { styles } from './GuestBanner.styles';

export default function GuestBanner({ onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.banner}>
      <View style={styles.textBox}>
        <Text style={styles.title}>Log in or sign up</Text>
        <Text style={styles.caption}>Save your songs and get music picked for you.</Text>
      </View>
      <Feather name="chevron-right" size={20} color={colors.textPrimary} />
    </Pressable>
  );
}
