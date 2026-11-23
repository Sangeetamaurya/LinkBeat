import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../components/SearchBar';
import RecentRow from '../components/RecentRow';
import GenreTileLoader from '../components/GenreTileLoader';
import SongRow from '../components/SongRow';
import BottomDock from '../components/BottomDock';
import { usePlayer } from '../context/PlayerContextDSA';
import { GENRES, termFor } from '../data/genres';
import { searchSongs } from '../lib/api';
import { colors } from '../theme/colors';
import { styles } from './SearchScreen.styles';

export default function SearchScreen({
  recent,
  onAddRecent,
  onRemoveRecent,
  onClearRecent,
  onOpenPlayer,
  onTabChange,
  seed,
}) {
  const { playQueue, currentSong, likedIds, toggleLike } = usePlayer();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const trimmed = query.trim();

  // Home's genre "See All" sends the user here with the genre already searched
  useEffect(() => {
    if (seed) setQuery(seed.label);
  }, [seed]);

  // search 0.4 seconds after the user stops typing
  useEffect(() => {
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      setError(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    const timer = setTimeout(() => {
      searchSongs(termFor(trimmed), 20)
        .then((list) => {
          if (!cancelled) setResults(list);
        })
        .catch(() => {
          if (!cancelled) setError(true);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed, retryKey]);

  const playResult = (index) => {
    onAddRecent(trimmed);
    Keyboard.dismiss();
    playQueue(results, index);
  };

  const pickGenre = (label) => {
    onAddRecent(label);
    setQuery(label);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Search</Text>

        <View style={styles.bar}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onSubmit={() => onAddRecent(trimmed)}
            onClear={() => setQuery('')}
          />
        </View>

        {trimmed === '' ? (
          <>
            <View style={styles.headerRow}>
              <Text style={styles.sectionTitle}>Recent searches</Text>
              {recent.length > 0 && (
                <Pressable onPress={onClearRecent}>
                  <Text style={styles.clear}>Clear</Text>
                </Pressable>
              )}
            </View>

            {recent.length === 0 ? (
              <Text style={styles.hint}>Your recent searches will show up here.</Text>
            ) : (
              recent.map((text) => (
                <RecentRow
                  key={text}
                  text={text}
                  onPress={() => setQuery(text)}
                  onRemove={() => onRemoveRecent(text)}
                />
              ))
            )}

            <Text style={[styles.sectionTitle, styles.genresTitle]}>Browse Genres</Text>
            <View style={styles.grid}>
              {GENRES.map((genre, i) => (
                <GenreTileLoader
                  key={genre.label}
                  genre={genre}
                  index={i}
                  onPress={() => pickGenre(genre.label)}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.resultsBox}>
            {loading && (
              <ActivityIndicator style={styles.loader} color={colors.textPrimary} />
            )}

            {!loading && error && (
              <View style={styles.centerBox}>
                <Text style={styles.hint}>Could not load songs. Check your internet.</Text>
                <Pressable style={styles.retry} onPress={() => setRetryKey((k) => k + 1)}>
                  <Text style={styles.retryText}>Try again</Text>
                </Pressable>
              </View>
            )}

            {!loading && !error && results.length === 0 && (
              <View style={styles.centerBox}>
                <Feather name="search" size={28} color={colors.textSecondary} />
                <Text style={styles.emptyTitle}>No songs found</Text>
                <Text style={styles.hint}>Try a different song or artist name.</Text>
              </View>
            )}

            {!loading &&
              !error &&
              results.map((song, i) => (
                <SongRow
                  key={song.id}
                  song={song}
                  highlight={trimmed}
                  isCurrent={currentSong ? currentSong.id === song.id : false}
                  liked={likedIds.includes(song.id)}
                  onLike={() => toggleLike(song)}
                  onPress={() => playResult(i)}
                />
              ))}
          </View>
        )}
      </ScrollView>

      <BottomDock active="search" onTabChange={onTabChange} onOpenPlayer={onOpenPlayer} />
    </SafeAreaView>
  );
}
