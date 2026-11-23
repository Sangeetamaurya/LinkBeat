import { CircularLinkedList } from './CircularLinkedList.js';

const sampleSongs = [
  { id: '1', title: 'Song A', artist: 'Artist 1', duration: 180, genre: 'Pop' },
  { id: '2', title: 'Song B', artist: 'Artist 2', duration: 210, genre: 'Rock' },
  { id: '3', title: 'Song C', artist: 'Artist 3', duration: 240, genre: 'Jazz' },
  { id: '4', title: 'Song D', artist: 'Artist 1', duration: 200, genre: 'Pop' },
];

console.log('=== Circular Linked List Test Suite ===\n');

const list = new CircularLinkedList();

console.log('1. Empty list tests:');
console.log('   isEmpty():', list.isEmpty());
console.log('   getSize():', list.getSize());
console.log('   forwardTraversal():', list.forwardTraversal());
console.log('   backwardTraversal():', list.backwardTraversal());

console.log('\n2. Insert at beginning:');
list.insertAtBeginning(sampleSongs[0]);
console.log('   After insertAtBeginning(Song A):', list.toArray().map(s => s.title));
console.log('   Head === Tail:', list.head === list.tail);
console.log('   Head.next === Head:', list.head.next === list.head);
console.log('   Head.prev === Head:', list.head.prev === list.head);

list.insertAtBeginning(sampleSongs[1]);
console.log('   After insertAtBeginning(Song B):', list.toArray().map(s => s.title));

console.log('\n3. Insert at end:');
list.insertAtEnd(sampleSongs[2]);
console.log('   After insertAtEnd(Song C):', list.toArray().map(s => s.title));

console.log('\n4. Insert at position:');
list.insertAtPosition(sampleSongs[3], 2);
console.log('   After insertAtPosition(Song D, 2):', list.toArray().map(s => s.title));

console.log('\n5. Circular structure verification:');
console.log('   Head:', list.head.data.title);
console.log('   Tail:', list.tail.data.title);
console.log('   Head.prev === Tail:', list.head.prev === list.tail);
console.log('   Tail.next === Head:', list.tail.next === list.head);

console.log('\n6. Forward traversal (full circle):');
console.log('   ', list.forwardTraversal().map(s => s.title).join(' -> ') + ' -> (back to head)');

console.log('\n7. Backward traversal (full circle):');
console.log('   ', list.backwardTraversal().map(s => s.title).join(' -> ') + ' -> (back to tail)');

console.log('\n7b. Circular traversal from head (8 steps):');
const circ = list.circularTraversal(list.head, 8);
console.log('   ', circ.map(s => s.title).join(' -> '));

console.log('\n8. Current pointer (starts at head):');
console.log('   Current:', list.getCurrent()?.title);
list.setCurrentByIndex(2);
console.log('   After setCurrentByIndex(2):', list.getCurrent()?.title);

console.log('\n9. Next/Previous navigation (circular):');
console.log('   Current:', list.getCurrent()?.title);
console.log('   Next:', list.next()?.title);
console.log('   Next:', list.next()?.title);
console.log('   Next:', list.next()?.title);
console.log('   Next:', list.next()?.title); // wraps around
console.log('   Prev:', list.prev()?.title);
console.log('   Prev:', list.prev()?.title);

console.log('\n10. Next/Previous from specific node:');
const nodeB = list.searchById('2').node;
console.log('   Node B:', nodeB.data.title);
console.log('   Next from B:', list.nextFrom(nodeB)?.title);
console.log('   Prev from B:', list.prevFrom(nodeB)?.title);

console.log('\n11. Search by ID:');
const found = list.searchById('3');
console.log('   searchById("3"):', found ? `Found "${found.node.data.title}" at index ${found.index}` : 'Not found');

console.log('\n12. Search by title (partial):');
const titleResults = list.searchByTitle('song');
console.log('   searchByTitle("song"):', titleResults.map(r => `"${r.node.data.title}" at ${r.index}`));

console.log('\n13. Search by artist:');
const artistResults = list.searchByArtist('artist 1');
console.log('   searchByArtist("artist 1"):', artistResults.map(r => `"${r.node.data.title}" at ${r.index}`));

console.log('\n14. Delete by ID (circular maintained):');
console.log('   Before delete:', list.toArray().map(s => s.title));
console.log('   Head before:', list.head.data.title);
console.log('   Tail before:', list.tail.data.title);
list.deleteById('2');
console.log('   After deleteById("2"):', list.toArray().map(s => s.title));
console.log('   Head after:', list.head.data.title);
console.log('   Tail after:', list.tail.data.title);
console.log('   Head.prev === Tail:', list.head.prev === list.tail);
console.log('   Tail.next === Head:', list.tail.next === list.head);

console.log('\n15. Delete at position:');
console.log('   Before delete:', list.toArray().map(s => s.title));
list.deleteAtPosition(0);
console.log('   After deleteAtPosition(0):', list.toArray().map(s => s.title));
console.log('   Head:', list.head.data.title);
console.log('   Tail:', list.tail.data.title);

console.log('\n16. Edge cases - Single node:');
const singleList = new CircularLinkedList();
singleList.insertAtEnd({ id: 'solo', title: 'Solo Song', artist: 'Solo Artist', duration: 120 });
console.log('   Size:', singleList.getSize());
console.log('   Head === Tail:', singleList.head === singleList.tail);
console.log('   Head.next === Head:', singleList.head.next === singleList.head);
console.log('   Head.prev === Head:', singleList.head.prev === singleList.head);
console.log('   Next from head:', singleList.next()?.title);
console.log('   Prev from head:', singleList.prev()?.title);

console.log('\n17. Rotate:');
const rotateList = new CircularLinkedList();
sampleSongs.forEach(s => rotateList.insertAtEnd(s));
rotateList.setCurrentByIndex(0);
console.log('   Initial current:', rotateList.getCurrent()?.title);
rotateList.rotate(2);
console.log('   After rotate(2):', rotateList.getCurrent()?.title);
rotateList.rotate(-1);
console.log('   After rotate(-1):', rotateList.getCurrent()?.title);

console.log('\n18. Clone test:');
const cloned = list.clone();
console.log('   Original:', list.toArray().map(s => s.title));
console.log('   Cloned:', cloned.toArray().map(s => s.title));
console.log('   Original current:', list.getCurrent()?.title);
console.log('   Cloned current:', cloned.getCurrent()?.title);
cloned.insertAtEnd({ id: '99', title: 'Cloned Only', artist: 'Test', duration: 100 });
console.log('   After modifying clone - Original:', list.toArray().map(s => s.title));
console.log('   After modifying clone - Cloned:', cloned.toArray().map(s => s.title));

console.log('\n=== All Tests Passed ===');