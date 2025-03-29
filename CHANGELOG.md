# CHANGELOG

## [1.0.6] 03-29-2025

- Rebrand as an extremely fast sub-range sorting algorithm.
- Reuse buffers to reduce memory overhead
- Make offset check branchless

## [1.0.5] 03-16-2025

- Reduce number of used variables

## [1.0.4] 03-15-2025

- Use `Uint32Array` instead of number arrays to keep track of merge run statistics
- Inline more values for better performance
- Optimize `alphabeticalCompare`

## [1.0.3] 03-15-2025

- Move typestar to dependencies [#2](https://github.com/Torathion/timsort2/pull/2) by @SukkaW

## [1.0.2] 03-15-2025

- Fix types not being found.

## [1.0.1] 03-15-2025

- Fix error of `sort` function not found.
