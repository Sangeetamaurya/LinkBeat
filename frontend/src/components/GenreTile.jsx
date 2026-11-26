import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CoverImage from './CoverImage';
import { styles } from './GenreTile.styles';

// Genre button with a picture (cover of a top song in that genre).
export default function GenreTile({ label, image, tint, onPress }) {
  const { width: screenWidth } = useWindowDimensions();
  const tileWidth = Math.floor((screenWidth - 40) * 0.48) - 2; // 48% minus the 1px borders

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      <CoverImage uri={image} tint={tint} style={{ position: 'absolute', top: 0, left: 0, width: tileWidth, height: 98 }} iconSize={26} />
      <LinearGradient
        colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.75)']}
        style={styles.shade}
      />
      <View style={styles.textBox}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}
