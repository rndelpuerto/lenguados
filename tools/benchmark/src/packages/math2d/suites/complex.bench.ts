/**
 * @file packages/math2d/suites/complex.bench.ts
 * @description Complex number operations benchmark suite
 *
 * Cover factories, arithmetic, transcendental functions, scalar reductions,
 * vector application, interpolation, and predicates on the Complex type.
 */

import { definePackageSuite } from '../../../harness/suite-builder.ts';

/**
 * Define the Complex benchmark suite
 *
 * @remarks
 * Benchmarks all Complex static operations across both determinism modes
 * and all three validation tiers (default/safe/unchecked) for triality
 * operations (divide, normalize, reciprocal).
 */
export const defineSuite = definePackageSuite({
 name: 'Complex',
 entity: 'Complex',
 extract: ['Complex', 'Vector2'],
 dimensions: {
  determinism: ['fdlibm', 'native'],
  tier: ['default', 'safe', 'unchecked'],
 },

 register(add, triality, { Complex: C, Vector2: V2 }) {
  const a = C.fromValues(3.5, 7.2);
  const b = C.fromValues(1.1, 4.8);
  const out = C.fromValues(0, 0);
  const v = V2.fromValues(2.0, 3.0);
  const vOut = V2.fromValues(0, 0);

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
  triality({
   default: ['Complex.divide', () => C.divide(a, b, out)],
   safe: ['Complex.divideSafe', () => C.divideSafe(a, b, out)],
   unchecked: ['Complex.divideUnchecked', () => C.divideUnchecked(a, b, out)],
  });

  // Normalize triality
  triality({
   default: ['Complex.normalize', () => C.normalize(a, out)],
   safe: ['Complex.normalizeSafe', () => C.normalizeSafe(a, out)],
   unchecked: ['Complex.normalizeUnchecked', () => C.normalizeUnchecked(a, out)],
  });

  // Reciprocal triality
  triality({
   default: ['Complex.reciprocal', () => C.reciprocal(a, out)],
   safe: ['Complex.reciprocalSafe', () => C.reciprocalSafe(a, out)],
   unchecked: ['Complex.reciprocalUnchecked', () => C.reciprocalUnchecked(a, out)],
  });

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
});
