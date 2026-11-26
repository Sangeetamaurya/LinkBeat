// Hash Map + Doubly Linked List  (the classic "LRU cache" structure).
//
//   Map  : key -> node            => find / delete any item in O(1)
//   List : head (newest) <-> ... <-> tail (oldest)   => move-to-front and evict-oldest in O(1)
//
// Used for: iTunes response cache, liked songs, listening history, recent searches.
class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LinkedHashMap {
  constructor({ capacity = Infinity } = {}) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = null; // newest
    this.tail = null; // oldest
  }

  get size() {
    return this.map.size;
  }

  has(key) {
    return this.map.has(key);
  }

  // read without changing the order
  peek(key) {
    const node = this.map.get(key);
    return node ? node.value : undefined;
  }

  // read and mark as most recently used
  get(key) {
    const node = this.map.get(key);
    if (!node) return undefined;
    this._unlink(node);
    this._pushFront(node);
    return node.value;
  }

  // insert (or update) and move to the front. Returns the evicted entry, if any.
  set(key, value) {
    let node = this.map.get(key);
    if (node) {
      node.value = value;
      this._unlink(node);
    } else {
      node = new Node(key, value);
      this.map.set(key, node);
    }
    this._pushFront(node);

    if (this.map.size > this.capacity) {
      const old = this.tail;
      this._unlink(old);
      this.map.delete(old.key);
      return { key: old.key, value: old.value };
    }
    return null;
  }

  delete(key) {
    const node = this.map.get(key);
    if (!node) return false;
    this._unlink(node);
    this.map.delete(key);
    return true;
  }

  clear() {
    this.map.clear();
    this.head = null;
    this.tail = null;
  }

  // newest first
  values() {
    const out = [];
    for (let n = this.head; n; n = n.next) out.push(n.value);
    return out;
  }

  keys() {
    const out = [];
    for (let n = this.head; n; n = n.next) out.push(n.key);
    return out;
  }

  _pushFront(node) {
    node.prev = null;
    node.next = this.head;
    if (this.head) this.head.prev = node;
    this.head = node;
    if (!this.tail) this.tail = node;
  }

  _unlink(node) {
    if (node.prev) node.prev.next = node.next;
    else this.head = node.next;
    if (node.next) node.next.prev = node.prev;
    else this.tail = node.prev;
    node.prev = null;
    node.next = null;
  }
}

module.exports = { LinkedHashMap };
