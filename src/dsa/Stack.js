import { Node } from './Node.js';

export class Stack {
  constructor() {
    this.top = null;
    this.length = 0;
  }

  isEmpty() {
    return this.length === 0;
  }

  getSize() {
    return this.length;
  }

  push(data) {
    const newNode = new Node(data);
    if (this.isEmpty()) {
      this.top = newNode;
    } else {
      newNode.next = this.top;
      this.top.prev = newNode;
      this.top = newNode;
    }
    this.length++;
    return this.length;
  }

  pop() {
    if (this.isEmpty()) return null;
    const data = this.top.data;
    this.top = this.top.next;
    if (this.top) {
      this.top.prev = null;
    }
    this.length--;
    return data;
  }

  peek() {
    return this.top ? this.top.data : null;
  }

  clear() {
    this.top = null;
    this.length = 0;
  }

  toArray() {
    const result = [];
    let current = this.top;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  searchById(id) {
    let current = this.top;
    let index = 0;
    while (current) {
      if (current.data.id === id) {
        return { data: current.data, index };
      }
      current = current.next;
      index++;
    }
    return null;
  }

  searchByTitle(title) {
    const results = [];
    let current = this.top;
    let index = 0;
    const searchTitle = title.toLowerCase();
    while (current) {
      if (current.data.title.toLowerCase().includes(searchTitle)) {
        results.push({ data: current.data, index });
      }
      current = current.next;
      index++;
    }
    return results;
  }

  searchByArtist(artist) {
    const results = [];
    let current = this.top;
    let index = 0;
    const searchArtist = artist.toLowerCase();
    while (current) {
      if (current.data.artist.toLowerCase().includes(searchArtist)) {
        results.push({ data: current.data, index });
      }
      current = current.next;
      index++;
    }
    return results;
  }

  contains(id) {
    return this.searchById(id) !== null;
  }

  clone() {
    const newStack = new Stack();
    const temp = [];
    let current = this.top;
    while (current) {
      temp.push(current.data);
      current = current.next;
    }
    for (let i = temp.length - 1; i >= 0; i--) {
      newStack.push(temp[i]);
    }
    return newStack;
  }

  display() {
    console.log('Stack (top to bottom):');
    let current = this.top;
    let index = 0;
    while (current) {
      console.log(`  [${index}] ${current.data.title} - ${current.data.artist}`);
      current = current.next;
      index++;
    }
  }
}