// Which song comes next / before in the queue.
// The queue is circular: after the last song it goes back to the first.
export function pickNextIndex(length, current, shuffle, rand = Math.random) {
  if (length === 0) return -1;
  if (shuffle && length > 1) {
    if (current < 0) return Math.floor(rand() * length);
    const i = Math.floor(rand() * (length - 1)); // pick from every song except the current one
    return i >= current ? i + 1 : i;
  }
  return (current + 1) % length;
}

export function pickPrevIndex(length, current) {
  if (length === 0) return -1;
  return (current - 1 + length) % length;
}
