// Circular Doubly Linked List = the play queue.
//
//   next of the last song is the first song, prev of the first song is the last song,
//   so "next" and "previous" never fall off the ends and each one is O(1).
//
// Shuffle uses Fisher-Yates and keeps the playing song first (same rule as the app).
// Turning shuffle off restores the original order.
const { shuffleWithFirst } = require('./shuffle');

class QNode {
  constructor(song) {
    this.song = song;
    this.prev = this;
    this.next = this;
  }
}

class PlayQueue {
  constructor() {
    this.head = null; // first node of the circle
    this.current = null; // node that is playing
    this.length = 0;
    this.shuffle = false;
    this.repeat = false;
    this.original = []; // songs in the order before shuffle
  }

  // build the circle from an array and put the pointer on `index`
  load(songs, index = 0, { shuffle = false, repeat = false, original = null } = {}) {
    this.head = null;
    this.current = null;
    this.length = 0;
    this.shuffle = shuffle;
    this.repeat = repeat;
    this.original = original ? original.slice() : songs.slice();

    let last = null;
    for (const song of songs) {
      const node = new QNode(song);
      if (!this.head) {
        this.head = node;
      } else {
        node.prev = last;
        last.next = node;
      }
      last = node;
      this.length++;
    }
    if (this.head) {
      last.next = this.head; // close the circle
      this.head.prev = last;
      this.current = this._nodeAt(Math.min(Math.max(index, 0), this.length - 1));
    }
    return this;
  }

  _nodeAt(i) {
    let n = this.head;
    for (let k = 0; k < i; k++) n = n.next;
    return n;
  }

  get currentIndex() {
    if (!this.current) return -1;
    let i = 0;
    for (let n = this.head; n !== this.current; n = n.next) i++;
    return i;
  }

  get currentSong() {
    return this.current ? this.current.song : null;
  }

  next() {
    if (!this.current) return null;
    this.current = this.current.next;
    return this.current.song;
  }

  prev() {
    if (!this.current) return null;
    this.current = this.current.prev;
    return this.current.song;
  }

  jump(index) {
    if (index < 0 || index >= this.length) return null;
    this.current = this._nodeAt(index);
    return this.current.song;
  }

  toArray() {
    const out = [];
    if (!this.head) return out;
    let n = this.head;
    do {
      out.push(n.song);
      n = n.next;
    } while (n !== this.head);
    return out;
  }

  toggleShuffle() {
    if (!this.current) return this;
    const playing = this.current.song;
    if (!this.shuffle) {
      const list = this.toArray();
      const shuffled = shuffleWithFirst(list, this.currentIndex);
      const opts = { shuffle: true, repeat: this.repeat, original: this.original };
      this.load(shuffled, 0, opts);
    } else {
      const original = this.original;
      const at = original.findIndex((s) => s.id === playing.id);
      this.load(original, at < 0 ? 0 : at, { shuffle: false, repeat: this.repeat });
    }
    return this;
  }

  toggleRepeat() {
    this.repeat = !this.repeat;
    return this.repeat;
  }

  // Sliding window over the circle: `size` nodes, playing song in the 2nd place when possible.
  window(size = 4) {
    const total = this.length;
    const index = this.currentIndex;
    if (total <= size) return { start: 0, end: total, songs: this.toArray() };
    const start = Math.max(0, Math.min(index - 1, total - size));
    const songs = [];
    let n = this._nodeAt(start);
    for (let k = 0; k < size; k++) {
      songs.push(n.song);
      n = n.next;
    }
    return { start, end: start + size, songs };
  }

  toJSON() {
    return {
      songs: this.toArray(),
      currentIndex: this.currentIndex,
      shuffle: this.shuffle,
      repeat: this.repeat,
      original: this.shuffle ? this.original : [],
    };
  }

  static fromJSON(data) {
    const q = new PlayQueue();
    if (data && Array.isArray(data.songs) && data.songs.length) {
      q.load(data.songs, data.currentIndex >= 0 ? data.currentIndex : 0, {
        shuffle: !!data.shuffle,
        repeat: !!data.repeat,
        original: data.shuffle && data.original && data.original.length ? data.original : null,
      });
    } else if (data) {
      q.repeat = !!data.repeat;
    }
    return q;
  }
}

module.exports = { PlayQueue };
