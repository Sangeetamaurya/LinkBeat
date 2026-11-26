import { useEffect, useMemo, useState } from 'react';
import { BackHandler, Pressable, ScrollView, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconButton from '../components/IconButton';
import CoverImage from '../components/CoverImage';
import LibraryRow from '../components/LibraryRow';
import SongRow from '../components/SongRow';
import BottomDock from '../components/BottomDock';
import { usePlayer } from '../context/PlayerContext';
import { colors } from '../theme/colors';
import { styles } from './LibraryScreen.styles';

const TABS = [
  { key: 'playlists', label: 'Playlists' },
  { key: 'songs', label: 'Saved Songs' },
  { key: 'artists', label: 'Artists' },
];

// Group songs by a field. Keeps the order the songs came in (newest like first).
function groupBy(songs, field, fallback) {
  const map = new Map();
  for (const song of songs) {
    const key = song[field] || fallback;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(song);
  }
  return [...map.entries()].map(([name, list]) => ({ name, songs: list }));
}

export default function LibraryScreen({ active, onOpenPlayer, onTabChange }) {
  const { likedSongs, likedIds, toggleLike, playQueue, currentSong } = usePlayer();
  const [tab, setTab] = useState('playlists');
  const [sort, setSort] = useState('recent'); // 'recent' | 'az'
  const [open, setOpen] = useState(null); // { type: 'liked' | 'genre' | 'artist', name }

  // Playlists are made from liked songs, grouped by genre; Artists grouped by artist
  const genreLists = useMemo(() => groupBy(likedSongs, 'genre', 'Other'), [likedSongs]);
  const artistLists = useMemo(() => groupBy(likedSongs, 'artist', 'Unknown'), [likedSongs]);

  const sorted = (items, nameOf) =>
    sort === 'az' ? [...items].sort((a, b) => nameOf(a).localeCompare(nameOf(b))) : items;

  // what is inside the opened list (always taken from the live liked songs)
  let openSongs = [];
  let openTitle = '';
  if (open) {
    if (open.type === 'liked') {
      openSongs = likedSongs;
      openTitle = 'Liked Songs';
    } else {
      const source = open.type === 'genre' ? genreLists : artistLists;
      const found = source.find((g) => g.name === open.name);
      openSongs = found ? found.songs : [];
      openTitle = open.type === 'genre' ? open.name + ' Favourites' : open.name;
    }
  }
  const showingDetail = open !== null && openSongs.length > 0;

  // phone back button closes an opened list
  useEffect(() => {
    if (!active || !showingDetail) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setOpen(null);
      return true;
    });
    return () => sub.remove();
  }, [active, showingDetail]);

  const empty = (icon, title, text) => (
    <View style={styles.empty}>
      <Feather name={icon} size={30} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );

  const renderDetail = () => (
    <>
      <View style={styles.detailTop}>
        <IconButton name="chevron-left" onPress={() => setOpen(null)} />
        <Text style={styles.detailHeading}>Library</Text>
      </View>
      <CoverImage uri={openSongs[0].cover} style={styles.detailArt} iconSize={48} />
      <Text style={styles.detailTitle} numberOfLines={2}>{openTitle}</Text>
      <Text style={styles.detailCount}>
        {openSongs.length} {openSongs.length === 1 ? 'song' : 'songs'}
      </Text>
      <Pressable style={styles.playButton} onPress={() => playQueue(openSongs, 0)}>
        <Ionicons name="play" size={16} color="#0B0B0F" />
        <Text style={styles.playText}>Play</Text>
      </Pressable>
      {openSongs.map((song, i) => (
        <SongRow
          key={song.id}
          song={song}
          isCurrent={currentSong ? currentSong.id === song.id : false}
          liked={likedIds.includes(song.id)}
          onLike={() => toggleLike(song)}
          onPress={() => playQueue(openSongs, i)}
        />
      ))}
    </>
  );

  const renderPlaylists = () => {
    const lists = sorted(genreLists, (g) => g.name);
    return (
      <>
        <LibraryRow
          pinned
          title="Liked Songs"
          count={likedSongs.length}
          image={likedSongs.length > 0 ? likedSongs[0].cover : ''}
          onPress={() => likedSongs.length > 0 && setOpen({ type: 'liked' })}
        />
        {likedSongs.length === 0 &&
          empty('heart', 'Nothing here yet', 'Tap the heart on any song and it is saved to your library.')}
        <View style={styles.list}>
          {lists.map((g, i) => (
            <LibraryRow
              key={g.name}
              title={g.name + ' Favourites'}
              count={g.songs.length}
              image={g.songs[0].cover}
              last={i === lists.length - 1}
              onPress={() => setOpen({ type: 'genre', name: g.name })}
            />
          ))}
        </View>
      </>
    );
  };

  const renderSongs = () => {
    if (likedSongs.length === 0) {
      return empty('heart', 'No saved songs', 'Songs you like on Home, Search or Now Playing show up here.');
    }
    const list = sorted(likedSongs, (s) => s.title);
    return (
      <View style={styles.section}>
        {list.map((song) => (
          <SongRow
            key={song.id}
            song={song}
            isCurrent={currentSong ? currentSong.id === song.id : false}
            liked
            onLike={() => toggleLike(song)}
            onPress={() => playQueue(list, list.indexOf(song))}
          />
        ))}
      </View>
    );
  };

  const renderArtists = () => {
    if (artistLists.length === 0) {
      return empty('user', 'No artists yet', 'Like a song and its artist will appear here.');
    }
    const lists = sorted(artistLists, (a) => a.name);
    return lists.map((a, i) => (
      <LibraryRow
        key={a.name}
        round
        title={a.name}
        count={a.songs.length}
        image={a.songs[0].cover}
        last={i === lists.length - 1}
        onPress={() => setOpen({ type: 'artist', name: a.name })}
      />
    ));
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {showingDetail ? (
          renderDetail()
        ) : (
          <>
            <View style={styles.header}>
              <View>
                <Text style={styles.label}>COLLECTION</Text>
                <Text style={styles.title}>Your Library</Text>
              </View>
              {/* + takes you to Search to find more music to save */}
              <IconButton name="plus" onPress={() => onTabChange('search')} />
            </View>

            <View style={styles.tabs}>
              {TABS.map((t) => {
                const isActive = t.key === tab;
                return (
                  <Pressable
                    key={t.key}
                    onPress={() => setTab(t.key)}
                    style={[styles.chip, isActive && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{t.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={styles.sortRow}
              onPress={() => setSort((s) => (s === 'recent' ? 'az' : 'recent'))}
            >
              <Ionicons name="swap-vertical" size={14} color={colors.link} />
              <Text style={styles.sortText}>{sort === 'recent' ? 'Recently added' : 'A to Z'}</Text>
              <Feather name="chevron-down" size={14} color={colors.link} />
            </Pressable>

            {tab === 'playlists' && renderPlaylists()}
            {tab === 'songs' && renderSongs()}
            {tab === 'artists' && renderArtists()}
          </>
        )}
      </ScrollView>

      <BottomDock active="library" onTabChange={onTabChange} onOpenPlayer={onOpenPlayer} />
    </SafeAreaView>
  );
}
