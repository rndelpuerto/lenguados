/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file src/__tests__/vector2.node.spec.ts
 * @description Jest tests for the vector2.ts module in the math2d package.
 */

import { EPSILON, TAU } from '../scalar';
import { Vector2, freezeVector2, isVector2Like, ReadonlyVector2, Vector2Like } from '../vector2';

const DIGITS = 10; // toBeCloseTo decimal digits

function expectVecClose(v: ReadonlyVector2, x: number, y: number, digits = DIGITS) {
 expect(v.x).toBeCloseTo(x, digits);
 expect(v.y).toBeCloseTo(y, digits);
}

describe('Helpers', () => {
 it('freezeVector2 returns the same instance and freezes it', () => {
  const v = new Vector2(1, 2);
  const frozen = freezeVector2(v);

  expect(frozen).toBe(v);
  expect(Object.isFrozen(frozen)).toBe(true);

  // In strict mode assigning to a frozen object should throw
  expect(() => ((frozen as any).x = 5)).toThrow(TypeError);
 });

 it('isVector2Like type guard', () => {
  expect(isVector2Like({ x: 1, y: 2 })).toBe(true);
  expect(isVector2Like({ x: 1 })).toBe(false);
  expect(isVector2Like(null)).toBe(false);
  expect(isVector2Like('nope')).toBe(false);

  // Should accept readonly-like
  const ro: Readonly<Vector2Like> = { x: 3, y: 4 };

  expect(isVector2Like(ro)).toBe(true);
 });
});

describe('Static constants', () => {
 it('ZERO_VECTOR, ONE_VECTOR and unit axes are correct and frozen', () => {
  expectVecClose(Vector2.ZERO_VECTOR, 0, 0);
  expectVecClose(Vector2.ONE_VECTOR, 1, 1);
  expectVecClose(Vector2.UNIT_X_VECTOR, 1, 0);
  expectVecClose(Vector2.UNIT_Y_VECTOR, 0, 1);

  expect(Object.isFrozen(Vector2.ZERO_VECTOR)).toBe(true);
  expect(Object.isFrozen(Vector2.ONE_VECTOR)).toBe(true);
 });

 it('NEGATIVE_* constants', () => {
  expectVecClose(Vector2.NEGATIVE_ONE_VECTOR, -1, -1);
  expectVecClose(Vector2.NEGATIVE_UNIT_X_VECTOR, -1, 0);
  expectVecClose(Vector2.NEGATIVE_UNIT_Y_VECTOR, 0, -1);
 });

 it('DIAGONAL unit constants', () => {
  expectVecClose(Vector2.UNIT_DIAGONAL_VECTOR, Math.SQRT1_2, Math.SQRT1_2);
  expectVecClose(Vector2.NEGATIVE_UNIT_DIAGONAL_VECTOR, -Math.SQRT1_2, -Math.SQRT1_2);
 });

 it('Infinity constants', () => {
  expect(Vector2.INFINITY_VECTOR.x).toBe(Number.POSITIVE_INFINITY);
  expect(Vector2.NEGATIVE_INFINITY_VECTOR.y).toBe(Number.NEGATIVE_INFINITY);
 });
});

describe('Constructors & factories', () => {
 it('default constructs to (0,0)', () => {
  const v = new Vector2();

  expectVecClose(v, 0, 0);
 });

 it('constructs from (x,y)', () => {
  const v = new Vector2(3, 4);

  expectVecClose(v, 3, 4);
 });

 it('constructs from tuple', () => {
  const v = new Vector2([5, 6]);

  expectVecClose(v, 5, 6);
 });

 it('constructs from plain object {x,y}', () => {
  const v = new Vector2({ x: 7, y: 8 });

  expectVecClose(v, 7, 8);
 });

 it('copy-constructs from Vector2', () => {
  const a = new Vector2(9, 10);
  const b = new Vector2(a);

  expectVecClose(b, 9, 10);
  expect(b).not.toBe(a);
 });

 it('constructor validates object numeric fields', () => {
  // @ts-expect-error: Intentional wrong type for `x` to assert constructor runtime validation (non-numeric x should throw).
  expect(() => new Vector2({ x: 'a', y: 2 })).toThrow(RangeError);
 });

 it('fromValues/fromObject/fromArray', () => {
  expectVecClose(Vector2.fromValues(1, 2), 1, 2);
  expectVecClose(Vector2.fromObject({ x: 3, y: 4 }), 3, 4);
  expectVecClose(Vector2.fromArray([7, 8, 9]), 7, 8);

  const out = new Vector2();
  const returnValue = Vector2.fromArray([10, 11, 12], 1, out);

  expect(returnValue).toBe(out);
  expectVecClose(out, 11, 12);
 });

 it('fromArray offset validation', () => {
  expect(() => Vector2.fromArray([1], 1)).toThrow(RangeError);
 });

 it('fromObject validates numeric props', () => {
  // @ts-expect-error: Intentional wrong type for `x` to assert fromObject runtime validation (non-numeric x should throw).
  expect(() => Vector2.fromObject({ x: '1', y: 2 })).toThrow(TypeError);
 });

 it('fromAngle with and without length', () => {
  const v = Vector2.fromAngle(0);

  expectVecClose(v, 1, 0);

  const w = Vector2.fromAngle(Math.PI / 2, 2);

  expectVecClose(w, 0, 2);
 });

 it('parse valid "x,y" string', () => {
  expectVecClose(Vector2.parse('3.5, 4'), 3.5, 4);
 });

 it('parse invalid string throws', () => {
  expect(() => Vector2.parse('oops')).toThrow(Error);
 });

 it('random unit vector has length 1', () => {
  const r = Vector2.random();

  expect(Vector2.length(r)).toBeCloseTo(1, 8);
 });

 it('randomOnCircle radius', () => {
  const r = Vector2.randomOnCircle(2);

  expect(Vector2.length(r)).toBeCloseTo(2, 8);
 });

 it('randomInUnitCircle is inside unit disk', () => {
  const r = Vector2.randomInUnitCircle();

  expect(Vector2.length(r)).toBeLessThanOrEqual(1 + 1e-12);
 });
});

describe('Component access & swizzles', () => {
 it('getComponent(0|1)', () => {
  const v = new Vector2(5, 9);

  expect(v.getComponent(0)).toBe(5);
  expect(v.getComponent(1)).toBe(9);
 });

 it('xy, yx, xx, yy getters create proper vectors', () => {
  const v = new Vector2(2, 7);

  expectVecClose(v.xy, 2, 7);
  expectVecClose(v.yx, 7, 2);
  expectVecClose(v.xx, 2, 2);
  expectVecClose(v.yy, 7, 7);
 });
});

describe('Basic mutators', () => {
 it('set, setComponent, setX, setY, setScalar, copy, zero', () => {
  const v = new Vector2().set(1, 2);

  expectVecClose(v, 1, 2);

  v.setComponent(0, 10).setComponent(1, 20);

  expectVecClose(v, 10, 20);

  v.setX(3).setY(4);

  expectVecClose(v, 3, 4);

  v.setScalar(5);

  expectVecClose(v, 5, 5);

  v.copy(new Vector2(8, 9));

  expectVecClose(v, 8, 9);

  v.zero();

  expectVecClose(v, 0, 0);
 });
});

describe('Arithmetic (static & instance)', () => {
 const a = new Vector2(3, 4);
 const b = new Vector2(1, 2);

 it('sumComponents', () => {
  expect(Vector2.sumComponents(a)).toBe(7);
  expect(a.sumComponents()).toBe(7);
 });

 it('add/addScalar', () => {
  expectVecClose(Vector2.add(a, b), 4, 6);
  expectVecClose(Vector2.addScalar(a, 2), 5, 6);

  const v = new Vector2(1, 1).add(new Vector2(2, 3)).addScalar(4);

  expectVecClose(v, 7, 8);
 });

 it('sub/subScalar', () => {
  expectVecClose(Vector2.sub(a, b), 2, 2);
  expectVecClose(Vector2.subScalar(a, 1), 2, 3);

  const v = new Vector2(5, 5).sub(new Vector2(2, 1)).subScalar(1);

  expectVecClose(v, 2, 3);
 });

 it('multiply/multiplyScalar', () => {
  expectVecClose(Vector2.multiply(a, b), 3, 8);
  expectVecClose(Vector2.multiplyScalar(a, 2), 6, 8);

  const v = new Vector2(2, 3).multiply(new Vector2(4, 5)).multiplyScalar(2);

  expectVecClose(v, 16, 30);
 });

 it('divide/divideScalar', () => {
  expectVecClose(Vector2.divide(a, b), 3, 2);
  expectVecClose(Vector2.divideScalar(a, 2), 1.5, 2);

  const v = new Vector2(12, 6).divide(new Vector2(3, 2)).divideScalar(3);

  expectVecClose(v, 1.3333333333, 1);
 });

 it('divide throws on zero components', () => {
  expect(() => Vector2.divide(a, new Vector2(0, 1))).toThrow(RangeError);
  expect(() => new Vector2(1, 1).divideScalar(0)).toThrow(RangeError);
 });

 it('divideSafe/divideScalarSafe', () => {
  const res1 = Vector2.divideSafe(new Vector2(2, 3), new Vector2(0, 3));

  expectVecClose(res1, 0, 1);

  const res2 = Vector2.divideScalarSafe(new Vector2(2, 3), 0);

  expectVecClose(res2, 0, 0);

  const v = new Vector2(4, 6).divideSafe(new Vector2(2, 0));

  expectVecClose(v, 2, 0);
 });

 it('mod/modScalar and errors', () => {
  expectVecClose(Vector2.mod(new Vector2(5, 8), new Vector2(3, 3)), 2, 2);
  expectVecClose(Vector2.modScalar(new Vector2(7, 10), 4), 3, 2);

  expect(() => Vector2.mod(new Vector2(1, 2), new Vector2(0, 1))).toThrow(RangeError);
  expect(() => Vector2.modScalar(new Vector2(1, 2), 0)).toThrow(RangeError);

  const v = new Vector2(5, 8).mod(new Vector2(3, 3)).modScalar(2);

  expectVecClose(v, 0, 0);
 });

 it('negate/negated', () => {
  expectVecClose(Vector2.negate(a), -3, -4);

  const v = new Vector2(1, -2);

  expectVecClose(v.negated, -1, 2);

  v.negate();

  expectVecClose(v, -1, 2);
 });

 it('addScaledVector (static & instance)', () => {
  const base = new Vector2(1, 2);
  const scaled = new Vector2(3, 4);
  const res = Vector2.addScaledVector(base, scaled, 2);

  expectVecClose(res, 7, 10);

  const v = new Vector2(1, 2).addScaledVector(new Vector2(3, 4), 2);

  expectVecClose(v, 7, 10);
 });

 it('dot/cross/cross3', () => {
  expect(Vector2.dot(a, b)).toBe(11);
  expect(Vector2.cross(a, b)).toBe(2);

  const area2 = Vector2.cross3(new Vector2(0, 0), new Vector2(1, 0), new Vector2(0, 1));

  expect(area2).toBe(1);
 });

 it('crossVS/crossSV and instance crossScalarRight/Left', () => {
  const v = new Vector2(1, 2);

  expectVecClose(Vector2.crossVS(v, 3), 6, -3);
  expectVecClose(Vector2.crossSV(3, v), -6, 3);

  const index1 = new Vector2(1, 2).crossScalarRight(3);

  expectVecClose(index1, 6, -3);

  const index2 = new Vector2(1, 2).crossScalarLeft(3);

  expectVecClose(index2, -6, 3);
 });
});

describe('Interpolation', () => {
 it('lerp (static & instance)', () => {
  const a = new Vector2(0, 0);
  const b = new Vector2(10, 20);
  const m = Vector2.lerp(a, b, 0.5);

  expectVecClose(m, 5, 10);

  const v = new Vector2(0, 0).lerp(new Vector2(10, 20), 0.25);

  expectVecClose(v, 2.5, 5);
 });

 it('lerpClamped clamps t to [0,1]', () => {
  const a = new Vector2(0, 0);
  const b = new Vector2(10, 10);

  expectVecClose(Vector2.lerpClamped(a, b, -1), 0, 0);
  expectVecClose(Vector2.lerpClamped(a, b, 2), 10, 10);

  const v = new Vector2(0, 0).lerpClamped(new Vector2(8, 8), 2);

  expectVecClose(v, 8, 8);
 });
});

describe('Measures & geometry', () => {
 it('length/lengthSq/manhattanLength', () => {
  const v = new Vector2(3, 4);

  expect(v.length()).toBeCloseTo(5, DIGITS);
  expect(v.lengthSq()).toBe(25);
  expect(v.manhattanLength()).toBe(7);
 });

 it('distance/distanceSq/manhattanDistance', () => {
  const a = new Vector2(1, 2);
  const b = new Vector2(4, 6);

  expect(Vector2.distance(a, b)).toBeCloseTo(5, DIGITS);
  expect(Vector2.distanceSq(a, b)).toBe(25);
  expect(Vector2.manhattanDistance(a, b)).toBe(7);

  expect(a.distanceTo(b)).toBeCloseTo(5, DIGITS);
  expect(a.distanceToSq(b)).toBe(25);
  expect(a.manhattanDistanceTo(b)).toBe(7);
 });
});

describe('Direction & angles', () => {
 it('direction (static) and directionTo (instance)', () => {
  const a = new Vector2(0, 0);
  const b = new Vector2(10, 0);
  const dir = Vector2.direction(a, b);

  expectVecClose(dir, 1, 0);

  const same = Vector2.direction(a, a);

  expectVecClose(same, 0, 0);

  const d2 = new Vector2(0, 0).directionTo(new Vector2(0, 5));
  expectVecClose(d2, 0, 1);
 });

 it('angle, angleTo, angleBetween', () => {
  const v = new Vector2(0, 1);

  expect(v.angle()).toBeCloseTo(Math.PI / 2, DIGITS);

  const a = new Vector2(1, 0);
  const b = new Vector2(0, 1);

  expect(a.angleTo(b)).toBeCloseTo(Math.PI / 2, DIGITS);
  expect(a.angleBetween(b)).toBeCloseTo(Math.PI / 2, DIGITS);

  const c = new Vector2(-1, 0);

  expect(Vector2.angle(c)).toBeCloseTo(Math.PI, DIGITS);
 });
});

describe('Numeric transforms', () => {
 it('floor/ceil/round/abs (static & instance)', () => {
  const v = new Vector2(1.2, -1.8).floor();

  expectVecClose(v, 1, -2);

  v.ceil();

  expectVecClose(v, 1, -2);

  v.round();

  expectVecClose(v, 1, -2);

  v.set(-3, 4).abs();

  expectVecClose(v, 3, 4);

  expectVecClose(Vector2.floor(new Vector2(1.2, -1.8)), 1, -2);
  expectVecClose(Vector2.ceil(new Vector2(1.2, -1.8)), 2, -1);
  expectVecClose(Vector2.round(new Vector2(1.4, -1.6)), 1, -2);
  expectVecClose(Vector2.abs(new Vector2(-5, 6)), 5, 6);
 });

 it('inverse/inverseSafe', () => {
  expectVecClose(Vector2.inverse(new Vector2(2, -4)), 0.5, -0.25);
  expect(() => Vector2.inverse(new Vector2(0, 1))).toThrow(RangeError);

  const v = new Vector2(0, 2).inverseSafe();

  expectVecClose(v, 0, 0.5);

  expectVecClose(Vector2.inverseSafe(new Vector2(0, 3)), 0, 1 / 3);
 });

 it('swap (static & instance)', () => {
  const v = new Vector2(7, 9).swap();

  expectVecClose(v, 9, 7);
  expectVecClose(Vector2.swap(new Vector2(1, 2)), 2, 1);
 });
});

describe('Constraints', () => {
 it('clamp / clampScalar (static & instance)', () => {
  const v = new Vector2(5, -5).clamp(new Vector2(0, 0), new Vector2(10, 10)).clampScalar(-2, 2);

  expectVecClose(v, 2, 0);

  expectVecClose(Vector2.clamp(new Vector2(5, -5), new Vector2(0, 0), new Vector2(3, 3)), 3, 0);
  expectVecClose(Vector2.clampScalar(new Vector2(5, -5), -2, 2), 2, -2);
 });

 it('clampLength', () => {
  const a = new Vector2(3, 4); // length 5
  const res1 = Vector2.clampLength(a, 6, 10);

  expect(Vector2.length(res1)).toBeCloseTo(6, DIGITS); // scaled up

  const res2 = Vector2.clampLength(a, 0, 2);

  expect(Vector2.length(res2)).toBeCloseTo(2, DIGITS); // scaled down

  const z = new Vector2().clampLength(1, 2); // zero remains zero

  expectVecClose(z, 0, 0);
 });

 it('limit (static & instance)', () => {
  const v = new Vector2(3, 4).limit(2); // 5 → 2

  expect(v.length()).toBeCloseTo(2, DIGITS);

  const w = Vector2.limit(new Vector2(6, 8), 5);

  expect(Vector2.length(w)).toBeCloseTo(5, DIGITS);
 });

 it('min/max (static & instance)', () => {
  const v = new Vector2(5, 1).min(new Vector2(3, 7)).max(new Vector2(4, 0));

  expectVecClose(v, 4, 1);

  expectVecClose(Vector2.min(new Vector2(5, 1), new Vector2(3, 7)), 3, 1);
  expectVecClose(Vector2.max(new Vector2(5, 1), new Vector2(3, 7)), 5, 7);
 });
});

describe('Vector transforms', () => {
 it('normalize / normalizeSafe', () => {
  const v = new Vector2(3, 4).normalize();

  expectVecClose(v, 0.6, 0.8);
  expect(() => new Vector2(0, 0).normalize()).toThrow(RangeError);

  const s = new Vector2(0, 0).normalizeSafe();

  expectVecClose(s, 0, 0);

  expectVecClose(Vector2.normalize(new Vector2(3, 4)), 0.6, 0.8);
  expectVecClose(Vector2.normalizeSafe(new Vector2(0, 0)), 0, 0);
 });

 it('setLength / setLengthSafe', () => {
  const v = new Vector2(3, 4).setLength(10);

  expect(v.length()).toBeCloseTo(10, DIGITS);
  expect(() => new Vector2(0, 0).setLength(1)).toThrow(RangeError);
  expect(() => new Vector2(1, 1).setLength(-1)).toThrow(RangeError);

  const s = new Vector2(0, 0).setLengthSafe(5);

  expectVecClose(s, 5, 0);

  const w = Vector2.setLength(new Vector2(1, 0), 3);

  expectVecClose(w, 3, 0);

  const ws = Vector2.setLengthSafe(new Vector2(0, 0), 2);

  expectVecClose(ws, 2, 0);
 });

 it('setHeading', () => {
  const v = new Vector2(2, 0).setHeading(Math.PI / 2);

  expectVecClose(v, 0, 2);

  const s = Vector2.setHeading(new Vector2(3, 4), 0); // keep length 5, angle 0

  expectVecClose(s, 5, 0);
 });

 it('project / projectOnUnit / projectSafe (static & instance)', () => {
  const a = new Vector2(2, 2);
  const axis = new Vector2(1, 0);
  const p = a.clone().project(axis);

  expectVecClose(p, 2, 0);

  const pu = Vector2.projectOnUnit(new Vector2(2, 2), new Vector2(1, 0));

  expectVecClose(pu, 2, 0);

  const zeroProj = new Vector2(1, 1).project(new Vector2(0, 0));

  expectVecClose(zeroProj, 0, 0);

  const safe = Vector2.projectSafe(new Vector2(1, 1), new Vector2(1e-16, 0));

  expectVecClose(safe, 0, 0);
 });

 it('reflect / reflectSafe', () => {
  const v = new Vector2(1, -1);
  const nUnit = new Vector2(0, 1); // reflect on Y+: should flip Y
  const r = Vector2.reflect(v, nUnit);

  expectVecClose(r, 1, 1);

  // Non-unit normal → reflectSafe matches reflect(normalized)
  const nNonUnit = new Vector2(0, 2);
  const safe = Vector2.reflectSafe(v, nNonUnit);

  expectVecClose(safe, 1, 1);
 });

 it('perpendicular / unitPerpendicular / unitPerpendicularSafe', () => {
  expectVecClose(Vector2.perpendicular(new Vector2(1, 0)), 0, 1);
  expectVecClose(Vector2.perpendicular(new Vector2(1, 0), true), 0, -1);

  const u = Vector2.unitPerpendicular(new Vector2(2, 0));

  expectVecClose(u, 0, 1);

  const s = Vector2.unitPerpendicularSafe(new Vector2(0, 0));

  // default CCW fallback = (-1,0)
  expectVecClose(s, -1, 0);
 });

 it('rotate / rotateCS equivalence', () => {
  const v = new Vector2(1, 0);
  const angle = Math.PI / 3;

  const r1 = Vector2.rotate(v, angle);

  const c = Math.cos(angle),
   s = Math.sin(angle);

  const r2 = Vector2.rotateCS(v, c, s);

  expectVecClose(r1, r2.x, r2.y);
 });

 it('rotateAround / rotateAroundCS', () => {
  const p = new Vector2(2, 0);
  const center = new Vector2(1, 0);
  const angle = Math.PI / 2;
  const r = Vector2.rotateAround(p, center, angle);

  expectVecClose(r, 1, 1);

  const rc = Vector2.rotateAroundCS(p, center, Math.cos(angle), Math.sin(angle));

  expectVecClose(rc, 1, 1);
 });

 it('midpoint (static & instance)', () => {
  expectVecClose(Vector2.midpoint(new Vector2(0, 0), new Vector2(2, 2)), 1, 1);

  const v = new Vector2(0, 0).midpoint(new Vector2(2, 4));

  expectVecClose(v, 1, 2);
 });

 it('reject', () => {
  // a = (2,1) reject onto x-axis (1,0) -> component perpendicular (0,1)
  const a = new Vector2(2, 1);
  const r = Vector2.reject(a, new Vector2(1, 0));

  expectVecClose(r, 0, 1);

  // Reject onto zero axis returns a copy of a
  const rz = Vector2.reject(a, new Vector2(0, 0));

  expectVecClose(rz, 2, 1);
 });
});

describe('Comparison & validation', () => {
 it('isZero/nearZero', () => {
  expect(Vector2.isZero(new Vector2(0, 0))).toBe(true);
  expect(new Vector2(1e-12, 0).nearZero()).toBe(true);
  expect(() => new Vector2(1, 0).nearZero(-1)).toThrow(RangeError);
 });

 it('equals/nearEquals', () => {
  const a = new Vector2(1, 1);
  const b = new Vector2(1 + EPSILON / 2, 1 - EPSILON / 2);

  expect(Vector2.equals(a, a)).toBe(true);
  expect(Vector2.nearEquals(a, b)).toBe(true);
  expect(() => Vector2.nearEquals(a, b, -0.1)).toThrow(RangeError);
 });

 it('isUnit/isFinite', () => {
  expect(Vector2.isUnit(new Vector2(1, 0))).toBe(true);
  expect(new Vector2(Number.POSITIVE_INFINITY, 0).isFinite()).toBe(false);
 });

 it('isParallel/isPerpendicular (static & instance)', () => {
  const x = new Vector2(1, 0);
  const x2 = new Vector2(2, 0);
  const y = new Vector2(0, 1);

  expect(Vector2.isParallel(x, x2)).toBe(true);
  expect(Vector2.isPerpendicular(x, y)).toBe(true);
  expect(x.isParallelTo(y)).toBe(false);
  expect(x.isPerpendicularTo(y)).toBe(true);
 });
});

describe('Conversion & representation', () => {
 it('toJSON/toObject', () => {
  const v = new Vector2(3, 4);

  expect(v.toJSON()).toEqual({ x: 3, y: 4 });
  expect(v.toObject()).toEqual({ x: 3, y: 4 });
 });

 it('toArray number[] and Float32Array', () => {
  const v = new Vector2(5, 7);
  const array = v.toArray();

  expect(array).toEqual([5, 7]);

  const buf = new Float32Array(4);

  v.toArray(buf, 2);

  expect(Array.from(buf)).toEqual([0, 0, 5, 7]);
 });

 it('iterator and toString', () => {
  const v = new Vector2(1.2345, 6.789);
  const spread = [...v];

  expect(spread).toEqual([1.2345, 6.789]);

  expect(v.toString()).toBe('1.2345,6.789');
  expect(v.toString(2)).toBe(`${v.x.toFixed(2)},${v.y.toFixed(2)}`);
 });
});

describe('Utilities', () => {
 it('hashCode stable and consistent (static vs instance)', () => {
  const a = new Vector2(Math.PI, Math.E);
  const b = new Vector2(a);

  expect(a.hashCode()).toBe(Vector2.hashCode(a));
  expect(a.hashCode()).toBe(b.hashCode());

  b.x += 1.1e-6; // rounding to 1e6 precision may change hash
  expect(a.hashCode() === b.hashCode()).toBe(false);
 });
});

describe('Alloc-free static overloads', () => {
 it('writes into provided out vector and returns it', () => {
  const out = new Vector2();
  const returnValue = Vector2.add(new Vector2(1, 2), new Vector2(3, 4), out);

  expect(returnValue).toBe(out);
  expectVecClose(out, 4, 6);

  const out2 = new Vector2();
  const returnValue2 = Vector2.direction(new Vector2(0, 0), new Vector2(0, 5), out2);

  expect(returnValue2).toBe(out2);
  expectVecClose(out2, 0, 1);
 });
});

describe('Edge cases & invariants', () => {
 it('angle periodicity and TAU coverage via fromAngle', () => {
  const v0 = Vector2.fromAngle(0);
  const vTau = Vector2.fromAngle(TAU);

  expectVecClose(v0, vTau.x, vTau.y);
 });

 it('projectOnUnit equals project when axis is normalized', () => {
  const v = new Vector2(3, 4);
  const axis = new Vector2(1, 1).normalize();
  const p1 = Vector2.project(v, axis);
  const p2 = Vector2.projectOnUnit(v, axis);

  expectVecClose(p1, p2.x, p2.y);
 });
});
