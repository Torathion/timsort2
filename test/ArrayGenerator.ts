export default class ArrayGenerator {
  /**
   * Generates an array of random integers.
   * @param n - The length of the array to generate.
   * @returns An array of random integers.
   */
  public static randomInt(n: number): number[] {
    const arr: number[] = new Array(n)
    for (let i = 0; i < n; i++) {
      arr[i] = (Math.random() * 9007199254740992) | 0
    }
    return arr
  }

  /**
   * Generates an array of integers in descending order.
   * @param n - The length of the array to generate.
   * @returns An array of integers in descending order.
   */
  public static descendingInt(n: number): number[] {
    const arr: number[] = new Array(n)
    for (let i = 0; i < n; i++) {
      arr[i] = (n - 1)
    }
    return arr
  }

  /**
   * Generates an array of integers in ascending order.
   * @param n - The length of the array to generate.
   * @returns An array of integers in ascending order.
   */
  public static ascendingInt(n: number): number[] {
    const arr: number[] = new Array(n)
    for (let i = 0; i < n; i++) {
      arr[i] = i
    }
    return arr
  }

  /**
   * Generates an array of integers in ascending order with 3 random exchanges.
   * @param n - The length of the array to generate.
   * @returns An array of integers with 3 random exchanges.
   */
  public static ascending3RandomExchangesInt(n: number): number[] {
    const arr: number[] = new Array(n)
    for (let i = 0; i < n; i++) {
      arr[i] = i
    }
    for (let i = 0; i < 1; i++) {
      const first = (Math.random() * n) | 0
      const second = (Math.random() * n) | 0
      const tmp = arr[first]
      arr[first] = arr[second]
      arr[second] = tmp
    }
    return arr
  }

  /**
   * Generates an array of integers in ascending order with the last 10 elements randomized.
   * @param n - The length of the array to generate.
   * @returns An array of integers with the last 10 elements randomized.
   */
  public static ascending10RandomEndInt(n: number): number[] {
    const arr: number[] = new Array(n)
    for (let i = 0; i < n; i++) {
      arr[i] = i
    }
    const endStart: number = Math.max(0, n - 10)
    for (let i = endStart; i < n; i++) {
      arr[i] = (Math.random() * n) | 0
    }
    return arr
  }

  /**
   * Generates an array of integers where all elements are equal.
   * @param n - The length of the array to generate.
   * @returns An array of equal integers (all 42).
   */
  public static allEqualInt(n: number): number[] {
    const arr: number[] = new Array(n)
    for (let i = 0; i < n; i++) {
      arr[i] = 42
    }
    return arr
  }

  /**
   * Generates an array of integers with many duplicates.
   * @param n - The length of the array to generate.
   * @returns An array of integers with many duplicates.
   */
  public static manyDuplicateInt(n: number): number[] {
    const arr: number[] = new Array(n)
    for (let i = 0; i < n; i++) {
      arr[i] = (Math.random() * ((n / 2) * (Math.log(n) / Math.LN10))) | 0
    }
    return arr
  }

  /**
   * Generates an array of integers with some duplicates.
   * @param n - The length of the array to generate.
   * @returns An array of integers with some duplicates.
   */
  public static someDuplicateInt(n: number): number[] {
    const arr: number[] = new Array(n)
    for (let i = 0; i < n; i++) {
      arr[i] = (Math.random() * n) | 0
    }
    return arr
  }
}
