// Same rules as frontend/src/lib/auth.js, so both sides agree.
function usernameError(username) {
  const u = String(username || '').trim();
  if (u.length < 3) return 'Username needs at least 3 characters';
  if (u.length > 30) return 'Username can be 30 characters at most';
  if (!/^[a-zA-Z0-9_]+$/.test(u)) return 'Use only letters, numbers and underscores';
  return '';
}

function passwordError(password) {
  const p = String(password || '');
  if (p.length < 6) return 'Password needs at least 6 characters';
  if (p.length > 100) return 'Password can be 100 characters at most';
  return '';
}

function nameError(name) {
  const n = String(name || '').trim();
  if (n === '') return 'Please enter your name';
  if (n.length > 60) return 'Name can be 60 characters at most';
  return '';
}

const ALLOWED_GENRES = ['Pop', 'Hip-Hop', 'Lo-fi', 'Bollywood', 'Rock', 'Classical', 'Electronic', 'Indie'];

// keep only known genres, no repeats (Set), in the order given
function cleanGenres(genres) {
  if (!Array.isArray(genres)) return [];
  return [...new Set(genres.filter((g) => ALLOWED_GENRES.includes(g)))];
}

// avatar can be '' (none), an https url, or a small image sent as a data uri
const MAX_AVATAR_CHARS = 2_500_000;
function avatarError(avatar) {
  if (avatar === '' || avatar === undefined || avatar === null) return '';
  if (typeof avatar !== 'string') return 'Invalid photo';
  if (avatar.length > MAX_AVATAR_CHARS) return 'Photo is too large';
  if (!/^(data:image\/(png|jpe?g|webp|gif);base64,|https?:\/\/|file:\/\/|content:\/\/)/i.test(avatar)) {
    return 'Invalid photo';
  }
  return '';
}

// A song coming from the app. Keep only the fields we know, with safe types.
function cleanSong(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const id = raw.id === undefined || raw.id === null ? '' : String(raw.id);
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  const artist = typeof raw.artist === 'string' ? raw.artist.trim() : '';
  const url = typeof raw.url === 'string' ? raw.url : '';
  if (!id || id.length > 40 || !title || !artist || !/^https?:\/\//i.test(url)) return null;
  const duration = Number(raw.duration);
  return {
    id,
    title: title.slice(0, 200),
    artist: artist.slice(0, 200),
    genre: typeof raw.genre === 'string' ? raw.genre.slice(0, 60) : '',
    duration: Number.isFinite(duration) && duration >= 0 ? Math.round(duration) : 0,
    cover: typeof raw.cover === 'string' ? raw.cover.slice(0, 500) : '',
    url: url.slice(0, 500),
  };
}

function cleanSongs(list, max) {
  if (!Array.isArray(list)) return null;
  const out = [];
  for (const raw of list.slice(0, max)) {
    const song = cleanSong(raw);
    if (!song) return null;
    out.push(song);
  }
  return out;
}

module.exports = {
  usernameError,
  passwordError,
  nameError,
  cleanGenres,
  avatarError,
  cleanSong,
  cleanSongs,
  ALLOWED_GENRES,
};
