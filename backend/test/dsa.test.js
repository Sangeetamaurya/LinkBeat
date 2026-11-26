const test = require('node:test');
const assert = require('node:assert');
const { LinkedHashMap } = require('../src/dsa/LinkedHashMap');
const { PlayQueue } = require('../src/dsa/PlayQueue');
const { MinHeap, topK } = require('../src/dsa/MinHeap');
const { Trie } = require('../src/dsa/Trie');
const { SlidingWindowLimiter } = require('../src/dsa/SlidingWindowLimiter');
const { mergeSort, roundRobinMerge, lowerBound, groupBy } = require('../src/dsa/algorithms');
const { shuffleWithFirst } = require('../src/dsa/shuffle');

const song = (id) => ({ id: String(id), title: 'T' + id, artist: 'A' });

test('LinkedHashMap: newest first, capacity evicts the oldest, get refreshes', () => {
  const m = new LinkedHashMap({ capacity: 3 });
  m.set('a', 1); m.set('b', 2); m.set('c', 3);
  assert.deepStrictEqual(m.keys(), ['c', 'b', 'a']);
  m.get('a'); // a becomes newest
  assert.deepStrictEqual(m.keys(), ['a', 'c', 'b']);
  const evicted = m.set('d', 4);
  assert.strictEqual(evicted.key, 'b');
  assert.deepStrictEqual(m.keys(), ['d', 'a', 'c']);
  assert.ok(m.delete('a'));
  assert.deepStrictEqual(m.keys(), ['d', 'c']);
  m.clear();
  assert.strictEqual(m.size, 0);
  assert.deepStrictEqual(m.values(), []);
});

test('PlayQueue: circular next/prev, shuffle keeps playing song first, unshuffle restores', () => {
  const q = new PlayQueue().load([1, 2, 3, 4, 5].map(song), 4);
  assert.strictEqual(q.next().id, '1'); // wraps
  assert.strictEqual(q.prev().id, '5'); // wraps back
  q.jump(2);
  q.toggleShuffle();
  assert.strictEqual(q.currentIndex, 0);
  assert.strictEqual(q.currentSong.id, '3');
  assert.deepStrictEqual(q.toArray().map((s) => s.id).sort(), ['1', '2', '3', '4', '5']);
  q.toggleShuffle();
  assert.deepStrictEqual(q.toArray().map((s) => s.id), ['1', '2', '3', '4', '5']);
  assert.strictEqual(q.currentSong.id, '3');
  // survives save + load
  const copy = PlayQueue.fromJSON(JSON.parse(JSON.stringify(q.toJSON())));
  assert.strictEqual(copy.currentSong.id, '3');
  assert.strictEqual(copy.length, 5);
});

test('PlayQueue: window keeps playing song in 2nd place', () => {
  const q = new PlayQueue().load([1, 2, 3, 4, 5, 6, 7].map(song), 3);
  assert.deepStrictEqual(q.window(4).songs.map((s) => s.id), ['3', '4', '5', '6']);
  q.jump(0);
  assert.strictEqual(q.window(4).start, 0);
  q.jump(6);
  assert.strictEqual(q.window(4).start, 3);
  assert.strictEqual(new PlayQueue().load([1, 2].map(song), 0).window(4).end, 2);
});

test('MinHeap + topK', () => {
  const h = new MinHeap();
  [5, 1, 4, 2, 3].forEach((x) => h.push(x));
  assert.deepStrictEqual([h.pop(), h.pop(), h.pop()], [1, 2, 3]);
  const items = [{ n: 'a', s: 3 }, { n: 'b', s: 9 }, { n: 'c', s: 5 }, { n: 'd', s: 5 }, { n: 'e', s: 1 }];
  assert.deepStrictEqual(topK(items, 3, (x) => x.s).map((x) => x.n), ['b', 'c', 'd']);
  assert.deepStrictEqual(topK(items, 0, (x) => x.s), []);
  assert.strictEqual(topK(items, 10, (x) => x.s).length, 5);
});

test('Trie suggestions ordered by weight, case-insensitive', () => {
  const t = new Trie();
  t.insert('Ed Sheeran'); t.insert('Ed Sheeran'); t.insert('Eden'); t.insert('Dua Lipa');
  assert.deepStrictEqual(t.suggest('ed'), ['Ed Sheeran', 'Eden']);
  assert.deepStrictEqual(t.suggest('ED S'), ['Ed Sheeran']);
  assert.deepStrictEqual(t.suggest('zzz'), []);
  assert.deepStrictEqual(t.suggest(''), []);
});

test('SlidingWindowLimiter allows max per window then recovers', () => {
  let now = 0;
  const l = new SlidingWindowLimiter({ windowMs: 1000, max: 2, now: () => now });
  assert.ok(l.take('ip').allowed);
  now = 100; assert.ok(l.take('ip').allowed);
  now = 200; assert.strictEqual(l.take('ip').allowed, false);
  assert.ok(l.take('other').allowed);
  now = 1001; assert.ok(l.take('ip').allowed); // first hit left the window
});

test('algorithms: mergeSort is stable, roundRobinMerge dedupes, lowerBound, groupBy', () => {
  const list = [{ k: 2, n: 'a' }, { k: 1, n: 'b' }, { k: 2, n: 'c' }, { k: 1, n: 'd' }];
  assert.deepStrictEqual(mergeSort(list, (x, y) => x.k - y.k).map((x) => x.n), ['b', 'd', 'a', 'c']);
  const merged = roundRobinMerge([[song(1), song(2)], [song(1), song(3), song(4)]], 10);
  assert.deepStrictEqual(merged.map((s) => s.id), ['1', '2', '3', '4']);
  assert.strictEqual(roundRobinMerge([[song(1), song(2)], [song(3)]], 2).length, 2);
  assert.strictEqual(lowerBound(['a', 'c', 'e'], 'b'), 1);
  assert.strictEqual(lowerBound(['a', 'c', 'e'], 'z'), 3);
  assert.deepStrictEqual(groupBy([{ g: 'x' }, { g: '' }, { g: 'x' }], 'g', 'Other').map((g) => [g.name, g.songs.length]), [['x', 2], ['Other', 1]]);
});

test('shuffleWithFirst keeps first and all items', () => {
  const out = shuffleWithFirst([1, 2, 3, 4, 5], 2);
  assert.strictEqual(out[0], 3);
  assert.deepStrictEqual([...out].sort(), [1, 2, 3, 4, 5]);
});
