// Small algorithms used by the services.

// ---- Merge sort (stable, O(n log n)) ----
// Stable matters: songs with the same title keep the order they were liked in.
function mergeSort(list, compare) {
  if (list.length <= 1) return list.slice();
  const mid = list.length >> 1;
  const left = mergeSort(list.slice(0, mid), compare);
  const right = mergeSort(list.slice(mid), compare);
  const out = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    // <= keeps equal items in their old order
    if (compare(left[i], right[j]) <= 0) out.push(left[i++]);
    else out.push(right[j++]);
  }
  while (i < left.length) out.push(left[i++]);
  while (j < right.length) out.push(right[j++]);
  return out;
}

// ---- Group by with a hash map: O(n), keeps first-seen order ----
function groupBy(items, field, fallback) {
  const map = new Map();
  for (const item of items) {
    const key = item[field] || fallback;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return [...map.entries()].map(([name, songs]) => ({ name, songs }));
}

// ---- Round-robin merge of k lists (k-way merge) with a Set for de-duplication ----
// Takes 1st of every list, then 2nd of every list ... so the result has variety.
function roundRobinMerge(lists, total) {
  const mixed = [];
  const seen = new Set();
  const longest = lists.reduce((m, l) => Math.max(m, l.length), 0);
  for (let i = 0; i < longest && mixed.length < total; i++) {
    for (const list of lists) {
      const song = list[i];
      if (song && !seen.has(song.id)) {
        seen.add(song.id);
        mixed.push(song);
        if (mixed.length >= total) break;
      }
    }
  }
  return mixed;
}

// ---- Binary search on a sorted array: O(log n) ----
// Returns the first index whose key is >= target (a "lower bound").
function lowerBound(sorted, target, keyOf = (x) => x) {
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (keyOf(sorted[mid]) < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

module.exports = { mergeSort, groupBy, roundRobinMerge, lowerBound };
