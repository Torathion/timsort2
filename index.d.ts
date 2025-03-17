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
  export function sort<T>(array: T[], compare?: Comparator<T>, lo?: number, hi?: number): T[]
  export function sort<T extends ArrayBufferLike>(array: Int8Array<T>, compare?: Comparator<T>, lo?: number, hi?: number): Int8Array<T>
  export function sort<T extends ArrayBufferLike>(array: Int32Array<T>, compare?: Comparator<T>, lo?: number, hi?: number): Int32Array
  export function sort<T extends ArrayBufferLike>(array: Uint8Array<T>, compare?: Comparator<T>, lo?: number, hi?: number): Uint8Array<T>
  export function sort<T extends ArrayBufferLike>(array: Uint16Array<T>, compare?: Comparator<T>, lo?: number, hi?: number): Uint16Array<T>
  export function sort<T extends ArrayBufferLike>(array: Uint32Array<T>, compare?: Comparator<T>, lo?: number, hi?: number): Uint32Array<T>
  export function sort<T extends ArrayBufferLike>(array: Float32Array<T>, compare?: Comparator<T>, lo?: number, hi?: number): Float32Array<T>
  export function sort<T extends ArrayBufferLike>(array: Float64Array<T>, compare?: Comparator<T>, lo?: number, hi?: number): Float64Array<T>
  export function sort<T extends ArrayBufferLike>(array: Uint8ClampedArray<T>, compare?: Comparator<T>, lo?: number, hi?: number): Uint8ClampedArray<T>
  export function sort<T extends ArrayBufferLike>(array: Uint8ClampedArray<T>, compare?: Comparator<T>, lo?: number, hi?: number): Uint8ClampedArray<T>
  export function sort<T extends ArrayBufferLike>(array: BigInt64Array<T>, compare?: Comparator<T>, lo?: number, hi?: number): BigInt64Array<T>
  export function sort<T extends ArrayBufferLike>(array: BigUint64Array<T>, compare?: Comparator<T>, lo?: number, hi?: number): BigUint64Array<T>
}
