/**
 * @file test/properties/interval.property.node.spec.ts
 * @module @lenguados/math2d/core
 * @description Property-based tests for Interval.
 */

import { describe, it } from '@jest/globals';
import * as fc from 'fast-check';

import { Interval } from '../../src/core/interval';
import { arbInterval, arbCoordinate } from '../arbitraries';

const TEST_TOLERANCE = 1e-9;

describe('Interval Property-Based Tests', () => {
 // ========================================================================
 // Basic Properties
 // ========================================================================

 describe('Basic Properties', () => {
  it('should satisfy: min <= max always', () => {
   fc.assert(
    fc.property(arbInterval, (interval) => {
     return interval.min <= interval.max;
    }),
   );
  });

  it('should satisfy: width = max - min', () => {
   fc.assert(
    fc.property(arbInterval, (interval) => {
     return Math.abs(interval.width() - (interval.max - interval.min)) < TEST_TOLERANCE;
    }),
   );
  });

  it('should satisfy: center = (min + max) / 2', () => {
   fc.assert(
    fc.property(arbInterval, (interval) => {
     const expectedCenter = (interval.min + interval.max) / 2;
     return Math.abs(interval.center() - expectedCenter) < TEST_TOLERANCE;
    }),
   );
  });
 });

 // ========================================================================
 // Contains
 // ========================================================================

 describe('Contains', () => {
  it('should satisfy: interval contains min', () => {
   fc.assert(
    fc.property(arbInterval, (interval) => {
     return interval.contains(interval.min);
    }),
   );
  });

  it('should satisfy: interval contains max', () => {
   fc.assert(
    fc.property(arbInterval, (interval) => {
     return interval.contains(interval.max);
    }),
   );
  });

  it('should satisfy: interval contains center', () => {
   fc.assert(
    fc.property(arbInterval, (interval) => {
     return interval.contains(interval.center());
    }),
   );
  });
 });

 // ========================================================================
 // Set Operations
 // ========================================================================

 describe('Set Operations', () => {
  it('should satisfy: union(a, a) = a', () => {
   fc.assert(
    fc.property(arbInterval, (a) => {
     const result = Interval.union(a, a);
     return Interval.nearEquals(result, a);
    }),
   );
  });

  it('should satisfy: union(a, b) contains a', () => {
   fc.assert(
    fc.property(arbInterval, arbInterval, (a, b) => {
     const union = Interval.union(a, b);
     return union.contains(a.min) && union.contains(a.max);
    }),
   );
  });

  it('should satisfy: union(a, b) contains b', () => {
   fc.assert(
    fc.property(arbInterval, arbInterval, (a, b) => {
     const union = Interval.union(a, b);
     return union.contains(b.min) && union.contains(b.max);
    }),
   );
  });

  it('should satisfy: intersect(a, a) = a', () => {
   fc.assert(
    fc.property(arbInterval, (a) => {
     const result = Interval.intersect(a, a);
     return Interval.nearEquals(result, a);
    }),
   );
  });
 });

 // ========================================================================
 // Interpolation (sample within interval)
 // ========================================================================

 describe('Internal Interpolation (sample)', () => {
  it('should satisfy: sample(0) = min', () => {
   fc.assert(
    fc.property(arbInterval, (interval) => {
     const result = interval.sample(0);
     return Math.abs(result - interval.min) < TEST_TOLERANCE;
    }),
   );
  });

  it('should satisfy: sample(1) = max', () => {
   fc.assert(
    fc.property(arbInterval, (interval) => {
     const result = interval.sample(1);
     return Math.abs(result - interval.max) < TEST_TOLERANCE;
    }),
   );
  });

  it('should satisfy: sample(0.5) = center', () => {
   fc.assert(
    fc.property(arbInterval, (interval) => {
     const result = interval.sample(0.5);
     return Math.abs(result - interval.center()) < TEST_TOLERANCE;
    }),
   );
  });

  it('should satisfy: sample result is always in interval (clamped)', () => {
   fc.assert(
    fc.property(arbInterval, fc.float({ min: -10, max: 10, noNaN: true }), (interval, t) => {
     const result = interval.sample(t);
     return result >= interval.min && result <= interval.max;
    }),
   );
  });
 });

 // ========================================================================
 // Static lerp (between intervals)
 // ========================================================================

 describe('Interval-to-Interval Interpolation', () => {
  it('should satisfy: Interval.lerp(a, b, 0) = a', () => {
   fc.assert(
    fc.property(arbInterval, arbInterval, (a, b) => {
     const result = Interval.lerp(a, b, 0);
     return Interval.nearEquals(result, a);
    }),
   );
  });

  it('should satisfy: Interval.lerp(a, b, 1) = b', () => {
   fc.assert(
    fc.property(arbInterval, arbInterval, (a, b) => {
     const result = Interval.lerp(a, b, 1);
     return Interval.nearEquals(result, b);
    }),
   );
  });
 });

 // ========================================================================
 // Equality
 // ========================================================================

 describe('Equality', () => {
  it('should satisfy: exactEquals reflexivity (a = a)', () => {
   fc.assert(
    fc.property(arbInterval, (a) => {
     return Interval.exactEquals(a, a);
    }),
   );
  });

  it('should satisfy: nearEquals reflexivity', () => {
   fc.assert(
    fc.property(arbInterval, (a) => {
     return Interval.nearEquals(a, a);
    }),
   );
  });

  it('should satisfy: clone equals original', () => {
   fc.assert(
    fc.property(arbInterval, (a) => {
     const clone = a.clone();
     return Interval.exactEquals(a, clone);
    }),
   );
  });
 });

 // ========================================================================
 // Union Expansion
 // ========================================================================

 describe('Union Expansion', () => {
  it('should satisfy: union with point-interval expands appropriately', () => {
   fc.assert(
    fc.property(arbInterval, arbCoordinate, (interval, value) => {
     const pointInterval = Interval.fromValue(value);
     const result = Interval.union(interval, pointInterval);
     return result.contains(value);
    }),
   );
  });

  it('should satisfy: union(a, b).width >= max(a.width, b.width)', () => {
   fc.assert(
    fc.property(arbInterval, arbInterval, (a, b) => {
     const union = Interval.union(a, b);
     return union.width() >= Math.max(a.width(), b.width()) - TEST_TOLERANCE;
    }),
   );
  });
 });
});
