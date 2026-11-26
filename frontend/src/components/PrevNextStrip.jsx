import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import CoverImage from './CoverImage';
import { styles } from './PrevNextStrip.styles';

export default function PrevNextStrip({ prevSong, nextSong, onPrev, onNext }) {
  return (
    <View style={styles.strip}>
      <Pressable onPress={onPrev} style={styles.side}>
        <CoverImage uri={prevSong.cover} style={styles.thumb} iconSize={14} />
        <View style={styles.textLeft}>
          <Text style={styles.label}>PREV</Text>
          <Text style={styles.title} numberOfLines={1}>
            {prevSong.title}
          </Text>
        </View>
      </Pressable>

      <Feather name="chevrons-right" size={14} color="rgba(255,255,255,0.35)" />

      <Pressable onPress={onNext} style={[styles.side, styles.sideRight]}>
        <View style={styles.textRight}>
          <Text style={styles.label}>NEXT</Text>
          <Text style={styles.title} numberOfLines={1}>
            {nextSong.title}
          </Text>
        </View>
        <CoverImage uri={nextSong.cover} style={styles.thumb} iconSize={14} />
      </Pressable>
    </View>
  );
}
