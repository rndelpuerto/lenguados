/**
 * @file test/auxiliary/angle/interpolation.node.spec.ts
 * @module @lenguados/math2d/auxiliary/angle
 * @description Tests for angular interpolation functions.
 */

import { describe, expect, it } from '@jest/globals';

import { lerpAngle, smoothStepAngle } from '../../../src/auxiliary/angle/interpolation';

const DIGITS = 5;

describe('angle/interpolation', () => {
 describe('lerpAngle', () => {
  it('interpolates at t=0 returns from', () => {
   expect(lerpAngle(0, Math.PI / 2, 0)).toBeCloseTo(0, DIGITS);
  });

  it('interpolates at t=1 returns to', () => {
   expect(lerpAngle(0, Math.PI / 2, 1)).toBeCloseTo(Math.PI / 2, DIGITS);
  });

  it('interpolates at t=0.5 returns midpoint', () => {
   expect(lerpAngle(0, Math.PI / 2, 0.5)).toBeCloseTo(Math.PI / 4, DIGITS);
  });

  it('uses shortest path across PI boundary', () => {
   // From 0 to 3*PI/2, shortest path is -PI/2
   const result = lerpAngle(0, (3 * Math.PI) / 2, 0.5);
   expect(result).toBeCloseTo(-Math.PI / 4, DIGITS);
  });

  it('handles negative target angle', () => {
   expect(lerpAngle(0, -Math.PI / 2, 0.5)).toBeCloseTo(-Math.PI / 4, DIGITS);
  });

  it('handles negative angles', () => {
   expect(lerpAngle(-Math.PI / 4, Math.PI / 4, 0.5)).toBeCloseTo(0, DIGITS);
  });

  it('extrapolates t > 1', () => {
   expect(lerpAngle(0, Math.PI / 2, 2)).toBeCloseTo(Math.PI, DIGITS);
  });

  it('extrapolates t < 0', () => {
   expect(lerpAngle(0, Math.PI / 2, -1)).toBeCloseTo(-Math.PI / 2, DIGITS);
  });
 });

 describe('smoothStepAngle', () => {
  it('at t=0 returns from', () => {
   expect(smoothStepAngle(0, Math.PI / 2, 0)).toBeCloseTo(0, DIGITS);
  });

  it('at t=1 returns to', () => {
   expect(smoothStepAngle(0, Math.PI / 2, 1)).toBeCloseTo(Math.PI / 2, DIGITS);
  });

  it('at t=0.5 uses smooth interpolation', () => {
   const result = smoothStepAngle(0, Math.PI / 2, 0.5);
   // Smooth step should be somewhere around midpoint
   expect(result).toBeGreaterThan(0);
   expect(result).toBeLessThan(Math.PI / 2);
  });

  it('clamps t < 0', () => {
   expect(smoothStepAngle(0, Math.PI / 2, -1)).toBeCloseTo(0, DIGITS);
  });

  it('clamps t > 1', () => {
   expect(smoothStepAngle(0, Math.PI / 2, 2)).toBeCloseTo(Math.PI / 2, DIGITS);
  });
 });

 describe('NaN/Infinity handling', () => {
  it('lerpAngle returns NaN for NaN input', () => {
   expect(lerpAngle(NaN, 0, 0.5)).toBeNaN();
   expect(lerpAngle(0, NaN, 0.5)).toBeNaN();
  });
 });
});
