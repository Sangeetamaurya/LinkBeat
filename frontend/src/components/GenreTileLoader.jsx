import GenreTile from './GenreTile';
import { useSongs } from '../hooks/useSongs';
import { genreDelay } from '../data/genres';

// Fetches one genre's songs (shared with Home) and shows the first cover on the tile.
export default function GenreTileLoader({ genre, index, onPress }) {
  const { songs } = useSongs(genre.term, { limit: 10, delay: genreDelay(index) });
  return (
    <GenreTile
      label={genre.label}
      image={songs.length > 0 ? songs[0].cover : ''}
      tint={genre.colors}
      onPress={onPress}
    />
  );
}
