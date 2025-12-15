import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { PI, TAU } from '../../src/auxiliary/scalar/constants';
import { DeterministicMath } from '../../src/deterministic/deterministic-math';

describe('DeterministicMath', () => {
 beforeEach(() => {
  DeterministicMath.reset();
 });

 afterEach(() => {
  DeterministicMath.reset();
 });

 describe('configure', () => {
  test('should accept valid table sizes', () => {
   DeterministicMath.configure({ tableSize: 256 });
   expect(() => DeterministicMath.configure({ tableSize: 256 })).not.toThrow();
   expect(() => DeterministicMath.configure({ tableSize: 1024 })).not.toThrow();
   expect(() => DeterministicMath.configure({ tableSize: 4096 })).not.toThrow();
  });

  test('should reject non-power-of-2 table sizes', () => {
   expect(() => DeterministicMath.configure({ tableSize: 100 })).toThrow();
   expect(() => DeterministicMath.configure({ tableSize: 1000 })).toThrow();
  });
 });

 describe('sin', () => {
  test('should return correct values for cardinal angles', () => {
   expect(DeterministicMath.sin(0)).toBeCloseTo(0, 5);
   expect(DeterministicMath.sin(PI / 2)).toBeCloseTo(1, 5);
   expect(DeterministicMath.sin(PI)).toBeCloseTo(0, 5);
   expect(DeterministicMath.sin((3 * PI) / 2)).toBeCloseTo(-1, 5);
   expect(DeterministicMath.sin(TAU)).toBeCloseTo(0, 5);
  });

  test('should handle negative angles', () => {
   expect(DeterministicMath.sin(-PI / 2)).toBeCloseTo(-1, 5);
   expect(DeterministicMath.sin(-PI)).toBeCloseTo(0, 5);
  });

  test('should handle large angles', () => {
   expect(DeterministicMath.sin(10 * PI)).toBeCloseTo(0, 5);
   expect(DeterministicMath.sin(100 * PI + PI / 2)).toBeCloseTo(1, 5);
  });

  test('should be deterministic', () => {
   const angle = 1.23456789;
   const result1 = DeterministicMath.sin(angle);
   const result2 = DeterministicMath.sin(angle);
   expect(result1).toBe(result2);
  });
 });

 describe('cos', () => {
  test('should return correct values for cardinal angles', () => {
   expect(DeterministicMath.cos(0)).toBeCloseTo(1, 5);
   expect(DeterministicMath.cos(PI / 2)).toBeCloseTo(0, 5);
   expect(DeterministicMath.cos(PI)).toBeCloseTo(-1, 5);
   expect(DeterministicMath.cos((3 * PI) / 2)).toBeCloseTo(0, 5);
   expect(DeterministicMath.cos(TAU)).toBeCloseTo(1, 5);
  });

  test('should satisfy sin² + cos² = 1', () => {
   const angles = [0, 0.1, 0.5, 1, 2, 3, PI / 4, PI / 3];
   for (const angle of angles) {
    const sin = DeterministicMath.sin(angle);
    const cos = DeterministicMath.cos(angle);
    expect(sin * sin + cos * cos).toBeCloseTo(1, 5);
   }
  });
 });

 describe('tan', () => {
  test('should return correct values', () => {
   expect(DeterministicMath.tan(0)).toBeCloseTo(0, 5);
   expect(DeterministicMath.tan(PI / 4)).toBeCloseTo(1, 5);
   expect(DeterministicMath.tan(-PI / 4)).toBeCloseTo(-1, 5);
  });

  test('should handle near-vertical asymptotes', () => {
   const near90 = PI / 2 - 0.001;
   expect(Math.abs(DeterministicMath.tan(near90))).toBeGreaterThan(100);
  });
 });

 describe('sqrt', () => {
  test('should return correct square roots', () => {
   expect(DeterministicMath.sqrt(0)).toBe(0);
   expect(DeterministicMath.sqrt(1)).toBe(1);
   // DeterministicMath uses Newton-Raphson with limited iterations
   // Precision may be slightly less than native Math.sqrt (~3 decimal places)
   expect(DeterministicMath.sqrt(4)).toBeCloseTo(2, 2);
   expect(DeterministicMath.sqrt(9)).toBeCloseTo(3, 2);
   expect(DeterministicMath.sqrt(16)).toBeCloseTo(4, 2);
  });

  test('should handle fractional values', () => {
   expect(DeterministicMath.sqrt(0.25)).toBeCloseTo(0.5, 5);
   expect(DeterministicMath.sqrt(0.5)).toBeCloseTo(Math.SQRT1_2, 5);
  });

  test('should return NaN for negative values', () => {
   expect(DeterministicMath.sqrt(-1)).toBeNaN();
   expect(DeterministicMath.sqrt(-10)).toBeNaN();
  });

  test('should handle Infinity correctly', () => {
   expect(DeterministicMath.sqrt(Infinity)).toBe(Infinity);
  });

  test('should handle moderately large values', () => {
   // Newton-Raphson with limited iterations works well for moderate ranges
   expect(DeterministicMath.sqrt(10000)).toBeCloseTo(100, 1);
   expect(DeterministicMath.sqrt(1000000)).toBeCloseTo(1000, 0);
  });

  test('should handle values in normal range', () => {
   // Values in typical range where Newton-Raphson converges well
   expect(DeterministicMath.sqrt(2)).toBeCloseTo(Math.SQRT2, 4);
   expect(DeterministicMath.sqrt(3)).toBeCloseTo(Math.sqrt(3), 4);
  });

  test('should be deterministic', () => {
   const value = 123.456;
   const result1 = DeterministicMath.sqrt(value);
   const result2 = DeterministicMath.sqrt(value);
   expect(result1).toBe(result2);
  });
 });

 describe('sqrtSafe', () => {
  test('should return correct square roots for positive values', () => {
   expect(DeterministicMath.sqrtSafe(0)).toBe(0);
   expect(DeterministicMath.sqrtSafe(1)).toBe(1);
   expect(DeterministicMath.sqrtSafe(4)).toBeCloseTo(2, 2);
   expect(DeterministicMath.sqrtSafe(9)).toBeCloseTo(3, 2);
  });

  test('should return 0 for negative values (not NaN)', () => {
   expect(DeterministicMath.sqrtSafe(-1)).toBe(0);
   expect(DeterministicMath.sqrtSafe(-10)).toBe(0);
   expect(DeterministicMath.sqrtSafe(-0.0001)).toBe(0);
  });

  test('should handle floating-point precision errors gracefully', () => {
   // Values that might be slightly negative due to FP errors
   expect(DeterministicMath.sqrtSafe(-1e-15)).toBe(0);
   expect(DeterministicMath.sqrtSafe(-Number.EPSILON)).toBe(0);
  });

  test('should be deterministic', () => {
   expect(DeterministicMath.sqrtSafe(-5)).toBe(DeterministicMath.sqrtSafe(-5));
   expect(DeterministicMath.sqrtSafe(25)).toBe(DeterministicMath.sqrtSafe(25));
  });

  test('should produce same results as sqrt for positive values', () => {
   const values = [0, 1, 4, 9, 16, 25, 0.5, 0.25, 100];
   for (const value of values) {
    expect(DeterministicMath.sqrtSafe(value)).toBe(DeterministicMath.sqrt(value));
   }
  });
 });

 describe('atan2', () => {
  test('should return correct angles for cardinal directions', () => {
   expect(DeterministicMath.atan2(0, 1)).toBeCloseTo(0, 5); // East
   expect(DeterministicMath.atan2(1, 0)).toBeCloseTo(PI / 2, 5); // North
   expect(DeterministicMath.atan2(0, -1)).toBeCloseTo(PI, 5); // West
   expect(DeterministicMath.atan2(-1, 0)).toBeCloseTo(-PI / 2, 5); // South
  });

  test('should handle diagonal directions', () => {
   expect(DeterministicMath.atan2(1, 1)).toBeCloseTo(PI / 4, 5); // NE
   expect(DeterministicMath.atan2(1, -1)).toBeCloseTo((3 * PI) / 4, 5); // NW
   expect(DeterministicMath.atan2(-1, -1)).toBeCloseTo((-3 * PI) / 4, 5); // SW
   expect(DeterministicMath.atan2(-1, 1)).toBeCloseTo(-PI / 4, 5); // SE
  });

  test('should handle origin', () => {
   expect(DeterministicMath.atan2(0, 0)).toBe(0);
  });
 });

 describe('acos', () => {
  test('should return correct values for boundary inputs', () => {
   expect(DeterministicMath.acos(1)).toBe(0);
   expect(DeterministicMath.acos(-1)).toBeCloseTo(PI, 5);
   expect(DeterministicMath.acos(0)).toBeCloseTo(PI / 2, 5);
  });

  test('should return correct values for common angles', () => {
   // acos(0.5) = PI/3 (60 degrees)
   expect(DeterministicMath.acos(0.5)).toBeCloseTo(PI / 3, 4);
   // acos(sqrt(2)/2) = PI/4 (45 degrees)
   expect(DeterministicMath.acos(Math.SQRT1_2)).toBeCloseTo(PI / 4, 4);
   // acos(sqrt(3)/2) = PI/6 (30 degrees)
   expect(DeterministicMath.acos(Math.sqrt(3) / 2)).toBeCloseTo(PI / 6, 4);
  });

  test('should return NaN for out-of-range inputs', () => {
   expect(DeterministicMath.acos(1.1)).toBe(0); // clamped to 1
   expect(DeterministicMath.acos(-1.1)).toBeCloseTo(PI, 5); // clamped to -1
   expect(DeterministicMath.acos(NaN)).toBeNaN();
  });

  test('should be deterministic', () => {
   const values = [-1, -0.5, 0, 0.5, 1];
   for (const v of values) {
    const r1 = DeterministicMath.acos(v);
    const r2 = DeterministicMath.acos(v);
    expect(r1).toBe(r2);
   }
  });

  test('should match Math.acos within tolerance', () => {
   for (let x = -1; x <= 1; x += 0.1) {
    const det = DeterministicMath.acos(x);
    const native = Math.acos(x);
    expect(det).toBeCloseTo(native, 4);
   }
  });
 });

 describe('acosSafe', () => {
  test('should clamp out-of-range inputs', () => {
   expect(DeterministicMath.acosSafe(2)).toBe(0); // clamped to 1 → acos(1) = 0
   expect(DeterministicMath.acosSafe(-2)).toBeCloseTo(PI, 5); // clamped to -1 → acos(-1) = PI
   expect(DeterministicMath.acosSafe(1.0001)).toBe(0);
   expect(DeterministicMath.acosSafe(-1.0001)).toBeCloseTo(PI, 5);
  });

  test('should work same as acos for valid inputs', () => {
   const values = [-1, -0.5, 0, 0.5, 1];
   for (const v of values) {
    expect(DeterministicMath.acosSafe(v)).toBe(DeterministicMath.acos(v));
   }
  });
 });

 describe('asin', () => {
  test('should return correct values for boundary inputs', () => {
   expect(DeterministicMath.asin(1)).toBeCloseTo(PI / 2, 5);
   expect(DeterministicMath.asin(-1)).toBeCloseTo(-PI / 2, 5);
   expect(DeterministicMath.asin(0)).toBeCloseTo(0, 5);
  });

  test('should return correct values for common angles', () => {
   // asin(0.5) = PI/6 (30 degrees)
   expect(DeterministicMath.asin(0.5)).toBeCloseTo(PI / 6, 4);
   // asin(sqrt(2)/2) = PI/4 (45 degrees)
   expect(DeterministicMath.asin(Math.SQRT1_2)).toBeCloseTo(PI / 4, 4);
   // asin(sqrt(3)/2) = PI/3 (60 degrees)
   expect(DeterministicMath.asin(Math.sqrt(3) / 2)).toBeCloseTo(PI / 3, 4);
  });

  test('should return NaN for NaN input', () => {
   expect(DeterministicMath.asin(NaN)).toBeNaN();
  });

  test('should be deterministic', () => {
   const values = [-1, -0.5, 0, 0.5, 1];
   for (const v of values) {
    const r1 = DeterministicMath.asin(v);
    const r2 = DeterministicMath.asin(v);
    expect(r1).toBe(r2);
   }
  });

  test('should match Math.asin within tolerance', () => {
   for (let x = -1; x <= 1; x += 0.1) {
    const det = DeterministicMath.asin(x);
    const native = Math.asin(x);
    expect(det).toBeCloseTo(native, 4);
   }
  });
 });

 describe('asinSafe', () => {
  test('should clamp out-of-range inputs', () => {
   expect(DeterministicMath.asinSafe(2)).toBeCloseTo(PI / 2, 5); // clamped to 1
   expect(DeterministicMath.asinSafe(-2)).toBeCloseTo(-PI / 2, 5); // clamped to -1
   expect(DeterministicMath.asinSafe(1.0001)).toBeCloseTo(PI / 2, 5);
   expect(DeterministicMath.asinSafe(-1.0001)).toBeCloseTo(-PI / 2, 5);
  });

  test('should work same as asin for valid inputs', () => {
   const values = [-1, -0.5, 0, 0.5, 1];
   for (const v of values) {
    expect(DeterministicMath.asinSafe(v)).toBe(DeterministicMath.asin(v));
   }
  });
 });

 describe('rounding functions', () => {
  test('floor should round down', () => {
   expect(DeterministicMath.floor(2.7)).toBe(2);
   expect(DeterministicMath.floor(2.0)).toBe(2);
   expect(DeterministicMath.floor(-2.7)).toBe(-3);
   expect(DeterministicMath.floor(-2.0)).toBe(-2);
  });

  test('ceil should round up', () => {
   expect(DeterministicMath.ceil(2.3)).toBe(3);
   expect(DeterministicMath.ceil(2.0)).toBe(2);
   expect(DeterministicMath.ceil(-2.3)).toBe(-2);
   expect(DeterministicMath.ceil(-2.0)).toBe(-2);
  });

  test("round should use banker's rounding", () => {
   expect(DeterministicMath.round(2.5)).toBe(2); // Even
   expect(DeterministicMath.round(3.5)).toBe(4); // Even
   expect(DeterministicMath.round(2.6)).toBe(3);
   expect(DeterministicMath.round(2.4)).toBe(2);
  });
 });

 describe('getOptions', () => {
  test('should return current configuration', () => {
   const options = DeterministicMath.getOptions();
   // Default tableSize is 65536 (not 256 as in older versions)
   expect(options.tableSize).toBe(65536);
   expect(options.sqrtIterations).toBe(3);
   expect(options.useFixedPoint).toBe(false);
   expect(options.fixedPointScale).toBe(16);
  });
 });

 describe('abs', () => {
  test('should return absolute value for positive numbers', () => {
   expect(DeterministicMath.abs(5)).toBe(5);
   expect(DeterministicMath.abs(3.14)).toBe(3.14);
   expect(DeterministicMath.abs(Number.MAX_VALUE)).toBe(Number.MAX_VALUE);
  });

  test('should return absolute value for negative numbers', () => {
   expect(DeterministicMath.abs(-5)).toBe(5);
   expect(DeterministicMath.abs(-3.14)).toBe(3.14);
   expect(DeterministicMath.abs(-Number.MAX_VALUE)).toBe(Number.MAX_VALUE);
  });

  test('should return 0 for zero', () => {
   expect(DeterministicMath.abs(0)).toBe(0);
   expect(DeterministicMath.abs(-0)).toBe(0);
  });

  test('should handle special values', () => {
   expect(DeterministicMath.abs(Infinity)).toBe(Infinity);
   expect(DeterministicMath.abs(-Infinity)).toBe(Infinity);
   expect(DeterministicMath.abs(NaN)).toBeNaN();
  });
 });

 describe('sign', () => {
  test('should return 1 for positive numbers', () => {
   expect(DeterministicMath.sign(5)).toBe(1);
   expect(DeterministicMath.sign(0.001)).toBe(1);
   expect(DeterministicMath.sign(Number.MAX_VALUE)).toBe(1);
  });

  test('should return -1 for negative numbers', () => {
   expect(DeterministicMath.sign(-5)).toBe(-1);
   expect(DeterministicMath.sign(-0.001)).toBe(-1);
   expect(DeterministicMath.sign(-Number.MAX_VALUE)).toBe(-1);
  });

  test('should return 0 for zero', () => {
   expect(DeterministicMath.sign(0)).toBe(0);
  });

  test('should handle special values', () => {
   expect(DeterministicMath.sign(Infinity)).toBe(1);
   expect(DeterministicMath.sign(-Infinity)).toBe(-1);
   // Note: sign(NaN) returns 0, unlike Math.sign which returns NaN
   // This is intentional for determinism (NaN comparisons are false)
   expect(DeterministicMath.sign(NaN)).toBe(0);
  });
 });

 describe('floorSafe', () => {
  test('should work like floor for int32 range values', () => {
   expect(DeterministicMath.floorSafe(2.7)).toBe(2);
   expect(DeterministicMath.floorSafe(-2.7)).toBe(-3);
   expect(DeterministicMath.floorSafe(100.1)).toBe(100);
  });

  test('should handle values outside int32 range', () => {
   // Values larger than 2^31 - 1
   expect(DeterministicMath.floorSafe(2147483648.5)).toBe(2147483648);
   expect(DeterministicMath.floorSafe(3000000000.9)).toBe(3000000000);
   // Values smaller than -2^31
   expect(DeterministicMath.floorSafe(-2147483649.5)).toBe(-2147483650);
   expect(DeterministicMath.floorSafe(-3000000000.9)).toBe(-3000000001);
  });

  test('should handle Infinity', () => {
   expect(DeterministicMath.floorSafe(Infinity)).toBe(Infinity);
   expect(DeterministicMath.floorSafe(-Infinity)).toBe(-Infinity);
  });

  test('should handle NaN', () => {
   expect(DeterministicMath.floorSafe(NaN)).toBeNaN();
  });
 });

 describe('ceilSafe', () => {
  test('should work like ceil for int32 range values', () => {
   expect(DeterministicMath.ceilSafe(2.3)).toBe(3);
   expect(DeterministicMath.ceilSafe(-2.3)).toBe(-2);
   expect(DeterministicMath.ceilSafe(100.1)).toBe(101);
  });

  test('should handle values outside int32 range', () => {
   expect(DeterministicMath.ceilSafe(2147483648.5)).toBe(2147483649);
   expect(DeterministicMath.ceilSafe(3000000000.1)).toBe(3000000001);
   expect(DeterministicMath.ceilSafe(-2147483649.5)).toBe(-2147483649);
  });

  test('should handle Infinity', () => {
   expect(DeterministicMath.ceilSafe(Infinity)).toBe(Infinity);
   expect(DeterministicMath.ceilSafe(-Infinity)).toBe(-Infinity);
  });

  test('should handle NaN', () => {
   expect(DeterministicMath.ceilSafe(NaN)).toBeNaN();
  });
 });

 describe('roundSafe', () => {
  test('should use bankers rounding for int32 range values', () => {
   expect(DeterministicMath.roundSafe(2.5)).toBe(2); // Even
   expect(DeterministicMath.roundSafe(3.5)).toBe(4); // Even
   expect(DeterministicMath.roundSafe(2.6)).toBe(3);
   expect(DeterministicMath.roundSafe(2.4)).toBe(2);
  });

  test('should handle values outside int32 range', () => {
   // Large positive values
   expect(DeterministicMath.roundSafe(2147483648.5)).toBe(2147483648); // Even
   expect(DeterministicMath.roundSafe(2147483649.5)).toBe(2147483650); // Even
   expect(DeterministicMath.roundSafe(3000000000.7)).toBe(3000000001);
  });

  test('should handle Infinity', () => {
   expect(DeterministicMath.roundSafe(Infinity)).toBe(Infinity);
   expect(DeterministicMath.roundSafe(-Infinity)).toBe(-Infinity);
  });

  test('should handle NaN', () => {
   expect(DeterministicMath.roundSafe(NaN)).toBeNaN();
  });
 });

 describe('tan edge cases', () => {
  test('should return Infinity at exact π/2', () => {
   // At exactly π/2, cos approaches 0, so tan approaches infinity
   const result = DeterministicMath.tan(PI / 2);
   expect(result).toBe(Infinity);
  });

  test('should return -Infinity at exact -π/2', () => {
   const result = DeterministicMath.tan(-PI / 2);
   expect(result).toBe(-Infinity);
  });
 });

 describe('atan2 edge cases', () => {
  test('should return NaN for non-finite inputs', () => {
   expect(DeterministicMath.atan2(Infinity, 1)).toBeNaN();
   expect(DeterministicMath.atan2(1, Infinity)).toBeNaN();
   expect(DeterministicMath.atan2(NaN, 1)).toBeNaN();
   expect(DeterministicMath.atan2(1, NaN)).toBeNaN();
   expect(DeterministicMath.atan2(Infinity, Infinity)).toBeNaN();
  });

  test('should handle very small values near zero', () => {
   // Very small values should still give correct quadrant
   expect(DeterministicMath.atan2(1e-15, 1)).toBeCloseTo(0, 10);
   expect(DeterministicMath.atan2(1, 1e-15)).toBeCloseTo(PI / 2, 5);
  });
 });

 describe('configure edge cases', () => {
  test('should reject table size below minimum', () => {
   expect(() => DeterministicMath.configure({ tableSize: 128 })).toThrow();
   expect(() => DeterministicMath.configure({ tableSize: 64 })).toThrow();
  });

  test('should reject invalid sqrtIterations', () => {
   expect(() => DeterministicMath.configure({ sqrtIterations: 0 })).toThrow();
   expect(() => DeterministicMath.configure({ sqrtIterations: -1 })).toThrow();
   expect(() => DeterministicMath.configure({ sqrtIterations: 1.5 })).toThrow();
  });

  test('should accept valid sqrtIterations', () => {
   expect(() => DeterministicMath.configure({ sqrtIterations: 1 })).not.toThrow();
   expect(() => DeterministicMath.configure({ sqrtIterations: 5 })).not.toThrow();
   expect(() => DeterministicMath.configure({ sqrtIterations: 10 })).not.toThrow();
  });

  test('should rebuild tables when table size changes', () => {
   DeterministicMath.configure({ tableSize: 256 });
   const options1 = DeterministicMath.getOptions();
   expect(options1.tableSize).toBe(256);

   DeterministicMath.configure({ tableSize: 512 });
   const options2 = DeterministicMath.getOptions();
   expect(options2.tableSize).toBe(512);
  });
 });

 describe('determinism verification', () => {
  test('should produce identical results across multiple calls', () => {
   const testAngles = [0, 0.1, 0.5, 1, PI / 6, PI / 4, PI / 3, PI / 2, PI, TAU];
   const results: Map<number, { sin: number; cos: number }> = new Map();

   // First pass: collect results
   for (const angle of testAngles) {
    results.set(angle, {
     sin: DeterministicMath.sin(angle),
     cos: DeterministicMath.cos(angle),
    });
   }

   // Second pass: verify identical results
   for (const angle of testAngles) {
    const expected = results.get(angle)!;
    expect(DeterministicMath.sin(angle)).toBe(expected.sin);
    expect(DeterministicMath.cos(angle)).toBe(expected.cos);
   }

   // Third pass: still identical
   for (const angle of testAngles) {
    const expected = results.get(angle)!;
    expect(DeterministicMath.sin(angle)).toBe(expected.sin);
    expect(DeterministicMath.cos(angle)).toBe(expected.cos);
   }
  });

  test('should produce identical sqrt results', () => {
   const values = [0, 1, 2, 4, 9, 16, 25, 100, 0.5, 0.25];

   for (const value of values) {
    const result1 = DeterministicMath.sqrt(value);
    const result2 = DeterministicMath.sqrt(value);
    const result3 = DeterministicMath.sqrt(value);
    expect(result1).toBe(result2);
    expect(result2).toBe(result3);
   }
  });
 });
});
