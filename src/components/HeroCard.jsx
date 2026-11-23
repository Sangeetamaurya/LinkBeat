import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CoverImage from './CoverImage';
import { formatTime } from '../lib/format';
import { colors } from '../theme/colors';
import { styles } from './HeroCard.styles';

export default function HeroCard({ song, badge = '100M', onPress }) {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth - 40; // page padding is 20 each side

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <CoverImage uri={song.cover} style={{ position: 'absolute', top: 0, left: 0, width: cardWidth, height: 215 }} iconSize={40} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.fill}
      />

      <View style={styles.badge}>
        <Feather name="eye" size={12} color={colors.textPrimary} />
        <Text style={styles.badgeText}>{badge}</Text>
      </View>

      <View style={styles.info}>
        <CoverImage uri={song.cover} style={styles.thumb} />
        <View style={styles.textBox}>
          <Text style={styles.title} numberOfLines={1}>
            {song.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {song.artist}
          </Text>
        </View>
        <Text style={styles.time}>{formatTime(song.duration)}</Text>
      </View>
    </Pressable>
  );
}
