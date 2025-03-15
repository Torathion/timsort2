# timsort2: node-timsort reloaded

<p align="center">
<h1 align="center">Sort up to 5 times faster! Now smaller and even faster!</h1>
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

This is a fork of [timsort](https://www.npmjs.com/package/timsort), a package that has been last updated 9 years ago (24th July 2016). During this time, JavaScript developed tremendously, offering new ways to be faster and write less code, while its ecosystem has set up new requirements for modern JS development. `timsort2` tries to add all of those new things into this package, because `timsort` is [STILL FASTER](#benchmarks) than `array.sort`, even though `array.sort` got some performance improvements.

Additionally, `timsort` optimized the original code and now comes with:

- 33% reduced bundle size (5.2KB -> 3.9KB)
- 5% - 50% faster sorting
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

`TimSort.sort` **is faster** than `array.sort` on almost all of the tested array types. In general, the more ordered the array is the better `TimSort.sort` performs with respect to `array.sort` (up to 8 times faster on already sorted arrays). And also, in general, the bigger the array the more we benefit from using the `timsort` module.

Additionally, `timsort2` is around 5% to 50% faster, but due to the primitive nature of the benchmarks, it seems like the package is slower. This is due to GC calls and premature optimizations from NodeJS that block the tests, receiving varying results. I can assure you that the algorithm is still identical and `timsort2` only adds micro optimizations to reduce the number of function calls, variables and object creations for less GC work.

These data strongly depend on the Node.js version and the machine on which the benchmark is run. I strongly encourage you to run the benchmark on your own setup with:

```powershell
npm run build
npm run bench
```

### Benchmarks

A benchmark is provided in `benchmark/index.ts`. It compares the `timsort` module against the default `array.sort` method and the old `timsort` package in the numerical sorting of different types of integer array (as described [here](http://svn.python.org/projects/python/trunk/Objects/listsort.txt)):

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
│ randomInt                    │ 10                 │ 676      │ 320           │ 320                │ 2.11            │ 1.00        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ randomInt                    │ 100                │ 11209    │ 5712          │ 6019               │ 1.86            │ 0.95        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ randomInt                    │ 1000               │ 165493   │ 91890         │ 91565              │ 1.81            │ 1.00        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ randomInt                    │ 10000              │ 2293254  │ 1250329       │ 1268879            │ 1.81            │ 0.99        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ descendingInt                │ 10                 │ 350      │ 317           │ 291                │ 1.20            │ 1.09        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ descendingInt                │ 100                │ 1537     │ 816           │ 790                │ 1.94            │ 1.03        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ descendingInt                │ 1000               │ 15535    │ 4024          │ 4522               │ 3.43            │ 0.89        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ descendingInt                │ 10000              │ 135298   │ 28513         │ 28771              │ 4.70            │ 0.99        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascendingInt                 │ 10                 │ 328      │ 219           │ 207                │ 1.58            │ 1.06        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascendingInt                 │ 100                │ 1430     │ 425           │ 483                │ 2.96            │ 0.88        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascendingInt                 │ 1000               │ 12546    │ 1938          │ 2375               │ 5.28            │ 0.82        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascendingInt                 │ 10000              │ 124829   │ 26932         │ 17062              │ 7.32            │ 1.58        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascending3RandomExchangesInt │ 10                 │ 458      │ 298           │ 274                │ 1.67            │ 1.09        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascending3RandomExchangesInt │ 100                │ 3060     │ 1039          │ 991                │ 3.09            │ 1.05        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascending3RandomExchangesInt │ 1000               │ 14369    │ 4116          │ 2988               │ 4.81            │ 1.38        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascending3RandomExchangesInt │ 10000              │ 137179   │ 39406         │ 25568              │ 5.37            │ 1.54        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascending10RandomEndInt      │ 10                 │ 640      │ 416           │ 403                │ 1.59            │ 1.03        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascending10RandomEndInt      │ 100                │ 2786     │ 1408          │ 1356               │ 2.05            │ 1.04        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascending10RandomEndInt      │ 1000               │ 15530    │ 4815          │ 4115               │ 3.77            │ 1.17        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ ascending10RandomEndInt      │ 10000              │ 134392   │ 26214         │ 26122              │ 5.14            │ 1.00        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ allEqualInt                  │ 10                 │ 320      │ 214           │ 198                │ 1.62            │ 1.08        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ allEqualInt                  │ 100                │ 1425     │ 427           │ 403                │ 3.54            │ 1.06        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ allEqualInt                  │ 1000               │ 12464    │ 1849          │ 2135               │ 5.84            │ 0.87        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ allEqualInt                  │ 10000              │ 122069   │ 15485         │ 15558              │ 7.85            │ 1.00        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ manyDuplicateInt             │ 10                 │ 607      │ 398           │ 386                │ 1.57            │ 1.03        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ manyDuplicateInt             │ 100                │ 9886     │ 6049          │ 5996               │ 1.65            │ 1.01        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ manyDuplicateInt             │ 1000               │ 142210   │ 91279         │ 91106              │ 1.56            │ 1.00        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ manyDuplicateInt             │ 10000              │ 1896399  │ 1267961       │ 1263132            │ 1.50            │ 1.00        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ someDuplicateInt             │ 10                 │ 612      │ 413           │ 401                │ 1.52            │ 1.03        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ someDuplicateInt             │ 100                │ 9901     │ 6069          │ 6010               │ 1.65            │ 1.01        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ someDuplicateInt             │ 1000               │ 142366   │ 91415         │ 91298              │ 1.56            │ 1.00        │
├──────────────────────────────┼────────────────────┼──────────┼───────────────┼────────────────────┼─────────────────┼─────────────┤
│ someDuplicateInt             │ 10000              │ 1856135  │ 1242881       │ 1242006            │ 1.49            │ 1.00        │
└──────────────────────────────┴────────────────────┴──────────┴───────────────┴────────────────────┴─────────────────┴─────────────┘
```

Please also notice that:

-  This benchmark is far from exhaustive. Several cases are not considered and the results must be taken as partial
-  *inlining* is surely playing an active role in `timsort` module's good performance
-  A more accurate comparison of the algorithms would require implementing `array.sort` in pure javascript and counting element comparisons. `array.sort` in fact calls an underlying C++ function from V8 directly.

## Stability

With `array.sort` now being stable, most other sorting algorithms are now either deprecated or slower than `array.sort`. In fact, `timsort2` sacrifices stability for better performance. While `array.sort` supporting array sizes up to `1^63` and beyond, `timsort2` only supports array sizes up to `1^31` before causing overflow errors. This is due to the nature of bitwise operators. Those behave differently from other languages as numbers are always interpreted as int32. JavaScript does support bigger numbers, but has to cast them into those data types, internally, it still works with 32bit integers or 64bit floats. And bitwise operators only work with int32 numbers.
