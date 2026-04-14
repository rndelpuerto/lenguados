/**
 * Transform2 benchmark suite.
 */

import type { SuiteDefinition } from '../harness/suite.ts';
import { createBenchmarkBuilder } from '../harness/suite-builder.ts';

/* eslint-disable @typescript-eslint/no-explicit-any */

let T2: any;
let V2: any;
let a: any;
let b: any;
let out: any;
let v: any;
let vOut: any;

export function defineSuite(): SuiteDefinition {
 const { add, entries } = createBenchmarkBuilder();
 return {
  name: 'Transform2',
  dimensions: {
   environment: ['node'],
   buildMode: ['development', 'production'],
   determinism: ['fdlibm', 'native'],
   tier: ['default', 'safe', 'unchecked'],
   entity: ['Transform2'],
  },

  setup(math2d) {
   T2 = math2d['Transform2'] as any;
   V2 = math2d['Vector2'] as any;
   const M3 = math2d['Matrix3'] as any;

   a = T2.fromComponents(V2.fromValues(1, 2), 0.5, V2.fromValues(1.5, 1.5));
   b = T2.fromComponents(V2.fromValues(3, 4), 1.2, V2.fromValues(2, 2));
   out = T2.fromComponents(V2.fromValues(0, 0), 0, V2.fromValues(1, 1));
   v = V2.fromValues(3.5, 7.2);
   vOut = V2.fromValues(0, 0);

   // Factories
   add('Transform2.fromComponents (out)', () =>
    T2.fromComponents(V2.fromValues(1, 2), 0.5, V2.fromValues(1, 1), out));
   add('Transform2.fromMatrix3 (out)', () => T2.fromMatrix3(M3.fromRotation(0.7), out));
   add('Transform2.fromPose (out)', () => T2.fromPose(V2.fromValues(1, 2), 0.5, out));

   // Composition
   add('Transform2.multiply (out)', () => T2.multiply(a, b, out));

   // Inverse triality
   add('Transform2.inverse', () => T2.inverse(a, out), 'default');
   add('Transform2.inverseSafe', () => T2.inverseSafe(a, out), 'safe');
   add('Transform2.inverseUnchecked', () => T2.inverseUnchecked(a, out), 'unchecked');

   // Transform point/vector + *CS variants
   add('Transform2.transformPoint (out)', () => T2.transformPoint(a, v, vOut));
   add('Transform2.transformPointCS (out)', () =>
    T2.transformPointCS(a, v, a.rotation.cos, a.rotation.sin, vOut));
   add('Transform2.transformVector (out)', () => T2.transformVector(a, v, vOut));
   add('Transform2.transformVectorCS (out)', () =>
    T2.transformVectorCS(a, v, a.rotation.cos, a.rotation.sin, vOut));
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

  get benchmarks() { return entries; },
 };
}
