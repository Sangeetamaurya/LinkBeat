import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { colors } from '../theme/colors';
import { styles } from './HelpScreen.styles';

const FAQ = [
  {
    q: 'Why do songs stop after 30 seconds?',
    a: 'LinkBeat plays the free preview clips from the iTunes Search API. They are 30 seconds long, then the next song starts.',
  },
  {
    q: 'How do I save a song?',
    a: 'Tap the heart on any song. It is saved in Library under Liked Songs, and grouped by genre and artist.',
  },
  {
    q: 'What is the strip with HEAD and TAIL?',
    a: 'It shows the songs in your queue as a linked list. HEAD is the first song and TAIL is the last. After the TAIL, the queue goes back to the HEAD.',
  },
  {
    q: 'How are Top Artists and hours listened counted?',
    a: 'From the songs you play and like, and the seconds a song is really playing. They reset when you close the app.',
  },
  {
    q: 'How do I change my photo or name?',
    a: 'Open Profile and tap Edit Profile. You can also tap the camera badge on your photo.',
  },
];

export default function HelpScreen({ onBack }) {
  const [open, setOpen] = useState(0);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Help & Support" onBack={onBack} />
        {FAQ.map((item, i) => (
          <Pressable
            key={item.q}
            onPress={() => setOpen(open === i ? -1 : i)}
            style={styles.item}
          >
            <View style={styles.question}>
              <Text style={styles.questionText}>{item.q}</Text>
              <Feather
                name={open === i ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={colors.textSecondary}
              />
            </View>
            {open === i && <Text style={styles.answer}>{item.a}</Text>}
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
