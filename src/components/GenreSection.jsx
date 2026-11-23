import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SongCarousel from './SongCarousel';
import CoverImage from './CoverImage';
import { useSongs } from '../hooks/useSongs';
import { genreDelay } from '../data/genres';
import { colors } from '../theme/colors';
import { styles } from './GenreSection.styles';

// One genre row on Home (Pop, Rock ...): a coloured banner with the genre's picture,
// then the songs of that genre below it.
export default function GenreSection({ genre, index, likedIds, onLike, onPlay, onSeeAll }) {
  const { songs, loading, error, reload } = useSongs(genre.term, {
    limit: 10,
    delay: genreDelay(index),
  });

  return (
    <View style={styles.section}>
      <Pressable onPress={onSeeAll} style={styles.banner}>
        <LinearGradient
          colors={genre.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}
        />

        {/* picture of the first song of this genre, on the right */}
        {songs.length > 0 && (
          <View style={styles.artWrap}>
            <CoverImage uri={songs[0].cover} style={styles.art} iconSize={24} tint={genre.colors} />
          </View>
        )}
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.35)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.fill}
        />

        <View style={styles.iconCircle}>
          <Ionicons name={genre.icon} size={20} color={colors.textPrimary} />
        </View>
        <View style={styles.textBox}>
          <Text style={styles.title}>{genre.label}</Text>
          <Text style={styles.subtitle}>Top picks</Text>
        </View>
        <View style={styles.seeAll}>
          <Text style={styles.seeAllText}>See All</Text>
        </View>
      </Pressable>

      <SongCarousel
        hideHeader
        style={styles.carousel}
        songs={songs}
        loading={loading}
        error={error}
        onRetry={reload}
        likedIds={likedIds}
        onLike={onLike}
        onPlay={onPlay}
      />
    </View>
  );
}
