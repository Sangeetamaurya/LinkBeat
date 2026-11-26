// Talks to the iTunes Search API for the app (the app no longer calls iTunes itself).
// - LRU cache (hash map + doubly linked list) so the same search is only sent once
// - in-flight requests are shared, failures are not remembered
// - every title / artist that comes back is added to a Trie for suggestions
const { LinkedHashMap } = require('../dsa/LinkedHashMap');
const { Trie } = require('../dsa/Trie');
const { roundRobinMerge } = require('../dsa/algorithms');
const { coverAt } = require('../utils/cover');
const { HttpError } = require('../utils/errors');

function createSongService({ fetchImpl = fetch, baseUrl, cacheSize, cacheTtlMs, now = Date.now }) {
  const cache = new LinkedHashMap({ capacity: cacheSize });
  const trie = new Trie();

  async function request(query, limit) {
    const url =
      baseUrl +
      '?term=' +
      encodeURIComponent(query) +
      '&media=music&entity=song&limit=' +
      limit;

    let response;
    try {
      response = await fetchImpl(url);
    } catch (err) {
      throw new HttpError(502, 'Could not reach the music service');
    }
    if (!response.ok) throw new HttpError(502, 'Could not load songs');
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
        cover: coverAt(item.artworkUrl100, 600),
        url: item.previewUrl,
      });
    }

    for (const s of songs) {
      trie.insert(s.title);
      trie.insert(s.artist);
    }
    return songs;
  }

  function search(query, limit = 20) {
    const q = String(query || '').trim();
    if (!q) return Promise.resolve([]);
    const key = q.toLowerCase() + '|' + limit;

    const hit = cache.get(key); // get() also marks it as recently used
    if (hit && hit.expires > now()) return hit.promise;

    const promise = request(q, limit).catch((err) => {
      cache.delete(key);
      throw err;
    });
    cache.set(key, { promise, expires: now() + cacheTtlMs });
    return promise;
  }

  // search several terms and mix the results one by one, so a section has variety
  async function mix(terms, total = 12) {
    const results = await Promise.allSettled(terms.map((t) => search(t, 8)));
    const lists = results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
    if (lists.length === 0) throw new HttpError(502, 'Could not load songs');
    return roundRobinMerge(lists, total);
  }

  function suggest(prefix, limit = 8) {
    return trie.suggest(prefix, limit);
  }

  return { search, mix, suggest, cache, trie };
}

module.exports = { createSongService };
