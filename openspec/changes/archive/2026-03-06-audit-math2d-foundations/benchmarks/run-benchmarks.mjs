/**
 * Performance benchmarks for audit-math2d-foundations
 * Tasks 14.1-14.5, 14.7-14.8
 *
 * Run: node openspec/changes/audit-math2d-foundations/benchmarks/run-benchmarks.mjs
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..', '..', '..');

// Import from ESM build (development mode for full API)
const math2d = await import(resolve(ROOT, 'packages/math2d/lib/esm/index.development.js'));

const {
  Vector2,
  Rotation2,
  Matrix2,
  Matrix3,
  Transform2,
  Complex,
  Interval,
} = math2d;

// Import deterministic kernels
const det = await import(resolve(ROOT, 'packages/math2d/lib/esm/deterministic/deterministic-kernels.development.js'));
const { sin, cos, sqrt, atan2, hypot, sinCos, config, DeterministicKernels } = det;

/* ======================================================================== */
/* Benchmark Harness                                                         */
/* ======================================================================== */

function bench(name, fn, iterations = 1_000_000) {
  // Warmup
  for (let i = 0; i < 10_000; i++) fn(i);

  const start = performance.now();
  for (let i = 0; i < iterations; i++) fn(i);
  const elapsed = performance.now() - start;

  const opsPerMs = (iterations / elapsed).toFixed(0);
  const nsPerOp = ((elapsed * 1e6) / iterations).toFixed(1);
  return { name, elapsed: elapsed.toFixed(2), opsPerMs, nsPerOp, iterations };
}

function printSection(title) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`  ${title}`);
  console.log('='.repeat(70));
}

function printResult(r) {
  console.log(`  ${r.name.padEnd(45)} ${r.nsPerOp.padStart(8)} ns/op  (${r.opsPerMs} ops/ms)`);
}

function printComparison(label, a, b) {
  const ratio = (parseFloat(a.nsPerOp) / parseFloat(b.nsPerOp)).toFixed(2);
  console.log(`  ${label}: ${a.name} is ${ratio}x vs ${b.name}`);
}

/* ======================================================================== */
/* 14.1 — fdlibm kernels vs native Math                                      */
/* ======================================================================== */

printSection('14.1 fdlibm Kernels vs Native Math');

// Ensure fdlibm mode
config.useNativeMath = false;

const angles = Array.from({ length: 1000 }, (_, i) => (i / 1000) * Math.PI * 4 - Math.PI * 2);
let angleIdx = 0;
const getAngle = () => angles[(angleIdx++) % angles.length];

const fdlibmSin = bench('fdlibm sin', (i) => sin(angles[i % 1000]));
const fdlibmCos = bench('fdlibm cos', (i) => cos(angles[i % 1000]));
const fdlibmAtan2 = bench('fdlibm atan2', (i) => atan2(angles[i % 1000], angles[(i + 500) % 1000]));
const fdlibmSqrt = bench('fdlibm sqrt', (i) => sqrt(Math.abs(angles[i % 1000]) + 1));
const fdlibmHypot = bench('fdlibm hypot', (i) => hypot(angles[i % 1000], angles[(i + 1) % 1000]));

// Switch to native
config.useNativeMath = true;

const nativeSin = bench('native Math.sin', (i) => sin(angles[i % 1000]));
const nativeCos = bench('native Math.cos', (i) => cos(angles[i % 1000]));
const nativeAtan2 = bench('native Math.atan2', (i) => atan2(angles[i % 1000], angles[(i + 500) % 1000]));
const nativeSqrt = bench('native Math.sqrt', (i) => sqrt(Math.abs(angles[i % 1000]) + 1));
const nativeHypot = bench('native Math.hypot', (i) => hypot(angles[i % 1000], angles[(i + 1) % 1000]));

// Switch back
config.useNativeMath = false;

printResult(fdlibmSin);
printResult(nativeSin);
printComparison('sin overhead', fdlibmSin, nativeSin);
console.log();
printResult(fdlibmCos);
printResult(nativeCos);
printComparison('cos overhead', fdlibmCos, nativeCos);
console.log();
printResult(fdlibmAtan2);
printResult(nativeAtan2);
printComparison('atan2 overhead', fdlibmAtan2, nativeAtan2);
console.log();
printResult(fdlibmSqrt);
printResult(nativeSqrt);
printComparison('sqrt overhead', fdlibmSqrt, nativeSqrt);
console.log();
printResult(fdlibmHypot);
printResult(nativeHypot);
printComparison('hypot overhead', fdlibmHypot, nativeHypot);

/* ======================================================================== */
/* 14.2 — out parameter vs allocation                                        */
/* ======================================================================== */

printSection('14.2 out Parameter vs Allocation (Vector2.add, 1M iterations)');

const va = Vector2.fromValues(1, 2);
const vb = Vector2.fromValues(3, 4);
const vout = new Vector2();

const addAlloc = bench('Vector2.add(a, b) [alloc]', () => Vector2.add(va, vb));
const addOut = bench('Vector2.add(a, b, out) [reuse]', () => Vector2.add(va, vb, vout));
const addInstance = bench('a.clone().add(b) [instance]', () => va.clone().add(vb));

printResult(addAlloc);
printResult(addOut);
printResult(addInstance);
printComparison('out vs alloc speedup', addAlloc, addOut);

/* ======================================================================== */
/* 14.3 — *CS variants vs rotate                                             */
/* ======================================================================== */

printSection('14.3 *CS Variants: rotateCS vs rotate');

const vr = Vector2.fromValues(1, 0);
const angle = Math.PI / 4;
const { cos: preC, sin: preS } = sinCos(angle);

const rotateAngle = bench('Vector2.rotate(angle) [trig each]', () => {
  vr.set(1, 0);
  Vector2.rotate(vr, angle, vr);
});

const rotateCS = bench('Vector2.rotateCS(cos, sin) [cached]', () => {
  vr.set(1, 0);
  Vector2.rotateCS(vr, preC, preS, vr);
});

printResult(rotateAngle);
printResult(rotateCS);
printComparison('CS speedup', rotateAngle, rotateCS);

// Determine breakeven with N rotations using same angle
console.log('\n  Breakeven analysis (same angle applied N times):');
for (const N of [1, 5, 10, 50, 100]) {
  const withTrig = bench(`  rotate x${N}`, () => {
    for (let j = 0; j < N; j++) {
      vr.set(1, 0);
      Vector2.rotate(vr, angle, vr);
    }
  }, 100_000);

  const withCS = bench(`  rotateCS x${N} (1 sinCos)`, () => {
    const sc = sinCos(angle);
    for (let j = 0; j < N; j++) {
      vr.set(1, 0);
      Vector2.rotateCS(vr, sc.cos, sc.sin, vr);
    }
  }, 100_000);

  console.log(`    N=${String(N).padStart(3)}: rotate=${withTrig.nsPerOp}ns, rotateCS=${withCS.nsPerOp}ns, ratio=${(parseFloat(withTrig.nsPerOp) / parseFloat(withCS.nsPerOp)).toFixed(2)}x`);
}

/* ======================================================================== */
/* 14.4 — Inter-type facade overhead                                         */
/* ======================================================================== */

printSection('14.4 Inter-Type Facades (Transform2.toMatrix3 vs direct Matrix3 construction)');

const t2 = Transform2.fromValues(10, 20, Math.PI / 6, 2, 2);

const toMatrix3 = bench('Transform2.toMatrix3()', () => t2.toMatrix3());
const directMatrix3 = bench('Matrix3.fromTRS() [if existed]', () => {
  const c = t2.rotation.cos;
  const s = t2.rotation.sin;
  const sx = t2.scale.x;
  const sy = t2.scale.y;
  Matrix3.fromValues(c * sx, s * sx, 0, -s * sy, c * sy, 0, t2.position.x, t2.position.y, 1);
});

printResult(toMatrix3);
printResult(directMatrix3);
printComparison('facade overhead', toMatrix3, directMatrix3);

/* ======================================================================== */
/* 14.5 — Instance vs static dispatch                                        */
/* ======================================================================== */

printSection('14.5 Instance vs Static Dispatch');

const v1 = Vector2.fromValues(1, 2);
const v2 = Vector2.fromValues(3, 4);
const vStatic = new Vector2();

const staticAdd = bench('Vector2.add(a, b, out) [static]', () => Vector2.add(v1, v2, vStatic));
const instanceAdd = bench('v1.clone().add(v2) [instance]', () => v1.clone().add(v2));

printResult(staticAdd);
printResult(instanceAdd);
printComparison('instance vs static', instanceAdd, staticAdd);

// Complex multiply
const c1 = Complex.fromValues(1, 2);
const c2 = Complex.fromValues(3, 4);
const cout = new Complex();

const staticMul = bench('Complex.multiply(a, b, out)', () => Complex.multiply(c1, c2, cout));
const instanceMul = bench('c1.clone().multiply(c2)', () => c1.clone().multiply(c2));

printResult(staticMul);
printResult(instanceMul);
printComparison('complex instance vs static', instanceMul, staticMul);

/* ======================================================================== */
/* 14.7 — Hidden class stability                                             */
/* ======================================================================== */

printSection('14.7 Hidden Class Stability (Constructor Property Order)');

console.log('  Verifying consistent property initialization across constructors...');

function getPropertyOrder(obj) {
  return Object.getOwnPropertyNames(obj).join(', ');
}

const types = [
  { name: 'Vector2', create: () => new Vector2(), fromValues: () => Vector2.fromValues(1, 2) },
  { name: 'Complex', create: () => new Complex(), fromValues: () => Complex.fromValues(1, 2) },
  { name: 'Rotation2', create: () => new Rotation2(), fromValues: () => Rotation2.fromAngle(1) },
  { name: 'Interval', create: () => new Interval(), fromValues: () => Interval.fromValues(0, 1) },
  { name: 'Matrix2', create: () => new Matrix2(), fromValues: () => Matrix2.fromValues(1, 0, 0, 1) },
  { name: 'Matrix3', create: () => new Matrix3(), fromValues: () => Matrix3.fromValues(1, 0, 0, 0, 1, 0, 0, 0, 1) },
  { name: 'Transform2', create: () => new Transform2(), fromValues: () => Transform2.fromValues(1, 2, 0.5, 1, 1) },
];

for (const t of types) {
  const createProps = getPropertyOrder(t.create());
  const fromProps = getPropertyOrder(t.fromValues());
  const match = createProps === fromProps ? 'STABLE' : 'UNSTABLE';
  console.log(`  ${t.name.padEnd(12)} create: [${createProps}] vs fromValues: [${fromProps}] → ${match}`);
}

/* ======================================================================== */
/* 14.8 — Memory layout                                                      */
/* ======================================================================== */

printSection('14.8 Memory Layout (Approximate Object Size)');

console.log('  Property counts per core type (floats stored):');
console.log(`  Vector2:    2 floats (x, y)`);
console.log(`  Complex:    2 floats (real, imag)`);
console.log(`  Rotation2:  2 floats (cos, sin)`);
console.log(`  Interval:   2 floats (min, max)`);
console.log(`  Matrix2:    4 floats (m00, m01, m10, m11)`);
console.log(`  Matrix3:    9 floats (m00..m22)`);
console.log(`  Transform2: 6 floats via 3 objects (position:V2 + rotation:R2 + scale:V2)`);

console.log('\n  V8 object overhead estimate:');
console.log('    Each JS object: ~64 bytes (hidden class pointer + properties backing store)');
console.log('    Each float64 property: 8 bytes');
console.log('    Vector2: ~64 + 2*8 = ~80 bytes');
console.log('    Matrix3: ~64 + 9*8 = ~136 bytes');
console.log('    Transform2: ~64 + 3*80 = ~304 bytes (3 nested objects)');
console.log('    Float64Array(2): ~96 bytes (header + buffer)');
console.log('    Conclusion: Object properties are competitive with Float64Array for small types');

// Allocation benchmark
const allocObj = bench('new Vector2() [object]', () => new Vector2());
const allocArr = bench('new Float64Array(2)', () => new Float64Array(2));

printResult(allocObj);
printResult(allocArr);
printComparison('object vs typed array alloc', allocObj, allocArr);

/* ======================================================================== */
/* Summary                                                                    */
/* ======================================================================== */

printSection('SUMMARY');
console.log('  All benchmarks complete. Results above.\n');
