// All data lives here, in memory, in data structures. There is no database.
// Optionally the whole store is saved to one json file so it survives a restart.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { LinkedHashMap } = require('./dsa/LinkedHashMap');
const { PlayQueue } = require('./dsa/PlayQueue');

const HISTORY_MAX = 50;
const RECENTS_MAX = 6;

// Everything that belongs to one user.
class UserData {
  constructor(account) {
    this.account = account; // { id, name, username, passwordHash, genres, avatar, createdAt }
    this.liked = new LinkedHashMap(); // songId -> song (newest like first)
    this.history = new LinkedHashMap({ capacity: HISTORY_MAX }); // songId -> song (newest play first)
    this.recents = new LinkedHashMap({ capacity: RECENTS_MAX }); // lowercase term -> term
    this.playCounts = new Map(); // songId -> { song, count }
    this.listenByDate = new Map(); // 'YYYY-MM-DD' -> seconds
    this.queue = new PlayQueue();
  }

  toJSON() {
    return {
      account: this.account,
      liked: this.liked.values(),
      history: this.history.values(),
      recents: this.recents.values(),
      playCounts: [...this.playCounts.values()],
      listenByDate: Object.fromEntries(this.listenByDate),
      queue: this.queue.toJSON(),
    };
  }

  static fromJSON(data) {
    const u = new UserData(data.account);
    // values were saved newest first, so insert oldest first to rebuild the same order
    for (const s of [...(data.liked || [])].reverse()) u.liked.set(s.id, s);
    for (const s of [...(data.history || [])].reverse()) u.history.set(s.id, s);
    for (const t of [...(data.recents || [])].reverse()) u.recents.set(t.toLowerCase(), t);
    for (const p of data.playCounts || []) u.playCounts.set(p.song.id, p);
    for (const [d, sec] of Object.entries(data.listenByDate || {})) u.listenByDate.set(d, sec);
    u.queue = PlayQueue.fromJSON(data.queue);
    return u;
  }
}

class Store {
  constructor({ file = null, persist = false } = {}) {
    this.file = file;
    this.persist = persist && !!file;
    this.byId = new Map(); // user id -> UserData
    this.byUsername = new Map(); // username (lowercase) -> UserData   (hash index for O(1) login)
    this.revoked = new Map(); // logged-out token id -> expiry (ms)
    this.saveTimer = null;
    if (this.persist) this.load();
  }

  // ---- users ----
  createUser({ name, username, passwordHash }) {
    const account = {
      id: crypto.randomUUID(),
      name,
      username: username.toLowerCase(),
      passwordHash,
      genres: [],
      avatar: '',
      createdAt: new Date().toISOString(),
    };
    const user = new UserData(account);
    this.byId.set(account.id, user);
    this.byUsername.set(account.username, user);
    this.markDirty();
    return user;
  }

  findByUsername(username) {
    return this.byUsername.get(String(username || '').trim().toLowerCase()) || null;
  }

  findById(id) {
    return this.byId.get(id) || null;
  }

  isUsernameTaken(username, exceptId = null) {
    const found = this.findByUsername(username);
    return !!found && found.account.id !== exceptId;
  }

  renameUser(user, newUsername) {
    const next = newUsername.trim().toLowerCase();
    if (next === user.account.username) return;
    this.byUsername.delete(user.account.username);
    user.account.username = next;
    this.byUsername.set(next, user);
  }

  deleteUser(user) {
    this.byId.delete(user.account.id);
    this.byUsername.delete(user.account.username);
    this.markDirty();
  }

  // ---- logged out tokens ----
  revokeToken(jti, expiresAtMs) {
    this.revoked.set(jti, expiresAtMs);
  }

  isRevoked(jti) {
    return this.revoked.has(jti);
  }

  sweepRevoked() {
    const now = Date.now();
    for (const [jti, exp] of this.revoked) if (exp <= now) this.revoked.delete(jti);
  }

  // ---- saving to a json file (optional) ----
  markDirty() {
    if (!this.persist || this.saveTimer) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      this.save();
    }, 500);
    this.saveTimer.unref();
  }

  save() {
    if (!this.persist) return;
    try {
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      const data = { users: [...this.byId.values()].map((u) => u.toJSON()) };
      const tmp = this.file + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(data));
      fs.renameSync(tmp, this.file); // write the new file first, then swap, so a crash never leaves half a file
    } catch (err) {
      console.error('Could not save data file:', err.message);
    }
  }

  load() {
    try {
      if (!fs.existsSync(this.file)) return;
      const data = JSON.parse(fs.readFileSync(this.file, 'utf8'));
      for (const raw of data.users || []) {
        const u = UserData.fromJSON(raw);
        this.byId.set(u.account.id, u);
        this.byUsername.set(u.account.username, u);
      }
      console.log(`Loaded ${this.byId.size} user(s) from ${this.file}`);
    } catch (err) {
      console.error('Could not read data file, starting empty:', err.message);
    }
  }
}

module.exports = { Store, UserData, HISTORY_MAX, RECENTS_MAX };
