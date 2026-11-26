// All data fetching lives in this one file.
// iTunes Search API: free, no key, gives song info, cover art and a 30 second preview.
import { coverAt } from './cover';

// Same search is only sent once. Home, Search and Library share the results.
const cache = new Map();

async function request(query, limit) {
  const url =
    'https://itunes.apple.com/search?term=' +
    encodeURIComponent(query) +
    '&media=music&entity=song&limit=' +
    limit;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Could not load songs');
  }
  const json = await response.json();

  const seen = new Set();
  const songs = [];

  for (const item of json.results || []) {
    // skip items without audio or artwork, and repeated songs
    if (!item.previewUrl || !item.artworkUrl100 || !item.trackName) continue;
    const key = (item.trackName + '|' + item.artistName).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    songs.push({
      id: String(item.trackId),
      title: item.trackName,
      artist: item.artistName,
      genre: item.primaryGenreName || '',
      duration: Math.round((item.trackTimeMillis || 0) / 1000),
      // swap the small thumbnail for a sharp 600px image
      cover: coverAt(item.artworkUrl100, 600),
      url: item.previewUrl,
    });
  }

  return songs;
}

export function searchSongs(query, limit = 20) {
  const key = query.trim().toLowerCase() + '|' + limit;
  if (cache.has(key)) return cache.get(key);

  const promise = request(query, limit).catch((err) => {
    cache.delete(key); // do not remember failures, so "Try again" works
    throw err;
  });
  cache.set(key, promise);
  return promise;
}

// Search several terms and mix the results one by one, so a section has variety.
export async function searchMix(terms, total = 12) {
  const results = await Promise.allSettled(terms.map((t) => searchSongs(t, 8)));
  const lists = results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
  if (lists.length === 0) throw new Error('Could not load songs');

  const mixed = [];
  const seen = new Set();
  for (let i = 0; mixed.length < total; i++) {
    let added = false;
    for (const list of lists) {
      const song = list[i];
      if (song && !seen.has(song.id)) {
        seen.add(song.id);
        mixed.push(song);
        added = true;
      }
    }
    if (!added && lists.every((l) => i >= l.length)) break;
  }
  return mixed.slice(0, total);
}
