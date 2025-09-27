/**
 * @file src/__tests__/mat2.node.spec.ts
 * @description Jest tests for the mat2.ts module in the math2d package.
 */

import { Mat2, freezeMat2, isMat2Like } from '../mat2';
import { Vector2 } from '../vector2';

const NEAR = 1e-10; // tighter than typical EPSILON for precise numeric assertions

describe('Mat2 constants', () => {
 it('IDENTITY_MATRIX is identity and frozen', () => {
  const I = Mat2.IDENTITY_MATRIX;

  expect(I.m00).toBe(1);
  expect(I.m01).toBe(0);
  expect(I.m10).toBe(0);
  expect(I.m11).toBe(1);
  expect(Object.isFrozen(I)).toBe(true);
  // In strict mode, writing to a frozen object throws at runtime.
  expect(() => {
   // Intentionally cast away readonly to attempt a mutation and assert runtime immutability.
   (I as unknown as Mat2).m00 = 2;
  }).toThrow(TypeError);
 });

 it('ZERO_MATRIX is zero and frozen', () => {
  const Z = Mat2.ZERO_MATRIX;

  expect(Z.m00).toBe(0);
  expect(Z.m01).toBe(0);
  expect(Z.m10).toBe(0);
  expect(Z.m11).toBe(0);
  expect(Object.isFrozen(Z)).toBe(true);
 });

 it('ROT90_CCW_MATRIX / ROT90_CW_MATRIX / ROT180_MATRIX have expected angles and determinant ≈ 1', () => {
  const r90 = Mat2.ROT90_CCW_MATRIX;
  const r90cw = Mat2.ROT90_CW_MATRIX;
  const r180 = Mat2.ROT180_MATRIX;

  expect(Mat2.nearEquals(r90, Mat2.fromRotation(Math.PI / 2), NEAR)).toBe(true);
  expect(Mat2.nearEquals(r90cw, Mat2.fromRotation(-Math.PI / 2), NEAR)).toBe(true);
  expect(Mat2.nearEquals(r180, Mat2.fromRotation(Math.PI), NEAR)).toBe(true);

  expect(Mat2.determinant(r90)).toBeCloseTo(1, 12);
  expect(Mat2.determinant(r90cw)).toBeCloseTo(1, 12);
  expect(Mat2.determinant(r180)).toBeCloseTo(1, 12);
 });
});

describe('Helpers', () => {
 it('freezeMat2 returns same instance and freezes it', () => {
  const m = new Mat2(1, 2, 3, 4);
  const f = freezeMat2(m);

  expect(f).toBe(m);
  expect(Object.isFrozen(f)).toBe(true);
 });

 it('isMat2Like detects plain objects with numeric m00..m11', () => {
  const ok = { m00: 1, m01: 2, m10: 3, m11: 4 };
  const bad1 = { m00: 1, m01: 2, m10: 3 } as unknown;
  const bad2 = { m00: 1, m01: 'a', m10: 3, m11: 4 } as unknown;

  expect(isMat2Like(ok)).toBe(true);
  expect(isMat2Like(bad1)).toBe(false);
  expect(isMat2Like(bad2)).toBe(false);
 });
});

describe('Factories', () => {
 it('clone creates a deep copy', () => {
  const a = new Mat2(1, 2, 3, 4);

  const b = Mat2.clone(a);
  expect(b).not.toBe(a);
  expect(Mat2.equals(a, b)).toBe(true);
 });

 it('copy writes into destination (alloc-free)', () => {
  const a = new Mat2(5, 6, 7, 8);
  const out = new Mat2();
  const r = Mat2.copy(a, out);

  expect(r).toBe(out);
  expect(Mat2.equals(r, a)).toBe(true);
 });

 it('fromValues builds row-major matrix', () => {
  const m = Mat2.fromValues(1, 2, 3, 4);

  expect(Mat2.equals(m, new Mat2(1, 2, 3, 4))).toBe(true);
 });

 it('fromRows and fromColumns produce transposed layouts correctly', () => {
  const r0 = new Vector2(1, 2);
  const r1 = new Vector2(3, 4);
  const fromRows = Mat2.fromRows(r0, r1);

  expect(Mat2.equals(fromRows, new Mat2(1, 2, 3, 4))).toBe(true);

  const c0 = new Vector2(1, 3);
  const c1 = new Vector2(2, 4);
  const fromCols = Mat2.fromColumns(c0, c1);

  expect(Mat2.equals(fromCols, new Mat2(1, 2, 3, 4))).toBe(true);
 });

 it('fromRotation and fromRotationCS are consistent', () => {
  const angle = Math.PI / 3;
  const m1 = Mat2.fromRotation(angle);
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const m2 = Mat2.fromRotationCS(c, s);

  expect(Mat2.nearEquals(m1, m2, NEAR)).toBe(true);
 });

 it('fromScaling and fromShear', () => {
  expect(Mat2.equals(Mat2.fromScaling(2, 3), new Mat2(2, 0, 0, 3))).toBe(true);
  expect(Mat2.equals(Mat2.fromShear(4, 5), new Mat2(1, 4, 5, 1))).toBe(true);
 });

 it('fromArray reads with offset and throws on invalid offset', () => {
  const array = [9, 8, 7, 6, 5, 4, 3];
  const m = Mat2.fromArray(array, 2);

  expect(Mat2.equals(m, new Mat2(7, 6, 5, 4))).toBe(true);
  expect(() => Mat2.fromArray(array, 5)).toThrow(RangeError);
 });

 it('fromObject validates numeric props', () => {
  const m = Mat2.fromObject({ m00: 1, m01: 2, m10: 3, m11: 4 });

  expect(Mat2.equals(m, new Mat2(1, 2, 3, 4))).toBe(true);

  // @ts-expect-error: Intentionally wrong type for m01 to assert runtime validation throws TypeError.
  expect(() => Mat2.fromObject({ m00: 1, m01: '2', m10: 3, m11: 4 })).toThrow(TypeError);
 });

 it('parse accepts "m00,m01,m10,m11" and rejects invalid strings', () => {
  expect(Mat2.parse('1,2,3,4').toString()).toBe('1,2,3,4');
  expect(() => Mat2.parse('1,2,3')).toThrow(Error);
  expect(() => Mat2.parse('a,b,c,d')).toThrow(Error);
 });

 it('randomRotation yields rotation-like matrix', () => {
  const m = Mat2.randomRotation();

  expect(Mat2.isRotation(m, 1e-9)).toBe(true);
  expect(Mat2.determinant(m)).toBeCloseTo(1, 12);
 });
});

describe('Constructors & basic instance ops', () => {
 it('constructor from array/object validates and from Mat2 copies', () => {
  expect(new Mat2([1, 2, 3, 4]).toString()).toBe('1,2,3,4');
  expect(new Mat2({ m00: 1, m01: 2, m10: 3, m11: 4 }).toString()).toBe('1,2,3,4');

  // @ts-expect-error: Intentionally wrong type for m00 to assert constructor validation throws RangeError.
  expect(() => new Mat2({ m00: 'x', m01: 2, m10: 3, m11: 4 })).toThrow(RangeError);

  const a = new Mat2(1, 2, 3, 4);
  const b = new Mat2(a);

  expect(Mat2.equals(a, b)).toBe(true);
 });

 it('identity, zero, set, clone, copy', () => {
  const m = new Mat2().identity();

  expect(Mat2.equals(m, Mat2.IDENTITY_MATRIX)).toBe(true);

  m.zero();

  expect(Mat2.equals(m, Mat2.ZERO_MATRIX)).toBe(true);

  m.set(1, 2, 3, 4);

  expect(Mat2.equals(m.clone(), new Mat2(1, 2, 3, 4))).toBe(true);

  const o = new Mat2();

  expect(o.copy(m)).toBe(o);
  expect(Mat2.equals(o, m)).toBe(true);
 });
});

describe('Row/column accessors', () => {
 it('getRow/setRow and getColumn/setColumn', () => {
  const m = new Mat2(1, 2, 3, 4);

  expect(m.getRow(0)).toEqual(new Vector2(1, 2));
  expect(m.getRow(1)).toEqual(new Vector2(3, 4));
  expect(m.getColumn(0)).toEqual(new Vector2(1, 3));
  expect(m.getColumn(1)).toEqual(new Vector2(2, 4));

  m.setRow(0, new Vector2(9, 8));
  m.setColumn(1, new Vector2(7, 6));

  expect(m.toString()).toBe('9,7,3,6');

  expect(() => m.getRow(2 as 0)).toThrow(RangeError);
  expect(() => m.setColumn(3 as 1, new Vector2())).toThrow(RangeError);
 });
});

describe('Numeric transforms (component-wise)', () => {
 it('floor/ceil/round/abs operate per component', () => {
  const m = new Mat2(1.9, -2.1, -3.5, 4.49);

  expect(m.floor().toString()).toBe('1,-3,-4,4');

  m.set(1.1, -2.1, -3.5, 4.51).ceil();

  expect(m.toString()).toBe('2,-2,-3,5');

  m.set(1.49, -2.5, 3.51, 4.5).round();

  // JS semantics: Math.round(-2.5) === -2
  expect(m.toString()).toBe('1,-2,4,5');

  m.set(-1, 2, -3, -4).abs();

  expect(m.toString()).toBe('1,2,3,4');
 });
});

describe('Algebra: static vs instance semantics', () => {
 it('add/sub (static and instance) are consistent', () => {
  const a = new Mat2(1, 2, 3, 4);
  const b = new Mat2(5, 6, 7, 8);

  const s = Mat2.add(a, b);
  const a2 = a.clone().add(b);

  expect(Mat2.equals(s, a2)).toBe(true);

  const d = Mat2.sub(a, b);
  const a3 = a.clone().sub(b);

  expect(Mat2.equals(d, a3)).toBe(true);
 });

 it('multiplyComponents (Hadamard)', () => {
  const a = new Mat2(1, 2, 3, 4);
  const b = new Mat2(10, 20, 30, 40);

  const r = Mat2.multiplyComponents(a, b);

  expect(r.toString()).toBe('10,40,90,160');

  const ain = a.clone().multiplyComponents(b);

  expect(Mat2.equals(r, ain)).toBe(true);
 });

 it('multiply/premultiply follow matrix product definition', () => {
  const A = new Mat2(1, 2, 3, 4);
  const B = new Mat2(5, 6, 7, 8);

  const C = Mat2.multiply(A, B); // A × B
  const Ain = A.clone().multiply(B);

  expect(Mat2.equals(C, Ain)).toBe(true);

  const D = Mat2.multiply(B, A); // B × A
  const Ain2 = A.clone().premultiply(B);

  expect(Mat2.equals(D, Ain2)).toBe(true);
 });

 it('transpose and adjugate properties', () => {
  const A = new Mat2(2, 3, 5, 7);
  const At = Mat2.transpose(A);

  expect(At.toString()).toBe('2,5,3,7');

  // A * adj(A) = det(A) * I (for 2x2)
  const adjA = Mat2.adjugate(A);
  const lhs = Mat2.multiply(A, adjA);
  const detA = Mat2.determinant(A);
  const rhs = Mat2.multiplyScalar(Mat2.IDENTITY_MATRIX, detA);

  expect(Mat2.nearEquals(lhs, rhs, 1e-12)).toBe(true);
 });

 it('determinant and trace', () => {
  const A = new Mat2(2, 3, 5, 7);

  expect(Mat2.determinant(A)).toBe(2 * 7 - 3 * 5);
  expect(Mat2.trace(A)).toBe(2 + 7);
  expect(A.trace()).toBe(2 + 7);
 });

 it('inverse, inverseSafe, inverseTol', () => {
  const A = new Mat2(3, 4, 2, 5);
  const Ainv = Mat2.inverse(A);
  const I = Mat2.multiply(A, Ainv);

  expect(Mat2.isIdentity(I, 1e-12)).toBe(true);

  const S = new Mat2(1, 2, 2, 4); // singular

  expect(() => Mat2.inverse(S)).toThrow(RangeError);

  const Ssafe = Mat2.inverseSafe(S);

  expect(Mat2.equals(Ssafe, Mat2.ZERO_MATRIX)).toBe(true);

  // Near singular with custom epsilon
  const N = new Mat2(1, 1, 1, 1 + 1e-12);

  expect(() => Mat2.inverseTol(N, 1e-10)).toThrow(RangeError);
 });
});

describe('Solve linear systems', () => {
 it('solve returns x such that A·x = b; solveSafe returns zero if singular', () => {
  const A = new Mat2(4, 7, 2, 6);
  const b = new Vector2(1, 0);
  const x = Mat2.solve(A, b);
  const Ax = Mat2.transformVector(A, x);

  expect(Ax.x).toBeCloseTo(b.x, 12);
  expect(Ax.y).toBeCloseTo(b.y, 12);

  const S = new Mat2(1, 2, 2, 4);
  const xsafe = Mat2.solveSafe(S, b);

  expect(xsafe.x).toBeCloseTo(0, 12);
  expect(xsafe.y).toBeCloseTo(0, 12);
 });

 it('solveTol throws on near-singular systems', () => {
  const A = new Mat2(1, 1, 1, 1 + 1e-12);
  const b = new Vector2(1, 2);

  expect(() => Mat2.solveTol(A, b, 1e-10)).toThrow(RangeError);
 });
});

describe('Vector transforms & outer product', () => {
 it('transformVector (static and instance) are consistent', () => {
  const R = Mat2.fromRotation(Math.PI / 6);
  const v = new Vector2(2, -3);
  const out = Mat2.transformVector(R, v);
  const out2 = R.transformVector(v);

  expect(out2).toEqual(out);

  const outInto = new Vector2();
  const returnValue = R.transformVectorInto(v, outInto);

  expect(returnValue).toBe(outInto);
  expect(outInto).toEqual(out);
 });

 it('outerProduct builds u v^T', () => {
  const u = new Vector2(2, 3);
  const v = new Vector2(5, 7);
  const M = Mat2.outerProduct(u, v);

  expect(M.toString()).toBe('10,14,15,21'); // [2*5, 2*7; 3*5, 3*7]
 });
});

describe('In-place composition (performance-oriented)', () => {
 it('rotate in-place equals right-multiplying by fromRotation', () => {
  const A0 = new Mat2(1, 2, 3, 4);
  const theta = 0.37;
  const expected = Mat2.multiply(A0, Mat2.fromRotation(theta));
  const A = A0.clone().rotate(theta);

  expect(Mat2.nearEquals(A, expected, 1e-12)).toBe(true);
 });

 it('rotateCS in-place matches rotate with same angle', () => {
  const A0 = new Mat2(2, 1, -1, 3);
  const theta = -0.81;
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const expected = Mat2.multiply(A0, Mat2.fromRotation(theta));
  const A = A0.clone().rotateCS(c, s);

  expect(Mat2.nearEquals(A, expected, 1e-12)).toBe(true);
 });

 it('scale in-place equals right-multiplying by scaling matrix', () => {
  const A0 = new Mat2(1, 2, 3, 4);
  const sx = 2.5,
   sy = -3.25;

  const expected = Mat2.multiply(A0, Mat2.fromScaling(sx, sy));
  const A = A0.clone().scale(sx, sy);

  expect(Mat2.nearEquals(A, expected, 1e-12)).toBe(true);
 });

 it('shear in-place equals right-multiplying by shear matrix', () => {
  const A0 = new Mat2(3, -2, 1, 5);
  const shx = 0.3,
   shy = -0.5;

  const expected = Mat2.multiply(A0, Mat2.fromShear(shx, shy));
  const A = A0.clone().shear(shx, shy);

  expect(Mat2.nearEquals(A, expected, 1e-12)).toBe(true);
 });
});

describe('Comparison & validation', () => {
 it('equals, nearEquals and isFinite', () => {
  const a = new Mat2(1, 2, 3, 4);
  const b = new Mat2(1, 2, 3, 4 + 1e-12);

  expect(Mat2.equals(a, new Mat2(1, 2, 3, 4))).toBe(true);
  expect(Mat2.nearEquals(a, b, 1e-9)).toBe(true);

  const c = new Mat2(Infinity, 0, 0, 1);

  expect(Mat2.isFinite(c)).toBe(false);
 });

 it('isIdentity, isRotation and isSingular', () => {
  const I = Mat2.IDENTITY_MATRIX;

  expect(Mat2.isIdentity(I)).toBe(true);

  const R = Mat2.fromRotation(Math.PI / 4);

  expect(Mat2.isRotation(R, 1e-12)).toBe(true);

  const S = new Mat2(1, 2, 2, 4);

  expect(Mat2.isSingular(S)).toBe(true);
  expect(Mat2.isSingular(R, 1e-12)).toBe(false);
 });

 it('nearEquals throws on negative epsilon', () => {
  const a = new Mat2();
  const b = new Mat2();

  expect(() => Mat2.nearEquals(a, b, -1)).toThrow(RangeError);
 });
});

describe('Utilities & representation', () => {
 it('frobeniusNorm matches sqrt of sum of squares', () => {
  const m = new Mat2(1, 2, 3, 4);
  const sumsq = 1 * 1 + 2 * 2 + 3 * 3 + 4 * 4;

  expect(Mat2.frobeniusNorm(m)).toBeCloseTo(Math.sqrt(sumsq), 12);
 });

 it('angleOfRotation and instance angle on pure rotation', () => {
  const theta = -0.75;
  const R = Mat2.fromRotation(theta);

  expect(Mat2.angleOfRotation(R)).toBeCloseTo(theta, 12);
  expect(R.angle()).toBeCloseTo(theta, 12);
 });

 it('orthonormalize projects to near-rotation', () => {
  const theta = 0.9;
  // Start from rotation then introduce slight scale/shear noise
  const R = Mat2.fromRotation(theta);
  const noisy = Mat2.multiply(R, Mat2.fromScaling(1.02, 0.98));

  noisy.m01 += 1e-3; // inject small shear

  expect(Mat2.isRotation(noisy, 1e-6)).toBe(false);

  noisy.orthonormalize();

  expect(Mat2.isRotation(noisy, 1e-6)).toBe(true);
  // Angle should be close to original
  expect(noisy.angle()).toBeCloseTo(theta, 1);
 });

 it('toJSON/toObject/toArray/iterator/toString (with precision)', () => {
  const m = new Mat2(1.23456, 2, 3, 4.98765);

  expect(m.toJSON()).toEqual({ m00: 1.23456, m01: 2, m10: 3, m11: 4.98765 });
  expect(m.toObject()).toEqual({ m00: 1.23456, m01: 2, m10: 3, m11: 4.98765 });

  const buf = new Float32Array(4);
  const returnValue = m.toArray(buf);

  expect(returnValue).toBe(buf);

  const arrayBuf = Array.from(buf);

  expect(arrayBuf[0]).toBeCloseTo(1.23456, 6); // Float32 precision
  expect(arrayBuf[1]).toBe(2);
  expect(arrayBuf[2]).toBe(3);
  expect(arrayBuf[3]).toBeCloseTo(4.98765, 6);

  const array: number[] = [];

  m.toArray(array, 1);

  expect(array[1]).toBeCloseTo(1.23456, 12);
  expect(array[2]).toBe(2);
  expect(array[3]).toBe(3);
  expect(array[4]).toBeCloseTo(4.98765, 12);

  const spread = [...m];

  expect(spread).toEqual([1.23456, 2, 3, 4.98765]);
  expect(m.toString(2)).toBe('1.23,2.00,3.00,4.99');
 });

 it('hashCode is deterministic for equal matrices (may collide for others)', () => {
  const a = new Mat2(1.111111, 2.222222, 3.333333, 4.444444);
  const b = new Mat2(1.111111, 2.222222, 3.333333, 4.444444);
  const c = new Mat2(9, 8, 7, 6);

  expect(a.hashCode()).toBe(b.hashCode());
  expect(a.hashCode()).not.toBe(c.hashCode());
 });
});

describe('Instance algebra helpers', () => {
 it('inverse() and inverseSafe() mutate in place as expected', () => {
  const A = new Mat2(2, 3, 1, 2);
  const Ainv = A.clone().inverse();
  const production = Mat2.multiply(A, Ainv);

  expect(Mat2.isIdentity(production, 1e-12)).toBe(true);

  const S = new Mat2(1, 2, 2, 4);
  const Ssafe = S.clone().inverseSafe();

  expect(Mat2.equals(Ssafe, Mat2.ZERO_MATRIX)).toBe(true);
 });

 it('multiplyScalar, transpose, determinant, trace (instance)', () => {
  const m = new Mat2(1, 2, 3, 4);

  m.multiplyScalar(2);

  expect(m.toString()).toBe('2,4,6,8');
  expect(m.transpose().toString()).toBe('2,6,4,8');
  expect(m.determinant()).toBe(2 * 8 - 6 * 4);
  expect(m.trace()).toBe(2 + 8);
 });
});
