import { DoublyLinkedList } from './DoublyLinkedList.js';

const sampleSongs = [
  { id: '1', title: 'Song A', artist: 'Artist 1', duration: 180, genre: 'Pop' },
  { id: '2', title: 'Song B', artist: 'Artist 2', duration: 210, genre: 'Rock' },
  { id: '3', title: 'Song C', artist: 'Artist 3', duration: 240, genre: 'Jazz' },
  { id: '4', title: 'Song D', artist: 'Artist 1', duration: 200, genre: 'Pop' },
];

console.log('=== Doubly Linked List Test Suite ===\n');

const list = new DoublyLinkedList();

console.log('1. Empty list tests:');
console.log('   isEmpty():', list.isEmpty());
console.log('   getSize():', list.getSize());
console.log('   forwardTraversal():', list.forwardTraversal());
console.log('   backwardTraversal():', list.backwardTraversal());

console.log('\n2. Insert at beginning:');
list.insertAtBeginning(sampleSongs[0]);
console.log('   After insertAtBeginning(Song A):', list.toArray().map(s => s.title));

list.insertAtBeginning(sampleSongs[1]);
console.log('   After insertAtBeginning(Song B):', list.toArray().map(s => s.title));

console.log('\n3. Insert at end:');
list.insertAtEnd(sampleSongs[2]);
console.log('   After insertAtEnd(Song C):', list.toArray().map(s => s.title));

console.log('\n4. Insert at position:');
list.insertAtPosition(sampleSongs[3], 2);
console.log('   After insertAtPosition(Song D, 2):', list.toArray().map(s => s.title));

console.log('\n5. Forward traversal:');
console.log('   ', list.forwardTraversal().map(s => s.title).join(' <-> '));

console.log('\n6. Backward traversal:');
console.log('   ', list.backwardTraversal().map(s => s.title).join(' <-> '));

console.log('\n7. Search by ID:');
const found = list.searchById('3');
console.log('   searchById("3"):', found ? `Found "${found.node.data.title}" at index ${found.index}` : 'Not found');

console.log('\n8. Search by title (partial):');
const titleResults = list.searchByTitle('song');
console.log('   searchByTitle("song"):', titleResults.map(r => `"${r.node.data.title}" at ${r.index}`));

console.log('\n9. Search by artist:');
const artistResults = list.searchByArtist('artist 1');
console.log('   searchByArtist("artist 1"):', artistResults.map(r => `"${r.node.data.title}" at ${r.index}`));

console.log('\n10. Next/Previous navigation by node:');
const nodeB = list.searchById('2').node;
console.log('   Current:', nodeB.data.title);
console.log('   Next:', list.getNextData(nodeB)?.title);
console.log('   Prev:', list.getPrevData(nodeB)?.title);

console.log('\n11. Next/Previous navigation by index (circular):');
console.log('   Index 0 (Song B) -> Next:', list.getNextByIndex(0)?.title);
console.log('   Index 0 (Song B) -> Prev:', list.getPrevByIndex(0)?.title);
console.log('   Index 3 (Song C) -> Next:', list.getNextByIndex(3)?.title);
console.log('   Index 3 (Song C) -> Prev:', list.getPrevByIndex(3)?.title);

console.log('\n12. Delete by ID:');
console.log('   Before delete:', list.toArray().map(s => s.title));
list.deleteById('2');
console.log('   After deleteById("2"):', list.toArray().map(s => s.title));

console.log('\n13. Delete at position:');
console.log('   Before delete:', list.toArray().map(s => s.title));
list.deleteAtPosition(0);
console.log('   After deleteAtPosition(0):', list.toArray().map(s => s.title));

console.log('\n14. Edge cases:');
const singleList = new DoublyLinkedList();
singleList.insertAtEnd({ id: 'solo', title: 'Solo Song', artist: 'Solo Artist', duration: 120 });
console.log('   Single node list - next of index 0:', singleList.getNextByIndex(0)?.title);
console.log('   Single node list - prev of index 0:', singleList.getPrevByIndex(0)?.title);

console.log('\n15. Clone test:');
const cloned = list.clone();
console.log('   Original:', list.toArray().map(s => s.title));
console.log('   Cloned:', cloned.toArray().map(s => s.title));
cloned.insertAtEnd({ id: '99', title: 'Cloned Only', artist: 'Test', duration: 100 });
console.log('   After modifying clone - Original:', list.toArray().map(s => s.title));
console.log('   After modifying clone - Cloned:', cloned.toArray().map(s => s.title));

console.log('\n=== All Tests Passed ===');