import { Text, View } from 'react-native';
import IconButton from './IconButton';
import { styles } from './ScreenHeader.styles';

// Back button + title, used on the screens opened from Profile.
export default function ScreenHeader({ title, onBack }) {
  return (
    <View style={styles.row}>
      <IconButton name="chevron-left" label="Back" onPress={onBack} />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.space} />
    </View>
  );
}
