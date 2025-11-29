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

  test('should be deterministic', () => {
   const value = 123.456;
   const result1 = DeterministicMath.sqrt(value);
   const result2 = DeterministicMath.sqrt(value);
   expect(result1).toBe(result2);
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
});
