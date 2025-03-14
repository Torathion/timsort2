import { build } from 'esbuild'

const buildOptions = {
  entryPoints: ['./src/index.ts'],
  bundle: true,
  minify: true,
  platform: 'node',
  sourcemap: false,
  target: 'es2022',
  logLevel: 'info',
  packages: 'external'
}

// Build ESM version
await build({
  ...buildOptions,
  format: 'esm',
  outfile: './dist/index.mjs' // Specify the output file for ESM
}).catch(err => {
  console.error(err)
  process.exit(1)
})

// Build CJS version
await build({
  ...buildOptions,
  format: 'cjs',
  outfile: './dist/index.js' // Specify the output file for CJS
}).catch(err => {
  console.error(err)
  process.exit(1)
})
