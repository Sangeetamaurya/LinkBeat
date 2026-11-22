import { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../components/TopBar';
import GuestBanner from '../components/GuestBanner';
import LinkedListStrip from '../components/LinkedListStrip';
import SectionHeader from '../components/SectionHeader';
import HeroCard from '../components/HeroCard';
import SongCarousel from '../components/SongCarousel';
import GenreSection from '../components/GenreSection';
import BottomDock from '../components/BottomDock';
import { usePlayer } from '../context/PlayerContext';
import { useSongs } from '../hooks/useSongs';
import { GENRES, MOST_PLAYED_TERMS, TRENDING_TERMS, termFor } from '../data/genres';
import { getQueueWindow } from '../lib/queueWindow';
import { colors } from '../theme/colors';
import { styles } from './HomeScreen.styles';

const SEARCH_TERM = 'Dua Lipa';

export default function HomeScreen({
  user,
  recentSearches,
  onSetupProfile,
  onOpenPlayer,
  onOpenGenre,
  onTabChange,
}) {
  const {
    songs: queue,
    currentIndex,
    currentSong,
    isPlaying,
    likedIds,
    likedSongs,
    mostPlayed,
    playQueue,
    playIndex,
    toggleLike,
  } = usePlayer();

  // top of the page: hero + "New Collection"
  const main = useSongs(SEARCH_TERM, { limit: 20 });

  // suggestions: based on the user's latest search ...
  const lastSearch = recentSearches.length > 0 ? recentSearches[0] : '';
  const searched = useSongs(lastSearch ? termFor(lastSearch) : '', { limit: 10, delay: 400 });

  // ... and on the artist of the song they liked last
  const likedArtist = likedSongs.length > 0 ? likedSongs[0].artist : '';
  const liked = useSongs(likedArtist, { limit: 10, delay: 600 });

  const chart = useSongs(MOST_PLAYED_TERMS, { limit: 12, delay: 200 });
  const trending = useSongs(TRENDING_TERMS, { limit: 12, delay: 500 });

  const notLiked = (list) => list.filter((s) => !likedIds.includes(s.id));
  const searchedSongs = useMemo(() => notLiked(searched.songs), [searched.songs, likedIds]);
  const likedSuggestions = useMemo(() => notLiked(liked.songs), [liked.songs, likedIds]);

  // "Most Played": songs this user played the most come first, then the popular ones
  const mostPlayedList = useMemo(() => {
    const seen = new Set();
    return [...mostPlayed.slice(0, 5), ...chart.songs]
      .filter((s) => (seen.has(s.id) ? false : seen.add(s.id)))
      .slice(0, 12);
  }, [mostPlayed, chart.songs]);

  // the strip shows 4 songs of the playing queue, with the playing one as the big node
  const { start, end } = getQueueWindow(queue.length, currentIndex);
  const stripNodes = queue.slice(start, end).map((song, i) => ({
    id: song.id,
    image: song.cover,
    isLive: start + i === currentIndex && isPlaying,
  }));

  const songs = main.songs;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {user ? (
          <TopBar
            name={user.name}
            avatar={user.avatar || undefined}
            onSearch={() => onTabChange('search')}
          />
        ) : (
          <TopBar name="Guest" showBell={false} onSearch={() => onTabChange('search')} />
        )}

        {!user && <GuestBanner onPress={onSetupProfile} />}

        {/* HEAD / TAIL strip: only visible once a song is playing */}
        {currentSong && (
          <View style={styles.section}>
            <LinkedListStrip
              nodes={stripNodes}
              currentIndex={currentIndex - start}
              onSelect={(i) => playIndex(start + i)}
              hasHead={start === 0}
              hasTail={end === queue.length}
            />
          </View>
        )}

        {main.loading && (
          <ActivityIndicator style={styles.loader} color={colors.textPrimary} />
        )}

        {main.error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>Could not load songs. Check your internet.</Text>
            <Pressable style={styles.retry} onPress={main.reload}>
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        )}

        {!main.loading && !main.error && songs.length > 0 && (
          <View style={styles.sectionLarge}>
            <SectionHeader title="Top Daily Playlist" action="See All" />
            <HeroCard song={songs[0]} onPress={() => playQueue(songs, 0)} />
          </View>
        )}

        {!main.loading && !main.error && songs.length > 1 && (
          <SongCarousel
            title="New Collection"
            songs={songs.slice(1, 9)}
            likedIds={likedIds}
            onLike={toggleLike}
            onPlay={(list, i) => playQueue(songs, i + 1)}
          />
        )}

        {/* Suggested for you: same card style, based on searches and likes */}
        <SongCarousel
          title="Suggested for you"
          subtitle={'Because you searched "' + lastSearch + '"'}
          songs={searchedSongs}
          loading={searched.loading}
          error={searched.error}
          onRetry={searched.reload}
          likedIds={likedIds}
          onLike={toggleLike}
          onPlay={playQueue}
          hideWhenEmpty
        />

        <SongCarousel
          title="Because you liked"
          subtitle={likedArtist}
          songs={likedSuggestions}
          loading={liked.loading}
          error={liked.error}
          onRetry={liked.reload}
          likedIds={likedIds}
          onLike={toggleLike}
          onPlay={playQueue}
          hideWhenEmpty
        />

        <SongCarousel
          title="Most Played"
          subtitle={mostPlayed.length > 0 ? 'Your plays first, then the charts' : 'Fan favourites'}
          songs={mostPlayedList}
          loading={chart.loading}
          error={chart.error}
          onRetry={chart.reload}
          likedIds={likedIds}
          onLike={toggleLike}
          onPlay={playQueue}
        />

        <SongCarousel
          title="Trending Now"
          subtitle="What everyone is listening to"
          songs={trending.songs}
          loading={trending.loading}
          error={trending.error}
          onRetry={trending.reload}
          likedIds={likedIds}
          onLike={toggleLike}
          onPlay={playQueue}
        />

        {GENRES.map((genre, i) => (
          <GenreSection
            key={genre.label}
            genre={genre}
            index={i}
            likedIds={likedIds}
            onLike={toggleLike}
            onPlay={playQueue}
            onSeeAll={() => onOpenGenre(genre.label)}
          />
        ))}
      </ScrollView>

      <BottomDock active="home" onTabChange={onTabChange} onOpenPlayer={onOpenPlayer} />
    </SafeAreaView>
  );
}
