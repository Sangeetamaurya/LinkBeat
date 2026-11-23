// Shuffle a list but keep the item at firstIndex as the first one (the playing song).
export function shuffleWithFirst(list, firstIndex, random = Math.random) {
  const rest = list.filter((_, i) => i !== firstIndex);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = rest[i];
    rest[i] = rest[j];
    rest[j] = temp;
  }
  return [list[firstIndex], ...rest];
}
