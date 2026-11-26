// The strip shows 4 nodes of the playlist at a time.
// The playing song stays in the 2nd node whenever possible.
export function getQueueWindow(total, currentIndex, size = 4) {
  if (total <= size) return { start: 0, end: total };
  const start = Math.max(0, Math.min(currentIndex - 1, total - size));
  return { start, end: start + size };
}
