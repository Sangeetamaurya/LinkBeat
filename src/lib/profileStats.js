// Small helpers that turn the player's data into numbers for the Profile screen.

// seconds -> "2.4" hours, or "35" minutes when it is less than an hour
export function listenedValue(seconds) {
  if (seconds >= 3600) return { value: (seconds / 3600).toFixed(1), unit: 'Hours Listened' };
  return { value: String(Math.floor(seconds / 60)), unit: 'Min Listened' };
}

// seconds -> "16.4 hours" / "35 min" / "0 min"
export function listenedText(seconds) {
  if (seconds >= 3600) return (seconds / 3600).toFixed(1) + ' hours';
  return Math.floor(seconds / 60) + ' min';
}

// Most played artists. Uses play counts; if nothing was played yet, uses the liked songs.
// Returns [{ name, cover }] (cover = a picture of one of their songs).
export function topArtists(playCounts, likedSongs, limit = 4) {
  const map = new Map();
  const add = (song, weight) => {
    const entry = map.get(song.artist) || { name: song.artist, cover: song.cover, score: 0 };
    entry.score += weight;
    map.set(song.artist, entry);
  };
  Object.values(playCounts).forEach((p) => add(p.song, p.count * 2));
  likedSongs.forEach((song) => add(song, 1));
  return [...map.values()].sort((a, b) => b.score - a.score).slice(0, limit);
}
