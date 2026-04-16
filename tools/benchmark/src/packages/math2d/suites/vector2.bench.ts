/**
 * Vector2 benchmark suite.
 *
 * Covers all Vector2 operations including *CS hot-path variants,
 * triality (default/safe/unchecked), and both allocating + out-param forms.
 */

import { definePackageSuite } from '../../../harness/suite-builder.ts';

export const defineSuite = definePackageSuite({
 name: 'Vector2',
 entity: 'Vector2',
 extract: ['Vector2', 'Rotation2', 'Matrix3', 'Transform2', 'Complex'],
 dimensions: {
  determinism: ['fdlibm', 'native'],
  tier: ['default', 'safe', 'unchecked'],
 },

 register(add, triality, { Vector2: V2, Rotation2, Matrix3, Transform2, Complex }) {
  const a = V2.fromValues(3.5, 7.2);
  const b = V2.fromValues(1.1, 4.8);
  const out = V2.fromValues(0, 0);
  const unitA = V2.fromAngle(0.7);
  const rot = Rotation2.fromAngle(0.5);
  const m3 = Matrix3.fromRotation(0.7);
  const t2 = Transform2.fromComponents(V2.fromValues(1, 2), 0.3, V2.fromValues(1, 1));
  const c = Complex.fromPolar(1, 0.4);

  // Arithmetic — static with out
  add('Vector2.add (out)', () => V2.add(a, b, out));
  add('Vector2.add (alloc)', () => V2.add(a, b));
  add('Vector2.subtract (out)', () => V2.subtract(a, b, out));
  add('Vector2.multiply (out)', () => V2.multiply(a, b, out));
  add('Vector2.multiplyScalar (out)', () => V2.multiplyScalar(a, 2.5, out));
  add('Vector2.negate (out)', () => V2.negate(a, out));
  add('Vector2.addScaledVector (out)', () => V2.addScaledVector(a, b, 2.0, out));

  // Divide triality
  triality({
   default: ['Vector2.divideScalar', () => V2.divideScalar(a, 2.5, out)],
   safe: ['Vector2.divideScalarSafe', () => V2.divideScalarSafe(a, 2.5, out)],
   unchecked: ['Vector2.divideScalarUnchecked', () => V2.divideScalarUnchecked(a, 2.5, out)],
  });

  // Scalar reductions
  add('Vector2.dot', () => V2.dot(a, b));
  add('Vector2.cross', () => V2.cross(a, b));
  add('Vector2.magnitude', () => V2.magnitude(a));
  add('Vector2.magnitudeSq', () => V2.magnitudeSq(a));
  add('Vector2.distance', () => V2.distance(a, b));
  add('Vector2.distanceSquared', () => V2.distanceSquared(a, b));
  add('Vector2.manhattanLength', () => V2.manhattanLength(a));
  add('Vector2.angle', () => V2.angle(a));

  // Normalize triality
  add('Vector2.normalize (out)', () => V2.normalize(a, out), 'default');
  add('Vector2.normalize (alloc)', () => V2.normalize(a), 'default');
  triality({
   safe: ['Vector2.normalizeSafe (out)', () => V2.normalizeSafe(a, out)],
   unchecked: ['Vector2.normalizeUnchecked (out)', () => V2.normalizeUnchecked(a, out)],
  });

  // Direction triality
  triality({
   default: ['Vector2.direction', () => V2.direction(a, b, out)],
   safe: ['Vector2.directionSafe', () => V2.directionSafe(a, b, out)],
   unchecked: ['Vector2.directionUnchecked', () => V2.directionUnchecked(a, b, out)],
  });

  // Interpolation
  add('Vector2.lerp (out)', () => V2.lerp(a, b, 0.5, out));
  add('Vector2.lerpClamped (out)', () => V2.lerpClamped(a, b, 0.5, out));
  add('Vector2.slerp (out)', () => V2.slerp(unitA, V2.fromAngle(1.2), 0.5, out));
  add('Vector2.slerpClamped (out)', () => V2.slerpClamped(unitA, V2.fromAngle(1.2), 0.5, out));
  add('Vector2.smoothStep (out)', () => V2.smoothStep(a, b, 0.5, out));

  // Projection triality
  triality({
   default: ['Vector2.project', () => V2.project(a, b, out)],
   safe: ['Vector2.projectSafe', () => V2.projectSafe(a, b, out)],
   unchecked: ['Vector2.projectUnchecked', () => V2.projectUnchecked(a, b, out)],
  });
  triality({
   default: ['Vector2.reject', () => V2.reject(a, b, out)],
   safe: ['Vector2.rejectSafe', () => V2.rejectSafe(a, b, out)],
   unchecked: ['Vector2.rejectUnchecked', () => V2.rejectUnchecked(a, b, out)],
  });

  // Reflect triality
  triality({
   default: ['Vector2.reflect', () => V2.reflect(a, unitA, out)],
   safe: ['Vector2.reflectSafe', () => V2.reflectSafe(a, unitA, out)],
   unchecked: ['Vector2.reflectUnchecked', () => V2.reflectUnchecked(a, unitA, out)],
  });

  // Rotation — including *CS hot-path variant
  add('Vector2.rotate (out)', () => V2.rotate(a, 0.7, out));
  add('Vector2.rotateCS (out)', () => V2.rotateCS(a, Math.cos(0.7), Math.sin(0.7), out));
  add('Vector2.perpendicular (out)', () => V2.perpendicular(a, out));

  // Transform integration
  add('Vector2.applyRotation2', () => V2.applyRotation2(a, rot, out));
  add('Vector2.applyMatrix2', () => V2.applyMatrix2(a, { m00: 1, m01: 0, m10: 0, m11: 1 }, out));
  add('Vector2.applyMatrix3', () => V2.applyMatrix3(a, m3, out));
  add('Vector2.applyTransform2', () => V2.applyTransform2(a, t2, out));
  add('Vector2.applyComplex', () => V2.applyComplex(a, c, out));

  // Rounding / component-wise
  add('Vector2.floor (out)', () => V2.floor(a, out));
  add('Vector2.ceil (out)', () => V2.ceil(a, out));
  add('Vector2.round (out)', () => V2.round(a, out));
  add('Vector2.abs (out)', () => V2.abs(a, out));
  add('Vector2.clamp (out)', () => V2.clamp(a, V2.fromValues(0, 0), V2.fromValues(10, 10), out));
  add('Vector2.min (out)', () => V2.min(a, b, out));
  add('Vector2.max (out)', () => V2.max(a, b, out));

  // Predicates
  add('Vector2.nearEquals', () => V2.nearEquals(a, b));
  add('Vector2.isFinite', () => V2.isFinite(a));
  add('Vector2.isParallel', () => V2.isParallel(a, b));

  // Inverse triality
  triality({
   default: ['Vector2.inverse', () => V2.inverse(a, out)],
   safe: ['Vector2.inverseSafe', () => V2.inverseSafe(a, out)],
   unchecked: ['Vector2.inverseUnchecked', () => V2.inverseUnchecked(a, out)],
  });

  // Set magnitude triality
  triality({
   default: ['Vector2.setMagnitude', () => V2.setMagnitude(a, 5.0, out)],
   safe: ['Vector2.setMagnitudeSafe', () => V2.setMagnitudeSafe(a, 5.0, out)],
   unchecked: ['Vector2.setMagnitudeUnchecked', () => V2.setMagnitudeUnchecked(a, 5.0, out)],
  });
 },
});
