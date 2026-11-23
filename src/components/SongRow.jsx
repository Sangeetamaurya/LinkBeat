import { Pressable, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import CoverImage from './CoverImage';
import { formatTime } from '../lib/format';
import { splitMatch } from '../lib/highlight';
import { colors } from '../theme/colors';
import { styles } from './SongRow.styles';

export default function SongRow({
  song,
  onPress,
  highlight = '',
  isCurrent = false,
  liked = false,
  onLike,
}) {
  const [before, match, after] = splitMatch(song.title, highlight);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <CoverImage uri={song.cover} style={styles.cover} />
      <View style={styles.textBox}>
        <Text style={styles.title} numberOfLines={1}>
          {before}
          {match ? <Text style={styles.match}>{match}</Text> : null}
          {after}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {song.artist}
        </Text>
      </View>
      {onLike && (
        <Pressable onPress={onLike} hitSlop={10} style={styles.like}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={20}
            color={liked ? colors.accent : colors.textSecondary}
          />
        </Pressable>
      )}
      {isCurrent ? (
        <Feather name="volume-2" size={16} color={colors.textPrimary} />
      ) : (
        <Text style={styles.time}>{formatTime(song.duration)}</Text>
      )}
    </Pressable>
  );
}
