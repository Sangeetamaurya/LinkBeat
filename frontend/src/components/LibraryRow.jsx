import { Pressable, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import CoverImage from './CoverImage';
import { colors } from '../theme/colors';
import { styles } from './LibraryRow.styles';

// A row in Library: picture, name, "12 songs", chevron.
// pinned = the big Liked Songs card at the top. round = artist picture.
export default function LibraryRow({ title, count, image, pinned = false, round = false, last = false, onPress }) {
  const countText = count + (count === 1 ? ' song' : ' songs');

  if (pinned) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.pinned, pressed && styles.pressed]}>
        {image ? (
          <CoverImage uri={image} style={styles.pinnedArt} />
        ) : (
          <View style={[styles.pinnedArt, styles.heartTile]}>
            <Ionicons name="heart" size={22} color={colors.textPrimary} />
          </View>
        )}
        <View style={styles.textBox}>
          <Text style={styles.pinnedLabel}>PINNED</Text>
          <Text style={styles.pinnedTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.count}>{countText}</Text>
        </View>
        <Feather name="chevron-right" size={18} color={colors.textSecondary} />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, !last && styles.divider, pressed && styles.pressed]}
    >
      <CoverImage uri={image} style={[styles.art, round && styles.artRound]} />
      <View style={styles.textBox}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.count}>{countText}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}
