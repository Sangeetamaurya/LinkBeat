import { useCallback, useEffect, useState } from 'react';
import { searchMix, searchSongs } from '../lib/api';

// Loads songs for one search term (or a list of terms, mixed together).
// delay spaces out requests; enabled=false skips loading.
export function useSongs(terms, { limit = 10, delay = 0, enabled = true } = {}) {
  const key = Array.isArray(terms) ? terms.join('||') : terms || '';
  const active = enabled && key !== '';

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(active);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!active) {
      setSongs([]);
      setLoading(false);
      setError(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    const timer = setTimeout(() => {
      const list = key.split('||');
      const job = list.length > 1 ? searchMix(list, limit) : searchSongs(list[0], limit);
      job
        .then((result) => {
          if (!cancelled) setSongs(result);
        })
        .catch(() => {
          if (!cancelled) setError(true);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [key, limit, delay, active, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return { songs, loading, error, reload };
}
