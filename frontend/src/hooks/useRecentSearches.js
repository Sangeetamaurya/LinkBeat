import { useState } from 'react';
import { addRecent } from '../lib/recent';
import { enqueue } from '../lib/sync';

// Recent searches. When logged in, every change is also saved on the backend.
export function useRecentSearches() {
  const [recent, setRecent] = useState([]);

  return {
    recent,
    add: (term) => {
      const t = term.trim();
      if (!t) return;
      setRecent((prev) => addRecent(prev, t));
      enqueue('POST', '/searches', { term: t });
    },
    remove: (term) => {
      setRecent((prev) => prev.filter((x) => x !== term));
      enqueue('DELETE', '/searches/' + encodeURIComponent(term));
    },
    clear: () => {
      setRecent([]);
      enqueue('DELETE', '/searches');
    },
    // replace the list with the one from the backend (after login) or empty it (after logout)
    reset: (list) => setRecent(list || []),
  };
}
