import { Image, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import IconButton from './IconButton';
import { colors } from '../theme/colors';
import { styles } from './TopBar.styles';

export default function TopBar({ name, avatar, showBell = true, onSearch }) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarEmpty]}>
            <Feather name="user" size={20} color={colors.textSecondary} />
          </View>
        )}
        <View style={styles.textBox}>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>

      <View style={styles.right}>
        <IconButton name="search" onPress={onSearch} />
        {showBell && (
          <>
            <View style={styles.gap} />
            <IconButton name="bell" showDot />
          </>
        )}
      </View>
    </View>
  );
}
