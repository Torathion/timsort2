function zeroOutTypedArrayFill(typedArray) {
  typedArray.fill(0);
}

function zeroOutTypedArrayLoop(typedArray) {
  for (let i = 0; i < typedArray.length; i++) {
    typedArray[i] = 0;
  }
}

function zeroOutTypedArraySetSameSize(typedArray) {
  const zeroBuffer = new Uint32Array(typedArray.length); // Create same-size zeroed array
  typedArray.set(zeroBuffer); // Copy zeros using set()
}

function benchmarkZeroingMethods(arraySize) {
  const typedArrayFill = new Uint32Array(arraySize);
  const typedArraySetSame = new Uint32Array(arraySize);
  const typedArrayLoop = new Uint32Array(arraySize);

  const fillStartTime = performance.now();
  typedArrayFill.fill(0);
  const fillEndTime = performance.now();
  const fillTime = fillEndTime - fillStartTime;

  const setSameStartTime = performance.now();
  zeroOutTypedArraySetSameSize(typedArraySetSame);
  const setSameEndTime = performance.now();
  const setSameTime = setSameEndTime - setSameStartTime;

  const loopStartTime = performance.now();
  zeroOutTypedArrayLoop(typedArrayLoop);
  const loopEndTime = performance.now();
  const loopTime = loopEndTime - loopStartTime;

  console.log(`Array Size: ${arraySize}`);
  console.log(`fill() time: ${fillTime} ms`);
  console.log(`set() same size time: ${setSameTime} ms`);
  console.log(`loop time: ${loopTime} ms`);
}

benchmarkZeroingMethods(1000000);
