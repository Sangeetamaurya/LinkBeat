export class Searching {
  static linearSearchById(arr, id) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        return { index: i, data: arr[i] };
      }
    }
    return null;
  }

  static linearSearchByTitle(arr, title) {
    const results = [];
    const searchTitle = title.toLowerCase();
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].title.toLowerCase().includes(searchTitle)) {
        results.push({ index: i, data: arr[i] });
      }
    }
    return results;
  }

  static linearSearchByArtist(arr, artist) {
    const results = [];
    const searchArtist = artist.toLowerCase();
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].artist.toLowerCase().includes(searchArtist)) {
        results.push({ index: i, data: arr[i] });
      }
    }
    return results;
  }

  static linearSearch(arr, predicate) {
    for (let i = 0; i < arr.length; i++) {
      if (predicate(arr[i])) {
        return { index: i, data: arr[i] };
      }
    }
    return null;
  }

  static linearSearchAll(arr, predicate) {
    const results = [];
    for (let i = 0; i < arr.length; i++) {
      if (predicate(arr[i])) {
        results.push({ index: i, data: arr[i] });
      }
    }
    return results;
  }

  static binarySearchByTitle(arr, title) {
    if (!this.isSortedByTitle(arr)) {
      throw new Error('Array must be sorted by title for binary search');
    }
    const searchTitle = title.toLowerCase();
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midTitle = arr[mid].title.toLowerCase();
      
      if (midTitle === searchTitle) {
        return { index: mid, data: arr[mid] };
      } else if (midTitle < searchTitle) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return null;
  }

  static binarySearchByArtist(arr, artist) {
    if (!this.isSortedByArtist(arr)) {
      throw new Error('Array must be sorted by artist for binary search');
    }
    const searchArtist = artist.toLowerCase();
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midArtist = arr[mid].artist.toLowerCase();
      
      if (midArtist === searchArtist) {
        return { index: mid, data: arr[mid] };
      } else if (midArtist < searchArtist) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return null;
  }

  static binarySearchByTitlePrefix(arr, prefix) {
    if (!this.isSortedByTitle(arr)) {
      throw new Error('Array must be sorted by title for binary search');
    }
    const searchPrefix = prefix.toLowerCase();
    let left = 0;
    let right = arr.length - 1;
    let result = -1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midTitle = arr[mid].title.toLowerCase();
      
      if (midTitle.startsWith(searchPrefix)) {
        result = mid;
        right = mid - 1;
      } else if (midTitle < searchPrefix) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    if (result === -1) return [];
    
    const matches = [];
    for (let i = result; i < arr.length && arr[i].title.toLowerCase().startsWith(searchPrefix); i++) {
      matches.push({ index: i, data: arr[i] });
    }
    return matches;
  }

  static binarySearchByArtistPrefix(arr, prefix) {
    if (!this.isSortedByArtist(arr)) {
      throw new Error('Array must be sorted by artist for binary search');
    }
    const searchPrefix = prefix.toLowerCase();
    let left = 0;
    let right = arr.length - 1;
    let result = -1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midArtist = arr[mid].artist.toLowerCase();
      
      if (midArtist.startsWith(searchPrefix)) {
        result = mid;
        right = mid - 1;
      } else if (midArtist < searchPrefix) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    if (result === -1) return [];
    
    const matches = [];
    for (let i = result; i < arr.length && arr[i].artist.toLowerCase().startsWith(searchPrefix); i++) {
      matches.push({ index: i, data: arr[i] });
    }
    return matches;
  }

  static isSortedByTitle(arr) {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i - 1].title.toLowerCase() > arr[i].title.toLowerCase()) {
        return false;
      }
    }
    return true;
  }

  static isSortedByArtist(arr) {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i - 1].artist.toLowerCase() > arr[i].artist.toLowerCase()) {
        return false;
      }
    }
    return true;
  }

  static sortByTitle(arr) {
    return [...arr].sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
  }

  static sortByArtist(arr) {
    return [...arr].sort((a, b) => a.artist.toLowerCase().localeCompare(b.artist.toLowerCase()));
  }

  static sortByDuration(arr) {
    return [...arr].sort((a, b) => a.duration - b.duration);
  }
}