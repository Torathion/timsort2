import { AnyArray } from 'typestar'

declare module 'timsort2' {
  /**
   *  Type representing a comparator function used for sorting an array.
   */
  export type Comparator<T> = (a: T, b: T) => number
  /**
   * Default alphabetical comparison of items.
   *
   * @param a - First element to compare.
   * @param b - Second element to compare.
   * @return - A positive number if a.toString() > b.toString(), a
   * negative number if .toString() < b.toString(), 0 otherwise.
   */
  export function alphabeticalCompare(a: any, b: any): number
  /**
   * Sort an array in the range [lo, hi) using TimSort.
   *
   * @param array - The array to sort.
   * @param compare - Item comparison function. Default is `alphabeticalCompare`
   * @param lo - First element in the range (inclusive).
   * @param hi - Last element in the range.
   */
  export function sort<T>(array: AnyArray<T>, compare?: Comparator<T>, lo?: number, hi?: number): AnyArray<T>
}
