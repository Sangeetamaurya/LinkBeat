import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import SectionHeader from './SectionHeader';
import CollectionCard from './CollectionCard';
import { colors } from '../theme/colors';
import { styles } from './SongCarousel.styles';

// A "New Collection" style row: title + sideways list of poster cards.
// Used for suggested songs, most played, trending and every genre.
export default function SongCarousel({
  title,
  subtitle,
  songs,
  loading,
  error,
  onRetry,
  action,
  onAction,
  likedIds,
  onLike,
  onPlay,
  hideWhenEmpty = false,
  hideHeader = false,
  style,
}) {
  if (hideWhenEmpty && !loading && !error && songs.length === 0) return null;

  return (
    <View style={[styles.section, style]}>
      {!hideHeader && (
        <SectionHeader title={title} subtitle={subtitle} action={action} onPress={onAction} />
      )}

      {loading && songs.length === 0 && (
        <View style={styles.placeholderRow}>
          <ActivityIndicator color={colors.textPrimary} />
        </View>
      )}

      {error && songs.length === 0 && (
        <Pressable onPress={onRetry} style={styles.placeholderRow}>
          <Text style={styles.errorText}>Could not load. Tap to retry.</Text>
        </Pressable>
      )}

      {songs.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} removeClippedSubviews={false}>
          {songs.map((song, i) => (
            <CollectionCard
              key={song.id}
              song={song}
              liked={likedIds.includes(song.id)}
              onLike={() => onLike(song)}
              onPress={() => onPlay(songs, i)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
