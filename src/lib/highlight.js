// Split text into [before, match, after] so the typed letters can be highlighted.
export function splitMatch(text, query) {
  const q = query.trim();
  if (!q) return [text, '', ''];
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return [text, '', ''];
  return [text.slice(0, i), text.slice(i, i + q.length), text.slice(i + q.length)];
}
