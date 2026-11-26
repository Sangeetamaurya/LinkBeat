const express = require('express');
const cors = require('cors');
const defaults = require('./config');
const { Store } = require('./store');
const { createAuth } = require('./middleware/auth');
const { createRateLimit } = require('./middleware/rateLimit');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { createSongService } = require('./services/songService');
const { createAuthRouter } = require('./routes/auth');
const { createProfileRouter } = require('./routes/profile');
const { createSongsRouter } = require('./routes/songs');
const { createLibraryRouter } = require('./routes/library');
const { createActivityRouter } = require('./routes/activity');
const { createSearchesRouter } = require('./routes/searches');
const { createQueueRouter } = require('./routes/queue');
const { createMeRouter } = require('./routes/me');

// createApp(options) builds the whole server without starting it, so tests can use it.
function createApp(options = {}) {
  const config = { ...defaults, ...options };
  const store =
    options.store || new Store({ file: config.dataFile, persist: config.persist });
  const songs = createSongService({
    fetchImpl: options.fetchImpl || fetch,
    baseUrl: config.itunesUrl,
    cacheSize: config.cacheSize,
    cacheTtlMs: config.cacheTtlMs,
  });
  const auth = createAuth({ store, secret: config.jwtSecret });

  const app = express();
  app.set('trust proxy', 1);
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json({ limit: '4mb' })); // profile photos are sent as small base64 images

  // 300 requests a minute for everything, a tighter limit for password routes
  app.use('/api', createRateLimit({ windowMs: 60_000, max: config.generalLimit || 300 }));
  const authLimit = createRateLimit({ windowMs: 60_000, max: config.authLimit || 20 });

  // save the data file after any change that worked
  app.use((req, res, next) => {
    if (req.method !== 'GET') res.on('finish', () => res.statusCode < 400 && store.markDirty());
    next();
  });

  app.get('/api/health', (req, res) => res.json({ ok: true, users: store.byId.size }));
  app.use('/api/auth', createAuthRouter({ store, auth, secret: config.jwtSecret, tokenTtl: config.tokenTtl, rateLimit: authLimit }));
  app.use('/api/profile', createProfileRouter({ store, auth }));
  app.use('/api/songs', createSongsRouter({ songs }));
  app.use('/api/library', createLibraryRouter({ auth }));
  app.use('/api', createActivityRouter({ auth }));
  app.use('/api/searches', createSearchesRouter({ auth }));
  app.use('/api/queue', createQueueRouter({ auth }));
  app.use('/api/me', createMeRouter({ auth }));

  app.use(notFound);
  app.use(errorHandler);

  const sweep = setInterval(() => store.sweepRevoked(), 60 * 60 * 1000);
  sweep.unref();

  return { app, store, songs };
}

module.exports = { createApp };
