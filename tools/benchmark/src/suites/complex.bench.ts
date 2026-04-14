/**
 * Complex benchmark suite.
 */

import type { SuiteDefinition } from '../harness/suite.ts';
import { createBenchmarkBuilder } from '../harness/suite-builder.ts';

/* eslint-disable @typescript-eslint/no-explicit-any */

let C: any;
let a: any;
let b: any;
let out: any;
let v: any;
let vOut: any;

export function defineSuite(): SuiteDefinition {
 const { add, entries } = createBenchmarkBuilder();
 return {
  name: 'Complex',
  dimensions: {
   environment: ['node'],
   buildMode: ['development', 'production'],
   determinism: ['fdlibm', 'native'],
   tier: ['default', 'safe', 'unchecked'],
   entity: ['Complex'],
  },

  setup(math2d) {
   C = math2d['Complex'] as any;
   const V2 = math2d['Vector2'] as any;

   a = C.fromValues(3.5, 7.2);
   b = C.fromValues(1.1, 4.8);
   out = C.fromValues(0, 0);
   v = V2.fromValues(2.0, 3.0);
   vOut = V2.fromValues(0, 0);

   // Factories
   add('Complex.fromPolar (out)', () => C.fromPolar(5.0, 0.7, out));
   add('Complex.fromValues (out)', () => C.fromValues(3.5, 7.2, out));

   // Arithmetic
   add('Complex.add (out)', () => C.add(a, b, out));
   add('Complex.subtract (out)', () => C.subtract(a, b, out));
   add('Complex.multiply (out)', () => C.multiply(a, b, out));
   add('Complex.multiplyScalar (out)', () => C.multiplyScalar(a, 2.5, out));
   add('Complex.conjugate (out)', () => C.conjugate(a, out));
   add('Complex.negate (out)', () => C.negate(a, out));

   // Divide triality
   add('Complex.divide', () => C.divide(a, b, out), 'default');
   add('Complex.divideSafe', () => C.divideSafe(a, b, out), 'safe');
   add('Complex.divideUnchecked', () => C.divideUnchecked(a, b, out), 'unchecked');

   // Normalize triality
   add('Complex.normalize', () => C.normalize(a, out), 'default');
   add('Complex.normalizeSafe', () => C.normalizeSafe(a, out), 'safe');
   add('Complex.normalizeUnchecked', () => C.normalizeUnchecked(a, out), 'unchecked');

   // Reciprocal triality
   add('Complex.reciprocal', () => C.reciprocal(a, out), 'default');
   add('Complex.reciprocalSafe', () => C.reciprocalSafe(a, out), 'safe');
   add('Complex.reciprocalUnchecked', () => C.reciprocalUnchecked(a, out), 'unchecked');

   // Transcendental (Friedland 1967, C99 Annex G)
   add('Complex.sqrt (out)', () => C.sqrt(a, out));
   add('Complex.exp (out)', () => C.exp(a, out));
   add('Complex.log (out)', () => C.log(a, out));
   add('Complex.pow (out)', () => C.pow(a, 2.0, out));

   // Scalar reductions
   add('Complex.magnitude', () => C.magnitude(a));
   add('Complex.magnitudeSq', () => C.magnitudeSq(a));
   add('Complex.angle', () => C.angle(a));

   // Apply to vector
   add('Complex.apply (out)', () => C.apply(a, v, vOut));

   // Interpolation
   add('Complex.lerp (out)', () => C.lerp(a, b, 0.5, out));
   add('Complex.slerp (out)', () => C.slerp(a, b, 0.5, out));

   // Predicates
   add('Complex.nearEquals', () => C.nearEquals(a, b));
   add('Complex.isUnit', () => C.isUnit(a));
  },

  get benchmarks() { return entries; },
 };
}
