import { createContext, useContext, useState } from 'react';
import { addToRecents } from '../lib/recents';

const SearchContext = createContext(null);

// Keeps the recent searches so Search and Home can both use them.
export function SearchProvider({ children }) {
  const [recents, setRecents] = useState([]);

  const addRecent = (term) => setRecents((list) => addToRecents(list, term));
  const removeRecent = (term) => setRecents((list) => list.filter((x) => x !== term));
  const clearRecents = () => setRecents([]);

  return (
    <SearchContext.Provider value={{ recents, addRecent, removeRecent, clearRecents }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const value = useContext(SearchContext);
  if (!value) {
    throw new Error('useSearch must be used inside SearchProvider');
  }
  return value;
}
