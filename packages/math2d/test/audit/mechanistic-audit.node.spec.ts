/**
 * @file Mechanistic Audit V5 — Production Readiness Verification
 *
 * Every test in this file is a PROOF of correctness or a PROOF of a bug.
 * No opinions, no assumptions — only executable verification.
 *
 * Categories:
 * 1. Deterministic kernel parity with Math.*
 * 2. Class invariant preservation under all operations
 * 3. Convention compliance (sqrt vs hypot, triality, etc.)
 * 4. Overflow/underflow boundary behavior
 * 5. IEEE 754 special value propagation
 */

import * as fc from 'fast-check';

import {
 Vector2,
 Rotation2,
 Complex,
 Interval,
 Matrix3,
 Transform2,
 sin,
 cos,
 atan2,
 pow,
 hypot,
 anglesNearEqual,
 nearEquals,
 isNearZero,
} from '../../src';

/* ========================================================================== */
/* 1. DETERMINISTIC KERNEL PARITY                                              */
/* ========================================================================== */

describe('Deterministic kernel parity with Math.*', () => {
 // IEEE 754 special values that every function must handle
 const SPECIAL_VALUES = [
  0,
  -0,
  1,
  -1,
  0.5,
  -0.5,
  2,
  -2,
  Math.PI,
  -Math.PI,
  Math.PI / 2,
  -Math.PI / 2,
  Number.EPSILON,
  -Number.EPSILON,
  Number.MAX_VALUE,
  -Number.MAX_VALUE,
  Number.MIN_VALUE,
  -Number.MIN_VALUE,
  Infinity,
  -Infinity,
  NaN,
 ];

 // For two-argument functions
 const SPECIAL_PAIRS: [number, number][] = [];
 for (const a of SPECIAL_VALUES) {
  for (const b of SPECIAL_VALUES) {
   SPECIAL_PAIRS.push([a, b]);
  }
 }

 // Helper: compare with NaN and signed-zero awareness
 function sameValue(a: number, b: number): boolean {
  return Object.is(a, b);
 }

 // Helper: compare allowing 1 ULP difference (expected for fdlibm exp*log path)
 function nearSameValue(a: number, b: number): boolean {
  if (Object.is(a, b)) return true;
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  return Math.abs(a - b) <= 2 * Number.EPSILON * Math.max(1, Math.abs(b));
 }

 describe('pow() vs Math.pow — exhaustive special value comparison', () => {
  const POW_SPECIALS = [0, -0, 1, -1, 0.5, -0.5, 2, -2, 3, -3, Infinity, -Infinity, NaN];

  // Known deviations from Math.pow documented here as KNOWN BUGS.
  // Note: String(-0) === '0', so we use Object.is to build keys
  function makeKey(base: number, exponent: number): string {
   const baseKey = Object.is(base, -0) ? '-0' : String(base);
   const expKey = Object.is(exponent, -0) ? '-0' : String(exponent);
   return `${baseKey},${expKey}`;
  }

  const KNOWN_DEVIATIONS = new Set([
   // Category 2: Negative base with non-integer/Infinity exponent
   // Kernel does `if (base < 0) return NaN` without Infinity handling (fdlibm semantics)
   '-0.5,Infinity',
   '-0.5,-Infinity',
   '-2,Infinity',
   '-2,-Infinity',
   '-3,Infinity',
   '-3,-Infinity',
   '-Infinity,0.5',
   '-Infinity,-0.5',
   '-Infinity,Infinity',
   '-Infinity,-Infinity',
   // V9-Deterministic-02: signed-zero cases `-0,1` / `-0,3` / `-0,-1` / `-0,-3` NO LONGER
   // deviate — the kernel now preserves `-0` and `-Infinity` per ECMA-262 §21.3.2.26 /
   // C99 §F.9.4.4 / fdlibm `e_pow.c`. Previously KNOWN_DEVIATIONS entries are removed.
  ]);

  for (const base of POW_SPECIALS) {
   for (const exponent of POW_SPECIALS) {
    const key = makeKey(base, exponent);
    const expected = Math.pow(base, exponent);
    const baseLabel = Object.is(base, -0) ? '-0' : String(base);
    const expLabel = Object.is(exponent, -0) ? '-0' : String(exponent);

    if (KNOWN_DEVIATIONS.has(key)) {
     it(`pow(${baseLabel}, ${expLabel}) KNOWN DEVIATION from Math.pow (${expected})`, () => {
      const actual = pow(base, exponent);
      const matches = Number.isNaN(expected) ? Number.isNaN(actual) : sameValue(actual, expected);
      expect(matches).toBe(false);
     });
    } else {
     it(`pow(${baseLabel}, ${expLabel}) should match Math.pow (${expected})`, () => {
      const actual = pow(base, exponent);
      expect(nearSameValue(actual, expected)).toBe(true);
     });
    }
   }
  }
 });

 describe('sin() vs Math.sin — property-based', () => {
  it('should produce results within fdlibm tolerance of Math.sin for small inputs (|x| < 100)', () => {
   fc.assert(
    fc.property(fc.double({ min: -100, max: 100, noNaN: true }), (x) => {
     const actual = sin(x);
     const expected = Math.sin(x);
     // fdlibm uses different range reduction than native, allow up to 4 ULP
     return Math.abs(actual - expected) <= 8e-15;
    }),
    { numRuns: 10000 },
   );
  });

  it('precision degrades for larger inputs but stays within ~1e-12 for |x| < 1e4', () => {
   fc.assert(
    fc.property(fc.double({ min: -1e4, max: 1e4, noNaN: true }), (x) => {
     const actual = sin(x);
     const expected = Math.sin(x);
     // Cody-Waite reduction at ~1e4 introduces up to ~1e-12 error
     return Math.abs(actual - expected) <= 2e-12;
    }),
    { numRuns: 10000 },
   );
  });

  it('should have correct range [-1, 1] within safe range (|x| < 1e15)', () => {
   fc.assert(
    fc.property(fc.double({ min: -1e15, max: 1e15, noNaN: true }), (x) => {
     const result = sin(x);
     return result >= -1 && result <= 1;
    }),
    { numRuns: 10000 },
   );
  });

  it('KNOWN LIMITATION: Cody-Waite range reduction degrades for |x| > ~10⁶', () => {
   // Three-pair Cody-Waite extends correct range to ~10⁶ radians.
   // Beyond that, precision degrades (Payne-Hanek would be needed).
   // For physics engine use, angles > 10⁶ radians are nonsensical.
   const result = sin(2e20);
   expect(Math.abs(result) > 1).toBe(true);
  });
 });

 describe('cos() vs Math.cos — property-based', () => {
  it('should produce results within fdlibm tolerance of Math.cos for small inputs (|x| < 100)', () => {
   fc.assert(
    fc.property(fc.double({ min: -100, max: 100, noNaN: true }), (x) => {
     const actual = cos(x);
     const expected = Math.cos(x);
     return Math.abs(actual - expected) <= 8e-15;
    }),
    { numRuns: 10000 },
   );
  });

  it('precision degrades for larger inputs but stays within ~1e-12 for |x| < 1e4', () => {
   fc.assert(
    fc.property(fc.double({ min: -1e4, max: 1e4, noNaN: true }), (x) => {
     const actual = cos(x);
     const expected = Math.cos(x);
     return Math.abs(actual - expected) <= 2e-12;
    }),
    { numRuns: 10000 },
   );
  });

  it('should have correct range [-1, 1] within safe range (|x| < 1e15)', () => {
   fc.assert(
    fc.property(fc.double({ min: -1e15, max: 1e15, noNaN: true }), (x) => {
     const result = cos(x);
     return result >= -1 && result <= 1;
    }),
    { numRuns: 10000 },
   );
  });

  it('KNOWN LIMITATION: Cody-Waite fails catastrophically for |x| > ~1e17', () => {
   const result = cos(-68489627079057730);
   expect(Math.abs(result) > 1).toBe(true);
  });
 });

 describe('atan2() vs Math.atan2 — special values', () => {
  for (const [y, x] of SPECIAL_PAIRS.filter(([y, x]) => !Number.isNaN(y) && !Number.isNaN(x))) {
   const expected = Math.atan2(y, x);
   it(`atan2(${y}, ${x}) should equal Math.atan2: ${expected}`, () => {
    const actual = atan2(y, x);
    expect(nearSameValue(actual, expected)).toBe(true);
   });
  }
 });

 describe('hypot() vs Math.hypot — overflow safety', () => {
  it('should handle values near overflow boundary correctly', () => {
   const large = 1e154;
   const result = hypot(large, large);
   const expected = Math.hypot(large, large);
   expect(Number.isFinite(result)).toBe(true);
   expect(Math.abs(result - expected)).toBeLessThan(expected * 1e-14);
  });

  it('should handle very large values without overflow', () => {
   const veryLarge = 1e200;
   const result = hypot(veryLarge, veryLarge);
   expect(Number.isFinite(result)).toBe(true);
  });
 });
});

/* ========================================================================== */
/* 2. CLASS INVARIANT PRESERVATION                                             */
/* ========================================================================== */

describe('Class invariant preservation', () => {
 // Arbitrary generators
 const arbFinite = fc.double({ noNaN: true, noDefaultInfinity: true, min: -1e10, max: 1e10 });
 const arbInterval = fc
  .tuple(arbFinite, arbFinite)
  .map(([a, b]) => Interval.fromValues(Math.min(a, b), Math.max(a, b)));

 describe('Interval: min <= max after ALL operations', () => {
  const ops: [string, (a: Interval, b: Interval) => Interval][] = [
   ['add', (a, b) => Interval.add(a, b)],
   ['subtract', (a, b) => Interval.subtract(a, b)],
   ['multiply', (a, b) => Interval.multiply(a, b)],
   ['union', (a, b) => Interval.union(a, b)],
   ['negate', (a) => Interval.negate(a)],
   ['abs', (a) => Interval.abs(a)],
   ['square', (a) => Interval.square(a)],
  ];

  for (const [name, op] of ops) {
   it(`Interval.${name} preserves min <= max`, () => {
    fc.assert(
     fc.property(arbInterval, arbInterval, (a, b) => {
      const result = op(a, b);
      return result.min <= result.max;
     }),
     { numRuns: 1000 },
    );
   });
  }

  it('Interval.mod removed (was violating invariant — identity violation)', () => {
   // Interval.mod was removed because component-wise modulo on interval bounds
   // is not valid interval arithmetic (IEEE 1788) and violated min <= max.
   expect((Interval as Record<string, unknown>)['mod']).toBeUndefined();
  });
 });

 describe('Rotation2: unit magnitude preservation', () => {
  it('multiply preserves unit magnitude', () => {
   fc.assert(
    fc.property(
     fc.double({ min: -Math.PI, max: Math.PI, noNaN: true }),
     fc.double({ min: -Math.PI, max: Math.PI, noNaN: true }),
     (a1, a2) => {
      const r1 = Rotation2.fromAngle(a1);
      const r2 = Rotation2.fromAngle(a2);
      const result = Rotation2.multiply(r1, r2);
      const magSq = result.cos * result.cos + result.sin * result.sin;
      return Math.abs(magSq - 1) < 1e-10;
     },
    ),
    { numRuns: 5000 },
   );
  });
 });
});

/* ========================================================================== */
/* 3. OVERFLOW BOUNDARY VERIFICATION                                           */
/* ========================================================================== */

describe('Overflow boundary: sqrt(x*x + y*y) vs hypot(x, y)', () => {
 // The critical threshold where x*x + y*y overflows to Infinity
 // is approximately sqrt(MAX_VALUE / 2) ≈ 1.3407807929942596e+154
 const OVERFLOW_THRESHOLD = Math.sqrt(Number.MAX_VALUE / 2);

 describe('Vector2.normalized getter (FIXED — now uses hypot)', () => {
  it('should return unit vector for components at overflow threshold', () => {
   const v = new Vector2(OVERFLOW_THRESHOLD * 1.01, OVERFLOW_THRESHOLD * 1.01);
   const n = v.normalized;
   const mag = Vector2.magnitude(n);
   expect(Math.abs(mag - 1)).toBeLessThan(1e-10);
  });

  it('should return unit vector for components well below threshold', () => {
   const v = new Vector2(1e100, 1e100);
   const n = v.normalized;
   const mag = Vector2.magnitude(n);
   expect(Math.abs(mag - 1)).toBeLessThan(1e-10);
  });
 });

 describe('Vector2.normalize (static) — correctly uses hypot', () => {
  it('should return unit vector for components at overflow threshold', () => {
   const v = new Vector2(OVERFLOW_THRESHOLD * 10, OVERFLOW_THRESHOLD * 10);
   const n = Vector2.normalize(v);
   const mag = Vector2.magnitude(n);
   expect(Math.abs(mag - 1)).toBeLessThan(1e-10);
  });
 });

 describe('Vector2.limit (FIXED — now uses hypot)', () => {
  it('should correctly limit large vectors', () => {
   const v = new Vector2(1e200, 1e200);
   const limited = Vector2.limit(v, 5);
   const mag = Vector2.magnitude(limited);
   expect(Math.abs(mag - 5)).toBeLessThan(1e-10);
  });
 });

 describe('Complex.normalized getter — correctly uses hypot', () => {
  it('should return unit complex for large components', () => {
   const c = new Complex(1e200, 1e200);
   const n = c.normalized;
   const mag = Complex.magnitude(n);
   expect(Math.abs(mag - 1)).toBeLessThan(1e-10);
  });
 });
});

/* ========================================================================== */
/* 4. CONVENTION COMPLIANCE (mechanistic grep-equivalent)                      */
/* ========================================================================== */

describe('Convention compliance — epsilon validation', () => {
 describe('All epsilon-accepting comparison functions should throw on NaN epsilon', () => {
  it('nearEquals throws on NaN epsilon', () => {
   expect(() => nearEquals(1, 1, NaN)).toThrow(RangeError);
  });

  it('isNearZero throws on NaN epsilon', () => {
   expect(() => isNearZero(0, NaN)).toThrow(RangeError);
  });

  it('anglesNearEqual throws on NaN epsilon (FIXED)', () => {
   expect(() => anglesNearEqual(0, 0, NaN)).toThrow(RangeError);
  });
 });
});

/* ========================================================================== */
/* 5. IEEE 754 SPECIAL VALUE PROPAGATION                                       */
/* ========================================================================== */

describe('IEEE 754 special value propagation', () => {
 describe('NaN propagation through Vector2 operations', () => {
  const nanVec = new Vector2(NaN, 1);
  const normalVec = new Vector2(3, 4);

  it('add propagates NaN', () => {
   const r = Vector2.add(nanVec, normalVec);
   expect(Number.isNaN(r.x)).toBe(true);
  });

  it('magnitude of NaN vector is NaN', () => {
   expect(Number.isNaN(Vector2.magnitude(nanVec))).toBe(true);
  });

  it('dot with NaN propagates NaN', () => {
   expect(Number.isNaN(Vector2.dot(nanVec, normalVec))).toBe(true);
  });

  it('hasNaN detects NaN component', () => {
   expect(Vector2.hasNaN(nanVec)).toBe(true);
  });
 });

 describe('Infinity propagation through Vector2 operations', () => {
  const infVec = new Vector2(Infinity, 1);

  it('hasInfinity detects infinite component', () => {
   expect(Vector2.hasInfinity(infVec)).toBe(true);
  });

  it('isFinite rejects infinite component', () => {
   expect(Vector2.isFinite(infVec)).toBe(false);
  });
 });

 describe('NaN propagation through Interval operations', () => {
  it('Interval arithmetic with NaN inputs', () => {
   // Constructor allows NaN (pure math, no assertions)
   const nanInterval = new Interval(NaN, NaN);
   const normal = Interval.fromValues(1, 5);
   const sum = Interval.add(nanInterval, normal);
   expect(Number.isNaN(sum.min)).toBe(true);
   expect(Number.isNaN(sum.max)).toBe(true);
  });
 });
});

/* ========================================================================== */
/* 6. CROSS-TYPE CONVERSION ROUNDTRIP VERIFICATION                            */
/* ========================================================================== */

describe('Cross-type conversion roundtrips', () => {
 it('Rotation2 → Complex → Rotation2 roundtrip', () => {
  fc.assert(
   fc.property(fc.double({ min: -Math.PI, max: Math.PI, noNaN: true }), (angle) => {
    const r1 = Rotation2.fromAngle(angle);
    const c = r1.toComplex();
    const r2 = Rotation2.fromComplex(c);
    return Math.abs(r1.cos - r2.cos) < 1e-10 && Math.abs(r1.sin - r2.sin) < 1e-10;
   }),
   { numRuns: 5000 },
  );
 });

 it('Rotation2 → Matrix2 → Rotation2 roundtrip', () => {
  fc.assert(
   fc.property(fc.double({ min: -Math.PI, max: Math.PI, noNaN: true }), (angle) => {
    const r1 = Rotation2.fromAngle(angle);
    const m = r1.toMatrix2();
    const r2 = Rotation2.fromMatrix2(m);
    return Math.abs(r1.cos - r2.cos) < 1e-10 && Math.abs(r1.sin - r2.sin) < 1e-10;
   }),
   { numRuns: 5000 },
  );
 });

 it('Transform2 → Matrix3 → Transform2 roundtrip (specific values)', () => {
  const cases = [
   { tx: 10, ty: 20, angle: Math.PI / 4, scale: 2 },
   { tx: -5, ty: 0, angle: 0, scale: 1 },
   { tx: 0, ty: 0, angle: Math.PI, scale: 3 },
  ];
  for (const { tx, ty, angle, scale } of cases) {
   const t1 = Transform2.fromValues(tx, ty, angle, scale, scale);
   const m = Matrix3.fromTransform2Like(t1);
   const t2 = Transform2.fromMatrix3(m);
   expect(Math.abs(t1.position.x - t2.position.x)).toBeLessThan(1e-8);
   expect(Math.abs(t1.position.y - t2.position.y)).toBeLessThan(1e-8);
   expect(Math.abs(t1.scale.x - t2.scale.x)).toBeLessThan(1e-8);
  }
 });
});
