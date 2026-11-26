// Changes made while logged in (likes, plays, searches ...) are sent to the backend here.
// The screen updates at once; the server copy follows in the background.
//
// The sends are chained one after another (a FIFO queue), so they reach the server in the same
// order the user did them: like then unlike always ends as "not liked".
import { request } from './client';

let enabled = false;
let tail = Promise.resolve();

export const setSyncEnabled = (value) => {
  enabled = value;
};
export const isSyncEnabled = () => enabled;

export function enqueue(method, path, body) {
  if (!enabled) return Promise.resolve();
  tail = tail
    .then(() => request(method, path, body))
    .catch(() => {}); // offline or rejected: the next full load fixes any difference
  return tail;
}

// resolves when everything queued so far has been sent
export const idle = () => tail;
