const express = require('express');
const { HttpError } = require('../utils/errors');
const { cleanSong } = require('../utils/validators');
const { mergeSort, groupBy, lowerBound } = require('../dsa/algorithms');

const LIKED_MAX = 2000;

const byText = (get) => (a, b) => get(a).toLowerCase().localeCompare(get(b).toLowerCase());

function createLibraryRouter({ auth }) {
  const router = express.Router();
  router.use(auth.required);

  // GET /api/library?sort=recent|az&q=prefix
  // liked songs + playlists (grouped by genre) + artists (grouped by artist)
  router.get('/', (req, res) => {
    const user = req.user;
    const sort = req.query.sort === 'az' ? 'az' : 'recent';
    const liked = user.liked.values(); // newest first

    const sortGroups = (groups) => (sort === 'az' ? mergeSort(groups, byText((g) => g.name)) : groups);
    const playlists = sortGroups(groupBy(liked, 'genre', 'Other'));
    const artists = sortGroups(groupBy(liked, 'artist', 'Unknown'));
    const songs = sort === 'az' ? mergeSort(liked, byText((s) => s.title)) : liked;

    const out = { count: liked.length, sort, songs, playlists, artists };

    // title prefix search: sort A-Z once, then binary search the first match
    const q = String(req.query.q || '').trim().toLowerCase();
    if (q) {
      const sorted = mergeSort(liked, byText((s) => s.title));
      const found = [];
      for (let i = lowerBound(sorted, q, (s) => s.title.toLowerCase()); i < sorted.length; i++) {
        if (!sorted[i].title.toLowerCase().startsWith(q)) break;
        found.push(sorted[i]);
      }
      out.matches = found;
    }
    res.json(out);
  });

  // like a song (liking again just moves it to the top)
  router.post('/liked', (req, res) => {
    const song = cleanSong((req.body || {}).song || req.body);
    if (!song) throw new HttpError(400, 'Invalid song');
    if (!req.user.liked.has(song.id) && req.user.liked.size >= LIKED_MAX) {
      throw new HttpError(400, 'Your library is full');
    }
    req.user.liked.set(song.id, song);
    res.status(201).json({ ok: true, count: req.user.liked.size });
  });

  router.delete('/liked/:id', (req, res) => {
    req.user.liked.delete(String(req.params.id));
    res.json({ ok: true, count: req.user.liked.size });
  });

  router.delete('/liked', (req, res) => {
    req.user.liked.clear();
    res.json({ ok: true, count: 0 });
  });

  return router;
}

module.exports = { createLibraryRouter };
