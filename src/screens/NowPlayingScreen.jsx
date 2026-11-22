import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CoverImage from '../components/CoverImage';
import IconButton from '../components/IconButton';
import LikeButton from '../components/LikeButton';
import ProgressBar from '../components/ProgressBar';
import PrevNextStrip from '../components/PrevNextStrip';
import ControlBar from '../components/ControlBar';
import { usePlayer } from '../context/PlayerContext';
import { formatTime } from '../lib/format';
import { styles } from './NowPlayingScreen.styles';

export default function NowPlayingScreen({ onBack }) {
  const {
    songs,
    currentIndex,
    currentSong,
    isPlaying,
    position,
    duration,
    repeat,
    shuffle,
    likedIds,
    togglePlay,
    seekTo,
    next,
    prev,
    toggleRepeat,
    toggleShuffle,
    toggleLike,
  } = usePlayer();

  const { width: screenWidth } = useWindowDimensions();
  const artSize = Math.round((screenWidth - 40) * 0.92); // exact size, see CoverImage

  if (!currentSong) return null;

  const prevSong = songs[(currentIndex - 1 + songs.length) % songs.length];
  const nextSong = songs[(currentIndex + 1) % songs.length];
  const trackNo = String(currentIndex + 1).padStart(3, '0');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <IconButton name="chevron-left" onPress={onBack} />
          <Text style={styles.heading}>Now Playing</Text>
          <LikeButton
            liked={likedIds.includes(currentSong.id)}
            onPress={() => toggleLike(currentSong)}
          />
        </View>

        <View style={[styles.art, { width: artSize, height: artSize }]}>
          <CoverImage uri={currentSong.cover} style={{ width: artSize, height: artSize }} iconSize={64} />
          <View style={styles.frame} />
          <Text style={styles.tag}>LB · {trackNo}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.rowTop}>
            <Text style={styles.title} numberOfLines={1}>
              {currentSong.title}
            </Text>
            <Text style={styles.status}>{isPlaying ? 'PLAYING' : 'PAUSED'}</Text>
          </View>
          <Text style={styles.artist} numberOfLines={1}>
            {currentSong.artist}
          </Text>

          <View style={styles.progress}>
            <ProgressBar
              progress={position / duration}
              onSeek={(ratio) => seekTo(ratio * duration)}
            />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.time}>{formatTime(position)}</Text>
            <Text style={styles.time}>{formatTime(duration)}</Text>
          </View>
        </View>

        <View style={styles.block}>
          <PrevNextStrip
            prevSong={prevSong}
            nextSong={nextSong}
            onPrev={prev}
            onNext={next}
          />
        </View>

        <View style={styles.block}>
          <ControlBar
            isPlaying={isPlaying}
            repeat={repeat}
            shuffle={shuffle}
            onToggle={togglePlay}
            onPrev={prev}
            onNext={next}
            onRepeat={toggleRepeat}
            onShuffle={toggleShuffle}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
