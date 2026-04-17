/**
 * @file packages/math2d/suites/transform2.bench.ts
 * @description Transform2 operations benchmark suite
 *
 * Cover factories, composition, inverse triality, point/vector transforms
 * (including *CS variants), inverse transforms, interpolation, scalar
 * reductions, and predicates on the Transform2 type.
 */

import { definePackageSuite } from '../../../harness/suite-builder.ts';

/**
 * Define the Transform2 benchmark suite
 *
 * @remarks
 * Benchmarks all Transform2 static operations across both determinism
 * modes and all three validation tiers (default/safe/unchecked) for the
 * inverse triality.
 */
export const defineSuite = definePackageSuite({
 name: 'Transform2',
 entity: 'Transform2',
 extract: ['Transform2', 'Vector2', 'Matrix3'],
 dimensions: {
  determinism: ['fdlibm', 'native'],
  tier: ['default', 'safe', 'unchecked'],
 },

 register(add, triality, { Transform2: T2, Vector2: V2, Matrix3: M3 }) {
  const a = T2.fromComponents(V2.fromValues(1, 2), 0.5, V2.fromValues(1.5, 1.5));
  const b = T2.fromComponents(V2.fromValues(3, 4), 1.2, V2.fromValues(2, 2));
  const out = T2.fromComponents(V2.fromValues(0, 0), 0, V2.fromValues(1, 1));
  const v = V2.fromValues(3.5, 7.2);
  const vOut = V2.fromValues(0, 0);

  // Factories
  add('Transform2.fromComponents (out)', () =>
   T2.fromComponents(V2.fromValues(1, 2), 0.5, V2.fromValues(1, 1), out),
  );
  add('Transform2.fromMatrix3 (out)', () => T2.fromMatrix3(M3.fromRotation(0.7), out));
  add('Transform2.fromPose (out)', () => T2.fromPose(V2.fromValues(1, 2), 0.5, out));

  // Composition
  add('Transform2.multiply (out)', () => T2.multiply(a, b, out));

  // Inverse triality
  triality({
   default: ['Transform2.inverse', () => T2.inverse(a, out)],
   safe: ['Transform2.inverseSafe', () => T2.inverseSafe(a, out)],
   unchecked: ['Transform2.inverseUnchecked', () => T2.inverseUnchecked(a, out)],
  });

  // Transform point/vector + *CS variants
  add('Transform2.transformPoint (out)', () => T2.transformPoint(a, v, vOut));
  add('Transform2.transformPointCS (out)', () =>
   T2.transformPointCS(a, v, a.rotation.cos, a.rotation.sin, vOut),
  );
  add('Transform2.transformVector (out)', () => T2.transformVector(a, v, vOut));
  add('Transform2.transformVectorCS (out)', () =>
   T2.transformVectorCS(a, v, a.rotation.cos, a.rotation.sin, vOut),
  );
  add('Transform2.transformDirection (out)', () => T2.transformDirection(a, v, vOut));

  // Inverse transform
  add('Transform2.inverseTransformPoint (out)', () => T2.inverseTransformPoint(a, v, vOut));
  add('Transform2.inverseTransformVector (out)', () => T2.inverseTransformVector(a, v, vOut));

  // Interpolation
  add('Transform2.lerp (out)', () => T2.lerp(a, b, 0.5, out));
  add('Transform2.lerpClamped (out)', () => T2.lerpClamped(a, b, 0.5, out));

  // Scalar reductions
  add('Transform2.determinant', () => T2.determinant(a));

  // Predicates
  add('Transform2.nearEquals', () => T2.nearEquals(a, b));
  add('Transform2.isIdentity', () => T2.isIdentity(a));
  add('Transform2.isInvertible', () => T2.isInvertible(a));
  add('Transform2.hasUniformScale', () => T2.hasUniformScale(a));
 },
});
