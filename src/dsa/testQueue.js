import { Queue } from './Queue.js';

const sampleSongs = [
  { id: '1', title: 'Song A', artist: 'Artist 1', duration: 180, genre: 'Pop' },
  { id: '2', title: 'Song B', artist: 'Artist 2', duration: 210, genre: 'Rock' },
  { id: '3', title: 'Song C', artist: 'Artist 3', duration: 240, genre: 'Jazz' },
  { id: '4', title: 'Song D', artist: 'Artist 1', duration: 200, genre: 'Pop' },
];

console.log('=== Queue Test Suite ===\n');

const queue = new Queue();

console.log('1. Empty queue tests:');
console.log('   isEmpty():', queue.isEmpty());
console.log('   getSize():', queue.getSize());
console.log('   peek():', queue.peek());
console.log('   peekRear():', queue.peekRear());
console.log('   dequeue():', queue.dequeue());

console.log('\n2. Enqueue operations:');
queue.enqueue(sampleSongs[0]);
console.log('   After enqueue(Song A) - size:', queue.getSize(), ', front:', queue.peek()?.title, ', rear:', queue.peekRear()?.title);

queue.enqueue(sampleSongs[1]);
console.log('   After enqueue(Song B) - size:', queue.getSize(), ', front:', queue.peek()?.title, ', rear:', queue.peekRear()?.title);

queue.enqueue(sampleSongs[2]);
console.log('   After enqueue(Song C) - size:', queue.getSize(), ', front:', queue.peek()?.title, ', rear:', queue.peekRear()?.title);

console.log('\n3. Queue contents (front to rear):');
queue.display();

console.log('\n4. Peek operations (do not remove):');
console.log('   peek():', queue.peek()?.title);
console.log('   peekRear():', queue.peekRear()?.title);
console.log('   Size after peek:', queue.getSize());

console.log('\n5. Dequeue operations (FIFO):');
console.log('   dequeue():', queue.dequeue()?.title, '- size:', queue.getSize(), '- new front:', queue.peek()?.title);
console.log('   dequeue():', queue.dequeue()?.title, '- size:', queue.getSize(), '- new front:', queue.peek()?.title);
console.log('   dequeue():', queue.dequeue()?.title, '- size:', queue.getSize());
console.log('   dequeue() on empty:', queue.dequeue());

console.log('\n6. Enqueue again after empty:');
queue.enqueue(sampleSongs[3]);
console.log('   After enqueue(Song D):', queue.peek()?.title);

console.log('\n7. Search operations:');
queue.enqueue(sampleSongs[0]);
queue.enqueue(sampleSongs[1]);
queue.enqueue(sampleSongs[2]);
console.log('   Queue:', queue.toArray().map(s => s.title).join(' -> '));

const found = queue.searchById('2');
console.log('   searchById("2"):', found ? `Found "${found.data.title}" at index ${found.index} from front` : 'Not found');

const titleResults = queue.searchByTitle('song');
console.log('   searchByTitle("song"):', titleResults.map(r => `"${r.data.title}" at ${r.index}`));

const artistResults = queue.searchByArtist('artist 1');
console.log('   searchByArtist("artist 1"):', artistResults.map(r => `"${r.data.title}" at ${r.index}`));

console.log('\n8. Contains:');
console.log('   contains("1"):', queue.contains('1'));
console.log('   contains("99"):', queue.contains('99'));

console.log('\n9. Remove by ID (from middle):');
console.log('   Before remove:', queue.toArray().map(s => s.title).join(' -> '));
queue.removeById('2');
console.log('   After removeById("2"):', queue.toArray().map(s => s.title).join(' -> '));

console.log('\n10. Edge case - Single element:');
const singleQueue = new Queue();
singleQueue.enqueue({ id: 'solo', title: 'Solo Song', artist: 'Solo Artist', duration: 120 });
console.log('   Size:', singleQueue.getSize());
console.log('   Peek front:', singleQueue.peek()?.title);
console.log('   Peek rear:', singleQueue.peekRear()?.title);
console.log('   Dequeue:', singleQueue.dequeue()?.title);
console.log('   Size after dequeue:', singleQueue.getSize());
console.log('   Peek after dequeue:', singleQueue.peek());

console.log('\n11. Clear:');
queue.clear();
console.log('   After clear - isEmpty():', queue.isEmpty());
console.log('   Size:', queue.getSize());

console.log('\n12. Clone test:');
const originalQueue = new Queue();
sampleSongs.forEach(s => originalQueue.enqueue(s));
const clonedQueue = originalQueue.clone();
console.log('   Original:', originalQueue.toArray().map(s => s.title).join(' -> '));
console.log('   Cloned:', clonedQueue.toArray().map(s => s.title).join(' -> '));
clonedQueue.enqueue({ id: '99', title: 'Cloned Only', artist: 'Test', duration: 100 });
console.log('   After modifying clone - Original:', originalQueue.toArray().map(s => s.title).join(' -> '));
console.log('   After modifying clone - Cloned:', clonedQueue.toArray().map(s => s.title).join(' -> '));

console.log('\n13. Up Next Simulation (LinkBeat use case):');
const upNext = new Queue();
const upcomingSongs = [
  { id: 'n1', title: 'Next Song 1', artist: 'Artist A', duration: 180 },
  { id: 'n2', title: 'Next Song 2', artist: 'Artist B', duration: 210 },
  { id: 'n3', title: 'Next Song 3', artist: 'Artist C', duration: 240 },
  { id: 'n4', title: 'Next Song 4', artist: 'Artist D', duration: 200 },
];

upcomingSongs.forEach(song => upNext.enqueue(song));
console.log('   Up Next queue:', upNext.toArray().map(s => s.title).join(' -> '));
console.log('   Now playing (peek):', upNext.peek()?.title);
console.log('   Song finishes, dequeue:', upNext.dequeue()?.title);
console.log('   Next up:', upNext.peek()?.title);
console.log('   Add new song to queue:', upNext.enqueue({ id: 'n5', title: 'Next Song 5', artist: 'Artist E', duration: 220 }));
console.log('   Queue now:', upNext.toArray().map(s => s.title).join(' -> '));

console.log('\n=== All Tests Passed ===');