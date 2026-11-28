const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadLib(file) {
  const src = fs.readFileSync(path.join(__dirname, '../src/lib', file), 'utf8');
  const names = [];
  const code =
    src.replace(/export\s+(?:function|const)\s+(\w+)/g, (match, name) => {
      names.push(name);
      return match.replace(/^export\s+/, '');
    }) + `\nmodule.exports = { ${names.join(', ')} };`;
  const mod = { exports: {} };
  vm.runInThisContext(`(function(module, exports) { ${code}\n })`)(mod, mod.exports);
  return mod.exports;
}

const { usernameError, passwordError } = loadLib('auth.js');
const { avatarFromAsset } = loadLib('avatar.js');
const { coverAt, coverFallbacks } = loadLib('cover.js');
const { formatTime, localDateKey } = loadLib('format.js');
const { splitMatch } = loadLib('highlight.js');
const { listenedValue, listenedText, topArtists } = loadLib('profileStats.js');
const { pickNextIndex, pickPrevIndex } = loadLib('queue.js');
const { getQueueWindow } = loadLib('queueWindow.js');
const { addRecent } = loadLib('recent.js');
const { addToRecents } = loadLib('recents.js');
const { shuffleWithFirst } = loadLib('shuffle.js');

test('auth: usernameError and passwordError validate boundaries and characters', () => {
  assert.strictEqual(usernameError('ab'), 'Username needs at least 3 characters');
  assert.strictEqual(usernameError('a'.repeat(31)), 'Username can be 30 characters at most');
  assert.strictEqual(usernameError('bad@name!'), 'Use only letters, numbers and underscores');
  assert.strictEqual(usernameError('  valid_user_1  '), '');
  assert.strictEqual(passwordError('12345'), 'Password needs at least 6 characters');
  assert.strictEqual(passwordError('secret1'), '');
});

test('avatar: avatarFromAsset builds base64 data URI or falls back to file URI', () => {
  assert.strictEqual(
    avatarFromAsset({ base64: 'AAAA', mimeType: 'image/png' }),
    'data:image/png;base64,AAAA'
  );
  assert.strictEqual(avatarFromAsset({ base64: 'BBBB' }), 'data:image/jpeg;base64,BBBB');
  assert.strictEqual(avatarFromAsset({ uri: 'file:///pic.jpg' }), 'file:///pic.jpg');
});

test('cover: coverAt upgrades http to https and resizes iTunes artwork', () => {
  const raw = 'http://is1.mzstatic.com/image/thumb/100x100bb.jpg';
  assert.strictEqual(coverAt(raw, 600), 'https://is1.mzstatic.com/image/thumb/600x600bb.jpg');
  assert.strictEqual(coverAt('', 600), '');
  assert.deepStrictEqual(coverFallbacks(raw), [
    'https://is1.mzstatic.com/image/thumb/600x600bb.jpg',
    'https://is1.mzstatic.com/image/thumb/300x300bb.jpg',
    'https://is1.mzstatic.com/image/thumb/100x100bb.jpg',
  ]);
});

test('format: formatTime pads seconds and localDateKey formats YYYY-MM-DD', () => {
  assert.strictEqual(formatTime(0), '0:00');
  assert.strictEqual(formatTime(65), '1:05');
  assert.strictEqual(formatTime(125.9), '2:05');
  assert.strictEqual(localDateKey(new Date(2026, 0, 5)), '2026-01-05');
});

test('highlight: splitMatch splits [before, match, after] case-insensitively', () => {
  assert.deepStrictEqual(splitMatch('Ed Sheeran', 'she'), ['Ed ', 'She', 'eran']);
  assert.deepStrictEqual(splitMatch('Ed Sheeran', 'zzz'), ['Ed Sheeran', '', '']);
  assert.deepStrictEqual(splitMatch('Ed Sheeran', '   '), ['Ed Sheeran', '', '']);
});

test('profileStats: listenedValue, listenedText, and weighted topArtists', () => {
  assert.deepStrictEqual(listenedValue(1800), { value: '30', unit: 'Min Listened' });
  assert.deepStrictEqual(listenedValue(7200), { value: '2.0', unit: 'Hours Listened' });
  assert.strictEqual(listenedText(900), '15 min');
  assert.strictEqual(listenedText(5400), '1.5 hours');

  const playCounts = {
    1: { song: { artist: 'Artist A', cover: 'cA' }, count: 3 }, // score 6
    2: { song: { artist: 'Artist B', cover: 'cB' }, count: 1 }, // score 2
  };
  const liked = [{ artist: 'Artist B', cover: 'cB' }]; // +1 -> score 3
  const top = topArtists(playCounts, liked, 2);
  assert.strictEqual(top[0].name, 'Artist A');
  assert.strictEqual(top[0].score, 6);
  assert.strictEqual(top[1].name, 'Artist B');
  assert.strictEqual(top[1].score, 3);
});

test('queue: pickNextIndex and pickPrevIndex wrap circularly and shuffle avoids current song', () => {
  assert.strictEqual(pickNextIndex(0, 0, false), -1);
  assert.strictEqual(pickPrevIndex(0, 0), -1);
  assert.strictEqual(pickNextIndex(5, 4, false), 0);
  assert.strictEqual(pickPrevIndex(5, 0), 4);

  // In shuffle mode with >1 songs, next index must never equal current index (2)
  for (const r of [0, 0.25, 0.5, 0.75, 0.99]) {
    assert.notStrictEqual(pickNextIndex(5, 2, true, () => r), 2);
  }
});

test('queueWindow: getQueueWindow keeps active song in 2nd position and clamps bounds', () => {
  assert.deepStrictEqual(getQueueWindow(3, 1, 4), { start: 0, end: 3 });
  assert.deepStrictEqual(getQueueWindow(7, 0, 4), { start: 0, end: 4 });
  assert.deepStrictEqual(getQueueWindow(7, 3, 4), { start: 2, end: 6 });
  assert.deepStrictEqual(getQueueWindow(7, 6, 4), { start: 3, end: 7 });
});

test('recent & recents: addRecent deduplicates case-insensitively and caps at 6', () => {
  let list = [];
  for (const t of ['pop', 'rock', 'POP', 'a', 'b', 'c', 'd', 'e']) {
    list = addRecent(list, t);
  }
  assert.deepStrictEqual(list, ['e', 'd', 'c', 'b', 'a', 'POP']);
  assert.deepStrictEqual(addToRecents(['rock'], '   '), ['rock']);
});

test('shuffle: shuffleWithFirst keeps playing song at index 0', () => {
  const out = shuffleWithFirst(['s1', 's2', 's3', 's4'], 2);
  assert.strictEqual(out[0], 's3');
  assert.deepStrictEqual([...out].sort(), ['s1', 's2', 's3', 's4']);
});
function loadWithMocks(file, mocks = {}) {
  const src = fs.readFileSync(path.join(__dirname, '../src/lib', file), 'utf8');
  const names = [];
  const code =
    src
      .replace(/^\s*import\s+.*$/gm, '')
      .replace(/export\s+(?:function|const)\s+(\w+)/g, (match, name) => {
        names.push(name);
        return match.replace(/^export\s+/, '');
      }) + `\nmodule.exports = { ${names.join(', ')} };`;
  const mod = { exports: {} };
  const keys = Object.keys(mocks);
  const fn = vm.runInThisContext(`(function(module, exports, ${keys.join(', ')}) { ${code}\n })`);
  fn(mod, mod.exports, ...keys.map((k) => mocks[k]));
  return mod.exports;
}

test('sync: FIFO promise queue sends actions in strict order and ignores when disabled', async () => {
  const order = [];
  const request = async (method, path) => {
    if (path === '/slow') await new Promise((r) => setTimeout(r, 20));
    if (path === '/fail') throw new Error('network error');
    order.push(method + ' ' + path);
  };
  const { setSyncEnabled, isSyncEnabled, enqueue, idle } = loadWithMocks('sync.js', { request });

  // Guest mode (disabled): nothing sent
  assert.strictEqual(isSyncEnabled(), false);
  await enqueue('POST', '/ignored');
  assert.deepStrictEqual(order, []);

  // Logged-in mode (enabled): FIFO order preserved even if 1st request is slow or fails
  setSyncEnabled(true);
  enqueue('POST', '/slow');
  enqueue('POST', '/fail');
  enqueue('DELETE', '/fast');
  await idle();
  assert.deepStrictEqual(order, ['POST /slow', 'DELETE /fast']);
});

test('listenBuffer: batches seconds until 15s threshold and supports manual flush/drop', async () => {
  const sent = [];
  const { addListening, flushListening, dropListening } = loadWithMocks('listenBuffer.js', {
    isSyncEnabled: () => true,
    localDateKey: () => '2026-11-28',
    enqueue: async (method, path, body) => sent.push({ method, path, body }),
  });

  addListening(5);
  addListening(5);
  assert.strictEqual(sent.length, 0); // 10s < 15s threshold

  addListening(6); // 16s >= 15s -> auto-flushes!
  assert.strictEqual(sent.length, 1);
  assert.deepStrictEqual(sent[0], {
    method: 'POST',
    path: '/stats/listen',
    body: { seconds: 16, date: '2026-11-28' },
  });

  addListening(4);
  dropListening();
  await flushListening();
  assert.strictEqual(sent.length, 1); // dropped time was not sent
});

test('api: searchSongs and searchMix cache results and evict failed requests for retry', async () => {
  let calls = 0;
  const songsApi = {
    search: async (q, limit) => {
      calls++;
      if (q === 'fail') throw new Error('server down');
      return [{ id: '1', title: q, limit }];
    },
    mix: async (terms, total) => {
      calls++;
      return terms.map((t) => ({ id: t, total }));
    },
  };
  const { searchSongs, searchMix } = loadWithMocks('api.js', { songsApi });

  const r1 = await searchSongs('pop', 10);
  const r2 = await searchSongs('  POP  ', 10); // served from cache
  assert.strictEqual(calls, 1);
  assert.deepStrictEqual(r1, r2);

  await assert.rejects(() => searchSongs('fail', 10));
  await assert.rejects(() => searchSongs('fail', 10)); // not cached on failure, retries!
  assert.strictEqual(calls, 3);

  await searchMix(['pop', 'rock'], 6);
  await searchMix(['POP', 'ROCK'], 6); // served from cache
  assert.strictEqual(calls, 4);
});