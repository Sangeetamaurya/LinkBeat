import { useState } from 'react';
import { addRecent } from '../lib/recent';

export function useRecentSearches() {
  const [recent, setRecent] = useState([]);

  return {
    recent,
    add: (term) => setRecent((prev) => addRecent(prev, term)),
    remove: (term) => setRecent((prev) => prev.filter((x) => x !== term)),
    clear: () => setRecent([]),
  };
}
