// Fisher-Yates shuffle: every order is equally likely, O(n).
// Keeps the item at firstIndex as the first one (the playing song).
function shuffleWithFirst(list, firstIndex, random = Math.random) {
  const rest = list.filter((_, i) => i !== firstIndex);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const tmp = rest[i];
    rest[i] = rest[j];
    rest[j] = tmp;
  }
  return firstIndex >= 0 && firstIndex < list.length ? [list[firstIndex], ...rest] : rest;
}

module.exports = { shuffleWithFirst };
