/**
 * @file test/utils/random.node.spec.ts
 * @module @lenguados/math2d/utils
 * @description Tests for random generation utilities.
 */

import { describe, expect, it } from '@jest/globals';

import { Complex } from '../../src/core/complex';
import { Interval } from '../../src/core/interval';
import { Vector2 } from '../../src/core/vector2';
import {
 randomComplex,
 randomGaussianVector2,
 randomInBox,
 randomInCircle,
 randomInRectangle,
 randomInTriangle,
 randomInUnitCircle,
 randomInterval,
 randomOnCircle,
 randomOnRectangle,
 randomOnSegment,
 randomOnTriangle,
 randomInAnnulus,
 randomInAnnulusSafe,
 randomInAnnulusUnchecked,
 randomIsometry2,
 randomRotation2,
 randomRotationMatrix2,
 randomUnitComplex,
 randomUnitVector2,
 randomVector2,
} from '../../src/utils/random';
import { SeededRandomSource } from '../../src/utils/random-source';

describe('utils/random', () => {
 // Use seeded source for deterministic tests
 const createSource = () => new SeededRandomSource(12345);

 describe('determinism', () => {
  it('produces identical results with same seed', () => {
   const source1 = new SeededRandomSource(42);
   const source2 = new SeededRandomSource(42);

   const v1 = randomUnitVector2(new Vector2(), source1);
   const v2 = randomUnitVector2(new Vector2(), source2);

   expect(v1.x).toBe(v2.x);
   expect(v1.y).toBe(v2.y);
  });

  it('randomInUnitCircle is deterministic', () => {
   const source1 = new SeededRandomSource(123);
   const source2 = new SeededRandomSource(123);

   for (let index = 0; index < 10; index++) {
    const p1 = randomInUnitCircle(new Vector2(), source1);
    const p2 = randomInUnitCircle(new Vector2(), source2);
    expect(p1.x).toBe(p2.x);
    expect(p1.y).toBe(p2.y);
   }
  });

  it('randomGaussianVector2 is deterministic', () => {
   const source1 = new SeededRandomSource(456);
   const source2 = new SeededRandomSource(456);

   for (let index = 0; index < 10; index++) {
    const g1 = randomGaussianVector2(0, 1, new Vector2(), source1);
    const g2 = randomGaussianVector2(0, 1, new Vector2(), source2);
    expect(g1.x).toBe(g2.x);
    expect(g1.y).toBe(g2.y);
   }
  });
 });

 describe('randomVector2', () => {
  it('generates components in specified range', () => {
   const source = createSource();
   for (let index = 0; index < 100; index++) {
    const v = randomVector2(-5, 5, new Vector2(), source);
    expect(v.x).toBeGreaterThanOrEqual(-5);
    expect(v.x).toBeLessThan(5);
    expect(v.y).toBeGreaterThanOrEqual(-5);
    expect(v.y).toBeLessThan(5);
   }
  });

  it('uses default range [0, 1)', () => {
   const source = createSource();
   for (let index = 0; index < 100; index++) {
    const v = randomVector2(undefined, undefined, new Vector2(), source);
    expect(v.x).toBeGreaterThanOrEqual(0);
    expect(v.x).toBeLessThan(1);
    expect(v.y).toBeGreaterThanOrEqual(0);
    expect(v.y).toBeLessThan(1);
   }
  });
 });

 describe('randomUnitVector2', () => {
  it('returns unit length vectors', () => {
   const source = createSource();
   for (let index = 0; index < 100; index++) {
    const v = randomUnitVector2(new Vector2(), source);
    expect(v.magnitude()).toBeCloseTo(1, 6);
   }
  });
 });

 describe('randomOnCircle', () => {
  it('returns points on circle with correct radius', () => {
   const source = createSource();
   const radius = 5;
   for (let index = 0; index < 100; index++) {
    const p = randomOnCircle(radius, new Vector2(), source);
    expect(p.magnitude()).toBeCloseTo(radius, 6);
   }
  });
 });

 describe('randomInUnitCircle', () => {
  it('returns points inside unit circle', () => {
   const source = createSource();
   for (let index = 0; index < 100; index++) {
    const p = randomInUnitCircle(new Vector2(), source);
    expect(p.magnitude()).toBeLessThanOrEqual(1);
   }
  });
 });

 describe('randomInCircle', () => {
  it('returns points inside circle with correct radius', () => {
   const source = createSource();
   const radius = 10;
   for (let index = 0; index < 100; index++) {
    const p = randomInCircle(radius, new Vector2(), source);
    expect(p.magnitude()).toBeLessThanOrEqual(radius);
   }
  });
 });

 describe('randomRotation2', () => {
  it('returns valid rotations', () => {
   const source = createSource();
   for (let index = 0; index < 100; index++) {
    const r = randomRotation2(undefined, source);
    // cos² + sin² should equal 1
    expect(r.cos * r.cos + r.sin * r.sin).toBeCloseTo(1, 6);
   }
  });
 });

 describe('randomRotationMatrix2', () => {
  it('returns valid rotation matrices (det = 1)', () => {
   const source = createSource();
   for (let index = 0; index < 100; index++) {
    const m = randomRotationMatrix2(undefined, source);
    const det = m.determinant();
    expect(det).toBeCloseTo(1, 6);
   }
  });
 });

 describe('randomIsometry2', () => {
  it('returns transforms with position in unit circle', () => {
   const source = createSource();
   for (let index = 0; index < 100; index++) {
    const t = randomIsometry2(undefined, source);
    expect(t.position.magnitude()).toBeLessThanOrEqual(1);
   }
  });

  it('rename regression: randomRigidTransform2 is removed from the public API', () => {
   /*
    * Compile-time check. `randomRigidTransform2` was renamed to `randomIsometry2`
    * in 0.7.0. Any future re-introduction of the old name must fail TypeScript
    * compilation so the rename remains enforced permanently. The `@ts-expect-error`
    * directive MUST be immediately above the type alias it targets; the
    * `eslint-disable-line` therefore lives on the type-alias line itself.
    */
   // @ts-expect-error - randomRigidTransform2 is removed; use randomIsometry2 instead
   type _RemovedName = typeof import('../../src/utils/random').randomRigidTransform2; // eslint-disable-line @typescript-eslint/no-unused-vars -- intentional: the @ts-expect-error above is the assertion; the type alias exists only to force TypeScript to resolve the removed symbol name
   // Runtime sentinel so the it() block has an assertion (the @ts-expect-error above is the real check).
   expect(typeof randomIsometry2).toBe('function');
  });

  it('preserves the pre-rename behavioural contract bit-for-bit', () => {
   /*
    * Fixture captured from the predecessor symbol (`randomRigidTransform2`) under
    * the pre-rename 0.7.0 build with `SeededRandomSource(42)`. The rename is
    * body-preserving: the post-rename `randomIsometry2` MUST yield identical
    * components for the same seed.
    */
   const source = new SeededRandomSource(42);
   const t = randomIsometry2(undefined, source);
   expect(t.position.x).toBeCloseTo(0.306889309628814, 15);
   expect(t.position.y).toBeCloseTo(-0.003648841081425418, 15);
   expect(t.rotation.cos).toBeCloseTo(-0.612183147325127, 15);
   expect(t.rotation.sin).toBeCloseTo(0.7907160009327634, 15);
   expect(t.scale.x).toBe(1);
   expect(t.scale.y).toBe(1);
  });
 });

 describe('randomInAnnulus triality', () => {
  it('produces points with radius in [inner, outer]', () => {
   const source = createSource();
   const inner = 2;
   const outer = 5;
   for (let index = 0; index < 100; index++) {
    const p = randomInAnnulus(inner, outer, undefined, source);
    const r = p.magnitude();
    expect(r).toBeGreaterThanOrEqual(inner - 1e-9);
    expect(r).toBeLessThanOrEqual(outer + 1e-9);
   }
  });

  it('degenerates to a circle when inner === outer', () => {
   const source = createSource();
   const p = randomInAnnulus(3, 3, undefined, source);
   expect(p.magnitude()).toBeCloseTo(3, 8);
  });

  it('throws for negative inner radius', () => {
   expect(() => randomInAnnulus(-1, 2)).toThrow(RangeError);
  });

  it('throws when inner > outer', () => {
   expect(() => randomInAnnulus(5, 2)).toThrow(RangeError);
  });

  it('randomInAnnulusSafe returns fallback on invalid radii', () => {
   const fallback = { x: 9, y: 9 };
   const result = randomInAnnulusSafe(5, 2, fallback);
   expect(result.x).toBe(9);
   expect(result.y).toBe(9);
  });

  it('randomInAnnulusSafe produces valid sample for valid radii', () => {
   const source = createSource();
   const p = randomInAnnulusSafe(1, 2, undefined, undefined, source);
   const r = p.magnitude();
   expect(r).toBeGreaterThanOrEqual(1 - 1e-9);
   expect(r).toBeLessThanOrEqual(2 + 1e-9);
  });

  it('randomInAnnulusUnchecked matches randomInAnnulus for valid inputs', () => {
   // Use the same seeded source twice to compare outputs.
   const s1 = createSource();
   const s2 = createSource();
   const strict = randomInAnnulus(1, 3, undefined, s1);
   const unchecked = randomInAnnulusUnchecked(1, 3, undefined, s2);
   expect(unchecked.x).toBeCloseTo(strict.x, 12);
   expect(unchecked.y).toBeCloseTo(strict.y, 12);
  });
 });

 describe('randomInRectangle', () => {
  it('returns points inside rectangle', () => {
   const source = createSource();
   const width = 10;
   const height = 6;
   for (let index = 0; index < 100; index++) {
    const p = randomInRectangle(width, height, new Vector2(), source);
    expect(p.x).toBeGreaterThanOrEqual(-width / 2);
    expect(p.x).toBeLessThanOrEqual(width / 2);
    expect(p.y).toBeGreaterThanOrEqual(-height / 2);
    expect(p.y).toBeLessThanOrEqual(height / 2);
   }
  });
 });

 describe('randomInBox', () => {
  it('returns points inside box', () => {
   const source = createSource();
   for (let index = 0; index < 100; index++) {
    const p = randomInBox(1, 2, 5, 8, new Vector2(), source);
    expect(p.x).toBeGreaterThanOrEqual(1);
    expect(p.x).toBeLessThanOrEqual(5);
    expect(p.y).toBeGreaterThanOrEqual(2);
    expect(p.y).toBeLessThanOrEqual(8);
   }
  });
 });

 describe('randomOnRectangle', () => {
  it('returns points on rectangle perimeter', () => {
   const source = createSource();
   const width = 4;
   const height = 2;
   const halfW = width / 2;
   const halfH = height / 2;

   for (let index = 0; index < 100; index++) {
    const p = randomOnRectangle(width, height, new Vector2(), source);

    // Point should be on one of the edges
    const onLeft = Math.abs(p.x + halfW) < 0.0001;
    const onRight = Math.abs(p.x - halfW) < 0.0001;
    const onBottom = Math.abs(p.y + halfH) < 0.0001;
    const onTop = Math.abs(p.y - halfH) < 0.0001;

    expect(onLeft || onRight || onBottom || onTop).toBe(true);
   }
  });
 });

 describe('randomGaussianVector2', () => {
  it('produces values centered around mean', () => {
   const source = createSource();
   const mean = 5;
   const samples = 1000;
   let sumX = 0;
   let sumY = 0;

   for (let index = 0; index < samples; index++) {
    const v = randomGaussianVector2(mean, 1, new Vector2(), source);
    sumX += v.x;
    sumY += v.y;
   }

   const avgX = sumX / samples;
   const avgY = sumY / samples;

   // Mean should be close to specified value (within ~0.2 for 1000 samples)
   expect(avgX).toBeCloseTo(mean, 0);
   expect(avgY).toBeCloseTo(mean, 0);
  });
 });

 describe('randomOnSegment', () => {
  it('returns points on segment', () => {
   const source = createSource();
   const start = new Vector2(0, 0);
   const end = new Vector2(10, 0);

   for (let index = 0; index < 100; index++) {
    const p = randomOnSegment(start, end, new Vector2(), source);
    expect(p.x).toBeGreaterThanOrEqual(0);
    expect(p.x).toBeLessThanOrEqual(10);
    expect(p.y).toBeCloseTo(0, 6);
   }
  });
 });

 describe('randomInTriangle', () => {
  it('returns points inside triangle', () => {
   const source = createSource();
   const a = new Vector2(0, 0);
   const b = new Vector2(10, 0);
   const c = new Vector2(5, 10);

   for (let index = 0; index < 100; index++) {
    const p = randomInTriangle(a, b, c, new Vector2(), source);

    // Check using barycentric sign method
    const sign = (p1: Vector2, p2: Vector2, p3: Vector2) =>
     (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);

    const d1 = sign(p, a, b);
    const d2 = sign(p, b, c);
    const d3 = sign(p, c, a);

    const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
    const hasPos = d1 > 0 || d2 > 0 || d3 > 0;

    // Point is inside if all same sign (or on edge)
    expect(!(hasNeg && hasPos)).toBe(true);
   }
  });
 });

 describe('randomOnTriangle', () => {
  it('returns points on triangle perimeter', () => {
   const source = createSource();
   const a = new Vector2(0, 0);
   const b = new Vector2(10, 0);
   const c = new Vector2(5, 10);

   for (let index = 0; index < 100; index++) {
    const p = randomOnTriangle(a, b, c, new Vector2(), source);

    // Check if point is on one of the edges
    const distributionAB = distanceToSegment(p, a, b);
    const distributionBC = distanceToSegment(p, b, c);
    const distributionCA = distanceToSegment(p, c, a);

    const onEdge = distributionAB < 0.0001 || distributionBC < 0.0001 || distributionCA < 0.0001;
    expect(onEdge).toBe(true);
   }
  });
 });

 describe('default parameters', () => {
  it('randomVector2 works without explicit source', () => {
   const v = randomVector2();
   expect(v).toBeInstanceOf(Vector2);
   expect(Number.isFinite(v.x)).toBe(true);
   expect(Number.isFinite(v.y)).toBe(true);
  });

  it('randomUnitVector2 works without explicit source', () => {
   const v = randomUnitVector2();
   expect(v.magnitude()).toBeCloseTo(1, 6);
  });

  it('randomOnCircle works with default radius', () => {
   const p = randomOnCircle();
   expect(p.magnitude()).toBeCloseTo(1, 6);
  });

  it('randomInUnitCircle works without explicit source', () => {
   const p = randomInUnitCircle();
   expect(p.magnitude()).toBeLessThanOrEqual(1);
  });

  it('randomRotation2 works without explicit source', () => {
   const r = randomRotation2();
   expect(r.cos * r.cos + r.sin * r.sin).toBeCloseTo(1, 6);
  });

  it('randomRotationMatrix2 works without explicit source', () => {
   const m = randomRotationMatrix2();
   expect(m.determinant()).toBeCloseTo(1, 6);
  });

  it('randomIsometry2 works without explicit source', () => {
   const t = randomIsometry2();
   expect(t.position.magnitude()).toBeLessThanOrEqual(1);
  });

  it('randomGaussianVector2 works with defaults', () => {
   const v = randomGaussianVector2();
   expect(Number.isFinite(v.x)).toBe(true);
   expect(Number.isFinite(v.y)).toBe(true);
  });
 });

 describe('edge cases', () => {
  it('randomOnRectangle hits all four edges', () => {
   // Use a controlled source to hit each edge
   let bottomHit = false;
   let rightHit = false;
   let topHit = false;
   let leftHit = false;

   const source = new SeededRandomSource(999);
   const width = 10;
   const height = 5;
   const halfW = width / 2;
   const halfH = height / 2;

   for (let index = 0; index < 1000; index++) {
    const p = randomOnRectangle(width, height, new Vector2(), source);

    if (Math.abs(p.y + halfH) < 0.001) bottomHit = true;
    if (Math.abs(p.x - halfW) < 0.001) rightHit = true;
    if (Math.abs(p.y - halfH) < 0.001) topHit = true;
    if (Math.abs(p.x + halfW) < 0.001) leftHit = true;
   }

   expect(bottomHit).toBe(true);
   expect(rightHit).toBe(true);
   expect(topHit).toBe(true);
   expect(leftHit).toBe(true);
  });

  it('randomOnTriangle hits all three edges', () => {
   let abHit = false;
   let bcHit = false;
   let caHit = false;

   const source = new SeededRandomSource(777);
   const a = new Vector2(0, 0);
   const b = new Vector2(10, 0);
   const c = new Vector2(5, 10);

   for (let index = 0; index < 1000; index++) {
    const p = randomOnTriangle(a, b, c, new Vector2(), source);

    const distributionAB = distanceToSegment(p, a, b);
    const distributionBC = distanceToSegment(p, b, c);
    const distributionCA = distanceToSegment(p, c, a);

    if (distributionAB < 0.001) abHit = true;
    if (distributionBC < 0.001) bcHit = true;
    if (distributionCA < 0.001) caHit = true;
   }

   expect(abHit).toBe(true);
   expect(bcHit).toBe(true);
   expect(caHit).toBe(true);
  });

  it('randomInTriangle covers both barycentric branches', () => {
   // The function flips u,v when u+v > 1
   // We test enough samples to cover both branches
   const source = new SeededRandomSource(555);
   const a = new Vector2(0, 0);
   const b = new Vector2(1, 0);
   const c = new Vector2(0, 1);

   for (let index = 0; index < 100; index++) {
    const p = randomInTriangle(a, b, c, new Vector2(), source);
    // All points should be inside triangle
    expect(p.x).toBeGreaterThanOrEqual(-0.001);
    expect(p.y).toBeGreaterThanOrEqual(-0.001);
    expect(p.x + p.y).toBeLessThanOrEqual(1.001);
   }
  });
 });

 describe('output parameter reuse', () => {
  it('randomVector2 reuses output vector', () => {
   const source = new SeededRandomSource(111);
   const out = new Vector2(999, 999);
   const result = randomVector2(0, 1, out, source);
   expect(result).toBe(out);
   expect(out.x).not.toBe(999);
  });

  it('randomInCircle reuses output vector', () => {
   const source = new SeededRandomSource(222);
   const out = new Vector2(999, 999);
   const result = randomInCircle(5, out, source);
   expect(result).toBe(out);
  });

  it('randomInRectangle reuses output vector', () => {
   const source = new SeededRandomSource(333);
   const out = new Vector2(999, 999);
   const result = randomInRectangle(10, 10, out, source);
   expect(result).toBe(out);
  });

  it('randomInBox reuses output vector', () => {
   const source = new SeededRandomSource(444);
   const out = new Vector2(999, 999);
   const result = randomInBox(0, 0, 10, 10, out, source);
   expect(result).toBe(out);
  });

  it('randomOnSegment reuses output vector', () => {
   const source = new SeededRandomSource(555);
   const out = new Vector2(999, 999);
   const start = new Vector2(0, 0);
   const end = new Vector2(10, 10);
   const result = randomOnSegment(start, end, out, source);
   expect(result).toBe(out);
  });
 });

 describe('randomComplex', () => {
  it('generates Complex with components in specified range', () => {
   const source = new SeededRandomSource(12345);
   for (let index = 0; index < 100; index++) {
    const c = randomComplex(-5, 5, new Complex(), source);
    expect(c.real).toBeGreaterThanOrEqual(-5);
    expect(c.real).toBeLessThan(5);
    expect(c.imag).toBeGreaterThanOrEqual(-5);
    expect(c.imag).toBeLessThan(5);
   }
  });

  it('uses default range [0, 1)', () => {
   const source = new SeededRandomSource(12345);
   for (let index = 0; index < 100; index++) {
    const c = randomComplex(undefined, undefined, new Complex(), source);
    expect(c.real).toBeGreaterThanOrEqual(0);
    expect(c.real).toBeLessThan(1);
    expect(c.imag).toBeGreaterThanOrEqual(0);
    expect(c.imag).toBeLessThan(1);
   }
  });

  it('works without explicit source', () => {
   const c = randomComplex();
   expect(c).toBeInstanceOf(Complex);
   expect(Number.isFinite(c.real)).toBe(true);
   expect(Number.isFinite(c.imag)).toBe(true);
  });
 });

 describe('randomUnitComplex', () => {
  it('returns unit magnitude Complex', () => {
   const source = new SeededRandomSource(12345);
   for (let index = 0; index < 100; index++) {
    const c = randomUnitComplex(new Complex(), source);
    expect(c.magnitude()).toBeCloseTo(1, 6);
   }
  });

  it('works without explicit source', () => {
   const c = randomUnitComplex();
   expect(c.magnitude()).toBeCloseTo(1, 6);
  });
 });

 describe('randomInterval', () => {
  it('generates Interval within specified bounds', () => {
   const source = new SeededRandomSource(12345);
   for (let index = 0; index < 100; index++) {
    const interval = randomInterval(0, 10, new Interval(), source);
    expect(interval.min).toBeGreaterThanOrEqual(0);
    expect(interval.max).toBeLessThanOrEqual(10);
    expect(interval.min).toBeLessThanOrEqual(interval.max);
   }
  });

  it('uses default bounds [0, 1)', () => {
   const source = new SeededRandomSource(12345);
   for (let index = 0; index < 100; index++) {
    const interval = randomInterval(undefined, undefined, new Interval(), source);
    expect(interval.min).toBeGreaterThanOrEqual(0);
    expect(interval.max).toBeLessThanOrEqual(1);
   }
  });

  it('works without explicit source', () => {
   const interval = randomInterval();
   expect(interval).toBeInstanceOf(Interval);
   expect(Number.isFinite(interval.min)).toBe(true);
   expect(Number.isFinite(interval.max)).toBe(true);
  });

  it('reuses output interval', () => {
   const source = new SeededRandomSource(555);
   const out = new Interval(999, 1000);
   const result = randomInterval(0, 10, out, source);
   expect(result).toBe(out);
  });
 });
});

// Helper function for distance to segment
function distanceToSegment(p: Vector2, a: Vector2, b: Vector2): number {
 const dx = b.x - a.x;
 const dy = b.y - a.y;
 const lengthSq = dx * dx + dy * dy;

 if (lengthSq === 0) {
  return Math.sqrt((p.x - a.x) ** 2 + (p.y - a.y) ** 2);
 }

 let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSq;
 t = Math.max(0, Math.min(1, t));

 const closestX = a.x + t * dx;
 const closestY = a.y + t * dy;

 return Math.sqrt((p.x - closestX) ** 2 + (p.y - closestY) ** 2);
}
