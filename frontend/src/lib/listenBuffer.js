// Listening time is counted every second, but sent to the backend in small batches.
import { enqueue, isSyncEnabled } from './sync';
import { localDateKey } from './format';

let pending = 0;
let date = null;

export function addListening(seconds) {
  if (!isSyncEnabled()) return;
  if (date === null) date = localDateKey();
  pending += seconds;
  if (pending >= 15) flushListening();
}

export function flushListening() {
  if (!isSyncEnabled() || pending <= 0) return Promise.resolve();
  const body = { seconds: pending, date };
  pending = 0;
  date = null;
  return enqueue('POST', '/stats/listen', body);
}

export function dropListening() {
  pending = 0;
  date = null;
}
