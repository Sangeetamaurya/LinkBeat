const test = require('node:test');
const assert = require('node:assert');
const { createApp } = require('../src/app');

let calls = 0;
const fakeItunes = async (url) => {
  calls++;
  const term = new URL(url).searchParams.get('term');
  if (term === 'fail') return { ok: false, json: async () => ({}) };
  const results = [1, 2, 3].map((n) => ({
    trackId: term.length * 100 + n,
    trackName: term + ' song ' + n,
    artistName: 'Artist ' + (n % 2),
    primaryGenreName: n === 1 ? 'Pop' : 'Rock',
    trackTimeMillis: 200000,
    artworkUrl100: 'http://img.test/a/100x100bb.jpg',
    previewUrl: 'https://audio.test/' + n + '.m4a',
  }));
  results.push({ trackId: 999, trackName: 'no audio', artistName: 'x', artworkUrl100: 'u' }); // skipped
  return { ok: true, json: async () => ({ results }) };
};

async function start() {
  const { app } = createApp({ persist: false, fetchImpl: fakeItunes, jwtSecret: 'test', authLimit: 1000 });
  const server = await new Promise((r) => { const s = app.listen(0, () => r(s)); });
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const call = async (method, path, body, token) => {
    const res = await fetch(base + path, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: res.status, body: await res.json() };
  };
  return { server, call };
}

const S = (n, extra = {}) => ({ id: String(n), title: 'Song ' + n, artist: 'Art ' + (n % 2), genre: 'Pop', duration: 30, cover: 'https://c/' + n, url: 'https://a/' + n, ...extra });

test('full flow: auth, profile, library, history, stats, searches, queue, songs', async (t) => {
  const { server, call } = await start();
  t.after(() => server.close());

  // ---- auth ----
  assert.strictEqual((await call('POST', '/auth/signup', { name: 'Sam', username: 'ab', password: 'secret1' })).status, 400);
  assert.strictEqual((await call('POST', '/auth/signup', { name: 'Sam', username: 'sam_1', password: '123' })).status, 400);
  const su = await call('POST', '/auth/signup', { name: 'Sam', username: 'Sam_1', password: 'secret1' });
  assert.strictEqual(su.status, 201);
  assert.strictEqual(su.body.user.username, 'sam_1');
  assert.strictEqual(su.body.user.passwordHash, undefined);
  const dup = await call('POST', '/auth/signup', { name: 'X', username: 'SAM_1', password: 'secret1' });
  assert.strictEqual(dup.status, 409);
  assert.strictEqual((await call('POST', '/auth/login', { username: 'sam_1', password: 'nope!!' })).status, 401);
  const li = await call('POST', '/auth/login', { username: 'SAM_1', password: 'secret1' });
  assert.strictEqual(li.status, 200);
  const T = li.body.token;
  assert.strictEqual((await call('GET', '/auth/me')).status, 401);
  assert.strictEqual((await call('GET', '/auth/me', undefined, T)).body.user.name, 'Sam');
  assert.strictEqual((await call('GET', '/auth/username-available?username=sam_1')).body.available, false);
  assert.strictEqual((await call('GET', '/auth/username-available?username=sam_1', undefined, T)).body.available, true);
  assert.strictEqual((await call('GET', '/auth/username-available?username=free_name')).body.available, true);

  // ---- profile ----
  await call('POST', '/auth/signup', { name: 'Other', username: 'other', password: 'secret1' });
  assert.strictEqual((await call('PUT', '/profile', { username: 'other' }, T)).status, 409);
  const pr = await call('PUT', '/profile', { name: 'Sam K', username: 'sammy', genres: ['Pop', 'Nope', 'Pop', 'Rock'], avatar: 'data:image/jpeg;base64,AAAA' }, T);
  assert.deepStrictEqual(pr.body.user.genres, ['Pop', 'Rock']);
  assert.strictEqual(pr.body.user.username, 'sammy');
  assert.strictEqual((await call('POST', '/auth/login', { username: 'sam_1', password: 'secret1' })).status, 401); // old name gone
  assert.strictEqual((await call('PUT', '/profile', { avatar: 'javascript:alert(1)' }, T)).status, 400);
  assert.strictEqual((await call('GET', '/auth/me', undefined, T)).body.user.username, 'sammy'); // token still valid after rename

  // ---- password ----
  assert.strictEqual((await call('POST', '/auth/change-password', { oldPassword: 'wrong1', newPassword: 'newpass1' }, T)).body.error, 'Current password is wrong');
  assert.strictEqual((await call('POST', '/auth/change-password', { oldPassword: 'secret1', newPassword: 'newpass1' }, T)).status, 200);
  assert.strictEqual((await call('POST', '/auth/login', { username: 'sammy', password: 'secret1' })).status, 401);
  assert.strictEqual((await call('POST', '/auth/login', { username: 'sammy', password: 'newpass1' })).status, 200);

  // ---- library ----
  for (const n of [1, 2, 3, 4]) await call('POST', '/library/liked', { song: S(n, { genre: n < 3 ? 'Pop' : 'Rock', title: ['Zed', 'Alpha', 'Beta', 'Alpine'][n - 1] }) }, T);
  assert.strictEqual((await call('POST', '/library/liked', { song: { id: 'x' } }, T)).status, 400);
  let lib = (await call('GET', '/library', undefined, T)).body;
  assert.deepStrictEqual(lib.songs.map((s) => s.id), ['4', '3', '2', '1']); // newest first
  assert.deepStrictEqual(lib.playlists.map((p) => p.name), ['Rock', 'Pop']);
  lib = (await call('GET', '/library?sort=az&q=alp', undefined, T)).body;
  assert.deepStrictEqual(lib.songs.map((s) => s.title), ['Alpha', 'Alpine', 'Beta', 'Zed']);
  assert.deepStrictEqual(lib.matches.map((s) => s.title), ['Alpha', 'Alpine']);
  await call('DELETE', '/library/liked/3', undefined, T);
  assert.strictEqual((await call('GET', '/library', undefined, T)).body.count, 3);

  // ---- history, listening, stats ----
  await call('POST', '/history/play', { song: S(1) }, T);
  await call('POST', '/history/play', { song: S(2) }, T);
  await call('POST', '/history/play', { song: S(1) }, T);
  assert.deepStrictEqual((await call('GET', '/history', undefined, T)).body.history.map((s) => s.id), ['1', '2']);
  assert.strictEqual((await call('POST', '/stats/listen', { seconds: -5 }, T)).status, 400);
  assert.strictEqual((await call('POST', '/stats/listen', { seconds: 60, date: '2026-11-26' }, T)).status, 200); // Thursday
  await call('POST', '/stats/listen', { seconds: 30, date: '2026-11-26' }, T);
  await call('POST', '/stats/listen', { seconds: 10, date: '2026-11-23' }, T); // Monday of that week
  await call('POST', '/stats/listen', { seconds: 999, date: '2026-11-16' }, T); // other week
  const st = (await call('GET', '/stats/profile?today=2026-11-26', undefined, T)).body;
  assert.deepStrictEqual(st.listenByDay, [10, 0, 0, 90, 0, 0, 0]);
  assert.strictEqual(st.todayIndex, 3);
  assert.strictEqual(st.totalSeconds, 100);
  assert.strictEqual(st.savedCount, 3);
  assert.strictEqual(st.playlistCount, 3); // Pop, Rock + Liked Songs
  assert.strictEqual(st.topArtists[0].name, 'Art 1'); // played 2x (song 1) -> 4 + liked
  assert.strictEqual(st.mostPlayed[0].id, '1');
  assert.strictEqual((await call('GET', '/stats/profile?today=bad', undefined, T)).status, 400);

  // ---- recent searches ----
  for (const term of ['pop', 'rock', 'Pop', 'a', 'b', 'c', 'd', 'e']) await call('POST', '/searches', { term }, T);
  assert.deepStrictEqual((await call('GET', '/searches', undefined, T)).body.recents, ['e', 'd', 'c', 'b', 'a', 'Pop']);
  assert.deepStrictEqual((await call('DELETE', '/searches/D', undefined, T)).body.recents, ['e', 'c', 'b', 'a', 'Pop']);

  // ---- queue ----
  const songs = [1, 2, 3, 4, 5].map((n) => S(n));
  const q = await call('PUT', '/queue', { songs, currentIndex: 4, shuffle: false, repeat: false }, T);
  assert.strictEqual(q.body.currentIndex, 4);
  assert.strictEqual((await call('POST', '/queue/next', {}, T)).body.currentSong.id, '1');
  assert.strictEqual((await call('POST', '/queue/prev', {}, T)).body.currentSong.id, '5');
  const sh = (await call('POST', '/queue/shuffle', {}, T)).body;
  assert.strictEqual(sh.shuffle, true);
  assert.strictEqual(sh.currentIndex, 0);
  assert.strictEqual(sh.currentSong.id, '5');
  assert.strictEqual((await call('GET', '/queue/window', undefined, T)).body.songs.length, 4);
  assert.strictEqual((await call('POST', '/queue/jump', { index: 99 }, T)).status, 400);

  // ---- one-call state for the app ----
  const state = (await call('GET', '/me/state?today=2026-11-26', undefined, T)).body;
  assert.strictEqual(state.liked.length, 3);
  assert.strictEqual(state.playCounts['1'].count, 2);
  assert.deepStrictEqual(state.listenByDay, [10, 0, 0, 90, 0, 0, 0]);
  assert.strictEqual(state.queue.shuffle, true);
  assert.strictEqual(state.queue.original.length, 5);

  // ---- clear ----
  await call('DELETE', '/history', undefined, T);
  const after = (await call('GET', '/stats/profile?today=2026-11-26', undefined, T)).body;
  assert.strictEqual(after.totalSeconds, 0);
  assert.strictEqual((await call('GET', '/history', undefined, T)).body.history.length, 0);
  await call('DELETE', '/library/liked', undefined, T);
  assert.strictEqual((await call('GET', '/library', undefined, T)).body.count, 0);

  // ---- logout + delete ----
  assert.strictEqual((await call('POST', '/auth/logout', {}, T)).status, 200);
  assert.strictEqual((await call('GET', '/auth/me', undefined, T)).status, 401);
  const T2 = (await call('POST', '/auth/login', { username: 'sammy', password: 'newpass1' })).body.token;
  assert.strictEqual((await call('DELETE', '/auth/account', undefined, T2)).status, 200);
  assert.strictEqual((await call('POST', '/auth/login', { username: 'sammy', password: 'newpass1' })).status, 401);
});

test('songs: search normalises + caches, mix, suggest, errors', async (t) => {
  const { server, call } = await start();
  t.after(() => server.close());
  calls = 0;
  const a = await call('GET', '/songs/search?q=pop&limit=10');
  assert.strictEqual(a.body.songs.length, 3); // item without audio dropped
  assert.strictEqual(a.body.songs[0].cover, 'https://img.test/a/600x600bb.jpg');
  await call('GET', '/songs/search?q=POP&limit=10');
  assert.strictEqual(calls, 1); // second one came from the LRU cache
  const m = await call('GET', '/songs/mix?terms=pop,rock&limit=4');
  assert.strictEqual(m.body.songs.length, 4);
  assert.deepStrictEqual(m.body.songs.map((s) => s.title.split(' ')[0]).slice(0, 2), ['pop', 'rock']); // mixed one by one
  assert.ok((await call('GET', '/songs/suggest?prefix=po')).body.suggestions.includes('pop song 1'));
  assert.strictEqual((await call('GET', '/songs/search?q=')).status, 400);
  assert.strictEqual((await call('GET', '/songs/search?q=fail')).status, 502);
  calls = 0;
  await call('GET', '/songs/search?q=fail');
  assert.strictEqual(calls, 1); // failures are not cached
});

test('rate limit answers 429', async (t) => {
  const { app } = createApp({ persist: false, fetchImpl: fakeItunes, generalLimit: 3 });
  const server = await new Promise((r) => { const s = app.listen(0, () => r(s)); });
  t.after(() => server.close());
  const url = `http://127.0.0.1:${server.address().port}/api/health`;
  const codes = [];
  for (let i = 0; i < 5; i++) codes.push((await fetch(url)).status);
  assert.deepStrictEqual(codes, [200, 200, 200, 429, 429]);
});

test('persistence: data survives a restart', async () => {
  const fs = require('fs'), os = require('os'), path = require('path');
  const { Store } = require('../src/store');
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'lb-')), 'store.json');
  const a = new Store({ file, persist: true });
  const u = a.createUser({ name: 'N', username: 'Persist', passwordHash: 'h' });
  [1, 2, 3].forEach((n) => u.liked.set(String(n), S(n)));
  u.recents.set('pop', 'pop');
  u.queue.load([S(1), S(2)], 1);
  a.save();
  const b = new Store({ file, persist: true });
  const v = b.findByUsername('persist');
  assert.deepStrictEqual(v.liked.keys(), ['3', '2', '1']); // same order
  assert.strictEqual(v.queue.currentSong.id, '2');
  assert.deepStrictEqual(v.recents.values(), ['pop']);
});
test('queue edge cases: un-shuffle restores order, repeat toggle, valid jump', async (t) => {
  const { server, call } = await start();
  t.after(() => server.close());
  const { body: { token: T } } = await call('POST', '/auth/signup', {
    name: 'QueueTester',
    username: 'q_user',
    password: 'password123',
  });

  const songs = [1, 2, 3, 4, 5].map((n) => S(n));
  await call('PUT', '/queue', { songs, currentIndex: 2, shuffle: false, repeat: false }, T);

  const jumped = await call('POST', '/queue/jump', { index: 3 }, T);
  assert.strictEqual(jumped.status, 200);
  assert.strictEqual(jumped.body.currentSong.id, '4');

  await call('POST', '/queue/shuffle', {}, T);
  const unshuffled = await call('POST', '/queue/shuffle', {}, T);
  assert.strictEqual(unshuffled.body.shuffle, false);
  assert.deepStrictEqual(unshuffled.body.songs.map((s) => s.id), ['1', '2', '3', '4', '5']);
  assert.strictEqual(unshuffled.body.currentSong.id, '4');

  const repOn = await call('POST', '/queue/repeat', {}, T);
  assert.strictEqual(repOn.body.repeat, true);
  const repOff = await call('POST', '/queue/repeat', {}, T);
  assert.strictEqual(repOff.body.repeat, false);
});

test('security & isolation: User A cannot see or modify User B data, invalid JWT rejected', async (t) => {
  const { server, call } = await start();
  t.after(() => server.close());

  const u1 = await call('POST', '/auth/signup', { name: 'Alice', username: 'alice_1', password: 'password123' });
  const u2 = await call('POST', '/auth/signup', { name: 'Bob', username: 'bob_1', password: 'password123' });
  const tokenA = u1.body.token;
  const tokenB = u2.body.token;

  await call('POST', '/library/liked', { song: S(1) }, tokenA);
  await call('POST', '/searches', { term: 'alice secret' }, tokenA);

  const bobLib = await call('GET', '/library', undefined, tokenB);
  const bobSearch = await call('GET', '/searches', undefined, tokenB);
  assert.strictEqual(bobLib.body.count, 0);
  assert.strictEqual(bobSearch.body.recents.length, 0);

  const fakeRes = await call('GET', '/auth/me', undefined, 'eyJhbGciOiJIUzI1NiJ9.fakepayload.fakesig');
  assert.strictEqual(fakeRes.status, 401);
});

test('profile avatar endpoint & clear all searches', async (t) => {
  const { server, call } = await start();
  t.after(() => server.close());
  const { body: { token: T } } = await call('POST', '/auth/signup', {
    name: 'Ava',
    username: 'ava_user',
    password: 'password123',
  });

  const av = await call('PUT', '/profile/avatar', { avatar: 'data:image/png;base64,BBBB' }, T);
  assert.strictEqual(av.status, 200);
  assert.strictEqual(av.body.user.avatar, 'data:image/png;base64,BBBB');

  await call('POST', '/searches', { term: 'one' }, T);
  await call('POST', '/searches', { term: 'two' }, T);
  const delAll = await call('DELETE', '/searches', undefined, T);
  assert.strictEqual(delAll.status, 200);
  assert.deepStrictEqual(delAll.body.recents, []);
});