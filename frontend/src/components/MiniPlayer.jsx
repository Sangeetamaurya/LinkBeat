import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import CoverImage from './CoverImage';
import { usePlayer } from '../context/PlayerContext';
import { colors } from '../theme/colors';
import { styles } from './MiniPlayer.styles';

export default function MiniPlayer({ onPress }) {
  const { currentSong, isPlaying, togglePlay, next } = usePlayer();

  if (!currentSong) return null;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <CoverImage uri={currentSong.cover} style={styles.thumb} />
      <View style={styles.textBox}>
        <Text style={styles.title} numberOfLines={1}>
          {currentSong.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {currentSong.artist}
        </Text>
      </View>
      <Pressable onPress={togglePlay} style={styles.control}>
        <Feather
          name={isPlaying ? 'pause' : 'play'}
          size={20}
          color={colors.textPrimary}
        />
      </Pressable>
      <Pressable onPress={next} style={styles.control}>
        <Feather name="skip-forward" size={20} color={colors.textPrimary} />
      </Pressable>
    </Pressable>
  );
}
