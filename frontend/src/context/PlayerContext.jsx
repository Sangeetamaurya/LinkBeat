import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { shuffleWithFirst } from '../lib/shuffle';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  const [queue, setQueue] = useState([]); // the songs that are playing now, in order
  const originalQueue = useRef([]); // same songs before shuffle, to restore the order
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 means nothing selected yet
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]); // full song objects, newest like first
  const [playCounts, setPlayCounts] = useState({}); // id -> { song, count }

  const [history, setHistory] = useState([]); // songs played, newest first (max 50)
  const [listenByDay, setListenByDay] = useState([0, 0, 0, 0, 0, 0, 0]); // seconds, Mon..Sun

  const likedIds = useMemo(() => likedSongs.map((s) => s.id), [likedSongs]);

  const currentSong = currentIndex >= 0 ? queue[currentIndex] : null;
  const isPlaying = status.playing;
  const position = status.currentTime || 0;
  const duration = status.duration > 0 ? status.duration : 30; // previews are 30 seconds

  // let audio play even when the phone is on silent (iPhone)
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  // count the time the user really listens (every second while a song is playing) for Profile
  useEffect(() => {
    if (!status.playing) return;
    const timer = setInterval(() => {
      const day = (new Date().getDay() + 6) % 7; // Monday = 0 ... Sunday = 6
      setListenByDay((days) => days.map((sec, i) => (i === day ? sec + 1 : sec)));
    }, 1000);
    return () => clearInterval(timer);
  }, [status.playing]);

  // repeat = loop the current song
  useEffect(() => {
    player.loop = repeat;
  }, [repeat]);

  // when a song ends, go to the next one (wraps to the first, like a circular list)
  useEffect(() => {
    if (status.didJustFinish) next();
  }, [status.didJustFinish]);

  const startSong = (song, index) => {
    setPlayCounts((counts) => ({
      ...counts,
      [song.id]: { song, count: (counts[song.id] ? counts[song.id].count : 0) + 1 },
    }));
    setHistory((list) => [song, ...list.filter((s) => s.id !== song.id)].slice(0, 50));
    setCurrentIndex(index);
    player.replace(song.url);
    player.play();
  };

  // start playing a list of songs from the given position
  const playQueue = (list, index) => {
    if (!list[index]) return;
    originalQueue.current = list;
    setShuffle(false);
    setQueue(list);
    startSong(list[index], index);
  };

  const playIndex = (index) => {
    if (!queue[index]) return;
    startSong(queue[index], index);
  };

  const next = () => {
    if (queue.length === 0) return;
    playIndex((currentIndex + 1) % queue.length);
  };

  const prev = () => {
    if (queue.length === 0) return;
    playIndex((currentIndex - 1 + queue.length) % queue.length);
  };

  const togglePlay = () => {
    if (!currentSong) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const seekTo = (seconds) => {
    if (!currentSong) return;
    player.seekTo(seconds);
  };

  const toggleRepeat = () => setRepeat((r) => !r);

  // shuffle reorders the queue (playing song stays first); turning it off restores the order
  const toggleShuffle = () => {
    if (!currentSong) return;
    if (!shuffle) {
      setQueue(shuffleWithFirst(queue, currentIndex));
      setCurrentIndex(0);
      setShuffle(true);
    } else {
      const original = originalQueue.current;
      setQueue(original);
      setCurrentIndex(original.findIndex((s) => s.id === currentSong.id));
      setShuffle(false);
    }
  };

  // liking a song saves it to the Library (Liked Songs); liking again removes it
  const toggleLike = (song) => {
    setLikedSongs((list) =>
      list.some((s) => s.id === song.id) ? list.filter((s) => s.id !== song.id) : [song, ...list]
    );
  };

  // Settings actions
  const clearListening = () => {
    setHistory([]);
    setPlayCounts({});
    setListenByDay([0, 0, 0, 0, 0, 0, 0]);
  };
  const clearLiked = () => setLikedSongs([]);

  // the songs this user played the most (only counts what was played in this session)
  const mostPlayed = Object.values(playCounts)
    .sort((a, b) => b.count - a.count)
    .map((entry) => entry.song);

  return (
    <PlayerContext.Provider
      value={{
        songs: queue,
        currentIndex,
        currentSong,
        isPlaying,
        position,
        duration,
        repeat,
        shuffle,
        likedIds,
        likedSongs,
        mostPlayed,
        playCounts,
        listenByDay,
        history,
        clearListening,
        clearLiked,
        playQueue,
        playIndex,
        togglePlay,
        seekTo,
        next,
        prev,
        toggleRepeat,
        toggleShuffle,
        toggleLike,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const value = useContext(PlayerContext);
  if (!value) {
    throw new Error('usePlayer must be used inside PlayerProvider');
  }
  return value;
}
