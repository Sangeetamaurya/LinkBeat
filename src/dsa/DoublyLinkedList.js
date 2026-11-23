import { Node } from './Node.js';

export class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
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
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.length++;
    return newNode;
  }

  insertAtEnd(data) {
    const newNode = new Node(data);
    if (this.isEmpty()) {
      this.head = this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
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

    if (node === this.head) {
      this.head = this.head.next;
      if (this.head) this.head.prev = null;
      else this.tail = null;
    } else if (node === this.tail) {
      this.tail = this.tail.prev;
      this.tail.next = null;
    } else {
      node.prev.next = node.next;
      node.next.prev = node.prev;
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
    let current = this.head;
    while (current) {
      if (current.data.id === id) {
        return this.deleteNode(current);
      }
      current = current.next;
    }
    return false;
  }

  searchById(id) {
    let current = this.head;
    let index = 0;
    while (current) {
      if (current.data.id === id) {
        return { node: current, index };
      }
      current = current.next;
      index++;
    }
    return null;
  }

  searchByTitle(title) {
    const results = [];
    let current = this.head;
    let index = 0;
    const searchTitle = title.toLowerCase();
    while (current) {
      if (current.data.title.toLowerCase().includes(searchTitle)) {
        results.push({ node: current, index });
      }
      current = current.next;
      index++;
    }
    return results;
  }

  searchByArtist(artist) {
    const results = [];
    let current = this.head;
    let index = 0;
    const searchArtist = artist.toLowerCase();
    while (current) {
      if (current.data.artist.toLowerCase().includes(searchArtist)) {
        results.push({ node: current, index });
      }
      current = current.next;
      index++;
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

  forwardTraversal() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  backwardTraversal() {
    const result = [];
    let current = this.tail;
    while (current) {
      result.push(current.data);
      current = current.prev;
    }
    return result;
  }

  getNext(node) {
    return node ? node.next : null;
  }

  getPrev(node) {
    return node ? node.prev : null;
  }

  getNextData(node) {
    const nextNode = this.getNext(node);
    return nextNode ? nextNode.data : null;
  }

  getPrevData(node) {
    const prevNode = this.getPrev(node);
    return prevNode ? prevNode.data : null;
  }

  getNextByIndex(index) {
    if (index < 0 || index >= this.length) return null;
    const nextIndex = (index + 1) % this.length;
    return this.getDataAt(nextIndex);
  }

  getPrevByIndex(index) {
    if (index < 0 || index >= this.length) return null;
    const prevIndex = (index - 1 + this.length) % this.length;
    return this.getDataAt(prevIndex);
  }

  toArray() {
    return this.forwardTraversal();
  }

  clear() {
    this.head = this.tail = null;
    this.length = 0;
  }

  clone() {
    const newList = new DoublyLinkedList();
    let current = this.head;
    while (current) {
      newList.insertAtEnd(current.data);
      current = current.next;
    }
    return newList;
  }
}