import { ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import SongRow from '../components/SongRow';
import { usePlayer } from '../context/PlayerContext';
import { colors } from '../theme/colors';
import { styles } from './HistoryScreen.styles';

// Songs played in this session, newest first. Tap one to play it again.
export default function HistoryScreen({ onBack, onOpenPlayer }) {
  const { history, likedIds, toggleLike, playQueue, currentSong } = usePlayer();

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Listening History" onBack={onBack} />

        {history.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="clock" size={30} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>Nothing played yet</Text>
            <Text style={styles.emptyText}>Songs you play show up here.</Text>
          </View>
        ) : (
          history.map((song, i) => (
            <SongRow
              key={song.id}
              song={song}
              isCurrent={currentSong ? currentSong.id === song.id : false}
              liked={likedIds.includes(song.id)}
              onLike={() => toggleLike(song)}
              onPress={() => {
                playQueue(history, i);
                onOpenPlayer();
              }}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
