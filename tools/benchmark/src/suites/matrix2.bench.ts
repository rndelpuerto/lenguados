/**
 * Matrix2 benchmark suite.
 */

import type { SuiteDefinition } from '../harness/suite.ts';
import { createBenchmarkBuilder } from '../harness/suite-builder.ts';

/* eslint-disable @typescript-eslint/no-explicit-any */

let M2: any;
let a: any;
let b: any;
let out: any;
let v: any;
let vOut: any;

export function defineSuite(): SuiteDefinition {
 const { add, entries } = createBenchmarkBuilder();
 return {
  name: 'Matrix2',
  dimensions: {
   environment: ['node'],
   buildMode: ['development', 'production'],
   determinism: ['fdlibm', 'native'],
   tier: ['default', 'safe', 'unchecked'],
   entity: ['Matrix2'],
  },

  setup(math2d) {
   M2 = math2d['Matrix2'] as any;
   const V2 = math2d['Vector2'] as any;

   a = M2.fromRotation(0.7);
   b = M2.fromScale({ x: 2.0, y: 1.5 });
   out = M2.fromValues(0, 0, 0, 0);
   v = V2.fromValues(3.5, 7.2);
   vOut = V2.fromValues(0, 0);

   // Factories
   add('Matrix2.fromRotation (out)', () => M2.fromRotation(0.7, out));
   add('Matrix2.fromScale (out)', () => M2.fromScale({ x: 2.0, y: 1.5 }, out));
   add('Matrix2.fromShear (out)', () => M2.fromShear(0.3, out));
   add('Matrix2.fromDiagonal (out)', () => M2.fromDiagonal({ x: 2.0, y: 3.0 }, out));

   // Arithmetic
   add('Matrix2.add (out)', () => M2.add(a, b, out));
   add('Matrix2.subtract (out)', () => M2.subtract(a, b, out));
   add('Matrix2.multiply (out)', () => M2.multiply(a, b, out));
   add('Matrix2.multiplyScalar (out)', () => M2.multiplyScalar(a, 2.5, out));
   add('Matrix2.negate (out)', () => M2.negate(a, out));

   // Inverse triality
   add('Matrix2.inverse', () => M2.inverse(a, out), 'default');
   add('Matrix2.inverseSafe', () => M2.inverseSafe(a, out), 'safe');
   add('Matrix2.inverseUnchecked', () => M2.inverseUnchecked(a, out), 'unchecked');

   // Solve triality
   add('Matrix2.solveLinearSystem', () => M2.solveLinearSystem(a, v, vOut), 'default');
   add('Matrix2.solveLinearSystemSafe', () => M2.solveLinearSystemSafe(a, v, vOut), 'safe');
   add('Matrix2.solveLinearSystemUnchecked', () => M2.solveLinearSystemUnchecked(a, v, vOut), 'unchecked');

   // Matrix operations
   add('Matrix2.transpose (out)', () => M2.transpose(a, out));
   add('Matrix2.adjugate (out)', () => M2.adjugate(a, out));
   add('Matrix2.determinant', () => M2.determinant(a));
   add('Matrix2.trace', () => M2.trace(a));
   add('Matrix2.frobeniusNorm', () => M2.frobeniusNorm(a));
   add('Matrix2.eigenvalues', () => M2.eigenvalues(a));
   add('Matrix2.eigendecompose', () => M2.eigendecompose(a));
   add('Matrix2.compose (out)', () => M2.compose(0.7, 2.0, 1.5, out));
   add('Matrix2.decompose', () => M2.decompose(a));

   // Transform
   add('Matrix2.transformVector (out)', () => M2.transformVector(a, v, vOut));
   add('Matrix2.rotate (out)', () => M2.rotate(a, 0.3, out));
   add('Matrix2.rotateCS (out)', () => M2.rotateCS(a, Math.cos(0.3), Math.sin(0.3), out));
   add('Matrix2.scaleBy (out)', () => M2.scaleBy(a, 2.0, 1.5, out));

   // Interpolation
   add('Matrix2.lerp (out)', () => M2.lerp(a, b, 0.5, out));

   // Predicates
   add('Matrix2.nearEquals', () => M2.nearEquals(a, b));
   add('Matrix2.isInvertible', () => M2.isInvertible(a));
   add('Matrix2.isOrthogonal', () => M2.isOrthogonal(a));
  },

  get benchmarks() { return entries; },
 };
}
