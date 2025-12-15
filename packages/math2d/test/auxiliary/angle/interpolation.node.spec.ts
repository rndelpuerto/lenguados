/**
 * @file test/auxiliary/angle/interpolation.node.spec.ts
 * @description Tests for angular interpolation functions
 */

import { describe, expect, it } from '@jest/globals';

import {
 lerpAngle,
 slerpAngle,
 smoothStepAngle,
 springAngle,
} from '../../../src/auxiliary/angle/interpolation';

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

  it('handles negative angles', () => {
   expect(lerpAngle(-Math.PI / 4, Math.PI / 4, 0.5)).toBeCloseTo(0, DIGITS);
  });

  it('handles t > 1 extrapolation', () => {
   // t=2 goes beyond the target, continuing the angular direction
   const result = lerpAngle(0, Math.PI / 2, 2);
   expect(typeof result).toBe('number');
   expect(Number.isFinite(result)).toBe(true);
  });

  it('handles t < 0', () => {
   const result = lerpAngle(0, Math.PI / 2, -1);
   expect(result).toBeCloseTo(-Math.PI / 2, DIGITS);
  });
 });

 describe('slerpAngle', () => {
  it('delegates to lerpAngle', () => {
   // slerpAngle is implemented as lerpAngle for 2D
   const from = 0;
   const to = Math.PI / 2;
   const t = 0.5;
   const slerp = slerpAngle(from, to, t);
   const lerp = lerpAngle(from, to, t);
   expect(slerp).toBe(lerp);
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

 describe('springAngle', () => {
  it('returns new angle and velocity', () => {
   const result = springAngle(0, Math.PI / 2, 0, 0.1, 0.9, 0.016);
   expect(result).toHaveProperty('angle');
   expect(result).toHaveProperty('velocity');
  });

  it('moves towards target', () => {
   const result = springAngle(0, Math.PI / 2, 0, 0.5, 0.5, 0.1);
   expect(result.angle).toBeGreaterThan(0);
   expect(result.velocity).toBeGreaterThan(0);
  });

  it('applies damping', () => {
   // High velocity should be damped
   const result = springAngle(0, 0, 10, 0, 0.9, 0.1);
   expect(Math.abs(result.velocity)).toBeLessThan(10);
  });

  it('uses shortest path', () => {
   // From 0 to 3*PI/2, should move in negative direction
   const result = springAngle(0, (3 * Math.PI) / 2, 0, 0.5, 0.5, 0.1);
   expect(result.velocity).toBeLessThan(0);
  });

  it('normalizes output angle', () => {
   const result = springAngle(Math.PI, -Math.PI, 0, 0.1, 0.9, 0.016);
   expect(result.angle).toBeGreaterThanOrEqual(-Math.PI);
   expect(result.angle).toBeLessThanOrEqual(Math.PI);
  });

  it('handles zero stiffness', () => {
   const result = springAngle(0, Math.PI, 1, 0, 0, 0.1);
   // With no stiffness and no damping, velocity continues
   expect(result.velocity).toBeCloseTo(1, DIGITS);
  });
 });
});
