import { afterEach, describe, expect, it } from '@jest/globals';

import {
 NumericalValidationError,
 NumericalValidator,
} from '../../src/validation/numerical-validator';
import {
 ValidationMode,
 resetValidationConfig,
 withValidationConfig,
} from '../../src/validation/validation-mode';

const SAFE_CONFIG = { mode: ValidationMode.SAFE } as const;
const STRICT_CONFIG = { mode: ValidationMode.STRICT } as const;
const WARN_CONFIG = { mode: ValidationMode.WARN } as const;

describe('NumericalValidator', () => {
 afterEach(() => {
  resetValidationConfig();
 });

 it('validateFinite returns safe fallback in SAFE mode', () => {
  const result = withValidationConfig(SAFE_CONFIG, () =>
   NumericalValidator.validateFinite(Number.POSITIVE_INFINITY, 'x'),
  );
  expect(result).toBe(0);
 });

 it('validateFinite throws in STRICT mode', () => {
  expect(() =>
   withValidationConfig(STRICT_CONFIG, () =>
    NumericalValidator.validateFinite(Number.POSITIVE_INFINITY, 'x'),
   ),
  ).toThrow(NumericalValidationError);
 });

 it('validateRange clamps value in SAFE mode', () => {
  const value = withValidationConfig(SAFE_CONFIG, () =>
   NumericalValidator.validateRange(10, -1, 1, 'angle'),
  );
  expect(value).toBe(1);
 });

 it('validateRange logs warning in WARN mode', () => {
  const warnings: string[] = [];
  const logger = (message: string): void => {
   warnings.push(message);
  };
  withValidationConfig({ ...WARN_CONFIG, logger }, () => {
   const value = NumericalValidator.validateRange(5, -2, 2, 'value');
   expect(value).toBe(5);
  });
  expect(warnings).toHaveLength(1);
  expect(warnings[0]).toContain('value');
 });

 it('sanitize uses fallback when NaN', () => {
  const result = withValidationConfig(SAFE_CONFIG, () =>
   NumericalValidator.sanitize(Number.NaN, 42, 0, 100),
  );
  expect(result).toBe(42);
 });

 it('validateVector2 checks both components', () => {
  const result = withValidationConfig(SAFE_CONFIG, () =>
   NumericalValidator.validateVector2(1, NaN),
  );
  expect(result.x).toBe(1);
  expect(result.y).toBe(0);
 });

 it('assertNearEquals throws when outside tolerance', () => {
  expect(() => NumericalValidator.assertNearEquals(0, 1, 1e-6)).toThrow(NumericalValidationError);
 });
});
