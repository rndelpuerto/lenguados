/**
 * Rotation2 benchmark suite.
 */

import { definePackageSuite } from '../../../harness/suite-builder.ts';

export const defineSuite = definePackageSuite({
 name: 'Rotation2',
 entity: 'Rotation2',
 extract: ['Rotation2', 'Vector2'],
 dimensions: {
  determinism: ['fdlibm', 'native'],
  tier: ['default', 'safe', 'unchecked'],
 },

 register(add, triality, { Rotation2: R2, Vector2: V2 }) {
  const r1 = R2.fromAngle(0.5);
  const r2 = R2.fromAngle(1.2);
  const rOut = R2.fromAngle(0);
  const v = V2.fromValues(3.5, 7.2);
  const vOut = V2.fromValues(0, 0);

  // Factories
  add('Rotation2.fromAngle (out)', () => R2.fromAngle(0.7, rOut));
  add('Rotation2.fromAngle (alloc)', () => R2.fromAngle(0.7));
  add('Rotation2.fromCS (out)', () => R2.fromCS(0.8, 0.6, rOut));
  add('Rotation2.fromVector2 (out)', () => R2.fromVector2(v, rOut));

  // Arithmetic
  add('Rotation2.multiply (out)', () => R2.multiply(r1, r2, rOut));
  add('Rotation2.inverse (out)', () => R2.inverse(r1, rOut));
  add('Rotation2.conjugate (out)', () => R2.conjugate(r1, rOut));
  add('Rotation2.negate (out)', () => R2.negate(r1, rOut));
  add('Rotation2.relative (out)', () => R2.relative(r1, r2, rOut));

  // Apply to vector
  add('Rotation2.apply (out)', () => R2.apply(r1, v, vOut));
  add('Rotation2.applyInverse (out)', () => R2.applyInverse(r1, v, vOut));

  // Normalize triality
  triality({
   default: ['Rotation2.normalize', () => R2.normalize(r1, rOut)],
   safe: ['Rotation2.normalizeSafe', () => R2.normalizeSafe(r1, rOut)],
   unchecked: ['Rotation2.normalizeUnchecked', () => R2.normalizeUnchecked(r1, rOut)],
  });

  // Interpolation
  add('Rotation2.lerp (out)', () => R2.lerp(r1, r2, 0.5, rOut));
  add('Rotation2.lerpClamped (out)', () => R2.lerpClamped(r1, r2, 0.5, rOut));
  add('Rotation2.smoothStep (out)', () => R2.smoothStep(r1, r2, 0.5, rOut));

  // Scalar reductions
  add('Rotation2.angle', () => R2.angle(r1));
  add('Rotation2.angleBetween', () => R2.angleBetween(r1, r2));

  // Predicates
  add('Rotation2.nearEquals', () => R2.nearEquals(r1, r2));
  add('Rotation2.isIdentity', () => R2.isIdentity(r1));
  add('Rotation2.isNormalized', () => R2.isNormalized(r1));
 },
});
