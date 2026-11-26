// Binary Min-Heap (priority queue) stored in an array.
//   push / pop : O(log k)      peek : O(1)
//
// topK() uses a heap of size k, so finding the best k of n items costs O(n log k)
// instead of sorting everything in O(n log n).
class MinHeap {
  constructor(compare = (a, b) => a - b) {
    this.compare = compare;
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  peek() {
    return this.items[0];
  }

  push(value) {
    this.items.push(value);
    this._up(this.items.length - 1);
  }

  pop() {
    const items = this.items;
    if (items.length === 0) return undefined;
    const top = items[0];
    const last = items.pop();
    if (items.length > 0) {
      items[0] = last;
      this._down(0);
    }
    return top;
  }

  _up(i) {
    const items = this.items;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.compare(items[i], items[parent]) >= 0) break;
      [items[i], items[parent]] = [items[parent], items[i]];
      i = parent;
    }
  }

  _down(i) {
    const items = this.items;
    const n = items.length;
    for (;;) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.compare(items[l], items[smallest]) < 0) smallest = l;
      if (r < n && this.compare(items[r], items[smallest]) < 0) smallest = r;
      if (smallest === i) break;
      [items[i], items[smallest]] = [items[smallest], items[i]];
      i = smallest;
    }
  }
}

// Best k items by score (highest first). Ties keep the earlier item first.
function topK(items, k, scoreOf) {
  if (k <= 0) return [];
  // heap entry = [score, order, item]; the weakest of the kept items sits on top
  const heap = new MinHeap((a, b) => a[0] - b[0] || b[1] - a[1]);
  let order = 0;
  for (const item of items) {
    const entry = [scoreOf(item), order++, item];
    if (heap.size < k) {
      heap.push(entry);
    } else if (heap.compare(entry, heap.peek()) > 0) {
      heap.pop();
      heap.push(entry);
    }
  }
  const out = [];
  while (heap.size > 0) out.push(heap.pop()[2]);
  return out.reverse();
}

module.exports = { MinHeap, topK };
