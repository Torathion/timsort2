
console.time('direct')
for (let i = 0; i < 1e10; i++) (i + (i + 1)) >>> 1
console.timeEnd('direct')

console.time('cast')
for (let i = 0; i < 1e10; i++) (i + (i + 1)) >> 1
console.timeEnd('cast')
