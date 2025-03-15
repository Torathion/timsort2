'use strict'

import { describe, it, expect } from 'vitest'
import sort, { alphabeticalCompare } from '../src'
import ArrayGenerator from './ArrayGenerator'

var lengths = [10, 100, 1000, 10000]
var repetitions = 10

function numberCompare(a, b) {
  return a - b
}

describe('Sort a Random Array', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const arr1 = ArrayGenerator.randomInt(length)
        const arr2 = arr1.slice()

        sort(arr1, numberCompare)
        arr2.sort(numberCompare)

        expect(arr1).toEqual(arr2)
      }
    })
  })
})

describe('Sort a Descending Array', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const arr1 = ArrayGenerator.descendingInt(length)
        const arr2 = arr1.slice()

        sort(arr1, numberCompare)
        arr2.sort(numberCompare)

        expect(arr1).toEqual(arr2)
      }
    })
  })
})

describe('Sort an Ascending Array', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const arr1 = ArrayGenerator.ascendingInt(length)
        const arr2 = arr1.slice()

        sort(arr1, numberCompare)
        arr2.sort(numberCompare)

        expect(arr1).toEqual(arr2)
      }
    })
  })
})

describe('Sort an Ascending Array with 3 Random Exchanges', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const arr1 = ArrayGenerator.ascending3RandomExchangesInt(length)
        const arr2 = arr1.slice()

        sort(arr1, numberCompare)
        arr2.sort(numberCompare)

        expect(arr1).toEqual(arr2)
      }
    })
  })
})

describe('Sort an Ascending Array with 10 Random Elements at Last', function () {
  lengths.forEach(function (length) {
    it('Should sort a size ' + length + ' array', function () {
      for (var i = 0; i < repetitions; i++) {
        var arr1 = ArrayGenerator.ascending10RandomEndInt(length)
        var arr2 = arr1.slice()

        sort(arr1, numberCompare)
        arr2.sort(numberCompare)
      }
    })
  })
})

describe('Sort an Array of all Equal Elements', function () {
  lengths.forEach(function (length) {
    it('Should sort a size ' + length + ' array', function () {
      for (var i = 0; i < repetitions; i++) {
        var arr1 = ArrayGenerator.allEqualInt(length)
        var arr2 = arr1.slice()

        sort(arr1, numberCompare)
        arr2.sort(numberCompare)
      }
    })
  })
})

describe('Sort an Array with Many Duplicates', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const arr1 = ArrayGenerator.manyDuplicateInt(length)
        const arr2 = arr1.slice()

        sort(arr1, numberCompare)
        arr2.sort(numberCompare)

        expect(arr1).toEqual(arr2)
      }
    })
  })
})

describe('Sort an Array with Some Duplicates', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const arr1 = ArrayGenerator.someDuplicateInt(length)
        const arr2 = arr1.slice()

        sort(arr1, numberCompare)
        arr2.sort(numberCompare)

        expect(arr1).toEqual(arr2)
      }
    })
  })
})

describe('Sort Subrange of a Random Array', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const lo = parseInt(length / 4)
        const hi = length - lo
        const arr1 = ArrayGenerator.randomInt(length)
        const arr2 = arr1.slice(lo, hi)

        sort(arr1, numberCompare, lo, hi)
        arr2.sort(numberCompare)

        let j = 0
        while (lo + j < hi) {
          expect(arr1[lo + j]).toBe(arr2[j])
          j++
        }
      }
    })
  })
})

describe('Sort Subrange of a Descending Array', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const lo = parseInt(length / 4)
        const hi = length - lo
        const arr1 = ArrayGenerator.descendingInt(length)
        const arr2 = arr1.slice(lo, hi)

        sort(arr1, numberCompare, lo, hi)
        arr2.sort(numberCompare)

        let j = 0
        while (lo + j < hi) {
          expect(arr1[lo + j]).toBe(arr2[j])
          j++
        }
      }
    })
  })
})

describe('Sort Subrange of an Ascending Array', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const lo = parseInt(length / 4)
        const hi = length - lo
        const arr1 = ArrayGenerator.ascendingInt(length)
        const arr2 = arr1.slice(lo, hi)

        sort(arr1, numberCompare, lo, hi)
        arr2.sort(numberCompare)

        let j = 0
        while (lo + j < hi) {
          expect(arr1[lo + j]).toBe(arr2[j])
          j++
        }
      }
    })
  })
})

describe('Sort Subrange of an Ascending Array with 3 Random Exchanges', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const lo = parseInt(length / 4)
        const hi = length - lo
        const arr1 = ArrayGenerator.ascending3RandomExchangesInt(length)
        const arr2 = arr1.slice(lo, hi)

        sort(arr1, numberCompare, lo, hi)
        arr2.sort(numberCompare)

        let j = 0
        while (lo + j < hi) {
          expect(arr1[lo + j]).toBe(arr2[j])
          j++
        }
      }
    })
  })
})

describe('Sort Subrange of an Ascending Array with 10 Random Elements at Last', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const lo = parseInt(length / 4)
        const hi = length - lo
        const arr1 = ArrayGenerator.ascending10RandomEndInt(length)
        const arr2 = arr1.slice(lo, hi)

        sort(arr1, numberCompare, lo, hi)
        arr2.sort(numberCompare)

        let j = 0
        while (lo + j < hi) {
          expect(arr1[lo + j]).toBe(arr2[j])
          j++
        }
      }
    })
  })
})

describe('Sort Subrange of an Array of all Equal Elements', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const lo = parseInt(length / 4)
        const hi = length - lo
        const arr1 = ArrayGenerator.allEqualInt(length)
        const arr2 = arr1.slice(lo, hi)

        sort(arr1, numberCompare, lo, hi)
        arr2.sort(numberCompare)

        let j = 0
        while (lo + j < hi) {
          expect(arr1[lo + j]).toBe(arr2[j])
          j++
        }
      }
    })
  })
})

describe('Sort Subrange of an Array with Many Duplicates', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const lo = parseInt(length / 4)
        const hi = length - lo
        const arr1 = ArrayGenerator.manyDuplicateInt(length)
        const arr2 = arr1.slice(lo, hi)

        sort(arr1, numberCompare, lo, hi)
        arr2.sort(numberCompare)

        let j = 0
        while (lo + j < hi) {
          expect(arr1[lo + j]).toBe(arr2[j])
          j++
        }
      }
    })
  })
})

describe('Sort Subrange of an Array with Some Duplicates', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const lo = parseInt(length / 4)
        const hi = length - lo
        const arr1 = ArrayGenerator.someDuplicateInt(length)
        const arr2 = arr1.slice(lo, hi)

        sort(arr1, numberCompare, lo, hi)
        arr2.sort(numberCompare)

        let j = 0
        while (lo + j < hi) {
          expect(arr1[lo + j]).toBe(arr2[j])
          j++
        }
      }
    })
  })
})

describe('Lexicographically Sort a Random Array', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const arr1 = ArrayGenerator.randomInt(length)
        const arr2 = arr1.slice()

        sort(arr1)
        arr2.sort()

        expect(arr1).toEqual(arr2)
      }
    })
  })
})

describe('Lexicographically Sort a Descending Array', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const arr1 = ArrayGenerator.descendingInt(length)
        const arr2 = arr1.slice()

        sort(arr1)
        arr2.sort()

        expect(arr1).toEqual(arr2)
      }
    })
  })
})

describe('Lexicographically Sort an Ascending Array', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const arr1 = ArrayGenerator.ascendingInt(length)
        const arr2 = arr1.slice()

        sort(arr1)
        arr2.sort()

        expect(arr1).toEqual(arr2)
      }
    })
  })
})

describe('Lexicographically Sort an Ascending Array with 3 Random Exchanges', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const arr1 = ArrayGenerator.ascending3RandomExchangesInt(length)
        const arr2 = arr1.slice()

        sort(arr1)
        arr2.sort()

        expect(arr1).toEqual(arr2)
      }
    })
  })
})

describe('Lexicographically Sort an Ascending Array with 10 Random Elements at Last', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const arr1 = ArrayGenerator.ascending10RandomEndInt(length)
        const arr2 = arr1.slice()

        sort(arr1)
        arr2.sort()

        expect(arr1).toEqual(arr2)
      }
    })
  })
})

describe('Lexicographically Sort an Array of all Equal Elements', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const arr1 = ArrayGenerator.allEqualInt(length)
        const arr2 = arr1.slice()

        sort(arr1)
        arr2.sort()

        expect(arr1).toEqual(arr2)
      }
    })
  })
})

describe('Lexicographically Sort an Array with Many Duplicates', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const arr1 = ArrayGenerator.manyDuplicateInt(length)
        const arr2 = arr1.slice()

        sort(arr1)
        arr2.sort()

        expect(arr1).toEqual(arr2)
      }
    })
  })
})

describe('Lexicographically Sort an Array with Some Duplicates', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const arr1 = ArrayGenerator.someDuplicateInt(length)
        const arr2 = arr1.slice()

        sort(arr1)
        arr2.sort()

        expect(arr1).toEqual(arr2)
      }
    })
  })
})

describe('Lexicographically Sort Subrange of a Random Array', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const lo = parseInt(length / 4)
        const hi = length - lo
        const arr1 = ArrayGenerator.randomInt(length)
        const arr2 = arr1.slice(lo, hi)

        sort(arr1, alphabeticalCompare, lo, hi)
        arr2.sort()

        let j = 0
        while (lo + j < hi) {
          expect(arr1[lo + j]).toBe(arr2[j])
          j++
        }
      }
    })
  })
})

describe('Lexicographically Sort Subrange of a Descending Array', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const lo = parseInt(length / 4)
        const hi = length - lo
        const arr1 = ArrayGenerator.descendingInt(length)
        const arr2 = arr1.slice(lo, hi)

        sort(arr1, alphabeticalCompare, lo, hi)
        arr2.sort()

        let j = 0
        while (lo + j < hi) {
          expect(arr1[lo + j]).toBe(arr2[j])
          j++
        }
      }
    })
  })
})

describe('Lexicographically Sort Subrange of an Ascending Array', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const lo = parseInt(length / 4)
        const hi = length - lo
        const arr1 = ArrayGenerator.ascendingInt(length)
        const arr2 = arr1.slice(lo, hi)

        sort(arr1, alphabeticalCompare, lo, hi)
        arr2.sort()

        let j = 0
        while (lo + j < hi) {
          expect(arr1[lo + j]).toBe(arr2[j])
          j++
        }
      }
    })
  })
})

describe('Lexicographically Sort Subrange of an Ascending Array with 3 Random Exchanges', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const lo = parseInt(length / 4)
        const hi = length - lo
        const arr1 = ArrayGenerator.ascending3RandomExchangesInt(length)
        const arr2 = arr1.slice(lo, hi)

        sort(arr1, alphabeticalCompare, lo, hi)
        arr2.sort()

        let j = 0
        while (lo + j < hi) {
          expect(arr1[lo + j]).toBe(arr2[j])
          j++
        }
      }
    })
  })
})

describe('Lexicographically Sort Subrange of an Ascending Array with 10 Random Elements at Last', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const lo = parseInt(length / 4)
        const hi = length - lo
        const arr1 = ArrayGenerator.ascending10RandomEndInt(length)
        const arr2 = arr1.slice(lo, hi)

        sort(arr1, alphabeticalCompare, lo, hi)
        arr2.sort()

        let j = 0
        while (lo + j < hi) {
          expect(arr1[lo + j]).toBe(arr2[j])
          j++
        }
      }
    })
  })
})

describe('Lexicographically Sort Subrange of an Array of all Equal Elements', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const lo = parseInt(length / 4)
        const hi = length - lo
        const arr1 = ArrayGenerator.allEqualInt(length)
        const arr2 = arr1.slice(lo, hi)

        sort(arr1, alphabeticalCompare, lo, hi)
        arr2.sort()

        let j = 0
        while (lo + j < hi) {
          expect(arr1[lo + j]).toBe(arr2[j])
          j++
        }
      }
    })
  })
})

describe('Lexicographically Sort Subrange of an Array with Many Duplicates', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const lo = parseInt(length / 4)
        const hi = length - lo
        const arr1 = ArrayGenerator.manyDuplicateInt(length)
        const arr2 = arr1.slice(lo, hi)

        sort(arr1, alphabeticalCompare, lo, hi)
        arr2.sort()

        let j = 0
        while (lo + j < hi) {
          expect(arr1[lo + j]).toBe(arr2[j])
          j++
        }
      }
    })
  })
})

describe('Lexicographically Sort Subrange of an Array with Some Duplicates', () => {
  lengths.forEach(length => {
    it(`Should sort a size ${length} array`, () => {
      for (let i = 0; i < repetitions; i++) {
        const lo = parseInt(length / 4)
        const hi = length - lo
        const arr1 = ArrayGenerator.someDuplicateInt(length)
        const arr2 = arr1.slice(lo, hi)

        sort(arr1, alphabeticalCompare, lo, hi)
        arr2.sort()

        let j = 0
        while (lo + j < hi) {
          expect(arr1[lo + j]).toBe(arr2[j])
          j++
        }
      }
    })
  })
})
