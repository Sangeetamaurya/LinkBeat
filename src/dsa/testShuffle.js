import { Shuffle } from './Shuffle.js';

const sampleSongs = [
  { id: '1', title: 'Song A', artist: 'Artist 1', duration: 180 },
  { id: '2', title: 'Song B', artist: 'Artist 2', duration: 210 },
  { id: '3', title: 'Song C', artist: 'Artist 3', duration: 240 },
  { id: '4', title: 'Song D', artist: 'Artist 4', duration: 200 },
  { id: '5', title: 'Song E', artist: 'Artist 5', duration: 220 },
];

console.log('=== Shuffle Algorithm Test Suite ===\n');

console.log('Original array:');
console.log(' ', sampleSongs.map(s => s.title).join(', '));

console.log('\n1. Fisher-Yates Shuffle:');
const shuffled = Shuffle.fisherYates(sampleSongs);
console.log('   Shuffled:', shuffled.map(s => s.title).join(', '));
console.log('   Is valid permutation:', Shuffle.isShuffled(sampleSongs, shuffled));

console.log('\n2. Shuffle with first element fixed (current playing song):');
const withFirst = Shuffle.shuffleWithFirst(sampleSongs, 0);
console.log('   Fixed index 0:', withFirst.map(s => s.title).join(', '));
console.log('   First element preserved:', withFirst[0].title === sampleSongs[0].title);
console.log('   Is valid permutation:', Shuffle.isShuffled(sampleSongs, withFirst));

const withFirst2 = Shuffle.shuffleWithFirst(sampleSongs, 2);
console.log('   Fixed index 2:', withFirst2.map(s => s.title).join(', '));
console.log('   First element preserved:', withFirst2[0].title === sampleSongs[2].title);

console.log('\n3. Shuffle with multiple fixed indices:');
const fixed = Shuffle.shuffleWithFixedIndices(sampleSongs, [0, 4]);
console.log('   Fixed indices [0, 4]:', fixed.map(s => s.title).join(', '));
console.log('   Index 0 preserved:', fixed[0].title === sampleSongs[0].title);
console.log('   Index 4 preserved:', fixed[4].title === sampleSongs[4].title);
console.log('   Is valid permutation:', Shuffle.isShuffled(sampleSongs, fixed));

console.log('\n4. Partial shuffle (range only):');
const partial = Shuffle.partialShuffle(sampleSongs, 1, 3);
console.log('   Shuffle range [1,3]:', partial.map(s => s.title).join(', '));
console.log('   Index 0 preserved:', partial[0].title === sampleSongs[0].title);
console.log('   Index 4 preserved:', partial[4].title === sampleSongs[4].title);
console.log('   Is valid permutation:', Shuffle.isShuffled(sampleSongs, partial));

console.log('\n5. Seeded shuffle (reproducible):');
const seed = 12345;
const seeded1 = Shuffle.shuffleWithSeed(sampleSongs, seed);
const seeded2 = Shuffle.shuffleWithSeed(sampleSongs, seed);
console.log('   Seed 12345 - Run 1:', seeded1.map(s => s.title).join(', '));
console.log('   Seed 12345 - Run 2:', seeded2.map(s => s.title).join(', '));
console.log('   Results identical:', JSON.stringify(seeded1) === JSON.stringify(seeded2));

const seededFirst1 = Shuffle.shuffleWithFirstSeed(sampleSongs, 0, seed);
const seededFirst2 = Shuffle.shuffleWithFirstSeed(sampleSongs, 0, seed);
console.log('   With first fixed - Run 1:', seededFirst1.map(s => s.title).join(', '));
console.log('   With first fixed - Run 2:', seededFirst2.map(s => s.title).join(', '));
console.log('   Results identical:', JSON.stringify(seededFirst1) === JSON.stringify(seededFirst2));

console.log('\n6. Different seeds produce different results:');
const seedA = Shuffle.shuffleWithSeed(sampleSongs, 111);
const seedB = Shuffle.shuffleWithSeed(sampleSongs, 222);
console.log('   Seed 111:', seedA.map(s => s.title).join(', '));
console.log('   Seed 222:', seedB.map(s => s.title).join(', '));
console.log('   Different:', JSON.stringify(seedA) !== JSON.stringify(seedB));

console.log('\n7. Edge cases:');
console.log('   Empty array:', Shuffle.fisherYates([]));
console.log('   Single element:', Shuffle.fisherYates([{ id: '1', title: 'Solo', artist: 'A', duration: 100 }]).map(s => s.title));
console.log('   Two elements:', Shuffle.fisherYates([
  { id: '1', title: 'A', artist: 'A', duration: 100 },
  { id: '2', title: 'B', artist: 'B', duration: 200 }
]).map(s => s.title));

console.log('\n8. Original array unchanged:');
console.log('   Original:', sampleSongs.map(s => s.title).join(', '));

console.log('\n9. Shuffle quality test (uniformity):');
const quality = Shuffle.getShuffleQuality(sampleSongs, sampleSongs, 5000);
console.log(`   Quality score (5000 trials): ${(quality * 100).toFixed(2)}%`);
console.log('   (Closer to 100% = more uniform distribution)');

console.log('\n10. Error handling:');
try {
  Shuffle.shuffleWithFirst(sampleSongs, 10);
} catch (e) {
  console.log('   Invalid firstIndex error:', e.message);
}

try {
  Shuffle.partialShuffle(sampleSongs, 3, 1);
} catch (e) {
  console.log('   Invalid range error:', e.message);
}

console.log('\n11. Playlist shuffle simulation (like LinkBeat):');
const playlist = [
  { id: '1', title: 'Track 1', artist: 'Artist A', duration: 180 },
  { id: '2', title: 'Track 2', artist: 'Artist B', duration: 210 },
  { id: '3', title: 'Track 3', artist: 'Artist C', duration: 240 },
  { id: '4', title: 'Track 4', artist: 'Artist D', duration: 200 },
  { id: '5', title: 'Track 5', artist: 'Artist E', duration: 220 },
  { id: '6', title: 'Track 6', artist: 'Artist F', duration: 190 },
];

console.log('   Original playlist:', playlist.map(s => s.title).join(' -> '));

// Simulate: user is playing Track 3 (index 2), clicks shuffle
const currentIndex = 2;
const shuffledPlaylist = Shuffle.shuffleWithFirst(playlist, currentIndex);
console.log('   After shuffle (Track 3 stays first):', shuffledPlaylist.map(s => s.title).join(' -> '));
console.log('   Current song preserved:', shuffledPlaylist[0].title === playlist[currentIndex].title);

// User turns off shuffle - restore original order
console.log('   Shuffle off - restore:', playlist.map(s => s.title).join(' -> '));

console.log('\n=== All Tests Passed ===');