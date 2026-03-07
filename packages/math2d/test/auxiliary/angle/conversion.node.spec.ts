/**
 * @file test/auxiliary/angle/conversion.node.spec.ts
 * @module @lenguados/math2d/auxiliary/angle
 * @description Tests for angle conversion functions.
 */

import { describe, expect, test } from '@jest/globals';

import {
 degreesToRadians,
 radiansToDegrees,
 turnsToRadians,
 radiansToTurns,
} from '../../../src/auxiliary/angle/conversion';

describe('angle/conversion', () => {
 describe('degreesToRadians', () => {
  test('converts 0 degrees', () => {
   expect(degreesToRadians(0)).toBe(0);
  });

  test('converts 90 degrees', () => {
   expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2);
  });

  test('converts 180 degrees', () => {
   expect(degreesToRadians(180)).toBeCloseTo(Math.PI);
  });

  test('converts 360 degrees', () => {
   expect(degreesToRadians(360)).toBeCloseTo(Math.PI * 2);
  });

  test('converts negative degrees', () => {
   expect(degreesToRadians(-90)).toBeCloseTo(-Math.PI / 2);
  });
 });

 describe('radiansToDegrees', () => {
  test('converts 0 radians', () => {
   expect(radiansToDegrees(0)).toBe(0);
  });

  test('converts π/2 radians', () => {
   expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90);
  });

  test('converts π radians', () => {
   expect(radiansToDegrees(Math.PI)).toBeCloseTo(180);
  });

  test('converts 2π radians', () => {
   expect(radiansToDegrees(Math.PI * 2)).toBeCloseTo(360);
  });

  test('converts negative radians', () => {
   expect(radiansToDegrees(-Math.PI)).toBeCloseTo(-180);
  });
 });

 describe('turnsToRadians', () => {
  test('converts 0 turns', () => {
   expect(turnsToRadians(0)).toBe(0);
  });

  test('converts 0.25 turns (quarter)', () => {
   expect(turnsToRadians(0.25)).toBeCloseTo(Math.PI / 2);
  });

  test('converts 0.5 turns (half)', () => {
   expect(turnsToRadians(0.5)).toBeCloseTo(Math.PI);
  });

  test('converts 1 turn', () => {
   expect(turnsToRadians(1)).toBeCloseTo(Math.PI * 2);
  });
 });

 describe('radiansToTurns', () => {
  test('converts 0 radians', () => {
   expect(radiansToTurns(0)).toBe(0);
  });

  test('converts π/2 radians', () => {
   expect(radiansToTurns(Math.PI / 2)).toBeCloseTo(0.25);
  });

  test('converts π radians', () => {
   expect(radiansToTurns(Math.PI)).toBeCloseTo(0.5);
  });

  test('converts 2π radians', () => {
   expect(radiansToTurns(Math.PI * 2)).toBeCloseTo(1);
  });
 });

 describe('NaN/Infinity handling', () => {
  test('degreesToRadians propagates NaN', () => {
   expect(degreesToRadians(NaN)).toBeNaN();
  });

  test('degreesToRadians propagates Infinity', () => {
   expect(degreesToRadians(Infinity)).toBe(Infinity);
   expect(degreesToRadians(-Infinity)).toBe(-Infinity);
  });

  test('radiansToDegrees propagates NaN', () => {
   expect(radiansToDegrees(NaN)).toBeNaN();
  });

  test('radiansToDegrees propagates Infinity', () => {
   expect(radiansToDegrees(Infinity)).toBe(Infinity);
   expect(radiansToDegrees(-Infinity)).toBe(-Infinity);
  });

  test('turnsToRadians propagates NaN', () => {
   expect(turnsToRadians(NaN)).toBeNaN();
  });

  test('turnsToRadians propagates Infinity', () => {
   expect(turnsToRadians(Infinity)).toBe(Infinity);
  });

  test('radiansToTurns propagates NaN', () => {
   expect(radiansToTurns(NaN)).toBeNaN();
  });

  test('radiansToTurns propagates Infinity', () => {
   expect(radiansToTurns(Infinity)).toBe(Infinity);
  });
 });
});
