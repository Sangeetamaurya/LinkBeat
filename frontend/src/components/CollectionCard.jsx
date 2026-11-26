import { Pressable, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CoverImage from './CoverImage';
import { colors } from '../theme/colors';
import { styles } from './CollectionCard.styles';

// One song as a poster card. The heart saves it to the Library.
export default function CollectionCard({ song, onPress, liked = false, onLike }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <CoverImage uri={song.cover} style={{ position: 'absolute', top: 0, left: 0, width: 170, height: 210 }} iconSize={36} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={styles.fill}
      />

      {onLike && (
        <Pressable onPress={onLike} hitSlop={8} style={styles.like}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={16}
            color={liked ? colors.accent : colors.textPrimary}
          />
        </Pressable>
      )}

      <View style={styles.bottom}>
        <View style={styles.textBox}>
          <Text style={styles.title} numberOfLines={1}>
            {song.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {song.artist}
          </Text>
        </View>
        <View style={styles.arrow}>
          <Feather name="arrow-right" size={14} color={colors.textPrimary} />
        </View>
      </View>
    </Pressable>
  );
}
