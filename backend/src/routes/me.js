// One call that gives the app everything it needs right after login.
const express = require('express');
const { HttpError } = require('../utils/errors');
const { isDateKey, todayKey } = require('../utils/dates');
const stats = require('../services/statsService');
const { publicUser } = require('./auth');

function createMeRouter({ auth }) {
  const router = express.Router();
  router.use(auth.required);

  // GET /api/me/state?today=YYYY-MM-DD
  router.get('/state', (req, res) => {
    const today = req.query.today === undefined ? todayKey() : req.query.today;
    if (!isDateKey(today)) throw new HttpError(400, 'Invalid date');
    const user = req.user;
    const q = user.queue;
    res.json({
      user: publicUser(user),
      liked: user.liked.values(),
      history: user.history.values(),
      playCounts: stats.playCountsObject(user),
      listenByDay: stats.listenByDay(user, today),
      recents: user.recents.values(),
      queue: {
        songs: q.toArray(),
        currentIndex: q.currentIndex,
        shuffle: q.shuffle,
        repeat: q.repeat,
        original: q.shuffle ? q.original : [],
      },
    });
  });

  return router;
}

module.exports = { createMeRouter };
