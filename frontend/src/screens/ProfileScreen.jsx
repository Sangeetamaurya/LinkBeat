import { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconButton from '../components/IconButton';
import CoverImage from '../components/CoverImage';
import BottomDock from '../components/BottomDock';
import { usePlayer } from '../context/PlayerContext';
import { listenedText, listenedValue, topArtists } from '../lib/profileStats';
import { AVATAR_PICKER_OPTIONS, avatarFromAsset } from '../lib/avatar';
import { meApi } from '../lib/backend';
import { idle as idleSync } from '../lib/sync';
import { colors } from '../theme/colors';
import { styles } from './ProfileScreen.styles';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const BAR_AREA = 90; // tallest bar in pixels

const SETTINGS = [
  { key: 'account', label: 'Account', icon: 'user' },
  { key: 'history', label: 'Listening History', icon: 'clock' },
  { key: 'help', label: 'Help & Support', icon: 'help-circle' },
];

// onOpenSub('edit' | 'account' | 'settings' | 'history' | 'help') opens the screens of Profile.
// A guest has no account, so those buttons send them to Log in / Sign up (onSetupProfile).
export default function ProfileScreen({
  user,
  onSetupProfile,
  onOpenSub,
  onOpenArtist,
  onChangeAvatar,
  onLogout,
  onOpenPlayer,
  onTabChange,
}) {
  const { likedSongs, playCounts, listenByDay } = usePlayer();

  const savedCount = likedSongs.length;
  // playlists = one for each genre among the liked songs (+ the "Liked Songs" list itself)
  const playlistCount = useMemo(() => {
    if (likedSongs.length === 0) return 0;
    return new Set(likedSongs.map((s) => s.genre || 'Other')).size + 1;
  }, [likedSongs]);

  const totalSeconds = listenByDay.reduce((a, b) => a + b, 0);
  const listened = listenedValue(totalSeconds);
  const localArtists = useMemo(() => topArtists(playCounts, likedSongs), [playCounts, likedSongs]);

  // logged in: the backend works out the top artists (heap) from what it has saved
  const [serverStats, setServerStats] = useState(null);
  useEffect(() => {
    if (!user) {
      setServerStats(null);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      idleSync()
        .then(() => meApi.stats())
        .then((s) => {
          if (!cancelled) setServerStats(s);
        })
        .catch(() => {});
    }, 600);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [user && user.username, likedSongs, playCounts]);
  const artists = serverStats ? serverStats.topArtists : localArtists;

  const today = (new Date().getDay() + 6) % 7; // Monday = 0
  const maxDay = Math.max(...listenByDay, 1);

  const pickAvatar = async () => {
    if (!user) {
      onSetupProfile();
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync(AVATAR_PICKER_OPTIONS);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        onChangeAvatar(avatarFromAsset(result.assets[0]));
      }
    } catch (e) {
      Alert.alert('Could not open your photos', 'Please try again.');
    }
  };

  const name = user ? user.name || 'Music Lover' : 'Guest';
  const handle = user
    ? user.username
      ? '@' + user.username.replace(/^@/, '')
      : ''
    : 'Set up a profile to save your picks';

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.label}>YOUR SPACE</Text>
            <Text style={styles.title}>Profile</Text>
          </View>
          <IconButton name="settings" label="Settings" onPress={() => onOpenSub('settings')} />
        </View>

        <View style={styles.hero}>
          <Pressable onPress={pickAvatar} style={styles.avatarRing}>
            {user && user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarEmpty]}>
                <Feather name="user" size={44} color={colors.textSecondary} />
              </View>
            )}
            <View style={styles.camera}>
              <Feather name="camera" size={13} color="#0B0B0F" />
            </View>
          </Pressable>

          <Text style={styles.name}>{name}</Text>
          {handle !== '' && <Text style={styles.handle}>{handle}</Text>}

          <Pressable
            onPress={() => (user ? onOpenSub('edit') : onSetupProfile())}
            style={styles.editButton}
          >
            <Text style={styles.editText}>{user ? 'Edit Profile' : 'Log in / Sign up'}</Text>
          </Pressable>
        </View>

        {/* three numbers */}
        <View style={styles.stats}>
          <Pressable style={styles.stat} onPress={() => onTabChange('library')}>
            <Text style={styles.statValue}>{playlistCount}</Text>
            <Text style={styles.statLabel}>Playlists</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.stat} onPress={() => onTabChange('library')}>
            <Text style={styles.statValue}>{savedCount}</Text>
            <Text style={styles.statLabel}>Saved Songs</Text>
          </Pressable>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{listened.value}</Text>
            <Text style={styles.statLabel}>{listened.unit}</Text>
          </View>
        </View>

        {/* top artists */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Top Artists</Text>
          <Text style={styles.sectionNote}>This month</Text>
        </View>
        {artists.length === 0 ? (
          <Text style={styles.emptyText}>Play or like some songs and your top artists show up here.</Text>
        ) : (
          <View style={styles.artistRow}>
            {artists.map((artist) => (
              <Pressable key={artist.name} style={styles.artist} onPress={() => onOpenArtist(artist.name)}>
                <CoverImage uri={artist.cover} style={styles.artistPic} iconSize={20} />
                <Text style={styles.artistName} numberOfLines={1}>
                  {artist.name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* listening activity */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Listening Activity</Text>
          <Text style={styles.sectionNote}>{listenedText(totalSeconds)}</Text>
        </View>
        <View style={styles.activity}>
          <View style={styles.activityTop}>
            <View>
              <Text style={styles.weekLabel}>THIS WEEK</Text>
              <Text style={styles.weekValue}>{listenedText(totalSeconds)}</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Today {listenedText(listenByDay[today])}</Text>
            </View>
          </View>
          <View style={styles.bars}>
            {listenByDay.map((sec, i) => (
              <View key={i} style={styles.barCol}>
                <View
                  style={[
                    styles.bar,
                    i === today && styles.barToday,
                    { height: Math.max(6, Math.round((sec / maxDay) * BAR_AREA)) },
                  ]}
                />
                <Text style={[styles.barDay, i === today && styles.barDayToday]}>{DAYS[i]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* settings */}
        <View style={styles.settings}>
          {SETTINGS.map((item) => (
            <Pressable
              key={item.key}
              onPress={() =>
                item.key === 'account' && !user ? onSetupProfile() : onOpenSub(item.key)
              }
              style={styles.settingRow}
            >
              <Feather name={item.icon} size={18} color={colors.textPrimary} />
              <Text style={styles.settingText}>{item.label}</Text>
              <Feather name="chevron-right" size={18} color={colors.textSecondary} />
            </Pressable>
          ))}
          {user && (
            <Pressable onPress={onLogout} style={styles.settingRow}>
              <Feather name="log-out" size={18} color="#FF5A5F" />
              <Text style={[styles.settingText, styles.logout]}>Log out</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      <BottomDock active="profile" onTabChange={onTabChange} onOpenPlayer={onOpenPlayer} />
    </SafeAreaView>
  );
}
