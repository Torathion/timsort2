import type { AnyArray } from 'typestar'

/**
 * Default minimum size of a run.
 */
const DEFAULT_MIN_MERGE = 32

/**
 * Minimum ordered subsequece required to do galloping.
 */
const DEFAULT_MIN_GALLOPING = 7

/**
 * Default tmp storage length. Can increase depending on the size of the
 * smallest run to merge.
 */
const DEFAULT_TMP_STORAGE_LENGTH = 256

/**
 * Pre-computed powers of 10 for efficient lexicographic comparison of
 * small integers.
 */
const POWERS_OF_TEN = new Float32Array([1, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9])

type Comparator<T> = (a: T, b: T) => number

/**
 * Default alphabetical comparison of items.
 *
 * @param a - First element to compare.
 * @param b - Second element to compare.
 * @return - A positive number if a.toString() > b.toString(), a
 * negative number if .toString() < b.toString(), 0 otherwise.
 */
export function alphabeticalCompare(a: any, b: any): number {
  if (a === b) {
    return 0
  }

  if (~~a === a && ~~b === b) {
    if (a === 0 || b === 0) return a - b

    if (a < 0 || b < 0) {
      if (b >= 0) return -1
      if (a >= 0) return 1
      a = -a
      b = -b
    }

    const al = Math.log10(a) | 0
    const bl = Math.log10(b) | 0
    let t = 0

    if (al < bl) {
      a *= POWERS_OF_TEN[bl - al - 1]
      b /= 10
      t = -1
    } else if (al > bl) {
      b *= POWERS_OF_TEN[al - bl - 1]
      a /= 10
      t = 1
    }

    return a === b ? t : a - b
  }

  const aStr = `${a}`
  const bStr = `${b}`

  if (aStr === bStr) return 0
  return aStr < bStr ? -1 : 1
}

/**
 * Sort an array in the range [lo, hi) using TimSort.
 *
 * @param array - The array to sort.
 * @param compare - Item comparison function. Default is `alphabeticalCompare`
 * @param lo - First element in the range (inclusive).
 * @param hi - Last element in the range.
 */
export default function sort<T>(array: AnyArray<T>, compare: Comparator<T> = alphabeticalCompare, lo = 0, hi = array.length): AnyArray<T> {
  let remaining = hi - lo

  // The array is already sorted
  if (remaining < 2) {
    return array
  }

  let runLength = 0
  // On small arrays binary sort can be used directly
  if (remaining < DEFAULT_MIN_MERGE) {
    runLength = makeAscendingRun(array, lo, hi, compare)
    binaryInsertionSort(array, lo, hi, lo + runLength, compare)
    return array
  }

  const len = array.length

  let stackSize = 0
  const stackLength = len < 120 ? 5 : len < 1542 ? 10 : len < 119151 ? 19 : 40
  const runStart = new Array(stackLength)
  const runLenArr = new Array(stackLength)

  // Calculate the minimum run length for the sort
  let x = 0
  let y = remaining
  while (y >= DEFAULT_MIN_MERGE) {
    x |= y & 1
    y >>= 1
  }
  const minRun = x + y
  let minGallop = DEFAULT_MIN_GALLOPING
  const tmp: T[] = new Array(len < 2 * DEFAULT_TMP_STORAGE_LENGTH ? len >> 1 : DEFAULT_TMP_STORAGE_LENGTH)
  // Do runs
  do {
    runLength = makeAscendingRun(array, lo, hi, compare)
    if (runLength < minRun) {
      let force = remaining
      if (force > minRun) {
        force = minRun
      }

      binaryInsertionSort(array, lo, lo + force, lo + runLength, compare)
      runLength = force
    }
    // Push new run and merge if necessary
    runStart[stackSize] = lo
    runLenArr[stackSize] = runLength
    stackSize += 1
    while (stackSize > 1) {
      let n = stackSize - 2

      if ((n >= 1 && runLenArr[n - 1] <= runLenArr[n] + runLenArr[n + 1]) || (n >= 2 && runLenArr[n - 2] <= runLenArr[n] + runLenArr[n - 1])) {
        if (runLenArr[n - 1] < runLenArr[n + 1]) n--
      } else if (runLenArr[n] > runLenArr[n + 1]) break

      minGallop = mergeAt(array, compare, tmp, n, stackSize--, runLenArr, runStart, minGallop)
    }

    // Go find next run
    remaining -= runLength
    lo += runLength
  } while (remaining !== 0)

  // Force merging of remaining runs
  while (stackSize > 1) {
    let n = stackSize - 2
    if (n > 0 && runLenArr[n - 1] < runLenArr[n + 1]) n--
    minGallop = mergeAt(array, compare, tmp, n, stackSize--, runLenArr, runStart, minGallop)
  }
  return array
}

/**
 * Perform the binary sort of the array in the range [lo, hi) where start is
 * the first element possibly out of order.
 *
 * @param array - The array to sort.
 * @param lo - First element in the range (inclusive).
 * @param hi - Last element in the range.
 * @param start - First element possibly out of order.
 * @param compare - Item comparison function.
 */
function binaryInsertionSort<T>(array: AnyArray<T>, lo: number, hi: number, start: number, compare: Comparator<T>): void {
  if (start === lo) start++
  let tmp
  for (; start < hi; start++) {
    const pivot = array[start]

    // Ranges of the array where pivot belongs
    let left = lo
    let right = start

    /*
     *   pivot >= array[i] for i in [lo, left)
     *   pivot <  array[i] for i in  in [right, start)
     */
    while (left < right) {
      // tmp acts as the mid point
      tmp = (left + right) >> 1
      if (compare(pivot as T, array[tmp] as T) < 0) right = tmp
      else left = tmp + 1
    }

    /*
     * Move elements right to make room for the pivot. If there are elements
     * equal to pivot, left points to the first slot after them: this is also
     * a reason for which TimSort is stable
     */
    tmp = start - left
    // Switch is just an optimization for small arrays
    switch (tmp) {
      case 3:
        array[left + 3] = array[left + 2]
      /* falls through */
      case 2:
        array[left + 2] = array[left + 1]
      /* falls through */
      case 1:
        array[left + 1] = array[left]
        break
      default:
        while (tmp > 0) {
          array[left + tmp] = array[left + tmp - 1]
          tmp--
        }
    }

    array[left] = pivot
  }
}

/**
 * Find the position at which to insert a value in a sorted range. If the range
 * contains elements equal to the value the leftmost element index is returned
 * (for stability).
 *
 * @param value - Value to insert.
 * @param array - The array in which to insert value.
 * @param start - First element in the range.
 * @param length - Length of the range.
 * @param hint - The index at which to begin the search.
 * @param compare - Item comparison function.
 * @return - The index where to insert value.
 */
function gallopLeft<T>(value: T, array: AnyArray<T>, start: number, length: number, hint: number, compare: Comparator<T>): number {
  const startHint = start + hint
  let lastOffset = 0
  let maxOffset = 0
  let offset = 1
  let tmp

  if (compare(value, array[startHint] as T) > 0) {
    maxOffset = length - hint

    while (offset < maxOffset && compare(value, array[startHint + offset] as T) > 0) {
      lastOffset = offset
      offset = (offset << 1) + 1
    }

    if (offset > maxOffset) offset = maxOffset

    // Make offsets relative to start
    lastOffset += hint
    offset += hint

    // value <= array[start + hint]
  } else {
    maxOffset = hint + 1
    while (offset < maxOffset && compare(value, array[startHint - offset] as T) <= 0) {
      lastOffset = offset
      offset = (offset << 1) + 1
    }
    if (offset > maxOffset) offset = maxOffset

    // Make offsets relative to start
    tmp = lastOffset
    lastOffset = hint - offset
    offset = hint - tmp
  }

  /*
   * Now array[start+lastOffset] < value <= array[start+offset], so value
   * belongs somewhere in the range (start + lastOffset, start + offset]. Do a
   * binary search, with invariant array[start + lastOffset - 1] < value <=
   * array[start + offset].
   */
  lastOffset++
  while (lastOffset < offset) {
    tmp = lastOffset + ((offset - lastOffset) >>> 1)
    if (compare(value, array[start + tmp] as T) > 0) lastOffset = tmp + 1
    else offset = tmp
  }
  return offset
}

/**
 * Find the position at which to insert a value in a sorted range. If the range
 * contains elements equal to the value the rightmost element index is returned
 * (for stability).
 *
 * @param value - Value to insert.
 * @param array - The array in which to insert value.
 * @param start - First element in the range.
 * @param length - Length of the range.
 * @param hint - The index at which to begin the search.
 * @param compare - Item comparison function.
 * @return - The index where to insert value.
 */
function gallopRight<T>(value: T, array: AnyArray<T>, start: number, length: number, hint: number, compare: Comparator<T>): number {
  const startHint = start + hint
  let lastOffset = 0
  let maxOffset = 0
  let offset = 1
  let tmp

  if (compare(value, array[startHint] as T) < 0) {
    maxOffset = hint + 1

    while (offset < maxOffset && compare(value, array[startHint - offset] as T) < 0) {
      lastOffset = offset
      offset = (offset << 1) + 1
    }

    if (offset > maxOffset) offset = maxOffset

    // Make offsets relative to start
    tmp = lastOffset
    lastOffset = hint - offset
    offset = hint - tmp

    // value >= array[start + hint]
  } else {
    maxOffset = length - hint

    while (offset < maxOffset && compare(value, array[startHint + offset] as T) >= 0) {
      lastOffset = offset
      offset = (offset << 1) + 1
    }
    if (offset > maxOffset) offset = maxOffset

    // Make offsets relative to start
    lastOffset += hint
    offset += hint
  }

  /*
   * Now array[start+lastOffset] < value <= array[start+offset], so value
   * belongs somewhere in the range (start + lastOffset, start + offset]. Do a
   * binary search, with invariant array[start + lastOffset - 1] < value <=
   * array[start + offset].
   */
  lastOffset++

  while (lastOffset < offset) {
    tmp = lastOffset + ((offset - lastOffset) >>> 1)
    if (compare(value, array[start + tmp] as T) < 0) offset = tmp
    else lastOffset = tmp + 1
  }

  return offset
}

/**
 * Counts the length of a monotonically ascending or strictly monotonically
 * descending sequence (run) starting at array[lo] in the range [lo, hi). If
 * the run is descending it is made ascending.
 *
 * @param array - The array to reverse.
 * @param lo - First element in the range (inclusive).
 * @param hi - Last element in the range.
 * @param compare - Item comparison function.
 * @return - The length of the run.
 */
function makeAscendingRun<T>(array: AnyArray<T>, lo: number, hi: number, compare: Comparator<T>): number {
  let runHi = lo + 1
  if (runHi === hi) return 1

  // Descending
  if (compare(array[runHi++] as T, array[lo] as T) < 0) {
    while (runHi < hi && compare(array[runHi] as T, array[runHi - 1] as T) < 0) {
      runHi++
    }

    // Reverse array in range of lo to runHi
    runHi--
    while (lo < runHi) {
      const t = array[lo]
      array[lo++] = array[runHi]
      array[runHi--] = t
    }
    runHi++
    // Ascending
  } else {
    while (runHi < hi && compare(array[runHi] as T, array[runHi - 1] as T) >= 0) {
      runHi++
    }
  }

  return runHi - lo
}

/**
 * Merge the runs on the stack at positions i and i+1. Must be always be called
 * with i=stackSize-2 or i=stackSize-3 (that is, we merge on top of the stack).
 *
 * @param array - target array to sort.
 * @param compare - target comparator to sort with.
 * @param tmp - temporarily stored values from the target array.
 * @param i - Index of the run to merge in TimSort's stack.
 * @param stackSize - current stack size of the run
 * @param runLength - array representing a buffer size of the run length
 * @param runStart - array representing a buffer size of where to start the run
 * @returns the current minimum gallop count
 */
function mergeAt<T>(
  array: AnyArray<T>,
  compare: Comparator<T>,
  tmp: T[],
  i: number,
  stackSize: number,
  runLength: number[],
  runStart: number[],
  minGallop: number
): number {
  let start1 = runStart[i]
  let length1 = runLength[i]
  const start2 = runStart[i + 1]
  let length2 = runLength[i + 1]

  runLength[i] = length1 + length2

  if (i === stackSize - 3) {
    runStart[i + 1] = runStart[i + 2]
    runLength[i + 1] = runLength[i + 2]
  }

  /*
   * Find where the first element in the second run goes in run1. Previous
   * elements in run1 are already in place
   */
  const k = gallopRight(array[start2] as T, array, start1, length1, 0, compare)
  start1 += k
  length1 -= k

  if (length1 === 0) return minGallop

  /*
   * Find where the last element in the first run goes in run2. Next elements
   * in run2 are already in place
   */
  length2 = gallopLeft(array[start1 + length1 - 1] as T, array, start2, length2, length2 - 1, compare)

  if (length2 === 0) return minGallop

  /*
   * Merge remaining runs. A tmp array with length = min(length1, length2) is
   * used
   */
  if (length1 <= length2) {
    return mergeLow(array, compare, tmp, start1, length1, start2, length2, minGallop)
  }
  return mergeHigh(array, compare, tmp, start1, length1, start2, length2, minGallop)
}

/**
 * Merge two adjacent runs in a stable way. The runs must be such that the
 * first element of run1 is bigger than the first element in run2 and the
 * last element of run1 is greater than all the elements in run2.
 * The method should be called when run1.length > run2.length as it uses
 * TimSort temporary array to store run2. Use mergeLow if run1.length <=
 * run2.length.
 *
 * @param array - target array
 * @param compare - comparator to compare the underlying values with.
 * @param tmp - temporary stored values of the target array
 * @param start1 - First element in run1.
 * @param length1 - Length of run1.
 * @param start2 - First element in run2.
 * @param length2 - Length of run2.
 * @param minGallop - minimum length of the merge and compare run
 * @returns the updated `minGallop value`
 */
function mergeHigh<T>(
  array: AnyArray<T>,
  compare: Comparator<T>,
  tmp: T[],
  start1: number,
  length1: number,
  start2: number,
  length2: number,
  minGallop: number
): number {
  let i = 0

  for (i; i < length2; i++) {
    tmp[i] = array[start2 + i] as T
  }

  let cursor1 = start1 + length1 - 1
  let cursor2 = length2 - 1
  let dest = start2 + length2 - 1
  let customCursor = 0
  let customDest = 0

  array[dest--] = array[cursor1--]

  if (--length1 === 0) {
    customCursor = dest - (length2 - 1)

    for (i = 0; i < length2; i++) {
      array[customCursor + i] = tmp[i]
    }

    return minGallop
  }

  if (length2 === 1) {
    dest -= length1
    cursor1 -= length1
    customDest = dest + 1
    customCursor = cursor1 + 1

    for (i = length1 - 1; i >= 0; i--) {
      array[customDest + i] = array[customCursor + i]
    }

    array[dest] = tmp[cursor2]
    return minGallop
  }

  while (true) {
    let count1 = 0
    let count2 = 0
    let exit = false

    do {
      if (compare(tmp[cursor2], array[cursor1] as T) < 0) {
        array[dest--] = array[cursor1--]
        count1++
        count2 = 0
        if (--length1 === 0) {
          exit = true
          break
        }
      } else {
        array[dest--] = tmp[cursor2--]
        count2++
        count1 = 0
        if (--length2 === 1) {
          exit = true
          break
        }
      }
    } while ((count1 | count2) < minGallop)

    if (exit) break
    do {
      count1 = length1 - gallopRight(tmp[cursor2], array, start1, length1, length1 - 1, compare)

      if (count1 !== 0) {
        dest -= count1
        cursor1 -= count1
        length1 -= count1
        customDest = dest + 1
        customCursor = cursor1 + 1

        for (i = count1 - 1; i >= 0; i--) {
          array[customDest + i] = array[customCursor + i]
        }

        if (length1 === 0) {
          exit = true
          break
        }
      }

      array[dest--] = tmp[cursor2--]

      if (--length2 === 1) {
        exit = true
        break
      }

      count2 = length2 - gallopLeft(array[cursor1] as T, tmp, 0, length2, length2 - 1, compare)

      if (count2 !== 0) {
        dest -= count2
        cursor2 -= count2
        length2 -= count2
        customDest = dest + 1
        customCursor = cursor2 + 1

        for (i = 0; i < count2; i++) {
          array[customDest + i] = tmp[customCursor + i]
        }

        if (length2 <= 1) {
          exit = true
          break
        }
      }

      array[dest--] = array[cursor1--]

      if (--length1 === 0) {
        exit = true
        break
      }

      minGallop--
    } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING)

    if (exit) break
    if (minGallop < 0) minGallop = 0
    minGallop += 2
  }

  if (minGallop < 1) minGallop = 1

  if (length2 === 1) {
    dest -= length1
    cursor1 -= length1
    customDest = dest + 1
    customCursor = cursor1 + 1

    for (i = length1 - 1; i >= 0; i--) {
      array[customDest + i] = array[customCursor + i]
    }

    array[dest] = tmp[cursor2]
  } else if (length2 === 0) return minGallop
  else {
    customCursor = dest - (length2 - 1)
    for (i = 0; i < length2; i++) {
      array[customCursor + i] = tmp[i]
    }
  }
  return minGallop
}

/**
 * Merge two adjacent runs in a stable way. The runs must be such that the
 * first element of run1 is bigger than the first element in run2 and the
 * last element of run1 is greater than all the elements in run2.
 * The method should be called when run1.length <= run2.length as it uses
 * TimSort temporary array to store run1. Use mergeHigh if run1.length >
 * run2.length.
 *
 * @param array - target array
 * @param compare - comparator to compare the underlying values with.
 * @param tmp - temporary stored values of the target array
 * @param start1 - First element in run1.
 * @param length1 - Length of run1.
 * @param start2 - First element in run2.
 * @param length2 - Length of run2.
 * @param minGallop - minimum length of the merge and compare run
 * @returns the updated `minGallop value`
 */
function mergeLow<T>(
  array: AnyArray<T>,
  compare: Comparator<T>,
  tmp: T[],
  start1: number,
  length1: number,
  start2: number,
  length2: number,
  minGallop: number
): number {
  let i = 0

  for (; i < length1; i++) {
    tmp[i] = array[start1 + i] as T
  }

  let cursor1 = 0
  let cursor2 = start2
  let dest = start1

  array[dest++] = array[cursor2++]

  if (--length2 === 0) {
    for (i = 0; i < length1; i++) {
      array[dest + i] = tmp[cursor1 + i]
    }
    return minGallop
  }

  if (length1 === 1) {
    for (i = 0; i < length2; i++) {
      array[dest + i] = array[cursor2 + i]
    }
    array[dest + length2] = tmp[cursor1]
    return minGallop
  }

  while (true) {
    let count1 = 0
    let count2 = 0
    let exit = false

    do {
      if (compare(array[cursor2] as T, tmp[cursor1]) < 0) {
        array[dest++] = array[cursor2++]
        count2++
        count1 = 0

        if (--length2 === 0) {
          exit = true
          break
        }
      } else {
        array[dest++] = tmp[cursor1++]
        count1++
        count2 = 0
        if (--length1 === 1) {
          exit = true
          break
        }
      }
    } while ((count1 | count2) < minGallop)

    if (exit) break

    do {
      count1 = gallopRight(array[cursor2] as T, tmp, cursor1, length1, 0, compare)

      if (count1 !== 0) {
        for (i = 0; i < count1; i++) {
          array[dest + i] = tmp[cursor1 + i]
        }

        dest += count1
        cursor1 += count1
        length1 -= count1
        if (length1 <= 1) {
          exit = true
          break
        }
      }

      array[dest++] = array[cursor2++]

      if (--length2 === 0) {
        exit = true
        break
      }

      count2 = gallopLeft(tmp[cursor1], array, cursor2, length2, 0, compare)

      if (count2 !== 0) {
        for (i = 0; i < count2; i++) {
          array[dest + i] = array[cursor2 + i]
        }

        dest += count2
        cursor2 += count2
        length2 -= count2

        if (length2 === 0) {
          exit = true
          break
        }
      }
      array[dest++] = tmp[cursor1++]

      if (--length1 === 1) {
        exit = true
        break
      }

      minGallop--
    } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING)

    if (exit) break
    if (minGallop < 0) minGallop = 0
    minGallop += 2
  }

  if (minGallop < 1) minGallop = 1
  if (length1 === 1) {
    for (i = 0; i < length2; i++) {
      array[dest + i] = array[cursor2 + i]
    }
    array[dest + length2] = tmp[cursor1]
  } else if (length1 === 0) return minGallop
  else {
    for (i = 0; i < length1; i++) {
      array[dest + i] = tmp[cursor1 + i]
    }
  }
  return minGallop
}
