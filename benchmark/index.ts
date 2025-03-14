import ArrayGenerator from '../test/ArrayGenerator' // Ensure the path is correct
import timsort from '../src' // Ensure the path is correct (or mock it if unavailable)

// Define the comparison function for sorting
const numberCompare = (a: number, b: number): number => a - b

// Define array lengths to benchmark
const lengths: number[] = [10, 100, 1000, 10000]

// Calculate repetitions based on array length
const repetitionsFromLength = (n: number): number => Math.floor(12000000 / (n * (Math.log(n) / Math.LN10)))

// PrettyPrinter class for formatting output
class PrettyPrinter {
  private str: string

  constructor() {
    this.str = ''
  }

  public addAt(value: string | number, at: number): void {
    while (at > this.str.length) {
      this.str += ' '
    }
    this.str += value.toString()
  }

  public toString(): string {
    return this.str
  }
}

// BenchmarkRunner class to handle the benchmarking logic
class BenchmarkRunner {
  private defaultResults: Record<string, Record<number, number>>
  private timsortResults: Record<string, Record<number, number>>

  constructor() {
    this.defaultResults = {}
    this.timsortResults = {}
  }

  // Run the benchmark for all array generators and lengths
  public runBenchmark(): void {
    // Print header
    const headerPrinter = new PrettyPrinter()
    headerPrinter.addAt('ArrayType', 0)
    headerPrinter.addAt('Length', 30)
    headerPrinter.addAt('TimSort', 37)
    headerPrinter.addAt('array.sort', 47)
    headerPrinter.addAt('Speedup', 59)
    console.log(headerPrinter.toString())

    // Explicitly list the generator methods we expect
    const generatorMethods: { name: string; fn: (n: number) => number[] }[] = [
      { name: 'randomInt', fn: ArrayGenerator.randomInt },
      { name: 'descendingInt', fn: ArrayGenerator.descendingInt },
      { name: 'ascendingInt', fn: ArrayGenerator.ascendingInt },
      { name: 'ascending3RandomExchangesInt', fn: ArrayGenerator.ascending3RandomExchangesInt },
      { name: 'ascending10RandomEndInt', fn: ArrayGenerator.ascending10RandomEndInt },
      { name: 'allEqualInt', fn: ArrayGenerator.allEqualInt },
      { name: 'manyDuplicateInt', fn: ArrayGenerator.manyDuplicateInt },
      { name: 'someDuplicateInt', fn: ArrayGenerator.someDuplicateInt }
    ]

    for (const { name: generatorName, fn: generator } of generatorMethods) {
      this.defaultResults[generatorName] = {}
      this.timsortResults[generatorName] = {}

      for (const length of lengths) {
        const { defaultTime, timsortTime } = this.benchmarkGenerator(generator, length)
        this.defaultResults[generatorName][length] = defaultTime
        this.timsortResults[generatorName][length] = timsortTime

        // Print results for this run
        const printer = new PrettyPrinter()
        printer.addAt(generatorName, 0)
        printer.addAt(length, 30)
        printer.addAt(Math.floor(timsortTime), 37)
        printer.addAt(Math.floor(defaultTime), 47)
        const speedup = timsortTime !== 0 ? (defaultTime / timsortTime).toFixed(2) : 'N/A'
        printer.addAt(speedup, 59)
        console.log(printer.toString())
      }
    }
  }

  // Benchmark a single generator for a specific length
  private benchmarkGenerator(generator: (n: number) => number[], length: number): { defaultTime: number; timsortTime: number } {
    let defaultTime = 0
    let timsortTime = 0
    const repetitions = repetitionsFromLength(length)
    for (let i = 0; i < repetitions; i++) {
      const arr1 = generator(length)
      const arr2 = arr1.slice()

      // Benchmark array.sort
      const startDefault = process.hrtime()
      arr1.sort(numberCompare)
      const stopDefault = process.hrtime()

      const startDefaultNano = startDefault[0] * 1_000_000_000 + startDefault[1]
      const stopDefaultNano = stopDefault[0] * 1_000_000_000 + stopDefault[1]
      defaultTime += stopDefaultNano - startDefaultNano

      // Benchmark TimSort
      const startTimsort = process.hrtime()
      timsort(arr2, numberCompare)
      const stopTimsort = process.hrtime()

      const startTimsortNano = startTimsort[0] * 1_000_000_000 + startTimsort[1]
      const stopTimsortNano = stopTimsort[0] * 1_000_000_000 + stopTimsort[1]
      timsortTime += stopTimsortNano - startTimsortNano
    }

    return {
      defaultTime: defaultTime / repetitions,
      timsortTime: timsortTime / repetitions
    }
  }

  // Getters for results
  public getDefaultResults(): Record<string, Record<number, number>> {
    return this.defaultResults
  }

  public getTimsortResults(): Record<string, Record<number, number>> {
    return this.timsortResults
  }
}

// Run the benchmark
console.log('Starting benchmark...')
const benchmark = new BenchmarkRunner()
benchmark.runBenchmark()
console.log('Benchmark completed.')
