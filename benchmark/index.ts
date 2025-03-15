import Table from 'cli-table3'
import ArrayGenerator from '../test/ArrayGenerator'
import { sort } from '../src'
import Timsort from 'timsort'

// Define the comparison function for sorting
const numberCompare = (a: number, b: number): number => a - b

// Define array lengths to benchmark
const lengths: number[] = [10, 100, 1000, 10000]

// Calculate repetitions based on array length
const repetitionsFromLength = (n: number): number => Math.floor(12000000 / (n * (Math.log(n) / Math.LN10)))

interface Times {
  defaultTime: number
  timsortTime: number
  oldTimsortTime: number
  method?: string
  speedUpDefault?: string
  speedUpRevival?: string
}

// BenchmarkRunner class to handle the benchmarking logic
class BenchmarkRunner {
  private table: InstanceType<typeof Table>

  constructor() {
    // Initialize the cli-table3 table with column definitions
    this.table = new Table({
      head: ['ArrayType', 'Length', 'Time default', 'Time old', 'Time new', 'Speedup default', 'Speedup old'],
      colWidths: [30, 20, 10, 15, 20], // Adjusted widths for clarity
      style: { head: ['cyan'] }
    })
  }

  // Run the benchmark for all array generators and lengths
  public runBenchmark(): void {
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

    if (generatorMethods.length === 0) {
      console.log('No generator methods available to process.')
      return
    }

    for (const { name: generatorName, fn: generator } of generatorMethods) {
      for (const length of lengths) {
        console.log(`Benchmarking ${generatorName} with length ${length}`)

        try {
          const { defaultTime, timsortTime, oldTimsortTime } = this.benchmarkGenerator(generator, length)
          this.table.push([
            generatorName,
            length.toString(),
            Math.floor(defaultTime).toString(),
            Math.floor(oldTimsortTime).toString(),
            Math.floor(timsortTime).toString(),
            timsortTime !== 0 ? (defaultTime / timsortTime).toFixed(2) : 'N/A',
            timsortTime !== 0 ? (oldTimsortTime / timsortTime).toFixed(2) : 'N/A'
          ])
        } catch (err) {
          console.error(`Error benchmarking ${generatorName} with length ${length}:`, err)
        }
      }
    }

    // Print the entire table at the end
    console.log(this.table.toString())
  }

  // Benchmark a single generator for a specific length
  private benchmarkGenerator(generator: (n: number) => number[], length: number): Times {
    let defaultTime = 0
    let timsortTime = 0
    let oldTimsortTime = 0
    const repetitions = repetitionsFromLength(length)

    console.log(`Running ${repetitions} repetitions for length ${length}`)

    for (let i = 0; i < repetitions; i++) {
      const arr1 = generator(length)
      const arr2 = arr1.slice()
      const arr3 = arr1.slice()

      if (!Array.isArray(arr1) || !Array.isArray(arr2) || !Array.isArray(arr3)) {
        throw new Error(`Generator returned invalid array for length ${length}`)
      }

      // Benchmark array.sort
      const startDefault = process.hrtime()
      arr1.sort(numberCompare)
      const stopDefault = process.hrtime()

      const startDefaultNano = startDefault[0] * 1_000_000_000 + startDefault[1]
      const stopDefaultNano = stopDefault[0] * 1_000_000_000 + stopDefault[1]
      defaultTime += stopDefaultNano - startDefaultNano

      // Benchmark Revival (Old TimSort)
      const startOldTimsort = process.hrtime()
      Timsort.sort(arr3, numberCompare)
      const stopOldTimsort = process.hrtime()

      const startOldTimsortNano = startOldTimsort[0] * 1_000_000_000 + startOldTimsort[1]
      const stopOldTimsortNano = stopOldTimsort[0] * 1_000_000_000 + stopOldTimsort[1]
      oldTimsortTime += stopOldTimsortNano - startOldTimsortNano

      // Benchmark TimSort
      const startTimsort = process.hrtime()
      sort(arr2, numberCompare)
      const stopTimsort = process.hrtime()

      const startTimsortNano = startTimsort[0] * 1_000_000_000 + startTimsort[1]
      const stopTimsortNano = stopTimsort[0] * 1_000_000_000 + stopTimsort[1]
      timsortTime += stopTimsortNano - startTimsortNano
    }

    return {
      defaultTime: defaultTime / repetitions,
      timsortTime: timsortTime / repetitions,
      oldTimsortTime: oldTimsortTime / repetitions
    }
  }
}

// Run the benchmark
console.log('Starting benchmark...')
const benchmark = new BenchmarkRunner()
benchmark.runBenchmark()
console.log('Benchmark completed.')
