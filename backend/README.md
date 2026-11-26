# LinkBeat backend

Node + Express backend for the LinkBeat music app. **No database** – all data is kept in memory in
data structures. If `PERSIST=true` (default) the whole store is also saved to `data/store.json`
(a plain json file) so accounts and libraries survive a restart.

## Run it

```bash
cd backend
npm install
copy .env.example .env      # Windows (use cp on Mac/Linux). Set JWT_SECRET to a long random text.
npm start                   # http://localhost:5000/api
npm test                    # 12 tests (data structures + every endpoint)
```

Node 18 or newer is needed. `.env` is read automatically when the server starts.

### Connect the app
1. Start the backend (`npm start`).
2. In `frontend`: run `npx expo install expo-constants` once (it is already listed in package.json),
   then `npx expo start`.
3. The app finds the backend by itself when your phone and computer are on the same Wi-Fi
   (it uses the address Expo is served from + port 5000). If that does not work, copy
   `frontend/.env.example` to `frontend/.env` and put your computer's IP in `EXPO_PUBLIC_API_URL`.
   Android emulator uses `http://10.0.2.2:5000/api` automatically.
4. Allow port 5000 in Windows Firewall if the phone cannot connect.

## Folder map

```
src/
  dsa/           the data structures and algorithms (below)
  store.js       in-memory store (+ optional json file save)
  services/      songService (iTunes + cache + trie), statsService (heap)
  routes/        auth, profile, songs, library, activity, searches, queue, me
  middleware/    auth (JWT), rateLimit, errorHandler
  utils/         validators, password hashing (scrypt), dates
test/            dsa.test.js, api.test.js
```

## DSA used in this project

| # | Concept | Where (file) | What it does in the app | Cost |
|---|---------|--------------|-------------------------|------|
| 1 | **Hash Map** (`Map`) | `store.js`, `LinkedHashMap.js`, `statsService.js` | users by username / by id (login in O(1)), play counts per song, listening seconds per date, grouping | O(1) |
| 2 | **Doubly Linked List + Hash Map = LRU cache** | `dsa/LinkedHashMap.js` | iTunes response cache (capacity 300, oldest evicted), liked songs (newest first), listening history (max 50, replay moves to front), recent searches (max 6, no repeats) | get/set/delete O(1) |
| 3 | **Circular Doubly Linked List** | `dsa/PlayQueue.js` | the play queue: next after the last song goes to the first, previous before the first goes to the last | next/prev O(1) |
| 4 | **Sliding window over a list** | `PlayQueue.window()` | the 4-node strip (playing song in 2nd place) | O(k) |
| 5 | **Fisher-Yates shuffle** | `dsa/shuffle.js`, `PlayQueue.toggleShuffle()` | shuffle keeps the playing song first, un-shuffle restores the old order | O(n) |
| 6 | **Binary Min-Heap / Priority Queue** | `dsa/MinHeap.js` | `topK` for Top Artists and Most Played (keep only the best k) | O(n log k) |
| 7 | **Trie (prefix tree)** | `dsa/Trie.js` | search suggestions while typing (filled from every song/artist that came back from iTunes) | O(len) insert / lookup |
| 8 | **Queue (FIFO) / sliding-window rate limiter** | `dsa/SlidingWindowLimiter.js` | max 300 requests/min per IP, 20/min on login/signup | O(1) amortized |
| 9 | **Merge sort (stable)** | `dsa/algorithms.js` | Library "A to Z" sort; equal titles keep their liked order | O(n log n) |
| 10 | **Binary search (lower bound)** | `dsa/algorithms.js` | Library title-prefix search `GET /library?q=` on the A-Z sorted list | O(log n) |
| 11 | **Set** | `songService.js`, `algorithms.js`, `validators.js` | remove repeated songs, repeated genres, repeated ids | O(1) |
| 12 | **Round-robin / k-way merge** | `dsa/algorithms.js` | `GET /songs/mix` – takes 1st of each list, then 2nd of each ... for variety | O(n) |
| 13 | **Group-by with hash map** | `dsa/algorithms.js` | Library playlists (by genre) and artists | O(n) |
| 14 | **Promise chain as a FIFO queue** (app side) | `frontend/src/lib/sync.js` | sends likes/plays to the server in the order they happened | O(1) |

The frontend already used some of these (circular list `lib/queue.js`, window `lib/queueWindow.js`,
Fisher-Yates `lib/shuffle.js`, Map/Set grouping in `LibraryScreen`). The backend now holds the real
versions and the app talks to them.

## API (all under `/api`, JSON, errors look like `{ "error": "text" }`)

Login routes return a token. Send it as `Authorization: Bearer <token>`. 🔒 = needs the token.

| Method + path | What it does |
|---|---|
| `POST /auth/signup` `{name, username, password}` | create account → `{token, user}` |
| `POST /auth/login` `{username, password}` | → `{token, user}` |
| `POST /auth/logout` 🔒 | token stops working |
| `GET /auth/me` 🔒 | current user |
| `GET /auth/username-available?username=` | `{available, reason}` |
| `POST /auth/change-password` 🔒 `{oldPassword, newPassword}` | |
| `DELETE /auth/account` 🔒 | deletes the account and all its data |
| `PUT /profile` 🔒 `{name?, username?, genres?, avatar?}` | `avatar` = `data:image/...;base64,...` |
| `PUT /profile/avatar` 🔒 `{avatar}` | |
| `GET /songs/search?q=&limit=` | songs (cached) |
| `GET /songs/mix?terms=a,b,c&limit=` | mixed results (round-robin) |
| `GET /songs/suggest?prefix=` | Trie suggestions |
| `GET /library?sort=recent\|az&q=` 🔒 | liked songs + playlists + artists |
| `POST /library/liked` 🔒 `{song}` · `DELETE /library/liked/:id` · `DELETE /library/liked` | like / unlike / clear |
| `POST /history/play` 🔒 `{song}` · `GET /history` · `DELETE /history` | plays, history, clear listening data |
| `POST /stats/listen` 🔒 `{seconds, date}` | listening time batch |
| `GET /stats/profile?today=YYYY-MM-DD` 🔒 | counts, weekly chart, top artists, most played |
| `GET/POST/DELETE /searches` 🔒 · `DELETE /searches/:term` | recent searches |
| `GET /queue` 🔒 · `PUT /queue` · `POST /queue/next\|prev\|shuffle\|repeat\|jump` · `GET /queue/window` | circular-list play queue |
| `GET /me/state?today=` 🔒 | everything the app loads right after login |

## What the app does with it

- **Guest mode still works** exactly as before (everything local, nothing saved).
- **Logged in:** screens update instantly, and every change is sent to the backend in order
  (`lib/sync.js`). On login the app loads `GET /me/state`, so likes, history, listening stats,
  recent searches and the last queue come back (on any phone). Press play to continue the restored queue.
- The token is kept in memory only, so closing the app means logging in again (same as before).
  To stay logged in, store the token with `expo-secure-store`.

## Limits worth knowing

- Memory storage: with `PERSIST=true` data is written 0.5 s after a change and on shutdown; a hard crash can lose the last half second.
  This is fine for a project/demo, not for production – a real database would replace `store.js`.
- Passwords: scrypt + random salt. Login tokens: JWT, 7 days, logout revokes the token.
