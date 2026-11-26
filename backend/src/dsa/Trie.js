// Trie (prefix tree) for search suggestions.
//   insert : O(length of word)      suggest(prefix) : O(length of prefix + size of the subtree)
// Each word keeps a weight (how many times it was seen) so popular words come first.
const { topK } = require('./MinHeap');

class TrieNode {
  constructor() {
    this.children = new Map();
    this.word = null; // the original text when a word ends here
    this.weight = 0;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
    this.size = 0;
  }

  insert(text, weight = 1) {
    const word = String(text || '').trim();
    if (!word) return;
    let node = this.root;
    for (const ch of word.toLowerCase()) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    if (node.word === null) this.size++;
    node.word = node.word || word;
    node.weight += weight;
  }

  suggest(prefix, limit = 8) {
    const p = String(prefix || '').trim().toLowerCase();
    if (!p) return [];
    let node = this.root;
    for (const ch of p) {
      node = node.children.get(ch);
      if (!node) return [];
    }
    const found = [];
    const stack = [node];
    while (stack.length) {
      const n = stack.pop();
      if (n.word !== null) found.push(n);
      for (const child of n.children.values()) stack.push(child);
    }
    return topK(found, limit, (n) => n.weight).map((n) => n.word);
  }
}

module.exports = { Trie };
