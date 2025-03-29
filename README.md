# timsort2: node-timsort reloaded

<p align="center">
<h1 align="center">The fastest sub-range sorting algorithm!</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/timsort2"><img src="https://img.shields.io/npm/v/timsort2?style=for-the-badge&logo=npm"/></a>
  <a href="https://npmtrends.com/timsort2"><img src="https://img.shields.io/npm/dm/timsort2?style=for-the-badge"/></a>
  <a href="https://bundlephobia.com/package/timsort2"><img src="https://img.shields.io/bundlephobia/minzip/timsort2?style=for-the-badge"/></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/Torathion/timsort2?style=for-the-badge"/></a>
  <a href="https://codecov.io/gh/torathion/timsort2"><img src="https://codecov.io/gh/torathion/timsort2/branch/main/graph/badge.svg?style=for-the-badge" /></a>
  <a href="https://github.com/torathion/timsort2/actions"><img src="https://img.shields.io/github/actions/workflow/status/torathion/timsort2/build.yml?style=for-the-badge&logo=esbuild"/></a>
   <a href="https://github.com/prettier/prettier#readme"><img alt="code style" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge&logo=prettier"></a>
</p>
</p>

This is a fork of [timsort](https://www.npmjs.com/package/timsort), a package that has been last updated 9 years ago (24th July 2016). During this time, JavaScript developed tremendously, offering new ways to be faster and write less code, while its ecosystem has set up new requirements for modern JS development. `timsort2` tries to add all of those new things into this package, because `timsort` still acts as an extremely fast sub-range sorting algorithm.

Additionally, `timsort` optimized the original code and now comes with:

- 33% reduced bundle size (5.2KB -> 3.9KB)
- 10% - 60% faster sorting
- Less overhead (less function calls / object creations / variables)
- ESM and CJS build
- TypeScript support
- Better `array.sort` compatibility for easier migration
- Typed array support

Some words from the previous version:

An adaptive and **stable** sort algorithm based on merging that requires fewer than `n * log(n)` comparisons when run on partially sorted arrays. The algorithm uses `O(n)` memory and still runs in `O(n * log(n))` (worst case) on random arrays. This implementation is based on the original [TimSort](http://svn.python.org/projects/python/trunk/Objects/listsort.txt) developed by Tim Peters for Python's lists (code [here](http://svn.python.org/projects/python/trunk/Objects/listobject.c)). TimSort has been also adopted in Java starting from version 7.

## Usage

Install the package:

```powershell
pnpm i timsort
```

And use it:

```typescript
import { alphabeticalCompare, sort, type Comparator } from 'timsort2'

// 1. Simple
var arr = [...];
// Returns the sorted array, just like `array.sort`
arr = sort(arr);

// 2. Sorting only a specific part
// Only sorts the indices 0 - 5.
// BREAKING: For better performance and less parameter handling inside timsort2, you HAVE to include a comparator when sorting a sub range.
arr = sort(arr, alphabeticalCompare, 0, 5)

// 3. With custom comparator

const numberCompare: Comparator<number> = (a: number, b: number) => number
arr = sort(arr, numberCompare)
```

## Performance

The sorting algorithm of `timsort2` is on par with the native `array.sort`, but sometimes up to 5% faster than it! It's main strength is sorting only particular parts of an array, by giving a start and end index, performing an [in-place](https://en.wikipedia.org/wiki/In-place_algorithm) sort. This drastically saves a lot of memory and performance for algorithms that need to sort only parts of an array.

Additionally, `timsort2` is around 10% to 60% faster, but due to the primitive nature of the benchmarks, it seems like the package is slower. This is due to GC calls and premature optimizations from NodeJS that block the tests, receiving varying results. I can assure you that the algorithm is still identical and `timsort2` only adds micro optimizations to reduce the number of function calls, variables and object creations for less GC work.

These data strongly depend on the Node.js version and the machine on which the benchmark is run. I strongly encourage you to run the benchmark on your own setup with:

```powershell
npm run build
npm run bench
```

### Benchmarks

:warning: These are benchmarks of the old `timsort` package, updated to show the comparison between `timsort` and `timsort2`. They are showing that `timsort2` is almost always 50% faster than native `array.sort`, but this heavily rigged due to GC interrupting the benchmarks. In reality, it's more like -1% to 5% faster than native `array.sort`. See [here](https://github.com/Torathion/timsort2/issues/6) for more information.

The benchmarks are provided in `benchmark/index.ts`. They compare the `timsort2` module against the default `array.sort` method and the old `timsort` package in the numerical sorting of different types of integer array (as described [here](http://svn.python.org/projects/python/trunk/Objects/listsort.txt)):

- *Random array*
- *Descending array*
- *Ascending array*
- *Ascending array with 3 random exchanges*
- *Ascending array with 10 random numbers in the end*
- *Array of equal elements*
- *Random Array with many duplicates*
- *Random Array with some duplicates*

For any of the array types the sorting is repeated several times and for
different array sizes, average execution time is then printed.
I run the benchmark on Node v22.13.0, obtaining the following values:

```powershell
┌──────────────────────────────┬────────────────────┬──────────┬───────────────┬────────────────────┬─────────────────┬─────────────┐
│ ArrayType                    │ Length             │ Time de… │ Time old      │ Time new           │ Speedup default │ Speedup old │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ randomInt                    │ 10                 │ 753      │ 332           │ 327                │ 2.30            │ 1.02        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ randomInt                    │ 100                │ 10758    │ 6222          │ 6508               │ 1.65            │ 0.96        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ randomInt                    │ 1000               │ 153182   │ 103254        │ 94489              │ 1.62            │ 1.09        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ randomInt                    │ 10000              │ 1969771  │ 1541405       │ 1258359            │ 1.57            │ 1.22        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ descendingInt                │ 10                 │ 312      │ 226           │ 228                │ 1.37            │ 0.99        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ descendingInt                │ 100                │ 1440     │ 631           │ 509                │ 2.83            │ 1.24        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ descendingInt                │ 1000               │ 12710    │ 3197          │ 2573               │ 4.94            │ 1.24        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ descendingInt                │ 10000              │ 124059   │ 24616         │ 24055              │ 5.16            │ 1.02        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascendingInt                 │ 10                 │ 312      │ 227           │ 214                │ 1.46            │ 1.06        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascendingInt                 │ 100                │ 1422     │ 591           │ 501                │ 2.84            │ 1.18        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascendingInt                 │ 1000               │ 12486    │ 3117          │ 2512               │ 4.97            │ 1.24        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascendingInt                 │ 10000              │ 123832   │ 23840         │ 23198              │ 5.34            │ 1.03        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascending3RandomExchangesInt │ 10                 │ 473      │ 295           │ 277                │ 1.70            │ 1.06        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascending3RandomExchangesInt │ 100                │ 3139     │ 1181          │ 1109               │ 2.83            │ 1.07        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascending3RandomExchangesInt │ 1000               │ 14075    │ 3864          │ 4281               │ 3.29            │ 0.90        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascending3RandomExchangesInt │ 10000              │ 132266   │ 33468         │ 32791              │ 4.03            │ 1.02        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascending10RandomEndInt      │ 10                 │ 637      │ 419           │ 411                │ 1.55            │ 1.02        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascending10RandomEndInt      │ 100                │ 2829     │ 1627          │ 1525               │ 1.86            │ 1.07        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascending10RandomEndInt      │ 1000               │ 15562    │ 8514          │ 5481               │ 2.84            │ 1.55        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascending10RandomEndInt      │ 10000              │ 137841   │ 38439         │ 37720              │ 3.65            │ 1.02        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ allEqualInt                  │ 10                 │ 312      │ 225           │ 225                │ 1.39            │ 1.00        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ allEqualInt                  │ 100                │ 1429     │ 586           │ 495                │ 2.88            │ 1.18        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ allEqualInt                  │ 1000               │ 12419    │ 3130          │ 2503               │ 4.96            │ 1.25        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ allEqualInt                  │ 10000              │ 123531   │ 23688         │ 23101              │ 5.35            │ 1.03        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ manyDuplicateInt             │ 10                 │ 624      │ 406           │ 395                │ 1.58            │ 1.03        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ manyDuplicateInt             │ 100                │ 9785     │ 6676          │ 6434               │ 1.52            │ 1.04        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ manyDuplicateInt             │ 1000               │ 143777   │ 106532        │ 97154              │ 1.48            │ 1.10        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ manyDuplicateInt             │ 10000              │ 1875592  │ 1462142       │ 1294339            │ 1.45            │ 1.13        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ someDuplicateInt             │ 10                 │ 645      │ 423           │ 414                │ 1.56            │ 1.02        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ someDuplicateInt             │ 100                │ 9773     │ 6671          │ 6414               │ 1.52            │ 1.04        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ someDuplicateInt             │ 1000               │ 142846   │ 105365        │ 96549              │ 1.48            │ 1.09        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ someDuplicateInt             │ 10000              │ 1855327  │ 1459931       │ 1294417            │ 1.43            │ 1.13        │
└──────────────────────────────┴────────────────────┴──────────┴───────────────┴────────────────────┴─────────────────┴─────────────┘
```

## Stability

With `array.sort` now being stable, most other sorting algorithms are now either deprecated or slower than `array.sort`. In fact, `timsort2` sacrifices stability for better performance. While `array.sort` supporting array sizes up to `1^63` and beyond, `timsort2` only supports array sizes up to `1^31` before causing overflow errors. This is due to the nature of bitwise operators. Those behave differently from other languages as numbers are always interpreted as int32. JavaScript does support bigger numbers, but has to cast them into those data types, internally, it still works with 32bit integers or 64bit floats. And bitwise operators only work with int32 numbers.
