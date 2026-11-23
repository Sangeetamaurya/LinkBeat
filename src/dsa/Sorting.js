export class Sorting {
  static mergeSort(arr, compareFn) {
    if (arr.length <= 1) {
      return [...arr];
    }

    const mid = Math.floor(arr.length / 2);
    const left = this.mergeSort(arr.slice(0, mid), compareFn);
    const right = this.mergeSort(arr.slice(mid), compareFn);

    return this.merge(left, right, compareFn);
  }

  static merge(left, right, compareFn) {
    const result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (compareFn(left[leftIndex], right[rightIndex]) <= 0) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    while (leftIndex < left.length) {
      result.push(left[leftIndex]);
      leftIndex++;
    }

    while (rightIndex < right.length) {
      result.push(right[rightIndex]);
      rightIndex++;
    }

    return result;
  }

  static mergeSortByTitle(arr) {
    return this.mergeSort(arr, (a, b) => 
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
  }

  static mergeSortByArtist(arr) {
    return this.mergeSort(arr, (a, b) => 
      a.artist.toLowerCase().localeCompare(b.artist.toLowerCase())
    );
  }

  static mergeSortByDuration(arr) {
    return this.mergeSort(arr, (a, b) => a.duration - b.duration);
  }

  static mergeSortByTitleDesc(arr) {
    return this.mergeSort(arr, (a, b) => 
      b.title.toLowerCase().localeCompare(a.title.toLowerCase())
    );
  }

  static mergeSortByArtistDesc(arr) {
    return this.mergeSort(arr, (a, b) => 
      b.artist.toLowerCase().localeCompare(a.artist.toLowerCase())
    );
  }

  static mergeSortByDurationDesc(arr) {
    return this.mergeSort(arr, (a, b) => b.duration - a.duration);
  }

  static isSorted(arr, compareFn) {
    for (let i = 1; i < arr.length; i++) {
      if (compareFn(arr[i - 1], arr[i]) > 0) {
        return false;
      }
    }
    return true;
  }

  static isSortedByTitle(arr) {
    return this.isSorted(arr, (a, b) => 
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
  }

  static isSortedByArtist(arr) {
    return this.isSorted(arr, (a, b) => 
      a.artist.toLowerCase().localeCompare(b.artist.toLowerCase())
    );
  }

  static isSortedByDuration(arr) {
    return this.isSorted(arr, (a, b) => a.duration - b.duration);
  }
}