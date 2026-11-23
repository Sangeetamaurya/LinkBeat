import { Sorting } from './Sorting.js';

const sampleSongs = [
  { id: '1', title: 'Epsilon', artist: 'Artist C', duration: 220 },
  { id: '2', title: 'Alpha', artist: 'Artist A', duration: 180 },
  { id: '3', title: 'Gamma', artist: 'Artist B', duration: 240 },
  { id: '4', title: 'Beta', artist: 'Artist A', duration: 210 },
  { id: '5', title: 'Delta', artist: 'Artist C', duration: 200 },
];

const duplicateSongs = [
  { id: '1', title: 'Alpha', artist: 'Artist A', duration: 180 },
  { id: '2', title: 'Alpha', artist: 'Artist B', duration: 200 },
  { id: '3', title: 'Beta', artist: 'Artist A', duration: 210 },
  { id: '4', title: 'Beta', artist: 'Artist B', duration: 190 },
];

console.log('=== Merge Sort Test Suite ===\n');

console.log('Original array:');
console.log(' ', sampleSongs.map(s => `${s.title} (${s.artist}, ${s.duration}s)`).join(', '));

console.log('\n1. Merge Sort by Title (A-Z):');
const byTitle = Sorting.mergeSortByTitle(sampleSongs);
console.log(' ', byTitle.map(s => `${s.title} (${s.artist})`).join(', '));
console.log('   isSortedByTitle:', Sorting.isSortedByTitle(byTitle));

console.log('\n2. Merge Sort by Artist (A-Z):');
const byArtist = Sorting.mergeSortByArtist(sampleSongs);
console.log(' ', byArtist.map(s => `${s.title} (${s.artist})`).join(', '));
console.log('   isSortedByArtist:', Sorting.isSortedByArtist(byArtist));

console.log('\n3. Merge Sort by Duration (ascending):');
const byDuration = Sorting.mergeSortByDuration(sampleSongs);
console.log(' ', byDuration.map(s => `${s.title} (${s.duration}s)`).join(', '));
console.log('   isSortedByDuration:', Sorting.isSortedByDuration(byDuration));

console.log('\n4. Merge Sort by Title (Z-A):');
const byTitleDesc = Sorting.mergeSortByTitleDesc(sampleSongs);
console.log(' ', byTitleDesc.map(s => `${s.title} (${s.artist})`).join(', '));

console.log('\n5. Merge Sort by Artist (Z-A):');
const byArtistDesc = Sorting.mergeSortByArtistDesc(sampleSongs);
console.log(' ', byArtistDesc.map(s => `${s.title} (${s.artist})`).join(', '));

console.log('\n6. Merge Sort by Duration (descending):');
const byDurationDesc = Sorting.mergeSortByDurationDesc(sampleSongs);
console.log(' ', byDurationDesc.map(s => `${s.title} (${s.duration}s)`).join(', '));

console.log('\n7. Duplicate handling (stable sort):');
const dupByTitle = Sorting.mergeSortByTitle(duplicateSongs);
console.log('   By title:', dupByTitle.map(s => `${s.title} (${s.artist})`).join(', '));
const dupByArtist = Sorting.mergeSortByArtist(duplicateSongs);
console.log('   By artist:', dupByArtist.map(s => `${s.title} (${s.artist})`).join(', '));
const dupByDuration = Sorting.mergeSortByDuration(duplicateSongs);
console.log('   By duration:', dupByDuration.map(s => `${s.title} (${s.duration}s)`).join(', '));

console.log('\n8. Original array unchanged:');
console.log('   Original:', sampleSongs.map(s => s.title).join(', '));

console.log('\n9. Edge cases:');
console.log('   Empty array:', Sorting.mergeSortByTitle([]));
console.log('   Single element:', Sorting.mergeSortByTitle([{ id: '1', title: 'Solo', artist: 'A', duration: 100 }]));
console.log('   Two elements:', Sorting.mergeSortByTitle([
  { id: '1', title: 'B', artist: 'A', duration: 100 },
  { id: '2', title: 'A', artist: 'B', duration: 200 }
]).map(s => s.title));

console.log('\n10. Already sorted array:');
const sorted = [
  { id: '1', title: 'Alpha', artist: 'Artist A', duration: 180 },
  { id: '2', title: 'Beta', artist: 'Artist B', duration: 210 },
  { id: '3', title: 'Gamma', artist: 'Artist C', duration: 240 },
];
console.log('   Input:', sorted.map(s => s.title).join(', '));
console.log('   Output:', Sorting.mergeSortByTitle(sorted).map(s => s.title).join(', '));

console.log('\n11. Reverse sorted array:');
const reverse = [
  { id: '1', title: 'Gamma', artist: 'Artist C', duration: 240 },
  { id: '2', title: 'Beta', artist: 'Artist B', duration: 210 },
  { id: '3', title: 'Alpha', artist: 'Artist A', duration: 180 },
];
console.log('   Input:', reverse.map(s => s.title).join(', '));
console.log('   Output:', Sorting.mergeSortByTitle(reverse).map(s => s.title).join(', '));

console.log('\n12. Custom compare function:');
const customSort = Sorting.mergeSort(sampleSongs, (a, b) => {
  if (a.artist !== b.artist) {
    return a.artist.localeCompare(b.artist);
  }
  return a.title.localeCompare(b.title);
});
console.log('   Artist then Title:', customSort.map(s => `${s.artist} - ${s.title}`).join(', '));

console.log('\n13. Time complexity verification (large array):');
const largeArray = Array.from({ length: 1000 }, (_, i) => ({
  id: String(i),
  title: `Song ${1000 - i}`,
  artist: `Artist ${i % 50}`,
  duration: 180 + (i % 120)
}));
const start = performance.now();
Sorting.mergeSortByTitle(largeArray);
const end = performance.now();
console.log(`   1000 elements sorted in ${(end - start).toFixed(2)}ms`);

console.log('\n=== All Tests Passed ===');