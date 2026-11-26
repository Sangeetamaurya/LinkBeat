// Rate limiter = a FIFO queue of timestamps per key (sliding window).
// Old timestamps are dequeued from the front, new ones are enqueued at the back.
// Each request is O(1) amortized.
class SlidingWindowLimiter {
  constructor({ windowMs = 60000, max = 120, now = Date.now } = {}) {
    this.windowMs = windowMs;
    this.max = max;
    this.now = now;
    this.hits = new Map(); // key -> { times: [], start: index of the queue front }
  }

  // returns { allowed, remaining, retryAfterMs }
  take(key) {
    const t = this.now();
    let q = this.hits.get(key);
    if (!q) {
      q = { times: [], start: 0 };
      this.hits.set(key, q);
    }
    // dequeue everything that left the window
    while (q.start < q.times.length && t - q.times[q.start] >= this.windowMs) q.start++;
    // compact the array now and then so it does not grow forever
    if (q.start > 64 && q.start * 2 > q.times.length) {
      q.times = q.times.slice(q.start);
      q.start = 0;
    }

    const used = q.times.length - q.start;
    if (used >= this.max) {
      return { allowed: false, remaining: 0, retryAfterMs: this.windowMs - (t - q.times[q.start]) };
    }
    q.times.push(t);
    return { allowed: true, remaining: this.max - used - 1, retryAfterMs: 0 };
  }

  // drop keys that have no recent hits (called from a timer)
  sweep() {
    const t = this.now();
    for (const [key, q] of this.hits) {
      const last = q.times[q.times.length - 1];
      if (last === undefined || t - last >= this.windowMs) this.hits.delete(key);
    }
  }
}

module.exports = { SlidingWindowLimiter };
