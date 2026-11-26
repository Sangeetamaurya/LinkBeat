const express = require('express');
const { asyncHandler, HttpError } = require('../utils/errors');

const clamp = (value, min, max, fallback) => {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : fallback;
};

function createSongsRouter({ songs }) {
  const router = express.Router();

  // GET /api/songs/search?q=pop&limit=20
  router.get(
    '/search',
    asyncHandler(async (req, res) => {
      const q = String(req.query.q || '').trim();
      if (!q) throw new HttpError(400, 'Type something to search');
      if (q.length > 100) throw new HttpError(400, 'Search is too long');
      res.json({ songs: await songs.search(q, clamp(req.query.limit, 1, 50, 20)) });
    })
  );

  // GET /api/songs/mix?terms=The Weeknd,Ed Sheeran&limit=12   (results mixed one by one)
  router.get(
    '/mix',
    asyncHandler(async (req, res) => {
      const terms = String(req.query.terms || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 6);
      if (terms.length === 0) throw new HttpError(400, 'Send at least one term');
      res.json({ songs: await songs.mix(terms, clamp(req.query.limit, 1, 50, 12)) });
    })
  );

  // GET /api/songs/suggest?prefix=ed   (Trie)
  router.get('/suggest', (req, res) => {
    res.json({ suggestions: songs.suggest(String(req.query.prefix || ''), clamp(req.query.limit, 1, 20, 8)) });
  });

  return router;
}

module.exports = { createSongsRouter };
