// The play queue, kept as a circular doubly linked list (see dsa/PlayQueue.js).
const express = require('express');
const { HttpError } = require('../utils/errors');
const { cleanSongs } = require('../utils/validators');
const { PlayQueue } = require('../dsa/PlayQueue');

const QUEUE_MAX = 200;

function view(queue) {
  return {
    songs: queue.toArray(),
    currentIndex: queue.currentIndex,
    currentSong: queue.currentSong,
    shuffle: queue.shuffle,
    repeat: queue.repeat,
  };
}

function createQueueRouter({ auth }) {
  const router = express.Router();
  router.use(auth.required);

  router.get('/', (req, res) => res.json(view(req.user.queue)));

  // the app sends its queue (after play, shuffle, next, prev ...) so it can be restored later
  router.put('/', (req, res) => {
    const body = req.body || {};
    const songs = cleanSongs(body.songs || [], QUEUE_MAX);
    if (!songs) throw new HttpError(400, 'Invalid songs');
    const index = Number.isInteger(body.currentIndex) ? body.currentIndex : 0;

    let original = null;
    if (body.shuffle && Array.isArray(body.original)) {
      original = cleanSongs(body.original, QUEUE_MAX);
      if (!original) throw new HttpError(400, 'Invalid songs');
    }
    req.user.queue = new PlayQueue().load(songs, index, {
      shuffle: !!body.shuffle,
      repeat: !!body.repeat,
      original,
    });
    res.json(view(req.user.queue));
  });

  const need = (queue) => {
    if (queue.length === 0) throw new HttpError(400, 'The queue is empty');
  };

  router.post('/next', (req, res) => {
    need(req.user.queue);
    req.user.queue.next();
    res.json(view(req.user.queue));
  });

  router.post('/prev', (req, res) => {
    need(req.user.queue);
    req.user.queue.prev();
    res.json(view(req.user.queue));
  });

  router.post('/jump', (req, res) => {
    need(req.user.queue);
    const index = (req.body || {}).index;
    if (!Number.isInteger(index) || req.user.queue.jump(index) === null) {
      throw new HttpError(400, 'Invalid position');
    }
    res.json(view(req.user.queue));
  });

  router.post('/shuffle', (req, res) => {
    need(req.user.queue);
    req.user.queue.toggleShuffle();
    res.json(view(req.user.queue));
  });

  router.post('/repeat', (req, res) => {
    req.user.queue.toggleRepeat();
    res.json(view(req.user.queue));
  });

  // the 4 nodes the strip shows (playing song in the 2nd place when possible)
  router.get('/window', (req, res) => {
    const size = Math.min(Math.max(parseInt(req.query.size, 10) || 4, 1), 20);
    const q = req.user.queue;
    res.json({ ...q.window(size), currentIndex: q.currentIndex, total: q.length });
  });

  return router;
}

module.exports = { createQueueRouter };
