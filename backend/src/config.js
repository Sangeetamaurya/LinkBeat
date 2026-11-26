const fs = require('fs');
const path = require('path');

// read backend/.env (KEY=value lines) without any extra package; real environment variables win
try {
  const text = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && !line.trim().startsWith('#') && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
} catch (e) {
  // no .env file: defaults are used
}

module.exports = {
  port: Number(process.env.PORT) || 5000,
  jwtSecret: process.env.JWT_SECRET || 'dev-only-secret-change-me',
  tokenTtl: process.env.TOKEN_TTL || '7d',
  persist: process.env.PERSIST !== 'false',
  dataFile: process.env.DATA_FILE || path.join(__dirname, '..', 'data', 'store.json'),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  itunesUrl: 'https://itunes.apple.com/search',
  cacheSize: 300,
  cacheTtlMs: 10 * 60 * 1000,
};
