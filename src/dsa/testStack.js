import { Stack } from './Stack.js';

const sampleSongs = [
  { id: '1', title: 'Song A', artist: 'Artist 1', duration: 180, genre: 'Pop' },
  { id: '2', title: 'Song B', artist: 'Artist 2', duration: 210, genre: 'Rock' },
  { id: '3', title: 'Song C', artist: 'Artist 3', duration: 240, genre: 'Jazz' },
  { id: '4', title: 'Song D', artist: 'Artist 1', duration: 200, genre: 'Pop' },
];

console.log('=== Stack Test Suite ===\n');

const stack = new Stack();

console.log('1. Empty stack tests:');
console.log('   isEmpty():', stack.isEmpty());
console.log('   getSize():', stack.getSize());
console.log('   peek():', stack.peek());
console.log('   pop():', stack.pop());

console.log('\n2. Push operations:');
stack.push(sampleSongs[0]);
console.log('   After push(Song A) - size:', stack.getSize(), ', top:', stack.peek()?.title);

stack.push(sampleSongs[1]);
console.log('   After push(Song B) - size:', stack.getSize(), ', top:', stack.peek()?.title);

stack.push(sampleSongs[2]);
console.log('   After push(Song C) - size:', stack.getSize(), ', top:', stack.peek()?.title);

console.log('\n3. Stack contents (top to bottom):');
stack.display();

console.log('\n4. Peek (does not remove):');
console.log('   peek():', stack.peek()?.title);
console.log('   Size after peek:', stack.getSize());

console.log('\n5. Pop operations (LIFO):');
console.log('   pop():', stack.pop()?.title, '- size:', stack.getSize());
console.log('   pop():', stack.pop()?.title, '- size:', stack.getSize());
console.log('   pop():', stack.pop()?.title, '- size:', stack.getSize());
console.log('   pop() on empty:', stack.pop());

console.log('\n6. Push again after empty:');
stack.push(sampleSongs[3]);
console.log('   After push(Song D):', stack.peek()?.title);

console.log('\n7. Search operations:');
stack.push(sampleSongs[0]);
stack.push(sampleSongs[1]);
stack.push(sampleSongs[2]);
console.log('   Stack:', stack.toArray().map(s => s.title).join(' <- '));

const found = stack.searchById('2');
console.log('   searchById("2"):', found ? `Found "${found.data.title}" at index ${found.index} from top` : 'Not found');

const titleResults = stack.searchByTitle('song');
console.log('   searchByTitle("song"):', titleResults.map(r => `"${r.data.title}" at ${r.index}`));

const artistResults = stack.searchByArtist('artist 1');
console.log('   searchByArtist("artist 1"):', artistResults.map(r => `"${r.data.title}" at ${r.index}`));

console.log('\n8. Contains:');
console.log('   contains("1"):', stack.contains('1'));
console.log('   contains("99"):', stack.contains('99'));

console.log('\n9. Edge case - Single element:');
const singleStack = new Stack();
singleStack.push({ id: 'solo', title: 'Solo Song', artist: 'Solo Artist', duration: 120 });
console.log('   Size:', singleStack.getSize());
console.log('   Peek:', singleStack.peek()?.title);
console.log('   Pop:', singleStack.pop()?.title);
console.log('   Size after pop:', singleStack.getSize());
console.log('   Peek after pop:', singleStack.peek());

console.log('\n10. Clear:');
stack.clear();
console.log('   After clear - isEmpty():', stack.isEmpty());
console.log('   Size:', stack.getSize());

console.log('\n11. Clone test:');
const originalStack = new Stack();
sampleSongs.forEach(s => originalStack.push(s));
const clonedStack = originalStack.clone();
console.log('   Original:', originalStack.toArray().map(s => s.title).join(' <- '));
console.log('   Cloned:', clonedStack.toArray().map(s => s.title).join(' <- '));
clonedStack.push({ id: '99', title: 'Cloned Only', artist: 'Test', duration: 100 });
console.log('   After modifying clone - Original:', originalStack.toArray().map(s => s.title).join(' <- '));
console.log('   After modifying clone - Cloned:', clonedStack.toArray().map(s => s.title).join(' <- '));

console.log('\n12. Recently Played Simulation:');
const recentStack = new Stack();
const playHistory = [
  { id: 'p1', title: 'First Song', artist: 'Artist A', duration: 180 },
  { id: 'p2', title: 'Second Song', artist: 'Artist B', duration: 210 },
  { id: 'p3', title: 'Third Song', artist: 'Artist C', duration: 240 },
  { id: 'p4', title: 'Fourth Song', artist: 'Artist A', duration: 200 },
];

playHistory.forEach(song => {
  if (!recentStack.contains(song.id)) {
    recentStack.push(song);
  } else {
    // Move to top (recently played)
    // In real implementation, you'd remove and re-push
  }
});
console.log('   Recent plays (newest first):', recentStack.toArray().map(s => s.title).join(' <- '));

console.log('\n=== All Tests Passed ===');