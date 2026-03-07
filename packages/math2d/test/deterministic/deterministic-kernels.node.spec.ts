/**
 * @file test/deterministic/deterministic-kernels.node.spec.ts
 * @description Tests for deterministic-kernels.ts L0 deterministic functions
 */

import { describe, expect, it } from '@jest/globals';

import {
 acos,
 acosSafe,
 asin,
 asinSafe,
 atan,
 atan2,
 cos,
 exp,
 expSafe,
 log,
 logKernelSafe,
 pow,
 pow2,
 sin,
 sinCos,
 sqrtSafe,
 tan,
} from '../../src/deterministic/deterministic-kernels';

const PI = Math.PI;

describe('DeterministicKernels L0 Functions', () => {
 describe('pow2', () => {
  it('should compute 2^n for normal exponents', () => {
   expect(pow2(0)).toBe(1);
   expect(pow2(1)).toBe(2);
   expect(pow2(10)).toBe(1024);
   expect(pow2(-1)).toBe(0.5);
  });

  it('should handle n = -1022 (smallest normal exponent)', () => {
   expect(pow2(-1022)).toBe(2.2250738585072014e-308);
  });

  it('should handle n = -1023 (first subnormal)', () => {
   const result = pow2(-1023);
   expect(result).toBe(5e-324 * Math.pow(2, 1074 - 1023));
   expect(result).toBeGreaterThan(0);
   expect(result).toBeLessThan(pow2(-1022));
  });

  it('should handle n = -1074 (smallest subnormal, 5e-324)', () => {
   expect(pow2(-1074)).toBe(5e-324);
  });

  it('should handle n = 1023 (largest finite)', () => {
   expect(pow2(1023)).toBe(8.98846567431158e307);
  });
 });

 describe('sqrtSafe', () => {
  it('should return 0 for negative values', () => {
   expect(sqrtSafe(-1)).toBe(0);
   expect(sqrtSafe(-100)).toBe(0);
   expect(sqrtSafe(0)).toBe(0);
  });

  it('should compute sqrt for positive values', () => {
   expect(sqrtSafe(4)).toBeCloseTo(2, 14);
  });
 });

 describe('sin', () => {
  it('should compute sine correctly at key angles', () => {
   expect(sin(0)).toBeCloseTo(0, 14);
   expect(sin(PI / 6)).toBeCloseTo(0.5, 14);
   expect(sin(PI / 4)).toBeCloseTo(Math.SQRT1_2, 14);
   expect(sin(PI / 3)).toBeCloseTo(Math.sqrt(3) / 2, 14);
   expect(sin(PI / 2)).toBeCloseTo(1, 14);
   expect(sin(PI)).toBeCloseTo(0, 10);
   expect(sin((3 * PI) / 2)).toBeCloseTo(-1, 14);
  });

  it('should handle edge cases', () => {
   expect(sin(Infinity)).toBeNaN();
   expect(sin(-Infinity)).toBeNaN();
   expect(sin(NaN)).toBeNaN();
  });

  it('should match Math.sin within precision limits', () => {
   for (let index = 0; index < 100; index++) {
    const x = (Math.random() - 0.5) * 10;
    expect(sin(x)).toBeCloseTo(Math.sin(x), 12);
   }
  });
 });

 describe('cos', () => {
  it('should compute cosine correctly at key angles', () => {
   expect(cos(0)).toBeCloseTo(1, 14);
   expect(cos(PI / 3)).toBeCloseTo(0.5, 14);
   expect(cos(PI / 4)).toBeCloseTo(Math.SQRT1_2, 14);
   expect(cos(PI / 2)).toBeCloseTo(0, 10);
   expect(cos(PI)).toBeCloseTo(-1, 14);
   expect(cos((3 * PI) / 2)).toBeCloseTo(0, 10);
  });

  it('should handle edge cases', () => {
   expect(cos(Infinity)).toBeNaN();
   expect(cos(-Infinity)).toBeNaN();
   expect(cos(NaN)).toBeNaN();
  });
 });

 describe('sinCos', () => {
  it('should compute both sin and cos simultaneously', () => {
   const result = sinCos(PI / 4);
   expect(result.sin).toBeCloseTo(Math.SQRT1_2, 14);
   expect(result.cos).toBeCloseTo(Math.SQRT1_2, 14);
  });

  it('should satisfy sin² + cos² = 1', () => {
   for (let index = 0; index < 100; index++) {
    const x = (Math.random() - 0.5) * 20;
    const { sin: s, cos: c } = sinCos(x);
    expect(s * s + c * c).toBeCloseTo(1, 12);
   }
  });

  it('should maintain precision for large angles (x = 1000)', () => {
   const { sin: s, cos: c } = sinCos(1000.0);
   expect(s).toBeCloseTo(Math.sin(1000.0), 10);
   expect(c).toBeCloseTo(Math.cos(1000.0), 10);
   expect(s * s + c * c).toBeCloseTo(1, 12);
  });

  it('should maintain precision for very large angles (x = 100000)', () => {
   const { sin: s, cos: c } = sinCos(100000.0);
   expect(s).toBeCloseTo(Math.sin(100000.0), 8);
   expect(c).toBeCloseTo(Math.cos(100000.0), 8);
   expect(s * s + c * c).toBeCloseTo(1, 12);
  });
 });

 describe('tan', () => {
  it('should compute tangent correctly', () => {
   expect(tan(0)).toBeCloseTo(0, 14);
   expect(tan(PI / 4)).toBeCloseTo(1, 12);
   expect(tan(-PI / 4)).toBeCloseTo(-1, 12);
  });
 });

 describe('atan', () => {
  it('should compute arctangent correctly', () => {
   expect(atan(0)).toBeCloseTo(0, 14);
   expect(atan(1)).toBeCloseTo(PI / 4, 12);
   expect(atan(-1)).toBeCloseTo(-PI / 4, 12);
   expect(atan(Infinity)).toBeCloseTo(PI / 2, 14);
   expect(atan(-Infinity)).toBeCloseTo(-PI / 2, 14);
  });

  it('should match Math.atan', () => {
   for (let index = 0; index < 100; index++) {
    const x = (Math.random() - 0.5) * 100;
    expect(atan(x)).toBeCloseTo(Math.atan(x), 12);
   }
  });
 });

 describe('atan2', () => {
  it('should compute two-argument arctangent correctly', () => {
   expect(atan2(0, 1)).toBeCloseTo(0, 14);
   expect(atan2(1, 0)).toBeCloseTo(PI / 2, 14);
   expect(atan2(0, -1)).toBeCloseTo(PI, 14);
   expect(atan2(-1, 0)).toBeCloseTo(-PI / 2, 14);
   expect(atan2(1, 1)).toBeCloseTo(PI / 4, 12);
   expect(atan2(-1, -1)).toBeCloseTo((-3 * PI) / 4, 12);
  });

  it('should handle NaN inputs', () => {
   expect(atan2(NaN, 1)).toBeNaN();
   expect(atan2(1, NaN)).toBeNaN();
   expect(atan2(NaN, NaN)).toBeNaN();
  });

  it('should handle x=Infinity edge cases', () => {
   // x = +Infinity
   expect(atan2(Infinity, Infinity)).toBeCloseTo(PI / 4, 12); // PI/4
   expect(atan2(-Infinity, Infinity)).toBeCloseTo(-PI / 4, 12); // -PI/4
   expect(atan2(1, Infinity)).toBeCloseTo(0, 14); // 0
   expect(atan2(-1, Infinity)).toBeCloseTo(0, 14); // 0
  });

  it('should handle x=-Infinity edge cases', () => {
   // x = -Infinity
   expect(atan2(Infinity, -Infinity)).toBeCloseTo(PI - PI / 4, 12); // 3*PI/4
   expect(atan2(-Infinity, -Infinity)).toBeCloseTo(-(PI - PI / 4), 12); // -3*PI/4
   expect(atan2(1, -Infinity)).toBeCloseTo(PI, 14); // PI
   expect(atan2(-1, -Infinity)).toBeCloseTo(-PI, 14); // -PI
   expect(atan2(0, -Infinity)).toBeCloseTo(PI, 14); // PI (y >= 0)
  });

  it('should handle y=±Infinity edge cases', () => {
   // y = ±Infinity (finite x)
   expect(atan2(Infinity, 1)).toBeCloseTo(PI / 2, 14); // PI/2
   expect(atan2(-Infinity, 1)).toBeCloseTo(-PI / 2, 14); // -PI/2
   expect(atan2(Infinity, -1)).toBeCloseTo(PI / 2, 14); // PI/2
   expect(atan2(-Infinity, -1)).toBeCloseTo(-PI / 2, 14); // -PI/2
  });

  it('should handle all 8 IEEE 754 signed-zero cases', () => {
   // atan2(+0, +0) = +0
   expect(atan2(0, 0)).toBe(0);
   expect(Object.is(atan2(0, 0), 0)).toBe(true);

   // atan2(+0, -0) = +PI
   expect(atan2(0, -0)).toBeCloseTo(PI, 14);

   // atan2(-0, +0) = -0
   expect(Object.is(atan2(-0, 0), -0)).toBe(true);

   // atan2(-0, -0) = -PI
   expect(atan2(-0, -0)).toBeCloseTo(-PI, 14);

   // atan2(+0, x>0) = +0
   expect(atan2(0, 5)).toBe(0);
   expect(Object.is(atan2(0, 5), 0)).toBe(true);

   // atan2(-0, x>0) = -0
   expect(Object.is(atan2(-0, 5), -0)).toBe(true);

   // atan2(+0, x<0) = +PI
   expect(atan2(0, -5)).toBeCloseTo(PI, 14);

   // atan2(-0, x<0) = -PI
   expect(atan2(-0, -5)).toBeCloseTo(-PI, 14);
  });

  it('should match Math.atan2', () => {
   // Generate valid test cases first (both x and y cannot be 0)
   const testCases: Array<{ x: number; y: number }> = [];
   for (let index = 0; index < 100; index++) {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 100;
    if (x !== 0 || y !== 0) {
     testCases.push({ x, y });
    }
   }
   // Test all valid cases unconditionally
   for (const { x, y } of testCases) {
    expect(atan2(y, x)).toBeCloseTo(Math.atan2(y, x), 12);
   }
  });
 });

 describe('acos / asin', () => {
  it('should compute arccosine correctly', () => {
   expect(acos(1)).toBeCloseTo(0, 14);
   expect(acos(0)).toBeCloseTo(PI / 2, 12);
   expect(acos(-1)).toBeCloseTo(PI, 14);
   expect(acos(0.5)).toBeCloseTo(PI / 3, 12);
  });

  it('should compute arcsine correctly', () => {
   expect(asin(0)).toBeCloseTo(0, 14);
   expect(asin(1)).toBeCloseTo(PI / 2, 12);
   expect(asin(-1)).toBeCloseTo(-PI / 2, 12);
   expect(asin(0.5)).toBeCloseTo(PI / 6, 12);
  });

  it('should return NaN for out-of-range inputs', () => {
   expect(acos(2)).toBeNaN();
   expect(acos(-2)).toBeNaN();
   expect(asin(2)).toBeNaN();
   expect(asin(-2)).toBeNaN();
  });
 });

 describe('acosSafe / asinSafe', () => {
  it('should clamp out-of-range values', () => {
   expect(acosSafe(2)).toBeCloseTo(0, 14);
   expect(acosSafe(-2)).toBeCloseTo(PI, 14);
   expect(asinSafe(2)).toBeCloseTo(PI / 2, 14);
   expect(asinSafe(-2)).toBeCloseTo(-PI / 2, 14);
  });
 });

 describe('pow', () => {
  it('should compute integer powers', () => {
   expect(pow(2, 0)).toBe(1);
   expect(pow(2, 1)).toBe(2);
   expect(pow(2, 10)).toBe(1024);
   expect(pow(2, -1)).toBeCloseTo(0.5, 14);
   expect(pow(3, 4)).toBe(81);
  });

  it('should handle special cases', () => {
   expect(pow(0, 5)).toBe(0);
   expect(pow(1, 100)).toBe(1);
   expect(pow(0, -1)).toBe(Infinity);
  });
 });

 describe('log', () => {
  it('should compute natural logarithm correctly', () => {
   expect(log(1)).toBe(0);
   expect(log(Math.E)).toBeCloseTo(1, 12);
   expect(log(10)).toBeCloseTo(2.302585092994046, 12);
   expect(log(100)).toBeCloseTo(4.605170185988091, 12);
  });

  it('should handle edge cases', () => {
   expect(log(-1)).toBeNaN();
   expect(log(0)).toBe(-Infinity);
   expect(log(Infinity)).toBe(Infinity);
   expect(log(NaN)).toBeNaN();
  });

  it('should match Math.log within precision', () => {
   for (let index = 0; index < 100; index++) {
    const x = Math.random() * 1000 + 0.001;
    expect(log(x)).toBeCloseTo(Math.log(x), 6);
   }
  });
 });

 describe('log precision near boundaries', () => {
  it('should be accurate for values just above a power of 2', () => {
   // log(2.0000000001) should be very close to ln(2)
   const result = log(2.0000000001);
   expect(result).toBeCloseTo(Math.log(2.0000000001), 10);
  });

  it('should be accurate for values just below a power of 2', () => {
   const result = log(1.9999999999);
   expect(result).toBeCloseTo(Math.log(1.9999999999), 10);
  });

  it('should be accurate at sqrt(2)/2 boundary', () => {
   const sqrtHalf = 0.7071067811865476; // sqrt(2)/2
   const result = log(sqrtHalf);
   // -ln(2)/2 = -0.34657359027997264
   expect(result).toBeCloseTo(-0.34657359027997264, 12);
  });

  it('should be accurate near sqrt(2)', () => {
   const result = log(Math.SQRT2);
   // ln(sqrt(2)) = ln(2)/2
   expect(result).toBeCloseTo(0.34657359027997264, 12);
  });

  it('should be accurate at powers of 2', () => {
   expect(log(2)).toBeCloseTo(Math.LN2, 12);
   expect(log(4)).toBeCloseTo(2 * Math.LN2, 12);
   expect(log(0.5)).toBeCloseTo(-Math.LN2, 12);
   expect(log(0.25)).toBeCloseTo(-2 * Math.LN2, 12);
  });
 });

 describe('logKernelSafe', () => {
  it('should return 0 for non-positive values', () => {
   expect(logKernelSafe(-1)).toBe(0);
   expect(logKernelSafe(0)).toBe(0);
   expect(logKernelSafe(-100)).toBe(0);
  });

  it('should compute log for positive values', () => {
   expect(logKernelSafe(Math.E)).toBeCloseTo(1, 12);
  });
 });

 describe('exp', () => {
  it('should compute exponential correctly', () => {
   expect(exp(0)).toBe(1);
   expect(exp(1)).toBeCloseTo(Math.E, 12);
   expect(exp(2)).toBeCloseTo(Math.E * Math.E, 10);
   expect(exp(-1)).toBeCloseTo(1 / Math.E, 12);
  });

  it('should handle edge cases', () => {
   expect(exp(-Infinity)).toBe(0);
   expect(exp(Infinity)).toBe(Infinity);
   expect(exp(NaN)).toBeNaN();
  });

  it('should match Math.exp within precision', () => {
   for (let index = 0; index < 100; index++) {
    const x = (Math.random() - 0.5) * 20; // Smaller range for precision
    expect(exp(x)).toBeCloseTo(Math.exp(x), 6);
   }
  });

  it('should handle near-overflow boundary (exp(709))', () => {
   const result = exp(709);
   expect(Number.isFinite(result)).toBe(true);
   expect(result).toBeCloseTo(Math.exp(709), -300); // Very large, check order of magnitude
   expect(result).toBeGreaterThan(0);
  });

  it('should handle near-underflow boundary (exp(-745))', () => {
   const result = exp(-745);
   // Near underflow: should be 0 or a very tiny denormalized number
   expect(result).toBeGreaterThanOrEqual(0);
   expect(result).toBeLessThan(1e-300);
  });
 });

 describe('expSafe', () => {
  it('should propagate NaN', () => {
   expect(expSafe(NaN)).toBeNaN();
  });

  it('should handle overflow gracefully', () => {
   expect(expSafe(1000)).toBe(Number.MAX_VALUE);
  });

  it('should compute exp for normal values', () => {
   expect(expSafe(1)).toBeCloseTo(Math.E, 12);
  });
 });

 describe('pow with fractional exponents (L0)', () => {
  it('should compute fractional powers using deterministic exp/log', () => {
   expect(pow(4, 0.5)).toBeCloseTo(2, 12);
   expect(pow(8, 1 / 3)).toBeCloseTo(2, 10);
   expect(pow(2, 2.5)).toBeCloseTo(Math.pow(2, 2.5), 10);
  });

  it('should return NaN for negative base with fractional exponent', () => {
   expect(pow(-1, 0.5)).toBeNaN();
  });
 });

 describe('L0 Determinism Property', () => {
  it('should produce identical results on repeated calls', () => {
   const testValues = [0, 0.5, 1, PI / 4, PI / 2, PI, 2 * PI];

   for (const x of testValues) {
    const sin1 = sin(x);
    const sin2 = sin(x);
    expect(sin1).toBe(sin2);

    const cos1 = cos(x);
    const cos2 = cos(x);
    expect(cos1).toBe(cos2);
   }
  });

  it('should produce identical log/exp results on repeated calls', () => {
   const testValues = [0.1, 0.5, 1, 2, 10, 100];

   for (const x of testValues) {
    const log1 = log(x);
    const log2 = log(x);
    expect(log1).toBe(log2);

    const exp1 = exp(x);
    const exp2 = exp(x);
    expect(exp1).toBe(exp2);
   }
  });
 });
});
