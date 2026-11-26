// Song data comes from our own backend (which asks the iTunes Search API for us).
// The backend also caches and shares results; this small cache keeps the app from asking twice.
import { songsApi } from './backend';

// Same search is only sent once. Home, Search and Library share the results.
const cache = new Map();

function remember(key, make) {
  if (cache.has(key)) return cache.get(key);
  const promise = make().catch((err) => {
    cache.delete(key); // do not remember failures, so "Try again" works
    throw err;
  });
  cache.set(key, promise);
  return promise;
}

export function searchSongs(query, limit = 20) {
  const q = query.trim();
  return remember(q.toLowerCase() + '|' + limit, () => songsApi.search(q, limit));
}

// Search several terms and mix the results one by one, so a section has variety.
export function searchMix(terms, total = 12) {
  return remember('mix|' + terms.join('||').toLowerCase() + '|' + total, () =>
    songsApi.mix(terms, total)
  );
}
