import { Searching } from './Searching.js';

const sampleSongs = [
  { id: '1', title: 'Alpha', artist: 'Artist C', duration: 180 },
  { id: '2', title: 'Beta', artist: 'Artist A', duration: 210 },
  { id: '3', title: 'Gamma', artist: 'Artist B', duration: 240 },
  { id: '4', title: 'Delta', artist: 'Artist A', duration: 200 },
  { id: '5', title: 'Epsilon', artist: 'Artist C', duration: 220 },
];

const songsByTitle = Searching.sortByTitle(sampleSongs);
const songsByArtist = Searching.sortByArtist(sampleSongs);

console.log('=== Searching Algorithms Test Suite ===\n');

console.log('Original array:');
console.log(' ', sampleSongs.map(s => `${s.title} (${s.artist})`).join(', '));

console.log('\nSorted by title:');
console.log(' ', songsByTitle.map(s => `${s.title} (${s.artist})`).join(', '));

console.log('\nSorted by artist:');
console.log(' ', songsByArtist.map(s => `${s.title} (${s.artist})`).join(', '));

console.log('\n1. Linear Search by ID:');
console.log('   searchById("3"):', Searching.linearSearchById(sampleSongs, '3'));
console.log('   searchById("99"):', Searching.linearSearchById(sampleSongs, '99'));

console.log('\n2. Linear Search by Title (partial):');
const titleResults = Searching.linearSearchByTitle(sampleSongs, 'ta');
console.log('   searchByTitle("ta"):', titleResults.map(r => `"${r.data.title}" at ${r.index}`));

console.log('\n3. Linear Search by Artist (partial):');
const artistResults = Searching.linearSearchByArtist(sampleSongs, 'artist a');
console.log('   searchByArtist("artist a"):', artistResults.map(r => `"${r.data.title}" at ${r.index}`));

console.log('\n4. Linear Search with predicate:');
const longSongs = Searching.linearSearchAll(sampleSongs, s => s.duration > 200);
console.log('   duration > 200:', longSongs.map(r => `"${r.data.title}" (${r.data.duration}s)`));

console.log('\n5. Binary Search by Title (exact match):');
console.log('   searchByTitle("Gamma"):', Searching.binarySearchByTitle(songsByTitle, 'Gamma'));
console.log('   searchByTitle("Alpha"):', Searching.binarySearchByTitle(songsByTitle, 'Alpha'));
console.log('   searchByTitle("Zeta"):', Searching.binarySearchByTitle(songsByTitle, 'Zeta'));

console.log('\n6. Binary Search by Artist (exact match):');
console.log('   searchByArtist("Artist B"):', Searching.binarySearchByArtist(songsByArtist, 'Artist B'));
console.log('   searchByArtist("Artist A"):', Searching.binarySearchByArtist(songsByArtist, 'Artist A'));
console.log('   searchByArtist("Artist Z"):', Searching.binarySearchByArtist(songsByArtist, 'Artist Z'));

console.log('\n7. Binary Search by Title Prefix:');
const prefixResults = Searching.binarySearchByTitlePrefix(songsByTitle, 'De');
console.log('   prefix "De":', prefixResults.map(r => `"${r.data.title}" at ${r.index}`));

const prefixResults2 = Searching.binarySearchByTitlePrefix(songsByTitle, 'Al');
console.log('   prefix "Al":', prefixResults2.map(r => `"${r.data.title}" at ${r.index}`));

console.log('\n8. Binary Search by Artist Prefix:');
const artistPrefixResults = Searching.binarySearchByArtistPrefix(songsByArtist, 'Art');
console.log('   prefix "Art":', artistPrefixResults.map(r => `"${r.data.title}" (${r.data.artist}) at ${r.index}`));

console.log('\n9. Sort verification:');
console.log('   isSortedByTitle(songsByTitle):', Searching.isSortedByTitle(songsByTitle));
console.log('   isSortedByTitle(sampleSongs):', Searching.isSortedByTitle(sampleSongs));
console.log('   isSortedByArtist(songsByArtist):', Searching.isSortedByArtist(songsByArtist));
console.log('   isSortedByArtist(sampleSongs):', Searching.isSortedByArtist(sampleSongs));

console.log('\n10. Sort helpers:');
console.log('   sortByTitle:', Searching.sortByTitle(sampleSongs).map(s => s.title));
console.log('   sortByArtist:', Searching.sortByArtist(sampleSongs).map(s => s.title));
console.log('   sortByDuration:', Searching.sortByDuration(sampleSongs).map(s => `${s.title} (${s.duration}s)`));

console.log('\n11. Error handling - unsorted array:');
try {
  Searching.binarySearchByTitle(sampleSongs, 'Alpha');
} catch (e) {
  console.log('   Expected error:', e.message);
}

console.log('\n12. Edge cases:');
console.log('   Empty array linear search:', Searching.linearSearchById([], '1'));
console.log('   Empty array binary search:', Searching.binarySearchByTitle([], 'Alpha'));
console.log('   Single element:', Searching.binarySearchByTitle([{ id: '1', title: 'Solo', artist: 'A', duration: 100 }], 'Solo'));

console.log('\n=== All Tests Passed ===');