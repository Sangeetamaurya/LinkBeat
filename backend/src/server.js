const config = require('./config');
const { createApp } = require('./app');

if (config.jwtSecret === 'dev-only-secret-change-me') {
  console.warn('Warning: using the default JWT_SECRET. Set JWT_SECRET in .env before real use.');
}

const { app, store } = createApp();
const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`LinkBeat backend running on http://localhost:${config.port}/api`);
});

function shutdown() {
  store.save(); // write the data file one last time
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 2000).unref();
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
