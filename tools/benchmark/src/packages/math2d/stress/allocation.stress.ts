/**
 * @file stress/allocation.stress.ts
 * @description Zero-allocation verification stress test
 *
 * Verifies that static methods with out parameter and instance mutator
 * methods produce zero heap allocations over 100K iterations.
 * Requires --expose-gc flag for accurate measurement.
 */

import { measureAllocations } from '../../../harness/suite.ts';
import { addFinding } from '../../../harness/reporter.ts';
import type { DiagnosticReport } from '../../../harness/reporter.ts';

/** Result of a zero-allocation verification for a single operation */
export interface AllocationResult {
 operation: string;
 entity: string;
 variant: 'static-out' | 'instance-mutator' | 'static-alloc';
 iterations: number;
 heapGrowthBytes: number;
 bytesPerOp: number;
 isZeroAlloc: boolean;
}

const ITERATIONS = 100_000;
const ZERO_ALLOC_THRESHOLD_BYTES = 1024; // 1 KB

/**
 * Run zero-allocation verification for all core types
 *
 * @param math2d - Loaded math2d module with all core type constructors
 * @param diagnostics - Diagnostic report to record findings
 * @returns Array of allocation measurement results per operation
 */
export function runAllocationStress(
 math2d: Record<string, unknown>,
 diagnostics: DiagnosticReport,
): AllocationResult[] {
 const V2 = math2d['Vector2'] as any;
 const R2 = math2d['Rotation2'] as any;
 const M2 = math2d['Matrix2'] as any;
 const M3 = math2d['Matrix3'] as any;
 const C = math2d['Complex'] as any;
 const I = math2d['Interval'] as any;
 const T2 = math2d['Transform2'] as any;

 const results: AllocationResult[] = [];

 function test(
  entity: string,
  operation: string,
  variant: AllocationResult['variant'],
  fn: () => void,
 ): void {
  const measurement = measureAllocations(fn, ITERATIONS);
  if (!measurement) return; // --expose-gc not available

  const isZeroAlloc = measurement.heapGrowthBytes < ZERO_ALLOC_THRESHOLD_BYTES;
  results.push({
   operation,
   entity,
   variant,
   iterations: ITERATIONS,
   heapGrowthBytes: measurement.heapGrowthBytes,
   bytesPerOp: measurement.bytesPerOp,
   isZeroAlloc,
  });

  if (variant === 'static-out' && !isZeroAlloc) {
   addFinding(diagnostics, {
    severity: 'error',
    type: 'allocation-leak',
    entity,
    operation,
    message: `Out-param path allocated ${measurement.heapGrowthBytes} bytes over ${ITERATIONS} iterations (${measurement.bytesPerOp.toFixed(1)} bytes/op)`,
    details: { heapGrowthBytes: measurement.heapGrowthBytes, bytesPerOp: measurement.bytesPerOp },
   });
  }

  if (variant === 'instance-mutator' && !isZeroAlloc) {
   addFinding(diagnostics, {
    severity: 'error',
    type: 'allocation-leak',
    entity,
    operation,
    message: `Instance mutator allocated ${measurement.heapGrowthBytes} bytes over ${ITERATIONS} iterations`,
    details: { heapGrowthBytes: measurement.heapGrowthBytes, bytesPerOp: measurement.bytesPerOp },
   });
  }
 }

 // Pre-allocate all test data
 const va = V2.fromValues(3.5, 7.2);
 const vb = V2.fromValues(1.1, 4.8);
 const vOut = V2.fromValues(0, 0);
 const ra = R2.fromAngle(0.5);
 const rOut = R2.fromAngle(0);
 const ma = M2.fromRotation(0.7);
 const mOut2 = M2.fromValues(0, 0, 0, 0);
 const m3a = M3.fromRotation(0.7);
 const m3Out = M3.fromValues(0, 0, 0, 0, 0, 0, 0, 0, 0);
 const ca = C.fromValues(3.5, 7.2);
 const cb = C.fromValues(1.1, 4.8);
 const cOut = C.fromValues(0, 0);
 const ia = I.fromValues(2, 8);
 const ib = I.fromValues(5, 12);
 const iOut = I.fromValues(0, 0);
 const t2a = T2.fromComponents(va, 0.5, V2.fromValues(1, 1));
 const t2b = T2.fromComponents(vb, 1.2, V2.fromValues(2, 2));
 const t2Out = T2.fromComponents(V2.fromValues(0, 0), 0, V2.fromValues(1, 1));

 // Vector2 — static with out (should be zero-alloc)
 test('Vector2', 'add', 'static-out', () => V2.add(va, vb, vOut));
 test('Vector2', 'normalize', 'static-out', () => V2.normalize(va, vOut));
 test('Vector2', 'lerp', 'static-out', () => V2.lerp(va, vb, 0.5, vOut));
 test('Vector2', 'rotate', 'static-out', () => V2.rotate(va, 0.7, vOut));
 test('Vector2', 'applyMatrix3', 'static-out', () => V2.applyMatrix3(va, m3a, vOut));

 // Vector2 — instance mutator (should be zero-alloc)
 const vMut = V2.fromValues(3.5, 7.2);
 test('Vector2', 'instance.add', 'instance-mutator', () => {
  vMut.add(vb);
 });

 // Vector2 — allocating (should allocate)
 test('Vector2', 'add (no out)', 'static-alloc', () => V2.add(va, vb));

 // Rotation2
 test('Rotation2', 'multiply', 'static-out', () => R2.multiply(ra, ra, rOut));
 test('Rotation2', 'apply', 'static-out', () => R2.apply(ra, va, vOut));

 // Matrix2
 test('Matrix2', 'multiply', 'static-out', () => M2.multiply(ma, ma, mOut2));
 test('Matrix2', 'inverse', 'static-out', () => M2.inverse(ma, mOut2));

 // Matrix3
 test('Matrix3', 'multiply', 'static-out', () => M3.multiply(m3a, m3a, m3Out));
 test('Matrix3', 'transformPoint', 'static-out', () => M3.transformPoint(m3a, va, vOut));
 test('Matrix3', 'inverse', 'static-out', () => M3.inverse(m3a, m3Out));

 // Complex
 test('Complex', 'multiply', 'static-out', () => C.multiply(ca, cb, cOut));
 test('Complex', 'sqrt', 'static-out', () => C.sqrt(ca, cOut));

 // Interval
 test('Interval', 'hull', 'static-out', () => I.hull(ia, ib, iOut));
 test('Interval', 'intersect', 'static-out', () => I.intersect(ia, ib, iOut));

 // Transform2
 test('Transform2', 'multiply', 'static-out', () => T2.multiply(t2a, t2b, t2Out));
 test('Transform2', 'transformPoint', 'static-out', () => T2.transformPoint(t2a, va, vOut));

 return results;
}
