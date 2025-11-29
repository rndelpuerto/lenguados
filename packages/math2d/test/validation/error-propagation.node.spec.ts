import { afterEach, describe, expect, it } from '@jest/globals';

import { ErrorPropagation, type ErrorBounds } from '../../src/validation/error-propagation';
import {
 ValidationMode,
 resetValidationConfig,
 withValidationConfig,
} from '../../src/validation/validation-mode';

const baseError = (absolute: number, relative: number): ErrorBounds => ({ absolute, relative });

describe('ErrorPropagation', () => {
 afterEach(() => {
  resetValidationConfig();
 });

 it('add combines absolute error and max relative', () => {
  const result = ErrorPropagation.add(baseError(0.01, 0.1), baseError(0.02, 0.05));
  expect(result.absolute).toBeCloseTo(0.03);
  expect(result.relative).toBeCloseTo(0.1);
 });

 it('subtract detects catastrophic cancellation', () => {
  const first = baseError(1e-6, 1e-5);
  const second = baseError(1e-6, 1e-5);
  const result = ErrorPropagation.subtract(first, second, 1000.001, 1000);
  expect(result.absolute).toBeCloseTo(2e-6);
  expect(result.relative).toBeGreaterThan(0.001);
 });

 it('multiply propagates absolute and relative errors', () => {
  const result = ErrorPropagation.multiply(baseError(0.1, 0.01), baseError(0.2, 0.02), 2, 3);
  expect(result.absolute).toBeCloseTo(Math.abs(3) * 0.1 + Math.abs(2) * 0.2);
  expect(result.relative).toBeCloseTo(0.03);
 });

 it('divide handles numerator and denominator contributions', () => {
  const result = ErrorPropagation.divide(baseError(0.1, 0.01), baseError(0.2, 0.02), 4, 2);
  expect(result.absolute).toBeCloseTo(0.1 / 2 + (4 * 0.2) / 4);
  expect(result.relative).toBeCloseTo(0.03);
 });

 it('divide remains finite when denominator is zero', () => {
  const result = ErrorPropagation.divide(baseError(0.1, 0.01), baseError(0.2, 0.02), 4, 0);
  expect(Number.isFinite(result.absolute)).toBe(true);
  expect(result.relative).toBeCloseTo(0.03);
 });

 it('sqrt halves relative error and scales absolute error', () => {
  const original = baseError(0.04, 0.02);
  const result = ErrorPropagation.sqrt(original, 4);
  expect(result.absolute).toBeCloseTo(0.04 / (2 * Math.sqrt(4)));
  expect(result.relative).toBeCloseTo(0.01);
 });

 it('sincos copies absolute error and clamps relative to absolute', () => {
  const source = baseError(0.05, 0.5);
  const result = ErrorPropagation.sincos(source);
  expect(result.absolute).toBeCloseTo(0.05);
  expect(result.relative).toBeCloseTo(0.05);
 });

 it('fromUlps scales with machine epsilon', () => {
  const result = ErrorPropagation.fromUlps(10, 2);
  expect(result.absolute).toBeCloseTo(Math.abs(10) * Number.EPSILON * 2);
  expect(result.relative).toBeCloseTo(Number.EPSILON * 2);
 });

 it('combine accumulates absolute error and max relative', () => {
  const result = ErrorPropagation.combine(
   baseError(0.1, 0.01),
   baseError(0.2, 0.02),
   baseError(0.3, 0.03),
  );
  expect(result.absolute).toBeCloseTo(0.6);
  expect(result.relative).toBeCloseTo(0.03);
 });

 it('isAcceptable determines thresholds', () => {
  expect(ErrorPropagation.isAcceptable(baseError(1e-12, 1e-12))).toBe(true);
  expect(ErrorPropagation.isAcceptable(baseError(1e-8, 1e-12), 1e-9)).toBe(false);
 });

 it('sanitizes invalid inputs using validation config', () => {
  const unsafe = baseError(Number.NaN, -1);
  const result = withValidationConfig({ mode: ValidationMode.SAFE }, () =>
   ErrorPropagation.add(unsafe, baseError(0.01, 0.01)),
  );
  expect(result.absolute).toBeCloseTo(0.01);
  expect(result.relative).toBeCloseTo(0.01);
 });

 it('format returns human readable string', () => {
  const text = ErrorPropagation.format(baseError(1e-4, 0.25));
  expect(text).toContain('±');
  expect(text).toContain('%');
 });
});
