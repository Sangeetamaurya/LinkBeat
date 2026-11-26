// Numbers for the Profile screen. Top-k lists use a heap (O(n log k)).
const { topK } = require('../dsa/MinHeap');
const { weekKeys } = require('../utils/dates');

// Most played artists. Play counts count double; likes count once.
// Returns [{ name, cover }] where cover is a picture of one of their songs.
function topArtists(user, limit = 4) {
  const map = new Map(); // artist -> { name, cover, score }
  const add = (song, weight) => {
    const entry = map.get(song.artist) || { name: song.artist, cover: song.cover, score: 0 };
    entry.score += weight;
    map.set(song.artist, entry);
  };
  for (const p of user.playCounts.values()) add(p.song, p.count * 2);
  for (const song of user.liked.values()) add(song, 1);
  return topK([...map.values()], limit, (a) => a.score).map(({ name, cover }) => ({ name, cover }));
}

function mostPlayed(user, limit = 20) {
  return topK([...user.playCounts.values()], limit, (p) => p.count).map((p) => p.song);
}

// seconds listened on each day of this week, Monday..Sunday
function listenByDay(user, today) {
  return weekKeys(today).map((key) => user.listenByDate.get(key) || 0);
}

function playlistCount(user) {
  if (user.liked.size === 0) return 0;
  const genres = new Set(user.liked.values().map((s) => s.genre || 'Other'));
  return genres.size + 1; // +1 for the "Liked Songs" list itself
}

function profileStats(user, today) {
  const byDay = listenByDay(user, today);
  const todayIndex = weekKeys(today).indexOf(today);
  return {
    savedCount: user.liked.size,
    playlistCount: playlistCount(user),
    totalSeconds: byDay.reduce((a, b) => a + b, 0),
    listenByDay: byDay,
    todayIndex,
    topArtists: topArtists(user),
    mostPlayed: mostPlayed(user, 12),
  };
}

function playCountsObject(user) {
  const out = {};
  for (const [id, p] of user.playCounts) out[id] = p;
  return out;
}

module.exports = { topArtists, mostPlayed, listenByDay, playlistCount, profileStats, playCountsObject };
