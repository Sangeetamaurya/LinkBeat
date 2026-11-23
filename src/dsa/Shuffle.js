export class Shuffle {
  static fisherYates(arr, random = Math.random) {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  static shuffleWithFirst(arr, firstIndex, random = Math.random) {
    if (arr.length <= 1) return [...arr];
    if (firstIndex < 0 || firstIndex >= arr.length) {
      throw new Error('Invalid firstIndex');
    }

    const first = arr[firstIndex];
    const rest = arr.filter((_, i) => i !== firstIndex);
    
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    
    return [first, ...rest];
  }

  static shuffleWithFixedIndices(arr, fixedIndices, random = Math.random) {
    if (arr.length <= 1) return [...arr];
    
    const fixedSet = new Set(fixedIndices);
    const movable = arr.filter((_, i) => !fixedSet.has(i));
    const fixed = arr.filter((_, i) => fixedSet.has(i));
    
    for (let i = movable.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [movable[i], movable[j]] = [movable[j], movable[i]];
    }
    
    const result = new Array(arr.length);
    let movableIdx = 0;
    for (let i = 0; i < arr.length; i++) {
      if (fixedSet.has(i)) {
        result[i] = fixed[fixedIndices.indexOf(i)];
      } else {
        result[i] = movable[movableIdx++];
      }
    }
    return result;
  }

  static partialShuffle(arr, startIndex, endIndex, random = Math.random) {
    if (startIndex < 0 || endIndex >= arr.length || startIndex > endIndex) {
      throw new Error('Invalid range');
    }
    
    const result = [...arr];
    const sliceLength = endIndex - startIndex + 1;
    if (sliceLength <= 1) return result;
    
    for (let i = sliceLength - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      const actualI = startIndex + i;
      const actualJ = startIndex + j;
      [result[actualI], result[actualJ]] = [result[actualJ], result[actualI]];
    }
    return result;
  }

  static seededRandom(seed) {
    let state = seed;
    return () => {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    };
  }

  static shuffleWithSeed(arr, seed) {
    const random = this.seededRandom(seed);
    return this.fisherYates(arr, random);
  }

  static shuffleWithFirstSeed(arr, firstIndex, seed) {
    const random = this.seededRandom(seed);
    return this.shuffleWithFirst(arr, firstIndex, random);
  }

  static isShuffled(original, shuffled) {
    if (original.length !== shuffled.length) return false;
    const originalCounts = new Map();
    const shuffledCounts = new Map();
    
    for (const item of original) {
      const key = JSON.stringify(item);
      originalCounts.set(key, (originalCounts.get(key) || 0) + 1);
    }
    
    for (const item of shuffled) {
      const key = JSON.stringify(item);
      shuffledCounts.set(key, (shuffledCounts.get(key) || 0) + 1);
    }
    
    if (originalCounts.size !== shuffledCounts.size) return false;
    for (const [key, count] of originalCounts) {
      if (shuffledCounts.get(key) !== count) return false;
    }
    return true;
  }

  static getShuffleQuality(original, shuffled, trials = 1000) {
    if (original.length !== shuffled.length) return 0;
    const positionCounts = new Map();
    
    for (let i = 0; i < original.length; i++) {
      positionCounts.set(i, new Map());
    }
    
    for (let t = 0; t < trials; t++) {
      const testShuffle = this.fisherYates(original);
      for (let i = 0; i < testShuffle.length; i++) {
        const item = JSON.stringify(testShuffle[i]);
        const posMap = positionCounts.get(i);
        posMap.set(item, (posMap.get(item) || 0) + 1);
      }
    }
    
    let totalDeviation = 0;
    const expected = trials / original.length;
    
    for (const [pos, itemMap] of positionCounts) {
      for (const [item, count] of itemMap) {
        totalDeviation += Math.abs(count - expected);
      }
    }
    
    return 1 - (totalDeviation / (trials * original.length * 2));
  }
}