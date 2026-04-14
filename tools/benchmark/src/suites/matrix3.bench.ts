/**
 * Matrix3 benchmark suite.
 */

import type { SuiteDefinition } from '../harness/suite.ts';
import { createBenchmarkBuilder } from '../harness/suite-builder.ts';

/* eslint-disable @typescript-eslint/no-explicit-any */

let M3: any;
let a: any;
let b: any;
let out: any;
let v: any;
let vOut: any;

export function defineSuite(): SuiteDefinition {
 const { add, entries } = createBenchmarkBuilder();
 return {
  name: 'Matrix3',
  dimensions: {
   environment: ['node'],
   buildMode: ['development', 'production'],
   determinism: ['fdlibm', 'native'],
   tier: ['default', 'safe', 'unchecked'],
   entity: ['Matrix3'],
  },

  setup(math2d) {
   M3 = math2d['Matrix3'] as any;
   const V2 = math2d['Vector2'] as any;

   a = M3.fromRotation(0.7);
   b = M3.fromScale({ x: 2.0, y: 1.5 });
   out = M3.fromValues(0, 0, 0, 0, 0, 0, 0, 0, 0);
   v = V2.fromValues(3.5, 7.2);
   vOut = V2.fromValues(0, 0);

   // Factories
   add('Matrix3.fromRotation (out)', () => M3.fromRotation(0.7, out));
   add('Matrix3.fromTranslation (out)', () => M3.fromTranslation({ x: 1.0, y: 2.0 }, out));
   add('Matrix3.fromScale (out)', () => M3.fromScale({ x: 2.0, y: 1.5 }, out));
   add('Matrix3.fromSRT (out)', () => {
    const r = (math2d['Rotation2'] as any).fromAngle(0.7);
    return M3.fromTransform2Like({ position: v, rotation: r, scale: V2.fromValues(1, 1) }, out);
   });

   // Arithmetic
   add('Matrix3.multiply (out)', () => M3.multiply(a, b, out));
   add('Matrix3.premultiply (out)', () => M3.premultiply(a, b, out));
   add('Matrix3.multiplyScalar (out)', () => M3.multiplyScalar(a, 2.5, out));
   add('Matrix3.negate (out)', () => M3.negate(a, out));

   // Inverse triality
   add('Matrix3.inverse', () => M3.inverse(a, out), 'default');
   add('Matrix3.inverseSafe', () => M3.inverseSafe(a, out), 'safe');
   add('Matrix3.inverseUnchecked', () => M3.inverseUnchecked(a, out), 'unchecked');

   // Affine inverse triality
   add('Matrix3.inverseAffine', () => M3.inverseAffine(a, out), 'default');
   add('Matrix3.inverseAffineSafe', () => M3.inverseAffineSafe(a, out), 'safe');
   add('Matrix3.inverseAffineUnchecked', () => M3.inverseAffineUnchecked(a, out), 'unchecked');

   // Matrix operations
   add('Matrix3.transpose (out)', () => M3.transpose(a, out));
   add('Matrix3.adjugate (out)', () => M3.adjugate(a, out));
   add('Matrix3.determinant', () => M3.determinant(a));
   add('Matrix3.trace', () => M3.trace(a));
   add('Matrix3.frobeniusNorm', () => M3.frobeniusNorm(a));
   add('Matrix3.decompose', () => M3.decompose(a));

   // Transform point/vector
   add('Matrix3.transformPoint (out)', () => M3.transformPoint(a, v, vOut));
   add('Matrix3.transformVector (out)', () => M3.transformVector(a, v, vOut));

   // Composition operations
   add('Matrix3.translate (out)', () => M3.translate(a, { x: 1.0, y: 2.0 }, out));
   add('Matrix3.rotate (out)', () => M3.rotate(a, 0.3, out));
   add('Matrix3.rotateCS (out)', () => M3.rotateCS(a, Math.cos(0.3), Math.sin(0.3), out));
   add('Matrix3.scaleBy (out)', () => M3.scaleBy(a, { x: 2.0, y: 1.5 }, out));

   // Extraction
   add('Matrix3.getTranslation (out)', () => M3.getTranslation(a, vOut));
   add('Matrix3.getScale (out)', () => M3.getScale(a, vOut));
   add('Matrix3.getRotation', () => M3.getRotation(a));

   // Interpolation
   add('Matrix3.lerp (out)', () => M3.lerp(a, b, 0.5, out));

   // Predicates
   add('Matrix3.nearEquals', () => M3.nearEquals(a, b));
   add('Matrix3.isInvertible', () => M3.isInvertible(a));
   add('Matrix3.isAffine', () => M3.isAffine(a));
   add('Matrix3.isOrthogonal', () => M3.isOrthogonal(a));
  },

  get benchmarks() { return entries; },
 };
}
