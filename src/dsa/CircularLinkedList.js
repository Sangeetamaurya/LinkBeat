import { Node } from './Node.js';

export class CircularLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
    this.current = null; // for iteration/playback position
  }

  isEmpty() {
    return this.length === 0;
  }

  getSize() {
    return this.length;
  }

  insertAtBeginning(data) {
    const newNode = new Node(data);
    if (this.isEmpty()) {
      this.head = this.tail = newNode;
      newNode.next = newNode;
      newNode.prev = newNode;
      this.current = newNode;
    } else {
      newNode.next = this.head;
      newNode.prev = this.tail;
      this.head.prev = newNode;
      this.tail.next = newNode;
      this.head = newNode;
    }
    this.length++;
    return newNode;
  }

  insertAtEnd(data) {
    const newNode = new Node(data);
    if (this.isEmpty()) {
      this.head = this.tail = newNode;
      newNode.next = newNode;
      newNode.prev = newNode;
      this.current = newNode;
    } else {
      newNode.next = this.head;
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.head.prev = newNode;
      this.tail = newNode;
    }
    this.length++;
    return newNode;
  }

  insertAtPosition(data, position) {
    if (position < 0 || position > this.length) {
      throw new Error('Invalid position');
    }
    if (position === 0) return this.insertAtBeginning(data);
    if (position === this.length) return this.insertAtEnd(data);

    const newNode = new Node(data);
    let current = this.head;
    for (let i = 0; i < position; i++) {
      current = current.next;
    }
    newNode.prev = current.prev;
    newNode.next = current;
    current.prev.next = newNode;
    current.prev = newNode;
    this.length++;
    return newNode;
  }

  deleteNode(node) {
    if (!node || this.isEmpty()) return false;

    if (this.length === 1) {
      this.head = this.tail = this.current = null;
    } else {
      node.prev.next = node.next;
      node.next.prev = node.prev;
      if (node === this.head) this.head = node.next;
      if (node === this.tail) this.tail = node.prev;
      if (node === this.current) this.current = node.next;
    }
    this.length--;
    return true;
  }

  deleteAtPosition(position) {
    if (position < 0 || position >= this.length) return false;
    const node = this.getNodeAt(position);
    return this.deleteNode(node);
  }

  deleteById(id) {
    if (this.isEmpty()) return false;
    let current = this.head;
    for (let i = 0; i < this.length; i++) {
      if (current.data.id === id) {
        return this.deleteNode(current);
      }
      current = current.next;
    }
    return false;
  }

  searchById(id) {
    if (this.isEmpty()) return null;
    let current = this.head;
    for (let i = 0; i < this.length; i++) {
      if (current.data.id === id) {
        return { node: current, index: i };
      }
      current = current.next;
    }
    return null;
  }

  searchByTitle(title) {
    const results = [];
    if (this.isEmpty()) return results;
    let current = this.head;
    const searchTitle = title.toLowerCase();
    for (let i = 0; i < this.length; i++) {
      if (current.data.title.toLowerCase().includes(searchTitle)) {
        results.push({ node: current, index: i });
      }
      current = current.next;
    }
    return results;
  }

  searchByArtist(artist) {
    const results = [];
    if (this.isEmpty()) return results;
    let current = this.head;
    const searchArtist = artist.toLowerCase();
    for (let i = 0; i < this.length; i++) {
      if (current.data.artist.toLowerCase().includes(searchArtist)) {
        results.push({ node: current, index: i });
      }
      current = current.next;
    }
    return results;
  }

  getNodeAt(position) {
    if (position < 0 || position >= this.length) return null;
    let current = this.head;
    for (let i = 0; i < position; i++) {
      current = current.next;
    }
    return current;
  }

  getDataAt(position) {
    const node = this.getNodeAt(position);
    return node ? node.data : null;
  }

  setCurrent(node) {
    if (!node) return false;
    let check = this.head;
    for (let i = 0; i < this.length; i++) {
      if (check === node) {
        this.current = node;
        return true;
      }
      check = check.next;
    }
    return false;
  }

  setCurrentByIndex(index) {
    const node = this.getNodeAt(index);
    if (node) {
      this.current = node;
      return true;
    }
    return false;
  }

  getCurrent() {
    return this.current ? this.current.data : null;
  }

  getCurrentNode() {
    return this.current;
  }

  next() {
    if (this.isEmpty() || !this.current) return null;
    this.current = this.current.next;
    return this.current.data;
  }

  prev() {
    if (this.isEmpty() || !this.current) return null;
    this.current = this.current.prev;
    return this.current.data;
  }

  nextFrom(node) {
    return node ? node.next.data : null;
  }

  prevFrom(node) {
    return node ? node.prev.data : null;
  }

  forwardTraversal() {
    const result = [];
    if (this.isEmpty()) return result;
    let current = this.head;
    for (let i = 0; i < this.length; i++) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  backwardTraversal() {
    const result = [];
    if (this.isEmpty()) return result;
    let current = this.tail;
    for (let i = 0; i < this.length; i++) {
      result.push(current.data);
      current = current.prev;
    }
    return result;
  }

  circularTraversal(startNode, steps) {
    const result = [];
    if (this.isEmpty() || !startNode) return result;
    let current = startNode;
    for (let i = 0; i < steps; i++) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  toArray() {
    return this.forwardTraversal();
  }

  clear() {
    this.head = this.tail = this.current = null;
    this.length = 0;
  }

  clone() {
    const newList = new CircularLinkedList();
    if (this.isEmpty()) return newList;
    let current = this.head;
    for (let i = 0; i < this.length; i++) {
      newList.insertAtEnd(current.data);
      current = current.next;
    }
    if (this.current) {
      const idx = this.getIndexOf(this.current);
      newList.setCurrentByIndex(idx);
    }
    return newList;
  }

  getIndexOf(node) {
    if (this.isEmpty() || !node) return -1;
    let current = this.head;
    for (let i = 0; i < this.length; i++) {
      if (current === node) return i;
      current = current.next;
    }
    return -1;
  }

  rotate(steps) {
    if (this.isEmpty() || !this.current) return;
    if (steps > 0) {
      for (let i = 0; i < steps; i++) this.current = this.current.next;
    } else {
      for (let i = 0; i < Math.abs(steps); i++) this.current = this.current.prev;
    }
  }
}