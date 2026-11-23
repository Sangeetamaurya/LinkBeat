import { Node } from './Node.js';

export class Queue {
  constructor() {
    this.front = null;
    this.rear = null;
    this.length = 0;
  }

  isEmpty() {
    return this.length === 0;
  }

  getSize() {
    return this.length;
  }

  enqueue(data) {
    const newNode = new Node(data);
    if (this.isEmpty()) {
      this.front = this.rear = newNode;
    } else {
      this.rear.next = newNode;
      newNode.prev = this.rear;
      this.rear = newNode;
    }
    this.length++;
    return this.length;
  }

  dequeue() {
    if (this.isEmpty()) return null;
    const data = this.front.data;
    this.front = this.front.next;
    if (this.front) {
      this.front.prev = null;
    } else {
      this.rear = null;
    }
    this.length--;
    return data;
  }

  peek() {
    return this.front ? this.front.data : null;
  }

  peekRear() {
    return this.rear ? this.rear.data : null;
  }

  clear() {
    this.front = this.rear = null;
    this.length = 0;
  }

  toArray() {
    const result = [];
    let current = this.front;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  searchById(id) {
    let current = this.front;
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
    let current = this.front;
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
    let current = this.front;
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

  removeById(id) {
    if (this.isEmpty()) return false;
    
    let current = this.front;
    while (current) {
      if (current.data.id === id) {
        if (current === this.front) {
          this.dequeue();
        } else if (current === this.rear) {
          this.rear = this.rear.prev;
          this.rear.next = null;
          this.length--;
        } else {
          current.prev.next = current.next;
          current.next.prev = current.prev;
          this.length--;
        }
        return true;
      }
      current = current.next;
    }
    return false;
  }

  clone() {
    const newQueue = new Queue();
    let current = this.front;
    while (current) {
      newQueue.enqueue(current.data);
      current = current.next;
    }
    return newQueue;
  }

  display() {
    console.log('Queue (front to rear):');
    let current = this.front;
    let index = 0;
    while (current) {
      console.log(`  [${index}] ${current.data.title} - ${current.data.artist}`);
      current = current.next;
      index++;
    }
  }
}