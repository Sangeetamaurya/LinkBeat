// Adds a search to the recent list: newest first, no repeats, max 6.
export function addToRecents(list, term, max = 6) {
  const t = term.trim();
  if (!t) return list;
  const rest = list.filter((x) => x.toLowerCase() !== t.toLowerCase());
  return [t, ...rest].slice(0, max);
}
