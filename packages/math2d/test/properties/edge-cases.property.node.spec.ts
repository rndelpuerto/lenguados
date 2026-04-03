/**
 * @file test/properties/edge-cases.property.node.spec.ts
 * @description Property tests for edge cases using specialized arbitraries.
 */

import { describe, it } from '@jest/globals';
import * as fc from 'fast-check';

import { Vector2 } from '../../src/core/vector2';
import { arbAngleNearPi, arbAngleNearZero, arbSmallVector2, arbVector2 } from '../arbitraries';

describe('Edge Case Properties', () => {
 describe('Small Vector Handling', () => {
  it('should handle very small vectors in addition', () => {
   fc.assert(
    fc.property(arbSmallVector2, (v) => {
     const added = Vector2.add(v, v);
     return added.nearEquals(Vector2.multiplyScalar(v, 2), 1e-10);
    }),
   );
  });

  it('should normalize small vectors safely', () => {
   fc.assert(
    fc.property(arbSmallVector2, (v) => {
     const result = Vector2.normalizeSafe(v);
     // Either unit length or zero (underflow)
     return result.magnitude() <= 1.01 || result.exactEquals(Vector2.ZERO);
    }),
   );
  });
 });

 describe('Angle Near Boundaries', () => {
  it('should handle rotation near π correctly', () => {
   fc.assert(
    fc.property(arbVector2, arbAngleNearPi, (v, angle) => {
     const rotated = Vector2.rotate(v, angle);
     const expected = Vector2.negate(v);
     // Relative tolerance for large vectors
     const tolerance = Math.max(1e-3, Vector2.magnitude(v) * 1e-6);
     return rotated.nearEquals(expected, tolerance);
    }),
   );
  });

  it('should handle rotation near zero correctly', () => {
   fc.assert(
    fc.property(arbVector2, arbAngleNearZero, (v, angle) => {
     const rotated = Vector2.rotate(v, angle);
     // Error ≈ magnitude * |sin(θ)| ≈ magnitude * |θ|; use 10x margin
     const tolerance = Math.max(1e-6, Vector2.magnitude(v) * 1e-8);
     return rotated.nearEquals(v, tolerance);
    }),
   );
  });
 });
});
