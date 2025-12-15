/**
 * @file tests/auxiliary/angle/conversion.node.spec.ts
 * @description Tests for angle conversion functions.
 */

import { describe, expect, test } from '@jest/globals';

import {
 degreesToRadians,
 radiansToDegrees,
 turnsToRadians,
 radiansToTurns,
 gradiansToRadians,
 radiansToGradians,
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

 describe('gradiansToRadians', () => {
  test('converts 0 gradians', () => {
   expect(gradiansToRadians(0)).toBe(0);
  });

  test('converts 100 gradians (right angle)', () => {
   expect(gradiansToRadians(100)).toBeCloseTo(Math.PI / 2);
  });

  test('converts 200 gradians (straight angle)', () => {
   expect(gradiansToRadians(200)).toBeCloseTo(Math.PI);
  });

  test('converts 400 gradians (full turn)', () => {
   expect(gradiansToRadians(400)).toBeCloseTo(Math.PI * 2);
  });
 });

 describe('radiansToGradians', () => {
  test('converts 0 radians', () => {
   expect(radiansToGradians(0)).toBe(0);
  });

  test('converts π/2 radians', () => {
   expect(radiansToGradians(Math.PI / 2)).toBeCloseTo(100);
  });

  test('converts π radians', () => {
   expect(radiansToGradians(Math.PI)).toBeCloseTo(200);
  });

  test('converts 2π radians', () => {
   expect(radiansToGradians(Math.PI * 2)).toBeCloseTo(400);
  });
 });
});
