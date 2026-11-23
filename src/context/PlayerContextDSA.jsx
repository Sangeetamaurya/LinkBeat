import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { DoublyLinkedList, CircularLinkedList, Stack, Queue, Shuffle, Sorting, Searching } from '../dsa';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  const playlistDLL = useRef(new DoublyLinkedList());
  const repeatCLL = useRef(new CircularLinkedList());
  const historyStack = useRef(new Stack());
  const upNextQueue = useRef(new Queue());

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);
  const [playCounts, setPlayCounts] = useState({});

  const [listenByDay, setListenByDay] = useState([0, 0, 0, 0, 0, 0, 0]);

  const likedIds = useMemo(() => likedSongs.map((s) => s.id), [likedSongs]);

  const queueArray = useMemo(() => playlistDLL.current.toArray(), [currentIndex, shuffle]);
  const currentSong = currentIndex >= 0 ? queueArray[currentIndex] : null;
  const isPlaying = status.playing;
  const position = status.currentTime || 0;
  const duration = status.duration > 0 ? status.duration : 30;

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!status.playing) return;
    const timer = setInterval(() => {
      const day = (new Date().getDay() + 6) % 7;
      setListenByDay((days) => days.map((sec, i) => (i === day ? sec + 1 : sec)));
    }, 1000);
    return () => clearInterval(timer);
  }, [status.playing]);

  useEffect(() => {
    player.loop = repeat;
  }, [repeat]);

  useEffect(() => {
    if (status.didJustFinish) next();
  }, [status.didJustFinish]);

  const syncDLLFromArray = (arr) => {
    playlistDLL.current.clear();
    arr.forEach(song => playlistDLL.current.insertAtEnd(song));
    if (arr.length > 0) {
      repeatCLL.current.clear();
      arr.forEach(song => repeatCLL.current.insertAtEnd(song));
      repeatCLL.current.setCurrentByIndex(0);
    }
  };

  const startSong = (song, index) => {
    setPlayCounts((counts) => ({
      ...counts,
      [song.id]: { song, count: (counts[song.id] ? counts[song.id].count : 0) + 1 },
    }));

    historyStack.current.push(song);
    if (historyStack.current.getSize() > 100) {
      const temp = [];
      while (!historyStack.current.isEmpty() && temp.length < 50) {
        temp.unshift(historyStack.current.pop());
      }
      temp.forEach(s => historyStack.current.push(s));
    }

    setCurrentIndex(index);
    player.replace(song.url);
    player.play();
  };

  const playQueue = (list, index) => {
    if (!list[index]) return;
    syncDLLFromArray(list);
    setShuffle(false);
    startSong(list[index], index);
  };

  const playIndex = (index) => {
    if (!queueArray[index]) return;
    startSong(queueArray[index], index);
  };

  const next = () => {
    if (queueArray.length === 0) return;
    
    if (repeat) {
      playIndex(currentIndex);
      return;
    }

    if (shuffle) {
      const nextIdx = (currentIndex + 1) % queueArray.length;
      playIndex(nextIdx);
    } else {
      const nextSong = repeatCLL.current.next();
      if (nextSong) {
        const idx = queueArray.findIndex(s => s.id === nextSong.id);
        if (idx >= 0) playIndex(idx);
      }
    }
  };

  const prev = () => {
    if (queueArray.length === 0) return;
    
    if (shuffle) {
      const prevIdx = (currentIndex - 1 + queueArray.length) % queueArray.length;
      playIndex(prevIdx);
    } else {
      const prevSong = repeatCLL.current.prev();
      if (prevSong) {
        const idx = queueArray.findIndex(s => s.id === prevSong.id);
        if (idx >= 0) playIndex(idx);
      }
    }
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

  const toggleShuffle = () => {
    if (!currentSong) return;
    if (!shuffle) {
      const shuffled = Shuffle.shuffleWithFirst(queueArray, currentIndex);
      syncDLLFromArray(shuffled);
      setCurrentIndex(0);
      setShuffle(true);
    } else {
      const original = playlistDLL.current.toArray();
      syncDLLFromArray(original);
      setCurrentIndex(original.findIndex((s) => s.id === currentSong.id));
      setShuffle(false);
    }
  };

  const toggleLike = (song) => {
    setLikedSongs((list) =>
      list.some((s) => s.id === song.id)
        ? list.filter((s) => s.id !== song.id)
        : [song, ...list]
    );
  };

  const addToUpNext = (song) => {
    upNextQueue.current.enqueue(song);
  };

  const getUpNext = () => {
    return upNextQueue.current.toArray();
  };

  const clearUpNext = () => {
    upNextQueue.current.clear();
  };

  const getHistory = () => {
    return historyStack.current.toArray();
  };

  const searchSongs = (query, by = 'title') => {
    const arr = queueArray;
    if (by === 'title') return Searching.linearSearchByTitle(arr, query);
    if (by === 'artist') return Searching.linearSearchByArtist(arr, query);
    return Searching.linearSearchById(arr, query);
  };

  const sortQueue = (by = 'title') => {
    let sorted;
    if (by === 'title') sorted = Sorting.mergeSortByTitle(queueArray);
    else if (by === 'artist') sorted = Sorting.mergeSortByArtist(queueArray);
    else sorted = Sorting.mergeSortByDuration(queueArray);
    
    syncDLLFromArray(sorted);
    const newIndex = sorted.findIndex(s => s.id === currentSong?.id);
    setCurrentIndex(newIndex >= 0 ? newIndex : 0);
  };

  const mostPlayed = Object.values(playCounts)
    .sort((a, b) => b.count - a.count)
    .map((entry) => entry.song);

  return (
    <PlayerContext.Provider
      value={{
        songs: queueArray,
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
        playQueue,
        playIndex,
        togglePlay,
        seekTo,
        next,
        prev,
        toggleRepeat,
        toggleShuffle,
        toggleLike,
        addToUpNext,
        getUpNext,
        clearUpNext,
        getHistory,
        searchSongs,
        sortQueue,
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