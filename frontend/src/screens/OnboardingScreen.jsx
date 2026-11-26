import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PaginationDots from '../components/PaginationDots';
import { styles } from './OnboardingScreen.styles';

export default function OnboardingScreen({ onGetStarted, onSkip }) {
  return (
    <View style={styles.container}>
      {/* Decorative rings in the top right corner */}
      <View style={[styles.ring, styles.ringBig]} />
      <View style={[styles.ring, styles.ringSmall]} />

      <SafeAreaView style={styles.safe}>
        {/* Top row: Skip button */}
        <View style={styles.topRow}>
          <Pressable style={styles.skip} onPress={onSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {/* Bottom content */}
        <View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Music app</Text>
          </View>

          <Text style={styles.title}>Smarter Sounds{'\n'}Start Here.</Text>
          <Text style={styles.description}>
            A listening experience that learns what you love and keeps every
            moment in sync.
          </Text>

          <View style={styles.dots}>
            <PaginationDots count={3} activeIndex={0} />
          </View>

          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={onGetStarted}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
