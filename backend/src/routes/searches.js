// Recent searches: newest first, no repeats (case-insensitive), max 6.
const express = require('express');
const { HttpError } = require('../utils/errors');

function createSearchesRouter({ auth }) {
  const router = express.Router();
  router.use(auth.required);

  router.get('/', (req, res) => res.json({ recents: req.user.recents.values() }));

  router.post('/', (req, res) => {
    const term = String((req.body || {}).term || '').trim();
    if (!term) throw new HttpError(400, 'Nothing to save');
    if (term.length > 100) throw new HttpError(400, 'Search is too long');
    // same key for "Pop" and "pop", set() moves it to the front and drops the oldest
    req.user.recents.set(term.toLowerCase(), term);
    res.status(201).json({ recents: req.user.recents.values() });
  });

  router.delete('/', (req, res) => {
    req.user.recents.clear();
    res.json({ recents: [] });
  });

  router.delete('/:term', (req, res) => {
    req.user.recents.delete(String(req.params.term).trim().toLowerCase());
    res.json({ recents: req.user.recents.values() });
  });

  return router;
}

module.exports = { createSearchesRouter };
