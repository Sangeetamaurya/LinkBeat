import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { shuffleWithFirst } from '../lib/shuffle';
import { enqueue } from '../lib/sync';
import { addListening, dropListening, flushListening } from '../lib/listenBuffer';

const PlayerContext = createContext(null);

const NO_DAYS = [0, 0, 0, 0, 0, 0, 0];

// hydration = what the backend saved for the logged in user (null for a guest).
// When it changes, the player takes over that data; when it becomes null everything is emptied.
export function PlayerProvider({ children, hydration = null }) {
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

  const loadedUrl = useRef(null); // the song file that is loaded in the audio player right now
  const queueSyncTimer = useRef(null);

  const likedIds = useMemo(() => likedSongs.map((s) => s.id), [likedSongs]);

  const currentSong = currentIndex >= 0 ? queue[currentIndex] : null;
  const isPlaying = status.playing;
  const position = status.currentTime || 0;
  const duration = status.duration > 0 ? status.duration : 30; // previews are 30 seconds

  // take over the saved data of the user (login) or forget it all (logout)
  useEffect(() => {
    try {
      player.pause();
    } catch (e) {
      // nothing was loaded yet
    }
    loadedUrl.current = null;
    dropListening();
    if (!hydration) {
      setLikedSongs([]);
      setPlayCounts({});
      setHistory([]);
      setListenByDay(NO_DAYS);
      setQueue([]);
      originalQueue.current = [];
      setCurrentIndex(-1);
      setShuffle(false);
      setRepeat(false);
      return;
    }
    setLikedSongs(hydration.liked || []);
    setPlayCounts(hydration.playCounts || {});
    setHistory(hydration.history || []);
    setListenByDay(hydration.listenByDay || NO_DAYS);
    const saved = hydration.queue;
    if (saved && saved.songs && saved.songs.length > 0) {
      // the queue comes back where the user left it (not playing; press play to continue)
      originalQueue.current = saved.shuffle && saved.original.length > 0 ? saved.original : saved.songs;
      setQueue(saved.songs);
      setCurrentIndex(saved.currentIndex);
      setShuffle(saved.shuffle);
      setRepeat(saved.repeat);
    } else {
      setQueue([]);
      originalQueue.current = [];
      setCurrentIndex(-1);
      setShuffle(false);
      setRepeat(false);
    }
  }, [hydration]);

  // keep the backend copy of the queue up to date (after the user stops changing it for a moment)
  useEffect(() => {
    if (queue.length === 0 || queue.length > 200 || currentIndex < 0) return;
    clearTimeout(queueSyncTimer.current);
    queueSyncTimer.current = setTimeout(() => {
      enqueue('PUT', '/queue', {
        songs: queue,
        currentIndex,
        shuffle,
        repeat,
        original: shuffle ? originalQueue.current : [],
      });
    }, 1000);
    return () => clearTimeout(queueSyncTimer.current);
  }, [queue, currentIndex, shuffle, repeat]);

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
      addListening(1); // sent to the backend in batches
    }, 1000);
    return () => {
      clearInterval(timer);
      flushListening(); // paused or stopped: send what is left
    };
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
    enqueue('POST', '/history/play', { song });
    setCurrentIndex(index);
    loadedUrl.current = song.url;
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
      // a queue restored from the backend has no song loaded yet
      if (loadedUrl.current !== currentSong.url) {
        loadedUrl.current = currentSong.url;
        player.replace(currentSong.url);
      }
      player.play();
    }
  };

  const seekTo = (seconds) => {
    if (!currentSong || loadedUrl.current !== currentSong.url) return;
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
    if (likedSongs.some((s) => s.id === song.id)) {
      enqueue('DELETE', '/library/liked/' + encodeURIComponent(song.id));
    } else {
      enqueue('POST', '/library/liked', { song });
    }
    setLikedSongs((list) =>
      list.some((s) => s.id === song.id) ? list.filter((s) => s.id !== song.id) : [song, ...list]
    );
  };

  // Settings actions
  const clearListening = () => {
    dropListening();
    enqueue('DELETE', '/history');
    setHistory([]);
    setPlayCounts({});
    setListenByDay([0, 0, 0, 0, 0, 0, 0]);
  };
  const clearLiked = () => {
    enqueue('DELETE', '/library/liked');
    setLikedSongs([]);
  };

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
