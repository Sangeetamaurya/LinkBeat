import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { usePlayer } from '../context/PlayerContext';
import { colors } from '../theme/colors';
import { styles } from './SettingsScreen.styles';

// Clean-up actions that really work on the data of this app.
export default function SettingsScreen({ onBack, onClearSearches }) {
  const { clearListening, clearLiked } = usePlayer();
  const [note, setNote] = useState('');

  const ask = (title, text, action, done) => {
    Alert.alert(title, text, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          action();
          setNote(done);
        },
      },
    ]);
  };

  const items = [
    {
      key: 'history',
      icon: 'clock',
      label: 'Clear listening history',
      hint: 'Recently played, top artists and weekly chart',
      run: () =>
        ask('Clear listening history?', 'Your recently played list and listening stats reset.', clearListening, 'Listening history cleared'),
    },
    {
      key: 'searches',
      icon: 'search',
      label: 'Clear recent searches',
      hint: 'Also resets the Suggested for you row',
      run: () =>
        ask('Clear recent searches?', 'Your search history is removed.', onClearSearches, 'Recent searches cleared'),
    },
    {
      key: 'liked',
      icon: 'heart',
      label: 'Remove all liked songs',
      hint: 'Empties your Library',
      run: () =>
        ask('Remove all liked songs?', 'Your Library is emptied.', clearLiked, 'Liked songs removed'),
    },
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Settings" onBack={onBack} />

        {note !== '' && <Text style={styles.note}>{note}</Text>}

        <Text style={styles.section}>Your data</Text>
        {items.map((item) => (
          <Pressable key={item.key} onPress={item.run} style={styles.row}>
            <Feather name={item.icon} size={18} color={colors.textPrimary} />
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowHint}>{item.hint}</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textSecondary} />
          </Pressable>
        ))}

        <Text style={styles.section}>About</Text>
        <View style={styles.about}>
          <Text style={styles.aboutTitle}>LinkBeat 1.0.0</Text>
          <Text style={styles.aboutText}>
            Song info, covers and 30 second previews come from the iTunes Search API.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
