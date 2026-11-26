const { SlidingWindowLimiter } = require('../dsa/SlidingWindowLimiter');

function createRateLimit({ windowMs, max, keyOf = (req) => req.ip }) {
  const limiter = new SlidingWindowLimiter({ windowMs, max });
  const timer = setInterval(() => limiter.sweep(), windowMs * 2);
  timer.unref();

  return (req, res, next) => {
    const result = limiter.take(keyOf(req));
    res.setHeader('X-RateLimit-Remaining', String(result.remaining));
    if (!result.allowed) {
      res.setHeader('Retry-After', String(Math.ceil(result.retryAfterMs / 1000)));
      return res.status(429).json({ error: 'Too many requests, slow down a little' });
    }
    next();
  };
}

module.exports = { createRateLimit };
