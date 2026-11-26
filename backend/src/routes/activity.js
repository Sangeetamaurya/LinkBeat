// Listening history, play counts, listening time and the numbers for the Profile screen.
const express = require('express');
const { HttpError } = require('../utils/errors');
const { cleanSong } = require('../utils/validators');
const { isDateKey, todayKey } = require('../utils/dates');
const stats = require('../services/statsService');

const MAX_COUNTED_SONGS = 3000;

function createActivityRouter({ auth }) {
  const router = express.Router();
  router.use(auth.required);

  // the app started playing a song
  router.post('/history/play', (req, res) => {
    const song = cleanSong((req.body || {}).song || req.body);
    if (!song) throw new HttpError(400, 'Invalid song');
    const user = req.user;

    const entry = user.playCounts.get(song.id);
    if (entry) {
      entry.song = song;
      entry.count += 1;
    } else if (user.playCounts.size < MAX_COUNTED_SONGS) {
      user.playCounts.set(song.id, { song, count: 1 });
    }
    user.history.set(song.id, song); // moves it to the front, drops the oldest after 50
    res.json({ ok: true });
  });

  router.get('/history', (req, res) => {
    res.json({ history: req.user.history.values() });
  });

  // "Clear listening history": history + play counts + weekly chart
  router.delete('/history', (req, res) => {
    req.user.history.clear();
    req.user.playCounts.clear();
    req.user.listenByDate.clear();
    res.json({ ok: true });
  });

  // the app sends listening time in small batches: { seconds, date: 'YYYY-MM-DD' }
  router.post('/stats/listen', (req, res) => {
    const seconds = Number((req.body || {}).seconds);
    const date = (req.body || {}).date;
    if (!Number.isFinite(seconds) || seconds <= 0 || seconds > 3600) {
      throw new HttpError(400, 'Invalid listening time');
    }
    const day = date === undefined ? todayKey() : date;
    if (!isDateKey(day)) throw new HttpError(400, 'Invalid date');

    const map = req.user.listenByDate;
    map.set(day, (map.get(day) || 0) + Math.round(seconds));
    // keep only the last ~60 days
    if (map.size > 60) {
      const oldest = [...map.keys()].sort().slice(0, map.size - 60);
      oldest.forEach((k) => map.delete(k));
    }
    res.json({ ok: true });
  });

  // GET /api/stats/profile?today=YYYY-MM-DD
  router.get('/stats/profile', (req, res) => {
    const today = req.query.today === undefined ? todayKey() : req.query.today;
    if (!isDateKey(today)) throw new HttpError(400, 'Invalid date');
    res.json(stats.profileStats(req.user, today));
  });

  return router;
}

module.exports = { createActivityRouter };
